---
position: 1
title: "Give an AI agent real-time session context with Signals"
sidebar_label: "Introduction"
description: "Give a customer-facing agent the user's live session as a plain-language narrative: what a Signals agentic context is, how it differs from attributes, and how to build one."
keywords: ["agentic context", "signals", "ai agent context", "llm context", "session activity", "customer-facing agent"]
date: "2026-08-04"
---

A customer-facing agent — a support bot, a shopping assistant, an in-app copilot — answers blind. It may know your product catalog and your documentation, but not that this user has just read your size guide twice, so it asks for information the session already holds.

An [agentic context](/docs/signals/agentic-contexts/) hands the agent that session as a plain-language narrative it can read directly. It's a live, rolling record of what a user has just been doing: you choose which events to capture and which of their properties to keep, attach a written prompt for the agent, and read the result back as JSON or as narrative.

This is a different shape of data from [Signals attributes](/docs/signals/attributes/). Attributes are values Signals computes for you, such as a count of product views or a running cart total. An agentic context hands over the recent activity itself, event by event, and lets the model do the interpreting.

## What you'll build

You'll define an agentic context that captures page views for the current session, publish it, and retrieve it for a real session. Then you'll paste the narrative into a chat LLM to see what a model makes of it, and append it to a system prompt the way a customer-facing agent does on every turn.

There's no agent framework here and nothing to scaffold. Everything you learn transfers to whichever framework you build in later.

## Prerequisites

This tutorial assumes that you have:

* A Snowplow account and pipeline
* [Signals enabled](/docs/signals/setup/) on your account
* [Page view tracking](/docs/sources/web-trackers/tracking-events/page-views/) on a website you can browse

If you don't have a Snowplow pipeline yet, you can follow along with a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial).

This tutorial takes less than 15 minutes.
