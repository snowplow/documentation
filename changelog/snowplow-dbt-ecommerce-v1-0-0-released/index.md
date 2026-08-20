---
title: "Snowplow dbt Ecommerce v1.0.0 released"
description: "We're happy to announce a new release for Ecommerce."
date: "2026-05-07"
update_type:
  - "Release notes"
components:
  - "Data modeling"
---
We're happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-ecommerce/releases/tag/1.0.0) for Ecommerce

### Summary

This release updates the package for compatibility with dbt 1.10 and bumps the minimum supported dbt version accordingly.

🚨 Breaking Changes 🚨

* Minimum supported dbt version is now 1.10.6 (previously 1.5.0)
* `snowplow_utils` dependency updated to `>=1.0.0, <2.0.0` (previously `>=0.17.3, <0.18.0`)

### Upgrading

To upgrade bump the snowplow-ecommerce version in your `packages.yml` file. **You will need dbt v1.10.6 or above to use this version of the package.**
