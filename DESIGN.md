# FSS Design Kit

O visual do dashboard **FSS YouTube Metrics**, empacotado para reutilizar em outro
projeto. Abra `preview.html` no navegador para ver todas as peças juntas.

```
fss-design-kit/
├── DESIGN.md              ← este guia
├── preview.html           ← vitrine estática (abre direto, sem build)
├── css/fss.css            ← tokens + todas as classes .fss-* + responsivo
├── tailwind.config.js     ← mesmos tokens expostos ao Tailwind
├── postcss.config.js
├── assets/fss-icon.png    ← ícone da marca
└── components/
    ├── AppShell.tsx       ← sidebar escura + painel claro + topbar + gaveta mobile
    ├── ui.tsx             ← PageHeader, StatCard, KpiGrid, PillToggle, Alert, Modal, fmtKM
    ├── MetricChart.tsx    ← gráfico de série (Recharts) + paleta de gráficos
    └── LoginScreen.tsx    ← tela de login
```

---

## 1. A ideia em uma frase

**Moldura escura, conteúdo claro.** O app inteiro vive num shell quase preto
(`#101011`); a área de trabalho é um painel cinza-claro com o canto superior
esquerdo arredondado (19px) "encaixado" na moldura, 7px abaixo do topo. Cards
brancos de canto bem redondo (20px), borda fina cinza, **sem sombra**. O vermelho
da marca aparece pouco — botão primário, eyebrow, foco de campo, série principal
do gráfico — e por isso chama atenção quando aparece.

## 2. Tokens

### Cores

| Token CSS | Tailwind | Valor | Uso |
|---|---|---|---|
| `--fss-red` | `fss-red` | `#E11A38` | Marca. Botão primário, eyebrow, foco, série principal, erro, delta negativo |
| — | — | `#C8152F` | Hover do botão primário |
| `--status-success` | `fss-success` | `#1E9E5A` | Positivo, delta para cima, "Sync OK", barras de ganho |
| `--status-warning` | `fss-warning` | `#E5A100` | Aviso (texto do alerta usa `#9A6E00` para contraste) |
| `--shell-bg` | `shell` | `#101011` | Fundo da moldura / sidebar / tela de login |
| `--shell-surface` | `shell-surface` | `#1F1F1F` | Item de menu ativo, caixa do logo |
| `--shell-border` | `shell-border` | `#2E2E2E` | Divisórias no escuro |
| `--shell-text` | `shell-text` | `#BCBCBC` | Texto do menu |
| `--shell-text-dim` | — | `#747474` | Texto secundário no escuro (e-mail do usuário) |
| `--page-bg` | `page` | `#F0F0F0` | Fundo do painel de conteúdo; fundo do badge |
| `--surface` | `surface` | `#FFFFFF` | Cards, campos, modal |
| `--surface-2` | — | `#F7F7F7` | Cabeçalho de tabela, hover de linha |
| `--border` | `line` | `#D4D4D4` | Borda de card e campo |
| `--border-soft` | — | `#E5E5E5` | Divisórias internas, linhas de tabela, grid de gráfico |
| `--text` | `ink` | `#3B3B3B` | Texto principal (nunca preto puro) |
| `--text-muted` | `ink-muted` | `#5B5B5B` | Texto secundário, rótulos |
| `--text-dim` | `ink-dim` | `#716E74` | Legendas, eixos, placeholders |

**Gráficos** (`CHART` em `MetricChart.tsx`): atual `#E11A38`, comparação
`#5A6485` tracejado (`4 3`), barras de ganho `#1E9E5A`. Categórica, nesta ordem:
`#285193` `#E11A38` `#1E9E5A` `#E5A100` `#7B2D8B` `#0097A7` `#5A6485`.

### Raio

| Token | Valor | Onde |
|---|---|---|
| `--radius-card` / `rounded-fss-card` | 20px | Cards, stat cards, modal |
| (painel principal) | 19px | Só o canto superior esquerdo do `.fss-main-area` |
| `--radius-sm` / `rounded-fss` | 8px | Botões, campos, alertas |
| (nav item) | 9px | Itens do menu lateral |
| `--radius-xs` | 6px | Botões de ícone |
| (badge) | 5px | Badges |

### Medidas

