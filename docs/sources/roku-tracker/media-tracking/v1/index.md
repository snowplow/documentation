---
title: "Roku media tracking (v1)"
sidebar_label: "Media tracking (v1)"
date: "2021-12-23"
---

Media tracking has [multiple versions](/docs/sources/web-trackers/tracking-events/media/index.md) of schema available.
This document is for version 1 of the schemas, it is recommended to [migrate to v2 tracking](/docs/sources/roku-tracker/media-tracking/v2/index.md#migrating-from-v1).

## Usage

To start media tracking for an Audio/Video node, assign a `roAssociativeArray` with the node to the `enableVideoTracking` property:

```brightscript
m.global.snowplow.enableVideoTracking = {
    video: m.Video
}
```

From tracker version 0.3.0:
- You can also use `enableAudioTracking` and pass the node via `audio` instead of `video`
- The v2 `enableMediaTracking` call and `media` option will also work, the tracker will use v1 tracking if the optional `version` option is defined as `1`

In addition to the node and version selector, the `enableVideoTracking` property accepts several optional attributes listed in the tables below.

| Attribute                   | Type                 | Description                                                                                                       | Required?                                        |
| --------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `media` / `audio` / `video` | Audio / Video        | Audio/Video node to be tracked                                                                                    | yes                                              |
| `version`                   | Integer              | Tracking schema version to use; defaults to 1 if not provided for `enableVideoTracking` and `enableAudioTracking` | no                                               |
| `label` / `options.label`   | String               | An identifiable custom label sent with the event                                                                  | no                                               |
| `options.captureEvents`     | String[]             | Types of events to capture                                                                                        | no, defaults to all events except for `position` |
| `options.boundaries`        | Integer[]            | Percentage boundaries in playback for which events will be sent                                                   | no, defaults to `[10, 25, 50, 75]`               |
| `options.positionInterval`  | Integer              | Interval in seconds in which `position` events should be reported                                                 | no, defaults to 5                                |
| `context` / `entities`      | SelfDescribingJSON[] | Array of custom entities to include with all generated media events                                               | no                                               |

To stop tracking events from the node, set the `disableVideoTracking`/`disableAudioTracking` property. The tracker will then stop observing and tracking events from the node.
The property should be set with an `roAssociativeArray` with exactly one attribute, `video` (or `audio`/`media`), like so:

```brightscript
m.global.snowplow.disableVideoTracking = {
    video: m.video
}
```

## Media Player Events

### Media Events

All playback events are tracked automatically and conform to the `media_player_event` schema. The schema has two properties:

| Property | Description               | Required? |
| -------- | ------------------------- | --------- |
| `type`   | Type of event             | Yes       |
| `label`  | Identifiable custom label | No        |

The events are enriched with two context entities. The first is the `media_player` context entity that provides the following properties:

| Property          | Description                                                                             | Required? |
| ----------------- | --------------------------------------------------------------------------------------- | --------- |
| `currentTime`     | The current playback time                                                               | Yes       |
| `duration`        | A double-precision floating-point value indicating the duration of the media in seconds | No        |
| `ended`           | If playback of the media has ended                                                      | Yes       |
| `isLive`          | If the media is live                                                                    | Yes       |
| `loop`            | If the video should restart after ending                                                | Yes       |
| `muted`           | If the media element is muted                                                           | Yes       |
| `paused`          | If the media element is paused                                                          | Yes       |
| `percentProgress` | The percent of the way through the media                                                | No        |
| `playbackRate`    | Playback rate (1 is normal)                                                             | No        |
| `volume` .        | Volume percent                                                                          | Yes       |

The second is the Roku `video` context with these properties:

| Property               | Description                                                                                                             | Required? |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------- |
| `videoId`              | ID generated when video tracking of the video node was initialized.                                                     | Yes       |
| `contentId`            | ID of video provided in content metadata.                                                                               | No        |
| `contentTitle`         | Title of video provided in content metadata.                                                                            | No        |
| `contentUrl`           | URL of video provided in content metadata.                                                                              | No        |
| `contentType`          | Category of video (e.g., movie, season, series) provided in content metadata.                                           | No        |
| `streamFormat`         | Container format of video (e.g., mp4, wma, mkv) provided in content metadata.                                           | No        |
| `streamUrl`            | URL of the current stream.                                                                                              | No        |
| `measuredBitrate`      | Measured bitrate (bps) of the network when the stream was selected.                                                     | No        |
| `streamBitrate`        | Current bitrate of the stream.                                                                                          | No        |
| `isUnderrun`           | Indicates whether the stream was downloaded due to an underrun.                                                         | No        |
| `isResumed`            | Indicates whether the playback was resumed after trickplay.                                                             | No        |
| `videoFormat`          | Video codec of the currently playing video stream (e.g., hevc, mpeg2, mpeg4_15).                                        | No        |
| `timeToStartStreaming` | Time in seconds from playback being started until the video actually began playing.                                     | No        |
| `width`                | Width of the video play window in pixels. 0 if the play window is set to the width of the entire display screen.        | Yes       |
| `height`               | Height of the video play window in pixels. 0 if the play window is set to the height of the entire display screen.      | Yes       |
| `errorStr`             | A diagnostic message indicating a video play error. Refer to the Roku Video documentation for the format of the string. | No        |

## Captured Types of Events

The tracker automatically captures several types of events. You may configure which types of events to track by passing a list of the types into the `options.captureEvents` property during tracker initialization:

```brightscript
m.global.snowplow.enableVideoTracking = {
    video: m.Video,
    options: {
        captureEvents: ["playing", "paused"]
    }
}
```

Overall, the types of events can be grouped into two categories: playback position events, and state change events.

### Playback Position Events

These "ping" events report changes in the playback position of the video while playing. There are two types of the events:

1. `percentprogress` events report when the playback reaches certain boundaries defined as percentages of the total playback duration.
2. `position` events are regular events sent when the playback changes by a certain number of seconds.

#### Event Type: `percentprogress`

Percent progress events are sent when predefined percentage boundaries in playback are reached. The boundaries may be configured using a `boundaries` list when initializing video tracking:

```brightscript
m.global.snowplow.enableVideoTracking = {
    video: m.Video,
    options: {
        captureEvents: ["percentprogress"],
        boundaries: [25, 50, 75, 100]
    }
}
```

The tracker sends percent progress events by default for the following percentage boundaries: 10%, 25%, 50%, and 75% of total playback.

These events can not be reported for live streams since they assume that the total duration of the video is known.

#### Event Type: `position`

Position events report the current playback position in regular intervals. These events are not reported by default. They can be activated using the `options.captureEvents` property.

The events are sent whenever the playback head changes by more than the predefined position interval. The interval defaults to 5 seconds. It can be configured using the `options.positionInterval` property:

```brightscript
m.global.snowplow.enableVideoTracking = {
    video: m.Video,
    options: {
        captureEvents: ["position"],
        positionInterval: 15 ' seconds
    }
}
```

These events do not require the total duration of the video to be known and can be reported for live streams as well.

### State Change Events

State change events are sent when the state of the video node changes due to interaction from the user, changes in the playback, or through any other influence. Transitions between the following states are captured:

- `playing`
- `paused`
- `buffering`
- `stopped`
- `finished`
- `error`
    - Error occured in the playback. The `errorStr` property in the `video` context will provide more details on the error.

The event type of the events (`type` property) reflects the current state.

All of the state changes are reported by default. In order to capture only selected states, use the `options.captureEvents` property:

```brightscript
m.global.snowplow.enableVideoTracking = {
    video: m.Video,
    options: {
        captureEvents: ["playing", "paused"]
    }
}
```
