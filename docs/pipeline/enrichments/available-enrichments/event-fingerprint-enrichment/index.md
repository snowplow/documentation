---
title: "Event fingerprint enrichment"
description: "Generate unique fingerprints for events to enable deduplication and data quality monitoring in your pipeline."
schema: "TechArticle"
keywords: ["Event Fingerprint", "Event Deduplication", "Duplicate Detection", "Data Quality", "Event Uniqueness", "Fingerprinting"]
sidebar_position: 6
sidebar_label: Event fingerprint
---

This enrichment computes the fingerprint of an event using the query string parameters.

Both the key and the value of all query string parameters are used to compute the fingerprint, except for the fields specified in `excludeParameters`.

This is helpful when de-duplicating events.

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-0-1)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/event_fingerprint_enrichment.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

`hashAlgorithm` determines the algorithm that should be used to calculate the hash. Supported hashing algorithms are:

- [MD5](https://en.wikipedia.org/wiki/MD5)
- [SHA1](https://en.wikipedia.org/wiki/SHA-1)
- [SHA256](https://en.wikipedia.org/wiki/SHA-2)
- [SHA384](https://en.wikipedia.org/wiki/SHA-2)
- [SHA512](https://en.wikipedia.org/wiki/SHA-2)

The example configuration below would use all the parameters to compute the hash **except** the event ID (`eid`) and the device sent timestamp (`stm`).

```json
    "parameters": {
      "excludeParameters": [
        "eid",
        "stm"
      ],
      "hashAlgorithm": "MD5"
    }
```

Removing `stm` can be a good idea because in the scenario where tracker doesn't receive an acknowledgement after sending an event once and retries, the two copies of the event will have different `stm`s, whereas they are the same event.

Similarly, not much is gained by including the event ID in the hash given that this field is field is already used for de-duplication.

## Input

Query string parameters.

## Output

This enrichment will populate the field `event_fingerprint` of the atomic event.
