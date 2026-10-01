---
title: "Reduce infrastructure cost with enriched stream compression"
description: "Cloud streaming services are billed by data volume. Compression minimizes data volume. Enrich 6.11+ can compress data in the enriched stream, in addition to the raw stream (already compressed in the Collector)."
date: "2026-09-24"
category:
  - "Product news"
components:
  - "Pipeline components"
---

:::note[Applicability]

This announcement only applies to Snowplow Private Managed Cloud (PMC) and Self-Hosted customers.

:::

Data compression is now available in the enriched event stream, supported on AWS, Azure, and GCP. This feature (losslessly) reduces the amount of data flowing through Snowplow pipelines, resulting in lower infrastructure costs.

## Preliminary results

Depending on your monthly event volume and other factors (average size of events in bytes, the nature of your data, etc.), you will see a different amount of savings. The following estimates are indicative only and not guaranteed:

| Monthly event volumes | Potential savings |
| --------------------- | ----------------- |
| Over 3B               | 10–20%            |
| Between 1B and 3B     | 5–15%             |
| Below 1B              | 0–10%             |

In absolute terms, the savings should roughly match those from when _raw_ stream compression was enabled. (For Snowplow PMC customers, this was in October–November 2025.)

## Enabling compression

Enriched stream compression is an _opt-in_ feature.

:::warning

Do not enable compression if you have any custom apps consuming from the enriched stream (aside from the apps maintained by Snowplow). Because compression changes the data format, custom apps will not be able to parse the data.

:::

### PMC customers

In Console, navigate to the pipeline where you want to enable compression. Click **Additional settings** and then **Enriched stream compression** > **Enable**.

You will need pipeline edit permissions for this.

### Self-hosted customers

Follow the [Enrich 6.11.x upgrade guide](/docs/api-reference/enrichment-components/upgrade-guides/6-11-x-upgrade-guide/). Make sure that all downstream Snowplow apps meet the minimum required versions listed in the guide.

## Monitoring

If you monitor the metrics on your enriched stream (Kinesis, Pub/Sub, Kafka, or Event Hubs, depending on the cloud), you will notice some changes in the numbers. In particular, the size of the messages will drop. This reflects the smaller records and does not indicate a drop in event volumes. Event counts and the enriched data itself are unchanged.
