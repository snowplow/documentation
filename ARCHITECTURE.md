# Architecture

An overview of how the docs site is built. For writing guidelines see [`CONTRIBUTING.md`](CONTRIBUTING.md); for CI and deploys see [`WORKFLOWS.md`](WORKFLOWS.md).

- [Overview](#overview)
- [Gotchas](#gotchas)
- [Cloudflare Worker](#cloudflare-worker)
- [Custom plugins](#custom-plugins)
  - [LLMs.txt and Markdown generation](#llmstxt-and-markdown-generation)
  - [JSON-LD schema](#json-ld-schema)
- [Cookies and tracking](#cookies-and-tracking)
  - [Tracking scripts](#tracking-scripts)
- [Styling and CSS](#styling-and-css)
  - [Design tokens](#design-tokens)
  - [Stylesheets and cascade layers](#stylesheets-and-cascade-layers)
  - [Layout](#layout)
- [Components](#components)
  - [Catalogs and manifests](#catalogs-and-manifests)
  - [Home and landing pages](#home-and-landing-pages)
- [Mermaid](#mermaid)
- [Tutorials](#tutorials)
- [LLM support](#llm-support)
- [Page feedback and Product Fruits](#page-feedback-and-product-fruits)
- [Snowplow event-sending component](#snowplow-event-sending-component)

## Overview

This is a Docusaurus project, deployed on Cloudflare Pages. The Docusaurus configuration is in `docusaurus.config.js`. Search is provided by [Algolia DocSearch](https://docsearch.algolia.com).

Pages are MDX under the hood, but mostly carry `.md` extensions for Docusaurus legacy reasons.

Key architectural files and folders:

| Path                       | Contents                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `docs/`                    | Main documentation, rendered at `/docs/*`                                             |
| `tutorials/`               | Tutorial pages, rendered at `/tutorials/*` via a [second plugin instance](#tutorials) |
| `src/components/`          | Custom React components used inside MDX                                               |
| `src/theme/`               | Swizzled Docusaurus theme components                                                  |
| `src/pages/`               | Custom routes outside docs/tutorials (homepage, style guide, license pages)           |
| `plugins/`                 | [Custom local Docusaurus plugins](#custom-plugins)                                    |
| `static/`                  | Files served at the site root (images, downloadable notebooks)                 |
| `worker/`                  | [Cloudflare Worker source](#cloudflare-worker): redirects + server-side tracking      |
| `utils/`                   | Scripts for refreshing dbt reference data, the sidebar items generator and checker    |
| `sidebars.js`              | The four docs sidebars: cdi, signals, reference, platform                             |
| `src/componentVersions.js` | Source of truth for component version strings                                         |

## Gotchas

Non-obvious things that could cause confusion if you don't know about them:

- **`static/_redirects` is no longer active.** Legacy Netlify file kept for reference only. Live redirects are in [`worker/redirects.js`](#cloudflare-worker). The `yarn build:cf` script deletes the auto-generated `build/_redirects` so nothing leaks.
- **`yarn build` is the only link checker.** `yarn start` doesn't catch broken internal links or missing anchors. The build is configured with `onBrokenLinks: 'throw'` + `onBrokenAnchors: 'throw'`.
- **`componentVersions.js` has no JS imports.** It's referenced from MDX pages only — grep `versions.` to find usage.
- **Styles come from design tokens and cascade layers.** Don't hard-code colors or add `!important`. See [Styling and CSS](#styling-and-css).
- **The sidebars don't match the folder tree.** See [Navigation](#navigation). Moving a folder in `docs/` doesn't move it in the sidebar: `sidebars.js` picks folders by path, and the build fails if a pick no longer matches.
- **Tutorials are a separate plugin instance** and don't share docs conventions — different sidebar, different link rules. See [Tutorials](#tutorials).
- **The Cloudflare Worker tracks page-view events server-side** to track LLM crawlers.

## Navigation

One docs plugin serves every `/docs/` page, so URLs don't depend on the navigation. The pages are split across four sidebars, defined in `sidebars.js`:

| Sidebar     | Navbar entry                        | Groups                                                                                                      |
| ----------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `cdi`       | Product switcher: **Snowplow CDI**  | Get started, Design tracking, Collect events, Validate and enrich, Load and forward, Model and unify, Monitor and operate |
| `signals`   | Product switcher: **Signals**       | Get started, Concepts, Connect, Define attributes, Serve attributes, Intervene, Publish and operate         |
| `reference` | **Reference** tab                   | APIs, SDK reference, Component configuration, Schemas and data, Versions and compatibility, Legacy          |
| `platform`  | **Platform & AI** tab               | Fundamentals, Working with AI, Account management, Security and policies, Migration guides, Glossary        |

- **Picking folders.** `pick('sources/web-trackers')` in `sidebars.js` is an autogenerated item for the parent folder. `utils/sidebar-items-generator.js` runs the default generator and keeps only the picked folder or page. Options: `label`, `hoist` (list the folder's children directly, index page first, labeled `indexLabel`), `indexOnly` (just the index page), `className`, and `collapsed`. Label overrides are written to the page's `sidebar_label`, because Docusaurus prefers front matter over `sidebars.js`.
- **Legacy.** Every previous-versions tree is listed in `LEGACY_DIRS` in the generator. Those trees are removed from every pick, and listed under Reference › Legacy. The outdated-version admonition (`src/theme/MDXContent`) links to the folder above the outdated one.
- **Checking.** `yarn check:sidebars` rebuilds the sidebars from the doc metadata cached by the last build, and fails if a page is in no sidebar, in two places, or a previous version appears outside Reference.
- **Navbar.** The product switcher (`src/components/navigation/ProductSwitcher.tsx`) and the tabs are links. Reference and Platform & AI are `docSidebar` items, which Docusaurus marks active on any page in that sidebar. Below 1200px the items move into the mobile menu (`src/theme/NavbarItem/styles.module.css`).
- **Shared pages.** Doc pages remember the last product sidebar (`cdi` or `signals`) and path in session storage. Pages in the `reference` and `platform` sidebars then show a Back to CDI or Back to Signals link (`BackToProduct.tsx`). It's hidden when storage is unavailable or there's no product in this session.
- **Sidebar filter.** `src/theme/DocSidebar/Desktop/Content` and `src/theme/DocSidebar/Mobile` add a Filter navigation field that filters the current sidebar by label, client-side (`filterSidebar.ts`).
- **Page header.** Breadcrumbs, the narrow-screen On this page button (`MobileToc.tsx`), and the page actions share one row (`.doc-header`), which keeps the H1 within 140px of the top at 390px wide. On phones the breadcrumbs show only home and the parent page, and on shared pages the Back to link takes their place.

## Cloudflare Worker

`worker/index.js` runs on every request and does three things:
1. **Server-side Snowplow tracking**
2. **Forced redirects** via `findForcedRedirect(pathname)`, checked before asset fetch, returns 301 on match
3. **Fallback redirects** via `findFallbackRedirect(pathname)`, checked only after a 404

Both redirect tiers are defined in `worker/redirects.js`. `move.sh` appends to it automatically.

Merged pages use forced redirects. When two pages are merged, the old page stays as a `type: link` stub so the sidebar still lists the topic in its old place, and a forced rule sends both the old URL and its `.md` copy to the merged page. Forced rules run before the asset fetch, so the stub page is never served in production.

## Custom plugins

Live under `plugins/`.

### LLMs.txt and Markdown generation

This [plugin](plugins/docusaurus-plugin-llms-txt/src/index.js) generates LLM artifacts during build:
- A `.md` file for each page
- An `llms.txt` index containing the page title, description, and link to the markdown version
- A concatenated `llms-full.txt`

The `llms.txt` index includes files in both `docs/` and `tutorials/`. It excludes pages with `type: link` and routes in the `excludeRoutes` array. Files marked as `sidebar_custom_props.legacy` or similar are indexed, but are suffixed with `[previous version]`.

The `llms-full.txt` file concatenates all the per-page markdown files, except for the `[previous version]` pages.

Both files start with instructions for AI agents, generated by [`agent-instructions.js`](plugins/docusaurus-plugin-llms-txt/src/agent-instructions.js): current tracker majors read from `src/componentVersions.js`, the Signals SDK packages, deprecated components, and terminology rules. Update the lists in that file when a tracker, SDK, or deprecation changes. Set `agentInstructions: false` in the plugin options to turn them off.

After the agent instructions, the root `llms.txt` has an "Indexes by product" section that links to one index per sidebar, written by [`product-indexes.js`](plugins/docusaurus-plugin-llms-txt/src/product-indexes.js): `/docs/cdi/llms.txt`, `/docs/signals/llms.txt` (which also lists tutorials that use Signals), `/docs/api-reference/llms.txt`, and `/docs/platform/llms.txt`. The plugin reads each page's sidebar from the docs plugin's loaded content, so moving a page between sidebars in `sidebars.js` moves it between indexes. The root file still lists every page after the router.

The plugin also exposes `enableMarkdownFiles` and `excludeRoutes` as global data, so doc pages only link to `.md` files that exist.

The plugin includes scripts for converting different types of content or components into Markdown.

### Content type check

This [plugin](plugins/docusaurus-plugin-content-type-check/index.js) warns during the build about docs pages with a missing or unknown `content_type` front matter value. It never fails the build. It skips `type: link` pages and previous-version pages, and prints a count with the directories that have the most missing pages. Set `CONTENT_TYPE_REPORT=1` to list every page. The valid values are exported as `CONTENT_TYPES`; the page template for each is in the style guide and `CLAUDE.md`.

### JSON-LD schema

This [plugin](plugins/docusaurus-plugin-snowplow-schema/README.md) adds structured [JSON-LD schema](https://schema.org/) metadata to the `<head>` of each page. This metadata helps with SEO and AIO/GEO/LLM consumption.

The schema itself is generated by the [`SchemaPlugin` component](src/components/SchemaPlugin/index.tsx). All pages have type `TechArticle`.

The plugin uses the title, description, and keywords from the page frontmatter. There's a CI workflow to enforce these fields for this reason.

## Cookies and tracking

The site uses [`cookie-though`](https://github.com/Cookie-Though/cookie-though) for consent management. It's initialized in `cookieConsent.js`.

User preferences are stored in a cookie keyed by `COOKIE_PREF_KEY`, with per-policy flags (`analytics:0` / `analytics:1`).

The user-facing preferences page is `src/pages/cookie-preferences.mdx`, linked to from the site footer.

### Tracking scripts

The repo has multiple tracking implementations. Each tracking script manages its own consent behavior independently.

| Script             | Purpose                                                         | Default behavior       | Consent opt-in                                                              | Consent opt-out                                                                                |
| ------------------ | --------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `snowplow.js`      | Snowplow browser tracker                                        | Anonymous tracking     | Calls `disableAnonymousTracking()`, sets cookies, and fires a new page view | Removes `_sp5_*` and `sp` cookies and reloads (`_sp_biz1_*` cookies aren't removed on opt-out) |
| `google.js`        | Google Analytics / Google tag                                   | No scripts loaded      | Starts tracking, sets cookies                                               | Removes `_ga`, `_gid`, and `_gat_*` cookies and reloads                                        |
| `reoTracking.js`   | [Reo.dev](https://reo.dev) tracker                              | Loaded unconditionally | N/A                                                                         | N/A                                                                                            |
| `src/qualified.js` | [Qualified](https://www.qualified.com) chat/conversion tracking | Loaded unconditionally | N/A                                                                         | N/A                                                                                            |
| `worker/index.js`  | Page view tracking for `.md` and `llms.txt` requests            | Anonymous tracking     | N/A                                                                         | N/A                                                                                            |

The 404 page also sends a structured event (category `docs`, action `page_not_found`, label set to the requested path) from `src/theme/NotFound/Content/index.tsx`, so missing pages can be counted separately from page views.

## Styling and CSS

### Design tokens

`src/design/tokens.js` is the single source of truth for colors (light and dark), callout colors, syntax colors, type, spacing, radii, layout widths, and shadows. The primary purple is defined once there. Change values in this file, not in CSS.

The tokens feed:

- **CSS variables.** `plugins/docusaurus-plugin-design-tokens` writes `tokens.css` into `.docusaurus/` at build start and loads it on every page. Token variables are named `--sp-*`, for example `--sp-color-accent` or `--sp-layout-content`. Dark values apply under `[data-theme='dark']`.
- **Tailwind.** `tailwind.config.js` maps its color names (`bg-card`, `text-muted-foreground`, `bg-primary/10`) to HSL variables that the plugin generates from the tokens, and reads radii, fonts, and widths (`max-w-content`) from the tokens.
- **Prism.** `src/theme/PrismThemes/make-theme.js` builds the matched light and dark code themes.
- **MUI.** `src/components/MuiTheme` builds the light and dark MUI themes. MUI is no longer provided site-wide: `src/components/MuiScope` wraps the widgets that need it (`FirstSteps`), and `JsonSchemaValidator` and `DbtSchemaSelector` pick a theme from the color mode themselves. MUI's code is only in the bundles of the pages that use these widgets.

The same plugin loads the self-hosted fonts from npm: Inter Variable (`@fontsource-variable/inter`, woff2 split by script) and JetBrains Mono 400 and 600 (`@fontsource/jetbrains-mono`) for code.

### Stylesheets and cascade layers

The global CSS is split by job, in `src/css/`:

| File             | Contents                                                        |
| ---------------- | --------------------------------------------------------------- |
| `base.css`       | Layer order, Tailwind directives, page-level defaults           |
| `infima.css`     | Infima and DocSearch variables mapped to the tokens             |
| `prose.css`      | The doc body (`.markdown`): reading column, headings, lists, tables |
| `chrome.css`     | Navbar, doc layout, sidebar, table of contents, breadcrumbs, footer |
| `components.css` | Callouts, details, code blocks, tabs, diagrams, pagination      |
| `kit.css`        | The component set in `src/components` (see [Components](#components)) |
| `home.css`       | The docs home and its components in `src/components/home`       |

Docusaurus (`future.v4`) puts Infima and its theme CSS into `docusaurus.*` cascade layers. The design tokens plugin turns off postcss-preset-env's layer polyfill, so the layers stay native in production. Our files declare `snowplow.*` layers after the Docusaurus ones, so they override Infima without `!important`, and Tailwind utilities are unlayered, so a utility class in JSX always wins over the stylesheets. MUI's runtime styles are unlayered too: the few rules that must beat MUI stay unlayered and use a more specific selector.

Tailwind runs with `preflight: false` and without `important`. The doc body no longer uses the Tailwind `prose` class; components can opt out of the prose table and list styles with `not-prose`.

`yarn lint:css` (stylelint) enforces an `!important` budget of 10 per file and bans selectors on generated class names (`[class*=...]`, CSS module hashes such as `_abc1`, and `.css-...`). Target stable classes such as `theme-doc-*`, Infima's BEM classes, or a class you add in a swizzle.

### Layout

The doc layout (`src/theme/DocItem/Layout`) is a 272px sidebar, a 672px reading column, and a 224px table of contents. Code blocks, tables, diagrams, images, and `.breakout` elements can widen to 896px; narrower ones line up with the text column.

Callouts use a swizzled `src/theme/Admonition/Layout` that adds stable `callout__*` class names.

## Components

One component set, in `src/components/`, styled from the tokens in `src/css/kit.css` and registered for MDX in `src/theme/MDXComponents.js`, so no MDX file needs to import them. The style guide documents them with live examples at `/style-guide/components/` (`src/pages/style-guide/components/index.mdx`).

| Component | Replaces |
| --- | --- |
| `Card`, `CardGrid` (link, product, quickstart, compact) | `CardGrid.tsx` variants, `ui/card.tsx`, `.cta-card`, `.link-card`, the DocCard styling (`src/theme/DocCardList` now renders `Card`) |
| `Button` (primary, secondary, ghost, link) | `.snowplow-button`, `.cta-button`, `.featured-section-button`, `ui/button.tsx` |
| `Badge`, `BadgeGroup`, `TierBadge`, `VersionBadge`, `LifecycleBadge`, `LicenseBadge`, `Availability` | `Badges.js` (shields.io images), `BadgeGroup.js`, `ui/availability-badges.tsx` |
| `CodeGroup` | `<Tabs>` around code blocks |
| `Steps` | Hand-numbered H3s |
| `ParamTable`, `Param` | Static uses of `MarkdownTableAsMui` (deleted) |
| `FeatureMatrix` | Hand-written comparison tables |
| `AppliesTo` | "Available since version X" notes |
| `PageActions` | The Phase 0 page actions in `DocItem/Layout` |
| `Feedback` | The Product Fruits side tab on doc pages |

Icons come from `lucide-react`. FontAwesome and `@mui/icons-material` are no longer dependencies.

### Catalogs and manifests

Hub tables are generated from JSON manifests in `src/data/`, and render static HTML so the `.md` copy of the page lists every row:

- `trackers.json`: the tracker feature matrix on `/docs/sources/` (`src/components/catalogs/TrackerMatrix.tsx`). Tiers use the maintenance groups from `/docs/sources/tracker-maintenance-classification/`.
- `destinations.json`: the destinations catalog on `/docs/destinations/` (`src/components/catalogs/DestinationsCatalog.tsx`). Its `support` field (Snowplow or partner) feeds the label row on each destination page.
- `feature-versions.json`: minimum versions for `<AppliesTo>` markers and the table on `/docs/api-reference/versions/`. The build fails if a marker names a version newer than `src/componentVersions.js`.
- `components.js`: display names and links for the keys in `src/componentVersions.js`.

The tracker and destination landing pages read their label rows from the same manifests: `<TrackerTier id>` shows a tracker's tier from `trackers.json`, and `<IntegrationBadges id>` shows support, status, type, delivery, and clouds from `destinations.json` (both in `src/components/catalogs/IntegrationBadges.tsx`).

Matrix filters write to the query string (`?category=mobile`, `?type=forwarder&cloud=gcp`) and only apply after hydration.

### Home and landing pages

`docs/introduction.md` (the docs home, `/docs/`) sets `layout: home` and `displayed_sidebar: null`. The `DocItem/Layout` swizzle then renders it without breadcrumbs, page actions, table of contents, or feedback. Its sections come from `src/components/home` and `src/data/home.ts` (quickstarts with time estimates, filterable with `?filter=cdi` or `?filter=signals`, and the lifecycle strip). The latest releases come from the release notes plugin's global data. The "Connect your coding agent" panel and the Working with AI page share `src/data/agent-setup.js`.

The product landing pages are `docs/cdi/index.md` (`/docs/cdi/`, the CDI link in the product switcher) and `docs/signals/introduction/index.md`, which routes readers to "Personalize an app" or "Feed an AI agent".

## Mermaid

The Mermaid theme [component](src/theme/Mermaid/index.js) renders diagrams as SVG. It's been swizzled to add the source Mermaid code in the DOM, alongside the rendered SVG, for ingestion by LLMs.

There's also a module `src/js/mermaidEnlarge.js` that adds click-to-enlarge functionality on mobile, since small SVGs can be hard to read.

## Tutorials

Served at `/tutorials/*` via a **second `@docusaurus/plugin-content-docs` instance** configured separately.

The plugin has no `sidebarPath`, so navigation is custom and not file-tree-derived. The tutorials use the components in [`src/components/tutorials`](src/components/tutorials).

Internal link conventions inside `tutorials/` differ from `docs/` — see [`tutorials/_README.md`](tutorials/_README.md). Downloadable notebooks live as static assets in `static/notebooks/`.

## LLM support

As well as the [custom `llms.txt` and JSON-LD schema plugins](#custom-plugins), the docs have additional features designed to make them easier for LLMs to parse and understand:
- `CLAUDE.md` instructions
- LLM-targeted style guide at `src/pages/style-guide/llm/index.md`.
- Page actions on every docs page, implemented in `src/components/PageActions`: a Copy page button, with View as Markdown, Download Markdown, Open in Claude, and Open in ChatGPT in its menu, plus Copy MCP URL when `customFields.docsMcpUrl` is set (from the `DOCS_MCP_URL` environment variable at build time). The Open in actions start a chat with a prompt that links to the page's `.md` copy. The Markdown files only exist in a production build, so these actions don't work under `yarn start`.
- A `<link rel="alternate" type="text/markdown">` tag in the head of every docs page, pointing to its `.md` copy.

## Page feedback and Product Fruits

Every page under `/docs/` ends with "Was this page helpful?" (`src/components/Feedback`). The answer is a Snowplow structured event (category `docs`, action `page_feedback`, label = path, property = `yes` or `no`), and an optional reason is a second event (action `page_feedback_reason`). Events are only sent when the reader has granted the analytics purpose in Ketch (`src/helpers/consent.js`).

[Product Fruits](https://productfruits.com/) still loads outside `/docs/` (tutorials, release notes, and other pages). It's initialized in `src/theme/Root.js` and reads user and session IDs from the Snowplow `_sp_biz1_id` cookie.

## Color mode and MUI

The navbar uses the stock Docusaurus color mode toggle, which cycles through light, dark, and system (`respectPrefersColorScheme: true`). The few MUI widgets pick the light or dark MUI theme from `useColorMode()`, through `src/components/MuiScope` or their own `ThemeProvider`.

## Snowplow event-sending component

The **Get Started > Tracking** page `docs/get-started/tracking/index.md` includes a "send test events" widget that allows users to send pre-defined test events to their Snowplow pipeline, directly from the docs.

This is implemented in `src/components/FirstSteps/index.tsx`. It uses a sandboxed Snowplow tracker from `static/js/sandboxed-sp.js` to keep test events isolated from the site's own tracking.
