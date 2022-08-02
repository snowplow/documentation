### Compatibility

JSON Schema [iglu:com.snowplowanalytics.snowplow/event\_fingerprint\_config/jsonschema/1-0-1](http://iglucentral.com/schemas/com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-0-0) Compatibility Release 71+ Data provider None

### Overview

This enrichment generates a fingerprint for the event using a hash of client-set fields. This is helpful when deduplicating events. This is the field which this enrichment will augment:

- event\_fingerprint

### Example

{
    "schema": "iglu:com.snowplowanalytics.snowplow/event\_fingerprint\_config/jsonschema/1-0-1",

    "data": {

        "name": "event\_fingerprint\_config",
        "vendor": "com.snowplowanalytics.snowplow",
        "enabled": true,
        "parameters": {
            "excludeParameters": \["eid", "stm"\],
            "hashAlgorithm": "MD5"
        }
    }
}

The `excludeParameters` field is a list of fields set by the tracker which should be excluded from calculating the hash. In this example, `stm` (which maps to `dvce_sent_tstamp`) is excluded. This is because a tracker may attempt to send the same event twice if it doesn’t receive acknowledgement that the first send succeeded. The two copies of the event will have different `stm`s, so this field should not be used to deduplicate. Similarly, we exclude `eid` (which maps to `event_id`) – the event ID field is already used for deduplication, so nothing further is gained by including it in the hash. The `hashAlgorithm` field determines the algorithm that should be used to calculate the hash. Supported hashing algorithms are:

- MD5
- SHA1
- SHA256
- SHA384
- SHA512

### Data sources

The input values for this enrichment are taken from all the querystring fields and the body (if present) except those extracted from `excludedParameters` in [`event_fingerprint_enrichment.json`](https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/event_fingerprint_enrichment.json). That is all the properties of the `RawEvent` produced by the adapter (tracker protocol) used are taken into account. Also, the same JSON provides the name of the hash algorithm to apply.

### Algorithm

All the key-value pairs from the querystring are sorted and appended and the hash is calculated on the final string.

### Data generated

The resulted hash value ends up in `event_fingerprint` field of `atomic.events` table. It represents a unique fingerprint of the corresponding event and thus could be used at the deduplication process.
