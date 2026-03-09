---
title: "Get started with Console"
sidebar_position: 6
sidebar_label: "Console getting started"
description: "Use the Getting Started dashboard in Console to design tracking, implement it, deploy data models, and configure Signals."
keywords: ["console", "getting started", "onboarding", "tracking plan", "implement tracking", "signals", "data model"]
date: "2026-03-09"
---

The Getting Started dashboard in Console provides a guided onboarding experience that walks you through the key steps to start collecting and acting on your behavioral data. Rather than navigating each feature independently, the dashboard organizes your workflows into three sections: **Fundamentals**, **Analytics**, and **Real-time use cases**.

![The Getting Started dashboard in Console showing Fundamentals, Analytics, and Real-time use cases sections with guided workflow cards](images/console-getting-started.png)

## The Getting Started dashboard

The dashboard acts as a central hub for onboarding. Each section contains workflow cards that guide you through a specific task, from designing a tracking plan to configuring real-time Signals.

At the top of the page, banner CTAs prompt you to set up a destination or invite a teammate. These are optional but help you get the most out of Console early on.

The workflows follow a prerequisite chain. You start by creating a tracking plan, then implement tracking in your application. Once data is flowing, you can deploy data models for analytics and configure Signals for real-time use cases.

:::tip
The Getting Started dashboard is available to Snowplow CDI customers with Console access.
:::

## Design and implement tracking

The Fundamentals section covers the core data collection workflow: designing what you want to track and implementing it in your application.

### Create a tracking plan

The first card guides you through creating a [tracking plan](/docs/event-studio/tracking-plans/index.md). A tracking plan defines the [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md) you want to collect.

The guided flow walks you through:

1. Choosing between built-in events or custom tracking.
2. Creating or selecting a [source application](/docs/event-studio/source-applications/index.md).
3. Selecting tracking plan templates (Base Web, E-commerce Web, Media Web, and others).
4. Reviewing and confirming your selections.

Once confirmed, Console creates the tracking plan and associated data structures in your account.

### Implement tracking

After you have a tracking plan, the next card helps you [implement tracking](/docs/event-studio/implement-tracking/index.md) in your application.

The guided flow walks you through:

1. Selecting your source application.
2. Configuring tracker initialization with a generated code snippet.
3. Selecting your tracking plan and viewing event-specific code snippets.
4. Testing your implementation with Snowplow Micro.
5. Deploying to production.

:::note
Test your tracking implementation with Snowplow Micro before deploying to production. This helps you verify that events are structured correctly and match your tracking plan.
:::

## Deploy a data model

The Analytics section builds on your tracking implementation. Once data is flowing into your pipeline, you can deploy a data model to transform raw event data into structured tables for analysis.

The dashboard guides you to choose between:

- [Out-of-the-box data models](/docs/modeling-your-data/running-data-models-via-console/index.md) that cover common use cases like web and mobile analytics.
- [Automatically generated data models](/docs/modeling-your-data/automatically-generated-data-models/index.md) that are tailored to your specific tracking plan.

## Configure Signals for real-time use cases

The Real-time use cases section enables you to act on behavioral data as it arrives. [Signals](/docs/signals/get-started/index.md) processes your event stream to compute user attributes in real time and trigger automated actions.

:::note
Signals is a paid add-on. Contact your account team to enable it.
:::

### Design Signals attributes

With tracking implemented, you can define [Signals attributes](/docs/signals/attributes/index.md) that compute real-time properties about your users (for example, session count, cart value, or engagement score).

The guided flow walks you through:

1. Choosing a template or creating a custom attribute.
2. Creating or editing an attribute group.
3. Testing and simulating your attributes against real data.

### Retrieve Signals attributes

Once you have defined attributes, you need a way to retrieve them in your application. The dashboard guides you through creating a [service](/docs/signals/attributes/services/index.md) and following the [retrieval steps](/docs/signals/connection/index.md) to access attribute values from your front end or back end.

### Trigger interventions

With Signals attributes in place, you can create [interventions](/docs/signals/interventions/index.md) that automatically respond to user behavior. For example, you can display a promotion when a user's cart value exceeds a threshold, or suppress a campaign for users who have already converted.

The dashboard guides you through creating and testing an intervention.
