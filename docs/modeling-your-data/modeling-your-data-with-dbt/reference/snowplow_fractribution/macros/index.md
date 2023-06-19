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

<h4>Description</h4>

A macro used to perform channel classifications. Each channel should be classified a name that is a valid field name as it will be used for that purpose, once unnested downstream.



<h4>Returns</h4>


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

<h4>Usage</h4>


```sql

select {{ channel_classification() }} as channel,

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_classification.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Channel Spend {#macro.snowplow_fractribution.channel_spend}

<DbtDetails><summary>
<code>macros/channel_spend.sql</code>
</summary>

<h4>Description</h4>

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



<h4>Returns</h4>


A sql script to extract channel and corresponding spend values from a data source.


<h4>Usage</h4>


```sql

{{ channel_spend() }}

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_spend.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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
        array_agg(distinct cast(channel as {{ snowplow_utils.type_max_string() }})) as c

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
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__channel_spend() %}

  with channels as (

      select distinct cast(channel as {{ snowplow_utils.type_max_string() }}), 10000 as spend

      from {{ ref('snowplow_fractribution_channel_counts') }}
  )

 select * from channels

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_utils.type_max_string](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.type_max_string)
- [macro.snowplow_utils.unnest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.unnest)

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_channel_spend](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_channel_spend)

</TabItem>
</Tabs>
</DbtDetails>

### Conversion Clause {#macro.snowplow_fractribution.conversion_clause}

<DbtDetails><summary>
<code>macros/conversion_clause.sql</code>
</summary>

<h4>Description</h4>

A macro to let users specify how to filter on conversion events.



<h4>Returns</h4>


A sql to be used in a WHERE clause to filter on conversion events.

<h4>Usage</h4>


```sql
where {{ conversion_clause() }}

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_clause.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Conversion Value {#macro.snowplow_fractribution.conversion_value}

<DbtDetails><summary>
<code>macros/conversion_value.sql</code>
</summary>

<h4>Description</h4>

A user defined macro that specifies either a single column or a calculated value that represents the value associated with the conversion.



<h4>Returns</h4>


A sql to be used to refer to the conversion value.

<h4>Usage</h4>


```sql

select {{ conversion_value() }} as revenue

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_value.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Create Report Table Proc {#macro.snowplow_fractribution.create_report_table_proc}

<DbtDetails><summary>
<code>macros/snowflake_snowpark/create_report_table_proc.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/snowflake_snowpark/create_report_table_proc.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro create_report_table_proc() %}
  {{ return(adapter.dispatch('create_report_table_proc', 'snowplow_fractribution')()) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__create_report_table_proc() %}
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__create_report_table_proc() %}
{% if execute %}
{% set stored_proc %}
create or replace procedure {{schema}}.create_report_table(attribution_model STRING, conversion_window_start_date STRING, conversion_window_end_date STRING)
  returns int
  language python
  runtime_version = '3.8'
  packages = ('snowflake-snowpark-python')
  handler = 'standalone_main'
as
$$

"""Creates the data needed to run Fractribution in Snowflake.
It produces the following output tables in the data warehouse:

snowplow_fractribution_path_summary_with_channels
snowplow_fractribution_report_table
snowplow_fractribution_channel_attribution"""

import io
import json
import os
import re
from typing import Iterable, List, Mapping, Tuple, Any

from snowflake.snowpark import Session
from snowflake.snowpark.types import DecimalType, StructField, StructType, StringType, IntegerType



class _PathSummary(object):
    """Stores conversion and attribution information.

    To save space, the path itself is not stored here, as it is already stored
    as the key of the _path_tuple_to_summary dict in Fractribution.
    """

    def __init__(self, conversions: int, non_conversions: int, revenue: float):
        self.conversions = conversions
        self.non_conversions = non_conversions
        self.revenue = revenue
        self.channel_to_attribution = {}


