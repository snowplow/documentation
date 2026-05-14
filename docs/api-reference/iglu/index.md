---
title: "Introduction to the Iglu schema registry"
sidebar_label: "Iglu schema registry"
sidebar_position: 90
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

**Iglu** is the schema registry that powers schema validation in your Snowplow pipeline. It stores all the [schemas](/docs/fundamentals/schemas/index.md) associated with your events and entities, and serves them to pipeline components for validation.

:::info[CDI customers]

If you're a Snowplow CDI customer, you don't need to manage Iglu yourself. A private Iglu registry is included in your pipeline. You can manage your schemas through [Event Studio](/docs/event-studio/data-structures/index.md) or [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md).

The pages in this section are most relevant to Self-Hosted customers running their own Iglu Server.

:::

## How Iglu fits together

- **[Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)** is a private schema registry you run yourself. It exposes a RESTful API for publishing, validating, and serving your custom schemas.
- **[Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md)** is a public registry hosted by Snowplow at [iglucentral.com](https://iglucentral.com/). It contains the schemas for Snowplow's out-of-the-box events and entities.
- **[Static repositories](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md)** are an alternative to Iglu Server for read-only schema hosting from a static website (for example, on S3).
- The **[Iglu Resolver](/docs/api-reference/iglu/iglu-resolver/index.md)** is embedded into Snowplow pipeline components (enrichers, loaders) and fetches schemas from one or more configured registries.
- **[`igluctl`](/docs/api-reference/iglu/igluctl/index.md)** is the command-line tool for validating, publishing, and managing schemas.
