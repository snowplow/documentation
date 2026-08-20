---
title: "Snowplow dbt Attribution v0.5.0 released"
description: "We’re excited to announce a new release for Attribution."
date: "2025-04-16"
update_type:
  - "Release notes"
components:
  - "Data modeling"
---
We’re excited to announce a new [release](https://github.com/snowplow/dbt-snowplow-attribution/releases/tag/0.5.0) for Attribution.

### Summary

This release enables applying multiple parameters for path transformations enabled in _dbt_project.yml_. It is specifically related to transformations _remove_if_not_all_ and _remove_if_last_and_not_all_.

Previously only one parameter could be applied on the above path transformations, however applying multiple parameters is now supported. This allows modifying multiple channels or campaigns, instead of just one.

### Fixes

* Fix warning message in source checks macro
* Fix trim_long_path transformation

### Upgrading

Update the snowplow-unified version in your `packages.yml` file. [Further details are here](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/attribution/#upgrading-to-050)
