---
title: "Cross Navigation Enrichment"
sidebar_position: 5
sidebar_label: Cross Navigation
---

This enrichment parses the extended cross navigation format in `_sp` querystring parameter and attaches the `cross_navigation` context to an event.

The `_sp` parameter can be attached by our Web ([see cross-domain tracking](/docs/sources/trackers/web-trackers/cross-domain-tracking/index.md)) and [mobile trackers](/docs/sources/trackers/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking) and contains user, session and app identifiers (e.g., domain user and session IDs, business user ID, source app ID). The information to include in the parameters is configurable in the trackers. This is useful for tracking the movement of users across different apps and platforms.

The extended cross navigation format can be described by `_sp={domainUserId}.{timestamp}.{sessionId}.{subjectUserId}.{sourceId}.{platform}.{reason}`

If this enrichment isn't enabled, Enrich parses `_sp` querystring parameter according to the old format, `_sp={domainUserId}.{timestamp}`

## Configuration

- [Schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/cross_navigation_config/jsonschema/1-0-0)
- [Example](https://github.com/snowplow/enrich/blob/master/config/enrichments/cross_navigation_config.json)

```mdx-code-block
import TestingWithMicro from "@site/docs/reusable/test-enrichment-with-micro/_index.md"

<TestingWithMicro/>
```

## Input

This enrichment extracts `_sp` querystring parameter from the following inputs:

- The `page_url` field from the Snowplow event
- The referer uri extracted from corresponding HTTP header in the raw event

## Output

This enrichment adds a new derived context to the enriched event with [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/cross_navigation/jsonschema/1-0-0).

Also, it continues to populate `refr_domain_userid` and `refr_dvce_tstamp` enriched event fields as before.
