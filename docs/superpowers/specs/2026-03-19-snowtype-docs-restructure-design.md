# Snowtype documentation restructure

## Problem

The current Snowtype docs (5 pages under `docs/event-studio/implement-tracking/snowtype/`) read like an API reference rather than a fully-featured documentation section. Key issues:

- **No "why" or "when"** — pages jump straight into setup and configuration without explaining the problems Snowtype solves or when to use it.
- **Poor page separation** — "Using the CLI" is a 451-line monolith covering auth, init, generation, 9 tracker examples, tracking plans, event specs, data structures, updates, and dev schema safety. "Commands" is a thin 77-line page that largely duplicates content from "Using the CLI."
- **Missing content** — `purge` command undocumented, lock file behavior barely explained, no CI/CD guidance, Console integration paths not shown.
- **Audience gap** — serves existing CLI users reasonably well, but fails developers new to Snowtype and is inaccessible to non-technical users encountering Snowtype in the Console UI.

## Goals

1. Serve three audiences: non-technical users who see Snowtype in the Console, developers getting started, and developers already using Snowtype.
2. Restructure into task-oriented pages that answer "why" and "when" alongside "how."
3. Show Console and CLI as parallel paths throughout, not just in the overview.
4. Document missing features (purge, lock file, CI/CD, scoped updates).
5. Keep pages within the current location (`docs/event-studio/implement-tracking/snowtype/`) but enable better cross-referencing from other Event Studio docs.

## Non-goals

