# Documentation guidelines for Claude

## ALWAYS FOLLOW THESE RULES

### Writing style
* US English spelling: "organize" not "organise", "modeled" not "modelled"
* Professional, technical tone - NO marketing language
* Active voice: "the Collector receives events"
* Use "you" for readers, "the user" for the reader's users
* Cross-reference concepts, don't explain them - link to `/docs/fundamentals/`

### Grammar and formatting
* Double quotes (") not smart quotes
* Oxford comma: "events, entities, and schemas"
* "Set up" (verb), "setup" (noun/adj); "log in" (verb), "login" (noun/adj)
* Use `backticks` for code, file names, table/field names
* **Bold** for UI elements only
* Use "and" not "&"
* Prefer "*" for unordered lists
* For list items, treat the punctuation like a sentence, not like a heading (`Like: this` not `Like: This`)

### File structure
* File names: kebab-case (`google-tag-manager-server-side.md`)
* Main topics: always `index.md`
* ALL internal links end with `/index.md` for validation
* Absolute paths from docs root: `/docs/sources/trackers/.../index.md`

### Headings and organization
* Sentence case: "Configuring how events are sent"
* Only H2 (##), H3 (###), rarely H4 (####)
* Paragraph after frontmatter, not heading
* Not too many headings per page

### Snowplow terminology
* **Capitalized**: Data Product Studio, Snowtype, Snowplow BDP, Signals
* **Context-capitalized**: Collector, Enrich, specific Loaders
* **Not capitalized**: entities, events, schemas, data structures
* Use "entity" not "context", "self-describing event" not "unstructured event"
* "JavaScript tracker", "native mobile trackers"

### Required frontmatter
```yaml
---
title: "Page title"               # Sentence case
sidebar_position: 10              # Controls ordering
sidebar_label: "Short title"      # If different from title
description: "Brief description"  # For SEO purposes
---
```

---

## REFERENCE SECTIONS

### Quick patterns
* Information architecture: conceptual docs in `/docs/fundamentals/`, implementation in feature directories
* Feature structure: description → when/why → basic example → configuration → advanced
* Lists: introduce with colon, capitalize first word, no ending punctuation unless multiple sentences
* Tables: capital letters, consistent punctuation, `code` stays as code

### Key concept links (always use these)
* Events: `/docs/fundamentals/events/index.md`
* Self-describing events: `/docs/fundamentals/events/index.md#self-describing-events`
* Entities: `/docs/fundamentals/entities/index.md`
* Schemas: `/docs/fundamentals/schemas/index.md`
* Failed events: `/docs/fundamentals/failed-events/index.md`

### Platform-specific content
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

### Admonitions
```mdx
:::note
General information
:::

:::tip
Encourage specific actions
:::

:::warning
Important cautions about data loss or security
:::
```

### BDP vs self-hosted
* Mark BDP-only features in frontmatter: `sidebar_custom_props: offerings: - bdp`
* Note when BDP provides built-in functionality, mention self-hosted alternatives

### Images
* Formats: `.webp` (preferred), `.png`, `.jpg`
* Descriptive filenames and alt text
* Max size: 2000px × 500px
* Place in `images/` subdirectory

### Quality checklist
- [ ] US spelling throughout
- [ ] Links end with `/index.md`
- [ ] Concepts linked, not explained
- [ ] No marketing language
- [ ] Terminology consistent (entity not context)
- [ ] Sentence case headings
- [ ] Platform tabs where needed
- [ ] Proper frontmatter

### Common pitfalls to avoid
* Don't explain fundamental concepts (link to Fundamentals instead)
* Don't use marketing language
* Don't use passive voice unnecessarily
* Don't use more than 3 heading levels
* Don't end list items with periods (unless multiple sentences)
* Don't use "&" instead of "and"
