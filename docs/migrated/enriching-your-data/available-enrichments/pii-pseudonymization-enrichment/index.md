---
title: "PII pseudonymization enrichment"
date: "2020-02-14"
sidebar_position: 120
---

PII (personally identifiable information) pseudonymization enrichment runs after all the other enrichments and pseudonymizes the fields that are configured as PIIs.

It enables the users of Snowplow to better protect the privacy rights of data subjects, therefore aiding in compliance for regulatory measures.

In Europe the obligations regarding PIIs handling have been outlined on the [EU GDPR website](https://www.eugdpr.org/).

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/pii_enrichment_config.json)

Two types of fields can be configured to be hashed:

- `pojo`: field that is effectively a scalar field in the enriched event (full list of fields that can be pseudonymized [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0#L43-L60))
- `json`: field contained inside a self-describing JSON (e.g. in `unstruct_event`)

With the configuration example, the fields `user_id` and `user_ipaddress` of the enriched event would be hashed, as well as the fields `email` and `ip_opt` of the unstructured event in case its schema matches _iglu:com.mailchimp/subscribe/jsonschema/1-\*-\*_.

At the moment only `"pseudonymize"` strategy is available and the available hashing algorithms can be found below:

- `_MD2_`: the 128-bit algorithm [MD2](https://en.wikipedia.org/wiki/MD2_(cryptography)#MD2_hashes) (not-recommended due to performance reasons see [RFC6149](https://tools.ietf.org/html/rfc6149))
- `_MD5_`: the 128-bit algorithm [MD5](https://en.wikipedia.org/wiki/MD5#MD5_hashes)
- `_SHA-1_:` the 160-bit algorithm [SHA-1](https://en.wikipedia.org/wiki/SHA-1#Example_hashes)
- `_SHA-256_`: 256-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm
- `_SHA-384_`: 384-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm
- `_SHA-512_`: 512-bit variant of the [SHA-2](https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions) algorithm

It's **important** to keep these things in mind when using this enrichment:

- Hashing a field can change its format (e.g. email) and its length, thus making a whole valid original event invalid if its schema is not compatible with the hashing.
- When updating the `salt` after it has already been used, same original values hashed with previous and new salt will have different hashes, thus making a join impossible and/or creating duplicate values.

## Input

[These fields](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0#L43-L60) of the enriched event and any field of an unstructured event or context can be hashed.

## Output

The fields are updated in-place in the enriched event.

If `emitEvent` is set to _true_ in the configuration, for each enriched event, an unstructured event wrapping the list of updates that happened with the fields is also emitted to the configured PII stream. Its schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/pii_transformation/jsonschema/1-0-0).
