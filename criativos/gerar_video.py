# -*- coding: utf-8 -*-
"""
Gerador automático de criativos 9:16 (1080x1920) do Oráculo de Lemúria.

Uso:
    python gerar_video.py anuncio-a
    python gerar_video.py anuncio-c
    python gerar_video.py anuncio-a narracao-a.mp3   (mescla o áudio e ajusta a duração)
    python gerar_video.py energia-semana "A Roda da Fortuna|Algo muda de ciclo: solte o formato antigo" \
        "A Temperança|Ajustes pequenos e constantes, sem impulso" \
        "A Estrela|Alimente o que devolve leveza ao seu campo" [narracao.mp3]

Saída: criativos/saida/<nome>.mp4 pronto para Reels/Stories/anúncio.
Requisitos: Chrome instalado + `pip install imageio-ffmpeg`.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
BASE = Path(__file__).parent
OUT = BASE / "saida"
FPS = 30

PAGE = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ width:1080px; height:1920px; overflow:hidden; position:relative;
         background: radial-gradient(120% 90% at 50% 12%, #10505a 0%, #093c43 38%, #041e24 78%, #020f13 100%);
         font-family:'Cormorant Garamond', Georgia, serif; color:#f3e9d2; }}
  .stars span {{ position:absolute; border-radius:50%; background:#f3e9d2; opacity:.75; }}
  .glow {{ position:absolute; left:50%; top:16%; transform:translate(-50%,-50%); width:640px; height:640px;
          border-radius:50%; background:radial-gradient(circle, rgba(212,175,55,.32) 0%, rgba(212,175,55,0) 65%); }}
  .moon {{ position:absolute; left:50%; top:15%; transform:translateX(-50%); font-size:120px; }}
  .content {{ position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center;
             align-items:center; text-align:center; padding:0 90px; gap:48px; }}
  h1 {{ font-size:104px; line-height:1.12; font-weight:700; text-shadow:0 4px 40px rgba(0,0,0,.55); }}
  h1 em {{ font-style:italic; color:#e9c46a; }}
  .sub {{ font-family:'Inter', Arial, sans-serif; font-size:44px; font-weight:500; color:#cfe3df;
         line-height:1.45; max-width:820px; }}
  .price {{ font-family:'Inter', Arial, sans-serif; font-size:58px; font-weight:600; color:#041e24;
           background:linear-gradient(135deg,#e9c46a,#d4af37); padding:34px 66px; border-radius:999px;
           box-shadow:0 10px 60px rgba(212,175,55,.45); }}
  .brand {{ position:absolute; bottom:120px; left:0; right:0; text-align:center;
           font-family:'Inter', Arial, sans-serif; font-size:34px; letter-spacing:.24em;
           text-transform:uppercase; color:rgba(243,233,210,.72); }}
  .cards {{ display:flex; gap:36px; justify-content:center; }}
  .card {{ width:210px; height:340px; border-radius:22px; border:3px solid rgba(212,175,55,.85);
          background: linear-gradient(160deg,#0d4650 0%, #072e35 100%);
          box-shadow:0 18px 70px rgba(0,0,0,.6), inset 0 0 60px rgba(212,175,55,.14);
          display:flex; align-items:center; justify-content:center; font-size:96px;
          transform:rotate({tilt}deg); }}
  .card:nth-child(2) {{ transform:rotate(0deg) translateY(-26px); }}
  .card:nth-child(3) {{ transform:rotate(6deg); }}
</style></head><body>
  <div class="glow"></div>
  <div class="stars">{stars}</div>
  {body}
  <div class="brand">Oráculo de Lemúria</div>
</body></html>"""

STARS = "".join(
    f'<span style="left:{(i * 137) % 1080}px; top:{(i * 271) % 1780}px; '
    f'width:{2 + (i * 7) % 5}px; height:{2 + (i * 7) % 5}px; opacity:{0.25 + ((i * 13) % 60) / 100};"></span>'
    for i in range(70)
)


