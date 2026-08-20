---
title: "Snowplow dbt Attribution v1.0.0 released"
description: "We're happy to announce a new release for Attribution."
date: "2026-05-07"
update_type:
  - "Release notes"
components:
  - "Data modeling"
---
We're happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-attribution/releases/tag/1.0.0) for Attribution

### Summary

This version marks a major milestone as we move the package into a 1.0.0 release. This version introduces breaking changes to internal syntax to ensure compatibility with modern dbt core standards and prepares the codebase for future dbt fusion engine compatibility. This release does not include any model logic changes that would require a full refresh.

### 🚨 Breaking Changes 🚨

* We now require dbt version >=1.10.6 to run this package
* Redshift users are required to use >=1.10 dbt-redshift adapter
* Stricter YAML validation (for example, nesting all generic test arguments under arguments)

### Under the hood

* Update package yml for v1.0.0 and bump dbt requirement
* Update deprecated GitHub Actions to resolve Node.js 20 warnings
* Fix Spark Iceberg CI: rebuild Docker image with JDK 17 and fix auth

### Upgrading

Update the snowplow-attribution version in your packages.yml file and upgrade your dbt version accordingly, if needed.
Redshift users should ensure they are running dbt-redshift >= 1.10.0. Follow our \[migration guide]\(https\://docs.snowplow\.io/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/attribution/) to align profiles, tests, and any custom implementations with the stricter YAML requirements introduced in dbt Core 1.10+.