class Fractribution(object):
    """Runs Fractribution on a set of marketing paths to (non-)conversion."""

    @classmethod
    def _get_path_string(cls, path_tuple: Iterable[str]) -> str:
        return " > ".join(path_tuple)

    def __init__(self, query_job):
        """Loads (path_str, conversions, non_conversions, revenue) from query_job.

        Args:
          query_job: QueryJob of (path_str, conversions, non_conversions, revenue).
        """
        self._path_tuple_to_summary = {}

        for (path_str, conversions, non_conversions, revenue) in query_job:
            path_tuple = ()
            if path_str:
                path_tuple = tuple(path_str.split(" > "))
            if path_tuple not in self._path_tuple_to_summary:
                self._path_tuple_to_summary[path_tuple] = _PathSummary(
                    conversions, non_conversions, revenue
                )
            else:
                path_summary = self._path_tuple_to_summary[path_tuple]
                path_summary.conversions += conversions
                path_summary.non_conversions += non_conversions

    def _get_conversion_probability(self, path_tuple: Tuple[str, ...]) -> float:
        """Returns path_tuple conversion/(conversion+non_conversion) probability.

        Args:
          path_tuple: Tuple of channel names in the path.

        Returns:
          Conversion probability of customers with this path.
        """

        if path_tuple not in self._path_tuple_to_summary:
            return 0.0
        path_summary = self._path_tuple_to_summary[path_tuple]
        count = path_summary.conversions + path_summary.non_conversions
        if not count:
            return 0.0
        return path_summary.conversions / count

    def _get_counterfactual_marginal_contributions(
        self, path_tuple: Tuple[str, ...]
    ) -> List[float]:
        """Returns the marginal contribution of each channel in the path.

        Args:
          path_tuple: Tuple of channel names in the path.

        Returns:
          List of marginal contribution values, one for each channel in path_tuple.
        """
        if not path_tuple:
            return []
        marginal_contributions = [0] * len(path_tuple)
        path_conversion_probability = self._get_conversion_probability(path_tuple)
        # If the path contains a single channel, it gets 100% of the contribution.
        if len(path_tuple) == 1:
            marginal_contributions[0] = path_conversion_probability
        else:
            # Otherwise, compute the counterfactual marginal contributions by channel.
            for i in range(len(path_tuple)):
                counterfactual_tuple = path_tuple[:i] + path_tuple[i + 1 :]
                raw_marginal_contribution = (
                    path_conversion_probability
                    - self._get_conversion_probability(counterfactual_tuple)
                )
                # Avoid negative contributions by flooring to 0.
                marginal_contributions[i] = max(raw_marginal_contribution, 0)
        return marginal_contributions

    def run_fractribution(self, session, attribution_model: str) -> None:
        """Runs Fractribution with the given attribution_model.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.

        Args:
          attribution_model: Must be a key in ATTRIBUTION_MODELS
        """
        self.ATTRIBUTION_MODELS[attribution_model](self)

    def run_shapley_attribution(self) -> None:
        """Compute fractional attribution values for all given paths.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.
        """
        print("running shapley attribution...")

        print("input items:", len(self._path_tuple_to_summary.items()))

        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            # Ignore empty paths, which can happen when there is a conversion, but
            # no matching marketing channel events.
            # Commented out the below condition that ignores paths with no conversions, as spend on channels with 
            # no conversions is important to include
            if not path_tuple: 
                continue
            path_summary.channel_to_attribution = {}
            marginal_contributions = self._get_counterfactual_marginal_contributions(
                path_tuple
            )
            sum_marginal_contributions = sum(marginal_contributions)
            if sum_marginal_contributions:
                marginal_contributions = [
                    marginal_contribution / sum_marginal_contributions
                    for marginal_contribution in marginal_contributions
                ]
            # Use last touch attribution if no channel has a marginal_contribution.
            if sum_marginal_contributions == 0:
                marginal_contributions[-1] = 1
            # Aggregate the marginal contributions by channel, as channels can occur
            # more than once in the path.
            for i, channel in enumerate(path_tuple):
                path_summary.channel_to_attribution[channel] = marginal_contributions[
                    i
                ] + path_summary.channel_to_attribution.get(channel, 0.0)

    def run_first_touch_attribution(self) -> None:
        """Assigns 100% attribution to the first channel in each path.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.
        """
        print("running first_touch attribution...")
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            path_summary.channel_to_attribution = {}
            if not path_tuple:
                continue
            for channel in path_tuple:
                path_summary.channel_to_attribution[channel] = 0.0
            path_summary.channel_to_attribution[path_tuple[0]] = 1.0

    def run_last_touch_attribution(self) -> None:
        """Assigns 100% attribution to the last channel in each path.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.
        """
        print("running last_touch attribution...")
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            path_summary.channel_to_attribution = {}
            if not path_tuple:
                continue
            for channel in path_tuple:
                path_summary.channel_to_attribution[channel] = 0.0
            path_summary.channel_to_attribution[path_tuple[-1]] = 1.0

    def run_linear_attribution(self) -> None:
        """Assigns attribution evenly between all channels on the path.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.
        """
        print("running linear attribution...")
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            path_summary.channel_to_attribution = {}
            if not path_tuple:
                continue
            credit = 1.0 / len(path_tuple)
            for channel in path_tuple:
                path_summary.channel_to_attribution[channel] = (
                    path_summary.channel_to_attribution.get(channel, 0.0) + credit
                )

    def run_position_based_attribution(self) -> None:
        """Assigns attribution using the position based algorithm.

        The first and last channels get 40% of the credit each, with the remaining
        channels getting the leftover 20% distributed evenly.

        Side-effect: Updates channel_to_attribution dicts in _path_tuple_to_summary.
        """
        print("running position_based attribution...")
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            path_summary.channel_to_attribution = {}
            if not path_tuple:
                continue
            path_summary.channel_to_attribution[path_tuple[0]] = 0.4
            path_summary.channel_to_attribution[path_tuple[-1]] = (
                path_summary.channel_to_attribution.get(path_tuple[-1], 0) + 0.4
            )
            leftover_credit = 0
            middle_path = []
            if len(path_tuple) == 1:
                # All the leftover credit goes to the first and only channel
                leftover_credit = 0.2
                middle_path = path_tuple
            elif len(path_tuple) == 2:
                # The leftover credit is split between the two channels in the path.
                leftover_credit = 0.1
                middle_path = path_tuple
            else:
                # The leftover credit is evenly distributed among the middle channels.
                leftover_credit = 0.2 / (len(path_tuple) - 2)
                middle_path = path_tuple[1:-1]
            for channel in middle_path:
                path_summary.channel_to_attribution[channel] = (
                    path_summary.channel_to_attribution.get(channel, 0.0)
                    + leftover_credit
                )

    def normalize_channel_to_attribution_names(self) -> None:
        """Normalizes channel names and aggregates attribution values if necessary.

        Path transforms can also transform channel names to include a count
        related suffix (<COUNT>). This function undoes the transform on the channel
        name by removing the suffix, so that a single channel with two different
        suffixes can be aggregated.

        Side-effect: Updates channel_to_attribution names in _path_tuple_to_summary.
        """
        for path_summary in self._path_tuple_to_summary.values():
            channel_to_attribution = {}
            for channel in path_summary.channel_to_attribution:
                normalized_channel = re.sub(r"\(.*", "", channel)
                channel_to_attribution[normalized_channel] = (
                    channel_to_attribution.get(normalized_channel, 0)
                    + path_summary.channel_to_attribution[channel]
                )
            path_summary.channel_to_attribution = channel_to_attribution

    def _path_summary_to_json_stringio(self) -> io.BytesIO:
        """Returns a BytesIO file with one JSON-encoded _PathSummary per line."""

        bytesio = io.BytesIO()
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            row = {
                "transformed_path": self._get_path_string(path_tuple),
                "conversions": path_summary.conversions,
                "non_conversions": path_summary.non_conversions,
                "revenue": path_summary.revenue,
            }
            if path_summary.channel_to_attribution:
                row.update(path_summary.channel_to_attribution)
            bytesio.write(json.dumps(row).encode("utf-8"))
            bytesio.write("\n".encode("utf-8"))
        bytesio.flush()
        bytesio.seek(0)
        return bytesio

    def _path_summary_to_list(self) -> List:
        """Returns a list with list _PathSummary per line."""
        rows = []
        for path_tuple, path_summary in self._path_tuple_to_summary.items():
            row = {
                "transformed_path": self._get_path_string(path_tuple),
                "conversions": path_summary.conversions,
                "non_conversions": path_summary.non_conversions,
                "revenue": path_summary.revenue,
            }
            if path_summary.channel_to_attribution:
                row.update(path_summary.channel_to_attribution)
            rows.append(row)

        return rows

    def _get_channel_to_attribution(self) -> Mapping[str, float]:
        """Returns a mapping from channel to overall conversion attribution.

        Returns:
          Mapping from channel to overall conversion attribution.
        """
        overall_channel_to_attribution = {}
        for path_summary in self._path_tuple_to_summary.values():
            channel_to_attribution = path_summary.channel_to_attribution

            for channel, attribution in channel_to_attribution.items():
                overall_channel_to_attribution[channel] = (
                    overall_channel_to_attribution.get(channel, 0.0)
                    + attribution * path_summary.conversions
                )
        return overall_channel_to_attribution

    def _get_channel_to_revenue(self) -> Mapping[str, float]:
        """Returns a mapping from channel to overall revenue attribution.

        Returns:
          Mapping from channel to overall revenue attribution.
        """
        overall_channel_to_revenue = {}
        for path_summary in self._path_tuple_to_summary.values():
            channel_to_attribution = path_summary.channel_to_attribution
            revenue = path_summary.revenue
            if not revenue or revenue == 'NULL':
                revenue = 0.0
            for channel, attribution in channel_to_attribution.items():
                overall_channel_to_revenue[channel] = overall_channel_to_revenue.get(
                    channel, 0.0
                ) + attribution * float(revenue)
        return overall_channel_to_revenue

    ATTRIBUTION_MODELS = {
        "shapley": run_shapley_attribution,
        "first_touch": run_first_touch_attribution,
        "last_touch": run_last_touch_attribution,
        "position_based": run_position_based_attribution,
        "linear": run_linear_attribution,
    }


