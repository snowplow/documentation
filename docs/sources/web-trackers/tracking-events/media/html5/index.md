---
title: "HTML5 media tracking on web"
sidebar_label: "HTML5"
sidebar_position: 10
description: "Automatically track HTML5 video and audio elements with media events including play, pause, seek, buffer, and progress milestones."
keywords: ["html5 media", "video tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md";
```

This plugin enables the automatic tracking of HTML5 media elements (`<video>` and `<audio>`) on a webpage.

It uses the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md) under the hood.

HTML5 media events and entities are **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-media-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media-tracking@latest/dist/index.umd.min.js",
  ["snowplowMediaTracking", "MediaTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-media-tracking`
- `yarn add @snowplow/browser-plugin-media-tracking`
- `pnpm add @snowplow/browser-plugin-media-tracking`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { MediaTrackingPlugin, startHtml5MediaTracking } from '@snowplow/browser-plugin-media-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ MediaTrackingPlugin() ],
});

startHtml5MediaTracking(/* options */);
```

  </TabItem>
</Tabs>

## Quick Start

To start tracking media with default settings:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

**`main.js`**

```html
<video id='html-id' src='./video.mp4'></video>
<script>
  window.snowplow('addPlugin',
    "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media-tracking@latest/dist/index.umd.min.js",
    ["snowplowMediaTracking", "MediaTrackingPlugin"]
  );

  const sessionId = crypto.randomUUID();

  window.snowplow('startHtml5MediaTracking', {
    id: sessionId,
    video: 'html-id',
  })
</script>
```

**`index.html`**

```html
<video id='html-id' src='./video.mp4'></video>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

**`main.js`**

```javascript
import { startHtml5MediaTracking } from '@snowplow/browser-plugin-media-tracking'

const sessionId = crypto.randomUUID();

startHtml5MediaTracking({
  id: sessionId,
  video: 'html-id',
})

```

**`index.html`**

```html
<video id='html-id' src='./video.mp4'></video>
```

  </TabItem>
</Tabs>

## Start tracking

