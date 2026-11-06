# Snowplow documentation IA recommendations for CDI and Signals

**Repo facts checked for this report:**
- Redirects run through the Netlify-style `static/_redirects` file. There is no client-redirects plugin.
- Forwarding integration pages already render settings from schemas using `src/components/EventForwardingSchemaTable` (Amplitude, Mixpanel, Braze).
- The "hidden" `docs/signals/index.md` is linked from `docs/get-started/index.md:9` and `docs/glossary/index.md:69`.

---

## 1. Core principles

Each principle below is tied to its evidence and then to what it means for Snowplow.

1. **Products first, then a lifecycle inside each product.**
   - **Evidence:** Claude, Mistral and OpenAI split their top navigation by product (AI-labs §"Where they diverge" 2). Stripe, Vercel, Cloudflare and Mintlify "Products" add a product switcher that scopes the sidebar (DevTools §1). RudderStack names its sidebar groups by verb: Collect, Unify, Activate, Govern, Monitor (Peers §1). Tecton groups work by workflow verbs (Peers §4).
   - **For Snowplow:** CDI and Signals serve different audiences, so the condition for a product-first split holds (AI-labs, divergence 2). Today the sidebar is grouped by component. Its "Data Infrastructure" section has 13 siblings, and the "Pipeline" section is named after an internal component (IA audit §1 and §5).

2. **Every page works as page one.** Each page states its context, lists its prerequisites inside the page, and avoids "as mentioned above".
   - **Evidence:** EPPO's seven traits (Frameworks §1). Minimalism's "independent of sequence" (Frameworks §1). kapa.ai's self-contained sections for retrieval (Frameworks §4).
   - **For Snowplow:** this also covers LLM chunk retrieval, which matters because AI readers rose from about 9% to about 41% of traffic on GitBook-hosted docs (Frameworks §3).

3. **Put concepts where tasks need them, and keep Fundamentals as the single explanation hub.**
   - **Evidence:** about half of the developers observed barely opened the Concepts page (Meng 2019). Meng's Guidelines 1.2 and 3.3 call for concepts next to tasks, and Write the Docs' ARID principle accepts some repetition. Segment's Spec works as a shared hub between collection and destinations (Peers §1).
   - **For Snowplow:** this matches the existing CLAUDE.md rule to link to `/docs/fundamentals/` rather than re-explain. Keep the rule, but allow a one-sentence inline definition followed by the link.

4. **Keep content types separate, and split them gradually.**
   - **Evidence:** Diátaxis warns that mixed types degrade each other and advises against empty scaffolding (Frameworks §1).
   - **For Snowplow:** the audit found how-to and reference fused in `pipeline/collector`, `signals/connection` and the web tracker pages, and found no `content_type` metadata on any page (IA audit §4). Add the metadata first, then split pages one at a time. Do not create four empty folders.

5. **Accuracy, completeness and explained examples come before polish.**
   - **Evidence:** Uddin and Robillard name six "blocker" problems, including obsolete docs and unexplained examples. Meng 2020 Guideline 2.1 asks for clean, copy-pasteable examples.
   - **For Snowplow:** fix duplicates and contradictions before redesigning. Examples: querying is covered 3 times, cross-domain tracking 3 times, and two pages share the title "User and session identifiers" (IA audit §6).

6. **Avoid fragmentation, and favor fewer, more complete pages.**
   - **Evidence:** Uddin and Robillard report "10s of clicks" as a named problem. Meng Guideline 1.3 says to keep information on one page when search is weak.
   - **For Snowplow:** failed events are spread across 4 locations, and manual recovery alone has 15 pages (IA audit §6).

7. **Give a short overview and get the reader to a first success fast.**
   - **Evidence:** developers first form a "global understanding" (Meng 2018). Wayne adds a "conceptual overview" content type. In the Google log study, new users who visited Guide pages had 3.92 times the odds of making a successful API call. Mistral's quickstart cards show "N min to complete" (AI-labs §4).
   - **For Snowplow:** the CDI path today ends on a comparison table with no next step, and the Signals path leaves the docs or jumps instance into `/tutorials` (IA audit §3).

