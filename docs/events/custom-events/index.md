---
title: "How to track custom events and entities"
sidebar_label: "Custom data"
sidebar_position: 1
---

Snowplow includes three ways to track custom data:
* Self-describing [events](/docs/fundamentals/events/index.md#self-describing-events)
* Custom [entities](/docs/fundamentals/entities/index.md#custom-entities)
* Structured events (not recommended)

## Custom self-describing events

Self-describing events are [based on JSON schemas](/docs/fundamentals/schemas/index.md) and can have arbitrarily many fields.

To define your own custom event, you will need to [create a corresponding schema](/docs/data-product-studio/data-structures/manage/index.md). Snowplow uses the schema to validate that the JSON containing the event properties is well-formed.

This code shows how you could track a custom `article_share` event using the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

```javascript
window.snowplow('trackSelfDescribingEvent', {
  event: {
    schema: 'iglu:com.example_company/article_share/jsonschema/1-0-0',
    data: {
      articleId: 'doc-12345',
      shareMethod: 'email',
      articleTitle: 'Getting Started with Snowplow'
    }
  }
});
```

In addition to the [standard columns](/docs/fundamentals/canonical-event/index.md), each type of self-describing event gets its own warehouse column (or its own table, in the case of Redshift) for event-specific fields defined in its schema. See the [structure of Snowplow data](/docs/fundamentals/canonical-event/index.md#self-describing-events) for more information.

Check out the schema fundamentals page to learn how the trackers serialize the self-describing event data, and how it's loaded into the warehouse. ADD LINK

:::info Terminology
We originally called self-describing events "unstructured events", to distinguish them from structured events. This was misleading, because these events are actually more structured than structured events. The old term is deprecated, but you might still see it in some docs, APIs and database column names, such as `unstruct_event` or `ue`.
:::

## Custom entities

All Snowplow events can be augmented with [entities](/docs/fundamentals/entities/index.md). Snowplow trackers add certain entities automatically. For example, the web trackers add a [`webPage` entity](/docs/sources/trackers/web-trackers/tracking-events/index.md#auto-tracked-entities) to all events by default.

Defining your own custom entities is useful when you have similar bits of business-specific context you want to attach to multiple different events. For example, if many of your events refer to a product or a user, you can create your own `user` and `product` entities with the fields you want. Check out our [tracking plan guide](/docs/fundamentals/tracking-design-best-practice/index.md) for best practice on designing entities.

As with custom self-describing events, if you want to create your own custom entity, you will need to [create a corresponding schema](/docs/data-product-studio/data-structures/manage/index.md). Snowplow uses the schema to validate that the JSON containing the entity properties is well-formed.

Here's an example that shows how you could track custom `user` and `product` entities along with a page view event, using the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

```javascript
// Track a page view with a custom entity
window.snowplow('trackPageView', {
  context: [
    {
      schema: 'iglu:com.example_company/user/jsonschema/1-0-0',
      data: {
        userId: 'user-12345',
        accountType: 'enterprise',
        subscriptionTier: 'premium'
      }
    },
    {
      schema: 'iglu:com.example_company/product/jsonschema/1-2-1',
      data: {
        productId: 'ASO01043',
        brand: 'ACME'
      }
    }]
});
```

Check out the schema fundamentals page to learn how the trackers serialize the entity data, and how it's loaded into the warehouse ADD LINK.

:::info Terminology
In the past, what we now call "entity" or "entities" was called "context". You'll still find `context` used in many of the existing APIs, database column names, and documentation, especially to refer to a set of multiple entities. For example, the `context` parameter in the JavaScript tracker API above is an array of entities.
:::

### Add custom entities to all events

TODO
global context - web, mobile, ?
application entities is the same thing??

## Structured events

:::info Use self-describing events instead
Structured event tracking is a legacy format used to track events that were not natively supported by Snowplow.

We recommend using [self-describing events](#self-describing-events) for custom event tracking.
:::

Structured events are simpler to create than custom self-describing events, as you don't need to define a [schema](/docs/fundamentals/schemas/index.md). However, they have a number of disadvantages:

|            | Structured events                             | Self-describing events                                 |
| ---------- | --------------------------------------------- | ------------------------------------------------------ |
| Format     | :x: Data must fit the fields below            | :white_check_mark: JSON, as complex as you want        |
| Validation | :x: No validation (beyond field types)        | :white_check_mark: Schema includes validation criteria |
| Meaning    | :x: Can only infer what each field represents | :white_check_mark: Schema includes field descriptions  |

Structured events have five custom event specific parameters:
| **Table column** | **Type** | **Description**                                                        | **Example values**            |
| ---------------- | -------- | ---------------------------------------------------------------------- | ----------------------------- |
| `se_category`    | text     | The category of event                                                  | `Ecomm`, `Media`              |
| `se_action`      | text     | The action / event itself                                              | `add-to-basket`, `play-video` |
| `se_label`       | text     | A label often used to refer to the 'object' the action is performed on | `dog-skateboarding-video`     |
| `se_property`    | text     | A property associated with either the action or the object             | `hd`                          |
| `se_value`       | decimal  | A value associated with the user action                                | `13.99`                       |

Here's how to track a structured event using the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

```javascript
snowplow('trackStructEvent', {
  category: 'Product',
  action: 'View',
  label: 'ASO01043',
  property: 'Dress',
  value: 49.95
});
```

In the warehouse, data tracked for any of these event-specific fields is stored in standard columns. See the [structure of Snowplow data](/docs/fundamentals/canonical-event/index.md#structured-events) for more information.
