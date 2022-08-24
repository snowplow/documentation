---
title: "Redshift"
date: "2020-02-26"
sidebar_position: 0
---

[Amazon Redshift](https://aws.amazon.com/redshift/) is a highly scalable analytical warehouse, working in AWS cloud. Snowplow pipeline provides loading data into Redshift with [RDB Shredder](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/previous-versions/snowplow-rdb-loader/rdb-shredder-configuration-reference/index.md) and [RDB Loader](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/rdb-loader-1-1-0/index.md) apps.

Before 2021, a primary way to load data into Redshift was using EmrEtlRunner orchestration tool. After [RDB Loader R35 release](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/previous-versions/snowplow-rdb-loader/upgrade-guides/r35-upgrade-guide/index.md#new-configuration-file) we're deprecating EmrEtlRunner and recommend to use stand-alone Loader setup.

In order to load data into Redshift, you need to setup an [S3 sink for enriched data](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/load-data-to-s3/index.md) first.
