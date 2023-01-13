---
title: "Snowplow Utils Macros"
description: Reference for snowplow_utils dbt macros developed by Snowplow
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Utils
### App Id Filter {#macro.snowplow_utils.app_id_filter}

<DbtDetails><summary>
<code>macros/utils/app_id_filter.sql</code>
</summary>

#### Description
Generates a `sql` filter for the values in `app_ids` applied on the `app_id` column.



#### Arguments
- `app_ids` *(list)*: List of app_ids to filter to include

#### Returns

`app_id in (...)` if any `app_ids` are provided, otherwise `true`.

#### Usage

```sql
app_id_filter(['web', 'mobile', 'news'])

-- returns
app_id in ('web', 'mobile', 'news')
```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/app_id_filter.sql">(source)</a></summary>

```jinja2
{% macro app_id_filter(app_ids) %}

  {%- if app_ids|length -%} 

    app_id in ('{{ app_ids|join("','") }}') --filter on app_id if provided

  {%- else -%}

    true

  {%- endif -%}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Cast To Tstamp {#macro.snowplow_utils.cast_to_tstamp}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">(source)</a></summary>

```jinja2
{% macro cast_to_tstamp(tstamp_literal) -%}
  {% if tstamp_literal is none or tstamp_literal|lower in ['null',''] %}
    cast(null as {{type_timestamp()}})
  {% else %}
    cast('{{tstamp_literal}}' as {{type_timestamp()}})
  {% endif %}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.type_timestamp
