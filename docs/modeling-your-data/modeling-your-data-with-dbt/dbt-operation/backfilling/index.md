---
title: "Backfilling"
sidebar_position: 0
---


## Backfilling

When you first start using our packages, when you add [new custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md), or following on from a [full refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md), you may have a large period of data that needs to be processed before your models are *caught up* with your live data and the package does a [standard run](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md#state-4-standard-run).

By default our packages are set up to avoid processing large periods of data in one go, this helps to reduce the workload on your cloud, as well as reducing the impact of any issues in the data causing a single run to fail. This behavior is controlled by the `snowplow__backfill_limit_days` in all our incremental packages.

When backfilling your data, either from a full refresh, it is recommended to increase the `snowplow__backfill_limit_days` variable to as high as you feel comfortable with to reduce the number of runs that need to complete to get your processed data up to date. In general increasing this to cover 3-6 months is a good balance between speed and number of runs. **Until your data is up to date, no new data will be processed.**

:::tip

If you have added a new model it will be processed from the value in your `snowplow__start_date` variable, if you don't need the model to start from this far back then you should change this for the first run so the new model only runs from a more recent date instead.

:::
