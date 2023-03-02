---
title: "Snowplow Materialization (Pre-Release)"
unlisted: true
sidebar_position: 400
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

We are in the process of moving our packages away from the custom `snowplow_incremental` [materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md) to instead use the default `incremental` materialization, with an overridden macro for generating the sql to deliver the same performance benefit our custom materialization has done for years.

Currently we are in pre-release in the `snowplow_utils` package (which contains the materialization), and in `snowplow_web` which uses it, to test the new version for any adverse issues or performance slow downs. The expectation is users will see no difference in performance but will gain access to newer dbt materialization features such as [`on_schema_change`](https://docs.getdbt.com/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change), and it will simplify the workflow of using our packages.

## Instructions

To enable the new macro to override the default dbt sql generation you **must** add the following to the top level of your `dbt_project.yml` file:

```yaml
# dbt_project.yml
...
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```
This will ensure that dbt looks in `snowplow_utils` first for the macro that generates the sql, only then looking in dbt after. Without this the models will still run correctly, but you will not get the performance benefit. 

:::caution

While we have done our best to have alternative name for the rest of our macros than `dbt-core` there may be some other macros that we have overwritten or have the same name as, so if you notice any unexpected behavior with your models due to this please [raise an issue](https://github.com/snowplow/dbt-snowplow-utils/issues) so we can get it fixed.

:::

To use the optimized materialization in your custom models, you must set `snowplow_optimize` to `true` in your model config and, as before, `unique_key` and `upsert_date_key` must be set. If you wish to disable the buffer we apply to the upsert in the case of late arriving data (defined by `snowplow__upsert_lookback_days`) you can set `disable_upsert_lookback` to `true` in your model config.
