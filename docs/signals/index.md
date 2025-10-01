---
title: "Snowplow Signals"
sidebar_position: 8
description: "Real-time personalization engine for customer intelligence that computes and acts on behavioral data from Snowplow's data pipeline."
sidebar_label: "Signals"
---

Snowplow Signals is a real-time personalization engine for customer intelligence, built on Snowplow's behavioral data pipeline. It allows you to compute, access, and act on in-session stream and historical user data, in real time.

Real-time personalization use cases that are unlocked by Signals include:
* Personalized recommendations
* Personalized messaging
* Agentic applications such as chatbots or copilots
* Adaptive UIs
* Dynamic pricing
* Contextually relevant advertising
* Paywall optimization

Your Signals infrastructure is deployed by us into the same cloud as your BDP pipeline. You can use [Snowplow Console](https://console.snowplowanalytics.com) to first define the data you're interested in, then use the Signals API and SDKs to retrieve the calculated [attributes](/docs/signals/concepts/index.md) in your applications to alter your customer's experience and behavior.

As well as attributes, Signals allows you to define [interventions](/docs/signals/concepts/index.md#interventions). This is a way to specify the business logic, based on attribute values, that should trigger actions such as notifications in your application.

Every [attribute group](/docs/signals/concepts/index.md#attribute-groups) and intervention published to the Signals API is versioned, allowing you to maintain strong data governance within the Profiles Store, and to test new Signals configurations without affecting production.

## How does Signals fit into the Snowplow pipeline?

Signals consists of several new infrastructure components. When running Signals, your Snowplow pipeline will continue to process events as usual.

The core Signals components are:
* **Profiles Store**: stores calculated attributes and configurations
* Signals **SDKs** and **API**: allow you to manage and fetch attributes and interventions
* **Streaming engine**: computes attributes from Snowplow events in stream, and sends them directly to the Profiles Store
* **Sync engine**: periodically updates the Profiles Store with batch attributes
* **Batch engine**: runs in your warehouse to compute attributes from warehouse tables

![Snowplow Signals architecture diagram showing core components including Profiles Store, SDKs, streaming engine, and batch engine](./images/overview-incl-batch-engine.svg)

## Using Signals

Steps for using Signals:
1. Decide on the business logic
2. Apply the configurations to Signals
3. Use the attributes and interventions to take action in your application

:::note Warehouse support
Only Snowflake and BigQuery are supported currently.
:::

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) to get started.

### 1. Decide on the business logic

Your first step is to decide what changes in user behavior you're aiming for. What systems or data will you need to achieve this? This planning will help you decide which attributes you want to calculate, and which interventions you're interested in defining.

You'll also need to decide whether to calculate attributes from your real-time event stream (default), or from warehouse data, or both.

Read more about attributes and interventions on the [concepts](/docs/signals/concepts/index.md) page.

### 2. Apply the configuration

We recommend using the Console to define your attributes and interventions. You could also use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), or even the [Signals API](/docs/signals/connection/index.md#signals-api).

Once you've created your configurations, apply them to Signals by publishing them. It will start calculating attributes and populating the Profiles Store.

### 3. Take action in your application

Retrieve calculated attributes in your application using the [Node.js](https://www.npmjs.com/package/@snowplow/signals-node) or [Python](https://pypi.org/project/snowplow-signals/) Signals SDKs. You could also use the Signals API.

Use the attributes to update the user experience, or subscribe to [interventions](/docs/signals/concepts/index.md) to automatically take action based on user behavior.
