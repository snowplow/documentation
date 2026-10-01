---
title: "Snowplow dbt Media Player 1.0.2 released"
description: "We're happy to announce a new release for Media Player."
date: "2026-08-27"
category:
  - "Release notes"
components:
  - "Data models"
---

We're happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-media-player/releases/tag/1.0.2) for Media Player.

### Summary

This release fixes duration and play-splitting bugs in `snowplow_media_player_base`, and adds schema evolution support for passthrough fields on incremental tables.

### Fixes

This release includes the following fixes:

* Only apply the media-level duration as a fallback when a play reported none, using the same resolved duration for `is_complete_play` and `content_watched_percent`
* Stop URL fragment drift from splitting media plays, by normalizing `page_url` before grouping
* Add `on_schema_change="append_new_columns"` to incremental tables, so passthrough fields are handled correctly

### Upgrading

Update the snowplow-media-player version in your `packages.yml` file. New data processed after upgrading will be correct.

The duration and URL fragment fixes both depend on specific conditions, and may not apply to your historical data at all:

* The duration fix affects `duration_secs`, `is_complete_play`, and `content_watched_percent` where a play's own duration was missing or inconsistent with other plays of the same media
* The URL fragment fix affects plays on pages where the URL can change mid-playback, e.g. via an in-page anchor link

If you would like to correct already-processed historical data for either issue, see the
[full or partial refreshes guide](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/full-or-partial-refreshes/).
