---
title: "User & Marketing Dashboards"
sidebar_position: 2
sidebar_label: "User & Marketing Dashboards"
---

:::caution

This data app is currently in Public Preview and features may changes without notice. 

:::

The Marketing Dashboards app contains all the visuals you need to perform a high level analysis of your web and mobile performance. This includes: 
- Reports on user acquisition
- Information relating to your traffic sources
- Insight into user retention
- Measurement of user engagement
- Deep dives into technology and user demographics

## Requirements

- [YAUAA enrichment](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) enabled
- One of:
  - (**Recommended**) Running the [Snowplow Unified Data Model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) with:
    - `snowplow__enable_yauaa` set to `true`
    - `snowplow__list_event_counts` set to `true`
    - (optional) Conversion event(s) defined, with `snowplow__total_all_conversions` set to `true`
  - Running the [Snowplow Web Model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/index.md) with:
    - `snowplow__enable_yauaa` set to `true`
    - `snowplow__list_event_counts` set to `true`
    - (optional) Conversion event(s) defined, with `snowplow__total_all_conversions` set to `true`
- Access to the derived tables granted to the role used when setting up the data app

## Usage
All charts in the application have help text to explain any definitions used, and have the SQL used to produce them available to download by clicking on the icon in their title. 

### Filters
The data queried and displayed can be filtered using the filter in the sidebar of the application. Note these filters will apply to all visuals across all pages, and changing the filters will cause the dashboard to refresh all visuals which may take a few seconds. By default the last 30 days of sessions and page views are used.

The comparison option allows you to compare two different time periods, we provide default suggestions such as the preceding period matching the starting day of the week, but you can select a custom range. Note that it is possible to select a shorter or longer period for comparison than your main filter; this can lead to unexpected results in charts as for example bar charts will use the full range, but line charts will only display up to the main range. You will get a notification if your ranges are of different lengths.

Some charts in the app are only related to new or returning users, not both, so depending on your filters these may be blank.

### Settings
:::tip

All configurations can be found in the Setup page. Note that all these settings are global for all users, meaning if you change them they will be changed for everyone.

:::

- Select the currency symbol used throughout the app
- Toggle between using campaign or channel for reporting aggregation
- Use tables produced by the web package instead of the unified package, and select with tables to use.

<!-- ## Contents
### Acquisition
This page contains reporting relating to acquisition of users, both new and returning.

### Engagement
Information relating to engagement is displayed in this page, including conversion volumes and Daily/Weekly/Monthly Active Users.

### Retention
This page contains information relating to user retention of 30 day windows.

### Tech
Reporting on the technology users are using to access your site/app are displayed in this page.

### Users
Information about the Users such as their location is reported in this page.

### Setup
This page contains all information to validate you have the correct data to run the app, as well as allowing you to change data sources and other configuration settings for the app. -->
