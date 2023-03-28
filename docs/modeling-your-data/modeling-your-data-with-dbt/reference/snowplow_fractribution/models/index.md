---
title: "Snowplow Fractribution Models"
description: Reference for snowplow_fractribution dbt models developed by Snowplow
sidebar_position: 10
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
### Snowplow Fractribution Channel Counts {#model.snowplow_fractribution.snowplow_fractribution_channel_counts}

<DbtDetails><summary>
<code>models/snowplow_fractribution_channel_counts.sql</code>
</summary>

<h4>Description</h4>

Number of sessions per channel, campaign, source and medium

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| channel | Channel name | text |
| campaign | Campaign name | text |
| source | Source / referring host | text |
| medium | Marketing medium | text |
| number_of_sessions | Count of sessions per channel / campaign / source / medium | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_channel_counts.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  channel,
  campaign,
  source,
  medium,
  count(*) as number_of_sessions

from {{ ref('snowplow_fractribution_sessions_by_customer_id') }}

group by 1,2,3,4

order by channel, number_of_sessions desc
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_spend)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Channel Spend {#model.snowplow_fractribution.snowplow_fractribution_channel_spend}

<DbtDetails><summary>
<code>models/snowplow_fractribution_channel_spend.sql</code>
</summary>

<h4>Description</h4>

This model does not currently have a description.

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| channel |   | text |
| spend |   | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_channel_spend.sql">Source</a></i></b></center>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_channel_counts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_counts)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_spend)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Conversions By Customer Id {#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id}

<DbtDetails><summary>
<code>models/snowplow_fractribution_conversions_by_customer_id.sql</code>
</summary>

<h4>Description</h4>

Each conversion and associated revenue per customer_id

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| customer_id | Identifier for the customer, 'f' prefixed when domain_userid is used, 'u' prefixed for when user_id is used (logged in?) | text |
| conversion_tstamp |   | timestamp_ntz |
| revenue | Revenue (dollars / cents) for the conversion | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_conversions_by_customer_id.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

select
  case when events.user_id is not null and events.user_id != '' then 'u' || events.user_id -- use event user_id
    {% if var('snowplow__use_snowplow_web_user_mapping_table') %}
       when user_mapping.domain_userid is not null then 'u' || user_mapping.user_id
    {% endif %}
       else 'f' || events.domain_userid
  end as customer_id,
  derived_tstamp as conversion_tstamp,
  {{ conversion_value() }} as revenue

from {{ var('snowplow__conversions_source' )}} as events

{% if var('snowplow__use_snowplow_web_user_mapping_table') %}
  left join {{ var('snowplow__web_user_mapping_table') }} as user_mapping
    on events.domain_userid = user_mapping.domain_userid
{% endif %}

where {{ conversion_clause() }}
  and date(derived_tstamp) >= '{{ get_lookback_date_limits("min") }}'
  and date(derived_tstamp) <= '{{ get_lookback_date_limits("max") }}'
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.conversion_clause](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.conversion_clause)
- [macro.snowplow_fractribution.conversion_value](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.conversion_value)
- [macro.snowplow_fractribution.get_lookback_date_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.get_lookback_date_limits)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Path Summary {#model.snowplow_fractribution.snowplow_fractribution_path_summary}

<DbtDetails><summary>
<code>models/snowplow_fractribution_path_summary.sql</code>
</summary>

<h4>Description</h4>

For each unique path, a summary of associated conversions, non conversions and revenue

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| transformed_path | > delimited path summary | text |
| conversions | Count of conversions for this path | number |
| non_conversions | Count of non-conversions for path | number |
| revenue | Revenue for the given path | number |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_path_summary.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with paths_to_conversion as (

  select
    transformed_path,
    count(*) as conversions,
    sum(revenue) as revenue

  from {{ ref('snowplow_fractribution_paths_to_conversion') }}

  group by 1

)

, paths_to_non_conversion as (

  select
    transformed_path,
    count(*) as non_conversions

  from {{ ref('snowplow_fractribution_paths_to_non_conversion') }}

  group by 1
)

select
  coalesce(c.transformed_path, n.transformed_path) as transformed_path,
  coalesce(c.conversions, 0) as conversions,
  coalesce(n.non_conversions, 0) as non_conversions,
  c.revenue

from paths_to_conversion c

full join paths_to_non_conversion n
  on c.transformed_path = n.transformed_path
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Paths To Conversion {#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion}

<DbtDetails><summary>
<code>models/snowplow_fractribution_paths_to_conversion.sql</code>
</summary>

<h4>Description</h4>

Customer id and the the paths the customer has followed that have lead to conversion

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| customer_id | Id for the customer (identified or cookie) | text |
| conversion_tstamp |   | timestamp_ntz |
| revenue | Revenue associated with the conversion | number |
| path | Path to conversion (> delimited) | text |
| transformed_path | Transformations applied to "path" above | text |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_paths_to_conversion.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

-- Requires macro trim_long_path

with string_aggs as (

  select
    c.customer_id,
    c.conversion_tstamp,
    c.revenue,
    {{ snowplow_utils.get_string_agg('channel', 's', separator=' > ', sort_numeric=false, order_by_column='visit_start_tstamp', order_by_column_prefix='s') }} as path

  from {{ ref('snowplow_fractribution_conversions_by_customer_id') }} c

  inner join {{ ref('snowplow_fractribution_sessions_by_customer_id') }} s
  on c.customer_id = s.customer_id
    and {{ datediff('s.visit_start_tstamp', 'c.conversion_tstamp', 'day') }}  >= 0
    and {{ datediff('s.visit_start_tstamp', 'c.conversion_tstamp', 'day') }} <= {{ var('snowplow__path_lookback_days') }}

  group by 1,2,3

)

, arrays as (

  select
    customer_id,
    conversion_tstamp,
    revenue,
    {{ snowplow_utils.get_split_to_array('path', 's', ' > ') }} as path,
    {{ snowplow_utils.get_split_to_array('path', 's', ' > ') }} as transformed_path

  from string_aggs s

)

{{ transform_paths('conversions', 'arrays') }}

select
  customer_id,
  conversion_tstamp,
  revenue,
  {{ snowplow_utils.get_array_to_string('path', 'p', ' > ') }} as path,
  {{ snowplow_utils.get_array_to_string('transformed_path', 'p', ' > ') }} as transformed_path

from path_transforms p
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.datediff
- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)
- [macro.snowplow_utils.get_array_to_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_array_to_string)
- [macro.snowplow_utils.get_split_to_array](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_split_to_array)
- [macro.snowplow_utils.get_string_agg](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_string_agg)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_path_summary](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_path_summary)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Paths To Non Conversion {#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion}

<DbtDetails><summary>
<code>models/snowplow_fractribution_paths_to_non_conversion.sql</code>
</summary>

<h4>Description</h4>

Customer id and the the paths the customer has followed that have not lead to conversion

**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| customer_id | Id for the customer (identified or cookie) | text |
| path | Path to conversion (> delimited) | text |
| transformed_path | Transformations applied to "path" above | text |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_paths_to_non_conversion.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

-- Requires macro trim_long_path


with non_conversions as (

  select
    customer_id,
    max(visit_start_tstamp) as non_conversion_tstamp

  from {{ ref('snowplow_fractribution_sessions_by_customer_id') }} s

  where not exists (select customer_id from {{ ref('snowplow_fractribution_conversions_by_customer_id') }} c where s.customer_id = c.customer_id)

  group by 1

)

, string_aggs as (

  select
    n.customer_id,
    {{ snowplow_utils.get_string_agg('channel', 's', separator=' > ', order_by_column='visit_start_tstamp', sort_numeric=false, order_by_column_prefix='s') }} as path

  from non_conversions n

  inner join {{ ref('snowplow_fractribution_sessions_by_customer_id') }} s
  on n.customer_id = s.customer_id
    and {{ datediff('s.visit_start_tstamp', 'n.non_conversion_tstamp', 'day') }}  >= 0
    and {{ datediff('s.visit_start_tstamp', 'n.non_conversion_tstamp', 'day') }} <= {{ var('snowplow__path_lookback_days') }}

  group by 1


)

, arrays as (

    select
      customer_id,
      {{ snowplow_utils.get_split_to_array('path', 's', ' > ') }} as path,
      {{ snowplow_utils.get_split_to_array('path', 's', ' > ') }} as transformed_path

    from string_aggs s

)

{{ transform_paths('non_conversions', 'arrays') }}

select
  customer_id,
  {{ snowplow_utils.get_array_to_string('path', 'p', ' > ') }} as path,
  {{ snowplow_utils.get_array_to_string('transformed_path', 'p', ' > ') }} as transformed_path

from path_transforms p
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
<TabItem value="macro" label="Macros">

- macro.dbt.datediff
- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)
- [macro.snowplow_utils.get_array_to_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_array_to_string)
- [macro.snowplow_utils.get_split_to_array](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_split_to_array)
- [macro.snowplow_utils.get_string_agg](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_string_agg)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_path_summary](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_path_summary)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Fractribution Sessions By Customer Id {#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id}

<DbtDetails><summary>
<code>models/snowplow_fractribution_sessions_by_customer_id.sql</code>
</summary>

<h4>Description</h4>

Channels per session by customer id, yields one row per session unless snowplow__consider_intrasession_channels is true


**Type**: Table

<h4>Details</h4>

<DbtDetails>
<summary>Columns</summary>

| Column Name | Description |Type|
|:------------|:------------|:--:|
| customer_id | Customer id | text |
| visit_start_tstamp | UTC timestamp for the start of the session | timestamp_ntz |
| channel | Channel | text |
| referral_path | Referall path for the session | text |
| campaign | Marketing campaign | text |
| source | Marketing source | text |
| medium | Marketing medium | text |
</DbtDetails>

<DbtDetails>
<summary>Code</summary>

<Tabs groupId="dispatched_sql">
<TabItem value="default" label="default" default>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/models/snowplow_fractribution_sessions_by_customer_id.sql">Source</a></i></b></center>

```jinja2
{{
  config(
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

 -- restrict to certain hostnames
{% if var('snowplow__conversion_hosts') in ('', [], '[]') or var('snowplow__conversion_hosts') == None %}
    {{ exceptions.raise_compiler_error("Error: var('conversion_host') needs to be set!") }}
{% endif %}

select
  case when page_views.user_id is not null and page_views.user_id != '' then 'u' || page_views.user_id -- use event user_id
  {% if var('snowplow__use_snowplow_web_user_mapping_table') %}
       when user_mapping.domain_userid is not null then 'u' || user_mapping.user_id
  {% endif %}
        else 'f' || page_views.domain_userid
  end as customer_id, -- f (anonymous) or u (identifier) prefixed user identifier
  derived_tstamp as visit_start_tstamp, -- we consider the event timestamp to be the session start, rather than the session start timestamp
  {{ channel_classification() }} as channel,
  refr_urlpath as referral_path,
  mkt_campaign as campaign,
  mkt_source as source,
  mkt_medium as medium

from {{ var('snowplow__page_views_source') }}  page_views

{% if var('snowplow__use_snowplow_web_user_mapping_table') %}
  left join {{ var('snowplow__web_user_mapping_table') }} as user_mapping
  on page_views.domain_userid = user_mapping.domain_userid
{% endif %}

where date(derived_tstamp) >= '{{ get_lookback_date_limits("min") }}'

  and date(derived_tstamp) <= '{{ get_lookback_date_limits("max") }}'

  and
    -- restrict to certain hostnames
{% if var('snowplow__conversion_hosts') in ('', [], '[]') or var('snowplow__conversion_hosts') == None %}
  {{ exceptions.raise_compiler_error("Error: var('conversion_host') needs to be set!") }}

{% endif %}
page_urlhost in ({{ snowplow_utils.print_list(var('snowplow__conversion_hosts')) }})

{% if var('snowplow__consider_intrasession_channels') %}
  -- yields one row per channel change
  and mkt_medium is not null and mkt_medium != ''

{% else %}
  -- yields one row per session (last touch)
  and page_view_in_session_index = 1 -- takes the first page view in the session
{% endif %}

{% if var('snowplow__channels_to_exclude') %}
    -- Filters out any unwanted channels
    and channel not in ({{ snowplow_utils.print_list(var('snowplow__channels_to_exclude')) }})
{% endif %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.channel_classification](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.channel_classification)
- [macro.snowplow_fractribution.get_lookback_date_limits](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.get_lookback_date_limits)
- [macro.snowplow_utils.print_list](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.print_list)
- [macro.snowplow_utils.set_query_tag](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.set_query_tag)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_channel_counts](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_counts)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_conversion)
- [model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_paths_to_non_conversion)

</TabItem>
</Tabs>
</DbtDetails>

