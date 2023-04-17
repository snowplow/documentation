---
title: "Setup Destinations"
date: "2020-02-26"
sidebar_position: 50
---

![](images/snowplow-aws-pipeline-storage.png)

Snowplow supports loading data into a number of different destinations:

| **Storage** | **Description** | **Status** |
| --- | --- | --- |
| [S3](/docs/destinations/warehouses-and-lakes/s3/index.md) (EMR, Kinesis) | Data is stored in the S3 file system where it can be analyzed using [EMR](http://aws.amazon.com/elasticmapreduce/) (e.g. Athena) | Production-ready |
| [Redshift](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/index.md) | A columnar database offered by AWS | Production-ready |
| [Snowflake](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/snowflake/index.md) | A columnar database available on AWS (but also GCP and Azure) | Production-ready |
| [Elasticsearch](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/elastic/index.md) | A search server for JSON documents | Production-ready |
| [Postgres](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/postgres/index.md) | An open source relational database that can be deployed via Amazon RDS | Early release |
