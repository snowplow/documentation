---
title: "Snowplow optimized materialization"
sidebar_label: "Snowplow optimized materialization"
description: "Details on our optimized version of the dbt incremental materialization and how to enable it."
keywords: ["optimized upserts", "incremental materialization", "dbt optimization", "upsert performance"]
sidebar_position: 80
---

:::tip

This functionality requires dispatching to our macros over dbt core, see how to do this on the [dispatch setup](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/dispatch/index.md) page.

:::

Our packages make use of the standard dbt `incremental` [materialization](https://docs.getdbt.com/docs/build/materializations#incremental) with an optimization applied for incremental models. The advantage is that it limits table scan on the target table when updating/inserting based on the new data. This improves performance and reduces cost. We do this by overriding the macro that generates the sql for the `merge` and `insert_delete` incremental methods.

All other features of the `incremental` materialization are supported including `incremental_predicates` and `on_schema_change`. The code for the overridden macro can be found [here <Icon icon="fa-brands fa-github"/>](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/base_incremental/common/get_merge_sql.sql).

## Usage
### Controlling the buffer size
We calculate the upper and lower limit from the source table (usually a [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md) table) before adding a buffer to the lower limit to cover late arriving data or other issues with specific timestamps. This buffer is controlled by the `snowplow__upsert_lookback_days` variable and usually has a default of 30.

To disable this buffer entirely, you can either set `snowplow__upsert_lookback_days` to 0 or you can  `disable_upsert_lookback` to `true` in your ** model config** if you want to do this for a specific model. **Note this is a [model config](https://docs.getdbt.com/reference/model-configs), not a variable.**

### Adding to your own models
All our incremental models have this functionality enabled by default, but if you wish to use it in a [custom model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) you you need to ensure a `unique_key` and `upsert_date_key` are provided in the model config, and that `snowplow_optimize=true` in the config as well, e.g.

```jinja2 title="my_model.sql"
{{
  config(
    materialized='incremental',
    unique_key='page_view_id',
    upsert_date_key='start_tstamp',
    snowplow_optimize = true,
    ...
  )
}}
```

## Disabling the optimization
To disable the optimized upsert entirely and use the default incremental materialization, set the `snowplow_optimize` to `false` in your model config.
**Note this is a [model config](https://docs.getdbt.com/reference/model-configs), not a variable.**
