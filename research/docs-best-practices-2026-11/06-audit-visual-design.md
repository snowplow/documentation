# Snowplow docs site: visual design and front-end audit

I took screenshots. Dependencies installed through Corepack Yarn 4 (`packageManager: yarn@4.12.0`); Yarn 1 refuses to run this repo. The dev server compiled pages in about 25 seconds. All 16 captures (4 pages × light/dark × 1440/390) plus full-page and mobile-menu shots are in `/tmp/claude-0/-workspace-documentation/45bba125-6784-5ec8-8d9b-f178f09b9186/scratchpad/screens/`.

Notes on the captures:
- Pages: `/docs/` (home), `/docs/signals/introduction/`, `/docs/sources/web-trackers/tracking-events/page-views/` and `/docs/fundamentals/events/`.
- `home-dark-*.png` and `mobile-menu-light-390.png` came out blank because they were taken before the page finished loading. The usable versions are `probe-home-dark-390.png` and `mobile-menu-dark-390.png`.
- I measured computed styles in the browser. Where a value below says "measured", it comes from that.

## 1. Design tokens

**Fonts**
- Inter Variable, self-hosted as `.ttf` (`src/css/custom.css:65-78`). There is no `woff2` file and no subsetting.
- The body has letter-spacing `-0.0125em` (`custom.css:148-152`).
- The monospace font is the default Infima stack (SFMono/Menlo/Consolas…). There is no brand mono font.
- Mermaid on mobile forces its own system font stack (`custom.css:1617`).

**Type scale (measured, 1440px)**

| Element | Size and weight |
|---|---|
| Body | 16px / 26.4px (1.65) |
| H1 | 36px |
| H2 | 24px, weight 700, 48px top margin |
| H3 | 20px |
| Code | 14px |
| Sidebar links | 0.938rem (`custom.css:730`) |
| TOC | 0.875rem (`custom.css:419`) |
| Breadcrumbs | 0.875rem, or 0.75rem on mobile (`custom.css:1042`, `1110`) |

- The scale comes out of `@tailwindcss/typography` `prose` (`src/theme/DocItem/Layout/index.tsx:123`) fighting Infima.
- `custom.css:190-240` resets both with a series of `!important` rules: `.markdown, .prose { font-size: unset !important }` and `.prose-sm`…`.prose-2xl` overrides.

**Colors: there are four parallel palettes**
1. shadcn HSL tokens: `--background`, `--foreground`, `--primary` (light 261.56 53% 47% ≈ `#6638b8`, dark `#916ce7`), `--muted`, and so on (`custom.css:7-63`). Tailwind consumes them (`tailwind.config.js:10-46`).
2. Infima tokens:
   - `--ifm-color-primary` is aliased to `hsl(var(--primary)) !important` (`custom.css:104`).
   - The `-dark`, `-darker`, … ramp is hardcoded hex that doesn't derive from the token (`106-111`).
   - The dark ramp is in a different order: `--ifm-color-primary-light` `#7345c6` is darker than the base `#b198df` (`132-146`).
   - An orange accent `#fc5e35` (`112`) is used only on CTA buttons.
3. MUI theme: `#6638b8` / `#916CE7`, with backgrounds `#F9FAFB` / `#050505` (`src/components/MuiTheme/index.js`).
4. Hardcoded hex in Prism themes and in components:
   - `src/theme/PrismThemes/snowplow-light.js:16-19` and `snowplow-dark.js`
   - `.snowplow-button` (`#f0ebf8`/`#412476`, `custom.css:337-338`)
   - `.featured-section-button` (`#f3f4f6`/`#374151`, `custom.css:1719-1726`)
   - `InteractiveBanner.tsx` (`rgba(102,56,184,…)`)
   - `hsla(261.56,53.33%,47.06%,0.12)` is repeated five times for the sidebar active state, so dark mode uses the light-mode purple (`custom.css:693,757,774,911,929`).

