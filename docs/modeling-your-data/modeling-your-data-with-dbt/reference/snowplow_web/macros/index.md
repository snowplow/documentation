---
title: "Snowplow Web Macros"
description: Reference for snowplow_web dbt macros developed by Snowplow
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
## Snowplow Web
### Allow Refresh {#macro.snowplow_web.allow_refresh}

<DbtDetails><summary>
<code>macros/allow_refresh.sql</code>
</summary>

<h4>Description</h4>

This macro is used to determine if a full-refresh is allowed (depending on the environment), using the `snowplow__allow_refresh` variable.



<h4>Returns</h4>

`snowplow__allow_refresh` if environment is not `dev`, `none` otherwise.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/allow_refresh.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_web')()) }}
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

- [model.snowplow_web.snowplow_web_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_quarantined_sessions)
- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)
- [model.snowplow_web.snowplow_web_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Consent Fields {#macro.snowplow_web.consent_fields}

<DbtDetails><summary>
<code>macros/bigquery/consent_fields.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/consent_fields.sql">Source</a></i></b></center>

```jinja2
{% macro consent_fields() %}

  {% set consent_fields = [
      {'field': 'event_type', 'dtype': 'string'},
      {'field': 'basis_for_processing', 'dtype': 'string'},
      {'field': 'consent_url', 'dtype': 'string'},
      {'field': 'consent_version', 'dtype': 'string'},
      {'field': 'consent_scopes', 'dtype': 'string'},
      {'field': 'domains_applied', 'dtype': 'string'},
      {'field': 'gdpr_applies', 'dtype': 'string'}
    ] %}

  {{ return(consent_fields) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_consent_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Filter Bots {#macro.snowplow_web.filter_bots}

<DbtDetails><summary>
<code>macros/filter_bots.sql</code>
</summary>

<h4>Description</h4>

This macro is used to generate a warehouse specific filter for the `useragent` field to remove bots from processing, or to overwrite for custom filtering. The filter excludes any of the following in the string:
- bot
- crawl
- slurp
- spider
- archiv
- spinn
- sniff
- seo
- audit
- survey
- pingdom
- worm
- capture
- (browser|screen)shots
- analyz
- index
- thumb
- check
- facebook
- PingdomBot
- PhantomJS
- YandexBot
- Twitterbot
- a_archiver
- facebookexternalhit
- Bingbot
- BingPreview
- Googlebot
- Baiduspider
- 360(Spider|User-agent)
- semalt



<h4>Arguments</h4>

- `table_alias` *(string)*: (Optional) the table alias to identify the useragent column from. Default none

<h4>Returns</h4>


A filter on `useragent` to exclude those with strings matching the above list.

<h4>Usage</h4>


```sql
select
...
from
...
where 1=1
filter_bots()

-- returns (snowflake)
select
...
from
...
where 1=1
and not rlike(useragent, '.*(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt).*')
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/filter_bots.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro filter_bots(table_alias = none) %}
  {{ return(adapter.dispatch('filter_bots', 'snowplow_web')(table_alias)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__filter_bots(table_alias = none) %}
  and not regexp_contains({% if table_alias %}{{table_alias~'.'}}{% endif %}useragent, '(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)')
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__filter_bots(table_alias = none) %}
  and {% if table_alias %}{{table_alias~'.'}}{% endif %}useragent not similar to '%(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt)%'
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__filter_bots(table_alias = none) %}
  and not rlike({% if table_alias %}{{table_alias~'.'}}{% endif %}useragent, '.*(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt).*')
{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__filter_bots(table_alias = none) %}
  and not rlike({% if table_alias %}{{table_alias~'.'}}{% endif %}useragent, '.*(bot|crawl|slurp|spider|archiv|spinn|sniff|seo|audit|survey|pingdom|worm|capture|(browser|screen)shots|analyz|index|thumb|check|facebook|PingdomBot|PhantomJS|YandexBot|Twitterbot|a_archiver|facebookexternalhit|Bingbot|BingPreview|Googlebot|Baiduspider|360(Spider|User-agent)|semalt).*')
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_view_events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_view_events)
- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Iab Context Fields {#macro.snowplow_web.get_iab_context_fields}

<DbtDetails><summary>
<code>macros/get_context_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to extract the fields from the iab enrichment context for each warehouse.



<h4>Arguments</h4>

- `table_prefix` *(string)*: (Optional) Table alias to prefix the column selection with. Default none

<h4>Returns</h4>


The sql to extract the columns from the iab context, or these columns as nulls.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/get_context_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_iab_context_fields(table_prefix = none) %}
    {{ return(adapter.dispatch('get_iab_context_fields', 'snowplow_web')(table_prefix)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_iab_context_fields(table_prefix = none) %}
    {% if execute %}
        {% do exceptions.raise_compiler_error('get_iab_context_fields is not defined for bigquery, please use snowplow_utils.get_optional_fields instead') %}
    {% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_iab_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_iab', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}category,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}primary_impact,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}reason,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}spider_or_robot
    {%- else -%}
        cast(null as {{ snowplow_utils.type_max_string() }}) as category,
        cast(null as {{ snowplow_utils.type_max_string() }}) as primary_impact,
        cast(null as {{ snowplow_utils.type_max_string() }}) as reason,
        cast(null as boolean) as spider_or_robot
    {%- endif -%}
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__get_iab_context_fields(table_prefix = none) %}

    {%- if var('snowplow__enable_iab', false) %}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0]:category::VARCHAR as category,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0]:primaryImpact::VARCHAR as primary_impact,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0]:reason::VARCHAR as reason,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0]:spiderOrRobot::BOOLEAN as spider_or_robot
    {%- else -%}
        cast(null as {{ type_string() }}) as category,
        cast(null as {{ type_string() }}) as primary_impact,
        cast(null as {{ type_string() }}) as reason,
        cast(null as boolean) as spider_or_robot
    {%- endif -%}
{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_iab_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_iab', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0].category::STRING as category,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0].primary_impact::STRING as primary_impact,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0].reason::STRING as reason,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_iab_snowplow_spiders_and_robots_1[0].spider_or_robot::BOOLEAN as spider_or_robot
    {%- else -%}
        cast(null as {{ type_string() }}) as category,
        cast(null as {{ type_string() }}) as primary_impact,
        cast(null as {{ type_string() }}) as reason,
        cast(null as boolean) as spider_or_robot
    {%- endif -%}
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Ua Context Fields {#macro.snowplow_web.get_ua_context_fields}

<DbtDetails><summary>
<code>macros/get_context_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to extract the fields from the ua enrichment context for each warehouse.



<h4>Arguments</h4>

- `table_prefix` *(string)*: (Optional) Table alias to prefix the column selection with. Default none

<h4>Returns</h4>


The sql to extract the columns from the ua context, or these columns as nulls.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/get_context_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_ua_context_fields(table_prefix = none) %}
    {{ return(adapter.dispatch('get_ua_context_fields', 'snowplow_web')(table_prefix)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_ua_context_fields(table_prefix = none) %}
    {% if execute %}
        {% do exceptions.raise_compiler_error('get_ua_context_fields is not defined for bigquery, please use snowplow_utils.get_optional_fields instead') %}
    {% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_ua_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_ua', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}useragent_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}useragent_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}useragent_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}useragent_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}useragent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_patch_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}os_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}device_family
    {%- else -%}
        cast(null as {{ snowplow_utils.type_max_string() }}) as useragent_family,
        cast(null as {{ snowplow_utils.type_max_string() }}) as useragent_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as useragent_minor,
        cast(null as {{ snowplow_utils.type_max_string() }}) as useragent_patch,
        cast(null as {{ snowplow_utils.type_max_string() }}) as useragent_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_family,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_minor,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_patch,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_patch_minor,
        cast(null as {{ snowplow_utils.type_max_string() }}) as os_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as device_family
    {%- endif -%}
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__get_ua_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_ua', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:useragentFamily::VARCHAR as useragent_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:useragentMajor::VARCHAR as useragent_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:useragentMinor::VARCHAR as useragent_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:useragentPatch::VARCHAR as useragent_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:useragentVersion::VARCHAR as useragent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osFamily::VARCHAR as os_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osMajor::VARCHAR as os_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osMinor::VARCHAR as os_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osPatch::VARCHAR as os_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osPatchMinor::VARCHAR as os_patch_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:osVersion::VARCHAR as os_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0]:deviceFamily::VARCHAR as device_family
    {%- else -%}
        cast(null as {{ type_string() }}) as useragent_family,
        cast(null as {{ type_string() }}) as useragent_major,
        cast(null as {{ type_string() }}) as useragent_minor,
        cast(null as {{ type_string() }}) as useragent_patch,
        cast(null as {{ type_string() }}) as useragent_version,
        cast(null as {{ type_string() }}) as os_family,
        cast(null as {{ type_string() }}) as os_major,
        cast(null as {{ type_string() }}) as os_minor,
        cast(null as {{ type_string() }}) as os_patch,
        cast(null as {{ type_string() }}) as os_patch_minor,
        cast(null as {{ type_string() }}) as os_version,
        cast(null as {{ type_string() }}) as device_family
    {% endif %}

{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_ua_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_ua', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].useragent_family::STRING as useragent_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].useragent_major::STRING as useragent_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].useragent_minor::STRING as useragent_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].useragent_patch::STRING as useragent_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].useragent_version::STRING as useragent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_family::STRING as os_family,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_major::STRING as os_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_minor::STRING as os_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_patch::STRING as os_patch,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_patch_minor::STRING as os_patch_minor,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].os_version::STRING as os_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_com_snowplowanalytics_snowplow_ua_parser_context_1[0].device_family::STRING as device_family
    {%- else -%}
        cast(null as {{ type_string() }}) as useragent_family,
        cast(null as {{ type_string() }}) as useragent_major,
        cast(null as {{ type_string() }}) as useragent_minor,
        cast(null as {{ type_string() }}) as useragent_patch,
        cast(null as {{ type_string() }}) as useragent_version,
        cast(null as {{ type_string() }}) as os_family,
        cast(null as {{ type_string() }}) as os_major,
        cast(null as {{ type_string() }}) as os_minor,
        cast(null as {{ type_string() }}) as os_patch,
        cast(null as {{ type_string() }}) as os_patch_minor,
        cast(null as {{ type_string() }}) as os_version,
        cast(null as {{ type_string() }}) as device_family
    {%- endif -%}
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Get Yauaa Context Fields {#macro.snowplow_web.get_yauaa_context_fields}

<DbtDetails><summary>
<code>macros/get_context_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to extract the fields from the yauaa enrichment context for each warehouse.



<h4>Arguments</h4>

- `table_prefix` *(string)*: (Optional) Table alias to prefix the column selection with. Default none

<h4>Returns</h4>


The sql to extract the columns from the yauaa context, or these columns as nulls.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/get_context_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro get_yauaa_context_fields(table_prefix = none) %}
    {{ return(adapter.dispatch('get_yauaa_context_fields', 'snowplow_web')(table_prefix)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__get_yauaa_context_fields(table_prefix = none) %}
    {% if execute %}
        {% do exceptions.raise_compiler_error('get_yauaa_context_fields is not defined for bigquery, please use snowplow_utils.get_optional_fields instead') %}
    {% endif %}
{% endmacro %}
```

</TabItem>
<TabItem value="postgres" label="postgres">

```jinja2
{% macro postgres__get_yauaa_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_yauaa', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}device_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}agent_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}device_brand,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}device_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}device_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}layout_engine_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}operating_system_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}operating_system_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}operating_system_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}operating_system_version
    {%- else -%}
        cast(null as {{ snowplow_utils.type_max_string() }}) as device_class,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_class,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_name,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_name_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_name_version_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as agent_version_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as device_brand,
        cast(null as {{ snowplow_utils.type_max_string() }}) as device_name,
        cast(null as {{ snowplow_utils.type_max_string() }}) as device_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_class,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_name,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_name_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_name_version_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as layout_engine_version_major,
        cast(null as {{ snowplow_utils.type_max_string() }}) as operating_system_class,
        cast(null as {{ snowplow_utils.type_max_string() }}) as operating_system_name,
        cast(null as {{ snowplow_utils.type_max_string() }}) as operating_system_name_version,
        cast(null as {{ snowplow_utils.type_max_string() }}) as operating_system_version
    {%- endif -%}
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__get_yauaa_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_yauaa', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:deviceClass::VARCHAR as device_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentClass::VARCHAR as agent_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentName::VARCHAR as agent_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentNameVersion::VARCHAR as agent_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentNameVersionMajor::VARCHAR as agent_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentVersion::VARCHAR as agent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:agentVersionMajor::VARCHAR as agent_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:deviceBrand::VARCHAR as device_brand,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:deviceName::VARCHAR as device_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:deviceVersion::VARCHAR as device_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineClass::VARCHAR as layout_engine_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineName::VARCHAR as layout_engine_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineNameVersion::VARCHAR as layout_engine_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineNameVersionMajor::VARCHAR as layout_engine_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineVersion::VARCHAR as layout_engine_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:layoutEngineVersionMajor::VARCHAR as layout_engine_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:operatingSystemClass::VARCHAR as operating_system_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:operatingSystemName::VARCHAR as operating_system_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:operatingSystemNameVersion::VARCHAR as operating_system_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0]:operatingSystemVersion::VARCHAR as operating_system_version
    {%- else -%}
        cast(null as {{ type_string() }}) as device_class,
        cast(null as {{ type_string() }}) as agent_class,
        cast(null as {{ type_string() }}) as agent_name,
        cast(null as {{ type_string() }}) as agent_name_version,
        cast(null as {{ type_string() }}) as agent_name_version_major,
        cast(null as {{ type_string() }}) as agent_version,
        cast(null as {{ type_string() }}) as agent_version_major,
        cast(null as {{ type_string() }}) as device_brand,
        cast(null as {{ type_string() }}) as device_name,
        cast(null as {{ type_string() }}) as device_version,
        cast(null as {{ type_string() }}) as layout_engine_class,
        cast(null as {{ type_string() }}) as layout_engine_name,
        cast(null as {{ type_string() }}) as layout_engine_name_version,
        cast(null as {{ type_string() }}) as layout_engine_name_version_major,
        cast(null as {{ type_string() }}) as layout_engine_version,
        cast(null as {{ type_string() }}) as layout_engine_version_major,
        cast(null as {{ type_string() }}) as operating_system_class,
        cast(null as {{ type_string() }}) as operating_system_name,
        cast(null as {{ type_string() }}) as operating_system_name_version,
        cast(null as {{ type_string() }}) as operating_system_version
    {%- endif -%}
{% endmacro %}
```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__get_yauaa_context_fields(table_prefix = none) %}
    {%- if var('snowplow__enable_yauaa', false) -%}
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].device_class::STRING as device_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_class::STRING as agent_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_name::STRING as agent_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_name_version::STRING as agent_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_name_version_major::STRING as agent_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_version::STRING as agent_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].agent_version_major::STRING as agent_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].device_brand::STRING as device_brand,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].device_name::STRING as device_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].device_version::STRING as device_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_class::STRING as layout_engine_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_name::STRING as layout_engine_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_name_version::STRING as layout_engine_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_name_version_major::STRING as layout_engine_name_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_version::STRING as layout_engine_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].layout_engine_version_major::STRING as layout_engine_version_major,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].operating_system_class::STRING as operating_system_class,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].operating_system_name::STRING as operating_system_name,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].operating_system_name_version::STRING as operating_system_name_version,
        {% if table_prefix %}{{ table_prefix~"." }}{% endif %}contexts_nl_basjes_yauaa_context_1[0].operating_system_version::STRING as operating_system_version
    {%- else -%}
        cast(null as {{ type_string() }}) as device_class,
        cast(null as {{ type_string() }}) as agent_class,
        cast(null as {{ type_string() }}) as agent_name,
        cast(null as {{ type_string() }}) as agent_name_version,
        cast(null as {{ type_string() }}) as agent_name_version_major,
        cast(null as {{ type_string() }}) as agent_version,
        cast(null as {{ type_string() }}) as agent_version_major,
        cast(null as {{ type_string() }}) as device_brand,
        cast(null as {{ type_string() }}) as device_name,
        cast(null as {{ type_string() }}) as device_version,
        cast(null as {{ type_string() }}) as layout_engine_class,
        cast(null as {{ type_string() }}) as layout_engine_name,
        cast(null as {{ type_string() }}) as layout_engine_name_version,
        cast(null as {{ type_string() }}) as layout_engine_name_version_major,
        cast(null as {{ type_string() }}) as layout_engine_version,
        cast(null as {{ type_string() }}) as layout_engine_version_major,
        cast(null as {{ type_string() }}) as operating_system_class,
        cast(null as {{ type_string() }}) as operating_system_name,
        cast(null as {{ type_string() }}) as operating_system_name_version,
        cast(null as {{ type_string() }}) as operating_system_version
    {%- endif -%}
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.type_string
- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Iab Fields {#macro.snowplow_web.iab_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate field and type mapping for use in `snowplow_utils.get_optional_fields`.



<h4>Returns</h4>


The specific fields and their type for the context (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">Source</a></i></b></center>

```jinja2
{% macro iab_fields() %}
  
  {% set iab_fields = [
      {'field':'category', 'dtype':'string'},
      {'field':'primary_impact', 'dtype':'string'},
      {'field':'reason', 'dtype':'string'},
      {'field':'spider_or_robot', 'dtype':'boolean'}
    ] %}

  {{ return(iab_fields) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Stitch User Identifiers {#macro.snowplow_web.stitch_user_identifiers}

<DbtDetails><summary>
<code>macros/stitch_user_identifiers.sql</code>
</summary>

<h4>Description</h4>

This macro is used as a post-hook on the sessions table to stitch user identities using the user_mapping table provided.



<h4>Arguments</h4>

- `enabled` *(boolean)*: If the user stitching should be done or not
- `relation` *(string)*: (Optional) The model to update the `stitched_user_id` column in. Default `this`
- `user_mapping_relation` *(string)*: (Optional) The model to use the `user_id` column from. Default `snowplow_web_user_mapping`

<h4>Returns</h4>


The update/merge statement to update the `stitched_user_id` column, if enabled.


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/stitch_user_identifiers.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro stitch_user_identifiers(enabled, relation=this, user_mapping_relation='snowplow_web_user_mapping') %}
    {{ return(adapter.dispatch('stitch_user_identifiers', 'snowplow_web')(enabled, relation, user_mapping_relation)) }}
{%- endmacro -%}


```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__stitch_user_identifiers(enabled, relation=this, user_mapping_relation='snowplow_web_user_mapping') %}
    {% if enabled | as_bool() %}
      -- Update sessions table with mapping
      update {{ relation }} as s
      set stitched_user_id = um.user_id
      from {{ ref(user_mapping_relation) }} as um
      where s.domain_userid = um.domain_userid;
    {% endif %}
{%- endmacro -%}


```

</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__stitch_user_identifiers(enabled, relation=this, user_mapping_relation='snowplow_web_user_mapping') %}
    {% if enabled | as_bool() %}
      -- Update sessions table with mapping
      merge into {{ relation }} as s
      using {{ ref(user_mapping_relation) }} as um
      on s.domain_userid = um.domain_userid
      when matched then
      update set s.stitched_user_id = um.user_id;
    {% endif %}
{%- endmacro -%}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Ua Fields {#macro.snowplow_web.ua_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate field and type mapping for use in `snowplow_utils.get_optional_fields`.



<h4>Returns</h4>


The specific fields and their type for the context (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">Source</a></i></b></center>

```jinja2
{% macro ua_fields() %}
  
  {% set ua_fields = [
      {'field': 'useragent_family', 'dtype': 'string'},
      {'field': 'useragent_major', 'dtype': 'string'},
      {'field': 'useragent_minor', 'dtype': 'string'},
      {'field': 'useragent_patch', 'dtype': 'string'},
      {'field': 'useragent_version', 'dtype': 'string'},
      {'field': 'os_family', 'dtype': 'string'},
      {'field': 'os_major', 'dtype': 'string'},
      {'field': 'os_minor', 'dtype': 'string'},
      {'field': 'os_patch', 'dtype': 'string'},
      {'field': 'os_patch_minor', 'dtype': 'string'},
      {'field': 'os_version', 'dtype': 'string'},
      {'field': 'device_family', 'dtype': 'string'}
    ] %}

  {{ return(ua_fields) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Consent {#macro.snowplow_web.web_cluster_by_fields_consent}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate `cluster_by` fields for the table, depending on the warehouse target.



<h4>Returns</h4>


The specific fields for each warehouse (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro web_cluster_by_fields_consent() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_consent', 'snowplow_web')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_consent() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["event_id","domain_userid"], snowflake_val=["to_date(load_tstamp)"])) }}

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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_consent_log](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_consent_log)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Page Views {#macro.snowplow_web.web_cluster_by_fields_page_views}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate `cluster_by` fields for the table, depending on the warehouse target.



<h4>Returns</h4>


The specific fields for each warehouse (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro web_cluster_by_fields_page_views() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_page_views', 'snowplow_web')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_page_views() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["domain_userid","domain_sessionid"], snowflake_val=["to_date(start_tstamp)"])) }}

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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Sessions {#macro.snowplow_web.web_cluster_by_fields_sessions}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate `cluster_by` fields for the table, depending on the warehouse target.



<h4>Returns</h4>


The specific fields for each warehouse (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro web_cluster_by_fields_sessions() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_sessions', 'snowplow_web')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_sessions() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["domain_userid"], snowflake_val=["to_date(start_tstamp)"])) }}

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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Sessions Lifecycle {#macro.snowplow_web.web_cluster_by_fields_sessions_lifecycle}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate `cluster_by` fields for the table, depending on the warehouse target.



<h4>Returns</h4>


The specific fields for each warehouse (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro web_cluster_by_fields_sessions_lifecycle() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_sessions_lifecycle', 'snowplow_web')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_sessions_lifecycle() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["session_id"], snowflake_val=["to_date(start_tstamp)"])) }}

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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Web Cluster By Fields Users {#macro.snowplow_web.web_cluster_by_fields_users}

<DbtDetails><summary>
<code>macros/cluster_by_fields.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate `cluster_by` fields for the table, depending on the warehouse target.



<h4>Returns</h4>


The specific fields for each warehouse (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/cluster_by_fields.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro web_cluster_by_fields_users() %}

  {{ return(adapter.dispatch('web_cluster_by_fields_users', 'snowplow_web')()) }}

{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__web_cluster_by_fields_users() %}

  {{ return(snowplow_utils.get_value_by_target_type(bigquery_val=["user_id","domain_userid"], snowflake_val=["to_date(start_tstamp)"])) }}

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

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_users](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_users)

</TabItem>
</Tabs>
</DbtDetails>

### Yauaa Fields {#macro.snowplow_web.yauaa_fields}

<DbtDetails><summary>
<code>macros/bigquery/page_view_contexts.sql</code>
</summary>

<h4>Description</h4>

This macro is used to return the appropriate field and type mapping for use in `snowplow_utils.get_optional_fields`.



<h4>Returns</h4>


The specific fields and their type for the context (see macro code for values).


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-web/blob/main/macros/bigquery/page_view_contexts.sql">Source</a></i></b></center>

```jinja2
{% macro yauaa_fields() %}
  
  {% set yauaa_fields = [
      {'field': 'device_class', 'dtype': 'string'},
      {'field': 'agent_class', 'dtype': 'string'},
      {'field': 'agent_name', 'dtype': 'string'},
      {'field': 'agent_name_version', 'dtype': 'string'},
      {'field': 'agent_name_version_major', 'dtype': 'string'},
      {'field': 'agent_version', 'dtype': 'string'},
      {'field': 'agent_version_major', 'dtype': 'string'},
      {'field': 'device_brand', 'dtype': 'string'},
      {'field': 'device_name', 'dtype': 'string'},
      {'field': 'device_version', 'dtype': 'string'},
      {'field': 'layout_engine_class', 'dtype': 'string'},
      {'field': 'layout_engine_name', 'dtype': 'string'},
      {'field': 'layout_engine_name_version', 'dtype': 'string'},
      {'field': 'layout_engine_name_version_major', 'dtype': 'string'},
      {'field': 'layout_engine_version', 'dtype': 'string'},
      {'field': 'layout_engine_version_major', 'dtype': 'string'},
      {'field': 'operating_system_class', 'dtype': 'string'},
      {'field': 'operating_system_name', 'dtype': 'string'},
      {'field': 'operating_system_name_version', 'dtype': 'string'},
      {'field': 'operating_system_version', 'dtype': 'string'}
    ] %}

  {{ return(yauaa_fields) }}

{% endmacro %}
```

</DbtDetails>


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_web.snowplow_web_page_views_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_page_views_this_run)
- [model.snowplow_web.snowplow_web_sessions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_web/models/index.md#model.snowplow_web.snowplow_web_sessions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

