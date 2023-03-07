---
title: "Web"
sidebar_position: 101
---

### Upgrading to 0.14.0

- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml
    # dbt_project.yml
    ...
    dispatch:
    - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

### Upgrading to 0.13.0
- RDB Loader 4.0.0 or BigQuery Loader 1.0.0. If using postgres loader or older versions set `snowplow__enable_load_tstamp` to `false` in your project yaml and you will not be able to use the consent models.


### Upgrading to 0.12.0
- Version 1.3.0 of `dbt-core` now required