**The page background never uses the design token (measured).**
- `body` is transparent, so the page shows Infima's default background: white in light mode and `#1b1b1d` in dark mode. The navbar is Infima `#242526` in dark mode.
- The shadcn `--background` (`#f9fafb` / `#050505`) shows up only in code blocks (via the Prism `plain.backgroundColor`), cards and the footer gradient.
- In dark mode this produces pure-black code blocks on a dark-grey page (`tracker-dark-1440.png`).
- `--tw-prose-pre-bg: hsl(var(--prism-background-color))` (`tailwind.config.js:105`) wraps a hex value in `hsl()`, so it's invalid.

**Spacing**
- There is no spacing scale. Values are ad hoc px and rem: `padding-left: 100px` on `.container` (`custom.css:280`), `main { margin-left: 40px }` (`285`), `.col { padding: 0 2rem !important }` (`187`), and many 4/6/8/12px values.

**Radii**
- `--radius: 0.25rem` (`custom.css:32`), giving Tailwind `lg`/`md`/`sm` of 4/2/0px (`tailwind.config.js:47-51`).
- Code blocks are hardcoded to 0.5rem (`custom.css:1500`).
- Cards use Tailwind `rounded-lg` (= 4px through the token) while `ui/card.tsx:11` uses `rounded-xl` (the Tailwind default of 12px, because only lg/md/sm are overridden).
- Availability badges are `rounded-full`. There are effectively four radius systems.

**Shadows**
- These are mostly flat, which is good.
- Exceptions: `hover:shadow-md` on cards (`CardGrid.tsx:43,101`), a hardcoded shadow on `.cta-card:hover` (`custom.css:1761`), framer-motion `0 20px 40px rgba(102,56,184,.15)` on the demo banner (`InteractiveBanner.tsx`), and `.theme-code-block { box-shadow: none !important }` (`custom.css:1502`).

## 2. Layout widths and line length

- The sidebar width is defined three times with conflicting values:
  - `--doc-sidebar-width: 330px !important` (`custom.css:124`). This is the value that renders: measured 330px.
  - `width: 272px !important` on a non-existent hashed class (`custom.css:954-957`).
- The content column uses a CSS grid with `--content-max-width: 740px` and a breakout of 960px (`custom.css:1350-1371`). Measured paragraph width is 736px, about 90 characters per line at 16px Inter. That's at the upper limit of comfortable reading (65–80 is typical). The prose `max-w-[740px]` is repeated as magic numbers in `DocItem/Layout/index.tsx:63,123,137`.
- The doc column is capped at `max-width: 75% !important` (`DocItem/Layout/styles.module.css:7`) and the TOC uses `col col--3`, measured at 213px.
- At 1440px the three columns plus `padding-left: 100px` leave a wide dead gutter between the sidebar and the content (visible in every 1440 screenshot).
- `custom.css:1373-1386` and `1395-1400` target MUI emotion hashes (`.css-yu4ftp-MuiDataGrid-root`, `.css-pehwr4`) to place components on the grid. These hashes change whenever the MUI version changes.

## 3. Navbar, sidebar and TOC

**Navbar**
- The navbar holds the logo, Docs/Tutorials tabs (MUI `Tabs` rendered as a custom navbar item, `src/components/tutorials/TutorialTabs.tsx`), a centered search and the color toggle.
- The tabs are `<button>`s that call `history.push` (`TutorialTabs.tsx:69-96`), not links. You can't middle-click or open them in a new tab, and crawlers can't follow them.
- The tab indicator relies on `overflow: visible !important` hacks (`custom.css:1312-1341`).
- The search button is positioned `fixed` at `top:32px; left:50%; transform` with 11 `!important` rules (`custom.css:242-276`), plus breakpoint overrides. This is brittle.
- `src/theme/NavbarItem/styles.module.css:19-26` hides navbar items below 1070px while Infima's own breakpoint is 996px, so the two disagree.
- There is no product switcher between CDI and Signals.

