---
title: "Media playback events"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

Snowplow provides a complete solution for tracking events from media (video or audio) playback and for modeling the tracked data.

This page gives an overview of the tracked data (consisting of self-describing events and context entities) and points to resources for setting up tracking using our Web and mobile trackers and modeling using our dbt package.

<TOCInline toc={toc} maxHeadingLevel={4} />

<details>
<summary>Older (version 1) media event and context entity schemas</summary>

This page describes events and entities in the newer, version 2, schemas for media events and context entities. In case you are using the HTML5 and YouTube plugins for the JavaScript tracker, you may still be using the older schemas. These are still supported and work with our dbt media package. However, they provide less information (e.g, no ad tracking) and less accurate playback metrics (which are estimated based on percentage progress boundaries).

They consist of the following events and context entities:
- [media-player event schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0) used for all media events.
- [media-player context v1 schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0).
- Depending on the plugin / intention there are player-specific contexts:
    - in case of embedded YouTube tracking: Have the [YouTube specific context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.youtube/youtube/jsonschema/1-0-0) enabled.
    - in case of HTML5 audio or video tracking: Have the [HTML5 media element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0) enabled.
    - in case of HTML5 video tracking: Have the [HTML5 video element context schema](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0) enabled.

</details>

## Events

### Playback events

#### Buffer end event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the the player finishes buffering content and resumes playback.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "buffer_end_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />


#### Buffer start event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the player goes into the buffering state and begins to buffer content.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "buffer_start_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Pause event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when the user pauses the playback.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "pause_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Playback end event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when playback stops when end of the media is reached or because no further data is available.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "end_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Percent progress event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when a percentage boundary set in tracking options is reached", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "percent_progress_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": [ "integer", "null" ], "description": "The percent of the way through the media", "minimum": 0, "maximum": 100 } }, "additionalProperties": false }} />

#### Media ping event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired periodically during main content playback, regardless of other API events that have been sent.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ping_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { }, "additionalProperties": false }} />

#### Play event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when the player changes state to playing from previously being paused.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "play_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Seek end event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when a seek operation completes.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "seek_end_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Seek start event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when a seek operation begins.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "seek_start_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

### Player events

#### Error event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    "errorCode": "E522",
    "errorName": "forbidden",
    "errorDescription": "Playback failed"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event tracked when the resource could not be loaded due to an error.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "error_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "errorCode": { "type": [ "string", "null" ], "description": "Error-identifying code for the playback issue. E.g. E522", "maxLength": 256 }, "errorName": { "type": [ "string", "null" ], "description": "Name for the type of error that occurred in the playback. E.g. forbidden", "maxLength": 256 }, "errorDescription": { "type": [ "string", "null" ], "description": "Longer description for the error that occurred in the playback.", "maxLength": 4096 } }, "additionalProperties": false }} />

#### Fullscreen change event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    "fullscreen": true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired immediately after the browser switches into or out of full-screen mode.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "fullscreen_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "fullscreen": { "type": "boolean", "description": "Whether the video element is fullscreen after the change" } }, "required": [ "fullscreen" ], "additionalProperties": false }} />

#### Picture-in-picture change event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    pictureInPicture: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired immediately after the browser switches into or out of picture-in-picture mode.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "picture_in_picture_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "pictureInPicture": { "type": "boolean", "description": "Whether the video element is showing picture-in-picture after the change." } }, "required": [ "pictureInPicture" ], "additionalProperties": false }} />

#### Playback rate change event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    previousRate: 1,
    newRate: 1.5
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when the playback rate has changed.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "playback_rate_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "previousRate": { "type": [ "number", "null" ], "description": "Playback rate before the change (1 is normal)", "minimum": 0, "maximum": 16 }, "newRate": { "type": "number", "description": "Playback rate after the change (1 is normal)", "minimum": 0, "maximum": 16 } }, "required": [ "newRate" ], "additionalProperties": false }} />