8. **Use descriptive, front-loaded labels.**
   - **Evidence:** information-scent theory, NN/g's advice against branded or jargon labels, and Google's task-verb headings (Frameworks §1).
   - **For Snowplow:** prefer labels such as "Load and forward data" over "Components" or "Pipeline".

9. **Docs are code: generate reference material from its source.**
   - **Evidence:** Write the Docs' docs-as-code guidance (Frameworks §1). Segment's settings tables match its product UI field for field (Peers §2).
   - **For Snowplow:** `EventForwardingSchemaTable` and `enrich-dbt-schemas.js` already do this. Extend the pattern to loaders, Snowbridge and the tracker matrix.

10. **Machine-readable docs that agents are pointed at, and that steer them.**
    - **Evidence:** in the Ahrefs study, 97% of llms.txt files got zero requests; agents fetch them only when directed. In Vercel's evals, an `AGENTS.md` index reached a 100% pass rate against 53–79% without it. Stripe and Gemini use llms.txt to steer agents away from deprecated APIs (Frameworks §4, AI-labs §3).

11. **Never hide required content in tabs, widgets or diagrams.**
    - **Evidence:** NN/g says non-default tabs should hold only supplemental content. kapa.ai recommends plain-text alternatives to JavaScript widgets (Frameworks §1 and §4).
    - **For Snowplow:** keep the platform tabs that CLAUDE.md mandates, because platforms are mutually exclusive. Keep prerequisites and warnings outside the tabs.

### Existing strengths to keep

These all come from IA audit §8.
- The style guide plus its LLM twin, and the CLAUDE.md IA rules. This system is ahead of most vendors.
- The Fundamentals hub and the "link, don't re-explain" rule.
- Build guards set to `throw` on broken links and anchors, and the `/index.md` link convention.
- 100% coverage of `description` and `keywords`, plus `showLastUpdateTime` and `editUrl`.
- The custom `docusaurus-plugin-llms-txt`: `llms.txt`, `llms-full.txt`, a `.md` twin for every page, and version-aware exclusion. All five AI labs ship this baseline too (AI-labs, Common patterns).
- **Copy Markdown** and **Download** buttons on every page.
- `<Tabs groupId queryString>` with a persisted platform choice.
- `AvailabilityBadges`.
- The landing component kit: `CardGrid`, `CallToActionCard`, `FeaturedSection` and `LinkCard`.
- The Tutorials instance with `meta.json` tags.
- The clean four-part Signals structure: concepts, connection, attributes, interventions.
- `previous-versions/` isolation.
- The InterVariable font, which is already in place. Inter is the most common body face on modern developer docs (DevTools §5).

---

## 2. Proposed top-level IA

**Mechanism.** Keep a single `docs` plugin instance so that `/docs/...` URLs and the `/index.md` link rule survive. Replace the single autogenerated sidebar with **several sidebars**: `cdi`, `signals`, `reference`, `platform`. Each one is autogenerated from directories via `type: 'autogenerated', dirName`. Navbar items of type `docSidebar` switch between them. The DevTools §6 table, row 1, marks this as feasible in Docusaurus 3.

The first phase reassigns sidebars **without moving any files**, so no URLs change. Files move later, in phase 3.

