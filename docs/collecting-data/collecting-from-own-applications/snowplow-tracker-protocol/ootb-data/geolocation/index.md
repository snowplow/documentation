---
title: "Geolocation"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

There are two options to attach geolocation information to Snowplow events:

1. Based on the user IP address in enrichments.
2. Using on device geolocation inside the Web or mobile app.

## Geolocation based on the IP address

:::note
TODO
:::

## Geolocation context entity tracked in apps

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