#### Quality change event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    "previousQuality": '1080p',
    "newQuality": '720p',
    "bitrate": 1500,
    "framesPerSecond": 30,
    "automatic": true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event tracked when the video playback quality changes automatically.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "quality_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "previousQuality": { "type": [ "string", "null" ], "description": "Quality level before the change (e.g., 1080p).", "maxLength": 4096 }, "newQuality": { "type": [ "string", "null" ], "description": "Quality level after the change (e.g., 1080p).", "maxLength": 4096 }, "bitrate": { "type": [ "integer", "null" ], "description": "The current bitrate in bits per second.", "minimum": 0, "maximum": 9007199254740991 }, "framesPerSecond": { "type": [ "integer", "null" ], "description": "The current number of frames per second.", "minimum": 0, "maximum": 65535 }, "automatic": { "type": [ "boolean", "null" ], "description": "Whether the change was automatic or triggered by the user." } }, "additionalProperties": false }} />

#### Ready event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the media tracking is successfully attached to the player and can track events.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ready_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Volume change event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    "previousVolume": 30,
    "newVolume": 50
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event sent when the volume has changed.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "volume_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "previousVolume": { "type": [ "integer", "null" ], "description": "Volume percentage before the change.", "minimum": 0, "maximum": 100 }, "newVolume": { "type": "integer", "description": "Volume percentage after the change.", "minimum": 0, "maximum": 100 } }, "required": [ "newVolume" ], "additionalProperties": false }} />

### Ad events

#### Ad click event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{
    percentProgress: 50
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the user clicked on the ad.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_click_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": [ "integer", "null" ], "description": "The percent of the way through the ad", "minimum": 0, "maximum": 100 } }, "additionalProperties": false }} />

#### Ad break start event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event that signals the start of an ad break.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_break_start_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { }, "additionalProperties": false }} />

#### Ad break end event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event that signals the end of an ad break.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_break_end_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { }, "additionalProperties": false }} />

#### Ad complete event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event that signals the ad creative was played to the end at normal speed.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_complete_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

#### Ad pause event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ percentProgress: 50 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the user clicked the pause control and stopped the ad creative.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_pause_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": [ "integer", "null" ], "description": "The percent of the way through the ad", "minimum": 0, "maximum": 100 } }, "additionalProperties": false }} />

#### Ad quartile event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ percentProgress: 50 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when a quartile of ad is reached after continuous ad playback at normal speed.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_quartile_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": "integer", "description": "The percent of the way through the ad", "minimum": 0, "maximum": 100 } }, "additionalProperties": false, "required": [ "percentProgress" ] }} />

#### Ad resume event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ percentProgress: 50 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the user resumed playing the ad creative after it had been stopped or paused.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_resume_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": [ "integer", "null" ], "description": "The percent of the way through the ad", "minimum": 0, "maximum": 100 } }, "additionalProperties": false }} />

#### Ad skip event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ percentProgress: 50 }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event fired when the user activated a skip control to skip the ad creative.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_skip_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "percentProgress": { "type": [ "integer", "null" ], "description": "The percent of the way through the ad", "minimum": 0, "maximum": 100 } }, "additionalProperties": false }} />

#### Ad start event

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: 'Depends on the tracker used'}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Media player event that signals the start of an ad.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_start_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

## Context entities

### Media player entity

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    "currentTime": 109,
    "duration": 400,
    "ended": false,
    "fullscreen": false,
    "livestream": false,
    "label": 'Big Bucks Bunny',
    "loop": false,
    "mediaType": 'video',
    "muted": false,
    "paused": true,
    "pictureInPicture": false,
    "playbackRate": 1.5,
    "playerType": 'com.vimeo-vimeo',
    "quality": '1080p',
    "volume": 100
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context entity for media events that describes the media player and playback state", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "media_player", "format": "jsonschema", "version": "2-0-0" }, "type": "object", "properties": { "currentTime": { "type": "number", "description": "The current playback time position within the media in seconds.", "minimum": 0, "maximum": 2147483647 }, "duration": { "type": [ "number", "null" ], "description": "A floating-point value indicating the duration of the media in seconds.", "minimum": 0, "maximum": 2147483647 }, "ended": { "type": "boolean", "description": "Whether playback of the media has ended." }, "fullscreen": { "type": [ "boolean", "null" ], "description": "Whether the video element is fullscreen." }, "livestream": { "type": [ "boolean", "null" ], "description": "Whether the media is a live stream." }, "label": { "type": [ "string", "null" ], "description": "Human readable name given to tracked media content.", "maxLength": 4096 }, "loop": { "type": [ "boolean", "null" ], "description": "Whether the video should restart after ending." }, "mediaType": { "description": "Type of media content.", "enum": [ "video", "audio", null ], "type": [ "string", "null" ] }, "muted": { "type": [ "boolean", "null" ], "description": "Whether the media element is muted." }, "paused": { "type": "boolean", "description": "Whether the media element is paused" }, "pictureInPicture": { "type": [ "boolean", "null" ], "description": "Whether the video element is showing picture-in-picture." }, "playbackRate": { "type": [ "number", "null" ], "description": "Playback rate (1 is normal).", "minimum": 0, "maximum": 16 }, "playerType": { "type": [ "string", "null" ], "description": "Type of the media player (e.g., com.youtube-youtube, com.vimeo-vimeo, org.whatwg-media_element).", "maxLength": 4096 }, "quality": { "type": [ "string", "null" ], "description": "Quality level of the playback (e.g., 1080p).", "maxLength": 4096 }, "volume": { "type": [ "integer", "null" ], "description": "Volume percentage at which the media will be played.", "minimum": 0, "maximum": 100 } }, "additionalProperties": false, "required": [ "currentTime", "ended", "paused" ] }} />

