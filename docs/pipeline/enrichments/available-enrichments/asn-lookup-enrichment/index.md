---
title: "ASN lookup enrichment"
sidebar_position: 11
sidebar_label: ASN lookup
description: "Flag bot traffic by checking autonomous system numbers against known bad ASN lists."
keywords: ["ASN lookup", "bot detection", "bad ASN", "autonomous system"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

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

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/asn_lookups/jsonschema/1-0-0",
    data: {
      name: "asn_lookups",
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      enabled: true,
      parameters: {
        botAsnsFile: {
          uri: "s3://my-private-bucket/third-party/bad-asn",
          database: "bad-asn-list.csv"
        },
        botAsns: [
          { asn: 123, name: "ASN 123" },
          { asn: 456 }
        ],
        bypassPlatforms: ["srv"]
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for ASN lookups enrichment config", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "asn_lookups", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "vendor": { "type": "string", "maxLength": 256 }, "name": { "type": "string", "maxLength": 256 }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "botAsnsFile": { "type": "object", "description": "Location of the CSV file with a list of ASNs known to belong to cloud, managed hosting, and colo facilities. Each line contains an ASN and possibly the organization name", "properties": { "uri": { "type": "string", "format": "uri" }, "database": { "type": "string" } }, "required": ["uri", "database"], "additionalProperties": false }, "botAsns": { "type": "array", "description": "Autonomous system numbers known to belong to cloud, managed hosting, and colo facilities, merged with the file", "items": { "type": "object", "properties": { "asn": { "type": "integer", "description": "Autonomous system number", "minimum": 0, "maximum": 2147483647 }, "name": { "type": "string", "description": "Organization associated with the autonomous system number (optional)" } }, "required": ["asn"], "additionalProperties": false } }, "bypassPlatforms": { "type": "array", "description": "Platforms for which the enrichment should not be executed, e.g. srv", "items": { "type": "string", "enum": ["web", "iot", "app", "mob", "pc", "cnsl", "tv", "srv", "headset"] } } }, "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

### `botAsnsFile`

Points to a CSV file with ASN numbers. The file should have a header row and use the format `number,name` (e.g., `174,"COGENT-174 - Cogent Communications, US"`). Only the number column is used for matching; the name column is for human readability and can be empty.

| Field      | Type   | Description                                                                                                        |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `uri`      | string | Base URI where the file is hosted. Supports `http:`, `s3:`, and `gs:` schemes. Must not end with a trailing slash. |
| `database` | string | The CSV filename.                                                                                                  |

Use the community-maintained [cpuchain/bad-asn-list](https://github.com/cpuchain/bad-asn-list) as a starting point for `botAsnsFile`. Host the CSV file in your own cloud storage to avoid depending on an external service at pipeline runtime.

:::tip[Snowplow CDI]

If you use Snowplow CDI, a list is already provided and updated by Snowplow. You can see the pre-configured URI of that list in the default enrichment configuration in [Console](https://console.snowplowanalytics.com).

:::

### `botAsns`

An inline array of ASN objects. These are combined with any entries from `botAsnsFile`.

| Field  | Type    | Required | Description                                                              |
| ------ | ------- | -------- | ------------------------------------------------------------------------ |
| `asn`  | integer | Yes      | The autonomous system number.                                            |
| `name` | string  | No       | A human-readable label. Used only for clarity in the configuration file. |

### `bypassPlatforms`

An array of values that correspond to the `platform` field on events. Events with a matching platform skip this enrichment entirely, because it is expected for those platforms to originate from cloud or data center ASNs.

For example, server-side tracking (`"srv"`) and IoT (`"iot"`) events typically come from cloud providers, so flagging them as bots would produce false positives.

## Output

The [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) adds an ASN entity to events where ASN information is available. This enrichment modifies that entity by setting `likelyBot` to `true` when the ASN matches one from the configured list of bad ASNs.

If you don't have the IP lookup enrichment enabled, or if an event doesn't have ASN information, this enrichment won't produce any output.

<SchemaProperties
  overview={{entity: true}}
  example={{
    number: 16509,
    organization: "Amazon.com, Inc.",
    likelyBot: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for ASN entity generated by IP lookup enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "asn", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "number": { "type": "integer", "minimum": 0, "maximum": 2147483647, "description": "The autonomous system number associated with the IP address" }, "organization": { "type": ["string", "null"], "description": "The organization associated with the registered autonomous system number for the IP address" }, "likelyBot": { "type": "boolean", "description": "Set to true if the ASN belongs to hosting providers, data centers, etc." } }, "required": ["number"], "additionalProperties": false }} />

The `likelyBot` field isn't included in the entity if the event's platform is in `bypassPlatforms`.
