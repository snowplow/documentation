---
title: "Snowplow Media Player Macros"
description: Reference for snowplow_media_player dbt macros developed by Snowplow
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
## Snowplow Media Player
### Allow Refresh {#macro.snowplow_media_player.allow_refresh}

<DbtDetails><summary>
<code>macros/allow_refresh.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/allow_refresh.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_media_player')()) }}
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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_quarantined_sessions)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)
- [model.snowplow_media_player.snowplow_media_player_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Event Name Filter {#macro.snowplow_media_player.event_name_filter}

<DbtDetails><summary>
<code>macros/event_name_filter.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/event_name_filter.sql">Source</a></i></b></center>

```jinja2
{% macro event_name_filter(event_names) %}

  (
  {%- if event_names|length -%}
    lower(event_name) in ('{{ event_names|map("lower")|join("','") }}') --filter on event_name if provided
  {%- else -%}
    true
  {%- endif %}
  or lower(event_vendor) = 'com.snowplowanalytics.snowplow.media'
  )

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Field {#macro.snowplow_media_player.field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/field.sql</code>
</summary>

<h4>Description</h4>

This macro is used to define a path to a column either as a string or using a dictionary definition.

On BigQuery, the `snowplow_utils.get_optional_fields` macro is used.



<h4>Arguments</h4>

- `property` *(string)*: String path to the column or a dictionary describing the field
- `col_prefix` *(string)*: The prefix to use for the column name
- `field` *(string)*: The default name of the field to use when a dictionary is passed in for the property argument

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ field('a.contexts_com_youtube_youtube_1[0]:playerId') }},
    {{ field({ 'field': 'playerId', 'col_prefix': 'a.contexts_com_youtube_youtube_1' }) }},
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/field.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro field(property, col_prefix=None, field=None) -%}
    {{ return(adapter.dispatch('field')(property, col_prefix, field)) }}
{%- endmacro %}
```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__field(property, col_prefix, field) -%}
    {% if property is string -%}
    {{ property }}
    {%- else -%}
    {{ snowplow_utils.get_optional_fields(
        enabled=true,
        fields=[{'field': property.get('field', field), 'dtype': property.get('dtype', 'string') }],
        col_prefix=property.get('col_prefix', col_prefix),
        relation=source('atomic', 'events'),
        relation_alias=property.get('relation_alias', 'a'),
        include_field_alias=false
    ) }}
    {%- endif %}
{%- endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__field(property, col_prefix, field) -%}
    {% if property is string -%}
    {{ property }}
    {%- else -%}
    {{ snowplow_utils.get_field(
        column_name=property.get('col_prefix', col_prefix),
        field_name=property.get('field', field),
        table_alias=property.get('relation_alias', 'a'),
        type=property.get('dtype', 'string'),
        array_index='0' if 'contexts_' in property.get('col_prefix', col_prefix) else none
    ) }}
    {%- endif %}
{%- endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.get_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_field)
- [macro.snowplow_utils.get_optional_fields](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_optional_fields)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.media_ad_break_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_break_field)
- [macro.snowplow_media_player.media_ad_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_field)
- [macro.snowplow_media_player.media_ad_quartile_event_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_ad_quartile_event_field)
- [macro.snowplow_media_player.media_event_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_event_type_field)
- [macro.snowplow_media_player.media_id_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_id_field)
- [macro.snowplow_media_player.media_player_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_player_field)
- [macro.snowplow_media_player.media_player_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_player_type_field)
- [macro.snowplow_media_player.media_session_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_session_field)
- [macro.snowplow_media_player.media_type_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.media_type_field)
- [macro.snowplow_media_player.percent_progress_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.percent_progress_field)
- [macro.snowplow_media_player.playback_quality_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.playback_quality_field)
- [macro.snowplow_media_player.source_url_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.source_url_field)
- [macro.snowplow_media_player.web_or_mobile_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.web_or_mobile_field)

</TabItem>
</Tabs>
</DbtDetails>

### Get Percentage Boundaries {#macro.snowplow_media_player.get_percentage_boundaries}

