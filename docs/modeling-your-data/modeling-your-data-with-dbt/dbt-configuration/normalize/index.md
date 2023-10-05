---
title: "Normalize"
sidebar_position: 500
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
| Variable Name     | Description                                                                                                                                                                                                                                                                        | Default           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `atomic_schema`   | The schema (dataset for BigQuery) that contains your atomic events table.                                                                                                                                                                                                          | `atomic`          |
| `database`        | The database that contains your atomic events table.                                                                                                                                                                                                                               | `target.database` |
| `dev_target_name` | The [target name](https://docs.getdbt.com/reference/profiles.yml) of your development environment as defined in your `profiles.yml` file. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details. | `dev`             |
| `events`          | This is used internally by the packages to reference your events table based on other variable values and should not be changed.                                                                                                                                                   | `events`          |

### Operation and logic
| Variable Name           | Description                                                                                                                                                                                                                                                                                                                                                                                                      | Default      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `allow_refresh`         | Used as the default value to return from the `allow_refresh()` macro. This macro determines whether the manifest tables can be refreshed or not, depending on your environment. See the [Manifest Tables](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#manifest-tables) section for more details.                                                                                         | `false`      |
| `backfill_limit_days`   | The maximum numbers of days of new data to be processed since the latest event processed. Please refer to the [incremental logic](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-logic/index.md#package-state) section for more details.                                                                                                                  | 30           |
| `days_late_allowed`     | The maximum allowed number of days between the event creation and it being sent to the collector. Exists to reduce lengthy table scans that can occur as a result of late arriving data. If set to `-1` disables this filter entirely, which can be useful if you have events with no `dvce_sent_tstamp` value.                                                                                                  | 3            |
| `lookback_window_hours` | The number of hours to look before the latest event processed - to account for late arriving data, which comes out of order.                                                                                                                                                                                                                                                                                     | 6            |
| `start_date`            | The date to start processing events from in the package on first run or a full refresh, based on `collector_tstamp`.                                                                                                                                                                                                                                                                                             | '2020-01-01' |
| `session_timestamp`            | Determines which timestamp is used to process sessions of data. It's a good idea to have this timestamp be the same timestamp as the field you partition your events table on. | 'collector_tstamp' |
| `upsert_lookback_days`  | Number of days to look back over the incremental derived tables during the upsert. Where performance is not a concern, should be set to as long a value as possible. Having too short a period can result in duplicates. Please see the [Snowplow Optimized Materialization](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-incremental-materialization/index.md) section for more details. | 30           |

### Contexts, filters, and logs
| Variable Name | Description                                                                          | Default                   |
| ------------- | ------------------------------------------------------------------------------------ | ------------------------- |
| `app_id`      | A list of `app_id`s to filter the events table on for processing within the package. | `[ ]` (no filter applied) |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="databricks" label="Databricks" default>

| Variable Name        | Description                                                                                                                                                                                                                                                                                          | Default |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `databricks_catalog` | The catalogue your atomic events table is in. Depending on the use case it should either be the catalog (for Unity Catalog users from databricks connector 1.1.1 onwards, defaulted to `hive_metastore`) or the same value as your `snowplow__atomic_schema` (unless changed it should be 'atomic'). |         |

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
import CodeBlock from '@theme/CodeBlock';

<DbtSchemas/>

import { SchemaSetter } from '@site/src/components/DbtSchemaSelector';

<DbtSchemas/>

export const printSchemaVariables = (manifestSchema, scratchSchema, derivedSchema) => {
  return(
    <>
    <CodeBlock language="yaml">
    {`models:
  snowplow_normalize:
    base:
      manifest:
        +schema: ${manifestSchema}
      scratch:
        +schema: ${scratchSchema}`
    }
        </CodeBlock>
    </>
  )
}
```

<SchemaSetter output={printSchemaVariables}/>

```mdx-code-block
import { dump } from 'js-yaml';
// normlaize is currently a subset of web so can use those variables and filter with the groups list
import { dbtSnowplowWebConfigSchema } from '@site/src/components/JsonSchemaValidator/dbtWeb.js';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__atomic_schema",
                                            "snowplow__database",
                                            "snowplow__dev_target_name"] },
  { title: "Operation and Logic", fields: ["snowplow__allow_refresh",
                                          "snowplow__backfill_limit_days",
                                          "snowplow__days_late_allowed",
                                          "snowplow__lookback_window_hours",
                                          "snowplow__start_date",
                                          "snowplow__session_timestamp",
                                          "snowplow__upsert_lookback_days"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__app_id"] },
  { title: "Warehouse Specific", fields: ["snowplow__databricks_catalog",
                                          "snowplow__derived_tstamp_partitioned"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_normalize": data}}, { flowLevel: 3 })}</CodeBlock>
    </>
  )
}

export const Template = ObjectFieldTemplateGroupsGenerator(GROUPS);
```

## Config Generator
``mdx-code-block
import ConfigGenerator from "@site/docs/reusable/data-modeling/config-generator/_index.md"

<ConfigGenerator/>
```


<JsonApp schema={dbtSnowplowWebConfigSchema} output={printYamlVariables} template={Template}/>
