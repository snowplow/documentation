---
title: "Introduction to Snowplow events"
sidebar_label: "Events"
sidebar_position: 1
description: "An event is a central concept in Snowplow that represents something that occurred at a particular point in time"
---

Events are the primary way to capture data with Snowplow. Every time something happens that you want to track, you can send an event to your Snowplow pipeline. Each event is a JSON object that describes what happened. Events flow through your pipeline where they're validated, enriched, and loaded into your data warehouse or lake for analysis.

## Snowplow event types

All Snowplow events have the same underlying structure and [standard fields](/docs/fundamentals/canonical-event/index.md). However, there are two types of events in Snowplow:
* Schema-less **baked-in** events
  * The baked-in event types are page views, page pings, and structured events
* **Self-describing** events that are based on a [JSON schema](/docs/fundamentals/schemas/index.md)
  * All other events are self-describing events
  * This includes out-of-the-box events that come with Snowplow, and custom events that you define yourself

<img src={require('@site/docs/fundamentals/images/Snowplow-event-types.png').default} alt="Diagram showing the different types of Snowplow event" style={{maxWidth: '600px', width: '100%', paddingBottom: '1.5rem'}} />

Whether an event is baked-in or self-describing affects how you'll model the data.

All Snowplow events are by default tracked with schema-defined [entities](/docs/fundamentals/entities/index.md) attached to them.

### Baked-in events

The following events are "baked in":
* [Page views](/docs/events/ootb-data/page-and-screen-view-events/index.md)
* [Page pings](/docs/events/ootb-data/page-activity-tracking/index.md)
* [Structured events](/docs/events/custom-events/index.md#structured-events)

In the data warehouse, any event-specific information will be in standard columns in the Snowplow `events` table. You can find those listed [here](/docs/fundamentals/canonical-event/index.md#event-specific-fields).

Find out more about how to track and model page view and page ping events [here](/docs/events/ootb-data/page-activity-tracking/index.md).

:::tip Legacy structured events
We recommend using self-describing events instead of structured events whenever possible. Structured event tracking is a legacy format used to track events that were not natively supported by Snowplow.
:::

:::info Legacy transaction events
The legacy `transaction` and `transaction_item` events are also "baked-in". Several Snowplow trackers provide [ecommerce tracking](/docs/events/ootb-data/ecommerce-events/index.md) APIs; we recommend using these instead, as they support current Snowplow best practise, and are compatible with the [Snowplow ecommerce dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md).
:::

### Self-describing events

Self-describing events can include arbitrarily complex data, as defined by the event's [data structure](/docs/fundamentals/schemas/index.md) or schema. We call them "self-describing" because these events include a reference to their underlying [JSON Schema](/docs/api-reference/json-schema-reference/index.md) data structure.

Each self-describing event consists of two parts:
- `schema`: a reference to a [schema](/docs/fundamentals/schemas/index.md) that describes the name, version and structure of the event
- `data`: the event data as a set of key-value properties in JSON format

Because the event references a specific version of its schema, it's always clear to downstream users and applications what each field in the event means, even if your definition of the event changes over time.

Snowplow provides a large number of self-describing events out-of-the-box, for example:
* [Link clicks](/docs/events/ootb-data/links-and-referrers/index.md#link-click-tracking-on-web)
* [Form submissions](/docs/sources/web-trackers/tracking-events/form-tracking/index.md)
* [Ecommerce transactions](/docs/events/ootb-data/ecommerce-events/index.md)

Check out the full range of included events [here](/docs/events/ootb-data/index.md).

You can also create [custom self-describing events](/docs/events/custom-events/index.md) to match your business requirements. Snowplow provides [tooling](/docs/data-product-studio/index.md) to help you define and track custom events.

Find out in the [warehouse tables fundamentals](/docs/fundamentals/warehouse-tables/index.md) page about how self-describing events are structured in the data warehouse.

:::info Terminology
We originally called self-describing events "unstructured events", to distinguish them from structured events. This was misleading, because these events are actually more structured than structured events. The old term is deprecated, but you might still see it in some docs, APIs and database column names, such as `unstruct_event` or `ue`.
:::

## How to track events

Track events in your applications using one of the [Snowplow tracking SDKs](/docs/sources/index.md). Each SDK provides built-in APIs to track [different types of events](/docs/events/ootb-data/index.md).

All the trackers also support custom tracking, so you can define the events that are relevant to your business.

You can also use [webhooks](/docs/sources/webhooks/index.md) to track automated actions. The Snowplow [Collector endpoint](/docs/pipeline/collector/index.md) accepts all [valid](/docs/fundamentals/canonical-event/index.md) Snowplow event payloads, regardless of their source.
