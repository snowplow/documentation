---
title: "First steps with Snowplow"
sidebar_position: 1
sidebar_label: "Get started"
description: "Start Snowplow on a hosted environment with no infrastructure to run, optionally with an AI assistant doing the setup."
keywords: ["getting started", "Snowplow CDI", "free trial", "free tier", "AI assistant", "Private Managed Cloud", "CDI Cloud", "Community Edition", "Self-Hosted", "deployment options"]
content_type: landing
pagination_prev: null
pagination_next: null
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

* The [free trial](/docs/get-started/free-trial/index.md) is 14 days of Snowplow CDI Cloud. Sign up on the [Snowplow website](https://snowplow.io/get-started/snowplow-free-trial), with no credit card and no sales call, and usually receive access instructions within moments of verifying your email address.
* The [Signals free tier](https://signals.snowplow.io/start?utm_source=docs.snowplow.io&utm_medium=referral) is the same hosted environment with no end date, capped at 5 million events a month, for building real-time customer attributes with [Signals](/docs/signals/index.md).

Once the environment exists, you can do the setup yourself by following the rest of this guide, or hand it to an AI assistant. The [Snowplow MCP server](/docs/ai/snowplow-mcp/index.md) connects Claude Code, Cursor, Codex, or any MCP client to your account with one command, and the [Snowplow Assistant](/docs/ai/console-agent/index.md) does the same from inside Console. Either can design the tracking plan, create the schemas, add the tracker to your application, and check the events. See [Snowplow quickstart with your coding agent](/docs/get-started/quickstart/index.md).

When you're ready for production, see [Choose a Snowplow deployment](/docs/get-started/deployment-options/index.md) to compare running Snowplow in Snowplow's cloud, in your own cloud account, or self-hosted.

## Next steps

Pick the path that matches what you want to do first:

* To have a coding agent set up tracking for you, follow [Snowplow quickstart with your coding agent](/docs/get-started/quickstart/index.md)
* To set up a hosted environment yourself, start the [free trial](/docs/get-started/free-trial/index.md), then follow [Tracking your first events](/docs/get-started/tracking/index.md)
* To build real-time customer attributes for an application or AI agent, follow the [Signals quickstart](/docs/signals/quickstart/index.md)
* To run Snowplow in your own cloud account or self-host it, see [Choose a Snowplow deployment](/docs/get-started/deployment-options/index.md)
