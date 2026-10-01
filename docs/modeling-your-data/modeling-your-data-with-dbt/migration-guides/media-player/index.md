---
title: "Migration guide for Media Player"
sidebar_label: "Media Player"
sidebar_position: 20
description: "Migration guide for upgrading the Snowplow Media Player dbt package including breaking changes and configuration updates."
keywords: ["media player migration", "media player upgrade", "dbt media player version"]
---

### Upgrading to 1.1.0

**We recommend a [full refresh run](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/index.md#complete-refresh-of-snowplow-package) if you have been using any previous versions.** Without one, `snowplow_media_player_base` and `snowplow_media_player_media_stats` will hold a mix of values calculated under the old and the new definitions. `snowplow_media_player_base` only reprocesses rows within the `snowplow__upsert_lookback_days` window, so older rows keep their existing values, and `snowplow_media_player_media_stats` accumulates `avg_percent_played` as a weighted average across runs, so it blends the two definitions permanently.

**Behavior changes:**

- `duration_secs` in `snowplow_media_player_base`, and therefore in `snowplow_media_player_plays_by_pageview`, now keeps the duration reported by the play's own events. It only falls back to the longest duration reported for the same `media_identifier` when the play reported none. Previously the media-level value overwrote the play's own. See [how the media duration is resolved](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md#how-the-media-duration-is-resolved).
- `is_complete_play` now divides by that same resolved duration rather than by the media-level maximum, so it agrees with `content_watched_percent`. The two previously used different denominators.
- Plays that reported no duration of their own are no longer excluded from `content_watched_percent` when another play of the same media supplies a fallback duration.
- `avg_percent_played`, `complete_plays`, and `completion_rate_by_plays` in `snowplow_media_player_media_stats` pick up the new values, as do the equivalent columns in the optional `snowplow_media_player_session_stats` and `snowplow_media_player_user_stats` custom models.
- `duration_secs` in `snowplow_media_player_media_stats` is unchanged. It still reports the longest duration seen for each `media_identifier`.

No configuration changes are required, and no columns have been added, removed, or retyped.

### Upgrading to 1.0.0

- Version 1.10.6 of `dbt-core` now required
- For a full upgrade walkthrough, please follow the [official dbt guide](https://docs.getdbt.com/docs/dbt-versions/core-upgrade/upgrading-to-v1.10)
- Generic test arguments must be nested under arguments:
(see dbt’s guidance on the require_generic_test_arguments_property behavior change [here](
https://docs.getdbt.com/reference/global-configs/behavior-changes#generic-test-arguments-property))
- Adapter dbt-redshift 1.10.0+ is required for Redshift users
- Users unable to upgrade immediately may remain on v0.x, which receives critical bug fixes only

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
