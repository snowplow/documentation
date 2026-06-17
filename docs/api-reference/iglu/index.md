---
title: "Introduction to the Iglu schema registry"
sidebar_label: "Iglu schema registry"
sidebar_position: 90
date: "2026-05-14"
description: "Iglu is the schema registry that powers schema validation in Snowplow pipelines, with public schemas in Iglu Central and private schemas in Iglu Server."
keywords: ["iglu", "schema registry", "json schema", "schema validation"]
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'selfHosted']}
  helpContent="All Snowplow platforms include Iglu. It's managed under-the-hood for CDI customers."
/>
```

```mdx-code-block
import CdiCallout from "/docs/reusable/iglu-self-hosted-only/_callout.md"

<CdiCallout/>
```

Iglu is the schema registry that powers schema validation in your Snowplow pipeline. It stores all the [schemas](/docs/fundamentals/schemas/index.md) associated with your events and entities, and serves them to pipeline components for validation.

## How Iglu fits together

- [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) is a private schema registry you run yourself. It exposes a RESTful API for publishing, validating, and serving your custom schemas.
- [Iglu Central](/docs/api-reference/iglu/iglu-repositories/index.md#iglu-central) is a public registry hosted by Snowplow at [iglucentral.com](https://iglucentral.com/). It contains the schemas for Snowplow's out-of-the-box events and entities.
- [Static repositories](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md) are an alternative to Iglu Server for read-only schema hosting from a static website (for example, on S3).
- The [Iglu Resolver](/docs/api-reference/iglu/iglu-resolver/index.md) is embedded into Snowplow pipeline components (enrichers, loaders) and fetches schemas from one or more configured registries.
- [Igluctl](/docs/api-reference/iglu/igluctl/index.md) is a command-line tool for validating, publishing, and managing schemas.
