/*
 * Oráculo de Lemúria — rastreamento de tráfego e atribuição de leads.
 *
 * Faz três coisas:
 *  1. Guarda a origem da visita (UTM / fbclid) por 30 dias — first touch.
 *  2. Injeta um código curto de origem em toda mensagem de WhatsApp do site,
 *     para que cada lead que chega diga de qual anúncio ele veio.
 *  3. Dispara os eventos do Pixel do Meta que importam para otimização.
 *
 * Para ativar o Pixel, basta preencher PIXEL_ID abaixo. Sem ID, o arquivo
 * continua funcionando: a atribuição por WhatsApp não depende do Pixel.
 */
(function () {
  "use strict";

  // ⬇️ COLE AQUI O ID DO PIXEL DO META (só números). Vazio = Pixel desligado.
  var PIXEL_ID = "";

  var STORAGE_KEY = "ol_attrib";
  var MAX_AGE_DAYS = 30;

  /* ---------------------------------------------------------------- origem */

  function readStored() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      var ageDays = (Date.now() - parsed.ts) / 86400000;
      if (ageDays > MAX_AGE_DAYS) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function store(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (error) {
      /* navegador em modo privado ou storage bloqueado: segue sem persistir */
    }
  }

  function slug(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24);
  }

  function readFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var source = params.get("utm_source");
    var medium = params.get("utm_medium");
    var campaign = params.get("utm_campaign");
    var content = params.get("utm_content");

    if (source || campaign || content) {
      return {
        ts: Date.now(),
        ref: [source, medium, campaign, content].filter(Boolean).map(slug).join("-"),
        source: source || "",
        medium: medium || "",
        campaign: campaign || "",
        content: content || "",
      };
    }

    // Clique de anúncio do Meta sem UTM: ainda dá para saber que veio de anúncio.
    if (params.get("fbclid")) {
      return { ts: Date.now(), ref: "meta-ads-sem-utm", source: "meta", medium: "ads" };
    }

    // Origem orgânica: registra de onde veio o clique.
    var referrer = document.referrer || "";
    if (referrer && referrer.indexOf(window.location.host) === -1) {
      try {
        return { ts: Date.now(), ref: "organico-" + slug(new URL(referrer).hostname.replace(/^www\./, "")) };
      } catch (error) {
        /* referrer malformado: cai no direto */
      }
    }

    return { ts: Date.now(), ref: "direto" };
  }

  // First touch vence: quem veio de um anúncio e voltou depois continua
  // creditado ao anúncio, que foi o que realmente pagou pelo lead.
  var attribution = readStored();
  var fresh = readFromUrl();
  if (!attribution || (attribution.ref === "direto" && fresh.ref !== "direto")) {
    attribution = fresh;
    store(attribution);
  }

  /* ------------------------------------------------- atribuição no WhatsApp */

  function tagMessage(text) {
    if (!text || text.indexOf("[ref:") !== -1) return text;
    return text + "\n\n[ref: " + attribution.ref + "]";
  }

  // Reescreve o texto de qualquer link wa.me no momento do clique, sem precisar
  // alterar nenhuma das mensagens montadas pelo site.
  document.addEventListener(
    "click",
    function (event) {
      var link = event.target.closest && event.target.closest('a[href*="wa.me/"]');
      if (!link) return;

      try {
        var url = new URL(link.href);
        url.searchParams.set("text", tagMessage(url.searchParams.get("text") || ""));
        link.href = url.toString();
      } catch (error) {
        /* link fora do padrão: deixa passar sem tag em vez de quebrar o clique */
      }

      track("InitiateCheckout", { content_name: "contato-whatsapp" });
    },
    true
  );

  /* ------------------------------------------------------------ Pixel Meta */

  function track(event, params) {
    if (typeof window.fbq !== "function") return;
    window.fbq("track", event, params || {});
  }

  if (PIXEL_ID) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  /* ------------------------------------------------------------- eventos */

  function watchPlansSection() {
    var section = document.getElementById("assinaturas");
    if (!section || typeof IntersectionObserver !== "function") return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          track("ViewContent", { content_name: "planos-de-assinatura", content_type: "product_group" });
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
  }

  document.addEventListener("click", function (event) {
    var planButton = event.target.closest && event.target.closest("[data-plan]");
    if (planButton) {
      track("Lead", { content_name: "plano-" + planButton.getAttribute("data-plan") });
      return;
    }

    var addButton = event.target.closest && event.target.closest("[data-add]");
    if (addButton) {
      track("AddToCart", { content_name: addButton.getAttribute("data-add") });
    }
  });

  /* --------------------------------------------- correspondencia de mensagem */

  // Quem clica num anuncio do Circulo precisa cair numa pagina que fala do
  // Circulo. Promessa do anuncio diferente da promessa da pagina e o motivo
  // mais comum de trafego pago caro que nao converte.
  function matchMessageToCampaign() {
    if ((attribution.campaign || "").indexOf("circulo") === -1) return;

    var title = document.getElementById("hero-title");
    var copy = document.querySelector(".hero-copy");
    var primary = document.querySelector(".hero-actions .button.primary");

    if (title) title.textContent = "Orientação espiritual toda semana, não só quando aperta.";
    if (copy) {
      copy.textContent =
        "O Círculo de Lemúria é o plano de assinatura do Oráculo: leitura coletiva toda semana, " +
        "carta do dia e mesa radiônica mensal por R$ 27.";
    }
    if (primary) {
      primary.textContent = "Conhecer o Círculo";
      primary.setAttribute("href", "#assinaturas");
    }
  }

  function onReady() {
    matchMessageToCampaign();
    watchPlansSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  // Exposto para depuração: no console, OL_TRACK.ref mostra a origem gravada.
  window.OL_TRACK = { ref: attribution.ref, attribution: attribution, track: track };
})();
