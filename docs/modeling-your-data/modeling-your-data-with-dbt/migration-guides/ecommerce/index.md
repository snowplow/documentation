---
title: "E-commerce"
sidebar_position: 105
---

### Upgrading to 0.4.0
- Version 1.4.0 of `dbt-core` now required
- You must add the following to the top level of your project yaml
    ```yml
    # dbt_project.yml
    ...
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

### Upgrading to 0.3.0
- Version 1.3.0 of `dbt-core` now required
