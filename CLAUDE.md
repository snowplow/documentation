# Documentation rules for Claude

## Writing style
* All documentation is written in Markdown (MDX).
* Use US English spelling.
* Use professional, technical tone. Never use marketing language.
* Use active voice: "the Collector receives events".
* Address readers as "you". Refer to the reader's users as "the user".
* Link to concepts in `/docs/fundamentals/`. Never re-explain them inline.
* Structure feature pages as: description → when/why → basic example → configuration.
* For style reviews, read the extended style guide at `src/pages/style-guide/llm/index.md`.

## Headings and organization
* Use sentence case: "Configure how events are sent".
* Use imperative voice: "Configure the tracker" not "Tracker configuration".
* Use only H2 (##) and H3 (###). Use H4 (####) rarely. Never use H1, H5, or H6.
* Precede every heading with at least one paragraph of explanatory text.
* Limit pages to 3-5 H2 sections. Create a new page if content exceeds this.

## Grammar and formatting
* Use the Oxford comma: "events, entities, and schemas".
* Use `backticks` for code, file names, and table/field names.
* Use **bold** only for UI elements (buttons, page titles).
* **CRITICAL**: Use lowercase after colons in list items: `Like: this` not `Like: This`.

## Snowplow terminology
* **Always capitalized**: Data Product Studio, Snowtype, Snowplow CDI, Signals
* **Never capitalized**: entities, events, schemas, data structures, data products
* Use "entity", never "context". Use "self-describing event", never "unstructured event".

## File structure ⚠️ CRITICAL
* Use kebab-case for file names: `google-tag-manager-server-side.md`
* **Always create a directory with `index.md` inside.** Never create standalone `.md` files for main topics.
* Example: Create `/segment-audience-hub/index.md`, not `segment-audience-hub.md`.
* **End all internal links with `/index.md`** for validation.
* Use absolute paths from docs root: `/docs/sources/trackers/.../index.md`
* **Verify every link exists.** Search the docs directory to confirm paths before publishing.

## Required frontmatter
```yaml
---
title: "Full page title"                        # Descriptive title in sentence case
sidebar_position: 10                            # Controls ordering
sidebar_label: "Short title"                    # To display in navigation sidebar
description: "One to two sentences for SEO."    # Grammatically correct
keywords: ["keyword1", "keyword2", "keyword3"]  # Marketing/SEO keywords
date: "2025-09-09"                              # Creation date (YYYY-MM-DD)
---
```

## Key concept links
Always link to these paths:
* Events: `/docs/fundamentals/events/index.md`
* Self-describing events: `/docs/fundamentals/events/index.md#self-describing-events`
* Entities: `/docs/fundamentals/entities/index.md`
* Schemas: `/docs/fundamentals/schemas/index.md`
* Failed events: `/docs/fundamentals/failed-events/index.md`

## Platform-specific content
Use tabs for cross-platform docs:

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

## Admonitions
```mdx
:::note
General information, context, or clarifications
:::

:::tip
Best practices, recommendations, or encouraging specific actions
:::

:::warning
Important cautions about data loss or security risks
:::
```

## Images
* Use descriptive filenames and alt text.
* Place images in an `images/` subdirectory.

## Tutorials
See `/tutorials/_README.md` for tutorial-specific guidelines.

## Development workflow
* Use `yarn`, not `npm`.
* Start dev server: `yarn start` or `yarn dev`
* Build: `yarn build`
* Install dependencies: `yarn install` or `yarn add <package>`
