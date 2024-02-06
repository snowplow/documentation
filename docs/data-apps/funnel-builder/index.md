---
title: "Funnel Builder"
sidebar_position: 2
sidebar_label: "Funnel Builder"
---

:::caution

This data app is currently in Public Preview and features may changes without notice. 

:::

## Introduction

Funnels are an essential tool for understanding user journeys on your app or website. They help to visualize how many users complete each event along a journey such as signing up or making a purchase, so you can understand which stages are leading to the most drop-off and make changes to improve conversion rates. 

This data application provides an intuitive UI for building a funnel analysis and visualizing the results. You can specify any number of conditions and steps, and will receive the following outputs when you run the analysis: 
- User Counts by Funnel Step Chart
- Conversion Rates Chart
- Abandonment Rates Chart
- Summary Statistics Table

It works on any table that Snowplow’s Data Modeling User has access to, including `atomic.events` and derived tables. It comes with some pre-built funnels based on out-of-the-box Snowplow events such as `page_views` and `link_clicks`, and you can save your own custom funnels to share with teammates.

### Requirements

- Access to the table(s) you wish to run the tool on granted to the role used when setting up the data app

## Usage
### Building a funnel

We suggest you get started by viewing an example funnel, and we have included several out-of-the-box funnels based on standard Snowplow tracking on the `Welcome` tab. Selecting a saved funnel or creating a new funnel will take you to the `Define and View your Funnel` tab, which has the following options:

#### Schema and Table

Here you can select which warehouse schema and table you want to run the analysis on. If you select `atomic.events`, we have included some additional functionality allowing you to reference properties inside nested columns, otherwise you can only reference flat columns.


#### Pre-filter
This applies a filter to all funnel events. To minimize query costs, we **highly** recommend including a filter on the partition key of your table. For `atomic.events`, this is usually `collector_tstamp` or `derived_tstamp` for BigQuery, but may more recently be `load_tstamp`.

#### Funnel Steps

Here you can define an unlimited number of steps. Each step requires a name and one or more rules, which can be combined together using conditional logic. 

### Additional Settings

You can customize your funnel by changing the following values: 
- **Order events by -** This must be a timestamp column. If you have added a date range pre-filter, make sure that it is the same field as this one
- **Group funnels by -** Choose a field to group the funnels by - we recommend user or session identifiers
- **Additional columns to group by -** Use this to visualize additional dimensions in your funnel analysis e.g. experiment groups
- **Max days since funnel start** - Maximum days since the funnel's start for an event to still be considered part of that funnel. Set to 0 for unlimited
- **Intra step time (hours)** - Maximum hours since an event for the next to be included in the same funnel. Set to 0 for unlimited

### Outputs
Clicking `Build Funnel Charts` will generate several interactive charts and tables. You can also download the generated SQL to edit or rerun in your own environment. Once you are happy with the settings of your funnel you can save it for anyone to open and use, and you can also save the results of a given run to a table in your warehouse in the settings tab.

If you would like to visualize these funnels in a different tool, the `Next Steps` tab contains instructions on how to run the generated SQL and recreate the analysis in the following tools: 
- Looker
- PowerBI
- Tableau
- Preset
- Streamlit