```
Navbar:  Home | Data Infrastructure (CDI) | Signals | Reference | Tutorials | Platform & AI | Release notes ↗
         [Search + Ask AI]  [theme: light/dark/system]

Home (docs/introduction.md, redesigned)
  Hero: two equal product cards, each with the same three links
  Lifecycle strip with one tab per product
  Agent setup block
  "What's new" strip

CDI sidebar  (≤7 groups, lifecycle verbs)
├─ Get started              overview · choose deployment · set up Console · track first event · query · model · try with Micro
├─ Design tracking          tracking plans · data structures · Snowtype · Event Studio (from event-studio/)
├─ Collect events           trackers hub + feature matrix · web · mobile · server · other · built-in events and entities (from sources/, events/)
├─ Validate and enrich      collector · enrichments · failed events (task side) · testing (Micro, Inspector)
├─ Load and forward         warehouses and lakes · streams · event forwarding catalog · reverse ETL
├─ Model and unify          dbt packages · Identities (incl. identities dbt package)
└─ Monitor and operate      monitoring · alerts · recovery · self-hosted operations

Signals sidebar  (workflow verbs; Tecton/Feast pattern)
├─ Get started              overview + persona router · quickstart (in-sidebar) · Sandbox
├─ Concepts                 one running example · push vs pull (services vs interventions) · architecture
├─ Connect                  Console · credentials · SDK install (Python/TypeScript)
├─ Define attributes        attribute keys · attribute groups · stream vs batch (capability matrix)
├─ Serve attributes         services · retrieve in apps · serve to AI agents
├─ Intervene                define · subscribe · examples
└─ Publish and operate      publish/unpublish/delete lifecycle · testing with Inspector · monitoring

Reference sidebar  (lookup only; Cohere/OpenAI-style separate reference tree)
├─ APIs                     Console API · Signals API · collector HTTP interface
├─ SDK reference            tracker APIs · Signals Python/TypeScript SDK · analytics SDKs
├─ Component configuration  collector · enrich · loaders · Snowbridge · Iglu · Micro/Mini
├─ Schemas and data         JSON Schema reference · failed event types · dbt variables
├─ Versions and compatibility  component version matrix · dbt × warehouse matrix
└─ Legacy                   all previous-versions/ trees, collapsed

Platform & AI sidebar  (shared by both products)
├─ Fundamentals             events · entities · schemas · failed events · tracking plans (single source)
├─ Working with AI          docs for agents (llms.txt, .md, MCP) · Snowplow MCP servers · agent skills · IDE setup
├─ Account management
├─ Security and policies    shared responsibility · deprecation policy · restrictive access · licensing (from src/pages/)
├─ Migration guides
└─ Glossary
```

### Rationale

- **Two equal product tabs.**
  - **Evidence:** Claude, Mistral, OpenAI and Confluent all use product tabs or a product switcher, and Anthropic gives each product card the same three links: Quickstart, API reference and SDKs (Peers §1).
  - **Current problem:** Signals is invisible once a reader scrolls past the hero, and the CDI section has 13 siblings (IA audit §2 and §5).
- **Fundamentals stays a single shared hub.**
  - **Evidence:** this follows Segment's shared Spec (Peers §1).
  - **Scope:** Signals readers need events, entities and schemas just as much as CDI readers do.
- **A separate Reference tab.**
  - **Evidence:** all five AI labs separate reference from guides (AI-labs, Common patterns).
  - **Current problem:** the "Components" section is not a reference layer today (IA audit §4).
- **Working with AI moves to the shared sidebar.**
  - **Evidence:** RudderStack, dbt and Hopsworks each give AI its own top-level section (Peers §6).
  - **Current problem:** `llms-support` sits at position 2.5 inside CDI, even though it covers both products (IA audit §6).
- **Policies move into the docs sidebar.** The three policy pages in `src/pages/` have 0 inbound links (IA audit §6).
- **Seven groups or fewer per sidebar.** The audit recommends about 5 groups and flags 13 as above what people scan easily (IA audit §5). Seven verb groups keep the CDI lifecycle readable.

### Home page design

- **Hero:** two product cards, each with Quickstart, Reference and SDKs links.
- **Lifecycle strip:**
  - CDI: Design → Collect → Validate → Load → Model.
  - Signals: Define → Serve → Intervene.
  - Pattern: Claude's `HomeJourney` (AI-labs §1a).
- **Quickstart cards with "N min" estimates and a product filter.** Pattern: Mistral (AI-labs §4).
- **Agent setup block with a copy button.** Pattern: Vercel, Supabase and Cloudflare (DevTools §2).
- **"What's new" strip** fed from release data. Pattern: Vercel and Cloudflare.

### Visual modernization

All of these come from DevTools §5 and §6.
- **Prose width:** cap `.markdown` at about 680–720px inside a wide shell.
- **Fonts:** Inter for body text (already in place) plus a distinctive self-hosted mono, such as JetBrains Mono.
- **Radius and borders:** a 4–12px radius scale set through Infima variables, hairline borders, and accent color used only on links, active navigation and callout edges.
- **Theme toggle:** light, dark and system, built by swizzling `ColorModeToggle`.
- **Headings:** a copy-link control on every heading.
- **Page foot:** a Yes/No feedback widget and a "Next steps" block.
- **Tailwind:** keep preflight off, put Tailwind utilities in a layer above Infima, and restyle through Infima variables instead of fighting selectors (DevTools §6 caveats).

