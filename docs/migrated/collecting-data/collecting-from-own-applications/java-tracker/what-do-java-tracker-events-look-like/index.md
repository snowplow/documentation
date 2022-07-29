---
title: "What do Java tracker events look like?"
date: "2022-03-24"
sidebar_position: 60
---

See [Tracking events](/docs/migrated/collecting-data/collecting-from-own-applications/java-tracker/tracking-events/) to learn how to track events with the Java tracker.

All Snowplow events, regardless of the tracker used, look similar. They all currently contain 137 columns/properties. Some are populated by pipeline enrichments, e.g. the [campaign attribution enrichment](/docs/migrated/enriching-your-data/available-enrichments/campaign-attribution-enrichment/) populates the `mkt_` columns. Snowplow event structure and columns are explained [here](/docs/migrated/understanding-your-pipeline/canonical-event/).

This reference page shows two simple example events generated using the default tracker configuration and a [Snowplow Micro](/docs/migrated/understanding-your-pipeline/what-is-snowplow-micro/) testing pipeline. These events were tracked from a simplified version of the "simple-console" demo provided in the [Java tracker Github repository](https://github.com/snowplow/snowplow-java-tracker). While most Snowplow pipelines transform events into table rows, Micro pipelines produce JSON. There are no [pipeline enrichments](/docs/migrated/enriching-your-data/what-is-enrichment/) in Micro.

The JSON below is part of the "event" value for a [ScreenView](/docs/migrated/collecting-data/collecting-from-own-applications/java-tracker/tracking-events/#creating-a-screenview-event) event, which is a type of [Unstructured](/docs/migrated/collecting-data/collecting-from-own-applications/java-tracker/tracking-events/#creating-a-custom-event-unstructured-events) (self-describing) event. The full Micro JSON output includes other data, such as headers. Any columns with `null` values have also been removed.

```
// This event was tracked
ScreenView screenView = ScreenView.builder()
            .name("login")
            .id("auth123")
            .build();
```

```
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

Since this is a `Unstructured` event, the "unstruct\_event" field is also populated. The [self-describing JSON](/docs/migrated/collecting-data/collecting-from-own-applications/java-tracker/custom-tracking-using-schemas/) provided as part of the `Unstructured`/`ScreenView` event has been validated against the [Iglu](/docs/migrated/pipeline-components-and-applications/iglu/) schema registry.

Below is an example `PageView` event using the default tracker configuration with Snowplow Micro. Again, the `null` columns and other sections of the payload have been removed.

```
// This event was tracked
PageView pageViewEvent = PageView.builder()
            .pageUrl("https://www.snowplowanalytics.com")
            .build();
```

```
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

Because PageView is a "primitive" [event type](/docs/migrated/collecting-data/collecting-from-own-applications/java-tracker/tracking-events/), the provided URL has populated the "atomic" `page_url` column. The different parts of the URL - scheme and host - have been automatically extracted and added to their own columns.
