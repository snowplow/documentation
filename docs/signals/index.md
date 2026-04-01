---
title: "Introduction to Snowplow Signals"
sidebar_position: 8.7
description: "Snowplow Signals is a real-time personalization engine that computes and acts on behavioral data from your pipeline. It enables in-session stream and historical user data access for personalized experiences, recommendations, and dynamic pricing."
keywords: ["real-time personalization", "customer intelligence", "behavioral data", "signals", "agentic applications"]
sidebar_label: "Signals"
sidebar_custom_props:
  header: "Signals"
---

<!-- This page isn't seen because of how the navigation sidebar is structured, with the Signals subsections artifically hoisted to look like they're all top-level sections. The Signals landing page is at introduction/index.md -->

<!-- This content is here for SEO purposes - it's taken from the get-started page -->

Snowplow Signals computes user attributes from your data. You can retrieve these attributes in your applications to take real-time actions. Signals can also send automated triggers to your applications based on calculated attributes.

Use Signals to:
* Provide enriched user context to chatbots and other agentic applications, in near real time
* Deliver personalized recommendations, dynamic pricing, and adaptive UIs based on current behavior
* Trigger actions automatically when users meet specific criteria

By default, Signals calculates attributes from your real-time Snowplow event stream, but you can also configure it to calculate from warehouse data.

## Try Signals for free

Signals Sandbox is a [free, lightweight sandbox environment](https://try-signals.snowplow.io/) where you can try out Signals without needing a Snowplow account or pipeline. Log in with your GitHub account to get started.

The Sandbox provides you with:
* Signals infrastructure and Snowplow pipeline deployed in a dedicated environment
* [Event Collector](/docs/fundamentals/index.md) endpoint
* Signals Profiles API endpoint
* Sandbox Token for authentication

Check out the [real-time interventions tutorial](/tutorials/signals-interventions/start) for a hands-on introduction to using the Sandbox. The tutorial uses a demo ecommerce website to generate events, but you could also send your own events to the Sandbox Collector using any [Snowplow tracker](/docs/sources/index.md).

Use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) or [Signals API](/docs/signals/connection/index.md#signals-api) to start experimenting with [attributes](/docs/signals/concepts/index.md#attribute-groups) and [interventions](/docs/signals/concepts/index.md#interventions).

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

## Workflow

These are the high-level steps for using Signals:
1. Decide on the business logic
2. Apply the configurations to Signals
3. Use the attributes and interventions to take action in your application

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for help getting started.

### 1. Decide on the business logic

Your first step is to decide what changes in user behavior you're aiming for. What systems or data will you need to achieve this? This planning will help you decide which attributes you want to calculate, and which interventions you're interested in defining.

You'll also need to decide whether to calculate attributes from your real-time event stream (default), or from warehouse data, or both.

Read more about attributes and interventions on the [concepts](/docs/signals/concepts/index.md) page.

### 2. Apply the configuration

We recommend using [Console](https://console.snowplowanalytics.com) to define your attributes and interventions. You could also use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), or even the [Signals API](/docs/signals/connection/index.md#signals-api).

Once you've created your configurations, apply them to Signals by publishing them. It will start calculating attributes and populating the Profiles Store.

### 3. Take action in your application

Retrieve calculated attributes in your application using the [Node.js](https://www.npmjs.com/package/@snowplow/signals-node) or [Python](https://pypi.org/project/snowplow-signals/) Signals SDKs. You could also use the Signals API.

Use the attributes to update the user experience, or subscribe to [interventions](/docs/signals/concepts/index.md) to automatically take action based on user behavior.
