---
title: "New in Signals: calculated properties"
description: "Combine several properties from the same event into one derived value, with operations such as concat, sum, and coalesce, without retracking."
date: "2026-10-07"
category:
  - "Product news"
components:
  - "Signals"
---
Some of the things you want to aggregate aren't properties on the event. Total order value is the price plus the tax and the shipping. A product's real price is whichever of the list price and the sale price applies. What makes a page view distinct is the category and the subcategory together, not either one alone.

Until now that meant changing your tracking: adding a field to a schema, computing the value in the tracker, and waiting for the new data to accumulate before any attribute built on it was useful. Attributes could only aggregate a property that already existed on the event.

A calculated property removes that step. It's a derived value built by combining other properties from the same event, defined as part of the attribute rather than in your tracking.

## Key benefits

**No retracking.** The combination is part of the attribute definition, so you can add or change one without touching your schemas or your tracker. With a [backfill](/docs/signals/attributes/attribute-groups/#backfill-attributes) configured, Signals also calculates it over the events you've already collected.

**Six operations.** `concat` joins values as strings with an optional separator. `sum`, `product`, `min`, and `max` work over numeric properties. `coalesce` returns the first non-null property, for fallback chains.

**Mix property sources.** The properties you combine can be atomic, event, and entity properties in any combination, each keeping its own [date part](/docs/signals/attributes/attributes/#apply-a-date-part).

**Aggregations and criteria.** Use a calculated property as the value an attribute aggregates, or as the thing a [criteria filter](/docs/signals/attributes/attributes/#filter-with-criteria) matches on.

## Example use cases

**Revenue including tax.** Order events often carry subtotal, tax, and shipping separately. `sum` adds them per event, and a `sum` aggregation totals that across a user's orders into a lifetime value attribute.

**Effective price.** Where a product carries both a list price and an optional sale price, `coalesce` returns whichever applies, so a single attribute tracks what users actually pay.

**Composite identifiers.** `concat` builds one value from several, such as an experiment and variant identifier, or a category and subcategory pair, giving `unique_list` and `most_frequent` something meaningful to count.

## Getting started

Calculated properties are available in Console and in the Python SDK, for both stream and batch attribute groups. Upgrade to `snowplow-signals` version 0.4.9 or later to use them from the SDK.

In Console, select two or more properties in the attribute's property picker and a **Calculated property** panel appears, where you order the properties and choose an operation. In the SDK, pass a `CalculatedProperty` as the attribute's `property`.

You can also ask the [Snowplow Assistant](/docs/llms-support/console-agent/) or an agent connected to the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/) to create a calculated property, for example to concatenate `geo_country` and `geo_city` into one attribute.

See [Calculated properties](/docs/signals/attributes/attributes/#calculated-properties) for the full list of operations, their input types, and how each handles nulls.
