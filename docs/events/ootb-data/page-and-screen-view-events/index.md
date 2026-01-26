---
title: "Page and screen views"
sidebar_label: "Page and screen views"
sidebar_position: 130
description: "Track page views on web and screen views on mobile with page view IDs and screen context entities."
keywords: ["page views", "screen views", "page view tracking", "screen tracking"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Page and screen view tracking is key for understanding your users' navigation within your app.

Snowplow provides implementations for web and mobile platforms:
* Page view events on web
* Screen view events on mobile

Both page and screen views are included in the [Snowplow Unified Digital dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md). The legacy [Web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-web-data-model/index.md) and [Mobile](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-mobile-data-model/index.md) packages handle page and screen views respectively.

## Page views

Track page views to record when a user views a web page.

Page view events are [baked-in events](/docs/fundamentals/events/index.md) that have no schema. They populate the [page atomic event parameters](/docs/fundamentals/canonical-event/index.md#page-fields).

This table shows the support for page view tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                                               | Supported | Since version | Auto-tracking | Notes                                                   |
| ----------------------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ------------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/page-views/index.md)                                 | ✅         | 0.1.0         | ✅/❌           | Web page entity can be automatically added              |
| iOS                                                                                                   | ❌         |               |               |                                                         |
| Android                                                                                               | ❌         |               |               |                                                         |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md#tracking-page-view-events) | ✅         | 0.1.0         | ❌             | No web page entity                                      |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md)                    | ✅         | 0.1.0         | ✅/❌           | Only on web; web page entity can be automatically added |
| Roku                                                                                                  | ❌         |               |               |                                                         |
| Node.js                                                                                               | ❌         |               |               |                                                         |
| Golang                                                                                                | ❌         |               |               |                                                         |
| .NET                                                                                                  | ❌         |               |               |                                                         |
| [Java](/docs/sources/java-tracker/tracking-events/index.md)                                           | ✅         | 0.1.0         | ❌             | No web page entity                                      |
| [Python](/docs/sources/python-tracker/tracking-specific-events/index.md)                              | ✅         | 0.1.0         | ❌             | No web page entity                                      |
| Scala                                                                                                 | ❌         |               |               |                                                         |
| [Ruby](/docs/sources/ruby-tracker/tracking-events/index.md)                                           | ✅         | 0.1.0         | ❌             | No web page entity                                      |
| Rust                                                                                                  | ❌         |               |               |                                                         |
| PHP                                                                                                   | ❌         |               |               |                                                         |
| C++                                                                                                   | ❌         |               |               |                                                         |
| Unity                                                                                                 | ❌         |               |               |                                                         |
| Lua                                                                                                   | ❌         |               |               |                                                         |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md)                     | ✅         | v3            | ❌             |                                                         |

