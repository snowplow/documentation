---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Details on where and how Snowplow is deployed"
---

Choose the [Snowplow](https://snowplow.io) platform that works for your business. See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for more information.

We offer two fully featured Customer Data Infrastructure (CDI) platforms:
* **Snowplow CDI Private Managed Cloud**: hosted in your own cloud, managed by Snowplow
* **Snowplow CDI Cloud**: hosted and managed by Snowplow

For self-hosted deployments, you can buy a production or a non-production license:
* **Snowplow High Availability**: for production use, hosted and managed by you
* **Snowplow Community Edition**: not for production use, hosted and managed by you

## Customer Data Infrastructure

Snowplow CDI is our full infrastructure offering. Choose whether you'd like the **data plane** to be entirely hosted in your cloud account, or whether you'd prefer Snowplow to host the pipeline infrastructure for you.

The **control plane**, which includes a UI and an API for [defining your data](/docs/data-product-studio/data-products/index.md) and managing your infrastructure, is always hosted by Snowplow.

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

Choose Snowplow Self-Hosted to host and manage your Snowplow infrastructure, for complete control over your deployment. With Self-Hosted, you deploy and host everything. Many features, including the **control plane**, are not available in Self-Hosted.

### High Availability

Snowplow High Availability is ideal if you have an existing Snowplow deployment, and prefer to manage all upgrades and maintenance yourself. The infrastructure is provided under a proprietary, production-use license.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

### Community Edition

Snowplow [Community Edition](/docs/get-started/self-hosted/index.md) is for **non-production** use cases.

Community Edition infrastructure is provided under the [SLULA license](/docs/resources/copyright-license/index.md).

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |        N/A         |      N/A      |
| API endpoints                               |        N/A         |      N/A      |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |
