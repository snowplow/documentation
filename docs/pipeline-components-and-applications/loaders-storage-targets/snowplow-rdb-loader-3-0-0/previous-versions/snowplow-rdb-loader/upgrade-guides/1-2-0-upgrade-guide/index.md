---
title: "1.2.0 Upgrade Guide"
date: "2021-09-03"
sidebar_position: 190
---

RDB Loader 1.2.0 brings many improvements for monitoring subsystem. If you're not interested in new features - you can just bump versions. If you need webhook monitoring - read below instructions on how to enable it.

[Official announcement](https://discourse.snowplow.io/t/snowplow-rdb-loader-1-2-0-released/5571)

## Assets

RDB Shredder is published on S3:

- `s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-1.2.0.jar`

RDB Loader and RDB Stream Shredder distributed as Docker images, published on DockerHub:

- `snowplow/snowplow-rdb-loader:1.2.0`
- `snowplow/snowplow-rdb-stream-shredder:1.2.0`

## Enabling Webhook monitoring

All configuration changes are scoped to `monitoring` property.

```json
"monitoring": {
  "webhook": {
    "endpoint": "https://webhooks.acme.com/rdb-loader",
    "tags": {            # Custom set of tags
      "host": $HOST,     # Environment variables are supported
      "pipeline": "production"
    }
  }
}
```

It's up to you to setup a preferable webhook backend. It can be a Snowplow Iglu webhook or custom monitoring system.

## Enabling folder monitoring

All configuration changes are scoped to `monitoring` property.

```json
"monitoring": {
  "folders": {
    "staging": "s3://snowplow-acme-com/logging/",    # This path will contain temporary files
                                                     # Redshift role must have an access for this folder
    "period": "2 hours"                              # How often the check should be performed
  }
}
```

It's up to you to setup a preferable webhook backend. It can be a Snowplow Iglu webhook or custom monitoring system.
