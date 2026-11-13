---
title: "Tracking plan and event specification elements"
sidebar_position: 40
sidebar_label: "Tracking plan elements"
date: "2024-01-30"
description: "Reference for the elements of a tracking plan and an event specification in Event Studio, including source applications, data structures, triggers, property instructions, statuses, and versions."
keywords: ["tracking plans", "event specifications", "tracking plan elements", "data ownership", "data contracts"]
content_type: reference
---

A tracking plan is a logical grouping of the data you collect as an organization by domain, with an explicit owner. See [Introduction to tracking plans](/docs/fundamentals/tracking-plans/index.md) for how tracking plans support ownership and governance.

Each tracking plan contains event specifications that define the events you want to track. By grouping related event specifications in tracking plans, you organize your data collection by domain, with clear ownership and implementation instructions for each event specification. Event specifications act as data contracts between teams: they define what data your applications should send, what your data warehouse will receive, and what your downstream consumers can rely on.

## Tracking plan elements

A tracking plan has these elements:

| Element             | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Name                | A descriptive name for the tracking plan. The name must be unique                                                  |
| Description         | A description of the data that the tracking plan captures                                                          |
| Owner               | The individual responsible for the tracking plan                                                                   |
| Domain              | The team or business domain that owns the tracking plan                                                            |
| Source applications | The [source applications](/docs/event-studio/source-applications/index.md) the tracking plan is implemented in      |
| Event specifications | The events that the tracking plan describes. See [Event specification elements](#event-specification-elements)    |

A tracking plan also shows event volume metrics for its event specifications, which help you monitor data collection over time. See [Monitor tracking plan data quality in Console](/docs/event-studio/tracking-plans/data-quality/index.md).

![Snowplow Console showing the "E-commerce Web" tracking plan Overview tab, including the tracking plan name, description, source application (website), ownership details, and a table of event specifications with their data structures, entities, source applications, last seen dates, and event volume counts.](images/example_tracking_plan_view.png)

## Event specification elements

An event specification has these elements:

| Element                | Description                                                                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                   | A descriptive name for the event                                                                                                                                                                                                                             |
| Description            | A description to help people understand what action the event is capturing                                                                                                                                                                                  |
| Source applications    | The source applications inherited from the tracking plan. The event specification inherits their application IDs, which are sent with this event, and references their application entity data structures, which are expected with each event |
| Triggers               | Instructions on where and when the event gets triggered, for example when a user clicks the "Add to basket" button                                                                                                                                           |
| Event data structure   | One version of the event [data structure](/docs/event-studio/data-structures/index.md) that this event validates against as your pipeline processes it. It can be a standard data structure, provided by the Snowplow tracker by default, or a custom one, provided by your organization |
| Entity data structures | The versions of the [entity](/docs/fundamentals/entities/index.md) data structures to attach to this event, for example user or product, and how many of each entity to expect                                                                                |
| Properties             | Instructions for how each property of the event and entity data structures should be populated, as exact values or as a description                                                                                                                         |

![Snowplow Console showing the "Add to cart" event specification detail page, including event description, source application (website), application IDs with status indicators, the snowplow_ecommerce_action 1-0-2 data structure with a required "type" property set to the exact value "add_to_cart", and entity data structures for product and cart.](images/example_event_specification.png)

## Event specification statuses and versions

Each event specification has one of three statuses: **Draft**, while you edit it and before it's active in the pipeline (development environments still [match events against drafts](/docs/event-studio/tracking-plans/event-specification-inference/index.md)); **Publishing**, a transitional state lasting a few minutes while the pipeline propagates it; and **Published**, once it's active in the pipeline. Event specifications also have versions, which the **History** tab of each specification lists, with the changes between any two versions. See [Test, promote, and publish a tracking design](/docs/event-studio/test-and-publish/index.md) and [Evolve a tracking design](/docs/event-studio/evolve-tracking-design/index.md).

To create a tracking plan, see [Create a tracking plan](/docs/event-studio/tracking-plans/create-and-manage/index.md) or [Tracking plan templates](/docs/event-studio/tracking-plans/templates/index.md). To add event specifications to it, see [Define an event specification](/docs/event-studio/tracking-plans/event-specifications/index.md).
