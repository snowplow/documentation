---
title: "Snowplow Fractribution Macros"
description: Reference for snowplow_fractribution dbt macros developed by Snowplow
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
## Snowplow Fractribution
### Channel Classification {#macro.snowplow_fractribution.channel_classification}

<DbtDetails><summary>
<code>macros/channel_classification.sql</code>
</summary>

#### Description
A macro used to perform channel classifications. Each channel should be classified a name that is a valid field name as it will be used for that purpose, once unnested downstream.



#### Returns

A sql of case statements that determine which channel is classified (it is most likely unique to each organisation, the sample provided is based on Google's Fractribution).

Example:
```sql
    case when lower(mkt_medium) in ('cpc', 'ppc') and regexp_count(lower(mkt_campaign), 'brand') > 0 then 'Paid_Search_Brand'
         when lower(mkt_medium) in ('cpc', 'ppc') and regexp_count(lower(mkt_campaign), 'generic') > 0 then 'Paid_Search_Generic'
         when lower(mkt_medium) in ('cpc', 'ppc') and not regexp_count(lower(mkt_campaign), 'brand|generic') > 0 then 'Paid_Search_Other'
         when lower(mkt_medium) = 'organic' then 'Organic_Search'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and regexp_count(lower(mkt_campaign), 'prospect') > 0 then 'Display_Prospecting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and regexp_count(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Display_Retargeting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and not regexp_count(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Display_Other'
         when regexp_count(lower(mkt_campaign), 'video|youtube') > 0 or regexp_count(lower(mkt_source), 'video|youtube') > 0 then 'Video'
         when lower(mkt_medium) = 'social' and regexp_count(lower(mkt_campaign), 'prospect') > 0 then 'Paid_Social_Prospecting'
         when lower(mkt_medium) = 'social' and regexp_count(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Paid_Social_Retargeting'
         when lower(mkt_medium) = 'social' and not regexp_count(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Paid_Social_Other'
         when mkt_source = '(direct)' then 'Direct'
         when lower(mkt_medium) = 'referral' then 'Referral'
         when lower(mkt_medium) = 'email' then 'Email'
         when lower(mkt_medium) in ('cpc', 'ppc', 'cpv', 'cpa', 'affiliates') then 'Other_Advertising'
         else 'Unmatched_Channel'
    end
```

#### Usage

```sql

select {{ channel_classification() }} as channel,

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_classification.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro channel_classification() %}
    {{ return(adapter.dispatch('channel_classification', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__channel_classification() %}

    case when lower(mkt_medium) in ('cpc', 'ppc') and array_length(regexp_extract_all(lower(mkt_campaign), 'brand')) > 0 then 'Paid_Search_Brand'
         when lower(mkt_medium) in ('cpc', 'ppc') and array_length(regexp_extract_all(lower(mkt_campaign), 'generic')) > 0 then 'Paid_Search_Generic'
         when lower(mkt_medium) in ('cpc', 'ppc') and not array_length(regexp_extract_all(lower(mkt_campaign), 'brand|generic')) > 0 then 'Paid_Search_Other'
         when lower(mkt_medium) = 'organic' then 'Organic_Search'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and array_length(regexp_extract_all(lower(mkt_campaign), 'prospect')) > 0 then 'Display_Prospecting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and array_length(regexp_extract_all(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing')) > 0 then 'Display_Retargeting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and not array_length(regexp_extract_all(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing')) > 0 then 'Display_Other'
         when array_length(regexp_extract_all(lower(mkt_campaign), 'video|youtube')) > 0 or array_length(regexp_extract_all(lower(mkt_source), 'video|youtube')) > 0 then 'Video'
         when lower(mkt_medium) = 'social' and array_length(regexp_extract_all(lower(mkt_campaign), 'prospect')) > 0 then 'Paid_Social_Prospecting'
         when lower(mkt_medium) = 'social' and array_length(regexp_extract_all(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing')) > 0 then 'Paid_Social_Retargeting'
         when lower(mkt_medium) = 'social' and not array_length(regexp_extract_all(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing')) > 0 then 'Paid_Social_Other'
         when mkt_source = '(direct)' then 'Direct'
         when lower(mkt_medium) = 'referral' then 'Referral'
         when lower(mkt_medium) = 'email' then 'Email'
         when lower(mkt_medium) in ('cpc', 'ppc', 'cpv', 'cpa', 'affiliates') then 'Other_Advertising'
         else 'Unmatched_Channel'
    end

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__channel_classification() %}

    case when lower(mkt_medium) in ('cpc', 'ppc') and regexp_count(lower(mkt_campaign), 'brand') > 0 then 'Paid_Search_Brand'
         when lower(mkt_medium) in ('cpc', 'ppc') and regexp_count(lower(mkt_campaign), 'generic') > 0 then 'Paid_Search_Generic'
         when lower(mkt_medium) in ('cpc', 'ppc') and not regexp_count(lower(mkt_campaign), 'brand|generic') > 0 then 'Paid_Search_Other'
         when lower(mkt_medium) = 'organic' then 'Organic_Search'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and regexp_count(lower(mkt_campaign), 'prospect') > 0 then 'Display_Prospecting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and regexp_count(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Display_Retargeting'
         when lower(mkt_medium) in ('display', 'cpm', 'banner') and not regexp_count(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Display_Other'
         when regexp_count(lower(mkt_campaign), 'video|youtube') > 0 or regexp_count(lower(mkt_source), 'video|youtube') > 0 then 'Video'
         when lower(mkt_medium) = 'social' and regexp_count(lower(mkt_campaign), 'prospect') > 0 then 'Paid_Social_Prospecting'
         when lower(mkt_medium) = 'social' and regexp_count(lower(mkt_campaign), 'retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Paid_Social_Retargeting'
         when lower(mkt_medium) = 'social' and not regexp_count(lower(mkt_campaign), 'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0 then 'Paid_Social_Other'
         when mkt_source = '(direct)' then 'Direct'
         when lower(mkt_medium) = 'referral' then 'Referral'
         when lower(mkt_medium) = 'email' then 'Email'
         when lower(mkt_medium) in ('cpc', 'ppc', 'cpv', 'cpa', 'affiliates') then 'Other_Advertising'
         else 'Unmatched_Channel'
    end

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Channel Spend {#macro.snowplow_fractribution.channel_spend}

<DbtDetails><summary>
<code>macros/channel_spend.sql</code>
</summary>

#### Description
A macro for the user to overwrite it with a sql script to extract total ad spend by channel.

 -- Example (simplified) query:

  select
    channel,
    sum(spend_usd) as spend
  from example_spend_table
  group by 1

  -- Example table output for the user-supplied SQL:

  Channel     |  Spend
 ------------------------
  direct      |  1050.02
  paid_search |  10490.11
  etc...



#### Returns

A sql script to extract channel and corresponding spend values from a data source.


#### Usage

```sql

{{ channel_spend() }}

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_spend.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro channel_spend() %}
    {{ return(adapter.dispatch('channel_spend', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__channel_spend() %}

  with channels as (

      select
        1 as id,
        array_agg(distinct cast(channel as {{ dbt.type_string() }})) as c

      from {{ ref('snowplow_fractribution_channel_counts') }}
  )

  , unnesting as (

      {{ snowplow_utils.unnest('id', 'c', 'channel', 'channels') }}
  )

  select
    channel,
    10000 as spend

  from unnesting

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.type_string
- [macro.snowplow_utils.unnest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.unnest)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_spend)

</TabItem>
</Tabs>
</DbtDetails>

### Conversion Clause {#macro.snowplow_fractribution.conversion_clause}

<DbtDetails><summary>
<code>macros/conversion_clause.sql</code>
</summary>

#### Description
A macro to let users specify how to filter on conversion events.



#### Returns

A sql to be used in a WHERE clause to filter on conversion events.

#### Usage

```sql
where {{ conversion_clause() }}

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_clause.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro conversion_clause() %}
    {{ return(adapter.dispatch('conversion_clause', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__conversion_clause() %}
    tr_total > 0
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Conversion Value {#macro.snowplow_fractribution.conversion_value}

<DbtDetails><summary>
<code>macros/conversion_value.sql</code>
</summary>

#### Description
A user defined macro that specifies either a single column or a calculated value that represents the value associated with the conversion.



#### Returns

A sql to be used to refer to the conversion value.

#### Usage

```sql

select {{ conversion_value() }} as revenue

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_value.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro conversion_value() %}
    {{ return(adapter.dispatch('conversion_value', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__conversion_value() %}
    tr_total
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Create Udfs {#macro.snowplow_fractribution.create_udfs}

<DbtDetails><summary>
<code>macros/path_transformations/create_udfs.sql</code>
</summary>

#### Description
Creates user defined functions for adapters apart from Databricks. It is executed as part of an on-start hook.



#### Returns

Nothing, sql is executed which creates the UDFs in the target database and schema.

#### Usage

```yml
-- dbt_project.yml
...
on-run-start: "{{ create_udfs() }}"
...

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/create_udfs.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro create_udfs() %}
  {{ return(adapter.dispatch('create_udfs', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="bigquery" label="bigquery">

```jinja2
{% macro bigquery__create_udfs() %}

  {% set trim_long_path %}
  -- Returns the last snowplow__path_lookback_steps channels in the path if snowplow__path_lookback_steps > 0,
  -- or the full path otherwise.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.trim_long_path(path ARRAY<string>, snowplow__path_lookback_steps INTEGER)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
  if (snowplow__path_lookback_steps > 0) {
      return path.slice(Math.max(0, path.length - snowplow__path_lookback_steps));
    }
    return path;
  """;
  {% endset %}

  -- Functions for applying transformations to path arrays.
  -- unique_path: Identity transform.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  -- exposure_path: Collapse sequential repeats.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  -- first_path: Removes repeated events.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  -- frequency_path: Removes repeat events but tracks them with a count.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)).
  -- remove_if_last_and_not_all: requires a channel to be added as a parameter, which gets removed from the latest paths unless it removes the whole path as it is trying to reach a non-matching channel parameter
  --   E.g target element: `A`, path: `A → B → A → A` becomes `A → B`
  -- remove_if_not_all: requires a channel to be added as a parameter, which gets removed from the path altogether unless it would result in the whole path's removal.
  --   E.g target element: `A`, path: `A → B → A → A` becomes `B`


  {% set remove_if_not_all %}
  -- Returns the path with all copies of targetElem removed, unless the path consists only of
  -- targetElems, in which case the original path is returned.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.remove_if_not_all(path ARRAY<string>, targetElem STRING)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    var transformedPath = [];
    for (var i = 0; i < path.length; i++) {
      if (path[i] !== targetElem) {
        transformedPath.push(path[i]);
      }
    }
    if (!transformedPath.length) {
      return path;
    }
    return transformedPath;
  """;
  {% endset %}

  {% set remove_if_last_and_not_all %}
  -- Returns the path with all copies of targetElem removed from the tail, unless the path consists
  -- only of targetElems, in which case the original path is returned.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.remove_if_last_and_not_all(path ARRAY<string>, targetElem STRING)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    var tailIndex = path.length;
    for (var i = path.length - 1; i >= 0; i = i - 1) {
      if (path[i] != targetElem) {
        break;
      }
      tailIndex = i;
    }
    if (tailIndex > 0) {
      return path.slice(0, tailIndex);
    }
    return path;
  """;
  {% endset %}

  {% set unique %}
  -- Returns the unique/identity transform of the given path array.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.unique_path(path ARRAY<string>)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    return path;
  """;
  {% endset %}

  {% set exposure %}
  -- Returns the exposure transform of the given path array.
  -- Sequential duplicates are collapsed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.exposure_path(path ARRAY<string>)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    var transformedPath = [];
    for (var i = 0; i < path.length; i++) {
      if (i == 0 || path[i] != path[i-1]) {
        transformedPath.push(path[i]);
      }
    }
    return transformedPath;
  """;
  {% endset %}

  {% set first %}
  -- Returns the first transform of the given path array.
  -- Repeated channels are removed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.first_path(path ARRAY<string>)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    var transformedPath = [];
    var channelSet = new Set();
    for (const channel of path) {
      if (!channelSet.has(channel)) {
        transformedPath.push(channel);
        channelSet.add(channel)
      }
    }
    return transformedPath;
  """;
  {% endset %}

  {% set frequency %}
  -- Returns the frequency transform of the given path array.
  -- Repeat events are removed, but tracked with a count.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.frequency_path(path ARRAY<string>)
  RETURNS ARRAY<string>
  LANGUAGE js
  as r"""
    var channelToCount = {};
    for (const channel of path) {
      if (!(channel in channelToCount)) {
        channelToCount[channel] = 1
      } else {
        channelToCount[channel] +=1
      }
    }
    var transformedPath = [];
    for (const channel of path) {
      count = channelToCount[channel];
      if (count > 0) {
        transformedPath.push(channel + '(' + count.toString() + ')');
        // Reset count to 0, since the output has exactly one copy of each event.
        channelToCount[channel] = 0;
      }
    }
    return transformedPath;
  """;
  {% endset %}


  {% set create_schema %}
      create schema if not exists {{target.schema}};
  {% endset %}

  -- create the udfs (as permanent UDFs)
  {% do run_query(create_schema) %} -- run this FIRST before the rest get run
  {% do run_query(trim_long_path) %}
  {% do run_query(remove_if_not_all) %}
  {% do run_query(remove_if_last_and_not_all) %}
  {% do run_query(unique) %}
  {% do run_query(exposure) %}
  {% do run_query(first) %}
  {% do run_query(frequency) %}
  -- have to return some valid sql
  select 1;

{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__create_udfs() %}
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__create_udfs(schema_suffix = '_derived') %}

  {% set trim_long_path %}
  -- Returns the last snowplow__path_lookback_steps channels in the path if snowplow__path_lookback_steps > 0,
  -- or the full path otherwise.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.trim_long_path(path ARRAY, snowplow__path_lookback_steps DOUBLE)
  RETURNS ARRAY LANGUAGE JAVASCRIPT AS $$
  if (SNOWPLOW__PATH_LOOKBACK_STEPS > 0) {
      return PATH.slice(Math.max(0, PATH.length - SNOWPLOW__PATH_LOOKBACK_STEPS));
    }
    return PATH;
  $$;
  {% endset %}


  -- Functions for applying transformations to path arrays.
  -- unique_path: Identity transform.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  -- exposure_path: Collapse sequential repeats.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  -- first_path: Removes repeated events.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  -- frequency_path: Removes repeat events but tracks them with a count.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)).
  -- remove_if_last_and_not_all: requires a channel to be added as a parameter, which gets removed from the latest paths unless it removes the whole path as it is trying to reach a non-matching channel parameter
  --   E.g target element: `A`, path: `A → B → A → A` becomes `A → B`
  -- remove_if_not_all: requires a channel to be added as a parameter, which gets removed from the path altogether unless it would result in the whole path's removal.
  --   E.g target element: `A`, path: `A → B → A → A` becomes `B`

  {% set remove_if_not_all %}
  -- Returns the path with all copies of targetElem removed, unless the path consists only of
  -- targetElems, in which case the original path is returned.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.remove_if_not_all(path ARRAY, targetElem STRING)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    var transformedPath = [];
    for (var i = 0; i < PATH.length; i++) {
      if (PATH[i] !== TARGETELEM) {
        transformedPath.push(PATH[i]);
      }
    }
    if (!transformedPath.length) {
      return PATH;
    }
    return transformedPath;
  $$;
  {% endset %}

  {% set remove_if_last_and_not_all %}
  -- Returns the path with all copies of targetElem removed from the tail, unless the path consists
  -- only of targetElems, in which case the original path is returned.
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.remove_if_last_and_not_all(path ARRAY, targetElem STRING)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    var tailIndex = PATH.length;
    for (var i = PATH.length - 1; i >= 0; i = i - 1) {
      if (PATH[i] != TARGETELEM) {
        break;
      }
      tailIndex = i;
    }
    if (tailIndex > 0) {
      return PATH.slice(0, tailIndex);
    }
    return PATH;
  $$;
  {% endset %}

  {% set unique %}
  -- Returns the unique/identity transform of the given path array.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.unique_path(path ARRAY)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    return PATH;
  $$;
  {% endset %}

  {% set exposure %}
  -- Returns the exposure transform of the given path array.
  -- Sequential duplicates are collapsed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.exposure_path(path ARRAY)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    var transformedPath = [];
    for (var i = 0; i < PATH.length; i++) {
      if (i == 0 || PATH[i] != PATH[i-1]) {
        transformedPath.push(PATH[i]);
      }
    }
    return transformedPath;
  $$;
  {% endset %}

  {% set first %}
  -- Returns the first transform of the given path array.
  -- Repeated channels are removed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.first_path(path ARRAY)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    var transformedPath = [];
    var channelSet = new Set();
    for (const channel of PATH) {
      if (!channelSet.has(channel)) {
        transformedPath.push(channel);
        channelSet.add(channel)
      }
    }
    return transformedPath;
  $$;
  {% endset %}

  {% set frequency %}
  -- Returns the frequency transform of the given path array.
  -- Repeat events are removed, but tracked with a count.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)].
  CREATE FUNCTION IF NOT EXISTS {{target.schema}}.frequency_path(path ARRAY)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    var channelToCount = {};
    for (const channel of PATH) {
      if (!(channel in channelToCount)) {
        channelToCount[channel] = 1
      } else {
        channelToCount[channel] +=1
      }
    }
    var transformedPath = [];
    for (const channel of PATH) {
      count = channelToCount[channel];
      if (count > 0) {
        transformedPath.push(channel + '(' + count.toString() + ')');
        // Reset count to 0, since the output has exactly one copy of each event.
        channelToCount[channel] = 0;
      }
    }
    return transformedPath;
  $$;
  {% endset %}


  {% set create_schema %}
      create schema if not exists {{target.schema}};
  {% endset %}

  -- create the udfs (as permanent UDFs)
  {% do run_query(create_schema) %} -- run this FIRST before the rest get run
  {% do run_query(trim_long_path) %}
  {% do run_query(remove_if_not_all) %}
  {% do run_query(remove_if_last_and_not_all) %}
  {% do run_query(unique) %}
  {% do run_query(exposure) %}
  {% do run_query(first) %}
  {% do run_query(frequency) %}
  -- have to return some valid sql
  select 1;
{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__create_udfs() %}
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.run_query

