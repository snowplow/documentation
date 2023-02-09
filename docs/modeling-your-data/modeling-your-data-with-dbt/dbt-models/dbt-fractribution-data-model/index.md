---
title: "The Fractribution data model"
date: "2022-12-01"
sidebar_position: 105
---
​
```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
```
​
# Snowplow Fractribution Package
​
**The package source code can be found in the [snowplow/dbt-snowplow-fractribution repo](https://github.com/snowplow/dbt-snowplow-fractribution), and the docs for the [macro design are here](https://snowplow.github.io/dbt-snowplow-fractribution/#/overview/snowplow_fractribution). If you would like to follow the Fractribution accelerator, which includes sample data, [see here](https://docs.snowplow.io/accelerators/snowplow-fractribution/)**
​
## Overview
​
Snowplow Fractribution is a marketing attribution model for dbt. The name itself comes from `Fractional attribution`, which allows you to attribute the value of a conversion to one or more channels depending on the conversion pathway. As a result, it becomes possible to determine the revenue per channel, as well as ROAS (the amount of revenue that is earned for every dollar spent on advertising) once you have cost data for each marketing channel.
​
This package consists of a series of dbt models that produce the following tables:
​
- **snowplow_fractribution_channel_counts**: Number of sessions grouped by channel, campaign, source and medium
- **snowplow_fractribution_channel_spend**: Spend on each channel, used in ROAS calculations
- **snowplow_fractribution_conversions_by_customer_id**: Conversion revenue for each conversion, along with the associated customerid
- **snowplow_fractribution_path_summary**: Summary of different path combinations and associated conversion/non-conversions
- **snowplow_fractribution_paths_to_conversion**: Path combinations leading to conversion
- **snowplow_fractribution_paths_to_non_conversion**: Path combinations leading to non-conversion
- **snowplow_fractribution_sessions_by_customer_id**: Channel information by session timestamp, where an event timestamp is considered as the session start
​
Once the models are generated, the next step is to run a python script which is included in the package to run the fractribution calculations. In the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section you will find a detailed step-by-step guide on how to operate the package as a whole.

This will generate and populate the following three tables:

- `snowplow_fractribution_channel_attribution`: The main output table that shows conversions, revenue, spend and ROAS per channel
- `snowplow_fractribution_path_summary_with_channels`: The conversion and revenue attribution per channel (used to create the report table)
- `snowplow_fractribution_report_table`: An intermediate table that shows, for each unique path, a summary of conversions, non conversions and revenue, as well as which channels were assigned a contribution

In the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section you will find a detailed step-by-step guide on how to operate the package as a whole.
​
### Intrasession Channels
​
In Google Analytics (Universal Analytics) a new session is started if a campaign source changes (referrer of campaign tagged URL) which is used in Fractribution. Snowplow utilises activity based sessionisation rather than campaign based sessionisation. Setting `consider_intrasession_channels` to `false` will take only the campaign information from the first page view in a given Snowplow session and not give credit to other channels in the converting session if they occur after the initial page view.
​
 ### Path Transform Options
​
 Paths to conversion are often similar, but not identical. As such, path transforms reduce unnecessary complexity in similar paths before running the attribution algorithm.
​
 1. **Exposure (default in this package)**: the same events in succession are reduced to one: `A → A → B` becomes `A → B`, a compromise between first and unique
 2. **Unique**: all events in a path are treated as unique (no reduction of complexity). Best for smaller datasets (small lookback window) without a lot of retargeting
 3. **First**: keep only the first occurrence of any event: `A → B → A` becomes `A → B`, best for brand awareness marketing
 4. **Frequency**: keep a count of the events’ frequency: `A → A → B` becomes `A(2) → B`, best when there is a lot of retargeting
​
​
### Attribution Models
- **shapley** (default): Takes the weighted average of the marginal contributions of each channel to a conversion
- **first_touch**: Assigns 100% attribution to the first channel in each path.
- **last_touch**: Assigns 100% attribution to the last channel in each path.
- **position_based**: The first and last channels get 40% of the credit each, with the remaining channels getting the leftover 20% distributed evenly.
- **linear**: Assigns attribution evenly between all channels on the path.
​
***
**Attribution models:**
<ThemedImage
        alt='Data processing model for the normalize package'
        sources={{
          light: require('./images/attribution_models_light.png').default,
          dark: require('./images/attribution_models_dark.png').default
          }}
      />
​
​
### Setup steps
​
1. Fractribution is dependent on the snowplow_web_page_views model created by the snowplow_web dbt package. Run [snowplow_web](https://github.com/snowplow/dbt-snowplow-web) if you do not have data in the snowplow_web_page_views table for the period of time you will run fractribution for.
2. Configure the `conversion_clause` macro to filter your raw Snowplow events to successful conversion events.
3. Configure the `conversion_value` macro to return the value of the conversion event.
4. Configure the default `channel_classification` macro to yield your expected channels. The ROAS calculations / attribution calculations will run against these channel definitions.
5. Configure the `channel_spend` macro to query your own spend data if you do not wish to use the default values.
6. Configure environment variables to be used by the python file specific to your warehouse (either `main_snowplow_bigquery.py`, `main_snowplow_databricks.py` or `main_snowplow_snowflake.py`) to enable you to connect.
7. Overwrite default variables provided by the package in your dbt_project.yml file, if necessary. E.g.: make sure your `snowplow__page_views_source` and `snowplow__conversions_source` are aligned to what is available in your warehouse, and update `snowplow__conversion_window_start_date` and `snowplow__conversion_window_end_date` if you don't want the default of the last 30 days.
​
### Running
​
1. Ensure the setup steps have been completed above.
2. Run `dbt run`, or `dbt run --select package:fractribution`
3. Run the correct python script for the data warehouse you are using, e.g. `python utils/main_snowplow_snowflake.py --conversion_window_start_date '2022-06-03' --conversion_window_end_date '2022-08-01'` for Snowflake, or `python utils/main_snowplow_bigquery.py --conversion_window_start_date '2022-06-03' --conversion_window_end_date '2022-08-01'` for Bigquery. Set these conversion_window dates to represent the last 30 days if you left these variables blank in the dbt_project.yml file. You can optionally add the attribution_model flag if you do not want the default of `shapley`.
​
​
### Differences to Google's Fractribution
​
There are some changes from [Google's](https://github.com/google/fractribution) Fractribution code that have been noted below.
​
- Temporary UDFs have been converted to persistent / permanent UDFs
- Some temporary tables converted to permanent tables
- Users without a user_id are treated as 'anonymous' ('f') users and the domain_userid is used to identify these sessions
- Users with a user_id are treated as identified ('u') users
- Templating is now run almost entirely within dbt rather than the custom SQL / Jinja templating in the original Fractribution project
- Channel changes and contributions within a session can be considered using the `consider_intrasession_channels` variable
