---
title: "HTTP header extractor enrichment"
sidebar_position: 8
sidebar_label: HTTP header extractor
description: "Extract HTTP request headers using regex patterns and attach them to events as entities."
keywords: ["HTTP headers", "header extraction", "request headers"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment can extract name/value pairs from the HTTP headers in the tracker request to the Collector, and attach them to the event as entities.

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/http_header_extractor_config/jsonschema/1-0-0",
    data: {
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      name: "http_header_extractor_config",
      enabled: false,
      parameters: {
        headersPattern: ".*"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for HTTP header extractor enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "http_header_extractor_config", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "headersPattern": { "type": "string" }, "description": "A regex for matching headers" }, "required": ["headersPattern"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

All the headers that will match the regex defined in `headersPattern` parameter will be attached to the event.

In the example configuration, all the headers of the request would be attached to the event because of the `.*` regex pattern.

If you're only interested in the host, for example, use:

```json
      "headersPattern": "Host"
```

## Input

This enrichment uses the HTTP headers in the tracker request to the Collector.

## Output

For **each** header matching the regex defined in `headersPattern`, an `http_header` entity is added to the enriched event. Each entity contains only one name/value pair.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    name: "Accept-Language",
    value: "en-US,en;q=0.9"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a single HTTP header", "self": { "vendor": "org.ietf", "name": "http_header", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "name": { "type": "string", "maxLength": 4096 }, "value": { "type": "string", "maxLength": 4096 } }, "required": ["name", "value"], "additionalProperties": false }} />
