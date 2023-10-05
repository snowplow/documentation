---
title: "E-commerce"
sidebar_position: 600
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file. We have provided a [tool](#config-generator) below to help you with that.

:::caution

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::


### Warehouse and tracker
| Variable Name            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Default           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `atomic_schema`          | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `atomic`          |
| `categories_separator`   | The separator used to split out your subcategories from your main subcategory. If for example your category field is filled as follows: `books/fiction/magical-fiction` then you should specify `'/'` as the separator in order for the subcolumns to be properly parsed.                                                                                                                                                                                                                                                                | `'/'`             |
| `database`               | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `target.database` |
| `dev_target_name`        | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the 'Manifest Tables' section for more details.                                                                                                                                                                                                                                                                                                                                            | `dev`             |
| `events`                 | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                                                                                                                                                                                                                                                                         | `events`          |
| `number_category_levels` | The **maximum** number of levels (depth) of subcategories that exist on your website for products. These subcategories are recorded in the category field of the product context, and should be separated using the separator which is defined below. For example, `books/fiction/magical-fiction` has a level of 3. The value is the number of columns that will be generated in the product tables created by this Snowplow dbt package. Please note that some products can have less than the maximum number of categories specified. | `4`               |
| `number_checkout_steps`  | The index of the checkout step which represents a completed transaction. This is required to enable working checkout funnel analysis, and has a default value of 4.                                                                                                                                                                                                                                                                                                                                                                      | `4`               |

### Operation and logic
| Variable Name           | Description                                                                                                                                                                                                                                                                                                                                                                                                              | Default                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| `allow_refresh`         | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                         | `false`                         |
| `backfill_limit_days`   | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md#package-state) section for more details.                                                                                                                  | `30`                            |
| `days_late_allowed`     | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                 | `3`                             |
| `ecommerce_event_names` | The list of event names that the Snowplow e-commerce package will filter on when extracting events from your atomic events table. If you have included any custom e-commerce events, feel free to add their event name in this list to include them in your data models.                                                                                                                                                 | `['snowplow_ecommerce_action']` |
| `enable_mobile_events`  | Whether to use the mobile contexts for mobile e-commerce events in the processing (based on the client session and screen view context).                                                                                                                                                                                                                                                                                 | `false`                         |
| `lookback_window_hours` | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                             | `6`                             |
| `max_session_days`      | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                     | `3`                             |
| `session_lookback_days` | Number of days to limit scan on `snowplow_ecommerce_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                  | `730`                           |
| `start_date`            | The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                     | `'2020-01-01'`                  |
| `upsert_lookback_days`  | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/index.md) section for more details. | `30`                            |
| `use_product_quantity`  | Whether the `product_quantity` field in the product context should be used to sum up the total number of products in a transaction. If this value is set to false, then your `number_products` field in your `transaction` tables will instead be calculated by counting the number of product entities within the transaction i.e. treating each product as having a quantity of 1.                                     | `false`                         |

### Contexts, filters, and logs
| Variable Name                    | Description                                                                                                                                                                                                                                                                                       | Default                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `app_id`                         | A list of `app_id`s to filter the events table on for processing within the package.                                                                                                                                                                                                              | `[ ]` (no filter applied) |
| `disable_ecommerce_carts`        | Flag to exclude the `Snowplow E-commerce` [cart entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#cart-entity) context in case this is disabled or not used in your tracking.               | `false`                   |
| `disable_ecommerce_checkouts`    | Flag to exclude the `Snowplow E-commerce` [checkout entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#checkout-step-entity) context in case this is disabled or not used in your tracking.  | `false`                   |
| `disable_ecommerce_page_context` | Flag to exclude the `Snowplow E-commerce` [page entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#ecommerce-page-entity) context in case this is disabled or not used in your tracking.     | `false`                   |
| `disable_ecommerce_products`     | Flag to exclude the `Snowplow E-commerce` [product entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#product-entity) context in case this is disabled or not used in your tracking.         | `false`                   |
| `disable_ecommerce_transactions` | Flag to exclude the `Snowplow E-commerce` [transaction entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#transaction-entity) context in case this is disabled or not used in your tracking. | `false`                   |
| `disable_ecommerce_user_context` | Flag to exclude the `Snowplow E-commerce` [user entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md#ecommerce-user-entity) context in case this is disabled or not used in your tracking.     | `false`                   |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks" label="Databricks" default>

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `databricks_catalog` | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). |         |

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

Redshift and Postgres use a [shredded](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data) approach for the context tables, so these variables are used to identify where they are, if different from the expected schema and table name. These should be the table name in your `atomic_schema`, as the defaults below show.

| Variable Name                     | Default                                                                  |
| --------------------------------- | ------------------------------------------------------------------------ |
| `context_ecommerce_user`          | `'com_snowplowanalytics_snowplow_ecommerce_user_1'`                      |
| `context_ecommerce_checkout_step` | `'com_snowplowanalytics_snowplow_ecommerce_checkout_step_1'`             |
| `context_ecommerce_page`          | `'com_snowplowanalytics_snowplow_ecommerce_page_1'`                      |
| `context_ecommerce_transaction`   | `'com_snowplowanalytics_snowplow_ecommerce_transaction_1'`               |
| `context_ecommerce_cart`          | `'com_snowplowanalytics_snowplow_ecommerce_cart_1'`                      |
| `context_web_page`                | `'com_snowplowanalytics_snowplow_web_page_1'`                            |
| `context_ecommerce_product`       | `'com_snowplowanalytics_snowplow_ecommerce_product_1'`                   |
| `context_mobile_session`          | `'com_snowplowanalytics_snowplow_client_session_1'`                      |
| `context_screen`                  | `'com_snowplowanalytics_mobile_screen_1'`                                |
| `sde_ecommerce_action`            | `'com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1'` |

</TabItem>
<TabItem value="bigquery" label="Bigquery" default>

| Variable Name                | Description                                                                                         | Default |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `derived_tstamp_partitioned` | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp`. | `true`  |

</TabItem>
<TabItem value="snowflake" label="Snowflake" default>

| Variable Name | Description                                                                                                                                                                    | Default        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `query_tag`   | This sets the value of the `query_tag` for all sql executed against the database. This is used internally for metric gathering in Snowflake and its value should not be changed. | `snowplow_dbt` |

</TabItem>
</Tabs>

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"
import { SchemaSetter } from '@site/src/components/DbtSchemaSelector';
import CodeBlock from '@theme/CodeBlock';

<DbtSchemas/>

export const printSchemaVariables = (manifestSchema, scratchSchema, derivedSchema) => {
  return(
    <>
    <CodeBlock language="yaml">
    {`models:
  snowplow_ecommerce:
    base:
      manifest:
        +schema: ${manifestSchema}
      scratch:
        +schema: ${scratchSchema}
    carts:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    checkouts:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    products:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    transactions:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    users:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}`}
        </CodeBlock>
    </>
  )
}

```
<SchemaSetter output={printSchemaVariables}/>


```mdx-code-block
import { dump } from 'js-yaml';
import { dbtSnowplowEcommerceConfigSchema } from '@site/src/components/JsonSchemaValidator/dbtEcommerce.js';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__atomic_schema",
                                            "snowplow__categories_separator",
                                            "snowplow__database",
                                            "snowplow__dev_target_name",
                                            "snowplow__number_category_levels",
                                            "snowplow__number_checkout_steps"] },
  { title: "Operation and Logic", fields: ["snowplow__allow_refresh",
                                          "snowplow__backfill_limit_days",
                                          "snowplow__days_late_allowed",
                                          "snowplow__ecommerce_event_names",
                                          "snowplow__enable_mobile_events",
                                          "snowplow__lookback_window_hours",
                                          "snowplow__max_session_days",
                                          "snowplow__session_lookback_days",
                                          "snowplow__start_date",
                                          "snowplow__upsert_lookback_days",
                                          "snowplow__use_product_quantity"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__app_id",
                                                  "snowplow__disable_ecommerce_carts",
                                                  "snowplow__disable_ecommerce_checkouts",
                                                  "snowplow__disable_ecommerce_page_context",
                                                  "snowplow__disable_ecommerce_products",
                                                  "snowplow__disable_ecommerce_transactions",
                                                  "snowplow__disable_ecommerce_user_context"] },
  { title: "Warehouse Specific", fields: ["snowplow__databricks_catalog",
                                          "snowplow__context_ecommerce_user",
                                          "snowplow__context_ecommerce_checkout_step",
                                          "snowplow__context_ecommerce_page",
                                          "snowplow__context_ecommerce_transaction",
                                          "snowplow__context_ecommerce_cart",
                                          "snowplow__context_web_page",
                                          "snowplow__context_ecommerce_product",
                                          "snowplow__context_mobile_session",
                                          "snowplow__context_screen",
                                          "snowplow__sde_ecommerce_action",
                                          "snowplow__derived_tstamp_partitioned"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_ecommerce": data}}, { flowLevel: 3 })}</CodeBlock>
    </>
  )
}

export const Template = ObjectFieldTemplateGroupsGenerator(GROUPS);
```

## Config Generator 
```mdx-code-block
import ConfigGenerator from "@site/docs/reusable/data-modeling/config-generator/_index.md"

<ConfigGenerator/>
```

<JsonApp schema={dbtSnowplowEcommerceConfigSchema} output={printYamlVariables} template={Template}/>
