---
title: "Managing schemas using Iglu"
date: "2020-02-15"
sidebar_label: "Using Iglu"
sidebar_position: 4
sidebar_custom_props:
  offerings:
    - community
---

## Setup

To manage your [schemas](/docs/understanding-your-pipeline/schemas/index.md), you will need to have an [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) installed (you will already have one if you followed the [Community Edition Quick Start](/docs/getting-started-on-community-edition/what-is-quick-start/index.md)).

Alternatively, you can host a [static Iglu registry](docs/pipeline-components-and-applications/iglu/iglu-repositories/static-repo/index.md) in Amazon S3 or Google Cloud Storage.

## Creating a schema

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

Finally, to upload your schema to your Iglu registry, you can use [igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md):

```bash
igluctl static push --public <local path to schemas> <Iglu server endpoint> <iglu_super_api_key>
```

See the [Igluctl reference page](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md#static-push) for more information on the `static push` command.
