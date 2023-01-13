---
title: "Snowplow Mobile Macros"
description: Reference for snowplow_mobile dbt macros developed by Snowplow
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
## Snowplow Mobile
### Allow Refresh {#macro.snowplow_mobile.allow_refresh}

<DbtDetails><summary>
<code>macros/allow_refresh.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/allow_refresh.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_mobile')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__allow_refresh() %}
  
  {% set allow_refresh = snowplow_utils.get_value_by_target(
                                    dev_value=none,
                                    default_value=var('snowplow__allow_refresh'),
                                    dev_target_name=var('snowplow__dev_target_name')
                                    ) %}

  {{ return(allow_refresh) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_value_by_target](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### App Context Fields {#macro.snowplow_mobile.app_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro app_context_fields() %}

  {% set app_context_fields = [
    {'field':'build', 'dtype':'string'},
    {'field':'version', 'dtype':'string'}
    ] %}

  {{ return(app_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### App Error Context Fields {#macro.snowplow_mobile.app_error_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro app_error_context_fields() %}

  {% set app_error_context_fields = [
    {'field':'message', 'dtype':'string'},
    {'field':'programming_language', 'dtype':'string'},
    {'field':'class_name', 'dtype':'string'},
    {'field':'exception_name', 'dtype':'string'},
    {'field':'file_name', 'dtype':'string'},
    {'field':'is_fatal', 'dtype':'boolean'},
    {'field':'line_column', 'dtype':'integer'},
    {'field':'line_number', 'dtype':'integer'},
    {'field':'stack_trace', 'dtype':'string'},
    {'field':'thread_id', 'dtype':'integer'},
    {'field':'thread_name', 'dtype':'string'}
    ] %}

  {{ return(app_error_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Bool Or {#macro.snowplow_mobile.bool_or}

<DbtDetails><summary>
<code>macros/bool_or.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bool_or.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro bool_or(field) %}

  {{ return(adapter.dispatch('bool_or', 'snowplow_mobile')(field)) }}

{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__bool_or(field) %}

  LOGICAL_OR(
    {{ field }}
  )

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__bool_or(field) %}

  BOOL_OR(
    {{ field }}
  )

{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__bool_or(field) %}

  BOOLOR_AGG(
    {{ field }}
  )

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)

</TabItem>
</Tabs>
</DbtDetails>

### Cluster By Fields App Errors {#macro.snowplow_mobile.cluster_by_fields_app_errors}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro cluster_by_fields_app_errors() %}

  {{ return(adapter.dispatch('cluster_by_fields_app_errors', 'snowplow_mobile')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__cluster_by_fields_app_errors() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["session_id"], snowflake_cols=["to_date(derived_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)

</TabItem>
</Tabs>
</DbtDetails>

### Geo Context Fields {#macro.snowplow_mobile.geo_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro geo_context_fields() %}

  {% set geo_context_fields = [
    {'field':('latitude', 'device_latitude'), 'dtype':'float64'},
    {'field':('longitude', 'device_longitude'), 'dtype':'float64'},
    {'field':('latitude_longitude_accuracy', 'device_latitude_longitude_accuracy'), 'dtype':'float64'},
    {'field':('altitude', 'device_altitude'), 'dtype':'float64'},
    {'field':('altitude_accuracy', 'device_altitude_accuracy'), 'dtype':'float64'},
    {'field':('bearing', 'device_bearing'), 'dtype':'float64'},
    {'field':('speed', 'device_speed'), 'dtype':'float64'}
    ] %}

  {{ return(geo_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Device User Id Path Sql {#macro.snowplow_mobile.get_device_user_id_path_sql}

<DbtDetails><summary>
<code>macros/get_path_sql.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/get_path_sql.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro get_device_user_id_path_sql(relation_alias) %}

  {{ return(adapter.dispatch('get_device_user_id_path_sql', 'snowplow_mobile')(relation_alias)) }}

{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_device_user_id_path_sql(relation_alias) %}

-- setting relation through variable is not currently supported (recognised as string), different logic for integration tests
{% if target.schema.startswith('gh_sp_mobile_dbt_') %}

  {%- set relation=ref('snowplow_mobile_events_stg') %}

{% else %}

  {%- set relation=source('atomic','events') %}

{% endif %}

  {%- set user_id = snowplow_utils.combine_column_versions(
                                  relation=relation,
                                  column_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
                                  required_fields=['user_id'],
                                  relation_alias=relation_alias,
                                  include_field_alias=false
                                  )|join('') -%}

  {{ return(user_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__get_device_user_id_path_sql(relation_alias) %}

  {% set user_id %}
    {{ relation_alias }}.contexts_com_snowplowanalytics_snowplow_client_session_1[0].user_id::STRING
  {% endset %}

  {{ return(user_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_device_user_id_path_sql(relation_alias) %}

  {% set user_id %}
    {{ relation_alias }}.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:userId::VARCHAR(36)
  {% endset %}

  {{ return(user_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_device_user_id_path_sql(relation_alias) %}

  {{ return(snowplow_mobile.databricks__get_device_user_id_path_sql(relation_alias)) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Get Session Id Path Sql {#macro.snowplow_mobile.get_session_id_path_sql}

<DbtDetails><summary>
<code>macros/get_path_sql.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/get_path_sql.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro get_session_id_path_sql(relation_alias) %}

  {{ return(adapter.dispatch('get_session_id_path_sql', 'snowplow_mobile')(relation_alias)) }}

{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_session_id_path_sql(relation_alias) %}

-- setting relation through variable is not currently supported (recognised as string), different logic for integration tests
{% if target.schema.startswith('gh_sp_mobile_dbt_') %}

  {%- set relation=ref('snowplow_mobile_events_stg') %}

{% else %}

  {%- set relation=source('atomic','events') %}

{% endif %}

  {%- set session_id = snowplow_utils.combine_column_versions(
                                  relation=relation,
                                  column_prefix='contexts_com_snowplowanalytics_snowplow_client_session_1_',
                                  required_fields=['session_id'],
                                  relation_alias=relation_alias,
                                  include_field_alias=false
                                  )|join('') -%}


  {{ return(session_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="databricks" label="databricks">

```jinja2
{% macro databricks__get_session_id_path_sql(relation_alias) %}
  {% set session_id %}
    {{ relation_alias }}.contexts_com_snowplowanalytics_snowplow_client_session_1[0].session_id::STRING
  {% endset %}

  {{ return(session_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_session_id_path_sql(relation_alias) %}
  {% set session_id %}
    {{ relation_alias }}.contexts_com_snowplowanalytics_snowplow_client_session_1[0]:sessionId::VARCHAR(36)
  {% endset %}

  {{ return(session_id) }}

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_session_id_path_sql(relation_alias) %}

  {{ return(snowplow_mobile.databricks__get_session_id_path_sql(relation_alias)) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Mobile Cluster By Fields Screen Views {#macro.snowplow_mobile.mobile_cluster_by_fields_screen_views}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro mobile_cluster_by_fields_screen_views() %}

  {{ return(adapter.dispatch('mobile_cluster_by_fields_screen_views', 'snowplow_mobile')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__mobile_cluster_by_fields_screen_views() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["device_user_id", "session_id"], snowflake_cols=["to_date(derived_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)

</TabItem>
</Tabs>
</DbtDetails>

### Mobile Cluster By Fields Sessions {#macro.snowplow_mobile.mobile_cluster_by_fields_sessions}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro mobile_cluster_by_fields_sessions() %}

  {{ return(adapter.dispatch('mobile_cluster_by_fields_sessions', 'snowplow_mobile')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__mobile_cluster_by_fields_sessions() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["device_user_id"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Mobile Cluster By Fields Sessions Lifecycle {#macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro mobile_cluster_by_fields_sessions_lifecycle() %}

  {{ return(adapter.dispatch('mobile_cluster_by_fields_sessions_lifecycle', 'snowplow_mobile')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__mobile_cluster_by_fields_sessions_lifecycle() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["session_id"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Mobile Cluster By Fields Users {#macro.snowplow_mobile.mobile_cluster_by_fields_users}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/cluster_by_fields.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro mobile_cluster_by_fields_users() %}

  {{ return(adapter.dispatch('mobile_cluster_by_fields_users', 'snowplow_mobile')()) }}

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__mobile_cluster_by_fields_users() %}

  {{ return(snowplow_utils.get_cluster_by(bigquery_cols=["device_user_id"], snowflake_cols=["to_date(start_tstamp)"])) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_cluster_by](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_cluster_by)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)

</TabItem>
</Tabs>
</DbtDetails>

### Mobile Context Fields {#macro.snowplow_mobile.mobile_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro mobile_context_fields() %}

  {% set mobile_context_fields = [
    {'field':'device_manufacturer', 'dtype':'string'},
    {'field':'device_model', 'dtype':'string'},
    {'field':'os_type', 'dtype':'string'},
    {'field':'os_version', 'dtype':'string'},
    {'field':'android_idfa', 'dtype':'string'},
    {'field':'apple_idfa', 'dtype':'string'},
    {'field':'apple_idfv', 'dtype':'string'},
    {'field':'carrier', 'dtype':'string'},
    {'field':'open_idfa', 'dtype':'string'},
    {'field':'network_technology', 'dtype':'string'},
    {'field':'network_type', 'dtype':'string'}
    ] %}

  {{ return(mobile_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Screen Context Fields {#macro.snowplow_mobile.screen_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro screen_context_fields() %}

  {% set screen_context_fields = [
      {'field':('id', 'screen_id'), 'dtype':'string'},
      {'field':('name', 'screen_name'), 'dtype':'string'},
      {'field':('activity', 'screen_activity'), 'dtype':'string'},
      {'field':('fragment', 'screen_fragment'), 'dtype':'string'},
      {'field':('top_view_controller', 'screen_top_view_controller'), 'dtype':'string'},
      {'field':('type', 'screen_type'), 'dtype':'string'},
      {'field':('view_controller', 'screen_view_controller'), 'dtype':'string'}
    ] %}

  {{ return(screen_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Screen View Event Fields {#macro.snowplow_mobile.screen_view_event_fields}

<DbtDetails><summary>
<code>macros/bigquery/unstruct_event_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/unstruct_event_fields.sql">(source)</a></summary>

```jinja2
{% macro screen_view_event_fields() %}
  
  {% set screen_view_event_fields = [
    {'field':('id', 'screen_view_id'), 'dtype':'string'},
    {'field':('name', 'screen_view_name'), 'dtype':'string'},
    {'field':('previous_id', 'screen_view_previous_id'), 'dtype':'string'},
    {'field':('previous_name', 'screen_view_previous_name'), 'dtype':'string'},
    {'field':('previous_type', 'screen_view_previous_type'), 'dtype':'string'},
    {'field':('transition_type', 'screen_view_transition_type'), 'dtype':'string'},
    {'field':('type', 'screen_view_type'), 'dtype':'string'}
    ] %}

  {{ return(screen_view_event_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Session Context Fields {#macro.snowplow_mobile.session_context_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro session_context_fields() %}

  {% set session_context_fields = [
    {'field':'session_id', 'dtype':'string'},
    {'field':'session_index', 'dtype':'integer'},
    {'field':'previous_session_id', 'dtype':'string'},
    {'field':('user_id', 'device_user_id'), 'dtype':'string'},
    {'field':('first_event_id', 'session_first_event_id'), 'dtype':'string'}
    ] %}

  {{ return(session_context_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Stitch User Identifiers {#macro.snowplow_mobile.stitch_user_identifiers}

<DbtDetails><summary>
<code>macros/stitch_user_identifiers.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-mobile/blob/main/macros/stitch_user_identifiers.sql">(source)</a></summary>

```jinja2
{% macro stitch_user_identifiers(enabled, relation=this, user_mapping_relation=ref('snowplow_mobile_user_mapping')) %}

  {% if enabled and target.type not in ['databricks', 'spark'] | as_bool() %}

    -- Update sessions table with mapping
    update {{ relation }} as s
    set stitched_user_id = um.user_id
    from {{ user_mapping_relation }} as um
    where s.device_user_id = um.device_user_id;

{% elif enabled and target.type in ['databricks', 'spark']  | as_bool() %}

    -- Update sessions table with mapping
    merge into {{ relation }} as s
    using {{ user_mapping_relation }} as um
    on s.device_user_id = um.device_user_id
    when matched then 
      update set s.stitched_user_id = um.user_id;

  {% endif %}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)

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

