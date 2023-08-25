---
title: "Media Player"
sidebar_position: 400
---

### Upgrading to 0.6.0
**This version requires a full refresh run if you have been using any previous versions.** You will not be able to upgrade and have the package work without doing a full refresh.

Please [check the quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/media-player/index.md) for a guide on which new configuration options to enable. If you remain tracking events using the HTML5 and YouTube tracking plugins for the JavaScript tracker, you should add the following configuration to your `dbt_project.yml`:

```yml title=dbt_project.yml
vars:
  snowplow_media_player:
    # enable the version 1 player property
    snowplow__enable_media_player_v1: true
    # disable the new version 2 schemas
    snowplow__enable_media_player_v2: false
    snowplow__enable_media_session: false
```

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
