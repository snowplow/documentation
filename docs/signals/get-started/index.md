---
title: "Get started with Snowplow Signals"
sidebar_label: "Get started"
sidebar_position: 5
description: "Learn how to use Snowplow Signals to compute user attributes from event data, retrieve them in real time for personalization and agentic applications, and trigger automated actions based on user behavior."
keywords: ["real-time personalization", "customer intelligence", "behavioral data", "signals", "agentic applications"]
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'addon']}
  helpContent="Signals is a paid addon for Snowplow CDI."
/>
```

Snowplow Signals computes user attributes from your data. You can retrieve these attributes in your applications to take real-time actions. Signals can also send automated triggers to your applications based on calculated attributes.

Use Signals to:
* Provide enriched user context to chatbots and other agentic applications, in near real time
* Deliver personalized recommendations, dynamic pricing, and adaptive UIs based on current behavior
* Trigger actions automatically when users meet specific criteria

By default, Signals calculates attributes from your real-time Snowplow event stream, but you can also sync pre-calculated values from your warehouse.

If you don't have a Snowplow account yet, sign up for a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to experience Signals and Snowplow Console.

## Architecture

You will need a [Snowplow pipeline](/docs/get-started/index.md) to use Signals. Your Signals infrastructure is deployed into the same cloud as your pipeline.

:::note[Warehouse support]
Only Snowflake and BigQuery are supported currently. However, you can also use Signals without the warehouse functionality.
:::

Signals consists of several new infrastructure components. When running Signals, your Snowplow pipeline will continue to process events as usual.

The core Signals components are:
* **Profiles Store**: stores calculated attributes and configurations
* Signals **SDKs** and **API**: allow you to manage and fetch attributes and interventions
* **Streaming engine**: computes attributes from Snowplow events in real time and sends them directly to the Profiles Store
* **Batch engine**: reads pre-calculated attribute values from your warehouse tables at a fixed interval and syncs them to the Profiles Store; also backfills historical data for stream attribute groups

![Snowplow Signals architecture diagram showing core components including Profiles Store, SDKs, streaming engine, and batch engine](../images/overview-incl-batch-engine.svg)

## Workflow

These are the high-level steps for using Signals:
1. Decide on the business logic
2. Apply the configurations to Signals
3. Use the attributes and interventions to take action in your application

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for help getting started.

### 1. Decide on the business logic

Your first step is to decide what changes in user behavior you're aiming for. What systems or data will you need to achieve this? This planning will help you decide which attributes you want to calculate, and which interventions you're interested in defining.

You'll also need to decide whether to calculate attributes from your real-time event stream, or to include pre-calculated warehouse data, or both.

Read more about attributes and interventions on the [fundamentals](/docs/signals/concepts/index.md) page.

### 2. Apply the configuration

We recommend using [Console](https://console.snowplowanalytics.com) to define your attributes and interventions. You could also use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), or even the [Signals API](/docs/signals/connection/index.md#signals-api).

Once you've created your configurations, apply them to Signals by publishing them. It will start calculating attributes and populating the Profiles Store.

### 3. Take action in your application

Retrieve calculated attributes in your application using the [Node.js](https://www.npmjs.com/package/@snowplow/signals-node) or [Python](https://pypi.org/project/snowplow-signals/) Signals SDKs. You could also use the Signals API.

Use the attributes to update the user experience, or subscribe to [interventions](/docs/signals/concepts/index.md) to automatically take action based on user behavior.

## Resources

Check out the Signals foundations tutorials:
* [Quick Start](/tutorials/signals-quickstart/start) for defining stream attributes using the UI or the Python SDK

Follow the [real-time prospect scoring with ML](/tutorials/signals-ml-prospect-scoring/intro) solution accelerator to explore using Signals with a machine learning use case.
