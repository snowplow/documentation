---
title: "Tracking media on web"
sidebar_label: "Media"
sidebar_position: 75
---

# Media tracking

There are four media tracking plugins to choose from. Choosing the right plugin for you depends on the following questions:

1. What media player do you use in your app?
2. Do you prefer the tracker to automatically subscribe to and track events from the media player, or do you prefer to track the events manually by calling track event functions (e.g., you have a wrapper around the media player which listens to the player events and can send them to Snowplow)?
3. What data do you want to track? This will have an effect on whether you choose a plugin that tracks version 1 or version 2 of our media schemas (see below).

:::note Version 1 vs Version 2 media schemas

We recommend adopting the newer, more fully-featured v2 schemas where possible. The [media player data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) does also support the v1 schemas.

The v2 schemas:

1. Enable more accurate metrics about the playback (e.g., played duration, average playback rate) that are computed on the tracker instead of estimated in modeling.
2. Enable tracking ads played during media playback.
3. Provide additional events to track playback quality and periodic media pings during playback.
4. Support live streaming video (in addition to VOD).

:::

| Plugin | Media schemas version | Provides auto-tracking? | Player |
| --- | --- | --- | --- |
| [Snowplow media](/docs/sources/trackers/web-trackers/tracking-events/media/snowplow/index.md) | v2 | ❌ | Any |
| [Vimeo](/docs/sources/trackers/web-trackers/tracking-events/media/vimeo/index.md)  | v2 | ✅ | Vimeo |
| [HTML5](/docs/sources/trackers/web-trackers/tracking-events/media/html5/index.md) | v2 | ✅ | HTML5 |
| [YouTube](/docs/sources/trackers/web-trackers/tracking-events/media/youtube/index.md) | v2 | ✅ | YouTube |
