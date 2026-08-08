const services = [
  {
    id: "tarot-direto",
    category: "tarot",
    type: "Tarot",
    title: "Tarot Direto",
    description:
      "Uma pergunta objetiva com leitura clara sobre energia atual, conselho e tendência dos próximos passos.",
    duration: "20 min",
    delivery: "Vídeo gravado",
    price: 97,
    featured: false,
  },
  {
    id: "tarot-profundo",
    category: "tarot",
    type: "Tarot",
    title: "Mapa de Caminhos",
    description:
      "Leitura completa para amor, trabalho ou decisão importante, com bloqueios, oportunidades e orientação.",
    duration: "60 min",
    delivery: "Vídeo gravado",
    price: 177,
    featured: true,
  },
  {
    id: "akashico-alma",
    category: "akashico",
    type: "Registros Akáshicos",
    title: "Leitura da Alma",
    description:
      "Acesso aos registros para investigar padrões repetidos, contratos energéticos, dons e aprendizados atuais.",
    duration: "75 min",
    delivery: "Vídeo gravado",
    price: 247,
    featured: true,
  },
  {
    id: "akashico-relacoes",
    category: "akashico",
    type: "Registros Akáshicos",
    title: "Vínculos e Contratos",
    description:
      "Leitura focada em relações, acordos espirituais, ciclos familiares e caminhos de liberação consciente.",
    duration: "70 min",
    delivery: "Vídeo gravado",
    price: 222,
    featured: false,
  },
  {
    id: "radionica-pessoal",
    category: "radionica",
    type: "Mesa Radiônica",
    title: "Harmonização Pessoal",
    description:
      "Mesa para equilibrar campo energético, limpar interferências e fortalecer intenções de prosperidade e bem-estar.",
    duration: "48h de trabalho",
    delivery: "Vídeo gravado",
    price: 197,
    featured: false,
  },
  {
    id: "radionica-ambiente",
    category: "radionica",
    type: "Mesa Radiônica",
    title: "Casa e Ambiente",
    description:
      "Harmonização energética de ambientes, negócios ou locais de trabalho com foco em fluidez e proteção.",
    duration: "72h de trabalho",
    delivery: "Vídeo gravado",
    price: 277,
    featured: false,
  },
];

