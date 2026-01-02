---
title: "What do Java tracker events look like?"
sidebar_label: "What do Java tracker events look like?"
date: "2022-03-24"
sidebar_position: 60
description: "Understand the structure of enriched Java tracker events with example JSON payloads for different event types."
keywords: ["event structure", "event payload", "enriched events"]
---

See [Tracking events](/docs/sources/java-tracker/tracking-events/index.md) to learn how to track events with the Java tracker.

All Snowplow events, regardless of the tracker used, look similar. They all currently contain 137 columns/properties. Some are populated by pipeline enrichments, e.g. the [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) populates the `mkt_` columns. Snowplow event structure and columns are explained [here](/docs/fundamentals/canonical-event/index.md).

This reference page shows two simple example events generated using the default tracker configuration and a [Snowplow Micro](/docs/testing/snowplow-micro/index.md) testing pipeline. These events were tracked from a simplified version of the "simple-console" demo provided in the [Java tracker Github repository](https://github.com/snowplow/snowplow-java-tracker). While most Snowplow pipelines transform events into table rows, Micro has an API that provides events in JSON format.

The JSON below is part of the "event" value for a [ScreenView](/docs/sources/java-tracker/tracking-events/index.md#creating-a-screenview-event) event, which is a type of [SelfDescribing](/docs/sources/java-tracker/tracking-events/index.md#creating-a-custom-event-selfdescribing) event. The full Micro JSON output includes other data, such as headers. Any columns with `null` values have also been removed.

```java
// This event was tracked
ScreenView screenView = ScreenView.builder()
            .name("login")
            .id("auth123")
            .build();
```

```json
"ScreenView event (edited)": {
  "app_id": "java-tracker-sample-console-app",
  "platform": "srv",
  "etl_tstamp": "2022-03-22T15:49:56.999Z",
  "collector_tstamp": "2022-03-22T15:49:56.957Z",
  "dvce_created_tstamp": "2022-03-22T15:49:56.734Z",
  "event": "unstruct",
  "event_id": "f9a58d5d-cd13-4bfe-b9b2-5136ce1cb9fa",
  "name_tracker": "demo",
  "v_tracker": "java-0.12.0",
  "v_collector": "ssc-2.3.0-stdout$",
  "v_etl": "snowplow-micro-1.1.2-common-2.0.1",
  "user_ipaddress": "manually removed for privacy",
  "network_userid": "666219d1-9b9c-4fe1-b694-c8e94dd5a706",
  "unstruct_event": {
    "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0",
      "data": { "id": "auth123", "name": "login" }
    }
  },
  "useragent": "okhttp/4.2.2",
  "dvce_sent_tstamp": "2022-03-22T15:49:56.757Z",
  "derived_tstamp": "2022-03-22T15:49:56.934Z",
  "event_vendor": "com.snowplowanalytics.snowplow",
  "event_name": "screen_view",
  "event_format": "jsonschema",
  "event_version": "1-0-0",
}
```

Most of these properties are the default Java tracker properties, which will be present in all Java tracker events. For example, `app_id`,`platform`, and `name_tracker` were set at `Tracker` initialization.

Since this is a `SelfDescribing` event (previously called `Unstructured`), the "unstruct_event" field is also populated. The [self-describing JSON](/docs/sources/java-tracker/custom-tracking-using-schemas/index.md) provided as part of the `SelfDescribing`/`ScreenView` event has been validated against the [Iglu](/docs/api-reference/iglu/index.md) schema registry.

Below is an example `PageView` event using the default tracker configuration with Snowplow Micro. Again, the `null` columns and other sections of the payload have been removed.

```java
// This event was tracked
PageView pageViewEvent = PageView.builder()
            .pageUrl("https://www.snowplowanalytics.com")
            .build();
```

```json
"PageView event (edited)": {
  "app_id": "java-tracker-sample-console-app",
  "platform": "srv",
  "etl_tstamp": "2022-03-22T17:02:44.394Z",
  "collector_tstamp": "2022-03-22T17:02:44.268Z",
  "dvce_created_tstamp": "2022-03-22T17:02:43.913Z",
  "event": "page_view",
  "event_id": "64ae291c-2170-4643-a957-0b2f766c8ac8",
  "name_tracker": "demo",
  "v_tracker": "java-0.12.0",
  "v_collector": "ssc-2.3.0-stdout$",
  "v_etl": "snowplow-micro-1.1.2-common-2.0.1",
  "user_ipaddress": "manually removed for privacy",
  "network_userid": "bbf5eda0-f3f7-48b9-9068-b12e721a7b9c",
  "page_url": "https://www.snowplowanalytics.com",
  "page_urlscheme": "https",
  "page_urlhost": "www.snowplowanalytics.com",
  "page_urlport": 443,
  "useragent": "okhttp/4.2.2",
  "dvce_sent_tstamp": "2022-03-22T17:02:43.926Z",
  "derived_tstamp": "2022-03-22T17:02:44.255Z",
  "event_vendor": "com.snowplowanalytics.snowplow",
  "event_name": "page_view",
  "event_format": "jsonschema",
  "event_version": "1-0-0",
}
```

Because PageView is a "primitive" [event type](/docs/sources/java-tracker/tracking-events/index.md), the provided URL has populated the "atomic" `page_url` column. The different parts of the URL - scheme and host - have been automatically extracted and added to their own columns.
