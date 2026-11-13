---
title: "Choose a Snowplow deployment"
sidebar_position: 1
sidebar_label: "Choose a deployment"
description: "Compare the Snowplow deployment options: CDI Cloud, CDI Private Managed Cloud, Community Edition, and Self-Hosted, and what you host in each."
keywords: ["deployment options", "CDI Cloud", "Private Managed Cloud", "Community Edition", "Self-Hosted", "control plane", "data plane"]
date: "2026-11-06"
content_type: concept
---

You don't need to choose a deployment to start with Snowplow: the [hosted environment](/docs/cdi/index.md#start-here) needs no infrastructure, and the same account carries over to a paid deployment. Use this page when you're planning for production. For a feature-by-feature list, see the [feature comparison](/docs/get-started/feature-comparison/index.md).

Snowplow runs as a managed platform, hosted either by Snowplow or in your own cloud account, or as a self-hosted deployment that you run yourself.

Snowplow offers two Customer Data Infrastructure (CDI) platforms:
* **Snowplow CDI Private Managed Cloud**: hosted in your own cloud, managed by Snowplow
* **Snowplow CDI Cloud**: hosted and managed by Snowplow

Snowplow has two self-hosted options:
* **Snowplow Community Edition**: not for production use, hosted and managed by you
* **Snowplow Self-Hosted**: for production use, for existing Snowplow users

## Customer Data Infrastructure

Snowplow CDI is the full infrastructure offering. Choose whether you'd like the **data plane** to be entirely hosted in your cloud account, or whether you'd prefer Snowplow to host the pipeline infrastructure for you.

The **control plane**, which includes a UI and an API for [defining your data](/docs/event-studio/tracking-plans/index.md) and managing your infrastructure, is always hosted by Snowplow.

### CDI Private Managed Cloud

Private Managed Cloud is a version of [Snowplow](https://snowplow.io) hosted in your own cloud account, using your data warehouse or lake. Snowplow manages ongoing pipeline maintenance, such as upgrades and security patches.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |                    |       ✅       |
| Data destination (warehouse / lake)         |                    |       ✅       |

### CDI Cloud

Cloud is a hosted version of Snowplow. You don't need to set up any cloud infrastructure yourself.

Snowplow collects and processes all data for Cloud in its own cloud account.

|                                             | Hosted by Snowplow | Hosted by you |
| :------------------------------------------ | :----------------: | :-----------: |
| **Control plane**                           |                    |               |
| Management Console                          |         ✅          |               |
| API endpoints                               |         ✅          |               |
| **Data plane**                              |                    |               |
| Pipeline infrastructure (AWS / Azure / GCP) |         ✅          |               |
| Data destination (warehouse / lake)         |                    |       ✅       |

## Self-Hosted

Self-Hosted is for teams that want to run the pipeline infrastructure themselves. It is not required to use Snowplow, and it is not the quickest way to evaluate it: the hosted environment needs no deployment. With Self-Hosted, you deploy and host everything, and many features, including the **control plane**, are not available.

### Community Edition

Snowplow [Community Edition](/docs/get-started/self-hosted/index.md) is for **non-production** use cases. It's a starter template: use it to evaluate Snowplow for testing purposes.

Community Edition infrastructure is provided under the [SLULA license](/docs/licensing/index.md).

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

## Snowplow Signals

Where [Signals](/docs/signals/introduction/index.md) runs depends on how you start:

* **Signals free tier**: hosted and managed by Snowplow on AWS, in the US or the EU depending on the region you sign up from. Event collection is included.
* **Snowplow CDI Cloud and Private Managed Cloud**: once the Signals package is enabled on your account, you deploy Signals from Console in the AWS region you choose. Signals reads events from your existing pipeline.

See [Set up Signals](/docs/signals/setup/index.md) for the steps.