We recommend using the [Base web tracking plan template](/docs/event-studio/tracking-plans/tracking-plan-templates/index.md#base-web) for web tracking. It includes page views.

### Web page entity

Some trackers assign a unique identifier to every page load: the page view ID. Where available, you can configure this UUID to be added to every event tracked on that page, by tracking the `web_page` entity. This identifier can be very useful for sessionization and user journey analysis.

<SchemaProperties
  overview={{event: false}}
  example={{
    id: '024629F0-6B9B-440C-82D4-DB3CF9D31533'
   }}
  schema={{ "description": "Schema for a web page context", "properties": { "id": { "type": "string", "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$" } }, "additionalProperties": false, "type": "object", "required": [ "id" ], "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "web_page", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}} />



## Screen views

Screen view events are the mobile equivalent of page view events.

This table shows the support for screen view tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                           | Supported | Since version | Auto-tracking | Notes                                                                                         |
| --------------------------------------------------------------------------------- | --------- | ------------- | ------------- | --------------------------------------------------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/screen-views/index.md)           | ✅         | 4.2.0         | ✅/❌           | Requires screen tracking plugin; we recommend using page views instead                        |
| [iOS](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md)     | ✅         | 0.1.0         | ✅/❌           | Screen entity can be automatically added; screen view autotracking depends on platform        |
| [Android](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md) | ✅         | 0.1.0         | ✅/❌           | Screen entity can be automatically added; screen view autotracking depends on platform        |
| [React Native](/docs/sources/react-native-tracker/tracking-events/index.md)       | ✅         | 0.1.0         | ✅/❌           | Screen entity can be automatically added; add navigation handler for screen view autotracking |
| [Flutter](/docs/sources/flutter-tracker/tracking-events/index.md)                 | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [Roku](/docs/sources/roku-tracker/tracking-events/index.md)                       | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [Node.js](/docs/sources/node-js-tracker/tracking-events/index.md)                 | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [Golang](/docs/sources/golang-tracker/index.md)                                   | ✅         | 1.0.0         | ❌             | No screen entity                                                                              |
| [.NET](/docs/sources/net-tracker/index.md)                                        | ✅         | 1.3.0         |               | No screen entity                                                                              |
| [Java](/docs/sources/java-tracker/tracking-events/index.md)                       | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [Python](/docs/sources/python-tracker/tracking-specific-events/index.md)          | ✅         | 0.2.0         | ❌             | No screen entity                                                                              |
| Scala                                                                             | ❌         |               |               |                                                                                               |
| [Ruby](/docs/sources/ruby-tracker/tracking-events/index.md)                       | ✅         | 0.2.0         | ❌             | No screen entity                                                                              |
| [Rust](/docs/sources/rust-tracker/tracking-events/index.md)                       | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [PHP](/docs/sources/php-tracker/tracking-an-event/index.md)                       | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [C++](/docs/sources/c-tracker/tracking-specific-events/index.md)                  | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| [Unity](/docs/sources/unity-tracker/index.md)                                     | ✅         | 0.8.0         | ❌             | No screen entity                                                                              |
| [Lua](/docs/sources/lua-tracker/tracking-specific-events/index.md)                | ✅         | 0.1.0         | ❌             | No screen entity                                                                              |
| Google Tag Manager                                                                | ❌         |               |               |                                                                                               |

We recommend using the [Base mobile tracking plan template](/docs/event-studio/tracking-plans/tracking-plan-templates/index.md#base-mobile) for mobile tracking. It includes screen views.

Screen view events record the name and identifier of the current screen, as well as some optional properties such as the ID of the previous screen. Information about the previous screen can be useful for understanding user navigation within your application.

<SchemaProperties
  overview={{event: true}}
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

### Screen entity

Some trackers can automatically attach a `screen` entity to all events after a screen view is tracked. This entity contains information about the current, or last seen, screen.

<SchemaProperties
  overview={{event: false}}
  example={{
    "name": 'Screen 2',
    "type": 'feed',
    "id": '024629F0-6B9B-440C-82D4-DB3CF9D31533',
   }}
  schema={{ "description": "Schema for a context that represents information pertaining to the current screen being viewed when an event occurs.", "properties": { "name": { "type": "string", "description": "The name of the screen viewed." }, "type": { "type": "string", "description": "The type of screen that was viewed e.g feed / carousel." }, "id": { "type": "string", "format": "uuid", "maxLength": 36, "description": "An ID from the associated screenview event." }, "viewController": { "type": "string", "description": "iOS specific: class name of the view controller." }, "topViewController": { "type": "string", "description": "iOS specific: class name of the top level view controller." }, "activity": { "type": "string", "description": "Android specific: name of activity." }, "fragment": { "type": "string", "description": "Android specific: name of fragment." } }, "additionalProperties": false, "type": "object", "required": [ "name", "id" ], "minProperties": 2, "self": { "vendor": "com.snowplowanalytics.mobile", "name": "screen", "format": "jsonschema", "version": "1-0-0" }, "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#" }} />
