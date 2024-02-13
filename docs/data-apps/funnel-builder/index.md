---
title: "Funnel Builder"
sidebar_position: 2
sidebar_label: "Funnel Builder"
---

```mdx-code-block
import MainImage from './images/ecommerce-full-page.png';
import TableAndSchemaImage from './images/table-and-schema.png';
import FilterImage from './images/filter.png';
import StepImage from './images/step.png';
import SettingsImage from './images/settings.png';
```

:::caution

This data app is currently in Public Preview and features may changes without notice. 

:::

## Introduction

Funnels are an essential tool for understanding user journeys on your app or website. They help to visualize how many users complete each event along a journey such as signing up or making a purchase, so you can understand which stages are leading to the most drop-off and make changes to improve conversion rates. 

This data application provides an intuitive UI for building a funnel analysis and visualizing the results. You can specify any number of conditions and steps, and will receive the following outputs when you run the analysis (see screenshots below): 

- User Counts by Funnel Step Chart
- Conversion Rates Chart
- Abandonment Rates Chart
- Summary Statistics Table

It works on any table that Snowplow’s Data Modeling User has access to, including the atomic events table and derived tables. It comes with some pre-built funnels based on out-of-the-box Snowplow events such as `page_views` and `link_clicks`, and you can save your own custom funnels to share with teammates.

### Requirements

- Access to the table(s) you wish to run the tool on granted to the role used when setting up the data app

![Screenshot of a funnel configuration with built funnel charts.](./images/ecommerce-full-page.png)

## Usage – Building a funnel

The following steps will guide you through building a funnel using the app.

### Step 1: Start from template or create a new funnel

The main page of the app shows a list of example funnels for common use cases (e.g., e-commerce) to get you started.

You can choose to start using one of the templates or create a new funnel configuration from scratch.

### Step 2: Choose your funnel name, database schema and table

A page with the funnel configuration will be shown.

First, you are asked to provide a name for the funnel, which will be used to identify it.

Next, you can select which warehouse schema and table you want to run the analysis on.
If you select the atomic events table, we have included some additional functionality allowing you to reference properties inside nested columns, otherwise you can only reference flat columns.

<img src={TableAndSchemaImage} alt="Form to choose the funnel name, warehouse schema and table" style={{maxWidth: "400px"}} />

### Step 3: Configure filter conditions

To minimize query costs, we **highly** recommend including a filter on the partition key of your table.
For the atomic events table, this is usually `collector_tstamp` or `derived_tstamp` for BigQuery, but may more recently be `load_tstamp`.

You can add filter conditions to select a subset of events to be used by the funnel using the partition or other columns of the table.

<img src={FilterImage} alt="Filter rules to select a subset of events to consider in the funnel." style={{maxWidth: "400px"}} />

### Step 4: Define funnel steps

Next, you are asked to define rules for the funnel steps.
Each step requires a name and one or more rules, which can be combined together using conditional logic. 
You can define an unlimited number of steps.

<img src={StepImage} alt="An example funnel step configuration." style={{maxWidth: "400px"}} />

:::note The `Update Steps` button
Whenever you make a change to the funnel steps or the filter rules, it is necessary to click the `Update Steps` button.
:::

### Step 5: Check additional settings

There are a range of other options you can use to configure the funnel.
Use the `Settings` tab to update the following configuration if you prefer (or keep the defaults):

- **Order events by -** This must be a timestamp column. If you have added a date range pre-filter, make sure that it is the same field as this one
- **Group funnels by -** Choose a field to group the funnels by - we recommend user or session identifiers
- **Additional columns to group by -** Use this to visualize additional dimensions in your funnel analysis e.g. experiment groups
- **Max days since funnel start** - Maximum days since the funnel's start for an event to still be considered part of that funnel. Set to 0 for unlimited
- **Intra step time (hours)** - Maximum hours since an event for the next to be included in the same funnel. Set to 0 for unlimited

<img src={SettingsImage} alt="Additional settings configuration." style={{maxWidth: "400px"}} />

### Step 6: Build the funnel charts

Click the `Build Funnel Charts` to generate interactive funnel charts and tables.
You can also download the generated SQL to edit or rerun in your own environment.

User counts by funnel step | Funnel conversion rates
---|---
![Chart showing user counts by funnel step.](images/output-user-counts.png) | ![Chart showing funnel conversion rates.](images/output-conversion-rates.png)

Abandonment at each funnel step | Summary table
---|---
![Chart showing abandonment at each funnel step.](images/output-abandonment.png) | ![Summary table with the funnel steps.](images/output-summary.png)

### Step 7: Save your funnel configuration

Once you are happy with the settings of your funnel you can save it for anyone to open and use using the `Save Funnel` button.
The funnel configuration will be saved under the name used in the `Funnel Name` input at the top of the page.

### Step 8 (optional): Output to a table

You can also save the results of a given run to a table in your warehouse in the settings tab.
Use the `Output results to table` checkbox under the `Settings` tab and choose the configuration for the output table.

### Step 9: Export visualizations to a BI tool

If you would like to visualize these funnels in a different tool, the `Export` page contains instructions on how to run the generated SQL and recreate the analysis in the following tools: 

- Looker
- PowerBI
- Tableau
- Preset
- Streamlit
