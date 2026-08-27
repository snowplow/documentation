# Release notes

Product news and component release notes, published at
[/release-notes/](https://docs.snowplow.io/release-notes/). These were migrated from the Pylon
knowledge base; this directory is now the source of truth.

## When to add a note

Anything that changes what a user can do needs a note. If a docs PR documents a feature that
didn't exist before, a change in behavior, or support for a new platform or warehouse, it
needs an accompanying release note. Write it in the same PR where that's practical, or in a
follow-up PR that links back to the docs change.

Docs work that doesn't change the product doesn't need a note:

- typo, grammar, and link fixes
- restructures and rewrites of pages about functionality that already shipped
- new examples, clarifications, or expanded reference tables for existing behavior
- internal repo changes, such as tooling and CI

The awkward cases are usually docs that catch up on something that shipped quietly weeks ago,
and reference pages that gain a row for an option nobody announced. Both are worth a note. If
you can't tell whether a change is user-facing enough to announce, ask the product manager for
that area rather than guessing.

## Add a note

Create `release-notes/<slug>/index.md`. The slug becomes the URL, so keep it short and
descriptive, and do not change it once published.

```yaml
---
title: "Introducing event compression for infrastructure cost savings"
description: "One or two sentences. Shown on the listing page and used for SEO."
date: "2025-10-30"
category:
  - "Release notes"
components:
  - "Destinations"
  - "Pipeline components"
platforms:
  - "AWS"
---
```

`title`, `date`, and `category` are required — the build fails without them. `platforms`
is optional; leave it out unless the note is specific to one cloud or warehouse.

### category

Pick from these two. An announcement that doubles as a release note can carry both.

| Value          | Use for                                                       |
| -------------- | ------------------------------------------------------------- |
| `Product news` | launches, round-ups, and anything aimed at a general audience  |
| `Release notes`| a specific version of a specific component                     |

Maintenance notifications stay in the Pylon knowledge base — they are operational comms for
Private Managed Cloud customers rather than product announcements.

### components

What changed. Use the values below and add new ones sparingly — every distinct value becomes
a checkbox in the component filter, so new values fragment it.

| Value                 | Covers                                                      |
| --------------------- | ----------------------------------------------------------- |
| `Trackers`            | any tracker or tracker plugin, including GTM                 |
| `Pipeline components` | Collector, Enrich, Iglu                                      |
| `Destinations`        | loaders, warehouses, lakes, Event Forwarding, Snowbridge     |
| `Data models`         | dbt packages and modeling in Console                         |
| `Event Studio`        | tracking plans, event specifications, data structures        |
| `Console`             | Console UI, navigation, workspaces                           |
| `Signals`             | Signals                                                      |
| `Identities`          | Snowplow Identities                                          |
| `Monitoring`          | failed events, alerts, the Data Quality Dashboard            |
| `Testing`             | Snowplow Micro, Snowplow Mini                                |
| `Developer tools`     | Snowtype, Snowplow CLI                                       |
| `AI tools`            | MCP Server, Snowplow Assistant, ML tooling                   |
| `Security`            | CVEs, TLS, authentication changes                            |

### platforms

Which deployment the note is scoped to, so a reader can narrow to the cloud and warehouse
they run: `AWS`, `GCP`, `BigQuery`, `Snowflake`, `Databricks`. A BigQuery loader change
carries both `Destinations` and `BigQuery`.

## Writing

Follow the [top-level style guide](../CLAUDE.md): sentence case headings, H2 and H3 only, no
H1 (the `title` becomes the page heading). Link to the docs with absolute paths such as
`/docs/signals/` — the build fails on a broken link or anchor, which is how a moved docs page
gets caught.

Put images in `release-notes/<slug>/images/` and give every one descriptive alt text.
