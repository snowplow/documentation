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

Each event specification uses an explicit publishing model, replacing the previous "Live" status that the Console assigned automatically when it first observed matching events. Each specification has one of three statuses:

- **Draft**: the specification is being edited and is not yet active in the pipeline. The pipeline does not match events against it, and no inference occurs.
- **Publishing**: a transitional state, lasting a few minutes, while the pipeline propagates the specification. You do not need to take any action during this phase.
- **Published**: the specification is active. The pipeline matches incoming events against it, attaches an `event_specification` entity to it, and surfaces volume data and "last seen" timestamps in the Console.

The tracking plan list view reflects the status of the specifications it contains. A tracking plan shows **Published** if all of its specifications are published, and **With Drafts** if any specification remains in draft.

## Publish an event specification

Publishing makes a specification active in the pipeline and enables inference. You can trigger publishing from two places:

- From the tracking plan view: click the **Publish All** button above the list of specifications. This publishes all specifications in the plan that are currently in Draft status.
- From within an individual event specification: click the **Publish** button at the top of the specification page.

The publishing flow also checks that any [data structures](/docs/fundamentals/schemas/index.md) your specification references are available in the production pipeline before activating it.

### Synchronize data structures during publishing

Before publishing completes, the Console checks whether all [data structures](/docs/fundamentals/schemas/index.md) referenced by the specification — either the event data structure or any entity data structures — have been promoted to production. If any have not, the publishing flow identifies them and requires you to promote them in the same step. This ensures the pipeline can perform inference correctly as soon as the specification reaches Published status.

## Understand how inference works

Once a specification is published, the pipeline evaluates every eligible incoming event against it. Events sent using Snowtype's [automatic tracking features](/docs/event-studio/implement-tracking/snowtype/index.md) already contain an `event_specification` entity, so the pipeline bypasses inference for them entirely. All other events are evaluated using the following criteria, in order:

1. **Event schema**: the event's schema must match the event data structure defined in the specification.
2. **Entity set**: the event must carry all [entities](/docs/fundamentals/entities/index.md) listed in the specification according to the cardinality rules. Extra entities with different schemas on the event are ignored.
3. **Property rules**: any property-level rules defined on those data structures in the specification — for example, `category = "product"` — must be satisfied.

The pipeline does not match on `appId`, environment, or any other source attribute. A single incoming event can match more than one specification if multiple published specifications share overlapping definitions.

When a match occurs, the pipeline:

- Attaches an [entity](/docs/fundamentals/entities/index.md) to the event containing the specification name and ID, making the business context available for downstream consumers.
- Records the event against the specification in the Console, updating the total volume count and "last seen" timestamp.

### Example

Consider a specification named "Product page view" that defines:

- **Event**: `page_view` (`iglu:com.snowplowanalytics.snowplow/page_view/jsonschema/1-0-0`)
- **Entity**: `product` (`iglu:com.acme/product/jsonschema/1-0-0`) with a rule `category = "electronics"`

An incoming `page_view` event carrying a `product` entity where `category = "electronics"` matches the specification. The pipeline attaches an `event_specification` entity to the event and increments the specification's volume count in the Console.

The same `page_view` event carrying a `product` entity where `category = "clothing"` does not match, because the entity rule is not satisfied. A `page_view` event with no `product` entity also does not match, because the required entity is absent.

:::tip[No tracking changes needed]
You do not need to change your tracking implementation to benefit from inference. Events already flowing through your pipeline will be matched against newly published specifications automatically.
:::