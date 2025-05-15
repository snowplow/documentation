---
title: "Cross-navigation enrichment"
sidebar_position: 5
sidebar_label: Cross-navigation
---

This enrichment parses the extended cross-navigation format in the `_sp` querystring parameter, and attaches a `cross_navigation` entity to an event.

To add the `_sp` querystring, configure cross-domain tracking in the [web](/docs/sources/trackers/javascript-trackers/web-tracker/cross-domain-tracking/index.md) or [mobile trackers](/docs/sources/trackers/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking). The querystring contains user, session, and app identifiers, for example domain user and session IDs, business user ID, or source application ID. This is useful for tracking the movement of users across different apps and platforms. The information to include in the parameters is configurable in the trackers.

:::note Base64 encoding
This enrichment expects the events to be base64-encoded. Configure this in the trackers.
:::

The extended cross-navigation format is `_sp={domainUserId}.{timestamp}.{sessionId}.{subjectUserId}.{sourceId}.{platform}.{reason}`.

If this enrichment isn't enabled, Enrich parses the `_sp` querystring parameter according to the short format `_sp={domainUserId}.{timestamp}`

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/cross_navigation_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/cross_navigation_config.json)

```json reference
https://github.com/snowplow/enrich/blob/master/config/enrichments/cross_navigation_config.json
```

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Input

This enrichment extracts `_sp` querystring parameter from the following inputs:

- The `page_url` field from the Snowplow event
- The `referer` URI extracted from corresponding HTTP header in the raw event

## Output

This enrichment adds a new derived entity to the enriched event based on [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/cross_navigation/jsonschema/1-0-0).

Also, it continues to populate `refr_domain_userid` and `refr_dvce_tstamp` enriched event fields as before.
