---
title: "PII pseudonymization enrichment"
sidebar_position: 17
sidebar_label: PII pseudonymization
description: "Pseudonymize personally identifiable information in events using hashing for privacy compliance."
keywords: ["PII pseudonymization", "data privacy", "GDPR"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The PII (personally identifiable information) pseudonymization enrichment runs after all the other enrichments, and pseudonymizes the fields that are configured as PIIs.

It enables you to better protect the privacy rights of data subjects, therefore aiding in compliance for regulatory measures.

In Europe the obligations regarding Personal Data handling have been outlined on the [GDPR EU website](https://www.gdpreu.org/the-regulation/key-concepts/personal-data/).

It's **important** to keep these things in mind when using this enrichment:
:::tip[Hashed values must match the schema]
Hashing a field can change its format (e.g. email) and its length. This could make a whole valid original event invalid if its schema is not compatible with the hashing.
:::

## Configuration

For historical reasons, the configuration uses nomenclature that's no longer used elsewhere in Snowplow.

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-1",
    data: {
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      name: "pii_enrichment_config",
      emitEvent: false,
      enabled: true,
      anonymousOnly: false,
      parameters: {
        pii: [
          {
            pojo: {
              field: "user_id"
            }
          },
          {
            pojo: {
              field: "user_ipaddress"
            }
          },
          {
            json: {
              field: "unstruct_event",
              schemaCriterion: "iglu:com.google.analytics.measurement-protocol/user/jsonschema/1-*-*",
              jsonPath: "$.['clientId', 'userId']"
            }
          }
        ],
        strategy: {
          pseudonymize: {
            hashFunction: "SHA-1",
            salt: "pepper123"
          }
        }
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for PII pseudonymization enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "pii_enrichment_config", "format": "jsonschema", "version": "2-0-1" }, "type": "object", "properties": { "vendor": { "type": "string", "description": "The name of the vendor for this config (the only valid value for scala-common enrich is com.snowplowanalytics.snowplow.enrichments)" }, "name": { "type": "string", "description": "The name of the config (the only valid value for scala-common enrich is pii_enrichment_config)" }, "enabled": { "type": "boolean", "description": "Whether to enable this enrichment" }, "emitEvent": { "type": "boolean", "description": "Whether to emit identification events from this enrichment" }, "parameters": { "type": "object", "properties": { "pii": { "description": "List of all the fields for which pseudonymization will be performed", "type": "array", "items": { "type": "object", "properties": { "pojo": { "description": "Scalar field which contains a single string value, on which pseudonymization will be performed on the entire field (e.g. user_id)", "type": "object", "properties": { "field": { "enum": ["user_id", "user_ipaddress", "user_fingerprint", "domain_userid", "network_userid", "ip_organization", "ip_domain", "tr_orderid", "ti_orderid", "mkt_term", "mkt_content", "se_category", "se_action", "se_label", "se_property", "mkt_clickid", "refr_domain_userid", "domain_sessionid"] } }, "required": ["field"], "additionalProperties": false }, "json": { "description": "JSON field which contains a JSON string value, on which pseudonymization will be performed on a specific JSON path", "type": "object", "properties": { "field": { "enum": ["contexts", "derived_contexts", "unstruct_event"] }, "schemaCriterion": { "type": "string", "pattern": "^iglu:([a-zA-Z0-9-_.]+)/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/([1-9][0-9]*|\\*)-((?:0|[1-9][0-9]*)|\\*)-((?:0|[1-9][0-9]*)|\\*)$" }, "jsonPath": { "type": "string", "pattern": "^\\$.*$" } }, "required": ["field", "schemaCriterion", "jsonPath"], "additionalProperties": false } }, "oneOf": [ { "required": ["pojo"] }, { "required": ["json"] } ], "additionalProperties": false } }, "strategy": { "description": "The pseudonymization strategy which will be applied to all the fields specified in the pii section", "type": "object", "properties": { "pseudonymize": { "description": "Pseudonymization strategy that hashes using a specified algorithm", "type": "object", "properties": { "hashFunction": { "description": "The hash function that will be used by this strategy", "enum": ["MD2", "MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] }, "salt": { "description": "A salt that will be added to the field during hashing", "type": "string" } }, "required": ["hashFunction", "salt"], "additionalProperties": false } }, "required": ["pseudonymize"], "additionalProperties": false } }, "required": ["pii", "strategy"], "additionalProperties": false }, "anonymousOnly": { "type": "boolean", "description": "Whether to enable anonymous mode. If enabled, the enrichment masks PII only when the SP-Anonymous header is present" } }, "required": ["vendor", "name", "enabled", "emitEvent", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### `pii` fields

The enrichment can act on most properties in the event:
- A defined subset of [atomic event properties](/docs/fundamentals/canonical-event/index.md), including `user_id`
- [Self-describing event](/docs/fundamentals/events/index.md#self-describing-events) fields
- [Entities](/docs/fundamentals/entities/index.md) attached by tracker SDKs
- Entities attached by other enrichments

Specify `pojo` to hash atomic event fields. The available fields are:
- `user_id`
- `user_ipaddress`
- `user_fingerprint`
- `domain_userid`
- `network_userid`
- `refr_domain_userid`
- `domain_sessionid`
- `ip_organization`
- `ip_domain`
- `mkt_term`
- `mkt_content`
- `mkt_clickid`
- `se_category`
- `se_action`
- `se_label`
- `se_property`
- `tr_orderid`
- `ti_orderid`

Providing a field not in this list will cause an error, and the event will fail.

For `json`, specify the field name as either `unstruct_event` for self-describing event fields, `contexts` for fields in entities added during tracking, or `derived_contexts` for fields in enrichment entities. Add two additional fields:
- `schemaCriterion` is the self-describing JSON URI. You can specify all versions of the schema (`*-*-*`), or a specific MODEL version (e.g. `1-*-*`), MODEL plus MINOR (e.g. `1-1-*`) or a full MODEL-MINOR-PATCH version (e.g. `1-1-1`)
- `jsonPath` is the [JSON Path statement](http://goessner.net/articles/JsonPath/) to navigate to the field or fields inside the JSON that you want to hash.

The resolved values should be primitive types.

### `strategy`

Choose which pseudonymization hashing algorithm strategy to use:
- `MD5`: the 128-bit algorithm [MD5](https://en.wikipedia.org/wiki/MD5#MD5_hashes)
- `SHA-1:` the 160-bit algorithm [SHA-1](https://en.wikipedia.org/wiki/SHA-1#Example_hashes)
- `SHA-256`: 256-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm
- `SHA-384`: 384-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm
- `SHA-512`: 512-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm
- `MD2`: the 128-bit algorithm [MD2](https://en.wikipedia.org/wiki/MD2_(cryptography)#MD2_hashes) (not recommended due to performance reasons: see [RFC6149](https://tools.ietf.org/html/rfc6149))

Once you've started using the enrichment, it's important to keep the same `salt` value in order to maintain the same hashed output for the same input. This is crucial for use cases where you need to join events on hashed PII fields, or simply to avoid having different hashed values for the same original value across events.

### `anonymousOnly` mode

When `anonymousOnly` is set to `true`, PII fields are masked only in events tracked in anonymous mode, i.e. when the `SP-Anonymous` header is present.

This feature was added in Enrich 5.3.0.

This is useful for compliance with regulations such as GDPR, where you would start with [anonymous tracking](/docs/events/anonymous-tracking/index.md) by default, and switch to non-anonymous tracking when the user consents to data collection.

By default, `anonymousOnly` is `false`, i.e. PII fields are always masked.

## Output

The fields are updated in place in the enriched event.

If `emitEvent` is set to `true` in the configuration, for each enriched event, the enrichment will add a `pii_transformation` event to your event stream. This event includes the original, unhashed PII field values.

<SchemaProperties
  overview={{ event: true }}
  example={{
    pii: {
      pojo: [
        {
          fieldName: "user_id",
          originalValue: "user-123",
          modifiedValue: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"
        },
        {
          fieldName: "user_ipaddress",
          originalValue: "13.54.45.87",
          modifiedValue: "f5af3f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e"
        }
      ],
      json: [
        {
          fieldMapping: {
            fieldName: "unstruct_event",
            jsonPath: "$.['clientId', 'userId']",
            originalValue: "abc123",
            modifiedValue: "0a4d55a8d778e5022fab701977c5d840bbc486d0",
            schema: "iglu:com.google.analytics.measurement-protocol/user/jsonschema/1-0-0"
          }
        }
      ]
    },
    strategy: {
      pseudonymize: {
        hashFunction: "SHA-1"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a PII enrichment original values", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "pii_transformation", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "pii": { "type": "object", "properties": { "pojo": { "description": "A scalar field replacement from the EnrichedEvent POJO (e.g. user_id)", "type": "array", "items": { "type": "object", "properties": { "fieldName": { "enum": ["user_id", "user_ipaddress", "user_fingerprint", "domain_userid", "network_userid", "ip_organization", "ip_domain", "tr_orderid", "ti_orderid", "mkt_term", "mkt_content", "se_category", "se_action", "se_label", "se_property", "mkt_clickid", "refr_domain_userid", "domain_sessionid"], "description": "The name of the field" }, "originalValue": { "type": "string", "description": "The original value (before the PII transform), of the field" }, "modifiedValue": { "type": "string", "maxLength": 128, "description": "The value that this field was replaced with (e.g. the hash of the original)" } }, "additionalProperties": false, "required": ["fieldName", "originalValue", "modifiedValue"] } }, "json": { "description": "A JSON field replacement from the EnrichedEvent POJO (e.g. contexts). Each entry in this array is a match of the jsonPath for that field", "type": "array", "items": { "type": "object", "properties": { "fieldMapping": { "description": "A single replacement (there can be multiple) caused by specifying that JsonPath", "type": "object", "properties": { "fieldName": { "enum": ["contexts", "derived_contexts", "unstruct_event"], "description": "The name of the field" }, "jsonPath": { "type": "string", "description": "The JsonPath that was specified" }, "originalValue": { "type": "string", "description": "The original value of the field" }, "modifiedValue": { "type": "string", "maxLength": 128, "description": "The modified value (e.g. hash) of the original value" }, "schema": { "type": "string", "description": "The iglu schema corresponding to this field and value", "pattern": "^iglu:([a-zA-Z0-9-_.]+)/([a-zA-Z0-9-_]+)/([a-zA-Z0-9-_]+)/([1-9][0-9]*|\\*)-((?:0|[1-9][0-9]*)|\\*)-((?:0|[1-9][0-9]*)|\\*)$" } }, "required": ["fieldName", "jsonPath", "originalValue", "modifiedValue", "schema"], "additionalProperties": false } } } } }, "anyOf": [ { "required": ["pojo"] }, { "required": ["json"] } ], "additionalProperties": false }, "strategy": { "description": "The strategy used to modify the original value", "type": "object", "properties": { "pseudonymize": { "description": "The pseudonymize strategy for modifying the original value", "type": "object", "properties": { "hashFunction": { "enum": ["MD2", "MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"], "description": "The function used to pseudonymize" } }, "required": ["hashFunction"], "additionalProperties": false } }, "required": ["pseudonymize"], "additionalProperties": false } }, "required": ["pii", "strategy"], "additionalProperties": false }} />
