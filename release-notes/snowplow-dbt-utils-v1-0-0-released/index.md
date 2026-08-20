---
title: "Snowplow dbt Utils v1.0.0 released"
description: "We’re happy to announce v.1.0.0 release for dbt-snowplow-utils."
date: "2026-01-20"
update_type:
  - "Release notes"
components:
  - "Data models"
---
We’re happy to announce v.1.0.0 [release](https://github.com/snowplow/dbt-snowplow-utils/releases/tag/1.0.0) for dbt-snowplow-utils.

##### Summary This version marks a major milestone as we move the package into a 1.0.0 release. This version introduces breaking changes to internal syntax to ensure compatibility with modern dbt core standards and prepares the codebase for future dbt fusion engine compatibility. This release does not include any model logic changes that would require a full refresh.

##### 🚨 Breaking changes 🚨 - We now require dbt version >=1.10.6 to run this package - Redshift users are required to use >=1.10 dbt-redshift adapter - Stricter YAML validation (for example, nesting all generic test arguments under arguments:)

##### Fixes - Fix redshift delete insert macro override (Close #204) - Fix redshift post hook error (Close #223)

##### Upgrading Update the snowplow-utils version in your packages.yml file and upgrade your dbt version accordingly, if needed. Redshift users should ensure they are running dbt-redshift >= 1.10.0. Follow our [migration guide](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/) to align profiles, tests, and any custom implementations with the stricter YAML requirements introduced in dbt Core 1.10+.