VALID_CHANNEL_NAME_PATTERN = re.compile(r"^[a-zA-Z_]\w+$", re.ASCII)

def _is_valid_column_name(column_name: str) -> bool:
    """Returns True if the column_name is a valid Snowflake column name."""

    return (
        len(column_name) <= 255
        and VALID_CHANNEL_NAME_PATTERN.match(column_name) is not None
    )


def _extract_channels(client) -> List[str]:
    """Returns the list of names by running extract_channels.sql.

    Args:
      client: Client.
      params: Mapping of template parameter names to values.
    Returns:
      List of channel names.
    Raises:
      ValueError: User-formatted error if channel is not a valid Snowflake column.
    """

    channels = [row.CHANNEL for row in client]
    for channel in channels:
        if not _is_valid_column_name(channel):
            raise ValueError("Channel is not a legal Snowflake column name: ", channel)
    return channels


def get_channels(session):
    """Enumerates all possible channels."""
    query = """SELECT DISTINCT channel FROM snowplow_fractribution_channel_counts"""

    return session.sql(query).collect()


def get_path_summary_data(session):
    query = """
        SELECT transformed_path, CAST(conversions AS FLOAT) AS conversions, CAST(non_conversions AS float) AS non_conversions, CAST(revenue AS float) AS revenue
        FROM snowplow_fractribution_path_summary
        """

    return session.sql(query).collect()


