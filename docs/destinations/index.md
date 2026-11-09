---
title: "Data destinations overview"
sidebar_label: "Destinations"
sidebar_position: 6
description: "Every place Snowplow can send your events: warehouse and lake loaders, event forwarders, GTM Server Side, Snowbridge targets, stream consumers, and reverse ETL."
keywords: ["data destinations", "event forwarding", "data warehouses", "data lakes", "reverse ETL", "snowbridge"]
---

```mdx-code-block
import DestinationsCatalog from '@site/src/components/catalogs/DestinationsCatalog';
```

Snowplow loads validated, enriched events into your warehouse or lake, and can send the same events to other tools as they arrive. For how destinations fit into the pipeline, see [destinations](/docs/fundamentals/destinations/index.md) in the fundamentals.

## Destinations catalog

This catalog lists every destination with a page in these docs. Use the filters to narrow it by type, delivery, cloud, or status. Each filtered view has its own URL, for example `?type=forwarder&cloud=gcp`.

<DestinationsCatalog />

## Choose a destination type

Each type of destination suits a different job:

* [Warehouses and lakes](/docs/destinations/warehouses-lakes/index.md) are the primary destinations for Snowplow data. Loaders write every event, with its entities, into tables you query.
* [Event forwarders](/docs/destinations/forwarding-events/index.md) filter, transform, and send events to third-party platforms within seconds. They run as managed Snowbridge apps in your Snowplow cloud account.
* [Google Tag Manager Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md) relays enriched events to the destinations in its tag library.
* [Snowbridge](/docs/api-reference/snowbridge/index.md) routes events to streams and HTTP APIs that event forwarding doesn't cover yet.
* [Custom streaming](/docs/destinations/custom-streaming/index.md) lets Private Managed Cloud and Self-Hosted pipelines consume events directly from the enriched stream.
* [Reverse ETL](/docs/destinations/reverse-etl/index.md) publishes modeled data from your warehouse to marketing platforms, where it can be activated.
