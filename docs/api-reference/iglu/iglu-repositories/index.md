---
title: "Introduction to Iglu repositories for schema storage"
sidebar_label: "Repositories"
date: "2026-05-14"
sidebar_position: 10
description: "Remote Iglu repositories for storing and serving JSON schemas via HTTP."
keywords: ["iglu repositories", "schema storage", "iglu server", "static repo", "self-hosted"]
---

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

An Iglu repository acts as a store of JSON schemas. Hosting JSON schemas in an Iglu repository allows you to use those schemas in Snowplow.

There are two Iglu repository technologies available for deploying your own Iglu repository:

| **Repository**                                                                       | **Description**                                          |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)       | An Iglu repository server structured as a RESTful API    |
| [Static repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md) | An Iglu repository server structured as a static website |

## Iglu Central

[Iglu Central](https://iglucentral.com/) is a public, machine-readable repository of JSON schemas hosted by Snowplow. It contains the schemas for Snowplow's out-of-the-box events and entities.

Under the hood, Iglu Central is a [static Iglu repository](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md) — a schema registry served as a static website over HTTP. The root index page at [iglucentral.com](https://iglucentral.com/) links to all the schemas it hosts.
