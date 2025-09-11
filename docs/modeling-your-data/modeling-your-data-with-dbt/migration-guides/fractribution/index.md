---
title: "Fractribution"
description: "Migration guide for dbt fractribution data model with behavioral attribution analytics improvements."
schema: "TechArticle"
keywords: ["Fractribution Migration", "Attribution Migration", "Marketing Migration", "Fractional Attribution", "DBT Migration", "Attribution DBT"]
sidebar_position: 920
---

### Upgrading to 0.3.0
- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml title="dbt_project.yml"
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)
- Other changes required by [snowplow-web version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/web/index.md#upgrading-to-0140), in particular the deduplication logic for Redshift and Postgres users

### Upgrading to 0.2.0
- Variable names are now prefixed with `snowplow__`, please align the new ones found in the `dbt_project.yml` file
- `snowplow__path_transforms` variable is a dictionary instead of an array and that the path transform names have also changed (e.g: `Exposure` -> `exposure_path`). See docs for the latest values
- Version 1.3.0 of `dbt-core` now required
- The python scripts have changed and been renamed per warehouse, please ensure you run the correct version and/or pull the latest docker image
