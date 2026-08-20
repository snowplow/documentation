# Changelog

Product news, release notes, and maintenance notifications, published at
[/changelog/](https://docs.snowplow.io/changelog/). These were migrated from the Pylon
knowledge base; this directory is now the source of truth.

## Add an entry

Create `changelog/<slug>/index.md`. The slug becomes the URL, so keep it short and
descriptive, and do not change it once published.

```yaml
---
title: "Introducing event compression for infrastructure cost savings"
description: "One or two sentences. Shown on the listing page and used for SEO."
date: "2025-10-30"
update_type:
  - "Release notes"
components:
  - "Loaders"
  - "Collector"
---
```

`title`, `date`, and `update_type` are required — the build fails without them.

### update_type

Pick from these three. An announcement that doubles as a release note can carry more than one.

| Value                      | Use for                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `Product news`             | launches, round-ups, and anything aimed at a general audience         |
| `Release notes`            | a specific version of a specific component                            |
| `Maintenance notification` | planned maintenance and actions customers need to take                |

### components

Free-form, but reuse an existing value wherever one fits — every distinct value becomes a
checkbox in the component filter, so new values fragment it. Run
`grep -h -A20 '^components:' changelog/*/index.md | grep '^  - '` to see what is in use.

## Writing

Follow the [top-level style guide](../CLAUDE.md): sentence case headings, H2 and H3 only, no
H1 (the `title` becomes the page heading). Link to the docs with absolute paths such as
`/docs/signals/` — the build fails on a broken link or anchor, which is how a moved docs page
gets caught.

Put images in `changelog/<slug>/images/` and give every one descriptive alt text.
