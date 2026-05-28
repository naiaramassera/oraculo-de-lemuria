# Oraculo de Lemuria

Site estatico para apresentar e vender leituras de tarot, registros akashicos e mesas radionicas.

## Como visualizar

Abra `index.html` no navegador ou rode um servidor local:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:8080/
```

## Configuracoes importantes

Edite `script.js`:

```js
const siteConfig = {
  instagramHandle: "oraculosdelemuria",
  whatsappNumber: "",
  marketplaceUrl: "",
  directCheckoutUrl: "",
};
```

- `instagramHandle`: usuario do Instagram sem `@`.
- `whatsappNumber`: numero oficial do projeto em formato internacional, somente numeros. Exemplo: `5511999999999`. Enquanto estiver vazio, o site mostra que o WhatsApp oficial esta em configuracao.
- `marketplaceUrl`: link do Mercado Livre ou outro marketplace, quando existir.
- `directCheckoutUrl`: link de checkout proprio, quando existir.

Fluxo comercial atual:

- Nao ha videochamada, ligacao ou sessao ao vivo.
- Todas as leituras e harmonizacoes sao entregues por video gravado enviado pelo WhatsApp.
- O formulario coleta o WhatsApp do cliente para entrega.

## Antes de publicar

1. Confirmar precos, nomes dos servicos e prazos em `script.js`.
2. Colocar o link real de marketplace ou checkout, se houver.
3. Revisar depoimentos antes de usar publicamente.
4. Definir dominio e preencher o campo `url` no JSON-LD dentro de `index.html`.
5. Testar o pedido completo em desktop e celular.

## Publicar na Vercel

Opcao mais simples pelo painel:

1. Acesse `https://vercel.com`.
2. Crie uma conta ou entre com GitHub, Google ou e-mail.
3. Clique em `Add New...` e depois `Project`.
4. Envie/conecte este projeto.
5. Em `Framework Preset`, escolha `Other`.
6. Deixe `Build Command` vazio.
7. Deixe `Output Directory` vazio ou como raiz do projeto.
8. Clique em `Deploy`.

Depois da publicacao, a Vercel gera uma URL gratuita parecida com:

```text
https://oraculo-de-lemuria.vercel.app
```

Quando tiver a URL final, coloque esse endereco no campo `url` do JSON-LD em `index.html`.

## Arquivos

- `index.html`: estrutura da pagina.
- `styles.css`: visual responsivo.
- `script.js`: catalogo, carrinho e geracao do pedido.
- `assets/hero-oraculos-lemuria.png`: imagem principal do site.
- `vercel.json`: configuracao para deploy estatico na Vercel.
