---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Details on where and how Snowplow is deployed"
---

Choose the [Snowplow](https://snowplow.io) Customer Data Infrastructure (CDI) platform that works for your business. See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for more information.

For production use, choose between:
* **Snowplow CDI Private Managed Cloud**: hosted in your own cloud, managed by Snowplow
* **Snowplow CDI Cloud**: hosted and managed by Snowplow
* **Snowplow Self-Hosted**: hosted and managed by you

For non-production use cases:
* Snowplow Community Edition
* Snowplow Micro, a QA and development pipeline

:::tip
If you'd like to learn more about Snowplow, **[book a demo with our team](https://snowplow.io/get-started/book-a-demo-of-snowplow-bdp/?utm-medium=related-content&utm_campaign=snowplow-docs)**.
:::

## CDI Private Managed Cloud

Private Managed Cloud is a version of [Snowplow](https://snowplow.io) hosted in your own cloud account, using your data warehouse or lake. These comprise the **data plane**. We support AWS, GCP, and Azure. Ongoing pipeline maintenance, such as upgrades and security patches, are managed by Snowplow.

The **control plane**, which includes a UI and an API for [defining your data](/docs/data-product-studio/data-products/index.md) and managing your infrastructure, is hosted by Snowplow.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## CDI Cloud

Cloud is a hosted version of Snowplow designed to get your organization up and running and delivering value from behavioral data as quickly as possible. With Cloud, you don't need to set up any cloud infrastructure yourself.

All data processed and collected with Snowplow Cloud is undertaken within Snowplow's own cloud account. Data is stored in Snowplow's cloud account for 7 days to provide resilience against potential failures.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |         ✅          |               |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Self-Hosted

Choose Snowplow Self-Hosted to host and manage your Snowplow infrastructure, for complete control over your deployment. Not all features, including the **control plane**, are available in Self-Hosted.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Community Edition

Snowplow [Community Edition](/docs/get-started/snowplow-community-edition/index.md) is for non-production use cases. With Community Edition, you deploy and host everything. Not all features, including the **control plane**, are available in Community Edition.

Community Edition pipelines are provided under the [SLULA license](/docs/resources/copyright-license/index.md).

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Micro

While not a full substitute for a Snowplow pipeline, [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) could be a quick way to get a feel for how Snowplow works for more technical users. Micro doesn't store data in any warehouse or database, but you will be able to look at the available fields.
