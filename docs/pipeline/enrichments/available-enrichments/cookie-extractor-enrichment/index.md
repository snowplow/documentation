---
title: "Cookie extractor enrichment"
sidebar_position: 7
sidebar_label: Cookie extractor
description: "Extract name-value pairs from first-party cookies and attach them to events as derived contexts."
keywords: ["cookie extraction", "first-party cookies", "cookie enrichment"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

This enrichment extracts name-value pairs from cookies set on the Collector domain, attaching them to the event as derived entities.

When using a custom Collector domain, it's possible to capture values in first-party cookies set by other services such as ad servers or content management software (CMS). By capturing these cookie fields and attaching them to the event, you can use the data to better identify users of your website.

This table shows how the cookie and Collector domains interact, indicating whether or not the cookies can be accessed with this enrichment.

| Collector domain    | Cookie domain | Cookies extracted |
| ------------------- | ------------- | ----------------- |
| `c.snowplow.io`     | `acme.com`    | ❌                 |
| `t.acme.com`        | `c.acme.com`  | ❌                 |
| `t.acme.com`        | `acme.com`    | ✅                 |
| `sp.track.acme.com` | `acme.com`    | ✅                 |

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/cookie_extractor_config/jsonschema/1-0-0",
    data: {
      name: "cookie_extractor_config",
      vendor: "com.snowplowanalytics.snowplow",
      enabled: true,
      parameters: {
        cookies: ["sp"]
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for cookie extractor enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "cookie_extractor_config", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "cookies": { "type": "array", "items": { "type": "string" } } }, "required": ["cookies"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

Specify a list of cookie keys for which you want to extract the value.

The example configuration captures the Collector's own `sp` cookie value. In practice, you would probably want to extract other more valuable cookies available on the company domain.

<TestingWithMicro>

To test first-party cookies, you'll need to run Micro locally and [configure a custom DNS resolution rule](/docs/testing/snowplow-micro/local/remote-usage/index.md#locally-resolving-an-existing-domain-name-to-micro).

</TestingWithMicro>

## Input

This enrichment uses the `Cookie` HTTP header.

## Output

For **each** key listed in the configuration, an `http_cookie` entity is added to the enriched event. Each entity contains only one key/value pair.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    name: "sp",
    value: "5e684087-4ccd-450c-9057-ac06e8a58078"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a single HTTP cookie, as defined in RFC 6265", "self": { "vendor": "org.ietf", "name": "http_cookie", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "name": { "type": "string", "maxLength": 4096 }, "value": { "type": ["string", "null"], "maxLength": 4096 } }, "required": ["name", "value"], "additionalProperties": false }} />
