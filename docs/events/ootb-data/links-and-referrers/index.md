---
title: "Referrers, deep links and cross-navigation events"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

<TOCInline toc={toc} maxHeadingLevel={2} />

## Page referrer information on Web

Along with page view events, the tracker tracks the URL of the referring page that linked to the current page.
The URL is tracked in the atomic event properties, under the `page_referrer` property.

| **Table Column**                                 | **Type** | **Description**                                               | **Example values**                                                                                                      |
|---------------------------------------------|----------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `page_referrer`                             | text     | Referrer URL                                                  | `https://www.snowplow.io/`                                                                                       |

## Deep links in mobile apps

Deep links are URLs or hyperlinks that take users directly to a particular location within a mobile app. They are received by the mobile operating system and passed to the related app.

### Deep link received event

This event is manually tracked when the deep link is received in the app.

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: false}}
  example={{
    url: 'https://example.com/notes/123',
    referrer: 'https://snowplow.io'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Represents a deep-link received in the app.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "deep_link_received", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "url": { "type": "string", "description": "URL in the received deep-link", "format": "uri", "maxLength": 4096 }, "referrer": { "type": "string", "description": "Referrer URL, source of this deep-link", "format": "uri", "maxLength": 4096 } }, "required": ["url"], "additionalProperties": false }} />

### Context entity attached to screen view events

This context entity is attached to the first screen view event automatically after tracking the deep link received event.

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    url: 'https://example.com/notes/123',
    referrer: 'https://snowplow.io'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Entity that indicates a deep-link has been received and processed.", "self": { "vendor": "com.snowplowanalytics.mobile", "name": "deep_link", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "url": { "type": "string", "description": "URL in the received deep-link", "format": "uri", "maxLength": 4096 }, "referrer": { "type": "string", "description": "Referrer URL, source of this deep-link", "format": "uri", "maxLength": 4096 } }, "required": ["url"], "additionalProperties": false }} />

### How to track?

* See the documentation for the [iOS and Android tracker](https://docs.snowplow.io/docs/sources/mobile-trackers/tracking-events/#tracking-deep-links).
* [Documentation for the React Native tracker](https://docs.snowplow.io/docs/sources/react-native-tracker/tracking-events/#tracking-deep-link-received-events).

## Link click tracking on Web

Link click tracking feature in the JavaScript tracker enables automatic capturing of link click events as the user clicks on links on the page.

<SchemaProperties
  overview={{event: true, web: true, mobile: false, automatic: true}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a link click event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "link_click", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "elementId": { "type": "string" }, "elementClasses": { "type": "array", "items": { "type": "string" } }, "elementTarget": { "type": "string" }, "targetUrl": { "type": "string", "minLength": 1 }, "elementContent": { "type": "string" } }, "required": ["targetUrl"], "additionalProperties": false }} />

### How to track?

See the [link click tracking documentation for the JavaScript tracker](/docs/sources/web-trackers/tracking-events/index.md#link-click-tracking).

## Cross-domain tracking on Web

The JavaScript Tracker can add an additional parameter named “_sp” to the querystring of outbound links. This process is called “link decoration”. The `_sp` value includes the domain user ID for the current page and the time at which the link was clicked (according to the device's clock).

When the `_sp` parameter is present in the page URL, enrichment uses it to assign two properties to events: `refr_domain_userid` with the user identifier and `refr_tstamp` with the timestamp of the click on the link.

### How to track?

See the [documentation for cross-domain tracking on the JavaScript tracker](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md#cross-domain-tracking) for instructions.
