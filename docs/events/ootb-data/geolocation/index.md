---
title: "Geolocation"
sidebar_label: "Geolocation"
description: "Track user location using IP-based geolocation enrichment or device GPS coordinates with the geolocation context entity."
keywords: ["geolocation", "IP lookup", "GPS tracking", "location data"]
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

There are two options to attach geolocation information to Snowplow events:

1. Based on the user IP address in enrichments.
2. Using on device geolocation inside the Web or mobile app.

## Geolocation based on the IP address

Geolocation information can be automatically extracted from the IP address of the HTTP request to the collector.
This is done during enrichment using the [IP Lookup Enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md).

You can see the information added to events as [atomic event properties in this table](/docs/fundamentals/canonical-event/index.md#location-fields).

## Geolocation context entity tracked in apps

Geolocation information can also be fetched in the app using our trackers and attached to events as a context entity.
This is often more accurate than the IP-based geolocation but requires permission from the user.

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

### How to track?

* [Using the JavaScript tracker](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md#geolocation-context).
* Using the `TrackerConfiguration` object [on the Android tracker](https://snowplow.github.io/snowplow-android-tracker/snowplow-android-tracker/com.snowplowanalytics.snowplow.configuration/-tracker-configuration/geo-location-context.html) and [the iOS tracker](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/trackerconfiguration/geolocationcontext(_:)).
