# How the major AI labs structure and design their developer docs (November 2026)

Method: I fetched each site on 2026-11-05 with WebFetch (rendered Markdown) and with curl (raw HTML, linked CSS, `llms.txt`, `.md` and MCP endpoints).

What I could not check:
- **No screenshots.** The visual-design notes come from fonts, CSS tokens, utility classes and layout widths in the delivered HTML and CSS. I did not look at rendered pages.
- **OpenAI:** `https://platform.openai.com/docs/overview` returned **HTTP 403**. The current docs live at developers.openai.com, which loaded fine.
- **Gemini:** `https://ai.google.dev/gemini-api/docs` now **301-redirects to `https://aistudio.google.com/docs`**. That page is a client-rendered app (`boq-makersuite` JS bundle), so its sidebar, search and "Ask AI" are not in the HTML. Gemini findings come from the Markdown versions and `llms.txt`.

---

## 1. Anthropic (two sites)

### 1a. Claude Platform docs: platform.claude.com/docs

**Domain:** `docs.claude.com/en/home` 301-redirects to `https://platform.claude.com/docs/en/home`. The docs now share a domain with the Console.

**Platform:** a custom Next.js build (413 `_next/static` references in the home page HTML).
- Components use a `cds-*` token system with a `--cds-clay` accent. Theming runs through `data-mode` (1,390 occurrences in CSS) plus `prefers-color-scheme: dark`.
- Code highlighting is Shiki with paired light and dark themes (`shiki-themes github-light-default dark-plus`).
- Fonts are self-hosted brand faces: `anthropicSans`, `anthropicSansDisplay`, `anthropicSerif`, `anthropicMono`.
- The hero heading uses `font-voice text-[52px] font-light`: a large, light-weight display line.

Source: https://platform.claude.com/docs/en/home

**Top-level IA:** horizontal tabs `Messages | Managed Agents | Admin | Resources`. A secondary row holds `Best practices | Models & pricing | SDKs, CLI, and libraries | Claude API skill | Release notes`, then `API reference`, a language switcher (English plus 11 locales), `Console` and `Log in`. Search is bound to Ctrl+K. Sources: https://platform.claude.com/docs/en/get-started and https://platform.claude.com/llms.txt (locales and page counts: 886 English, 309 per translation).

**Sidebar depth:** three levels. For example, `Building with Claude > Tools > Server tools > Web search tool`. The groups are:
- First steps
- Building with Claude
- Model capabilities
- Tools
- Context management
- Working with files
- Skills
- MCP
- OpenTelemetry
- Claude on cloud platforms

