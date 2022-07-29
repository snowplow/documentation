---
title: "The Snowplow web data model"
date: "2020-10-30"
sidebar_position: 10
---

## Overview

The Snowplow web data model aggregates Snowplow's out of the box page view and page ping events to create a set of derived tables - page views, sessions and users - that contain many useful dimensions as well as calculated measures such as time engaged and scroll depth.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2020/10/image-3.png?w=1024)

The model runs incrementally, only processing new events (and events that have previously been modeled but are part of page views, sessions or users for which/whom there is new information) with every run. The incremental logic is separate from the logic that calculates the tables so as to make customization of the model easier.

Deprecation notice

Please note that [snowplow/snowplow-web-data-model](https://github.com/snowplow/snowplow-web-data-model) has been deprecated. Please refer to the [sql-runner](/docs/migrated/modeling-your-data/the-snowplow-web-data-model/sql-runner-web-data-model/) or [dbt sections](/docs/migrated/modeling-your-data/the-snowplow-web-data-model/dbt-web-data-model/) for the new repositories.

## Running the web data model

There are two ways you can run the Snowplow Web data model, with [sql-runner](https://github.com/snowplow/sql-runner) or [dbt](https://github.com/dbt-labs/dbt). Below are guides to help you get started.
