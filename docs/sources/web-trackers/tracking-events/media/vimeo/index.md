---
title: "Vimeo media tracking on web"
sidebar_label: "Vimeo"
sidebar_position: 15
description: "Automatically track Vimeo video players embedded via iframe or Vimeo Player SDK with comprehensive playback and interaction events."
keywords: ["vimeo", "video tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md";
```

This plugin enables the automatic tracking of a Vimeo video. It uses the [Snowplow Media plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md) under the hood.

Vimeo media events and entities are **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-vimeo-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-vimeo-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-vimeo-tracking@latest/dist/index.umd.min.js',
    ['snowplowVimeoTracking', 'VimeoTrackingPlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-vimeo-tracking`
- `yarn add @snowplow/browser-plugin-vimeo-tracking`
- `pnpm add @snowplow/browser-plugin-vimeo-tracking`

```javascript
import { VimeoTrackingPlugin } from '@snowplow/browser-plugin-vimeo-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ VimeoTrackingPlugin() ],
});
```

  </TabItem>
</Tabs>

## Quick Start

The snippets below show how to get started with the plugin, after [setting up your tracker](/docs/sources/web-trackers/tracker-setup/index.md).

Using an `iFrame`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```html
<iframe
  id='vimeo-iframe'
  src='https://player.vimeo.com/video/535907279?h=db7ea8b89c'
></iframe>
```

```javascript
const id = 'XXXXX'; // randomly generated ID
const video = document.getElementById('vimeo-iframe')

window.snowplow('startVimeoTracking', { id, video });

// Vimeo events are tracked...

window.snowplow('endVimeoTracking', id);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">


```html
<iframe
  id='vimeo-iframe'
  src='https://player.vimeo.com/video/535907279?h=db7ea8b89c'
></iframe>
```

```javascript
import { startVimeoTracking, endVimeoTracking } from '@snowplow/browser-plugin-vimeo-tracking'

const id = 'XXXXX'; // randomly generated ID
const video = document.getElementById('vimeo-iframe')

startVimeoTracking({ id, video })

// Vimeo events are tracked...

endVimeoTracking(id)
```
  </TabItem>
</Tabs>

Using `Vimeo.Player`:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```html
<div id='vimeo-player'></div>
```

```javascript
const id = 'XXXXX'; // randomly generated ID
const video = new Vimeo.Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

window.snowplow('startVimeoTracking', { id, video });

// Vimeo events are tracked...

window.snowplow('endVimeoTracking', id);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">



```html
<div id='vimeo-player'></div>
```

```javascript
import { Player } from '@vimeo/player'
import { startVimeoTracking, endVimeoTracking } from '@snowplow/browser-plugin-vimeo-tracking'

const id = 'XXXXX'; // randomly generated ID
const video = new Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

startVimeoTracking({ id, video })

// Vimeo events are tracked...

endVimeoTracking(id)
```

  </TabItem>
</Tabs>

## Start tracking

Use the `startVimeoTracking` function to begin tracking Vimeo media events. You must provide a unique `id` for the media session, along with the `video` element or `Vimeo.Player` instance.

| Parameter                                       | Type                                                                                                                         | Description                                                                                                                        | Default / Required            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `id`                                            | `string`                                                                                                                     | A unique session UUID for each media element, used to identify and end tracking.                                                   | Required                      |
| `video`                                         | `HTMLIFrameElement` or `Player`                                                                                              | An `iframe` element, or an instance of `Vimeo.Player` created with the [Vimeo Player SDK](https://developer.vimeo.com/player/sdk). | Required                      |
| `label`                                         | `string`                                                                                                                     | A custom human-readable label for the media element.                                                                               | `undefined`                   |
| `captureEvents`                                 | `VimeoEvent[]`                                                                                                               | A list of media events to track.                                                                                                   | All events tracked by default |
| `boundaries`                                    | `number[]`                                                                                                                   | Percentage thresholds (0-100) to trigger progress events.                                                                          | `[10, 25, 50, 75]`            |
| `context`                                       | [`DynamicContext`](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#global-contexts-methods) | Dynamic contexts attached to each tracking event.                                                                                  | `undefined`                   |
| `updatePageActivityWhilePlaying`                | `boolean`                                                                                                                    | Whether to update page activity while media is playing.                                                                            | `true`                        |
| `filterOutRepeatedEvents`                       | `FilterOutRepeatedEvents`                                                                                                    | Whether to suppress consecutive identical events.                                                                                  | Enabled by default            |
| `filterOutRepeatedEvents` `.seekEvents`         | `boolean`                                                                                                                    | Whether to filter out seek start and end events tracked after each other.                                                          | `true`                        |
| `filterOutRepeatedEvents` `.volumeChangeEvents` | `boolean`                                                                                                                    | Whether to filter out volume change events tracked after each other.                                                               | `true`                        |
| `filterOutRepeatedEvents` `.flushTimeoutMs`     | `number`                                                                                                                     | Timeout in milliseconds after which to send the events that are queued for filtering.                                              | `5000` (milliseconds)         |
| `pings.pingInterval`                            | `number`                                                                                                                     | Interval (in seconds) for sending ping events.                                                                                     | `30` (seconds)                |
| `pings.maxPausedPings`                          | `number`                                                                                                                     | Maximum number of ping events sent while playback is paused.                                                                       | `1`                           |
| `session`                                       | `boolean` or `object`                                                                                                        | Whether to track the media session entity for playback statistics, or set a custom start time.                                     | `true`                        |

## Stop tracking

It's important to call `endVimeoTracking` when you finish tracking. This will end any recurring ping events, clear all listeners set by the Vimeo plugin, along with resetting statistics counters used by the Snowplow Media plugin.

## Events

The plugin provides automatic tracking of the following events. Note that some events are specific to this plugin, and not part of the standard Snowplow Media events.

| Vimeo Event Name                 | Description                                                                                        | Vimeo only |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ---------- |
| `Ready`                          | Sent when the media tracking is successfully attached to the player and can track events.          |            |
| `Play`                           | Sent when the player changes state to playing from previously being paused.                        |            |
| `Pause`                          | Sent when the user pauses the playback.                                                            |            |
| `End`                            | Sent when playback stops when end of the media is reached or because no further data is available. |            |
| `SeekStart`                      | Sent when a seek operation begins.                                                                 |            |
| `SeekEnd`                        | Sent when a seek operation completes.                                                              |            |
| `PlaybackRateChange`             | Sent when the playback rate has changed.                                                           |            |
| `VolumeChange`                   | Sent when the volume has changed.                                                                  |            |
| `FullscreenChange`               | Sent immediately after the browser switches into or out of full-screen mode.                       |            |
| `PictureInPictureChange`         | Sent immediately after the browser switches into or out of picture-in-picture mode.                |            |
| `BufferStart`                    | Sent when the player goes into the buffering state and begins to buffer content.                   |            |
| `BufferEnd`                      | Sent when the player finishes buffering content and resumes playback.                              |            |
| `QualityChange`                  | Sent when the video playback quality changes automatically.                                        |            |
| `Error`                          | Sent when the Vimeo player encounters an error                                                     |            |
| `Ping`                           | Fires periodically during playback                                                                 |            |
| `PercentProgress`                | Fires at progress milestones defined by `boundaries` option                                        |            |
| `CuePoint`                       | Sent when a cue point is reached.                                                                  | ✅          |
| `ChapterChange`                  | Sent when the chapter changes.                                                                     | ✅          |
| `TextTrackChange`                | Sent when the text track changes.                                                                  | ✅          |
| `InteractiveHotspotClicked`      | Sent when an interactive hotspot is clicked.                                                       | ✅          |
| `InteractiveOverlayPanelClicked` | Sent when an interactive overlay panel is clicked.                                                 | ✅          |

If you wish to track only a subset of these events, pass an array of `VimeoEvent`s to the `startVimeoTracking` function:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('startVimeoTracking',  {
  id,
  video,
  captureEvents: ['play', 'pause'],
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { VimeoEvent } from '@snowplow/browser-plugin-vimeo-tracking'

startVimeoTracking({
  id,
  video,
  captureEvents: [VimeoEvent.Play, VimeoEvent.Pause],
})
```

  </TabItem>
</Tabs>

### Track events manually

For event types provided by the [Snowplow Media plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md) but not automatically tracked by the Vimeo plugin, such as advertising events, you can use the corresponding `track*Event` functions from the Snowplow Media plugin.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
const id = 'XXXXX'; // randomly generated ID

const video = new Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

window.snowplow('startVimeoTracking', { id, video });

...

// When your ad break starts
window.snowplow('trackMediaAdBreakStart', { id });

// When your ad break ends
window.snowplow('trackMediaAdBreakEnd', { id });

...

window.snowplow('endVimeoTracking', id);;
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackMediaAdBreakStart, trackMediaAdBreakEnd } from '@snowplow/browser-plugin-media';

const id = 'XXXXX'; // randomly generated ID

const video = new Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

startVimeoTracking({ id, video });

...

// When your ad break starts
trackMediaAdBreakStart({ id });

// When your ad break ends
trackMediaAdBreakEnd({ id });

...

endVimeoTracking(id);
```
  </TabItem>
</Tabs>

## Vimeo-specific event schemas

The `CuePoint`, `ChapterChange`, `TextTrackChange`, `InteractiveHotspotClicked`, and `InteractiveOverlayPanelClicked` events are specific to the Vimeo plugin, and not provided by the Snowplow Media plugin.

### Cue point

Fired when a cue point added via `addCuePoint()` is reached during playback.

<SchemaProperties
  overview={{event: true}}
  example={{
    "id": "fb819c48-5760-4d94-9c5b-4fa52f61a998",
    "cuePointTime": 30.5,
    "data": { "label": "Chapter 1" }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo cue point event, fired when a cue point is reached in a video.", "self": { "vendor": "com.vimeo", "name": "cue_point_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "type": "string", "format": "uuid", "description": "The ID of the cue point." }, "cuePointTime": { "type": "number", "description": "The location of the cue point in seconds.", "minimum": 0, "maximum": 2147483647 }, "data": { "type": [ "object", "null" ], "description": "The custom data from the addCuePoint() call, or an empty object.", "additionalProperties": true } }, "additionalProperties": false, "required": [ "id", "cuePointTime" ] }} />

### Chapter change

Fired when the current chapter changes during playback.

<SchemaProperties
  overview={{event: true}}
  example={{
    "index": 2,
    "startTime": 120,
    "title": "Getting Started"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo chapter change event fired when the current chapter changes.", "self": { "vendor": "com.vimeo", "name": "chapter_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "index": { "type": [ "integer", "null" ], "description": "The chapter number.", "maximum": 100, "minimum": 1 }, "startTime": { "type": [ "integer", "null" ], "description": "The time in seconds when the chapter begins.", "maximum": 2147483647, "minimum": 0 }, "title": { "type": [ "string", "null" ], "description": "The chapter title.", "maxLength": 4096 } }, "additionalProperties": false }} />

### Text track change

Fired when the active text track (captions or subtitles) changes.

<SchemaProperties
  overview={{event: true}}
  example={{
    "kind": "captions",
    "language": "en",
    "label": "English",
    "mode": "showing"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo text track event, fired when the active text track of the captions or subtitle kind changes.", "self": { "vendor": "com.vimeo", "name": "text_track_change_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "kind": { "type": [ "string", "null" ], "description": "The kind of the text track: 'captions' or 'subtitles'.", "maxLength": 4096 }, "language": { "type": [ "string", "null" ], "description": "The ISO code of the text track's language.", "maxLength": 4096 }, "label": { "type": [ "string", "null" ], "description": "The human-readable label of the text track for identification purposes.", "maxLength": 4096 }, "mode": { "type": [ "string", "null" ], "description": "The mode of the text track", "maxLength": 4096 } }, "additionalProperties": false }} />

### Interactive hotspot clicked

Fired when a user clicks an interactive hotspot in a Vimeo interactive video. The interaction details are provided in the `interaction` entity.

<SchemaProperties
  overview={{event: true}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo interactive video hotspot click", "self": { "vendor": "com.vimeo", "name": "interactive_hotspot_click_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

### Interactive overlay panel clicked

Fired when a user clicks an interactive overlay panel in a Vimeo interactive video. The interaction details are provided in the `interaction` entity.

<SchemaProperties
  overview={{event: true}}
  example={{ }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo interactive overlay panel click", "self": { "vendor": "com.vimeo", "name": "interactive_overlay_panel_click_event", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": {}, "additionalProperties": false }} />

## Vimeo entities

The event and entity schemas are [the same as](/docs/events/ootb-data/media-events/index.md) for the [Snowplow Media plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md), plus the Vimeo-specific events detailed above.

Along with the standard Snowplow media entities, the Vimeo media plugin also tracks two Vimeo media-specific entities, `meta` and `interaction`.

### Video metadata

The `meta` entity provides additional metadata about the video. It's added to the `Ready` event only.

<SchemaProperties
  overview={{event: false}}
  example={{
    "videoId": 535907279,
    "videoTitle": "Introduction to Analytics",
    "videoUrl": "https://vimeo.com/535907279",
    "videoWidth": 1920,
    "videoHeight": 1080
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a Vimeo video metadata.", "self": { "vendor": "com.vimeo", "name": "meta", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "videoId": { "type": "number", "description": "The Vimeo ID of the video.", "minimum": 0, "maximum": 9223372036854776000 }, "videoTitle": { "type": "string", "description": "The title of the video.", "maxLength": 4096 }, "videoUrl": { "type": [ "string", "null" ], "format": "uri", "description": "The URL of the video on vimeo.com.", "maxLength": 4096 }, "videoWidth": { "type": "number", "description": "The native width of the video as the width of the video's highest available resolution.", "minimum": 0, "maximum": 9223372036854776000 }, "videoHeight": { "type": "number", "description": "The native height of the video as the height of the video's highest available resolution.", "minimum": 0, "maximum": 9223372036854776000 } }, "additionalProperties": false, "required": [ "videoId", "videoTitle", "videoWidth", "videoHeight" ] }} />

### Interaction

The `interaction` entity provides details of user interactions for `InteractiveHotspotClicked` and `InteractiveOverlayPanelClicked` events.

<SchemaProperties
  overview={{event: false}}
  example={{
    "action": "clickthrough",
    "actionPreference": {
      "pauseOnAction": true,
      "url": "https://example.com/product"
    },
    "hotspotId": "hs-product-link",
    "currentTime": 45.2
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Context Schema attached to interactive_hotspot_click_event and interactive_overlay_panel_click_event.", "self": { "vendor": "com.vimeo", "name": "interaction", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "action": { "type": "string", "description": "The action type of the hotspot.", "maxLength": 4096 }, "actionPreference": { "type": "object", "description": "The user's preferred action type for the hotspot.", "properties": { "pauseOnAction": { "type": [ "boolean", "null" ], "description": "Whether to pause when the action type is overlay, url, seek, event, or none." }, "overlayId": { "type": [ "string", "null" ], "description": "When action is overlay, the displayed unique ID for the overlay when the hotspot is clicked.", "maxLength": 4096 }, "seekTo": { "type": [ "number", "null" ], "description": "When action is seek, the time in seconds that the video should jump to when the hotspot is clicked.", "minimum": 0, "maximum": 2147483647 }, "seekToFrame": { "type": [ "number", "null" ], "description": "When action is seek, the frame that the video should jump to when the hotspot is clicked.", "minimum": 0, "maximum": 2147483647 }, "url": { "format": "uri", "type": [ "string", "null" ], "description": "When action is clickthrough, the target URL when the overlay panel is clicked.", "maxLength": 4096 } }, "additionalProperties": false }, "customPayloadData": { "type": [ "object", "null" ], "description": "The custom payload data of the interactive hotspot", "additionalProperties": true }, "currentTime": { "type": [ "number", "null" ], "description": "The current time of the video when the interaction occurs is clicked.", "minimum": 0, "maximum": 2147483647 }, "hotspotId": { "type": [ "string", "null" ], "description": "The unique ID for the hotspot.", "maxLength": 4096 }, "panelId": { "type": [ "string", "null" ], "description": "The unique ID for a panel within the overlay.", "maxLength": 36, "minLength": 1 }, "overlayId": { "type": [ "string", "null" ], "description": "When action is overlay, the displayed unique ID for the overlay when the hotspot is clicked.", "maxLength": 4096 } }, "additionalProperties": false, "required": [ "action", "actionPreference" ] }} />

## Advanced usage

As the Vimeo plugin uses Snowplow Media internally, for more granular control over events, you can utilise any of the functions provided by the [Snowplow Media plugin](/docs/sources/web-trackers/tracking-events/media/index.md).

For example, if you wish to include additional behavior when a video is paused, you can create callback on the `pause` event of an instance of a Vimeo player.

:::note
In the following example, ensure you aren't passing the `pause` event to the `startVimeoTracking` function, as this will result in the event being tracked twice.
:::

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
const id = 'XXXXX'; // randomly generated ID

const video = new Vimeo.Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

window.snowplow('startVimeoTracking', { id, video, captureEvents: ['play']});

video.on('pause', () => {
  // Do something when the video is paused
  window.snowplow('trackPauseEvent', { id });
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { Player } from '@vimeo/player'
import { trackPauseEvent } from '@snowplow/browser-plugin-media'

const id = 'XXXXX'; // randomly generated ID

const video = new Player('vimeo-player', {
  videoId: 'zSM4ZyVe8xs'
});

startVimeoTracking({ id, video, captureEvents: [VimeoEvent.Play]});

video.on('pause', () => {
  // Do something when the video is paused
  trackPauseEvent({ id })
});
```

  </TabItem>
</Tabs>

You can also provide `player` configuration when calling `startVimeoTracking`, to set options on the underlying Vimeo player instance.
