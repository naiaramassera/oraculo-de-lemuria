"""
Bot IA para Oráculos de Lemúria.

Variáveis de ambiente:
  ANTHROPIC_API_KEY       → usa Claude (recomendado)
  OPENAI_API_KEY          → fallback OpenAI
  ANTHROPIC_MODEL         → padrão: claude-haiku-4-5-20251001
  OPENAI_MODEL            → padrão: gpt-4o-mini
  ORACULOS_LINK_SITE      → link do site usado nas respostas automáticas (padrão: vercel)
"""
from __future__ import annotations

import json
import logging
import os
import re
import sqlite3
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Você é a assistente do *Oráculo de Lemúria*, projeto de Naiara Massera, e conversa com pessoas pelo WhatsApp.

Como o atendimento funciona (não invente nada fora disso):
- Todas as terapias são 100% online e feitas à distância, para o Brasil e o exterior.
- Toda leitura e harmonização é entregue por VÍDEO GRAVADO enviado no WhatsApp; a pessoa não precisa estar conectada na hora.
- Não existe videochamada, ligação, sessão ao vivo nem atendimento presencial.
- A confirmação do pedido acontece em até 24 horas úteis.
- Pagamento por Pix, cartão ou link de pagamento, confirmado na conversa.

Leituras avulsas:
- Tarot Direto (R$ 97): uma pergunta objetiva, vídeo de cerca de 20 min.
- Mapa de Caminhos (R$ 177): leitura completa de amor, trabalho ou decisão importante, cerca de 60 min.
- Leitura da Alma, Registros Akáshicos (R$ 247): padrões repetidos, contratos, dons e aprendizados.
- Vínculos e Contratos, Registros Akáshicos (R$ 222): relações, ciclos familiares e acordos espirituais.
- Harmonização Pessoal, Mesa Radiônica (R$ 197): campo energético, interferências, prosperidade.
- Casa e Ambiente, Mesa Radiônica (R$ 277): casa, negócio ou local de trabalho.

Planos mensais (cancela quando quiser, sem multa):
- Círculo de Lemúria (R$ 27/mês): leitura coletiva semanal, carta do dia, mesa radiônica coletiva mensal e grupo no WhatsApp.
- Essencial (R$ 67/mês): o Círculo + 1 tiragem individual gravada por mês + 1 pergunta extra por texto.
- Premium (R$ 167/mês): o Essencial + 2 leituras individuais por mês + mesa radiônica a cada 3 meses + prioridade.
- VIP (R$ 397/mês, poucas vagas): o Premium + 1 leitura akáshica mensal + mesa radiônica mensal + até 3 perguntas por semana no WhatsApp.
- Plano anual: 10 mensalidades (2 meses grátis).

Como conduzir a conversa:
- Acolha primeiro. Se a pessoa não perguntou o preço, pergunte o que está pedindo clareza na vida dela antes de oferecer algo.
- Indique UMA opção que combine com o que ela contou e explique em uma frase por que ela combina.
- Para quem está em dúvida ou com orçamento curto, o Tarot Direto ou o Círculo de Lemúria são as portas de entrada.
- Quando a pessoa quiser fechar, diga que a Naiara vai confirmar o pedido e enviar o pagamento por aqui. Nunca invente links, chaves Pix ou prazos de entrega.
- Mensagens que terminam com [ref: ...] trazem a origem do anúncio. Use isso só para entender o contexto e nunca comente o código com a pessoa.

Limites:
- Não faça previsões definitivas sobre saúde, dinheiro, gravidez, processos ou relacionamentos, e não prometa resultados.
- Leituras espirituais não substituem acompanhamento médico, psicológico, jurídico ou financeiro. Se a pessoa falar em crise, risco à vida ou violência, acolha e indique ajuda profissional (CVV: 188).
- Sobre terceiros, respeite consentimento e privacidade.

