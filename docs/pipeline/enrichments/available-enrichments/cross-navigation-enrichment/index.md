---
title: "Cross-navigation enrichment"
sidebar_position: 5
sidebar_label: Cross-navigation
description: "Parse cross-navigation data from query string parameters to track user journeys across domains and platforms."
keywords: ["cross-navigation", "cross-domain tracking", "user journey", "cross domain"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

This enrichment parses the extended cross-navigation format in the `_sp` query string parameter, and attaches a `cross_navigation` entity to an event.

Check out the [cross-navigation](/docs/events/cross-navigation/index.md) page to learn why this can be useful.

The extended cross-navigation format is `_sp={domainUserId}.{timestamp}.{sessionId}.{subjectUserId}.{sourceId}.{sourcePlatform}.{reason}`. The `domainUserId` and `timestamp` fields will always be present, but some of the other fields may be null or empty. They're configured within the tracker.

If this enrichment isn't enabled, Enrich parses the `_sp` query string parameter according to the short format, `_sp={domainUserId}.{timestamp}`

:::note[Event fields always populated]
The pipeline will always populate the `refr_domain_userid` and `refr_dvce_tstamp` enriched event fields from the cross-navigation query string, even if this enrichment isn't enabled.
:::

## Configuration

This enrichment has no configurable parameters. Enable it in Console.

For Self-Hosted, [provide the following JSON](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md):

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/cross_navigation_config/jsonschema/1-0-0",
  "data": {
    "enabled": false,
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "cross_navigation_config"
  }
}
```

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Input

This enrichment extracts the `_sp` query string parameter from the `page_url` field from the Snowplow event.

## Output

Enrich always populates the `refr_domain_userid` and `refr_dvce_tstamp` event fields when possible, regardless of whether the cross-navigation enrichment is enabled.

The enrichment adds a `cross_navigation` entity to the enriched event.

<SchemaProperties
  overview={{ entity: true }}
  example={{
    domain_user_id: "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
    timestamp: "2026-05-06T09:00:00.000Z",
    session_id: "987abc12-3456-7890-abcd-ef1234567890",
    user_id: "u_123",
    source_id: "acme-web-app",
    source_platform: "web",
    reason: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a user and session identifiers entity included in cross platform or cross domain navigation.", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "cross_navigation", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "user_id": { "description": "The business user ID, the user was identified in the source app.", "type": ["null", "string"], "maxLength": 4096 }, "domain_user_id": { "type": "string", "maxLength": 128, "description": "Domain user ID of the source app from which a link was followed. The corresponding atomic property is named refr_domain_userid." }, "session_id": { "type": ["null", "string"], "format": "uuid", "description": "Session ID of the source app from which a link was followed." }, "timestamp": { "description": "Timestamp of the link click in the source app which triggered this navigation. The corresponding atomic property is named refr_dvce_tstamp.", "type": "string", "format": "date-time" }, "source_id": { "type": ["null", "string"], "maxLength": 4096, "description": "ID of the source app where the link that started this navigation originated from." }, "source_platform": { "type": ["null", "string"], "enum": ["web", "mob", "pc", "srv", "app", "tv", "cnsl", "iot", "headset", null], "description": "Platform of the source app (e.g., mob, web, tv)." }, "reason": { "description": "Cross navigation linking information/identifier.", "type": ["null", "string"], "maxLength": 4096 } }, "required": ["domain_user_id", "timestamp"], "additionalProperties": false }} />
