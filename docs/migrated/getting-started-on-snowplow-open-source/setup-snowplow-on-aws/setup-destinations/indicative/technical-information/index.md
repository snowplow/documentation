---
title: "Technical information"
date: "2021-03-26"
sidebar_position: 2000
---

### Event mapping

The relay transforms incoming events into the format expected by Indicative. Let's take this (very simplified for brevity) Snowplow enriched event in a JSON form as an example:

```
{
  "app_id": "foo",
  "platform": "web",
  "etl_tstamp": "2017-01-26 00:01:25.292",
  "collector_tstamp": "2013-11-26 00:02:05",
  "dvce_created_tstamp": "2013-11-26 00:03:57.885",
  "event": "page_view",
  "event_id": "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
  "user_id": "jon.doe@email.com",
  "user_fingerprint": "2161814971",
  "domain_userid": "bc2e92ec6c204a14",
  "network_userid": "ecdff4d0-9175-40ac-a8bb-325c49733607",
  "geo_country": "UK",
  "geo_city": "London",
  "page_url": "http://www.snowplowanalytics.com",
  "derived_contexts": {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0",
        "data": {
          "useragentFamily": "Chrome",
            "useragentMajor": "67",
            "useragentMinor": "0",
            "useragentPatch": "3396",
            "useragentVersion": "Chrome 67.0.3396",
            "osFamily": "Windows 7",
            "osMajor": null,
            "osMinor": null,
            "osPatch": null,
            "osPatchMinor": null,
            "osVersion": "Windows 7",
            "deviceFamily": "Other"
        }
      }
    ]
  },
  "domain_sessionid": "2b15e5c8-d3b1-11e4-b9d6-1681e6b88ec1",
  "derived_tstamp": "2013-11-26 00:03:57.886",
  "event_vendor": "com.snowplowanalytics.snowplow",
  "event_name": "page_view",
  "event_format": "jsonschema",
  "event_version": "1-0-0",
  "event_fingerprint": "e3dbfa9cca0412c3d4052863cefb547f",
  "true_tstamp": "2013-11-26 00:03:57.886"
}
```

It would be transformed into the following Indicative event:

```
 {
    "eventName": "page_view",
    "timestamp": "2013-11-26T00:03:57.886",
    "eventUniqueId": "jon.doe@email.com",
    "properties": {
        "app_id": "foo",
        "platform": "web",
        "etl_tstamp": "2017-01-26 00:01:25.292",
        "collector_tstamp": "2013-11-26 00:02:05",
        "dvce_created_tstamp": "2013-11-26 00:03:57.885",
        "event": "page_view",
        "event_id": "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
        "user_id": "jon.doe@email.com",
        "user_fingerprint": "2161814971",
        "domain_userid": "bc2e92ec6c204a14",
        "network_userid": "ecdff4d0-9175-40ac-a8bb-325c49733607",
        "geo_country": "US",
        "geo_city": "New York",
        "page_url": "http://www.snowplowanalytics.com",
        "domain_sessionid": "2b15e5c8-d3b1-11e4-b9d6-1681e6b88ec1",
        "derived_tstamp": "2013-11-26 00:03:57.886",
        "event_vendor": "com.snowplowanalytics.snowplow",
        "event_name": "page_view",
        "event_format": "jsonschema",
        "event_version": "1-0-0",
        "event_fingerprint": "e3dbfa9cca0412c3d4052863cefb547f",
        "true_tstamp": "2013-11-26 00:03:57.886",
        "ua_parser_context_useragentFamily": "Chrome",
        "ua_parser_context_useragentMajor": "67",
        "ua_parser_context_useragentMinor": "0",
        "ua_parser_context_useragentPatch": "3396",
        "ua_parser_context_useragentVersion": "Chrome 67.0.3396",
        "ua_parser_context_osFamily": "Windows 7",
        "ua_parser_context_osVersion": "Windows 7",
        "ua_parser_context_deviceFamily": "Other"  
    }
 }
```

As the example shows, any `null` values in the original event get removed, to make the corresponding Indicative event as compact as possible.

### [](https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki/Technical-Information#batching)

### Batching

The Lambda does not process the records one by one. Instead, it uses features of Kinesis and Indicative REST API to both read and write the events in batches. You can set the maximum batch size when creating the function. There is no minimum batch size, so the lambda can be triggered with fewer records than configured.

### [](https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki/Technical-Information#error-handling)

### Error handling

During mapping of events into Indicative event format, a failure of one event does not mean a failure of the whole batch.

Each failed case is separately logged into _CloudWatch_, while the rest are successfully submitted to Indicative. Any HTTP errors are also logged into _CloudWatch_. As of version `0.4.0`, there is no retry mechanism built in.

### [](https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki/Technical-Information#filtering)

### Filtering

There are three ways in which you can filter the stream of data going to Indicative:

- filter out specific events
- filter out specific canonical event fields
- filter out specific context fields.

With the first filter, the whole line of data containing the event will be dropped.

With the second filter, only specified fields of the canonical Snowplow event will be removed and the rest of the data for the event will be relayed.

With the third filter, all the fields belonging to the specified context(s) will be removed and the rest of the data for the event will be relayed.
