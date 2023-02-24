---
title: "Fractribution"
sidebar_position: 106
---
## Model Configuration

This packages make use of a series of other variables, which are all set to the recommend values for the operation of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below table for brevity.

:::

| Variable Name                         | Description                                                                                                                                                                                                                                   | Default                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `channels_to_exclude`                 | List of channels to exclude from analysis (empty to keep all channels). For example, users may want to exclude the 'Direct' channel from the analysis.                                                                                        | `[]`                                                 |
| `conversion_hosts`                    | `url_hosts` to filter to in the data processing                                                                                                                                                                                               | `[a.com]`                                            |
| `conversion_window_start_date`        | The start date in UTC for the window of conversions to include                                                                                                                                                                                |                                                      |
| `conversion_window_end_date`          | The end date in UTC for the window of conversions to include                                                                                                                                                                                  |                                                      |
| `conversions_source`                  |                                                                                                                                                                                                                                               | `{{ source('atomic', 'events') }}`                   |
| `consider_intrasession_channels`      | If `false`, only considers the channel at the start of the session (i.e. first page view). If `true`, considers multiple channels in the conversion session as well as historically.                                                          | `false`                                              |
| `page_views_source`                   | The source (schema and table) of the derived snowplow_web_page_views table                                                                                                                                                                    | `{{ source('derived', 'snowplow_web_page_views') }}` |
| `path_lookback_days`                  | Restricts the model to marketing channels within this many days of the conversion (values of 30, 14 or 7 are recommended)                                                                                                                     | `30`                                                 |
| `path_lookback_steps`                 | The limit for the number of marketing channels to look at before the conversion                                                                                                                                                               | `0` (unlimited)                                      |
| `path_transforms`                     | Dictionary of path transforms (and their argument, `null` if none) to perform on the full conversion path (see [udfs.sql file](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/create_udfs.sql)) | `{'exposure_path': null}`                            |
| `use_snowplow_web_user_mapping_table` | `true` if you are using the Snowplow web model for web user mappings (`domain_userid` => `user_id`)                                                                                                                                           | `false`                                              |
| `web_user_mapping_table`              | The schema and table name of the snowplow web user mapping table, if different to default                                                                                                                                                     | `derived.snowplow_web_user_mapping`                  |



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
