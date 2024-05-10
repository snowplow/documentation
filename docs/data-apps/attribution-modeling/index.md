---
title: "Attribution Modeling"
sidebar_position: 3
sidebar_label: "Attribution Modeling"
---

:::caution

This data app is currently in Private Preview and features may change without notice. 

:::

In today's increasingly complex digital world, users often take multi-channel journeys before converting. Assigning credit across multiple touchpoints is vital to getting an accurate picture of the efficacy of your marketing channels, yet requires merging disparate datasets and running complex calculations.

Our **Attribution modeling** app (together with the [Snowplow Attribution dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md)) lowers the barrier to entry for your marketing team through the following features:

- Incremental SQL model in your warehouse for cost-effective computation
- Choice of first-touch, last-touch, linear and positional methods, with additional filters and transforms available
- Reports for conversions, revenue, spend and Return On Advertising Spend (ROAS) per channel and campaign
- Option to specify your own touchpoint and advertising spend tables
- Intermediate tables that you can build your own attribution models on top of


## Requirements

- [Campaign Attribution enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) enabled
- [Referrer Parser enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md) enabled
- Running the [Snowplow Unified Digital dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) with `conversion event(s)` defined and the optional conversion module enabled
- Running the [Snowplow Attribution dbt Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md)
- Access to the derived tables granted to the role used when setting up the data app

## Preparing Views for the Dashboards

Note that all these settings are global for all users, meaning if you change them they will be changed for everyone. The first user of the app will have to define at least one `View` which is the dataset needed to generate the charts. Defining a View can be done on the `Settings` page.

### 1. Basic Configurations

#### 1.1 Decide on the Update Method 

Use the toggle `Last N days View (Dynamic)` to choose whether your would like to define a dynamic view that auto-updates or a static view:

**Defining a Last N Days (Dynamic) View**

The so-called `Dynamic` views are to be used for generating datasets that have a rolling conversion window of last nth day and will be refreshed automatically (e.g. Last 30 days). The app will save the last-refreshed date with the View configurations and any subsequent day a user logs back in the app, a query will run in the background to look for any newly processed conversion event in the conversion source and if there is, the dynamic datasets are refreshed by running all the queries that are needed to generate data for the charts to populate. Once the update finishes the conversion window should display the new date range.

If you choose this option, set the `auto-update days`: the number of days since the last conversion event defined here will define the conversion window.

**Defining a Custom Date Range (static) View**

Non-dynamic views will have to be given a name and will typically be used to generate a fixed dataset (e.g. Jan, Q1, 2023) to avoid having to recalculate the analysis for subsequent users.

Define a fixed conversion window by selecting the appropriate date range with the date picker tool (which gets activated by clicking on the default date range). 

#### 1.2 Set a `currency symbol` (defaults to £)

#### 1.3 Decide if you would like to `use Non-Conversions`:

Use this with caution, currently it uses the `snowplow_attribution_paths_to_non_conversion` table as is without considering the conversion period. The intention is to make this a fully automated feature in the near future so watch for updates on this.


### 2. Connect your Data Sources:

1. Select your schema that contains the derived unified and attribution tables: this will trigger an update which checks for any tables with the names closest to what the app expects.
2. After waiting for the update to take place you can revise if the auto-detected source tables are in line with your expectations, you can change them to any other existing tables you have in case they are not correct.
3. Overwrite the attribution_manifest table. Most likely the schema name will have to be modified. Please keep the `schema_name.table_name` notation here. Make sure you press enter once modified.
4. (Optional but recommended) Specify the Spend Source: this will most likely be a view you created on top of your table that holds your marketing spend data. The view should make sure you align the expected field names. It should have `campaign`, `channel`, `spend` and `spend_tstamp` for the analysis to work. Doing this will make sure you have Return On Advertising Spend (ROAS) calculation in your overview. Make sure you press enter once modified.

Once happy with all the imputs press `Create View` button. It will first run a validation against the data sources making sure it has all the fields it needs. After that it will run the queries that generate the data necessary to populate the dashboards. They will be saved as csv files that app will read from when selecting the View on the sidebar.


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
