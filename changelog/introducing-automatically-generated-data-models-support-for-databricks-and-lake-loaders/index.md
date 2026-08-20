---
title: "Introducing automatically generated data models support for Databricks and Lake Loader"
description: "We are pleased to announce that Automatically Generated Data Models now supports Databricks and Lake Loader, expanding multi-warehouse capabilities to include lakehouse architectures alongside Snowflake and BigQuery."
date: "2025-11-12"
update_type:
  - "Product news"
components:
  - "Event Studio"
  - "Data modeling"
  - "Loaders"
  - "Databricks"
---
We are pleased to announce that Automatically Generated Data Models now supports Databricks and Lake Loader, expanding multi-warehouse capabilities to include lakehouse architectures alongside Snowflake and BigQuery.

With this update, Snowplow CDI customers using Databricks or Lake Loader can now generate optimized, analysis-ready data models directly from their data products in Console, without writing SQL or complex configurations.

## What's included

**Databricks warehouse support**

Create models for Databricks regardless of your loader configuration, including RDB Loader and Streaming Loader deployments.

**Lake Loader support**

Generate models for Lake Loader deployments, with the ability to specify your query engine and atomic events table location during model generation to ensure proper table references.

**Flexible deployment options**

All deployment approaches are available for Databricks and Lake Loader:

* Views for immediate data access
* Simple incremental dbt models for standalone implementations
* Unified Digital or Normalize-based incremental models that integrate with existing Snowplow dbt packages

## Getting started

Databricks and Lake Loader support is available now for all Snowplow CDI customers with Data Product Studio enabled.

To create a model for Databricks or Lake Loader:

1. Open any data product in Console
2. Navigate to the Data Models tab
3. Select Databricks or Lake Loader as your warehouse destination
4. Follow the guided workflow to configure and generate your model

For more information about automatically generated data models, see the [documentation](/docs/modeling-your-data/automatically-generated-data-models/).
