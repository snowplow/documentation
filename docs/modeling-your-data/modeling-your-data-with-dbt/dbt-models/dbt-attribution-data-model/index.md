---
title: "Attribution"
sidebar_position: 400
hide_title: true
---

```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
import Badges from '@site/src/components/Badges';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Badges badgeType="dbt-package Release" pkg="attribution">&nbsp;</Badges>&nbsp;
<Badges badgeType="Maintained"></Badges>


# Snowplow Attribution Package
​
**The package source code can be found in the [snowplow/dbt-snowplow-attribution repo](https://github.com/snowplow/dbt-snowplow-attribution), and the docs for the [macro design are here](https://snowplow.github.io/dbt-snowplow-attribution/#/overview/snowplow_attribution).
​
:::note

Although there is no direct dependency, by default the attribution package is dependent on the `snowplow_unified_views` as well as the `snowplow_unified_conversions` table created by the [snowplow_unified](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) dbt package. As long as the field names are matched you can use other source tables, too.

:::

## Overview
​
The Snowplow Attribution dbt package produces a set of incremental derived tables to provide a basis for in-depth **Marketing Attribution Analysis** on an ongoing basis. It allows you to attribute the value of a conversion to one or more channels and campaigns depending on the conversion pathway. As a result, it becomes possible to determine the revenue per pathway (channel or campaign), as well as ROAS (Return On Ad Spend - the amount of revenue that is earned for every dollar spent on advertising) once you have cost data for each marketing channel or campaign.

This package consists of a series of dbt models that produce the following tables:

- `snowplow_attribution_paths_to_conversion`: Customer id and the paths the customer has followed that have led to conversion
- `snowplow_attribution_campaign_attributions`: By campaign path and conversion level incremental table that attributes the conversion value based on various algorythms
- `snowplow_attribution_channel_attributions`: By channel path and conversion level incremental table that attributes the conversion value based on various algorithms
- `snowplow_attribution_overview`: The user defined report view (potenitally showing ROIs)
- `snowplow_attribution_path_summary`: For each unique path, a summary of associated conversions, optionally non-conversions and revenue
- `snowplow_attribution_paths_to_non_conversion`: Customer id and the the paths the customer has followed that have not lead to conversion

In the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section you will find a step-by-step guide on how to operate the package as a whole.

## What is Marketing Attribution?

Marketing attribution determines which marketing tactics are contributing to sales or conversions by analysing the marketing touchpoints a consumer encounters on their journey to purchase. The aim is to determine which channels and marketing campaigns had the greatest impact on the decision to convert. There are many popular attribution models used by marketers which give insight into customers' behaviours, more specifically the pathways they took to purchase the product or service. This allows marketing teams to improve ROI by changing marketing strategies and campaigns.

## How to do Marketing Attribution with Snowplow?

In the past have taken Google's attribution model as a base (fractribution) and converted it into a dbt based tool. We considered the dbt-snowplow-fractribution package as an exploratory tool for ad-hoc analysis. The data was modelled then the more complex attribution analysis was run on python for efficiency.

Due to customer demand we have also created this package, where we are taking this a step further as the data model can be run on a continuous basis so that the attribution analysis can be done any time in a cost effective and timely manner without the need of python for several marketing attribution algorithms.

In the below guide we will walk you through the data transformation process step-by-step in order for your to see how the source data changes downstream to give you and your team a transparent and easy-to-understand way to understand how this package will get you the valuable insights.

## Sources you are going to need

### 1. Conversion source

You will also need a table where the conversion events are stored. If you use the snowplow_unified model and configure conversions to be modelled, you will have this information in your `derived.snowplow_unified_conversions` table:

| USER_IDENTIFIER                      | USER_ID | START_TSTAMP          | CV_VALUE       |
|--------------------------------------|---------|-----------------------|----------------|
| a20e6f10-35c2-45e4-9944-a001029f4041 | user1   | 2022-06-08 08:11      | 94.42          |
| fe6604e5-aec9-4ef6-85a1-417884a9fd26 | user2   | 2022-06-09 12:03      | 206.5          |
| d1edd215-7da2-4e13-aa16-31e4cd74d417 | user3   | 2022-06-09 15:02      | 5              |

...

:::tip
To fully finish the config you could overwrite the `var('snowplow__conversion_clause)` variable in your project.yml, in case you would want to filter on specific types of conversions. You should also set the `var('snowplow__conversion_stitching')` to true, if you have stitched_user_id in your conversions table.
:::

### 2. Path source

Finally, you will also need a source table to track your user journey / path with fields to be able to classify your marketing channels. The perfect table for this is your `derived.snowplow_unified_views` table:

| USER_IDENTIFIER                      | USER_ID | START_TSTAMP     | MKT_MEDIUM | MKT_SOURCE  |
|--------------------------------------|---------|------------------|------------|-------------|
| 6f9056af-d627-474b-903a-467296855146 | user1  | 2022-06-04 06:12  | organic    | google      |
| 6f9056af-d627-474b-903a-467296855146 | user1  | 2022-06-05 14:45  | cpc        | youtube.com |
| 1a1aaf4a-e6c3-4ae0-9472-8730d08c9ef7 | user2  | 2022-06-04 18:13  | referral   | quora.com   |


:::tip
To fully finish the config you might need to overwrite the `channel_classification()` macro. In case your classification logic for attribution analysis needs to be the same as the one already configured in the snowplow_unified model you can simply leave the default macro which refers to that field.
:::
### 3. Channel spend information (optional, for reporting)

You most likely have a warehouse with marketing (ad) spend information by channel and date, something like this:

| CHANNEL           | SPEND | SPEND_TSTAMP     |
|-------------------|-------|------------------|
| Paid_Search_Other | 10000 | 2022-05-04 18:32 |
| Video             | 10000 | 2022-05-04 18:32 |

We provided a sql script to create a reporting view in the `attribution_overview()` macro that you can overwrite to suit your specific analytical needs, however as long as you name the fields the same in the `var('snowplow__spend_source')` it should work right away.

### One-off setup

Once you have the sources ready you need to adjust the package settings that fit your business logic. This has to be done once, otherwise your data might be misaligned due to the incremental logic or you would need to run a full-refresh:

#### Decide on your sessionization logic

By default Snowplow only considers the first pageview of a session important from an attribution point of view and disregards campaign information from subsequent page_views. Google Analytics, on the other hand separates session as soon as campaign information is given. Set `var('consider_intrasession_channels')` variable to true in case you would like to follow GA's logic, not Snowplow's. If you opt for this calculation consider changing the `var('snowplow__conversion_path_source')` to `{{ target.schema }}.derived.snowplow_unified_sessions` for performance benefits.

#### Decide on your conversion hosts

Use the variable `snowplow__conversion_hosts` to restrict which hosts to take into account for conversions.

#### Filter unwanted / wanted channels & campaigns

You can specify a list of channels for the variable `snowplow__channels_to_exclude` to exclude them from analysis (if kept empty all channels are kept). For example, users may want to exclude the 'Direct' channel from the analysis.

You can also do the opposite, filter on certain channels to include in your analysis. You can do so by specifying them in the list captured within the variable `snowplow__channels_to_include`.

You can do either for campaigns, too, with the `snowplow__channels_to_exclude` and `snowplow__channels_to_include` variables.
​
 #### Reduce the number of paths to analyse
​
 Paths to conversion are often similar, but not identical. As such, path transforms reduce unnecessary complexity in similar paths before running the attribution algorithm. The following transformations are available:
​
 1. `exposure (default)`: the same events in succession are reduced to one: `A → A → B` becomes `A → B`, a compromise between first and unique
 2. `unique`: all events in a path are treated as unique (no reduction of complexity). Best for smaller datasets (small lookback window) without a lot of retargeting
 3. `first`: keep only the first occurrence of any event: `A → B → A` becomes `A → B`, best for brand awareness marketing
 4. `remove_if_last_and_not_all`: requires a channel to be added as a parameter, which gets removed from the latest paths unless it removes the whole path as it is trying to reach a non-matching channel parameter: E.g target element: `A` path: `A → B → A → A` becomes `A → B`
 5. `remove_if_not_all`: requires a channel to be added as a parameter, which gets removed from the path altogether unless it would result in the whole path's removal: E.g target element: `A` path: `A → B → A → A` becomes `B`
 
 Apart from this, you can also restrict how far in time (`var('snowplow_path_lookback_days')`) and steps (`var('snowplow_path_lookback_steps')`) you want to allow your path to go.
 
 #### Other, macro based setup

```mdx-code-block
import AttributionDbtMacros from "@site/docs/reusable/attribution-dbt-macros/_index.md"

<AttributionDbtMacros/>
```
## Output
### Incremental data models to prepare for attribution analysis:

1. The `derived.snowplow_attribution_paths_to_conversion` model will aggregate the paths the customer has followed that have lead to conversion based on the path transformation and other limitations such as the path_lookback_step or path_lookback_days variable. It basically combines the path and conversion source tables to produce an outcome like this:

| CUSTOMER_ID          | CV_TSTAMP         | REVENUE | CHANNEL_PATH                              | CHANNEL_TRANSFORMED_PATH  | CAMPAIGN_PATH | CAMPAIGN_TRANSFORMED_PATH |
|----------------------|-------------------|---------|-------------------------------------------|---------------------------|---------------|---------------------------|
| f0009028775170427694 | 2022-06-11 15:33  | 20.42   | Direct                                    | Direct                    | camp1 > camp2 | camp1 > camp2             |
| f0005094333993051683 | 2022-07-30 11:55  | 24      | Direct > Direct                           | Direct                    | camp1         | camp1                     |
| f000170187170673177  | 2022-06-08 20:18  | 50      | Direct > Direct                           | Direct                    | camp2 > camp1 | camp2 > camp1             |
| f0006148050225777094 | 2022-07-25 07:52  | 140     | Organic_Search > Direct > Organic_Search  | 

2. The `derived.snowplow_attribution_channel_attributions` unnests the paths from paths_to_conversion into their separate rows and calculates the attribution amount for that specific path step for each of the sql based attribution models:

**Attribution Models**

The package currently offers 4 different attribution models all of which are calculated by default into both the incremental base tables and the report tables. If you would like to filter on them for reporting you can do so with `var('snowplow__attribution_list')`. Please note, however, that they will still be available for the incremental base tables.

- `first_touch`: Assigns 100% attribution to the first channel in each path.
- `last_touch`: Assigns 100% attribution to the last channel in each path.
- `position_based`: The first and last channels get 40% of the credit each, with the remaining channels getting the leftover 20% distributed evenly.
- `linear`: Assigns attribution evenly between all channels on the path.
​
<p align="center">
<ThemedImage
alt='Data processing model for the attribution package'
sources={{
  light: require('./images/attribution_models_light.png').default,
  dark: require('./images/attribution_models_dark.png').default
}}
/>
</p>


| COMPOSITE_KEY                                       | EVENT_ID                             | CUSTOMER_ID          | CV_TSTAMP               | CV_TOTAL_REVENUE | CHANNEL_TRANSFORMED_PATH         | CHANNEL        | SOURCE_INDEX | PATH_LENGTH | FIRST_TOUCH_ATTRIBUTION | LAST_TOUCH_ATTRIBUTION | LINEAR_ATTRIBUTION | POSITION_BASED_ATTRIBUTION |
|-----------------------------------------------------|--------------------------------------|----------------------|-------------------------|------------------|----------------------------------|----------------|--------------|-------------|-------------------------|------------------------|--------------------|----------------------------|
| 9f80548b-5bb3-4d21-b78e-503ae6f8205eDirect0         | 9f80548b-5bb3-4d21-b78e-503ae6f8205e | f000170187170673177  | 2023-06-08 20:18:32.000 | 50               | Direct                           | Direct         | 0            | 1           | 50                      | 50                     | 50                 | 50                         |
| f9e6fa53-61f4-45f4-adb1-b75e018f8a32Direct0         | f9e6fa53-61f4-45f4-adb1-b75e018f8a32 | f0009028775170427694 | 2023-06-11 15:33:03.000 | 20.42            | Direct                           | Direct         | 0            | 1           | 20.42                   | 20.42                  | 20.42              | 20.42                      |
| c3bf5de5-20c7-42d6-9543-afd9ecf133f5Video0          | c3bf5de5-20c7-42d6-9543-afd9ecf133f5 | f0008284662789123943 | 2023-07-07 13:05:55.000 | 200              | Video                            | Video          | 0            | 1           | 200                     | 200                    | 200                | 200                        |
| 1487c09f-f17f-4c76-990e-55c46f8f621cDisplay_Other0  | 1487c09f-f17f-4c76-990e-55c46f8f621c | f0006911334202687206 | 2023-07-19 04:27:51.000 | 66.5             | Display_Other > Organic_Search   | Display_Other  | 0            | 2           | 66.5                    | 0                      | 33.

3. The `derived.snowplow_attribution_campaign_attributions` does the same, only for campaigns not channels.

### Drop and recompute reporting tables/views:

1. The `derived.snowplow_attribution_path_summary` shows the campaign/channel paths and the assiciated conversions (an optionally non-conversions, if the `path_to_non_conversions` table is enabled through its related variable `enable_path_to_non_conversions`)

| TRANSFORMED_PATH                   | CONVERSIONS | NON_CONVERSIONS | REVENUE  |
|------------------------------------|-------------|-----------------|----------|
| Direct                             | 3           | 25              | 94.42    |
| Organic_Search                     | 2           | 26              | 206.5    |
| Referral > Direct                  | 0           | 1               | 0        |
| Video                              | 1           | 2               | 200      |
| Organic_Search > Paid_Search_Other | 0           | 2               | 0        |


2. The view called `derived.snowplow_attribution_overview` is tied to a dispatch macro of the same name which lets you overwrite in your proects macros, if needed. Given you specify your `var('snowplow__spend_source')` it will calculate the ROAS for you for each channel and campaign:


| PATH_TYPE | ATTRIBUTION_TYPE | TOUCH_POINT| IN_N_CONVERSION_PATHS | ATTRIBUTED_CONVERSIONS | MIN_CV_TSTAMP | MAX_CV_TSTAMP | SPEND | SUM_CV_TOTAL_REVENUE | ATTRIBUTED_REVENUE | ROAS |
|----------|-------------|----------------|---|----------------|-------------------------|-------------------------|--------|------------|------------------|----------------|
| campaign | first_touch | Campaign 2     | 2 | 1.000000000000 | 2023-07-19 04:27:51.000 | 2023-07-25 07:52:34.000 | 100000 | 206.500000 | 206.500000000000 | 0.002065000000 |
| campaign | last_touch  | Campaign 1     | 3 | 1.000000000000 | 2023-07-07 13:05:55.000 | 2023-07-30 11:55:24.000 | 100000 | 364.000000 | 364.000000000000 | 0.003640000000 |
| channel  | first_touch | Display_Other  | 1 | 1.000000000000 | 2023-07-19 04:27:51.000 | 2023-07-19 04:27:51.000 | 100000 | 66.500000  | 66.500000000000  | 0.000665000000 |
| channel  | first_touch | Organic_Search | 2 | 0.000000000000 | 2023-07-19 04:27:51.000 | 2023-07-25 07:52:34.

### Manifest table

We have included a manifest table to log information about the setup variables each time the `paths_to_conversion` incremental table runs to help prevent and debug issues.
