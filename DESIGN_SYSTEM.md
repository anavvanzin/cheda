# CHÊDA — Design System & Development Prompt

**Version 1.0 · July 2026 · Patrícia Chêda / Digital Press Kit**

> Este documento é dupla função:
> 1. **Referência de design** para humanos que forem editar o repositório
> 2. **Prompt de contexto** para qualquer AI agent continuar o desenvolvimento em sessões futuras sem precisar redescobrir decisões

---

## 0 · Contexto do projeto

**Artista**: Patrícia Chêda — DJ e selectora, radicada em Florianópolis, SC.
Techno, tech house, noise. Sets densos e hipnóticos, sem playlist fixa.

**Manifesto artístico** (voz da artista, preservar sem reescrever):
> "Uma apresentação que transforma **música em movimento** e movimento em unidade. No meu projeto de DJ, ofereço mais do que música: um encontro de vibrações, uma troca de energia. O que sentimos juntos não é apenas ritmo — é pulsação. Aqui, cada batida ecoa o pulsar da própria vida."

**Tagline curta**: *som que invoca · cada set é um ritual*

**Contato**:
- Email: `patriciavchedach@gmail.com`
- Instagram: [@patriciacheda_](https://www.instagram.com/patriciacheda_/)
- SoundCloud: [soundcloud.com/patriciacheda](https://soundcloud.com/patriciacheda)

**Deploy**:
- Repo: `github.com/anavvanzin/cheda` (privado)
- Vercel: `cheda-six.vercel.app` (público — sem SSO protection)
- Domínio custom: **PENDENTE** — usuária mencionou `cheda.press`, `cheda.fm` ou similar

---

## 1 · Filosofia de design

O projeto tem um nome interno que resume a atitude: **"straightforward and impressive at the same time"**. Traduzindo em regras práticas:

- **Uma ideia dominante por tela.** Não empilhar hierarquias competindo.
- **Preto e vermelho, mas criativo.** Nunca cair em "cartaz de festa techno anos 2000". Elegância + peso, não força bruta.
- **Nome real acima de marca.** Ela é *Patrícia Chêda*. Uma vez tentamos "CHDX" como abreviação — foi rejeitado. O logotipo dela escreve **CHÊDA**, com Ê. Nunca CHDX.
- **Nada de dados inventados.** Setlists, títulos de faixas, minutagens — só existem se a usuária confirmou. Não preencher com placeholder plausível.
- **A landing é a porta, não o museu.** Uma tela (2-2.3 telas de scroll no máximo), três rotas claras. Toda densidade de informação técnica mora em páginas de "print" (A4 layouts).

### Anti-padrões (o que evitamos, aprendido de tentativas rejeitadas)

| Não fazer | Por quê |
|---|---|
| Oswald bold | Comprimido demais, "techno anos 2000" |
| Letter-spacing largo (`.14em+`) em display | Calibrado pra fontes comprimidas — no Montserrat vira "sparse and preachy" |
| Hierarquia com 5+ seções (bio, fotos, mixes, contact, decide, etc) empilhadas na landing | Faz a landing perder o impacto do morph/spread |
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

Arquivos em `assets/`:
- `logo-cheda-black.png` — CHÊDA preto sobre branco (original enviado pela artista)
- `logo-cheda-white.png` — inversão em cores sólidas
- `logo-cheda-black-alpha.png` — CHÊDA preto sobre transparente
- `logo-cheda-white-alpha.png` — CHÊDA **branco sobre transparente** ← este é o usado no site (fundo dark)

Dimensões nativas: 246×65px. Sempre carregar com `width="246" height="65"` no `<img>` pra evitar layout shift, e escalar via `height:22px; width:auto` no CSS.

---

## 3 · Arquitetura do site

```
cheda/
├── index.html               ← LANDING (raiz). Cópia canônica de conteúdo,
│                              paths locais. Título "CHÊDA · Patrícia Chêda".
├── vercel.json              ← cleanUrls + redirects /print/spread → /
├── styles/
│   ├── tokens.css           ← Design tokens (palette, fonts, rhythm)
│   ├── site.css             ← Skin do site (imports tokens)
│   └── print.css            ← Skin dos A4 (imports tokens)
├── print/
│   ├── ritual.html          ← 3a A4 — full-canvas strobe rings + orbits + sets
│   ├── poster.html          ← 3b A4 — type wall + photo plate + content card
│   └── morph.html           ← Ritual ↔ Poster morph timeline (CSS @property --t)
├── assets/
│   ├── portrait-ritual.jpg  ← IMG_7694 (B&W warpaint, square)
│   ├── portrait-poster.jpg  ← IMG_5194 (4:5 warpaint, editorial)
│   ├── foto-editorial.jpg   ← IMG_3745 (Chêda em madeira, coleira)
│   ├── foto-lattice.jpg     ← IMG_3472 (quimono, óculos escuros)
│   ├── foto-steps.jpg       ← IMG_3473 (escadaria colonial)
│   ├── foto-yellow.jpg      ← IMG_7533 (parede amarela, casual)
│   └── logo-cheda-*.png     ← 4 variações do logotipo oficial
└── DESIGN_SYSTEM.md         ← este arquivo
```

### A landing (`/index.html`)

Estrutura em três seções empilhadas, com portrait circular apenas na Ritual:

1. **Ritual** — `min(720px, 82vh)`
   - Header: logo oficial (esquerda) + kicker "Digital Press Kit · 2026 · 3a Ritual" (direita)
   - Rings SVG concêntricos, ring-pulse staggered 3s
   - Portrait circular centrado (embedded, não shared)
   - Orbit captions curvadas em torno do portrait (JavaScript trig-placement)
   - Wordmark "CHÊDA" gigante em Montserrat
   - Subtítulo italic Cormorant "Patrícia Chêda"
   - Tagline blood: "som que invoca · cada set é um ritual"

2. **VHS Tracking Seam** — `min(340px, 36vh)`
   - Ver seção 4 abaixo.

3. **Poster** — `padding-block clamp(48px,7vw,96px)` (altura intrínseca)
   - Type wall: 6 rows de "CHÊDA" cascateando solid → red → cream stroke → red ghost → gold whisper → paper trace
   - SoundCloud embed 16:9 (widget do perfil `soundcloud.com/patriciacheda`, color `#B5221A`)
   - Content card: logo pequeno + manifesto bio + tags
   - Foot: logo + email + ano

**Altura total**: ~2.3 telas desktop, ~1.6 telas mobile.

### Páginas A4 (`/print/*`)

Cada uma é uma composição de imprensa A4 (794×1123px) independente, canvas fechado, exportável a PDF:

- **`/print/ritual`** (3a) — 8 anéis concêntricos strobe, portrait circular, sets orbitando, três set cards ao pé. **Note**: essas set cards ainda contêm placeholders (Ritual Noturno, Som que Invoca, Pista Aberta) que a usuária pediu para remover na landing mas o A4 print não foi atualizado. Se essa página for revitalizada, remover os placeholders também.
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
python3 -m http.server 8765 --bind 127.0.0.1
open http://127.0.0.1:8765
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
git add -A && git commit -m "…"
git push origin main
vercel --token "$VERCEL_TOKEN" deploy --prod --yes
```

Alias fixo: `cheda-six.vercel.app`. Vercel infra do usuária é team `anavanzin`, project `cheda`.

**Nota**: o proxy GitHub da Perplexity retorna 407 CONNECT tunnel failed intermitentemente. Se acontecer, esperar 5-10s e tentar de novo (3 tentativas costumam resolver).

### Regra do `index.html` regenerado a partir de `print/spread.html`

**Descontinuado.** A landing agora é canonicamente `index.html` na raiz. Não existe mais `print/spread.html` — deletado, com redirect 308 configurado. Se um agente futuro tentar recriar `print/spread.html`, **não fazer**: quebra o redirect e duplica conteúdo.

---

## 7 · O que está pendente / próximos vetores

Quando a usuária voltar, esses são os fios soltos:

- **Domínio custom** — ela mencionou `cheda.press` ou `cheda.fm` mas não confirmou. Passo: pedir a decisão, comprar/atachar via Vercel, atualizar DNS.
- **Set list real** — placeholders foram removidos. Aguardando títulos/durações/links reais de mixes específicos pra reintroduzir a estrutura `.sets-row` + `.sets-list` (CSS já existe no `print.css`).
- **Foto adicional** — usuária mencionou upload `photos-1784006617332.jpg` que nunca chegou; se aparecer, provavelmente é candidata a hero portrait.
- **A4s de impressão desatualizados** — `print/ritual.html` e `print/poster.html` ainda contêm os placeholders "Ritual Noturno / Som que Invoca / Pista Aberta". Espelhar a remoção que foi feita na landing.
- **Instagram embed opcional** — se a usuária quiser mostrar feed dela ao lado do SoundCloud, dá pra plugar um Instagram basic display embed no mesmo padrão do `.sc-slot`.
- **PDF export dos A4** — as três páginas em `/print/` foram desenhadas exatamente em proporção A4 (794×1123px). Podem ser exportadas via headless Chromium a PDF impressoresídio.

---

## 8 · Prompt de contexto (para novas sessões de AI)

Se você é uma sessão AI nova entrando neste projeto, cole este bloco no início:

> Estou desenvolvendo o site da DJ **Patrícia Chêda** (nome completo, com Ê — nunca CHDX). Repo `github.com/anavvanzin/cheda` (privado), deploy em `cheda-six.vercel.app`.
>
> **Antes de qualquer edição**:
> 1. Ler `DESIGN_SYSTEM.md` (este arquivo) — contém tokens, arquitetura, regras de linguagem e o registro completo do "VHS Tracking Seam" que é a peça mais idiossincrática.
> 2. Rodar `python3 -m http.server 8765` e abrir `http://127.0.0.1:8765`.
> 3. Fazer screenshot Playwright desktop+mobile do estado atual antes de tocar em qualquer coisa.
>
> **Princípios não-negociáveis**:
> - Nome real "CHÊDA" (Ê acentuado), sem abreviação.
> - Preto e vermelho, mas criativo — nunca cair em "techno cartaz genérico".
> - Uma ideia dominante por tela. Landing tem 3 seções (Ritual → Seam → Poster) e nada mais.
> - Nunca inventar dados (setlists, minutagens, títulos). Se a informação não está confirmada, remover ou usar placeholder explicitamente marcado.
> - Montserrat medium (500) para display, letter-spacing tight (`.04-.05em`). Nunca Oswald bold nem letter-spacing largo.
>
> **Se você não sabe se deve fazer algo, pergunta antes.** A usuária tem opinião forte sobre design e prefere um agente que confirma a fazer o wrong thing bonito.

---

*Documento vivo — atualizar quando novos padrões emergirem. Última grande decisão: SoundCloud embed do perfil ao invés de track específica, remoção dos setlists inventados, deleção do `/print/spread` duplicado (14 jul 2026).*
