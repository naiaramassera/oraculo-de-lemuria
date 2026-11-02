"""Backend Flask para Oráculos de Lemúria — webhook WhatsApp."""
from __future__ import annotations

import hmac
import os
from flask import Flask, request, jsonify

app = Flask(__name__)


def _extrair_mensagem(payload: dict) -> tuple[str, str, str] | None:
    """Extrai (telefone, texto, nome) do payload da Evolution API."""
    # Evolution API — data pode ser dict ou list
    data = payload.get("data", {})
    if isinstance(data, list):
        data = data[0] if data else {}

    key = data.get("key", {}) or {}
    remote_jid = key.get("remoteJid", "")
    # Mensagens enviadas pelo próprio número (inclusive as do bot) e mensagens de
    # grupo não devem ser respondidas: sem isso o bot pode responder a si mesmo
    # em loop ou falar dentro do grupo do Círculo.
    if key.get("fromMe") or not remote_jid.endswith("@s.whatsapp.net"):
        return None

    msg = data.get("message", {}) or {}
    texto = msg.get("conversation") or msg.get("extendedTextMessage", {}).get("text", "")
    telefone = remote_jid.replace("@s.whatsapp.net", "")
    nome = data.get("pushName", "")

    if not telefone or not texto:
        return None
    return telefone, texto.strip(), nome


@app.route("/webhook/whatsapp", methods=["POST"])
def webhook():
    from api.bot import processar_mensagem
    from api.whatsapp import enviar_mensagem

    # Sem segredo qualquer pessoa pode chamar o webhook e fazer o bot gastar
    # créditos de IA e mandar mensagens. Configure WEBHOOK_SECRET na Vercel e use
    # https://SEU-SITE/webhook/whatsapp?token=SEGREDO na Evolution API.
    segredo = os.environ.get("WEBHOOK_SECRET", "")
    if segredo:
        recebido = request.args.get("token") or request.headers.get("X-Webhook-Token", "")
        if not hmac.compare_digest(recebido, segredo):
            return jsonify({"ok": False}), 401

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
