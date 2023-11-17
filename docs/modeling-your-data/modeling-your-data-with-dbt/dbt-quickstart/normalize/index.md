---
sidebar_label: "Normalize"
sidebar_position: 500
title: "Normalize Quickstart"
---

## Requirements

In addition to [dbt](https://github.com/dbt-labs/dbt) being installed:

- Python 3.7 or later

```mdx-code-block
import DbtPrivs from "@site/docs/reusable/dbt-privs/_index.md"

<DbtPrivs/>
```

```mdx-code-block
import DbtPackageInstallation from "@site/docs/reusable/dbt-package-installation/_index.md"

<DbtPackageInstallation/>
```
## Setup

### 1. Override the dispatch order in your project
To take advantage of the optimized upsert that the Snowplow packages offer you need to ensure that certain macros are called from `snowplow_utils` first before `dbt-core`. This can be achieved by adding the following to the top level of your `dbt_project.yml` file:

```yml title="dbt_project.yml"
dispatch:
  - macro_namespace: dbt
    search_order: ['snowplow_utils', 'dbt']
```

If you do not do this the package will still work, but the incremental upserts will become more costly over time.

### 2. Adding the `selectors.yml` file

Within the packages we have provided a suite of suggested selectors to run and test the models within the package together with the normalize model. This leverages dbt's [selector flag](https://docs.getdbt.com/reference/node-selection/syntax). You can find out more about each selector in the [YAML Selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section.

These are defined in the `selectors.yml` file ([source](https://github.com/snowplow/dbt-snowplow-normalize/blob/main/selectors.yml)) within the package, however in order to use these selections you will need to copy this file into your own dbt project directory. This is a top-level file and therefore should sit alongside your `dbt_project.yml` file. If you are using multiple packages in your project you will need to combine the contents of these into a single file.

### 3. Check source data

This package will by default assume your Snowplow events data is contained in the `atomic` schema of your [target.database](https://docs.getdbt.com/docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile). In order to change this, please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_normalize:
    snowplow__atomic_schema: schema_with_snowplow_events
    snowplow__database: database_with_snowplow_events
```
:::info Databricks only
Please note that your `target.database` is NULL if using Databricks. In Databricks, schemas and databases are used interchangeably and in the dbt implementation of Databricks therefore we always use the schema value, so adjust your `snowplow__atomic_schema` value if you need to.

:::

### 4. Filter your data set

You can specify both `start_date` at which to start processing events and the `app_id`'s to filter for. By default the `start_date` is set to `2020-01-01` and all `app_id`'s are selected. To change this please add the following to your `dbt_project.yml` file:

```yml title="dbt_project.yml"
vars:
  snowplow_normalize:
    snowplow__start_date: 'yyyy-mm-dd'
    snowplow__app_id: ['my_app_1','my_app_2']
```
:::note

If you have events you are going to normalize with no value for the `dvce_sent_tstamp` field, you need to disable the days late filter by setting the `snowplow__days_late_allowed` variable to `-1`, otherwise these events will not be processed.

:::

### 5. Install additional python packages

The script only requires 2 additional packages (`jsonschema` and `requests`) that are not built into python by default, you can install these by running the below command, or by installing them by your preferred method.

```bash
pip install -r dbt_packages/snowplow_normalize/utils/requirements.txt
```

### 6. Setup the generator configuration file

You can use the example provided in `utils/example_normalize_config.json` to start your configuration file to specify which events, self-describing events, and contexts you wish to include in each table. For more information on this file see the [normalize package docs](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-normalize-data-model/index.md).

### 7. Setup your resolver connection file *(optional)*

If you are not using iglu central as your only iglu registry then you will need to set up an [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) file and point to this in your generator config.

### 8. Generate your models

At the root of your dbt project, running `python dbt_packages/snowplow_normalize/utils/snowplow_normalize_model_gen.py path/to/your/config.json`  will generate all models specified in your configuration.

### 9. Additional vendor specific configuration

:::info BigQuery Only
Verify which column your events table is partitioned on. It will likely be partitioned on `collector_tstamp` or `derived_tstamp`. If it is partitioned on `collector_tstamp` you should set `snowplow__derived_tstamp_partitioned` to `false`. This will ensure only the `collector_tstamp` column is used for partition pruning when querying the events table:

```yml title="dbt_project.yml"
vars:
  snowplow_normalize:
    snowplow__derived_tstamp_partitioned: false
```
:::

:::info Databricks only - setting the databricks_catalog

Add the following variable to your dbt project's `dbt_project.yml` file

```yml title="dbt_project.yml"
vars:
  snowplow_normalize:
    snowplow__databricks_catalog: 'hive_metastore'
```
Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to 'hive_metastore') or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). This is needed to handle the database property within `models/base/src_base.yml`.

**A more detailed explanation for how to set up your Databricks configuration properly can be found in [Unity Catalog support](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md#unity-catalog-support).**

:::


### 10. Run your model(s)

You can now run your models for the first time by running the below command (see the [operation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md) page for more information on operation of the package):

```bash
dbt run --selector snowplow_normalize
```
