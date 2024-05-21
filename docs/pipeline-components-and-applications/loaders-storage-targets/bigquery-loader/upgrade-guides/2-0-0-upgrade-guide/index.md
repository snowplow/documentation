---
title: "2.0.0 upgrade guide"
sidebar_position: -20
---

## Configuration

BigQuery Loader 2.0.0 brings changes to the loading setup. It is no longer neccessary to configure and deploy three independent applications (Loader, Repeater and Mutator in [1.X](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/previous-versions/bigquery-loader-1.x/index.md)) in order to load your data to BigQuery.
Starting from 2.0.0, only one appliction is needed, which naturally introduces some breaking changes to the configuration file structure.

See the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/index.md) for all possible configuration parameters
and the minimal [configuration samples](https://github.com/snowplow-incubator/snowplow-bigquery-loader/blob/v2/config) for each of supported cloud environments.

## Infrastructure

Apart from Repeater and Mutator, other infrastructure components have become obsolete:
* The `types` PubSub topic connecting Loader and Mutator.
* The `failedInserts` PubSub topic connecting Loader and Repeater.
* The `deadLetter` GCS bucket used by Repeater to store data that repeatedly failed to be inserted into BigQuery.

## Events table format

Starting from 2.0.0, BigQuery Loader changes its output column naming strategy. For example, for [ad_click event](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad_click_event/jsonschema/1-0-0):

* Before an upgrade, the corresponding column would be named `unstruct_event_com_snowplowanalytics_snowplow_media_ad_click_event_1_0_0`.
* After an upgrade, new column will be named `unstruct_event_com_snowplowanalytics_snowplow_media_ad_click_event_1`.

All self-describing events and entities will be loaded to new 'major version' - oriented columns. Old 'full version' - oriented columns would remain unchanged, but no new data would be loaded into them. (The 2.0.0 loader just ignores these columns.)

The new column naming scheme has several advantages:
* Fewer columns created (BigQuery has a limit on the total number of columns)
* No need to update data models (or use complex macros) every time a new minor version of a schema is created

The catch is that you have to follow the rules of schema evolution more strictly to ensure data from different schema versions can fit in the same column — see below.

:::tip Consolidating old and new columns

If you are using [Snowplow dbt models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md), they will automatically consolidate the data between `_1_0_0` and `_1` style columns, because they look at the major version prefix (e.g. `_1`), which is common to both.

If you are not using Snowplow dbt models but still use dbt, you can employ [this macro](https://github.com/snowplow/dbt-snowplow-utils#combine_column_versions-source) to manually aggregate the data across old and new columns.

:::

## Recovery columns

### What is schema evolution?

One of Snowplow’s key features is the ability to [define custom schemas and validate events against them](/docs/understanding-your-pipeline/schemas/index.md). Over time, users often evolve the schemas, e.g. by adding new fields or changing existing fields. To accommodate these changes, BigQuery Loader 2.0.0 automatically adjusts the database tables in the warehouse accordingly.

There are two main types of schema changes:

**Breaking**: The schema version has to be changed in a major way (`1-2-3` → `2-0-0`). As of BigQuery Loader 2.0.0, each major schema version has its own column (`..._1`, `..._2`, etc, for example: `contexts_com.snowplowanalytics_ad_click_1`).

**Non-breaking**: The schema version can be changed in a minor way (`1-2-3` → `1-3-0` or `1-2-3` → `1-2-4`). Data is stored in the same database column.

Loader tries to format the incoming data according to the latest version of the schema it saw (for a given major version, e.g. `1-*-*`). For example, if a batch contains events with schema versions `1-0-0`, `1-0-1` and `1-0-2`, the loader derives the output schema based on version `1-0-2`. Then the loader instructs BigQuery to adjust the database column and load the data.

### Recovering from invalid schema evolution 

Let's consider these two schemas as an example of breaking schema evolution (changing the type of a field from `integer` to `string`) using the same major version (`1-0-0` and `1-0-1`):

```json
{
   // 1-0-0
   "properties": {
      "a": {"type": "integer"}
   }
}
```

```json
{
   // 1-0-1
   "properties": {
      "a": {"type": "string"}
   }
}
```

With BigQuery Loader 1.x, data for each version would go to its own column — no issue. With BigQuery Loader 2.x, there is only one column. But strings and integers can’t coexist!

To avoid crashing or losing data, BigQuery Loader 2.0.0 proceeds by creating a new column for the data with schema `1-0-1`, e.g. `contexts_com_snowplowanalytics_ad_click_1_0_1_recovered_9999999`, where:
  - `1_0_1` is the version of the offending schema;
  - `9999999` is a hash code unique to the schema (i.e. it will change if the schema is overwritten with a different one).

If you create a new schema `1-0-2` that reverts the offending changes and is again compatible with `1-0-0`, the data for events with that schema will be written to the original column as expected.
:::tip
You might find that some of your schemas were evolved incorrectly in the past, which results in the creation of these “recovery” columns after the upgrade. To address this for a given schema, create a new _minor_ schema version that reverts the breaking changes introduced in previous versions. (Or, if you want to keep the breaking change, create a new _major_ schema version.) You can set it to [supersede](/docs/understanding-tracking-design/versioning-your-data-structures/amending/index.md#marking-the-schema-as-superseded) the previous version(s), so that events are automatically validated against the new schema.
:::
:::note

If events with incorrectly evolved schemas never arrive, then the recovery column would not be created.

:::

You can read more about schema evolution and how recovery columns work [here](/docs/storing-querying/schemas-in-warehouse/index.md?warehouse=bigquery#versioning).