<DbtDetails><summary>
<code>macros/get_percentage_boundaries.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/get_percentage_boundaries.sql">Source</a></i></b></center>

```jinja2
{% macro get_percentage_boundaries(tracked_boundaries) %}

   {% set percentage_boundaries = [] %}

   {% for element in var("snowplow__percent_progress_boundaries") %}
     {% if element < 0 or element > 100 %}
       {{ exceptions.raise_compiler_error("`snowplow__percent_progress_boundary` is outside the accepted range 0-100. Got: " ~ element) }}

     {% elif element % 1 != 0 %}
       {{ exceptions.raise_compiler_error("`snowplow__percent_progress_boundary` needs to be a whole number. Got: " ~ element) }}

     {% else %}
       {% do percentage_boundaries.append(element) %}
     {% endif %}
   {% endfor %}

   {% if 100 not in var("snowplow__percent_progress_boundaries") %}
     {% do percentage_boundaries.append(100) %}
   {% endif %}

   {{ return(percentage_boundaries) }}

 {% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.percent_progress_field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.percent_progress_field)

</TabItem>
</Tabs>
</DbtDetails>

### Media Ad Break Field {#macro.snowplow_media_player.media_ad_break_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_ad_break_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from the media ad break context entity.



<h4>Arguments</h4>

- `property` *(string)*: The field definition either as a string path or a dictionary

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_ad_break_field({ 'field': 'name' }) }},
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_ad_break_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_ad_break_field(property) %}
    {%- if var("snowplow__enable_media_ad_break") -%}
      {{ field(
        property,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_ad_break_1'
      ) }}
    {%- else -%}
      {% if property is string and target.type not in ['postgres', 'redshift'] -%}
          {{ property }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ property.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif -%}
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Media Ad Field {#macro.snowplow_media_player.media_ad_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_ad_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from the media ad context entity.



<h4>Arguments</h4>

- `property` *(string)*: The field definition either as a string path or a dictionary

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_ad_field({ 'field': 'name' }) }},
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_ad_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_ad_field(property) %}
    {%- if var("snowplow__enable_media_ad") -%}
      {{ field(
        property,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_ad_1'
      ) }}
    {%- else -%}
      {% if property is string and target.type not in ['postgres', 'redshift'] -%}
          {{ property }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ property.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif -%}
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)

</TabItem>
</Tabs>
</DbtDetails>

### Media Ad Quartile Event Field {#macro.snowplow_media_player.media_ad_quartile_event_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_ad_quartile_event_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from the media ad quartile self-describing event.



<h4>Arguments</h4>

- `property` *(string)*: The field definition either as a string path or a dictionary

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_ad_quartile_event_field({ 'field': 'percent_progress' }) }},
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_ad_quartile_event_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_ad_quartile_event_field(property) %}
    {%- if var("snowplow__enable_ad_quartile_event") -%}
      {{ field(
        property,
        col_prefix='unstruct_event_com_snowplowanalytics_snowplow_media_ad_quartile_event_1'
      ) }}
    {%- else -%}
      {% if property is string and target.type not in ['postgres', 'redshift'] -%}
          {{ property }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ property.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif -%}
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ad_views_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_ads](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_ads)

</TabItem>
</Tabs>
</DbtDetails>

### Media Event Type Field {#macro.snowplow_media_player.media_event_type_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_event_type_field.sql</code>
</summary>

<h4>Description</h4>

Retrieves the event type either from the media player event in case of v1 media schemas or the event name in case of v2 media schemas.



<h4>Arguments</h4>

- `media_player_event_type` *(string)*: The type property in the media player event
- `event_name` *(string)*: The event name used for v2 media schemas

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_event_type_field(media_player_event_type={ 'dtype': 'string' }, event_name='a.event_name') }} as event_type,
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_event_type_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_event_type_field(media_player_event_type, event_name) %}
  coalesce(
    {% if var("snowplow__enable_media_player_v1") -%}
      -- for v1 media schemas, use the type property in media_player_event
      {{ field(
        media_player_event_type,
        col_prefix="unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1",
        field='type'
      ) }}
    {%- else -%}
      {% if media_player_event_type is string and target.type not in ['postgres', 'redshift'] -%}
          {{ media_player_event_type }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ media_player_event_type.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %},
    -- for v2 media schemas, the type is the event name, remove underscores to match v1 event types
    case 
        when right({{ event_name }}, 6) = '_event'
        then replace(
            left({{ event_name }}, length({{ event_name }}) - 6),
            '_',
            ''
        )
        else null
    end
  )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Media Id Field {#macro.snowplow_media_player.media_id_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_id_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value media_id column in the snowplow_media_player_base_events_this_run table based on the values of the youtube_player_id and media_player_id columns.



<h4>Arguments</h4>

- `v2_player_label` *(string)*: The label value in the v2 of the player context entity
- `youtube_player_id` *(string)*: The name of the player_id column in the YouTube context
- `media_player_id` *(string)*: The name of the player_id column in the HTML5 media element context

<h4>Returns</h4>


The query for the media_id column.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_id_field(
        youtube_player_id='a.contexts_com_youtube_youtube_1[0]:playerId',
        media_player_id='a.contexts_org_whatwg_media_element_1[0]:htmlId::varchar'
    ) }} as media_id
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_id_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_id_field(v2_player_label, youtube_player_id, media_player_id) %}
    coalesce(
      {% if var("snowplow__enable_youtube") -%}
        {{ field(
          youtube_player_id,
          col_prefix='contexts_com_youtube_youtube_1'
        ) }}
      {%- else -%}
        {% if youtube_player_id is string and target.type not in ['postgres', 'redshift'] -%}
          {{ youtube_player_id }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ youtube_player_id.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {% if var("snowplow__enable_whatwg_media") -%}
        {{ field(
          media_player_id,
          col_prefix='contexts_org_whatwg_media_element_1'
        ) }}
      {%- else -%}
        {% if media_player_id is string and target.type not in ['postgres', 'redshift'] -%}
          {{ media_player_id }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ media_player_id.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {% if var("snowplow__enable_media_player_v2") -%}
        {{ dbt_utils.generate_surrogate_key([
          field(
            v2_player_label,
            col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
          )
        ]) }}
      {%- else -%}
        {% if v2_player_label is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2_player_label }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2_player_label.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %}
    )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt_utils.generate_surrogate_key
- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Media Player Field {#macro.snowplow_media_player.media_player_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_player_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from either the v2 or v1 media player context entity.



<h4>Arguments</h4>

- `v1` *(string)*: The field definition in the v1 media player context entity
- `v2` *(string)*: The field definition in the v2 media player context entity
- `default` *(string)*: Optional default value

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    round({{ media_player_field(
      v1={ 'field': 'duration', 'dtype': 'double' },
      v2={ 'field': 'duration', 'dtype': 'double' }
    ) }}) as duration_secs,
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_player_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_player_field(v1, v2, default='null') %}
    coalesce(
      {% if var("snowplow__enable_media_player_v2") -%}
        {{ field(
          v2,
          col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
        ) }}
      {%- else -%}
        {% if v2 is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2 }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {%- if v1 is not none and var("snowplow__enable_media_player_v1") -%}
        {{ field(
          v1,
          col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1'
        ) }}
      {%- else -%}
        {% if v1 is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v1 }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v1.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {{ default }}
    )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Media Player Type Field {#macro.snowplow_media_player.media_player_type_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_player_type_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value media_player_type column in the snowplow_media_player_base_events_this_run table based on the values of the youtube_player_id and media_player_id columns.



<h4>Arguments</h4>

- `v2_player_type` *(string)*: The player_type value in the v2 of the player context entity
- `youtube_player_id` *(string)*: The name of the player_id column in the YouTube context
- `media_player_id` *(string)*: The name of the player_id column in the HTML5 media element context

<h4>Returns</h4>


The query for the media_player_type column.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_player_type_field(
        youtube_player_id='a.contexts_com_youtube_youtube_1[0]:playerId',
        media_player_id='a.contexts_org_whatwg_media_element_1[0]:htmlId::varchar'
    ) }} as media_player_type
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_player_type_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_player_type_field(v2_player_type, youtube_player_id, media_player_id) %}
    coalesce(
      {% if var("snowplow__enable_media_player_v2") -%}
        {{ field(
          v2_player_type,
          col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
        ) }}
      {%- else -%}
        {% if v2_player_type is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2_player_type }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2_player_type.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {% if var("snowplow__enable_youtube") and var("snowplow__enable_whatwg_media") -%}
        case
          when {{ field(
            youtube_player_id,
            col_prefix='contexts_com_youtube_youtube_1'
          ) }} is not null then 'com.youtube-youtube'
          when {{ field(
            media_player_id,
            col_prefix='contexts_org_whatwg_media_element_1'
          ) }} is not null then 'org.whatwg-media_element'
          else 'unknown'
        end
      {%- elif var("snowplow__enable_youtube") -%}
        'com.youtube-youtube'
      {% elif var("snowplow__enable_whatwg_media") -%}
        'org.whatwg-media_element'
      {%- else -%}
        {% if youtube_player_id is string and target.type not in ['postgres', 'redshift'] -%}
          {{ youtube_player_id }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ youtube_player_id.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {% endif %}
    )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Media Session Field {#macro.snowplow_media_player.media_session_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_session_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from the media session context entity.



<h4>Arguments</h4>

- `property` *(string)*: The field definition either as a string path or a dictionary

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_session_field({ 'field': 'time_played' }) }},
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_session_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_session_field(property) %}
    {% if var("snowplow__enable_media_session") -%}
      {{ field(
        property,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_session_1'
      ) }}
    {%- else -%}
      {% if property is string and target.type not in ['postgres', 'redshift'] -%}
          {{ property }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ property.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %}
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)
- [model.snowplow_media_player.snowplow_media_player_base_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_this_run)
- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)

</TabItem>
</Tabs>
</DbtDetails>

### Media Type Field {#macro.snowplow_media_player.media_type_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/media_type_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value media_type column in the snowplow_media_player_base_events_this_run table based on the column for media_type in the media context or returns video for youtube.



<h4>Arguments</h4>

- `media_media_type` *(string)*: The media_type value in the HTML5 media element context

<h4>Returns</h4>


The query for the media_type column.

<h4>Usage</h4>


```sql
select
    ...,
    {{ media_type_field(
      media_media_type='a.contexts_org_whatwg_media_element_1[0]:mediaType::varchar'
    ) }} as media_type
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/media_type_field.sql">Source</a></i></b></center>

