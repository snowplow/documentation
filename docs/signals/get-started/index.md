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
* Provide enriched user context to chatbots and other agentic applications, in real time
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

These are the high-level steps for using Signals, and the documentation in this section follows the same order:
1. Set up Signals
2. Plan your use case
3. Define and publish your configuration
4. Take action in your application

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for a hands-on walkthrough.

### 1. Set up Signals

[Enable Signals](/docs/signals/setup/index.md) in Snowplow Console. This is a one-time task that deploys the Signals infrastructure alongside your pipeline.

Connecting a warehouse is optional, but you'll need one to backfill stream attributes with historical data, sync pre-calculated warehouse tables, or test attribute definitions before publishing.

### 2. Plan your use case

Decide what changes in user behavior you're aiming for, and what your application will do about them. This planning will tell you:
* Which [attributes](/docs/signals/concepts/index.md#attribute-groups) to calculate, and at what level — per user, per session, or against a custom [attribute key](/docs/signals/concepts/index.md#attribute-keys)
* Whether to calculate them from your real-time event stream, sync pre-calculated values from your warehouse, or both — see [data sources](/docs/signals/concepts/index.md#data-sources)
* Whether your application will pull attribute values on demand, react to [interventions](/docs/signals/concepts/index.md#interventions) pushed by Signals, or both
* Whether you need to ground an agent in a user's recent session activity, using an [agentic context](/docs/signals/concepts/index.md#agentic-contexts)

The [fundamentals](/docs/signals/concepts/index.md) page explains all of these components.

### 3. Define and publish your configuration

[Define attribute groups](/docs/signals/attributes/index.md), [interventions](/docs/signals/interventions/index.md), and [agentic contexts](/docs/signals/agentic-contexts/index.md), using Snowplow Console or the [Signals Python SDK](/docs/signals/connection/index.md#signals-python-sdk). Group your published attribute groups into [services](/docs/signals/applications/services/index.md), so your applications consume a stable set of attributes.

Definitions only take effect once published: publishing is what makes Signals start calculating attributes and populating the Profiles Store. The [configuration workflow](/docs/signals/attributes/index.md#configuration-workflow) describes the full lifecycle, including testing definitions before you publish.

### 4. Take action in your application

[Retrieve the calculated attributes](/docs/signals/applications/retrieve-attributes/index.md) in your application using the Python SDK, Node.js SDK, or API, and use them to personalize the user experience.

To react to user behavior as it happens, [subscribe to interventions](/docs/signals/applications/subscribe/index.md) using the Python SDK, the browser tracker plugin, or the API.

To ground an agent in a user's recent activity and instruct how to interpret behavioral data, [retrieve an agentic context](/docs/signals/applications/agentic-contexts/index.md) using the Python SDK or Node.js SDK.

## Resources

Check out the Signals foundations tutorials:
* [Quick Start](/tutorials/signals-quickstart/start) for defining stream attributes using the UI or the Python SDK

Follow the [real-time prospect scoring with ML](/tutorials/signals-ml-prospect-scoring/intro) solution accelerator to explore using Signals with a machine learning use case.
