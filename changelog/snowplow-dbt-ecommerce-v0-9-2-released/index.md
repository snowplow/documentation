---
title: "Snowplow dbt Ecommerce v0.9.2 released"
description: "We’re excited to announce a new release for ecommerce."
date: "2025-07-03"
update_type:
  - "Release notes"
components:
  - "Data models"
---
We’re excited to announce a new [release](https://github.com/snowplow/dbt-snowplow-ecommerce/releases/tag/0.9.2) for ecommerce.

### Summary

This release fixes a bug where specifying passthrough fields was having no effect.

### Fixes

* Fixes a bug where passthrough fields specified in dbt_project.yml were not being passed through the various intermediate tables all the way to the end.

### Upgrading

To upgrade bump the snowplow-ecommerce version in your `packages.yml` file.