---

## 3. Standard page anatomy per content type

Add `content_type: concept | how-to | tutorial | reference | integration | sdk | landing` to the frontmatter, next to the required CLAUDE.md fields. The `llms.txt` plugin can then emit indexes per product and per type.

Every type shares these rules, which follow CLAUDE.md:
- The H1 comes from `title`.
- A one-line summary sits under the title, rendered from `description`. This follows Stripe's pattern (DevTools §3).
- Use 3–5 H2 sections, all in sentence case and all preceded by text.
- End with a "Next steps" section. Supabase and Stripe both do this.

| Type | Required sections (in order) | Evidence |
|---|---|---|
| **Concept** | 1. Summary of what it is and why it matters, on the first screen.<br>2. How it works: prose plus a diagram, with a text equivalent of the diagram.<br>3. One concrete example. In Signals, this is the running example.<br>4. Related concepts, linked to Fundamentals.<br>5. Next steps, pointing to how-tos.<br>No procedures on this page. | Diátaxis explanation; Tecton's running example; kapa.ai on diagrams |
| **How-to** | 1. Overview: when and why to do this.<br>2. Before you begin: prerequisites, availability badges, and "Requires vX" markers.<br>3. Steps: numbered, one action each, starting with a verb, with optional steps marked "Optional:", and no more than 8–10 steps.<br>4. Verify the result.<br>5. Troubleshooting: exact error string mapped to the fix.<br>6. Next steps. | Good Docs how-to template; Google procedures; Claude Code error-to-fix mapping (AI-labs §1b) |
| **Tutorial** | 1. Outcome and time estimate ("N min").<br>2. Requirements, using the existing `tutorial-requirements/` kit.<br>3. Sequential steps, each ending with a visible result.<br>4. Clean-up.<br>5. What you learned and next steps.<br>Follow `/tutorials/_README.md`. | Minimalism; Mistral time estimates |
| **Reference** | 1. One-line purpose.<br>2. Lookup tables: parameter, type, required, default, description.<br>3. Example request and response, or example config.<br>4. Errors table.<br>5. Version applicability.<br>No narrative; link out to how-tos.<br>Generate from schemas where possible. | Claude and OpenAI API reference; Cohere errors table |
| **Integration (catalog page)** | 1. Overview.<br>2. Compatibility: a features table with type (forwarder, loader or Snowbridge target), delivery (batch or streaming), clouds, entity handling and lifecycle status.<br>3. Connect: credentials and permissions.<br>4. Configure: a settings table generated by `EventForwardingSchemaTable`.<br>5. Troubleshooting and common errors.<br>Every integration page uses the same H2s in the same order. | Hightouch, Fivetran and Segment (Peers §2) |
| **Tracker SDK (landing page per tracker)** | 1. Status block: support tier, current version, and links to GitHub and the SDK reference.<br>2. Feature support: this tracker's row from the hub matrix.<br>3. Install and initialize, with platform or package-manager tabs.<br>4. Track your first event.<br>5. Next steps: built-in events, entities, configuration and Snowtype.<br>Method-level detail lives in Reference > SDK reference. | Segment support block; PostHog matrix (Peers §3) |

---

## 4. Getting-started journeys per persona

Click depth is counted from the docs home to the first success.

