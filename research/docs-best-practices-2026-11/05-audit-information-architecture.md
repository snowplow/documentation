# Snowplow docs information architecture audit

**Scope:** `/workspace/documentation` (Docusaurus 3, with `docs` and `tutorials` as two separate docs plugin instances). Counts come from `find` and `wc`. `docs/` holds 1,142 `.md`/`.mdx` files, including 32 partials in `docs/reusable`. 1,007 of them are `index.md` pages. `tutorials/` holds 89 files across 15 tutorials.

---

## 1. Current top-level structure

`sidebars.js` doesn't list the sidebar by hand. Docusaurus builds it from the folders and orders it by `sidebar_position`. `wrapInSections()` then groups items into collapsible "sections" wherever a page sets `sidebar_custom_props.header`. There are four headers:

- `docs/introduction.md` sets "Data Infrastructure"
- `docs/signals/index.md` sets "Signals"
- `docs/api-reference/index.md` sets "Components"
- `docs/migration-guides/index.md` sets "Resources"

The "Signals" and "Components" sections are unwrapped (`CHILD_UNWRAP_SECTIONS`), so their children appear at section level. "Components" starts collapsed.

```
Docs tab (navbar: custom Docs/Tutorials tabs only; Algolia search)
├─ [Data Infrastructure]                      sidebar_position   files
│  ├─ Introduction (introduction.md)                0              1
│  ├─ Get started (get-started/)                    1             21
│  ├─ Fundamentals (fundamentals/)                  2             11
│  ├─ Working with AI (llms-support/)               2.5            2
│  ├─ Event Studio (event-studio/)                  3             28
│  ├─ Events (events/)                              3.5           28
│  ├─ Sources (sources/)                            4            508  (web 182, mobile 85, RN 36, Java 27, Scala 26, Node 24, Python 22, GTM 16 …)
│  ├─ Pipeline (pipeline/)                          5             30  (enrichments 25)
│  ├─ Destinations (destinations/)                  6             40  (forwarding 27, warehouses 11, reverse-ETL 1)
│  ├─ Identities (identities/)                      6              7
│  ├─ Data models (modeling-your-data/)             7            112  (dbt 96)
│  ├─ Testing (testing/)                            8.5           15
│  ├─ Monitoring (monitoring/)                      8.6           23  (manual recovery = 15)
│  └─ Account management (account-management/)      8.7            3
├─ [Signals]  (signals/index.md is hidden; its children are hoisted)        19
│  ├─ Introduction (signals/introduction/)          1
│  ├─ Get started (signals/get-started/)            8.7
│  ├─ Concepts                                      10
│  ├─ Connection                                    15
│  ├─ Attributes (Console + using-python-sdk/…)     20   (11 pages)
│  └─ Interventions (+ subscribe, python-sdk)       25
├─ [Components] collapsed (api-reference/)          9            248  (loaders 126, Snowbridge 48, Iglu 21 …)
└─ [Resources]
   ├─ Migration guides                              12             5
   ├─ Licensing                                     12.5           6
   ├─ What's new? (release-notes.md → external link)
   ├─ Community (discourse.md → external link)
   └─ Glossary                                      100            1
Tutorials tab (tutorials/, sidebarPath: false, card gallery in src/pages/tutorials.tsx)   89 files / 15 tutorials (5 are Signals)
Off-sidebar pages: src/pages/{shared-responsibility-model, deprecation-policy, restrictive-access-models, *-license-*, style-guide}
```

**Volume skew:** Sources (508) plus Components (248) make up about 66% of all files. 277 files sit in `*/previous-version*` folders, which is about 24% of the corpus. Signals is 19 files (1.7%).

---

## 2. How CDI and Signals are separated or mixed, and how readers find each

**Separation:**
- Signals is a separate sidebar section with its own landing page (`docs/signals/introduction/index.md`).
- All CDI content lives under one "Data Infrastructure" section with 13 sibling items.
- Both products share one sidebar, one search index, one navbar tab, and one tutorials gallery.
- The tutorial `meta.json` files tag each tutorial with `snowplowTech` (for example `["Signals","Console"]`), so the tutorials gallery can be filtered by product.

