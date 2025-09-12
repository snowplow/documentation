---
title: "RDB Loader 2.x.x"
description: "Previous version of Snowplow RDB Loader for behavioral data transformation and relational database loading."
schema: "TechArticle"
date: "2020-03-05"
sidebar_position: 0
---

RDB (Relational Database) Loader is a pair of applications that work in tandem to load Snowplow events into a Redshift cluster.

1. The RDB Shredder is a Spark job that reads enriched events from S3, and [shreds them into separate entities](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/shredding-overview/index.md). It also performs [event deduplication](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/previous-versions/snowplow-rdb-loader/event-deduplication/index.md).
2. The loader itself is a standalone application that executes the SQL statement that copies the shredded entities into Redshift.
