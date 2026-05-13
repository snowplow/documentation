---
title: "Bot detection enrichment"
sidebar_position: 12
sidebar_label: Bot detection
description: "Consolidate bot indicators from multiple enrichments into a single entity for easier filtering and analysis."
keywords: ["bot detection", "bot filtering", "YAUAA", "IAB", "ASN"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

:::note[Availability]
This enrichment is available since version 6.9.0 of Enrich.
:::

Multiple enrichments can independently detect bots: [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md), [IAB](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md), and the [ASN lookup](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/index.md). In addition, the [bot detection tracker plugin](/docs/sources/web-trackers/tracking-events/bot-detection/index.md) for web can detect automated browsers client-side.

The bot detection enrichment consolidates these indicators into a single [entity](/docs/fundamentals/entities/index.md). This lets you filter bot traffic in your data models, or drop bot events entirely using a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md#discard-events).

## How bot indicators are combined

The enrichment uses "any positive = bot" logic. If any of the enabled sources flags the event as coming from a bot, the event is classified as a bot. A negative result from one source doesn't override a positive result from another. This is because none of the existing enrichments can produce a strong "not a bot" result.

Each source contributes an indicator as follows:

| Source                | Flagged as bot when                                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| YAUAA                 | `deviceClass` is `"Robot"`, `"Robot Mobile"`, or `"Robot Imitator"`, or `agentClass` is `"Robot"` or `"Robot Mobile"` in the [YAUAA entity](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) |
| IAB                   | `spiderOrRobot` is `true` in the [IAB entity](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md)                                                                                                 |
| ASN lookup            | `likelyBot` is `true` in the [ASN entity](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/index.md)                                                                                              |
| Client-side detection | `bot` is `true` in the [client-side bot detection entity](/docs/sources/web-trackers/tracking-events/bot-detection/index.md)                                                                                            |

For example, if YAUAA detects a bot based on user agent but IAB doesn't, the event is still classified as a bot. Similarly, if the ASN lookup flags the event based on a known bad ASN, that result stands regardless of what YAUAA or IAB report.

:::note[Missing sources]

It's safe to enable all sources - `useYauaa`, `useIab`, `useAsnLookups`, `useClientSideDetection` - even if some of the underlying enrichments or plugins aren't in use. If a contributing source isn't enabled or its entity isn't present, that source is silently skipped.

:::

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow.enrichments/bot_detection_enrichment_config/jsonschema/1-0-1",
    data: {
      name: "bot_detection_enrichment_config",
      vendor: "com.snowplowanalytics.snowplow.enrichments",
      enabled: true,
      parameters: {
        useYauaa: true,
        useIab: true,
        useAsnLookups: true,
        useClientSideDetection: true
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for Bot Detection enrichment config", "self": { "vendor": "com.snowplowanalytics.snowplow.enrichments", "name": "bot_detection_enrichment_config", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "useYauaa": { "type": "boolean", "description": "Whether to use YAUAA deviceClass/agentClass as a bot signal" }, "useIab": { "type": "boolean", "description": "Whether to use IAB spiders and robots as a bot signal" }, "useAsnLookups": { "type": "boolean", "description": "Whether to use ASN lookups as a bot signal" }, "useClientSideDetection": { "type": "boolean", "description": "Whether to use the client-side bot detection tracker plugin as a bot signal" } }, "required": ["useYauaa", "useIab", "useAsnLookups", "useClientSideDetection"], "additionalProperties": false } }, "required": ["vendor", "name", "enabled", "parameters"], "additionalProperties": false }} />

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

The `useClientSideDetection` parameter is available since Enrich 6.10.0.

## Output

The enrichment produces a `bot_detection` entity that summarizes all bot indicators for the event. It adds this entity to all events, even when no bot is detected.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    bot: true,
    indicators: ["yauaa", "clientSideDetection"]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for bot detection context generated by the Bot Detection enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "bot_detection", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "bot": { "type": "boolean", "description": "Whether the event is classified as coming from a bot" }, "indicators": { "type": "array", "items": { "type": "string", "enum": ["yauaa", "iab", "asnLookups", "clientSideDetection"] }, "description": "List of sources that indicated bot activity" } }, "required": ["bot", "indicators"], "additionalProperties": false }} />
