---
title: "Snowplow dbt Utils v0.17.2 released"
description: "We’re happy to announce a new release for the Snowplow Utils dbt package."
date: "2025-05-08"
category:
  - "Release notes"
components:
  - "Data models"
---
We’re happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-utils/releases/tag/0.17.2) for the Snowplow Utils dbt package.

This release is for those `Snowflake` and `Postgres` Snowplow dbt package users who are using `delete+insert incremental strategy`, are on dbt v1.9.4+ and are reliant on the Snowplow optimize for incremental runs.

Due to a recent dbt [change](https://github.com/dbt-labs/dbt-adapters/pull/910) in the original macro we extend/overwrite for the incremental optimization a bug was introduced which this patch release addresses to insure compatibility across versions.

## Fixes

* Fix broken delete insert override for new dbt versions

## Under the hood

* Allow latest dbt version in pr tests

## Upgrading

* Update the snowplow-utils version in your `packages.yml` file.