const subscriptionPlans = [
  {
    id: "circulo",
    name: "Círculo de Lemúria",
    price: 27,
    annual: 270,
    featured: false,
    description: "Porta de entrada coletiva para quem quer orientação toda semana.",
    benefits: [
      "Leitura coletiva semanal gravada em vídeo",
      "Carta do dia automática todos os dias",
      "Mesa radiônica coletiva 1x por mês",
      "Grupo fechado no WhatsApp",
    ],
  },
  {
    id: "essencial",
    name: "Essencial",
    price: 67,
    annual: 670,
    featured: false,
    description: "Para quem quer o coletivo mais uma leitura só sua todo mês.",
    benefits: [
      "Tudo do Círculo de Lemúria",
      "1 tiragem individual gravada em vídeo (1 pergunta)",
      "1 pergunta extra por texto no mês",
      "Envio por WhatsApp ou e-mail",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 167,
    annual: 1670,
    featured: true,
    description: "Plano principal, com acompanhamento individual contínuo.",
    benefits: [
      "Tudo do Essencial",
      "2 leituras individuais gravadas por mês",
      "Mesa radiônica de harmonização a cada 3 meses",
      "Tiragens inteligentes ilimitadas e prioridade na agenda",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    price: 397,
    annual: 3970,
    badge: "Apenas 10 vagas",
    featured: false,
    description: "Acompanhamento profundo com akáshicos e mesa radiônica todo mês.",
    benefits: [
      "Tudo do Premium",
      "1 leitura akáshica mensal gravada em vídeo",
      "Mesa radiônica de harmonização mensal",
      "WhatsApp direto: até 3 perguntas por semana, em dias úteis",
    ],
  },
];

const tarotDeck = [
  {
    name: "A Sacerdotisa",
    meaning: "intuição, silêncio interno e respostas que chegam quando a mente desacelera",
    advice: "escute sinais sutis antes de agir",
    shadow: "evite confundir silêncio com ausência de resposta",
  },
  {
    name: "O Sol",
    meaning: "clareza, vitalidade e abertura de caminhos depois de um período de dúvida",
    advice: "assuma uma postura mais visível e confiante",
    shadow: "não force alegria para encobrir o que ainda precisa ser cuidado",
  },
  {
    name: "A Estrela",
    meaning: "cura, confiança no futuro e reconexão com uma esperança realista",
    advice: "alimente o que devolve leveza ao seu campo",
    shadow: "não entregue sua direção apenas à espera",
  },
  {
    name: "A Justiça",
    meaning: "decisões conscientes, acordos, limites e consequências que pedem maturidade",
    advice: "organize fatos antes de escolher",
    shadow: "cuidado com rigidez, culpa ou cobrança excessiva",
  },
  {
    name: "O Eremita",
    meaning: "recolhimento, sabedoria e necessidade de maturar uma resposta sem pressa",
    advice: "diminua ruídos externos e observe o essencial",
    shadow: "não transforme introspecção em isolamento",
  },
  {
    name: "A Roda da Fortuna",
    meaning: "mudança de ciclo, movimento inesperado e oportunidade de adaptação",
    advice: "não se agarre ao formato antigo do caminho",
    shadow: "evite decidir apenas pelo impulso do momento",
  },
  {
    name: "A Temperança",
    meaning: "equilíbrio, cura gradual, conversa paciente e integração de opostos",
    advice: "faça ajustes pequenos e constantes",
    shadow: "não adie indefinidamente uma escolha necessária",
  },
  {
    name: "O Julgamento",
    meaning: "despertar, revisão de escolhas e chamado para encerrar pendências",
    advice: "responda ao que sua consciência já sabe",
    shadow: "não fique preso à autocobrança pelo passado",
  },
  {
    name: "A Imperatriz",
    meaning: "fertilidade, criação, autoestima e capacidade de nutrir projetos ou relações",
    advice: "cuide do que você deseja ver crescer",
    shadow: "não confunda entrega com excesso de disponibilidade",
  },
  {
    name: "O Mago",
    meaning: "início, comunicação, ação consciente e uso dos recursos disponíveis",
    advice: "comece com o que já está nas suas mãos",
    shadow: "evite prometer mais do que consegue sustentar",
  },
  {
    name: "A Força",
    meaning: "coragem serena, domínio emocional e poder que não precisa se impor",
    advice: "aja com firmeza sem perder ternura",
    shadow: "não engula sentimentos para parecer forte",
  },
  {
    name: "O Mundo",
    meaning: "fechamento de ciclo, realização e integração de aprendizados importantes",
    advice: "reconheça o que já foi concluído",
    shadow: "não permaneça em uma etapa apenas por costume",
  },
];

const siteConfig = {
  instagramHandle: "oraculosdelemuria",
  whatsappNumber: "5531993031068",
  marketplaceUrl: "",
  directCheckoutUrl: "",
};

const guideQuestions = [
  {
    topic: "Momento atual",
    question: "O que mais precisa de clareza agora?",
    options: [
      { label: "Uma decisão objetiva", scores: { "tarot-profundo": 3, "tarot-direto": 2 } },
      { label: "Um padrão que se repete", scores: { "akashico-alma": 3, "akashico-relacoes": 1 } },
      { label: "Uma energia pesada ou travada", scores: { "radionica-pessoal": 3, "radionica-ambiente": 1 } },
      { label: "A energia da casa ou trabalho", scores: { "radionica-ambiente": 3, "radionica-pessoal": 1 } },
    ],
  },
  {
    topic: "Tema principal",
    question: "Qual área está chamando mais atenção?",
    options: [
      { label: "Amor ou relacionamento", scores: { "akashico-relacoes": 3, "tarot-profundo": 2 } },
      { label: "Trabalho, dinheiro ou prosperidade", scores: { "tarot-profundo": 2, "radionica-pessoal": 2 } },
      { label: "Caminho espiritual", scores: { "akashico-alma": 3, "tarot-profundo": 1 } },
      { label: "Ambiente, negócio ou família", scores: { "radionica-ambiente": 3, "akashico-relacoes": 1 } },
    ],
  },
  {
    topic: "Profundidade",
    question: "Que tipo de resposta você procura?",
    options: [
      { label: "Direta e prática", scores: { "tarot-direto": 3, "tarot-profundo": 1 } },
      { label: "Completa, com próximos passos", scores: { "tarot-profundo": 3, "akashico-alma": 1 } },
      { label: "Profunda, sobre origem espiritual", scores: { "akashico-alma": 3, "akashico-relacoes": 2 } },
      { label: "Energética, com harmonização", scores: { "radionica-pessoal": 3, "radionica-ambiente": 2 } },
    ],
  },
  {
    topic: "Urgência",
    question: "Como você quer iniciar esse cuidado?",
    options: [
      { label: "Quero uma orientação inicial", scores: { "tarot-direto": 3, "tarot-profundo": 1 } },
      { label: "Quero olhar o tema com calma", scores: { "tarot-profundo": 3, "akashico-alma": 1 } },
      { label: "Quero liberar um vínculo ou padrão", scores: { "akashico-relacoes": 3, "akashico-alma": 2 } },
      { label: "Quero equilibrar minha energia", scores: { "radionica-pessoal": 3, "radionica-ambiente": 1 } },
    ],
  },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const state = {
  filter: "todos",
  cart: [],
  selectedPlan: "",
  guideIndex: 0,
  guideScores: {},
  guideAnswers: [],
};

const subscriptionGrid = document.querySelector("#subscriptionGrid");
const smartOracleForm = document.querySelector("#smartOracleForm");
const oracleResult = document.querySelector("#oracleResult");
const serviceGrid = document.querySelector("#serviceGrid");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const orderForm = document.querySelector("#orderForm");
const resultMessage = document.querySelector("#resultMessage");
const header = document.querySelector(".site-header");
const orderSection = document.querySelector("#pedido");
const guideStep = document.querySelector("#guideStep");
const guideTopic = document.querySelector("#guideTopic");
const guideMeter = document.querySelector("#guideMeter");
const guideQuestion = document.querySelector("#guideQuestion");
const guideOptions = document.querySelector("#guideOptions");
const guideResult = document.querySelector("#guideResult");

const requiredElements = {
  subscriptionGrid,
  smartOracleForm,
  oracleResult,
  serviceGrid,
  cartItems,
  cartTotal,
  orderForm,
  resultMessage,
  header,
  orderSection,
  guideStep,
  guideTopic,
  guideMeter,
  guideQuestion,
  guideOptions,
  guideResult,
};

function getMissingElements() {
  return Object.entries(requiredElements)
    .filter(([, element]) => !element)
    .map(([name]) => name);
}

function renderSubscriptions() {
  subscriptionGrid.innerHTML = subscriptionPlans
    .map(
      (plan) => `
        <article class="subscription-card" data-featured="${plan.featured}">
          <div>
            <span class="service-kicker">Plano mensal</span>
            ${plan.badge ? `<span class="subscription-badge">${plan.badge}</span>` : ""}
            <h3>${plan.name}</h3>
            <p>${plan.description}</p>
            <div class="subscription-price">
              <strong>${currency.format(plan.price)}</strong>
              <span>/mês</span>
            </div>
            ${
              plan.annual
                ? `<p class="subscription-annual">ou ${currency.format(
                    plan.annual
                  )} no plano anual — 2 meses grátis</p>`
                : ""
            }
            <ul>
              ${plan.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
            </ul>
          </div>
          <button class="add-button" type="button" data-plan="${plan.id}">Escolher plano</button>
        </article>
      `
    )
    .join("");
}

function selectPlan(id) {
  const plan = subscriptionPlans.find((item) => item.id === id);
  if (!plan) return;

  state.selectedPlan = plan.name;
  const planSelect = orderForm.elements.assinatura;
  if (planSelect) {
    const expectedValue = `Plano ${plan.name} mensal`;
    const option = Array.from(planSelect.options).find((item) => item.textContent === expectedValue);
    if (option) planSelect.value = option.textContent;
  }

  orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderServices() {
  const visibleServices =
    state.filter === "todos"
      ? services
      : services.filter((service) => service.category === state.filter);

  serviceGrid.innerHTML = visibleServices
    .map(
      (service) => `
        <article class="service-card" data-featured="${service.featured}">
          <div>
            <span class="service-kicker">${service.type}</span>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-meta">
              <span>${service.duration}</span>
              <span>${service.delivery}</span>
            </div>
          </div>
          <div class="service-footer">
            <strong class="price">${currency.format(service.price)}</strong>
            <button class="add-button" type="button" data-add="${service.id}">Adicionar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItems.innerHTML = '<span class="empty-cart">Nenhum serviço adicionado ainda.</span>';
    cartTotal.textContent = currency.format(0);
    return;
  }

  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <span>${item.title}</span>
          <strong>${currency.format(item.price)}</strong>
          <button type="button" aria-label="Remover ${item.title}" data-remove="${item.id}">x</button>
        </div>
      `
    )
    .join("");

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = currency.format(total);
}

function addToCart(id) {
  const service = services.find((item) => item.id === id);
  if (!service || state.cart.some((item) => item.id === id)) return;
  state.cart.push(service);
  renderCart();
  orderSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  renderCart();
}

function getGuideWinner() {
  const ranked = Object.entries(state.guideScores).sort((a, b) => b[1] - a[1]);
  const winnerId = ranked[0]?.[0] || "tarot-profundo";
  return services.find((service) => service.id === winnerId) || services[1];
}

function buildGuideMessage(service) {
  return [
    "Olá, vim pelo guia do site Oráculo de Lemúria.",
    `Meu resultado indicado foi: ${service.title}.`,
    "",
    "Respostas do guia:",
    ...state.guideAnswers.map((answer, index) => `${index + 1}. ${answer}`),
    "",
    "Quero saber como iniciar esse atendimento.",
  ].join("\n");
}

function renderGuideQuestion() {
  if (!guideQuestion || !guideOptions) return;

  const current = guideQuestions[state.guideIndex];
  const progress = ((state.guideIndex + 1) / guideQuestions.length) * 100;

  guideResult.hidden = true;
  guideStep.textContent = `Pergunta ${state.guideIndex + 1} de ${guideQuestions.length}`;
  guideTopic.textContent = current.topic;
  guideMeter.style.width = `${progress}%`;
  guideQuestion.textContent = current.question;
  guideOptions.innerHTML = current.options
    .map((option, index) => `<button type="button" data-guide-option="${index}">${option.label}</button>`)
    .join("");
}

function renderGuideResult() {
  const service = getGuideWinner();
  const message = buildGuideMessage(service);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`
    : "";
  const instagramUrl = `https://ig.me/m/${siteConfig.instagramHandle}`;

  guideOptions.innerHTML = "";
  guideStep.textContent = "Resultado";
  guideTopic.textContent = service.type;
  guideMeter.style.width = "100%";
  guideQuestion.textContent = "Atendimento recomendado";
  guideResult.hidden = false;
  guideResult.innerHTML = `
    <span class="service-kicker">${service.type}</span>
    <h4>${service.title}</h4>
    <p>${service.description}</p>
    <div class="guide-result-meta">
      <span>${service.duration}</span>
      <strong>${currency.format(service.price)}</strong>
    </div>
    <textarea class="guide-summary" readonly>${message}</textarea>
    <div class="guide-actions">
      <button type="button" data-guide-add="${service.id}">Adicionar ao pedido</button>
      <button type="button" data-guide-copy>Copiar mensagem</button>
      ${
        whatsappUrl
          ? `<a href="${whatsappUrl}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>`
          : `<span class="disabled-action">WhatsApp oficial em configuração</span>`
      }
      <a href="${instagramUrl}" target="_blank" rel="noopener">Abrir Instagram</a>
      <button type="button" data-guide-restart>Refazer guia</button>
    </div>
  `;
}

function restartGuide() {
  state.guideIndex = 0;
  state.guideScores = {};
  state.guideAnswers = [];
  renderGuideQuestion();
}

function answerGuide(optionIndex) {
  const current = guideQuestions[state.guideIndex];
  const option = current.options[optionIndex];
  if (!option) return;

  state.guideAnswers.push(`${current.question} ${option.label}`);
  Object.entries(option.scores).forEach(([serviceId, score]) => {
    state.guideScores[serviceId] = (state.guideScores[serviceId] || 0) + score;
  });

  if (state.guideIndex + 1 >= guideQuestions.length) {
    renderGuideResult();
    return;
  }

  state.guideIndex += 1;
  renderGuideQuestion();
}

function getSpreadLabels(spread) {
  const labels = {
    daily: ["Mensagem central"],
    three: ["Passado", "Presente", "Futuro"],
    cross: ["Clareza", "Bloqueio", "Caminho"],
    love: ["Energia do vínculo", "Bloqueio", "Conselho"],
    work: ["Caminho atual", "Oportunidade", "Ação prática"],
  };

  return labels[spread] || labels.daily;
}

function drawCards(question, spread) {
  const labels = getSpreadLabels(spread);
  let seed = Array.from(`${question}-${spread}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const availableCards = [...tarotDeck];

  return labels.map((label) => {
    seed = (seed * 9301 + 49297) % 233280;
    const index = seed % availableCards.length;
    const card = availableCards.splice(index, 1)[0];
    return { label, ...card };
  });
}

function getThemeLens(theme) {
  const lenses = {
    autoconhecimento: "o olhar se volta para consciência, escolhas internas e padrões emocionais",
    amor: "o foco está em vínculo, reciprocidade, limites e maturidade afetiva",
    trabalho: "o campo mostra decisões práticas, prosperidade, direção e uso de talentos",
    energia: "a leitura observa vitalidade, proteção, excesso de carga e reorganização do campo pessoal",
    espiritualidade: "a mensagem toca propósito, aprendizado da alma e escuta espiritual responsável",
  };

  return lenses[theme] || lenses.autoconhecimento;
}

function getIntegrationPractice(theme) {
  const practices = {
    autoconhecimento: "escreva três verdades que você já percebe, mas ainda evita assumir",
    amor: "observe onde existe troca real e onde existe apenas expectativa",
    trabalho: "liste uma ação concreta que pode ser feita nas próximas 24 horas",
    energia: "faça uma pausa de respiração, banho consciente ou organização do ambiente",
    espiritualidade: "registre sonhos, sinais e repetições sem tomar decisões apressadas",
  };

  return practices[theme] || practices.autoconhecimento;
}

function getToneClosing(tone) {
  const closings = {
    direto: "A orientação é simples: escolha o que aumenta clareza e diminui desgaste.",
    terapeutico: "Respeite seu tempo interno, mas não abandone a responsabilidade pela próxima escolha.",
    mistico: "O símbolo abre uma porta, mas quem atravessa com consciência é você.",
    poetico: "A resposta não chega como ordem; chega como luz apontando o próximo passo.",
  };

  return closings[tone] || closings.terapeutico;
}

function buildOracleReading(question, spread, tone, theme, cards) {
  const mainCard = cards[0];
  const positionReadings = cards.map(
    (card) =>
      `<li><strong>${card.label} - ${card.name}:</strong> esta posição fala de ${card.meaning}. Como orientação, ${card.advice}. Como cuidado, ${card.shadow}.</li>`
  );

  return {
    title: `Leitura para ${question}`,
    summary: `A carta que sustenta a leitura é ${mainCard.name}. Dentro deste tema, ${getThemeLens(
      theme
    )}. A mensagem central pede presença, discernimento e uma escolha que respeite sua energia atual.`,
    positions: positionReadings.join(""),
    practice: `Prática de integração: ${getIntegrationPractice(theme)}.`,
    closing: getToneClosing(tone),
  };
}

function buildOraclePlainText(question, cards, reading) {
  return [
    "Oráculo Personalizado - Oráculo de Lemúria",
    "",
    `Pergunta: ${question}`,
    "",
    "Cartas:",
    ...cards.map((card) => `- ${card.label}: ${card.name}`),
    "",
    reading.summary,
    ...cards.map(
      (card) => `${card.label} - ${card.name}: ${card.meaning}. Orientação: ${card.advice}. Cuidado: ${card.shadow}.`
    ),
    reading.practice,
    reading.closing,
  ].join("\n");
}

function renderOracleReading(question, spread, tone, theme) {
  const cards = drawCards(question, spread);
  const reading = buildOracleReading(question, spread, tone, theme, cards);
  const plainText = buildOraclePlainText(question, cards, reading);
  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(plainText)}`
    : "";

  oracleResult.hidden = false;
  oracleResult.innerHTML = `
    <span class="service-kicker">Oráculo Personalizado</span>
    <h3>Leitura aberta</h3>
    <div class="oracle-cards">
      ${cards
        .map(
          (card) => `
            <div class="oracle-card">
              <span>${card.label}</span>
              <strong>${card.name}</strong>
            </div>
          `
        )
        .join("")}
    </div>
    <p>${reading.summary}</p>
    <ul class="oracle-reading-list">${reading.positions}</ul>
    <p><strong>${reading.practice}</strong></p>
    <p>${reading.closing}</p>
    <div class="oracle-actions">
      <button type="button" data-oracle-copy>Copiar leitura</button>
      ${whatsappUrl ? `<a href="${whatsappUrl}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>` : ""}
    </div>
    <textarea class="oracle-summary" readonly>${plainText}</textarea>
  `;
}

function updateHeader() {
  header.dataset.scrolled = window.scrollY > 18 ? "true" : "false";
}

function init() {
  const missingElements = getMissingElements();

  if (missingElements.length > 0) {
    console.error(`Elementos obrigatórios não encontrados: ${missingElements.join(", ")}`);
    return;
  }

  subscriptionGrid.addEventListener("click", (event) => {
    const planButton = event.target.closest("[data-plan]");
    if (planButton) selectPlan(planButton.dataset.plan);
  });

  smartOracleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(smartOracleForm);
    renderOracleReading(
      String(data.get("question") || "").trim(),
      data.get("spread"),
      data.get("tone"),
      data.get("theme")
    );
  });

  oracleResult.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-oracle-copy]");
    if (!copyButton) return;

    const summary = oracleResult.querySelector(".oracle-summary")?.value || "";
    try {
      await navigator.clipboard.writeText(summary);
      copyButton.textContent = "Leitura copiada";
    } catch {
      copyButton.textContent = "Selecione e copie o texto";
    }
  });

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".filter-button.active")?.classList.remove("active");
      button.classList.add("active");
      state.filter = button.dataset.filter;
      renderServices();
    });
  });

  serviceGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) addToCart(addButton.dataset.add);
  });

  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) removeFromCart(removeButton.dataset.remove);
  });

  guideOptions.addEventListener("click", (event) => {
    const optionButton = event.target.closest("[data-guide-option]");
    if (optionButton) answerGuide(Number(optionButton.dataset.guideOption));
  });

  guideResult.addEventListener("click", async (event) => {
    const addButton = event.target.closest("[data-guide-add]");
    const copyButton = event.target.closest("[data-guide-copy]");
    const restartButton = event.target.closest("[data-guide-restart]");

    if (addButton) {
      addToCart(addButton.dataset.guideAdd);
      return;
    }

    if (restartButton) {
      restartGuide();
      return;
    }

    if (!copyButton) return;

    const summary = guideResult.querySelector(".guide-summary")?.value || "";
    try {
      await navigator.clipboard.writeText(summary);
      copyButton.textContent = "Mensagem copiada";
    } catch {
      copyButton.textContent = "Selecione e copie o texto";
    }
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(orderForm);
    const subscription = String(data.get("assinatura") || "Sem assinatura agora");

    if (state.cart.length === 0 && subscription === "Sem assinatura agora") {
      resultMessage.hidden = false;
      resultMessage.textContent = "Adicione pelo menos um serviço ou escolha um plano antes de gerar a mensagem.";
      return;
    }

    const selected =
      state.cart.length > 0
        ? state.cart.map((item) => `- ${item.title}: ${currency.format(item.price)}`).join("\n")
        : "- Nenhum serviço avulso selecionado";
    const total = currency.format(state.cart.reduce((sum, item) => sum + item.price, 0));
    const selectedPlan = subscriptionPlans.find((plan) => subscription.includes(plan.name));
    const subscriptionPrice = selectedPlan ? `${currency.format(selectedPlan.price)}/mês` : "Sem mensalidade selecionada";
    const messageParts = [
      "Olá, quero finalizar meu pedido no Oráculo de Lemúria.",
      "",
      `Nome: ${data.get("nome")}`,
      `WhatsApp para receber o vídeo: ${data.get("whatsapp")}`,
      `E-mail: ${data.get("email")}`,
      `Forma de entrega: ${data.get("entrega")}`,
      `Urgência: ${data.get("urgencia")}`,
      `Pagamento preferido: ${data.get("pagamento")}`,
      `Assinatura: ${subscription}`,
      "",
      "Serviços:",
      selected,
      `Total avulso: ${total}`,
      `Mensalidade: ${subscriptionPrice}`,
      "",
      `Tema principal: ${data.get("tema")}`,
    ];

    const plainMessage = messageParts.join("\n");
    const encodedMessage = encodeURIComponent(plainMessage);
    const whatsappUrl = siteConfig.whatsappNumber
      ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`
      : "";
    const instagramUrl = `https://ig.me/m/${siteConfig.instagramHandle}`;
    const marketplaceUrl = siteConfig.marketplaceUrl || "";
    const directCheckoutUrl = siteConfig.directCheckoutUrl
      ? `${siteConfig.directCheckoutUrl}${siteConfig.directCheckoutUrl.includes("?") ? "&" : "?"}pedido=${encodedMessage}`
      : "";

    resultMessage.hidden = false;
    resultMessage.innerHTML = `
      <strong>Pedido pronto.</strong> Copie o resumo abaixo e envie pelo canal escolhido.
      <textarea class="order-summary" readonly>${plainMessage}</textarea>
      <div class="result-actions">
        <button class="copy-order" type="button" data-copy-order>Copiar pedido</button>
        ${
          whatsappUrl
            ? `<a href="${whatsappUrl}" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>`
            : `<span class="disabled-action">WhatsApp oficial em configuração</span>`
        }
        <a href="${instagramUrl}" target="_blank" rel="noopener">Abrir Instagram</a>
        ${marketplaceUrl ? `<a href="${marketplaceUrl}" target="_blank" rel="noopener">Comprar no Mercado Livre</a>` : ""}
        ${directCheckoutUrl ? `<a href="${directCheckoutUrl}" target="_blank" rel="noopener">Finalizar no site</a>` : ""}
      </div>
    `;
  });

  resultMessage.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-order]");
    if (!copyButton) return;

    const summary = resultMessage.querySelector(".order-summary")?.value || "";
    try {
      await navigator.clipboard.writeText(summary);
      copyButton.textContent = "Pedido copiado";
    } catch {
      copyButton.textContent = "Selecione e copie o texto";
    }
  });

  window.addEventListener("scroll", updateHeader, { passive: true });

  renderSubscriptions();
  renderServices();
  renderCart();
  renderGuideQuestion();
  updateHeader();
}

init();
