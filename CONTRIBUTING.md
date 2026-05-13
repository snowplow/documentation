# Contributing

This guide covers how to write and edit documentation in this repo. For how the site is built, see [`ARCHITECTURE.md`](ARCHITECTURE.md). For CI and deploys, see [`WORKFLOWS.md`](WORKFLOWS.md).

- [Docs and tutorials](#docs-and-tutorials)
- [Style and tone](#style-and-tone)
- [Manage pages](#manage-pages)
  - [Edit an existing page](#edit-an-existing-page)
  - [Add a new page or section](#add-a-new-page-or-section)
  - [Move a page](#move-a-page)
  - [Delete a page](#delete-a-page)
  - [Document a new version of a versioned component](#document-a-new-version-of-a-versioned-component)
- [Write content](#write-content)
  - [Add a link to another page](#add-a-link-to-another-page)
  - [Add an image or diagram](#add-an-image-or-diagram)
  - [Add Iglu schema details](#add-iglu-schema-details)
  - [Use admonitions for callouts](#use-admonitions-for-callouts)
  - [Use codeblocks](#use-codeblocks)
  - [Use tabs for platform-specific content](#use-tabs-for-platform-specific-content)
  - [Reuse content across pages](#reuse-content-across-pages)
- [Sidebar and visibility](#sidebar-and-visibility)
  - [Reorder the sidebar](#reorder-the-sidebar)
  - [Mark a page as outdated, hidden, or noindex](#mark-a-page-as-outdated-hidden-or-noindex)
  - [Make a sidebar entry link to an external URL](#make-a-sidebar-entry-link-to-an-external-url)
- [Write a new tutorial](#write-a-new-tutorial)
- [Submit changes](#submit-changes)
- [Tooling](#tooling)
  - [Check spelling and grammar with Vale](#check-spelling-and-grammar-with-vale)
    - [VS Code extension](#vs-code-extension)
    - [Command line](#command-line)
  - [Format with Prettier](#format-with-prettier)

## Docs and tutorials

The repo has two separate content trees, rendered as two sections of the site:

- **`/docs`**: reference and conceptual documentation, served at `docs.snowplow.io/docs/*`. The sidebar is generated from the folder structure. Most of this guide is about `/docs`.
- **`/tutorials`**: step-by-step tutorials and solution accelerators, served at `docs.snowplow.io/tutorials/*`. Tutorials use custom metadata, a custom navigation, and slightly different link conventions. See [Write a new tutorial](#write-a-new-tutorial) below.

Instructions below apply to `/docs` unless stated otherwise.

## Style and tone

Follow the Snowplow style guide, found at [`src/pages/style-guide/index.md`](src/pages/style-guide/index.md).

An LLM-targeted variant lives at [`src/pages/style-guide/llm/index.md`](src/pages/style-guide/llm/index.md). Repo-specific rules that apply on top of the style guide, including required frontmatter, heading rules, terminology, and file structure, are in [`CLAUDE.md`](CLAUDE.md).

All Docusaurus pages use MDX format under the hood, but mostly have `.md` extensions for legacy reasons.

## Manage pages

### Edit an existing page

Docs site URLs map to folder paths in the repo. Find the page's source file and edit the Markdown. For most of the repo, each page is built from an `index.md` inside its own folder. Save, then run `yarn start` to preview.

For example, the page at `https://docs.snowplow.io/docs/destinations/` is built from `docs/destinations/index.md`.

### Add a new page or section

Create a new folder under `/docs`, then add an `index.md` inside it. Standalone `.md` files are not used (except for legacy pages) — every page should have its own `<folder>/index.md`. File and folder names are kebab-case.

Add the required frontmatter at the top — see [`CLAUDE.md`](CLAUDE.md) for the full required-fields list. The minimum:

```yaml
---
title: "Full page title"                       # Sentence case, ideally unique across the site
sidebar_position: 10                           # Controls ordering
sidebar_label: "Short title"                   # Sidebar text (optional, falls back to title)
description: "One to two sentences for SEO."   # Used for SEO
keywords: ["keyword1", "keyword2"]             # SEO keywords
date: "2025-09-09"                             # Creation date (YYYY-MM-DD)
---
```

`sidebar_position` controls where the page appears in the sidebar; lower numbers come first.

To add a child page, create a subfolder with its own `index.md`.

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

### Document a new version of a versioned component

When updating documentation for a new version of a versioned component such as a tracker, loader, or dbt package, update the [`src/componentVersions.js`](src/componentVersions.js) file. This is the source of truth for the latest version of all Snowplow components, and is widely referenced across the docs.

When a new major or minor version is released, add a migration guide in that component's docs section.

For significant changes, move the old content into a `previous-versions/` subfolder, add `sidebar_custom_props.outdated: true` to trigger the outdated-version admonition, and add the new content in its place.

## Write content

### Add a link to another page

Inside `/docs`, end every internal link with `/index.md`. This lets `yarn build` validate the target:

```markdown
[Send events](/docs/sources/trackers/setup/index.md)
[Send events](/docs/sources/trackers/setup/index.md#section-anchor)
```

Use absolute paths from the docs root. Relative paths (`../setup/index.md`) are reserved for [versioned modules](#document-a-new-version-of-a-versioned-component) or images.

Inside `/tutorials`, do **not** append `/index.md`. See [`tutorials/_README.md`](tutorials/_README.md) for the full tutorial link rules.

### Add an image or diagram

Place images in an `images/` folder next to the Markdown file that uses them, and reference them with a relative path:

```markdown
![Full description of the image](./images/architecture.png)
```

To reference an image from a different folder without needing a long relative path, use the `@site` alias:

```markdown
![Full description of the image](@site/docs/fundamentals/images/architecture.png)
```

For diagrams, prefer Mermaid: it's legible to LLMs, easy to update, and adapts automatically to light and dark themes. Use a fenced ````mermaid ` block, or a `<Mermaid>` component if you need to pass in props for dynamic rendering.

### Add Iglu schema details

Use the `SchemaProperties` component to display schema properties, including the URI, a table of their properties, the generated warehouse column name, and the raw JSON schema.

Import the component at the top of the MDX file:

```mdx
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Then place it in the page body, passing in the full Iglu JSON schema:

```mdx
<SchemaProperties
  overview={{ event: false }}
  example={{ id: "abc123", name: "Example" }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.example", "name": "my_schema", "format": "jsonschema", "version": "1-0-0" }, "description": "Schema description.", "type": "object", "properties": { "id": { "type": "string", "description": "The identifier." } }, "required": ["id"], "additionalProperties": false }} />
```

| Property   | Description                                                                                             | Required? |
| ---------- | ------------------------------------------------------------------------------------------------------- | --------- |
| `schema`   | The full Iglu JSON schema object.                                                                       | ✅         |
| `overview` | Specifies the type of schema. Pass `{{ event: true }}` for events or `{{ event: false }}` for entities. | ❌         |
| `example`  | A JSON object showing an example payload.                                                               | ❌         |
| `info`     | Overrides the description taken from `schema.description`.                                              | ❌         |

Schemas marked as `event: true` get an "Event" badge, and an additional warehouse query section. Schemas marked as `event: false` get an "Entity" badge. If you don't pass an `overview` prop, the component will show a generic "Schema" badge.

### Use admonitions for callouts

Use Docusaurus admonitions for notes, tips, warnings, or any content you want to visually set apart. They come in different types, each with different colors, icons, and use cases. You can also add an optional title.

```mdx
:::note[Title]
General information, context, or clarifications
:::

:::tip[Title]
Best practices, recommendations, or encouraging specific actions
:::

:::warning[Title]
Important cautions about data loss or security risks
:::

:::danger[Title]
Critical warnings about severe consequences such as pipeline outages
:::
```

### Use codeblocks

Use fenced code blocks with a language tag for standard code snippets:

````markdown
```typescript
const x = 1
```
````

Use the ["magic comments"](https://docusaurus.io/docs/markdown-features/code-blocks#line-highlighting) `// highlight-start`, `// highlight-end`, or `// highlight-next-line` to highlight specific lines.

In some cases, you might want to include dynamic content, such as interpolating version variables. For that, use the `CodeBlock` component. For example:

```mdx
import CodeBlock from '@theme/CodeBlock';
import {versions} from '@site/src/componentVersions';

<CodeBlock language="scala">{
`// Dependency
val igluClient = "com.snowplowanalytics" %% "iglu-scala-client"  % "${versions.igluScalaClient}"`
}</CodeBlock>
```

### Use tabs for platform-specific content

Use tabs to group platform-specific or version-specific content. For example, if a section has different instructions for AWS, GCP, and Azure, you can put each in its own tab.

Put only the differing content inside, and keep shared content or section headers outside the tabs to avoid duplication.

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>
    iOS content
  </TabItem>
  <TabItem value="android" label="Android">
    Android content
  </TabItem>
</Tabs>
```

### Reuse content across pages

Markdown files can import and embed other markdown files as reusable fragments or partials. To mark a file as reusable, give it a filename starting with an underscore `_`. Most of the repo's reusable fragments are found in the [`docs/reusable`](/docs/reusable/) folder.

To use a partial, import it into your file. For example:

```mdx
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Sidebar and visibility

### Reorder the sidebar

The `/docs` navigation sidebar is generated from the folder structure of `/docs`, then transformed by [`sidebars.js`](sidebars.js) to add section headers, hoist a couple of sections, swap in external link items, and apply visibility flags.

Adjust `sidebar_position` on the relevant `index.md` files to change the ordering within the sidebar. Positions within `/docs` can be any number. The `/tutorials` renderer expects sequential integers, starting from 1 for the introduction page.

To rename a sidebar entry without changing the page title, set `sidebar_label`.

To add visual breathing room above an entry, set `sidebar_custom_props.space_above: true`. To add a header above a group of entries, set `sidebar_custom_props.header: "Header Name"` on the first entry of the group.

### Mark a page as outdated, hidden, or noindex

These flags live in `sidebar_custom_props` in the `index.md` frontmatter, and apply to all descendant pages:

| Flag             | Effect                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `outdated: true` | Shows a "you are reading an outdated version" admonition with a link back to the latest. Applies `noindex`.                |
| `legacy: true`   | Applies `noindex` without the admonition. Use for retired content kept for inbound links.                                  |
| `hidden: true`   | Hides the entry from the sidebar (`display: none`). Applies `noindex`.                                                     |
| `noindex: true`  | Adds `<meta name="robots" content="noindex, follow">` without other side effects. Can be set on a single page or a folder. |

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
href: https://snowplow.github.io/snowplow-java-tracker
---
```

`noindex` will be applied automatically.


## Write a new tutorial

Tutorials live in `/tutorials`, not `/docs`. Before starting, read [`tutorial-requirements/README.md`](tutorial-requirements/README.md): it covers the tutorial vs. solution accelerator distinction, the required `meta.json` schema, and conventions for demo apps and notebooks.

The examples serve as templates for structure and formatting. Copy one of the working examples as a starting point:

- [`tutorial-requirements/example-tutorial/`](tutorial-requirements/example-tutorial) — a complete tutorial structure.
- [`tutorial-requirements/example-accelerator/`](tutorial-requirements/example-accelerator) — a complete accelerator structure.

Key differences from `/docs` pages:

- The tutorials sidebar is rendered by custom React components in `src/components/tutorials` — see [`ARCHITECTURE.md`](ARCHITECTURE.md#tutorials) for details.
- Internal links within `/tutorials` do **not** end in `/index.md`. See [`tutorials/_README.md`](tutorials/_README.md) for the full rules.
- The `sidebar_custom_props` frontmatter flags don't apply.
- Downloadable Jupyter notebooks accompanying tutorials live as static assets in `static/notebooks/`, not as rendered pages.

## Submit changes

Before opening a PR, run `yarn build` locally. This runs the full production build, and catches errors, broken internal links, and broken anchors before they get to CI.

Also consider running:
- `yarn format` for Prettier
- Vale, via the VS Code extension or the CLI

CI runs frontmatter validation and a Claude-based style review on every PR. See [`WORKFLOWS.md`](WORKFLOWS.md).

## Tooling

### Check spelling and grammar with Vale

This repo uses [Vale](https://vale.sh) for prose linting. Vale has three alert levels (error, warning, and suggestion); it flags issues but does not auto-correct. Code blocks, inline code, and link paths are excluded.

#### VS Code extension

Install [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) from the Extensions Marketplace. The extension checks files on open and save, underlining flagged sections by severity. Hover for the alert message, or check the **Problems** tab.

#### Command line

Install with `brew install vale`, then:

```bash
vale docs/account-management
vale docs/sources/trackers/mobile-trackers/client-side-properties/index.md
```

Use `--minAlertLevel=warning` to filter out suggestions. See the [Vale CLI options](https://vale.sh/docs/cli).

### Format with Prettier

Run `yarn format` to apply Prettier across the repo. Set your editor to format on save; here's [a VSCode guide](https://blog.yogeshchavan.dev/automatically-format-code-on-file-save-in-visual-studio-code-using-prettier).
