---
title: "E-commerce"
sidebar_position: 105
---
## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.


:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::


In addition the e-commerce package has some contexts that can be enabled depending on your tracker configuration, see the [e-commerce package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) for more information.

| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Default                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                  | `false`                                   |
| `app_id`                      | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                                                                                                                                                                 | `[ ]` (no filter applied)                 |
| `atomic_schema`               | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                            | `atomic`                                  |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the back-filling section for more details.                                                                                                                                                                                                                                                                                 | 30                                        |
| `categories_separator`        | The separator used to split out your subcategories from your main subcategory. If for example your category field is filled as follows: `books/fiction/magical-fiction` then you should specify `'/'` as the separator in order for the subcolumns to be properly parsed. | `'/'` |
| `database`                    | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                 | `target.database`                         |
| `databricks_catalog`          | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic').                                                                                                                                 |                                           |
| `days_late_allowed`           | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                             | 3                                         |
| `derived_tstamp_partitioned`  | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` (BigQuery only).                                                                                                                                                                                                                                                                                                                  | `true`                                    |
| `dev_target_name`             | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                        | `dev`                                     |
| `ecommerce_event_names` | The list of event names that the Snowplow e-commerce package will filter on when extracting events from your atomic events table. If you have included any custom e-commerce events, feel free to add their event name in this list to include them in your data models. | `['snowplow_ecommerce_action']`         |
| `events`                | The table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                          | `events`                                  |
| `incremental_materialization` | The materialization used for all incremental models within the package. `snowplow_incremental` builds upon the default incremental materialization provided by dbt, improving performance when modeling event data. If however you prefer to use the native dbt incremental materialization, or any other, then adjust accordingly.                                                                                                  | `snowplow_incremental`                    |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                         | 6                                         |
| `max_session_days`            | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                 | 3                                         |
| `number_category_levels`      | The **maximum** number of levels (depth) of subcategories that exist on your website for products. These subcategories are recorded in the category field of the product context, and should be separated using the separator which is defined below. For example, `books/fiction/magical-fiction` has a level of 3. The value is the number of columns that will be generated in the product tables created by this Snowplow dbt package. Please note that some products can have less than the maximum number of categories specified. | `4`|
| `number_checkout_steps`       |  The index of the checkout step which represents a completed transaction. This is required to enable working checkout funnel analysis, and has a default value of 4. | `4`                                     |
| `query_tag`                   | This sets the value of the query_tag for Snowflake database use. This is used internally for metric gathering in Snowflake and its value should not be changed.                                                                                                                                                                                                                                                                      | `snowplow_dbt`                            |
| `session_lookback_days`       | Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                    | 730                                       |
| `start_date`                  | The date to start processing events from in the package, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                                                                | '2020-01-01'                              |
| `upsert_lookback_days`        | Number of day to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the incremental materialization section for more details.                                                                                                                                         | 30                                        |
| `use_product_quantity`       | Whether the `product_quantity` field in the product context should be used to sum up the total number of products in a transaction. If this value is set to false, then your `number_products` field in your `transaction` tables will instead be calculated by counting the number of product entities within the transaction i.e. treating each product as having a quantity of 1. | `false` |


## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```


```yml
# dbt_project.yml
...
models:
  snowplow_ecommerce:
    base:
      manifest:
        +schema: my_manifest_schema
      scratch:
        +schema: my_scratch_schema
    carts:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    checkouts:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    products:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    transactions:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema
    users:
      +schema: my_derived_schema
      scratch:
        +schema: my_scratch_schema

```
