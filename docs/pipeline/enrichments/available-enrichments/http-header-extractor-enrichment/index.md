---
title: "HTTP header extractor enrichment"
sidebar_position: 8
sidebar_label: HTTP header extractor
description: "Extract HTTP request headers using regex patterns and attach them to events as entities."
keywords: ["HTTP headers", "header extraction", "request headers"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment can extract name/value pairs from the HTTP headers in the tracker request to the Collector, and attach them to the event as entities.

## Configuration

The enrichment takes one parameter:

| Parameter        | Required | Description                   |
| ---------------- | -------- | ----------------------------- |
| `headersPattern` | ✅        | A regex for matching headers. |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. For example:

```json
{
  "headersPattern": ".*"
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/http_header_extractor_config/jsonschema/1-0-0",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "http_header_extractor_config",
    "enabled": false,
    "parameters": {
      "headersPattern": ".*"
    }
  }
}
```

  </TabItem>
</Tabs>

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

All the headers that will match the regular expression defined in `headersPattern` parameter will be attached to the event.

In the example configuration, all the headers of the request would be attached to the event because of the `.*` regular expression pattern.

If you're only interested in the host, for example, use:

```json
      "headersPattern": "(?i)Host"
```

## Output

For **each** header matching the regex defined in `headersPattern`, an `http_header` entity is added to the enriched event. Each entity contains only one name/value pair.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    name: "Accept-Language",
    value: "en-US,en;q=0.9"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a single HTTP header", "self": { "vendor": "org.ietf", "name": "http_header", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "name": { "type": "string", "maxLength": 4096 }, "value": { "type": "string", "maxLength": 4096 } }, "required": ["name", "value"], "additionalProperties": false }} />