def scene(title, sub=None, price=None, moon=None, cards=False):
    parts = []
    if moon:
        parts.append(f'<div class="moon">{moon}</div>')
    inner = [f"<h1>{title}</h1>"]
    if cards:
        inner.insert(0, '<div class="cards"><div class="card">🌙</div><div class="card">☀️</div><div class="card">⭐</div></div>')
    if sub:
        inner.append(f'<div class="sub">{sub}</div>')
    if price:
        inner.append(f'<div class="price">{price}</div>')
    parts.append(f'<div class="content">{"".join(inner)}</div>')
    return "".join(parts)


SPECS = {
    "anuncio-a": [
        {"dur": 3.6, "html": scene("Existe uma pergunta que <em>não sai</em> da sua cabeça?", moon="🌙")},
        {"dur": 3.6, "html": scene("O tarot <em>responde</em>.", cards=True)},
        {"dur": 4.4, "html": scene("Você pergunta.<br>Eu envio sua leitura.",
                                   sub="Áudio exclusivo + foto da carta + frase canalizada<br>no seu WhatsApp em até 24h")},
        {"dur": 4.4, "html": scene("Leitura <em>Flash</em>", sub="Toque em Enviar mensagem e faça sua pergunta",
                                   price="R$ 9,90", moon="🔮")},
    ],
    "anuncio-c": [
        {"dur": 3.6, "html": scene("Por menos que <em>um café</em> ☕")},
        {"dur": 3.6, "html": scene("Uma leitura de tarot <em>só sua</em>", cards=True)},
        {"dur": 4.4, "html": scene("Uma pausa para <em>se escutar</em>",
                                   sub="Áudio + carta + frase canalizada<br>no seu WhatsApp em até 24h")},
        {"dur": 4.4, "html": scene("Leitura <em>Flash</em>", sub="Toque em Enviar mensagem e peça a sua",
                                   price="R$ 9,90", moon="🌙")},
    ],
    # --- Círculo de Lemúria (assinatura R$ 27/mês) — ver criativos-campanha.md
    "circulo-a": [
        {"dur": 3.4, "html": scene("Você já perguntou a <em>mesma coisa</em> três vezes?", moon="🌙")},
        {"dur": 4.0, "html": scene("Não é que a resposta <em>não veio</em>.",
                                   sub="É que a vida continua andando<br>e duas semanas depois a dúvida volta")},
        {"dur": 4.4, "html": scene("Toda semana uma leitura <em>nova</em>", cards=True)},
        {"dur": 4.6, "html": scene("Círculo de <em>Lemúria</em>",
                                   sub="Leitura coletiva toda semana + carta do dia<br>+ mesa radiônica mensal",
                                   price="R$ 27/mês", moon="🔮")},
    ],
    "circulo-b": [
        {"dur": 3.4, "html": scene("Uma consulta de tarot custa <em>R$ 97</em>.")},
        {"dur": 3.8, "html": scene("E daqui um mês<br>você precisa <em>de novo</em>.", moon="🌙")},
        {"dur": 4.4, "html": scene("No Círculo você paga <em>R$ 27</em><br>no mês inteiro", cards=True)},
        {"dur": 4.6, "html": scene("Menos de <em>R$ 1</em> por dia",
                                   sub="Uma leitura toda semana.<br>Cancele quando quiser.",
                                   price="R$ 27/mês", moon="🔮")},
    ],
    "circulo-c": [
        {"dur": 3.6, "html": scene("Tem decisão que <em>ninguém</em> toma por você.", moon="🌙")},
        {"dur": 3.8, "html": scene("Mas ninguém precisa atravessar <em>sozinha</em>.")},
        {"dur": 4.4, "html": scene("Um grupo de mulheres<br>caminhando <em>junto</em>", cards=True)},
        {"dur": 4.6, "html": scene("Círculo de <em>Lemúria</em>",
                                   sub="Não é promessa de resposta pronta.<br>É companhia pro caminho.",
                                   price="R$ 27/mês", moon="🔮")},
    ],
}


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"Comando falhou: {' '.join(map(str, cmd))}\n{r.stderr[-2000:]}")
    return r


