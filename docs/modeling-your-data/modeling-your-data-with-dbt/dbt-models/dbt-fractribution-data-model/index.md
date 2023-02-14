---
title: "Fractribution"
sidebar_position: 106
hide_title: true
---

```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
import Badges from '@site/src/components/Badges';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Badges badgeType="dbt-package Release" pkg="fractribution"></Badges> ​<Badges badgeType="Docker Pulls" repo="snowplow/fractribution"></Badges>  


# Snowplow Fractribution Package
​
**The package source code can be found in the [snowplow/dbt-snowplow-fractribution repo](https://github.com/snowplow/dbt-snowplow-fractribution), and the docs for the [macro design are here](https://snowplow.github.io/dbt-snowplow-fractribution/#/overview/snowplow_fractribution). If you would like to follow the Fractribution accelerator, which includes sample data, [see here](https://docs.snowplow.io/accelerators/snowplow-fractribution/)**
​
:::note

The Fractribution package is dependent on the `snowplow_web_page_views` model created by the [snowplow_web](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) dbt package. Run [snowplow_web](https://github.com/snowplow/dbt-snowplow-web) if you do not have data in the `snowplow_web_page_views` table for the period of time you will run fractribution for.

:::

## Overview
​
Snowplow Fractribution is a marketing attribution model for dbt. The name itself comes from `Fractional attribution`, which allows you to attribute the value of a conversion to one or more channels depending on the conversion pathway. As a result, it becomes possible to determine the revenue per channel, as well as ROAS (Return On Ad Spend - the amount of revenue that is earned for every dollar spent on advertising) once you have cost data for each marketing channel.
​

This package consists of a series of dbt models that produce the following tables:

- `snowplow_fractribution_channel_counts`: Number of sessions grouped by channel, campaign, source and medium
- `snowplow_fractribution_channel_spend`: Spend on each channel, used in ROAS calculations
- `snowplow_fractribution_conversions_by_customer_id`: Conversion revenue for each conversion, along with the associated `customerid`
- `snowplow_fractribution_path_summary`: Summary of different path combinations and associated conversion/non-conversions
- `snowplow_fractribution_paths_to_conversion`: Path combinations leading to conversion
- `snowplow_fractribution_paths_to_non_conversion`: Path combinations leading to non-conversion
- `snowplow_fractribution_sessions_by_customer_id`: Channel information by session timestamp, where an event timestamp is considered as the session start
​

Once the models are generated, the next step is to run a python script which is included in the package to run the fractribution calculations. In the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section you will find a step-by-step guide on how to operate the package as a whole.

This script will generate and populate the following three additional tables:

- `snowplow_fractribution_channel_attribution`: The main output table that shows conversions, revenue, spend and ROAS per channel
- `snowplow_fractribution_path_summary_with_channels`: The conversion and revenue attribution per channel (used to create the report table)
- `snowplow_fractribution_report_table`: An intermediate table that shows, for each unique path, a summary of conversions, non conversions and revenue, as well as which channels were assigned a contribution
​
### Intra-session Channels
​
In Google Analytics (Universal Analytics) a new session is started if a campaign source changes (referrer of campaign tagged URL) which is used in Fractribution. Snowplow utilizes activity based sessionization, rather than campaign based sessionization. Setting `consider_intrasession_channels` to `false` will take only the campaign information from the first page view in a given Snowplow session, and not give credit to other channels in the converting session if they occur after the initial page view.
​
 ### Path Transform Options
​
 Paths to conversion are often similar, but not identical. As such, path transforms reduce unnecessary complexity in similar paths before running the attribution algorithm.
​
 1. `exposure (default)`: the same events in succession are reduced to one: `A → A → B` becomes `A → B`, a compromise between first and unique
 2. `unique`: all events in a path are treated as unique (no reduction of complexity). Best for smaller datasets (small lookback window) without a lot of retargeting
 3. `first`: keep only the first occurrence of any event: `A → B → A` becomes `A → B`, best for brand awareness marketing
 4. `frequency`: keep a count of the events’ frequency: `A → A → B` becomes `A(2) → B`, best when there is a lot of retargeting
 5. `remove_if_last_and_not_all`: requires a channel to be added as a parameter, which gets removed from the latest paths unless it removes the whole path as it is trying to reach a non-matching channel param: `A` path: `A → B → A → A` becomes `A → B`
 6. `remove_if_not_all`: requires a channel to be added as a parameter, which gets removed from the path altogether unless it would result in the whole path's removal: `A` path: `A → B → A → A` becomes `B`
​
### Attribution Models

The package currently offers 5 different attribution models, that can be chosen by setting the `attribution_model` flag when calling the python script.

- `shapley` (default): Takes the weighted average of the marginal contributions of each channel to a conversion
- `first_touch`: Assigns 100% attribution to the first channel in each path.
- `last_touch`: Assigns 100% attribution to the last channel in each path.
- `position_based`: The first and last channels get 40% of the credit each, with the remaining channels getting the leftover 20% distributed evenly.
- `linear`: Assigns attribution evenly between all channels on the path.
​

<ThemedImage
  alt='Data processing model for the normalize package'
  sources={{
    light: require('./images/attribution_models_light.png').default,
    dark: require('./images/attribution_models_dark.png').default
    }}/>

### Package Macros

```mdx-code-block
import FractributionDbtMacros from "@site/docs/reusable/fractribution-dbt-macros/_index.md"

<FractributionDbtMacros/>
```

### Environment Variables 
For the package to run you need to set some environment variables that can be accessed by the python script to connect to your warehouse. These variables vary by warehouse.

<Tabs groupId="warehouse">
<TabItem value="bigquery" label="BigQuery" default>

- `project_id`: Project id of your BigQuery warehouse
- `bigquery_dataset`: Dataset for your derived tables
- `google_application_credentials`: Google Service Account JSON file

</TabItem>
<TabItem value="databricks" label="Databricks">

- `databricks_schema`: Schema for your derived tables
- `databricks_server_hostname`: Databricks server hostname
- `databricks_http_path`: Databricks compute resources URL
- `databricks_token`: Personal Access Token

</TabItem>
<TabItem value="snowflake" label="Snowflake">

- `snowflake_account`: Snowflake account ID
- `snowflake_user`: Snowflake username
- `snowflake_password`: Snowflake password
- `snowflake_user_role`: Snowflake role
- `snowflake_warehouse`: Snowflake warehouse
- `snowflake_database`: Snowflake database
- `snowflake_schema`: Schema for your derived tables

</TabItem>
</Tabs>

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
