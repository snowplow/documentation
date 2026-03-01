---
title: "Event specification inference"
sidebar_label: "Inference"
sidebar_position: 2
description: "Event specification inference enables the Snowplow pipeline to automatically match incoming events to your published event specifications, surfacing business context and volume metrics without changes to your tracking implementation."
keywords: ["event specification inference", "event matching", "published status", "tracking plans", "data quality", "event validation"]
date: "2026-03-01"
---

Event specification inference allows the Snowplow pipeline to automatically match incoming events against your published [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md). Once a specification is published, the pipeline can attach business context to matching events and surface volume and recency data in the Console — without any changes to your tracking implementation.

## Understand event specification statuses

The previous "Live" status, which was assigned automatically when the Console first observed events matching a tracking plan, has been replaced by an explicit publishing model. Each event specification now has one of three statuses:

- **Draft**: the specification is being edited and is not yet active in the pipeline. Events are not matched against it, and no inference occurs.
- **Publishing**: a transitional state, lasting a few minutes, while the specification is propagated through the pipeline. No action is required during this phase.
- **Published**: the specification is active. The pipeline matches incoming events against it, attaches an `event_specification` entity to it, and surfaces volume data and "last seen" timestamps in the Console.

The tracking plan list view reflects the status of the specifications it contains. A tracking plan shows **Published** if all of its specifications are published, and **With Draft** if any specification remains in draft.

## Publish an event specification

Publishing makes a specification active in the pipeline and enables inference. You can trigger publishing from two places:

- From the tracking plan view: click the **Publish All** button above the list of specifications. This publishes all specifications in the plan that are currently in Draft status.
- From within an individual event specification: click the **Publish** button at the top of the specification page.

### Synchronize data structures during publishing

Before publishing completes, the Console checks whether all [data structures](/docs/fundamentals/schemas/index.md) referenced by the specification — either the event data structure or any entity data structures — have been promoted to production. If any have not, the publishing flow identifies them and requires you to promote them in the same step. This ensures the pipeline can perform inference correctly as soon as the specification reaches Published status.

## How inference works

Once a specification is published, the pipeline begins matching incoming events against it based on the event's data structure and source application. A single incoming event can match one or more specifications if the definitions overlap. Events sent using Snowtype's [automatic tracking features](/docs/event-studio/implement-tracking/snowtype/index.md) already contain an `event_specification` entity so will not be matched against specifications and will bypass inference entirely, but all other events are eligible for matching.

When a match occurs, the pipeline:

- Attaches an [entity](/docs/fundamentals/entities/index.md) to the event containing the specification name and ID, making the business context available for downstream consumers.
- Records the event against the specification in the Console, updating the total volume count and "last seen" timestamp.

This is particularly useful for standard events — such as page views, link clicks, and button clicks — that are emitted by Snowplow trackers by default. These events were previously disconnected from tracking plans as they did not appear in Console volume metrics. Publishing specifications for these events makes them visible within the tracking plan and ensures full visibility of all your tracked events in one place.

:::tip
You do not need to change your tracking implementation to benefit from inference. Events already flowing through your pipeline will be matched against newly published specifications automatically.
:::