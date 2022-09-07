---
title: "Cross-batch deduplication"
date: "2020-04-25"
sidebar_position: 20
---

_(Note that the feature described below is experimental as of version 0.4.0.)_

Since version 0.4.0, Snowflake Transformer supports optional cross-batch deduplication that removes duplicate events across multiple loads using an "event manifest" DynamoDB table (not to be confused with the run manifest table). This table keeps the following information identifying events across multiple runs:

- Event id - used to uniquely identify an event
- Event fingerprint - used in conjunction with the event ID to uniquely identify duplicates
- ETL timestamp - used to check if an event is being reprocessed due to a previous run being aborted
- Time to live - timestamp allowing DynamoDB automatically clean-up stale objects (set to etl\_tstamp plus 180 days)

Cross-batch deduplication can be enabled by creating an additional config file with the following properties:

- `name` - Required human-readable configuration name, e.g. `Snowflake deduplication config`
- `id` - Required machine-readable configuration id, e.g. UUID
- `auth` - An object containing information about authentication use to read and write data to DynamoDB. Similar to the `auth` object in the main Snowflake config, this can use a `accessKeyId`/`secretAccessKey` pair or be set to `null`, in which case default credentials will be retrieved.
- `awsRegion` - AWS Region used by Transformer to access DynamoDB
- `dynamodbTable` - DynamoDB table used to store information about duplicate events
- `purpose` - Always `EVENTS_MANIFEST`

An example of this auxiliary configuration is as follows:

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/amazon_dynamodb_config/jsonschema/2-0-0",
  "data": {
    "name": "eventsManifest",
    "auth": {
      "accessKeyId": "fakeAccessKeyId",
      "secretAccessKey": "fakeSecretAccessKey"
    },
    "awsRegion": "us-east-1",
    "dynamodbTable": "acme-crossbatch-dedupe",
    "id": "ce6c3ff2-8a05-4b70-bbaa-830c163527da",
    "purpose": "EVENTS_MANIFEST"
  }
}
```

This configuration can be passed to Transformer using the optional `--events-manifest` flag, either as a file path or as a base64-encoded string if the `--base64` flag is also set.