- Relocating Snowtype docs within the broader Event Studio hierarchy (that's a separate initiative).
- Rewriting tracker-specific SDK documentation.
- Documenting Snowtype's internal architecture or contributing to the tool.

## Design

### Page structure

8 pages, organized by task:

| # | Page | Directory | sidebar_position | sidebar_label |
|---|------|-----------|-----------------|---------------|
| 1 | Overview | `snowtype/index.md` | 6 (unchanged) | Snowtype |
| 2 | Get started | `snowtype/get-started/index.md` | 1 | Get started |
| 3 | Generate tracking code | `snowtype/generate-tracking-code/index.md` | 2 | Generate tracking code |
| 4 | Keep code up to date | `snowtype/keep-code-up-to-date/index.md` | 3 | Keep code up to date |
| 5 | Client-side validation | `snowtype/client-side-validation/index.md` | 4 | Client-side validation |
| 6 | Use with Google Tag Manager | `snowtype/working-with-gtm/index.md` | 5 | Use with GTM |
| 7 | Configuration reference | `snowtype/configuration-reference/index.md` | 10 | Configuration reference |
| 8 | Commands reference | `snowtype/commands-reference/index.md` | 11 | Commands reference |

### Page 1: Overview (index.md)

The entry point for all audiences. No setup instructions — just understanding.

**Sections:**

- **What Snowtype does** — Generates type-safe tracking code from event specifications and data structures. One paragraph, plain language.
- **Why use Snowtype** — Framed around problems it solves: manual tracking code is error-prone, drifts from schema definitions, requires manual updates when schemas change. Short narrative, not a feature bullet list.
- **How it works** — The flow: define events in Event Studio, Snowtype generates tracking functions, use them in your app. Mentions both paths: CLI tool and Console's Implementation tab.
- **Supported trackers** — The existing 9-tracker table (imported from `_supported-trackers.md`).
- **What's in this section** — Short descriptions linking to each subpage.

**Moves out:** Installation (to Get started), CLI examples (to Generate tracking code).

### Page 2: Get started (get-started/index.md)

Zero-to-first-generated-code. A developer who's never used Snowtype follows this end-to-end.

**Sections:**

- **Prerequisites** — Node.js 18+. Include warning that Snowtype does not install Snowplow tracking libraries — you must install the tracker SDK separately.
- **Install Snowtype** — npm/yarn/pnpm tabs (relocated from current index.md). Include executing commands section (npx/yarn dlx/pnpm dlx usage patterns).
- **Authenticate** — API key setup covering `.env` file, environment variables, and CLI flag. Notes API key ID requirement for versions >0.9.0.
- **Initialize your project** — `snowtype init` walkthrough. What each prompt means and how to choose tracker/language/output path.
- **Generate your first code** — Run `snowtype generate`, brief explanation of what you now have.
- **Console path** — Callout showing the "Implement tracking" modal from Data Products (install → generate → share). Screenshot of the modal.

### Page 3: Generate tracking code (generate-tracking-code/index.md)

The core workflow. What Snowtype generates and how to use the output.

**Sections:**

- **What Snowtype generates** — Types, tracking functions, inline documentation. Explanation of the output file structure. Sourced from the "Contents" subsection of the current "Using the CLI" page (types, interfaces, classes, self-describing JSON methods, event specification methods).
- **Use generated code** — Per-language examples via tabs (Browser/Node TypeScript, JavaScript, Kotlin, Swift, Go, Dart, Java). Each tab shows a realistic usage example, not just the function signature. Consolidates the 8 tracker example tabs currently in "Using the CLI." Note: the `@snowplow/javascript-tracker` does not have its own code example in the current docs — check with engineering whether one should be added or if browser tracker examples cover it.
- **Input sources** — Subsections for each way to feed schemas into Snowtype:
  - **Event specifications** — With Console parallel: the Implementation tab toggle showing Snowtype-generated code vs manual code. Screenshot of the toggle.
  - **Data products / tracking plans** — Using `dataProductIds` to pull all event specs from a data product.
  - **Data structures** — Using `dataStructures` for entity types.
  - **Iglu Central schemas** — Using community schemas.
  - **Local repositories** — Using local schema repos for development.
- **Generate usage instructions** — The `--instructions` flag that produces markdown documentation for each event.
- **Dev schema safety** — How `--disallowDevSchemas` works and when to use it.

### Page 4: Keep code up to date (keep-code-up-to-date/index.md)

Everything about maintaining generated code over time. Currently scattered across "Using the CLI."

**Sections:**

- **Why updates matter** — Schemas evolve. If tracking code falls behind, you lose type safety and may send events that fail validation.
- **How version tracking works** — The `.snowtype-lock.json` file: what it is, when it's created (first `generate` run), what it pins, that `generate` reads from the lock file for reproducible builds.
- **Check for updates** — `snowtype update` workflow. What the diff output shows, how to review and accept. Scoped updates with `--eventSpecs` and `--dataProducts`. The `--latestDraft` option.
- **Control update notifications** — `--maximumBump` for filtering by patch/minor/major.
- **Add new schemas** — `snowtype patch` for adding new items to config without regenerating.
- **Clean up stale entries** — `snowtype purge` (currently undocumented). Removes lock file entries no longer in config.
- **Automate with CI/CD** — Patterns for running Snowtype in pipelines. When to use `--yes` for non-interactive update + regenerate.
- **Console parallel** — Callout noting how Console surfaces schema version changes.

### Page 5: Client-side validation (client-side-validation/index.md)

Existing content reframed with a "why" section. Images stay in existing `images/` subdirectory.

**Sections:**

- **Why validate at runtime** — Pipeline validates server-side, but client-side validation catches errors earlier: during development, in the browser console, before events leave the device. Faster feedback loop.
- **Setup** — Dependencies (ajv, ajv-formats, ajv-draft-04), the `--validations` flag, initialization code. Similar to current.
- **Schema validation** — Basic validation with example and error output.
- **Cardinality rules** — Entity min/max validation with examples.
- **Property rules** — Event specification property constraints with examples.
- **Custom violation handlers** — Configure what happens when validation fails.
- **Caveats** — Bundle size impact, differences between client-side and pipeline validation (especially regex patterns).

### Page 6: Use with Google Tag Manager (working-with-gtm/index.md)

Existing content tightened with framing added. Images stay in existing `images/` subdirectory.

**Sections:**

- **When to use this** — If implementing tracking via GTM rather than directly in application code, Snowtype generates code formatted for GTM's Custom JavaScript variables.
- **Setup** — Two paths: existing Snowtype project (config update) vs standalone project. Kept from current page.
- **Use generated code in GTM** — Copying to Custom JavaScript variables, `window.__snowtype` namespace, file size and minification considerations.

### Page 7: Configuration reference (configuration-reference/index.md)

Pure reference. All config options in one place, separated from workflow content.

**Sections:**

- **Config file formats** — JSON, JavaScript, TypeScript with complete examples of each.
- **Configuration attributes** — Every attribute documented with type, default, and description:
  - `organizationId`, `tracker`, `language`, `outpath`
  - `eventSpecificationIds`, `dataProductIds`, `dataStructures`
  - `igluCentralSchemas`, `repositories`
  - `namespace` (Swift-specific)
  - `options.commands.generate` (instructions, validations, disallowDevSchemas, deprecateOnlyOnProdAvailableUpdates)
  - `options.commands.update` (maximumBump, showOnlyProdUpdates, regenerateOnUpdate)
  - `options.commands.patch` (regenerateOnPatch)

### Page 8: Commands reference (commands-reference/index.md)

Pure reference. Every CLI command with full options.

Document every command with full flag notation (short and long forms). The current docs are missing several flags — this is a correction, not just a migration.

**Commands:**

- `snowtype init` — Options: `-i, --organizationId`, `-t, --tracker`, `-l, --language`, `-o, --outpath`
- `snowtype generate` — Options: `-c, --config`, `--instructions / --no-instructions`, `--validations / --no-validations`, `--disallowDevSchemas`, `--deprecateOnlyOnProdAvailableUpdates`
- `snowtype update` — Options: `-c, --config`, `-y, --yes`, `-m, --maximumBump`, `-d, --latestDraft`, `-e, --eventSpecs <ids...>`, `-p, --dataProducts <ids...>`
- `snowtype patch` — Options: `-c, --config`, `-p, --dataProductIds <ids...>`, `-e, --eventSpecificationIds <ids...>`, `-d, --dataStructures <uris...>`, `-i, --igluCentralSchemas <uris...>`, `-r, --repositories <paths...>`
- `snowtype purge` — Options: `-c, --config`
- `snowtype help`
- **Global options** — `-h, --help`, `-V, --version`, `-k, --apiKey`, `-s, --apiKeyId`, `-v, --verbose`

**Corrections from current docs:** The existing commands page is missing `-s, --apiKeyId` from global options and does not document `--latestDraft`, `--eventSpecs`, or `--dataProducts` on the `update` command. The `purge` command is entirely absent.

### Console integration touchpoints

Console context woven into task pages rather than isolated in a separate page:

| Console feature | Docs page | How it's referenced |
|----------------|-----------|-------------------|
| "Implement tracking" modal (Data Products) | Get started | Shown as parallel path to CLI init + generate |
| Implementation tab toggle (Event Specifications) | Generate tracking code | Screenshot showing Snowtype vs manual code output |
| Data model wizard (Snowtype vs non-Snowtype filtering) | Overview or Generate tracking code | Callout explaining the event_specification entity |
| Schema version indicators | Keep code up to date | Callout connecting Console version display to CLI update |

### Cross-referencing from other Event Studio docs

Pages outside the Snowtype section that should link into it:

- **Event Specifications docs** — Link to "Generate tracking code" from any section about implementing events.
- **Data Products docs** — Link to "Get started" from sections about the "Implement tracking" workflow.
- **Data Structures docs** — Link to "Generate tracking code > Data structures" for using structures in tracking code.
- **Code snippets page** (if it exists alongside Snowtype) — Clarify relationship: code snippets are manual, Snowtype is automated.

### Content migration map

| Current page | Content | Destination |
|-------------|---------|-------------|
| `index.md` | Overview text | Page 1: Overview |
| `index.md` | Supported trackers table | Page 1: Overview |
| `index.md` | Installation | Page 2: Get started |
| `index.md` | Executing commands (npx/yarn/pnpm usage) | Page 2: Get started |
| `using-the-cli/index.md` | Authentication | Page 2: Get started |
| `using-the-cli/index.md` | Init walkthrough | Page 2: Get started |
| `using-the-cli/index.md` | Generate command basics | Page 2: Get started (first run) + Page 3: Generate (full workflow) |
| `using-the-cli/index.md` | Per-tracker examples | Page 3: Generate tracking code |
| `using-the-cli/index.md` | Input sources (event specs, data structures, tracking plans, Iglu, local repos) | Page 3: Generate tracking code |
| `using-the-cli/index.md` | Event spec instructions | Page 3: Generate tracking code |
| `using-the-cli/index.md` | Update workflow | Page 4: Keep code up to date |
| `using-the-cli/index.md` | Update notification levels | Page 4: Keep code up to date |
| `using-the-cli/index.md` | Dev schema safety | Page 3: Generate tracking code |
| `snowtype-config/index.md` | All config options | Page 7: Configuration reference |
| `commands/index.md` | All commands | Page 8: Commands reference |
| `client-side-validation/index.md` | All content | Page 5: Client-side validation (reframed) |
| `working-with-gtm/index.md` | All content | Page 6: Use with GTM (tightened) |

### New content to write

| Content | Page | Source |
|---------|------|--------|
| "Why use Snowtype" narrative | Overview | New (based on existing feature bullets) |
| "How it works" flow description | Overview | New |
| Console "Implement tracking" modal walkthrough | Get started | Audit screenshots + Console UI |
| Console Implementation tab toggle description | Generate tracking code | Audit screenshots + Console UI |
| Lock file explanation | Keep code up to date | Source code + PR #1666 |
| `purge` command documentation | Keep code up to date + Commands reference | Source code |
| CI/CD integration patterns | Keep code up to date | New |
| "Why validate at runtime" framing | Client-side validation | New |
| Scoped update flags (`--eventSpecs`, `--dataProducts`, `--latestDraft`) | Keep code up to date + Commands reference | Source code + PR #1666 |

### Dependencies

- **PR #1666** (Gleb's lock file + update docs) — should be merged first or its content incorporated. The lock file explanation and scoped update flags align with Page 4.
- **Console screenshots** — needed for Get started (Implement tracking modal) and Generate tracking code (Implementation tab toggle). These need to be captured from the Console UI.

### Images

- Existing images in `using-the-cli/images/` and `client-side-validation/images/` should be relocated to the appropriate new page directories.
- New screenshots needed:
  - Console "Implement tracking" modal → `get-started/images/`
  - Console Implementation tab (Snowtype toggle) → `generate-tracking-code/images/`

### File structure after restructure

```
snowtype/
├── index.md                          (Overview)
├── _supported-trackers.md            (shared partial, unchanged)
├── get-started/
│   ├── index.md
│   └── images/
│       ├── dp-id.png                 (moved from using-the-cli)
│       ├── dp-track.png              (moved from using-the-cli)
│       └── implement-tracking-modal.png  (new)
├── generate-tracking-code/
│   ├── index.md
│   └── images/
│       ├── ds-url.png                (moved from using-the-cli)
│       ├── es-id.png                 (moved from using-the-cli)
│       ├── iglu-url.png              (moved from using-the-cli)
│       └── implementation-tab.png    (new)
├── keep-code-up-to-date/
│   ├── index.md
│   └── images/
│       └── patch-diff.png            (moved from using-the-cli)
├── client-side-validation/
│   ├── index.md                      (rewritten)
│   └── images/                       (unchanged)
│       ├── cardinality-browser.png
│       ├── cardinality-empty.png
│       ├── cardinality-validation.png
│       ├── property-rules-browser.png
│       ├── property-rules-enum-error.png
│       └── validation.png
├── working-with-gtm/
│   ├── index.md                      (tightened)
│   └── images/                       (unchanged)
│       └── gtm-var.gif
├── configuration-reference/
│   └── index.md
└── commands-reference/
    └── index.md
```

### Pages removed

- `using-the-cli/` — content distributed across Get started, Generate tracking code, and Keep code up to date.
- `snowtype-config/` — replaced by Configuration reference.
- `commands/` — replaced by Commands reference.

### Redirects

Use the repo's `move.sh` script to handle redirects when removing/renaming pages. Do this per-file as each old page is replaced, not all at the end.

| Old path | Redirect to |
|---------|------------|
| `snowtype/using-the-cli/` | `snowtype/get-started/` |
| `snowtype/snowtype-config/` | `snowtype/configuration-reference/` |
| `snowtype/commands/` | `snowtype/commands-reference/` |

### Implementation approach

Work on one file at a time. Write each new page, allow for editing and tweaking, then commit before moving on to the next. This keeps commits clean and reviewable.

### Internal link updates

All internal links within the Snowtype section must be updated during implementation. Additionally, review and update links from pages outside the section that currently point into Snowtype:

- `docs/event-studio/implement-tracking/index.md` → links to `snowtype/index.md` (unchanged, no action needed)
- `docs/event-studio/tracking-plans/create-and-manage/index.md` → links to `snowtype/index.md` (unchanged)
- `docs/event-studio/tracking-plans/event-specification-inference/index.md` → links to `snowtype/index.md` (unchanged)
- Any links pointing to `snowtype/using-the-cli/` or `snowtype/commands/` from outside the section need updating to their new destinations.

### Shared components

The `TrackingPlansNomenclature` partial (imported from `@site/docs/reusable/tracking-plans-nomenclature/_index.md`) is currently used in `using-the-cli/index.md` and `commands/index.md`. Carry this forward into:
- Page 3: Generate tracking code (where tracking plans / data products are discussed as input sources)
- Page 7: Configuration reference (where `dataProductIds` is documented)