**Sidebar**
- CDI and Signals share one long sidebar. "DATA INFRASTRUCTURE", "SIGNALS" and "COMPONENTS" are small-caps collapsible section headers (`custom.css:461-609`).
- The section-header system lives in `src/theme/DocSidebarItem/Category/index.js:120-164` and is configured through `sidebar_custom_props.header` (for example `docs/signals/index.md:8`).
- Signals' own sidebar starts below about 20 CDI items (`signals-light-1440.png`), so it's weak as a product boundary.
- Category carets are hidden (`opacity:0` / `display:none`) until hover (`custom.css:779-783`, `935-946`). This hurts discoverability and doesn't work on touch.
- The `.menu__*` rule block is duplicated almost verbatim at `custom.css:645-800` and `864-946`, with contradictory values: `border-radius: 0 !important` vs `0.25rem`, and caret `opacity:0` vs `display:none`.
- Collapse-button styling targets dev-only CSS-module class names (`.sidebar_node_modules-\@docusaurus-…`, `custom.css:431,949-976`) and production hashes (`.expandButton_m80_`, `.expandButtonIcon_BlDH`, `850-855`). Each set breaks in the other environment.

**TOC**
- The TOC sits in `sticky top-16` (`DocItem/Layout/index.tsx:144`) under a custom "On this page" label, while `.theme-doc-toc-desktop { position: static !important }` (`custom.css:860`).
- An animated "Want to see a custom demo? / Book a demo" banner (`Demo_Ad` → `InteractiveBanner.tsx`) sits under the TOC on every doc page. It takes visual priority over navigation and loads `motion` (framer-motion) on every page.
- The banner's button fakes a 2-second "Booking..." spinner ("Simulate API call", `InteractiveBanner.tsx`, `AnimatedButton`). Its components have Figma export names such as `Frame941`.
- The TOC nests H2s and H3s with an extra 16px indent rule that is later cancelled (`custom.css:422-424` vs `1027-1029`).

**Breadcrumbs and page actions**
- Breadcrumbs are underlined purple links with `/` separators. Over 100 lines of overrides (`custom.css:995-1117`) have duplicate `.breadcrumbs` blocks at `995` and `1032`.
- "Download" and "Copy Markdown" actions sit under the breadcrumbs (`DocItem/Layout/index.tsx:25-86`). They're useful, but on mobile they push the H1 down.

## 4. Component inventory and inconsistencies

| Layer | Where it's used |
|---|---|
| Infima (Docusaurus default) | Pagination, admonitions, tabs, DocCard (`col col--6` in `src/theme/DocCardList/index.js:23`), footer, menu |
| Tailwind with shadcn-style tokens (preflight off, `important: true`, `tailwind.config.js:129-134`) | `CardGrid.tsx` (FeaturedSection, CallToActionCard, LinkCard), `components/ui/*` (button, card, accordion, dialog, popover, checkbox, input, label, availability badges, card-hover-effect), CodeBlock header, DocItem layout |
| MUI v5 with emotion and the CssVarsProvider in `src/theme/Root.js` | Navbar tabs, tutorial layout (`Grid`, `Paper`, `useMediaQuery` in `src/theme/DocRoot/Layout/Main/index.tsx` and `DocItem/Layout/index.tsx:17,129`), `FirstSteps`, `JsonSchemaValidator` (RJSF MUI), `DbtSchemaSelector`, `MarkdownTableAsMui` (x-data-grid-premium), `availability-badges.tsx` (MUI Tooltip/icons), `TutorialList/styledComponents.tsx` |
| Bespoke global CSS classes | `.snowplow-button`, `.cta-button`, `.featured-section-button`, `.cta-card`, `.link-card`, `.sources-grid` |
| Icon sets | FontAwesome with all of `fab`/`fas`/`far` registered globally (`src/theme/MDXComponents.js:4-19`, a large bundle cost), lucide-react, `@mui/icons-material` |
| Animation | Both `framer-motion` and `motion` packages are installed (`package.json`) |

