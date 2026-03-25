---
title: "ASN lookup enrichment"
sidebar_position: 11
sidebar_label: ASN lookup
description: "Flag bot traffic by checking autonomous system numbers against known bad ASN lists."
keywords: ["ASN lookup", "bot detection", "bad ASN", "autonomous system"]
---

:::note Availability
This enrichment is available since version 6.9.0 of Enrich.
:::

This enrichment checks the autonomous system number (ASN) attached to an event against a configurable list of ASNs associated with bots, cloud providers, or abusive networks. When a match is found, the enrichment sets `likelyBot` to `true` on the ASN [entity](/docs/fundamentals/entities/index.md) added by the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md).

This is useful for automatically flagging non-human traffic. Many bots and scrapers originate from well-known cloud hosting or data center ASNs, and community-maintained lists such as [cpuchain/bad-asn-list](https://github.com/cpuchain/bad-asn-list) track these.

:::note Prerequisite

This enrichment requires the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) to be enabled with ASN data (either the free GeoLite2 ASN database or the paid GeoIP2 ISP database). It runs immediately after IP lookup and reads the ASN entity that IP lookup produces.

:::

## Configuration

- [Enrichment schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/asn_lookups/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/asn_lookups.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

The enrichment accepts three optional parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `botAsnsFile` | object | A reference to a remotely hosted CSV file containing bad ASNs. |
| `botAsns` | array | An inline list of ASN entries to treat as bots. |
| `bypassPlatforms` | array of strings | Platform codes for which the enrichment is skipped. |

### `botAsnsFile`

Points to a CSV file with ASN numbers. The file should have a header row and use the format `number,name` (e.g., `174,"COGENT-174 - Cogent Communications, US"`). Only the number column is used for matching; the name column is for human readability and can be empty.

| Field | Type | Description |
| --- | --- | --- |
| `uri` | string | Base URI where the file is hosted. Supports `http:`, `s3:`, and `gs:` schemes. Must not end with a trailing slash. |
| `database` | string | The CSV filename. |

### `botAsns`

An inline array of ASN objects. These are combined with any entries from `botAsnsFile`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `asn` | integer | Yes | The autonomous system number. |
| `name` | string | No | A human-readable label. Used only for clarity in the configuration file. |

### `bypassPlatforms`

An array of values that correspond to the `platform` field on events. Events with a matching platform skip this enrichment entirely, because it is expected for those platforms to originate from cloud or data center ASNs.

For example, server-side tracking (`"srv"`) and IoT (`"iot"`) events typically come from cloud providers, so flagging them as bots would produce false positives.

### Example configuration

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/asn_lookups/jsonschema/1-0-0",
    "data": {
        "name": "asn_lookups",
        "vendor": "com.snowplowanalytics.snowplow.enrichments",
        "enabled": true,
        "parameters": {
            "botAsnsFile": {
                "uri": "s3://my-private-bucket/third-party/bad-asn",
                "database": "bad-asn-list.csv"
            },
            "botAsns": [
                {
                    "asn": 123,
                    "name": "ASN 123"
                },
                {
                    "asn": 456
                }
            ],
            "bypassPlatforms": ["srv", "iot"]
        }
    }
}
```

You can use the community-maintained [cpuchain/bad-asn-list](https://github.com/cpuchain/bad-asn-list) as a starting point for `botAsnsFile`. Host the CSV file in your own cloud storage to avoid depending on an external service at pipeline runtime.

:::tip Snowplow CDI

If you use Snowplow CDI, a list is already provided and updated by Snowplow. You can see the pre-configured URI of that list in the default enrichment configuration in [Console](https://console.snowplowanalytics.com).

:::

The enrichment modifies the existing ASN entity to add a bot signal when a match is found.

## Output

This enrichment modifies the ASN entity (`iglu:com.snowplowanalytics.snowplow/asn/jsonschema/1-0-1`) that the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) attaches to events where ASN information is available. When the event's ASN matches an entry in the bot list, the enrichment sets `likelyBot` to `true`:

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/asn/jsonschema/1-0-1",
    "data": {
        "number": 16509,
        "organization": "Amazon.com, Inc.",
        "likelyBot": true
    }
}
```

If the ASN does not match any entry in the bot list, or the event's platform is in `bypassPlatforms`, the `likelyBot` field is not added to the entity.

| Field | Type | Description |
| --- | --- | --- |
| `likelyBot` | boolean | Set to `true` or `false` for whether the ASN matches the bot list. Absent if the enrichment is skipped due to `bypassPlatforms`. |
