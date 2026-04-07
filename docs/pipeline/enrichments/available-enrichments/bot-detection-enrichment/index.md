---
title: "Bot detection enrichment"
sidebar_position: 12
sidebar_label: Bot detection
description: "Consolidate bot indicators from multiple enrichments into a single entity for easier filtering and analysis."
keywords: ["bot detection", "bot filtering", "YAUAA", "IAB", "ASN"]
---

:::note Availability
This enrichment is available since version 6.9.0 of Enrich.
:::

Multiple enrichments can independently detect bots: [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md), [IAB](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md), and the [ASN lookup](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/index.md). In addition, the [bot detection tracker plugin](/docs/sources/web-trackers/tracking-events/bot-detection/index.md) for web can detect automated browsers client-side. Without this enrichment, you would need to check each source separately during data modeling to determine whether an event came from a bot.

The bot detection enrichment consolidates these indicators into a single [entity](/docs/fundamentals/entities/index.md). It reads the output of the contributing enrichments and the client-side bot detection plugin, and produces a `bot_detection` entity with a simple `bot` boolean and a list of which sources flagged the event. This lets you filter bot traffic in your data models, or drop bot events entirely using a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/examples/index.md#filtering-out-bots).

## How bot indicators are combined

The enrichment uses "any positive = bot" logic. If any of the enabled sources flags the event as coming from a bot, the event is classified as a bot. A negative result from one source doesn't override a positive result from another. This is because none of the existing enrichments can produce a strong "not a bot" result.

Each source contributes a indicator as follows:

| Source                | Flagged as bot when                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| YAUAA                 | `deviceClass` is `"Robot"`, `"Robot Mobile"`, or `"Robot Imitator"`, or `agentClass` is `"Robot"` or `"Robot Mobile"` in the YAUAA entity |
| IAB                   | `spiderOrRobot` is `true` in the IAB entity                                                                                               |
| ASN lookup            | `likelyBot` is `true` in the ASN entity                                                                                                   |
| Client-side detection | `bot` is `true` in the `client_side_bot_detection` entity                                                                                 |

For example, if YAUAA detects a bot based on user agent but IAB does not, the event is still classified as a bot. Similarly, if the ASN lookup flags the event based on a known bad ASN, that result stands regardless of what YAUAA or IAB report.

:::note Missing sources

It's safe to enable all sources (`useYauaa`, `useIab`, `useAsnLookups`, `useClientSideDetection`) even if some of the underlying enrichments or plugins are not in use. If a contributing source is not enabled or its entity is not present, that source is silently skipped.

:::

## Configuration

- [Enrichment schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/bot_detection_enrichment_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/bot_detection_enrichment_config.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

The enrichment accepts three required boolean parameters and one optional parameter that control which sources are consulted:

| Parameter                | Type               | Description                                                                                                                                                                                                    |
| ------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useYauaa`               | boolean            | Consult the [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) output for bot indicators.                                                                          |
| `useIab`                 | boolean            | Consult the [IAB enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) output for bot indicators.                                                                              |
| `useAsnLookups`          | boolean            | Consult the [ASN lookup enrichment](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/index.md) output for bot indicators.                                                                |
| `useClientSideDetection` | boolean (optional) | Consult the `client_side_bot_detection` entity from the [bot detection tracker plugin](/docs/sources/web-trackers/tracking-events/bot-detection/index.md). Defaults to `false`. Available since Enrich 6.10.0. |

### Example configuration

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/bot_detection_enrichment_config/jsonschema/1-0-0",
    "data": {
        "name": "bot_detection_enrichment_config",
        "vendor": "com.snowplowanalytics.snowplow.enrichments",
        "enabled": true,
        "parameters": {
            "useYauaa": true,
            "useIab": true,
            "useAsnLookups": true,
            "useClientSideDetection": true
        }
    }
}
```

The enrichment produces a single entity that summarizes all bot indicators for the event.

## Output

When enabled, this enrichment always attaches a `bot_detection` entity (`iglu:com.snowplowanalytics.snowplow/bot_detection/jsonschema/1-0-1`) to every event, even when no bot is detected.

| Field        | Type             | Description                                                                                                                                          |
| ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bot`        | boolean          | `true` if any enabled source flagged the event as a bot, `false` otherwise.                                                                          |
| `indicators` | array of strings | Which sources flagged the event as a bot. Possible values: `"yauaa"`, `"iab"`, `"asnLookups"`, `"clientSideDetection"`. Empty when `bot` is `false`. |

### Example: bot detected by multiple sources

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/bot_detection/jsonschema/1-0-1",
    "data": {
        "bot": true,
        "indicators": ["yauaa", "clientSideDetection"]
    }
}
```

### Example: no bot detected

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow/bot_detection/jsonschema/1-0-1",
    "data": {
        "bot": false,
        "indicators": []
    }
}
```
