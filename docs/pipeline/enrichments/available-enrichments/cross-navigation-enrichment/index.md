---
title: "Cross-navigation enrichment"
sidebar_position: 5
sidebar_label: Cross-navigation
---

This enrichment parses the extended cross-navigation format in the `_sp` querystring parameter, and attaches a `cross_navigation` entity to an event.

Check out the [cross-navigation](/docs/events/cross-navigation/index.md) page to learn why this can be useful.

The extended cross-navigation format is `_sp={domainUserId}.{timestamp}.{sessionId}.{subjectUserId}.{sourceId}.{sourcePlatform}.{reason}`. The `domainUserId` and `timestamp` fields will always be present, but some of the other fields may be null or empty. They're configured within the tracker.

If this enrichment isn't enabled, Enrich parses the `_sp` querystring parameter according to the short format, `_sp={domainUserId}.{timestamp}`

:::note Event fields always populated
The pipeline will always populate the `refr_domain_userid` and `refr_dvce_tstamp` enriched event fields, even if this enrichment isn't enabled.
:::


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

This enrichment extracts the `_sp` querystring parameter from the `page_url` field from the Snowplow event.

## Output

This enrichment adds a new derived entity to the enriched event based on [this schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/cross_navigation/jsonschema/1-0-0).

Enrich always populates the `refr_domain_userid` and `refr_dvce_tstamp` enriched event fields.
