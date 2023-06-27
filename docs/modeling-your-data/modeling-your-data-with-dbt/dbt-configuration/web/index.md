---
title: "Web"
sidebar_position: 101
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below tables for brevity.

:::

### Warehouse and tracker 
| Variable Name      | Description                                                                                                                                                                                                                                                                                                                                                                                                                          | Default                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `atomic_schema`    | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                            | `atomic`                                 |
| `database`         | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                 | `target.database`                        |
| `dev_target_name`  | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                                                                                   | `dev`                                    |
| `events`           | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                                                                                                                                                                     | `events`                                 |
| `events_table`    | The name of the table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                    | `events`                                  |
| `heartbeat`        | Page ping heartbeat time as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings).                                                                                                                                                                                      | `10`                                     |
| `min_visit_length` | Minimum visit length as defined in your [tracker configuration](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/index.md#activity-tracking-page-pings).                                                                                                                                                                                          | `5`                                      |
| `sessions_table`   | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_web_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-web/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. | `"{{ ref( 'snowplow_web_sessions' ) }}"` |

### Operation and logic
| Variable Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `allow_refresh`               | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                                                 | `false`        |
| `backfill_limit_days`         | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md#identification-of-events-to-process) section for more details.                                                                                                                                          | `30`           |
| `conversion_events`           | (Version 0.15.0+) A list of dictionaries that define a conversion event for your modeling, to add the relevant columns to the sessions table. The dictionary keys are `name` (required), `condition` (required), `value`, `default_value`, and `list_events`. For more information see the [package documentation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/conversions/index.md).                     |                |
| `cwv_days_to_measure`         | The number of days to use for web vital measurements (if enabled).                                                                                                                                                                                                                                                                                                                                                                               | `28`           |
| `cwv_percentile`              | The percentile that the web vitals measurements that are produced for all page views (if enabled).                                                                                                                                                                                                                                                                                                                                               | `75`           |
| `days_late_allowed`           | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                                                         | `3`            |
| `limit_page_views_to_session` | A boolean whether to ensure page view aggregations are limited to pings in the same session as the `page_view` event, to ensure deterministic behavior. If false you may get different results for the same `page_view` depending on which sessions are included in a run. See the [stray page ping](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md#stray-page-pings) section for more information. | `true`         |
| `list_event_counts`           | A boolean whether to include a json-type (varies by warehouse) column in the sessions table with a count of events for each `event_type` in that session.                                                                                                                                                                                                                                                                                        | `false`        |
| `lookback_window_hours`       | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                                                     | `6`            |
| `max_session_days`            | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                                                             | `3`            |
| `session_lookback_days`       | Number of days to limit scan on `snowplow_web_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                                                                | `730`          |
| `session_stitching`           | Determines whether to apply the user mapping to the sessions table. Please see the [User Mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-user-mapping/index.md) section for more details.                                                                                                                                                                                                                   | `true`         |
| `start_date`                  | The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                                                             | `'2020-01-01'` |
| `total_all_conversions`       | A boolean flag whether to calculate and add the `cv__all_volume` and `cv__all_total` columns. For more information see the [package documentation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/conversions/index.md).                                                                                                                                                                                     | `false`        |
| `upsert_lookback_days`        | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/index.md) section for more details.                         | `30`           |

### Contexts, filters, and logs
| Variable Name     | Description                                                                                                                                                      | Default                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `app_id`          | A list of `app_id`s to filter the events table on for processing within the package.                                                                             | `[ ]` (no filter applied) |
| `enable_consent`  | Flag to enable the [consent](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/consent-module/index.md) module.                 | `false`                   |
| `enable_cwv`      | Flag to enable the [Core Web Vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/core-web-vitals-module/index.md) module. | `false`                   |
| `enable_iab`      | Flag to include the [IAB enrichment](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md) data in the models.                                | `false`                   |
| `enable_ua`       | Flag to include the [UA Parser enrichment](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md) data in the models.                    | `false`                   |
| `enable_yauaa`    | Flag to include the [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) data in the models.                            | `false`                   |
| `has_log_enabled` | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`.                                        | `true`                    |
| `ua_bot_filter`   | Flag to filter out bots via the `useragent` string pattern match.                                                                                                | `true`                    |

### Warehouse Specific 

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks" label="Databricks" default>

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `databricks_catalog` | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). | `hive_metastore` |

</TabItem>
<TabItem value="redshift+postgres" label="Redshift & Postgres">

Redshift and Postgres use a [shredded](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data) approach for the context tables, so these variables are used to identify where they are, if different from the expected schema and table name. They must be passed in a stringified `source` function as the defaults below show.

| Variable Name         | Default                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| `page_view_context`   | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_web_page_1') }}"`            |
| `iab_context`         | `"{{ source('atomic', 'com_iab_snowplow_spiders_and_robots_1') }}"`                |
| `ua_parser_context`   | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_ua_parser_context_1') }}"`   |
| `yauaa_context`       | `"{{ source('atomic', 'nl_basjes_yauaa_context_1') }}"`                            |
| `consent_cmp_visible` | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_cmp_visible_1') }}"`         |
| `consent_preferences` | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_consent_preferences_1') }}"` |


| Variable Name        | Description                                                                                                                                                                                                                                                             | Default |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `enable_load_tstamp` | Flag to include the `load_tstamp` column in the base events this run model. This should be set to true (the default) unless you are using the Postgres loader or an RDB loader version less than 4.0.0. It must be true to use consent models on Postgres and Redshift. | `true`  |

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
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md";
import CodeBlock from '@theme/CodeBlock';
import { SchemaSetter } from '@site/src/components/DbtSchemaSelector';

<DbtSchemas/>

export const printSchemaVariables = (manifestSchema, scratchSchema, derivedSchema) => {
  return(
    <>
    <CodeBlock language="yaml">
    {`models:
  snowplow_web:
    base:
      manifest:
        +schema: ${manifestSchema}
      scratch:
        +schema: ${scratchSchema}
    sessions:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    user_mapping:
      +schema: ${derivedSchema}
    users:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    page_views:
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
import { dbtSnowplowWebConfigSchema } from '@site/src/components/JsonSchemaValidator';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__atomic_schema",
                                            "snowplow__database",
                                            "snowplow__dev_target_name",
                                            "snowplow__heartbeat",
                                            "snowplow__min_visit_length",
                                            "snowplow__sessions_table"] },
  { title: "Operation and Logic", fields: ["snowplow__allow_refresh",
                                          "snowplow__backfill_limit_days",
                                          "snowplow__conversion_events",
                                          "snowplow__cwv_days_to_measure",
                                          "snowplow__cwv_percentile",
                                          "snowplow__days_late_allowed",
                                          "snowplow__limit_page_views_to_session",
                                          "snowplow__list_event_counts",
                                          "snowplow__lookback_window_hours",
                                          "snowplow__max_session_days",
                                          "snowplow__session_lookback_days",
                                          "snowplow__session_stitching",
                                          "snowplow__start_date",
                                          "snowplow__total_all_conversions",
                                          "snowplow__upsert_lookback_days"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__app_id",
                                                  "snowplow__enable_consent",
                                                  "snowplow__enable_cwv",
                                                  "snowplow__enable_iab",
                                                  "snowplow__enable_ua",
                                                  "snowplow__enable_yauaa",
                                                  "snowplow__has_log_enabled",
                                                  "snowplow__ua_bot_filter"] },
  { title: "Warehouse Specific", fields: ["snowplow__databricks_catalog",
                                          "snowplow__page_view_context",
                                          "snowplow__iab_context",
                                          "snowplow__ua_parser_context",
                                          "snowplow__yauaa_context",
                                          "snowplow__consent_cmp_visible",
                                          "snowplow__consent_preferences",
                                          "snowplow__enable_load_tstamp",
                                          "snowplow__derived_tstamp_partitioned"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_web": data}}, { flowLevel: 3 })}</CodeBlock>
    </>
  )
}

export const Template = ObjectFieldTemplateGroupsGenerator(GROUPS);
```

## Config Generator
You can use the below inputs to generate the code that you need to place into your `dbt_project.yml` file to configure the package as you require.

<JsonApp schema={dbtSnowplowWebConfigSchema} output={printYamlVariables} template={Template}/>
