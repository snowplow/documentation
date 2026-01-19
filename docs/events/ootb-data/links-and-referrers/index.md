---
title: "Referrers, links, and cross-navigation events"
sidebar_label: "Links and referrers"
sidebar_position: 90
description: "Track page referrers, deep links in mobile apps, and cross-navigation links."
keywords: ["referrers", "deep links", "cross-navigation", "message notifications"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Understanding how users arrive at your pages and navigate between them is essential for analyzing traffic sources, marketing effectiveness, and user journeys. Snowplow captures referrer information, deep link data, and link click events to give you a complete picture of cross-page and cross-app navigation.

## Referrer atomic event property

Some Snowplow trackers can populate the `page_referrer` [atomic event property](/docs/fundamentals/canonical-event/index.md#page-fields). This field captures the URL of the page that referred the user to the current page.

This table shows the support for page referrer tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers don't include referrer tracking.

| Tracker                                                                                                        | Supported | Since version                                      | Auto-tracking | Notes                              |
| -------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------- | ------------- | ---------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/page-views/index.md#tracking-a-page-view)                     | ✅         | 0.1.0                                              | ✅             | Automatic for all page view events |
| [iOS](/docs/sources/mobile-trackers/tracking-events/index.md#tracking-deep-links)                              | ✅         | 3.0.0 (deep link events), 4.1.0 (deep link entity) | ❌             | Based on Deep Link events          |
| [Android](/docs/sources/mobile-trackers/tracking-events/index.md#tracking-deep-links)                          | ✅         | 3.0.0 (deep link events), 4.1.0 (deep link entity) | ❌             | Based on Deep Link events          |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md#tracking-deep-link-received-events) | ✅         | 1.1.0                                              | ❌             | Based on Deep Link events          |
| Flutter                                                                                                        | ❌         |                                                    |               |                                    |
| Roku                                                                                                           | ❌         |                                                    |               |                                    |

The web trackers automatically populate the `page_referrer` [atomic event property](/docs/fundamentals/canonical-event/index.md#page-fields) in all page view events.

### Deep links for mobile

Deep links are URLs or hyperlinks that take users directly to a particular location within a mobile app. They're received by the mobile operating system and passed to the related app.

Most events tracked on mobile unsurprisingly don't include webpage atomic properties. However, the mobile trackers can capture both the URL of the deep link and the referrer URL (if available).

You'll need to manually track any received deep links, using the `deep_link_received` event.

The `deep_link_received` event, as well as the first subsequent screen view event, include the `page_url` and `page_referrer` atomic event properties.

<SchemaProperties
  overview={{event: true}}
  example={{
    url: 'https://example.com/notes/123',
    referrer: 'https://snowplow.io'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Represents a deep-link received in the app.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "deep_link_received", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "url": { "type": "string", "description": "URL in the received deep-link", "format": "uri", "maxLength": 4096 }, "referrer": { "type": "string", "description": "Referrer URL, source of this deep-link", "format": "uri", "maxLength": 4096 } }, "required": ["url"], "additionalProperties": false }} />

The tracker will automatically add this `deep_link` entity to the next screen view event after tracking the `deep_link_received` event.

<SchemaProperties
  overview={{event: false}}
  example={{
    url: 'https://example.com/notes/123',
    referrer: 'https://snowplow.io'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Entity that indicates a deep-link has been received and processed.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "deep_link", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "url": { "type": "string", "description": "URL in the received deep-link", "format": "uri", "maxLength": 4096 }, "referrer": { "type": "string", "description": "Referrer URL, source of this deep-link", "format": "uri", "maxLength": 4096 } }, "required": ["url"], "additionalProperties": false }} />

## Link clicks

The web trackers can automatically track link click events, capturing details about the clicked link such as its URL, element ID, classes, target, and content.

This table shows the support for link click tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers don't include link click tracking.

| Tracker                                                                           | Supported | Since version                                 | Auto-tracking | Notes                             |
| --------------------------------------------------------------------------------- | --------- | --------------------------------------------- | ------------- | --------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/link-click/index.md)             | ✅         | 0.7.0 (limited functionality), 3.0.0 (plugin) | ✅             | Requires link click plugin        |
| iOS                                                                               | ❌         |                                               |               |                                   |
| Android                                                                           | ❌         |                                               |               |                                   |
| React Native                                                                      | ❌         |                                               |               |                                   |
| Flutter                                                                           | ❌         |                                               |               |                                   |
| Roku                                                                              | ❌         |                                               |               |                                   |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md) | ✅         | v3                                            | ✅             | Integrates with link click plugin |

To track link clicks on web using React Native or Flutter, you can implement custom event tracking when users interact with links in your app using the `link_click` event schema.

We recommend using the [Base web data product template](/docs/data-product-studio/data-products/data-product-templates/index.md#base-web) for web tracking. It includes link clicks.

<SchemaProperties
  overview={{event: true}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a link click event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "link_click", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "elementId": { "type": "string" }, "elementClasses": { "type": "array", "items": { "type": "string" } }, "elementTarget": { "type": "string" }, "targetUrl": { "type": "string", "minLength": 1 }, "elementContent": { "type": "string" } }, "required": ["targetUrl"], "additionalProperties": false }} />

## Cross-domain tracking

Read more about tracking cross-domain in the [cross-navigation page](/docs/events/cross-navigation/index.md).
