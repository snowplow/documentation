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
```

This plugin enables the automatic tracking of HTML media elements (`<video>` and `<audio>`) on a webpage, using the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md).

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
  id: "session-id",
  video: 'html-id',
})

```

**`index.html`**

```html
<video id='html-id' src='./video.mp4'></video>
```

  </TabItem>
</Tabs>

---

### `startHtml5MediaTracking`

This function begins tracking media events for a given media element. It takes a configuration object with the following fields:

#### Required Fields

| Parameter      | Type                         | Description                                                                    |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `config.id`    | `string`                     | A unique session ID for each media element, used to identify and end tracking. |
| `config.video` | `string \| HTMLMediaElement` | The ID of the media element (as a string) or the media element itself.         |

---

#### Optional Fields

| Parameter                               | Type                                                                                                                                  | Description                                               | Default Value                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------- |
| `config.label`                          | `string`                                                                                                                              | A human-readable label for the media element.             | `undefined`                   |
| `config.captureEvents`                  | `HTML5MediaEventTypes`                                                                                                                | A list of media events to track.                          | All events tracked by default |
| `config.boundaries`                     | `number[]`                                                                                                                            | Percentage thresholds (0-100) to trigger progress events. | Disabled                      |
| `config.context`                        | [`DynamicContext`](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md#global-contexts-methods) | Dynamic contexts attached to each tracking event.         | `undefined`                   |
| `config.updatePageActivityWhilePlaying` | `boolean`                                                                                                                             | Whether to update page activity while media is playing.   | `true`                        |
| `config.filterOutRepeatedEvents`        | `FilterOutRepeatedEvents`                                                                                                             | Whether to suppress consecutive identical events.         | `false`                       |

---

#### Ping Configuration (Optional)

| Parameter                     | Type     | Description                                                  | Default Value  |
| ----------------------------- | -------- | ------------------------------------------------------------ | -------------- |
| `config.pings.pingInterval`   | `number` | Interval (in seconds) for sending ping events.               | `30` (seconds) |
| `config.pings.maxPausedPings` | `number` | Maximum number of ping events sent while playback is paused. | `1`            |

---

#### Filter Out Repeated Events Configuration (Optional)

| Parameter                                           | Type      | Description                                                                           | Default Value         |
| --------------------------------------------------- | --------- | ------------------------------------------------------------------------------------- | --------------------- |
| `config.filterOutRepeatedEvents.seekEvents`         | `boolean` | Whether to filter out seek start and end events tracked after each other.             | `false`               |
| `config.filterOutRepeatedEvents.volumeChangeEvents` | `boolean` | Whether to filter out volume change events tracked after each other.                  | `false`               |
| `config.filterOutRepeatedEvents.flushTimeoutMs`     | `number`  | Timeout in milliseconds after which to send the events that are queued for filtering. | `5000` (milliseconds) |

---

### Example Usage

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
});
```

---

### `endHtml5MediaTracking`

This function disables auto tracking for the player registered with the provided session ID.
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

### Customizing Tracked Events

It is possible to only track a subset of these events by passing an array of event types to the `captureEvents` option:

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
import { startHtml5MediaTracking, HTMLMediaEventTypes } from '@snowplow/browser-plugin-media-tracking'

const sessionId = uuidv4();

startHtml5MediaTracking({
  id: crypto.randomUUID(),
  video: 'example-video',
  captureEvents: [HTMLMediaEventTypes.Play, HTMLMediaEventTypes.Pause],
})
```

  </TabItem>
</Tabs>

### Schemas

Event and entity schemas are [the same as](/docs/events/ootb-data/media-events/index.md) for the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md).

Along with the standard media context, the HTML5 media plugin also tracks the following media-specific contexts:

### [HTML5 Media specific context](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0)

```json
{
    "htmlId": "my-video",
    "mediaType": "VIDEO",
    "autoPlay": false,
    "buffered": [
        {
            "start": 0, "end" : 20
        }
    ],
    "controls": true,
    "currentSrc": "http://example.com/video.mp4",
    "defaultMuted": true,
    "defaultPlaybackRate": 1,
    "disableRemotePlayback": false,
    "error": null,
    "networkState": "IDLE",
    "preload": "metadata",
    "readyState": "ENOUGH_DATA",
    "seekable": [
        {
            "start": 0, "end" : 20
        }
    ],
    "seeking": false,
    "src": "http://example.com/video.mp4",
    "textTracks": [
        {
            "label": "English",
            "language": "en",
            "kind": "captions",
            "mode": "showing",
        },
    ],
    "fileExtension": "mp4",
    "fullscreen": false,
    "pictureInPicture": false
}
```

### [HTML5 Video specific context](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/video_element/jsonschema/1-0-0)

```json
{
    "autoPictureInPicture": false,
    "disablePictureInPicture": false,
    "poster": "http://www.example.com/poster.jpg",
    "videoHeight": 300,
    "videoWidth": 400
}
```
