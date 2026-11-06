# Snowplow docs design direction: CDI and Signals

**Scope:** Docusaurus 3.10 with Tailwind 3.3. The current state comes from the design audit and from repo checks I ran today. `src/css/custom.css` is 1,791 lines and has 189 `!important` declarations. `tailwind.config.js` sets `important: true`. The site depends on `@mui/material` 5, `@mui/x-data-grid-premium` 6.20.4, `framer-motion` and `motion`. I computed every contrast ratio below with the WCAG 2.x relative-luminance formula.

---

## 1. Design principles

| # | Principle | What it means here | Example site | Audit finding it fixes |
|---|---|---|---|---|
| 1 | **Keep the chrome quiet so the content stands out.** | Neutral surfaces. Use the purple accent only for links, the active nav item, focus rings and the primary button. Avoid gradients, animation and marketing blocks inside doc pages. | Vercel (https://vercel.com/docs) and Stripe (https://docs.stripe.com/) use restrained color and small radii. Starlight favors borders over shadows (https://starlight.astro.build/). | The animated "Book a demo" banner under the TOC (`src/components/.../InteractiveBanner.tsx`, rendered by `Demo_Ad`). Gradient CTA cards on `docs/introduction.md`. |
| 2 | **Give each product its own navigation inside one shared system.** | A product switcher scopes the sidebar to CDI or to Signals. Both products share tokens, components and Fundamentals. | Claude Platform product tabs (https://platform.claude.com/docs/en/home). Vercel's scoped sidebar with "Back to all documentation sections" (https://vercel.com/docs/functions). Mintlify's "Products" primitive (https://www.mintlify.com/docs/organize/navigation). | One combined sidebar where Signals starts below about 20 CDI items (`src/theme/DocSidebarItem/Category/index.js:120-164`, `docs/signals/index.md:8`). |
| 3 | **Show the reader's first success on the first screen.** | The home page and each product landing page show a runnable snippet or command, plus quickstarts labeled with how long they take. | Claude home hero with code in 9 language tabs (https://platform.claude.com/docs/en/home). Cloudflare product cards with commands (https://developers.cloudflare.com/). Mistral's "N min to complete" quickstarts (https://docs.mistral.ai/). | The home page is a doc page with cards and no entry point to a task (`docs/introduction.md`). |
| 4 | **Keep lines readable on a wide page.** | Prose at 672px (about 75 characters of Inter at 16px). Code, tables and diagrams can break out to 896px. The page shell is 1440px. | Vercel `--article-max-width: 640px`, Clerk 696px, Starlight 720px (devtools research, section 5). | 736px of prose, about 90 characters per line, with magic numbers repeated in `DocItem/Layout/index.tsx:63,123,137`. |
| 5 | **Build one component for each job.** | One Card, one Button, one Badge, one Callout and one Code block, each with variants. Card titles are real headings. | Starlight's built-in set (https://starlight.astro.build/components/using-components/). Mintlify Cards and Steps (https://www.mintlify.com/docs/components/cards). | Three button systems and three card systems (`CardGrid.tsx`, `ui/card.tsx`, `.cta-card`, `.snowplow-button`, `.featured-section-button`). |
| 6 | **Show status as data, not prose.** | Badges for availability (Cloud, Private Managed Cloud, Self-hosted), lifecycle (GA, Beta, Deprecated), support tier and minimum version, in one visual language. | Segment support tiers (https://www.twilio.com/docs/segment/connections/sources/catalog/libraries/website/javascript). Amplitude SDK labels (https://amplitude.com/docs/sdks). Stripe's per-heading "Optional" and "Server-side" badges (https://docs.stripe.com/payments/accept-a-payment). | `src/components/Badges.js` uses shields.io images and references `img_ev3q`. `availability-badges.tsx` uses a different style. |
| 7 | **Put tables before prose on reference and catalog pages.** | Pages open with a compatibility table, a features table or a settings table. Hub pages carry the full matrix. | Fivetran Features table (https://fivetran.com/docs/connectors/applications/salesforce). Hightouch supported syncs (https://docs.hightouch.com/destinations/braze). PostHog SDK matrix (https://posthog.com/docs/libraries). | Tracker hub table with no feature matrix (https://docs.snowplow.io/docs/sources/). |
| 8 | **Design for readers and for agents.** | Every page has a page-actions menu (Copy page, View as Markdown, Open in Claude or ChatGPT, Copy MCP URL). Required content never sits only inside a non-default tab or a diagram. | Mintlify contextual menu (https://www.mintlify.com/docs/ai/contextual-menu). Anthropic "Copy page". NN/g on tabs (https://www.nngroup.com/articles/tabs-used-right/). | "Download" and "Copy Markdown" exist but push the H1 down on mobile (`DocItem/Layout/index.tsx:25-86`). |
| 9 | **Design dark mode rather than inverting light mode.** | One token set with explicit light and dark values. Surfaces step up in lightness to show elevation, and the same accent hue appears in both modes. | Cohere's paired light and dark `oklch` ramps (https://docs.cohere.com/). Claude's `data-mode` tokens. | Three greys plus black in dark mode. The light purple is reused in dark mode (`custom.css:693,757,774,911,929`). Black code blocks sit on a grey page. |
| 10 | **Make accessibility the default.** | Visible focus, 24px minimum targets, a three-state theme toggle with labels, and links in prose that do not rely on color alone. | Cloudflare "Toggle theme (light, dark, system)" (https://developers.cloudflare.com/workers/). | Nav tabs are `<button>`s (`TutorialTabs.tsx:69-96`). Carets are invisible until hover (`custom.css:779-783`). The cookie banner and the Product Fruits tab cover content. |

---

## 2. Token set

**Source of truth:** a new `src/design/tokens.js` (CommonJS so `tailwind.config.js` can `require` it). A small build script generates `src/css/tokens.css` from it. The MUI theme (while it remains) and the Prism themes import the same module, so primary purple is defined once instead of five times.

### 2.1 Fonts

| Role | Recommended (free, OFL) | Alternatives | Notes |
|---|---|---|---|
| UI and body | **Inter Variable 4.x** (already in use) | Geist (OFL), IBM Plex Sans (OFL) | Replace `.ttf` with the official `InterVariable.woff2` and `InterVariable-Italic.woff2` (`custom.css:65-78`). Subset to Latin plus Latin Extended. Preload the upright file. Enable `font-feature-settings: "cv05", "cv08"` (a tailed lowercase l and an upper-case I with serifs) so l, I and 1 are distinct in API names. Remove the global `letter-spacing: -0.0125em` from body text (`custom.css:148-152`) and apply negative tracking to headings only. |
| Display (H1 and home hero only) | **Inter Display**, the `opsz` axis of Inter 4 | A licensed Snowplow brand face, if brand guidelines specify one | Use it for headings 30px and larger only. |
| Mono | **JetBrains Mono** (OFL), weights 400 and 600, woff2 | Geist Mono (OFL), IBM Plex Mono (OFL) | Researched sites that pair a neutral sans with a distinct mono read as the most refined (Cloudflare and Fumadocs use JetBrains Mono, Vercel uses Geist Mono). |

```css
--font-sans: "InterVariable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
--font-display: "InterDisplay", var(--font-sans);
--font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
```

### 2.2 Type scale

The base is 16px. Use rem in code: 1rem = 16px.

| Token | Size / line-height | Weight | Tracking | Use |
|---|---|---|---|---|
| `text-xs` | 12px / 16px | 500 | +0.01em | Badges, kbd, footnotes |
| `text-sm` | 14px / 20px | 400–500 | 0 | Sidebar, navbar, table cells, captions |
| `text-toc` | 13px / 20px | 400 | 0 | TOC, breadcrumbs |
| `text-base` (prose) | 16px / 28px (1.75) | 400 | 0 | Body text |
| `text-lede` | 18px / 28px | 400, `--fg-muted` | 0 | Summary under the H1, from frontmatter `description` |
| `code-inline` | 0.875em | 400 | 0 | Inline `code` |
| `code-block` | 13.5px / 22px | 400 | 0 | Code blocks |
| H4 | 16px / 24px | 600 | 0 | Rare |
| H3 | 18px / 28px | 600 | -0.005em | Margin 32px above, 8px below |
| H2 | 24px / 32px | 600 | -0.015em | Margin 48px above, 12px below. No border. |
| H1 | 36px / 44px (30px / 38px under 768px) | 650 | -0.022em | Margin 0 above, 8px below |
| Hero (home only) | 48px / 56px (36px / 44px on mobile) | 600 | -0.025em | Display face |

H2 drops from weight 700 to 600, and H3 from 20px to 18px. The current H2 at 700 is too heavy next to Inter body text.

### 2.3 Widths and layout

| Token | Value |
|---|---|
| `--shell-max` | 1440px (90rem) |
| `--navbar-h` | 56px |
| `--sidebar-w` | 272px (17rem). Replaces the 330px value and the conflicting 272px rule (`custom.css:124`, `954-957`). |
| `--toc-w` | 224px (14rem) |
| `--prose-max` | 672px (42rem) |
| `--wide-max` | 896px (56rem), for code, tables, diagrams and card grids |
| `--gutter` | 32px on desktop, 24px on tablet, 16px on mobile |
| Column gap | 48px between sidebar and content, 48px between content and TOC |

Remove `.container { padding-left: 100px }` and `main { margin-left: 40px }` (`custom.css:280`, `285`).

### 2.4 Spacing

Use the Tailwind default 4px scale as the only scale, and ban arbitrary `[..px]` values in review. Allowed steps: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px. Rhythm in prose:

- Paragraph: 16px below.
- List item: 6px below.
- Block elements (code, callout, table, figure): 24px above and below.

### 2.5 Color

All values are hex. In `tokens.css`, store them as HSL channels so Tailwind's `hsl(var(--x) / <alpha-value>)` pattern keeps working.

**Neutrals (zinc-based)**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#ffffff` | `#0f0f11` | Page, navbar and sidebar (one plane) |
| `--bg-subtle` | `#fafafa` | `#141417` | Code blocks, table headers, home bands |
| `--surface` | `#f4f4f5` | `#1a1a1e` | Hover, inline code, kbd |
| `--surface-raised` | `#ffffff` | `#202024` | Popovers, search modal, dropdowns |
| `--border` | `#e4e4e7` | `#27272a` | Hairlines, cards, code |
| `--border-strong` | `#d4d4d8` | `#3f3f46` | Table rules, hover border |
| `--border-input` | `#71717a` (4.83:1) | `#8b8b94` (5.67:1) | Form controls (non-text contrast of 3:1 or more) |
| `--fg` | `#18181b` (17.7:1) | `#f4f4f5` (17.4:1) | Headings, body text |
| `--fg-muted` | `#52525b` (7.7:1) | `#a1a1aa` (7.5:1) | Lede, sidebar items, TOC |
| `--fg-subtle` | `#71717a` (4.8:1) | `#8b8b94` (5.7:1) | Captions, breadcrumb separators, metadata |

Dark-mode body text moves from `#999` on `#1b1b1d` (about 6.3:1) to `#f4f4f5`/`#d4d4d8` on `#0f0f11`. Use `--fg` for prose. Dark prose should not be dimmed to grey.

**Brand accent (Snowplow purple, one hue)**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--accent` | `#6638b8` (7.4:1 on white) | `#a98bf0` (7.0:1 on `#0f0f11`) | Links, active nav text, focus ring, primary button background |
| `--accent-hover` | `#532d97` | `#c4b0f5` | Link and button hover |
| `--accent-fg` (text on an accent fill) | `#ffffff` | `#0f0f11` | Primary button label |
| `--accent-subtle` | `#f5f1fc` | `#1d1830` | Active sidebar item background, selected tab |
| `--accent-subtle-fg` | `#532d97` (8.6:1 on subtle) | `#c4b0f5` (8.9:1 on subtle) | Active sidebar item text |
| `--accent-border` | `#d9c9f2` | `#4c3a7a` | Focused or selected card border |
| `--accent-underline` | `#6638b8` at 35% alpha | `#a98bf0` at 40% alpha | Underline on prose links |

**Retire:**
- The orange `#fc5e35` (`custom.css:112`). Two accents break principle 1.
- The hardcoded Infima ramp (`custom.css:106-111`, `132-146`).
- `#f0ebf8` and `#412476` (`custom.css:337-338`).
- The `hsla(261.56,53.33%,47.06%,0.12)` literals.

**Semantic colors (callouts and status badges)**

| Type | Light bg / border / icon and title | Dark bg / border / icon and title |
|---|---|---|
| Note (also `info`) | `#eff5ff` / `#c7d9fb` / `#1e4fa3` (7.1:1) | `#121a2b` / `#24365c` / `#93b4f5` (8.4:1) |
| Tip | `#effaf3` / `#bfe5cc` / `#166534` (6.7:1) | `#0f1f17` / `#1f4a32` / `#7dd3a0` (9.5:1) |
| Warning | `#fff8eb` / `#f5d9a6` / `#8a4b06` (6.4:1) | `#231a0b` / `#5a4214` / `#f5c46b` (10.6:1) |
| Danger | `#fef3f2` / `#f6c9c4` / `#b42318` (6.1:1) | `#2a1311` / `#5e2520` / `#f7a19a` (8.8:1) |

Body text inside a callout uses `--fg`. Only the icon and title take the semantic color.

### 2.6 Radii, borders and shadows

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Inline code, kbd, small badges |
| `--radius-md` | 6px | Buttons, inputs, tabs, sidebar items |
| `--radius-lg` | 8px | Cards, callouts, code blocks, tables, search modal |
| `--radius-xl` | 12px | Home page product panels only |
| `--radius-full` | 9999px | Status dots and pill toggles only |
| Border | 1px solid `--border` everywhere. No left-accent bars thicker than 1px. | |
| `--shadow-none` | Default for cards, code and callouts | Flat surfaces |
| `--shadow-sm` | `0 1px 2px rgb(16 16 20 / 0.05)` | Card hover (together with `--border-strong`) |
| `--shadow-pop` | Light: `0 8px 24px -6px rgb(16 16 20 / 0.12), 0 0 0 1px var(--border)`. Dark: `0 8px 24px -6px rgb(0 0 0 / 0.6), 0 0 0 1px var(--border)` | Dropdowns, search, page-actions menu |
| `--focus-ring` | `0 0 0 2px var(--bg), 0 0 0 4px var(--accent)` (or `outline: 2px solid var(--accent); outline-offset: 2px`) | Every interactive element |

Fix the Tailwind radius mapping (`tailwind.config.js:47-51`). It currently maps `lg`/`md`/`sm` to 4/2/0px, which is why `rounded-xl` falls back to Tailwind's 12px default. Set `sm: 4px`, `md: 6px`, `lg: 8px`, `xl: 12px`.

**Motion:** 120ms `ease-out` for hover and color changes, 180ms for menus. Wrap everything in `@media (prefers-reduced-motion: reduce)`. No entrance animations on doc pages.

---

## 3. Layout specification

### 3.1 Navbar (56px, sticky, `--bg` with a 1px bottom `--border`)

```
[logo] [Snowplow CDI ▾] | Docs  Tutorials  Releases  API reference      [Search… ⌘K] [Ask AI] [◐] [GitHub] [Console ↗]
```

- **Product switcher** (inspired by the Mintlify Products dropdown and Claude's product tabs).
  - A 32px-high button: current product name in 14px/500 with a chevron.
  - It opens a 320px popover with two rows. Each row has an icon, the name and a one-line description: "Snowplow CDI: collect, validate and model behavioral data" and "Signals: compute and serve real-time customer attributes". A third row links to "Fundamentals: concepts shared by both products".
  - Selecting a row navigates to that product's landing page. The sidebar then shows only that product's tree.
  - The rows are real `<a>` links.
- **Section tabs:** Docusaurus `type: 'doc'` or `to` navbar items, plain links styled as 14px/500 `--fg-muted`. The active tab uses `--fg` with a 2px `--accent` bottom border flush with the navbar edge. They replace the MUI `TutorialTabs` buttons (`src/components/tutorials/TutorialTabs.tsx:69-96`) and the hacks at `custom.css:1312-1341`.
- **Search:** an in-flow flex item 240–320px wide with a 32px-high `--surface` field, 6px radius and a `⌘K` kbd hint. Remove the 11 `!important` rules that position it with `fixed` (`custom.css:242-276`).
- **Ask AI:** a ghost button with a sparkle icon. It opens the assistant (DocSearch v4 AskAI or the current assistant).
- **Theme toggle:** three states (Light, Dark, System), shown as an icon button with a menu. `aria-label="Theme: System"`.
- **Breakpoints:** use only Infima's 996px. Delete the 1070px rule in `src/theme/NavbarItem/styles.module.css:19-26`. From 996px to 1279px, hide GitHub and Console behind a "More" menu.

### 3.2 Sidebar (272px, sticky below the navbar, scrolls independently)

- **Top:**
  - Product name in 13px/600 with its landing-page link.
  - A "Filter" input, 32px high. It narrows the tree on the client, as Cloudflare's "Filter navigation" does (https://developers.cloudflare.com/workers/).
- **Group labels:**
  - 12px/600, `--fg-subtle`, uppercase, +0.04em tracking.
  - 24px above, 4px below.
  - Not collapsible. This replaces the section-header swizzle.
- **Items:**
  - 14px/20px `--fg-muted`, 32px minimum row height (above the 24px target size), 8px horizontal padding, 6px radius.
  - Hover: `--surface`.
  - Active: `--accent-subtle` background, `--accent-subtle-fg` text, weight 500.
  - Nested levels indent 12px and show a 1px `--border` guide line.
- **Carets:** always visible at `--fg-subtle`. They rotate 90° when expanded and have a 24×24px hit area. This fixes the hover-only carets (`custom.css:779-783`, `935-946`).
- **Footer (optional):** a "Back to all products" link.
- **IA groups:** use lifecycle verbs, in the style of RudderStack (https://www.rudderstack.com/docs/) and Tecton (https://docs.tecton.ai/docs/introduction).
  - CDI: Get started · Collect · Validate · Enrich · Load · Model · Forward · Operate · Reference.
  - Signals: Get started · Concepts · Define attributes · Publish · Serve · Intervene · Monitor · Reference.
  - Fundamentals is shared and linked from both.

### 3.3 Content column

From top to bottom:

1. **Header row:**
   - Breadcrumbs on the left: 13px `--fg-subtle`, `›` chevron separators, the current page in `--fg-muted`, and no underline. Breadcrumbs truncate the middle when they overflow.
   - Page actions on the right: a split button "Copy page" plus a ▾ menu (View as Markdown, Download, Open in Claude, Open in ChatGPT, Copy MCP server URL). Both sit in one 32px row.
2. **H1**, then a **lede** (frontmatter `description`, 18px `--fg-muted`), then a **badge row** (availability, lifecycle, minimum version). 32px gap to the body.
3. **Body** at `--prose-max` 672px. `.wide` and `figure`/`table`/`pre` wrappers may extend to 896px. Use a CSS grid with named lines so breakouts don't need `!important`. Keep the idea at `custom.css:1350-1371` but rewrite it.
4. **Footer:**
   - "Was this page helpful?" (Yes/No).
   - "Edit this page" and "Last updated" in 13px `--fg-subtle`.
   - Prev/Next cards: 1px border, 8px radius, label 12px `--fg-subtle`, title 15px/500.

### 3.4 TOC (224px, sticky at `top: calc(var(--navbar-h) + 24px)`)

- Label: "On this page", 12px/600 uppercase `--fg-subtle`.
- Items: 13px/20px `--fg-muted`, 4px vertical padding, with a 1px `--border` rail on the left. The active item shows a 2px `--accent` segment on the rail and `--fg` text. H3 items indent 12px.
- Remove `.theme-doc-toc-desktop { position: static !important }` (`custom.css:860`) and the cancelled indent rules (`422-424` vs `1027-1029`).
- **Below the TOC:** nothing animated.
  - Option A: nothing at all.
  - Option B: one static 13px text link ("Talk to us about Snowplow →") under a 1px divider.
  - Either way, delete `Demo_Ad`, `InteractiveBanner.tsx` and the fake "Booking…" spinner.
- The TOC is hidden below 1200px. Between 996px and 1199px, the "On this page" disclosure moves under the lede.

### 3.5 Mobile (under 996px; design target 390px)

- **Navbar:** 56px with the logo, a compact product switcher (product name only, 13px), a search icon button and a menu button. All targets 40×40px.
- **Above the H1:** one breadcrumb line only ("‹ Parent page"). Page actions collapse into a `⋯` icon button on the right of that line. **Goal:** the H1 starts at 140px or less from the top of the viewport. It starts at about 330px today (`tracker-light-390.png`).
- **TOC:** an "On this page" disclosure placed **after** the lede, not above the H1.
- **Drawer:** a full-height sheet with the product switcher at the top (two segmented buttons, CDI and Signals), the filter input, the current product's tree only, and the theme toggle at the bottom. Replace the no-op `src/theme/Navbar/MobileSidebar/index.js`.
- **Overflow:**
  - Remove the blanket `overflow-x: hidden !important` (`custom.css:1530-1567`) and `hyphens: auto !important` on every `div`.
  - Tables and code scroll inside their own wrappers (`overflow-x: auto`, with a fade on the right edge).
  - Inline `code` uses `overflow-wrap: anywhere` and is never hyphenated.
- **Mermaid:** render at natural size inside a horizontally scrolling `figure` with an "Expand" button that opens a full-screen dialog. Delete the `scale(0.5)`/9px rules and the emoji `::after` (`custom.css:1596-1699`).
- **Overlays:** the cookie banner and the feedback tab must not cover focused content (WCAG 2.2 SC 2.4.11). Show the consent banner as a bottom sheet that reserves space while open. Remove the Product Fruits side tab from docs pages and use the in-page feedback component instead.

---

## 4. Component set

### 4.1 Standardize

| Component | Spec | Replaces or merges | Reference |
|---|---|---|---|
| **`<Card>` and `<CardGrid cols={2\|3}>`** | Variants: `link` (title + one line + →), `product` (icon, title, description, three fixed links: Quickstart / Reference / SDKs), `quickstart` (product tag, title, "≈ 10 min"), `compact` (icon + title). 1px `--border`, 8px radius, 20px padding. Hover: `--border-strong` + `--shadow-sm`. Titles are `<h3>` (or a configurable `as`), 16px/600. The whole card is one `<a>`. Gap 16px. Always `not-prose`. | `CardGrid.tsx` (FeaturedSection, CallToActionCard, LinkCard), `ui/card.tsx`, `ui/card-hover-effect`, `.cta-card`, `.link-card`, `.sources-grid` CSS, and the Infima DocCard through a wrap of `src/theme/DocCardList` | Claude HomePlatformCards; Mintlify Cards; Vercel cards |
| **`<Button>`** (`ui/button.tsx`, cva) | `primary` (accent fill), `secondary` (border), `ghost`, `link`. Sizes sm 32px, md 36px, lg 40px. 6px radius, 14px/500. | `.snowplow-button`, `.cta-button`, `.featured-section-button` (`custom.css:315-410`, `1718-1740`) | |
| **Callouts** (Docusaurus admonitions, restyled with CSS only) | 1px semantic border on all sides, semantic background, 8px radius, 16px × 16px padding. A 16px lucide icon and title (14px/600) on one line. No uppercase labels. Four types: `note` (with `info` as an alias), `tip`, `warning`, `danger`. Lint rule: at most two callouts per screen. | Stock Infima admonitions. Map `caution` to `warning`, including the auto-injected one in `MDXContent/index.js:21-60`. | Starlight Asides; Stripe |
| **`<Steps>`** | A numbered vertical rail: 24px circles (12px/600, `--surface` fill, `--border`) joined by a 1px line. Each step title renders as a real `###`, so it is anchorable and shows in the TOC. Optional per-step `<Badge>` ("Optional", "Server-side"). | Hand-written numbered H3s | Mintlify Steps (`id`); Stripe step badges; Claude quickstart |
| **Code block** | `--bg-subtle` background (it is now distinct from the page in both modes), 1px border, 8px radius. A 36px header with the filename or title (13px/500 `--fg-muted`), a language label (12px `--fg-subtle`, no pill) and copy and wrap icon buttons that are always visible. Line highlight: `--accent-subtle` with a 2px accent left edge. Aligned to the prose edge, with no extra indent. One Prism theme pair (see section 6). | The ejected `CodeBlock/Layout` pill header (`:53` `!static !opacity-100`), the padding fights at `custom.css:1455` vs `1517`, and `docusaurus-theme-github-codeblock` (keep only if used; otherwise remove) | Vercel; Cloudflare |
| **`<CodeGroup>`** (language tabs attached to code) | Built on `<Tabs groupId="lang" queryString>`. The tabs sit inside the code header (13px, active = `--fg` with a 2px accent underline), so the tabs and code read as one object. The choice persists across the site. groupIds: `lang`, `platform`, `pkg`, `cloud`. | Indented `.tabs-container` with a hover border (`custom.css:1213-1232`) | OpenAI content switcher; Claude 9-language tabs; Cloudflare CLI toggle |
| **`<ParamTable>` / `<ParamField name type required default since>`** | Each row shows `name` (mono, 600), `type` (mono `--fg-subtle`), a "Required" badge, the default and the description. It wraps on mobile. Each parameter has a copy-link anchor. Nested objects expand. The same component serves tracker config, loader config and Signals API fields. | Static uses of `MarkdownTableAsMui` (`@mui/x-data-grid-premium`). Keep a data grid only for large filterable catalogs. | Claude API reference; Stripe Parameters; Segment settings tables |
| **`<Badge>`** | 20px high, 12px/500, 4px radius, a 1px border and a tinted background from the semantic tokens. Kinds: `availability` (Cloud / Private Managed Cloud / Self-hosted), `lifecycle` (GA, Beta, Preview, Deprecated), `tier` (Flagship, Maintained, Community), `version` ("Requires v4.2+"). The tooltip uses the existing Radix popover in `components/ui`. | `src/components/Badges.js` (shields.io, `img_ev3q`, legacy links) and the MUI Tooltip version of `availability-badges.tsx` | Segment tiers; Amplitude labels; dbt "Applies to" |
| **`<AtAGlance>`** | A two-column key-value block under the lede (for example: Availability, Effort, Prerequisites, Related schema). 1px border, `--bg-subtle`. | Ad hoc intro tables | Stripe "Integration effort" block; Anthropic "at a glance" |
| **`<Figure>` for diagrams** | Mermaid themed from the tokens (`themeVariables`: primaryColor `--accent-subtle`, lineColor `--border-strong`, fontFamily `--font-sans`). Uses ELK layout (Docusaurus 3.9+). A required `caption` and a text alternative (numbered steps or `<details>`). An Expand dialog. | `mermaidEnlarge` client module plus mobile scaling CSS | kapa.ai: restate diagrams as steps |
| **`<PageActions>`** | Split button with a menu, as specified in section 3.3. "Open in Claude" uses `https://claude.ai/new?q=` and "Open in ChatGPT" uses `https://chatgpt.com/?q=`, each with "Read {page}.md and help me…". | The current Download/Copy Markdown row | Mintlify contextual menu; Stripe; Cloudflare |
| **`<Feedback>`** | "Was this page helpful?" with Yes/No (36px buttons). After a click, an optional 280-character textarea. Sends a self-describing Snowplow event, so the docs use the product. | Product Fruits "Feedback" side tab on doc pages | Stripe, Supabase, Fern |
| **Heading anchor** | A link icon that appears on hover and focus. A click copies the URL and shows a toast ("Link copied"). | Docusaurus "Direct link to" hash | Vercel, Anthropic, OpenAI |
| **`<Accordion>`** (`ui/accordion`) | FAQ blocks at the foot of a page. Never for required steps. | | Anthropic FAQ |
| **`<FeatureMatrix>`** | A sticky first column, ✓ / — / "Beta" cells (with text, not icons alone), column filters through the query string. Used on the tracker hub, the destinations hub and Signals variants. | Hand-written Markdown tables on hubs | PostHog libraries; Segment methods chart; Feast matrix |

### 4.2 Retire or merge

- **Delete:**
  - `InteractiveBanner.tsx`, `Demo_Ad` and the `framer-motion` and `motion` dependencies.
  - `src/pages/index.module.css` (`.heroBanner`).
  - `tailwind-full-config.js` (0 bytes).
  - `customFields.webpack.configure` (`docusaurus.config.ts:282-325`).
  - The `src/theme/DocPage/*` v2 swizzle. Move `Paginators` to `src/components/tutorials/`.
  - The verbatim `src/theme/SearchBar` eject.
  - The no-op `Navbar/MobileSidebar`.
- **Merge into `<Card>`:** CardGrid's three variants, `ui/card`, `card-hover-effect`, and the DocCardList rendering.
- **Merge into `<Button>`:** the three CSS button classes.
- **Merge into `<Badge>`:** `Badges.js` and `availability-badges.tsx`.
- **Icons:** replace FontAwesome (all of `fab`/`fas`/`far` registered in `src/theme/MDXComponents.js:4-19`) and `@mui/icons-material` with `lucide-react`, plus a small set of brand SVGs for tracker logos.

---

## 5. Home page and section landing pages

### 5.1 Docs home (`docs/introduction.md`, `slug: "/"`)

Render it with `layout: home` frontmatter. The existing swizzled `DocItem/Layout` then drops the breadcrumbs, page actions and TOC and uses the `--shell-max` width. No new route is needed.

1. **Hero** (two columns at 1200px and wider, stacked below):
   - **Left:** H1 "Snowplow documentation" (48px), a one-sentence lede, and a 48px search field that opens DocSearch, with suggested queries as chips ("JavaScript tracker", "failed events", "Signals attributes").
   - **Right:** a "Use these docs with your coding agent" panel: an `--bg-subtle` code block with tabs for Claude Code, Cursor and Codex, the MCP add command, plus `llms.txt` and an `AGENTS.md` snippet with Copy buttons. The agent-setup pattern comes from Gemini (https://aistudio.google.com/docs), Vercel (https://vercel.com/docs) and Cloudflare (https://developers.cloudflare.com/). It replaces the hero MCP link that exists today.
2. **Choose your product:**
   - Two equal `product` cards, each with a 12px radius and 24px padding.
     - **Snowplow CDI:** Quickstart · Tracker reference · Trackers and SDKs.
     - **Signals:** Quickstart · Signals API and SDK reference · Define attributes.
   - Each card shows a three-line snippet (`snowplow('trackPageView')` and a Signals `get_attributes` call).
   - Pattern: Claude's "Choose how you build" (https://platform.claude.com/docs/en/home).
3. **From first event to production:**
   - A lifecycle strip with a tab per product and four columns of three or four links each.
     - CDI: Collect → Validate → Load and model → Activate.
     - Signals: Define → Publish → Serve → Intervene.
   - Pattern: Claude's "From idea to production".
4. **Quickstarts:**
   - A filterable grid (All / CDI / Signals / Self-hosted) of `quickstart` cards with "≈ N min". The filter state goes in `?filter=`.
   - Pattern: Mistral (https://docs.mistral.ai/), with filters linkable as in mParticle.
5. **"I want to…":**
   - A two-column routing table (task → best page) with about 8 rows.
   - Pattern: Claude Code overview (https://code.claude.com/docs/en/overview).
6. **What's new:**
   - The three latest release entries, each with a date and a badge, plus "All releases →".
   - Pattern: Vercel and Cloudflare.
7. **Resources band** (`--bg-subtle`): Fundamentals, Tutorials, Community, Console, Status.

### 5.2 Product landing page (for example `docs/signals/index.md`)

Use the PostHog hub pattern (https://posthog.com/docs/product-analytics) combined with a Hopsworks-style persona router (https://docs.hopsworks.ai/latest/):

- H1, lede and a badge row.
- A short conceptual overview of two paragraphs and one diagram (`<Figure>` with a caption). This is the "conceptual overview" document type from Hillel Wayne's critique of Diátaxis.
- A primary button "Start the quickstart (≈ 15 min)" and a secondary button "View API reference".
- **"Find your path":** three `link` cards by role (App developer, Data engineer, ML engineer).
- **"How it works":** a `<Steps>` overview of the lifecycle verbs, each step linking to its sidebar group.
- Reference cards, then "What's new in Signals".

### 5.3 Section hub page (catalogs: trackers, destinations, dbt packages)

- H1, lede and `<AtAGlance>`.
- A `<FeatureMatrix>` as the first block:
  - Trackers: page/screen views, activity tracking, built-in entities, anonymous tracking, media, e-commerce, Snowtype, consent, plus a tier badge.
  - Destinations: cloud, delivery (batch or stream), entity handling, lifecycle.
- Then a filterable `CardGrid` of the integrations.

### 5.4 Integration page template

Use the same H2s in the same order on every page (Hightouch, Fivetran):

1. Overview, with `<AtAGlance>` and badges.
2. Compatibility (a table).
3. Connect (`<Steps>`).
4. Configure (`<ParamTable>`).
5. Troubleshooting, with exact error strings mapped to fixes.

That is five H2s, inside the 3–5 limit in CLAUDE.md.

---

## 6. Technical implementation in Docusaurus

### 6.1 Where each change lives

| Layer | Owns | Does not own |
|---|---|---|
| `src/design/tokens.js` → generated `src/css/tokens.css` | Every color, font, radius, shadow and width, in `:root` and `[data-theme='dark']` | |
| `src/css/infima.css` | **Only** Infima variable mapping from the tokens: `--ifm-color-primary*` (computed from `--accent`, not hex), `--ifm-background-color`, `--ifm-navbar-background-color`, `--ifm-font-family-base`/`-monospace`, `--ifm-global-radius: 6px`, `--ifm-code-font-size: 0.875em`, `--ifm-h1/2/3-font-size`, `--ifm-heading-font-weight: 600`, `--ifm-line-height-base: 1.75`, `--ifm-toc-border-color`, `--ifm-menu-color-background-active`, `--ifm-alert-*`, `--ifm-tabs-*`, `--doc-sidebar-width: 272px` | Selectors on hashed classes |
| `src/css/base.css` | `.markdown` typography (prose rhythm, link underline, table and inline code styles) and the content grid with named breakout lines | |
| `src/css/chrome.css` | Navbar, sidebar, TOC, breadcrumbs and admonition styling, targeting **only** stable hooks: `ThemeClassNames` (`.theme-doc-sidebar-*`, `.theme-doc-toc-desktop`, `.theme-admonition-*`, `.theme-code-block`), Infima BEM classes (`.menu__link`, `.navbar__item`, `.table-of-contents__link`, `.pagination-nav__link`, `.alert--*`, `.tabs__item`) and data attributes | `[class*=…]`, `[class^=…]`, `_xxxx` hashes, `.css-…` emotion classes, `sidebar_node_modules-…` dev names |
| `tailwind.config.js` | Maps theme colors, radii, fonts and spacing to the token CSS variables; holds the component utilities used inside React components | Global element styles |
| Swizzled components | Structure only (new markup), never colors | |

**Target:** `custom.css` (1,791 lines) becomes a five-file import tree of about 450 lines in total, with **10 or fewer `!important`** declarations, each commented with a reason. A rewrite works better than incremental edits, because the duplicated blocks at `645-800` vs `864-946` and `995` vs `1032` cannot be untangled safely.

### 6.2 Removing `!important` and the Infima/Tailwind conflicts

1. **Step 1, safe:** change `important: true` to `important: '#__docusaurus'` in `tailwind.config.js:131`. Utilities win by specificity instead of through `!important`.
2. **Step 2:** upgrade Tailwind 3.3.0 to 3.4.x, which needs no config migration. Fix the content glob from `docusaurus.config.js` to `docusaurus.config.ts`. Keep `preflight: false`.
3. **Step 3:** enable `future.v4.useCssCascadeLayers: true` in `docusaurus.config.ts` (a `future` block already exists at line 26). Infima then sits in a layer, and Tailwind's output and `src/css/*` stay unlayered, so they beat Infima without specificity hacks. Then set `important: false`. Run visual regression after this step: the layer order changed behavior in 3.8, per the forum report in the devtools research.
4. **Drop `@tailwindcss/typography` from the doc body.** Remove `prose` at `DocItem/Layout/index.tsx:123` and style `.markdown` from the tokens in `base.css`. This deletes the `!important` reset block at `custom.css:190-240` and the `.link-card` color fights (`1765-1781`). Components that sit inside Markdown use `not-prose` until the cleanup is done.
5. **Fix invalid values:**
   - `--tw-prose-pre-bg: hsl(var(--prism-background-color))` (`tailwind.config.js:105`)
   - `--ifm-alert-background-color: null` (`custom.css:1205-1207`)
6. **Add stylelint to CI:**
   - `declaration-no-important` set to error, with disable comments counted against a budget of 10.
   - `selector-disallowed-list`: `/\[class[\*\^]=/`, `/_[A-Za-z0-9]{4}\b/`, `/\.css-[a-z0-9]+/`, `/node_modules/`.

### 6.3 Isolating MUI

- Remove `CssVarsProvider` from `src/theme/Root.js:56-57`. Create `src/components/MuiScope.tsx`, which lazy-loads the provider and emotion cache. Wrap only `JsonSchemaValidator` (RJSF MUI), `DbtSchemaSelector` and data-grid tables in it, each behind `React.lazy` with `BrowserOnly`. MUI and emotion then load only on the pages that use them.
- Rewrite the layout code paths without MUI:
  - `DocRoot/Layout/Main/index.tsx` (`Grid`) and `DocItem/Layout/index.tsx:17,129` (`Paper`, `useMediaQuery`) with Tailwind and CSS.
  - `TutorialTabs` with navbar links.
  - `TutorialList/styledComponents.tsx` with Tailwind.
  - `FirstSteps` with `<Steps>`.
- Delete the MUI color-mode sync in `src/theme/ColorModeToggle/index.js:8-17`. While MUI remains inside `MuiScope`, build its theme from `tokens.js` and read `data-theme` on mount.
- Delete the CSS targeting emotion hashes (`custom.css:1373-1400`).
- **Later decision:** replace `@mui/x-data-grid-premium` (commercial) with TanStack Table and the Tailwind `FeatureMatrix`, if usage confirms that only sorting and filtering are needed.

### 6.4 Swizzle policy

Prefer **wrap** over **eject**, and keep a `src/theme/SWIZZLES.md` with the reason for each swizzle and the upstream version it was taken from.

| Action | Components |
|---|---|
| **Delete** | `DocPage/*`, `SearchBar`, `Navbar/MobileSidebar` |
| **Replace with config and CSS, then delete** | `DocSidebarItem/Category` (202 lines): use sidebar `type: 'html'` group labels or the category `className`. `TOCCollapsible`: restyle through CSS. `DocBreadcrumbs/Items/Home`: no longer needed after the restyle. |
| **Keep ejected and re-sync to 3.10** | `DocItem/Layout` (header row, `layout: home`, badge row), `CodeBlock/Layout` and `CodeBlock/Buttons`, `PaginatorNavLink` |
| **New wraps** | `DocItem/Footer` (`<Feedback>`, Edit, Last updated), `Heading` (copy link), `ColorModeToggle` (three-state, no MUI), `NavbarItem/ComponentTypes` (registers `custom-productSwitcher`), `Admonition/Icon/*` (lucide icons only) |
| **Config** | `themeConfig.colorMode = { defaultMode: 'light', respectPrefersColorScheme: true }`, which is missing today. `prism.theme` / `darkTheme` become a matched pair generated from `tokens.js` (start from `prism-react-renderer` `oneLight`/`oneDark` and override the background to `--bg-subtle`) instead of `github` + `vsDark` (`src/theme/PrismThemes/*`). Separate `cdi` and `signals` sidebars in `sidebars.js`, with per-product navbar `docSidebar` items driving the switcher. URLs do not change. |

### 6.5 Performance

- Fonts:
  - Use woff2 (Inter Variable is about 345 KB; the subset is smaller).
  - Preload through `headTags`.
  - Set `font-display: swap`.
  - Add `size-adjust` fallback metrics to limit CLS.
- Remove FontAwesome's global registration, `framer-motion` and `motion`.
- Load the KaTeX CSS only on pages with math, and self-host it instead of loading 0.13.24 from jsdelivr.
- Audit the six always-on client modules (`docusaurus.config.ts:38-45`) plus Product Fruits. Defer Qualified and Reo until consent and idle.

### 6.6 Accessibility checks (WCAG 2.2 AA)

| Check | Requirement | How it is met or tested |
|---|---|---|
| Text contrast (1.4.3) | 4.5:1 for body text, 3:1 for text 18.66px bold and larger | All token pairs in section 2.5 are 4.8:1 or higher. Add a unit test that recomputes the ratios from `tokens.js`. |
| Non-text contrast (1.4.11) | 3:1 for control boundaries and focus indicators | `--border-input` reaches 4.8:1 (light) and 5.7:1 (dark). The focus ring is the accent at 7.4:1 and 7.0:1. Decorative hairlines are exempt. |
| Use of color (1.4.1) | Links in prose must not be distinguished by color alone | Prose links are underlined: `text-decoration-thickness: 1px`, `text-underline-offset: 3px`, using `--accent-underline`. |
| Focus visible (2.4.7) and Focus not obscured (2.4.11, new in 2.2) | | A global `:focus-visible` ring. `scroll-padding-top: calc(var(--navbar-h) + 16px)`. The sticky navbar, cookie sheet and feedback UI must not cover the focused element. Test with keyboard-only runs at 390px and 1440px. |
| Target size (2.5.8, new in 2.2) | At least 24×24px | Sidebar rows are 32px, carets have a 24px hit area, icon buttons are 32–40px, and badges are not interactive. |
| Headings and names | | Card titles are headings. Nav tabs are links. The theme toggle has a label that states the current mode. Icons have `aria-hidden`. No emoji in CSS `content`. |
| Reflow (1.4.10) | No two-dimensional scrolling at 320px except tables and code | Remove the blanket `overflow-x: hidden`. Playwright asserts that `scrollWidth <= innerWidth` on 20 URLs. |
| Motion (2.3.3) | | `prefers-reduced-motion` disables transitions. No autoplay animation. |
| Tooling | | `@axe-core/playwright` in CI on 20 representative URLs × light and dark × 390px and 1440px, with 0 serious or critical issues allowed. Lighthouse CI accessibility score ≥ 98. Also run a manual NVDA/VoiceOver pass on the navbar, product switcher, tabs and search. |

---

## 7. Phased rollout

Estimates assume one front-end engineer, part-time design support, and a technical writer for the IA work. Every phase ships on its own.

| Phase | Scope | Effort | Exit criteria |
|---|---|---|---|
| **0. Guardrails** | Playwright visual-regression baselines (20 URLs × 2 themes × 2 widths). Stylelint with an `!important` budget report. Axe in CI. Delete dead code (`DocPage`, `SearchBar`, `MobileSidebar`, `index.module.css`, `tailwind-full-config.js`, `customFields.webpack`). Set `colorMode.respectPrefersColorScheme`. Remove the demo banner and the `motion` and `framer-motion` dependencies. | 1 week | CI green; bundle shrinks; no visual change except the banner |
| **1. Tokens and CSS foundation** | Create `tokens.js` and the generated CSS. Infima mapping from the tokens. woff2 Inter and JetBrains Mono. Tailwind 3.4 with `important: '#__docusaurus'`, then cascade layers and `important: false`. Rewrite `custom.css` into five files. Drop `prose`. Unify the Prism theme pair. Fix the radius mapping. | 2.5–3 weeks | `!important` ≤ 10; no hashed-class selectors; dark mode uses one coherent surface set; visual diffs reviewed |
| **2. Chrome** | Navbar with the product switcher and link tabs. Split `cdi`/`signals` sidebars with the restyle and always-visible carets. TOC. Breadcrumbs and page-actions row. Three-state toggle. Mobile header, drawer and TOC placement. Overlay fixes. | 2–2.5 weeks | H1 140px or less from the top on 390px screens; keyboard pass on the navbar and switcher; Signals pages show only the Signals tree |
| **3. Components** | Card, Button, Badge, callout restyle, CodeBlock and CodeGroup, Steps, ParamTable, AtAGlance, Figure (Mermaid), Feedback, heading copy link. Codemod MDX usages of CardGrid, Badges.js and FontAwesome. Retire the merged components. | 3 weeks | One implementation per component type; FontAwesome removed; component reference page added to the internal style guide (`src/pages/style-guide/`) |
| **4. Home and landing pages** | `layout: home`. New docs home (hero, agent block, product cards, lifecycle strip, quickstart grid, routing table, what's new). Signals and CDI landing pages. Tracker hub `FeatureMatrix`. Destination page template. | 2–2.5 weeks | Both products equally prominent; quickstarts filterable by URL |
| **5. MUI isolation and IA** | Move MUI to `MuiScope` with lazy loading. Rewrite the tutorial layout without MUI. Decide whether to replace the data grid. Regroup the sidebar by lifecycle verbs (editorial work, page by page per Diátaxis guidance, not empty scaffolding). | 2–3 weeks of engineering, plus 4–6 weeks of writer time in parallel | Emotion and MUI absent from the JS on standard doc pages; every sidebar group named by a verb |

**Total:** about 13–16 engineering weeks, with phase 5 editorial work overlapping phases 3 and 4.

**Metrics to track from phase 0:**
- `!important` count: 189 → 10 or fewer.
- CSS lines: 1,791 → about 450.
- JS shipped on a standard doc page (MUI, emotion, motion and FontAwesome removed).
- Axe serious issues: 0.
- Position of the H1 on mobile: about 330px → 140px or less.
- Feedback Yes-rate, collected as a Snowplow event.