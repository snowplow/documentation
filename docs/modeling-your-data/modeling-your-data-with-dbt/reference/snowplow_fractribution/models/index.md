---
title: "Snowplow Fractribution Models"
description: Reference for snowplow_fractribution dbt models developed by Snowplow
sidebar_position: 10
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
### Snowplow Fractribution Channel Counts {#model.snowplow_fractribution.snowplow_fractribution_channel_counts}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_channel_counts.sql</code>
</summary>

#### Description
Number of sessions per channel, campaign, source and medium

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| channel | Channel name |
| campaign | Campaign name |
| source | Source / referring host |
| medium | Marketing medium |
| number_of_sessions | Count of sessions per channel / campaign / source / medium |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_channel_counts.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

SELECT
    channel,
    campaign,
    source,
    medium,
    COUNT(*) AS number_of_sessions
FROM
    {{ ref('snowplow_fractribution_sessions_by_customer_id') }}
GROUP BY channel, campaign, source, medium
ORDER BY channel, number_of_sessions DESC
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_spend)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Channel Spend {#model.snowplow_fractribution.snowplow_fractribution_channel_spend}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_channel_spend.sql</code>
</summary>

#### Description
This model does not currently have a description.

#### Details
<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_channel_spend.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

-- By default, the model assigns an example 10k spend to each channel found in channel_counts
-- TODO: put in your own spend calculations per channel in the channel_spend macro in your own dbt project


{{ channel_spend() }}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_channel_counts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_counts)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_fractribution.channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_spend)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Conversions By Customer Id {#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_conversions_by_customer_id.sql</code>
</summary>

#### Description
Each conversion and associated revenue per customer_id

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| customerId | Identifier for the customer, 'f' prefixed when domain_userid is used, 'u' prefixed for when user_id is used (logged in?) |
| conversionTimestamp | UTC timestamp for the conversion |
| revenue | Revenue (dollars / cents) for the conversion |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_conversions_by_customer_id.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

SELECT
    CASE
        WHEN events.user_id IS NOT NULL AND events.user_id != '' THEN 'u' || events.user_id -- use event user_id
        {% if var('use_snowplow_web_user_mapping_table') %}
            WHEN user_mapping.domain_userid IS NOT NULL THEN 'u' || user_mapping.user_id
        {% endif %}
        ELSE 'f' || events.domain_userid
    END AS customerId,
    derived_tstamp AS conversionTimestamp,
    {{ conversion_value() }} AS revenue
FROM
    {{ var('conversions_source' )}} AS events
    {% if var('use_snowplow_web_user_mapping_table') %}
        LEFT JOIN
        {{ var('snowplow_web_user_mapping_table') }} AS user_mapping
        ON
        events.domain_userid = user_mapping.domain_userid
    {% endif %}
WHERE
    {{ conversion_clause() }}
    AND
    DATE(derived_tstamp) >= CASE WHEN '{{ var('conversion_window_start_date') }}' = '' 
                                THEN current_date()-31
                                ELSE '{{ var('conversion_window_start_date') }}'
                                END
    AND
    DATE(derived_tstamp) <= CASE WHEN '{{ var('conversion_window_end_date') }}' = '' 
                                THEN current_date()-1
                                ELSE '{{ var('conversion_window_end_date') }}'
                                END
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [source.snowplow_fractribution.atomic.events](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#source.snowplow_fractribution.atomic.events)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_fractribution.conversion_clause](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.conversion_clause)
- [macro.snowplow_fractribution.conversion_value](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.conversion_value)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Path Summary {#model.snowplow_fractribution.snowplow_fractribution_path_summary}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_path_summary.sql</code>
</summary>

#### Description
For each unique path, a summary of associated conversions, non conversions and revenue

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| transformedPath | > delimited path summary |
| conversions | Count of conversions for this path |
| nonConversions | Count of non-conversions for path |
| revenue | Revenue for the given path |
| direct_display_other_organic_search_paid_search_referral | These columns may be created dynamically... |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_path_summary.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

WITH PathsToConversion AS (
  SELECT transformedPath, COUNT(*) AS conversions, SUM(revenue) AS revenue
  FROM
    {{ ref('snowplow_fractribution_paths_to_conversion') }}
  GROUP BY transformedPath
), PathsToNonConversion AS (
  SELECT transformedPath, COUNT(*) AS nonConversions
  FROM 
    {{ ref('snowplow_fractribution_paths_to_non_conversion') }}
    GROUP BY transformedPath
)
SELECT
  IFNULL(PathsToConversion.transformedPath,
         PathsToNonConversion.transformedPath) AS transformedPath,
  IFNULL(PathsToConversion.conversions, 0) AS conversions,
  IFNULL(PathsToNonConversion.nonConversions, 0) AS nonConversions,
  PathsToConversion.revenue
FROM PathsToConversion
FULL JOIN PathsToNonConversion
  USING(transformedPath)
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Paths To Conversion {#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_paths_to_conversion.sql</code>
</summary>

#### Description
Customer id and the the paths the customer has followed that have lead to conversion

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| customerId | Id for the customer (identified or cookie) |
| conversionTimestamp | UTC timestamp for the conversion event |
| revenue | Revenue associated with the conversion |
| path | Path to conversion (> delimited) |
| transformedPath | Transformations applied to "path" above |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_paths_to_conversion.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

SELECT
  con.customerId,
  conversionTimestamp,
  revenue,
  ARRAY_TO_STRING({{schema}}.TrimLongPath(
    ARRAY_AGG(channel) WITHIN GROUP (ORDER BY visitStartTimestamp), {{ var('path_lookback_steps') }}),
    ' > ') AS path,
  ARRAY_TO_STRING(
    {% for path_transform_name, _ in var('path_transforms')|reverse %}
      {{schema}}.{{path_transform_name}}(
    {% endfor %}
        ARRAY_AGG(channel) WITHIN GROUP (ORDER BY visitStartTimestamp)
    {% for _, arg_str in var('path_transforms') %}
      {% if arg_str %}, {{arg_str}}{% endif %})
    {% endfor %}
    , ' > ') AS transformedPath
FROM {{ ref('snowplow_fractribution_conversions_by_customer_id') }} con
LEFT JOIN {{ ref('snowplow_fractribution_sessions_by_customer_id') }} se
  ON
    con.customerId = se.customerId
    AND DATEDIFF(day, visitStartTimestamp, conversionTimestamp)
      BETWEEN 0 AND {{ var('path_lookback_days') }}
GROUP BY
  con.customerId,
  conversionTimestamp,
  revenue
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_path_summary](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_path_summary)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Paths To Non Conversion {#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_paths_to_non_conversion.sql</code>
</summary>

#### Description
Customer id and the the paths the customer has followed that have not lead to conversion

#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| customerId | Id for the customer (identified or cookie) |
| path | Path to conversion (> delimited) |
| transformedPath | Transformations applied to "path" above |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_paths_to_non_conversion.sql">Source</a></i></b></center>

```jinja2
{{ 
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  ) 
}}

-- Requires TrimLongPath UDF

WITH Conversions AS (
  SELECT DISTINCT customerId
  FROM {{ ref('snowplow_fractribution_conversions_by_customer_id') }}
),
NonConversions AS (
  SELECT
    customerId,
    MAX(visitStartTimestamp) AS nonConversionTimestamp
  FROM {{ ref('snowplow_fractribution_sessions_by_customer_id') }} se
  LEFT JOIN Conversions
    USING (customerId)
  WHERE Conversions.customerId IS NULL
  GROUP BY customerId
)
SELECT
  NonConversions.customerId,
  ARRAY_TO_STRING({{schema}}.TrimLongPath(
    ARRAY_AGG(channel) WITHIN GROUP (ORDER BY visitStartTimestamp), {{ var('path_lookback_steps') }}), ' > ') AS path,
  ARRAY_TO_STRING(
    {% for path_transform_name, _ in var('path_transforms')|reverse %}
      {{schema}}.{{path_transform_name}}(
    {% endfor %}
        ARRAY_AGG(channel) WITHIN GROUP (ORDER BY visitStartTimestamp)
    {% for _, arg_str in var('path_transforms') %}
      {% if arg_str %}, {{arg_str}}{% endif %})
    {% endfor %}
    , ' > ') AS transformedPath
FROM NonConversions
LEFT JOIN {{ ref('snowplow_fractribution_sessions_by_customer_id') }} se
  ON
    NonConversions.customerId = se.customerId
    AND DATEDIFF(day, visitStartTimestamp, nonConversionTimestamp)
      BETWEEN 0 AND {{ var('path_lookback_days') }}
GROUP BY NonConversions.customerId
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_path_summary](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_path_summary)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Sessions By Customer Id {#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id}

<DbtDetails><summary>
<code>models/&lt;adaptor&gt;/snowplow_fractribution_sessions_by_customer_id.sql</code>
</summary>

#### Description
Channels per session by customer id, yields one row per session unless consider_intrasession_channels is true


#### Details
<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |
|--------------|-------------|
| customerId | Customer id |
| visitStartTimestamp | UTC timestamp for the start of the session |
| channel | Channel |
| referralPath | Referall path for the session |
| campaign | Marketing campaign |
| source | Marketing source |
| medium | Marketing medium |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="snowflake" label="snowflake" >

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowflake/snowplow_fractribution_sessions_by_customer_id.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

SELECT
    CASE
        WHEN page_views.user_id IS NOT NULL AND page_views.user_id != '' THEN 'u' || page_views.user_id -- use event user_id
        {% if var('use_snowplow_web_user_mapping_table') %}
            WHEN user_mapping.domain_userid IS NOT NULL THEN 'u' || user_mapping.user_id
        {% endif %}
        ELSE 'f' || page_views.domain_userid
    END AS customerId, -- f (anonymous) or u (identifier) prefixed user identifier
    derived_tstamp AS visitStartTimestamp, -- we consider the event timestamp to be the session start, rather than the session start timestamp
    {{ channel_classification() }} AS channel,
    refr_urlpath AS referralPath,
    mkt_campaign AS campaign,
    mkt_source AS source,
    mkt_medium AS medium
FROM
    {{ var('page_views_source') }}  page_views
    {% if var('use_snowplow_web_user_mapping_table') %}
        LEFT JOIN
        {{ var('snowplow_web_user_mapping_table') }} AS user_mapping
        ON
        page_views.domain_userid = user_mapping.domain_userid
    {% endif %}
WHERE
    DATE(derived_tstamp) >= DATEADD(d, -{{ var('path_lookback_days') + 1 }},
                                CASE WHEN '{{ var('conversion_window_start_date') }}' = ''
                                THEN current_date()-31
                                ELSE '{{ var('conversion_window_start_date') }}'
                                END)
    AND
    DATE(derived_tstamp) <= CASE WHEN '{{ var('conversion_window_end_date') }}' = ''
                                THEN current_date()-1
                                ELSE '{{ var('conversion_window_end_date') }}'
                                END
    AND
    -- restrict to certain hostnames
    {% if var('conversion_hosts') in ('', [], '[]') or var('conversion_hosts') == None %}
      {{ exceptions.raise_compiler_error("Error: var('conversion_host') needs to be set!") }}

    {% endif %}
    page_urlhost IN (
        {%- for urlhost in var('conversion_hosts') %}
            '{{ urlhost }}'
            {%- if not loop.last %},{% endif %}
        {%- endfor %}
    )

    {% if var('consider_intrasession_channels') %}
        -- yields one row per channel change
        AND mkt_medium IS NOT NULL AND mkt_medium != ''
    {% else %}
        -- yields one row per session (last touch)
        AND page_view_in_session_index = 1 -- takes the first page view in the session
    {% endif %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [source.snowplow_fractribution.derived.snowplow_web_page_views](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#source.snowplow_fractribution.derived.snowplow_web_page_views)

</TabItem>
<TabItem value="macros" label="Macros">

- [macro.snowplow_fractribution.channel_classification](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_classification)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_fractribution.snowplow_fractribution_channel_counts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_counts)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
</Tabs>
</DbtDetails>

