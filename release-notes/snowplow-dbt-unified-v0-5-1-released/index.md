---
title: "Snowplow dbt Unified v0.5.1 released"
description: "We’re happy to announce a new release for Unified."
date: "2025-01-24"
category:
  - "Release notes"
components:
  - "Data models"
---
We’re happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-unified/releases/tag/0.5.1) for Unified

Summary

This release includes updates and enhancements to improve the functionality, maintainability, and initial checks of the Snowplow Unified package.

## Features

* Rework filter bots macro: Improved logic for filtering bot events to ensure cleaner data handling and more accurate analytics.
* Update snowplow_unified_dim_ga4_source_categories: Enhanced the dim_ga4_source_categories table to provide better support for categorization and reporting.
  Fixes
* Remove duplicate 2T codes: Addressed an issue where duplicate 2T codes caused inconsistencies in data processing.

## Under the hood

* Add required fields to initial checks helper macro: Improved initialization checks by including necessary fields for robust and early error detection.

## Upgrading

* Update the snowplow-unified version in your packages.yml file to take advantage of these improvements.
* For updated `snowplow_unified_dim_ga4_source_categories` to take effect, the seed need to be updated by `dbt seed`
