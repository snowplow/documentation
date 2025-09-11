---
title: "Adding Fields to a Derived Table"
description: "Add custom fields to derived tables in dbt for enhanced behavioral data analysis capabilities."
schema: "TechArticle"
keywords: ["Custom Fields", "Additional Fields", "Field Extension", "Table Enhancement", "Custom Columns", "Field Addition"]
sidebar_position: 10
---

You may often wish to add fields onto the derived tables within our packages; perhaps there is some additional dimension you need for your analysis, or some extra calculation you wish to perform. In most cases this is relatively straight forward to do, and even in the most complex case you don't need to alter the logic for the derived table itself.

## Option 1: Passthrough fields
Where possible, if the field you want to add is attached to the original event for that table (e.g. the page/screen view for views) then you can make use of the [passthrough fields](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/passthrough-fields/index.md) feature in our packages.

## Option 2: Custom aggregations
If you require aggregation at the level of the table (e.g. session identifier for sessions) you can make use of the [custom aggregations](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-aggregations/index.md) feature in our packages that support it.

## Option 3: Custom derived table
If none of the above options are suitable, the best approach is to build a custom version of our derived table, and read from the existing [this run](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/this-run-tables/index.md#other-this-run-tables) table to then add in your additional fields.

:::tip

For Redshift, if you need any additional self-describing event or entity fields in the events this run table, check out the [modeling entities](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md#custom-entities--events) page for how to add these.

:::

As an example, let's say we want to add some field to the sessions table in the unified package, that for simplicity is just going to be an `is_test` calculation based on the app_id.

### Disable the derived model in the package
The first step is to disable the derived model in the package itself. You do this in your top level project yaml:

```yaml title=dbt_project.yml
...
models:
  snowplow_unified:
    sessions:
      snowplow_unified_sessions:
        +enabled: false
```
### Add a new derived model
Next we add a new model to replace the one we just disabled; the easiest thing to do is just copy the contents of the model we just disabled. While you could name this anything, it's easiest for downstream use cases to keep the original name

```jinja2 title=models/custom_snowplow_models/snowplow_unified_sessions.sql
{{
  config(
    tags=['snowplow_unified_incremental', 'derived'],
    ...
  )
}}

select *
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(start_tstamp) as start_tstamp_date
  {%- endif %}
from {{ ref('snowplow_unified_sessions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_unified') }} --returns false if run doesn't contain new events.
```

### Modify the new model as needed
```jinja2 title=models/custom_snowplow_models/snowplow_unified_sessions.sql
{{
  config(
    ...
  )
}}

select *
  , case when app_id like '%_test' then 'test' else 'prod' end as app_type
  {% if target.type in ['databricks', 'spark'] -%}
  , DATE(start_tstamp) as start_tstamp_date
  {%- endif %}
from {{ ref('snowplow_unified_sessions_this_run') }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_unified') }} --returns false if run doesn't contain new events.
```

:::tip

If you are using BigQuery, you should look at the [combine column versions](https://github.com/snowplow/dbt-snowplow-utils?tab=readme-ov-file#combine_column_versions-source) macro we provide to automatically combine minor versions of your schemas in the model.

:::

### (Optional) Backfill the model
Follow the steps to [backfill models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/backfilling/index.md) the model if you want this field to be populated historically.
