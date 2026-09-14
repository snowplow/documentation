---
title: "Calculated properties for Signals attributes"
sidebar_label: "Calculated properties"
description: "Combine multiple event, entity, or atomic properties into a single derived value for a Signals attribute."
keywords: ["signals", "calculated properties", "attributes", "derived attributes", "concat", "coalesce", "feature engineering"]
date: "2026-09-15"
category:
  - "Release notes"
components:
  - "Signals"
---

Some of the things you want to aggregate aren't properties on the event. Total order value is the price plus the tax and the shipping. A product's real price is whichever of the list price and the sale price applies. The thing that makes a page view distinct is the category and the subcategory together, not either one alone.

Signals attributes can now use a calculated property: a derived value built by combining other properties from the same event with an operation such as `concat`, `sum`, `product`, `min`, `max`, or `coalesce`. The properties you combine can mix atomic, event, and entity properties, and calculated properties work in both aggregations and criteria.

Defining the combination as part of the attribute avoids tracking workarounds, and you can change it without retracking.

Define calculated properties in Console, or with the `CalculatedProperty` class in the Python SDK.

See [Calculated properties](/docs/signals/attributes/attributes/#calculated-properties) for the full list of operations and their null-value behavior.