| Persona | Journey | Today | Target |
|---|---|---|---|
| **Data engineer** (deploy CDI, see events in the warehouse) | 1. Home → CDI card **Quickstart**.<br>2. `Get started` overview, which ends in a "choose your deployment" decision table with a call to action per row.<br>3. Set up Console (CDI Cloud) or the Self-Hosted quick start.<br>4. Track your first event, using the existing in-page sender.<br>5. Query your data. | 4–5 pages, with no call to action at the end of `get-started/index.md` and Console ordered after tracking (IA audit §3) | **3 clicks** to the setup page, 5 to queried data. Add a "Try with Snowplow Micro" path that needs no infrastructure: 2 clicks. |
| **Analytics engineer** (model data with dbt) | 1. Home → lifecycle strip **Model**.<br>2. dbt packages hub, with a package × dbt version × warehouse compatibility table.<br>3. Quick start for the Unified Digital package. | Buried inside the 112-file `modeling-your-data` | **2 clicks** to install instructions |
| **App or ML engineer** (Signals) | 1. Home → Signals card **Quickstart**.<br>2. Signals quickstart inside the Signals sidebar: connect, define an attribute group, retrieve it in Python or TypeScript.<br>3. Persona router: "Personalize an app" vs "Feed an AI agent". | About 5 pages, with a jump to the tutorials instance or out to the external Sandbox (IA audit §3) | **2 clicks** to the first attribute definition, without leaving the Signals sidebar. The Sandbox becomes an option inside the quickstart. |
| **AI agent** (coding assistant) | 1. A human pastes the agent snippet from the Home block or the `llms-support` page.<br>2. The agent reads `/llms.txt`, which opens with agent instructions and links to per-product indexes.<br>3. The agent fetches the `.md` page it needs, or queries the docs MCP server. | `llms.txt` exists but nothing directs agents to it; there is no per-product index and no docs MCP server (IA audit §7) | **0 human clicks** after the snippet is pasted; 2 fetches per answer |

---

## 5. Integrations catalog, multi-language trackers and versioned components

### Integrations catalog

This covers `destinations/forwarding-events/integrations/`, the loaders and the Snowbridge targets.
- **One "Destinations catalog" hub** with a full compatibility matrix: destination × type (forwarder, loader, Snowbridge target, reverse ETL) × delivery × clouds × status. Patterns: Segment's methods chart and RudderStack's tables (Peers §2).
- **Query-string filters** such as `?category=analytics&type=forwarder`, so every filtered view has its own link. Pattern: mParticle. Build the filters as a static React component over a JSON manifest so that the `.md` export still lists every row.
- **A maintainer and tier label** on each integration: Snowplow-maintained, partner-built or community. Patterns: Fivetran's partner-built connectors and Feast's core vs community implementations.
- **Fixed page template** (section 3). Settings tables are always generated from the schema; `EventForwardingSchemaTable` already exists, so apply it to every forwarding integration and add the same approach for Snowbridge targets.

### Multi-language trackers

There are about 20 trackers, and `sources/` holds 508 files.
- **Trackers hub feature matrix.** Pattern: PostHog (Peers §3).
  - Columns: page or screen views, activity tracking, built-in entities, anonymous tracking, media, e-commerce, Snowtype, batching, consent and data-model support.
  - Generate the matrix from a YAML manifest, which also feeds `llms.txt` agent rules.
- **A support tier on every tracker:** Flagship, Maintained or Community, or alternatively current, maintenance or legacy. Patterns: Segment and Amplitude. Today "deprecated" is the only status label.
- **Keep the CLAUDE.md platform tabs** (`groupId` and `queryString`), with prerequisites, warnings and concepts outside the tabs (Frameworks §5).
- **Add an acceptance check:** confirm the `.md` export from `plugins/docusaurus-plugin-llms-txt` includes every tab panel. Fern's export keeps all tabs, but the research notes that the risk depends on the renderer (Frameworks §4).
- **Version requirements as inline "Requires vX.Y" callouts,** not separate pages. Pattern: Segment.

### Versioned components

