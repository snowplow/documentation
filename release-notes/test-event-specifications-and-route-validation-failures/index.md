---
title: "Test event specifications before publishing, and choose where validation failures go"
description: "Development environments validate events against draft event specifications, and each tracking plan decides whether events that fail validation reach your warehouse or your failed events."
date: "2026-09-17"
category:
  - "Product news"
components:
  - "Event Studio"
  - "Testing"
---

Two additions to [event specification validation](/docs/event-studio/tracking-plans/event-specification-validation/): you can check a specification against real events before you publish it, and you can decide where events that fail validation end up.

## Test a specification before publishing it

A [development environment](/docs/testing/snowplow-micro/console/) validates incoming events the same way a pipeline does, and it also loads the draft of each specification. Edit a specification in the Console, send a test event, and inspect the result in the [Micro dashboard](/docs/testing/snowplow-micro/ui/). Events that fail validation carry an `event_specification_validation` entity describing each error, and the environment picks up your edits within a few minutes.

Inference works there too, so the environment matches events that arrive without an `event_specification` entity against the draft.

## Send events that fail validation to failed events

Each tracking plan has a **Data quality rules** setting. By default the pipeline delivers events that fail validation alongside the rest, marked with a validation entity. Select **Send to failed events as validation error** to route them to [failed events](/docs/fundamentals/failed-events/) instead, which keeps events that don't conform to their specifications out of your warehouse `events` table.

The setting covers every event specification in the tracking plan and all their versions, and takes effect without publishing a new version or redeploying tracking code.