Start tracking HTML5 media by calling the `startHtml5MediaTracking` function with a configuration object:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('startHtml5MediaTracking', {
  id: "unique-session-id",
  video: "myVideoElement",
  label: "Product Demo Video",
  captureEvents: ["play", "pause", "end"],
  boundaries: [25, 50, 75, 100],
  pings: {
    pingInterval: 20,
    maxPausedPings: 2,
  },
  updatePageActivityWhilePlaying: true,
  filterOutRepeatedEvents: {
    seekEvents: true,
    volumeChangeEvents: false,
    flushTimeoutMs: 5000
  },
  session: {
    // Custom session start time
    startedAt: new Date('2024-01-01T12:00:00Z'),
  },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
startHtml5MediaTracking({
  id: "unique-session-id",
  video: document.getElementById("myVideoElement"),
  label: "Product Demo Video",
  captureEvents: ["play", "pause", "end"],
  boundaries: [25, 50, 75, 100],
  pings: {
    pingInterval: 20,
    maxPausedPings: 2,
  },
  updatePageActivityWhilePlaying: true,
  filterOutRepeatedEvents: {
    seekEvents: true,
    volumeChangeEvents: false,
    flushTimeoutMs: 5000
  },
  session: {
    // Custom session start time
    startedAt: new Date('2024-01-01T12:00:00Z'),
  },
});
```

  </TabItem>
</Tabs>

| Parameter                                       | Type                                                                                                                         | Description                                                                                    | Default / Required            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------- |
| `id`                                            | `string`                                                                                                                     | A unique session ID for each media element, used to identify and end tracking.                 | Required                      |
| `video`                                         | `string` or `HTMLMediaElement`                                                                                               | The ID of the media element (as a string) or the media element itself.                         | Required                      |
| `label`                                         | `string`                                                                                                                     | A human-readable label for the media element.                                                  | `undefined`                   |
| `captureEvents`                                 | `HTML5MediaEventTypes`                                                                                                       | A list of media events to track.                                                               | All events tracked by default |
| `boundaries`                                    | `number[]`                                                                                                                   | Percentage thresholds (0-100) to trigger progress events.                                      | `[10, 25, 50, 75]`            |
| `context`                                       | [`DynamicContext`](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#global-contexts-methods) | Dynamic contexts attached to each tracking event.                                              | `undefined`                   |
| `updatePageActivityWhilePlaying`                | `boolean`                                                                                                                    | Whether to update page activity while media is playing.                                        | `true`                        |
| `filterOutRepeatedEvents`                       | `FilterOutRepeatedEvents`                                                                                                    | Whether to suppress consecutive identical events.                                              | Enabled by default            |
| `filterOutRepeatedEvents` `.seekEvents`         | `boolean`                                                                                                                    | Whether to filter out seek start and end events tracked after each other.                      | `true`                        |
| `filterOutRepeatedEvents` `.volumeChangeEvents` | `boolean`                                                                                                                    | Whether to filter out volume change events tracked after each other.                           | `true`                        |
| `filterOutRepeatedEvents` `.flushTimeoutMs`     | `number`                                                                                                                     | Timeout in milliseconds after which to send the events that are queued for filtering.          | `5000` (milliseconds)         |
| `pings.pingInterval`                            | `number`                                                                                                                     | Interval (in seconds) for sending ping events.                                                 | `30` (seconds)                |
| `pings.maxPausedPings`                          | `number`                                                                                                                     | Maximum number of ping events sent while playback is paused.                                   | `1`                           |
| `session`                                       | `boolean` or `object`                                                                                                        | Whether to track the media session entity for playback statistics, or set a custom start time. | `true`                        |

## Stop tracking

End tracking by calling `endHtml5MediaTracking`. This function disables auto tracking for the player registered with the provided session ID.
It will remove any event listeners and poll intervals, and call [`endMediaTracking`](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md#usage) from the core plugin.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

**`main.js`**

```html
<video id='html-id' src='./video.mp4'></video>
<script>
  window.snowplow('addPlugin',
    "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media-tracking@latest/dist/index.umd.min.js",
    ["snowplowMediaTracking", "MediaTrackingPlugin"]
  );

  const sessionId = crypto.randomUUID();

  window.snowplow('startHtml5MediaTracking', {
    id: sessionId,
    video: 'html-id',
  })

  // Tracking some video events...

  window.snowplow('endHtml5MediaTracking', sessionId)
</script>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

**`main.js`**

```javascript
import { startHtml5MediaTracking, endHtml5MediaTracking } from '@snowplow/browser-plugin-media-tracking'

const sessionId = crypto.randomUUID();

startHtml5MediaTracking({
  id: "session-id",
  video: 'html-id',
})

// Tracking some video events...

endHtml5MediaTracking(sessionId)
```

**`index.html`**

```html
<video id='html-id' src='./video.mp4'></video>
```

  </TabItem>
</Tabs>

## Events

The HTML5 media plugin can track the following events:

| Event Type                 | Event String                | Description                                                                                   |
| -------------------------- | --------------------------- | --------------------------------------------------------------------------------------------- |
| **Ready**                  | `ready`                     | Fired when media tracking is successfully attached to the player and ready to track events.   |
| **Play**                   | `play`                      | Fired when the player transitions from a paused state to playing.                             |
| **Pause**                  | `pause`                     | Fired when the user pauses the playback.                                                      |
| **End**                    | `end`                       | Fired when playback stops because the media has reached its end or no more data is available. |
| **SeekEnd**                | `seek_end`                  | Fired when a seek operation is completed.                                                     |
| **PlaybackRateChange**     | `playback_rate_change`      | Fired when the playback rate (speed) of the media changes.                                    |
| **VolumeChange**           | `volume_change`             | Fired when the volume level of the media changes.                                             |
| **FullscreenChange**       | `fullscreen_change`         | Fired when the browser enters or exits full-screen mode.                                      |
| **PictureInPictureChange** | `picture_in_picture_change` | Fired when the browser enters or exits picture-in-picture mode.                               |
| **BufferStart**            | `buffer_start`              | Fired when the media player starts buffering (loading content to play).                       |
| **BufferEnd**              | `buffer_end`                | Fired when buffering ends, and playback resumes.                                              |
| **Error**                  | `error`                     | Fired when an error occurs during the loading or playback of the media.                       |
| **Ping**                   | `ping`                      | Fired periodically during media playback, regardless of other events.                         |
| **PercentProgress**        | `percent_progress`          | Fired when a specific percentage of the media content has been played (as set by boundaries). |

It's possible to only track a subset of these events by passing an array of event types to the `captureEvents` option:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow("startHtml5MediaTracking", {
  id: crypto.randomUUID(),
  video: 'example-video',
  captureEvents: ['play', 'pause'],
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { startHtml5MediaTracking, HTML5MediaEventTypes } from '@snowplow/browser-plugin-media-tracking'

const sessionId = uuidv4();

startHtml5MediaTracking({
  id: crypto.randomUUID(),
  video: 'example-video',
  captureEvents: [HTML5MediaEventTypes.Play, HTML5MediaEventTypes.Pause],
})
```

  </TabItem>
</Tabs>

## Additional entities

Event and entity schemas are [the same as](/docs/events/ootb-data/media-events/index.md) for the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md).

Along with the standard Snowplow media entities, the HTML5 media plugin also tracks two HTML5 media-specific entities, `media_element` and `video_element`.

For `<video>` elements, both entities are added to all media events in the session. For `<audio>` elements, only the `media_element` entity is added.

### HTML5 media element

<SchemaProperties
  overview={{event: false}}
  example={{
    "htmlId": "my-video",
    "mediaType": "VIDEO",
    "autoPlay": false,
    "buffered": [
      { "start": 0, "end": 20 }
    ],
    "controls": true,
    "currentSrc": "http://example.com/video.mp4",
    "defaultMuted": true,
    "defaultPlaybackRate": 1,
    "disableRemotePlayback": false,
    "error": null,
    "networkState": "NETWORK_IDLE",
    "preload": "metadata",
    "readyState": "HAVE_ENOUGH_DATA",
    "seekable": [
      { "start": 0, "end": 20 }
    ],
    "seeking": false,
    "src": "http://example.com/video.mp4",
    "textTracks": [
      {
        "label": "English",
        "language": "en",
        "kind": "captions",
        "mode": "showing"
      }
    ],
    "fileExtension": "mp4",
    "fullscreen": false,
    "pictureInPicture": false
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Context Schema for a media player event", "self": { "format": "jsonschema", "name": "media_element", "vendor": "org.whatwg", "version": "1-0-0" }, "type": "object", "properties": { "autoPlay": { "type": "boolean", "description": "If playback should automatically begin as soon as enough media is available to do so without interruption" }, "buffered": { "description": "An array of time ranges that have been buffered", "items": { "type": "object", "description": "A time range object", "properties": { "start": { "description": "The beginning of the time range", "maximum": 9007199254740991, "minimum": 0, "type": "number" }, "end": { "description": "The end of the time range", "maximum": 9007199254740991, "minimum": 0, "type": "number" } }, "additionalProperties": false }, "type": "array" }, "controls": { "type": "boolean", "description": "If the user agent should provide it's own set of controls" }, "crossOrigin": { "type": [ "string", "null" ], "description": "CORS settings value of the media player", "maxLength": 255 }, "currentSrc": { "type": "string", "description": "The absolute URL of the media resource", "maxLength": 65535, "format": "uri" }, "defaultMuted": { "type": "boolean", "description": "If audio is muted by default" }, "defaultPlaybackRate": { "type": "number", "description": "The default media playback rate of the player", "minimum": -9007199254740991, "maximum": 9007199254740991 }, "disableRemotePlayback": { "type": [ "boolean", "null" ], "description": "If the media element is allowed to have a remote playback UI" }, "error": { "type": [ "object", "null" ], "description": "An object of the latest error to occur, or null if no errors" }, "fileExtension": { "type": [ "string", "null" ], "description": "The media file format", "maxLength": 255, "minLength": 1 }, "fullscreen": { "type": [ "boolean", "null" ], "description": "If the video element is fullscreen" }, "mediaType": { "type": "string", "description": "If the media is a video element, or audio", "enum": [ "AUDIO", "VIDEO" ], "maxLength": 5 }, "networkState": { "description": "The current state of the fetching of media over the network", "enum": [ "NETWORK_EMPTY", "NETWORK_IDLE", "NETWORK_LOADING", "NETWORK_NO_SOURCE" ], "type": "string" }, "pictureInPicture": { "description": "If the video element is showing Picture-In-Picture", "type": [ "boolean", "null" ] }, "played": { "type": [ "array", "null" ], "description": "An array of time ranges played", "items": { "type": "object", "description": "A time range", "properties": { "start": { "type": "number", "description": "The beginning of the time range", "minimum": 0, "maximum": 9007199254740991 }, "end": { "type": "number", "description": "The end of the time range", "minimum": 0, "maximum": 9007199254740991 } }, "additionalProperties": false } }, "htmlId": { "type": "string", "description": "The HTML id of the element", "maxLength": 65535 }, "preload": { "type": "string", "description": "The 'preload' HTML attribute of the media", "maxLength": 65535 }, "readyState": { "type": "string", "description": "The readiness of the media", "enum": [ "HAVE_NOTHING", "HAVE_METADATA", "HAVE_CURRENT_DATA", "HAVE_FUTURE_DATA", "HAVE_ENOUGH_DATA" ] }, "seekable": { "type": "array", "description": "Seekable time range(s)", "items": { "type": "object", "description": "A time range", "properties": { "end": { "description": "The end of the time range", "maximum": 9007199254740991, "minimum": 0, "type": "number" }, "start": { "description": "The beginning of the time range", "maximum": 9007199254740991, "minimum": 0, "type": "number" } }, "additionalProperties": false } }, "seeking": { "type": "boolean", "description": "If the media is in the process of seeking to a new position" }, "src": { "type": "string", "description": "The 'src' HTML attribute of the media element", "maxLength": 65535, "format": "uri" }, "textTracks": { "type": [ "array", "null" ], "description": "An array of TextTrack objects on the media element", "items": { "type": "object", "description": "A Text Track object", "properties": { "kind": { "type": "string", "description": "The kind of text track this object represents", "enum": [ "subtitles", "captions", "descriptions", "chapters", "metadata" ] }, "label": { "type": "string", "description": "The given label for the text track", "maxLength": 65535 }, "language": { "type": "string", "description": "The locale of the text track, matching BCP-47 (https://www.rfc-editor.org/info/bcp47)", "maxLength": 35 }, "mode": { "type": "string", "description": "The mode the text track is in", "enum": [ "disabled", "hidden", "showing" ] } } } } }, "required": [ "autoPlay", "buffered", "controls", "currentSrc", "defaultMuted", "defaultPlaybackRate", "error", "htmlId", "mediaType", "networkState", "preload", "readyState", "seekable", "seeking" ], "additionalProperties": false }} />


### HTML5 video element

<SchemaProperties
  overview={{event: false}}
  example={{
    "autoPictureInPicture": false,
    "disablePictureInPicture": false,
    "poster": "http://www.example.com/poster.jpg",
    "videoHeight": 300,
    "videoWidth": 400
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Context Schema for a video player event", "self": { "vendor": "org.whatwg", "name": "video_element", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "autoPictureInPicture": { "type": [ "boolean", "null" ], "description": "A boolean value that is true if the video should enter or leave picture-in-picture mode automatically when changing tab and/or application" }, "disablePictureInPicture": { "type": [ "boolean", "null" ], "description": "The disablePictureInPicture property will hint the user agent to not suggest the picture-in-picture to users or to request it automatically" }, "poster": { "type": [ "string", "null" ], "description": "'poster' HTML attribute, which specifies an image to show while no video data is available", "maxLength": 65535 }, "videoHeight": { "type": "integer", "description": "A value indicating the intrinsic height of the resource in CSS pixels, or 0 if no media is available yet", "minimum": 0, "maximum": 65535 }, "videoWidth": { "type": "integer", "description": "A value indicating the intrinsic width of the resource in CSS pixels, or 0 if no media is available yet", "minimum": 0, "maximum": 65535 } }, "additionalProperties": false, "required": [ "videoHeight", "videoWidth" ] }} />
