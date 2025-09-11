---
title: "Self-describing events"
description: "Create self-describing behavioral events with JSON schemas for flexible and extensible event tracking."
schema: "TechArticle"
keywords: ["Self Describing Events", "Schema Events", "Custom Events", "Event Schema", "Flexible Events", "JSON Events"]
---

```mdx-code-block
import DefineCustomEvent from "@site/docs/reusable/define-custom-event/_index.md"

<DefineCustomEvent/>
```

:::info

Historically, custom self-describing events were called “unstructured” and the legacy custom events were called “structured”. This terminology can be confusing, so we don’t use it anymore. However, you might find its remnants in some of the APIs.

:::

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

| **Parameter** | **Table Column**      | **Type**                       | **Description**              | **Example values**                                             |
|----------------|--------------------------------|------------------------------|----------------------------------------------------------------------------------|
| `ue_px`       | `unstruct_event` | JSON (URL-safe Base64 encoded) | The properties of the event  | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |
| `ue_pr`       | `unstruct_event` | JSON                           | The properties of the event  | `{ "product_id": "ASO01043", "price": 49.95 }`                 |

The tracker can decide to pass the `ue_px` or the `ue_pr` parameter. Encoding properties into URL-safe Base64 allows is the recommended approach although does sacrifice readability.

  </div>
</details>
