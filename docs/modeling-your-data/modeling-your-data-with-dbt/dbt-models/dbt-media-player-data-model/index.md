---
title: "Media Player"
sidebar_position: 400
hide_title: true
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
import Badges from '@site/src/components/Badges';
```
<Badges badgeType="dbt-package Release" pkg="media-player"></Badges>


# Snowplow Media Player Package

**The package source code can be found in the [snowplow/dbt-snowplow-media-player repo](https://github.com/snowplow/dbt-snowplow-media-player), and the docs for the [model design here](https://snowplow.github.io/dbt-snowplow-media-player/#!/overview/snowplow_media_player).**

The package contains a fully incremental model that transforms raw media player event data into derived tables for easier querying. It can support media events tracked using the following tracking implementations on Web and mobile:

* on Web using plugins for our [JavaScript trackers](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md):
  * [media plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/media/index.md) that can be used to track events from any media player.
  * [HTML5 media tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/media-tracking/index.md).
  * [YouTube tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/youtube-tracking/index.md).
  * [Vimeo tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/vimeo-tracking/index.md).
* [media tracking APIs on our iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/index.md) for mobile apps.

<details>
<summary>Version 1 and version 2 of the media event and context entity schemas</summary>

There are two versions of schemas for media events that our trackers may use to track media events. This has an effect on the information provided by the media package. In contrast with v1, the v2 schemas contain information about the media playback that is computed directly on the tracker and is more accurate (e.g., play time, buffering time). They also introduce new schemas for tracking ads during media playback.

1. v1 media schemas (used by the HTML5 and YouTube plugin for JavaScript tracker):
   - [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) used for all media events.
   - [media-player context v1 schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0).
   - Depending on the plugin / intention there are player-specific contexts:
      - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
      - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
      - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.
2. v2 media schemas (used by the media and Vimeo plugins for the JavaScript trackers and the mobile trackers):
   - [per-event media event schemas](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.media).
   - [media-player context v2 schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/2-0-0).
   - optional [media-session context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/session/jsonschema/1-0-0).
   - optional [media-ad](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad/jsonschema/1-0-0) and [ad break](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.media/ad_break/jsonschema/1-0-0) context schema.

</details>

:::note
Support for the version 2 schemas (as used by the media, Vimeo JS plugin or the mobile trackers) has been added in version 0.6 of the media player package. Older package versions only support version 1 schemas.
:::

## Overview

The package contains multiple staging models however the mart models are as follows:

- **Base:** Performs the incremental logic, outputting the table `snowplow_media_player_base_events_this_run` which contains a de-duped data set of all events required for the current run of the model, and is the foundation for all other models generated.
- **Media base:** Summarizes the key media player events and metrics of each media element on a media session level (or media_id and page/screen view if media session context is not tracked, which is essentially the same), identified by the play_id key, which is considered as a base aggregation level for media events.
  - The media base module outputs the `snowplow_media_player_base` table.
  - It also produces a `_pivot_base` table to calculate the percent_progress boundaries and weights that are used to calculate the total play_time and other related media fields.
- **Media plays:** Removes impressions from the media base table while keeping the same structure as the `snowplow_media_player_base` table. Removing impressions means that only media sessions (identified by the `play_id` key) in which the user played the content are kept.
  - The media plays module outputs the `snowplow_media_player_plays_by_pageview` view.
- **Media stats:** Aggregates the media base table to individual `media_id` level, calculating the main KPIs and overall video/audio metrics.
  - It uses the native dbt incremental materialization on a pageview basis after a set time window passed. This is to prevent complex and expensive queries due to metrics which need to take the whole page_view events into calculation. This way the metrics will only be calculated once per pageview / media, after no new events are expected.
  - The media stats module outputs the `snowplow_media_player_media_stats` table.
- **Media ad views:** Summarizes metadata and KPIs for each ad view within a media playback. Each ad a user viewed will result in a single row with information about the progress reached, whether the ad was skipped or clicked.
  - The media ad views module outputs the `snowplow_media_player_media_ad_views` table.
- **Media ads:** Aggregates all ad views to produce a summary of the KPIs for each ad played within each media content. Produces total counts of views, skips, clicks and progress reached. It also counts the metrics in terms of unique users (e.g., number of users who clicked the ad).
  - It outputs the `snowplow_media_player_media_ads` table.

## Mixing web and mobile events

The package makes no distinction between events tracked from the web and those tracked from a mobile application, so long as you are tracking media events and from allowed `app_id`s. The `sessionId` from the `client_session` context, and the `id` from the `mobile_screen` context, overwrite the `session_identifier` and `page_view_id` fields respectively in our intermediate and derived tables, for events where they are populated. If you are just using web events, the package will work out the box. If you are using a mix of web and mobile events, you will need to set the `snowplow__enable_mobile_events` package variable to `true` and events will be processed from both sources. If you are only tracking mobile events, you can set the `snowplow__enable_web_events` to `false`.

## Custom models

There are two custom models included in the package which could potentially be used in downstream models:

1. the `snowplow_media_player_session_stats` table, which aggregates the `snowplow_media_player_base` table on a session level

2. the `snowplow_media_player_user_stats` table, which aggregates the `snowplow_media_player_session_stats` to user level

By default these are disabled, but you can enable them in the project's `profiles.yml`, if needed.

```yml title="dbt_project.yml"
  models:
    snowplow_media_player:
      custom:
        enabled: true
```

Just like in case of the web model, users are encouraged to use the Media Player model and its incremental logic to design their own custom models / modules. The `snowplow_media_player_base_events_this_run` table is designed with this in mind, where a couple of potentially useful fields are generated that the Media Player model does not use downstream but they nonetheless have the potential to be incorporated into users custom models. For more information on creating custom models, [visit the guide here](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md).
