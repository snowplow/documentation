---
title: "Geolocation"
---

There are two options to attach geolocation information to Snowplow events:

1. Based on the user IP address in enrichments.
2. Using on device geolocation inside the Web or mobile app.

## Geolocation based on the IP address

## Geolocation in app

| geolocation context [(schema)](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema) | ✅ | ✅ | web: [geolocation plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/geolocation/) | ? |com_snowplowanalytics_snowplow_geolocation_context_1 |

#### geolocation context

| schema_name         | latitude    | longitude   | latitude_longitude_accuracy | altitude   | altitude_accuracy | bearing       | speed         |
|---------------------|-------------|-------------|-----------------------------|------------|-------------------|---------------|---------------|
| geolocation_context | 30.04335623 | 67.59633102 | -24,902,753.22              | -19,459.88 | -29,970,651.08    | 21,055,653.32 | -7,127,794.98 |
