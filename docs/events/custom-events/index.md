---
title: "Custom events and context entities"
sidebar_position: 1
---

This section has more details on the event types introduced [here](/docs/fundamentals/events/index.md).

Snowplow includes three ways to track custom data:
* Self-describing events
* Custom entities
* Structured events

## Self-describing events

```mdx-code-block
import DefineCustomEvent from "@site/docs/reusable/define-custom-event/_index.md"

<DefineCustomEvent/>
```


An example of a self-describing event for a product view event:

```json
{
  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
  "data": {
    "product_id": "ASO01043",
    "price": 49.95
  }
}
```

:::info

`"iglu:com.my_company/viewed_product/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::

:::info Nomenclature
Historically, Snowplow called custom self-describing events "unstructured events", in comparison with the legacy  "structured" custom events. You might find remnants of this nomenclature in some Snowplow APIs.
:::


<details>
  <summary>How are self-describing events serialized in event payload?</summary>
  <div>

The tracker will wrap this self-describing JSON in an outer self-describing JSON, which is what gets sent in the payload:

```json
{

  // Tells Snowplow this is an self-describing event
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {

    // Tells Snowplow this is a viewed_product event
    "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
    "data": {

      // The event data itself
      "product_id": "ASO01043",
      "price": 49.95
    }
  }
}
```

As well as setting `e=ue`, there are two custom event specific parameters that can be populated with the outer self-describing JSON:

| **Parameter** | **Table Column** | **Type**                       | **Description**             | **Example values**                                             |
| ------------- | ---------------- | ------------------------------ | --------------------------- |
| `ue_px`       | `unstruct_event` | JSON (URL-safe Base64 encoded) | The properties of the event | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |
| `ue_pr`       | `unstruct_event` | JSON                           | The properties of the event | `{ "product_id": "ASO01043", "price": 49.95 }`                 |

The tracker can decide to pass the `ue_px` or the `ue_pr` parameter. Encoding properties into URL-safe Base64 allows is the recommended approach although does sacrifice readability.

  </div>
</details>


TODO

<details>
<summary>Tracking and storage format</summary>

Some self-describing events were predefined by Snowplow and are natively supported by tracking SDKs. For example, the mobile trackers automatically send [screen view](/docs/sources/trackers/mobile-trackers/tracking-events/screen-tracking/index.md) self-described events. You can find the schemas for these events [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow).

To track your own _custom_ self-describing event, e.g. `viewed_product`, **you will first need to define its [schema](/docs/fundamentals/schemas/index.md)** (see [managing data structures](/docs/data-product-studio/data-structures/manage/index.md)). This schema might have fields such as `productId`, `brand`, etc.

Then you can use one of our [tracking SDKs](/docs/sources/trackers/index.md). For example, with the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

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

In the data warehouse, these events still use the [standard columns](/docs/fundamentals/canonical-event/index.md) for general information, like timestamps. In addition, each type of self-describing event gets its own column (or its own table, in the case of Redshift) for event-specific fields defined in its schema. See the [structure of Snowplow data](/docs/fundamentals/canonical-event/index.md#self-describing-events) for more information.

</details>


## Entities

```mdx-code-block
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md"

<DefineCustomEntity/>
```

Each individual entity is a self-describing JSON such as:

```json
{
  "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
  "data": {
    "fb_uid": "9999xyz"
  }
}
```

:::info

`"iglu:com.my_company/user/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/api-reference/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::

<details>
  <summary>How are context entities serialized in event payload?</summary>
  <div>

All entities attached to an event will be wrapped in an array by the user and passed to the tracker, which will wrap them in a self-describing JSON:

```json
{

  // Tells Snowplow this is an array of custom contexts
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {

      // Tells Snowplow that this is a "user" context
      "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
      "data": {

        // The context data itself
        "fb_uid": "9999xyz"
      }
    }
  ]
}
```

Trackers can be configured to encode the context into URL-safe Base64 to ensure that no data is lost or corrupted. The downside is that the data will be bigger and less readable.

| **Parameter** | **Table Column** | **Type**                       | **Description**             | **Example values**                                                                                                                                                                                                                                                                                             |
| ------------- | ---------------- | ------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `co`          | `context`        | JSON                           | An array of custom contexts | `%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D`                                                                                       |
| `cx`          | `context`        | JSON (URL-safe Base64 encoded) | An array of custom contexts | `ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==` |

:::note
The exact field names may vary depending on your warehouse, for snowflake/bigquery/databricks you will find `unstruct_` or `context_` at the front and for bigquery you will see an extended version number at the end such as `1_0_0`.
:::

  </div>
</details>

## Structured events


:::info

Structured event tracking is a legacy format used to track events that were not natively supported by Snowplow.

We recommend using [self-describing events](#self-describing-events) for custom event tracking.

:::

As well as setting `e=se`, there are five custom event specific parameters that can be set:

| **Table Column** | **Type** | **Description**                                                        | **Example values**            |
| ---------------- | -------- | ---------------------------------------------------------------------- | ----------------------------- |
| `se_category`    | text     | The category of event                                                  | `Ecomm`, `Media`              |
| `se_action`      | text     | The action / event itself                                              | `add-to-basket`, `play-video` |
| `se_label`       | text     | A label often used to refer to the 'object' the action is performed on | `dog-skateboarding-video`     |
| `se_property`    | text     | A property associated with either the action or the object             | `hd`                          |
| `se_value`       | decimal  | A value associated with the user action                                | `13.99`                       |

TODO

<details>
<summary>Tracking and storage format</summary>

To track a structured event, use one of the [tracking SDKs](/docs/sources/trackers/index.md). For example, with the [JavaScript tracker](/docs/sources/trackers/web-trackers/quick-start-guide/index.md):

```javascript
snowplow('trackStructEvent', {
  category: 'Product',
  action: 'View',
  label: 'ASO01043',
  property: 'Dress',
  value: 49.95
});
```

In the data warehouse, these events still use the [standard columns](/docs/fundamentals/canonical-event/index.md) for general information, like timestamps. In addition, the above fields for all structured events are stored in a set of 5 standard columns. See the [structure of Snowplow data](/docs/fundamentals/canonical-event/index.md#structured-events) for more information.

</details>


Structured events are simpler to create than custom self-describing events, as you don't need to define a [schema](/docs/fundamentals/schemas/index.md). However, they have a number of disadvantages:

|            | Structured events                             | Self-describing events                                 |
| ---------- | --------------------------------------------- | ------------------------------------------------------ |
| Format     | :x: Data must fit the fields below            | :white_check_mark: JSON, as complex as you want        |
| Validation | :x: No validation (beyond field types)        | :white_check_mark: Schema includes validation criteria |
| Meaning    | :x: Can only infer what each field represents | :white_check_mark: Schema includes field descriptions  |

Structured events have five fields:

- `Category`: the name for the group of objects you want to track
- `Action`: a string used to define the user action for the category of object
- `Label`: an optional string which identifies the specific object being actioned
- `Property`: an optional string describing the object or the action performed on it
- `Value`: an optional numeric value to quantify or further describe the user action
