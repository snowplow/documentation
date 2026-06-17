---
title: "Run models on data lakes"
sidebar_label: "Running on data lakes"
sidebar_position: 50
description: "How to run our models on lakehouses including Databricks and other data lake platforms."
keywords: ["dbt data lakes", "dbt lakehouses", "Databricks dbt"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
```

<Badges badgeType="Early Release"></Badges>

:::info

Running the models on data lakes or lakehouses (using external tables in a warehouse to read directly from a lake) is currently in Early Release state and is not fully supported. Certain features may not work as expected and errors are more likely to occur. Please use this approach at your own risk and raise any issues you find with us.

:::


If you are using the [lake loaders](/docs/api-reference/loaders-storage-targets/lake-loader/index.md) to load your data into a lake storage option, it may be possible to use our data models. In general in this section of the docs we are not going to detail which warehouses support which file formats, or how to set up the respective tables in each warehouse - please see the docs for your appropriate warehouse to see what file formats they support.

## Databricks
At time of writing, `delta` is the preferred file format for Databricks [external tables](https://docs.databricks.com/en/sql/language-manual/sql-ref-external-tables.html). If you create an external table from this lake format in Databricks, you should be able to run the models without any further changes required by simply pointing the model at this table.

## Snowflake
At time of writing, `Iceberg` is the preferred file format for Snowflake [iceberg tables](https://docs.snowflake.com/en/user-guide/tables-iceberg). If you wish to use our models with this, currently only the [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) package supports this, by setting the `snowplow__snowflake_lakeloader` variable to `true`.

Note that compared to the other loaders for Snowflake, that field names in Self-describing events and Entities are converted to `snake_case` format (the other loaders retain the format used in the schema, often `camelCase`). You will need to adjust other variables and inputs accordingly compared to what you may find in the docs.

## Spark
At time of writing, `Iceberg` is the supported file format for Spark external tables. We've tested this using Glue and Thrift as a connection method. If you have your event data in Iceberg format in a lake, you should be able to run the models by pointing the packages to a spark deployment, connected to that lake. For more information on setting up dbt with Spark using Thrift, please refer to the [dbt Spark documentation on Thrift](https://docs.getdbt.com/docs/core/connect-data-platform/spark-setup#thrift).

## Redshift (spectrum)
Currently using Redshift Spectrum tables is not supported for our packages due to [limitations](https://docs.aws.amazon.com/redshift/latest/dg/nested-data-restrictions.html) with the platform.

## BigQuery on GCS
Currently using GCS/BigQuery external tables is not tested but may work, please let us know your experience if you try this.
