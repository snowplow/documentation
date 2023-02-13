---
title: "Configuration"
description: "Information for the configuration of our dbt packages"
sidebar_position: 350
---

:::info

This page details general configurations that can apply across many of our packages, each package has specific configuration variables that define how the models run, please see each child page for the specifics of each package.

::: 

## Mixing Variables

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

```mdx-code-block
import DbtVariables from "@site/docs/reusable/dbt-variables/_index.md"

<DbtVariables/>
```

## Disabling a standard module

If you do not require certain modules provided by the package you have the option to disable them. For instance to disable the users module in the `snowplow_web` package:

```yml
# dbt_project.yml
...
models:
  snowplow_web:
    users:
      enabled: false
```

Note that any dependent modules will also need to be disabled - for instance if you disabled the sessions module in the web package, you will also have to disable the users module.


## Warehouse specific configurations
### Postgres

In most modern analytical data warehouses constraints are usually either unsupported or unenforced. For this reason it is better to use dbt to assert the data constraints without actually materializing them in the database using `dbt test`. Here you can test the constraint is unique and not null. The snowplow_web package already includes these dbt tests for primary keys, see the testing section for more details.

To optimism performance of large Postgres datasets you can create [indexes](https://docs.getdbt.com/reference/resource-configs/postgres-configs#indexes) in your dbt model config for columns that are commonly used in joins or where clauses. For example:

``` yaml
# snowplow_web_sessions_custom.sql
{{
  config(
    ...
    indexes=[{'columns': [‘domain_sessionid’], 'unique': True}]
  )
}}
```

### Databricks

You can connect to Databricks using either the `dbt-spark` or the `dbt-databricks` connectors. The `dbt-spark` adapter does not allow dbt to take advantage of certain features that are unique to Databricks, which you can take advantage of when using the `dbt-databricks` adapter. Where possible, we would recommend using the `dbt-databricks` adapter.

#### Unity Catalog support

With the rollout of Unity Catalog (UC), the `dbt-databricks` adapter has added support in dbt for the three-level-namespace as of `dbt-databricks>=1.1.1`. As a result of this, we have introduced the `snowplow__databricks_catalog` variable which should be used **if** your Databricks environment has UC enabled, and you are using a version of the `dbt-databricks` adapter that supports UC. The default value for this variable is `hive_metastore` which is also the default name of your UC, but this can be changed with the `snowplow__databricks_catalog` variable.

Since there are many different situations, we've created the following table to help guide your setup process (this should help resolve the `Cannot set database in Databricks!` error):

|                                             | Adapter supports UC and UC Enabled                                                                   | Adapter supports UC and UC not enabled         | Adapter does not support UC                                                                         |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Events land in default `atomic` schema      | `snowplow__databricks_catalog` = '{name_of_catalog}'                                                 | Nothing needed                                 | `snowplow__databricks_catalog` = 'atomic'                                                           |
| Events land in custom schema (not `atomic`) | `snowplow__atomic_schema` = '{name_of_schema}'  `snowplow__databricks_catalog` = '{name_of_catalog}' | `snowplow__atomic_schema` = '{name_of_schema}' | `snowplow__atomic_schema` = '{name_of_schema}'  `snowplow__databricks_catalog` = '{name_of_schema}' |

#### Optimization of models

The `dbt-databricks` adapter allows our data models to take advantage of the auto-optimization features in Databricks. If you are using the `dbt-spark` adapter, you will need to manually alter the table properties of your derived and manifest tables using the following command after running the data model at least once. You will need to run the command in your Databricks environment once for each table, and we would recommend applying this to the tables in the `_derived` and `_snowplow_manifest` schemas:

```SQL
ALTER TABLE {TABLE_NAME} SET TBLPROPERTIES (delta.autoOptimize.optimizeWrite = true, delta.autoOptimize.autoCompact = true);
```

### BigQuery

As mentioned in the [Quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) In many of our packages you can specify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml
# dbt_project.yml
...
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```
