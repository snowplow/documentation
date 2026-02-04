---
title: "How to use Signals"
sidebar_position: 40
sidebar_label: "How to use Signals"
description: "Learn the high-level steps for using Signals, from planning your business logic to applying configurations and taking action in your application."
keywords: ["getting started", "workflow", "business logic", "configuration"]
date: "2026-02-04"
---

These are the high-level steps for using Signals:
1. Decide on the business logic
2. Apply the configurations to Signals
3. Use the attributes and interventions to take action in your application

Check out the [quick start tutorial](/tutorials/signals-quickstart/start) for help getting started.

## Decide on the business logic

Your first step is to decide what changes in user behavior you're aiming for. What systems or data will you need to achieve this? This planning will help you decide which attributes you want to calculate, and which interventions you're interested in defining.

You'll also need to decide whether to calculate attributes from your real-time event stream (default), or from warehouse data, or both.

Read more about attributes and interventions on the [concepts](/docs/signals/concepts/index.md) page.

## Apply the configuration

We recommend using [Console](https://console.snowplowanalytics.com) to define your attributes and interventions. You could also use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/), or even the [Signals API](/docs/signals/connection/index.md#signals-api).

Once you've created your configurations, apply them to Signals by publishing them. It will start calculating attributes and populating the Profiles Store.

## Take action in your application

Retrieve calculated attributes in your application using the [Node.js](https://www.npmjs.com/package/@snowplow/signals-node) or [Python](https://pypi.org/project/snowplow-signals/) Signals SDKs. You could also use the Signals API.

Use the attributes to update the user experience, or subscribe to [interventions](/docs/signals/concepts/interventions/index.md) to automatically take action based on user behavior.
