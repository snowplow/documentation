---
title: "RDB Loader 2.x.x"
date: "2020-03-05"
sidebar_position: 200
---

RDB (Relational Database) Loader is a pair of applications that work in tandem to load Snowplow events into a Redshift cluster.

1. The RDB Shredder is a Spark job that reads enriched events from S3, and [shreds them into separate entities](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/previous-versions/snowplow-rdb-loader/shredding-overview/index.md). It also performs [event deduplication](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/previous-versions/snowplow-rdb-loader/event-deduplication/index.md).
2. The loader itself is a standalone application that executes the SQL statement that copies the shredded entities into Redshift.

Before setting up RDB Loader its recommended to [setup and launch Redshift cluster](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/index.md) first.
