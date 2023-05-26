---
title: "Fractribution"
sidebar_position: 106
---

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

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
| `conversion_window_start_date`        | The start date in UTC for the window of conversions to include                                                                                                                                                                                |                           |
| `conversion_window_end_date`          | The end date in UTC for the window of conversions to include                                                                                                                                                                                  | `current_date()-1`        |
| `path_lookback_days`                  | Restricts the model to marketing channels within this many days of the conversion (values of 30, 14 or 7 are recommended)                                                                                                                     | `30`                      |
| `path_lookback_steps`                 | The limit for the number of marketing channels to look at before the conversion                                                                                                                                                               | `0` (unlimited)           |
| `path_transforms`                     | Dictionary of path transforms (and their argument, `null` if none) to perform on the full conversion path (see [udfs.sql file](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/create_udfs.sql)) | `{'exposure_path': null}` |
| `use_snowplow_web_user_mapping_table` | `true` if you are using the Snowplow web model for web user mappings (`domain_userid` => `user_id`)                                                                                                                                           | `false`                   |

### Contexts, filters, and logs
| Variable Name                    | Description                                                                                                                                                                          | Default   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| `channels_to_exclude`            | List of channels to exclude from analysis (empty to keep all channels). For example, users may want to exclude the 'Direct' channel from the analysis.                               | `[]`      |
| `conversion_hosts`               | `url_hosts` to filter to in the data processing                                                                                                                                      | `[a.com]` |
| `consider_intrasession_channels` | If `false`, only considers the channel at the start of the session (i.e. first page view). If `true`, considers multiple channels in the conversion session as well as historically. | `false`   |

### Warehouse Specific 

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

| Variable Name | Description                                                                                                                                                                    | Default        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `snowplow__run_python_script_in_snowpark`   | A flag for if you wish to run the python scripts using Snowpark. | `false` |
| `snowplow__attribution_model_for_snowpark`   | The attribution model to use for Snowpark running, one of `shapley`, `first_touch`, `last_touch`, `position_based`, `linear`. See the [package docs](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/index.md#attribution-models) for more information. | `shapley` |

</TabItem>
</Tabs>

## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md"

<DbtSchemas/>
```

```yml
# dbt_project.yml
...
models:
  snowplow_fractribution:
    +schema: my_derived_schema
```
