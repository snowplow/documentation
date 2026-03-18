---
title: "Roku media tracking (v2)"
sidebar_label: "Media tracking (v2)"
date: "2025-03-21"
sidebar_position: 20
description: "Track Roku media playback with v2 schemas including session entities, ping events, and percentage progress tracking for audio and video nodes."
keywords: ["roku media tracking v2", "media session", "ping events"]
---

```mdx-code-block
import Media from "@site/docs/reusable/media/_index.md"
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
```

:::note Media version 2
Media tracking has [multiple versions](/docs/sources/web-trackers/tracking-events/media/index.md) of schemas available.
This document is for version 2 of the schemas; tracker versions earlier than v0.3.0 [only support v1 tracking](/docs/sources/roku-tracker/media-tracking/v1/index.md).
:::

```mdx-code-block
<Media platforms={["roku"]} />
```

## Roku video entity

By default, the Roku tracker attaches a `video` entity to all media events.

<SchemaProperties
  overview={{event: false}}
  example={{
    "videoId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "contentId": "movie-12345",
    "contentTitle": "Sample Movie",
    "contentType": "movie",
    "streamFormat": "mp4",
    "measuredBitrate": 5000000,
    "streamBitrate": 4500000,
    "videoFormat": "hevc",
    "timeToStartStreaming": 1.5,
    "width": 1920,
    "height": 1080
  }}
  schema={{"$schema":"http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#","description":"Schema for a Roku video event (reflects the Video node: https://developer.roku.com/en-gb/docs/references/scenegraph/media-playback-nodes/video.md)","self":{"format":"jsonschema","name":"video","vendor":"com.roku","version":"1-0-0"},"type":"object","properties":{"videoId":{"type":"string","description":"ID generated when video tracking of the video node was initialized.","maxLength":255},"contentId":{"type":["string","null"],"description":"ID of video provided in content metadata.","maxLength":255},"contentTitle":{"description":"Title of video provided in content metadata.","type":["string","null"],"maxLength":65535},"contentUrl":{"description":"URL of video provided in content metadata.","type":["string","null"],"maxLength":65535,"format":"uri"},"contentType":{"description":"Category of video (e.g., movie, season, series) provided in content metadata.","type":["string","null"],"maxLength":255},"streamFormat":{"description":"Container format of video (e.g., mp4, wma, mkv) provided in content metadata.","type":["string","null"],"maxLength":255},"streamUrl":{"type":["string","null"],"description":"URL of the current stream.","maxLength":65535,"format":"uri"},"measuredBitrate":{"type":["integer","null"],"description":"Measured bitrate (bps) of the network when the stream was selected.","minimum":0,"maximum":2147483647},"streamBitrate":{"type":["integer","null"],"description":"Current bitrate of the stream.","minimum":0,"maximum":2147483647},"isUnderrun":{"type":["boolean","null"],"description":"Indicates whether the stream was downloaded due to an underrun."},"isResumed":{"type":["boolean","null"],"description":"Indicates whether the playback was resumed after trickplay."},"videoFormat":{"type":["string","null"],"description":"Video codec of the currently playing video stream (e.g., hevc, mpeg2, mpeg4_15).","maxLength":255},"timeToStartStreaming":{"type":["number","null"],"description":"Time in seconds from playback being started until the video actually began playing.","minimum":0,"maximum":9007199254740991},"width":{"type":"integer","description":"Width of the video play window in pixels. 0 if the play window is set to the width of the entire display screen.","minimum":0,"maximum":65535},"height":{"type":"integer","description":"Height of the video play window in pixels. 0 if the play window is set to the height of the entire display screen.","minimum":0,"maximum":65535},"errorStr":{"type":["string","null"],"description":"A diagnostic message indicating a video play error. Refer to the Roku Video documentation for the format of the string.","maxLength":65535}},"required":["videoId","width","height"],"additionalProperties":false}} />

## Migrating from media v1 APIs

If you are migrating from the [v1 media tracking](/docs/sources/roku-tracker/media-tracking/v1/index.md), v2 has compatibility options to make the change easier.

For backwards compatibility with the earlier tracking API, you can continue using `enableVideoTracking` or `enableAudioTracking` instead of `enableMediaTracking`, and pass the node via the `audio`/`video` option instead of `media`.
For most other options, v2 will accept either v1 or v2 `roAssociativeArray` formats.
The tracking will work with any combination of these method and option names regardless of node type, as long as `version: 2` is specified.
You can also specifically opt into version 1 by passing `version: 1` for any of these methods, though v2 options may not be recognized.

If using specific `version` values, the same version should also be specified for the corresponding `disable*Tracking` method.
Similarly, mixing `enableVideoTracking` and `disableMediaTracking` will not work unless versions are specified consistently.

The additional options differ by version; but version 2 will accept the options from version 1 if it can't find the newer equivalent settings.

| v2 Attribute                | v1 Fallback                 | Type                 | Description                                                                                   |
| --------------------------- | --------------------------- | -------------------- | --------------------------------------------------------------------------------------------- |
| `media` / `audio` / `video` | `media` / `audio` / `video` | Audio / Video        | Audio/Video node to be tracked                                                                |
| `version`                   | `version`                   | Integer              | Tracking schema version to use; should be set to 2 if not using `enableMediaTracking`         |
| `id`                        | N/A                         | UUID                 | A unique ID to use for the media `session` entity to group all tracked events                 |
| `label`                     | `options.label`             | String               | An identifiable custom label sent with the event in the `media_player` entity                 |
| `sessions`                  | Default enabled             | boolean              | Whether to attach the media `session` entity on tracked events                                |
| `pings`                     | Default enabled             | boolean              | Whether to periodically generate media `ping_event`s while content is playing                 |
| `pingInterval`              | `options.positionInterval`  | Integer              | Interval in seconds in which `ping_event`s should be reported                                 |
| `boundaries`                | `options.boundaries`        | Integer[]            | Percentage boundaries in playback for which `percentage_progress_event`s will be sent         |
| `captureEvents`             | `options.captureEvents`     | String[]             | Types of events to capture. If specified, the event names should not have the `_event` suffix |
| `context` / `entities`      | `context`                   | SelfDescribingJSON[] | Array of custom entities to include with all generated events                                 |