`--sidebar-width: 240px` · `--topbar-height: 54px` · conteúdo com padding
`22px 26px` · gap da grade de KPIs `10px` · espaço entre blocos `20px`.

## 3. Tipografia

Fonte única: **Montserrat** (Google Fonts, 300–900). Corpo 14px / 1.5, com
antialiasing. A hierarquia vem de **peso e caixa-alta espaçada**, não de tamanho:

| Classe | Tamanho | Peso | Estilo | Uso |
|---|---|---|---|---|
| `.fss-eyebrow` | 9px | 700 | CAIXA ALTA, `0.22em`, vermelho | Sobretítulo ("ACESSO RESTRITO") |
| `.fss-h1` | 17px | 700 | `-0.01em` | Título de página |
| `.fss-stat-value` | 24px | 800 | `-0.01em`, line-height 1.1 | Número do KPI |
| `.fss-label` / `.fss-stat-label` | 10px | 600 | CAIXA ALTA, `0.14em` | Rótulo de campo, título de card, label de KPI |
| `th` de `.fss-table` | 10px | 600 | CAIXA ALTA, `0.14em` | Cabeçalho de tabela |
| título de modal | 12px | 700 | CAIXA ALTA, `0.10em` | |
| botões | 12px | 600 / 500 | | primário / secundário |
| célula, input | 13px | 400 | | |

Regra prática: **títulos pequenos e pesados, números grandes e pretos, rótulos
minúsculos em caixa alta.** Nada acima de 24px.

## 4. Componentes (classes em `fss.css`)

- **Card** `.fss-card` — branco, borda `--border`, raio 20, sem sombra. Padding
  típico `16px 18px`.
- **Stat card** `.fss-stat-card` + `.fss-stat-label` + `.fss-stat-value`. Abaixo,
  delta em 10px/700 verde (`+`) ou vermelho, texto "vs período anterior". Métrica
  reservada: card com `opacity: .55` e "em breve".
- **Grade de KPIs** `.fss-kpi-grid` (6 col; `.cols-5` para 5) → 3 col ≤ 860px →
  2 col ≤ 640px.
- **Botão primário** `.fss-btn-primary` — vermelho, branco, 12px/600, raio 8,
  `inline-flex` + `gap: 6px` (ícone e rótulo na mesma linha — sem isso o Safari
  joga o SVG numa linha própria).
- **Botão secundário** `.fss-btn-secondary` — branco com contorno; hover escurece a
  borda; `.active` vira **pílula preta** (`--shell-bg`) com texto branco. É o
  mesmo botão que vira toggle de métrica/período em tamanho `10px, 4px 9px`.
- **Campo** `.fss-input` / `.fss-select` — branco, borda cinza, foco com borda
  vermelha (sem anel/glow). Select com seta SVG própria.
- **Tabela** `.fss-table` dentro de `.fss-table-wrap` — cabeçalho cinza-claro em
  caixa alta, linhas com divisória suave e hover `--surface-2`. No celular a
  tabela rola na horizontal dentro do card (min 440px).
- **Badge** `.fss-badge` — fundo `--page-bg`, 10px/600 caixa alta.
- **Alertas** `.fss-alert-success|warning|error` — fundo da cor a 8–10%, borda a
  30–35%, texto na cor. Raio 8.
- **Avatar** `.fss-avatar` — círculo 30px, inicial 12px/800 branca sobre cor sólida.
- **Modal** (`ui.tsx`) — fundo `rgba(0,0,0,.45)`, card de até 660px, cabeçalho
  fixo com título em caixa alta e X, corpo com scroll próprio, rodapé à direita.
- **Separadores** `.fss-keyline` e `.fss-section-header` (borda inferior suave +
  12px/16px).

## 5. Layout e responsivo

```
┌────────── shell #101011 ───────────────────────────────────┐
│ ┌sidebar 240┐╭──────── painel #F0F0F0 (canto 19px) ──────┐ │
│ │ [logo]•   ││ FSS › Produto              [filtro] • Sync│ │ ← topbar 54px
│ │ Nome      │├───────────────────────────────────────────┤ │
│ │ e-mail    ││  EYEBROW                                   │ │
│ │           ││  Título da página                          │ │
│ │ ▣ Item    ││  ┌KPI┐┌KPI┐┌KPI┐┌KPI┐┌KPI┐┌KPI┐             │ │
│ │ ▢ Item    ││  ┌──────── card gráfico ────────┐          │ │
│ │ ...       ││  └──────────────────────────────┘          │ │
│ │ ⚙ Config  ││                                            │ │
│ │ ⎋ Sair    ││                                            │ │
│ └───────────┘╰────────────────────────────────────────────╯ │
└─────────────────────────────────────────────────────────────┘
```