**Mixing:**
- Signals content inside CDI sections:
  - `docs/get-started/console/index.md` has a "Configure Signals for real-time use cases" H2.
  - `docs/testing/snowplow-inspector/signals-integration/` is in Testing.
  - `docs/llms-support/index.md` has a Signals H2.
- `docs/get-started/index.md` positions the whole company as "customer context layer … using Signals and CDI". The page is still almost entirely about CDI deployment options.
- Identities (a separate add-on) sits inside Data Infrastructure. It has the same `sidebar_position: 6` as Destinations.
- Account management and Signals both have `sidebar_position: 8.7`, so their order depends on tie-breaking.

**Discovery:**
- Home (`docs/introduction.md`) shows two equal CTA cards: "Get started with Snowplow CDI" and "Snowplow Signals". Below them are six CDI-only `FeaturedSection` blocks and three tutorials, none of them about Signals. A reader who scrolls past the cards sees no Signals entry point.
- The Signals landing page's main CTA "Get started with Signals" leaves the docs for `https://try-signals.snowplow.io/`. Its second CTA, "Snowplow for Composable Analytics", links back to `/docs/`. That frames CDI as an "analytics" product, which doesn't match "CDI" elsewhere.
- **Hidden duplicate page:** `docs/signals/index.md` is never shown in the sidebar (its own comment says it exists "for SEO purposes"). Its body is copied from `docs/signals/get-started/index.md`. It is still reachable at `/docs/signals/`, and `docs/get-started/index.md:9` and `docs/glossary/index.md:69` link to it, while 4 other files link to `/docs/signals/introduction/`.
- The product hierarchy is implied by sidebar position and headers only. No "product switcher" or product-scoped sidebar exists, unlike multi-product docs that have per-product tabs.

---

## 3. Getting-started paths

| Path | Route (pages) | Count |
|---|---|---|
| CDI (Cloud/PMC) to first event | `introduction.md` → card → `get-started/index.md` (deployment comparison; ends on a table with **no next-step CTA**) → sidebar "Setting up Snowplow CDI" (`get-started/private-managed-cloud/index.md`, which **hands off to Console onboarding**) → optional `setup-guide-aws` / `azure` / `gcp` → sidebar "Track events" (`get-started/tracking/index.md`, an in-page quick-test event sender) | 4–5 docs pages plus an out-of-docs Console step. About 4 clicks if the reader already knows to use the sidebar. |
| Self-Hosted / Community Edition to first event | `introduction.md` → `get-started/index.md` → `self-hosted/index.md` → `self-hosted/quick-start/index.md` (a single long page with Terraform, H4 "Step N" headings, about 750+ lines) → `get-started/tracking/` | 5 pages. The quick start is one very long page. |
| First data in warehouse | then `get-started/querying/` → `get-started/modeling/` | +2 |
| Signals to first attribute (docs route) | `introduction.md` → Signals card → `signals/introduction/` → sidebar "Get started" (`signals/get-started/`) → link to `/tutorials/signals-quickstart/start` (**switches docs instance, so the sidebar is lost**) → `define-attribute-group` (tutorial step 2) | About 5 pages, plus a jump into the tutorials tab |
| Signals to first attribute (CTA route) | `introduction.md` → `signals/introduction/` → external Sandbox | 2 clicks, but the reader leaves the docs |

**Ordering problems in Get started:**
- `get-started/console` (6) sorts after `tracking` (5) and ties with `querying` (6). "Track events" therefore comes before "Get started with Console", even though the Console page is where tracking plans are created.
- `get-started/custom-events` (8) and `failed-events` (9) come after modeling (7).
- `private-managed-cloud/` also holds the CDI Cloud instructions, so the folder name and URL are misleading.
- No Snowplow Micro or Sandbox "try without infrastructure" path is surfaced in CDI Get started. Signals has one.

---

## 4. Diátaxis classification sample (about 20 pages)

