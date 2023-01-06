---
title: "2.0.0 Upgrade Guide"
date: "2021-12-01"
sidebar_position: -10
---

RDB Loader 2.0.0 brings ability to send shredding complete messages from Shredder to SNS topic and splits configs of RDB Loader and RDB Shredder. From now on, Loader and Shredder will not use same config.

[Official announcement](https://discourse.snowplow.io/t/snowplow-rdb-loader-2-0-0-released/6034)

## Assets

RDB Shredder is published on S3:

- `s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-2.0.0.jar`

RDB Loader and RDB Stream Shredder distributed as Docker images, published on DockerHub:

- `snowplow/snowplow-rdb-loader:`2.0.0
- `snowplow/snowplow-rdb-stream-shredder:`2.0.0

## Sending shredding complete messages from Shredder to SNS

Shredding complete message can be sent to SNS topic with following queue configuration:

```json
"queue": {
  "type": "sns",
  "topicArn": "arn:aws:sns:eu-central-1:123456789:test-sns-topic",
  "region": "eu-central-1"
}
```

## New separate configs

RDB Loader and RDB Shredder were using the same config HOCON until version 2.0.0. Starting from 2.0.0, they will use separate configs. Reference docs for new configs can be found on the following pages:

[RDB Loader configuration](/docs/destinations/warehouses-and-lakes/rdb/previous-versions/snowplow-rdb-loader/configuration-reference/index.md)

[RDB Shredder configuration](/docs/destinations/warehouses-and-lakes/rdb/previous-versions/snowplow-rdb-loader/rdb-shredder-configuration-reference/index.md)
