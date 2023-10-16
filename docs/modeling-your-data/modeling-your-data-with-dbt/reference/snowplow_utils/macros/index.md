---
title: "Snowplow Utils Macros"
description: Reference for snowplow_utils dbt macros developed by Snowplow
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Utils
### Allow Refresh {#macro.snowplow_utils.allow_refresh}

<DbtDetails><summary>
<code>macros/utils/allow_refresh.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/allow_refresh.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_utils')()) }}
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target)

</TabItem>
</Tabs>
</DbtDetails>

### App Id Filter {#macro.snowplow_utils.app_id_filter}

<DbtDetails><summary>
<code>macros/utils/app_id_filter.sql</code>
</summary>

<h4>Description</h4>

Generates a `sql` filter for the values in `app_ids` applied on the `app_id` column.



<h4>Arguments</h4>

- `app_ids` *(list)*: List of app_ids to filter to include

<h4>Returns</h4>


`app_id in (...)` if any `app_ids` are provided, otherwise `true`.

<h4>Usage</h4>


```sql
app_id_filter(['web', 'mobile', 'news'])

-- returns
app_id in ('web', 'mobile', 'news')
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/app_id_filter.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_events_this_run)
- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Base Create Snowplow Events This Run {#macro.snowplow_utils.base_create_snowplow_events_this_run}

<DbtDetails><summary>
<code>macros/base/base_create_snowplow_events_this_run.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_create_snowplow_events_this_run.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro base_create_snowplow_events_this_run(sessions_this_run_table='snowplow_base_sessions_this_run', session_identifiers=[{"schema" : "atomic", "field" : "domain_sessionid"}], session_sql=none, session_timestamp='load_tstamp', derived_tstamp_partitioned=true, days_late_allowed=3, max_session_days=3, app_ids=[], snowplow_events_database=none, snowplow_events_schema='atomic', snowplow_events_table='events', entities_or_sdes=none, custom_sql=none) %}
    {{ return(adapter.dispatch('base_create_snowplow_events_this_run', 'snowplow_utils')(sessions_this_run_table, session_identifiers, session_sql, session_timestamp, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, entities_or_sdes, custom_sql)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__base_create_snowplow_events_this_run(sessions_this_run_table, session_identifiers, session_sql, session_timestamp, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, entities_or_sdes, custom_sql) %}
    {%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref(sessions_this_run_table),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}
    {% set sessions_this_run = ref(sessions_this_run_table) %}
    {% set snowplow_events = api.Relation.create(database=snowplow_events_database, schema=snowplow_events_schema, identifier=snowplow_events_table) %}

    {% set events_this_run_query %}
        with identified_events AS (
            select
                {% if session_sql %}
                    {{ session_sql }} as session_identifier,
                {% else -%}
                    COALESCE(
                        {% for identifier in session_identifiers %}
                            {%- if identifier['schema']|lower != 'atomic' -%}
                                {{ snowplow_utils.get_field(identifier['schema'], identifier['field'], 'e', dbt.type_string(), 0, snowplow_events) }}
                            {%- else -%}
                                e.{{identifier['field']}}
                            {%- endif -%}
                            ,
                        {%- endfor -%}
                        NULL
                    ) as session_identifier,
                {%- endif %}
                e.*
                {% if custom_sql %}
                    , {{ custom_sql }}
                {% endif %}

            from {{ snowplow_events }} e

        )

        select
            a.*,
            b.user_identifier -- take user_identifier from manifest. This ensures only 1 domain_userid per session.

        from identified_events as a
        inner join {{ sessions_this_run }} as b
        on a.session_identifier = b.session_identifier

        where a.{{ session_timestamp }} <= {{ snowplow_utils.timestamp_add('day', max_session_days, 'b.start_tstamp') }}
        and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', days_late_allowed, 'a.dvce_created_tstamp') }}
        and a.{{ session_timestamp }} >= {{ lower_limit }}
        and a.{{ session_timestamp }} <= {{ upper_limit }}
        and a.{{ session_timestamp }} >= b.start_tstamp -- deal with late loading events

        {% if derived_tstamp_partitioned and target.type == 'bigquery' | as_bool() %}
            and a.derived_tstamp >= {{ snowplow_utils.timestamp_add('hour', -1, lower_limit) }}
            and a.derived_tstamp <= {{ upper_limit }}
        {% endif %}

        and {{ snowplow_utils.app_id_filter(app_ids) }}

        qualify row_number() over (partition by a.event_id order by a.{{ session_timestamp }}, a.dvce_created_tstamp) = 1
    {% endset %}

    {{ return(events_this_run_query) }}

{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__base_create_snowplow_events_this_run(sessions_this_run_table, session_identifiers, session_sql, session_timestamp, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, entities_or_sdes, custom_sql) %}
    {%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref(sessions_this_run_table),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}


    {# Get all the session and user contexts extracted and ready to join later #}
    {% set unique_session_identifiers = dict() %} {# need to avoid duplicate contexts when values come from the same one, so just use the first of that context #}

    {% if session_identifiers %}
        {% for identifier in session_identifiers %}
            {% if identifier['schema']|lower != 'atomic' and identifier['schema'] not in unique_session_identifiers %}
                {% do unique_session_identifiers.update({identifier['schema']: identifier}) %}
            {%- endif -%}
            {% if identifier['schema'] in unique_session_identifiers.keys() %}
                {% if identifier['alias'] != unique_session_identifiers[identifier['schema']]['alias'] or identifier['prefix'] != unique_session_identifiers[identifier['schema']]['prefix']  %}
                    {% do exceptions.warn("Snowplow Warning: Duplicate context ( " ~ identifier['schema'] ~" ) detected for session identifiers, using first alias and prefix provided ( " ~ unique_session_identifiers[identifier['schema']] ~ " ) in base events this run.") %}
                {% endif %}
            {% endif %}
        {% endfor %}
    {% endif %}

    {# check uniqueness of entity/sde names provided, warn those also in session identifiers #}
    {% if entities_or_sdes %}
        {% set ent_sde_names = [] %}
        {% for ent_or_sde in entities_or_sdes %}
            {% do ent_sde_names.append(ent_or_sde['schema']) %}
            {% if ent_or_sde['schema'] in unique_session_identifiers.keys() %}
                {% if ent_or_sde['alias'] != unique_session_identifiers[ent_or_sde['schema']]['alias'] or ent_or_sde['prefix'] != unique_session_identifiers[ent_or_sde['schema']]['prefix']  %}
                    {% do exceptions.warn("Snowplow Warning: Context or SDE ( " ~ ent_or_sde['schema'] ~ " ) used for session_identifier is being included, using alias and prefix from session_identifier ( " ~ unique_session_identifiers[ent_or_sde['schema']] ~ " ).") %}
                {% endif %}
            {% endif %}
        {% endfor %}
        {% if ent_sde_names | unique | list | length != entities_or_sdes | length %}
            {% do exceptions.raise_compiler_error("There are duplicate schema names in your provided `entities_or_sdes` list. Please correct this before proceeding.")%}
        {% endif %}
    {% endif %}

    {% set sessions_this_run = ref(sessions_this_run_table) %}
    {% set snowplow_events = api.Relation.create(database=snowplow_events_database, schema=snowplow_events_schema, identifier=snowplow_events_table) %}

    {% set events_this_run_query %}
        with

        {# Extract the session identifier contexts into CTEs #}
        {% if unique_session_identifiers -%}
            {% for identifier in unique_session_identifiers.values() %}
                {% if identifier['schema']|lower != 'atomic' %}
                    {{ snowplow_utils.get_sde_or_context(snowplow_events_schema, identifier['schema'], lower_limit, upper_limit, identifier['prefix']) }},
                {%- endif -%}
            {% endfor %}
        {% endif %}

        {# Extract the entitity/sde contexts into CTEs UNLESS they are in the session already #}
        {%- if entities_or_sdes -%}
            {%- for ent_or_sde in entities_or_sdes -%}
                {%- set name = none -%}
                {%- set prefix = none -%}
                {%- set single_entity = true -%}
                {%- if ent_or_sde['schema'] -%}
                    {%- set name = ent_or_sde['schema'] -%}
                {%- else -%}
                    {%- do exceptions.raise_compiler_error("Need to specify the schema name of your Entity or SDE using the {'schema'} attribute in a key-value map.") -%}
                {%- endif -%}
                {%- if ent_or_sde['prefix'] -%}
                    {%- set prefix = ent_or_sde['prefix'] -%}
                {%- else -%}
                    {%- set prefix = name -%}
                {%- endif -%}
                {%- if ent_or_sde['single_entity'] and ent_or_sde['single_entity'] is boolean -%}
                    {%- set single_entity = ent_or_sde['single_entity'] -%}
                {%- endif %}
                {% if ent_or_sde['schema'] not in unique_session_identifiers.keys() %} {# Exclude any that we have already made above #}
                    {{ snowplow_utils.get_sde_or_context(snowplow_events_schema, name, lower_limit, upper_limit, prefix, single_entity) }},
                {% endif %}
            {% endfor -%}
        {%- endif %}

        identified_events AS (
            select
                {% if session_sql -%}
                    {{ session_sql }} as session_identifier,
                {% else -%}
                    COALESCE(
                            {% for identifier in session_identifiers %}
                                {%- if identifier['schema']|lower != 'atomic' %}
                                    {# Use the parsed version of the context to ensure we have the right alias and prefix #}
                                    {% set uniq_iden = unique_session_identifiers[identifier['schema']] %}
                                    {% if uniq_iden['alias'] %}{{uniq_iden['alias']}}{% else %}{{uniq_iden['schema']}}{% endif %}.{% if uniq_iden['prefix'] %}{{ uniq_iden['prefix'] }}{% else %}{{ uniq_iden['schema']}}{% endif %}_{{identifier['field']}}
                                {%- else %}
                                    e.{{identifier['field']}}
                                {%- endif -%}
                                ,
                            {%- endfor -%}
                            NULL
                        ) as session_identifier,
                {%- endif %}
                    e.*
                    {% if custom_sql %}
                    , {{ custom_sql }}
                    {%- endif %}

            from {{ snowplow_events }} e
            {% if unique_session_identifiers|length > 0 %}
                {% for identifier in unique_session_identifiers.values() %}
                    {%- if identifier['schema']|lower != 'atomic' -%}
                    left join {{ identifier['schema'] }} {% if identifier['alias'] %}as {{ identifier['alias'] }}{% endif %} on e.event_id = {% if identifier['alias'] %}{{ identifier['alias']}}{% else %}{{ identifier['schema'] }}{% endif %}.{{identifier['prefix']}}__id and e.collector_tstamp = {% if identifier['alias'] %}{{ identifier['alias']}}{% else %}{{ identifier['schema'] }}{% endif %}.{{ identifier['prefix'] }}__tstamp
                    {% endif -%}
                {% endfor %}
            {% endif %}

        ), events_this_run as (

            select
                a.*,
                b.user_identifier, -- take user_identifier from manifest. This ensures only 1 domain_userid per session.
                row_number() over (partition by a.event_id order by a.{{ session_timestamp }}, a.dvce_created_tstamp ) as event_id_dedupe_index,
                count(*) over (partition by a.event_id) as event_id_dedupe_count

            from identified_events as a
            inner join {{ sessions_this_run }} as b
            on a.session_identifier = b.session_identifier

            where a.{{ session_timestamp }} <= {{ snowplow_utils.timestamp_add('day', max_session_days, 'b.start_tstamp') }}
            and a.dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', days_late_allowed, 'a.dvce_created_tstamp') }}
            and a.{{ session_timestamp }} >= {{ lower_limit }}
            and a.{{ session_timestamp }} <= {{ upper_limit }}
            and a.{{ session_timestamp }} >= b.start_tstamp -- deal with late loading events
            and {{ snowplow_utils.app_id_filter(app_ids) }}

        )

        select *

        from events_this_run as e
        {%- if entities_or_sdes -%}
            {% for ent_or_sde in entities_or_sdes -%}
                {%- set name = none -%}
                {%- set prefix = none -%}
                {%- set single_entity = true -%}
                {%- set alias = none -%}
                {%- if ent_or_sde['schema'] -%}
                    {%- set name = ent_or_sde['schema'] -%}
                {%- else -%}
                    {%- do exceptions.raise_compiler_error("Need to specify the schema name of your Entity or SDE using the {'schema'} attribute in a key-value map.") -%}
                {%- endif -%}
                {%- if ent_or_sde['prefix'] and name not in unique_session_identifiers.keys() -%}
                    {%- set prefix = ent_or_sde['prefix'] -%}
                {%- elif name in unique_session_identifiers.keys() and unique_session_identifiers.get(name, {}).get('prefix') -%}
                    {%- set prefix = unique_session_identifiers[name]['prefix'] -%}
                {%- else -%}
                    {%- set prefix = name -%}
                {%- endif -%}
                {%- if ent_or_sde['single_entity'] and ent_or_sde['single_entity'] is boolean -%}
                    {%- set single_entity = ent_or_sde['single_entity'] -%}
                {%- endif -%}
                {%- if ent_or_sde['alias'] and name not in unique_session_identifiers.keys() -%}
                    {%- set alias = ent_or_sde['alias'] -%}
                {%- elif name in unique_session_identifiers.keys() and unique_session_identifiers.get(name, {}).get('alias') -%}
                    {%- set alias = unique_session_identifiers[name] -%}
                {%- endif %}
                left join {{name}} {% if alias -%} as {{ alias }} {%- endif %} on e.event_id = {% if alias -%} {{ alias }} {%- else -%}{{name}}{%- endif %}.{{prefix}}__id
                and e.collector_tstamp = {% if alias -%} {{ alias }} {%- else -%}{{name}}{%- endif %}.{{prefix}}__tstamp
                {% if not single_entity -%} and mod({% if alias -%} {{ alias }} {%- else -%}{{name}}{%- endif %}.{{prefix}}__index, e.event_id_dedupe_count) = 0{%- endif -%}
            {% endfor %}
        {% endif %}
        where event_id_dedupe_index = 1

    {% endset %}

    {{ return(events_this_run_query) }}

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Base Create Snowplow Incremental Manifest {#macro.snowplow_utils.base_create_snowplow_incremental_manifest}

<DbtDetails><summary>
<code>macros/base/base_create_snowplow_incremental_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_create_snowplow_incremental_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro base_create_snowplow_incremental_manifest() %}

    {% set create_manifest_query %}
        with prep as (
        select
            cast(null as {{ snowplow_utils.type_max_string() }}) model,
            cast('1970-01-01' as {{ type_timestamp() }}) as last_success
        )

        select *

        from prep
        where false
    {% endset %}

    {{ return(create_manifest_query) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_timestamp
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_normalize.snowplow_normalize_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_incremental_manifest)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Base Create Snowplow Quarantined Sessions {#macro.snowplow_utils.base_create_snowplow_quarantined_sessions}

<DbtDetails><summary>
<code>macros/base/base_create_snowplow_quarantined_sessions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_create_snowplow_quarantined_sessions.sql">Source</a></i></b></center>

```jinja2
{% macro base_create_snowplow_quarantined_sessions() %}

    {% set create_quarantined_query %}
        with prep as (
        select
            {% if target.type == 'redshift' %} {# Done because max causes errors when used in subquery, #}
                cast(null as varchar(6000)) session_identifier
            {% else %}
                cast(null as {{ snowplow_utils.type_max_string() }}) session_identifier
            {% endif %}
        )

        select *

        from prep
        where false

    {% endset %}

    {{ return(create_quarantined_query) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_quarantined_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Base Create Snowplow Sessions Lifecycle Manifest {#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest}

<DbtDetails><summary>
<code>macros/base/base_create_snowplow_sessions_lifecycle_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_create_snowplow_sessions_lifecycle_manifest.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro base_create_snowplow_sessions_lifecycle_manifest(session_identifiers=[{"schema": "atomic", "field" : "domain_sessionid"}], session_sql=none, session_timestamp='load_tstamp', user_identifiers=[{"schema": "atomic", "field" : "domain_userid"}], user_sql=none, quarantined_sessions=none, derived_tstamp_partitioned=true, days_late_allowed=3, max_session_days=3, app_ids=[], snowplow_events_database=none, snowplow_events_schema='atomic', snowplow_events_table='events', event_limits_table='snowplow_base_new_event_limits', incremental_manifest_table='snowplow_incremental_manifest', package_name='snowplow') %}
    {{ return(adapter.dispatch('base_create_snowplow_sessions_lifecycle_manifest', 'snowplow_utils')(session_identifiers, session_sql, session_timestamp, user_identifiers, user_sql, quarantined_sessions, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, event_limits_table, incremental_manifest_table, package_name)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__base_create_snowplow_sessions_lifecycle_manifest(session_identifiers, session_sql, session_timestamp, user_identifiers, user_sql, quarantined_sessions, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, event_limits_table, incremental_manifest_table, package_name) %}
    {% set base_event_limits = ref(event_limits_table) %}
    {% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(base_event_limits) %}
    {% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
    {% set is_run_with_new_events = snowplow_utils.is_run_with_new_events(package_name, event_limits_table, incremental_manifest_table) %}
    {% set snowplow_events = api.Relation.create(database=snowplow_events_database, schema=snowplow_events_schema, identifier=snowplow_events_table) %}

    {% set sessions_lifecycle_manifest_query %}

        with new_events_session_ids_init as (
            select
            {% if session_sql %}
                {{ session_sql }} as session_identifier,
            {% elif session_identifiers|length > 0 %}
                COALESCE(
                    {% for identifier in session_identifiers %}
                        {%- if identifier['schema']|lower != 'atomic' -%}
                            {{ snowplow_utils.get_field(identifier['schema'], identifier['field'], 'e', dbt.type_string(), 0, snowplow_events) }}
                        {%- else -%}
                            e.{{identifier['field']}}
                        {%- endif -%}
                        ,
                    {%- endfor -%}
                    NULL
                ) as session_identifier,
            {%- else -%}
                {% do exceptions.raise_compiler_error("Need to specify either session identifiers or custom session SQL") %}
            {%- endif %}
            {%- if user_sql -%}
                {{ user_sql }} as user_identifier,
            {%- elif user_identifiers|length > 0 %}
                max(
                    COALESCE(
                        {% for identifier in user_identifiers %}
                            {%- if identifier['schema']|lower != 'atomic' -%}
                                {{ snowplow_utils.get_field(identifier['schema'], identifier['field'], 'e', dbt.type_string(), 0, snowplow_events) }}
                            {%- else -%}
                                e.{{identifier['field']}}
                            {%- endif -%}
                            ,
                        {%- endfor -%}
                        NULL
                    )
                ) as user_identifier, -- Edge case 1: Arbitary selection to avoid window function like first_value.
            {% else %}
                {% do exceptions.raise_compiler_error("Need to specify either user identifiers or custom user SQL") %}
            {%- endif %}
                min({{ session_timestamp }}) as start_tstamp,
                max({{ session_timestamp }}) as end_tstamp

            from {{ snowplow_events }} e

            where
                dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', days_late_allowed, 'dvce_created_tstamp') }} -- don't process data that's too late
                and {{ session_timestamp }} >= {{ lower_limit }}
                and {{ session_timestamp }} <= {{ upper_limit }}
                and {{ snowplow_utils.app_id_filter(app_ids) }}
                and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
                {% if derived_tstamp_partitioned and target.type == 'bigquery' | as_bool() %} -- BQ only
                and derived_tstamp >= {{ lower_limit }}
                and derived_tstamp <= {{ upper_limit }}
                {% endif %}

            group by 1
        ), new_events_session_ids as (
            select *
            from new_events_session_ids_init e
            {% if quarantined_sessions %}
                where session_identifier is not null
                and not exists (select 1 from {{ ref(quarantined_sessions) }} as a where a.session_identifier = e.session_identifier) -- don't continue processing v.long sessions
            {%- endif %}

        )
        {% if is_incremental() %}

        , previous_sessions as (
        select *

        from {{ this }}

        where start_tstamp >= {{ session_lookback_limit }}
        and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
        )

        , session_lifecycle as (
        select
            ns.session_identifier,
            coalesce(self.user_identifier, ns.user_identifier) as user_identifier, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
            least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
            greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

        from new_events_session_ids ns
        left join previous_sessions as self
            on ns.session_identifier = self.session_identifier

        where
            self.session_identifier is null -- process all new sessions
            or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', max_session_days, 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
        )

        {% else %}

        , session_lifecycle as (

        select * from new_events_session_ids

        )

        {% endif %}

        select
        sl.session_identifier,
        sl.user_identifier,
        sl.start_tstamp,
        least({{ snowplow_utils.timestamp_add('day', max_session_days, 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days
        {% if target.type in ['databricks', 'spark'] -%}
        , DATE(start_tstamp) as start_tstamp_date
        {%- endif %}

        from session_lifecycle sl
    {% endset %}

    {{ return(sessions_lifecycle_manifest_query) }}

{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__base_create_snowplow_sessions_lifecycle_manifest(session_identifiers, session_sql, session_timestamp, user_identifiers, user_sql, quarantined_sessions, derived_tstamp_partitioned, days_late_allowed, max_session_days, app_ids, snowplow_events_database, snowplow_events_schema, snowplow_events_table, event_limits_table, incremental_manifest_table, package_name) %}
    {% set base_event_limits = ref(event_limits_table) %}
    {% set lower_limit, upper_limit, _ = snowplow_utils.return_base_new_event_limits(base_event_limits) %}
    {% set session_lookback_limit = snowplow_utils.get_session_lookback_limit(lower_limit) %}
    {% set is_run_with_new_events = snowplow_utils.is_run_with_new_events(package_name, event_limits_table, incremental_manifest_table) %}
    {% set snowplow_events = api.Relation.create(database=snowplow_events_database, schema=snowplow_events_schema, identifier=snowplow_events_table) %}

    {% set sessions_lifecycle_manifest_query %}

        with
        {# Get all the session and user contexts extracted and ready to join later #}
        {% set unique_identifiers = dict() %} {# need to avoid duplicate contexts when values come from the same one, so just use the first of that context #}

        {% if session_identifiers %}
            {% for identifier in session_identifiers %}
                {% if identifier['schema']|lower != 'atomic' and identifier['schema'] not in unique_identifiers %}
                    {{ snowplow_utils.get_sde_or_context(snowplow_events_schema, identifier['schema'], lower_limit, upper_limit, identifier['prefix']) }},
                    {% do unique_identifiers.update({identifier['schema']: identifier}) %}
                {%- endif -%}
            {% endfor %}
        {% endif %}

        {% if user_identifiers%}
            {% for identifier in user_identifiers %}
                {% if identifier['schema']|lower != 'atomic' and identifier['schema'] not in unique_identifiers %}
                    {{ snowplow_utils.get_sde_or_context(snowplow_events_schema, identifier['schema'], lower_limit, upper_limit, identifier['prefix']) }},
                    {% do unique_identifiers.update({identifier['schema']: identifier}) %}
                {%- endif -%}
            {% endfor %}
        {% endif %}

        {# Produce the core session and single user identifier for sessions with new events #}
        new_events_session_ids_init as (
            select
            {% if session_sql %}
                {{ session_sql }} as session_identifier,
            {% elif session_identifiers|length > 0 %}
                COALESCE(
                    {% for identifier in session_identifiers %}
                        {%- if identifier['schema']|lower != 'atomic' -%}
                            {# Use the parsed version of the context to ensure we have the right alias and prefix #}
                            {% set uniq_iden = unique_identifiers[identifier['schema']] %}
                            {% if uniq_iden['alias'] %}{{uniq_iden['alias']}}{% else %}{{uniq_iden['schema']}}{% endif %}.{% if uniq_iden['prefix'] %}{{ uniq_iden['prefix']  ~ '_' }}{% endif %}{{identifier['field']}}
                        {%- else -%}
                            e.{{identifier['field']}}
                        {%- endif -%}
                        ,
                    {%- endfor -%}
                    NULL
                ) as session_identifier,
            {% else %}
                {% do exceptions.raise_compiler_error("Need to specify either session identifiers or custom session SQL") %}
            {% endif %}
            {% if user_sql %}
                {{ user_sql }} as user_identifier,
            {% elif user_identifiers|length > 0 %}
                max(
                    COALESCE(
                        {% for identifier in user_identifiers %}
                            {%- if identifier['schema']|lower != 'atomic' %}
                            {# Use the parsed version of the context to ensure we have the right alias and prefix #}
                                {% set uniq_iden = unique_identifiers[identifier['schema']] %}
                                {% if uniq_iden['alias'] %}{{uniq_iden['alias']}}{% else %}{{uniq_iden['schema']}}{% endif %}.{% if uniq_iden['prefix'] %}{{ uniq_iden['prefix'] ~ '_' }}{% endif %}{{identifier['field']}}
                            {%- else %}
                                e.{{identifier['field']}}
                            {%- endif -%}
                            ,
                        {%- endfor -%}
                        NULL
                    )
                ) as user_identifier, -- Edge case 1: Arbitary selection to avoid window function like first_value.
            {% else %}
                {% do exceptions.raise_compiler_error("Need to specify either user identifiers or custom user SQL") %}
            {% endif %}
                min({{ session_timestamp }}) as start_tstamp,
                max({{ session_timestamp }}) as end_tstamp

            from {{ snowplow_events }} e
            {% if unique_identifiers|length > 0 %}
                {% for identifier in unique_identifiers.values() %}
                    {%- if identifier['schema']|lower != 'atomic' -%}
                    left join {{ identifier['schema'] }} {% if identifier['alias'] %}as {{ identifier['alias'] }}{% endif %} on e.event_id = {% if identifier['alias'] %}{{ identifier['alias']}}{% else %}{{ identifier['schema'] }}{% endif %}.{% if identifier['prefix'] %}{{ identifier['prefix'] }}{% else %}{{ identifier['schema']}}{% endif %}__id and e.collector_tstamp = {% if identifier['alias'] %}{{ identifier['alias']}}{% else %}{{ identifier['schema'] }}{% endif %}.{% if identifier['prefix'] %}{{ identifier['prefix'] }}{% else %}{{ identifier['schema']}}{% endif %}__tstamp
                    {% endif -%}
                {% endfor %}
            {% endif %}
            where
                dvce_sent_tstamp <= {{ snowplow_utils.timestamp_add('day', days_late_allowed, 'dvce_created_tstamp') }} -- don't process data that's too late
                and {{ session_timestamp }} >= {{ lower_limit }}
                and {{ session_timestamp }} <= {{ upper_limit }}
                and {{ snowplow_utils.app_id_filter(app_ids) }}
                and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
                {% if derived_tstamp_partitioned and target.type == 'bigquery' | as_bool() %} -- BQ only
                and derived_tstamp >= {{ lower_limit }}
                and derived_tstamp <= {{ upper_limit }}
                {% endif %}

            group by 1

        {# Exclude quarantined sessions #}
        ), new_events_session_ids as (
            select *
            from new_events_session_ids_init e
            {% if quarantined_sessions %}
                where session_identifier is not null
                and not exists (select 1 from {{ ref(quarantined_sessions) }} as a where a.session_identifier = e.session_identifier) -- don't continue processing v.long sessions
            {%- endif %}
        )

        {% if is_incremental() %}

        , previous_sessions as (
        select *

        from {{ this }}

        where start_tstamp >= {{ session_lookback_limit }}
        and {{ is_run_with_new_events }} --don't reprocess sessions that have already been processed.
        )

        , session_lifecycle as (
        select
            ns.session_identifier,
            coalesce(self.user_identifier, ns.user_identifier) as user_identifier, -- Edge case 1: Take previous value to keep domain_userid consistent. Not deterministic but performant
            least(ns.start_tstamp, coalesce(self.start_tstamp, ns.start_tstamp)) as start_tstamp,
            greatest(ns.end_tstamp, coalesce(self.end_tstamp, ns.end_tstamp)) as end_tstamp -- BQ 1 NULL will return null hence coalesce

        from new_events_session_ids ns
        left join previous_sessions as self
            on ns.session_identifier = self.session_identifier

        where
            self.session_identifier is null -- process all new sessions
            or self.end_tstamp < {{ snowplow_utils.timestamp_add('day', max_session_days, 'self.start_tstamp') }} --stop updating sessions exceeding 3 days
        )

        {% else %}

        , session_lifecycle as (

        select * from new_events_session_ids

        )

        {% endif %}

        select
        sl.session_identifier,
        sl.user_identifier,
        sl.start_tstamp,
        least({{ snowplow_utils.timestamp_add('day', max_session_days, 'sl.start_tstamp') }}, sl.end_tstamp) as end_tstamp -- limit session length to max_session_days

        from session_lifecycle sl
    {% endset %}

    {{ return(sessions_lifecycle_manifest_query) }}

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.is_incremental
- macro.dbt.type_string
- [macro.snowplow_utils.app_id_filter](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.app_id_filter)
- [macro.snowplow_utils.get_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field)
- [macro.snowplow_utils.get_sde_or_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_sde_or_context)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Base Create Snowplow Sessions This Run {#macro.snowplow_utils.base_create_snowplow_sessions_this_run}

<DbtDetails><summary>
<code>macros/base/base_create_snowplow_sessions_this_run.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_create_snowplow_sessions_this_run.sql">Source</a></i></b></center>

```jinja2
{% macro base_create_snowplow_sessions_this_run(lifecycle_manifest_table='snowplow_base_sessions_lifecycle_manifest', new_event_limits_table='snowplow_base_new_event_limits') %}
    {% set lifecycle_manifest = ref(lifecycle_manifest_table) %}
    {% set new_event_limits = ref(new_event_limits_table) %}
    {%- set lower_limit,
        upper_limit,
        session_start_limit = snowplow_utils.return_base_new_event_limits(new_event_limits) %}

    {% set sessions_sql %}


        select
        s.session_identifier,
        s.user_identifier,
        s.start_tstamp,
        -- end_tstamp used in next step to limit events. When backfilling, set end_tstamp to upper_limit if end_tstamp > upper_limit.
        -- This ensures we don't accidentally process events after upper_limit
        case when s.end_tstamp > {{ upper_limit }} then {{ upper_limit }} else s.end_tstamp end as end_tstamp

        from {{ lifecycle_manifest }} s

        where
        -- General window of start_tstamps to limit table scans. Logic complicated by backfills.
        -- To be within the run, session start_tstamp must be >= lower_limit - max_session_days as we limit end_tstamp in manifest to start_tstamp + max_session_days
        s.start_tstamp >= {{ session_start_limit }}
        and s.start_tstamp <= {{ upper_limit }}
        -- Select sessions within window that either; start or finish between lower & upper limit, start and finish outside of lower and upper limits
        and not (s.start_tstamp > {{ upper_limit }} or s.end_tstamp < {{ lower_limit }})
    {% endset %}

    {{ return(sessions_sql) }}
{% endmacro%}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Base Get Quarantine Sql {#macro.snowplow_utils.base_get_quarantine_sql}

<DbtDetails><summary>
<code>macros/base/base_quarantine_sessions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_quarantine_sessions.sql">Source</a></i></b></center>

```jinja2
{% macro base_get_quarantine_sql(relation, max_session_length) %}

  {# Find sessions exceeding max_session_days #}
  {% set quarantine_sql -%}

    select
      session_identifier

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_quarantine_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Base Quarantine Sessions {#macro.snowplow_utils.base_quarantine_sessions}

<DbtDetails><summary>
<code>macros/base/base_quarantine_sessions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/base/base_quarantine_sessions.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro base_quarantine_sessions(max_session_length, quarantined_sessions='snowplow_base_quarantined_sessions', src_relation=this) %}

  {{ return(adapter.dispatch('base_quarantine_sessions', 'snowplow_utils')(max_session_length, quarantined_sessions, src_relation)) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__base_quarantine_sessions(max_session_length, quarantined_sessions_str, src_relation) %}
  {% set quarantined_sessions = ref(quarantined_sessions_str) %}

  {% set sessions_to_quarantine_sql = snowplow_utils.base_get_quarantine_sql(src_relation, max_session_length) %}

  {% set quarantine_query %}

  merge into {{ quarantined_sessions }} trg
  using ({{ sessions_to_quarantine_sql }}) src
  on trg.session_identifier = src.session_identifier
  when not matched then insert (session_identifier) values(session_identifier);

  {% endset %}

  {{ return(quarantine_query) }}

{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__base_quarantine_sessions(max_session_length, quarantined_sessions_str, src_relation) %}

  {% set quarantined_sessions = ref(quarantined_sessions_str) %}
  {% set sessions_to_quarantine_tmp = 'sessions_to_quarantine_tmp' %}

  begin;

    create temporary table {{ sessions_to_quarantine_tmp }} as (
      {{ snowplow_utils.base_get_quarantine_sql(src_relation, max_session_length) }}
    );

    delete from {{ quarantined_sessions }}
    where session_identifier in (select session_identifier from {{ sessions_to_quarantine_tmp }});

    insert into {{ quarantined_sessions }} (
      select session_identifier from {{ sessions_to_quarantine_tmp }});

    drop table {{ sessions_to_quarantine_tmp }};

  commit;

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_get_quarantine_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_get_quarantine_sql)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Cast To Tstamp {#macro.snowplow_utils.cast_to_tstamp}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_timestamp

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.get_session_lookback_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_session_lookback_limit)
- [macro.snowplow_utils.return_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_base_new_event_limits)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)

</TabItem>
</Tabs>
</DbtDetails>

### Cluster By Fields Sessions Lifecycle {#macro.snowplow_utils.cluster_by_fields_sessions_lifecycle}

<DbtDetails><summary>
<code>macros/utils/cross_db/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro cluster_by_fields_sessions_lifecycle() %}

  {{ return(adapter.dispatch('cluster_by_fields_sessions_lifecycle', 'snowplow_utils')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__cluster_by_fields_sessions_lifecycle() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["session_identifier"], snowflake_val=["to_date(start_tstamp)"])) }}

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_value_by_target_type](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target_type)

</TabItem>
</Tabs>
</DbtDetails>

### Coalesce Field Paths {#macro.snowplow_utils.coalesce_field_paths}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/coalesce_field_paths.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/coalesce_field_paths.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Combine Column Versions {#macro.snowplow_utils.combine_column_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/combine_column_versions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/combine_column_versions.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.coalesce_field_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.coalesce_field_paths)
- [macro.snowplow_utils.exclude_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.exclude_column_versions)
- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)
- [macro.snowplow_utils.get_columns_in_relation_by_column_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_columns_in_relation_by_column_prefix)
- [macro.snowplow_utils.get_field_alias](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field_alias)
- [macro.snowplow_utils.get_level_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_level_limit)
- [macro.snowplow_utils.get_matched_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_matched_fields)
- [macro.snowplow_utils.merge_fields_across_col_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.merge_fields_across_col_versions)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

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

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.current_timestamp
- macro.dbt.type_timestamp

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)
- [model.snowplow_web.snowplow_web_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_this_run)
- [model.snowplow_web.snowplow_web_vital_measurements](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_measurements)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Exclude Column Versions {#macro.snowplow_utils.exclude_column_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/exclude_column_versions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/exclude_column_versions.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Flatten Fields {#macro.snowplow_utils.flatten_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/flatten_fields.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/flatten_fields.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.flatten_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.flatten_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Get Array To String {#macro.snowplow_utils.get_array_to_string}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_array_to_string.sql</code>
</summary>

<h4>Description</h4>

This macro takes care of harmonising cross-db array to string type functions. The macro supports a custom delimiter if you don't want to use a comma with no space (default).



<h4>Arguments</h4>

- `array_column` *(string)*: Name of the column to join into a string
- `column_prefix` *(string)*: Table alias for the array_column
- `delimiter` *(string)*: (Optional) String that determines how to delimit your array values. Default ','

<h4>Returns</h4>


The data warehouse appropriate sql to convert an array to a string. 

<h4>Usage</h4>


```sql
select
...
{{ snowplow_utils.get_array_to_string('my_array_column', 'a', ', ') }}
...
from ... a

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_array_to_string.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2


{%- macro get_array_to_string(array_column, column_prefix, delimiter=',') -%}
    {{ return(adapter.dispatch('get_array_to_string', 'snowplow_utils')(array_column, column_prefix, delimiter)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_array_to_string(array_column, column_prefix, delimiter=',') %}
    array_to_string({{column_prefix}}.{{array_column}},'{{delimiter}}')
{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_array_to_string(array_column, column_prefix, delimiter=',') %}
    array_join({{column_prefix}}.{{array_column}},'{{delimiter}}')
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)
- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Cluster By {#macro.snowplow_utils.get_cluster_by}

<DbtDetails><summary>
<code>macros/utils/get_cluster_by.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_cluster_by.sql">Source</a></i></b></center>

```jinja2
{% macro get_cluster_by(bigquery_cols=none, snowflake_cols=none) %}

  {%- do exceptions.warn("Warning: the `get_cluster_by` macro is deprecated and will be removed in a future version of the package, please use `get_value_by_target_type` instead.") -%}


  {% if target.type == 'bigquery' %}
    {{ return(bigquery_cols) }}
  {% elif target.type == 'snowflake' %}
    {{ return(snowflake_cols) }}
  {% endif %}

{% endmacro %}
```

</DbtDetails>

</DbtDetails>

### Get Columns In Relation By Column Prefix {#macro.snowplow_utils.get_columns_in_relation_by_column_prefix}

<DbtDetails><summary>
<code>macros/utils/get_columns_in_relation_by_column_prefix.sql</code>
</summary>

<h4>Description</h4>

This macro returns an array of column objects within a relation that start with the given column prefix. This is useful when you have multiple versions of a column within a table and want to dynamically identify all versions.



<h4>Arguments</h4>

- `relation` *(relation)*: A table or `ref` type object to get the columns from
- `column_prefix` *(string)*: The prefix string to search for matching columns

<h4>Returns</h4>


An array of (column objects)[https://docs.getdbt.com/reference/dbt-classes#column]. The name of each column can be accessed with the name property.

<h4>Usage</h4>


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

<h1>Renders</h1>
 to something like:
'custom_context_1_0_1'
'custom_context_1_0_2'
'custom_context_1_0_3'

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_columns_in_relation_by_column_prefix.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_ecommerce.coalesce_columns_by_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.coalesce_columns_by_prefix)
- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Enabled Snowplow Models {#macro.snowplow_utils.get_enabled_snowplow_models}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_enabled_snowplow_models.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_enabled_snowplow_models.sql">Source</a></i></b></center>

```jinja2
{% macro get_enabled_snowplow_models(package_name, graph_object=none, models_to_run=var("models_to_run", ""), base_events_table_name='snowplow_base_events_this_run') -%}

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
  {% set snowplow_events_this_run_path = 'model.' + project_name + '.' + base_events_table_name %}

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
      Prints warning for models that reference snowplow_base_events_this_run but are untagged as '{package_name}_incremental'
      Without this tagging these models will not be inserted into the manifest, breaking the incremental logic.
      Only catches first degree dependencies rather than all downstream models
    #}
      {%- do exceptions.raise_compiler_error("Snowplow Warning: Untagged models referencing '"+snowplow_events_this_run_path+"'. Please refer to the Snowplow docs on tagging. "
      + "Models: "+ ', '.join(untagged_snowplow_models)) -%}

    {% endif %}

    {% if enabled_models|length == 0 %}
      {%- do exceptions.raise_compiler_error("No enabled models identified.") -%}
    {% endif %}

  {% endif %}

  {{ return(enabled_models) }}

{%- endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_mobile.snowplow_mobile_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_new_event_limits)
- [model.snowplow_normalize.snowplow_normalize_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_new_event_limits)
- [model.snowplow_web.snowplow_web_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_new_event_limits)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Field {#macro.snowplow_utils.get_field}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_field.sql</code>
</summary>

<h4>Description</h4>

This macro exists to make it easier to extract a field from our `unstruct_` and `contexts_` type columns for users in Snowflake, Databricks, and BigQuery (using a wildcard version number is only possible for BigQuery e.g. `column_name = 'contexts_nl_basjes_yauaa_context_1_*'`). The macro can handle type casting and selecting from arrays.



<h4>Arguments</h4>

- `column_name` *(string)*: Name of the column to extract the field from
- `field_name` *(string)*: Name of the field to extract
- `table_alias` *(string)*: (Optional) Alias of the table in your query that the column exists in. Default `none` (no table alias)
- `type` *(string)*: (Optional) Type to cast the field to if required. Default `none` (no casting)
- `array_index` *(integer)*: (Optional) Index of the array to select in case of multiple entries. Uses `SAFE_OFFSET` for BigQuery. Default `none` (not an array)

<h4>Returns</h4>


SQL snippet to select the field specified from the column

<h4>Usage</h4>


Extracting a single field
```sql

select
{{ snowplow_utils.get_field(column_name = 'contexts_nl_basjes_yauaa_context_1', 
                            field_name = 'agent_class', 
                            table_alias = 'a',
                            type = 'string',
                            array_index = 0)}} as yauaa_agent_class
from 
    my_events_table a

```

Extracting multiple fields
```sql

select
{% for field in [('field1', 'string'), ('field2', 'numeric'), ...] %}
  {{ snowplow_utils.get_field(column_name = 'contexts_nl_basjes_yauaa_context_1', 
                            field_name = field[0], 
                            table_alias = 'a',
                            type = field[1],
                            array_index = 0)}} as {{ field[0] }}
{% endfor %}

from 
    my_events_table a

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_field.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_field(column_name, field_name, table_alias = none, type = none, array_index = none, relation = none) %}
    {{ return(adapter.dispatch('get_field', 'snowplow_utils')(column_name, field_name, table_alias, type, array_index, relation)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_field(column_name, field_name, table_alias = none, type = none, array_index = none, relation = none) %}

{% if '*' in column_name %}
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=[{'field': field_name, 'dtype': type or 'string' }],
        col_prefix=column_name|replace('_*', ''),
        relation=relation,
        relation_alias=table_alias,
        include_field_alias=false
    ) }}

{% else %}
{%- if type -%}cast({%- endif -%}{%- if table_alias -%}{{table_alias}}.{%- endif -%}{{column_name}}{%- if array_index is not none -%}[SAFE_OFFSET({{array_index}})]{%- endif -%}.{{field_name}}{%- if type %} as {{type}}){%- endif -%}
{% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_field(column_name, field_name, table_alias = none, type = none, array_index = none, relation = none) %}

{% if execute %}
    {% do exceptions.raise_compiler_error('Macro get_field only supports Bigquery, Snowflake, Spark, and Databricks, it is not supported for ' ~ target.type) %}
{% endif %}

{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__get_field(column_name, field_name, table_alias = none, type = none, array_index = none, relation = none) %}
{% if '*' in column_name %}
    {% do exceptions.raise_compiler_error('Wildcard schema versions are only supported for Bigquery, they are not supported for ' ~ target.type) %}
{% else %}
    {%- if type is none and execute -%}
        {% do exceptions.warn("Warning: macro snowplow_utils.get_field is being used without a type provided, Snowflake will return a variant column in this case which is unlikely to be what you want.") %}
    {%- endif -%}
    {%- if table_alias -%}{{table_alias}}.{%- endif -%}{{column_name}}{%- if array_index is not none -%}[{{array_index}}]{%- endif -%}:{{field_name}}{%- if type -%}::{{type}}{%- endif -%}
{% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_field(column_name, field_name, table_alias = none, type = none, array_index = none, relation = none) %}
{% if '*' in column_name %}
    {% do exceptions.raise_compiler_error('Wildcard schema versions are only supported for Bigquery, they are not supported for ' ~ target.type) %}
{% else %}
    {%- if table_alias -%}{{table_alias}}.{%- endif -%}{{column_name}}{%- if array_index is not none -%}[{{array_index}}]{%- endif -%}.{{field_name}}{%- if type -%}::{{type}}{%- endif -%}
{% endif %}
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_vital_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)
- [macro.snowplow_utils.base_create_snowplow_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_events_this_run)
- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Get Field Alias {#macro.snowplow_utils.get_field_alias}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_field_alias.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_field_alias.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Get Incremental Manifest Status {#macro.snowplow_utils.get_incremental_manifest_status}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_incremental_manifest_status.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_status.sql">Source</a></i></b></center>

```jinja2
{% macro get_incremental_manifest_status(incremental_manifest_table, models_in_run) -%}

  {# In case of not execute just return empty strings to avoid hitting database #}
  {% if not execute %}
    {{ return(['', '', '', '']) }}
  {% endif %}

  {% set target_relation = adapter.get_relation(
        database=incremental_manifest_table.database,
        schema=incremental_manifest_table.schema,
        identifier=incremental_manifest_table.name) %}

  {% if target_relation is not none %}

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

      {{ return([min_last_success, max_last_success, models_matched_from_manifest, has_matched_all_models]) }}

    {% endif %}


  {% else %}

    {% do exceptions.warn("Snowplow Warning: " ~ incremental_manifest_table ~ " does not exist. This is expected if you are compiling a fresh installation of the dbt-snowplow-* packages.") %}

    {{ return(['9999-01-01 00:00:00', '9999-01-01 00:00:00', 0, false]) }}

  {% endif %}


{%- endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.print_list](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_list)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
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

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_table_relation.sql">Source</a></i></b></center>

```jinja2
{% macro get_incremental_manifest_table_relation(package_name) %}

  {%- set incremental_manifest_table = ref(package_name~'_incremental_manifest') -%}

  {{ return(incremental_manifest_table) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)
- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Level Limit {#macro.snowplow_utils.get_level_limit}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_level_limit.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_level_limit.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.throw_compiler_error](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.throw_compiler_error)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Matched Fields {#macro.snowplow_utils.get_matched_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/get_matched_fields.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/get_matched_fields.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### Get New Event Limits Table Relation {#macro.snowplow_utils.get_new_event_limits_table_relation}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_new_event_limits_table_relation.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_new_event_limits_table_relation.sql">Source</a></i></b></center>

```jinja2
{% macro get_new_event_limits_table_relation(package_name) %}

  {%- set new_event_limits_table = ref(package_name~'_base_new_event_limits') -%}

  {{ return(new_event_limits_table) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.is_run_with_new_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.is_run_with_new_events)

</TabItem>
</Tabs>
</DbtDetails>

### Get Optional Fields {#macro.snowplow_utils.get_optional_fields}

<DbtDetails><summary>
<code>macros/utils/bigquery/get_optional_fields.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/get_optional_fields.sql">Source</a></i></b></center>

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

      cast(null as {{ field.dtype }}){%- if include_field_alias %} as {{ field_alias }}{%- endif %} {%- if not loop.last %}, {% endif %}
    {% endfor %}

  {%- endif -%}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)
- [macro.snowplow_utils.get_field_alias](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field_alias)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)
- [model.snowplow_web.snowplow_web_vital_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)
- [macro.snowplow_utils.get_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field)

</TabItem>
</Tabs>
</DbtDetails>

### Get Partition By {#macro.snowplow_utils.get_partition_by}

<DbtDetails><summary>
<code>macros/utils/get_partition_by.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_partition_by.sql">Source</a></i></b></center>

```jinja2


{%- macro get_partition_by(bigquery_partition_by=none, databricks_partition_by=none) -%}

  {%- do exceptions.warn("Warning: the `get_partition_by` macro is deprecated and will be removed in a future version of the package, please use `get_value_by_target_type` instead.") -%}

  {% if target.type == 'bigquery' %}
    {{ return(bigquery_partition_by) }}
  {% elif target.type in ['databricks', 'spark'] %}
    {{ return(databricks_partition_by) }}
  {% endif %}

{%- endmacro -%}
```

</DbtDetails>

</DbtDetails>

### Get Quarantine Sql {#macro.snowplow_utils.get_quarantine_sql}

<DbtDetails><summary>
<code>macros/incremental_hooks/quarantine_sessions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/quarantine_sessions.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.quarantine_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.quarantine_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Get Run Limits {#macro.snowplow_utils.get_run_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_run_limits.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_run_limits.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.current_timestamp_in_utc](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.current_timestamp_in_utc)
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
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

<h4>Description</h4>

Given a pattern, finds and returns all schemas that match that pattern. Note that for databricks any single character matches (`_`) will not be properly translated due to databricks using a regex expression instead of a SQL `like` clause.

      

<h4>Arguments</h4>

- `schema_pattern` *(string)*: The pattern for the schema(s) you wish to find. For all non-databricks should be of the usual SQL `like` form. `%` will be automatically translated for databricks, but other special characters may not be

<h4>Returns</h4>


      A list of schemas that match the pattern provided.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_schemas_by_pattern.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_schemas_by_pattern(schema_pattern) %}
    {{ return(adapter.dispatch('get_schemas_by_pattern', 'snowplow_utils')
        (schema_pattern)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_schemas_by_pattern(schema_pattern) %}

    {% set get_tables_sql = dbt_utils.get_tables_by_pattern_sql(schema_pattern, table_pattern='%') %}
    {% set results = [] if get_tables_sql.isspace() else run_query(get_tables_sql) %}
    {% set schemas = results|map(attribute='table_schema')|unique|list %}
    {{ return(schemas) }}

{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_schemas_by_pattern(schema_pattern) %}
    {# databricks/spark uses a regex on SHOW SCHEMAS and doesn't have an information schema in hive_metastore #}
    {%- set schema_pattern= dbt.replace(schema_pattern, "%", "*") -%}

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
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.replace
- macro.dbt.run_query
- macro.dbt_utils.get_tables_by_pattern_sql

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.post_ci_cleanup](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.post_ci_cleanup)

</TabItem>
</Tabs>
</DbtDetails>

### Get Sde Or Context {#macro.snowplow_utils.get_sde_or_context}

<DbtDetails><summary>
<code>macros/utils/get_sde_or_context.sql</code>
</summary>

<h4>Description</h4>

This macro exists for Redshift and Postgres users to more easily select their self-describing event and context tables and apply de-duplication before joining onto their (already de-duplicated) events table. The `root_id` and `root_tstamp` columns are by default returned as `schema_name_id` and `schema_name_tstamp` respectively, where `schema_name` is the value in the `schema_name` column of the table. In the case where multiple entities may be sent in the context (e.g. products in a search results), you should set the `single_entity` argument to `false` and use an additional criteria in your join (see [the snowplow docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-advanced-usage/dbt-duplicates/) for further details).

Note that is the responsibility of the user to ensure they have no duplicate names when using this macro multiple times or when a schema column name matches on already in the events table. In this case the `prefix` argument should be used and aliasing applied to the output.



<h4>Arguments</h4>

- `schema` *(string)*: The schema your context or sde table is in
- `identifier` *(string)*: The table name of your context or sde
- `lower_limit` *(string)*: Lower limit to filter the `root_tstamp` field on, only used if both lower and upper are provided
- `upper_limit` *(string)*: Upper limit to filter the `root_tstamp` field on, only used if both lower and upper are provided
- `prefix` *(string)*: A string to prefix (additional `_` added automatically) the column names with. If not provided `root_id` and `root_tstamp` will be prefixed with the schema name.

<h4>Returns</h4>


CTE sql for deduplicating records from the schema table, without the schema details columns. The final CTE is the name of the original table.

<h4>Usage</h4>


With at most one entity per context:
```sql
with {{ snowplow_utils.get_sde_or_context('atomic', 'nl_basjes_yauaa_context_1', "'2023-01-01'", "'2023-02-01'")}}

select
...
from my_events_table a
left join nl_basjes_yauaa_context_1 b on 
    a.event_id = b.yauaa_context__id 
    and a.collector_tstamp = b.yauaa_context__tstamp
```
With the possibility of multiple entities per context, your events table must already be de-duped but still have a field with the number of duplicates:
```sql
with {{ snowplow_utils.get_sde_or_context('atomic', 'nl_basjes_yauaa_context_1', "'2023-01-01'", "'2023-02-01'", single_entity = false)}}

select
...,
count(*) over (partition by a.event_id) as duplicate_count
from my_events_table a
left join nl_basjes_yauaa_context_1 b on 
    a.event_id = b.yauaa_context__id 
    and a.collector_tstamp = b.yauaa_context__tstamp
    and mod(b.yauaa_context__index, a.duplicate_count) = 0
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_sde_or_context.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_sde_or_context(schema, identifier, lower_limit, upper_limit, prefix = none, single_entity = true) %}
    {{ return(adapter.dispatch('get_sde_or_context', 'snowplow_utils')(schema, identifier, lower_limit, upper_limit, prefix, single_entity)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_sde_or_context(schema, identifier, lower_limit, upper_limit, prefix = none, single_entity = true) %}
    {% if execute %}
        {% do exceptions.raise_compiler_error('Macro get_sde_or_context is only for Postgres or Redshift, it is not supported for' ~ target.type) %}
    {% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_sde_or_context(schema, identifier, lower_limit, upper_limit, prefix = none, single_entity = true) %}
    {# Create a relation from the inputs then get all columns in that context/sde table #}
    {% set relation = api.Relation.create(schema = schema, identifier = identifier) %}
    {# Get the schema name to be able to alias the timestamp and id #}
    {% set schema_get_query %}
        select schema_name from {{ relation }}
        limit 1
    {% endset %}
    {%- set schema_name = dbt_utils.get_single_value(schema_get_query) -%}
    {# Get the columns to loop over #}
    {%- set columns = adapter.get_columns_in_relation(relation) -%}

    {% set sql %}
        {{'dd_' ~ identifier }} as (
            select
            {# Get all columns that aren't related to the schema itself #}
            {%- for col in columns -%}
                {%- if col.name not in ['schema_vendor', 'schema_name', 'schema_format', 'schema_version', 'ref_root', 'ref_tree', 'ref_parent'] %}
                    {{ col.quoted }},
                {%- endif -%}
            {% endfor %}
            {% if single_entity %}
                row_number() over (partition by root_id order by root_tstamp) as dedupe_index -- keep the first event for that root_id
            {% else %}
                row_number() over (partition by {% for item in columns | map(attribute='quoted') %}{{item}}{%- if not loop.last %},{% endif %}{% endfor -%} ) as dedupe_index -- get the index across all columns for the entity
            {% endif %}
            from
                {{ relation }}
            {% if upper_limit and lower_limit -%}
                where
                    root_tstamp >= {{ lower_limit }}
                    and root_tstamp <= {{ upper_limit }}
            {% endif %}
        ),

        {{identifier}} as (
            select
            {%- for col in columns -%}
                {%- if col.name | lower not in ['schema_vendor', 'schema_name', 'schema_format', 'schema_version', 'ref_root', 'ref_tree', 'ref_parent', 'root_tstamp', 'root_id'] %}
                    {{ col.quoted }}{% if prefix %} as {{ adapter.quote(prefix ~ '_' ~ col.name) }}{% endif -%},
                {%- endif -%}
            {% endfor -%}
            {# Rename columns that we know exist in every schema based table #}
            {% if not single_entity %}
                dedupe_index as {% if prefix %}{{ adapter.quote(prefix ~ '__index') }}{% else %}{{ adapter.quote(schema_name ~ '__index') }}{% endif %}, -- keep track of this for the join
            {% endif %}
                root_tstamp as {% if prefix %}{{ adapter.quote(prefix ~ '__tstamp') }}{% else %}{{ adapter.quote(schema_name ~ '__tstamp') }}{% endif %},
                root_id as {% if prefix %}{{ adapter.quote(prefix ~ '__id') }}{% else %}{{ adapter.quote(schema_name ~ '__id') }}{% endif %}
            from
                {{'dd_' ~ identifier }}
            {% if single_entity %}
            where
                dedupe_index = 1
            {% endif %}
        )

    {% endset %}
    {{ return(sql) }}
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt_utils.get_single_value

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_events_this_run)
- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Get Session Lookback Limit {#macro.snowplow_utils.get_session_lookback_limit}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_session_lookback_limit.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_session_lookback_limit.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Get Split To Array {#macro.snowplow_utils.get_split_to_array}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_split_to_array.sql</code>
</summary>

<h4>Description</h4>

This macro takes care of harmonising cross-db split to array type functions. The macro supports a custom delimiter if your string is not delimited by a comma with no space (default).



<h4>Arguments</h4>

- `string_column` *(string)*: Name of the column to split into an array
- `column_prefix` *(string)*: Table alias for the string_column
- `delimiter` *(string)*: (Optional) String that determines how to split your string. Default ','

<h4>Returns</h4>


The data warehouse appropriate sql to perform a split to array. 

<h4>Usage</h4>


```sql
select
...
{{ snowplow_utils.get_split_to_array('my_string_column', 'a', ', ') }}
...
from ... a

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_split_to_array.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2


{%- macro get_split_to_array(string_column, column_prefix, delimiter=',') -%}
    {{ return(adapter.dispatch('get_split_to_array', 'snowplow_utils')(string_column, column_prefix, delimiter)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_split_to_array(string_column, column_prefix, delimiter=',') %}
    split({{column_prefix}}.{{string_column}}, '{{delimiter}}')
{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_split_to_array(string_column, column_prefix, delimiter=',') %}
    string_to_array({{column_prefix}}.{{string_column}}, '{{delimiter}}')
{% endmacro %}
```

</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__get_split_to_array(string_column, column_prefix, delimiter=',') %}
    split_to_array({{column_prefix}}.{{string_column}}, '{{delimiter}}')
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_web.snowplow_web_consent_scope_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_scope_status)

</TabItem>
</Tabs>
</DbtDetails>

### Get String Agg {#macro.snowplow_utils.get_string_agg}

<DbtDetails><summary>
<code>macros/utils/cross_db/get_string_agg.sql</code>
</summary>

<h4>Description</h4>

This macro takes care of harmonising cross-db `list_agg`, `string_agg` type functions. These are aggregate functions (i.e. to be used with a `group by`) that take values from grouped rows and concatenates them into a single string. This macro supports ordering values by an arbitrary column and ensuring unique values (i.e. applying distinct).

Note that databricks does not have list/string_agg function so a more complex expression is used.



<h4>Arguments</h4>

- `base_column` *(string)*: Name of the column to aggregate values for
- `column_prefix` *(string)*: Table alias for the base_column
- `separator` *(string)*: (Optional) String to use to separate your values. Default ','
- `order_by_column` *(string)*: (Optional) Column to order your values by before aggregating. Default base_column
- `sort_numeric` *(boolean)*: (Optional) Is the column you are ordering by a numeric value (regardless of stored type). Default false
- `order_by_column_prefix` *(string)*: (Optional) Table alias for the order_by_column. Default column_prefix
- `is_distinct` *(boolean)*: (Optional) Do you want to apply distinct to your values. Will be applied after ordering. Default false
- `order_desc` *(boolean)*: (Optional) Do you wish to apply the ordering descending. Default false

<h4>Returns</h4>


The data warehouse appropriate sql to perform a list/string_agg. 

<h4>Usage</h4>


```sql
select
...
{{ snowplow_utils.get_string_agg('base_column', 'column_prefix', ';', 'order_by_col', sort_numeric=true, order_by_column_prefix='order_by_column_prefix', is_distict=True, order_desc=True)  }},
...
from ...
group by ...

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/get_string_agg.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2


{%- macro get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc=false) -%}

  {{ return(adapter.dispatch('get_string_agg', 'snowplow_utils')(base_column, column_prefix, separator, order_by_column, sort_numeric, order_by_column_prefix, is_distinct, order_desc)) }}

{%- endmacro -%}


```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc = false) %}

  {% if (base_column != order_by_column or column_prefix != order_by_column_prefix or sort_numeric) and is_distinct %}
    {%- do exceptions.raise_compiler_error("Snowplow Error: "~target.type~" does not support distinct with a different ordering column, or when the order column is numeric.") -%}
  {% endif %}

  string_agg({% if is_distinct %} distinct {% endif %} cast({{column_prefix}}.{{base_column}} as string), '{{separator}}' order by

  {% if sort_numeric -%}
    cast({{order_by_column_prefix}}.{{order_by_column}} as numeric) {% if order_desc %} desc {% endif %}

  {% else %}
    cast({{order_by_column_prefix}}.{{order_by_column}} as string) {% if order_desc %} desc {% endif %}

  {%- endif -%}
  )

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc=false) %}

  {% if (base_column != order_by_column or column_prefix != order_by_column_prefix or sort_numeric) and is_distinct %}
    {%- do exceptions.raise_compiler_error("Snowplow Error: "~target.type~" does not support distinct with a different ordering column, or when the order column is numeric.") -%}
  {% endif %}


  listagg({% if is_distinct %} distinct {% endif %} {{column_prefix}}.{{base_column}}::varchar, '{{separator}}') within group (order by

  {% if sort_numeric -%}
    to_numeric({{order_by_column_prefix}}.{{order_by_column}}, 38, 9) {% if order_desc %} desc {% endif %}

  {% else %}
    {{order_by_column_prefix}}.{{order_by_column}}::varchar {% if order_desc %} desc {% endif %}

  {%- endif -%}
  )

{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc = false) %}

  {% if (base_column != order_by_column or column_prefix != order_by_column_prefix or sort_numeric) and is_distinct %}
    {%- do exceptions.raise_compiler_error("Snowplow Error: "~target.type~" does not support distinct with a different ordering column, or when the order column is numeric.") -%}
  {% endif %}

  string_agg({% if is_distinct %} distinct {% endif %} {{column_prefix}}.{{base_column}}::varchar, '{{separator}}' order by

  {% if sort_numeric -%}
    {{order_by_column_prefix}}.{{order_by_column}}::decimal {% if order_desc %} desc {% endif %}

  {% else %}
    {{order_by_column_prefix}}.{{order_by_column}}::varchar {% if order_desc %} desc {% endif %}

  {%- endif -%}
  )

{% endmacro %}
```

</TabItem>
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc = false) %}

  {% if (base_column != order_by_column or column_prefix != order_by_column_prefix or sort_numeric) and is_distinct %}
    {%- do exceptions.raise_compiler_error("Snowplow Error: "~target.type~" does not support distinct with a different ordering column, or when the order column is numeric.") -%}
  {% endif %}

  listagg({% if is_distinct %} distinct {% endif %} {{column_prefix}}.{{base_column}}::varchar, '{{separator}}') within group (order by

  {% if sort_numeric -%}
    text_to_numeric_alt({{order_by_column_prefix}}.{{order_by_column}}, 38, 9) {% if order_desc %} desc {% endif %}

  {% else %}
    {{order_by_column_prefix}}.{{order_by_column}}::varchar {% if order_desc %} desc {% endif %}

  {%- endif -%}
  )

{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_string_agg(base_column, column_prefix, separator=',', order_by_column=base_column, sort_numeric=false, order_by_column_prefix=column_prefix, is_distinct=false, order_desc = false) %}
  /* Explaining inside out:
  1. Create a group array which is made of sub-arrays of the base_column and the sort column
  2. Sort these sub-arrays based on a lamdba function that compares on the second element (the sort column, casted if needed)
  3. Use transform to select just the first element of the array
  4. Optionally use array_distinct
  5. Join the array into a string
  */
  array_join(
    {% if is_distinct %} array_distinct( {% endif %}
    transform(
      array_sort(
        FILTER(collect_list(
          ARRAY({{column_prefix}}.{{base_column}}::string, {{order_by_column_prefix}}.{{order_by_column}}::string)), x -> x[0] is not null), (left, right) ->

          {%- if sort_numeric -%}
            CASE WHEN cast(left[1] as numeric(38, 9)) {% if order_desc %} > {% else %} < {% endif %} cast(right[1] as numeric(38, 9)) THEN -1
                        WHEN cast(left[1] as numeric(38, 9)) {% if order_desc %} < {% else %} > {% endif %} cast(right[1] as numeric(38, 9)) THEN 1 ELSE 0 END

          {% else %}
            CASE WHEN left[1] {% if order_desc %} > {% else %} < {% endif %} right[1] THEN -1
                        WHEN left[1] {% if order_desc %} < {% else %} > {% endif %} right[1] THEN 1 ELSE 0 END

          {% endif %}
                ), x -> x[0])
    {% if is_distinct %} ) {% endif %},
      '{{separator}}')


{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Successful Models {#macro.snowplow_utils.get_successful_models}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_successful_models.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_successful_models.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

### Get Value By Target {#macro.snowplow_utils.get_value_by_target}

<DbtDetails><summary>
<code>macros/utils/get_value_by_target.sql</code>
</summary>

<h4>Description</h4>

This macro is designed to dynamically return values based on the target (`target.name`) you are running against. Your target names are defined in your [profiles.yml](https://docs.getdbt.com/reference/profiles.yml) file. This can be useful for dynamically changing variables within your project, depending on whether you are running in dev or prod.



<h4>Arguments</h4>

- `dev_value`: Value to use if target is development
- `default_value`: Value to use if target is not development
- `dev_target_name` *(string)*: (Optional) Name of the development target. Default `dev`

<h4>Returns</h4>


The value relevant to the target environment

<h4>Usage</h4>


```yml

# dbt_project.yml
...
vars:
snowplow_web:
    snowplow__backfill_limit_days: "{{ snowplow_utils.get_value_by_target(dev_value=1, default_value=30, dev_target_name='dev') }}"

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_value_by_target.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_ecommerce.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.allow_refresh)
- [macro.snowplow_media_player.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.allow_refresh)
- [macro.snowplow_mobile.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.allow_refresh)
- [macro.snowplow_normalize.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.allow_refresh)
- [macro.snowplow_utils.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.allow_refresh)
- [macro.snowplow_web.allow_refresh](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.allow_refresh)

</TabItem>
</Tabs>
</DbtDetails>

### Get Value By Target Type {#macro.snowplow_utils.get_value_by_target_type}

<DbtDetails><summary>
<code>macros/utils/get_value_by_target_type.sql</code>
</summary>

<h4>Description</h4>

Returns the value provided based on the `target.type`. This is useful when you need a different value based on which warehouse is being used e.g. cluster fields or partition keys.



<h4>Arguments</h4>

- `bigquery_val` *(string)*: (Optional) Value to return if the `target.type` is bigquery. Default None
- `snowflake_val` *(string)*: (Optional) Value to return if the `target.type` is snowflake. Default None
- `redshift_val` *(string)*: (Optional) Value to return if the `target.type` is redshift. Default None
- `postgres_val` *(string)*: (Optional) Value to return if the `target.type` is postgres. Default None
- `databricks_val` *(string)*: (Optional) Value to return if the `target.type` is databricks. Default None

<h4>Returns</h4>


The appropriate value for the target warehouse type, or an error if not an expected target type.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/get_value_by_target_type.sql">Source</a></i></b></center>

```jinja2


{%- macro get_value_by_target_type(bigquery_val=none, snowflake_val=none, redshift_val=none, postgres_val=none, databricks_val=none) -%}

  {% if target.type == 'bigquery' %}
    {{ return(bigquery_val) }}
  {% elif target.type == 'snowflake' %}
    {{ return(snowflake_val) }}
  {% elif target.type == 'redshift' %}
    {{ return(redshift_val) }}
  {% elif target.type == 'postgres' %}
    {{ return(postgres_val) }}
  {% elif target.type in ['databricks', 'spark'] %}
    {{ return(databricks_val) }}
  {% else %}
    {{ exceptions.raise_compiler_error("Snowplow: Unexpected target type "~target.type) }}
  {% endif %}

{%- endmacro -%}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_session_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_session_stats)
- [model.snowplow_media_player.snowplow_media_player_user_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_user_stats)
- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_screen_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views_this_run)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_mobile.snowplow_mobile_sessions_sv_details](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_sv_details)
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
- [model.snowplow_web.snowplow_web_vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vitals)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_mobile.cluster_by_fields_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.cluster_by_fields_app_errors)
- [macro.snowplow_mobile.mobile_cluster_by_fields_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_screen_views)
- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions)
- [macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_mobile.mobile_cluster_by_fields_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/macros/index.md#macro.snowplow_mobile.mobile_cluster_by_fields_users)
- [macro.snowplow_utils.cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_web.web_cluster_by_fields_consent](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_consent)
- [macro.snowplow_web.web_cluster_by_fields_cwv](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_cwv)
- [macro.snowplow_web.web_cluster_by_fields_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_page_views)
- [macro.snowplow_web.web_cluster_by_fields_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_sessions)
- [macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle)
- [macro.snowplow_web.web_cluster_by_fields_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.web_cluster_by_fields_users)

</TabItem>
</Tabs>
</DbtDetails>

### Is Run With New Events {#macro.snowplow_utils.is_run_with_new_events}

<DbtDetails><summary>
<code>macros/utils/is_run_with_new_events.sql</code>
</summary>

<h4>Description</h4>

This macro is designed for use with Snowplow data modelling packages like `snowplow-web`. It can be used in any incremental models, to effectively block the incremental model from being updated with old data which it has already consumed. This saves cost as well as preventing historical data from being overwritten with partially complete data (due to a batch back-fill for instance).

The macro utilizes the `snowplow_[platform]_incremental_manifest` table to determine whether the model from which the macro is called, i.e. `{{ this }}`, has already consumed the data in the given run. If it has, it returns `false`. If the data in the run contains new data, `true` is returned.

For the sessions lifecycle identifier it does not use the manifest as this table is not included in it.



<h4>Arguments</h4>

- `package_name` *(string)*: The modeling package name e.g. `snowplow-mobile`

<h4>Returns</h4>


`true` if the run contains new events previously not consumed by `this`, `false` otherwise.

<h4>Usage</h4>


```sql

{{
config(
    materialized='incremental',
    unique_key='screen_view_id',
    upsert_date_key='start_tstamp'
)
}}

select
...

from {{ ref('snowplow_mobile_base_events_this_run' ) }}
where {{ snowplow_utils.is_run_with_new_events('snowplow_mobile') }} --returns false if run doesn't contain new events.

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/is_run_with_new_events.sql">Source</a></i></b></center>

```jinja2
{% macro is_run_with_new_events(package_name, new_event_limits_table=none, incremental_manifest_table=none, base_sessions_lifecycle_table=none) %}

  {%- if new_event_limits_table -%}
    {%- set new_event_limits_relation = ref(new_event_limits_table) -%}
  {%- else -%}
    {%- set new_event_limits_relation = snowplow_utils.get_new_event_limits_table_relation(package_name) -%}
  {%- endif -%}

  {%- if incremental_manifest_table -%}
    {%- set incremental_manifest_relation = ref(incremental_manifest_table) -%}
  {%- else-%}
    {%- set incremental_manifest_relation = snowplow_utils.get_incremental_manifest_table_relation(package_name) -%}
  {%- endif -%}

  {% if is_incremental() %}

    {%- set node_identifier = this.identifier -%}
    {%- if base_sessions_lifecycle_relation -%}
      {%- set base_sessions_lifecycle_identifier = ref(base_sessions_lifecycle_relation) -%}
    {%- else -%}
      {%- set base_sessions_lifecycle_identifier = package_name+'_base_sessions_lifecycle_manifest' -%}
    {%- endif -%}

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.is_incremental
- macro.dbt.run_query
- [macro.snowplow_utils.get_incremental_manifest_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_table_relation)
- [macro.snowplow_utils.get_new_event_limits_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_new_event_limits_table_relation)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
- [model.snowplow_ecommerce.snowplow_ecommerce_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
- [model.snowplow_media_player.snowplow_media_player_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)
- [model.snowplow_mobile.snowplow_mobile_app_errors](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_screen_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_screen_views)
- [model.snowplow_mobile.snowplow_mobile_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions)
- [model.snowplow_mobile.snowplow_mobile_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_user_mapping)
- [model.snowplow_mobile.snowplow_mobile_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_users)
- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)
- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)
- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)
- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)
- [model.snowplow_web.snowplow_web_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_user_mapping)
- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)
- [model.snowplow_web.snowplow_web_vital_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_events_this_run)
- [model.snowplow_web.snowplow_web_vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vitals)
- [model.snowplow_web.snowplow_web_vitals_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vitals_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_normalize.normalize_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.normalize_events)
- [macro.snowplow_normalize.users_table](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/macros/index.md#macro.snowplow_normalize.users_table)
- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Log Message {#macro.snowplow_utils.log_message}

<DbtDetails><summary>
<code>macros/utils/log_message.sql</code>
</summary>

<h4>Description</h4>

A wrapper macro for the `dbt_utils.pretty_log_format` using the `snowplow__has_log_enabled` to determine if the log is also printed to the stdout.

<h4>Arguments</h4>

- `message` *(string)*: The string message to print.
- `is_printed` *(boolean)*: Boolean value to determine if the log is also printed to the stdout

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/log_message.sql">Source</a></i></b></center>

```jinja2
{% macro log_message(message, is_printed=var('snowplow__has_log_enabled', true)) %}
    {{ log(dbt_utils.pretty_log_format(message), info=is_printed) }}
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt_utils.pretty_log_format

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_run_limits)
- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)
- [macro.snowplow_utils.return_limits_from_model](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.return_limits_from_model)
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Merge Fields Across Col Versions {#macro.snowplow_utils.merge_fields_across_col_versions}

<DbtDetails><summary>
<code>macros/utils/bigquery/combine_column_versions/merge_fields_across_col_versions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/bigquery/combine_column_versions/merge_fields_across_col_versions.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.combine_column_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.combine_column_versions)

</TabItem>
</Tabs>
</DbtDetails>

### N Timedeltas Ago {#macro.snowplow_utils.n_timedeltas_ago}

<DbtDetails><summary>
<code>macros/utils/n_timedeltas_ago.sql</code>
</summary>

<h4>Description</h4>

This macro takes the current timestamp and subtracts `n` units, as defined by the `timedelta_attribute`, from it. This is achieved using the Python datetime module, rather than querying your database. By combining this with the `get_value_by_target` macro, you can dynamically set dates depending on your environment.



<h4>Arguments</h4>

- `n` *(integer)*: The number of timedeltas to subtract from the current timestamp
- `timedelta_attribute` *(string)*: The type of units to subtract. This can be any valid attribute of the [timedelta](https://docs.python.org/3/library/datetime.html#timedelta-objects) object

<h4>Returns</h4>


Current timestamp minus `n` units.

<h4>Usage</h4>


```sql

{{ snowplow_utils.n_timedeltas_ago(1, 'weeks') }}

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/n_timedeltas_ago.sql">Source</a></i></b></center>

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

<h4>Description</h4>

This macro deletes all schemas that start with the specified `schema_pattern`, mostly for use before/after CI testing to ensure a clean start and removal of data after CI tests.

<h4>Arguments</h4>

- `schema_pattern` *(string)*: The prefix of the schema(s) to delete

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/post_ci_cleanup.sql">Source</a></i></b></center>

```jinja2
{% macro post_ci_cleanup(schema_pattern=target.schema) %}

  {# Get all schemas with the target.schema prefix #}
  {% set schemas = snowplow_utils.get_schemas_by_pattern(schema_pattern~'%') %}

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.get_schemas_by_pattern](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_schemas_by_pattern)

</TabItem>
</Tabs>
</DbtDetails>

### Print List {#macro.snowplow_utils.print_list}

<DbtDetails><summary>
<code>macros/utils/print_list.sql</code>
</summary>

<h4>Description</h4>

Prints an array as a `seperator` separated quoted list.



<h4>Arguments</h4>

- `list` *(array)*: Array object to print the (quoted) items of
- `separator` *(string)*: The character(s) to separate the items by, default `,`

<h4>Returns</h4>


Separated output of items in the list, quoted.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/print_list.sql">Source</a></i></b></center>

```jinja2
{% macro print_list(list, separator = ',') %}

  {%- for item in list %} '{{item}}' {%- if not loop.last %}{{separator}}{% endif %} {% endfor -%}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_incremental_manifest_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_status)
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Print Run Limits {#macro.snowplow_utils.print_run_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/get_incremental_manifest_status.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/get_incremental_manifest_status.sql">Source</a></i></b></center>

```jinja2
{% macro print_run_limits(run_limits_relation, package= none) -%}

  {% set run_limits_query %}
    select lower_limit, upper_limit from {{ run_limits_relation }}
  {% endset %}

  {# Derive limits from manifest instead of selecting from limits table since run_query executes during 2nd parse the limits table is yet to be updated. #}
  {% set results = run_query(run_limits_query) %}

  {% if execute %}

    {% set lower_limit = snowplow_utils.tstamp_to_str(results.columns[0].values()[0]) %}
    {% set upper_limit = snowplow_utils.tstamp_to_str(results.columns[1].values()[0]) %}
    {% set run_limits_message = "Snowplow: Processing data between " + lower_limit + " and " + upper_limit %}
    {% if package %}
        {% set run_limits_message = run_limits_message +  " (" + package + ")" %}
    {% endif %}

    {% do snowplow_utils.log_message(run_limits_message) %}

  {% endif %}

{%- endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.tstamp_to_str](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.tstamp_to_str)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
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

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/quarantine_sessions.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_quarantine_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_quarantine_sql)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Return Base New Event Limits {#macro.snowplow_utils.return_base_new_event_limits}

<DbtDetails><summary>
<code>macros/incremental_hooks/return_base_new_event_limits.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/return_base_new_event_limits.sql">Source</a></i></b></center>

```jinja2
{% macro return_base_new_event_limits(base_events_this_run) -%}

  {# In case of not execute just return empty strings to avoid hitting database #}
  {% if not execute %}
    {{ return(['','',''])}}
  {% endif %}

  {% set target_relation = adapter.get_relation(
        database=base_events_this_run.database,
        schema=base_events_this_run.schema,
        identifier=base_events_this_run.name) %}

  {% if target_relation is not none %}

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

  {% else %}

    {% do exceptions.warn("Snowplow Warning: " ~ base_events_this_run ~ " does not exist. This is expected if you are compiling a fresh installation of the dbt-snowplow-* packages.") %}

    {% set dummy_limit = snowplow_utils.cast_to_tstamp('9999-01-01 00:00:00') %}

    {{ return([dummy_limit, dummy_limit, dummy_limit]) }}

  {% endif %}

{%- endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.timestamp_add](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.timestamp_add)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_this_run)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)
- [macro.snowplow_utils.base_create_snowplow_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Return Limits From Model {#macro.snowplow_utils.return_limits_from_model}

<DbtDetails><summary>
<code>macros/utils/return_limits_from_model.sql</code>
</summary>

<h4>Description</h4>

Calculates and returns the minimum (lower) and maximum (upper) values of specified columns within the specified table. Useful to find ranges of a column within a table.



<h4>Arguments</h4>

- `model` *(relation)*: A string or `ref` type object to refer to a model or table to return limits from
- `lower_limit_col` *(string)*: The column to take the `min` of to get the lower limit
- `upper_limit_col` *(string)*: The column to take the `max` of to get the upper limit

<h4>Returns</h4>


A list of two objects, the lower and upper values from the columns in the model


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/return_limits_from_model.sql">Source</a></i></b></center>

```jinja2
{% macro return_limits_from_model(model, lower_limit_col, upper_limit_col) -%}

  {# In case of not execute just return empty strings to avoid hitting database #}
  {% if not execute %}
    {{ return(['','']) }}
  {% endif %}

  {% set target_relation = adapter.get_relation(
        database=model.database,
        schema=model.schema,
        identifier=model.name) %}

  {% if target_relation is not none %}

    {% set limit_query %}
      select
        min({{lower_limit_col}}) as lower_limit,
        max({{upper_limit_col}}) as upper_limit
      from {{ model }}
    {% endset %}

    {% set results = run_query(limit_query) %}

    {% if execute %}

      {# If there is no data within the limits, we should warn them otherwise they may be stuck here forever#}
      {%- if results.columns[0].values()[0] is none or results.columns[1].values()[0] is none -%}
      {# Currently warnings do not actually do anything other than text in logs, this makes it more visible https://github.com/dbt-labs/dbt-core/issues/6721 #}
        {{ snowplow_utils.log_message("Snowplow Warning: *************") }}
        {% do exceptions.warn("Snowplow Warning: No data in "~this~" for date range from variables, please modify your run variables to include data if this is not expected.") %}
        {{ snowplow_utils.log_message("Snowplow Warning: *************") }}
        {# This allows for bigquery to still run the same way the other warehouses do, but also ensures no data is processed #}
        {% set lower_limit = snowplow_utils.cast_to_tstamp('9999-01-01 00:00:00') %}
        {% set upper_limit = snowplow_utils.cast_to_tstamp('9999-01-02 00:00:00') %}
      {%- else -%}
        {% set lower_limit = snowplow_utils.cast_to_tstamp(results.columns[0].values()[0]) %}
        {% set upper_limit = snowplow_utils.cast_to_tstamp(results.columns[1].values()[0]) %}
      {%- endif -%}

      {{ return([lower_limit, upper_limit]) }}

    {% endif %}

  {% else %}

    {% do exceptions.warn("Snowplow Warning: " ~ model ~ " does not exist. This is expected if you are compiling a fresh installation of the dbt-snowplow-* packages.") %}
    {% set dummy_limit = snowplow_utils.cast_to_tstamp('9999-01-01 00:00:00') %}

    {{ return([dummy_limit, dummy_limit]) }}

  {% endif %}


{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- [macro.snowplow_utils.cast_to_tstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.cast_to_tstamp)
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_app_errors_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_app_errors_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_app_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_app_context)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_geo_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_geo_context)
- [model.snowplow_mobile.snowplow_mobile_base_mobile_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_mobile_context)
- [model.snowplow_mobile.snowplow_mobile_base_screen_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_screen_context)
- [model.snowplow_mobile.snowplow_mobile_base_session_context](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_session_context)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)
- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)
- [model.snowplow_web.snowplow_web_consent_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_users)
- [model.snowplow_web.snowplow_web_consent_versions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_versions)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Set Query Tag {#macro.snowplow_utils.set_query_tag}

<DbtDetails><summary>
<code>macros/utils/set_query_tag.sql</code>
</summary>

<h4>Description</h4>

This macro takes a provided statement as argument and generates the SQL command to set this statement as the query_tag for Snowflake databases, and does nothing otherwise. It can be used to safely set the query_tag regardless of database type.



<h4>Arguments</h4>

- `statement` *(string)*: The statement to use as the `query_tag` within Snowflake

<h4>Returns</h4>


An alter session command set to the `query_tag` to the `statement` for Snowflake, otherwise nothing

<h4>Usage</h4>


```sql

{{ snowplow_utils.set_query_tag('snowplow_query_tag') }}

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/set_query_tag.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

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
- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_new_event_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_new_event_limits)
- [model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)
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
- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)
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
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)
- [model.snowplow_web.snowplow_web_user_mapping](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_user_mapping)
- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)
- [model.snowplow_web.snowplow_web_users_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_aggs)
- [model.snowplow_web.snowplow_web_users_lasts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_lasts)
- [model.snowplow_web.snowplow_web_users_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_sessions_this_run)
- [model.snowplow_web.snowplow_web_users_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users_this_run)
- [model.snowplow_web.snowplow_web_vital_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_events_this_run)
- [model.snowplow_web.snowplow_web_vital_measurements](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vital_measurements)
- [model.snowplow_web.snowplow_web_vitals](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vitals)
- [model.snowplow_web.snowplow_web_vitals_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_vitals_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Base Delete From Manifest {#macro.snowplow_utils.snowplow_base_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_base_delete_from_manifest(models, incremental_manifest='snowplow_incremental_manifest') %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref(incremental_manifest)) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Delete From Manifest {#macro.snowplow_utils.snowplow_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_delete_from_manifest(models, incremental_manifest_table) %}

  {# Ensure models is a list #}
  {%- if models is string -%}
    {%- set models = [models] -%}
  {%- endif -%}

  {# No models to delete or not in execute mode #}
  {% if not models|length or not execute %}
    {{ return('') }}
  {% endif %}

  {# Get the manifest table to ensure it exits #}
  {%- set incremental_manifest_table_exists = adapter.get_relation(incremental_manifest_table.database,
                                                                  incremental_manifest_table.schema,
                                                                  incremental_manifest_table.name) -%}

  {%- if not incremental_manifest_table_exists -%}
    {{return(dbt_utils.log_info("Snowplow: "+incremental_manifest_table|string+" does not exist"))}}
  {%- endif -%}

  {# Get all models in the manifest and compare to list of models to delete #}
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query
- macro.dbt_utils.get_column_values
- macro.dbt_utils.log_info
- [macro.snowplow_utils.log_message](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.log_message)
- [macro.snowplow_utils.print_list](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_list)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_ecommerce.snowplow_ecommerce_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/macros/index.md#macro.snowplow_ecommerce.snowplow_ecommerce_delete_from_manifest)
- [macro.snowplow_media_player.snowplow_media_player_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.snowplow_media_player_delete_from_manifest)
- [macro.snowplow_utils.snowplow_base_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_base_delete_from_manifest)
- [macro.snowplow_utils.snowplow_mobile_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_mobile_delete_from_manifest)
- [macro.snowplow_utils.snowplow_web_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_web_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Incremental Post Hook {#macro.snowplow_utils.snowplow_incremental_post_hook}

<DbtDetails><summary>
<code>macros/incremental_hooks/snowplow_incremental_post_hook.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/snowplow_incremental_post_hook.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_incremental_post_hook(package_name='snowplow', incremental_manifest_table_name=none, base_events_this_run_table_name=none, session_timestamp=var('snowplow__session_timestamp', 'load_tstamp')) %}

  {% set enabled_snowplow_models = snowplow_utils.get_enabled_snowplow_models(package_name) -%}

  {% set successful_snowplow_models = snowplow_utils.get_successful_models(models=enabled_snowplow_models) -%}

  {%- if incremental_manifest_table_name -%}
    {%- set incremental_manifest_table = ref(incremental_manifest_table_name) -%}
  {%- else -%}
    {% set incremental_manifest_table = snowplow_utils.get_incremental_manifest_table_relation(package_name) -%}
  {%- endif -%}

  {%- if base_events_this_run_table_name -%}
    {%- set base_events_this_run_table = ref(base_events_this_run_table_name) -%}
  {%- else -%}
    {% set base_events_this_run_table = ref(package_name~'_base_events_this_run') -%}
  {%- endif -%}

  {{ snowplow_utils.update_incremental_manifest_table(incremental_manifest_table, base_events_this_run_table, successful_snowplow_models, session_timestamp) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_enabled_snowplow_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_enabled_snowplow_models)
- [macro.snowplow_utils.get_incremental_manifest_table_relation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_incremental_manifest_table_relation)
- [macro.snowplow_utils.get_successful_models](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_successful_models)
- [macro.snowplow_utils.update_incremental_manifest_table](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.update_incremental_manifest_table)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Mobile Delete From Manifest {#macro.snowplow_utils.snowplow_mobile_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_mobile_delete_from_manifest(models) %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_mobile_incremental_manifest')) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Web Delete From Manifest {#macro.snowplow_utils.snowplow_web_delete_from_manifest}

<DbtDetails><summary>
<code>macros/utils/snowplow_delete_from_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/snowplow_delete_from_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_web_delete_from_manifest(models) %}

  {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_web_incremental_manifest')) }}

{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Throw Compiler Error {#macro.snowplow_utils.throw_compiler_error}

<DbtDetails><summary>
<code>macros/utils/throw_compiler_error.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/throw_compiler_error.sql">Source</a></i></b></center>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_level_limit](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_level_limit)

</TabItem>
</Tabs>
</DbtDetails>

### Timestamp Add {#macro.snowplow_utils.timestamp_add}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.dateadd

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_mobile.snowplow_mobile_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_events_this_run)
- [model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_base_sessions_lifecycle_manifest)
- [model.snowplow_normalize.snowplow_normalize_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_normalize/models/index.md#model.snowplow_normalize.snowplow_normalize_base_events_this_run)
- [model.snowplow_web.snowplow_web_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_events_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.base_create_snowplow_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_events_this_run)
- [macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_sessions_lifecycle_manifest)
- [macro.snowplow_utils.base_get_quarantine_sql](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_get_quarantine_sql)
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

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.datediff

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_mobile.snowplow_mobile_sessions_aggs](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_aggs)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### To Unixtstamp {#macro.snowplow_utils.to_unixtstamp}

<DbtDetails><summary>
<code>macros/utils/cross_db/timestamp_functions.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/timestamp_functions.sql">Source</a></i></b></center>

```jinja2



{%- macro to_unixtstamp(tstamp) -%}
    {{ adapter.dispatch('to_unixtstamp', 'snowplow_utils') (tstamp) }}
{%- endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowflake__to_unixtstamp](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowflake__to_unixtstamp)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_pv_engaged_time](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_pv_engaged_time)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Tstamp To Str {#macro.snowplow_utils.tstamp_to_str}

<DbtDetails><summary>
<code>macros/utils/tstamp_to_str.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/tstamp_to_str.sql">Source</a></i></b></center>

```jinja2
{% macro tstamp_to_str(tstamp) -%}
  '{{ tstamp.strftime("%Y-%m-%d %H:%M:%S") }}'
{%- endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.print_run_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_run_limits)

</TabItem>
</Tabs>
</DbtDetails>

### Type Max String {#macro.snowplow_utils.type_max_string}

<DbtDetails><summary>
<code>macros/utils/cross_db/datatypes.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/datatypes.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2


{%- macro type_max_string() -%}
        {{ return(adapter.dispatch('type_max_string', 'snowplow_utils')()) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__type_max_string() %}
    {{ dbt.type_string() }}
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
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)
- [model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_incremental_manifest)
- [model.snowplow_mobile.snowplow_mobile_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_mobile/models/index.md#model.snowplow_mobile.snowplow_mobile_sessions_this_run)
- [model.snowplow_web.snowplow_web_consent_scope_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_scope_status)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_spend)
- [macro.snowplow_utils.base_create_snowplow_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_incremental_manifest)
- [macro.snowplow_utils.base_create_snowplow_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.base_create_snowplow_quarantined_sessions)
- [macro.snowplow_web.get_iab_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.get_iab_context_fields)
- [macro.snowplow_web.get_ua_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.get_ua_context_fields)
- [macro.snowplow_web.get_yauaa_context_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/macros/index.md#macro.snowplow_web.get_yauaa_context_fields)

</TabItem>
</Tabs>
</DbtDetails>

### Unnest {#macro.snowplow_utils.unnest}

<DbtDetails><summary>
<code>macros/utils/cross_db/unnest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/utils/cross_db/unnest.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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
    select {{ id_column }}, trim(unnest({{ unnest_column }})) as {{ field_alias }}
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
    select t.{{ id_column }}, replace(r.value, '"', '') as {{ field_alias }}
    from {{ source_table }} t, table(flatten(t.{{ unnest_column }})) r
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_web.snowplow_web_consent_scope_status](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_scope_status)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_spend)

</TabItem>
</Tabs>
</DbtDetails>

### Update Incremental Manifest Table {#macro.snowplow_utils.update_incremental_manifest_table}

<DbtDetails><summary>
<code>macros/incremental_hooks/update_incremental_manifest_table.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-utils/blob/main/macros/incremental_hooks/update_incremental_manifest_table.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro update_incremental_manifest_table(manifest_table, base_events_table, models, session_timestamp=var('snowplow__session_timestamp', 'load_tstamp')) -%}

  {{ return(adapter.dispatch('update_incremental_manifest_table', 'snowplow_utils')(manifest_table, base_events_table, models, session_timestamp)) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__update_incremental_manifest_table(manifest_table, base_events_table, models, session_timestamp) -%}

  {% if models %}

    {% set last_success_query %}
      select
        b.model,
        a.last_success

      from
        (select max({{ session_timestamp }}) as last_success from {{ base_events_table }}) a,
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
{% macro postgres__update_incremental_manifest_table(manifest_table, base_events_table, models, session_timestamp) -%}

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
            (select max({{ session_timestamp }}) as last_success from {{ base_events_table }}) as ls,
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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.snowplow_incremental_post_hook](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_incremental_post_hook)

</TabItem>
</Tabs>
</DbtDetails>