def create_attribution_report_table(session):
    query = f"""
        CREATE OR REPLACE TABLE snowplow_fractribution_report_table AS
        SELECT
            *,
            DIV0(revenue, spend) AS roas
        FROM
            snowplow_fractribution_channel_attribution
            LEFT JOIN
            snowplow_fractribution_channel_spend USING (channel)
    """

    return session.sql(query).collect()


def run_fractribution(session, params: Mapping[str, Any]) -> None:
    """Runs fractribution on the Snowflake tables.

    Args:
      params: Mapping of all template parameter names to values.
    """


    path_summary = get_path_summary_data(session)

    # Step 1: Extract the paths from the path_summary_table.
    frac = Fractribution(path_summary)

    frac.run_fractribution(session, params["attribution_model"])

    frac.normalize_channel_to_attribution_names()

    path_list = frac._path_summary_to_list()
    types = [
        StructField("revenue", DecimalType(10,2)),
        StructField("conversions", DecimalType(10,3)),
        StructField("non_conversions", DecimalType(10,3)),
        StructField("transformed_path", StringType())
    ]

    # exclude revenue, conversions, non_conversions, transformed_path
    channel_to_attribution = frac._get_channel_to_attribution()
    un = set(channel_to_attribution.keys()).difference(["revenue", "conversions", "non_conversions", "transformed_path"])
    attribution_types = [StructField(k, DecimalType(10,3)) for k in list(un)]
    schema = types + attribution_types

    paths = session.create_dataframe(path_list, schema=StructType(schema))

    paths.write.mode("overwrite").save_as_table("snowplow_fractribution_path_summary_with_channels")

    conversion_window_start_date = params["conversion_window_start_date"]
    conversion_window_end_date = params["conversion_window_end_date"]

    channel_to_attribution = frac._get_channel_to_attribution()
    channel_to_revenue = frac._get_channel_to_revenue()
    rows = []
    for channel, attribution in channel_to_attribution.items():
        row = {
            "conversion_window_start_date": conversion_window_start_date,
            "conversion_window_end_date": conversion_window_end_date,
            "channel": channel,
            "conversions": attribution,
            "revenue": channel_to_revenue.get(channel, 0.0),
        }
        rows.append(row)

    channel_attribution = session.create_dataframe(rows)
    channel_attribution.write.mode("overwrite").save_as_table("snowplow_fractribution_channel_attribution")

    report = create_attribution_report_table(session)