| Page | Lines | Dominant type | Mixing notes |
|---|---|---|---|
| `fundamentals/events` | 76 | Explanation | Clean |
| `fundamentals/tracking-plans` | 121 | Explanation | Marketing-style description ("easily generate AI and BI-ready data"). Duplicates `event-studio/tracking-plans` "Elements of a Tracking Plan". |
| `fundamentals/index.md` | — | Explanation | Uses "we" and "our", which the style guide forbids |
| `events/custom-events` | 122 | How-to | Clean |
| `sources/web-trackers/tracker-setup` | 70 | How-to | No H2s; tab-driven |
| `sources/web-trackers/tracking-events/page-views` | 222 | How-to + reference | 8 tabs, 18 code fences |
| `pipeline/collector` | 155 | Reference + how-to + explanation | Mixes Console viewing, the API, Self-Hosted config, and an HTTP header reference |
| `pipeline/enrichments/.../ip-lookup-enrichment` | 173 | How-to + reference | Good shape: select, host, configure, examples, output |
| `destinations/forwarding-events` | 63 | Explanation + how-to | Has a "Getting started" H2 |
| `destinations/warehouses-lakes/querying-data` | 452 | How-to + reference | 15 tabs, 48 fences; overlaps `get-started/querying` and `event-studio/query-sql` (13 lines) |
| `event-studio/tracking-plans` | 46 | Explanation | Duplicates Fundamentals |
| `event-studio/implement-tracking/snowtype` | 104 | How-to + reference | Typo "Prerequsites"; `# Same as` comments inside code fences read as headings to naive parsers |
| `signals/concepts` | 262 | Explanation | Clean, 5 H2s |
| `signals/get-started` | 95 | Explanation + tutorial pointer | Mostly architecture and workflow; no hands-on step in the page |
| `signals/attributes` | 191 | How-to (define + retrieve) | Mixes Console and SDK; code-heavy |
| `signals/connection` | 238 | How-to + reference | Covers Console, Sandbox, credentials, Python SDK, and Node SDK; the publish/unpublish/delete lifecycle is buried here |
| `identities/index` | 45 | Explanation | Clean |
| `identities/configuration` | 70 | How-to (UI) | Clean |
| `testing/snowplow-micro` | 32 | Landing | No H2s |
| `monitoring/recovering-failed-events` | 15 | Landing | Thin |
| `api-reference/stream-collector` | 46 | Explanation | Sits under "reference" but is an architecture overview |
| `modeling/.../dbt-unified-data-model` | 162 | Explanation | Title Case headings ("Engaged vs. Absolute Time"), against the style rules |
| `get-started/tracking` | — | Tutorial + how-to | Mixes a live test widget with JavaScript tracker setup |

**Pattern:**
- Explanation pages (Fundamentals, Signals concepts) are well separated.
- How-to and reference are routinely fused, especially in Sources, Pipeline, and Signals SDK pages.
- Tutorials are cleanly separated into `/tutorials`.
- "Reference" (`api-reference/`, labeled "Components") actually holds component docs of every type: setup, configuration, architecture, and previous versions. It is not a pure reference layer.
- No `content_type` or Diátaxis frontmatter exists on any page.

---

## 5. Sidebar depth and crowding

Folder depth below `docs/` (index pages):

| Depth | Pages |
|---|---|
| 1 | 18 |
| 2 | 109 |
| 3 | 274 |
| 4 | 262 |
| 5 | 215 |
| 6 | 106 |
| 7 | 20 |
| 8 | 2 |
| 9 | 1 |

**Deepest:** `docs/sources/web-trackers/previous-versions/web-trackers-v3/tracker-setup/google-tag-manager-custom-template/v3-tags/ecommerce-tag-template/ecommerce-tag-configuration/index.md` (depth 9). All depth ≥7 pages are web tracker v3 previous versions.

**Most crowded areas:**
- `sources/web-trackers` (182 files)
- `api-reference/loaders-storage-targets` (126; several `previous-versions` subtrees, including RDB Loader with two)
- `modeling-your-data/modeling-your-data-with-dbt` (96)
- `sources/mobile-trackers` (85)
- `api-reference/snowbridge` (48, including 30+ standalone non-index `.md` files under `configuration/transformations/builtin` and `targets`)
- `events/ootb-data` (19 flat siblings)
- `monitoring/recovering-failed-events/manual` (15 pages for a legacy path)
- The "Data Infrastructure" section has 13 top-level siblings, above the 5–7 people can scan easily.

