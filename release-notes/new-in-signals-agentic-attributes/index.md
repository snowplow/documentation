---
title: "New in Signals: agentic attributes"
description: "Have an LLM decide a value for each session from the user's recent activity, and read the value and the model's reasoning from your application."
sidebar_label: "Signals agentic attributes"
keywords: ["agentic attributes", "llm", "session intent", "ai classification", "Signals"]
date: "2026-11-25"
category:
  - "Product news"
components:
  - "Signals"
---
Some questions about a session are hard to answer with a threshold rule. Whether a visitor is hesitating, comparing options, or about to give up depends on the order and mix of what they did, not on any single count.

Agentic attributes let an LLM answer that kind of question for each session. You write a goal, such as "decide whether the user is progressing, stuck, or exploring", and list the values the model can choose from. When the session meets your trigger criteria, Signals sends the model the session's recent events from your agentic contexts, along with its stream attribute values. Signals stores the model's answer and its justification, for example "stuck: ran the same search five times with small changes and opened no results".

Agentic attributes are in public preview, so their configuration, API, and behavior may change before they're generally available.

## What you can configure

An agentic attribute returns one of three output types: a value from a list you define, `true` or `false`, or a number. Triggers use the same criteria syntax as interventions, and Signals evaluates the attribute again each time an event updates the session's attributes while the criteria hold, so the value follows the session as it develops.

Each evaluation is an LLM call, so an evaluation policy caps the cost. You set the minimum time between evaluations for a session, and the maximum number of values written per session.

## Example use cases

Offer help to a user the model classifies as stuck, instead of waiting for them to leave. Show comparison content to a user who's weighing several options. Use the justification to explain to your support team why a session was flagged.

## How to use agentic attributes

Define and publish agentic attributes with the Signals API, and read the latest value for a session from your application's server. Each agentic attribute needs at least one published [agentic context](/docs/signals/agentic-contexts/) to select the events the model reviews.

See [Define agentic attributes](/docs/signals/agentic-attributes/) to create one, and [Retrieve agentic attributes](/docs/signals/applications/agentic-attributes/) to use the value in your application.