def run(session, input_params: Mapping[str, Any]) -> int:
    """Main entry point to run Fractribution with the given input_params.

    Args:
      input_params: Mapping from input parameter names to values.
    Returns:
      0 on success and non-zero otherwise
    """
    params = input_params

    # assumes that the dataset already exists
    params["channel_counts_table"] = "snowplow_fractribution_channel_counts"

    

    channels = get_channels(session)


    params["channels"] = _extract_channels(channels)

    run_fractribution(session, params)

    return 0


def standalone_main(session, attribution_model, conversion_window_start_date, conversion_window_end_date):
    input_params = {
        "attribution_model": attribution_model,
        "conversion_window_start_date": conversion_window_start_date,
        "conversion_window_end_date": conversion_window_end_date
    }
    run(session, input_params)
    print("Report table created")



$$;
{% endset %}

{% do run_query(stored_proc) %}
{% endif %}

{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_call_snowpark_macros](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_call_snowpark_macros)

</TabItem>
</Tabs>
</DbtDetails>

### Create Udfs {#macro.snowplow_fractribution.create_udfs}

<DbtDetails><summary>
<code>macros/path_transformations/create_udfs.sql</code>
</summary>

<h4>Description</h4>

Creates user defined functions for adapters apart from Databricks. It is executed as part of an on-start hook.



<h4>Returns</h4>


Nothing, sql is executed which creates the UDFs in the target database and schema.

<h4>Usage</h4>


