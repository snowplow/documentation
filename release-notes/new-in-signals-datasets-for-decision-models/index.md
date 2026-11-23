---
title: "New in Signals: datasets for evaluating decision models"
sidebar_label: "Signals datasets for decision models"
description: "Signals datasets can now rebuild the moments your app calls a decision model, the attributes and agentic contexts it would have sent, and what users did next."
keywords: ["signals", "datasets", "decision models", "system one models", "offline evaluation", "agentic context"]
date: "2026-11-23"
category:
  - "Product news"
components:
  - "Signals"
  - "AI tools"
platforms:
  - "Snowflake"
---
Decision models such as TypeSafe's Jev, and LLM prompts that return one of a fixed set of answers, don't need training. That also means there's no training dataset to test them on before they go live. The Signals dataset builder, which already builds training datasets for ML models, can now build that test set from your past traffic.

A dataset row is one moment your application would have called the model. It holds the attributes and agentic contexts your application would have read at that moment, computed only from earlier events, and what the user did afterwards. You ask the model at every moment, then check its answers before you change anything in production.

## What's new

### Event anchors

Create one row for every event that matches criteria, such as a product page view, to match an application that calls a model in response to an event. You can cap the number of rows per session, keeping the earliest.

### Agentic contexts in datasets

Add a column per agentic context, holding the entries the streaming engine would have kept for that session at each moment.

### Outcome columns

Add boolean columns that record whether something happened after each moment, such as a purchase later in the session or an add to cart within ten minutes. Outcomes can follow the session or another attribute key, such as the user.

### Reuse anchors across versions

Reuse the anchors table from one run as user-supplied anchors in the next, so that different versions of your attributes or agentic contexts are compared on the same moments.

## Getting started

These features are in the Signals Python SDK, and managed dataset runs require Snowflake. See [Evaluate decision models on past traffic](/docs/signals/datasets/evaluate-decision-models/) to get started, and [Choose dataset anchors](/docs/signals/datasets/anchors/) for the new anchor types.
