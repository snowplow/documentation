---
title: "Migration guide for Utils"
sidebar_label: "Utils"
sidebar_position: 50
---

### Upgrading to 0.14.0

- Version 1.4.0 of `dbt-core` now required
- Any custom models using the `snowplow_incremental` materialization should be changed to use the `incremental` materialization with `snowplow_optimize=true` set in the model config. `snowplow_incremental` has been deprecated
- BigQuery incremental models now require the `upsert_date_key` config
- `snowplow_utils.type_string` it has been deprecated and should be replaced with `dbt.type_string()` for non-length specific calls, and `snowplow_utils.type_max_string` for redshift strings above 256 characters.
- `snowplow_utils.get_cluster_by` and `snowplow_utils.get_partition_by` they have been deprecated and should be replaced with `snowplow_utils.get_value_by_target_type` with arg names `bigquery_val`, `databricks_val` etc.
- `snowplow_utils.snowplow_is_incremental` has been deprecated and should be replaced with standard `is_incremental()` to align with removal of the custom materialization
- You must add the following to the top level of your project yaml to take advantage of our optimized incremental materialization
    ```yml title="dbt_project.yml"
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```

### Upgrading to 0.13.0
- Version 1.3.0 of `dbt-core` now required