Responda em português do Brasil, com calor humano e sem exagero místico, em no máximo 3 parágrafos curtos, no tom do WhatsApp."""

_DB_PATH = Path(os.environ.get("DB_PATH", "/tmp/oraculos.db"))


def _get_db() -> sqlite3.Connection:
    _DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(_DB_PATH))
    conn.execute("""
        CREATE TABLE IF NOT EXISTS conversas (
            telefone TEXT PRIMARY KEY,
            nome TEXT DEFAULT '',
            historico TEXT DEFAULT '[]',
            atualizado_em TEXT
        )
    """)
    conn.commit()
    return conn


def _carregar_historico(telefone: str) -> tuple[str, list[dict]]:
    with _get_db() as conn:
        row = conn.execute(
            "SELECT nome, historico FROM conversas WHERE telefone = ?", (telefone,)
        ).fetchone()
    if row:
        return row[0], json.loads(row[1])
    return "", []


def _salvar_historico(telefone: str, nome: str, historico: list[dict]) -> None:
    if len(historico) > 20:
        historico = historico[-20:]
    with _get_db() as conn:
        conn.execute("""
            INSERT INTO conversas (telefone, nome, historico, atualizado_em)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(telefone) DO UPDATE SET
                nome = CASE WHEN excluded.nome != '' THEN excluded.nome ELSE nome END,
                historico = excluded.historico,
                atualizado_em = excluded.atualizado_em
        """, (telefone, nome, json.dumps(historico, ensure_ascii=False), datetime.utcnow().isoformat()))


def _chamar_anthropic(historico: list[dict]) -> str:
    api_key = os.environ["ANTHROPIC_API_KEY"]
    payload = {
        "model": os.environ.get("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001"),
        "max_tokens": 400,
        "system": SYSTEM_PROMPT,
        "messages": historico,
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["content"][0]["text"].strip()


def _chamar_openai(historico: list[dict]) -> str:
    api_key = os.environ["OPENAI_API_KEY"]
    payload = {
        "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + historico,
        "max_tokens": 400,
        "temperature": 0.7,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def _fallback(texto: str) -> str:
    """Respostas sem IA: usadas quando não há chave de API ou a chamada falhou."""
    t = texto.lower()
    site = os.environ.get("ORACULOS_LINK_SITE", "https://oraculo-de-lemuria.vercel.app")

    if any(p in t for p in ("preço", "preco", "valor", "quanto custa", "quanto é", "quanto e")):
        return (
            "Os valores ficam todos no site, sem surpresa 🌙\n\n"
            "• Tarot Direto (1 pergunta): R$ 97\n"
            "• Mapa de Caminhos (leitura completa): R$ 177\n"
            "• Registros Akáshicos: a partir de R$ 222\n"
            "• Mesa Radiônica: a partir de R$ 197\n"
            "• Círculo de Lemúria (assinatura): R$ 27/mês\n\n"
            f"Tudo é entregue em vídeo gravado aqui no WhatsApp. Detalhes: {site}"
        )
    if any(p in t for p in ("círculo", "circulo", "assinatura", "plano", "mensal")):
        return (
            "O Círculo de Lemúria custa R$ 27/mês: leitura coletiva toda semana, carta do dia, "
            "mesa radiônica coletiva 1x por mês e grupo fechado no WhatsApp. ✨\n\n"
            "Você pode cancelar quando quiser, sem multa. Quer que eu te passe como entrar?"
        )
    if any(p in t for p in ("tarot", "carta", "tiragem")):
        return (
            "O tarot aqui é uma leitura de clareza, não de destino fechado. 🌙\n\n"
            "Para uma pergunta objetiva, o Tarot Direto (R$ 97). Para olhar o tema com calma, "
            "o Mapa de Caminhos (R$ 177). Os dois chegam em vídeo gravado no WhatsApp.\n\n"
            "Me conta: o que está pedindo clareza na sua vida agora?"
        )
    if any(p in t for p in ("akash", "alma", "padrão", "padrao", "contrato")):
        return (
            "Os Registros Akáshicos olham padrões que se repetem, contratos e aprendizados da alma. ✨\n\n"
            "Leitura da Alma: R$ 247 • Vínculos e Contratos: R$ 222. Entrega em vídeo gravado.\n\n"
            "Qual padrão você sente que mais se repete hoje?"
        )
    if any(p in t for p in ("radiôn", "radion", "mesa", "energia", "casa", "ambiente")):
        return (
            "A Mesa Radiônica é um trabalho de harmonização energética feito à distância. 🌿\n\n"
            "Harmonização Pessoal: R$ 197 • Casa e Ambiente: R$ 277. Você recebe o retorno em vídeo.\n\n"
            "É para você ou para algum ambiente?"
        )
    return (
        "Olá! Que bom ter você aqui no *Oráculo de Lemúria* 🌸\n\n"
        "Faço leituras de tarot, registros akáshicos e mesas radiônicas, todas entregues em vídeo "
        "gravado aqui no WhatsApp.\n\n"
        "Me conta: o que está pedindo clareza na sua vida agora?"
    )


def processar_mensagem(telefone: str, texto: str, nome: str = "") -> str:
    tel = re.sub(r"\D", "", str(telefone or ""))
    nome_salvo, historico = _carregar_historico(tel)
    nome_final = nome or nome_salvo

    historico.append({"role": "user", "content": texto})

    try:
        if os.environ.get("ANTHROPIC_API_KEY"):
            resposta = _chamar_anthropic(historico)
        elif os.environ.get("OPENAI_API_KEY"):
            resposta = _chamar_openai(historico)
        else:
            resposta = _fallback(texto)
    except Exception as exc:
        logger.error("Erro IA Oráculos: %s", exc)
        resposta = _fallback(texto)

    historico.append({"role": "assistant", "content": resposta})
    _salvar_historico(tel, nome_final, historico)
    return resposta