Specific inconsistencies:
- There are three button systems: `ui/button.tsx` (cva), `.snowplow-button` (`custom.css:315-410`, which uses the dark-mode `--ifm-color-primary-light` that is darker than primary), and `.featured-section-button`, which is grey in light mode and purple in dark mode (`custom.css:1718-1740`).
- There are two card systems: `CardGrid.tsx` with inline `style={{border:...}}` (`:44,102`) and `ui/card.tsx`, plus the Infima DocCard. They differ in radius, padding, hover and heading weight (CallToActionCard uses `font-extrabold` and FeaturedSection uses `font-semibold`, `CardGrid.tsx:80` vs `46`). Card titles are `<p>` elements, not headings.
- `.link-card` needs `!important` to beat prose colors (`custom.css:1765-1781`). This shows that `prose` wraps components that should be `not-prose`.
- Badges: `src/components/Badges.js` uses shields.io images with inline base64 logos, references the Docusaurus build hash class `img_ev3q`, and links to the legacy path `/docs/collecting-data/...`. The newer availability badges use a different visual language.
- Docusaurus color mode and MUI color mode are synced by a `useEffect` in the swizzled `ColorModeToggle` (`src/theme/ColorModeToggle/index.js:8-17`). Both `getInitColorSchemeScript` and Docusaurus run their own init scripts, so a flash of the wrong theme on MUI components is possible.

## 5. Dark mode

- The background is Infima `#1b1b1d` and the navbar `#242526`, while code blocks and shadcn surfaces use `#050505` or `#191919` (measured). The result is a mix of three greys and black with no coherent elevation model.
- Sidebar and TOC active states use the light-mode purple at 12% alpha.
- Body text is `#999` (measured `rgb(153,153,153)`) on `#1b1b1d`, about 6.3:1. That's legible but dimmer and lower-contrast than the light theme (`#4b5563` on white, about 7.5:1).
- Headings are `#e6e6e6`, links `#916ce7`.
- The dark Prism theme is based on `vsDark` (`snowplow-dark.js:12`) while light is based on `github`, so syntax colors don't map between the themes.
- The dark-mode `[data-theme='light'] .dbt details { --ifm-alert-background-color: null; }` (`custom.css:1205-1207`) sets an invalid value.
- `colorMode` isn't configured in `docusaurus.config.ts` (`themeConfig`, lines 138-269), so the site doesn't follow the OS preference: `respectPrefersColorScheme` defaults to false.

## 6. Mobile (390px)

- There is no horizontal overflow (measured `scrollWidth` equals the viewport). However, that comes from blanket `overflow-x: hidden !important` on `body`, `main`, `article` and `.theme-doc-markdown` (`custom.css:1530-1567`), which hides overflow bugs rather than fixing them. It also breaks `position: sticky` descendants. `hyphens: auto !important` on every div produces breaks such as "track-PageView()" inside inline code (`tracker-light-390.png`).
- Mermaid diagrams on mobile are force-scaled with `transform: scale(0.5)` and font sizes down to 9px (`custom.css:1596-1675`). A CSS `::after` adds "👆 Tap to enlarge" (`1682-1699`).
- The breadcrumbs wrap to three lines, the Download/Copy row follows, then "On this page" collapses above the H1 (`tracker-light-390.png`). The title lands about 330px down the screen.
- The cookie banner and the Product Fruits "Feedback" side tab overlap content on every page, at both widths.
- The mobile drawer (`mobile-menu-dark-390.png`) shows the same long combined CDI and Signals tree and puts the color toggle in the drawer header. `src/theme/Navbar/MobileSidebar/index.js` is a no-op wrapper.

## 7. Code blocks

