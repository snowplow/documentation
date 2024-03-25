---
title: "Attribution Modeling"
sidebar_position: 3
sidebar_label: "Attribution Modeling"
---

:::caution

This data app is currently in Private Preview and features may change without notice. 

:::

In today's increasingly complex digital world, users often take multi-channel journeys before converting. Assigning credit across multiple touchpoints is vital to getting an accurate picture of the efficacy of your marketing channels, yet requires merging disparate datasets and running complex calculations.

Our **Attribution modeling** app lowers the barrier to entry for your marketing team through the following features:

- Incremental SQL model in your warehouse for cost-effective computation
- Choice of first-touch, last-touch, linear and positional methods, with additional filters and transforms available
- Reports for conversions, revenue, spend and ROAS per channel and campaign
- Specify your own advertising spend table to generate a Return on Ad Spend analysis
- Intermediate tables that you can build your own attribution models on top of


## Requirements

- [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) enabled
- [Campaign Attribution enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) enabled
- [IP Lookup enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) enabled
- [Referrer Parser enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md) enabled


- Running the [Snowplow Unified Digital dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) with `conversion event(s)` defined, with `snowplow__total_all_conversions` set to `true`
- Running the [Snowplow Attribution dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md) with `conversion event(s)` defined, with `snowplow__total_all_conversions` set to `true`
- Access to the derived tables granted to the role used when setting up the data app

## Preparing Views for the Dashboards
Note that all these settings are global for all users, meaning if you change them they will be changed for everyone. The first user of the app will have to define at least one `View` which is the dataset needed to generate the charts. Defining a View can be done on the `Settings` page.

### Defining a Last N Days (auto-refreshed) View
The so-called `Default` view is to be used for generating a dataset that has a rolling conversion window of last nth day and will be refreshed automatically. The app will save the last-refreshed date with the View configurations and any subsequent day a user logs back in the app, a query will run in the background to look for any newly processed conversion event in the conversion source and if there is, the default dataset is refreshed by running all the queries that are needed to generate data for the charts to populate. Once the update finishes the conversion window should display the new date range.

#### Basic setup:
1. Set the `auto-update days`: the number of days since the last conversion event defined here will define the conversion window.
2. Set a `currency symbol` (defaults to £)
3. Decide if you would like to `use Non-Conversions`:
Use this with caution, currently it uses the `snowplow_attribution_paths_to_non_conversion` table as is without considering the conversion period. The intention is to make this a fully automated feature in the near future so watch for updates on this.

#### Connect your Data Sources:
1. Select your schema that contains the derived unified and attribution tables: this will trigger an update which checks for any tables with the names closest to what the app expects.
2. After waiting for the update to take place you can revise if the auto-detected source tables are in line with your expectations, you can change them to any other existing tables you have in case they are not correct.
3. Overwrite the attribution_manifest table. Most likely the schema name will have to be modified. Please keep the `schema_name.table_name` notation here. Make sure you press enter once modified.
4. (Optional but recommended) Specify the Spend Source: this will most likely be a view you created on top of your table that holds your marketing spend data. The view should make sure you align the expected field names. It should have `campaign`, `channek`, `spend` and `spend_tstamp` for the analysis to work. Doing this will make sure you have return on advertising spend (ROAS) calculation in your overview. Make sure you press enter once modified.

Once happy with all the imputs press `Create View` button. It will first run a validation against the data sources making sure it has all the fields it needs. After that it will run the queries that generate the data necessary to populate the dashboards. They will be saved as csv files that app will read from when selecting the View on the sidebar.

### Defining a Custom Date Range (static) View
Any other View that is not the Default will have to be given a name and will typically be used to generate a fixed dataset (e.g. Jan, Q1, 2023) to avoid having to recalculate the analysis for subsequent users.

Apart from giving it a name, the static views the steps are almost the same, but here instead of giving it an Nth number of refresh days you must define a fixed conversion window by selecting the appropriate date range with the date picker tool (which gets activated by clicking on the default date range). 

## Using the Dashboard
Once the Data Analyst or Engineer that knows how to set up the view configured one, users that are only interested in the Dashboard can just use the Attribution Dashboard to review the results of the analysis. There are various filters that make this interactive. Because the data is already saved users can make any of these interactive changes without affecting the warehouse to avoid expensive queries or laggy information retrieval.

### Sidebar filters
Filters on the sidebar refer to all of the dashboard tabs so you only have to change them once. The only exception to this is the Attribution Type, where

- select which `View` to use
- toggle between using `Campaign` or `Channel`
- select which Attribution Type to use (`Fist Touch`, `Last Touch`, `Linear` or `Position Based`)

### Dashboard specific filters

- `Remove paths with only 1 touchpoint`: this exclude paths with only one touch point to make it more useful in certain scenarios
- `Top N Filter`: filter your charts according to the top nth value
