---
title: "Mobile"
sidebar_position: 200
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
| Variable Name     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                | Default                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `atomic_schema`   | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                  | `atomic`                                  |
| `database`        | The database that contains your atomic events table.                                                                                                                                                                                                                                                                                                                                                                                       | `target.database`                         |
| `dev_target_name` | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                                                                                         | `dev`                                     |
| `events`          | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                                                                                                                                                                           | `events`                                  |
| `events_table`    | The name of the table that contains your atomic events.                                                                                                                                                                                                                                                                                                                                                                                    | `events`                                  |
| `sessions_table`  | The users module requires data from the derived sessions table. If you choose to disable the standard sessions table in favor of your own custom table, set this to reference your new table e.g. `{{ ref('snowplow_mobile_sessions_custom') }}`. Please see the [README](https://github.com/snowplow/dbt-snowplow-mobile/tree/main/custom_example) in the `custom_example` directory for more information on this sort of implementation. | `{{ ref( 'snowplow_mobile_sessions' ) }}` |

### Operation and logic
| Variable Name           | Description                                                                                                                                                                                                                                                                                                                                                                                                      | Default        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `allow_refresh`         | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                         | `false`        |
| `backfill_limit_days`   | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md#package-state) section for more details.                                                                                                                  | `30`           |
| `days_late_allowed`     | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data.                                                                                                                                                                                                                         | `3`            |
| `lookback_window_hours` | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                     | `6`            |
| `max_session_days`      | The maximum allowed session length in days. For a session exceeding this length, all events after this limit will stop being processed. Exists to reduce lengthy table scans that can occur due to long sessions which are usually a result of bots.                                                                                                                                                             | `3`            |
| `session_lookback_days` | Number of days to limit scan on `snowplow_mobile_base_sessions_lifecycle_manifest` manifest. Exists to improve performance of model when we have a lot of sessions. Should be set to as large a number as practical.                                                                                                                                                                                             | `730`          |
| `session_stitching`     | Determines whether to apply the user mapping to the sessions table. Please see the [User Mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-user-mapping/index.md) section for more details.                                                                                                                                                                                           | `True`         |
| `start_date`            | The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                             | `'2020-01-01'` |
| `upsert_lookback_days`  | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/index.md) section for more details. | `30`           |

### Contexts, filters, and logs
| Variable Name                | Description                                                                                                               | Default                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `app_id`                     | A list of `app_id`s to filter the events table on for processing within the package.                                      | `[ ]` (no filter applied) |
| `enable_app_errors_module`   | Flag to enable the app errors module (details relating to app errors that occur during sessions).                         | `false`                   |
| `enable_application_context` | Flag to include the Application context (app version and build) columns in the models.                                    | `false`                   |
| `enable_geolocation_context` | Flag to include the Geolocation context (device latitude, longitude, bearing, etc.) columns in the models.                | `false`                   |
| `enable_mobile_context`      | Flag to include the Mobile context (device type, OS, etc.) columns in the models.                                         | `false`                   |
| `enable_screen_context`      | Flag to include the Screen context (screen details associated with mobile event) columns in the models.                   | `false`                   |
| `has_log_enabled`            | When executed, the package logs information about the current run to the CLI. This can be disabled by setting to `false`. | `true`                    |
| `platform`                   | A list of `platform`s to filter the events table on for processing within the package.                                    | `['mob']`                 |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks" label="Databricks" default>

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `databricks_catalog` | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). |         |

</TabItem>
<TabItem value="redshift/postgres" label="Redshift & Postgres">

Redshift and Postgres use a [shredded](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/index.md#shredded-data) approach for the context tables, so these variables are used to identify where they are, if different from the expected schema and table name. They must be passed in a stringified `source` function as the defaults below show.

| Variable Name         | Default                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| `session_context`     | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_client_session_1') }}"`      |
| `mobile_context`      | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_mobile_context_1') }}"`      |
| `geolocation_context` | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_geolocation_context_1') }}"` |
| `application_context` | `"{{ source('atomic', 'com_snowplowanalytics_mobile_application_1') }}"`           |
| `screen_context`      | `"{{ source('atomic', 'com_snowplowanalytics_mobile_screen_1') }}"`                |
| `app_errors_table`    | `"{{ source('atomic', 'com_snowplowanalytics_snowplow_application_error_1') }}"`   |
| `screen_view_events`  | `"{{ source('atomic', 'com_snowplowanalytics_mobile_screen_view_1') }}"`           |



</TabItem>
<TabItem value="bigquery" label="Bigquery" default>

| Variable Name                | Description                                                                                          | Default |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `derived_tstamp_partitioned` | Boolean to enable filtering the events table on `derived_tstamp` in addition to `collector_tstamp` . | `true`  |

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
  snowplow_mobile:
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
    screen_views:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    optional_modules:
      app_errors:
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
import { dbtSnowplowMobileConfigSchema } from '@site/src/components/JsonSchemaValidator/dbtMobile.js';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__atomic_schema",
                                            "snowplow__database",
                                            "snowplow__dev_target_name",
                                            "snowplow__events_table",
                                            "snowplow__sessions_table"] },
  { title: "Operation and Logic", fields: ["snowplow__allow_refresh",
                                          "snowplow__backfill_limit_days",
                                          "snowplow__days_late_allowed",
                                          "snowplow__lookback_window_hours",
                                          "snowplow__max_session_days",
                                          "snowplow__session_lookback_days",
                                          "snowplow__session_stitching",
                                          "snowplow__start_date",
                                          "snowplow__upsert_lookback_days"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__app_id",
                                                  "snowplow__enable_app_errors_module",
                                                  "snowplow__enable_application_context",
                                                  "snowplow__enable_geolocation_context",
                                                  "snowplow__enable_mobile_context",
                                                  "snowplow__enable_screen_context",
                                                  "snowplow__has_log_enabled",
                                                  "snowplow__platform"] },
  { title: "Warehouse Specific", fields: ["snowplow__databricks_catalog",
                                          "snowplow__session_context",
                                          "snowplow__mobile_context",
                                          "snowplow__geolocation_context",
                                          "snowplow__application_context",
                                          "snowplow__screen_context",
                                          "snowplow__app_errors_table",
                                          "snowplow__screen_view_events",
                                          "snowplow__derived_tstamp_partitioned"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_mobile": data}}, { flowLevel: 3 })}</CodeBlock>
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

<JsonApp schema={dbtSnowplowMobileConfigSchema} output={printYamlVariables} template={Template}/>
