---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Details on where and how Snowplow is deployed"
keywords: ["Snowplow CDI", "Private Managed Cloud", "Cloud", "Community Edition", "Self-Hosted"]
---

Snowplow is a Customer Data Infrastructure (CDI) platform capable of processing billions of events per day:

* Start by [defining the data](/docs/fundamentals/tracking-plans/index.md) you want to collect
* Choose from over 20 [tracker SDKs](/docs/sources/index.md) to collect data from web, mobile, server-side, and other sources, using custom tracking or [over 100 built-in events and entities](/docs/events/ootb-data/index.md)
* Enrich your events before loading with over 15 [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)
* Monitor your [data quality](/docs/fundamentals/failed-events/index.md) - your pipeline will only load [validated data](/docs/fundamentals/schemas/index.md) into your [warehouse or lake](/docs/destinations/warehouses-lakes/index.md)
* Send enriched events to [third-party platforms](/docs/destinations/forwarding-events/index.md) in real-time
* Model your data with our [dbt packages](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md)
* Enable real time personalization with [Signals](/docs/signals/)

<img src="/img/snowplow-cdi-signals_vertical.svg" alt="diagram of snowplow architecture" style={{maxHeight: '800px', width: 'auto'}} />

Choose the Snowplow platform that works for your business. See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for more information.

We offer two fully featured Customer Data Infrastructure (CDI) platforms:
* **Snowplow CDI Private Managed Cloud**: hosted in your own cloud, managed by Snowplow
* **Snowplow CDI Cloud**: hosted and managed by Snowplow

For self-hosted deployments, we have:
* **Snowplow Community Edition**: not for production use, hosted and managed by you
* **Snowplow Self-Hosted**: for production use, for existing Snowplow users

## Customer Data Infrastructure

Snowplow CDI is our full infrastructure offering. Choose whether you'd like the **data plane** to be entirely hosted in your cloud account, or whether you'd prefer Snowplow to host the pipeline infrastructure for you.

The **control plane**, which includes a UI and an API for [defining your data](/docs/event-studio/tracking-plans/index.md) and managing your infrastructure, is always hosted by Snowplow.

### CDI Private Managed Cloud

Private Managed Cloud is a version of [Snowplow](https://snowplow.io) hosted in your own cloud account, using your data warehouse or lake. Ongoing pipeline maintenance, such as upgrades and security patches, are managed by Snowplow.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

### CDI Cloud

Cloud is a hosted version of Snowplow designed to get your organization up and running and delivering value from behavioral data as quickly as possible. With Cloud, you don't need to set up any cloud infrastructure yourself.

All data processed and collected with Snowplow Cloud is undertaken within Snowplow's own cloud account.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |         ✅          |               |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Self-Hosted

With Self-Hosted, you deploy and host everything. Many features, including the **control plane**, are not available in Self-Hosted.

### Community Edition

Snowplow [Community Edition](/docs/get-started/self-hosted/index.md) is for **non-production** use cases. It's a starter template: use it to evaluate Snowplow for testing purposes.

Community Edition infrastructure is provided under the [SLULA license](/docs/resources/copyright-license/index.md).

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

### Production Self-Hosted license

If you have an existing Snowplow implementation, either Community Edition or a legacy deployment, you're eligible for Snowplow Self-Hosted. It's a production-use license.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |
