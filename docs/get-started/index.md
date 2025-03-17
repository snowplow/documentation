---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Details on where and how Snowplow is deployed"
---

You can choose between Snowplow BDP Enterprise (paid, hosted in your cloud), Snowplow BDP Cloud (paid, hosted by Snowplow) and Snowplow Community Edition (free, hosted in your cloud). See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for more information.

Each offering has its own setup guide:
* [Snowplow BDP Enterprise](/docs/get-started/snowplow-bdp/index.md)
* [Snowplow BDP Cloud](/docs/get-started/snowplow-bdp/index.md)
* [Snowplow Community Edition](/docs/get-started/snowplow-community-edition/index.md)

## Snowplow BDP Enterprise

Snowplow BDP Enterprise is deployed using a “private SaaS” or “Bring Your Own Cloud (BYOC)” deployment model. This means the data pipeline is hosted and run in your own cloud environment, using your data warehouse or lake. (These comprise the **data plane**.) The ongoing pipeline maintenance, such as upgrades and security patches, are still managed by Snowplow.

The **control plane**, which includes a UI and an API for [defining your data](/docs/data-product-studio/data-products/index.md) and managing your infrastructure, is hosted by Snowplow.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Snowplow BDP Cloud

BDP Cloud differs from BDP Enterprise above in that the data pipeline is deployed in Snowplow’s cloud account and entirely managed by Snowplow.

|                                     | Hosted by Snowplow | Hosted by you |
| :---------------------------------- | :----------------: | :-----------: |
| **Control plane**                   |                    |               |
| Management Console                  |         ✅          |               |
| API endpoints                       |         ✅          |               |
| **Data plane**                      |                    |               |
| Pipeline infrastructure             |         ✅          |               |
| Data destination (warehouse / lake) |                    |       ✅       |

## Snowplow Community Edition

With Snowplow Community Edition, everything is deployed and hosted by you. Note that the **control plane** functionality from above is not available in Community Edition.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Snowplow Micro

While not a full substitute for a real Snowplow pipeline, [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) could be a quick way to get a feel for how Snowplow works for more technical users. Note that Micro does not store data in any warehouse or database, but you will be able to look at the available fields.
