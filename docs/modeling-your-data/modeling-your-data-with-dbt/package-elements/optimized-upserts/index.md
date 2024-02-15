---
title: "Snowplow Optimized Materialization"
description: "Details on our optimized version of the dbt incremental materialization and how to enable it."
sidebar_position: 50
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This package makes use of the standard dbt `incremental` [materialization](https://docs.getdbt.com/docs/build/materializations#incremental) with an optimization applied for incremental models. Its key advantage is that it limits table scans on the target table when updating/inserting based on the new data. This improves performance and reduces cost. We do this by overriding the macro that generates the sql for the `merge` and `insert_delete` incremental methods.

All other features of the `incremental` materialization are supported including `incremental_predicates` and `on_schema_change`. The code for the overridden macro can be found [here](https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/base_incremental/common/get_merge_sql.sql).

## Usage
To enable the materialization on a model you need to ensure a `unique_key` and `upsert_date_key` are provided in the model config, and that `snowplow_optimize=true` in the config as well, e.g.

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

In addition, the following must be added to your `dbt_project.yml` file once.

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you wish to disable the buffer we apply to the upsert in the case of late arriving data (equivalent to setting `snowplow__upsert_lookback_days` to `0`) you can set `disable_upsert_lookback` to `true` in your model config. To disable the optimized upsert entirely and use the default incremental materialization, set the `snowplow_optimize` to `false` in your model config.
