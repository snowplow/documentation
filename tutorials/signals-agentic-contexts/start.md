---
position: 1
title: "Give an AI agent real-time session context with Signals"
sidebar_label: "Introduction"
description: "Learn what a Signals agentic context is, and how it differs from attributes, before building one to ground an AI agent in a user's live session activity."
keywords: ["agentic context", "signals", "ai agent context", "llm context", "session activity"]
date: "2026-07-29"
---

An [agentic context](/docs/signals/agentic-contexts/) is a live, rolling record of what a user has just been doing, which you hand to an agent so it can answer in light of the current session. You choose which events to capture and which of their properties to keep, attach a written prompt for the agent, and read the result back as JSON or as a plain-language narrative.

This is a different shape of data from [Signals attributes](/docs/signals/attributes/). Attributes are values Signals computes for you, such as a count of product views or a running cart total. An agentic context hands over the recent activity itself, event by event, and lets the model do the interpreting.

## What you'll build

You'll define an agentic context that captures page views for the current session, publish it, and retrieve it for a real session. Then you'll paste the narrative into any chat LLM, ask a question about the user, and refine the answer by editing the prompt.

There's no agent framework here and nothing to scaffold. Everything you learn transfers to whichever framework you build in later.

## Prerequisites

This tutorial assumes that you have:

* a Snowplow pipeline with a [Collector endpoint](/docs/sources/) receiving events, because an agentic context buffers events from your live stream
* [Signals enabled](/docs/signals/setup/) on your Snowplow account
* [page view tracking](/docs/sources/web-trackers/tracking-events/page-views/) on a website you can browse, to generate the session activity you'll read back
* Python 3.9 or later, if you want to follow the SDK steps rather than using Snowplow Console

:::note[A full pipeline is required]
An agentic context buffers real events flowing through your pipeline, so this tutorial can't be completed with [Snowplow Micro](/docs/testing/snowplow-micro/) or in a purely local setup. You need a running Snowplow pipeline with Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::

You'll also need your [Signals connection credentials](/docs/signals/connection/) for the SDK steps: the Signals API URL, an API key, an API key ID, and your organization ID.

This tutorial takes less than 15 minutes.