- **≤ 860px**: sidebar vira gaveta deslizante (`.open`), com backdrop
  `rgba(0,0,0,.5)` e botão X; aparece o hambúrguer na topbar; o painel perde o
  canto arredondado; padding do conteúdo cai para `16px 14px`.
- **≤ 640px**: KPIs em 2 colunas, `.fss-grid-2` empilha (`.fss-grid-3` não),
  tabelas rolam na horizontal, `.fss-page-header` quebra e o botão ocupa a linha.
- **≤ 520px**: padding `14px 12px`.
- Scrollbar fina (6px) com polegar `--border`.

Ícones: **lucide-react**, `size={15} strokeWidth={1.8}` no menu, 16 em botões,
20 nos controles do mobile.

## 6. Princípios que dão o "jeito" do design

1. **Sem sombra.** Profundidade vem de borda fina + contraste shell/painel. A
   única sombra é a da gaveta mobile.
2. **Vermelho é escasso.** Um primário por tela. Botão de ação secundária é
   sempre o contornado.
3. **Ausência de dado grita.** Valor nulo é `—`, nunca `0`. Coleta incompleta vira
   `.fss-alert-error` no topo — zero parece um dia fraco, não um dia sem coleta.
4. **Números em pt-BR com K/M** (`fmtKM`: `1,2K`, `2,5M`), percentuais com uma
   casa (`5,2%`), horas com `h`.
5. **Texto nunca preto puro** — `#3B3B3B`. Branco puro só dentro do shell escuro
   e nos cards.
6. **Carregamento sem pular**: fallback ocupa `60vh`; o Suspense fica dentro do
   `<main>` para menu e topbar não piscarem.

## 7. Como aplicar em outro projeto

### Vite + React + Tailwind (igual ao original)

```bash
npm i react-router-dom lucide-react recharts
npm i -D tailwindcss@3 postcss autoprefixer
```

1. Copie `tailwind.config.js` e `postcss.config.js` para a raiz do front
   (ajuste `content` se as pastas forem outras).
2. Copie `css/fss.css` e importe no `main.tsx` (`import './fss.css'`). Ele já
   traz o `@import` da Montserrat e as diretivas `@tailwind`.
3. Copie `components/` e `assets/fss-icon.png`.
4. Monte o app:

```tsx
import AppShell, { StatusDot } from './components/AppShell'
import { PageHeader, KpiGrid, StatCard, fmtKM } from './components/ui'
import { LayoutDashboard, Settings } from 'lucide-react'
import icon from './assets/fss-icon.png'

<AppShell
  brand={{ name: 'Full Sales System', subtitle: user.email, icon }}
  nav={[{ to: '/', label: 'Visão Geral', icon: LayoutDashboard, exact: true }]}
  navBottom={[{ to: '/settings', label: 'Configurações', icon: Settings }]}
  breadcrumb={['FSS', 'Novo Produto']}
  topbarRight={<StatusDot label="Sync OK" />}
  onLogout={logout}
>
  <PageHeader eyebrow="Visão geral" title="Resultados" />
  <KpiGrid>
    <StatCard label="Views" value={fmtKM(12400)} delta={8.3} />
  </KpiGrid>
</AppShell>
```

### Sem Tailwind / sem React

`css/fss.css` funciona sozinho: remova as três linhas `@tailwind` do topo e use as
classes `.fss-*` em qualquer HTML (o `preview.html` é exatamente isso).

### Next.js

Importe `fss.css` no `app/layout.tsx`, troque `NavLink`/`useLocation` do
`AppShell` por `Link`/`usePathname` do `next/navigation` e marque o arquivo com
`'use client'`. Para a fonte, prefira `next/font/google` (Montserrat) e remova o
`@import` do CSS.

### Trocando a marca

Para outro produto, mude só `--fss-red` (+ o hover `#C8152F`), o ícone e o nome em
`brand`. O resto do sistema é neutro.
