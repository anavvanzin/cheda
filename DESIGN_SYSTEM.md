# CHÊDA — Design System & Development Prompt

**Version 1.1 · July 2026 · Patrícia Chêda / Digital Press Kit**

> Este documento é dupla função:
> 1. **Referência de design** para humanos que forem editar o repositório
> 2. **Prompt de contexto** para qualquer AI agent continuar o desenvolvimento em sessões futuras sem precisar redescobrir decisões

---

## 0 · Contexto do projeto

**Artista**: Patrícia Chêda — DJ e seletora, radicada em Florianópolis, SC.
House Music e Techno, com pesquisa contínua e presença magnética de pista.

**Manifesto artístico** (voz da artista, preservar sem reescrever):
> "Uma apresentação que transforma **música em movimento** e movimento em unidade. No meu projeto de DJ, ofereço mais do que música: um encontro de vibrações, uma troca de energia. O que sentimos juntos não é apenas ritmo — é pulsação. Aqui, cada batida ecoa o pulsar da própria vida."

**Tagline curta**: *som que invoca · cada set é um ritual*

**Contato**:
- Email: `booking@patriciacheda.com`
- Instagram: [@patriciacheda_](https://www.instagram.com/patriciacheda_/)
- SoundCloud: [soundcloud.com/patriciacheda](https://soundcloud.com/patriciacheda)

**Deploy**:
- Repo: `github.com/anavvanzin/cheda` (público)
- Deploy canônico: projeto **`cheda` no Vercel**, conectado à branch `main`
- Pull requests/branches: Vercel Preview Deployment; `main`: Production Deployment
- Domínio canônico: **`https://patriciacheda.com`**
- GitHub Actions (`.github/workflows/ci.yml`) valida o build, mas não publica uma segunda produção

---

## 1 · Filosofia de design

O projeto tem um nome interno que resume a atitude: **"straightforward and impressive at the same time"**. Traduzindo em regras práticas:

- **Uma ideia dominante por tela.** Não empilhar hierarquias competindo.
- **Preto e vermelho, mas criativo.** Nunca cair em "cartaz de festa techno anos 2000". Elegância + peso, não força bruta.
- **Nome real acima de marca.** Ela é *Patrícia Chêda*. Uma vez tentamos "CHDX" como abreviação — foi rejeitado. O logotipo dela escreve **CHÊDA**, com Ê. Nunca CHDX.
- **Nada de dados inventados.** Setlists, títulos de faixas, minutagens — só existem se a usuária confirmou. Não preencher com placeholder plausível.
- **A landing é a porta, não o museu.** Cada tela tem uma ideia dominante e a sequência pública é inequívoca: identidade, artista, escuta, imagem e booking. A densidade técnica continua nas páginas de press kit/print.

### Anti-padrões (o que evitamos, aprendido de tentativas rejeitadas)

| Não fazer | Por quê |
|---|---|
| Oswald bold | Comprimido demais, "techno anos 2000" |
| Letter-spacing largo (`.14em+`) em display | Calibrado pra fontes comprimidas — no Montserrat vira "sparse and preachy" |
| Seções duplicadas ou sem função de decisão | Alongam a landing sem ajudar contratantes; cada bloco precisa responder a uma pergunta pública |
| Set cards inventados como placeholder | Parece profissional mas mente |
| Cross-fade genérico entre 3a e 3b | Chamamos de "morph" numa iteração; foi ok mas o **VHS tracking error seam** é a linguagem que se firmou |
| RGB-split simétrico como "glitch" | Vira aparência de screen-tear datamoshing, não VHS. VHS é *chroma lag assimétrico* (vermelho +6px direita, cyan -3px esquerda) |

---

## 2 · Design tokens

Locais canônicos: `styles/tokens.css` (import em todos os CSS).

### Palette

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0E0B0A` | Fundo principal, matte deep |
| `--paper` | `#F2EAD9` | Type primário, superfície light (rider/contact) |
| `--cream` | `#E9E0CE` | Corpo suavizado |
| `--blood` | `#B5221A` | Acento — eyebrow, dividers, spine, chroma lag VHS |
| `--gold` | `#C79A4B` | Bordas, acento secundário, borders decorativas |
| `--mute` | `#8a8174` | Texto secundário no ink |
| `--soft` | `#b5ab98` | Body copy em ink |
| `--line` | `#2a221c` | Rhythm lines, divisores sutis |
| `--edge` | `#4a423a` | Bordas de crop, marcos discretos |

**Uso obrigatório de custom properties.** Nunca hardcode hex fora do `tokens.css`.

### Typography

| Token | Fonte | Peso | Uso |
|---|---|---|---|
| `--display-font` | **Montserrat** | 500 (medium) por default | Wordmarks, títulos, kickers, eyebrows |
| `--serif-font` | **Cormorant Garamond** | 500 italic | Subtítulos poéticos, manifesto blockquote |
| `--body-font` | **Hanken Grotesk** | 400/500/700 | Corpo, bio, meta |
| `--display-weight` | `500` | | Peso padrão. Nunca 700+ (fica pesado demais) |

**Letter-spacing calibrado para Montserrat** (não Oswald):
- Display gigante: `.04em`
- Display médio (títulos de seção): `.05em`
- Kickers/eyebrows uppercase: `.22em`–`.42em` (conforme tamanho)

### Rhythm & motion

| Token | Valor | Uso |
|---|---|---|
| `--tA` | `-2deg` | Tilt "odd" — cards, crops, wobble bands |
| `--tB` | `1.6deg` | Tilt "even" |
| `--bleed-pad` | `clamp(24px, 4vw, 64px)` | Padding lateral de seção |
| `--section-pad` | `clamp(64px, 9vw, 144px)` | Padding vertical de seção |

**`prefers-reduced-motion:reduce` é honrado em todos os keyframes VHS e ring-pulse.**

### Logo

**Logotype CHÊDA** (sans, oficial). Arquivos em `assets/`:
- `logo-cheda-black.png` — CHÊDA preto sobre branco (original enviado pela artista)
- `logo-cheda-white.png` — inversão em cores sólidas
- `logo-cheda-black-alpha.png` — CHÊDA preto sobre transparente
- `logo-cheda-white-alpha.png` — CHÊDA **branco sobre transparente** ← usado no header (fundo dark)

Dimensões nativas: 246×65px. Sempre carregar com `width="246" height="65"` no `<img>` pra evitar layout shift, e escalar via `height:22px; width:auto` no CSS.

**Assinatura blackletter Patricia Chêda** (nova, adicionada 14 jul 2026). Arquivos em `assets/`:
- `logo-patricia-blackletter-black.png` — letras `--ink` sobre transparente (fundo claro)
- `logo-patricia-blackletter-white.png` — letras `--cream` sobre transparente (fundo escuro)
- `logo-patricia-blackletter-cream.png` — letras `--paper` sobre transparente (fundo escuro, alternativa levemente mais quente) ← usado no `<footer class="site-footer">`

Dimensões nativas: 993×224px, aspect-ratio ~4.4:1. Sempre carregar com `width="993" height="224"` no `<img>` e escalar via `max-width` no container pai.

**Uso**: o CHÊDA sans identifica marca/produto no header e A4 press. O blackletter Patricia Chêda é a **assinatura pessoal** — vive **só no rodapé da landing** (`/`), não entra nos A4 de imprensa. Função retorica: assinar o site como um objeto pessoal, não corporativo.

### Favicon & social preview (adicionado 14 jul 2026)

**Emblema do site**: o **P blackletter** isolado da assinatura Patricia Chêda. Escolhido em vez do CHÊDA sans porque a inicial gótica carrega o caráter autônomo do site (o sans já vive em todo lugar da landing; a inicial cria uma marca menor só pra aba/link preview).

Técnica de recorte: escaneia a assinatura completa por luminância, detecta o topo/base da faixa vertical do P (incluindo o descensor característico do gótico), e encontra a coluna horizontal de fim testando a **meia altura da letra** (evita cortar prematuramente no descensor fino). Resultado: um P completo com o pequeno losango interno preservado.

Composição: letras `--cream` sobre fundo sólido `--ink`, padding de 12% (8% pros tamanhos pequenos, pra letra respirar sem virar borrão em 16px).

Arquivos em `assets/favicon/`:

| Arquivo | Uso |
|---|---|
| `favicon.ico` | Multi-resolução 16/32/48 — abas de Chrome/Firefox/Edge/Safari |
| `icon-32.png` | Backup PNG pra browsers modernos, 32×32 |
| `icon-64.png` | Bookmark manager em alguns navegadores |
| `icon-180.png` | `apple-touch-icon` — iOS "Adicionar à tela inicial" |
| `icon-192.png` | Android home screen |
| `icon-512.png` | PWA icon, Android splash screen |
| `icon-512-transparent.png` | Reserva pra masks/SVG-fallback |
| `og-image.jpg` | 1200×630 — preview em WhatsApp, Twitter, Discord, Slack |
| `site.webmanifest` | Manifest PWA (nome, theme-color, icones) |

**OG image**: usa a **assinatura blackletter inteira** "Patricia Chêda" centrada em `--cream` sobre `--ink`, com uma linha de tags em `--gold` (DJ · Techno · Tech House · Noise · Florianópolis) e o email de booking em cream soft abaixo. Função: quando alguém colar o link em qualquer app, a preview já comunica identidade + oferta + contato sem clicar.

**Meta tags wiradas** no `<head>` do `index.html`:
- `<link rel="icon">` para `favicon.ico` + PNG 32 + PNG 192
- `<link rel="apple-touch-icon">` para o 180
- `<link rel="manifest">` para `site.webmanifest`
- `<meta name="theme-color" content="#0E0B0A">` — barra de endereço mobile fica ink
- Open Graph completo: `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (+ width/height), `og:locale`
- Twitter Card: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`

Os três layouts A4 (`print/ritual`, `print/poster`, `print/morph`) recebem só o favicon básico e `theme-color` — sem OG/Twitter porque são páginas internas que não são compartilhadas isoladas.

**Regra**: browsers cacheiam favicons agressivamente. Após trocar o ícone em produção, testar em janela anônima ou hard reload (Ctrl+Shift+R) — senão o ícone antigo continua aparecendo por dias.

---

## 3 · Arquitetura do site

> **Stack (jul 2026):** Astro SSG (`output: 'static'`). Rotas em `src/pages/`,
> estilos em `src/styles/`, assets em `public/assets/`. O HTML monolítico na raiz
> foi aposentado — a landing canônica é `src/pages/index.astro`.

```
cheda/
├── src/pages/index.astro    ← LANDING. Hero → artista → VHS → escuta → imagem → booking
├── src/pages/press-kit.astro
├── src/pages/print/         ← ritual / poster / morph (A4)
├── src/styles/
│   ├── tokens.css           ← Design tokens (palette, fonts, rhythm)
│   ├── landing.css          ← Skin da landing (ex-inline do index.html)
│   ├── cursor.css           ← Cursor custom (só landing)
│   ├── print.css            ← Skin dos A4
│   └── press-kit.css        ← Press kit multi-folha
├── public/assets/           ← Portraits, logos, favicon/PWA
├── vercel.json              ← redirects e headers do deploy canônico
├── .github/workflows/ci.yml ← validação de build/teste (sem deploy)
└── DESIGN_SYSTEM.md         ← este arquivo
```

### A landing (`/index.html`)

Estrutura pública orientada a contratantes:

1. **Hero** — primeiro viewport inteiro
   - CHÊDA vazado monumental, função, gêneros e localização.
   - CTA primário “Consultar disponibilidade”; CTA secundário “Ouvir agora”.
   - Navegação pública: Ouvir, Fotos, Press kit e Booking.
2. **Artista** — retrato editorial retangular, bio oficial curta, fatos rápidos e link para o press kit.
3. **VHS Tracking Seam** — assinatura de transição preservada; ver seção 4.
4. **Escuta** — contexto curto + widget do perfil SoundCloud. Não nomear “featured set” sem uma faixa real confirmada.
5. **Cena** — vídeo vertical de 51s como peça principal, cercado por três retratos em composição editorial assimétrica; o acervo completo continua no press kit.
6. **Booking** — superfície paper de alto contraste, email dominante e rotas auxiliares.

A abertura mostra aproximadamente 9,25s na primeira visita. O botão fixo `↺ Abertura` reproduz o filme integral de 18s.

### Páginas A4 (`/print/*`)

Cada uma é uma composição de imprensa A4 (794×1123px) independente, canvas fechado, exportável a PDF:

- **`/print/ritual`** (3a) — 8 anéis concêntricos strobe, portrait circular e composição A4 independente.
- **`/print/poster`** (3b) — Type wall + photo plate + content card se conectam através de bleed gradient compartilhado e blood-red vertical spine.
- **`/print/morph`** — Uma A4 que morpheia entre estado 3a e 3b via CSS `@property --t`. Toggle button ou `?loop=true` pra auto-scrub.

---

## 4 · VHS Tracking Seam — anatomia detalhada

Esta é a peça de linguagem visual mais idiossincrática do projeto. Registro completo para futuras iterações.

**Objetivo**: transição real entre Ritual (top) e Poster (bottom) que evoque um erro de tracking de fita VHS, não um "glitch" genérico de screen datamosh.

**8 camadas empilhadas** (z-index crescente):

1. **Base gradient** — sepia quente para envelhecimento de fita:
   ```
   radial-gradient(80% 40% at 50% 50%, rgba(120,140,93,.08), transparent 70%),
   linear-gradient(180deg, ink 0%, #1a1410 20%, #221812 50%, #1a1410 80%, ink 100%)
   ```
   O radial verde faint no centro é *chroma imbalance* — desequilíbrio de croma característico de fita degradada.

2. **Interlace comb** (sempre visível):
   ```
   repeating-linear-gradient(to bottom, rgba(0,0,0,.28) 0 1px, transparent 1px 2px)
   ```
   1px linha escura a cada 2px, `mix-blend-mode:multiply`.

3. **Tracking wobble bands** (3 strips horizontais que translacionam lateralmente em keyframes independentes):
   - `.wb-1` 12% de altura no topo, animação de 9s
   - `.wb-2` 14% no meio — a que faz **o "big lurch and snapback"** (translate -4.2% skew -1.6deg → translate 6% skew 2deg → translate -2%) em 11s
   - `.wb-3` 12% no fundo, animação de 7s

4. **Signal dropout slivers** — 3 barras horizontais pretas 1-3px que fazem `opacity:0 → .9 → 0` em ~1 frame (usando `steps(1)`) a cada 9.7s, 13.3s, 11.1s (offsets diferentes, nunca sincronizam).

5. **Rolling head-switch bar** — a peça central. Uma barra gradient `paper → gray → dark` de 16% altura que rola top→bottom em 7s, mas **pausa no 42%** durante 3 keyframes (a hesitação é o tracking hiccup):
   ```
   0%   { top:-16%; }   /* start above viewport */
   35%  { top:42%;  transform: skewY(-.6deg) translateX(-1.2%); }
   39%  { top:42%;  transform: skewY(.2deg)  translateX(2%); }    /* jitter */
   42%  { top:42%;  transform: skewY(-.3deg) translateX(-1%); }
   75%  { top:110%; }   /* exit below */
   100% { opacity:0; }
   ```

6. **Head-switching hash strip** — no fundo absoluto do seam, 3% de altura:
   ```
   repeating-linear-gradient(90deg, paper .55 0 1px, transparent 1px 3px, paper .35 3px 4px, transparent 4px 7px)
   ```
   `background-position` shifta -14px a cada 1.6s em `steps(12)`.

7. **Wordmark com chroma bleed** — "CHÊDA" gigante no centro. O texto principal é `--paper`. Dois pseudo-elementos:
   ```
   ::before { color: blood .9; transform: translate(6px, 1px); filter: blur(.6px); mix-blend-mode: screen; z-index: -1; }
   ::after  { color: rgb(120,150,180,.5); transform: translate(-3px, 0); filter: blur(.3px); mix-blend-mode: screen; z-index: -2; }
   ```
   Vermelho lag +6px right, cyan lag -3px left. **Assimetria é essencial** — VHS é chroma lag direcional, não RGB split simétrico.

8. **Timecode kickers** — top e bottom em Montserrat 10px letter-spacing `.42em/.5em`:
   - Top gold: `▶ play · vhs · 3a → 3b · tracking`
   - Bottom blood: `rec · sp · 00:03:42 · tracking`

Todos os keyframes têm fallback `@media (prefers-reduced-motion: reduce)`.

---

## 5 · Regras de linguagem

**Idioma primário**: Português BR. Sem toggle EN necessário na landing atual (foi removido — landing enxuta).

**Textos oficiais** (não reescrever sem confirmação):
- **Nome**: `Patrícia Chêda`
- **Título grande**: `CHÊDA` (all caps, com Ê acentuado — nunca CHDX, nunca CHEDA)
- **Papel**: `DJ e selectora` (com C final — não "seletora")
- **Gêneros**: `techno, tech house, noise`
- **Local**: `Florianópolis · SC` ou `Floripa`
- **Manifesto**: ver seção 0 acima. Não editar sem pedir.
- **Bio curta do content card**: "Patrícia Chêda — DJ e selectora — atravessa techno, tech house e noise com estética de xilogravura e serigrafia. Sem playlist fixa — leitura de pista em tempo real, camadas que crescem sem pressa. Som que invoca: cada set é um ritual, não uma playlist."

**Tom**: direto, poético quando merece, nunca hiperlativo ("incrível", "único", "melhor DJ") — deixa o trabalho falar.

---

## 6 · Fluxo de desenvolvimento

### Ambiente

```bash
cd cheda
npm install
npm run dev          # http://127.0.0.1:8765 — Astro, não http.server
```

### QA visual (screenshot de referência)

```javascript
// Playwright headless — renderiza desktop + mobile
const { chromium } = require('playwright');
const browser = await chromium.launch();
for (const [w, h, scale, out] of [
  [1440, 900, 1, 'qa-desktop.png'],
  [390, 844, 2, 'qa-mobile.png']
]) {
  const ctx = await browser.newContext({ viewport:{ width:w, height:h }, deviceScaleFactor:scale, reducedMotion:'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://127.0.0.1:8765');
  await page.waitForTimeout(1500);  // deixa SoundCloud carregar
  await page.screenshot({ path: out, fullPage: true });
}
```

Sempre rodar QA visual em **desktop 1440×900** e **mobile 390×844** antes de deploy. Nunca ship sem screenshot.

### Deploy

```bash
npm ci
npm test
# Após revisão e merge/push em main:
# Vercel Git integration → Production Deployment
```

GitHub é a fonte do código; o projeto Vercel `cheda` é o destino canônico. Pull requests e branches recebem previews; `main` publica produção em `patriciacheda.com`. `.github/workflows/ci.yml` executa `npm test` sem deploy concorrente. Redirects e headers de produção vivem em `vercel.json`; `astro.config.mjs` mantém o artefato estático portátil.

Consultar [`docs/deployment-checklist.md`](docs/deployment-checklist.md) para revisão do preview, promoção e rollback.

**Nota**: o proxy GitHub da Perplexity retorna 407 CONNECT tunnel failed intermitentemente. Se acontecer, esperar 5-10s e tentar de novo (3 tentativas costumam resolver).

### Regra do `index.html` regenerado a partir de `print/spread.html`

**Descontinuado.** A landing agora é canonicamente `index.html` na raiz. Não existe mais fonte `print/spread.astro`; o redirect é configurado em `astro.config.mjs` e `vercel.json`. Se um agente futuro tentar recriar a página, **não fazer**: quebra o redirect e duplica conteúdo.

---

## 7 · O que está pendente / próximos vetores

Quando a usuária voltar, esses são os fios soltos:

- **Domínios alternativos** — ela mencionou `cheda.press` ou `cheda.fm` mas não confirmou. O canônico atual é `patriciacheda.com` no Vercel.
- **Set list real** — placeholders foram removidos. Aguardando títulos/durações/links reais de mixes específicos pra reintroduzir a estrutura `.sets-row` + `.sets-list` (CSS já existe no `print.css`).
- **Foto adicional** — usuária mencionou upload `photos-1784006617332.jpg` que nunca chegou; se aparecer, provavelmente é candidata a hero portrait.
- **Instagram embed opcional** — se a usuária quiser mostrar feed dela ao lado do SoundCloud, dá pra plugar um Instagram basic display embed no mesmo padrão do `.sc-slot`.
- **PDF export dos A4** — as três páginas em `/print/` foram desenhadas exatamente em proporção A4 (794×1123px). Podem ser exportadas via headless Chromium a PDF impressoresídio.

---

## 8 · Prompt de contexto (para novas sessões de AI)

Se você é uma sessão AI nova entrando neste projeto, cole este bloco no início:

> Estou desenvolvendo o site da DJ **Patrícia Chêda** (nome completo, com Ê — nunca CHDX). Repo `github.com/anavvanzin/cheda`, deploy canônico no projeto Vercel `cheda`, domínio `patriciacheda.com`.
>
> **Antes de qualquer edição**:
> 1. Ler `DESIGN_SYSTEM.md` (este arquivo) — contém tokens, arquitetura, regras de linguagem e o registro completo do "VHS Tracking Seam" que é a peça mais idiossincrática.
> 2. Rodar `npm install && npm run dev` e abrir `http://127.0.0.1:8765` (nunca `python3 -m http.server` — rotas vêm do Astro).
> 3. Fazer screenshot Playwright desktop+mobile do estado atual antes de tocar em qualquer coisa.
>
> **Princípios não-negociáveis**:
> - Nome real "CHÊDA" (Ê acentuado), sem abreviação.
> - Preto e vermelho, mas criativo — nunca cair em "techno cartaz genérico".
> - Uma ideia dominante por tela. Landing segue Hero → Artista → VHS → Escuta → Imagem → Booking.
> - Nunca inventar dados (setlists, minutagens, títulos). Se a informação não está confirmada, remover ou usar placeholder explicitamente marcado.
> - Montserrat medium (500) para display, letter-spacing tight (`.04-.05em`). Nunca Oswald bold nem letter-spacing largo.
>
> **Se você não sabe se deve fazer algo, pergunta antes.** A usuária tem opinião forte sobre design e prefere um agente que confirma a fazer o wrong thing bonito.

---

*Documento vivo — atualizar quando novos padrões emergirem.*

---

## Changelog

### 21 jul 2026 — Landing pública e Vercel canônico

- Substituídos os rótulos internos `3a / 3b / morph / spread` por navegação pública: Ouvir, Fotos, Press kit e Booking.
- Hero agora comunica função, gêneros, localização e disponibilidade no primeiro viewport.
- Bio curta, escuta, retratos e booking foram organizados como uma sequência editorial sem repetir o mesmo texto.
- Primeira visita recebe um corte de 9,25s da abertura; `↺ Abertura` preserva o filme integral de 18s.
- Vercel `cheda` passou a ser o deploy canônico; GitHub Actions ficou responsável apenas por CI.
- QA visual confirmado em 1440×900 e 390×844, sem overflow horizontal.

### 14 jul 2026 (fim da tarde) — Favicon + OG image

1. **P blackletter como emblema do site** — recortado programaticamente da assinatura `logo-patricia-blackletter-cream.png` via detecção de luminância + col-scan da meia altura (evita corte prematuro no descensor). Preserva o losango interno característico do P gótico. Composto em quadrado `--cream` sobre `--ink` com 12% de padding (8% em tamanhos < 64px).
2. **Suite completa em `assets/favicon/`**:
   - `favicon.ico` multi-res (16/32/48)
   - `icon-32/64/180/192/512.png`
   - `icon-512-transparent.png` (reserva pra masks)
   - `og-image.jpg` 1200×630 com a assinatura blackletter completa + tags gold + email de booking
   - `site.webmanifest` (PWA)
3. **Wire no `<head>` do `index.html`**:
   - `<link rel="icon">` (ico + PNG 32 + PNG 192)
   - `<link rel="apple-touch-icon">` (180)
   - `<link rel="manifest">`
   - `<meta name="theme-color" content="#0E0B0A">`
   - Open Graph completo (og:type, site_name, title, description, url, image + w/h, locale)
   - Twitter Card `summary_large_image`
4. **Print layouts A4** (`ritual`, `poster`, `morph`) recebem favicon básico + theme-color, sem OG/Twitter (não são URLs compartilhadas isoladas).

**Anti-padrões catalogados neste ciclo**:
- Detectar fim horizontal de uma letra scaneando **toda** a altura da faixa vertical falha em blackletter porque o descensor é fino e vai muito além do corpo — dispara falso positivo no meio do descensor da letra seguinte. Solução: scanear só a **meia altura do corpo principal** (`y_top + 0.15*h` até `y_top + 0.55*h`), onde só aparecem hastes sólidas.
- Assumir que browsers pegam automaticamente `favicon.ico` da raiz é mito — sem `<link rel="icon">` explícito, o comportamento varia entre engines (Safari especialmente exigente). Sempre declarar explícito.
- Testar favicon novo com hard reload no mesmo browser em que você desenvolveu falha porque o cache persiste. Testar sempre em **janela anônima** ou browser diferente.

### 14 jul 2026 (tarde) — Cursor customizado + blackletter + reorg poster

Segunda passada do dia, sobre a landing:

1. **Cursor customizado de três camadas concêntricas** — baseado num artifact de referência (`CHDX-Cursor-1`, a thumbnail SVG serviu como spec). Arquivo novo: `styles/cursor.css` + script inline no fim do body do `index.html`.
   - Anel externo (`.cursor-ring`): 52px de repouso, fill `rgba(23,18,16,.6)` blur 2px, border `rgba(233,224,206,.3)`. Segue o mouse com **lerp = .18/frame** (delay perceptivo suave).
   - Disco médio (`.cursor-disc`): 20px, `--blood` sólido, box-shadow blood glow. Segue **1:1** com o cursor.
   - Dot central (`.cursor-dot`): 4.8px, `--cream`. Segue 1:1.
   - **Estado hover** (`body[data-cursor-hover="true"]`): anel cresce para 88px, border clareia para `rgba(233,224,206,.6)`, background vira `rgba(181,34,26,.08)`. Disco escala 1.15x. Delegated pointerover/out em `a, button, .route, .mix, .set-card, .brand-logo, [data-cursor-target]`.
   - **Estado hidden** (`body[data-cursor-hidden="true"]`): opacidade zero em 150ms. Ativado quando o mouse cruza uma borda de `iframe` (o browser força o cursor nativo dentro do frame; escondemos o custom para não duplicar visualmente) ou sai da janela.
   - **Gates**:
     - `@media (hover:hover) and (pointer:fine)` — cursor só renderiza em desktop com mouse. Mobile e touch usam cursor do sistema (que é nada).
     - `@media (prefers-reduced-motion: reduce)` — anel externo perde o crescimento no hover; motion path suavizado se mantido é aceitável.
     - JS gate: `matchMedia('(hover:hover) and (pointer:fine)').matches` no boot; senão o script retorna sem instalar listeners.
   - **Cursor não é aplicado nos layouts A4 de imprensa** (`print/ritual.html`, `print/poster.html`, `print/morph.html`). O `cursor.css` só é linkado no `index.html`.

2. **Assinatura blackletter Patricia Chêda no rodapé** — novo asset em três versoes alpha (black/white/cream) convertido de um JPG anexo usando threshold por luminância. Consome `--cream` em `logo-patricia-blackletter-cream.png` (a que está no ar). Colocada num `<footer class="site-footer">` novo, span full-width, grid `1fr auto`:
   - Esquerda: booking/email + instagram + localização em Montserrat 500 (`--gold`, letter-spacing .42em, uppercase).
   - Direita: assinatura blackletter, `max-width: min(360px, 42vw)`, opacity .85, drop-shadow suave.
   - Mobile: grid colapsa em 1 coluna, assinatura desce e reduz para `max-width: 220-280px`.

3. **Poster grid refatorado de 1-coluna com elementos flutuantes para 2-colunas explícitas**:
   - Antes: `.type-wall` como background absoluto do `<section>` inteiro, e `.content-card` + `.sc-slot` flutuando com `justify-self: start/end`. Hierarquia ambigua, competição visual.
   - Depois: grid `minmax(0, 560px) 1fr`. `.poster-left` (col 1) empilha `.content-card` → `.sc-slot` num flow único. `.poster-right` (col 2) hospeda a `.type-wall` como decoração absolute com bleed rightward via `right: calc(-1 * clamp(20px, 4vw, 60px))`.
   - Eye path: **bio → sound → assinatura** (no footer abaixo). Linear, sem elementos ambiguos.
   - Type-wall `.tw-word` reduzido de `clamp(80px,14vw,150px)` para `clamp(60px,10vw,110px)` — antes ocupava o poster inteiro; agora é só a coluna direita.
   - Mobile (< 960px): grid colapsa em 1 coluna, `.poster-right` desce e recebe `min-height: 220px` com `margin-top: -12px` (leve overlap intencional). Type-wall vira decoração de fundo com `opacity: .55`.
   - **`.poster-foot`** legado do modelo antigo (com o logo sans branco pequeno e o texto "Booking") virou `display: none`. Sua função foi absorvida pelo `<footer class="site-footer">`.

**Anti-padrões catalogados neste ciclo**:
- Cursor customizado sem gate por `matchMedia` no JS causa flicker em toque (o CSS esconde, mas o JS ainda instala listeners e faz o RAF loop rodar em vazio, gastando bateria)
- Cursor customizado sobre `iframe` cross-origin sem `pointerenter`/`pointerleave` hide-toggle cria duplo-cursor visual na borda — dentro do iframe o browser força o nativo, e o custom continua renderizando por fora
- Elementos flutuando com `justify-self` no grid 1-col criam a ilusão de "design de composição" mas viram um puzzle de peso visual que compete em vez de guiar o olho — duas colunas explícitas + um flow linéar por coluna resolvem sem perder o caráter compositivo

### 14 jul 2026 (manhã) — Cleanup pass

Mudanças substantivas do dia, em ordem cronológica:

1. **Landing enxuta** — revertida do overload (bio+manifesto+fotos+mixes+contact+decide empilhados) para uma única tela hero com CHÊDA gigante + retrato + 3 rotas. Rejeitado. Depois evoluída para o modelo atual: spread contínuo com Ritual → VHS seam → Poster.
2. **Spread promovido a landing** (`/`) — antes vivia em `/print/spread`; o arquivo canonicónico virou `index.html` na raiz. Altura reduzida ~25% (3.0 telas → 2.2 telas em desktop) via caps de `min(720px, 82vh)` no ritual e `min(340px, 36vh)` no seam.
3. **Logo oficial CHÊDA** — substitui o `panther-mark` circular genérico pelo logotipo real da artista. Arquivo original (`CHEDA_logo_branca.jpg`) tinha bug (todos pixels brancos opacos), foi regenerado a partir do preto original com alpha correto. Novos assets: `logo-cheda-{black,white}{,-alpha}.png`.
4. **SoundCloud embed** — iframe do `w.soundcloud.com/player` apontando para `soundcloud.com/patriciacheda` (perfil inteiro, não faixa específica), color `#B5221A`, `visual=true`. Substitui o placeholder que aguardava URL.
5. **Setlists inventados removidos** — os placeholders `Ritual Noturno / Som que Invoca / Pista Aberta` (com durações fake `58 min / 62 min / 74 min`) foram removidos de todos os quatro layouts: `index.html`, `print/ritual.html`, `print/poster.html`, `print/morph.html`. Também as duas orbit captions inventadas (`Som que Invoca`, `Ritual · não Playlist`). A frase filosófica `som que invoca · cada set é um ritual` fica preservada no subtítulo — é manifesto, não título de faixa. O CSS de `.sets-row` e `.sets-list` continua nos stylesheets para reintroduzir quando títulos reais chegarem.
6. **`/print/spread` deletado** — arquivo removido, redirects `/print/spread{,.html} → /` em `astro.config.mjs` (Pages) e espelhados em `vercel.json` (legado), switchers dos outros A4 atualizados para apontar `spread` → `/`.
7. **Email consolidado** — substituiu todo `pat@chdx.fm` (que era fake) por `patriciavchedach@gmail.com` (real) em `print/poster.html`, `print/morph.html`, index.
8. **DESIGN_SYSTEM.md criado** — este documento, agora atualizado.

**Anti-padrões catalogados neste ciclo**:
- Em previews protegidos, usar o acesso autenticado do Vercel para QA; produção em `patriciacheda.com` deve permanecer pública
- Alpha channel invertido em PNG (branco opaco onde deveria ser transparente) — verificar contagem `alpha=0 vs alpha=255` após qualquer conversão
- Placeholder "profissional-parecendo" (setlists com durações plausíveis) é pior que placeholder óbvio, porque parece verdade e passa pela revisão sem questionamento
