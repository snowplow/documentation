---
title: "Media Player"
sidebar_position: 400
---

### Upgrading to 0.5.0
- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml title="dbt_project.yml"
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)
- Other changes required by [snowplow-web version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/web/index.md#upgrading-to-0140), in particular the deduplication logic for Redshift and Postgres users


### Upgrading to 0.4.0
- Version 1.3.0 of `dbt-core` now required
