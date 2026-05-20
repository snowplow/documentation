---
title: "Event specification validation"
sidebar_label: "Validation"
sidebar_position: 3
description: "Event specification validation checks events that arrive with a specification entity attached against the rules defined in your published specifications. When an event fails validation, the pipeline attaches an entity describing the failure."
keywords: ["event specification validation", "event validation", "validation entity", "tracking plans", "data quality", "entity cardinality", "property instructions"]
date: "2026-04-27"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Event specification validation checks whether incoming events conform to the rules defined in the [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md) you have published.

The pipeline runs validation on events that arrive with an `event_specification` entity already attached, typically from a tracker using [Snowtype](/docs/event-studio/implement-tracking/index.md) version 0.17.0 or later (see [Validate against a new specification version](#validate-against-a-new-specification-version) for the upgrade steps). For events that arrive without one, the pipeline runs [event specification inference](/docs/event-studio/tracking-plans/event-specification-inference/index.md) instead. Each event takes one path or the other; the two paths are mutually exclusive per event. Inference never produces a validation entity, even when an event would have failed validation.

When an event fails validation, the pipeline attaches an [entity](/docs/fundamentals/entities/index.md) to it describing the failure. The pipeline still enriches and delivers events that fail validation alongside successful ones; only the validation entity reflects the failure. You don't need to change your tracking implementation, as validation runs against newly published specifications immediately.

:::note[Validation failures don't drop events]
The pipeline still delivers events that fail validation as enriched events. The pipeline records the failure in the validation entity, but does not route the event to [failed events](/docs/fundamentals/failed-events/index.md).
:::

In your warehouse, three cases are possible:
- **Failed validation**: the event has both an `event_specification` entity and an `event_specification_validation` entity. Inspect the validation entity for the specific findings.
- **Passed validation, or matched by inference**: the event has an `event_specification` entity but no `event_specification_validation` entity. Either the event was Snowtype-tracked and passed validation, or the pipeline matched it to a specification by inference.
- **Not associated with a specification**: the event has neither entity. No specification was attached at tracking time, and the pipeline did not match the event to a published specification.

## Validation entity

The pipeline attaches an `event_specification_validation` entity to events that fail validation.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    isValid: false,
    errors: [
      {
        message: "Property 'currency' does not match the allowed values.",
        schema: "iglu:com.acme/add_to_cart/jsonschema/1-0-0",
        path: "$.currency"
      }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "event_specification_validation", "format": "jsonschema", "version": "1-0-0" }, "description": "Validation result for an event against its declared event specification version.", "type": "object", "properties": { "isValid": { "type": "boolean", "description": "Whether the event passed validation against its event specification." }, "errors": { "type": "array", "items": { "type": "object", "properties": { "message": { "type": "string", "description": "Human-readable error description." }, "schema": { "type": ["string", "null"], "description": "Iglu schema URI of the entity or event that caused the error." }, "path": { "type": ["string", "null"], "description": "JSON path to the property that failed validation." } }, "required": ["message"] }, "description": "A list of validation errors." } }, "required": ["isValid"] }} />

The pipeline only attaches the entity on failure, so `isValid` is always `false`.

Each finding in the `errors` array includes a human-readable `message`, the Iglu `schema` URI of the entity or event that caused the error (when applicable), and the JSON `path` to the property that failed validation (when applicable).

Events that pass validation receive no entity. Use the entity's presence in your warehouse to identify events that failed validation.

## Understand what the pipeline validates

The pipeline evaluates each event against three categories of rule defined in its specification, in addition to the [schema validation](/docs/fundamentals/schemas/index.md) that always runs as part of enrichment:

1. **Event property instructions**: property-level instructions defined on the event data structure, such as expected values or ranges
2. **Entity cardinality**: how many of each entity listed in the specification must be present on the event. Cardinality is checked per entity schema.
3. **Entity property instructions**: property-level instructions defined on each entity data structure listed in the specification

If the event payload itself fails its schema validation, the pipeline doesn't evaluate event property instructions because the payload is no longer available to the validation step. Entity cardinality and entity property instructions still run, and the pipeline attaches a validation entity only if one of those entity checks fails.

### Examples

Consider a published specification "Add to cart" that defines:

- Event: `add_to_cart` (`iglu:com.acme/add_to_cart/jsonschema/1-0-0`) with rule `currency = "USD"`
- Required entity: `product` (`iglu:com.acme/product/jsonschema/1-0-0`) with cardinality of exactly one

The `add_to_cart` data structure's schema permits `currency` to be either `"USD"` or `"EUR"`. The specification narrows it to `"USD"`, so the event property instruction catches values that the underlying schema would otherwise accept.

#### Example 1
An `add_to_cart` event arrives with:
- An `event_specification` entity attached referring to this specification
- An event payload where `currency = "USD"`
- A single `product` entity

The event passes all checks: no validation entity is attached.

#### Example 2
An `add_to_cart` event arrives with an event payload where `currency = "EUR"`.

The data structure's schema accepts the value, but the specification's event property instruction does not. The pipeline attaches a validation entity with `isValid: false`, and an error identifying the event schema and the violated instruction.

#### Example 3
An `add_to_cart` event arrives with:
- An event payload where `currency = "USD"`
- Two `product` entities

The event fails the entity cardinality check. The pipeline attaches a validation entity with `isValid: false`, and an error identifying the `product` entity schema and the violated cardinality rule.

## Validate against a new specification version

A Snowtype-tracked event declares a specific `(id, version)` pair in its `event_specification` entity, and the pipeline validates each event against that event specification version. Snowtype attaches the `version` field starting in version 0.17.0; events tracked with earlier Snowtype versions don't produce a validation entity.

:::info[Enable validation for an existing tracking implementation]
1. Update the Snowtype dependency in your package manager or CI configuration to 0.17.0 or later
2. Regenerate the tracker code with `snowtype generate`, either manually or as part of your build pipeline
3. [Publish](/docs/event-studio/tracking-plans/event-specifications/index.md) the relevant event specifications; validation doesn't run against drafts
4. Deploy the regenerated tracker code
:::

When you publish a new version of a specification, events from existing tracker code continue to declare the previous version, validating against its instructions. The new version applies once you regenerate your tracker code with [Snowtype](/docs/event-studio/implement-tracking/index.md) and deploy the updated tracker code, after which new events declare and validate against the new version.

Different versions of a specification can coexist. Each event validates against the version it declares, whether the variation comes from a rolling update, from different applications using different versions, or from different deployment stages.