- **Version components, not the site.** Don't adopt Docusaurus whole-site versioning. Each component ships on its own schedule, so Tecton-style whole-site snapshots don't fit (Peers §5).
- **Use inline markers:**
  - "Applies to Enrich 5.x and later" (dbt's "Applies to" pattern).
  - Managed vs Self-Hosted markers, by extending `AvailabilityBadges` (Confluent's tags).
- **Move all 277 `previous-versions/` pages into Reference > Legacy.** Patterns: OpenAI's "Legacy APIs" and Mistral's `/resources/deprecated/`. This keeps them out of the main sidebars, flattens depth 7–9, and keeps them excluded from `llms-full.txt`.
- **Add a Versions and compatibility page** built from `api-reference/versions`, plus release notes per component linked from each component page (Fivetran pattern).

---

## 6. LLM and agent readiness plan

Build on the existing plugin. Every item below names its precedent.

1. **Agent instructions at the top of `/llms.txt`.** Precedents: Stripe, Gemini and PostHog.
   - State the canonical current tracker majors and the Signals SDK packages.
   - Name what is deprecated, for example the Tracking CLI and legacy recovery paths.
   - Say "use self-describing events and entities", and never use the terms "unstructured event" or "context".
   - Tell agents to check registries for current versions rather than relying on memory.
2. **A router `llms.txt`** with per-product indexes: `/docs/signals/llms.txt`, a CDI index, and a Reference index. Precedents: OpenAI and Cohere.
   - These fix the problem that tracker pages dominate `llms-full.txt` (IA audit §7).
   - Use `content_type` to add a "Common tasks" section.
3. **A one-line banner on every page and a `rel="alternate" type="text/markdown"` link.** Precedents: Claude, OpenAI and Cohere, plus the llms.txt spec.
4. **A hosted docs MCP server** with `search_docs` and `get_page` tools, announced in `llms.txt`. Precedents: Anthropic, OpenAI, Cohere, Hightouch and Hopsworks. Keep it separate from the Snowplow CLI MCP server that already exists.
5. **A pasteable `AGENTS.md` / `CLAUDE.md` snippet** on the Working with AI page and in the Home agent block. Evidence: Vercel's 100% vs 53% eval result, and Ahrefs' "fetched when directed".
6. **Expand the page actions menu** beyond Copy Markdown and Download: add View as Markdown, Open in Claude, Open in ChatGPT and Copy MCP URL. Precedent: Mintlify's contextual menu. The research calls these deep links trivial to add (DevTools §6).
7. **Ask AI in search** with DocSearch v4 AskAI. Docusaurus 3.9 supports this, and Claude, OpenAI and Cohere all offer an Ask AI feature.
8. **Writing rules for retrieval,** added to the LLM style guide (kapa.ai):
   - No "above" or "below".
   - Error strings quoted next to their fixes.
   - Diagrams restated as numbered steps.
   - One term per concept.
   - Fix the `# Same as` comments inside code fences that read as headings to naive parsers (IA audit §4).
9. **Measurement.** Log requests for `.md` files, `llms.txt` and MCP, broken down by user agent. 57% of docs teams don't track leads from their documentation (GitBook State of Docs 2026).

---

## 7. Migration plan

All phases follow CLAUDE.md:
- Kebab-case directories, each with an `index.md` inside.
- Absolute `/docs/.../index.md` links, verified by the build guards.
- H2 and H3 only, with 3–5 H2s per page.
- Required frontmatter on every page.

Every moved URL also gets an entry in `static/_redirects`.

### Phase 1: quick wins (no URL changes, 1–3 weeks)

| Action | Files |
|---|---|
| Add next-step calls to action at the end of the deployment comparison | `docs/get-started/index.md` |
| Reorder Get started as Console → Track → Query → Model → Custom events → Failed events | `sidebar_position` in `docs/get-started/*/index.md` |
| Fix position ties | `account-management` and `signals` both at 8.7; `identities` and `destinations` both at 6 |
| Replace the hidden duplicate: turn `docs/signals/index.md` into the real Signals landing page (persona router) or delete it and redirect it; repoint its 2 inbound links | `docs/signals/index.md`, `docs/get-started/index.md:9`, `docs/glossary/index.md:69` |
| Add a Signals card to the home `FeaturedSection` and use the three-link pattern on both product cards | `docs/introduction.md` |
| Add an agent instructions block to `llms.txt` and a per-page Markdown banner | `plugins/docusaurus-plugin-llms-txt/generate-index.js`, `src/theme/DocItem/Layout` |
| Add the Open in Claude, Open in ChatGPT and View as Markdown actions | `MarkdownActions` |
| Fix style violations: "we" and "our" in Fundamentals, the Title Case headings in the dbt unified model, and the "Prerequsites" typo | `docs/fundamentals/index.md`, `modeling-your-data/.../dbt-unified-data-model`, `event-studio/implement-tracking/snowtype` |
| Link the policy pages from a docs page | `src/pages/{shared-responsibility-model,deprecation-policy,restrictive-access-models}` |
| Visual tokens: prose width, radius scale and mono font | `src/css/custom.css` |

### Phase 2: medium (sidebars and templates, 1–2 quarters)

| Action | Files |
|---|---|
| Split into `cdi`, `signals`, `reference` and `platform` sidebars, add navbar `docSidebar` tabs, and retire the `wrapInSections` and unwrap hacks | `sidebars.js`, `docusaurus.config.ts` |
| Add `content_type` frontmatter in batches; update the style guide, the LLM style guide and CLAUDE.md's required frontmatter | `src/pages/style-guide/`, `CLAUDE.md` |
| Merge duplicates: identifiers ×2, cross-domain ×3, querying ×3, tracking plans ×2, schema versioning ×2, destinations intro ×2, events intro ×2 | see the table below |
| Move the Signals quickstart into the Signals sidebar; keep the tutorial version for the gallery | `tutorials/signals-quickstart/` → `docs/signals/get-started/` |
| Build the tracker feature matrix and support tiers from a manifest | `docs/sources/index.md` plus a new data file |
| Build the destinations catalog hub with filters and apply the integration template | `docs/destinations/index.md`, `forwarding-events/integrations/*` |
| Emit per-product `llms.txt` files; add Ask AI to search | plugin, Algolia config |
| Redesign the home page: lifecycle strip, quickstart cards with time estimates, "What's new" strip, three-way theme toggle and feedback widget | `docs/introduction.md`, `src/components`, swizzles |

**Duplicate merges** (each with a redirect):

| Duplicate | Keep as canonical |
|---|---|
| `events/identifiers` and `events/ootb-data/user-and-session-identification` | the `ootb-data` page |
| Cross-domain tracking | the Identities concept page, plus a how-to in Collect |
| Querying | `destinations/warehouses-lakes/querying-data` for the how-to and `get-started/querying` for the tutorial; delete `event-studio/query-sql` |
| Tracking plans and schema versioning | Fundamentals for the concept, Event Studio for the how-to |

### Phase 3: large (file moves and reference generation, 2–3 quarters)

Do this phase incrementally, one group per PR, with `_redirects` entries and link verification on each.

| Current | New location | Sidebar group |
|---|---|---|
| `get-started/private-managed-cloud/` | `get-started/cdi-cloud/` and `get-started/private-managed-cloud/` (split) | CDI › Get started |
| `event-studio/` | unchanged path | CDI › Design tracking |
| `events/` | `sources/built-in-events/` (or keep the path and reassign the sidebar only) | CDI › Collect events |
| `sources/` | unchanged; `previous-versions/` subtrees → `legacy/` | CDI › Collect events |
| `pipeline/`, `testing/` | unchanged paths | CDI › Validate and enrich |
| `get-started/failed-events`, `monitoring/recovering-failed-events/manual` (15 pages) | consolidated into one how-to plus one legacy page | CDI › Monitor and operate |
| `destinations/` | unchanged | CDI › Load and forward |
| `modeling-your-data/`, `identities/` (`identities/data-models` → `modeling-your-data/.../identities`) | | CDI › Model and unify |
| `testing/snowplow-inspector/signals-integration/` | `signals/publish-and-operate/inspector/` | Signals |
| `signals/connection/` | split into `signals/connect/` (how-to) and `signals/publish-and-operate/` (lifecycle) | Signals |
| `signals/attributes/using-python-sdk/` | how-to stays; API surface → `reference/signals-sdk/` | Signals and Reference |
| `api-reference/` | `reference/` (configuration and API only); how-to and architecture content (for example `api-reference/stream-collector`) moves into the CDI lifecycle groups | Reference |
| `*/previous-versions/*` (277 pages) | `reference/legacy/...` | Reference › Legacy |
| `fundamentals/`, `llms-support/`, `account-management/`, `migration-guides/`, `licensing/`, `glossary/`, policy pages from `src/pages/` | `platform/...` path, or keep paths and reassign the sidebar | Platform & AI |
| — | Generated reference for loaders, Snowbridge and the version matrix (extend `enrich-dbt-schemas.js` and `EventForwardingSchemaTable`) | Reference |
| — | Hosted docs MCP server | Platform & AI |

**Sequencing rationale.** Diátaxis says "every step in the right direction is worth publishing immediately" and warns against empty scaffolding (Frameworks §1). Phase 1 changes no URLs. Phase 2 changes navigation and templates. Phase 3 moves files only after the new sidebars have proven out.