---
title: "Introduction"
position: 1
sidebar_label: "Introduction"
description: "Build an end-to-end real-time personalization loop in Python: track events with the Snowplow tracker, then compute and act on attributes with the Signals Python SDK."
keywords: ["snowplow python sdk", "snowplow tracker", "snowplow signals", "real-time personalization", "interventions"]
date: "2026-06-19"
---

In this tutorial you'll build a complete real-time personalization loop in Python, using both of Snowplow's Python SDKs:

* the [Python tracker](/docs/sources/python-tracker/) (`snowplow-tracker`), to send [events](/docs/fundamentals/events/) from your application
* the [Signals Python SDK](/docs/signals/) (`snowplow-signals`), to define attributes, retrieve them in real time, and react to [interventions](/docs/signals/interventions/)

To make this concrete, you'll instrument the backend of an imaginary SaaS project-management app. As users complete tasks, your service tracks their activity. [Signals](/docs/signals/introduction/) then computes a per-user engagement attribute in real time, and fires an intervention the moment a user becomes a "power user" so your app can nudge them, for example to invite a teammate.

By the end you'll have working code that:

* tracks page views, screen views, and a custom `task_completed` event with a custom [entity](/docs/fundamentals/entities/)
* defines an attribute group, a service, and an intervention programmatically
* retrieves a user's live attributes from your application
* subscribes to interventions and acts on them

You'll write and run all of the code in your own Python environment. The definitions you create also appear in [Snowplow Console](https://console.snowplowanalytics.com), so you can inspect them there.

This tutorial should take around 45 minutes to complete.

## Prerequisites

This tutorial assumes that you have:

* a Snowplow pipeline with a [Collector endpoint](/docs/sources/) you can send events to, because Signals computes attributes from your live event stream
* [Signals enabled](/docs/signals/get-started/) on your Snowplow account, since the personalization features depend on it
* Python 3.9 or later, to run the SDKs
* basic familiarity with Python and with [Snowplow events, entities, and schemas](/docs/fundamentals/events/)

You don't need any API keys yet. You'll generate the Signals credentials as one of the steps.

:::note[A full pipeline is required]
The Signals parts of this tutorial compute attributes from real events flowing through your pipeline, so they can't be completed with [Snowplow Micro](/docs/testing/snowplow-micro/) or in a purely local setup. You need a running Snowplow pipeline with Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::
