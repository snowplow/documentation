---
title: "Event Studio"
date: "2020-02-15"
sidebar_position: 3
sidebar_label: "Event Studio"
description: "Design and implement behavioral data tracking with schema management, governance, code generation, and tracking plans in Snowplow Console."
keywords: ["tracking plan studio", "tracking design", "schema management", "event specifications", "data governance"]
sidebar_custom_props:
  header: " "
---

Event Studio is a comprehensive set of tools for designing and implementing behavioral data event tracking. It provides:

* **Schema management**: define and version data structures for events and entities
* **Ownership and governance**: assign ownership and establish data contracts
* **Observability**: monitor data quality and tracking implementation
* **Code generation**: automatically generate tracking code from your designs, using [Snowtype](/docs/event-studio/snowtype/index.md)
* **Tracking plans**: document and manage your tracking implementation

The Event Studio UI is included in [Snowplow Console](https://console.snowplowanalytics.com).

These tools help organizations move from ad-hoc tracking implementations to a structured, governed, collaborative approach.

:::tip
New to tracking design? Start with our [best practice](/docs/fundamentals/tracking-design-best-practice/index.md) guide to learn how to approach designing your tracking implementation.
:::

## Key concepts

To use Event Studio effectively, you should understand these core concepts:

* **[Events](/docs/fundamentals/events/index.md)**: actions that occur in your systems
* **[Entities](/docs/fundamentals/entities/index.md)**: the objects and context associated with events
* **[Event specifications](/docs/event-studio/event-specifications/index.md)**: documentation of business events you're tracking
* **[Tracking plans](/docs/event-studio/tracking-plans/index.md)**: logical groupings of related business events with defined ownership

Each tracking plan is associated with one or more [source applications](/docs/event-studio/source-applications/index.md). The events and entities are defined by their [data structures](/docs/event-studio/data-structures/index.md).

This diagram illustrates how these concepts relate to each other within Event Studio:

![Tracking plan overview showing the relationship between tracking plans, event specifications, data structures](images/tracking-plan-overview.png)

This example `Ecommerce Checkout Flow` tracking plan groups two event specifications for ecommerce checkout behavior:
* `Checkout Started` describes a `checkout_started` event, with an associated `cart` entity
* `Product Add To Cart` describes an `add_to_cart` event, with `cart` and `product` entities

The individual event and entity data structures can also be used in other event specifications and tracking plans.
