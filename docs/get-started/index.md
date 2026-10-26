---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Start Snowplow on a hosted environment in about 20 minutes with no infrastructure to run, optionally with an AI assistant doing the setup, then compare the deployment options for production."
keywords: ["getting started", "Snowplow CDI", "free trial", "free tier", "AI assistant", "Private Managed Cloud", "CDI Cloud", "Community Edition", "Self-Hosted", "deployment options"]
---

Snowplow is the customer context layer that provides the data foundation for your organization. It transforms raw behavioral data into real-time customer context for AI agents and advanced analytics, using [Snowplow Signals](/docs/signals/index.md) and the Snowplow Customer Data Infrastructure (CDI) platform.

* Start by [defining the data](/docs/fundamentals/tracking-plans/index.md) you want to collect
* Choose from over 20 [tracker SDKs](/docs/sources/index.md) to collect data from web, mobile, server-side, and other sources, using custom tracking or [over 100 built-in events and entities](/docs/events/ootb-data/index.md)
* Enrich your events before loading with over 15 [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)
* Monitor your [data quality](/docs/fundamentals/failed-events/index.md) - your pipeline will only load [validated data](/docs/fundamentals/schemas/index.md) into your [warehouse or lake](/docs/destinations/warehouses-lakes/index.md)
* Send enriched events to [third-party platforms](/docs/destinations/forwarding-events/index.md) in real-time
* Model your data with our [dbt packages](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md)
* Enable real time personalization with [Signals](/docs/signals/introduction/index.md)

<img src="/img/snowplow-cdi-signals_vertical.svg" alt="diagram of snowplow architecture" style={{maxHeight: '800px', width: 'auto'}} />

## Start on a hosted environment

The fastest way to start is a hosted environment that Snowplow provisions for you. There is no infrastructure to deploy, and you can send events, see them validated, and load them into a warehouse or lake on the day you sign up.

* The [free trial](/docs/get-started/free-trial/index.md) is 14 days of Snowplow CDI Cloud. Sign up on the [Snowplow website](https://snowplow.io/get-started/snowplow-free-trial), with no credit card and no sales call, and receive access instructions within around 20 minutes.
* The [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral) is the same hosted environment with no end date, capped at 5 million events a month, for building real-time customer attributes with [Signals](/docs/signals/index.md).

Once the environment exists, you can do the setup yourself by following the rest of this guide, or hand it to an AI assistant. The [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) connects Claude Code, Cursor, Codex, or any MCP client to your account with one command, and the [Snowplow Assistant](/docs/ai/console-agent/index.md) does the same from inside Console. Either can design the tracking plan, create the schemas, add the tracker to your application, and check the events. See [Snowplow quickstart with your coding agent](/docs/get-started/quickstart/index.md).

Snowplow runs as a managed platform, hosted either by Snowplow or in your own cloud account, or as a self-hosted deployment that you run yourself. The hosted trial above runs on CDI Cloud, and the same account carries over to a paid deployment. See the [feature comparison page](/docs/get-started/feature-comparison/index.md) for what each edition includes.

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

Self-Hosted is for teams that want to run the pipeline infrastructure themselves. It is not required to use Snowplow, and it is not the quickest way to evaluate it: the hosted environments above need no deployment. With Self-Hosted, you deploy and host everything, and many features, including the **control plane**, are not available.

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
