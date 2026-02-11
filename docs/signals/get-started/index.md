---
title: "Get started with Snowplow Signals"
sidebar_position: 8
description: "Learn how to use Snowplow Signals to compute user attributes from event data, retrieve them in real time for personalization and agentic applications, and trigger automated actions based on user behavior."
keywords: ["signals", "user attributes", "real-time personalization", "agentic ai", "interventions", "profiles store"]
sidebar_label: "Get started"
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

By default, Signals calculates attributes from your real-time event stream, but you can also configure it to calculate from warehouse data.

## Try Signals for free

Signals Sandbox is a [free, lightweight sandbox environment](https://try-signals.snowplow.io/) where you can try out Signals without needing a Snowplow account or pipeline. Log in with your GitHub account to get started.

The Sandbox provides you with:
* Signals infrastructure and Snowplow pipeline deployed in a dedicated environment
* [Event Collector](/docs/fundamentals/index.md) endpoint
* Signals Profiles API endpoint
* Sandbox Token for authentication

Check out the [real-time interventions tutorial](/tutorials/signals-interventions/start) for a hands-on introduction to using the Sandbox. The tutorial uses a demo ecommerce website to generate events, but you could also send your own events to the Sandbox Collector using any [Snowplow tracker](/docs/sources/index.md).

Use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) or [Signals API](/docs/signals/connection/index.md#signals-api) to start experimenting with [attributes](/docs/signals/concepts/attributes/index.md) and [interventions](/docs/signals/concepts/interventions/index.md).

## Architecture

You will need a [Snowplow pipeline](/docs/get-started/index.md) to use Signals. Your Signals infrastructure is deployed into the same cloud as your pipeline.

:::note Warehouse support
Only Snowflake and BigQuery are supported currently. However, you can also use Signals without the warehouse functionality.
:::

Signals consists of several new infrastructure components. When running Signals, your Snowplow pipeline will continue to process events as usual.

The core Signals components are:
* **Profiles Store**: stores calculated attributes and configurations
* Signals **SDKs** and **API**: allow you to manage and fetch attributes and interventions
* **Streaming engine**: computes attributes from Snowplow events in stream, and sends them directly to the Profiles Store
* **Sync engine**: periodically updates the Profiles Store with batch attributes
* **Batch engine**: runs in your warehouse to compute attributes from warehouse tables

![Snowplow Signals architecture diagram showing core components including Profiles Store, SDKs, streaming engine, and batch engine](../images/overview-incl-batch-engine.svg)

## Workflow

These are the high-level steps for using Signals:
1. Decide on the business logic
2. Apply the configurations to Signals
3. Use the attributes and interventions to take action in your application

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for help getting started.

### 1. Decide on the business logic

Your first step is to decide what changes in user behavior you're aiming for. What systems or data will you need to achieve this? This planning will help you decide which [attributes](/docs/signals/concepts/attributes/index.md) you want to calculate, and which [interventions](/docs/signals/concepts/interventions/index.md) you're interested in defining.

You'll also need to decide whether to calculate attributes from your real-time event stream (default), or from warehouse data, or both.

### 2. Apply the configuration

We recommend using [Snowplow Console](https://console.snowplowanalytics.com) to define your attributes and interventions. You could also use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), or even the [Signals API](/docs/signals/connection/index.md#signals-api).

Once you've created your configurations, apply them to Signals by publishing them. It will start calculating attributes and populating the Profiles Store.

### 3. Take action in your application

Retrieve calculated attributes in your application using the [Node.js](https://www.npmjs.com/package/@snowplow/signals-node) or [Python](https://pypi.org/project/snowplow-signals/) Signals SDKs. You could also use the Signals API.

Use the attributes to update the user experience, or subscribe to [interventions](/docs/signals/concepts/interventions/index.md) to automatically take action based on user behavior.