</DbtDetails>

### Get Lookback Date Limits {#macro.snowplow_fractribution.get_lookback_date_limits}

<DbtDetails><summary>
<code>macros/get_lookback_date_limits.sql</code>
</summary>

#### Description
A macro returning the upper or lower boundary to limit what is processed by the sessions_by_customer_id model.



#### Arguments
- `limit_type` *(string)*: Can be either 'min' or 'max' depending on if the upper or lower boundary date needs to be returned

#### Returns

A string value of the upper or lower date limit.

#### Usage

A macro call with 'min' or 'max' given as a parameter.

```sql
select
  ...
from
  ...
where
  date(derived_tstamp) >= '{{ get_lookback_date_limits("min") }}'
  and date(derived_tstamp) <= '{{ get_lookback_date_limits("max") }}'

-- returns
select
  ...
from
  ...
where
  date(derived_tstamp) >= '2023-01-01 13:45:03'
  and date(derived_tstamp) <= '2023-02-01 10:32:52'
```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/get_lookback_date_limits.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro get_lookback_date_limits(limit_type) %}
  {{ return(adapter.dispatch('get_lookback_date_limits', 'snowplow_fractribution')(limit_type)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__get_lookback_date_limits(limit_type) %}

  -- check if web data is up-to-date

  {% set query %}
    select max(start_tstamp) < '{{ var('snowplow__conversion_window_end_date') }}' as is_over_limit,
           cast(min(start_tstamp) as date) > '{{ var("snowplow__conversion_window_start_date") }}' as is_below_limit,
           cast(max(start_tstamp) as {{ type_string() }}) as last_processed_page_view,
           cast(min(start_tstamp) as {{ type_string() }}) as first_processed_page_view
    from {{ var('snowplow__page_views_source') }}
  {% endset %}

  {% set result = run_query(query) %}

  {% if execute %}
    {% set page_view_max = result[0][0] %}
    {% set last_processed_page_view = result[0][2] %}
    {% if page_view_max == True %}
      {%- do exceptions.raise_compiler_error("Snowplow Error: the derived.page_view source does not cover the full fractribution analysis period.
                                              Please process your web model first before proceeding with this package. Details: snowplow__conversion_window_start_date "
                                              + var('snowplow__conversion_window_end_date') + " is later than last processed pageview " + last_processed_page_view) %}
    {% endif %}
    {% set page_view_min = result[0][1] %}
    {% set first_processed_page_view = result[0][3] %}
    {% if page_view_min == True %}
      {%- do exceptions.raise_compiler_error("Snowplow Error: the derived.page_view source does not cover the full fractribution analysis period.
                                              Please backfill / reprocess your web model first before proceeding with this package. Details: snowplow__conversion_window_start_date "
                                              + var('snowplow__conversion_window_start_date') + " is earlier than first processed pageview " + first_processed_page_view) %}
    {% endif %}
  {% endif %}


  {% set query %}
    {% if limit_type == 'min' %}
      with base as (select case when '{{ var("snowplow__conversion_window_start_date") }}' = ''
                  then {{ dbt.dateadd('day', -31, dbt.current_timestamp()) }}
                  else '{{ var("snowplow__conversion_window_start_date") }}'
                  end as min_date_time)
      select cast({{ dbt.dateadd('day', (- var('snowplow__path_lookback_days') + 1), 'min_date_time') }} as date) from base


    {% elif limit_type == 'max' %}
      with base as (select case when '{{ var("snowplow__conversion_window_start_date") }}' = ''
                  then {{ dbt.dateadd('day', -1, dbt.current_timestamp()) }}
                  else '{{ var("snowplow__conversion_window_end_date") }}'
                  end as max_date_time)
      select cast(max_date_time as date) from base
    {% else %}
    {% endif %}
  {% endset %}

  {% set query_result = run_query(query) %}

  {% if execute %}
    {% set result = query_result[0][0] %}
    {{ return(result) }}
  {% endif %}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.current_timestamp
- macro.dbt.dateadd
- macro.dbt.run_query
- [macro.snowplow_utils.type_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_string)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Path Transformation {#macro.snowplow_fractribution.path_transformation}

<DbtDetails><summary>
<code>macros/path_transformations/path_transformation.sql</code>
</summary>

#### Description
Macro to execute the indvidual path_transformation specified as a parameter.



#### Arguments
- `transformation_type` *(string)*: A type of transformation that needs to be executed E.g. 'unique_path'. Needs to be one of the following: exposure_path, first_path, frequency_path, remove_if_last_and_not_all, remove_if_not_all, unique_path More details here https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/#path-transform-options

- `transform_param` *(string)*: (Optional) The parameter value that the path transormation needs to execute,. Default none

#### Returns

The transformed array column.


#### Usage

```sql

{{ path_transformation('unique_path') }} as transformed_path

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/path_transformation.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro path_transformation(transformation_type, transform_param) %}
  {{ return(adapter.dispatch('path_transformation', 'snowplow_fractribution')(transformation_type, transform_param)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__path_transformation(transformation_type, transform_param) %}

    {{target.schema}}.{{transformation_type}}(

      transformed_path

    {% if transform_param %}, '{{transform_param}}' {% endif %}
    )

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__path_transformation(transformation_type, transform_param) %}

  {% if transformation_type == 'unique_path' %}
    transformed_path

  {% elif transformation_type == 'frequency_path' %}
    array_distinct(transform(transformed_path, element -> concat(element, "(", array_size(transformed_path)-array_size(array_remove(transformed_path, element )), ")" )))

  {% elif transformation_type == 'first_path' %}
    array_distinct(transformed_path)

  {% elif transformation_type == 'exposure_path' %}
    filter(transformed_path, (x, i) -> x != transformed_path[i-1] or i == 0)

  {% elif transformation_type == 'remove_if_not_all' %}
    case when array_distinct(transformed_path) != array('{{ transform_param }}')
    then array_remove(transformed_path, '{{ transform_param }}')
    else transformed_path end

  {% elif transformation_type == 'remove_if_last_and_not_all' %}
    /* remove the matching path(s) from the tail unless it removes everything (obtaining the upper boundary of the
    slicing to do this is done by slicing the array and determining if it only contains the desired references which
    it then returns an element for only if they are equivalent.) 
    Example:
        ["Example", "Another", "Direct", "Direct"]
        filter(y, (x, i) -> array_except(slice(reverse(y), 1, i), array('Direct'))==array())
        
        Slice 1 (i=1): Direct.
        array_except yields [] as our array only contains 'Direct' references, comparison yields True
        Slice 2 (i=2): Direct, Direct
        array_except yields [], comparison yields True
        Slice 3 (i=3): Direct, Direct, Another
        array_except yields [Another], comparison yields False (element does not become part of the array)
        Slice 4 (i=4): Direct, Direct, Another, Example
        array_except yields [Another, Example], comparison yields False (element does not become part of the array)
        
        At this point we can now count the size of this array - which gives us an index (from the back of the array) as to how many elements we can chop off - so to convert this to a an actual slice (as negative slicing sort of works in DB) we do:
        array_size(original) - array_size(direct_size) + 1
        4 - 2 + 1 = 3   
    */
    case when array_distinct(transformed_path) != array('{{ transform_param }}')
    then slice(transformed_path, 1, array_size(transformed_path) - array_size(
    filter(transformed_path, (x, i) -> array_except(slice(reverse(transformed_path), 1, i), array('{{ transform_param }}'))==array()) ) + 1)
    else transformed_path end

  {% else %}
    {%- do exceptions.raise_compiler_error("Snowplow Error: the path transform - '"+transformation_type+"' - is not yet supported for Databricks. Please choose from the following: exposure_path, first_path, frequency_path, remove_if_last_and_not_all, remove_if_not_all, unique_path") %}

  {% endif %}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)

</TabItem>
</Tabs>
</DbtDetails>

### Transform Paths {#macro.snowplow_fractribution.transform_paths}

<DbtDetails><summary>
<code>macros/path_transformations/transform_paths.sql</code>
</summary>

#### Description
Macro to remove complexity from models paths_to_conversion / paths_to_non_conversion.



#### Arguments
- `model_type` *(string)*: The macro only expects 'conversions' in case it runs in the path_to_conversions in which case it adds more fields
- `source_cte` *(string)*: The name of the cte to take as an input for the macro the build sql to

#### Returns

The sql with the missing cte's that take care of path transformations.

#### Usage

It is used by the transform_paths() macro for the transformation cte sql code build. It takes a transformation type as a parameter and its optional argument, if exists. The E.g.

```sql
with base_data as (...),

{{ transform_paths('conversions', 'base_data') }}

select * from path_transforms
```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/transform_paths.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro transform_paths(model_type, source_cte) %}
  {{ return(adapter.dispatch('transform_paths', 'snowplow_fractribution')(model_type, source_cte)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__transform_paths(model_type, source_cte) %}

  {% set allowed_path_transforms = ['exposure_path', 'first_path', 'frequency_path', 'remove_if_last_and_not_all', 'remove_if_not_all', 'unique_path'] %}

  , path_transforms as (

     select
        customer_id,
        {% if model_type == 'conversions' %}
        conversion_tstamp,
        revenue,
        {% endif %}
        {{ trim_long_path('path', var('snowplow__path_lookback_steps')) }} as path,

    {% if var('snowplow__path_transforms').items()|length > 0 %}

      -- reverse transormation due to nested functions, items to be processed from left to right
      {% for path_transform_name, _ in var('snowplow__path_transforms').items()|reverse %}
        {% if path_transform_name not in allowed_path_transforms %}
          {%- do exceptions.raise_compiler_error("Snowplow Error: the path transform - '"+path_transform_name+"' - is not supported. Please refer to the Snowplow docs on tagging. Please use one of the following: exposure_path, first_path, frequency_path, remove_if_last_and_not_all, remove_if_not_all, unique_path") %}
        {% endif %}
        {{target.schema}}.{{path_transform_name}}(
      {% endfor %}

      transformed_path
      -- no reverse needed due to nested nature of function calls
      {% for _, transform_param in var('snowplow__path_transforms').items() %}
        {% if transform_param %}, '{{transform_param}}' {% endif %}
        )
      {% endfor %}

      as transformed_path

    {% else %}
     transformed_path
    {% endif %}

  from {{ source_cte }}

  )

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__transform_paths(model_type, source_cte) %}

  {% set total_transformations = var('snowplow__path_transforms').items()|length %}
  -- set loop_count using namespace to define it as global variable for the loop to work
  {% set loop_count = namespace(value=1) %}

  -- unlike for adapters using UDFS, reverse transormation is not needed as ctes will process items their params in order
  {% for path_transform_name, transform_param in var('snowplow__path_transforms').items() %}

    {%- if loop_count.value == 1 %}
      {% set previous_cte = source_cte %}
    {% else %}
      {% set previous_cte = loop_count.value-1 %}
    {% endif %}

    , transformation_{{ loop_count.value|string }} as (

      select
        customer_id,
        {% if model_type == 'conversions' %}
        conversion_tstamp,
        revenue,
        {% endif %}
        path,
        {% if path_transform_name == 'unique_path' %}
          {{ path_transformation('unique_path') }} as transformed_path

        {% elif path_transform_name == 'frequency_path' %}
          {{ path_transformation('frequency_path', '') }} as transformed_path

        {% elif path_transform_name == 'first_path' %}
          {{ path_transformation('first_path') }} as transformed_path

        {% elif path_transform_name == 'exposure_path' %}
          {{ path_transformation('exposure_path', '') }} as transformed_path

        {% elif path_transform_name == 'remove_if_not_all' %}
          {{ path_transformation('remove_if_not_all', transform_param) }} as transformed_path

        {% elif path_transform_name == 'remove_if_last_and_not_all' %}
          {{ path_transformation('remove_if_last_and_not_all', transform_param) }} as transformed_path

        {% else %}
          {%- do exceptions.raise_compiler_error("Snowplow Error: the path transform - '"+path_transform_name+"' - is not supported. Please refer to the Snowplow docs on tagging. Please use one of the following: exposure_path, first_path, frequency_path, remove_if_last_and_not_all, remove_if_not_all, unique_path") %}
        {% endif %}

        {%- if loop_count.value == 1 %}
         from {{ source_cte }}
         )
        {% else %}
        -- build cte names dynamically based on loop count / previous_cte for the loop to work regardless of array items
         from transformation_{{ previous_cte|string }}
         )
        {% endif %}
        {% set previous_cte = loop_count.value %}
        {% set loop_count.value = loop_count.value + 1 %}


  {% endfor %}

  , path_transforms as (

    select
      customer_id,
      {% if model_type == 'conversions' %}
      conversion_tstamp,
      revenue,
      {% endif %}
      {{ trim_long_path('path', var('snowplow__path_lookback_steps')) }} as path,
      transformed_path

  -- the last cte will always equal to the total transformations unless there is no item there
  {% if total_transformations > 0 %}
    from transformation_{{ total_transformations }}

  {% else %}
    from {{ source_cte }}
  {% endif %}
  )

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_fractribution.path_transformation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.path_transformation)
- [macro.snowplow_fractribution.trim_long_path](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.trim_long_path)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
</Tabs>
</DbtDetails>

### Trim Long Path {#macro.snowplow_fractribution.trim_long_path}

<DbtDetails><summary>
<code>macros/path_transformations/trim_long_path.sql</code>
</summary>

#### Description
Returns the last 'snowplow__path_lookback_steps' number of channels in the path if snowplow__path_lookback_steps > 0, or the full path otherwise.



#### Arguments
- `array_column` *(string)*: The array column to be transformed
- `lookback_steps` *(integer)*: Defaulted to be taken from the snowplow__path_lookback_steps, the number of path to leave starting from the end

#### Returns

The transformed array column.


#### Usage

```sql

select
  ...
  {{ trim_long_path('path', var('snowplow__path_lookback_steps')) }} as path,
  ...
from
  ...

```


#### Details
<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/trim_long_path.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro trim_long_path(array_column, lookback_steps=var('snowplow__path_lookback_steps')) %}
  {{ return(adapter.dispatch('trim_long_path', 'snowplow_fractribution')(array_column,lookback_steps)) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__trim_long_path(array_column, lookback_steps=var('snowplow__path_lookback_steps')) %}

  {{ target.schema }}.trim_long_path({{ array_column }}, {{ lookback_steps }})

{% endmacro %}
```
</TabItem>
<TabItem value="spark" label="spark">

```jinja2
{% macro spark__trim_long_path(array_column, lookback_steps=var('snowplow__path_lookback_steps')) %}

  case when array_size({{ array_column }}) <= {{ lookback_steps }} then {{ array_column }}
  when {{ lookback_steps }} == 0 then {{ array_column }}
  else slice({{ array_column }}, (-cast( {{lookback_steps }} as int)), (cast({{ lookback_steps }} as int)))
  end

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="macros" label="Macros">

- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)

</TabItem>
</Tabs>
</DbtDetails>