```jinja2
{% macro media_type_field(v2_media_type, media_media_type) %}
  coalesce(
    {% if var("snowplow__enable_media_player_v2") -%}
      {{ field(
        v2_media_type,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
      ) }}
    {%- else -%}
      {% if v2_media_type is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2_media_type }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2_media_type.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %},
    {% if var("snowplow__enable_whatwg_media") -%}
      case when {{ field(
        media_media_type,
        col_prefix='contexts_org_whatwg_media_element_1'
      ) }} = 'audio' then 'audio' else 'video' end
    {%- elif var("snowplow__enable_youtube") -%}
      'video'
    {%- else -%}
      {% if media_media_type is string and target.type not in ['postgres', 'redshift'] -%}
          {{ media_media_type }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ media_media_type.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %}
  )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Percent Progress Field {#macro.snowplow_media_player.percent_progress_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/percent_progress_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value for the percentage progress in case of percent progress events.
For v1 media schemas, the value is taken from the media player context entity.
For v2 media schemas, it is calculated based on the current time, duration and defined percentage boundaries.



<h4>Arguments</h4>

- `v1_percent_progress` *(string)*: The percent_progress value in the v1 of the player context entity
- `v1_event_type` *(string)*: The type property from the v1 media player event
- `event_name` *(string)*: The event name used for v2 media schemas
- `v2_current_time` *(string)*: The current_time value in the v2 of the player context entity
- `v2_duration` *(string)*: The duration value in the v2 of the player context entity

<h4>Returns</h4>


The query for the percent_progress field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ percent_progress_field(
        v1_percent_progress={ 'field': 'percent_progress', 'dtype': 'string' },
        v1_event_type={ 'field': 'type', 'dtype': 'string' },
        event_name='a.event_name',
        v2_current_time={ 'field': 'current_time', 'dtype': 'double' },
        v2_duration={ 'field': 'duration', 'dtype': 'double' }
    ) }} as percent_progress
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/percent_progress_field.sql">Source</a></i></b></center>

```jinja2
{% macro percent_progress_field(v1_percent_progress, v1_event_type, event_name, v2_current_time, v2_duration) %}
    {%- set v2_percent_progres -%}
      round({{ field(
        v2_current_time,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
      ) }} / {{ field(
        v2_duration,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
      ) }} * 100)
    {%- endset -%}
    coalesce(
      {% if var("snowplow__enable_media_player_v1") -%}
        case
          when {{ field(
            v1_event_type,
            col_prefix="unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1",
            field='type'
          ) }} = 'ended'
          then 100
          else {{ field(
            v1_percent_progress,
            col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_1'
          ) }}
        end
      {%- else -%}
        {% if v1_percent_progress is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v1_percent_progress }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v1_percent_progress.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {% if var("snowplow__enable_media_player_v2") -%}
        case
            when {{ event_name }} = 'end_event'
            then 100
            when {{ event_name }} = 'percent_progress_event'
            and coalesce({{ field(
              v2_duration,
              col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
            ) }}, 0) > 0
            then (
              case
                {% for element in get_percentage_boundaries(var("snowplow__percent_progress_boundaries"))|sort|reverse %}
                when {{ v2_percent_progres }} >= {{ element }}
                then {{ element }}
                {% endfor %}
                else null
              end
            )

            else null
        end
      {%- else -%}
        {% if v2_duration is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2_duration }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2_duration.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %}
    )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)
