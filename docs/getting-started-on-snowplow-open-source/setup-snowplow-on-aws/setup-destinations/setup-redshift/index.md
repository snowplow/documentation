---
title: "Redshift"
date: "2020-02-26"
sidebar_position: 0
---

[Amazon Redshift](https://aws.amazon.com/redshift/) is a highly scalable analytical data warehouse, working in AWS cloud. You can load into Redshift with [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md). 

In order to load data into Redshift, you need to setup an [S3 sink for enriched data](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/load-data-to-s3/index.md) first. You will also need to [bring up and configure your Redshift cluster](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/launch-a-redshift-cluster/index.md). 

Then you can begin setting up [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md). Loading enriched Snowplow data requires a transformation step and a loading step, so you'll need to select and set up both a transformer and a Redshift loader. You can find out how to do this in the [Snowplow RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) docs.