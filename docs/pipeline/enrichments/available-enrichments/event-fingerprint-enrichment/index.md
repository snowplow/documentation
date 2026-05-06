---
title: "Event fingerprint enrichment"
sidebar_position: 6
sidebar_label: Event fingerprint
description: "Generate unique fingerprints for events using hash functions to enable deduplication and event matching."
keywords: ["event fingerprint", "deduplication", "event hashing"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment computes the fingerprint of an event using the Snowplow tracker payload.

Both the key and the value of all parameters in the payload are used to compute the fingerprint, except for the fields specified in `excludeParameters`. Check out the [atomic fields reference](/docs/fundamentals/canonical-event/index.md) and [example HTTP requests](/docs/events/http-requests/index.md) for more information on the relevant parameters.

This can be helpful when de-duplicating events.

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-0-1",
    data: {
      vendor: "com.snowplowanalytics.snowplow",
      name: "event_fingerprint_config",
      enabled: true,
      parameters: {
        excludeParameters: ["eid", "nuid", "stm", "cv"],
        hashAlgorithm: "MD5"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for configuration of an event fingerprinting enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "event_fingerprint_config", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "hashAlgorithm": { "enum": ["MD5", "SHA1", "SHA256", "SHA384", "SHA512"], "description": "The algorithm used to compute the event fingerprint" }, "excludeParameters": { "type": "array", "items": { "type": "string" }, "description": "Parameters to exclude from the fingerprint calculation" } }, "required": ["hashAlgorithm", "excludeParameters"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

Supported hashing algorithms are:

- [MD5](https://en.wikipedia.org/wiki/MD5)
- [SHA1](https://en.wikipedia.org/wiki/SHA-1)
- [SHA256](https://en.wikipedia.org/wiki/SHA-2)
- [SHA384](https://en.wikipedia.org/wiki/SHA-2)
- [SHA512](https://en.wikipedia.org/wiki/SHA-2)

We recommend excluding the sent timestamp `stm`. When the tracker doesn't receive an acknowledgement after sending an event once, it will retry. The two copies of the event will have different `stm`s, but they're the same event.

Similarly, not much is gained by including the event ID, `eid`, in the hash given that this field is already used for de-duplication.

## Input

Query string parameters in the tracker request.

## Output

This enrichment will populate the `event_fingerprint` atomic event field.
