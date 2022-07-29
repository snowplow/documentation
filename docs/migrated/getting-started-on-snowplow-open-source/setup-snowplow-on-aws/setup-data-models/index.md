---
title: "Setup Data Models"
date: "2020-02-26"
sidebar_position: 60
---

![](images/snowplow-aws-pipeline-datamodeling.png)

Once your data is stored in S3 and Redshift, the basic setup is complete. You now have access to the event stream: a long list of packets of data, where each packet represents a single event. While it is possible to do analysis directly on this event stream, it is common to:

1. Join event-level data with other data sets (e.g. customer data)
2. Aggregate event-level data into smaller data sets (e.g. sessions)
3. Apply business logic (e.g. user segmentation)

We call this process _data modeling_. The data model is usually developed in three stages.

## Step 1: Implement the standard data model

The basic data model can be downloaded from [GitHub](https://github.com/snowplow/data-models) and the underlying logic explained in more detail in the [technical documentation](https://snowplowanalytics.com/blog/2016/03/16/introduction-to-event-data-modeling/).

## Step 2: Customize the SQL data model

The basic model can then be modified to include business-specific logic. This could mean adding e-commerce fields or aggregating events in different ways, ideally joining Snowplow data with other data sets (e.g. customer data). For more information on this, check out [the relevant section of the documentation](/docs/migrated/modeling-your-data/the-snowplow-web-data-model/#Customizing_the_model).

## SQLRunner

The data model consists of a set of SQL queries which are executed in sequence using our [SQLRunner application](https://github.com/snowplow/sql-runner). The order in which the queries are executed is determined by a config file, an example of which can be found on [GitHub](https://github.com/snowplow/web-data-model/blob/master/sql-runner/playbooks/web-model.yml.tmpl).
