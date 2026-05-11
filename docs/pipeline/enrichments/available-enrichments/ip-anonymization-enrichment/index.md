---
title: "IP anonymization enrichment"
sidebar_position: 16
sidebar_label: IP anonymization
description: "Anonymize IP addresses by masking octets or segments to protect user privacy and comply with regulations."
keywords: ["IP anonymization", "GDPR compliance", "privacy protection"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment replaces the end of the user's IP address with "x"s, on a configurable length. For instance `13.54.45.87` could become `13.54.x.x`. The user IP is tracked in the `user_ipaddress` field of the atomic event

Both IPv4 and IPv6 are supported.

This enrichment runs after the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md).

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1",
    data: {
      name: "anon_ip",
      vendor: "com.snowplowanalytics.snowplow",
      enabled: true,
      parameters: {
        anonOctets: 1,
        anonSegments: 1
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an IP anonymization enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "anon_ip", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "anonOctets": { "description": "Number of IPv4 octets to anonymize", "type": "number", "minimum": 1, "maximum": 4 }, "anonSegments": { "description": "Number of IPv6 segments to anonymize", "type": "integer", "minimum": 1, "maximum": 8 } }, "required": ["anonOctets"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

The number of octets (IPv4) to anonymize is specified with `anonOctets` and the number of segments (IPv6) to anonymize is specified with `anonSegments`.

For example, anonymizing one octet would change an IPv4 address of `255.255.255.255` to `255.255.255.x`, and anonymizing three octets would change it to `255.x.x.x`.

## Output

The anonymized value of the IP address is updated in-place in the `user_ipaddress` field, before ever being stored.
