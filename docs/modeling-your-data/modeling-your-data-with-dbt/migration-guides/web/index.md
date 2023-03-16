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
- Other changes required by [snowplow-utils version 0.14.0](/docs/modeling-your-data/modeling-your-data-with-dbt/migration-guides/utils/index.md#upgrading-to-0140)

- **Redshift/Pstgres users**: The deduplication logic has changed as a result of which any downstream joins on context and custom event tables will have to be deduped. Previously duplicate events were removed right in the base module to avoid any complications but this meant that the data could have been incomplete unlike in case of other data warehouses. These events will now arrive complete and deduped but they will likely have duplicate counterparts in their respective context tables as well, hence the warning.

In case you have any custom models, please check them and make sure that deduplocation logic is applied on them when they are joined to the main events table. We have provided a macro - `get_sde_or_context()` - for you to use for this purpose in the latest v0.14.0 snowplow-utils package. Check out the [package documentation](https://snowplow.github.io/dbt-snowplow-utils/#!/overview/snowplow_utils) on how to use it.

### Upgrading to 0.13.0
- RDB Loader 4.0.0 or BigQuery Loader 1.0.0. If using postgres loader or older versions set `snowplow__enable_load_tstamp` to `false` in your project yaml and you will not be able to use the consent models.


### Upgrading to 0.12.0
- Version 1.3.0 of `dbt-core` now required
