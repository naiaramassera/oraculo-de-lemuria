"""
Bot IA para Oráculos de Lemúria.

Variáveis de ambiente:
  ANTHROPIC_API_KEY       → usa Claude (recomendado)
  OPENAI_API_KEY          → fallback OpenAI
  ANTHROPIC_MODEL         → padrão: claude-haiku-4-5-20251001
  OPENAI_MODEL            → padrão: gpt-4o-mini
  ORACULOS_LINK_SESSAO    → link de pagamento para sessões
  ORACULOS_PRECO_SESSAO   → ex: "220"
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

SYSTEM_PROMPT = """Você é a assistente espiritual do projeto *Oráculos de Lemúria*, criado por Naiara Massera.

O projeto oferece:
- Sessões de Tarot Terapêutico (individuais, online ou presencial)
- Radiestesia com pêndulo (leitura energética, limpeza, alinhamento)

Seu papel:
- Acolher a pessoa com empatia e presença
- Explicar como funciona cada modalidade com clareza
- Tirar dúvidas sobre tarot, radiestesia e temas espirituais
- Convidar a pessoa a agendar uma sessão quando perceber abertura
- NUNCA fazer previsões definitivas sobre saúde, dinheiro ou relacionamentos como se fossem certezas
- NUNCA prometer resultados garantidos
- Responder sempre em português do Brasil, de forma calorosa e acolhedora

Quando a pessoa demonstrar interesse em sessão, informe o valor e envie o link de agendamento.
Mantenha as respostas curtas (máximo 4 parágrafos) para o formato WhatsApp."""

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
    t = texto.lower()
    preco = os.environ.get("ORACULOS_PRECO_SESSAO", "220")
    link = os.environ.get("ORACULOS_LINK_SESSAO", "")
    agendamento = f"Para agendar: {link}" if link else "Me chame para verificar disponibilidade!"

    if any(p in t for p in ("tarot", "carta", "tiragem")):
        return (
            "O Tarot Terapêutico é uma ferramenta de autoconhecimento que nos ajuda a olhar para "
            "questões da vida com mais clareza e consciência. 🌙\n\n"
            "Cada sessão é um espaço acolhedor de reflexão — não de adivinhação.\n\n"
            f"Sessões a partir de R$ {preco}. {agendamento}"
        )
    if any(p in t for p in ("radiestesia", "pendulo", "pêndulo", "energia")):
        return (
            "A Radiestesia trabalha com a percepção energética através do pêndulo. "
            "É uma prática ancestral usada para leitura de campos energéticos, "
            "limpeza e alinhamento. ✨\n\n"
            f"Sessões a partir de R$ {preco}. {agendamento}"
        )
    return (
        "Olá! Sou a assistente dos *Oráculos de Lemúria* 🌸\n\n"
        "Trabalhamos com Tarot Terapêutico e Radiestesia.\n\n"
        "Posso te contar mais sobre alguma dessas modalidades?"
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
