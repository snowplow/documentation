# Contributing

This guide covers how to write and edit documentation in this repo. For how the site is built, see [`ARCHITECTURE.md`](ARCHITECTURE.md). For CI and deploys, see [`WORKFLOWS.md`](WORKFLOWS.md).

- [Style and tone](#style-and-tone)
- [Where content lives: `/docs` vs `/tutorials`](#where-content-lives-docs-vs-tutorials)
- [Common tasks](#common-tasks)
  - [Edit an existing page](#edit-an-existing-page)
  - [Add a new page](#add-a-new-page)
  - [Add a link to another page](#add-a-link-to-another-page)
  - [Add a new section (folder of pages)](#add-a-new-section-folder-of-pages)
  - [Move a page](#move-a-page)
  - [Delete or retire a page](#delete-or-retire-a-page)
  - [Add an image or diagram](#add-an-image-or-diagram)
  - [Use admonitions, tabs, and code blocks](#use-admonitions-tabs-and-code-blocks)
  - [Reuse content across pages](#reuse-content-across-pages)
  - [Mark a page as outdated, hidden, or noindex](#mark-a-page-as-outdated-hidden-or-noindex)
  - [Make a sidebar entry link to an external URL](#make-a-sidebar-entry-link-to-an-external-url)
  - [Reorder the sidebar](#reorder-the-sidebar)
  - [Document a new version of a versioned module](#document-a-new-version-of-a-versioned-module)
  - [Write a new tutorial](#write-a-new-tutorial)
- [Reference](#reference)
  - [Frontmatter fields](#frontmatter-fields)
  - [Key concept link targets](#key-concept-link-targets)
  - [Sidebar mechanics](#sidebar-mechanics)
- [Tooling](#tooling)
  - [Vale (spelling and grammar)](#vale-spelling-and-grammar)
  - [Prettier (formatting)](#prettier-formatting)
  - [Repo scripts](#repo-scripts)
- [Before opening a PR](#before-opening-a-pr)

## Standard docs vs tutorials

The repo has two separate content trees, rendered as two sections of the site:

- **`/docs/`**: reference and conceptual documentation, served at `docs.snowplow.io/docs/*`. The sidebar is generated from the folder structure. Most of this guide is about `/docs`.
- **`/tutorials/`**: step-by-step tutorials and solution accelerators, served at `docs.snowplow.io/tutorials/*`. Tutorials use a different content model (each one has a `meta.json` file), a custom navigation, and slightly different link conventions. See [Write a new tutorial](#write-a-new-tutorial) below.

Tasks below apply to `/docs` unless stated otherwise.

## Style and tone

Follow the Snowplow style guide, found at [`src/pages/style-guide/index.md`](src/pages/style-guide/index.md).

An LLM-targeted variant lives at [`src/pages/style-guide/llm/index.md`](src/pages/style-guide/llm/index.md). Repo-specific rules that apply on top of the style guide, including required frontmatter, heading rules, terminology, and file structure, are in [`CLAUDE.md`](CLAUDE.md).

## Common tasks

These instructions assume you're working in `/docs/`, unless otherwise specified. For `/tutorials/`, see [Write a new tutorial](#write-a-new-tutorial) below.

### Edit an existing page

Docs site URLs map to folder paths in the repo. Find the page's source file and edit the Markdown. For most of the repo, each page is built from an `index.md` inside its own folder. Save, then run `yarn start` to preview.

For example, the page at `https://docs.snowplow.io/docs/destinations/` is built from `docs/destinations/index.md`.

### Add a new page or section

Create a new folder under `/docs/`, then add an `index.md` inside it. Standalone `.md` files are not used (except for legacy pages) — every page should have its own `<folder>/index.md`. File and folder names are kebab-case.

Add the required frontmatter at the top — see [Frontmatter fields](#frontmatter-fields) for the full list. The minimum:

```yaml
---
title: "Configure how events are sent"
sidebar_position: 10
sidebar_label: "Send events"
description: "One to two sentences for SEO."
keywords: ["keyword1", "keyword2", "keyword3"]
date: "2026-05-12"
---
```

`sidebar_position` controls where the page appears in the sidebar; lower numbers come first. `sidebar_label` is the short text shown in the sidebar.

To add a child page, create a subfolder with its own `index.md`.

### Add a link to another page

Inside `/docs/`, end every internal link with `/index.md`. This lets `yarn build` validate the target:

```markdown
[Send events](/docs/sources/trackers/setup/index.md)
[Send events](/docs/sources/trackers/setup/index.md#section-anchor)
```

Use absolute paths from the docs root. Relative paths (`../setup/index.md`) are reserved for [versioned modules](#document-a-new-version-of-a-versioned-module).

Inside `/tutorials/`, do **not** append `/index.md`. See [`tutorials/_README.md`](tutorials/_README.md) for the full tutorial link rules.

### Move a page

Use the `./move.sh` script. It runs `git mv`, updates internal links across `/docs`, and appends a 301 redirect rule to `worker/redirects.js`:

```bash
./move.sh docs/old/page/location docs/new/page/location
```

Rules for using this script:
- Run from the repo root
- Use relative paths starting with `docs/`
- End paths on a directory (not on `index.md`)
- No trailing slashes
- Needs `sponge` from `moreutils` (`brew install moreutils`)

### Delete a page

If you're removing a page entirely, delete its folder and add a 301 redirect rule to `worker/redirects.js` pointing the old URL to the closest replacement page.

If you want to keep the content reachable but hide it from the sidebar and search engines, set `sidebar_custom_props.hidden: true` in its `index.md` — see [Mark a page as outdated, hidden, or noindex](#mark-a-page-as-outdated-hidden-or-noindex).

### Add an image or diagram

Place images in an `images/` folder next to the Markdown file that uses them, and reference them with a relative path:

```markdown
![Full description of the image](./images/architecture.png)
```

To reference an image from a different folder without needing a long relative path, use the `@site` alias:

```markdown
![Full description of the image](@site/docs/fundamentals/images/architecture.png)
```

For diagrams, Mermaid is preferred: they're legible to LLMs, easy to update, and adapt automatically to light and dark themes. Use a fenced ` ```mermaid ` block, or a `<Mermaid>` component if you need to pass in props for dynamic rendering.

### Add Iglu schema details

Use the `SchemaProperties` component to display schema properties, including a table of their properties, an example, the generated warehouse column name, and the raw JSON schema.

Import the component at the top of the MDX file:

```mdx
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Then place it in the page body, passing the full Iglu JSON schema as the `schema` prop:

```mdx
<SchemaProperties
  overview={{ entity: true }}
  example={{ id: "abc123", name: "Example" }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.example", "name": "my_schema", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema description.", "type": "object", "properties": { "id": { "type": "string", "description": "The identifier." } }, "required": ["id"], "additionalProperties": false }} />
```

The `schema` prop is required and must include the full `self` block. The remaining props are optional:

- `overview` — pass `{{ event: true }}`, `{{ entity: true }}`, or `{{ enrichment: true }}` to set the type badge and enable type-specific sections. Events add a warehouse query section. Enrichments expand the example by default and extract the schema's `parameters` property into a separate table.
- `example` — a JSON object shown as a collapsible example payload.
- `info` — overrides the description taken from `schema.description`.

### Use admonitions, tabs, and code blocks

The site uses Docusaurus's [Markdown features](https://docusaurus.io/docs/markdown-features). See [`CLAUDE.md`](CLAUDE.md) for implementation advice. The most useful are:

- **Admonitions** for notes, tips, or warnings:
  ```markdown
  :::note[Optional title]
  Body text.
  :::
  ```
- **Tabs** for platform-specific content (iOS vs Android, etc.). Put only the differing content inside; keep shared content or headers outside.
- **Code blocks** with a language tag for syntax highlighting:
  ````markdown
  ```typescript
  const x = 1
  ```
  ````
- **Collapsible blocks** ([`<details>`](https://docusaurus.io/docs/markdown-features#details)) for content most readers will skip.

### Reuse content across pages

Markdown files can import and embed other markdown files as reusable fragments. See [this example](https://github.com/snowplow/documentation/blob/303165da0698b15d7ad13a50e40eeacadcaea098/docs/storing-querying/storage-options/index.md) for usage.

### Mark a page as outdated, hidden, or noindex

These flags live in `sidebar_custom_props` on the folder's `index.md` and apply to all descendant pages:

| Flag | Effect |
|---|---|
| `outdated: true` | Shows an "you are reading an outdated version" admonition with a link back to the latest. Applies `noindex`. |
| `legacy: true` | Applies `noindex` without the admonition. Use for retired content kept for inbound links. |
| `hidden: true` | Hides the entry from the sidebar (`display: none`). Applies `noindex`. |
| `noindex: true` | Adds `<meta name="robots" content="noindex, follow">` without other side effects. Can be set on a single page or a folder. |

Example:

```yaml
sidebar_custom_props:
  outdated: true
```

### Make a sidebar entry link to an external URL

Set `type: link` plus `href` in the page's frontmatter. The page still exists at its docs URL, but its body renders as a stub linking to `href`, and its sidebar entry takes the user to `href` directly:

```yaml
---
title: "External resource"
sidebar_label: "External resource"
sidebar_position: 5
type: link
href: https://github.com/snowplow/example/blob/main/README.md
---
```

`noindex` is applied automatically.

### Reorder the sidebar

Adjust `sidebar_position` on the relevant folder or page `index.md` files. Positions are integers; only the relative order matters, so leave gaps (10, 20, 30…) to make later insertions easy.

To rename a sidebar entry without changing the page title, set `sidebar_label`.

To add visual breathing room above an entry, set `sidebar_custom_props.space_above: true`.

### Document a new version of a versioned module

Versioned modules (trackers, loaders, dbt packages) follow specific rules:

- **Inside a versioned module's pages, use relative links** (`../setup/index.md`) for same-version references. This keeps cross-references intact if the directory is moved.
- **Don't put the version number in the latest version's URL.** For example, the Scala tracker docs live at `scala-tracker/`, not `scala-tracker-2-0/`. This avoids redirects and link updates on every release.
- **Put older versions in a `previous-versions/` folder.** In that folder's `index.md`, add `sidebar_custom_props.outdated: true` to trigger the outdated-version admonition. See [the Scala tracker docs](https://github.com/snowplow/documentation/tree/main/docs/collecting-data/collecting-from-own-applications/scala-tracker) for the layout.
- When releasing a new version, either edit the latest pages in place (small changes) or move them into `previous-versions/` and replace with the new content (large changes). Edit in place when you can, to avoid accumulating old version folders.
- **Track the latest bugfix version in [`src/componentVersions.js`](src/componentVersions.js).** Pages reference this file to render the current version inline, so updating it propagates everywhere. See [the Scala tracker setup page](https://raw.githubusercontent.com/snowplow/documentation/main/docs/collecting-data/collecting-from-own-applications/scala-tracker/setup/index.md) for inline usage, and [the dbt package docs](https://raw.githubusercontent.com/snowplow/documentation/main/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) for the in-table render pattern.

### Write a new tutorial

Tutorials live in `/tutorials/`, not `/docs/`. Before starting, read [`tutorial-requirements/README.md`](tutorial-requirements/README.md) — it covers the tutorial vs. solution accelerator distinction, the required `meta.json` schema, and conventions for demo apps and notebooks.

Copy one of the working examples as a starting point:

- [`tutorial-requirements/example-tutorial/`](tutorial-requirements/example-tutorial) — a complete tutorial structure.
- [`tutorial-requirements/example-accelerator/`](tutorial-requirements/example-accelerator) — a complete accelerator structure.

Key differences from `/docs`:

- The tutorials sidebar is rendered by custom React components in `src/components/tutorials/` (see [`ARCHITECTURE.md`](ARCHITECTURE.md#tutorials)). Ordering and grouping come from `meta.json`, not `sidebar_position`.
- Internal links within `/tutorials/` do **not** end in `/index.md`. See [`tutorials/_README.md`](tutorials/_README.md) for the full rules.
- The `sidebar_custom_props` flags (`header`, `outdated`, `hidden`, etc.) do not apply.
- Downloadable Jupyter notebooks accompanying tutorials live as static assets in `static/notebooks/`, not as rendered pages.

### Open a PR

Before opening a PR, run `yarn build` locally. This runs the full production build, and catches any errors or broken internal links or anchors before they get to CI.

Also consider running:
- `yarn format` — applies Prettier
- Vale, via the VS Code extension or the CLI

CI runs frontmatter validation and a Claude-based style review on every PR. See [`WORKFLOWS.md`](WORKFLOWS.md).

## Reference

### Frontmatter fields

Required on every `/docs/` page:

```yaml
---
title: "Full page title"                       # Sentence case
sidebar_position: 10                           # Integer; controls ordering
sidebar_label: "Short title"                   # Sidebar text (optional, falls back to title)
description: "One to two sentences for SEO."   # Used for SEO and on category cards
keywords: ["keyword1", "keyword2"]             # SEO keywords
date: "2025-09-09"                             # Creation date (YYYY-MM-DD)
---
```

Optional page-level fields:

| Field | Effect |
|---|---|
| `type: link` + `href: <url>` | Renders the page as a stub linking to `href`; replaces the sidebar entry with an external link. Auto-applies `noindex`. |
| `sidebar_custom_props.noindex: true` | Adds `<meta name="robots" content="noindex, follow">` for this page only. |

Sidebar custom props set on a folder's `index.md` (apply to all descendants):

| Field | Effect |
|---|---|
| `header: "Name"` | Starts a new top-level collapsible sidebar section called "Name". See [Sidebar mechanics](#sidebar-mechanics). |
| `outdated: true` | Adds the outdated-version admonition. Applies `noindex`. |
| `legacy: true` | Applies `noindex` without the admonition. |
| `hidden: true` | Hides the entry from the sidebar (`display: none`). Applies `noindex`. |
| `space_above: true` | Adds extra top margin to the sidebar entry. |

### Key concept link targets

Several Snowplow concepts appear across the docs and must be referred to consistently. Use the canonical term and link, rather than re-explaining:

- _Self-describing event_, not _unstructured event_
- _Entity_, not _context_ (a set of entities can be casually called "context")
- _Failed events_, not _bad rows_ (use _bad rows_ only when referring to the legacy JSON format)
- Pick _schema_ or _data structure_ for a given page and stick with it

Canonical link targets:

- Events: `/docs/fundamentals/events/index.md`
- Self-describing events: `/docs/fundamentals/events/index.md#self-describing-events`
- Structured events: `/docs/fundamentals/events/index.md#structured-events`
- Entities: `/docs/fundamentals/entities/index.md`
- Custom entities: `/docs/fundamentals/entities/index.md#custom-entities`
- Schemas: `/docs/fundamentals/schemas/index.md`
- Iglu: `/docs/fundamentals/schemas/index.md#iglu`
- Failed events: `/docs/fundamentals/failed-events/index.md`

### Sidebar mechanics

The `/docs/` sidebar is generated from the folder structure of `/docs`, then transformed by `sidebars.js` to add section headers, hoist a couple of sections, swap in external link items, and apply visibility flags.

The two flags most contributors will use day-to-day (`hidden` and `space_above`, plus `header` for new top-level sections) are documented under [Frontmatter fields](#frontmatter-fields). For the full mechanism — how `header` sections work, which sections hoist their children, how external links are wired up — see [`ARCHITECTURE.md`](ARCHITECTURE.md#sidebar).

## Tooling

### Vale (spelling and grammar)

This repo uses [Vale](https://vale.sh) for prose linting. Vale has three alert levels (error, warning, suggestion); it flags issues but does not auto-correct. Code blocks, inline code, and link paths are excluded.

**VS Code extension.** Install [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) from the Extensions Marketplace. The extension checks files on open and save, underlining flagged sections by severity. Hover for the alert message, or check the **Problems** tab.

**Command line.** Install with `brew install vale`, then:

```bash
vale docs/account-management
vale docs/sources/trackers/mobile-trackers/client-side-properties/index.md
```

Use `--minAlertLevel=warning` to filter out suggestions. See the [Vale CLI options](https://vale.sh/docs/cli).

### Prettier (formatting)

Run `yarn format` to apply Prettier across the repo. CI enforces formatting. Set your editor to format on save; here's [a VSCode guide](https://blog.yogeshchavan.dev/automatically-format-code-on-file-save-in-visual-studio-code-using-prettier).

### Repo scripts

| Script | Purpose |
|---|---|
| `./move.sh <old> <new>` | Move a docs folder, rewrite internal links, append a 301 to `worker/redirects.js`. See [Move a page](#move-a-page). |
| `./make-links-validatable.sh` | Append `/index.md` to internal `/docs/` links that omit it. Needs `sponge` TODO delete. |

Both scripts need `sponge` from `moreutils` — install with `brew install moreutils`.
