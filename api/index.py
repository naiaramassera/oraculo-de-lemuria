"""Backend Flask para Oráculos de Lemúria — webhook WhatsApp."""
from __future__ import annotations

import os
from flask import Flask, request, jsonify

app = Flask(__name__)


def _extrair_mensagem(payload: dict) -> tuple[str, str, str] | None:
    """Extrai (telefone, texto, nome) do payload da Evolution API."""
    # Evolution API — data pode ser dict ou list
    data = payload.get("data", {})
    if isinstance(data, list):
        data = data[0] if data else {}

    msg = data.get("message", {})
    texto = msg.get("conversation") or msg.get("extendedTextMessage", {}).get("text", "")
    telefone = data.get("key", {}).get("remoteJid", "").replace("@s.whatsapp.net", "")
    nome = data.get("pushName", "")

    if not telefone or not texto:
        return None
    return telefone, texto.strip(), nome


@app.route("/webhook/whatsapp", methods=["POST"])
def webhook():
    from api.bot import processar_mensagem
    from api.whatsapp import enviar_mensagem

    payload = request.get_json(silent=True) or {}
    resultado = _extrair_mensagem(payload)
    if not resultado:
        return jsonify({"ok": True})

    telefone, texto, nome = resultado
    try:
        resposta = processar_mensagem(telefone, texto, nome)
        enviar_mensagem(telefone, resposta)
    except Exception as exc:
        app.logger.error("Erro webhook Oráculos: %s", exc)

    return jsonify({"ok": True})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "projeto": "Oráculos de Lemúria"})