def audio_duration(path):
    r = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    for line in r.stderr.splitlines():
        if "Duration:" in line:
            h, m, s = line.split("Duration:")[1].split(",")[0].strip().split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"Não consegui ler a duração de {path}")


CARD_ICONS = ["🌙", "☀️", "⭐"]


def build_energia_semana(cartas):
    """cartas: lista de 3 strings 'Nome da Carta|conselho curto'."""
    scenes = [{"dur": 3.4, "html": scene("Tirei 3 cartas para a energia da <em>sua</em> semana", cards=True)}]
    for i, carta in enumerate(cartas):
        nome, _, conselho = carta.partition("|")
        scenes.append({"dur": 4.6, "html": scene(f"<em>{nome.strip()}</em>",
                                                 sub=conselho.strip() or None,
                                                 moon=CARD_ICONS[i % 3])})
    scenes.append({"dur": 4.6, "html": scene("Quer uma leitura <em>só sua</em>?",
                                             sub="Leitura Flash: áudio + carta no seu WhatsApp em 24h",
                                             price="R$ 9,90", moon="🔮")})
    return scenes


def main():
    if len(sys.argv) < 2 or (sys.argv[1] not in SPECS and sys.argv[1] != "energia-semana"):
        print(f"Uso: python gerar_video.py [{'|'.join(SPECS)}|energia-semana] [args] [narracao.mp3]")
        sys.exit(1)

    name = sys.argv[1]
    if name == "energia-semana":
        cartas = [a for a in sys.argv[2:] if "|" in a]
        extras = [a for a in sys.argv[2:] if "|" not in a]
        if len(cartas) != 3:
            print('energia-semana precisa de 3 argumentos "Nome da Carta|conselho"')
            sys.exit(1)
        scenes = build_energia_semana(cartas)
        audio = Path(extras[0]) if extras else None
    else:
        audio = Path(sys.argv[2]) if len(sys.argv) > 2 else None
        scenes = [dict(s) for s in SPECS[name]]

    if audio:
        if not audio.is_absolute():
            audio = BASE / audio
        total = sum(s["dur"] for s in scenes)
        factor = (audio_duration(audio) + 0.6) / total
        for s in scenes:
            s["dur"] = round(s["dur"] * factor, 2)

    OUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(dir=BASE) as tmp:
        tmp = Path(tmp)
        clips = []
        for i, s in enumerate(scenes):
            html = tmp / f"cena{i}.html"
            html.write_text(PAGE.format(body=s["html"], stars=STARS, tilt=-6), encoding="utf-8")
            png = tmp / f"cena{i}.png"
            run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                 "--window-size=1080,1920", "--screenshot=" + str(png),
                 "--virtual-time-budget=4000", html.as_uri()])
            clip = tmp / f"cena{i}.mp4"
            frames = int(s["dur"] * FPS)
            fade_out = s["dur"] - 0.45
            run([FFMPEG, "-y", "-loop", "1", "-framerate", str(FPS), "-i", str(png),
                 "-t", str(s["dur"]),
                 "-vf",
                 f"scale=1296:2304,zoompan=z='1+0.06*on/{frames}':d={frames}:x='(iw-iw/zoom)/2'"
                 f":y='(ih-ih/zoom)/2':s=1080x1920:fps={FPS},"
                 f"fade=t=in:st=0:d=0.45,fade=t=out:st={fade_out:.2f}:d=0.45",
                 "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", str(clip)])
            clips.append(clip)

        concat = tmp / "lista.txt"
        concat.write_text("".join(f"file '{c.as_posix()}'\n" for c in clips), encoding="utf-8")
        final = OUT / f"{name}.mp4"
        if audio:
            run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat),
                 "-i", str(audio), "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
                 "-shortest", str(final)])
        else:
            run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat),
                 "-c", "copy", str(final)])

    dur = sum(s["dur"] for s in scenes)
    print(json.dumps({"video": str(final), "duracao_s": round(dur, 1),
                      "audio": str(audio) if audio else "sem áudio (adicionar narração ou música)"},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
