---
title: "Telemetry"
date: "2022-10-13"
sidebar_position: 100
---

Snowplow collects heartbeats with some meta-information about the application (schema [here](https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.oss/oss_context/jsonschema/1-0-1)). This is done to help us to improve the product, we need to understand what is popular, so we could focus our development effort in the right place.

Telemetry was introduced in version 4.0.0 of Transformer Kinesis and version 5.0.0 of Transformer Pubsub, Redshift Loader, Snowflake Loader, Databricks Loader.

At the base, telemetry is sending the application name and version every hour. You can help us by providing `userProvidedId` in the config file :

```json
"telemetry" {
  "userProvidedId": "myCompany"
}
```

Telemetry can be deactivated by putting the following section in the configuration file :

```json
"telemetry": {
  "disable": true
}
```