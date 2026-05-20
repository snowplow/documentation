---
title: "PII pseudonymization enrichment"
sidebar_position: 17
sidebar_label: PII pseudonymization
description: "Pseudonymize personally identifiable information in events using hashing for privacy compliance."
keywords: ["PII pseudonymization", "data privacy", "GDPR"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The PII (personally identifiable information) pseudonymization enrichment runs after all the other enrichments, and pseudonymizes the fields that are configured as PII.

It enables you to better protect the privacy rights of data subjects and comply with data regulation.

In Europe the obligations regarding Personal Data handling have been outlined on the [GDPR EU website](https://www.gdpreu.org/the-regulation/key-concepts/personal-data/).

:::tip[Hashed values must match the schema]
Hashing a field can change its format (e.g. email) and its length. This could make a whole valid original event invalid if its schema is not compatible with the hashing.
:::

## Configuration

For historical reasons, the configuration uses terms that are no longer used elsewhere in Snowplow.

The enrichment takes these parameters:

| Parameter       | Required | Description                                                                                                                                         |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pii`           | ✅        | List of all the fields for which pseudonymization will be performed.                                                                                |
| `strategy`      | ✅        | The pseudonymization strategy which will be applied to all the fields specified in the `pii` section.                                               |
| `anonymousOnly` | ❌        | Not configurable in Console: whether to enable anonymous mode. If enabled, the enrichment masks PII only when the `SP-Anonymous` header is present. |

<Tabs groupId="deployment" queryString>
  <TabItem value="console" label="Console" default>

Configure the parameters in the Console enrichment editor. For example:

```json
{
  "pii": [
    {
      "pojo": {
        "field": "user_id"
      }
    },
    {
      "pojo": {
        "field": "user_ipaddress"
      }
    },
    {
      "json": {
        "field": "unstruct_event",
        "schemaCriterion": "iglu:com.google.analytics.measurement-protocol/user/jsonschema/1-*-*",
        "jsonPath": "$.['clientId', 'userId']"
      }
    }
  ],
  "strategy": {
    "pseudonymize": {
      "hashFunction": "SHA-1",
      "salt": "pepper123"
    }
  }
}
```

  </TabItem>
  <TabItem value="self-hosted" label="Self-Hosted">

For Self-Hosted, [provide a complete JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md). For example:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-1",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "pii_enrichment_config",
    "emitEvent": false,
    "enabled": true,
    "anonymousOnly": false,
    "parameters": {
      "pii": [
        {
          "pojo": {
            "field": "user_id"
          }
        },
        {
          "pojo": {
            "field": "user_ipaddress"
          }
        },
        {
          "json": {
            "field": "unstruct_event",
            "schemaCriterion": "iglu:com.google.analytics.measurement-protocol/user/jsonschema/1-*-*",
            "jsonPath": "$.['clientId', 'userId']"
          }
        }
      ],
      "strategy": {
        "pseudonymize": {
          "hashFunction": "SHA-1",
          "salt": "pepper123"
        }
      }
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

Note that the legacy `emitEvent` field is ignored by Enrich.

### `pii` fields

The enrichment can act on most properties in the event:
- A defined subset of [atomic event properties](/docs/fundamentals/canonical-event/index.md), including `user_id`, see below
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

Providing a field not in this list will cause a failed event.

For `json`, specify the field name as either `unstruct_event` for self-describing event fields, `contexts` for fields in entities added during tracking, or `derived_contexts` for fields in enrichment entities. Add two additional fields:
- `schemaCriterion` is the Iglu schema URI. You can specify all versions of the schema (`*-*-*`), or a specific major version (e.g. `1-*-*`), major plus minor (e.g. `1-1-*`) or a full major-minor-patch version (e.g. `1-1-1`)
- `jsonPath` is the [JSON Path statement](http://goessner.net/articles/JsonPath/) to navigate to the field or fields inside the JSON that you want to hash.

The resolved values should be primitive types (string, number, or boolean).

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

:::note[Not configurable]
This parameter isn't configurable in Console.
:::

By default, `anonymousOnly` is `false`, i.e. PII fields are always masked.

When `anonymousOnly` is set to `true`, PII fields are masked only in events tracked in anonymous mode, i.e. when the `SP-Anonymous` header is present.

This is useful for compliance with regulations such as GDPR, where you'd start with [anonymous tracking](/docs/events/anonymous-tracking/index.md) by default, and switch to non-anonymous tracking when the user consents to data collection.

This feature was added in Enrich 5.3.0.

## Output

The fields are updated in place in the event. The original values aren't stored.