```yml
-- dbt_project.yml
...
on-run-start: "{{ create_udfs() }}"
...

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/create_udfs.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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
<TabItem value="redshift" label="redshift">

```jinja2
{% macro redshift__create_udfs() %}

  {% set trim_long_path %}
  -- Returns the last snowplow__path_lookback_steps channels in the path if snowplow__path_lookback_steps > 0,
  -- or the full path otherwise.
  create or replace function {{target.schema}}.trim_long_path(path varchar, snowplow__path_lookback_steps integer)
  returns varchar
  stable
  AS $$
  path_list = path.split(' > ')
  path_list_sliced= path_list[max(0, len(path_list) - snowplow__path_lookback_steps):]
  if (snowplow__path_lookback_steps > 0):
    return ' > '.join(path_list_sliced);

  return path
  $$ LANGUAGE plpythonu;
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
  create or replace function {{target.schema}}.remove_if_not_all(path varchar, target_elem varchar)
  returns varchar
  stable
  AS $$

  transformed_path = []
  path_list = path.split(' > ')

  for i in range(len(path_list)):

    if path_list[i] !=  target_elem:
      transformed_path.append(path_list[i])

  if len(transformed_path) == 0:
    return(path)

  else:
    return(' > '.join(transformed_path))

  $$ LANGUAGE plpythonu;

  {% endset %}

  {% set remove_if_last_and_not_all %}
  -- Returns the path with all copies of targetElem removed from the tail, unless the path consists
  -- only of targetElems, in which case the original path is returned.
  create or replace function {{target.schema}}.remove_if_last_and_not_all(path varchar, target_elem varchar)
  returns varchar
  stable
  AS $$

  path_list = path.split(' > ')
  reversed_path = list(reversed(path_list))
  tail_index = 0
  transformed_path = []


  for i in range(len(path_list)):

      if reversed_path[i] != target_elem:
        break

  tail_index = i

  if tail_index > 0 and tail_index != len(path_list)-1:
      transformed_path = path_list[:len(path_list)-tail_index]

      return(' > '.join(transformed_path))

  return(path)

  $$ LANGUAGE plpythonu;
  {% endset %}

  {% set unique %}
  -- Returns the unique/identity transform of the given path array.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, B, C, D, C, C].
  create or replace function {{target.schema}}.unique_path(path varchar)
  returns varchar
  stable
  AS $$

  return(path)

  $$ LANGUAGE plpythonu;
  {% endset %}

  {% set exposure %}
  -- Returns the exposure transform of the given path array.
  -- Sequential duplicates are collapsed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C, D, C].

  create or replace function {{target.schema}}.exposure_path(path varchar)
  returns varchar
  stable
  AS $$

  path_list = path.split(' > ')
  transformed_path = []

  for i in range(len(path_list)):

      if i == 0 or path_list[i] != path_list[i-1]:
          transformed_path.append(path_list[i])

  return(' > '.join(transformed_path))

  $$ LANGUAGE plpythonu;


  {% endset %}

  {% set first %}
  -- Returns the first transform of the given path array.
  -- Repeated channels are removed.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D, A, B, C].
  create or replace function {{target.schema}}.first_path(path varchar)
  returns varchar
  stable
  AS $$

  transformed_path = []
  path_list = path.split(' > ')

  for i in range(len(path_list)):

    if path_list[i] not in transformed_path:
          transformed_path.append(path_list[i])

  return(' > '.join(transformed_path))

  $$ LANGUAGE plpythonu;

  {% endset %}

  {% set frequency %}
  -- Returns the frequency transform of the given path array.
  -- Repeat events are removed, but tracked with a count.
  -- E.g. [D, A, B, B, C, D, C, C] --> [D(2), A(1), B(2), C(3)].
  create or replace function {{target.schema}}.frequency_path(path varchar)
  returns varchar
  stable
  AS $$

  element_count = []
  transformed_path = []
  path_list = path.split(' > ')

  for i in path_list:
   element_count.append(i + '('  + str(path_list.count(i)) + ')')

  for i in range(len(element_count)):

    if element_count[i] not in transformed_path:
          transformed_path.append(element_count[i])

  return(' > '.join(transformed_path))

  $$ LANGUAGE plpythonu;
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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query

</TabItem>
</Tabs>
</DbtDetails>

### Get Lookback Date Limits {#macro.snowplow_fractribution.get_lookback_date_limits}

<DbtDetails><summary>
<code>macros/get_lookback_date_limits.sql</code>
</summary>

<h4>Description</h4>

A macro returning the upper or lower boundary to limit what is processed by the sessions_by_customer_id model.



<h4>Arguments</h4>

- `limit_type` *(string)*: Can be either 'min' or 'max' depending on if the upper or lower boundary date needs to be returned

<h4>Returns</h4>


A string value of the upper or lower date limit.

<h4>Usage</h4>


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


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/get_lookback_date_limits.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.current_timestamp
- macro.dbt.dateadd
- macro.dbt.run_query
- macro.dbt.type_string

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_conversions_by_customer_id)
- [model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_sessions_by_customer_id)

</TabItem>
</Tabs>
</DbtDetails>

### Path Transformation {#macro.snowplow_fractribution.path_transformation}

<DbtDetails><summary>
<code>macros/path_transformations/path_transformation.sql</code>
</summary>

<h4>Description</h4>

Macro to execute the indvidual path_transformation specified as a parameter.



<h4>Arguments</h4>

- `transformation_type` *(string)*: A type of transformation that needs to be executed E.g. 'unique_path'. Needs to be one of the following: exposure_path, first_path, frequency_path, remove_if_last_and_not_all, remove_if_not_all, unique_path More details here https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-fractribution-data-model/#path-transform-options

- `transform_param` *(string)*: (Optional) The parameter value that the path transormation needs to execute,. Default none

<h4>Returns</h4>


