---
title: "Configure Snowplow dbt packages"
sidebar_label: "Configuration"
description: "Configure Snowplow dbt packages, including warehouse-specific settings for Postgres, Spark, Databricks, and BigQuery."
keywords: ["dbt configuration", "dbt variables", "Databricks Unity Catalog", "BigQuery partitioning"]
sidebar_position: 40
---

This page details general configurations that can apply across many of our packages. Each package has specific configuration variables that define how the models run, please see each child page for the specifics of each package.

## Variables

:::tip

Do not copy the project yaml from the package into your main project, this can lead to issues. Only add variables and model configurations that you wish to change from the default behavior. Each configuration page contains a UI to help to build your variables.

:::

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

```mdx-code-block
import DbtVariables from "@site/docs/reusable/dbt-variables/_index.md"

<DbtVariables/>
```

## Warehouse specific configurations
### Postgres

To optimism performance of large Postgres datasets you can create [indexes](https://docs.getdbt.com/reference/resource-configs/postgres-configs#indexes) in your dbt model config for columns that are commonly used in joins or where clauses. For example:

``` yaml
# snowplow_web_sessions_custom.sql
{{
  config(
    ...
    indexes=[\{'columns': ['domain_sessionid'], 'unique': True}]
  )
}}
```

### Spark

For Spark environments, Iceberg is currently the supported file format for external tables. We have successfully tested this setup using both Glue and Thrift as connection methods. To use these models, create an external table from the Iceberg lake format in Spark and point your dbt model to this table.

Here's an example profiles.yml configuration for Spark using Thrift:
``` yaml
spark:
  type: spark
  host: localhost
  method: thrift
  port: 10000
  schema: default
```

In your dbt_project.yml, the file_format is set to `iceberg` by default for Spark. While you can override this in your project's dbt YAML file to use a different file format, please note that Iceberg is currently the only officially supported format.


### Databricks

You can connect to Databricks using either the `dbt-spark` or the `dbt-databricks` connectors. The `dbt-spark` adapter does not allow dbt to take advantage of certain features that are unique to Databricks, which you can take advantage of when using the `dbt-databricks` adapter. Where possible, we would recommend using the `dbt-databricks` adapter.

#### Unity Catalog support

With the rollout of Unity Catalog (UC), the `dbt-databricks` adapter has added support in dbt for the three-level-namespace as of `dbt-databricks>=1.1.1`. As a result of this, we have introduced the `snowplow__databricks_catalog` variable which should be used **if** your Databricks environment has UC enabled, and you are using a version of the `dbt-databricks` adapter that supports UC. The default value for this variable is `hive_metastore` which is also the default name of your UC, but this can be changed with the `snowplow__databricks_catalog` variable.

Since there are many different situations, we've created the following table to help guide your setup process (this should help resolve the `Cannot set database in Databricks!` error):

|                                             | Adapter supports UC and UC Enabled                                                                     | Adapter supports UC and UC not enabled          | Adapter does not support UC                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Events land in default `atomic` schema      | `snowplow__databricks_catalog = '\{name_of_catalog}'`                                                  | Nothing needed                                  | `snowplow__databricks_catalog = 'atomic'`                                                             |
| Events land in custom schema (not `atomic`) | `snowplow__atomic_schema = '\{name_of_schema}'`  `snowplow__databricks_catalog = '\{name_of_catalog}'` | `snowplow__atomic_schema = '\{name_of_schema}'` | `snowplow__atomic_schema = '\{name_of_schema}'`  `snowplow__databricks_catalog = '\{name_of_schema}'` |

#### Optimization of models

The `dbt-databricks` adapter allows our data models to take advantage of the auto-optimization features in Databricks. If you are using the `dbt-spark` adapter, you will need to manually alter the table properties of your derived and manifest tables using the following command after running the data model at least once. You will need to run the command in your Databricks environment once for each table, and we would recommend applying this to the tables in the `_derived` and `_snowplow_manifest` schemas:

```SQL
ALTER TABLE \{TABLE_NAME} SET TBLPROPERTIES (delta.autoOptimize.optimizeWrite = true, delta.autoOptimize.autoCompact = true);
```

### BigQuery

As mentioned in the [Quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md), many of our packages allow you to specify which column your events table is partitioned on using the `snowplow__session_timestamp` variable. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title="dbt_project.yml"
vars:
  snowplow_mobile:
    snowplow__derived_tstamp_partitioned: false
```
