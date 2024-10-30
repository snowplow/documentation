---
title: "Custom Impmplementations"
description: "Custom Implementations"
sidebar_position: 30
hide_title: true
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


## Customizing the Attribution Overview

The Attribution Overview, though enabled by default, is abstracted away into its own macro: `attribution_overview()` encouraging the package users to have a think about customizing the logic as it is heavily generalized by nature. Let's break down what is happening there by default so that the users can understand it better and be able to make customizations that fits their analysis best.

When analyzing marketing attribution it is always going to be a specific analysis with respect to time: there is always a conversion period, which sets the main timeframe of the analysis, during which conversions happen.

By default, the model expects a spend source and the model aggregates that by the sum of total cost by spend and by channel and campaign. This is where it might make sense add custom logic, adjusting the period to filter on the investment period relative to the conversion period in question. By default, it is taking spends before the conversion happened but not more than 90 days earlier spends:

```sql
    from spend_with_unique_keys s
    inner join {{ ref('snowplow_attribution_campaign_attributions') }} c
    on c.campaign = s.campaign and s.spend_tstamp < cv_tstamp 
    and s.spend_tstamp > {{ snowplow_utils.timestamp_add('day', -90, 'cv_tstamp') }}
```

Next the model is aggregating data from both the channel and campaign attributions table by conversion, summing up all the different kinds of attribution (first touch, last touch etc.)

Here comes the second time based filter which you might want to adjust. Depending on whether you run your package based on a rolling window or a specific conversion with start and end dates (aka a specific period which should be used in a drop and recompute manner with --full-refresh flag etc.) you filter on the data in the following manner:

  {% if not var('snowplow__conversion_window_start_date') == '' and not var('snowplow__conversion_window_end_date') == '' %}
    cv_tstamp >= '{{ var("snowplow__conversion_window_start_date") }}' and cv_tstamp < '{{ var("snowplow__conversion_window_end_date") }}'
  {% else %}
    cv_tstamp >= {{ snowplow_utils.timestamp_add('day', -var("snowplow__conversion_window_days"), last_processed_cv_tstamp) }}
  {% endif%}
  
Finally, the model takes the aggregated conversion level data and does a series of unions to aggregate metrics by attribution type (.first touch, last touch etc.) Here again you might want to adjust what specific metrics you are interested in, add your own etc.

## Running the Attribution Analysis with a specific conversion period only
By default the Attribution package is designed to be run incrementally. 
 
In case you only need ad hoc analysis studying only a specific conversion window and perhaps looking at a larger lookback period to gather a broader user journey, for cost saving purposes you might want to define a set period every time the model is run (e.g. on a monthly basis). 
 
In that case, you can simply overwrite both the `snowplow__conversion_window_start_date` and `snowplow__conversion_window_end_date` variables to decide on the period. In this case the default `snowplow__conversion_window_days` variable will be disregarded by the package.
 
Bear in mind that it needs a full-refresh every time you process the package:
 
```bash
 dbt run --select snowplow_web tag:snowplow_web_incremental --full-refresh --vars 'snowplow__allow_refresh: true'
```

## Bringing your own sources - customizing the paths_to_conversions() macro

There may be cases where you opt for not relying on the snowplow-unified based source tables. The main thing to care about is that you have a joined user_id in both the conversion and path source. The package provides a mechanism to add a user stitching with the user of a user_mapping table that you can also define as a source, but most likely you already have that unique user id in your own data. 

In theory, you could create a view on top of your source data to make sure you align the expected input fields (e.g. call the unique user_id `stitched_user_id`) and align variables to fit that logic (e.g. making sure you set the variable `snowplow__conversion_stitching` to True, indicating to the model that you already have the id available for the model to use without having to rely on the user mapping table to do that for you, like users who rely on the unified package would probably want).

However, a more convenient option is probably to add a `paths_to_conversions()` macro to your package overwriting the dispatch macro with the same name provided by the package to change the logic to fit your needs.


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

You would most probably need to touch the `paths` and `conversions` cte to adjust how your data is getting processed incrementally from your custom sources. The `string_aggs` cte joins them into a stringified path of the user journeys / conversion. These stings are then converted to `arrays` in the subsequent cte. 

After that there is a separate macro called `transform_paths` that is being called to provide the sql for the path transformations. It is quite complex, uses generative sql based on the path transformation array provided as a variable to generate specific cts as they are required to simplify the paths for easier comparative analysis. 

After that the macro just selects the final paths_to_conversion data that will be used for the incremental update for a given run for this derived table.
