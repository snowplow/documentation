---
title: "Fractribution"
sidebar_position: 700
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
| Variable Name            | Description                                                                               | Default                                              |
| ------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `page_views_source`      | The source (schema and table) of the derived snowplow_web_page_views table                | `{{ source('derived', 'snowplow_web_page_views') }}` |
| `web_user_mapping_table` | The schema and table name of the snowplow web user mapping table, if different to default | `derived.snowplow_web_user_mapping`                  |
| `conversions_source`     | The source (schema and table) of your conversion events, likely your atomic events table  | `{{ source('atomic', 'events') }}`                   |

### Operation and logic
| Variable Name                         | Description                                                                                                                                                                                                                                   | Default                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `conversion_window_start_date`        | The start date in UTC for the window of conversions to include                                                                                                                                                                                |  `current_date()-31`                         |
| `conversion_window_end_date`          | The end date in UTC for the window of conversions to include
| `conversion_window_days`          | The last complete nth number of days (calculated from the last processed pageview within page_views_source) to dynamically update the conversion_window_start_date and end_date with. Will only apply if both variables are left as an empty string                                                                                                                                                                                  | `30`        |
| `path_lookback_days`                  | Restricts the model to marketing channels within this many days of the conversion (values of 30, 14 or 7 are recommended)                                                                                                                     | `30`                      |
| `path_lookback_steps`                 | The limit for the number of marketing channels to look at before the conversion                                                                                                                                                               | `0` (unlimited)           |
| `path_transforms`                     | Dictionary of path transforms (and their argument, `null` if none) to perform on the full conversion path (see [udfs.sql file](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/create_udfs.sql)) | `{'exposure_path': null}` |
| `use_snowplow_web_user_mapping_table` | `true` if you are using the Snowplow web model for web user mappings (`domain_userid` => `user_id`)                                                                                                                                           | `false`                   |
| `snowplow__conversions_source_filter` | A timestamp field the conversion source field is partitioned on (ideally) for optimized filtering, when left blank derived_tstamp is used                                                                                                                                          | `blank`                   |
| `snowplow__conversions_source_filter_buffer_days` | The number of days to extend the filter                                                                                                                                           | 1                   |


### Contexts, filters, and logs
| Variable Name                    | Description                                                                                                                                                                          | Default   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `channels_to_exclude`            | List of channels to exclude from analysis (empty to keep all channels). For example, users may want to exclude the 'Direct' channel from the analysis.                               | `[]`      |
| `channels_to_include`            | List of channels to include in the analysis (empty to keep all channels). For example, users may want to include the 'Direct' channel only in the analysis.                               | `[]`      |
| `conversion_hosts`               | `url_hosts` to filter to in the data processing                                                                                                                                      | `[a.com]` |
| `consider_intrasession_channels` | If `false`, only considers the channel at the start of the session (i.e. first page view). If `true`, considers multiple channels in the conversion session as well as historically. | `false`   |

### Warehouse Specific

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

| Variable Name                    | Description                                                                                                                                                                                                                                                                                          | Default   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `run_python_script_in_snowpark`  | A flag for if you wish to run the python scripts using Snowpark.                                                                                                                                                                                                                                     | `false`   |
| `attribution_model_for_snowpark` | The attribution model to use when running in Snowpark; one of `shapley`, `first_touch`, `last_touch`, `position_based`, `linear`. See the [package docs](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/index.md#attribution-models) for more information. | `shapley` |

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
  snowplow_fractribution:
    +schema: ${derivedSchema}`}
        </CodeBlock>
    </>
  )
}

```
<SchemaSetter output={printSchemaVariables}/>

```mdx-code-block
import { dump } from 'js-yaml';
import { dbtSnowplowFractributionConfigSchema } from '@site/src/components/JsonSchemaValidator/dbtFractribution.js';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const GROUPS = [
  { title: "Warehouse and tracker", fields: ["snowplow__page_views_source",
                                            "snowplow__web_user_mapping_table",
                                            "snowplow__conversions_source",] },
  { title: "Operation and Logic", fields: ["snowplow__conversion_window_start_date",
                                          "snowplow__conversion_window_end_date",
                                          "snowplow__conversion_window_days",
                                          "snowplow__path_lookback_days",
                                          "snowplow__path_lookback_steps",
                                          "snowplow__path_transforms",
                                          "snowplow__use_snowplow_web_user_mapping_table",
                                          "snowplow__conversions_source_filter",
                                          "snowplow__conversions_source_filter_buffer_days"] },
  { title: "Contexts, Filters, and Logs", fields: ["snowplow__channels_to_exclude",
                                                  "snowplow__channels_to_include",
                                                  "snowplow__conversion_hosts",
                                                  "snowplow__consider_intrasession_channels"] },
  { title: "Warehouse Specific", fields: ["snowplow__run_python_script_in_snowpark",
                                          "snowplow__attribution_model_for_snowpark"] }
];

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_fractribution": data}}, { flowLevel: 3 })}</CodeBlock>
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


<JsonApp schema={dbtSnowplowFractributionConfigSchema} output={printYamlVariables} template={Template}/>