- [macro.snowplow_media_player.get_percentage_boundaries](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.get_percentage_boundaries)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Playback Quality Field {#macro.snowplow_media_player.playback_quality_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/playback_quality_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value for the playback_quality column in the snowplow_media_player_base_events_this_run table based on the values of the quality in youtube context or video_width and video_height columns in media context.



<h4>Arguments</h4>

- `v2_quality` *(string)*: The quality value in the v2 of the player context entity
- `youtube_quality` *(string)*: The quality value in the YouTube context
- `video_width` *(string)*: The video width value in the HTML5 video element context
- `video_height` *(string)*: The video height value in the HTML5 video element context

<h4>Returns</h4>


The query for the playback_quality column.

<h4>Usage</h4>


```sql
select
    ...,
    {{ playback_quality_field(
      youtube_quality='a.contexts_com_youtube_youtube_1[0]:playbackQuality::varchar',
      video_width='a.contexts_org_whatwg_video_element_1[0]:videoWidth::varchar',
      video_height='a.contexts_org_whatwg_video_element_1[0]:videoHeight::varchar'
    )}} as playback_quality
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/playback_quality_field.sql">Source</a></i></b></center>

```jinja2
{% macro playback_quality_field(v2_quality, youtube_quality, video_width, video_height) %}
  coalesce(
    {% if var("snowplow__enable_media_player_v2") -%}
      {{ field(
        v2_quality,
        col_prefix='contexts_com_snowplowanalytics_snowplow_media_player_2'
      ) }}
    {%- else -%}
      {% if v2_quality is string and target.type not in ['postgres', 'redshift'] -%}
          {{ v2_quality }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ v2_quality.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %},
    {% if var("snowplow__enable_youtube") -%}
      {{ field(
        youtube_quality,
        col_prefix='contexts_com_youtube_youtube_1'
      ) }}
    {%- else -%}
      {% if youtube_quality is string and target.type not in ['postgres', 'redshift'] -%}
          {{ youtube_quality }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ youtube_quality.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %},
    {% if var("snowplow__enable_whatwg_media") and var("snowplow__enable_whatwg_video") -%}
      {{ field(
        video_width,
        col_prefix='contexts_org_whatwg_video_element_1'
      ) }}||'x'||{{ field(
        video_height,
        col_prefix='contexts_org_whatwg_video_element_1'
      ) }}
    {%- else -%}
      {% if video_width is string and target.type not in ['postgres', 'redshift'] -%}
          {{ video_width }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ video_width.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {% endif %},
    'N/A'
   )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Media Player Delete From Manifest {#macro.snowplow_media_player.snowplow_media_player_delete_from_manifest}

<DbtDetails><summary>
<code>macros/snowplow_delete_from_manifest.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_delete_from_manifest.sql">Source</a></i></b></center>

```jinja2
{% macro snowplow_media_player_delete_from_manifest(models) %}
    {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_media_player_incremental_manifest'))}}
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

### Source Url Field {#macro.snowplow_media_player.source_url_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/source_url_field.sql</code>
</summary>

<h4>Description</h4>

This macro produces the value source_url column in the snowplow_media_player_base_events_this_run table based on the columns for the url in YouTube context and current_src in media context.



<h4>Arguments</h4>

- `youtube_url` *(string)*: The url value in the YouTube context
- `media_current_src` *(string)*: The current_src value in the HTML5 media element context

<h4>Returns</h4>


The query for the source_url column.

<h4>Usage</h4>


```sql
select
    ...,
    {{ source_url_field(
      youtube_url='a.contexts_com_youtube_youtube_1[0]:url::varchar',
      media_current_src='a.contexts_org_whatwg_media_element_1[0]:currentSrc::varchar'
    ) }} as source_url
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/source_url_field.sql">Source</a></i></b></center>

```jinja2
{% macro source_url_field(youtube_url, media_current_src) %}
  coalesce(
    {% if var("snowplow__enable_youtube") -%}
      {{ field(
        youtube_url,
        col_prefix='contexts_com_youtube_youtube_1'
      ) }}
    {%- else -%}
      {% if youtube_url is string and target.type not in ['postgres', 'redshift'] -%}
          {{ youtube_url }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ youtube_url.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %},
    {% if var("snowplow__enable_whatwg_media") -%}
      {{ field(
        media_current_src,
        col_prefix='contexts_org_whatwg_media_element_1'
      ) }}
    {%- else -%}
      {% if media_current_src is string and target.type not in ['postgres', 'redshift'] -%}
          {{ media_current_src }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ media_current_src.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
    {%- endif %}
  )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Web Or Mobile Field {#macro.snowplow_media_player.web_or_mobile_field}

<DbtDetails><summary>
<code>macros/snowplow_media_player_base_events_this_run/web_or_mobile_field.sql</code>
</summary>

<h4>Description</h4>

This macro retrieves a property from the given fields based on whether web or mobile or both events are enabled.



<h4>Arguments</h4>

- `web` *(string)*: The field definition for web events
- `mobile` *(string)*: The field definition for mobile events

<h4>Returns</h4>


The query path for the field.

<h4>Usage</h4>


```sql
select
    ...,
    {{ web_or_mobile_field(
      web='a.contexts_com_snowplowanalytics_snowplow_web_page_1_0_0[safe_offset(0)].id',
      mobile={'field': 'id', 'col_prefix': 'contexts_com_snowplowanalytics_mobile_screen_1_' }
    ) }} as page_view_id,
    from {{ var('snowplow__events') }} as a
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/snowplow_media_player_base_events_this_run/web_or_mobile_field.sql">Source</a></i></b></center>

```jinja2
{% macro web_or_mobile_field(web, mobile) %}
    coalesce(
      {% if var("snowplow__enable_web_events") -%}
        {{ field(web) }}
      {%- else -%}
        {% if web is string and target.type not in ['postgres', 'redshift'] -%}
          {{ web }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ web.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %},
      {% if var("snowplow__enable_mobile_events") -%}
        {{ field(mobile) }}
      {%- else -%}
        {% if mobile is string and target.type not in ['postgres', 'redshift'] -%}
          {{ mobile }}
        {% elif target.type not in ['postgres', 'redshift'] %}
          cast(null as {{ mobile.get('dtype', 'string') }})
        {%- else -%}
          null
        {% endif %}
      {%- endif %}
    )
{% endmacro %}
```

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_media_player.field](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/macros/index.md#macro.snowplow_media_player.field)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_media_player.snowplow_media_player_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

