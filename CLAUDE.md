# Documentation guidelines for Claude

## Quick reference (30 seconds)
* US spelling, active voice, technical tone (no marketing language)
* File names: kebab-case, always create `index.md` in new directories
* Internal links end with `/index.md`, use absolute paths from docs root
* Headings: sentence case, H2/H3 only, 3-5 H2 sections max per page
* Snowplow terminology: "entity" not "context"
* Every section starts with prose before lists or technical details

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
* **CRITICAL**: bold labels followed by colons should have lowercase first word after colon: `**Schema validation**: test your schemas` NOT `**Schema validation**: Test your schemas`

### File structure ⚠️ CRITICAL
* File names: kebab-case (`google-tag-manager-server-side.md`)
* **Main topics: always `index.md`** - when creating a new page, ALWAYS create a new directory with the page name and put `index.md` inside it
* Example: create `/segment-audience-hub/index.md`, NOT `segment-audience-hub.md`
* **ALL internal links end with `/index.md`** for validation
* Absolute paths from docs root: `/docs/sources/trackers/.../index.md`
* Split long pages into multiple files
* **VERIFY LINKS EXIST**: always check that internal links point to actual files before publishing. Search the docs directory to confirm paths are correct.

### Headings and organization
* Sentence case: "Configuring how events are sent"
* Only H2 (##), H3 (###), rarely H4 (####)
* Paragraph after frontmatter, not heading
* Not too many headings per page - aim for 3-5 H2 sections maximum
* Each heading should have substantial content (multiple paragraphs) underneath it where possible
* Avoid fragmenting information across many small sections - consolidate related concepts
* Every section should start with explanatory prose before lists or technical details
* Mix prose and lists appropriately: use prose to explain concepts, lists for configuration options or step-by-step items

### Snowplow terminology
* **Capitalized**: Data Product Studio, Snowtype, Snowplow CDI, Signals
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
* Lists: introduce with colon, lowercase first word after colon (treat like continuation of sentence), no ending punctuation unless multiple sentences
* Example: `* **API Key**: your authentication key` NOT `* **API Key**: Your authentication key`
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
General information, context, or clarifications
:::

:::tip
Best practices, recommendations, or encouraging specific actions
:::

:::warning
Important cautions about data loss, security, or breaking changes
:::
```

**When to use each type:**
* **Note**: background info, alternative approaches, version differences
* **Tip**: performance improvements, recommended workflows, pro tips
* **Warning**: data loss risks, security considerations

### Images
* Formats: `.webp` (preferred), `.png`, `.jpg`
* Descriptive filenames and alt text
* Max size: 2000px × 500px
* Place in `images/` subdirectory

### Quality checklist
**Content:**
- [ ] US spelling throughout
- [ ] No marketing language, technical tone maintained
- [ ] Concepts linked to fundamentals, not re-explained
- [ ] Every section starts with prose explanation before lists
- [ ] Information consolidated, not fragmented across small sections

**Structure:**
- [ ] Proper frontmatter with title, sidebar_position, description
- [ ] 3-5 H2 sections maximum, each with substantial content
- [ ] Sentence case headings, H2/H3 only
- [ ] Platform tabs where needed

**Technical:**
- [ ] Links end with `/index.md`, absolute paths used
- [ ] Terminology consistent (entity not context, JavaScript tracker)
- [ ] Code/UI formatting correct (`backticks`, **bold UI**)

### Common pitfalls to avoid
* Don't explain fundamental concepts (link to Fundamentals instead)
* Don't use marketing language
* Don't use passive voice unnecessarily
* Don't use more than 3 heading levels
* Don't end list items with periods (unless multiple sentences)
* Don't use "&" instead of "and"
