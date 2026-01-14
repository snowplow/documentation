---
title: "Geolocation and timezone tracking"
sidebar_label: "Geolocation and timezone"
description: "Track user location using IP-based geolocation enrichment or device GPS coordinates with the geolocation context entity."
keywords: ["geolocation", "IP lookup", "GPS tracking", "location data"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Snowplow provides several ways to capture location and timezone information:

- **IP-based geolocation**: the IP Lookup enrichment adds location data to the `geo_` atomic event properties based on the user's IP address.
- **Device geolocation**: client-side trackers can access GPS coordinates from the device and attach them as an entity. This requires user permission but provides more accurate location data.
- **Timezone**: most trackers can capture the device timezone and add it to the `os_timezone` atomic event property.

## Location atomic event properties

The [IP Lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) populates the `geo_` [atomic event properties](/docs/fundamentals/canonical-event/index.md#location-fields), based on the IP address of the HTTP request to the event Collector.

## Timezone atomic event property

Some Snowplow trackers can populate the `os_timezone` [atomic event field](/docs/fundamentals/canonical-event/index.md#time-and-date-fields) based on the device timezone.

Depending on the tracker, you may need to configure a plugin, set configuration on tracker initialization, or use the tracker Subject class.

### Tracker support

This table shows the support for timezone tracking across the main [Snowplow tracker SDKs](/docs/sources/index.md).

| Tracker                                                                              | Supported | Since version |
| ------------------------------------------------------------------------------------ | --------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md)      | ✅         | 3.0.0         |
| [iOS](/docs/sources/mobile-trackers/client-side-properties/index.md)                 | ✅         | 0.1.0         |
| [Android](/docs/sources/mobile-trackers/client-side-properties/index.md)             | ✅         | 0.1.0         |
| [React Native](/docs/sources/react-native-tracker/client-side-properties/index.md)   | ✅         | 0.1.0         |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md)   | ✅         | 0.1.0         |
| [Roku](/docs/sources/roku-tracker/adding-data/index.md)                              | ✅         | 0.1.0         |
| [C++](/docs/sources/c-tracker/adding-extra-data-the-subject-class/index.md)          | ✅         | 0.1.0         |
| [Go](/docs/sources/golang-tracker/adding-extra-data-the-subject-class/index.md)      | ✅         | 0.1.0         |
| [Java](/docs/sources/java-tracker/tracking-specific-client-side-properties/index.md) | ✅         | 0.4.0         |
| [.NET](/docs/sources/net-tracker/subject/index.md)                                   | ✅         | 0.1.0         |
| [Node.js](/docs/sources/node-js-tracker/configuration/index.md)                      | ✅         | 0.8.0         |
| [PHP](/docs/sources/php-tracker/subjects/index.md)                                   | ✅         | 0.1.0         |
| [Python](/docs/sources/python-tracker/subject/index.md)                              | ✅         | 0.4.0         |
| [Ruby](/docs/sources/ruby-tracker/adding-data-events/index.md)                       | ✅         | 0.3.0         |
| [Rust](/docs/sources/rust-tracker/initialization-and-configuration/index.md)         | ✅         | 0.1.0         |
| [Scala](/docs/sources/scala-tracker/subject-methods/index.md)                        | ✅         | 0.1.0         |
| [Unity](/docs/sources/unity-tracker/subject/index.md)                                | ✅         | 0.1.0         |

## Geolocation entity

Some Snowplow trackers can access device geolocation information, e.g. GPS coordinates, and attach it to events as an entity. This requires permission from the user, but is often more accurate than the IP-based geolocation.

### Tracker support

This table shows the support for geolocation tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers don't include geolocation tracking.

| Tracker                                                                            | Supported | Since version | Auto-tracking | Notes                        |
| ---------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ---------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/timezone-geolocation/index.md)    | ✅         | 3.0.0         | ✅             | Requires timezone plugin     |
| [iOS](/docs/sources/mobile-trackers/installation-and-set-up/index.md)              | ✅         | 0.6.0         | ✅             | Set in tracker configuration |
| [Android](/docs/sources/mobile-trackers/installation-and-set-up/index.md)          | ✅         | 0.6.0         | ✅             | Set in tracker configuration |
| React Native                                                                       | ❌         |               |               |                              |
| [Flutter](/docs/sources/flutter-tracker/initialization-and-configuration/index.md) | ✅         | 0.1.0         | ✅             | Set in tracker configuration |
| Roku                                                                               | ❌         |               |               |                              |

The React Native tracker did include geolocation entity configuration in earlier versions. We [deprecated it in version 4](/docs/sources/react-native-tracker/migration-guides/migrating-from-v2-x-to-v4/index.md).

### Entity definition

This entity provides geolocation data captured from the user's device:

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    latitude: 30.04335623,
    longitude: 67.59633102,
    latitude_longitude_accuracy: -24902753.22,
    altitude: -19459.88,
    altitude_accuracy: -29970651.08,
    bearing: 21055653.32,
    speed: -7127794.98,
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for client geolocation contexts", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "geolocation_context", "format": "jsonschema", "version": "1-1-0" }, "type": "object", "properties": { "latitude": { "type": "number", "minimum": -90, "maximum": 90 }, "longitude": { "type": "number", "minimum": -180, "maximum": 180 }, "latitudeLongitudeAccuracy": { "type": ["number", "null"] }, "altitude": { "type": ["number", "null"] }, "altitudeAccuracy": { "type": ["number", "null"] }, "bearing": { "type": ["number", "null"] }, "speed": { "type": ["number", "null"] }, "timestamp": { "type": ["integer", "null"] } }, "required": ["latitude", "longitude"], "additionalProperties": false }} />
