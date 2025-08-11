---
title: Introduction
position: 1
---

Welcome to the **end-to-end attribution modeling** tutorial. This accelerator will show you how to perform attribution modeling on your Snowplow data, enabling you to attribute a portion of the value of a conversion to specific channels based on the conversion pathway. With this information, you can calculate the revenue per channel and Return on Advertising Spend (ROAS) for each marketing channel, giving you a data-driven approach to making strategic marketing decisions such as channel investment and focus.

:::note
We will use the term channels throughout this tutorial, however you are free to define these however you like and can include other things, e.g. specific campaigns.
:::

In this tutorial you will learn to:

- Model and visualize Snowplow data using the [snowplow_fractribution](https://hub.getdbt.com/snowplow/snowplow_fractribution/latest/) dbt package and Python script using our sample data (no need to have a working pipeline)
- Set up Snowplow tracking and enrichment to prepare your data sources
- Apply what you have learned on your own pipeline to gain insights

## Who this tutorial is for

- Data practitioners who would like to get familiar with further options for modeling Snowplow data
- Data practitioners who want to learn how to use the snowplow_fractribution dbt package, to gain insight into ROAS figures using attribution modeling as quickly as possible
- This tutorial currently supports Snowflake, BigQuery, Redshift and Databricks

## What you will achieve

In an estimated minimum of half a day (~5.5 hours) you can achieve the following:

- **Upload** - Upload some sample data
- **Model** - Configure and run the `snowplow-fractribution` data model
- **Visualize** - Have a closer look at the attribution modeling report table to better understand the outcome of the analysis
- **Track** - Set up and deploy tracking needed for your website or single page application for being able to perform attribution modeling
- **Enrich** - Add an enrichment to your data
- **Next steps** - Gain value from your own pipeline data

:::note
You don't necessarily need to follow all the steps in order. You could choose to skip steps 1-3 where you would learn how to perform attribution modeling through the sample data. If you have your own website or single page application, you could follow steps 4-6 to run the analysis on your own data right away and go through the first sections afterwards.
:::

## Prerequisites

- It is assumed that you are already familiar with the [snowplow-web](https://hub.getdbt.com/snowplow/snowplow_web/latest/) dbt package, or have a snowplow_web_page_views and Snowplow events table already in your data warehouse.
- It is preferable to be familiar with the [snowplow-ecommerce](https://hub.getdbt.com/snowplow/snowplow_ecommerce/latest/) dbt package, that you can use to process your transaction events which are needed for the conversion source for the `snowplow-fractribution` package to work

**Modeling**
- [dbt CLI](https://docs.getdbt.com/docs/core/installation) installed or [dbt Cloud](https://docs.getdbt.com/docs/cloud/about-cloud-setup) account available
- New dbt [project](https://docs.getdbt.com/docs/build/projects) created and configured
- Python 3 installed
- Snowflake, Databricks, Redshift or BigQuery account and a user with access to create schemas and tables

**Tracking and Enrichment**
- Snowplow pipeline
- Web app to implement tracking

## What you will build

You will create a comprehensive attribution modeling system that analyzes customer conversion pathways and calculates the contribution of each marketing channel to your revenue. The system provides detailed ROAS (Return on Advertising Spend) metrics to inform strategic marketing decisions.

![Attribution modeling overview](images/logo_banner.png)

## Architecture

:::note
Snowplow Attribution Modeling is closely based on Google's Fractional Attribution - coined Fractribution. If you would like to learn more about how it works, please see these [slides](https://github.com/google/fractribution/blob/master/Fractribution_Slides.pdf) and this [document](https://support.google.com/analytics/answer/3191594?hl=en#algorithm)
:::

The attribution modeling process involves several key components:

1. **Data Collection** - Snowplow tracking captures detailed user interactions and conversion events
2. **Data Modeling** - The snowplow_fractribution dbt package processes raw events into attribution-ready datasets
3. **Attribution Calculation** - Python scripts apply fractional attribution algorithms to determine channel contributions
4. **ROAS Analysis** - Calculate return on advertising spend for each marketing channel

*ROAS: The amount of revenue that is earned for every dollar spent on advertising
