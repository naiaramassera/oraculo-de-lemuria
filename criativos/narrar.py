# -*- coding: utf-8 -*-
"""
Narração dos criativos do Círculo com edge-tts (vozes neurais da Microsoft).

Gratuito e sem chave de API — é o caminho de voz que funciona mesmo com os
créditos da OpenAI zerados.

Uso:
    python narrar.py            # gera as três narrações
    python narrar.py circulo-a  # gera só uma

Depois, para juntar com o vídeo (o gerador ajusta a duração das cenas ao áudio):
    python gerar_video.py circulo-a narracao-circulo-a.mp3

Requisito: pip install edge-tts
"""
import asyncio
import sys
from pathlib import Path

import edge_tts

BASE = Path(__file__).parent

# Francisca é a voz pt-BR com a prosódia mais confiável para texto corrido.
# Rate negativo e pitch levemente grave dão o tom acolhedor do Oráculo.
VOICE = "pt-BR-FranciscaNeural"
RATE = "-8%"
PITCH = "-2Hz"

# Números escritos em palavras de propósito: "R$ 27" sai errado no TTS.
TEXTS = {
    "circulo-a": (
        "Você já perguntou a mesma coisa pro tarot três vezes? "
        "Não é que a resposta não veio. É que a vida continua andando, "
        "e duas semanas depois a dúvida volta. "
        "Foi por isso que eu criei o Círculo de Lemúria: "
        "toda semana uma leitura nova, gravada. "
        "Vinte e sete reais por mês. Link no perfil."
    ),
    "circulo-b": (
        "Uma consulta de tarot custa noventa e sete reais. "
        "Você faz, sai leve, e daqui um mês precisa de novo. "
        "No Círculo de Lemúria você paga vinte e sete reais no mês inteiro "
        "e recebe uma leitura toda semana. "
        "Menos de um real por dia. Link no perfil."
    ),
    "circulo-c": (
        "Tem decisão que ninguém pode tomar por você. "
        "Mas ninguém precisa atravessar sozinha. "
        "O Círculo de Lemúria é um grupo de mulheres que recebem a mesma "
        "leitura toda semana e caminham juntas. "
        "Não é promessa de resposta pronta. É companhia pro caminho. "
        "Vinte e sete reais por mês."
    ),
}


async def gerar(nome: str) -> Path:
    destino = BASE / f"narracao-{nome}.mp3"
    tts = edge_tts.Communicate(TEXTS[nome], VOICE, rate=RATE, pitch=PITCH)
    await tts.save(str(destino))
    return destino


async def main() -> None:
    nomes = sys.argv[1:] or list(TEXTS)
    for nome in nomes:
        if nome not in TEXTS:
            print(f"Desconhecido: {nome}. Opções: {', '.join(TEXTS)}")
            continue
        destino = await gerar(nome)
        print(f"{destino.name} — {destino.stat().st_size // 1024} KB")


if __name__ == "__main__":
    asyncio.run(main())
