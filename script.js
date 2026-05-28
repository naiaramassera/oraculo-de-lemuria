const services = [
  {
    id: "tarot-direto",
    category: "tarot",
    type: "Tarot",
    title: "Tarot Direto",
    description:
      "Uma pergunta objetiva com leitura clara sobre energia atual, conselho e tendencia dos proximos passos.",
    duration: "20 min",
    delivery: "Audio ou texto",
    price: 77,
    featured: false,
  },
  {
    id: "tarot-profundo",
    category: "tarot",
    type: "Tarot",
    title: "Mapa de Caminhos",
    description:
      "Leitura completa para amor, trabalho ou decisao importante, com bloqueios, oportunidades e orientacao.",
    duration: "60 min",
    delivery: "Chamada ou PDF",
    price: 177,
    featured: true,
  },
  {
    id: "akashico-alma",
    category: "akashico",
    type: "Registros Akashicos",
    title: "Leitura da Alma",
    description:
      "Acesso aos registros para investigar padroes repetidos, contratos energeticos, dons e aprendizados atuais.",
    duration: "75 min",
    delivery: "Chamada gravada",
    price: 247,
    featured: true,
  },
  {
    id: "akashico-relacoes",
    category: "akashico",
    type: "Registros Akashicos",
    title: "Vinculos e Contratos",
    description:
      "Leitura focada em relacoes, acordos espirituais, ciclos familiares e caminhos de liberacao consciente.",
    duration: "70 min",
    delivery: "Chamada ou PDF",
    price: 222,
    featured: false,
  },
  {
    id: "radionica-pessoal",
    category: "radionica",
    type: "Mesa Radionica",
    title: "Harmonizacao Pessoal",
    description:
      "Mesa para equilibrar campo energetico, limpar interferencias e fortalecer intencoes de prosperidade e bem-estar.",
    duration: "48h de trabalho",
    delivery: "Relatorio final",
    price: 197,
    featured: false,
  },
  {
    id: "radionica-ambiente",
    category: "radionica",
    type: "Mesa Radionica",
    title: "Casa e Ambiente",
    description:
      "Harmonizacao energetica de ambientes, negocios ou locais de trabalho com foco em fluidez e protecao.",
    duration: "72h de trabalho",
    delivery: "Relatorio final",
    price: 277,
    featured: false,
  },
];

const siteConfig = {
  instagramHandle: "oraculosdelemuria",
  marketplaceUrl: "",
  directCheckoutUrl: "",
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const state = {
  filter: "todos",
  cart: [],
};

const serviceGrid = document.querySelector("#serviceGrid");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const orderForm = document.querySelector("#orderForm");
const resultMessage = document.querySelector("#resultMessage");
const header = document.querySelector(".site-header");

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
    cartItems.innerHTML = '<span class="empty-cart">Nenhum servico adicionado ainda.</span>';
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
  document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  renderCart();
}

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

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.cart.length === 0) {
    resultMessage.hidden = false;
    resultMessage.textContent = "Adicione pelo menos um servico antes de gerar a mensagem.";
    return;
  }

  const data = new FormData(orderForm);
  const selected = state.cart.map((item) => `- ${item.title}: ${currency.format(item.price)}`).join("\n");
  const total = currency.format(state.cart.reduce((sum, item) => sum + item.price, 0));
  const messageParts = [
    "Ola, quero finalizar meu pedido no Oraculo de Lemuria.",
    "",
    `Nome: ${data.get("nome")}`,
    `Telefone: ${data.get("telefone")}`,
    `E-mail: ${data.get("email")}`,
    `Formato preferido: ${data.get("formato")}`,
    `Melhor periodo: ${data.get("periodo")}`,
    `Pagamento preferido: ${data.get("pagamento")}`,
    "",
    "Servicos:",
    selected,
    `Total: ${total}`,
    "",
    `Tema principal: ${data.get("tema")}`,
  ];

  const plainMessage = messageParts.join("\n");
  const encodedMessage = encodeURIComponent(plainMessage);
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

function updateHeader() {
  header.dataset.scrolled = window.scrollY > 18 ? "true" : "false";
}

window.addEventListener("scroll", updateHeader, { passive: true });

renderServices();
renderCart();
updateHeader();
