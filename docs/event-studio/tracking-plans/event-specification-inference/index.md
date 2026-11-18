---
title: "How event specification inference matches events"
sidebar_label: "How inference matches events"
sidebar_position: 5
description: "Event specification inference enables the Snowplow pipeline to automatically match incoming events to your published event specifications, surfacing business context and volume metrics without changes to your tracking implementation."
keywords: ["event specification inference", "event matching", "published status", "tracking plans", "data quality", "event validation", "property instructions"]
date: "2026-03-01"
content_type: concept
---

Event specification inference allows the Snowplow pipeline to automatically match incoming events against your published [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md). Once a specification is published, the pipeline can attach business context to matching events and surface volume and recency data in Console, without any changes to your tracking implementation.

Inference uses only [published specifications](/docs/event-studio/test-and-publish/index.md#publish-event-specifications). Draft specifications aren't active in the pipeline, so no inference occurs for them there. [Development environments](/docs/testing/snowplow-micro/console/index.md#validate-event-specifications) also match events against drafts, so you can test a specification before publishing it.

## Understand how inference works

Once a specification is published, the pipeline evaluates every eligible incoming event against it. Events sent using Snowtype's [automatic tracking features](/docs/event-studio/implement-tracking/index.md) already contain an `event_specification` entity, so the pipeline bypasses inference for them entirely. All other events are evaluated using the following criteria, in order:

1. **Event schema**: the event's schema must match the event data structure defined in the specification.
2. **Entity set**: the event must carry all [entities](/docs/fundamentals/entities/index.md) listed in the specification, within the cardinality defined for each one. Extra entities with different schemas on the event are ignored.
3. **Property instructions**: any property-level instructions defined on those data structures in the specification, for example `category = "product"`, must be satisfied.

The pipeline does not match on `appId`, [source applications](/docs/event-studio/source-applications/index.md), environment, or any other source attribute. A single incoming event can match more than one specification if multiple published specifications share overlapping definitions.

When a match occurs, the pipeline:

- Attaches an [entity](/docs/fundamentals/entities/index.md) to the event containing the specification name and ID, making the business context available for downstream consumers
- Records the event against the specification in Console, updating the total volume count and "last seen" timestamp

### Example

Consider a specification named "Product page view" that defines:

- **Event**: `page_view` (`iglu:com.snowplowanalytics.snowplow/page_view/jsonschema/1-0-0`)
- **Entity**: `product` (`iglu:com.acme/product/jsonschema/1-0-0`) with an instruction `category = "electronics"`

An incoming `page_view` event carrying a `product` entity where `category = "electronics"` matches the specification. The pipeline attaches an `event_specification` entity to the event and increments the specification's volume count in Console.

The same `page_view` event carrying a `product` entity where `category = "clothing"` does not match, because the entity property instruction is not satisfied. A `page_view` event with no `product` entity also does not match, because the required entity is absent.

Inference is the path the pipeline takes for events that do not arrive with an `event_specification` entity already attached. For events that do, the pipeline runs [event specification validation](/docs/event-studio/tracking-plans/event-specification-validation/index.md) against that specification instead, which produces explicit per-event findings when an event fails to conform to its instructions.

To test inference without affecting production, send test events to a [development environment](/docs/testing/snowplow-micro/console/index.md#validate-event-specifications), which also matches events against draft specifications.

:::tip[No tracking changes needed]
You do not need to change your tracking implementation to benefit from inference. Events already flowing through your pipeline will be matched against newly published specifications automatically.
:::

## Why an event doesn't match a specification

If Console shows no volume for a specification you expect events for, check each of the conditions that inference requires. An event matches a specification by inference only when all of the following are true:

- The specification is published. Production pipelines don't match events against draft specifications.
- The event doesn't already carry an `event_specification` entity. Events that do go through [validation](/docs/event-studio/tracking-plans/event-specification-validation/index.md) instead.
- The event's schema matches the event data structure defined in the specification.
- The event carries every entity listed in the specification, within the cardinality defined for each one.
- The event satisfies every property instruction defined on those data structures in the specification.

The event's `appId`, source application, and environment don't affect matching, so changing them doesn't make an event match.
