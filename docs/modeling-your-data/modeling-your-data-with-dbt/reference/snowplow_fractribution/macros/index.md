---
title: "Snowplow Fractribution Macros"
description: Reference for snowplow_fractribution dbt macros developed by Snowplow
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
## Snowplow Fractribution
### Channel Classification {#macro.snowplow_fractribution.channel_classification}

<DbtDetails><summary>
<code>macros/channel_classification.sql</code>
</summary>

#### Description
A macro used to perform channel classifications

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_classification.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro channel_classification() %}
    {{ return(adapter.dispatch('channel_classification', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__channel_classification() %}
    -- macro to perform channel classifications
    -- each channel should return a name that will also be a valid Snowflake column name
    -- by convention use underscores to separate
    -- (<251 characters, avoid spaces, leading numbers)

    CASE
        WHEN
            LOWER(mkt_medium) IN ('cpc', 'ppc')
            AND REGEXP_COUNT(LOWER(mkt_campaign), 'brand') > 0
            THEN 'Paid_Search_Brand'
        WHEN
            LOWER(mkt_medium) IN ('cpc', 'ppc')
            AND REGEXP_COUNT(LOWER(mkt_campaign), 'generic') > 0
            THEN 'Paid_Search_Generic'
        WHEN
            LOWER(mkt_medium) IN ('cpc', 'ppc')
            AND NOT REGEXP_COUNT(LOWER(mkt_campaign), 'brand|generic') > 0
            THEN 'Paid_Search_Other'
        WHEN LOWER(mkt_medium) = 'organic' THEN 'Organic_Search'
        WHEN
            LOWER(mkt_medium) IN ('display', 'cpm', 'banner')
            AND REGEXP_COUNT(LOWER(mkt_campaign), 'prospect') > 0
            THEN 'Display_Prospecting'
        WHEN
            LOWER(mkt_medium) IN ('display', 'cpm', 'banner')
            AND REGEXP_COUNT(
                LOWER(mkt_campaign),
                'retargeting|re-targeting|remarketing|re-marketing') > 0
            THEN 'Display_Retargeting'
        WHEN
            LOWER(mkt_medium) IN ('display', 'cpm', 'banner')
            AND NOT REGEXP_COUNT(
                LOWER(mkt_campaign),
                'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0
            THEN 'Display_Other'
        WHEN
            REGEXP_COUNT(LOWER(mkt_campaign), 'video|youtube') > 0
            OR REGEXP_COUNT(LOWER(mkt_source), 'video|youtube') > 0
            THEN 'Video'
        WHEN
            LOWER(mkt_medium) = 'social'
            AND REGEXP_COUNT(LOWER(mkt_campaign), 'prospect') > 0
            THEN 'Paid_Social_Prospecting'
        WHEN
            LOWER(mkt_medium) = 'social'
            AND REGEXP_COUNT(
                LOWER(mkt_campaign),
                'retargeting|re-targeting|remarketing|re-marketing') > 0
            THEN 'Paid_Social_Retargeting'
        WHEN
            LOWER(mkt_medium) = 'social'
            AND NOT REGEXP_COUNT(
                LOWER(mkt_campaign),
                'prospect|retargeting|re-targeting|remarketing|re-marketing') > 0
            THEN 'Paid_Social_Other'
        WHEN mkt_source = '(direct)' THEN 'Direct'
        WHEN LOWER(mkt_medium) = 'referral' THEN 'Referral'
        WHEN LOWER(mkt_medium) = 'email' THEN 'Email'
        WHEN
            LOWER(mkt_medium) IN ('cpc', 'ppc', 'cpv', 'cpa', 'affiliates')
            THEN 'Other_Advertising'
        ELSE 'Unmatched_Channel'
    END
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
A macro for the user to overwrite it with a sql script to extract total ad spend by channel

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_spend.sql">(source)</a></summary>

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
    WITH channels AS (
        SELECT ARRAY_AGG(DISTINCT channel) AS c FROM {{ ref('snowplow_fractribution_channel_counts') }}
    )
    SELECT
    CAST(channel.value AS STRING) AS channel,
    10000 AS spend
    FROM
    channels,
    LATERAL FLATTEN(c) channel
{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


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
A macro to specify how to filter on conversion events

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_clause.sql">(source)</a></summary>

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
A macro that specifies either a single column or a calculated value that represents the value associated with the conversion

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_value.sql">(source)</a></summary>

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
<code>macros/create_udfs.sql</code>
</summary>

#### Description
A macro which creates user defined functions that will be used in the models

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/create_udfs.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro create_udfs() %}
  {{ return(adapter.dispatch('create_udfs', 'snowplow_fractribution')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__create_udfs() %}

{{ config(
  schema="derived"
)}}
  {% set trim_long_path %}
  -- Returns the last path_lookback_steps channels in the path if path_lookback_steps > 0,
  -- or the full path otherwise.
  CREATE FUNCTION IF NOT EXISTS {{schema}}.TrimLongPath(path ARRAY, path_lookback_steps DOUBLE)
  RETURNS ARRAY LANGUAGE JAVASCRIPT AS $$
  if (PATH_LOOKBACK_STEPS > 0) {
      return PATH.slice(Math.max(0, PATH.length - PATH_LOOKBACK_STEPS));
    }
    return PATH;
  $$;
  {% endset %}


  -- Functions for applying transformations to path arrays.
  -- uniquePath: Identity transform.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  -- exposure: Collapse sequential repeats.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  -- first: Removes repeated events.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  -- frequency: Removes repeat events but tracks them with a count.
  --   E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)).


  {% set remove_if_not_all %}
  -- Returns the path with all copies of targetElem removed, unless the path consists only of
  -- targetElems, in which case the original path is returned.
  CREATE FUNCTION IF NOT EXISTS {{schema}}.RemoveIfNotAll(path ARRAY, targetElem STRING)
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
  CREATE FUNCTION IF NOT EXISTS {{schema}}.RemoveIfLastAndNotAll(path ARRAY, targetElem STRING)
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
  CREATE FUNCTION IF NOT EXISTS {{schema}}.UniquePath(path ARRAY)
  RETURNS ARRAY
  LANGUAGE JAVASCRIPT AS $$
    return PATH;
  $$;
  {% endset %}

  {% set exposure %}
  -- Returns the exposure transform of the given path array.
  -- Sequential duplicates are collapsed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].
  CREATE FUNCTION IF NOT EXISTS {{schema}}.Exposure(path ARRAY)
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
  CREATE FUNCTION IF NOT EXISTS {{schema}}.First(path ARRAY)
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
  CREATE FUNCTION IF NOT EXISTS {{schema}}.Frequency(path ARRAY)
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


  -- create the udfs (as permanent UDFs)
  create schema if not exists {{schema}};
  {% do run_query(trim_long_path) %}
  {% do run_query(remove_if_not_all) %}
  {% do run_query(remove_if_last_and_not_all) %}
  {% do run_query(unique) %}
  {% do run_query(exposure) %}
  {% do run_query(first) %}
  {% do run_query(frequency) %}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- macro.dbt.run_query

</DbtDetails>