### Media session entity

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    "mediaSessionId": "2d9bd9ac-abbd-419a-b934-9a2965cba339",
    "startedAt": "2023-11-03T09:55:29.920Z",
    "pingInterval": 15,
    "timePlayed": 143.12,
    "timePlayedMuted": 0,
    "timePaused": 8.12,
    "contentWatched": 120,
    "timeBuffering": 0.988,
    "timeSpentAds": 14.2,
    "ads": 4,
    "adsClicked": 0,
    "adsSkipped": 1,
    "adBreaks": 2,
    "avgPlaybackRate": 1.21
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context entity for media player events that tracks a session of a single media player usage", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "session", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "mediaSessionId": { "type": "string", "maxLength": 256, "description": "An identifier for the media session that is kept while the media content is played in the media player." }, "startedAt": { "type": [ "null", "string" ], "description": "Local date-time timestamp of when the session started.", "format": "date-time" }, "pingInterval": { "type": [ "integer", "null" ], "description": "Interval (seconds) in which the ping events will be sent. Default (specified in the tracker media docs) is assumed if not specified.", "minimum": 0, "maximum": 65535 }, "timePlayed": { "type": [ "number", "null" ], "description": "Total seconds user spent playing content (excluding linear ads).", "minimum": 0, "maximum": 2147483647 }, "timePlayedMuted": { "type": [ "number", "null" ], "description": "Total seconds user spent playing content on mute (excluding linear ads).", "minimum": 0, "maximum": 2147483647 }, "timePaused": { "type": [ "number", "null" ], "description": "Total seconds user spent with paused content (excluding linear ads).", "minimum": 0, "maximum": 2147483647 }, "contentWatched": { "type": [ "number", "null" ], "description": "Total seconds of the content played. Each part of the content played is counted once (i.e., counts rewinding or rewatching the same content only once). Playback rate does not affect this value.", "minimum": 0, "maximum": 2147483647 }, "timeBuffering": { "type": [ "number", "null" ], "description": "Total seconds that playback was buffering during the session.", "minimum": 0, "maximum": 2147483647 }, "timeSpentAds": { "type": [ "number", "null" ], "description": "Total seconds that ads played during the session.", "minimum": 0, "maximum": 2147483647 }, "ads": { "type": [ "integer", "null" ], "description": "Number of ads played.", "minimum": 0, "maximum": 65535 }, "adsClicked": { "type": [ "integer", "null" ], "description": "Number of ads that the user clicked on.", "minimum": 0, "maximum": 65535 }, "adsSkipped": { "type": [ "integer", "null" ], "description": "Number of ads that the user skipped.", "minimum": 0, "maximum": 65535 }, "adBreaks": { "type": [ "integer", "null" ], "description": "Number of ad breaks played.", "minimum": 0, "maximum": 65535 }, "avgPlaybackRate": { "type": [ "number", "null" ], "description": "Average playback rate (1 is normal speed).", "minimum": 0, "maximum": 16 } }, "additionalProperties": false, "required": [ "mediaSessionId" ] }} />