- `src/theme/CodeBlock/Layout/index.tsx` (ejected) always renders a header with a language pill (`bg-muted`, bordered) and an optional title. The copy and word-wrap buttons on the right are forced visible with `!static !opacity-100` (`:53`). The buttons are in `CodeBlock/Buttons/index.tsx`.
- The block has a 1px border, 0.5rem radius and no shadow (`custom.css:1498-1519`).
- The light code background equals the page background, so blocks are separated only by the border. In dark mode the blocks are black on grey.
- `div[class^='codeBlockContent'] { padding-top: 2rem !important }` (`custom.css:1455`) is then undone by `padding-top: 0 !important` (`1517`).
- `docusaurus-theme-github-codeblock` is also installed (`docusaurus.config.ts:54,147-150`).
- Code blocks inside tabs are indented by the `.tabs-container` 14px padding and a hover border that changes color (`custom.css:1213-1232`). This visibly misaligns the code with the text column (`tracker-light-1440.png`).

## 8. Admonitions

- Admonitions are completely unstyled stock Infima: saturated green tip (`rgb(230,246,230)` with a `rgb(0,148,0)` border, measured) and light-blue info boxes with thick left borders and uppercase labels (`fundamentals-light-1440-full.png`).
- They clash with the restrained purple and grey palette. They're the most dated-looking element on the site.
- Their only custom CSS is margin-collapse rules (`custom.css:1424-1425`).
- `MDXContent/index.js:21-60` injects a `caution` admonition for outdated sections.

## 9. Homepage

- `src/pages/index.js` only redirects to `/docs`. The real home is `docs/introduction.md` (`slug: "/"`), rendered inside the standard doc layout with breadcrumbs, Download/Copy Markdown, TOC and the demo banner (`home-light-1440.png`).
- Content:
  - two gradient CTA cards: "Get started with Snowplow CDI" and "Snowplow Signals"
  - a three-column grid of six `FeaturedSection` cards, each with links and a "Learn more →" button
  - a "Build with Snowplow" grid of tutorial `LinkCard`s
- There is no hero, no search-first entry point and no task-oriented paths. Visually it's a doc page with cards.
- Signals has a parallel landing page with the same pattern (`signals-light-1440.png`).
- `src/pages/index.module.css` (`.heroBanner`) is dead code.
- The style guide pages (`src/pages/style-guide/index.md`, `llm/index.md`) cover writing only. There is no visual or component design system documentation.

## 10. Technical debt that would block a redesign

1. **CSS volume and specificity**
   - `custom.css` is 1,791 lines with **189 `!important`** declarations.
   - There are duplicated blocks (menu `645-800` vs `864-946`, breadcrumbs `995` vs `1032`, the "Left side bar CSS END" comment appears twice at `858` and `978`).
   - It uses `:not(##):not(##)` specificity hacks to fight Infima (`1407-1435`).
   - Tailwind runs with `important: true` (`tailwind.config.js:131`), so every utility is `!important`.
   - Any token-level change will need a rewrite of this file, not edits.
2. **Selectors coupled to generated class names**
   - Docusaurus dev module names: `custom.css:431,949-976`
   - Production hashes: `.expandButton_m80_`, `.expandButtonIcon_BlDH`, `.collapsibleContent_i85q` (`850-855`, `1275`)
   - Prefix matches: `[class*='docMainContainer']`, `div[class^='codeBlockContent']`, `div[class*='buttonGroup']`, `div[class^='announcementBar_']`
   - MUI emotion hashes: `.css-i44wyl`, `.css-pehwr4`, `.css-yu4ftp-…`
   - `img_ev3q` in `Badges.js`
   - These break silently on any upgrade.
