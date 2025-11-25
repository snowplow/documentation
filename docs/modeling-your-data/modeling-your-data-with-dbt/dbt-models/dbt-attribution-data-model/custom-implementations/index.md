---
title: "Custom implementations"
description: "Custom Implementations"
sidebar_position: 30
---

```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
import Badges from '@site/src/components/Badges';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import MarkdownTableToMuiDataGrid from '@site/src/components/MarkdownTableAsMui'

export const datagridProps = {
    hideFooter: true
  };
```

<Badges badgeType="dbt-package Release" pkg="attribution"></Badges>&nbsp;
<Badges badgeType="Early Release"></Badges>&nbsp;
<Badges badgeType="SPAL"></Badges>

:::warning
Make sure you upgrade to [v.0.4.0](https://github.com/snowplow/dbt-snowplow-unified/releases/tag/0.4.0) of Unified Package if you would like to use the v0.2.0 of Attribution Package

:::

This page describes how to customize the Attribution model.

## Customizing the Attribution Overview

The Attribution Overview, though enabled by default, is abstracted away into its own macro: `attribution_overview()` encouraging the package users to have a think about customizing the logic as it is heavily generalized by nature. Let's break down what is happening there by default so that the users can understand it better and be able to make customizations that fits their analysis best.

When analyzing marketing attribution it is always going to be a specific analysis with respect to time: there is always a conversion period, which sets the main timeframe of the analysis, during which conversions happen.

By default, the model expects a spend source and the model aggregates that (it takes the sum of total cost by spend and by channel and campaign). However, associating the spend data with the attribution data is taken dynamically by default based on the timestamp of the conversion relative to the spend. The view by default takes into account spend data that happened before conversion but no less than 90 days before conversion. This is where it makes sense add custom logic, adjusting the period to filter on the investment period relative to the conversion period in question depending on business requirements.

```sql
    from spend_with_unique_keys s
    inner join {{ ref('snowplow_attribution_campaign_attributions') }} c
    on c.campaign = s.campaign and s.spend_tstamp < cv_tstamp
    and s.spend_tstamp > {{ snowplow_utils.timestamp_add('day', -90, 'cv_tstamp') }}
```

Next the model is aggregating data from both the channel and campaign attributions table by conversion, summing up all the different kinds of attribution (first touch, last touch etc.)

Here comes the second time based filter which you might want to adjust in case you run your package incrementally as default. If you adjusted the `snowplow__conversion_window_start_date` and `snowplow__conversion_window_end_date` and ran a specific conversion period, then you can leave it as per default, but for incremental package runs you might want to change the `snowplow__conversion_window_days` variable to extend the analysis period (by default it means it will process last 30 number of days since the last path being available in the paths source (most likely the last page view from the snowplow_unified.views table)).

```jinja2
  {% if not var('snowplow__conversion_window_start_date') == '' and not var('snowplow__conversion_window_end_date') == '' %}
    cv_tstamp >= '{{ var("snowplow__conversion_window_start_date") }}' and cv_tstamp < '{{ var("snowplow__conversion_window_end_date") }}'
  {% else %}
    cv_tstamp >= {{ snowplow_utils.timestamp_add('day', -var("snowplow__conversion_window_days"), last_processed_cv_tstamp) }}
  {% endif%}
 ```

Finally, the model takes the aggregated conversion level data and does a series of unions to calculate metrics by attribution type (first touch, last touch etc.) Here again you might want to adjust what specific metrics you are interested in, add your own etc.

## Running the Attribution Analysis with a specific conversion period only
By default the Attribution package is designed to be run incrementally.

In case you only need ad hoc analysis studying only a specific conversion window and perhaps looking at a larger lookback period to gather a broader user journey, for cost saving purposes you might want to define a set period every time the model is run (e.g. on a monthly basis).

In that case, you can simply overwrite both the `snowplow__conversion_window_start_date` and `snowplow__conversion_window_end_date` variables to decide on the period. In this case the default `snowplow__conversion_window_days` variable will be disregarded by the package.

Bear in mind that it needs a full-refresh every time you process the package:

```bash
 dbt run --select snowplow_attribution --full-refresh --vars 'snowplow__allow_refresh: true'
```

## Bringing your own sources - customizing the paths_to_conversions() macro

There may be cases where you opt for not relying on the snowplow-unified based source tables. The main thing to care about is that you have a joined user_id in both the conversion and path source.

There are two ways to go about this:

#### 1. Align your data sources in a way to fit the package logic

- create a view on top of your source data to make sure you align the expected input fields

- have the common user_id field called `stitched_user_id` in both your path and conversions source view

- make sure to set the variable `snowplow__conversion_stitching` to True (it means the package will rely on the `stitched_user_id` fields for the joins)

#### 2. Align the package logic to work with your data sources

The `paths_to_conversions()` macro to your package is provided in the form of a dispatch macro that you can simply overwrite by adding a new macro with the same name in your dbt project.

The default structure of the macro is the following:

```sql
--
with paths as (
  ...
)

, conversions as (
  ...
)

, string_aggs as (
  ...
)

, arrays as (
  ...
)

{{ transform_paths('conversions', 'arrays') }}

select ...
```

You would most probably need to touch the `paths` and `conversions` cte to adjust how your data is getting processed incrementally from your custom sources. The `string_aggs` cte creates the individual paths the user travelled through to get to the conversion. These path strings are then converted to `arrays` in the subsequent cte.

After that there is a separate macro called `transform_paths` that is being called to provide the sql for the path transformations. It is quite complex, we would not be recommending to overwrite these.

After that the macro just selects the final paths_to_conversion data that will be used for the incremental update for a given run for this derived table.