- macro.dbt_utils.type_timestamp


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Coalesce Field Paths {#macro.snowplow_utils.coalesce_field_paths}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/coalesce_field_paths.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/coalesce_field_paths.sql">(source)</a></summary>

```jinja2
{% macro coalesce_field_paths(paths, field_alias, include_field_alias, relation_alias) %}
  
  {% set relation_alias = '' if relation_alias is none else relation_alias~'.' %}

  {% set field_alias = '' if not include_field_alias else ' as '~field_alias %}

  {% set joined_paths = relation_alias~paths|join(', '~relation_alias) %}

  {% set coalesced_field_paths = 'coalesce('~joined_paths~')'~field_alias %}

  {{ return(coalesced_field_paths) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Combine Column Versions {#macro.snowplow_utils.combine_column_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/combine_column_versions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/combine_column_versions.sql">(source)</a></summary>

```jinja2
{% macro combine_column_versions(relation, column_prefix, required_fields=[], nested_level=none, level_filter='equalto', relation_alias=none, include_field_alias=true, array_index=0, max_nested_level=15, exclude_versions=[]) %}
  
  {# Create field_alias if not supplied i.e. is not tuple #}
  {% set required_fields_tmp = required_fields %}
  {% set required_fields = [] %}
  {% for field in required_fields_tmp %}
    {% set field_tuple = snowplow_utils.get_field_alias(field) %}
    {% do required_fields.append(field_tuple) %}
  {% endfor %}

  {% set required_field_names = required_fields|map(attribute=0)|list %}

  {# Determines correct level_limit. This limits recursive iterations during unnesting. #}
  {% set level_limit = snowplow_utils.get_level_limit(nested_level, level_filter, required_field_names) %}

  {# Limit level_limit to max_nested_level if required #}
  {% set level_limit = max_nested_level if level_limit is none or level_limit > max_nested_level else level_limit %}

  {%- set matched_columns = snowplow_utils.get_columns_in_relation_by_column_prefix(relation, column_prefix) -%}

  {# Removes excluded versions, assuming column name ends with a version of format 'X_X_X' #}
  {%- set filter_columns_by_version = snowplow_utils.exclude_column_versions(matched_columns, exclude_versions) -%}  

  {%- set flattened_fields_by_col_version = [] -%}

  {# Flatten fields within each column version. Returns nested arrays of dicts. #}
  {# Dict: {'field_name': str, 'field_alias': str, 'flattened_path': str, 'nested_level': int #}
  {% for column in filter_columns_by_version|sort(attribute='name', reverse=true) %}
    {% set flattened_fields = snowplow_utils.flatten_fields(fields=column.fields,
                                                            parent=column,
                                                            path=column.name,
                                                            array_index=array_index,
                                                            level_limit=level_limit
                                                            ) %}

    {% do flattened_fields_by_col_version.append(flattened_fields) %}

  {% endfor %}

  {# Flatten nested arrays and merges fields across col version. Returns array of dicts containing all field_paths for field. #}
  {# Dict: {'field_name': str, 'flattened_field_paths': str, 'nested_level': int #}
  {% set merged_fields = snowplow_utils.merge_fields_across_col_versions(flattened_fields_by_col_version) %}

  {# Filters merged_fields based on required_fields if provided, or the level filter if provided. Default return all fields. #}
  {% set matched_fields = snowplow_utils.get_matched_fields(fields=merged_fields,
                                                            required_field_names=required_field_names,
                                                            nested_level=nested_level,
                                                            level_filter=level_filter
                                                            ) %}

  {% set coalesced_field_paths = [] %}

  {% for field in matched_fields %}

    {% set passed_field_alias = required_fields|selectattr(0, "equalto", field.field_name)|map(attribute=1)|list %}
    {% set default_field_alias = field.field_name|replace('.', '_') %}
    {# Use passed_field_alias from required_fields if supplied #}
    {% set field_alias = default_field_alias if not passed_field_alias|length else passed_field_alias[0] %}

    {# Coalesce each field's path across all version of columns, ordered by latest col version. #}
    {% set coalesced_field_path = snowplow_utils.coalesce_field_paths(paths=field.field_paths,
                                                                      field_alias=field_alias,
                                                                      include_field_alias=include_field_alias,
                                                                      relation_alias=relation_alias) %}

    {% do coalesced_field_paths.append(coalesced_field_path) %}

  {% endfor %}

  {# Returns array of all coalesced field paths #}
  {{ return(coalesced_field_paths) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.coalesce_field_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.coalesce_field_paths)
- [macro.snowplow_utils.exclude_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.exclude_column_versions)
- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)
- [macro.snowplow_utils.get_columns_in_relation_by_column_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_columns_in_relation_by_column_prefix)
- [macro.snowplow_utils.get_field_alias](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field_alias)
- [macro.snowplow_utils.get_level_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_level_limit)
- [macro.snowplow_utils.get_matched_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_matched_fields)
- [macro.snowplow_utils.merge_fields_across_col_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.merge_fields_across_col_versions)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.get_device_user_id_path_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.get_device_user_id_path_sql)
- [macro.snowplow_mobile.get_session_id_path_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.get_session_id_path_sql)
- [macro.snowplow_normalize.normalize_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.normalize_events)
- [macro.snowplow_normalize.users_table](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.users_table)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Current Timestamp In Utc {#macro.snowplow_utils.current_timestamp_in_utc}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro current_timestamp_in_utc() -%}
  {{ return(adapter.dispatch('current_timestamp_in_utc', 'snowplow_utils')()) }}
{%- endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__current_timestamp_in_utc() %}
    {{current_timestamp()}}
{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__current_timestamp_in_utc() %}
    (current_timestamp at time zone 'utc')::{{type_timestamp()}}
{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__current_timestamp_in_utc() %}
    {{ return(snowplow_utils.default__current_timestamp_in_utc()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__current_timestamp_in_utc() %}
    convert_timezone('UTC', {{current_timestamp()}})::{{type_timestamp()}}
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.current_timestamp
- macro.dbt.type_timestamp


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)
- [model.snowplow_web.snowplow_web_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Exclude Column Versions {#macro.snowplow_utils.exclude_column_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/exclude_column_versions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/exclude_column_versions.sql">(source)</a></summary>

```jinja2
{% macro exclude_column_versions(columns, exclude_versions) %}
  {%- set filtered_columns_by_version = [] -%}  
  {% for column in columns %}
    {%- set col_version = column.name[-5:] -%}
    {% if col_version not in exclude_versions %}
      {% do filtered_columns_by_version.append(column) %}
    {% endif %}
  {% endfor %}

  {{ return(filtered_columns_by_version) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Flatten Fields {#macro.snowplow_utils.flatten_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/flatten_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/flatten_fields.sql">(source)</a></summary>

```jinja2
{% macro flatten_fields(fields, parent, path, array_index, level_limit=none, level_counter=1, flattened_fields=[], field_name='') %}
  
  {% for field in fields %}

    {# Only recurse up-until level_limit #}
    {% if level_limit is not none and level_counter > level_limit %}
      {{ return(flattened_fields) }}
    {% endif %}

    {# If parent column is an array then take element [array_index].  #}
    {% set delimiter = '[safe_offset(%s)].'|format(array_index) if parent.mode == 'REPEATED' else '.' %}
    {% set path = path~delimiter~field.name %}
    {% set field_name = field_name~'.'~field.name if field_name != '' else field_name~field.name %}

    {% set field_dict = {
                         'field_name': field_name,
                         'path': path,
                         'nested_level': level_counter
                         } %}

    {% do flattened_fields.append(field_dict) %}

    {# If field has nested fields recurse to extract all fields, unless array. #}
    {% if field.dtype == 'RECORD' and field.mode != 'REPEATED' %}

      {{ snowplow_utils.flatten_fields(
                                  fields=field.fields,
                                  parent=field,
                                  level_limit=level_limit,
                                  level_counter=level_counter+1,
                                  path=path,
                                  flattened_fields=flattened_fields,
                                  field_name=field_name
                                  ) }}

    {% endif %}

  {% endfor %}

  {{ return(flattened_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Get Cluster By {#macro.snowplow_utils.get_cluster_by}

<DbtDetails><summary>
<code>macros/utils/get_cluster_by.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_cluster_by.sql">(source)</a></summary>

```jinja2
{% macro get_cluster_by(bigquery_cols=none, snowflake_cols=none) %}

  {% if target.type == 'bigquery' %}
    {{ return(bigquery_cols) }}
  {% elif target.type == 'snowflake' %}
    {{ return(snowflake_cols) }}
  {% endif %}
  
{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_session_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_session_stats)
- [model.snowplow_media_player.snowplow_media_player_user_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_user_stats)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_sessions_sv_details](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_sv_details)
- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_web.snowplow_web_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_aggs)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_mobile.cluster_by_fields_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.cluster_by_fields_app_errors)
- [macro.snowplow_mobile.mobile_cluster_by_fields_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_screen_views)
- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions)
- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_mobile.mobile_cluster_by_fields_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_users)
- [macro.snowplow_web.web_cluster_by_fields_consent](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_consent)
- [macro.snowplow_web.web_cluster_by_fields_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_page_views)
- [macro.snowplow_web.web_cluster_by_fields_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_sessions)
- [macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_web.web_cluster_by_fields_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_users)

</TabItem>
</Tabs>
</DbtDetails>

### Get Columns In Relation By Column Prefix {#macro.snowplow_utils.get_columns_in_relation_by_column_prefix}

<DbtDetails><summary>
<code>macros/utils/get_columns_in_relation_by_column_prefix.sql</code>
</summary>

#### Description
This macro returns an array of column objects within a relation that start with the given column prefix. This is useful when you have multiple versions of a column within a table and want to dynamically identify all versions.



#### Arguments
- `relation` *(relation)*: A table or `ref` type object to get the columns from
- `column_prefix` *(string)*: The prefix string to search for matching columns

#### Returns

An array of (column objects)[https://docs.getdbt.com/reference/dbt-classes#column]. The name of each column can be accessed with the name property.

#### Usage

```sql
get_columns_in_relation_by_column_prefix(ref('snowplow_web_base_events_this_run'), 'domain')

-- returns
['domain_sessionid', 'domain_userid', 'domain_sessionidx',...]

{% set matched_columns = snowplow_utils.get_columns_in_relation_by_column_prefix(
                    relation=ref('snowplow_web_base_events_this_run'),
                    column_prefix='custom_context_1_0_'
                    ) %}

{% for column in matched_columns %}
{{ column.name }}
{% endfor %}

# Renders to something like:
'custom_context_1_0_1'
'custom_context_1_0_2'
'custom_context_1_0_3'

```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_columns_in_relation_by_column_prefix.sql">(source)</a></summary>

```jinja2
{% macro get_columns_in_relation_by_column_prefix(relation, column_prefix) %}

  {# Prevent introspective queries during parsing #}
  {%- if not execute -%}
    {{ return('') }}
  {% endif %}

  {%- set columns = adapter.get_columns_in_relation(relation) -%}
  
  {# get_columns_in_relation returns uppercase cols for snowflake so uppercase column_prefix #}
  {%- set column_prefix = column_prefix.upper() if target.type == 'snowflake' else column_prefix -%}

  {%- set matched_columns = [] -%}

  {# add columns with matching prefix to matched_columns #}
  {% for column in columns %}
    {% if column.name.startswith(column_prefix) %}
      {% do matched_columns.append(column) %}
    {% endif %}
  {% endfor %}

  {% if matched_columns|length %}
    {{ return(matched_columns) }}
  {% else %}
    {{ exceptions.raise_compiler_error("Snowplow: No columns found with prefix "~column_prefix) }}
  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.coalesce_columns_by_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.coalesce_columns_by_prefix)
- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Enabled Snowplow Models {#macro.snowplow_utils.get_enabled_snowplow_models}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_enabled_snowplow_models.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_enabled_snowplow_models.sql">(source)</a></summary>

```jinja2
{% macro get_enabled_snowplow_models(package_name, graph_object=none, models_to_run=var("models_to_run","")) -%}
  
  {# Override dbt graph object if graph_object is passed. Testing purposes #}
  {% if graph_object is not none %}
    {% set graph = graph_object %}
  {% endif %}
  
  {# models_to_run optionally passed using dbt ls command. This returns a string of models to be run. Split into list #}
  {% if models_to_run|length %}
    {% set selected_models = models_to_run.split(" ") %}
  {% else %}
    {% set selected_models = none %}
  {% endif %}

  {% set enabled_models = [] %}
  {% set untagged_snowplow_models = [] %}
  {% set snowplow_model_tag = package_name+'_incremental' %}
  {% set snowplow_events_this_run_path = 'model.'+package_name+'.'+package_name+'_base_events_this_run' %}

  {% if execute %}
    
    {% set nodes = graph.nodes.values() | selectattr("resource_type", "equalto", "model") %}
    
    {% for node in nodes %}
      {# If selected_models is specified, filter for these models #}
      {% if selected_models is none or node.name in selected_models %}

        {% if node.config.enabled and snowplow_model_tag not in node.tags and snowplow_events_this_run_path in node.depends_on.nodes %}

          {%- do untagged_snowplow_models.append(node.name) -%}

        {% endif %}

        {% if node.config.enabled and snowplow_model_tag in node.tags %}

          {%- do enabled_models.append(node.name) -%}

        {% endif %}

      {% endif %}
      
    {% endfor %}

    {% if untagged_snowplow_models|length %}
    {#
      Prints warning for models that reference snowplow_base_events_this_run but are untagged as 'snowplow_web_incremental'
      Without this tagging these models will not be inserted into the manifest, breaking the incremental logic.
      Only catches first degree dependencies rather than all downstream models
    #}
      {%- do exceptions.raise_compiler_error("Snowplow Warning: Untagged models referencing '"+package_name+"_base_events_this_run'. Please refer to the Snowplow docs on tagging. " 
      + "Models: "+ ', '.join(untagged_snowplow_models)) -%}
    
    {% endif %}

  {% endif %}

  {{ return(enabled_models) }}

{%- endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Field Alias {#macro.snowplow_utils.get_field_alias}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_field_alias.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_field_alias.sql">(source)</a></summary>

```jinja2
{% macro get_field_alias(field) %}
  
  {# Check if field is supplied as tuple e.g. (field_name, field_alias) #}
  {% if field is iterable and field is not string %}
    {{ return(field) }}
  {% else %}
    {{ return((field, field|replace('.', '_'))) }}
  {% endif %}
  
{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Get Incremental Manifest Status {#macro.snowplow_utils.get_incremental_manifest_status}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_incremental_manifest_status.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_status.sql">(source)</a></summary>

```jinja2
{% macro get_incremental_manifest_status(incremental_manifest_table, models_in_run) -%}

  {% if not execute %}

    {{ return(['', '', '', '']) }}

  {% endif %}

  {% set last_success_query %}
    select min(last_success) as min_last_success,
           max(last_success) as max_last_success,
           coalesce(count(*), 0) as models
    from {{ incremental_manifest_table }}
    where model in ({{ snowplow_utils.print_list(models_in_run) }})
  {% endset %}

  {% set results = run_query(last_success_query) %}

  {% if execute %}

    {% set min_last_success = results.columns[0].values()[0] %}
    {% set max_last_success = results.columns[1].values()[0] %}
    {% set models_matched_from_manifest = results.columns[2].values()[0] %}
    {% set has_matched_all_models = true if models_matched_from_manifest == models_in_run|length else false %}

  {% endif %}

  {{ return([min_last_success, max_last_success, models_matched_from_manifest, has_matched_all_models]) }}

{%- endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.print_list](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_list)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Get Incremental Manifest Table Relation {#macro.snowplow_utils.get_incremental_manifest_table_relation}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_incremental_manifest_table_relation.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_table_relation.sql">(source)</a></summary>

```jinja2
{% macro get_incremental_manifest_table_relation(package_name) %}

  {%- set incremental_manifest_table = ref(package_name~'_incremental_manifest') -%}

  {{ return(incremental_manifest_table) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Level Limit {#macro.snowplow_utils.get_level_limit}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_level_limit.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_level_limit.sql">(source)</a></summary>

```jinja2
{% macro get_level_limit(level, level_filter, required_field_names) %}
  
  {% set accepted_level_filters = ['equalto','lessthan','greaterthan'] %}

  {% if level_filter is not in accepted_level_filters %}
    {% set incompatible_level_filter_error_message -%}
      Error: Incompatible level filter arg. Accepted args: {{accepted_level_filters|join(', ')}}
    {%- endset %}
    {{ return(snowplow_utils.throw_compiler_error(incompatible_level_filter_error_message)) }}
  {% endif %}

  {% if level is not none and required_field_names|length %}
    {% set double_filter_error_message -%}
      Error: Cannot filter fields by both `required_fields` and `level` arg. Please use only one.
    {%- endset %}
    {{ return(snowplow_utils.throw_compiler_error(double_filter_error_message)) }}
  {% endif %}

  {% if required_field_names|length and level_filter != 'equalto' %}
    {% set required_fields_error_message -%}
      Error: To filter fields using `required_fields` arg, `level_filter` must be set to `equalto`
    {%- endset %}
    {{ return(snowplow_utils.throw_compiler_error(required_fields_error_message)) }}
  {% endif %}

  {# level_limit is inclusive #}

  {% if level is not none %}

    {% if level_filter == 'equalto' %}

      {% set level_limit = level %}

    {% elif level_filter == 'lessthan' %}

      {% set level_limit = level -1  %}

    {% elif level_filter == 'greaterthan' %}

      {% set level_limit = none %}

    {% endif %}

  {% elif required_field_names|length %}

    {% set field_depths = [] %}
    {% for field in required_field_names %}
      {% set field_depth = field.split('.')|length %}
      {% do field_depths.append(field_depth) %}
    {% endfor %}

    {% set level_limit = field_depths|max %}

  {% else %}

    {# Case when selecting all available fields #}

    {% set level_limit = none %}

  {% endif %}

  {{ return(level_limit) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.throw_compiler_error](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.throw_compiler_error)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Matched Fields {#macro.snowplow_utils.get_matched_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_matched_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_matched_fields.sql">(source)</a></summary>

```jinja2
{% macro get_matched_fields(fields, required_field_names, nested_level, level_filter) %}

  {% if not required_field_names|length %}

    {% if nested_level is none %}

      {% set matched_fields = fields %}

    {% else %}

      {% set matched_fields = fields|selectattr('nested_level',level_filter, nested_level)|list %}

    {% endif %}

  {% else %}

    {% set matched_fields = fields|selectattr('field_name','in', required_field_names)|list %}

  {% endif %}

  {{ return(matched_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get New Event Limits Table Relation {#macro.snowplow_utils.get_new_event_limits_table_relation}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_new_event_limits_table_relation.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_new_event_limits_table_relation.sql">(source)</a></summary>

```jinja2
{% macro get_new_event_limits_table_relation(package_name) %}

  {%- set new_event_limits_table = ref(package_name~'_base_new_event_limits') -%}

  {{ return(new_event_limits_table) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)

</TabItem>
</Tabs>
</DbtDetails>

### Get Optional Fields {#macro.snowplow_utils.get_optional_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/get_optional_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/get_optional_fields.sql">(source)</a></summary>

```jinja2
{% macro get_optional_fields(enabled, fields, col_prefix, relation, relation_alias, include_field_alias=true) -%}

  {%- if enabled -%}

    {%- set combined_fields = snowplow_utils.combine_column_versions(
                                    relation=relation,
                                    column_prefix=col_prefix,
                                    required_fields=fields|map(attribute='field')|list,
                                    relation_alias=relation_alias,
                                    include_field_alias=include_field_alias
                                    ) -%}

    {{ combined_fields|join(',\n') }}

  {%- else -%}

    {% for field in fields %}

      {%- set field_alias = snowplow_utils.get_field_alias(field.field)[1] -%}

      cast(null as {{ field.dtype }}) as {{ field_alias }} {%- if not loop.last %}, {% endif %}
    {% endfor %}

  {%- endif -%}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.get_field_alias](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field_alias)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_interactions_this_run)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Partition By {#macro.snowplow_utils.get_partition_by}

<DbtDetails><summary>
<code>macros/utils/get_partition_by.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_partition_by.sql">(source)</a></summary>

```jinja2
{%- macro get_partition_by(bigquery_partition_by=none, databricks_partition_by=none) -%}

  {% if target.type == 'bigquery' %}
    {{ return(bigquery_partition_by) }}
  {% elif target.type in ['databricks', 'spark'] %}
    {{ return(databricks_partition_by) }}
  {% endif %}

{%- endmacro -%}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_session_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_session_stats)
- [model.snowplow_media_player.snowplow_media_player_user_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_user_stats)
- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)
- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)
- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)
- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)
- [model.snowplow_web.snowplow_web_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_user_mapping)
- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)
- [model.snowplow_web.snowplow_web_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_aggs)

</TabItem>
</Tabs>
</DbtDetails>

### Get Quarantine Sql {#macro.snowplow_utils.get_quarantine_sql}

<DbtDetails><summary>
<code>macros/incremental_hooks/quarantine_sessions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/quarantine_sessions.sql">(source)</a></summary>

```jinja2
{% macro get_quarantine_sql(relation, max_session_length) %}

  {# Find sessions exceeding max_session_days #}
  {% set quarantine_sql -%}

    select
      session_id

    from {{ relation }}
    -- '=' since end_tstamp is restricted to start_tstamp + max_session_days
    where end_tstamp = {{ snowplow_utils.timestamp_add(
                              'day',
                              max_session_length,
                              'start_tstamp'
                              ) }}

  {%- endset %}

  {{ return(quarantine_sql) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.quarantine_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Run Limits {#macro.snowplow_utils.get_run_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_run_limits.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_run_limits.sql">(source)</a></summary>

```jinja2
{% macro get_run_limits(min_last_success, max_last_success, models_matched_from_manifest, has_matched_all_models, start_date) -%}

  {% set start_tstamp = snowplow_utils.cast_to_tstamp(start_date) %}
  {% set min_last_success = snowplow_utils.cast_to_tstamp(min_last_success) %}
  {% set max_last_success = snowplow_utils.cast_to_tstamp(max_last_success) %}

  {% if not execute %}
    {{ return('') }}
  {% endif %}

  {% if models_matched_from_manifest == 0 %}
    {# If no snowplow models are in the manifest, start from start_tstamp #}
    {% do snowplow_utils.log_message("Snowplow: No data in manifest. Processing data from start_date") %}

    {% set run_limits_query %}
      select {{start_tstamp}} as lower_limit,
             least({{ snowplow_utils.timestamp_add('day', var("snowplow__backfill_limit_days", 30), start_tstamp) }},
                   {{ snowplow_utils.current_timestamp_in_utc() }}) as upper_limit
    {% endset %}

  {% elif not has_matched_all_models %}
    {# If a new Snowplow model is added which isnt already in the manifest, replay all events up to upper_limit #}
    {% do snowplow_utils.log_message("Snowplow: New Snowplow incremental model. Backfilling") %}

    {% set run_limits_query %}
      select {{ start_tstamp }} as lower_limit,
             least({{ max_last_success }},
                   {{ snowplow_utils.timestamp_add('day', var("snowplow__backfill_limit_days", 30), start_tstamp) }}) as upper_limit
    {% endset %}

  {% elif min_last_success != max_last_success %}
    {# If all models in the run exists in the manifest but are out of sync, replay from the min last success to the max last success #}
    {% do snowplow_utils.log_message("Snowplow: Snowplow incremental models out of sync. Syncing") %}

    {% set run_limits_query %}
      select {{ snowplow_utils.timestamp_add('hour', -var("snowplow__lookback_window_hours", 6), min_last_success) }} as lower_limit,
             least({{ max_last_success }},
                  {{ snowplow_utils.timestamp_add('day', var("snowplow__backfill_limit_days", 30), min_last_success) }}) as upper_limit
    {% endset %}

  {% else %}
    {# Else standard run of the model #}
    {% do snowplow_utils.log_message("Snowplow: Standard incremental run") %}

    {% set run_limits_query %}
      select
        {{ snowplow_utils.timestamp_add('hour', -var("snowplow__lookback_window_hours", 6), min_last_success) }} as lower_limit,
        least({{ snowplow_utils.timestamp_add('day', var("snowplow__backfill_limit_days", 30), min_last_success) }},
              {{ snowplow_utils.current_timestamp_in_utc() }}) as upper_limit
    {% endset %}

  {% endif %}

  {{ return(run_limits_query) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt_utils.current_timestamp_in_utc
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Get Schemas By Pattern {#macro.snowplow_utils.get_schemas_by_pattern}

<DbtDetails><summary>
<code>macros/utils/get_schemas_by_pattern.sql</code>
</summary>

#### Description
Given a pattern, finds and returns all schemas that match that pattern. Note that for databricks any single character matches (`_`) will not be properly translated due to databricks using a regex expression instead of a SQL `like` clause.

      

#### Arguments
- `schema_pattern` *(string)*: The pattern for the schema(s) you wish to find. For all non-databricks should be of the usual SQL `like` form. `%` will be automatically translated for databricks, but other special characters may not be

#### Returns

      A list of schemas that match the pattern provided.


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_schemas_by_pattern.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro get_schemas_by_pattern(schema_pattern, table_pattern) %}
    {{ return(adapter.dispatch('get_schemas_by_pattern', 'snowplow_utils')
        (schema_pattern, table_pattern)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__get_schemas_by_pattern(schema_pattern, table_pattern) %}
    {%- set schema_pattern= schema_pattern~'*' -%}

    {# Get all schemas with the target.schema prefix #}
    {%- set get_schemas_sql -%}
        SHOW SCHEMAS LIKE '{{schema_pattern}}';
    {%- endset -%}

    {% set results = run_query(get_schemas_sql) %}
    {% set schemas = results|map(attribute='databaseName')|unique|list %}

    {{ return(schemas) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_schemas_by_pattern(schema_pattern, table_pattern) %}
    {%- set schema_pattern= schema_pattern~'%' -%}

    {% set get_tables_sql = dbt_utils.get_tables_by_pattern_sql(schema_pattern, table_pattern='%') %}
    {% set results = [] if get_tables_sql.isspace() else run_query(get_tables_sql) %}
    {% set schemas = results|map(attribute='table_schema')|unique|list %}
    {{ return(schemas) }}

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2


{%- macro spark__get_schemas_by_pattern(schema_pattern, table_pattern) -%}
    {{ return(snowplow_utils.databricks__get_schemas_by_pattern(schema_pattern, table_pattern)) }}
{%- endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.replace
- macro.dbt.run_query
- macro.dbt_utils.get_tables_by_pattern_sql


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.post_ci_cleanup](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.post_ci_cleanup)

</TabItem>
</Tabs>
</DbtDetails>

### Get Session Lookback Limit {#macro.snowplow_utils.get_session_lookback_limit}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_session_lookback_limit.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_session_lookback_limit.sql">(source)</a></summary>

```jinja2
{% macro get_session_lookback_limit(lower_limit) %}
  
  {% if not execute %}
    {{ return('')}}
  {% endif %}

  {% set limit_query %}
    select
    {{ snowplow_utils.timestamp_add(
                'day', 
                -var("snowplow__session_lookback_days", 365),
                lower_limit) }} as session_lookback_limit

  {% endset %}

  {% set results = run_query(limit_query) %}
   
  {% if execute %}

    {% set session_lookback_limit = snowplow_utils.cast_to_tstamp(results.columns[0].values()[0]) %}

  {{ return(session_lookback_limit) }}

  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Get Snowplow Delete Insert Sql {#macro.snowplow_utils.get_snowplow_delete_insert_sql}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/get_snowplow_delete_insert_sql.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/get_snowplow_delete_insert_sql.sql">(source)</a></summary>

```jinja2
{% macro get_snowplow_delete_insert_sql(target, source, unique_key, dest_cols_csv, predicates) -%}
  {{ adapter.dispatch('get_snowplow_delete_insert_sql', 'snowplow_utils')(target, source, unique_key, dest_cols_csv, predicates) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.default__get_snowplow_delete_insert_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.default__get_snowplow_delete_insert_sql)
- [macro.snowplow_utils.snowflake__get_snowplow_delete_insert_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__get_snowplow_delete_insert_sql)

</DbtDetails>

### Get Snowplow Merge Sql {#macro.snowplow_utils.get_snowplow_merge_sql}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/get_snowplow_merge_sql.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/get_snowplow_merge_sql.sql">(source)</a></summary>

```jinja2
{% macro get_snowplow_merge_sql(target, source, unique_key, dest_columns, predicates, include_sql_header) -%}
  {{ adapter.dispatch('get_snowplow_merge_sql', 'snowplow_utils')(target, source, unique_key, dest_columns, predicates, include_sql_header) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.default__get_snowplow_merge_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.default__get_snowplow_merge_sql)

</DbtDetails>

### Get Snowplow Upsert Limits Sql {#macro.snowplow_utils.get_snowplow_upsert_limits_sql}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/get_snowplow_upsert_limits_sql.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/get_snowplow_upsert_limits_sql.sql">(source)</a></summary>

```jinja2
{% macro get_snowplow_upsert_limits_sql(tmp_relation, upsert_date_key, disable_upsert_lookback) -%}
  {{ adapter.dispatch('get_snowplow_upsert_limits_sql', 'snowplow_utils')(tmp_relation, upsert_date_key, disable_upsert_lookback) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.bigquery__get_snowplow_upsert_limits_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.bigquery__get_snowplow_upsert_limits_sql)
- [macro.snowplow_utils.snowflake__get_snowplow_upsert_limits_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__get_snowplow_upsert_limits_sql)

</DbtDetails>

### Get Split To Array {#macro.snowplow_utils.get_split_to_array}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_split_to_array.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_split_to_array.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2


{%- macro get_split_to_array(string_column, column_prefix) -%}
    {{ return(adapter.dispatch('get_split_to_array', 'snowplow_utils')(string_column, column_prefix)) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_split_to_array(string_column, column_prefix) %}
   split({{column_prefix}}.{{string_column}}, ',')
{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_split_to_array(string_column, column_prefix) %}
    string_to_array({{column_prefix}}.{{string_column}}, ',')
{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__get_split_to_array(string_column, column_prefix) %}
    split_to_array({{column_prefix}}.{{string_column}})
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)

</TabItem>
</Tabs>
</DbtDetails>

### Get String Agg {#macro.snowplow_utils.get_string_agg}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_string_agg.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_string_agg.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2


{%- macro get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) -%}

  {{ return(adapter.dispatch('get_string_agg', 'snowplow_utils')(string_column, column_prefix, separator, order_by_column, sort_numeric)) }}

{%- endmacro -%}


```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    string_agg(cast({{column_prefix}}.{{string_column}} as string), '{{separator}}' order by cast({{column_prefix}}.{{order_by_column}} as numeric))

  {%- else %}
    string_agg(cast({{column_prefix}}.{{string_column}} as string), '{{separator}}' order by {{column_prefix}}.{{order_by_column}})

  {%- endif -%}

{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    array_join(array_sort(collect_list(cast({{column_prefix}}.{{string_column}} as numeric))), '{{separator}}')

  {%- else %}
    array_join(array_sort(collect_list({{column_prefix}}.{{string_column}})), '{{separator}}')

  {%- endif -%}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    listagg({{column_prefix}}.{{string_column}}::varchar, '{{separator}}') within group (order by to_numeric({{column_prefix}}.{{order_by_column}}))

  {%- else %}
    listagg({{column_prefix}}.{{string_column}}, '{{separator}}') within group (order by {{column_prefix}}.{{order_by_column}})

  {%- endif -%}

{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    string_agg({{column_prefix}}.{{string_column}}::varchar, '{{separator}}' order by {{column_prefix}}.{{order_by_column}}::decimal)

  {%- else %}
    string_agg({{column_prefix}}.{{string_column}}::varchar, '{{separator}}' order by {{column_prefix}}.{{order_by_column}})

  {%- endif -%}

{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    listagg({{column_prefix}}.{{string_column}}::varchar, '{{separator}}') within group (order by text_to_numeric_alt({{column_prefix}}.{{order_by_column}}))

  {%- else %}
    listagg({{column_prefix}}.{{string_column}}::varchar, '{{separator}}') within group (order by {{column_prefix}}.{{order_by_column}})

  {%- endif -%}

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_string_agg(string_column, column_prefix, separator=',', order_by_column=string_column, sort_numeric=false) %}

  {%- if sort_numeric -%}
    array_join(array_sort(collect_list(cast({{column_prefix}}.{{string_column}} as numeric))), '{{separator}}')

  {%- else %}
    array_join(array_sort(collect_list({{column_prefix}}.{{string_column}})), '{{separator}}')

  {%- endif -%}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Successful Models {#macro.snowplow_utils.get_successful_models}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_successful_models.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_successful_models.sql">(source)</a></summary>

```jinja2
{% macro get_successful_models(models=[], run_results=results) -%}

  {% set successful_models = [] %}
  {# Remove the patch version from dbt version #}
  {% set dbt_version_trunc = dbt_version.split('.')[0:2]|join('.')|float %}

  {% if execute %}

    {% for res in run_results -%}
      {# Filter for models #}
      {% if res.node.unique_id.startswith('model.') %}

        {% set is_model_to_include = true if not models|length or res.node.name in models else false %}

        {# run_results schema changed between dbt v0.18 and v0.19 so different methods to define success #}
        {% if dbt_version_trunc <= 0.18 %}
          {% set skipped = true if res.status is none and res.skip else false %}
          {% set errored = true if res.status == 'ERROR' else false %}
          {% set success = true if not (skipped or errored) else false %}
        {% else %}
          {% set success = true if res.status == 'success' else false %}
        {% endif %}

        {% if success and is_model_to_include %}

          {%- do successful_models.append(res.node.name) -%}

        {% endif %}

      {% endif %}

    {% endfor %}

    {{ return(successful_models) }}

  {% endif %}

{%- endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Value By Target {#macro.snowplow_utils.get_value_by_target}

<DbtDetails><summary>
<code>macros/utils/get_value_by_target.sql</code>
</summary>

#### Description
This macro is designed to dynamically return values based on the target (`target.name`) you are running against. Your target names are defined in your [profiles.yml](https://docs.getdbt.com/reference/profiles.yml) file. This can be useful for dynamically changing variables within your project, depending on whether you are running in dev or prod.



#### Arguments
- `dev_value`: Value to use if target is development
- `default_value`: Value to use if target is not development
- `dev_target_name` *(string)*: (Optional) Name of the development target. Default `dev`

#### Returns

The value relevant to the target environment

#### Usage

```yml

# dbt_project.yml
...
vars:
snowplow_web:
    snowplow__backfill_limit_days: "{{ snowplow_utils.get_value_by_target(dev_value=1, default_value=30, dev_target_name='dev') }}"

```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_value_by_target.sql">(source)</a></summary>

```jinja2
{% macro get_value_by_target(dev_value, default_value, dev_target_name='dev') %}

  {% if target.name == dev_target_name %}
    {% set value = dev_value %}
  {% else %}
    {% set value = default_value %}
  {% endif %}

  {{ return(value) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_mobile.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.allow_refresh)
- [macro.snowplow_normalize.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.allow_refresh)
- [macro.snowplow_web.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.allow_refresh)

</TabItem>
</Tabs>
</DbtDetails>

### Get Value By Target Type {#macro.snowplow_utils.get_value_by_target_type}

<DbtDetails><summary>
<code>macros/utils/get_value_by_target_type.sql</code>
</summary>

#### Description
Returns the value provided based on the `target.type`. This is useful when you need a different value based on which warehouse is being used e.g. cluster fields or partition keys.



#### Arguments
- `bigquery_val` *(string)*: (Optional) Value to return if the `target.type` is bigquery. Default None
- `snowflake_val` *(string)*: (Optional) Value to return if the `target.type` is snowflake. Default None
- `redshift_val` *(string)*: (Optional) Value to return if the `target.type` is redshift. Default None
- `postgres_val` *(string)*: (Optional) Value to return if the `target.type` is postgres. Default None
- `databricks_val` *(string)*: (Optional) Value to return if the `target.type` is databricks. Default None

#### Returns

The appropriate value for the target warehouse type, or an error if not an expected target type.


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_value_by_target_type.sql">(source)</a></summary>

```jinja2
{%- macro get_value_by_target_type(bigquery_val=none, snowflake_val=none, redshift_val=none, postgres_val=none, databricks_val=none) -%}

  {% if target.type == 'bigquery' %}
    {{ return(bigquery_val) }}
  {% elif target.type == 'snowflake' %}
    {{ return(snowflake_val) }}
  {% elif target.type == 'redshift' %}
    {{ return(redshift_val) }}
  {% elif target.type in 'postgres' %}
    {{ return(postgres_val) }}
  {% elif target.type in ['databricks', 'spark'] %}
    {{ return(databricks_val) }}
  {% else %}
    {{ exceptions.raise_compiler_error("Snowplow: Unexpected target type "~target.type) }}
  {% endif %}

{%- endmacro -%}
```

</DbtDetails>

</DbtDetails>

### Is Run With New Events {#macro.snowplow_utils.is_run_with_new_events}

<DbtDetails><summary>
<code>macros/utils/is_run_with_new_events.sql</code>
</summary>

#### Description
This macro is designed for use with Snowplow data modelling packages like `snowplow-web`. It can be used in any incremental models, to effectively block the incremental model from being updated with old data which it has already consumed. This saves cost as well as preventing historical data from being overwritten with partially complete data (due to a batch back-fill for instance).

The macro utilizes the `snowplow_[platform]_incremental_manifest` table to determine whether the model from which the macro is called, i.e. `{{ this }}`, has already consumed the data in the given run. If it has, it returns `false`. If the data in the run contains new data, `true` is returned.

For the sessions lifecycle identifier it does not use the manifest as this table is not included in it.



#### Arguments
- `package_name` *(string)*: The modeling package name e.g. `snowplow-mobile`

#### Returns

`true` if the run contains new events previously not consumed by `this`, `false` otherwise.

#### Usage

```sql

{{
config(
    materialized='snowplow_incremental',
    unique_key='screen_view_id',
    upsert_date_key='start_tstamp'
)
}}

select
...

from {{ ref('snowplow_mobile_base_events_this_run' ) }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.

```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/is_run_with_new_events.sql">(source)</a></summary>

```jinja2
{% macro is_run_with_new_events(package_name) %}

  {%- set new_event_limits_relation = snowplow_utils.get_new_event_limits_table_relation(package_name) -%}
  {%- set incremental_manifest_relation = snowplow_utils.get_incremental_manifest_table_relation(package_name) -%}

  {% if snowplow_utils.snowplow_is_incremental() %}

    {%- set node_identifier = this.identifier -%}
    {%- set base_sessions_lifecycle_identifier = package_name+'_base_sessions_lifecycle_manifest' -%}

    {# base_sessions_lifecycle not included in manifest so query directly. Otherwise use the manifest for performance #}
    {%- if node_identifier == base_sessions_lifecycle_identifier -%}
      {#Technically should be max(end_tstsamp) but table is partitioned on start_tstamp so cheaper to use.
        Worst case we update the manifest during a backfill when we dont need to, which should be v rare. #}
      {% set has_been_processed_query %}
        select 
          case when 
            (select upper_limit from {{ new_event_limits_relation }}) <= (select max(start_tstamp) from {{this}}) 
          then false 
        else true end
      {% endset %}

    {%- else -%}

      {% set has_been_processed_query %}
        select 
          case when 
            (select upper_limit from {{ new_event_limits_relation }}) 
            <= (select last_success from {{ incremental_manifest_relation }} where model = '{{node_identifier}}') 
          then false 
        else true end
      {% endset %}

    {%- endif -%}

    {% set results = run_query(has_been_processed_query) %}

    {% if execute %}
      {% set has_new_events = results.columns[0].values()[0] | as_bool() %}
      {# Snowflake: dbt 0.18 returns bools as ints. Ints are not accepted as predicates in Snowflake. Cast to be safe. #}
      {% set has_new_events = 'cast('~has_new_events~' as boolean)' %}
    {% endif %}

  {% else %}

    {% set has_new_events = true %}

  {% endif %}

  {{ return(has_new_events) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.get_incremental_manifest_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_table_relation)
- [macro.snowplow_utils.get_new_event_limits_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_new_event_limits_table_relation)
- [macro.snowplow_utils.snowplow_is_incremental](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_is_incremental)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)
- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)
- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)
- [model.snowplow_web.snowplow_web_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_user_mapping)
- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_normalize.normalize_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.normalize_events)
- [macro.snowplow_normalize.users_table](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.users_table)

</TabItem>
</Tabs>
</DbtDetails>

### Log Message {#macro.snowplow_utils.log_message}

<DbtDetails><summary>
<code>macros/utils/log_message.sql</code>
</summary>

#### Description
A wrapper macro for the `dbt_utils.pretty_log_format` using the `snowplow__has_log_enabled` to determine if the log is also printed to the stdout.

#### Arguments
- `message` *(string)*: The string message to print.
- `is_printed` *(boolean)*: Boolean value to determine if the log is also printed to the stdout

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/log_message.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro log_message(message, is_printed=var('snowplow__has_log_enabled', true)) %}
    {{ return(adapter.dispatch('log_message', 'snowplow_utils')(message, is_printed)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__log_message(message, is_printed) %}
    {{ log(dbt_utils.pretty_log_format(message), info=is_printed) }}
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt_utils.pretty_log_format


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Materialization Snowplow Incremental Bigquery {#macro.snowplow_utils.materialization_snowplow_incremental_bigquery}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/bigquery/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/bigquery/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% materialization snowplow_incremental, adapter='bigquery' -%}

  {%- set full_refresh_mode = (should_full_refresh()) -%}

  {# Required keys. Throws error if not present #}
  {%- set unique_key = config.require('unique_key') -%}
  {%- set raw_partition_by = config.require('partition_by', none) -%}
  {%- set partition_by = adapter.parse_partition_by(raw_partition_by) -%}

  {# Raise error if dtype is int64. Unsupported. #}
  {% if partition_by.data_type == 'int64' %}
    {%- set wrong_dtype_message -%}
      Datatype int64 is not supported by 'snowplow_incremental'
      Please use one of the following: timestamp | date | datetime
    {%- endset -%}
    {% do exceptions.raise_compiler_error(wrong_dtype_message) %}
  {% endif %}

  {% set disable_upsert_lookback = config.get('disable_upsert_lookback') %}

  {%- set target_relation = this %}
  {%- set existing_relation = load_relation(this) %}
  {%- set tmp_relation = make_temp_relation(this) %}

  {# Validate early so we dont run SQL if the strategy is invalid or missing keys #}
  {% set strategy = snowplow_utils.snowplow_validate_get_incremental_strategy(config) -%}

  {%- set cluster_by = config.get('cluster_by', none) -%}

  {{ run_hooks(pre_hooks) }}

  {% if existing_relation is none %}
      {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif existing_relation.is_view %}
      {#-- There's no way to atomically replace a view with a table on BQ --#}
      {{ adapter.drop_relation(existing_relation) }}
      {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif full_refresh_mode %}
      {#-- If the partition/cluster config has changed, then we must drop and recreate --#}
      {% if not adapter.is_replaceable(existing_relation, partition_by, cluster_by) %}
          {% do log("Hard refreshing " ~ existing_relation ~ " because it is not replaceable") %}
          {{ adapter.drop_relation(existing_relation) }}
      {% endif %}
      {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% else %}
      {% set dest_columns = adapter.get_columns_in_relation(existing_relation) %}

      {% set build_sql = snowplow_utils.snowplow_merge(
          tmp_relation,
          target_relation,
          unique_key,
          partition_by,
          dest_columns,
          disable_upsert_lookback) %}

  {% endif %}

  {%- call statement('main') -%}
    {{ build_sql }}
  {% endcall %}

  {{ run_hooks(post_hooks) }}

  {% set target_relation = this.incorporate(type='table') %}

  {% do persist_docs(target_relation, model) %}

  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization %}
```

</DbtDetails>


#### Depends On
- macro.dbt.create_table_as
- macro.dbt.load_relation
- macro.dbt.make_temp_relation
- macro.dbt.persist_docs
- macro.dbt.run_hooks
- macro.dbt.should_full_refresh
- macro.dbt.statement
- [macro.snowplow_utils.snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_merge)
- [macro.snowplow_utils.snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_validate_get_incremental_strategy)

</DbtDetails>

### Materialization Snowplow Incremental Databricks {#macro.snowplow_utils.materialization_snowplow_incremental_databricks}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/databricks/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/databricks/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% materialization snowplow_incremental, adapter='databricks' -%}
  {%- set full_refresh_mode = (should_full_refresh()) -%}

  {# Required keys. Throws error if not present #}
  {%- set unique_key = config.require('unique_key') -%}
  {%- set upsert_date_key = config.require('upsert_date_key') -%}

  {% set disable_upsert_lookback = config.get('disable_upsert_lookback') %}

  {% set target_relation = this %}
  {% set existing_relation = load_relation(this) %}
  {% set tmp_relation = make_temp_relation(this) %}

  {# Validate early so we dont run SQL if the strategy is invalid or missing keys #}
  {% set strategy = snowplow_utils.snowplow_validate_get_incremental_strategy(config) -%}

  -- setup
  {{ run_hooks(pre_hooks, inside_transaction=False) }}

  -- `BEGIN` happens here:
  {{ run_hooks(pre_hooks, inside_transaction=True) }}

  {% if existing_relation is none %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif existing_relation.is_view %}
    {#-- Can't overwrite a view with a table - we must drop --#}
    {{ log("Dropping relation " ~ target_relation ~ " because it is a view and this model is a table.") }}
    {% do adapter.drop_relation(existing_relation) %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif full_refresh_mode %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% else %}
    {% do run_query(create_table_as(True, tmp_relation, sql)) %}
    {% do adapter.expand_target_column_types(
           from_relation=tmp_relation,
           to_relation=target_relation) %}

    {%- set dest_columns = adapter.get_columns_in_relation(target_relation) -%}

    {% set build_sql = snowplow_utils.snowplow_merge( tmp_relation,
                                                      target_relation,
                                                      unique_key,
                                                      upsert_date_key,
                                                      dest_columns,
                                                      disable_upsert_lookback)%}
  {% endif %}

  {%- call statement('main') -%}
    {{ build_sql }}
  {%- endcall -%}

  {{ run_hooks(post_hooks, inside_transaction=True) }}

  -- `COMMIT` happens here
  {{ adapter.commit() }}

  {{ run_hooks(post_hooks, inside_transaction=False) }}

  {% set target_relation = target_relation.incorporate(type='table') %}
  {% do persist_docs(target_relation, model) %}

  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization %}
```

</DbtDetails>


#### Depends On
- macro.dbt.create_table_as
- macro.dbt.load_relation
- macro.dbt.make_temp_relation
- macro.dbt.persist_docs
- macro.dbt.run_hooks
- macro.dbt.run_query
- macro.dbt.should_full_refresh
- macro.dbt.statement
- [macro.snowplow_utils.snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_merge)
- [macro.snowplow_utils.snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_validate_get_incremental_strategy)

</DbtDetails>

### Materialization Snowplow Incremental Default {#macro.snowplow_utils.materialization_snowplow_incremental_default}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/default/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/default/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% materialization snowplow_incremental, default -%}

  {% set full_refresh_mode = flags.FULL_REFRESH %}

  {# Required keys. Throws error if not present #}
  {%- set unique_key = config.require('unique_key') -%}
  {%- set upsert_date_key = config.require('upsert_date_key') -%}
  
  {% set disable_upsert_lookback = config.get('disable_upsert_lookback') %}

  {% set target_relation = this %}
  {% set existing_relation = load_relation(this) %}
  {% set tmp_relation = make_temp_relation(this) %}

  {{ run_hooks(pre_hooks, inside_transaction=False) }}

  -- `BEGIN` happens here:
  {{ run_hooks(pre_hooks, inside_transaction=True) }}

  {% set to_drop = [] %}
  {% if existing_relation is none %}
      {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif existing_relation.is_view or full_refresh_mode %}
      {#-- Make sure the backup doesn't exist so we don't encounter issues with the rename below #}
      {% set backup_identifier = existing_relation.identifier ~ "__dbt_backup" %}
      {% set backup_relation = existing_relation.incorporate(path={"identifier": backup_identifier}) %}
      {% do adapter.drop_relation(backup_relation) %}

      {% do adapter.rename_relation(target_relation, backup_relation) %}
      {% set build_sql = create_table_as(False, target_relation, sql) %}
      {% do to_drop.append(backup_relation) %}
  {% else %}
      {% set tmp_relation = make_temp_relation(target_relation) %}
      {% do run_query(create_table_as(True, tmp_relation, sql)) %}
      {% do adapter.expand_target_column_types(
             from_relation=tmp_relation,
             to_relation=target_relation) %}
      {%- set dest_columns = adapter.get_columns_in_relation(target_relation) -%}
      {% set build_sql = snowplow_utils.snowplow_delete_insert(
                                                     tmp_relation,
                                                     target_relation,
                                                     unique_key,
                                                     upsert_date_key,
                                                     dest_columns,
                                                     disable_upsert_lookback) %}
  {% endif %}

  {% call statement("main") %}
      {{ build_sql }}
  {% endcall %}

  {% if existing_relation is none or existing_relation.is_view or should_full_refresh() %} 
    {% do create_indexes(target_relation) %} 
  {% endif %} 

  {{ run_hooks(post_hooks, inside_transaction=True) }}

  -- `COMMIT` happens here
  {% do adapter.commit() %}

  {% for rel in to_drop %}
      {% do adapter.drop_relation(rel) %}
  {% endfor %}

  {{ run_hooks(post_hooks, inside_transaction=False) }}

  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization %}
```

</DbtDetails>


#### Depends On
- macro.dbt.create_indexes
- macro.dbt.create_table_as
- macro.dbt.load_relation
- macro.dbt.make_temp_relation
- macro.dbt.run_hooks
- macro.dbt.run_query
- macro.dbt.should_full_refresh
- macro.dbt.statement
- [macro.snowplow_utils.snowplow_delete_insert](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_insert)

</DbtDetails>

### Materialization Snowplow Incremental Snowflake {#macro.snowplow_utils.materialization_snowplow_incremental_snowflake}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/snowflake/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/snowflake/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% materialization snowplow_incremental, adapter='snowflake' -%}

  {% set original_query_tag = set_query_tag() %}

  {%- set full_refresh_mode = (should_full_refresh()) -%}

  {# Required keys. Throws error if not present #}
  {%- set unique_key = config.require('unique_key') -%}
  {%- set upsert_date_key = config.require('upsert_date_key') -%}
  
  {% set disable_upsert_lookback = config.get('disable_upsert_lookback') %}

  {% set target_relation = this %}
  {% set existing_relation = load_relation(this) %}
  {% set tmp_relation = make_temp_relation(this) %}

  {# Validate early so we don't run SQL if the strategy is invalid or missing keys #}
  {% set strategy = snowplow_utils.snowplow_validate_get_incremental_strategy(config) -%}

  -- setup
  {{ run_hooks(pre_hooks, inside_transaction=False) }}

  -- `BEGIN` happens here:
  {{ run_hooks(pre_hooks, inside_transaction=True) }}

  {% if existing_relation is none %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif existing_relation.is_view %}
    {#-- Can't overwrite a view with a table - we must drop --#}
    {{ log("Dropping relation " ~ target_relation ~ " because it is a view and this model is a table.") }}
    {% do adapter.drop_relation(existing_relation) %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif full_refresh_mode %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% else %}
    {% do run_query(create_table_as(True, tmp_relation, sql)) %}
    {% do adapter.expand_target_column_types(
           from_relation=tmp_relation,
           to_relation=target_relation) %}
    
    {%- set dest_columns = adapter.get_columns_in_relation(target_relation) -%}

    {% set build_sql = snowplow_utils.snowplow_snowflake_get_incremental_sql(strategy,
                                                                             tmp_relation,
                                                                             target_relation,
                                                                             unique_key,
                                                                             upsert_date_key,
                                                                             dest_columns,
                                                                             disable_upsert_lookback)%}
  {% endif %}

  {%- call statement('main') -%}
    {{ build_sql }}
  {%- endcall -%}

  {{ run_hooks(post_hooks, inside_transaction=True) }}

  -- `COMMIT` happens here
  {{ adapter.commit() }}

  {{ run_hooks(post_hooks, inside_transaction=False) }}

  {% set target_relation = target_relation.incorporate(type='table') %}
  {% do persist_docs(target_relation, model) %}

  {% do unset_query_tag(original_query_tag) %}

  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization %}
```

</DbtDetails>


#### Depends On
- macro.dbt.create_table_as
- macro.dbt.load_relation
- macro.dbt.make_temp_relation
- macro.dbt.persist_docs
- macro.dbt.run_hooks
- macro.dbt.run_query
- macro.dbt.should_full_refresh
- macro.dbt.statement
- macro.dbt_snowflake.unset_query_tag
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)
- [macro.snowplow_utils.snowplow_snowflake_get_incremental_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_snowflake_get_incremental_sql)
- [macro.snowplow_utils.snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_validate_get_incremental_strategy)

</DbtDetails>

### Materialization Snowplow Incremental Spark {#macro.snowplow_utils.materialization_snowplow_incremental_spark}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/spark/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/spark/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% materialization snowplow_incremental, adapter='spark' -%}
  {%- set full_refresh_mode = (should_full_refresh()) -%}

  {# Required keys. Throws error if not present #}
  {%- set unique_key = config.require('unique_key') -%}
  {%- set upsert_date_key = config.require('upsert_date_key') -%}

  {% set disable_upsert_lookback = config.get('disable_upsert_lookback') %}

  {% set target_relation = this %}
  {% set existing_relation = load_relation(this) %}
  {% set tmp_relation = make_temp_relation(this) %}

  {# Validate early so we dont run SQL if the strategy is invalid or missing keys #}
  {% set strategy = snowplow_utils.snowplow_validate_get_incremental_strategy(config) -%}

  -- setup
  {{ run_hooks(pre_hooks, inside_transaction=False) }}

  -- `BEGIN` happens here:
  {{ run_hooks(pre_hooks, inside_transaction=True) }}

  {% if existing_relation is none %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif existing_relation.is_view %}
    {#-- Can't overwrite a view with a table - we must drop --#}
    {{ log("Dropping relation " ~ target_relation ~ " because it is a view and this model is a table.") }}
    {% do adapter.drop_relation(existing_relation) %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% elif full_refresh_mode %}
    {% set build_sql = create_table_as(False, target_relation, sql) %}
  {% else %}
    {% do run_query(create_table_as(True, tmp_relation, sql)) %}
    {% do adapter.expand_target_column_types(
           from_relation=tmp_relation,
           to_relation=target_relation) %}

    {%- set dest_columns = adapter.get_columns_in_relation(target_relation) -%}

    {% set build_sql = snowplow_utils.snowplow_merge( tmp_relation,
                                                      target_relation,
                                                      unique_key,
                                                      upsert_date_key,
                                                      dest_columns,
                                                      disable_upsert_lookback)%}
  {% endif %}

  {%- call statement('main') -%}
    {{ build_sql }}
  {%- endcall -%}

  {{ run_hooks(post_hooks, inside_transaction=True) }}

  -- `COMMIT` happens here
  {{ adapter.commit() }}

  {{ run_hooks(post_hooks, inside_transaction=False) }}

  {% set target_relation = target_relation.incorporate(type='table') %}
  {% do persist_docs(target_relation, model) %}

  {{ return({'relations': [target_relation]}) }}

{%- endmaterialization %}
```

</DbtDetails>


#### Depends On
- macro.dbt.create_table_as
- macro.dbt.load_relation
- macro.dbt.make_temp_relation
- macro.dbt.persist_docs
- macro.dbt.run_hooks
- macro.dbt.run_query
- macro.dbt.should_full_refresh
- macro.dbt.statement
- [macro.snowplow_utils.snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_merge)
- [macro.snowplow_utils.snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_validate_get_incremental_strategy)

</DbtDetails>

### Merge Fields Across Col Versions {#macro.snowplow_utils.merge_fields_across_col_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/merge_fields_across_col_versions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/merge_fields_across_col_versions.sql">(source)</a></summary>

```jinja2
{% macro merge_fields_across_col_versions(fields_by_col_version) %}

  {# Flatten nested list of dicts into single list #}
  {% set all_cols = fields_by_col_version|sum(start=[]) %}

  {% set all_field_names = all_cols|map(attribute="field_name")|list %}

  {% set unique_field_names = all_field_names|unique|list %}

  {% set merged_fields = [] %}

  {% for field_name in unique_field_names %}

    {# Get all field_paths per field. Returned as array. #}
    {% set field_paths = all_cols|selectattr('field_name','equalto', field_name)|map(attribute='path')|list %}
    
    {# Get nested_level of field. Returned as single element array. #}
    {% set nested_level = all_cols|selectattr('field_name',"equalto", field_name)|map(attribute='nested_level')|list%}

    {% set merged_field = {
                           'field_name': field_name,
                           'field_paths': field_paths,
                           'nested_level': nested_level[0]
                           } %}

    {% do merged_fields.append(merged_field) %}

  {% endfor %}

  {{ return(merged_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### N Timedeltas Ago {#macro.snowplow_utils.n_timedeltas_ago}

<DbtDetails><summary>
<code>macros/utils/n_timedeltas_ago.sql</code>
</summary>

#### Description
This macro takes the current timestamp and subtracts `n` units, as defined by the `timedelta_attribute`, from it. This is achieved using the Python datetime module, rather than querying your database. By combining this with the `get_value_by_target` macro, you can dynamically set dates depending on your environment.



#### Arguments
- `n` *(integer)*: The number of timedeltas to subtract from the current timestamp
- `timedelta_attribute` *(string)*: The type of units to subtract. This can be any valid attribute of the [timedelta](https://docs.python.org/3/library/datetime.html#timedelta-objects) object

#### Returns

Current timestamp minus `n` units.

#### Usage

```sql

{{ snowplow_utils.n_timedeltas_ago(1, 'weeks') }}

```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/n_timedeltas_ago.sql">(source)</a></summary>

```jinja2
{% macro n_timedeltas_ago(n, timedelta_attribute) %}

  {% set arg_dict = {timedelta_attribute: n} %}
  {% set now = modules.datetime.datetime.now() %}
  {% set n_timedeltas_ago = (now - modules.datetime.timedelta(**arg_dict)) %}

  {{ return(n_timedeltas_ago) }}
  
{% endmacro %}
```

</DbtDetails>

</DbtDetails>

### Post Ci Cleanup {#macro.snowplow_utils.post_ci_cleanup}

<DbtDetails><summary>
<code>macros/utils/post_ci_cleanup.sql</code>
</summary>

#### Description
This macro deletes all schemas that start with the specified `schema_pattern`, mostly for use before/after CI testing to ensure a clean start and removal of data after CI tests.

#### Arguments
- `schema_pattern` *(string)*: The prefix of the schema(s) to delete

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/post_ci_cleanup.sql">(source)</a></summary>

```jinja2
{% macro post_ci_cleanup(schema_pattern=target.schema) %}

  {# Get all schemas with the target.schema prefix #}
  {% set schemas = snowplow_utils.get_schemas_by_pattern(schema_pattern,table_pattern='%') %}

  {% if schemas|length %}

    {%- if target.type in ['databricks', 'spark'] -%}
      {# Generate sql to drop all identified schemas #}
      {% for schema in schemas -%}
        {%- set drop_schema_sql -%}
          DROP SCHEMA IF EXISTS {{schema}} CASCADE;
        {%- endset -%}

        {% do run_query(drop_schema_sql) %}

      {% endfor %}

    {%- else -%}
      {# Generate sql to drop all identified schemas #}
      {% set drop_schema_sql -%}

        {% for schema in schemas -%}
          DROP SCHEMA IF EXISTS {{schema}} CASCADE;
        {% endfor %}

      {%- endset %}

      {# Drop schemas #}
      {% do run_query(drop_schema_sql) %}

    {%- endif -%}

  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.get_schemas_by_pattern](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_schemas_by_pattern)

</DbtDetails>

### Print List {#macro.snowplow_utils.print_list}

<DbtDetails><summary>
<code>macros/utils/print_list.sql</code>
</summary>

#### Description
Prints an array as a `seperator` separated quoted list.



#### Arguments
- `list` *(array)*: Array object to print the (quoted) items of
- `separator` *(string)*: The character(s) to separate the items by, default `,`

#### Returns

Separated output of items in the list, quoted.


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/print_list.sql">(source)</a></summary>

```jinja2
{% macro print_list(list) %}

  {%- for item in list %} '{{item}}' {%- if not loop.last %},{% endif %} {% endfor -%}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Print Run Limits {#macro.snowplow_utils.print_run_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_incremental_manifest_status.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_status.sql">(source)</a></summary>

```jinja2
{% macro print_run_limits(run_limits_relation) -%}

  {% set run_limits_query %}
    select lower_limit, upper_limit from {{ run_limits_relation }}
  {% endset %}

  {# Derive limits from manifest instead of selecting from limits table since run_query executes during 2nd parse the limits table is yet to be updated. #}
  {% set results = run_query(run_limits_query) %}

  {% if execute %}

    {% set lower_limit = snowplow_utils.tstamp_to_str(results.columns[0].values()[0]) %}
    {% set upper_limit = snowplow_utils.tstamp_to_str(results.columns[1].values()[0]) %}
    {% set run_limits_message = "Snowplow: Processing data between " + lower_limit + " and " + upper_limit %}

    {% do snowplow_utils.log_message(run_limits_message) %}

  {% endif %}

{%- endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.tstamp_to_str](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.tstamp_to_str)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Quarantine Sessions {#macro.snowplow_utils.quarantine_sessions}

<DbtDetails><summary>
<code>macros/incremental_hooks/quarantine_sessions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/quarantine_sessions.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro quarantine_sessions(package_name, max_session_length, src_relation=this) %}
  
  {{ return(adapter.dispatch('quarantine_sessions', 'snowplow_utils')(package_name, max_session_length, src_relation=this)) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__quarantine_sessions(package_name, max_session_length, src_relation=this) %}
  
  {% set quarantined_sessions = ref(package_name~'_base_quarantined_sessions') %}
  
  {% set sessions_to_quarantine_sql = snowplow_utils.get_quarantine_sql(src_relation, max_session_length) %}

  merge into {{ quarantined_sessions }} trg
  using ({{ sessions_to_quarantine_sql }}) src
  on trg.session_id = src.session_id
  when not matched then insert (session_id) values(session_id);

{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__quarantine_sessions(package_name, max_session_length, src_relation=this) %}
  
  {% set quarantined_sessions = ref(package_name~'_base_quarantined_sessions') %}
  {% set sessions_to_quarantine_tmp = 'sessions_to_quarantine_tmp' %}

  begin;

    create temporary table {{ sessions_to_quarantine_tmp }} as (
      {{ snowplow_utils.get_quarantine_sql(src_relation, max_session_length) }}
    );

    delete from {{ quarantined_sessions }}
    where session_id in (select session_id from {{ sessions_to_quarantine_tmp }});

    insert into {{ quarantined_sessions }} (
      select session_id from {{ sessions_to_quarantine_tmp }});

    drop table {{ sessions_to_quarantine_tmp }};

  commit;

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_quarantine_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_quarantine_sql)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_web.snowplow_web_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Return Base New Event Limits {#macro.snowplow_utils.return_base_new_event_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/return_base_new_event_limits.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/return_base_new_event_limits.sql">(source)</a></summary>

```jinja2
{% macro return_base_new_event_limits(base_events_this_run) -%}

  {% if not execute %}
    {{ return(['','',''])}}
  {% endif %}
  
  {% set limit_query %} 
    select 
      lower_limit, 
      upper_limit,
      {{ snowplow_utils.timestamp_add('day', 
                                     -var("snowplow__max_session_days", 3),
                                     'lower_limit') }} as session_start_limit

    from {{ base_events_this_run }} 
    {% endset %}

  {% set results = run_query(limit_query) %}
   
  {% if execute %}

    {% set lower_limit = snowplow_utils.cast_to_tstamp(results.columns[0].values()[0]) %}
    {% set upper_limit = snowplow_utils.cast_to_tstamp(results.columns[1].values()[0]) %}
    {% set session_start_limit = snowplow_utils.cast_to_tstamp(results.columns[2].values()[0]) %}

  {{ return([lower_limit, upper_limit, session_start_limit]) }}

  {% endif %}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Return Limits From Model {#macro.snowplow_utils.return_limits_from_model}

<DbtDetails><summary>
<code>macros/utils/return_limits_from_model.sql</code>
</summary>

#### Description
Calculates and returns the minimum (lower) and maximum (upper) values of specified columns within the specified table. Useful to find ranges of a column within a table.



#### Arguments
- `model` *(relation)*: A string or `ref` type object to refer to a model or table to return limits from
- `lower_limit_col` *(string)*: The column to take the `min` of to get the lower limit
- `upper_limit_col` *(string)*: The column to take the `max` of to get the upper limit

#### Returns

A list of two objects, the lower and upper values from the columns in the model


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/return_limits_from_model.sql">(source)</a></summary>

```jinja2
{% macro return_limits_from_model(model, lower_limit_col, upper_limit_col) -%}

  {% if not execute %}
    {{ return(['','']) }}
  {% endif %}
  
  {% set limit_query %} 
    select 
      min({{lower_limit_col}}) as lower_limit,
      max({{upper_limit_col}}) as upper_limit
    from {{ model }} 
    {% endset %}

  {% set results = run_query(limit_query) %}
   
  {% if execute %}

    {% set lower_limit = snowplow_utils.cast_to_tstamp(results.columns[0].values()[0]) %}
    {% set upper_limit = snowplow_utils.cast_to_tstamp(results.columns[1].values()[0]) %}

  {{ return([lower_limit, upper_limit]) }}

  {% endif %}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_app_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_app_context)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_geo_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_geo_context)
- [model.snowplow_mobile.snowplow_mobile_base_mobile_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_mobile_context)
- [model.snowplow_mobile.snowplow_mobile_base_screen_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_screen_context)
- [model.snowplow_mobile.snowplow_mobile_base_session_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_session_context)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Set Query Tag {#macro.snowplow_utils.set_query_tag}

<DbtDetails><summary>
<code>macros/utils/set_query_tag.sql</code>
</summary>

#### Description
This macro takes a provided statement as argument and generates the SQL command to set this statement as the query_tag for Snowflake databases, and does nothing otherwise. It can be used to safely set the query_tag regardless of database type.



#### Arguments
- `statement` *(string)*: The statement to use as the `query_tag` within Snowflake

#### Returns

An alter session command set to the `query_tag` to the `statement` for Snowflake, otherwise nothing

#### Usage

```sql

{{ snowplow_utils.set_query_tag('snowplow_query_tag') }}

```


#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/set_query_tag.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{%- macro set_query_tag(statement) -%}
  {{ return(adapter.dispatch('set_query_tag', 'snowplow_utils')(statement)) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__set_query_tag(statement) %}
    
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__set_query_tag(statement) %}
    alter session set query_tag = '{{ statement }}';
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions_this_run)
- [model.snowplow_fractribution.snowplow_fractribution_channel_counts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_counts)
- [model.snowplow_fractribution.snowplow_fractribution_channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_spend)
- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_path_summary](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_path_summary)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)
- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_interactions_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)
- [model.snowplow_media_player.snowplow_media_player_plays_by_pageview](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_plays_by_pageview)
- [model.snowplow_media_player.snowplow_media_player_session_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_session_stats)
- [model.snowplow_media_player.snowplow_media_player_user_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_user_stats)
- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_sessions_sv_details](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_sv_details)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)
- [model.snowplow_mobile.snowplow_mobile_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_aggs)
- [model.snowplow_mobile.snowplow_mobile_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_lasts)
- [model.snowplow_mobile.snowplow_mobile_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users_this_run)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_quarantined_sessions)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_this_run)
- [model.snowplow_web.snowplow_web_consent_cmp_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_cmp_stats)
- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)
- [model.snowplow_web.snowplow_web_consent_totals](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_totals)
- [model.snowplow_web.snowplow_web_consent_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_users)
- [model.snowplow_web.snowplow_web_consent_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_versions)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)
- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_pv_engaged_time](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_pv_engaged_time)
- [model.snowplow_web.snowplow_web_pv_scroll_depth](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_pv_scroll_depth)
- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)
- [model.snowplow_web.snowplow_web_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_aggs)
- [model.snowplow_web.snowplow_web_sessions_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_lasts)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)
- [model.snowplow_web.snowplow_web_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_user_mapping)
- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)
- [model.snowplow_web.snowplow_web_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_aggs)
- [model.snowplow_web.snowplow_web_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_lasts)
- [model.snowplow_web.snowplow_web_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_sessions_this_run)
- [model.snowplow_web.snowplow_web_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_this_run)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.materialization_snowplow_incremental_snowflake](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_snowflake)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Delete From Manifest {#macro.snowplow_utils.snowplow_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">(source)</a></summary>

```jinja2
{% macro snowplow_delete_from_manifest(models, incremental_manifest_table) %}

  {%- if models is string -%}
    {%- set models = [models] -%}
  {%- endif -%}

  {% if not models|length or not execute %}
    {{ return('') }}
  {% endif %}

  {%- set incremental_manifest_table_exists = adapter.get_relation(incremental_manifest_table.database,
                                                                  incremental_manifest_table.schema,
                                                                  incremental_manifest_table.name) -%}

  {%- if not incremental_manifest_table_exists -%}
    {{return(dbt_utils.log_info("Snowplow: "+incremental_manifest_table|string+" does not exist"))}}
  {%- endif -%}

  {%- set models_in_manifest = dbt_utils.get_column_values(table=incremental_manifest_table, column='model') -%}
  {%- set unmatched_models, matched_models = [], [] -%}

  {%- for model in models -%}

    {%- if model in models_in_manifest -%}
      {%- do matched_models.append(model) -%}
    {%- else -%}
      {%- do unmatched_models.append(model) -%}
    {%- endif -%}

  {%- endfor -%}

  {%- if not matched_models|length -%}
    {{return(dbt_utils.log_info("Snowplow: None of the supplied models exist in the manifest"))}}
  {%- endif -%}

  {% set delete_statement %}
    {%- if target.type in ['databricks', 'spark'] -%}
      delete from {{ incremental_manifest_table }} where model in ({{ snowplow_utils.print_list(matched_models) }});
    {%- else -%}
      -- We don't need transaction but Redshift needs commit statement while BQ does not. By using transaction we cover both.
      begin;
      delete from {{ incremental_manifest_table }} where model in ({{ snowplow_utils.print_list(matched_models) }});
      commit;
    {%- endif -%}
  {% endset %}

  {%- do run_query(delete_statement) -%}

  {%- if matched_models|length -%}
    {% do snowplow_utils.log_message("Snowplow: Deleted models "+snowplow_utils.print_list(matched_models)+" from the manifest") %}
  {%- endif -%}

  {%- if unmatched_models|length -%}
    {% do snowplow_utils.log_message("Snowplow: Models "+snowplow_utils.print_list(unmatched_models)+" do not exist in the manifest") %}
  {%- endif -%}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.run_query
- macro.dbt_utils.get_column_values
- macro.dbt_utils.log_info
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.print_list](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_list)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_ecommerce.snowplow_ecommerce_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.snowplow_ecommerce_delete_from_manifest)
- [macro.snowplow_utils.snowplow_mobile_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_mobile_delete_from_manifest)
- [macro.snowplow_utils.snowplow_web_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_web_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Delete Insert {#macro.snowplow_utils.snowplow_delete_insert}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/snowplow_delete_insert.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/snowplow_delete_insert.sql">(source)</a></summary>

```jinja2
{% macro snowplow_delete_insert(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback) -%}
  {{ adapter.dispatch('snowplow_delete_insert', 'snowplow_utils')(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.default__snowplow_delete_insert](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.default__snowplow_delete_insert)
- [macro.snowplow_utils.snowflake__snowplow_delete_insert](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__snowplow_delete_insert)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.materialization_snowplow_incremental_default](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_default)
- [macro.snowplow_utils.snowplow_snowflake_get_incremental_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_snowflake_get_incremental_sql)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Incremental Post Hook {#macro.snowplow_utils.snowplow_incremental_post_hook}

<DbtDetails><summary>
<code>macros/incremental_hooks/snowplow_incremental_post_hook.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/snowplow_incremental_post_hook.sql">(source)</a></summary>

```jinja2
{% macro snowplow_incremental_post_hook(package_name) %}
  
  {% set enabled_snowplow_models = snowplow_utils.get_enabled_snowplow_models(package_name) -%}

  {% set successful_snowplow_models = snowplow_utils.get_successful_models(models=enabled_snowplow_models) -%}

  {% set incremental_manifest_table = snowplow_utils.get_incremental_manifest_table_relation(package_name) -%}

  {% set base_events_this_run_table = ref(package_name~'_base_events_this_run') -%}
        
  {{ snowplow_utils.update_incremental_manifest_table(incremental_manifest_table, base_events_this_run_table, successful_snowplow_models) }}                  

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_table_relation)
- [macro.snowplow_utils.get_successful_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_successful_models)
- [macro.snowplow_utils.update_incremental_manifest_table](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.update_incremental_manifest_table)

</DbtDetails>

### Snowplow Is Incremental {#macro.snowplow_utils.snowplow_is_incremental}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/snowplow_is_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/snowplow_is_incremental.sql">(source)</a></summary>

```jinja2
{% macro snowplow_is_incremental() %}
  {#-- do not run introspective queries in parsing #}
  {% if not execute %}
    {{ return(False) }}
  {% else %}
    {% set relation = adapter.get_relation(this.database, this.schema, this.table) %}
    {{ return(relation is not none
              and relation.type == 'table'
              and model.config.materialized in ['incremental','snowplow_incremental']
              and not should_full_refresh()) }}
  {% endif %}
{% endmacro %}
```

</DbtDetails>


#### Depends On
- macro.dbt.should_full_refresh


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Merge {#macro.snowplow_utils.snowplow_merge}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/snowplow_merge.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/snowplow_merge.sql">(source)</a></summary>

```jinja2
{% macro snowplow_merge(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback) -%}
  {{ adapter.dispatch('snowplow_merge', 'snowplow_utils')(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.default__snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.default__snowplow_merge)
- [macro.snowplow_utils.snowflake__snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__snowplow_merge)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.materialization_snowplow_incremental_bigquery](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_bigquery)
- [macro.snowplow_utils.materialization_snowplow_incremental_databricks](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_databricks)
- [macro.snowplow_utils.materialization_snowplow_incremental_spark](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_spark)
- [macro.snowplow_utils.snowplow_snowflake_get_incremental_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_snowflake_get_incremental_sql)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Delete From Manifest {#macro.snowplow_utils.snowplow_mobile_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">(source)</a></summary>

```jinja2
{% macro snowplow_mobile_delete_from_manifest(models) %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_mobile_incremental_manifest')) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</DbtDetails>

### Snowplow Snowflake Get Incremental Sql {#macro.snowplow_utils.snowplow_snowflake_get_incremental_sql}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/snowflake/snowplow_incremental.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/snowflake/snowplow_incremental.sql">(source)</a></summary>

```jinja2
{% macro snowplow_snowflake_get_incremental_sql(strategy, tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback) %}
  {% if strategy == 'merge' %}
    {% do return(snowplow_utils.snowplow_merge(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback)) %}
  {% elif strategy == 'delete+insert' %}
    {% do return(snowplow_utils.snowplow_delete_insert(tmp_relation, target_relation, unique_key, upsert_date_key, dest_columns, disable_upsert_lookback)) %}
  {% else %}
    {% do exceptions.raise_compiler_error('invalid strategy: ' ~ strategy) %}
  {% endif %}
{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.snowplow_delete_insert](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_insert)
- [macro.snowplow_utils.snowplow_merge](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_merge)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.materialization_snowplow_incremental_snowflake](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_snowflake)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Validate Get Incremental Strategy {#macro.snowplow_utils.snowplow_validate_get_incremental_strategy}

<DbtDetails><summary>
<code>macros/materializations/snowplow_incremental/common/snowplow_validate_get_incremental_strategy.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/materializations/snowplow_incremental/common/snowplow_validate_get_incremental_strategy.sql">(source)</a></summary>

```jinja2
{% macro snowplow_validate_get_incremental_strategy(config) -%}
  {{ adapter.dispatch('snowplow_validate_get_incremental_strategy', 'snowplow_utils')(config) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.default__snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.default__snowplow_validate_get_incremental_strategy)
- [macro.snowplow_utils.snowflake__snowplow_validate_get_incremental_strategy](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__snowplow_validate_get_incremental_strategy)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.materialization_snowplow_incremental_bigquery](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_bigquery)
- [macro.snowplow_utils.materialization_snowplow_incremental_databricks](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_databricks)
- [macro.snowplow_utils.materialization_snowplow_incremental_snowflake](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_snowflake)
- [macro.snowplow_utils.materialization_snowplow_incremental_spark](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.materialization_snowplow_incremental_spark)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Web Delete From Manifest {#macro.snowplow_utils.snowplow_web_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">(source)</a></summary>

```jinja2
{% macro snowplow_web_delete_from_manifest(models) %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_web_incremental_manifest')) }}

{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</DbtDetails>

### Throw Compiler Error {#macro.snowplow_utils.throw_compiler_error}

<DbtDetails><summary>
<code>macros/utils/throw_compiler_error.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/throw_compiler_error.sql">(source)</a></summary>

```jinja2
{% macro throw_compiler_error(error_message, disable_error=var("snowplow__disable_errors", false)) %}

  {% if disable_error %}

    {{ return(error_message) }}

  {% else %}

    {{ exceptions.raise_compiler_error(error_message) }}

  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_level_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_level_limit)

</TabItem>
</Tabs>
</DbtDetails>

### Timestamp Add {#macro.snowplow_utils.timestamp_add}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro timestamp_add(datepart, interval, tstamp) %}
    {{ return(adapter.dispatch('timestamp_add', 'snowplow_utils')(datepart, interval, tstamp)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__timestamp_add(datepart, interval, tstamp) %}
    timestamp_add({{tstamp}}, interval {{interval}} {{datepart}})
{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__timestamp_add(datepart, interval, tstamp) %}
    timestampadd({{datepart}}, {{interval}}, {{tstamp}})
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__timestamp_add(datepart, interval, tstamp) %}
    {{ return(dateadd(datepart, interval, tstamp)) }}
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.dateadd
- macro.dbt_utils.dateadd


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.get_quarantine_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_quarantine_sql)
- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Timestamp Diff {#macro.snowplow_utils.timestamp_diff}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro timestamp_diff(first_tstamp, second_tstamp, datepart) %}
    {{ return(adapter.dispatch('timestamp_diff', 'snowplow_utils')(first_tstamp, second_tstamp, datepart)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__timestamp_diff(first_tstamp, second_tstamp, datepart) %}
    timestamp_diff({{second_tstamp}}, {{first_tstamp}}, {{datepart}})
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__timestamp_diff(first_tstamp, second_tstamp, datepart) %}
    {{ return(datediff(first_tstamp, second_tstamp, datepart)) }}
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.datediff
- macro.dbt_utils.datediff


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### To Unixtstamp {#macro.snowplow_utils.to_unixtstamp}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">(source)</a></summary>

```jinja2



{%- macro to_unixtstamp(tstamp) -%}
    {{ adapter.dispatch('to_unixtstamp', 'snowplow_utils') (tstamp) }}
{%- endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.bigquery__to_unixtstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.bigquery__to_unixtstamp)
- [macro.snowplow_utils.snowflake__to_unixtstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__to_unixtstamp)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_web.snowplow_web_pv_engaged_time](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_pv_engaged_time)

</TabItem>
</Tabs>
</DbtDetails>

### Tstamp To Str {#macro.snowplow_utils.tstamp_to_str}

<DbtDetails><summary>
<code>macros/utils/tstamp_to_str.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/tstamp_to_str.sql">(source)</a></summary>

```jinja2
{% macro tstamp_to_str(tstamp) -%}
  '{{ tstamp.strftime("%Y-%m-%d %H:%M:%S") }}'
{%- endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Type Max String {#macro.snowplow_utils.type_max_string}

<DbtDetails><summary>
<code>macros/utils/cross_db/datatypes.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/datatypes.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2


{%- macro type_max_string() -%}
  {{ return(adapter.dispatch('type_max_string', 'snowplow_utils')()) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__type_max_string() %}
    string
{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__type_max_string() %}
    text
{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__type_max_string() %}
    varchar(max)
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__type_max_string() %}
    varchar
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>

</DbtDetails>

### Type String {#macro.snowplow_utils.type_string}

<DbtDetails><summary>
<code>macros/utils/cross_db/datatypes.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/datatypes.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2


{%- macro type_string(max_characters) -%}
  {{ return(adapter.dispatch('type_string', 'snowplow_utils')(max_characters)) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__type_string(max_characters) %}
    string
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__type_string(max_characters) %}
    varchar( {{max_characters }} )
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_normalize.snowplow_normalize_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_incremental_manifest)
- [model.snowplow_web.snowplow_web_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_quarantined_sessions)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Unnest {#macro.snowplow_utils.unnest}

<DbtDetails><summary>
<code>macros/utils/cross_db/unnest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/unnest.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2


{%- macro unnest(id_column, unnest_column, field_alias, source_table) -%}
    {{ return(adapter.dispatch('unnest', 'snowplow_utils')(id_column, unnest_column, field_alias, source_table)) }}
{%- endmacro -%}


```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__unnest(id_column, unnest_column, field_alias, source_table) %}
    select {{ id_column }}, r as {{ field_alias }}
    from {{ source_table }} t, unnest(t.{{ unnest_column }}) r
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__unnest(id_column, unnest_column, field_alias, source_table) %}
    select {{ id_column }}, explode({{ unnest_column }}) as {{ field_alias }}
    from {{ source_table }}
{% endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__unnest(id_column, unnest_column, field_alias, source_table) %}
    select {{ id_column }}, cast(trim(unnest({{ unnest_column }})) as {{ type_int() }}) as {{ field_alias }}
    from {{ source_table }}
{% endmacro %}
```
</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__unnest(id_column, unnest_column, field_alias, source_table) %}
    select {{ id_column }}, {{ field_alias }}
    from {{ source_table }} p, p.{{ unnest_column }} as {{ field_alias }}
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__unnest(id_column, unnest_column, field_alias, source_table) %}
    select t.{{ id_column }}, r.value as {{ field_alias }}
    from {{ source_table }} t, table(flatten(t.{{ unnest_column }})) r
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.type_int
- macro.dbt_utils.type_int


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_web.snowplow_web_consent_scope_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_scope_status)

</TabItem>
</Tabs>
</DbtDetails>

### Update Incremental Manifest Table {#macro.snowplow_utils.update_incremental_manifest_table}

<DbtDetails><summary>
<code>macros/incremental_hooks/update_incremental_manifest_table.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/update_incremental_manifest_table.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro update_incremental_manifest_table(manifest_table, base_events_table, models) -%}

  {{ return(adapter.dispatch('update_incremental_manifest_table', 'snowplow_utils')(manifest_table, base_events_table, models)) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__update_incremental_manifest_table(manifest_table, base_events_table, models) -%}

  {% if models %}

    {% set last_success_query %}
      select 
        b.model, 
        a.last_success 

      from 
        (select max(collector_tstamp) as last_success from {{ base_events_table }}) a,
        ({% for model in models %} select '{{model}}' as model {%- if not loop.last %} union all {% endif %} {% endfor %}) b

      where a.last_success is not null -- if run contains no data don't add to manifest
    {% endset %}

    merge into {{ manifest_table }} m
    using ( {{ last_success_query }} ) s
    on m.model = s.model
    when matched then
        update set last_success = greatest(m.last_success, s.last_success)
    when not matched then
        insert (model, last_success) values(model, last_success);

    {% if target.type == 'snowflake' %}
      commit;
    {% endif %}
    
  {% endif %}

{%- endmacro %}
```
</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__update_incremental_manifest_table(manifest_table, base_events_table, models) -%}

  {% if models %}

    begin transaction;
      --temp table to find the greatest last_success per model.
      --this protects against partial backfills causing the last_success to move back in time.
      create temporary table snowplow_models_last_success as (
        select
          a.model,
          greatest(a.last_success, b.last_success) as last_success

        from (

          select
            model,
            last_success

          from
            (select max(collector_tstamp) as last_success from {{ base_events_table }}) as ls,
            ({% for model in models %} select '{{model}}' as model {%- if not loop.last %} union all {% endif %} {% endfor %}) as mod

          where last_success is not null -- if run contains no data don't add to manifest

        ) a
        left join {{ manifest_table }} b
        on a.model = b.model
        );

      delete from {{ manifest_table }} where model in (select model from snowplow_models_last_success);
      insert into {{ manifest_table }} (select * from snowplow_models_last_success);

    end transaction;

    drop table snowplow_models_last_success;
    
  {% endif %}

{%- endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

