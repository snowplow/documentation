---
title: "Manage schemas using Iglu Server"
sidebar_label: "Manage schemas"
date: "2020-02-15"
sidebar_position: 4
description: "Manage schemas with Iglu Server or host a static Iglu registry in Amazon S3 or Google Cloud Storage for self-hosted Snowplow deployments."
keywords: ["Iglu Server", "schema management", "static registry", "S3 registry", "GCS registry"]
---

:::info[CDI customers]

If you're a Snowplow CDI customer, manage your schemas through [Event Studio](/docs/event-studio/data-structures/index.md) or the [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md) rather than interacting with Iglu directly. This page is for Self-Hosted customers running their own registry.

:::

To manage your [schemas](/docs/fundamentals/schemas/index.md), you need an [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) (you'll already have one if you followed the [Snowplow Self-Hosted quick start](/docs/get-started/self-hosted/index.md)). Alternatively, you can host a [static Iglu registry](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md).

## Create a schema

First, design the schema for your custom event (or entity). For example:

```json
{
     "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
     "description": "Schema for a button click event",
     "self": {
         "vendor": "com.snowplowanalytics",
         "name": "button_click",
         "format": "jsonschema",
         "version": "1-0-0"
     },
     "type": "object",
     "properties": {
         "id": {
             "type": "string",
             "minLength": 1
         },
         "target": {
             "type": "string"
         },
         "content": {
             "type": "string"
         }
     },
     "required": ["id"],
     "additionalProperties": false
 }
```

Next, save this schema in the following folder structure, with a filename of `1-0-0` (without any extension):

```
schemas
└── com.snowplowanalytics
    └── button_click
        └── jsonschema
            └── 1-0-0
```

:::tip

If you update the `vendor` or the `name` in the example, you should update the above path too.

:::

Finally, to upload your schema to your Iglu registry, you can use [igluctl](/docs/api-reference/iglu/igluctl/index.md):

```bash
igluctl static push --public <local path to schemas> <Iglu server endpoint> <iglu_super_api_key>
```

See the [Igluctl reference page](/docs/api-reference/iglu/igluctl/index.md#static-push) for more information on the `static push` command.

## Versioning schemas

When evolving your [schema](/docs/fundamentals/schemas/index.md) and [uploading](/docs/api-reference/iglu/manage-schemas/index.md) it to your [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md), you will need to choose how to increment its version.

```mdx-code-block
import Breaking from "/docs/reusable/schema-version-breaking-change/_breaking.md"

<Breaking/>
```
