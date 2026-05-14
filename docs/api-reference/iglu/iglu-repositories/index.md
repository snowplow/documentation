---
title: "Introduction to Iglu repositories for schema storage"
sidebar_label: "Repositories"
date: "2026-05-14"
sidebar_position: 20
description: "Remote Iglu repositories for storing and serving JSON schemas via HTTP."
keywords: ["iglu repositories", "schema storage", "iglu server", "static repo", "self-hosted"]
---

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

An Iglu repository acts as a store of data schemas (currently JSON Schemas only). Hosting JSON Schemas in an Iglu repository allows you to use those schemas in Iglu-capable systems such as Snowplow.

## Available Iglu repositories

There are two Iglu repository technologies available for deploying your own Iglu repository. Follow the links to find out more:

| **Repository** | **Description**                                          |
| -------------- | -------------------------------------------------------- |
| Iglu Server    | An Iglu repository server structured as a RESTful API    |
| Static repo    | An Iglu repository server structured as a static website |

## Iglu Central

[Iglu Central](https://iglucentral.com/) is a public repository of JSON Schemas hosted by Snowplow. For more information, see [Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md).
