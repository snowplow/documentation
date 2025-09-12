---
title: "Context entities"
description: "Add context entities to behavioral events for rich contextual information and enhanced analytics."
schema: "TechArticle"
keywords: ["Context Entities", "Event Context", "Entity Data", "Context Data", "Event Entities", "Contextual Data"]
---

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

| **Parameter** | **Table Column**                   | **Type**                       | **Description**                 | **Example values**                                                                                                                                                                                                        |
|---------------|-------------------------------|--------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `co`          | `context`                     | JSON                           | An array of custom contexts     | `%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D`  |
| `cx`          | `context`                     | JSON (URL-safe Base64 encoded) | An array of custom contexts     | `ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==`  |

:::note
The exact field names may vary depending on your warehouse, for snowflake/bigquery/databricks you will find `unstruct_` or `context_` at the front and for bigquery you will see an extended version number at the end such as `1_0_0`.
:::

  </div>
</details>
