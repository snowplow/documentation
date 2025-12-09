---
title: "Introduction to Snowplow entities"
sidebar_label: "Entities (context)"
sidebar_position: 2
description: "Entities are a good way to deal with common fields across various events"
---

When an event occurs, it generally involves a number of entities, which provide additional information.

:::info Terminology

In the past, what we now call “entities” was called “context”. We find the new term clearer, but you will still find `context` used in many of the existing APIs, database column names, and documentation, especially to refer to a set of _multiple_ entities. Sometimes, we will also use the two terms interchangeably.

:::

Let’s take the example of a “search” event. It may have the following entities associated with it:

1. A user entity, representing the user who performed the search
2. A web page entity — the page on which the event occurred
3. If the page is a part of an A/B test, an entity that specifies the variation of the page
4. An entity containing a set of products that were returned from the search

:::note

Each Snowplow event can have multiple entities attached to it. Any number of these entities can be of the same or different types.

:::

What makes entities interesting is that they are common across multiple different event types. For example, the following events for a retailer will all involve a “product” entity:

- View product
- Select product
- Like product
- Add product to basket
- Purchase product
- Review product
- Recommend product

Our retailer might want to describe product using a number of fields including:

- SKU
- Name
- Unit price
- Category
- Tags

Rather than defining all the product-related fields for all the different product-related events, they would define a single product entity and attach it to any product-related event.

## Under the hood

Entities are similar to [self-describing events](/docs/fundamentals/events/index.md#self-describing-events). As such, they can include arbitrarily complex data, as defined by the entity’s [schema](/docs/fundamentals/schemas/index.md).

:::note

Because the entity references its schema (in a particular version!), it’s always clear to the downstream users and applications what each field in the entity means, even if your definition of the entity changes over time.

:::

Each entity consists of two parts:

- A reference to a [schema](/docs/fundamentals/schemas/index.md) that describes the name, version and structure of the entity
- A set of key-value properties in JSON format — the data associated with the entity

This structure is an example of what we call _self-describing JSON_ — a JSON object with a `schema` and a `data` field.

In the data warehouse, each type of entity gets its own column (or its own table, in the case of Redshift). There is no difference between how out-of-the-box and custom entities are stored. See the [structure of Snowplow data](/docs/fundamentals/canonical-event/index.md#entities) for more information.

## Out-of-the-box entities

Snowplow provides a number of entities out of the box.

Some of them are attached to the event by tracking SDKs. For example, with the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md), you can enable the collection of performance timing and other entities. The associated data will be added automatically to any Snowplow event fired on the page:

```javascript
window.snowplow("newTracker", "sp", "{{COLLECTOR_URL}}", {
    appId: "cfe23a"
  },
  contexts: {
    webPage: true,
    performanceNavigationTiming: true,
    performanceTiming: true,
    gaCookies: true,
    geolocation: false
  }
);
```

Other out-of-the-box entities are added to the events by certain [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md).

## Custom entities TODO I copied this to Events

Custom entities are entities you define yourself.

:::tip

Defining your own custom entities is useful when you have similar bits of business-specific context you want to attach to multiple different events. For example, if many of your events refer to a product or a user, you can create your own `product` and `user` entities with the fields you want.

:::

To track an event with a custom entity, e.g. `product`, **you will first need to define its [schema](/docs/fundamentals/schemas/index.md)** (see [managing data structures](/docs/data-product-studio/data-structures/manage/index.md)). This schema might have fields such as `productId`, `brand`, etc.

Then you can use one of the [tracking SDKs](/docs/sources/trackers/index.md) to add an array of entities to your event. For example, with the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

```javascript
snowplow('trackPageView', {
  context: [{
    schema: 'iglu:com.example_company/product/jsonschema/1-2-1',
    data: {
      productId: 'ASO01043',
      brand: 'ACME'
    }
  }, {
    ...
  }]
});
```
