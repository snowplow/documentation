---
title: "Data Product Studio"
date: "2020-02-15"
sidebar_position: 3
sidebar_label: "Data Product Studio"
description: "Design and implement behavioral data tracking with schema management, governance, code generation, and tracking plans in Snowplow Console."
keywords: ["data product studio", "tracking design", "schema management", "event specifications", "data governance"]
sidebar_custom_props:
  header: " "
---

Data Product Studio is a comprehensive set of tools for designing and implementing behavioral data event tracking. It provides:

* **Schema management**: define and version data structures for events and entities
* **Ownership and governance**: assign ownership and establish data contracts
* **Observability**: monitor data quality and tracking implementation
* **Code generation**: automatically generate tracking code from your designs
* **Tracking plans**: document and manage your tracking implementation

The Data Product Studio UI is included in Snowplow Console.

## Why Data Product Studio?

Data Product Studio helps organizations move from ad-hoc tracking implementations to a structured, governed approach:

* **Improve data quality**: validate data against schemas at collection time
* **Enable collaboration**: provide a shared workspace for data teams, developers, and analysts
* **Accelerate implementation**: generate tracking code automatically from your designs
* **Ensure governance**: establish and enforce data contracts across your organization
* **Maintain documentation**: keep tracking plans and implementation status in one place

## Key concepts

To use Data Product Studio effectively, you should understand these core concepts:

* **[Events](/docs/fundamentals/events/index.md)**: actions that occur in your systems
* **[Entities](/docs/fundamentals/entities/index.md)**: the objects and context associated with events
* **[Event Specifications](/docs/data-product-studio/event-specifications/index.md)**: documentation of business events you're tracking
* **[Data Products](/docs/data-product-studio/data-products/index.md)**: logical groupings of related business events with defined ownership

The diagram below illustrates how these concepts relate to each other within Data Product Studio:

![Tracking plan overview showing the relationship between data products, event specifications, data structures](images/tracking-plan-overview.png)

:::tip
New to tracking design? Start with our [Tracking Design Best Practices](/docs/fundamentals/tracking-design-best-practice/index.md) guide to learn how to approach designing your tracking implementation.
:::