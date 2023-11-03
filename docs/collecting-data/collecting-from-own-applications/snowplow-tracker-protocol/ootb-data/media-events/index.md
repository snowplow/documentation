---
title: "Media events"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

<TOCInline toc={toc} maxHeadingLevel={3} />

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

ad_click_event

#### Ad break start event

ad_break_start_event

#### Ad break end event

ad_break_end_event

#### Ad complete event

ad_complete_event

#### Ad pause event

ad_pause_event

#### Ad quartile event

ad_quartile_event

#### Ad resume event

ad_resume_event

#### Ad skip event

ad_skip_event

#### Ad start event

ad_start_event

## Context entities

### Media player entity

media_player

### Media session entity

session

### Media ad and ad break

ad

ad_break

## How to track?

## Modeled data using the snowplow-media-player dbt package

[The package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) contains a fully incremental model that transforms raw media event data into a set of derived tables based around the following data objects: media plays, media stats, media ad views, and media ads.

Derived table | Table description | 
---|---|---


TODO old media schemas
