---
title: "Track media on web"
sidebar_label: "Media"
sidebar_position: 75
description: "Choose from four media tracking plugins supporting HTML5, YouTube, Vimeo, and custom players with version 2 media schemas."
keywords: ["media tracking", "video"]
---

There are four media tracking plugins to choose from. Choosing the right plugin for you depends on the following questions:

1. What media player do you use in your app?
2. Do you prefer the tracker to automatically subscribe to and track events from the media player, or do you prefer to track the events manually by calling track event functions (e.g., you have a wrapper around the media player which listens to the player events and can send them to Snowplow)?

| Plugin name                                                                          | Plugin                            | [Media schemas version](/docs/events/ootb-data/media-events/index.md#media-api-versions) | Provides auto-tracking? | Player  |
| ------------------------------------------------------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- | ------- |
| [Snowplow media](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md) | `browser-plugin-media`            | v2                                                                                       | ❌                       | Any     |
| [Vimeo](/docs/sources/web-trackers/tracking-events/media/vimeo/index.md)             | `browser-plugin-vimeo-tracking`   | v2                                                                                       | ✅                       | Vimeo   |
| [HTML5](/docs/sources/web-trackers/tracking-events/media/html5/index.md)             | `browser-plugin-media-tracking`   | v2                                                                                       | ✅                       | HTML5   |
| [YouTube](/docs/sources/web-trackers/tracking-events/media/youtube/index.md)         | `browser-plugin-youtube-tracking` | v2                                                                                       | ✅                       | YouTube |
