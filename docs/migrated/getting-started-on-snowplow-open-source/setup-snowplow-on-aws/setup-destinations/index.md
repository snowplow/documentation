---
title: "Setup Destinations"
date: "2020-02-26"
sidebar_position: 50
---

![](images/snowplow-aws-pipeline-storage.png)

Snowplow supports loading data into a number of different destinations:

| **Storage** | **Description** | **Status** |
| --- | --- | --- |
| [S3](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/s3-loader/) (EMR, Kinesis) | Data is stored in the S3 file system where it can be analysed using [EMR](http://aws.amazon.com/elasticmapreduce/) (e.g. Athena) | Production-ready |
| [Redshift](/docs/migrated/setup-snowplow-on-aws/setup-destinations/setup-redshift/) | A columnar database offered by AWS | Production-ready |
| [SnowflakeDB](/docs/migrated/setup-snowplow-on-aws/setup-destinations/snowflakedb/) | A columnar database available on AWS (but also GCP and Azure) | Production-ready |
| [Elasticsearch](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/elastic/) | A search server for JSON documents | Production-ready |
| [Indicative](/docs/migrated/setup-snowplow-on-aws/setup-destinations/indicative/) | A product / customer analytics tool | Production-ready |