The transformed array column.


<h4>Usage</h4>


```sql

{{ path_transformation('unique_path') }} as transformed_path

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/path_transformation.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)

</TabItem>
</Tabs>
</DbtDetails>

### Run Stored Procedure {#macro.snowplow_fractribution.run_stored_procedure}

<DbtDetails><summary>
<code>macros/snowflake_snowpark/run_stored_procedure.sql</code>
</summary>

<h4>Description</h4>

This macro does not currently have a description.

<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/snowflake_snowpark/run_stored_procedure.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

```jinja2
{% macro run_stored_procedure(attribution_model, conversion_window_start_date, conversion_window_end_date) %}
  {{ return(adapter.dispatch('run_stored_procedure', 'snowplow_fractribution')(attribution_model, conversion_window_start_date, conversion_window_end_date)) }}
{% endmacro %}
```

</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__run_stored_procedure(attribution_model, conversion_window_start_date, conversion_window_end_date) %}
{% endmacro %}
```

</TabItem>
<TabItem value="snowflake" label="snowflake">

```jinja2
{% macro snowflake__run_stored_procedure(attribution_model, conversion_window_start_date, conversion_window_end_date) %}
{% if execute %}
{% set call_proc %}
CALL {{schema}}.create_report_table('{{attribution_model}}', '{{conversion_window_start_date}}', '{{conversion_window_end_date}}')
{% endset %}

{% do run_query(call_proc) %}
{% endif %}

  
{% endmacro %}
```

</TabItem>
</Tabs>

</DbtDetails>


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- macro.dbt.run_query

</TabItem>
</Tabs>

<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="model" label="Models">

- [model.snowplow_fractribution.snowplow_fractribution_call_snowpark_macros](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/models/index.md#model.snowplow_fractribution.snowplow_fractribution_call_snowpark_macros)

</TabItem>
</Tabs>
</DbtDetails>

### Transform Paths {#macro.snowplow_fractribution.transform_paths}

<DbtDetails><summary>
<code>macros/path_transformations/transform_paths.sql</code>
</summary>

<h4>Description</h4>

Macro to remove complexity from models paths_to_conversion / paths_to_non_conversion.



<h4>Arguments</h4>

- `model_type` *(string)*: The macro only expects 'conversions' in case it runs in the path_to_conversions in which case it adds more fields
- `source_cte` *(string)*: The name of the cte to take as an input for the macro the build sql to

<h4>Returns</h4>


The sql with the missing cte's that take care of path transformations.

<h4>Usage</h4>


It is used by the transform_paths() macro for the transformation cte sql code build. It takes a transformation type as a parameter and its optional argument, if exists. The E.g.

```sql
with base_data as (...),

{{ transform_paths('conversions', 'base_data') }}

select * from path_transforms
```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/transform_paths.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Depends On</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.path_transformation](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.path_transformation)
- [macro.snowplow_fractribution.trim_long_path](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.trim_long_path)

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

### Trim Long Path {#macro.snowplow_fractribution.trim_long_path}

<DbtDetails><summary>
<code>macros/path_transformations/trim_long_path.sql</code>
</summary>

<h4>Description</h4>

Returns the last 'snowplow__path_lookback_steps' number of channels in the path if snowplow__path_lookback_steps > 0, or the full path otherwise.



<h4>Arguments</h4>

- `array_column` *(string)*: The array column to be transformed
- `lookback_steps` *(integer)*: Defaulted to be taken from the snowplow__path_lookback_steps, the number of path to leave starting from the end

<h4>Returns</h4>


The transformed array column.


<h4>Usage</h4>


```sql

select
  ...
  {{ trim_long_path('path', var('snowplow__path_lookback_steps')) }} as path,
  ...
from
  ...

```


<h4>Details</h4>

<DbtDetails>
<summary>Code</summary>

<center><b><i><a href="https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/path_transformations/trim_long_path.sql">Source</a></i></b></center>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="raw" default>

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


<h4>Referenced By</h4>

<Tabs groupId="reference">
<TabItem value="macro" label="Macros">

- [macro.snowplow_fractribution.transform_paths](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_fractribution/macros/index.md#macro.snowplow_fractribution.transform_paths)

</TabItem>
</Tabs>
</DbtDetails>

