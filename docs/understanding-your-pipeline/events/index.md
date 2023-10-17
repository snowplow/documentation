---
title: "Understanding events"
sidebar_label: "Events"
sidebar_position: 1
description: "An event is a central concept in Snowplow that represents something that occurred at a particular point in time"
---

An event is something that occurred at a particular point in time. Examples of events include:

- Load a web page
- Add an item to basket
- Enter a destination
- Check a balance
- Search for an item
- Share a video

## Kinds of events

At the high level, there are 3 kinds of Snowplow events:
* [Standard events](#baked-in-events) that are very common and therefore “baked in”, for example, page views
* [Structured events](#structured-events), which you can supplement with some (limited) custom information
* [Self-describing events](#self-describing-events), which can include arbitrarily complex data, described by a [schema](/docs/understanding-your-pipeline/schemas/index.md)

You can create all of these by using various [tracking SDKs](/docs/collecting-data/collecting-from-own-applications/index.md).

In the data warehouse, all 3 kinds of events share a number of standard columns, such as timestamps. That said, event-specific data will be stored differently, as explained below. See also [what Snowplow data looks like](/docs/understanding-your-pipeline/canonical-event/index.md).

## Out-of-the-box and custom events

Snowplow supports a large number of events out of the box, for example:
* Page views and screen views
* Page pings
* Link clicks
* Form fill-ins (for the web)
* Form submissions
* Transactions

Some of these are [baked-in events](#baked-in-events), while others are [self-describing events](#self-describing-events) that were predefined by the Snowplow team, e.g. link clicks. Tracking SDKs usually provide dedicated API to create out-of-the-box events (regardless of their kind).

You can also create custom events to match your business requirements. For that purpose, you can either define your own [self-describing events](#self-describing-events) (recommended), or use [structured events](#structured-events).

| Out-of-the-box events | Custom events |
|:-:|:-:|
| Baked-in events | Structured events |
| Self-describing events <br/> _(predefined by Snowplow)_ | Self-describing events <br/> _(defined by you)_ |

## Baked-in events

The following events are “baked in”. They get special treatment because they are very common:
* Page views (`page_view`)
* Page pings (`page_ping`)
* E-commerce transactions	(`transaction` and `transaction_item`)

:::info Transaction events

The `transaction` and `transaction_item` events are not very convenient to use and exist mostly for legacy reasons. One of their significant downsides is that you have to send a separate event for the transaction itself and then an event for each of the order items in that transaction (as opposed to including all items in a single event).

Over the years, it has become more idiomatic to use [entities](/docs/understanding-your-pipeline/entities/index.md) for order items in e-commerce transactions. For instance, our [E-commerce Accelerator](https://docs.snowplow.io/accelerators/ecommerce/) uses this approach.

:::

<details>
<summary>Tracking and storage format</summary>

Snowplow [tracking SDKs](/docs/collecting-data/collecting-from-own-applications/index.md) provide a dedicated API for these events. For example, if you want to track a page view using the [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/quick-start-guide/index.md):

```javascript
window.snowplow('trackPageView');
```

In the data warehouse, any event-specific information for these events will be in standard columns (in the Snowplow `events` table). You can find those listed [here](/docs/understanding-your-pipeline/canonical-event/index.md#event-specific-fields).

</details>

## Structured events

:::caution

We recommend using [self-describing events](#self-describing-events) instead of structured events whenever possible. While structured events are simpler to create (as you don’t need to define a [schema](/docs/understanding-your-pipeline/schemas/index.md)), they have a number of disadvantages:

| | Structured events | Self-describing events |
|---|---|---|
| Format | :x: Data must fit the 5 fields below | :white_check_mark: JSON, as complex as you want |
| Validation | :x: No validation (beyond field types) | :white_check_mark: Schema includes validation criteria |
| Meaning | :x: Can only infer what each field represents | :white_check_mark: Schema includes field descriptions |

:::

Structured events have 5 fields:

- _Category_: The name for the group of objects you want to track
- _Action_: A string that is used to define the user action for the category of object
- _Label_: An optional string which identifies the specific object being actioned
- _Property_: An optional string describing the object or the action performed on it
- _Value_: An optional numeric data to quantify or further describe the user action

<details>
<summary>Tracking and storage format</summary>

To track a structured event, use one of the [tracking SDKs](/docs/collecting-data/collecting-from-own-applications/index.md). For example, with the [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/quick-start-guide/index.md):

```javascript
snowplow('trackStructEvent', {
  category: 'Product', 
  action: 'View', 
  label: 'ASO01043', 
  property: 'Dress',
  value: 49.95
});
```

In the data warehouse, these events still use the [standard columns](/docs/understanding-your-pipeline/canonical-event/index.md) for general information, like timestamps. In addition, the above fields for all structured events are stored in a set of 5 standard columns. See the [structure of Snowplow data](/docs/understanding-your-pipeline/canonical-event/index.md#structured-events) for more information.

</details>

## Self-describing events

:::info Terminology

In the past, self-describing events used to be called “unstructured events”, to distinguish them from [structured events](#structured-events). However, this was misleading, because in a way, these events are actually _more_ structured than structured events 🤯. The old term is now deprecated, but you might still see it in some docs, APIs and database column names.

:::

Self-describing events can include arbitrarily complex data, as defined by the event’s [schema](/docs/understanding-your-pipeline/schemas/index.md). We call them “self-describing” because these events include a reference to their schema.

:::note

Because the event references its schema (in a particular version!), it’s always clear to the downstream users and applications what each field in the event means, even if your definition of the event changes over time.

:::

Each self-describing event consists of two parts:

- A reference to a [schema](/docs/understanding-your-pipeline/schemas/index.md) that describes the name, version and structure of the event
- A set of key-value properties in JSON format — the data associated with the event

This structure is an example of what we call _self-describing JSON_ — a JSON object with a `schema` and a `data` field.

<details>
<summary>Tracking and storage format</summary>

Some self-describing events were predefined by Snowplow and are natively supported by tracking SDKs. For example, the mobile trackers automatically send [screen view](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/screen-tracking/index.md) self-described events. You can find the schemas for these events [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow).

To track your own _custom_ self-describing event, e.g. `viewed_product`, **you will first need to define its [schema](/docs/understanding-your-pipeline/schemas/index.md)** (see [managing data structures](/docs/understanding-tracking-design/managing-your-data-structures/index.md)). This schema might have fields such as `productId`, `brand`, etc.

Then you can use one of our [tracking SDKs](/docs/collecting-data/collecting-from-own-applications/index.md). For example, with the [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/web-quick-start-guide/):

```javascript
window.snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
    data: {
      productId: 'ASO01043',
      category: 'Dresses',
      brand: 'ACME',
      returning: true,
      price: 49.95,
      sizes: ['xs', 's', 'l', 'xl', 'xxl'],
      availableSince: new Date(2013,3,7)
    }
  }
});
```

In the data warehouse, these events still use the [standard columns](/docs/understanding-your-pipeline/canonical-event/index.md) for general information, like timestamps. In addition, each type of self-describing event gets its own column (or its own table, in the case of Redshift) for event-specific fields defined in its schema. See the [structure of Snowplow data](/docs/understanding-your-pipeline/canonical-event/index.md#self-describing-events) for more information.

</details>