Signals is shallow (max depth 4, `signals/attributes/using-python-sdk/attribute-groups/*`). Its Python SDK pages use `sidebar_position: 200`, so they sink to the bottom.

---

## 6. Duplication, orphan, or misplaced content

**Duplicates or near-duplicates:**
- `docs/signals/index.md` and `docs/signals/get-started/index.md` contain the same prose (hidden "SEO" copy).
- `docs/events/identifiers/index.md` and `docs/events/ootb-data/user-and-session-identification/index.md` have the **identical title** "User and session identifiers", 108 and 112 lines.
- Cross-domain tracking is covered three times:
  - `docs/events/cross-navigation/`
  - `docs/events/ootb-data/links-and-referrers/` ("Referrers, links, and cross-navigation events")
  - `docs/identities/concepts/cross-domain-tracking/`
- Tracking plans: `fundamentals/tracking-plans` and `event-studio/tracking-plans` both have an "Elements of a Tracking Plan" section.
- Schema versioning: `fundamentals/schemas/versioning` and `event-studio/data-structures/versioning`.
- Querying: `get-started/querying`, `destinations/warehouses-lakes/querying-data`, and `event-studio/query-sql` (a 13-line stub).
- Destinations: `fundamentals/destinations` (25 lines) and `destinations/index.md`.
- Failed events are split across four places:
  - `fundamentals/failed-events`
  - `get-started/failed-events`
  - `monitoring/`
  - `api-reference/failed-events` (the types reference)
- Events intro: `docs/events/index.md` (16-line link page) and `fundamentals/events`.
- MCP: `llms-support/mcp-server` and the `tutorials/snowplow-cli-mcp` tutorial.

**Orphans and hidden pages:**
- The hidden `docs/signals/index.md` is still linked from 2 pages.
- `docs/sources/first-party-tracking/index.md` is the only page marked hidden or unlisted.
- Policy pages live in `src/pages/` outside the docs sidebar, with **0 inbound links from `docs/`**: `shared-responsibility-model`, `deprecation-policy`, `restrictive-access-models`.
- `docs/reusable/` partials are fine.

**Misplaced:**
- CDI Cloud setup lives under `get-started/private-managed-cloud/`.
- `api-reference/` is labeled "Components" and holds non-reference content.
- `docs/events/` (a how-to and OOTB catalog) sits as a peer of Fundamentals and Sources rather than inside Sources.
- `testing/snowplow-inspector/signals-integration` is Signals content inside CDI Testing.
- The Identities dbt package lives in `identities/data-models` instead of with the other models.
- "Working with AI" (`llms-support`, position 2.5) sits between Fundamentals and Event Studio in the CDI section, though it covers both products.

**Frontmatter compliance (1,007 index pages):**

| Field | Pages with it |
|---|---|
| `description` | 1,007/1,007 |
| `keywords` | 1,007/1,007 |
| `sidebar_label` | 889 |
| `date` | 566 (about 56%) |

---

## 7. LLM-readiness

**Strong:**
- A custom plugin at `plugins/docusaurus-plugin-llms-txt/` runs after the build. It converts rendered HTML to Markdown and produces:
  - `/llms.txt`, grouped by sidebar section labels (`generate-index.js`)
  - `/llms-full.txt`, which leaves out previous-version sections and marks them `[previous version]` in the index
  - a `.md` twin for every page, so `/docs/x/` is also available as `/docs/x.md`
- `enrich-dbt-schemas.js` injects the dbt variable tables into the Markdown output.
- `excludeRoutes` is an exact match, so only `/docs/signals/` (the hidden duplicate) and landing pages are excluded. That is correct.
- Every page has **Download** and **Copy Markdown** buttons (`src/theme/DocItem/Layout/index.tsx`, `MarkdownActions`).
- `docs/llms-support/index.md` documents all of this for users.
- `src/pages/style-guide/llm/index.md` is a condensed, rule-only style guide built for LLM consumption, and `CLAUDE.md` mirrors it for authoring agents.

