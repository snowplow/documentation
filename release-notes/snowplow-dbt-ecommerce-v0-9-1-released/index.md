---
title: "Snowplow dbt Ecommerce v0.9.1 released"
description: "We’re excited to announce a new release for ecommerce."
date: "2025-05-12"
category:
  - "Release notes"
components:
  - "Data models"
---
We’re excited to announce a new [release](https://github.com/snowplow/dbt-snowplow-ecommerce/releases/tag/0.9.1) for ecommerce.

### Summary

This release fixes a bug when using BigQuery V2 type columns which resulted in a warehouse error as it tried to find columns that don’t exist

### Fixes

* This release fixes a bug when using BigQuery V2 type columns

### Upgrading

Update the snowplow_ecommerce version in your `packages.yml` file
