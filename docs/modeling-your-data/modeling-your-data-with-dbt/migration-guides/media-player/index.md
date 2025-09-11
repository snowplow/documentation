---
title: "Media Player"
description: "Migration guide for dbt media player data model with behavioral video analytics improvements."
schema: "TechArticle"
keywords: ["Media Migration", "Video Migration", "Media Models", "Video Analytics", "DBT Migration", "Media DBT"]
sidebar_position: 20
---

### Upgrading to 0.8.0
**We recommend a [full refresh run](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) if you have been using any previous versions.** There might be inconsistencies in the calculation of impressions and play rate in the media stats table without doing a full refresh.

**Breaking changes:**

-  The calculation of impressions in the stats table changed to use distinct plays instead of page views. This allows for multiple videos on the same page to be counted as separate impressions.

### Upgrading to 0.7.0
**This version requires a [full refresh run](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) if you have been using any previous versions.** You will not be able to upgrade and have the package work without doing a full refresh.

**Breaking changes:**

- A new and more robust `media_identifier` field to replace using `media_id` as a key in the derived tables.
- The introduction of new base macro functionality means in places the session and user identifier fields have been renamed to `session_identifier` and `user_identifier`.
- The default session identifier has been updated from using the `domain_sessionid`, to now be the media session id (or the page/screen view id if the media session entity is not set).
-  Adds a primary key, `media_ad_view_id`, to the ad views table.

### Upgrading to 0.6.0
**This version requires a [full refresh run](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) if you have been using any previous versions.** You will not be able to upgrade and have the package work without doing a full refresh.

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

On Redshift, the context names no longer require the use of the `{{ source('...') }}` macro, the table names can be passed directly.

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