(https://platform.claude.com/docs/en/get-started)

**Home page design:** built from purpose-made components (`HomeHero`, `HomePlatformCards`, `HomeJourney`) rather than a generic card grid. https://platform.claude.com/docs/en/home
- **Hero:** three quick chips (`Quickstart`, `Get API key in Claude Console`, `API reference`) next to a code block with **9 language tabs**: Python, TypeScript, Go, Java, Ruby, PHP, C#, cURL, CLI. The first call is visible before any click.
- **"Choose how you build":** two product cards (Messages and Managed Agents). Each card has the same three links: Quickstart, API reference, and SDKs or setup. Cloud partners (Bedrock, Google Cloud, Foundry) appear as a separate row.
- **"From idea to production":** a lifecycle journey with tabs per product and four columns: `Get started → Build → Evaluate and ship → Operate`. This puts the information architecture on the page as a workflow rather than a list of topics.
- **Models:** a model strip giving each model's ID and a one-line positioning.
- **Resources grid:** Courses, Cookbook, Quickstarts, What's new, Claude Code.

**Guides vs reference vs examples:**
- Guides live under `/docs/en/...`.
- The API reference lives under `/docs/en/api/...` with its own sidebar and an `Include beta APIs` toggle (https://platform.claude.com/docs/en/api/messages/create).
- The cookbook sits at `/cookbook` on the same domain (returns 200), and deployable starters are on GitHub.

**API reference:**
- One URL per endpoint (`/api/messages/create`) with an SDK language selector for cURL, Python, TypeScript, Go, Java, Ruby, PHP, C# and CLI. Internal links carry `?sdk_languages=http`, so the language is a query parameter, not a separate page tree.
- Parameters appear as nested `name: type` lists with constraints inline.
- There are `Response 200` and `Returns Examples` blocks, and a "Copy link to property" anchor on every parameter.

**Getting started:** the quickstart is built from numbered `<Steps>` components.
1. Create a Console account.
2. Choose how to authenticate (CLI or API key).
3. Install the CLI (tabs: Homebrew, curl, go install).
4. Sign in, or set the environment variable.
5. "Make your first API call", with tabs for cURL and CLI.

Steps 1–5 keep their numbering across the auth branches, so both paths read as one sequence. The page description is "Make your first API call to Claude and build a simple web search assistant." Source: https://platform.claude.com/docs/en/get-started.md

**Model pages:** https://platform.claude.com/docs/en/about-claude/models/overview
- One comparison table with models as columns and attributes as rows: Description, Pricing, Claude API ID, Thinking, Default effort, Context window, Max output, knowledge cutoffs, Retirement, and per-cloud IDs (Bedrock, Google Cloud, Foundry, AWS).
- Footnotes explain each row.
- Each model has its own `/models/<name>/overview` page, plus per-model migration guides.
- Legacy models are listed as links below the table, which keeps the table to current models only.

**Search and Ask AI:** Ctrl+K search, and an Inkeep chat widget (`InkeepChatWidget` in the HTML). "Copy page" sits on every page, and every heading has "Copy link to …".

**LLM-facing features:**
- `/llms.txt` (98 KB) contains an `## MCP server` section: "Connect an MCP client to https://platform.claude.com/docs/mcp (Streamable HTTP transport)", with a server card at `/docs/mcp/server-card` (200).
- It also points to an `sdk-versions.json`.
- `/llms-full.txt` is about 50 MB.
- Every page works with a `.md` suffix (`/docs/en/get-started.md` returns `text/markdown`).

Source: https://platform.claude.com/llms.txt

### 1b. Claude Code docs: code.claude.com/docs

**Platform:** Mintlify (111 `mintlify` references).
- Fonts: Inter for UI and body, `Anthropic Sans` from Google Fonts, `Styrene`, and `Paper Mono` for code.
- Accent: `--accent-brand: 15 63.1% 59.6%` (HSL, the orange-clay color).
- Dark mode uses Tailwind `dark:` classes.

Source: https://code.claude.com/docs/en/overview

**IA:** tabs `Getting started | Build with Claude Code | Plugins | Administration | Configuration | Reference | Agent SDK | What's New | Resources`. A cross-link at top right ("Claude Developer Platform") makes the two Anthropic sites look like one family while each keeps its own navigation.

**Getting started:** the overview page is also the install page.
- Top-level tabs are the surfaces: Terminal, VS Code, Desktop app, Web, JetBrains.
- Inside Terminal, nested tabs hold the install methods: Native Install (Recommended), Homebrew, WinGet.
- The page shows the exact success check (`claude --version`) and maps specific error strings to fixes, for example: "If you see `The token '&&' is not a valid statement separator`, you're in PowerShell, not CMD."

**Other page patterns:**
- A "What I want to do → Best option" routing table.
- Accordions for capability examples.
- A "Next steps" list of links.

**Search and AI:** "Search… ⌘K", plus **"Ask Assistant ⌘I"** (Mintlify AI) with the disclaimer "Responses are generated using AI and may contain mistakes." Each page also has "Copy page" and a "Was this page helpful" widget.

**LLM-facing features:**
- Every page carries an `llms.txt` pointer block at the top (rendered HTML and `.md`).
- `/docs/llms.txt` is 64 KB and is organized by sidebar group.
- `/docs/mcp` returns a JSON MCP descriptor (`"name": "Claude Code Docs", "transport": "http"`).
- `.md` versions of pages are available.

---

## 2. OpenAI: developers.openai.com

**Platform:** Astro (`<meta name="generator" content="Astro v7.3.1">`) with Starlight components, Algolia search, and Vercel hosting.
- Font: self-hosted `OpenAI Sans` (`OpenAISans-Regular.woff2`).
- Theme menu: Light, Dark, System.
- Content widths around 720–768px appear in the CSS.

Source: https://developers.openai.com/

**Multiple products under one site:** OpenAI uses a global mega-menu: `API | ChatGPT | Docs | Use cases | Training | Resources`. Each entry has a one-line description, for example "Agents — Build persistent agents on hosted infrastructure" and "API reference — Explore endpoints, parameters, and responses". https://developers.openai.com/api/docs

- **API:** Overview, Models, Agents, Tools, Audio & voice, Production, API reference.
- **ChatGPT:** Plugins, Sign in with ChatGPT, Commerce, Ads, Workspace Agents.
- **Docs:** Codex, with its own sub-tabs.
- **Resources:** Showcase, Blog, Cookbook, Learn, Community.

**Sidebar:** dense, and two to three levels deep. Groups include Get started, Core concepts, SDKs and CLI, Resources, Legacy APIs, Model catalog, Text and code, Prompting, Reasoning, and more. Legacy APIs (Assistants, fine-tuning, Agent Builder) are grouped together instead of being deleted.

**Home page:** reads like a launch page.
- DevDay 2026 banner (`devday-banner … bg-black`).
- Model spotlight cards.
- Three large cards: API Platform, Codex, Plugins.
- Featured promos, a blog grid, and a support row.

It is more marketing-forward than Anthropic's lifecycle layout. https://developers.openai.com/

**Getting started:** https://developers.openai.com/api/docs/quickstart
The sections run in this order:
1. Create and export an API key
2. Install the OpenAI SDK and run an API call
3. Add credits to keep building
4. Analyze images and files
5. Extend the model with tools
6. Stream responses
7. Build agents

That is one page that goes from first call to agents. Code samples come with a "Content switcher" for JavaScript, Python, curl, Go, Java, Ruby and .NET, with `data-language` on each block, and there are 23 "Copy code" buttons on the quickstart alone.

**API reference:** `/api/reference/resources/responses/methods/create`. The path is organized resource → method, the way an SDK is. Each method shows the endpoint line, a content type, nested body parameters, "Response example" blocks (8 on this page), and inline "Learn more" links back to guides. https://developers.openai.com/api/reference/resources/responses/methods/create

**Search and AI:** Algolia search with a "Suggested" list (responses create, reasoning_effort, realtime, prompt caching), plus a **"Docs agent"** chat ("Start a new docs agent chat"). A copy link sits on every heading. I found no "Copy page" control.

**LLM-facing features:** https://developers.openai.com/llms.txt
- Every page has a banner: "For the complete documentation index, see llms.txt. Markdown versions … by appending `.md`."
- The root `llms.txt` is a **router**: separate `llms.txt` files per product (API, Ads, SIWC, Plugins, Codex, Commerce, Cookbook…), a "Common tasks" list, and "Learning tracks".
- The `/mcp` endpoint exists: it returns a JSON-RPC 405 to GET, as an MCP endpoint should.

---

## 3. Google Gemini: aistudio.google.com/docs

**Migration:** the Gemini API docs moved off ai.google.dev's DevSite and into AI Studio (301 observed). The new page is a client-rendered Google app.
- Fonts: Google Sans, Google Sans Display, Google Sans Text, Google Sans Flex, Google Sans Mono.
- Source files use Markdoc syntax (`{% tabs %}`, `{% callout %}`, `{% button variant="ais" %}`), visible in `.md` output.

Sources: https://aistudio.google.com/docs and https://aistudio.google.com/docs/get-started.md

**Home page:** https://aistudio.google.com/docs
- **Two-column hero:** "Welcome to Gemini API", with `Get Started` and `Create API Key` buttons beside a code panel with tabs **Agents, Python, JavaScript, REST, Java, Go**. The first tab, "Agents", contains shell commands that connect the Docs MCP server, install agent skills and a plugin, and install a CLI. Agent setup is treated as a first-class "language".
- **"Meet the models" cards:** model code, context, output limits and modalities, with "Try in AI Studio" buttons.
- **"Explore Capabilities":** nine tabs (Image, Video, Voice, Thinking, Tools, Structured, Long context, Function calling, Document understanding), each with code and a "Read docs" button.
- **API status note:** states that the Interactions API is the default as of June 2026 and that `generateContent` is legacy.

**Getting started:** https://aistudio.google.com/docs/get-started.md
- One long numbered tutorial with 11 sections: get key → install SDK and first call → stream → multi-turn → multimodal → generation → structured output → tools → functions → managed agent → background tasks.
- It claims "first API call in under a minute".
- It opens with a "Choose the right Gemini tool" table (SDKs vs Docs MCP and skills vs CLI) with "When to use it" guidance.
- AI Studio auto-creates the API key for new users, which removes a step.

**Model pages:** one per model (`/docs/models/gemini-3.8-flash`). The model ID is a heading anchor.

**LLM-facing features (the most opinionated of the five):** https://aistudio.google.com/llms.txt
- `llms.txt` (48 KB) opens with **"How agents should use this documentation"**. It gives prescriptive rules: "Always use `google-genai` … Never generate code using deprecated packages like `google-generativeai`", and use the Interactions API by default.
- It lists agent setup tools: Docs MCP at `gemini-api-docs-mcp.dev`, a skills repository, and a plugin.
- `llms-full.txt` (6.5 MB) and `.md` on every page; each `.md` starts with an "AI Agent Context" block.
- The API reference is split into Core, Real-time, Agent and Platform APIs.

---

## 4. Mistral: docs.mistral.ai

**Platform:** a custom Next.js build (`_next/static`, `/_next/image`).
- The design tokens look like shadcn/ui (`--accent`, `--accent-foreground`, `--background:#fff` and `#101010`, with `lab()` colors).
- Code font: `sfMono`. The sans font sits behind a hashed `next/font` variable, so I could not identify it.
- A theme toggle and decorative background art (`mix-blend-multiply dark:mix-blend-screen`).

Source: https://docs.mistral.ai/

**IA by product:** top tabs `Vibe | Studio | Inference & Models | Admin | Resources | API Reference`. They map to products and audiences (end users, developers, org admins), not to doc types. The sidebar on the home page is short: Getting started, Platform overview, Quickstarts per product, and external links to Glossary, SDK Clients and API Reference.

**Home page:** https://docs.mistral.ai/
- Four shortcut tiles.
- "Discover our platform": three product cards and "Compare our products".
- "Latest models": license tag and version per model.
- **A filterable grid of about 30 quickstarts** (All / Vibe Work / Vibe Code / Audio / Studio / Inference / Admin). Each card shows **"N min to complete"**. This is the clearest time-to-first-success signal of the five sites.

**Code samples:** on https://docs.mistral.ai/inference/conversations/chat-completion
- Language tabs: python, typescript, curl.
- An orthogonal toggle for Non-Streaming vs Streaming, with an "Output" tab.
- SDK version toggles (V2/V1, Synchronous/Asynchronous).
- Breadcrumbs, and prev/next links at the bottom.

**Models:** a single "Models Overview" page lists "every Mistral model with its API name, status and context length, including deprecated and retired models". Deprecated features live under `/resources/deprecated/`. Source: https://docs.mistral.ai/llms.txt

**Search, AI and LLM-facing features:**
- Search docs ⌘K. I saw no Ask AI widget and no Copy page button, only "Copy section link".
- `llms.txt` (102 KB, 547 links) and `llms-full.txt` (4.5 MB) exist, and `llms-full.txt` says pages are available at `.md`. However, `/getting-started/quickstarts.md` returned 404, so `.md` coverage is incomplete.

---

## 5. Cohere: docs.cohere.com

**Platform:** Fern (`fern-header`, `fern-sidebar`, a "Built with" footer) on Astro islands.
- Fonts: `Unica77Cohere` (headings), `CohereText`, `CohereMono`.
- A green accent ramp in `oklch` (`--accent-10: oklch(50% 0.0461 167.1)`), defined for both light and dark.

Source: https://docs.cohere.com/v2/docs/the-cohere-platform

**IA:** top tabs `Guides and concepts | API Reference | Release Notes | LLMU | Cookbooks`. This is the cleanest split by doc type of the five: guides, reference, changelog, a course and examples, each in its own tab. Header links go to DASHBOARD and PLAYGROUND. Sidebar groups include Get Started, Model Vault, Models, Text Generation, Embeddings, Reranking and Going to Production.

**Versioning:** an API version switcher (`v2 API` default, `v1 API`).
- Separate `llms.txt` per version (`/v2/llms.txt`, `/v1/llms.txt`).
- Each page states "This page is for version v2 API (default)".

**API reference:** https://docs.cohere.com/reference/chat
- Sections for Authentication, Headers and Body, a `200` response, and an Errors table covering 400–504.
- Named example scenarios ("Default", "Documents", "Tools"), each with request, response and SDK code.
- Language tabs for TypeScript, Python, Go, Java, Ruby, PHP, C# and Swift.
- A **"Try it"** button: Fern's API playground in the browser.

**Page chrome:** "On this page" TOC, "Copy page", "Was this page helpful? Yes/No", "Edit this page", Previous/Next, and "Ask AI" next to search (`/`).

**LLM-facing features:**
- The root `/llms.txt` is a 662-byte router that gives agents instructions: append `.md`, append `/llms.txt` to any section, and connect to the MCP server at `/_mcp/server`.
- That endpoint returns JSON `"name":"fern-docs-mcp-server"`. Fern generates all of this automatically.

---

## Common patterns (all or nearly all five)

| Pattern | Evidence | Why it works |
|---|---|---|
| `llms.txt` + `.md` per page | All five sites. Claude, OpenAI, Gemini and Cohere also put a banner on every page pointing agents to the index | Coding agents now read docs too. A clean Markdown copy avoids scraping navigation chrome |
| Docs MCP server | Claude Platform `/docs/mcp`, Claude Code `/docs/mcp`, OpenAI `/mcp`, Cohere `/_mcp/server`, Gemini `gemini-api-docs-mcp.dev`. Not seen on Mistral | Lets agents search the live docs instead of relying on stale training data |
| Code on the home page | Claude (9 tabs), Gemini (6 tabs, including "Agents") | The first call is visible with zero clicks |
| A language switcher that persists across code blocks, with Copy on every block | OpenAI "Content switcher" (7 languages), Claude (9), Cohere (8), Mistral (3) | A reader picks a language once |
| Guides and API reference in separate navigation trees | Claude `/api/...` tab, OpenAI `/api/reference/...`, Cohere "API Reference" tab, Mistral "API Reference" tab, Gemini `/api-reference/...` | Reference is browsed by endpoint, guides by task. Mixing them breaks both |
| Model catalog plus one page per model | All five | Model IDs, limits and retirement dates are what people look up most |
| Theme toggle with system default; dark mode built into the tokens | Claude (`data-mode`), OpenAI (Light/Dark/System), Mistral, Cohere, Claude Code | Expected baseline |
| A named custom brand typeface instead of system fonts | Anthropic Sans/Serif, OpenAI Sans, Google Sans, Unica77Cohere | Distinguishes the docs from generic templates. Mistral is the outlier: its body font sits behind a hashed `next/font` variable and only `sfMono` is visible |
| Copy-link anchor on every heading | All five | Supports deep linking from support threads and from agents |

## Where they diverge

1. **Build vs buy**
   - **Custom builds:** Claude Platform (Next.js), OpenAI (Astro/Starlight), Mistral (Next.js), Gemini (a Google app).
   - **Vendor platforms:** Claude Code (Mintlify), Cohere (Fern).
   - Both Anthropic sites carry the same feature set: `llms.txt`, `.md`, MCP, Copy page, Ask AI. A vendor platform can match a custom build on these features.
2. **How the top navigation is organized**
   - **By product:** Claude (Messages / Managed Agents / Admin), Mistral (Vibe / Studio / Admin), OpenAI (API / ChatGPT / Codex).
   - **By doc type:** Cohere (Guides / Reference / Release Notes / LLMU / Cookbooks).
   - Product-first works when the products have different audiences. Doc-type-first works for a single API product.
3. **What the home page is for**
   - **A lifecycle map:** Claude (Get started → Build → Evaluate and ship → Operate).
   - **A filterable quickstart catalog:** Mistral, with time estimates.
   - **A launch and news hub:** OpenAI (DevDay banner, blog grid).
   - **A capability showcase:** Gemini (9 tabs).
   - **A plain article:** Cohere.
4. **Getting-started shape**
   - **One long progressive tutorial:** Gemini (11 steps) and OpenAI (7 sections, through to agents).
   - **A short numbered quickstart:** Claude (5 steps).
   - **Many small task quickstarts:** Mistral (about 30 cards, 5–15 minutes each).
5. **Ask AI**
   - Claude Platform (Inkeep), Claude Code (Mintlify ⌘I), OpenAI ("Docs agent") and Cohere (Fern) all have one.
   - Mistral: none seen.
   - Gemini: could not be checked (client-rendered).
6. **How strongly agents are steered**
   - Gemini's `llms.txt` gives orders ("Never generate code using deprecated packages").
   - OpenAI's is a router across product indexes.
   - Claude's lists locales, the MCP server and SDK versions.
   - Cohere's is a short instruction block.
7. **Interactive API calls**
   - Cohere has "Try it" in the reference.
   - The others send readers to their console playgrounds: Claude Console playground, AI Studio "Try in AI Studio", Mistral "Try Studio".
8. **Versioning**
   - Only Cohere versions the whole docs site (v1/v2 switcher plus per-version `llms.txt`).
   - The others version models, not docs. They keep legacy APIs in labeled sections: OpenAI "Legacy APIs", Mistral `/resources/deprecated/`, Gemini's "`generateContent` is legacy" note.

## What carries over to a multi-product data platform (CDI + Signals)

Each item below names the site where the pattern was observed.

- **Product tabs with a fixed link triple per product.** Claude's home cards give each product the same three links: Quickstart / API reference / SDK or setup.
- **A lifecycle strip on the home page,** in the style of Claude's `Get started → Build → Evaluate and ship → Operate`. For example: Collect → Validate → Model → Activate.
- **Quickstart cards with "N min to complete" and product filters** (Mistral).
- **An "I want to… → Best option" routing table** where several surfaces overlap (Claude Code overview).
- **Machine-readable docs:** an `llms.txt` per product, `.md` on every page, a per-page banner pointing to the index, and an MCP endpoint. Fern and Mintlify generate these automatically (Cohere, Claude Code). A Docusaurus site would need plugins or custom build steps for the same result.
- **Prescriptive agent rules at the top of `llms.txt,`** as Gemini does. For example: which tracker and SDK versions are canonical, and which are deprecated.
- **A cross-product language/platform switcher that persists across a page,** plus Copy page, Copy code, and copy links on headings and parameters.

## Sources

- https://platform.claude.com/docs/en/home
- https://platform.claude.com/docs/en/get-started
- https://platform.claude.com/docs/en/get-started.md
- https://platform.claude.com/docs/en/api/messages/create
- https://platform.claude.com/docs/en/about-claude/models/overview
- https://platform.claude.com/llms.txt
- https://code.claude.com/docs/en/overview
- https://code.claude.com/docs/llms.txt
- https://code.claude.com/docs/mcp
- https://developers.openai.com/
- https://developers.openai.com/api/docs
- https://developers.openai.com/api/docs/quickstart
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/llms.txt
- https://developers.openai.com/api/docs/models.md
- https://aistudio.google.com/docs
- https://aistudio.google.com/docs/get-started.md
- https://aistudio.google.com/llms.txt
- https://docs.mistral.ai/
- https://docs.mistral.ai/inference/conversations/chat-completion
- https://docs.mistral.ai/llms.txt
- https://docs.mistral.ai/llms-full.txt
- https://docs.cohere.com/
- https://docs.cohere.com/v2/docs/the-cohere-platform
- https://docs.cohere.com/reference/chat
- https://docs.cohere.com/llms.txt
- https://docs.cohere.com/_mcp/server
- Third-party search results checked on the Gemini move; none confirmed the redirect, so the 301 above is first-hand: https://techdevnotes.com/releases/gemini-docs/20260714-000350Z-88aa88d98750 and https://cloudinsight.cc/en/blog/gemini-api-documentation-guide

Raw HTML, CSS and `.md` captures are saved in `/tmp/claude-0/-workspace-documentation/45bba125-6784-5ec8-8d9b-f178f09b9186/scratchpad/html/`.