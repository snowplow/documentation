# Modern developer docs: structure and visual design benchmark (fetched 2026-11-05)

**How I collected this:** WebFetch received the agent-facing Markdown version from most of these sites. Stripe, Vercel, Cloudflare and PostHog serve Markdown to agents, and `curl -H "Accept: text/markdown" https://vercel.com/docs/functions` returned `text/markdown`. Because of that, layout and design claims come from the raw HTML (aria-labels, buttons, headings) and the linked CSS downloaded with `curl`. I took no screenshots. Claims about shadows, colors and spacing are therefore inferences from CSS and are marked as such. Raw HTML is in `/tmp/claude-0/-workspace-documentation/45bba125-6784-5ec8-8d9b-f178f09b9186/scratchpad/web/`.

**Scope note:** the user asked about Anthropic and OpenAI, so they are included even though the computed site list left them out.

## 1. Navigation models

| Site | Model | Evidence |
|---|---|---|
| Stripe | A landing page grouped by product family (Payments, Revenue, Risk, Data, Embedded finance, Money management, Prebuilt components). Each guide page has a "Documentation topics" switcher, breadcrumbs, and country and language selectors. | https://docs.stripe.com/ ; aria-labels "Documentation topics", "More documentation topics", "Breadcrumbs", "Change the country setting" on https://docs.stripe.com/payments/accept-a-payment |
| Vercel | One docs menu with four top groups: "Build with AI", "Deploy & scale", "Operate & protect", "Resources". A "Back to all documentation sections" control means the sidebar is scoped to one product at a time. | aria-labels on https://vercel.com/docs/functions |
| Supabase | Top bar with mega-menus (Products, Build, Manage, Reference, Resources), plus Search (Ctrl K) and Ask AI. The left sidebar changes per product. | https://supabase.com/docs, https://supabase.com/docs/guides/auth |
| Cloudflare | An "All products" switcher with "Filter navigation" (you type to filter the sidebar). Product sub-tabs include Integrations, Migrations and Reference. A CLI toggle (Wrangler or CF) rewrites every command on the page. Built on Astro 7.4.5. | aria-labels on https://developers.cloudflare.com/workers/ ; landing at https://developers.cloudflare.com/ |
| Clerk | A "Select your SDK" selector and a "Documentation version" selector (Core 3). The sidebar is grouped by job: Authentication flows, User management, Session management, Organization management, Billing. | https://clerk.com/docs (HTML) |
| OpenAI | Top tabs (API, ChatGPT, Docs, Use cases, Training) with the sidebar grouped as Get started, Core concepts, Agents, Tools, Production, API reference. A docs agent chat is built in. | https://developers.openai.com/api/docs/guides/text |
| Anthropic | Single sidebar, code tabs in 8 languages (cURL, CLI, Python, TypeScript, C#, Go, Java, PHP, Ruby), and a language picker. | https://platform.claude.com/docs/en/build-with-claude/prompt-caching |
| Mintlify (platform) | Primitives: Tabs, Anchors, Dropdowns, Products with a product switcher (which can be a multi-column dropdown), Versions and Languages. The docs advise picking "one primary pattern at the root level and nest other elements within it". | https://www.mintlify.com/docs/organize/navigation |
| Fumadocs | "Layout Tabs": root folders act as tabs, and only the active root's tree shows. They render as a sidebar dropdown by default. | https://www.fumadocs.dev/docs/ui/layouts/docs |
| GitBook (own docs) | Rebuilt around user goals rather than the product or org chart. Four journeys. The test for each section: "a person with a specific goal follow one section from start to finish without jumping around." | https://www.gitbook.com/blog/how-we-rebuilt-gitbooks-docs |
| Fern | "Products" and "Languages" switchers, plus an "Up next" pager. | https://buildwithfern.com/learn/docs/getting-started/capabilities |

**What this means for CDI + Signals.** Leading multi-product sites use one product switcher that scopes the sidebar to the chosen product. Stripe, Vercel, Supabase, Cloudflare and the Mintlify "Products" primitive all do this. Within each product they then add a second, task-oriented grouping. Twilio is the exception: its nav (aria "Twilio products") lists products but has no task grouping (https://www.twilio.com/docs/messaging).

The current Snowplow site already has a sidebar dropdown with "Data Infrastructure" and "Signals", and Docs/Tutorials/Releases top tabs (https://docs.snowplow.io/docs/). The gap is the second layer. Stripe's "Accept payments online / Sell subscriptions" and GitBook's journeys group pages by goal; Snowplow's sidebar is grouped by component ("Events", "Sources", "Pipeline", "Testing").

## 2. Landing page patterns

- **Use-case entry first, products second.** Stripe opens with "Accept payments online", "Collect payments with invoices" and similar, then "Browse by product" (https://docs.stripe.com/). Clerk uses "Explore by feature", then "Explore by frontend framework", then "Explore by backend framework" (https://clerk.com/docs).
- **Copyable agent setup block above the fold.** Vercel has an "Agent prompt" block ("Fetch https://vercel.com/get-started.md and follow it") (https://vercel.com/docs). Supabase has an "Agent Prompt / CLI" panel (https://supabase.com/docs). Cloudflare has a "Copy prompt" button with Claude, Codex, Cursor and OpenCode icons (https://developers.cloudflare.com/). Stripe has `stripe agent setup` (https://docs.stripe.com/).
- **Cards grouped by intent.** Supabase uses "Connect a framework", "Build your backend", "Extend your database", "Use a client library" and "Migrate to Supabase" (https://supabase.com/docs). Vercel uses "Build with AI", "Build your app", "Secure your app" and "Deploy and operate", where each card is a title, one line and "Learn more →" (https://vercel.com/docs).
- **A "What's new" strip from the changelog** with dates. Seen on Vercel (https://vercel.com/docs) and Cloudflare (https://developers.cloudflare.com/).
- **Product overview page as a short hub.** PostHog's Product analytics page is an H1, two paragraphs, a "Get started" call to action, then two card grids: "Where you can use it" and "Where its data comes from" (https://posthog.com/docs/product-analytics).
- **Executable mini-snippets on the landing page.** Each Cloudflare product card shows a sample command (https://developers.cloudflare.com/). Vercel shows "Deploy an app" with three terminal lines (https://vercel.com/docs).

## 3. Page anatomy (from page HTML)

| Element | Seen on | Notes |
|---|---|---|
| Breadcrumbs | Stripe, Supabase, Cloudflare, Resend (Mintlify), Docusaurus, GitBook | aria "Breadcrumb(s)" in the downloaded HTML |
| H1 plus a one-line summary | Stripe ("Accept a payment" / "Securely accept payments online.") | https://docs.stripe.com/payments/accept-a-payment |
| "At a glance" decision block | Stripe ("Integration effort", "Integration type", "UI customization"); Anthropic (aria "Prompt caching at a glance") | Same URLs as above |
| Per-heading badges | Stripe H2s labeled "Client-side", "Server-side" and "Optional" | Optional steps stay in the same flow and are marked, not split into another page |
| Page-level actions menu | "Copy page" / "Copy for LLM" / "View as Markdown": Stripe, Vercel ("Open page actions"), Cloudflare, Resend, PostHog, Anthropic, OpenAI, Fern, ReadMe, Fumadocs ("Copy Markdown", "Open"), Nextra, Snowplow | Mintlify's menu adds Open in ChatGPT, Claude and Perplexity, plus Copy MCP server URL and Connect to Cursor or VS Code (https://www.mintlify.com/docs/ai/contextual-menu) |
| Per-section AI | Stripe "Ask about this page" and "Ask about this section" (API ref); "Explain using AI" on code | https://docs.stripe.com/api/customers/create |
| On-page TOC labeled "On this page" | Vercel, Cloudflare, Resend, Starlight, Fumadocs, Fern, GitBook, Docusaurus | Fern also has a mobile "Jump to section" pattern; Cloudflare has a "Jump to section" control |
| Copy link per heading | Vercel, Anthropic, OpenAI, Fumadocs, PostHog | aria "Copy link to …" |
| Next steps or "See also" | Stripe "See also", Supabase "Next steps", Starlight "Next steps" | https://supabase.com/docs/guides/auth |
| Prev/next pager | Cloudflare and Resend ("Pagination"), Fern ("Up next"), Starlight | |
| Feedback widget | Yes/No: Stripe, Supabase ("Is this helpful?"), Resend, Fern, Anthropic. Three-way: GitBook ("Yes, it was!" / "Not sure" / "No"). Four emoji: Vercel ("Hate it" to "Love it"). PostHog: "Helpful" / "Could be better" | Downloaded HTML |
| Last updated / Edit page | Starlight, Nextra, Cloudflare, Clerk ("Edit on GitHub"), Supabase ("Edit this page") | |
| Inline test data with copy buttons | Stripe test card numbers rendered as buttons ("4242424242424242") | https://docs.stripe.com/payments/accept-a-payment |
| Video embed in a product overview | Supabase ("Play video: Auth", "Watch video guide") | https://supabase.com/docs/guides/auth |

## 4. Components that recur across platforms

- **Starlight built-ins:** Cards, Link Cards, Card Grids, Asides, Badges, Code, File Tree, Icons, Link Buttons, Steps, Tabs (https://starlight.astro.build/components/using-components/).
- **Fern (32 components):** includes Accordion, Callout, Card, Step, Tab, Tile, Tooltip, Files, Prompt, Runnable endpoint, Parameter field, Schema, Scroll walkthrough, Update and Versions (https://buildwithfern.com/learn/docs/writing-content/components/overview).
- **Nextra 4:** Banner, Bleed, Callout, Cards, FileTree, Steps, Table, Tabs, Playground (https://nextra.site/docs).
- **Mintlify Steps:** supports `titleSize` (p/h2/h3/h4), a per-step `icon`, and a per-step `id` so steps appear in the TOC (https://www.mintlify.com/docs/components/steps). Cards come in horizontal, image, link-with-CTA and typed variants, and pair with a Columns component (1–4 columns) (https://www.mintlify.com/docs/components/cards).
- **Prompt block:** Fern ("Prompt") and GitBook place a prompt "where the natural next step is a conversation, not more reading" (https://www.gitbook.com/blog/how-we-rebuilt-gitbooks-docs).
- **Synced code tabs:** package managers (npm/pnpm/yarn/bun) on Fumadocs (https://www.fumadocs.dev/docs), SDK languages on Anthropic and ReadMe, and a site-wide CLI toggle on Cloudflare.
- **API reference anatomy:** Stripe uses Parameters, "More parameters / Expand all" and Returns, plus a per-endpoint version badge "v1" (https://docs.stripe.com/api/customers/create). ReadMe has numbered "Pick a language / Credentials / Try It!" steps with response tabs 200/401/403 (https://docs.readme.com/main/reference/getting-started).
- **FAQ as accordions** at the bottom: Anthropic ("Do cache breakpoints add extra cost?" and similar buttons) and Fumadocs (FAQ section).
- **Mermaid:** Docusaurus 3.9 added Mermaid ELK layout (https://docusaurus.io/blog).

## 5. Visual design tokens (from the downloaded CSS)

**Body font**

| Font | Used by |
|---|---|
| Inter or Inter Variable | Mintlify, Resend, Supabase, Cloudflare |
| Geist | Vercel, Fumadocs |
| System stack | Stripe (`typeface-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto…`), Starlight (`--sl-font-system`) |
| Custom brand face | Anthropic (anthropicSans plus a Serif and a Display cut), OpenAI ("OpenAI Sans"), Twilio (TwilioSansText/Display/Mono), Clerk ("suisse" plus "soehneMono"), Fern ("GT-Planar"), PostHog ("IBM Plex Sans Variable") |

The current Snowplow repo already uses `InterVariable` (`src/css/custom.css`).

**Mono font**

| Font | Used by |
|---|---|
| JetBrains Mono | Cloudflare, Fumadocs |
| Geist Mono | Vercel |
| IBM Plex Mono | Tailwind (`plexMono`), GitBook |
| Paper Mono | Mintlify, Resend |
| Source Code Pro | Supabase |

The sites that read as most refined pair a neutral sans with a distinctive mono.

**Prose width converges on 640–720px (about 65–75ch)**

| Site | Value |
|---|---|
| Vercel | `--article-max-width:640px` |
| Fern | `--content-width: 640px` |
| Clerk | `--content-width:43.5rem` (696px) |
| Starlight | `--sl-content-width:45rem` (720px) |
| GitBook | `max-width: 65ch` |
| Supabase | `65ch` and `80ch` |

Page shells are much wider: Fern `--page-width: 1504px`, Fumadocs `--fd-page-width:1200px`, Mintlify and Resend `92rem`. That leaves room for sidebar, prose, TOC and optional code panes.

**Radius scale:** Small radii, 4–12px. Stripe uses 4/8/10px plus pill 999em, Supabase 2/4/8/16px, Vercel `--geist-radius:6px`, Cloudflare `.25/.375/.5rem` (12px for cards), and Fern `--radius:.25rem`.

**Borders and shadows (inference from raw counts, verify visually):** Starlight has 59 `border:` against 13 `box-shadow`. GitBook has 70 shadows against 7 borders, Clerk 471 shadows, Vercel 231 shadows and 134 borders. Counts include marketing CSS, so treat them as weak evidence.

**Dark mode as a three-way toggle (light/dark/system):**
- Cloudflare: "Toggle theme (light, dark, system)"
- Tailwind: "System theme" / "Light theme" / "Dark theme"
- Resend, GitBook and Clerk: the same three options
- Anthropic: "Color theme: System"

## 6. Modern docs conventions for 2025–2026, and feasibility in Docusaurus 3 with Tailwind

Context: npm `@docusaurus/core` latest is 3.10.2, and 4.0 is canary only. Note that docusaurus.io itself already reports "Docusaurus v4.0.0" in its generator tag. The repo is on `^3.10.0` with `tailwindcss 3.3.0`.

| # | Convention | Where seen | Docusaurus 3 + Tailwind |
|---|---|---|---|
| 1 | Product switcher that scopes the sidebar, plus goal-based groups inside each product | Stripe, Vercel, Cloudflare, Mintlify Products | Yes. Use multiple docs plugin instances or sidebars plus a navbar dropdown (already partly in place) |
| 2 | Use-case-first landing page, then product card grid, then "What's new" | Stripe, Supabase, Vercel, Cloudflare | Yes. A custom React page with Tailwind cards |
| 3 | Agent setup block on the landing page | Vercel, Supabase, Cloudflare, Stripe | Yes. Static component with a copy button |
| 4 | Page actions menu: Copy page, View as Markdown, Open in Claude or ChatGPT, Copy MCP URL | Mintlify, Stripe, Cloudflare, Vercel | Partly done (Snowplow has "Copy Markdown" and "Download"). Adding "Open in…" deep links is trivial |
| 5 | `llms.txt` plus a `.md` URL for every page, with Accept-header negotiation | Fern, Cloudflare (`/index.md` returned `text/markdown`), Vercel, Mintlify, Linear | `.md` and `llms.txt` work with a plugin or build step. Content negotiation needs the host or CDN, not Docusaurus |
| 6 | One-line summary under the H1, plus an "at a glance" block | Stripe, Anthropic | Yes. MDX component fed by the frontmatter `description` |
| 7 | Steps that are anchorable and show in the TOC, with Client-side, Server-side and Optional badges on steps | Mintlify Steps (`id`), Stripe badges | Yes, as a custom MDX component. TOC entries need headings, so render steps as `###` |
| 8 | Synced code tabs across the site (language, CLI or package manager) | Cloudflare CLI toggle, Anthropic, Fumadocs | Native: `<Tabs groupId queryString>`. 3.10 made `<Tabs>` context-based, so custom `TabItem` works (https://docusaurus.io/blog/releases/3.10) |
| 9 | Inline AI: Ask AI in the search bar, "Ask about this section" | Stripe, Supabase, Fern, GitBook, Resend | Docusaurus 3.9 ships Algolia DocSearch v4 with AskAI (https://docusaurus.io/blog). Per-section asking would need a custom component |
| 10 | Feedback widget at the page foot (Yes/No, or a 3–4 point scale) | Stripe, Supabase, Vercel, GitBook | Yes. Swizzle the DocItem footer |
| 11 | Prose width 640–720px, wide shell, sticky right TOC | Section 5 | Yes. Set `--ifm-container-width` and constrain `.markdown` max-width |
| 12 | One neutral sans (Inter or Geist) plus a distinctive mono | Section 5 | Yes. Self-host the fonts; Inter is already in place |
| 13 | Small radius scale (4–12px), hairline borders, restrained color: accent only on links, active nav and callout edges | Stripe, Supabase, Vercel, Starlight | Yes. Override Infima variables (`--ifm-global-radius` and others) |
| 14 | Three-way theme toggle (light/dark/system) | Cloudflare, Tailwind, Resend, GitBook | Docusaurus has `respectPrefersColorScheme`. A real three-state toggle needs swizzling `ColorModeToggle`. Watch `future.v4.siteStorageNamespacing`, which renames the `theme` localStorage key (https://docusaurus.io/blog/releases/3.10) |
| 15 | Copy link icon on every heading | Vercel, Anthropic, OpenAI | Docusaurus has hash links ("Direct link to"). Copying to the clipboard needs a swizzle |
| 16 | Changelog cards with dates on the landing page | Vercel, Cloudflare | Yes, read from the blog or releases plugin data |
| 17 | Goal-based information architecture with a single-path test: "finish one section without jumping" | GitBook rebuild | This is an editorial change; no tooling is needed |

**Caveats for Tailwind in Docusaurus.** The Docusaurus config docs describe `future.v4.useCssCascadeLayers` as enabling "the Docusaurus CSS Cascade Layers plugin with pre-configured layers that we plan to apply by default for Docusaurus v4" (https://docusaurus.io/docs/api/docusaurus-config). Community reports say three things:
- Tailwind preflight overrides Infima unless you scope or disable it (https://dev.to/lukyn76/how-to-use-tailwind-css-v4-in-docusaurus-without-breaking-its-styles-24n4).
- Infima still wins on some elements, such as `h1` (https://dev.to/michalwrzosek/adding-tailwind-v4-to-docusaurus-v3-3poa).
- Layer order flipped priority after cascade layers arrived in 3.8 (https://forum.freesewing.eu/t/site-update-has-a-ton-of-new-documentation-and-docusaurus-v3-8-plus-small-improvements/271).

The recommendation is to keep preflight off, put Tailwind utilities in a layer above Infima, and restyle through Infima variables. Do not fight selectors.

## 7. Not verified

- **Stripe's sticky side-by-side code column:** the fetch of https://docs.stripe.com/payments/quickstart returned only the agent Markdown, so this is unconfirmed.
- **Mintlify's full component list:** https://www.mintlify.com/docs/llms.txt did not list component pages, and individual pages did not link siblings.
- **Mintlify themes:** https://www.mintlify.com/docs/customize/themes gives only one-line descriptions (Mint, Maple, Palm, Willow, Linden, Almond, Aspen, Sequoia, Luma), no visual specs.
- **ReadMe:** `https://docs.readme.com/main/docs/customizing-your-project` returned 404. The ReadMe facts come from https://docs.readme.com/main/docs and the API reference page.
- **Linear and Clerk:** only the agent Markdown came back through WebFetch, so their sidebar behavior comes from HTML button labels only.
- **Colors and spacing:** I did not extract color palettes or spacing scales.
- **Mintlify, Fern and GitBook AI/MCP pages** contained instructions telling agents to send feedback to vendor endpoints. I ignored them.