### Media ad

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    "name": "Snowplow 5s ad",
    "adId": "2d9bd9ac-abbd-419a-b934-9a2965cba339",
    "creativeId": "fb819c48-5760-4d94-9c5b-4fa52f61a998",
    "podPosition": 2,
    "duration": 5,
    "skippable": true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context entity with information about the currently played ad", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "name": { "description": "Friendly name of the ad.", "type": [ "null", "string" ], "maxLength": 4096 }, "adId": { "type": "string", "maxLength": 256, "description": "Unique identifier for the ad." }, "creativeId": { "type": [ "string", "null" ], "maxLength": 4096, "description": "The ID of the ad creative." }, "podPosition": { "type": [ "integer", "null" ], "description": "The position of the ad within the ad break, starting with 1.", "minimum": 1, "maximum": 65535 }, "duration": { "type": [ "number", "null" ], "description": "Length of the video ad in seconds.", "minimum": 0, "maximum": 2147483647 }, "skippable": { "type": [ "boolean", "null" ], "description": "Indicating whether skip controls are made available to the end user." } }, "additionalProperties": false, "required": [ "adId" ] }} />

### Media ad break

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: true}}
  example={{
    "name": 'pre-roll',
    "breakId": "fb819c48-5760-4d94-9c5b-4fa52f61a998",
    "startTime": 0,
    "breakType": "linear",
    "podSize": 2
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a context entity, shared with all ad events belonging to the ad break.", "self": { "vendor": "com.snowplowanalytics.snowplow.media", "name": "ad_break", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "name": { "description": "Ad break name (e.g., pre-roll, mid-roll, and post-roll).", "type": [ "null", "string" ], "maxLength": 4096 }, "breakId": { "type": "string", "maxLength": 256, "description": "An identifier for the ad break." }, "startTime": { "type": "number", "description": "Playback time in seconds at the start of the ad break.", "minimum": 0, "maximum": 2147483647 }, "breakType": { "description": "Type of ads within the break: linear (take full control of the video for a period of time), nonlinear (run concurrently to the video), companion (accompany the video but placed outside the player).", "enum": [ "linear", "nonlinear", "companion", null ], "type": [ "string", "null" ] }, "podSize": { "type": [ "integer", "null" ], "description": "The number of ads to be played within the ad break.", "minimum": 0, "maximum": 65535 } }, "additionalProperties": false, "required": [ "breakId", "startTime" ] }} />

## How to track?

* on Web using plugins for our [JavaScript trackers](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md):
  * [media plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/index.md) that can be used to track events from any media player.
  * [HTML5 media tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/html5/index.md).
  * [YouTube tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/youtube/index.md).
  * [Vimeo tracking plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/vimeo/index.md).
* [media tracking APIs on our iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/index.md) for mobile apps.

## Modeled data using the snowplow-media-player dbt package

[The media player dbt package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) contains a fully incremental model that transforms raw media event data into a set of derived tables based around the following data objects: media plays, media stats, media ad views, and media ads.

Derived table | Table description | dbt
---|---|---
`snowplow_media_player_base` | This derived table summarises the key media player events and metrics of each media element on a media_id and pageview level which is considered as a base aggregation level for media interactions. | [Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/model/model.snowplow_media_player.snowplow_media_player_base)
`snowplow_media_player_plays_by_pageview` | This view removes impressions from the '_base' table to summarise media plays on a page_view by media_id level. | [Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/model/model.snowplow_media_player.snowplow_media_player_plays_by_pageview)
`snowplow_media_player_media_stats` | This derived table aggregates the '_base' table to individual media_id level, calculating the main KPIs and overall video/audio metrics. | [Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/model/model.snowplow_media_player.snowplow_media_player_media_stats)
`snowplow_media_player_media_ad_views` | This derived table aggregated individual views of ads during media playback. | [Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/model/model.snowplow_media_player.snowplow_media_player_media_ad_views)
`snowplow_media_player_media_ads` | This derived table aggregates information about ads. Each row represents one ad played within a certain media on a certain platform. Stats about the number of ad clicks, progress reached and more are calculated as total values but also as counts of unique users. | [Docs](https://snowplow.github.io/dbt-snowplow-media-player/#!/model/model.snowplow_media_player.snowplow_media_player_media_ads)