3. **Swizzling (about 32 files in `src/theme`)**
   - Ejected and therefore upgrade-fragile: `DocItem/Layout`, `DocRoot/Layout/Main`, `DocSidebarItem/Category` (202 lines), `CodeBlock/Layout`, `CodeBlock/Buttons`, `DocCardList`, `TOCCollapsible`, `PaginatorNavLink`, `SearchBar`, `DocBreadcrumbs/Items/Home`, `MDXPage`.
   - `SearchBar` is a verbatim copy of upstream with no evident changes, so it's pure maintenance cost.
   - `src/theme/DocPage/*` is a **dead Docusaurus v2 swizzle**: v3 renamed DocPage to DocRoot. It's kept alive only because `DocRoot` imports `Paginators` from it (`DocRoot/Layout/Main/index.tsx:19`).
   - `DocRoot` and `DocPage` duplicate the `getMeta`/`getPrev`/`getNext` tutorial logic.
4. **Three styling systems at runtime**
   - The MUI CssVarsProvider wraps the whole app (`src/theme/Root.js:56-57`). MUI is used for trivial layout (`Grid`, `Paper`) in core layout components, so emotion and MUI ship on every page.
   - Removing MUI means rewriting the tutorial layout, navbar tabs, FirstSteps, the JSON schema validator (RJSF MUI) and the data-grid tables. Some of these are heavy: `@mui/x-data-grid-premium` is a commercial package.
5. **Global bundle weight and third-party scripts**
   - FontAwesome registers every icon (`MDXComponents.js:19`).
   - `motion` and `framer-motion` load on every page for the demo ad.
   - KaTeX CSS 0.13.24 loads from jsdelivr.
   - Six client modules are always loaded: cookie consent, Snowplow, Reo, Google, mermaidEnlarge and Qualified (`docusaurus.config.ts:38-45`). Product Fruits loads in `Root.js`.
   - Fonts are `.ttf`, not `woff2`.
6. **Dead or ineffective config**
   - `customFields.webpack.configure` (`docusaurus.config.ts:282-325`) isn't a Docusaurus hook, so it does nothing. It also suggests PostCSS and Tailwind are wired only through `postcss.config.js`.
   - `tailwind-full-config.js` is 0 bytes.
   - `tailwind.config.js` content globs `docusaurus.config.js` (the file is `.ts`).
   - Tailwind is pinned at 3.3.0.
   - Infima's mobile/desktop helper rules at `custom.css:1288-1310` set `display:none` in both branches, so they're no-ops.
7. **No token single source of truth.** Primary purple is defined in at least five places: shadcn HSL, the Infima hex ramp, the MUI theme, Prism hex and the sidebar `hsla` literals. A rebrand or palette change has to touch all of them.
8. **Accessibility gaps**
   - Navigation tabs are buttons, not links.
   - Sidebar carets are invisible until hover.
   - Card titles are `<p>`, not headings.
   - The fake loading state on an external link.
   - The `abbr` tooltip is CSS-only with `white-space: nowrap`, so it can overflow (`custom.css:1241-1260`).
   - The emoji in the CSS `content` is announced by some screen readers.

## Priorities for a cleaner, more modern redesign

1. Consolidate on one token layer (shadcn-style HSL variables) and map Infima variables *from* it, including `--ifm-background-color` and the navbar background. Delete the hex ramps and literals.
2. Rewrite `custom.css` from scratch against stable `ThemeClassNames` and `theme-*` hooks rather than hashed classes. Turn off Tailwind `important: true`.
3. Drop MUI from layout paths (`Root.js` provider, DocItem `Paper`, DocRoot `Grid`, navbar tabs) and isolate it to the few interactive widgets that need it, or replace them.
4. Separate the CDI and Signals navigation: a product switcher in the navbar plus separate sidebars, instead of one combined tree.
5. Restyle admonitions and code blocks (distinct surface color, aligned with the text column) and set the reading width to about 680–720px.
6. Remove the demo ad from the TOC or make it static, give the homepage a dedicated non-doc layout, and delete the dead `DocPage` swizzle and the verbatim `SearchBar` eject.