---
title: "ASN lookup enrichment"
sidebar_position: 11
sidebar_label: ASN lookup
description: "Flag bot traffic by checking autonomous system numbers against known bad ASN lists."
keywords: ["ASN lookup", "bot detection", "bad ASN", "autonomous system"]
---

:::note[Availability]
This enrichment is available since version 6.9.0 of Enrich.
:::

This enrichment checks the autonomous system number (ASN) attached to an event against a configurable list of ASNs associated with bots, cloud providers, or abusive networks. When a match is found, the enrichment sets `likelyBot` to `true` on the ASN [entity](/docs/fundamentals/entities/index.md) added by the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md).

This is useful for automatically flagging non-human traffic. Many bots and scrapers originate from well-known cloud hosting or data center ASNs, and community-maintained lists such as [cpuchain/bad-asn-list](https://github.com/cpuchain/bad-asn-list) track these.

:::warning[VPN users]

Many VPN services also use cloud hosting. As such, this enrichment might incorrectly flag VPN users as bots (hence the `likelyBot` and not `bot` designation).

Depending on the nature of your business, VPN users might represent a meaningful portion of your traffic. If you find that to be the case, you should not rely on this enrichment as a _sole_ indicator of bots. Instead, you could use it to reinforce other indicators, e.g., unusually high number of page views in a short timeframe.

:::

## Configuration

:::note[Prerequisite]

To use this enrichment, you need to enable the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) and configure it to produce ASN data.

<details>
<summary>IP lookup configuration</summary>

If you are using the paid MaxMind database (`isp` field present in your IP lookup configuration), you don't need to do anything else.

If you are using the free MaxMind database, e.g., the one provided by Snowplow for CDI customers, your configuration will look like this:

```json
"geo": {
  "database": "GeoLite2-City.mmdb",
  "uri": "<database URI>"
}
```

Add the `asn` field:

```json
"geo": {
  "database": "GeoLite2-City.mmdb",
  "uri": "<database URI>"
},
// highlight-start
"asn": {
  "database": "GeoLite2-ASN.mmdb",
  "uri": "<same URI value as for geo>"
}
// highlight-end
```

</details>

:::

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

:::tip[Snowplow CDI]

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
