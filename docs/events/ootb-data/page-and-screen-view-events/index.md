---
title: "Page and screen views"
description: "Page view and screen view events captured automatically by Snowplow trackers for behavioral analytics."
schema: "TechArticle"
keywords: ["Page Views", "Screen Views", "View Events", "Navigation Analytics", "View Tracking", "Page Analytics"]
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

Page and screen view events are important events for tracking the navigation within your app.
Page views are tracked on Web and screen views on mobile.

## Page view events

Page view tracking is used to record views of web pages.

Under the hood, the page view events are not self-describing events but standard events with the event type `pv`.
The tracked information includes the page URL and title.
You can see an overview of the [page fields in the atomic events table here](/docs/fundamentals/canonical-event/index.md#page-fields).

Additionally, the page view is assigned an identifier – the page view ID.
This is tracked in the `web_page` context entity in that page view event and for all events on that page.

<SchemaProperties
  overview={{event: false, web: true, mobile: false, automatic: true}}
  example={{
    id: '024629F0-6B9B-440C-82D4-DB3CF9D31533'
   }}
  schema={{ "description": "Schema for a web page context", "properties": { "id": { "type": "string", "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$" } }, "additionalProperties": false, "type": "object", "required": [ "id" ], "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "web_page", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}} />

### How to track?

See the [documentation for the JavaScript tracker](/docs/sources/trackers/web-trackers/tracking-events/index.md#page-views) to learn how to track a page view event.

## Screen view events

Screen view events are the equivalent of the page view events for mobile apps.
In contrast with page view events, screen view events are self-describing events.

<SchemaProperties
  overview={{event: true, web: false, mobile: true, automatic: 'Depends on the app framework'}}
  example={{
    "name": 'Screen 2',
    "type": 'feed',
    "id": '024629F0-6B9B-440C-82D4-DB3CF9D31533',
    "previousName": 'Screen 1',
    "previousId": '86ffd23c-b844-4ed4-aae9-7796b8b6f1e4',
    "previousType": 'feed',
    "transitionType": 'push'
   }}
  schema={{ "description": "Schema for a screen view event", "properties": { "name": { "type": "string", "description": "The name of the screen viewed." }, "type": { "type": "string", "description": "The type of screen that was viewed e.g feed / carousel." }, "id": { "type": "string", "format": "uuid", "maxLength": 36, "description": "An ID from the associated screenview event." }, "previousName": { "type": "string", "description": "The name of the previous screen." }, "previousId": { "type": "string", "format": "uuid", "description": "A screenview ID of the previous screenview." }, "previousType": { "type": "string", "description": "The screen type of the previous screenview." }, "transitionType": { "type": "string", "description": "The type of transition that led to the screen being viewed." } }, "additionalProperties": false, "type": "object", "required": [ "name", "id" ], "minProperties": 2, "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen_view", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

After a screen view event is tracked, the tracker attaches a screen context entity to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

<SchemaProperties
  overview={{event: false, web: false, mobile: true, automatic: true}}
  example={{
    "name": 'Screen 2',
    "type": 'feed',
    "id": '024629F0-6B9B-440C-82D4-DB3CF9D31533',
   }}
  schema={{ "description": "Schema for a context that represents information pertaining to the current screen being viewed when an event occurs.", "properties": { "name": { "type": "string", "description": "The name of the screen viewed." }, "type": { "type": "string", "description": "The type of screen that was viewed e.g feed / carousel." }, "id": { "type": "string", "format": "uuid", "maxLength": 36, "description": "An ID from the associated screenview event." }, "viewController": { "type": "string", "description": "iOS specific: class name of the view controller." }, "topViewController": { "type": "string", "description": "iOS specific: class name of the top level view controller." }, "activity": { "type": "string", "description": "Android specific: name of activity." }, "fragment": { "type": "string", "description": "Android specific: name of fragment." } }, "additionalProperties": false, "type": "object", "required": [ "name", "id" ], "minProperties": 2, "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />

### How to track?

* [Documentation for the iOS and Android trackers](/docs/sources/trackers/mobile-trackers/tracking-events/screen-tracking/index.md).
* [Documentation for the React Native tracker](/docs/sources/trackers/react-native-tracker/tracking-events/screen-tracking/index.md).
* [Documentation for the Flutter tracker](/docs/sources/trackers/flutter-tracker/tracking-events/index.md#track-screen-views-withscreenview).

## Use in modeling

Page and screen view events are used by our dbt packages to model web and mobile data.
The [Snowplow Web Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) as well as the [Snowplow Mobile Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-mobile-data-model/index.md) use them to provided aggregated page and screen tables.
