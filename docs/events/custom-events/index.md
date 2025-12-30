---
title: "How to track custom events and entities"
sidebar_label: "Custom data"
sidebar_position: 1
---

Snowplow includes three ways to customize tracking:
* Custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events)
* Custom [entities](/docs/fundamentals/entities/index.md) added to out-of-the-box or custom events
* Structured events (not recommended)

Read our [tracking design best practice guide](/docs/fundamentals/tracking-design-best-practice/index.md) to learn how to track and use custom data.

## Custom events

Self-describing [events](/docs/fundamentals/events/index.md#self-describing-events) are [based on JSON schemas](/docs/fundamentals/schemas/index.md) and can have arbitrarily many fields.

To define your own custom event, you will need to [create a corresponding schema](/docs/fundamentals/schemas/index.md). Snowplow uses the schema to validate that the JSON containing the event properties is well-formed.

This code shows how you could track a custom `article_share` event using the [JavaScript tracker](/docs/sources/web-trackers/quick-start-guide/index.md):

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

In addition to populating the [standard atomic columns](/docs/fundamentals/canonical-event/index.md), each type of self-describing event gets its own warehouse column (or its own table, in the case of Redshift) for event-specific fields defined in its schema. See the [warehouse tables fundamentals](/docs/fundamentals/warehouse-tables/index.md) page for more information.

## Custom entities

As with custom self-describing events, if you want to create your own custom [entity](/docs/fundamentals/entities/index.md), you will need to [create a corresponding schema](/docs/fundamentals/schemas/index.md). Snowplow uses the schema to validate that the JSON containing the entity properties is well-formed.

Here's an example that shows how you could track custom `user` and `product` entities along with a page view event, using the [JavaScript tracker](/docs/sources/web-trackers/quick-start-guide/index.md):

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

See the [warehouse tables fundamentals](/docs/fundamentals/warehouse-tables/index.md) page to learn how entity data is structured in the data warehouse.

:::info Deprecated terminology
In the past, what we now call "entity" or "entities" was called "context". You'll still find `context` used in many of the existing APIs, database column names, and documentation, especially to refer to a set of multiple entities. For example, the `context` parameter in the JavaScript tracker API above is an array of entities.
:::

### Add custom entities to all events

Certain Snowplow trackers provide the option to add custom entities to all events, or a configurable subset of events. These are called **application entities**. This feature is called "global context" in the trackers.

See the documentation for each tracker to learn how to configure it:
* [Web](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md)
* [Native mobile](/docs/sources/mobile-trackers/custom-tracking-using-schemas/global-context/index.md) (iOS and Android)
* [React Native](/docs/sources/react-native-tracker/index.md)
* [Scala](/docs/sources/scala-tracker/initialization/index.md)

Use [source applications](/docs/data-product-studio/source-applications/index.md) to document your expected application entities.

## Structured events

:::info Use self-describing events instead
Structured event tracking is a legacy format used to track events that weren't natively supported by Snowplow.

We recommend using self-describing events for custom event tracking.
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

Here's how to track a structured event using the [JavaScript tracker](/docs/sources/web-trackers/quick-start-guide/index.md):

```javascript
snowplow('trackStructEvent', {
  category: 'Product',
  action: 'View',
  label: 'ASO01043',
  property: 'Dress',
  value: 49.95
});
```

In the warehouse, data tracked for any of these structured event-specific fields is stored in [standard atomic columns](/docs/fundamentals/canonical-event/index.md#structured-events).
