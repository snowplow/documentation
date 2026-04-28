---
title: "Event specification validation"
sidebar_label: "Validation"
sidebar_position: 3
description: "Event specification validation checks events that arrive with a specification entity attached against the rules defined in your published specifications. When an event fails validation, the pipeline attaches an entity describing the failure."
keywords: ["event specification validation", "event validation", "validation entity", "tracking plans", "data quality", "entity cardinality", "property instructions"]
date: "2026-04-27"
---

Event specification validation checks whether incoming events conform to the rules defined in the [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) you have published. The pipeline runs validation on events that arrive with an `event_specification` entity already attached, typically from a tracker using [Snowtype](/docs/event-studio/implement-tracking/index.md). For events that arrive without one, the pipeline runs [event specification inference](/docs/event-studio/tracking-plans/event-specification-inference/index.md) instead. Each event takes one path or the other; the two paths are mutually exclusive per event.

When an event fails validation, the pipeline attaches an [entity](/docs/fundamentals/entities/index.md) to it describing the failure. The pipeline still enriches and delivers events that fail validation alongside successful ones; only the validation entity reflects the failure. You do not need to change your tracking implementation; validation runs against newly published specifications immediately.

## Understand the validation entity

The pipeline attaches an `event_specification_validation` entity to events that fail validation. The schema is published in [Iglu Central](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/event_specification_validation/jsonschema/1-0-0).

The entity has two fields:

- `isValid`: a boolean. The pipeline only attaches the entity on failure, so this value is always `false`. The schema permits `true`, but the pipeline does not emit it.
- `errors`: an array of finding objects. Each finding includes a human-readable `message`, the Iglu `schema` URI of the entity or event that caused the error (when applicable), and the JSON `path` to the property that failed validation (when applicable).

Events that pass validation receive no entity. Use the entity's presence in your warehouse to identify events that failed validation.

## Know when the entity appears

Validation runs only when an event arrives with an `event_specification` entity that includes a version, typically attached by a tracker using [Snowtype](/docs/event-studio/implement-tracking/index.md). When the event specification or tracking plan is published, the pipeline routes events without an attached specification to [event specification inference](/docs/event-studio/tracking-plans/event-specification-inference/index.md) instead. Inference never produces a validation entity, even when an event would have failed validation.

In your warehouse, three cases are possible:

- **Failed validation**: the event has both an `event_specification` entity and an `event_specification_validation` entity. Inspect the validation entity for the specific findings.
- **Passed validation, or matched by inference**: the event has an `event_specification` entity but no `event_specification_validation` entity. Either the event was Snowtype-tracked and passed validation, or the pipeline matched it to a specification by inference.
- **Not associated with a specification**: the event has neither entity. No specification was attached at tracking time and the pipeline did not match the event to a published specification.

:::note[Inference does not surface failures]
The inference path filters specification candidates by their rules internally, but it never attaches a validation entity. If an event would have failed validation under a given specification, inference does not match it to that specification: the absence of an `event_specification` entity covers both "no specification applies" and "an applicable specification existed but the event did not satisfy its rules". To get explicit per-event validation results, instrument your tracking with Snowtype.
:::

## Understand what the pipeline validates

The pipeline evaluates each event against three categories of rule defined in its specification, in addition to the [schema validation](/docs/fundamentals/schemas/index.md) that always runs as part of enrichment:

1. **Event property instructions**: property-level instructions defined on the event data structure, such as expected values or ranges
2. **Entity cardinality**: how many of each entity listed in the specification must be present on the event. Cardinality is checked per entity schema.
3. **Entity property instructions**: property-level instructions defined on each entity data structure listed in the specification

If the event payload itself fails its schema validation, the pipeline does not evaluate event property instructions because the payload is no longer available to the validation step. Entity cardinality and entity property instructions still run, and the pipeline attaches a validation entity only if one of those entity checks fails.

### Example

Consider a published specification "Add to cart" that defines:

- Event: `add_to_cart` (`iglu:com.acme/add_to_cart/jsonschema/1-0-0`) with rule `currency = "USD"`
- Required entity: `product` (`iglu:com.acme/product/jsonschema/1-0-0`) with cardinality of one

The `add_to_cart` data structure schema permits `currency` to be either `"USD"` or `"EUR"`. The specification narrows it to `"USD"`, so the event property instruction catches values that the data structure schema would otherwise accept.

An `add_to_cart` event arrives with an `event_specification` entity attached referring to this specification, an event payload where `currency = "USD"`, and a single `product` entity. The event passes all checks; no validation entity is attached.

An `add_to_cart` event arrives with an event payload where `currency = "EUR"`. The data structure schema accepts the value, but the specification's event property instruction does not. The pipeline attaches a validation entity with `isValid: false` and an error identifying the event schema and the violated instruction.

An `add_to_cart` event arrives with an event payload where `currency = "USD"` and two `product` entities. The event fails the entity cardinality check. The pipeline attaches a validation entity with `isValid: false` and an error identifying the `product` entity schema and the violated cardinality rule.

:::note[Validation failures do not drop events]
The pipeline still delivers events that fail validation as enriched events. The pipeline records the failure on the validation entity but does not route the event to [failed events](/docs/fundamentals/failed-events/index.md).
:::

## Validate against a new specification version

A Snowtype-tracked event declares a specific `(id, version)` pair on its `event_specification` entity, and the pipeline validates each event against the version it declares. When you publish a new version of a specification, events from existing tracker code continue to declare the previous version and validate against its instructions. The new version applies once you regenerate your tracker code with [Snowtype](/docs/event-studio/implement-tracking/index.md) and deploy the updated tracker code, after which new events declare and validate against the new version.

Different versions of a specification can coexist. Each event validates against the version it declares, whether the variation comes from a rolling update, from different applications using different versions, or from different deployment stages.
