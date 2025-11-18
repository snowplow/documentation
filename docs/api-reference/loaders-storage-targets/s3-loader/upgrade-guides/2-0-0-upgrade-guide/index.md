---
title: "S3 Loader 2.0.0 Upgrade Guide"
date: "2021-07-05"
sidebar_position: 11
---

## Caution

If you're upgrading from Snowplow pre-R119 and S3 Loader pre-version 0.7.0 you have to upgrade to version 0.7.0 or 1.0.0 first in order to split bad data produced during transition period.

In [Snowplow R119](https://snowplowanalytics.com/blog/2020/05/12/snowplow-release-r119/) we introduced a new self-describing bad rows format. S3 Loader 0.7.0 was the first version capable of partitioning self-describing data based on its schema. 0.7.0 and 1.0.0 are capable to recognize at runtime whether old or new format is consumed and use `partitionedBucket` output path only if necessary, so both formats can be consumed.

S3 Loader 2.0.0 supports only new self-describing format and will be raising exceptions if legacy bad data is pushed.

## Config file

In 2.0.0 the S3 Loader went through a major configuration refactoring. A [sample config](https://github.com/snowplow/snowplow-s3-loader/blob/2.0.0/config/config.hocon.sample) is available in GitHub repository.

- No more `aws` property allowing to hardcode credentials - [default credentials chain](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html) is used
- NSQ support has been dropped
- Instead of `kinesis` and `s3` the topology now is represented as `input` (Kinesis Stream) and `output` (S3 bucket and a Kinesis Stream for bad data)
- `partitionedBucket` property has been removed (see Caution above)
- New `purpose` property allowing Loader to recognize the data it works with: `ENRICHED` for enriched TSVs enabling latency monitoring, `SELF_DESCRIBING` generally for any self-describing JSON but usually used for bad rows and `RAW`

## New features

- `metrics.sentry.dsn` can be used to track exceptions, including internal KCL exceptions
- `metricsd.statsd` can be used to send observability data to StatsD-compatible server
