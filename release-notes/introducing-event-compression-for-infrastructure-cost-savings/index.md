---
title: "Introducing event compression for infrastructure cost savings"
description: "We have released a new feature: event compression, available on AWS, Azure and GCP."
date: "2025-10-30"
category:
  - "Release notes"
components:
  - "Pipeline components"
  - "Destinations"
---
We have released a new feature: **event compression**, available on AWS, Azure and GCP. This feature (losslessly) reduces the amount of data flowing through Snowplow pipelines, resulting in **lower infrastructure costs**.

## Preliminary results

Depending on your monthly event volume and other factors (average size of events in bytes, the nature of your data, etc) you will see a different amount of savings. The following estimates are indicative only (and not guaranteed):

| Monthly event volumes | Potential savings |
| --------------------- | ----------------- |
| Over 3B               | 10–20%            |
| Between 1B and 3B     | 5–15%             |
| Below 1B              | 0–10%             |

## Why does compression help?

Customers tracking 1B events per month or more will notice that streaming technologies (Kinesis on AWS, Pub/Sub on GCP, Event Hubs on Azure) represent a significant proportion of their infrastructure bill. In some cases, it can reach 60–70% of the total cost. Therefore, a reduction in streaming costs has a big impact.

Streaming services charge by data volume. We can reduce this volume, and therefore the charges, by compressing data.

## How does compression work?

Snowplow data contains similar field names, values and identifiers from one event to another. If we group events into small batches, these repeating elements can be eliminated within each batch and reconstructed later in the pipeline. Compressed data can occupy as little as 10% of the original data.

Note that we only compress data between the Collector and Enrich applications. Compression is __not__ applied to the enriched stream, and as such there is no data format change for that stream

## Setup

For Snowplow CDI customers with a private managed cloud deployment, this feature is already rolled out and active, or will be rolled out by early November 2025. You can start monitoring your cloud billing for savings, which are typically reflected within a 24–48h period.

For Snowplow Self-Hosted Pipeline customers, please follow the [documentation](/docs/api-reference/stream-collector/upgrade-guides/3-6-x-upgrade-guide/) to upgrade to Collector 3.6.x and Enrich 6.1.x or newer.
