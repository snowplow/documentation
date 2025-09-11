---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Complete getting started guide for implementing Snowplow behavioral data infrastructure and event analytics platform."
schema: "TechArticle"
keywords: ["Getting Started", "Snowplow Introduction", "Quick Start", "Platform Overview", "Analytics Platform", "First Steps"]
---

For production use, you can choose between Snowplow BDP Enterprise and Snowplow BDP Cloud. For non-production use cases, use Snowplow Community Edition, or play around with Snowplow Micro. See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for more information.

## BDP Enterprise

Snowplow [BDP Enterprise](/docs/get-started/snowplow-bdp/index.md) is deployed using a "private SaaS" or "Bring Your Own Cloud (BYOC)" deployment model. This means the data pipeline is hosted and run in your own cloud environment, using your data warehouse or lake. These comprise the **data plane**. Ongoing pipeline maintenance, such as upgrades and security patches, are managed by Snowplow.

The **control plane**, which includes a UI and an API for [defining your data](/docs/data-product-studio/data-products/index.md) and managing your infrastructure, is hosted by Snowplow.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## BDP Cloud

Snowplow [BDP Cloud](/docs/get-started/snowplow-bdp/index.md) differs from BDP Enterprise in that your data pipeline is deployed in Snowplow's cloud account, and is entirely managed by Snowplow.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |         ✅          |               |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Community Edition

With Snowplow [Community Edition](/docs/get-started/snowplow-community-edition/index.md), you deploy and host everything. Note that the **control plane** functionality isn't available in Community Edition.

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
