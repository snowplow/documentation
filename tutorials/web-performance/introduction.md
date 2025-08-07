---
title: Introduction
position: 1
---

Welcome to the **monitor website performance with core web vitals** tutorial. This accelerator will show you how to track and model raw [core web vital](https://web.dev/vitals/) events so that you can monitor your website's performance via the most essential metrics. Improving web performance can have a dramatic impact on how your users view and interact with your website with the potential to maximize your revenue.

In this tutorial you will:

- Learn how you can monitor your website's performance
- Set up Snowplow tracking and enrichment to prepare your data sources
- Model Snowplow data using the `core web vitals` optional module of the [snowplow_web](https://hub.getdbt.com/snowplow/snowplow_web/latest/) dbt package
- Visualize your data in a Tableau or Preset dashboard

## Who this tutorial is for

Data practitioners who would like to:
- Easily capture `core web vitals` on their website using the JavaScript tracker
- Report and visualize the proportion of vitals [within target](https://web.dev/vitals/#core-web-vitals) using Tableau or Preset

## What you will achieve

In an estimated minimum of a day (~5.5 hours) you can achieve the following:

- **Monitor** - Learn why and how you can monitor your website's performance
- **Track** - Set up and deploy tracking needed for your website performance data
- **Enrich** - Add an enrichment to your data
- **Model** - Configure and run the [core web vitals](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model//core-web-vitals-module/) module of the `snowplow-web` data model
- **Visualize** - Use the Tableau twbx template (csv based!) or the Preset dashboard template to gain insight into your website's health
- **Next steps** - Gain more in-depth knowledge on web performance with additional metrics

## Prerequisites

- It is assumed that you are already familiar with the [snowplow-web](https://hub.getdbt.com/snowplow/snowplow_web/latest/) dbt package.

**Tracking and Enrichment**
- Snowplow pipeline
- Web app to implement tracking

**Modeling**
- dbt CLI installed / dbt Cloud account available
- New dbt project created and configured
- Snowflake, Databricks or BigQuery account and a user with access to create schemas and tables