**Gaps:**
- MCP docs cover only the Snowplow CLI MCP server (`llms-support/mcp-server/index.md`, 137 lines: install, tools, usage). Nothing covers a hosted or Console MCP, agent skills, or plugins.
- No "use these docs from your IDE or agent" quick setup, such as adding `llms.txt` to Cursor or Claude, or a docs MCP server.
- No per-section `llms.txt` (for example a Signals-only file). With Sources and Components at 66% of the corpus, `llms-full.txt` is dominated by tracker docs.
- `llms.txt` ordering follows the sidebar, so the Signals hoisting quirk carries through.
- `llms-full.txt` is acknowledged as "very large".
- No `robots`-level or `ai.txt` guidance beyond `static/robots.txt`.

---

## 8. Strengths to keep

1. **A real style system.**
   - `src/pages/style-guide/index.md` (640 lines) covers grammar, terminology, deprecated terms, components, accessibility, and Markdown.
   - It has an LLM-compressed twin (`style-guide/llm/index.md`) and an "Using this guide with an AI tool" section.
   - `CLAUDE.md` adds IA rules: the feature-page template (description → when/why → basic example → configuration), 3–5 H2s per page, required frontmatter, and key concept links.
   - This is ahead of most vendor docs.
2. **Concept-linking discipline.** "Never re-explain, link to `/docs/fundamentals/`" gives a single-source explanation layer. Fundamentals is small (11 pages) and focused.
3. **Strict build guards.** `onBrokenLinks`, `onBrokenAnchors`, and `onBrokenMarkdownLinks` are all `throw`, and all internal links use the `/index.md` convention.
4. **Uniform metadata.** 100% of pages have `description` and `keywords`. `showLastUpdateTime` and `editUrl` are on.
5. **Tutorials as a separate Diátaxis quadrant.** They have structured `meta.json` (`useCase`, `technologies`, `snowplowTech`) and a requirements kit in `tutorial-requirements/`.
6. **Platform tabs with `groupId` and `queryString`**, so a reader's platform choice persists across pages. Availability badges (`AvailabilityBadges`, used on 23 pages) show which offering includes each feature.
7. **A modern landing-page component kit**: `CardGrid`, `CallToActionCard`, `FeaturedSection`, `LinkCard`, plus custom theme overrides. The site also has Mermaid with an enlarge feature, KaTeX, custom Prism themes, a hideable sidebar, and `autoCollapseCategories`.
8. **Signals IA is clean on a small scale**: concepts → connection → attributes → interventions, with UI and SDK variants side by side.
9. **Leading LLM-readiness**: `llms.txt`, `llms-full.txt`, per-page `.md` files, copy and download buttons, and version-aware exclusion.
10. **Version isolation**: legacy content lives in `previous-versions/` folders, and `llms-full.txt` respects that.

---

### Highest-impact fixes

1. **Fix the getting-started flow.** Add next-step CTAs to the end of `get-started/index.md`. Reorder Get started as Console → Track → Query → Model. Split CDI Cloud out of `private-managed-cloud/`. Surface Micro or a Sandbox as a "try" path.
2. **Remove `docs/signals/index.md` as a content copy.** Make `/docs/signals/` the real Signals landing page or redirect it, and repoint its 2 inbound links. Keep Signals Get started inside the docs sidebar, or embed the quick start in it, so readers don't cross into `/tutorials`.
3. **Merge the duplicates** listed in §6, starting with the two pages titled "User and session identifiers", cross-domain tracking ×3, and querying ×3.
4. **Shrink the "Data Infrastructure" section.** Group the 13 items into about 5 (Get started, Concepts, Design & track, Pipeline & destinations, Operate). Move `events/` into Sources. Move "Working with AI" to a cross-product Resources slot.
5. **Address the volume of old versions.** Collapse or segregate the 277 previous-version pages, for example with Docusaurus versioning or a single "Legacy" category, to cut depth 7–9.
6. **Add `content_type` frontmatter (Diátaxis) to pages.** Use it to split fused how-to and reference pages (`pipeline/collector`, `signals/connection`) and to let `llms.txt` emit per-product and per-type indexes.
7. **Expand the AI docs** beyond the CLI MCP: hosted MCP, agent skills, and an IDE setup guide.