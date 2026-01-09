---
title: "YouTube media tracking on web"
sidebar_label: "YouTube"
sidebar_position: 20
description: "Automatically track YouTube video players embedded via iframe or YouTube IFrame API with playback events, quality changes, and buffer tracking."
keywords: ["youtube", "video tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin enables the automatic tracking of an embedded YouTube iFrame video, using the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md) and [YouTube Player API](https://developers.google.com/youtube/iframe_api_reference).

YouTube media events and entities are **automatically tracked** once configured.

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-youtube-tracking`
- `yarn add @snowplow/browser-plugin-youtube-tracking`
- `pnpm add @snowplow/browser-plugin-youtube-tracking`

</TabItem>
</Tabs>

## Quick Start

The snippets below show how to get started with the plugin, after [setting up your tracker](/docs/sources/web-trackers/tracker-setup/index.md).


### `startYouTubeTracking`

This function enables the auto tracking for the specified YouTube Player.
It installs the iFrame API if necessary, adds event listeners and any poll intervals, and then calls [`startMediaTracking`](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md#starting-and-ending-media-tracking).

The accepted options are the same as for the core `startMediaTracking` method, with the following additions:

- `video`: A DOM ID for the iFrame element hosting the player, an iFrame element, or a pre-existing [YT.Player](https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player) instance to track events for.
- `captureEvents`: An optional list of events to track; see [Events](#events).
- `label`: The plugin manages the [`player` entity](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md#media-player-entity) automatically, but you can optionally supply a custom `label` if required.

As it is required for `startMediaTracking`, the following option is also required:

- `id`: A UUID used to identify the media session the events will be a part of.

Other options such as `updatePageActivityWhilePlaying` will be passed to the core plugin directly.

The function returns the `mediaSessionId` used for the events that will be generated; this value can be passed to [`endYouTubeTracking`](#endyoutubetracking).

<Tabs groupId="platform" queryString>
  <TabItem value="js-iframe" label="JavaScript (tag) - iFrame" default>

```html
<!DOCTYPE html>
<html>
  <body>
    <iframe
      id="yt-player"
      src="https://www.youtube.com/embed/zSM4ZyVe8xs"
    ></iframe>

    <script>
      window.snowplow(
        'addPlugin',
        'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js',
        ['snowplowYouTubeTracking', 'YouTubeTrackingPlugin']
      );

      var mediaSessionId = crypto.randomUUID();

      window.snowplow('startYouTubeTracking', {
        id: mediaSessionId,
        video: 'yt-player' // or: document.getElementById('yt-player')
      });
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser-iframe" label="Browser (npm) - iFrame">

```html
<iframe
  id="yt-player"
  src="https://www.youtube.com/embed/zSM4ZyVe8xs"
></iframe>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, startYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ YouTubeTrackingPlugin() ],
});

const mediaSessionId = startYouTubeTracking({
  id: crypto.randomUUID(),
  video: 'yt-player' // or: document.getElementById('yt-player')
})
```

  </TabItem>
  <TabItem value="js-player" label="JavaScript (tag) - YT.Player">

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="yt-player"></div>

    <script>
      window.snowplow(
        'addPlugin',
        'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js',
        ['snowplowYouTubeTracking', 'YouTubeTrackingPlugin']
      );

      const player = new YT.Player('yt-player', {
        videoId: 'zSM4ZyVe8xs'
      });

      const mediaSessionId = crypto.randomUUID();

      window.snowplow('startYouTubeTracking', {
          id: mediaSessionId,
          video: player
      });
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser-player" label="Browser (npm) - YT.Player">

```html
<div id="yt-player"></div>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, startYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ YouTubeTrackingPlugin() ],
});

const player = new YT.Player('yt-player', {
  videoId: 'zSM4ZyVe8xs'
});

const mediaSessionId = startYouTubeTracking({
  id: crypto.randomUUID(),
  video: player
})
```

  </TabItem>
</Tabs>

### `endYouTubeTracking`

This function disables auto tracking for the player registered with the provided session ID.

It will remove any event listeners and poll intervals, and call [`endMediaTracking`](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md#starting-and-ending-media-tracking) from the core plugin.

<Tabs groupId="platform" queryString>
  <TabItem value="js-iframe" label="JavaScript (tag) - iFrame" default>

```html
<!DOCTYPE html>
<html>
  <body>
    <iframe
      id="yt-player"
      src="https://www.youtube.com/embed/zSM4ZyVe8xs"
    ></iframe>

    <script>
      window.snowplow(
        'addPlugin',
        'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js',
        ['snowplowYouTubeTracking', 'YouTubeTrackingPlugin']
      );

      var mediaSessionId = crypto.randomUUID();

      window.snowplow('startYouTubeTracking', {
        id: mediaSessionId,
        video: 'yt-player' // or: document.getElementById('yt-player')
      });

      window.snowplow('endYouTubeTracking', mediaSessionId);
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser-iframe" label="Browser (npm) - iFrame">

```html
<iframe
  id="yt-player"
  src="https://www.youtube.com/embed/zSM4ZyVe8xs"
></iframe>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, endYouTubeTracking, startYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ YouTubeTrackingPlugin() ],
});

const mediaSessionId = startYouTubeTracking({
  id: crypto.randomUUID(),
  video: 'yt-player' // or: document.getElementById('yt-player')
});

endYouTubeTracking(mediaSessionId);
```

  </TabItem>
</Tabs>

### `trackYouTubeSelfDescribingEvent`

This function allows tracking custom Self Describing Event payloads that have the media-related entities attached as if they were generated by this or the core plugin directly.

<Tabs groupId="platform" queryString>
  <TabItem value="js-iframe" label="JavaScript (tag) - iFrame" default>

```html
<!DOCTYPE html>
<html>
  <body>
    <iframe
      id="yt-player"
      src="https://www.youtube.com/embed/zSM4ZyVe8xs"
    ></iframe>

    <script>
      window.snowplow(
        'addPlugin',
        'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js',
        ['snowplowYouTubeTracking', 'YouTubeTrackingPlugin']
      );

      var mediaSessionId = crypto.randomUUID();

      window.snowplow('startYouTubeTracking', {
        id: mediaSessionId,
        video: 'yt-player' // or: document.getElementById('yt-player')
      });

      window.snowplow('trackYouTubeSelfDescribingEvent', {event: {schema: 'iglu:com_example/my_event/jsonschema/1-0-0', data: { video: true }}});

      window.snowplow('endYouTubeTracking', mediaSessionId);
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser-iframe" label="Browser (npm) - iFrame">

```html
<iframe
  id="yt-player"
  src="https://www.youtube.com/embed/zSM4ZyVe8xs"
></iframe>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, endYouTubeTracking, startYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ YouTubeTrackingPlugin() ],
});

const mediaSessionId = startYouTubeTracking({
  id: crypto.randomUUID(),
  video: 'yt-player' // or: document.getElementById('yt-player')
});

trackYouTubeSelfDescribingEvent({event: {schema: 'iglu:com_example/my_event/jsonschema/1-0-0', data: { video: true }}});

endYouTubeTracking(mediaSessionId);
```

  </TabItem>
</Tabs>

## Events

### Capturable Events

Below is a table of all the core Snowplow Media plugin events that can be used in the `captureEvents` option:

| Name                 | Fire Condition                                                   |
| -------------------- | ---------------------------------------------------------------- |
| ready                | The video player has loaded                                      |
| play                 | The video is played                                              |
| pause                | The video is paused                                              |
| end                  | When playback stops at the end of the video                      |
| seek_start           | When seeking begins to jump to another position of the video     |
| seek_end             | When seeking ends and another position of the video is jumped to |
| playback_rate_change | Playback rate has changed                                        |
| volume_change        | Volume has changed                                               |
| ping                 | Fires periodically during playback                               |
| percent_progress     | Fires at progress milestones defined by `boundaries` option      |
| buffer_start         | Fires when playback pauses because content is not yet buffered   |
| buffer_end           | Fires when playback resumes after content has been fetched       |
| quality_change       | Playback quality has changed                                     |
| error                | An error occurs in the player                                    |

In addition, the following event names are also accepted for compatibility with v3, mapped to the equivalent event from above:

| Name                  | Fire Condition                                                    |
| --------------------- | ----------------------------------------------------------------- |
| seek                  | On seek                                                           |
| volumechange          | Volume has changed                                                |
| ended                 | When playback stops at the end of the video                       |
| percentprogress       | When a percentage boundary set in `options.boundaries` is reached |
| playbackratechange    | Playback rate has changed                                         |
| playbackqualitychange | Playback quality has changed                                      |

The following events are defined by the core Snowplow Media plugin but _not_ supported by this plugin or the YouTube API:

| Name                      | Fire Condition                                  |
| ------------------------- | ----------------------------------------------- |
| fullscreen_change         | Full screen state toggled                       |
| picture_in_picture_change | Picture-in-picture state toggled                |
| ad_break_start            | Beginning of an ad break                        |
| ad_break_end              | End of an ad break                              |
| ad_start                  | Beginning of an ad within an ad break           |
| ad_first_quartile         | 25% progress through an ad                      |
| ad_midpoint               | 50% progress through an ad                      |
| ad_third_quartile         | 75% progress through an ad                      |
| ad_complete               | 100% progress through an ad                     |
| ad_skip                   | User has opted to skip the ad before completion |
| ad_click                  | User has clicked the playing ad                 |
| ad_pause                  | User has paused the playing ad                  |
| ad_resume                 | User has resumed the paused ad                  |

### Event Groups

You can also use a pre-made event group names in `captureEvents`:

| Name            | Events                                                                                                                                               |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DefaultEvents` | `['ready', 'play', 'pause', 'ping', 'end', 'seek_start', 'seek_end', 'volume_change', 'percent_progress', 'playback_rate_change', 'quality_change']` |
| `AllEvents`     | Every supported event listed in [Capturable Events](#capturable-events)                                                                              |

It is possible to extend an event group with any event in the Events table above. This could be useful if you want, for example, all the events contained in the 'DefaultEvents' group, along with the 'error' event. This is expressed in the following way:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('startYouTubeTracking', {
  id: crypto.randomUUID(),
  video: "example-video",
  captureEvents: ["DefaultEvents", "error"],
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableYouTubeTracking({
  id: crypto.randomUUID(),
  video: 'example-video',
  captureEvents: ['DefaultEvents', 'error'],
})
```

  </TabItem>
</Tabs>

## Legacy API

In addition to the above, the following methods are provided for compatibility with earlier versions of the plugin.

These APIs are deprecated in v4, and wrap the newer API methods above.

### The enableYouTubeTracking function

`enableYouTubeTracking` is similar to `startYouTubeTracking`, except:

- An `id` option is used to identify the player instead of `video`
- The additional options to `startMediaTracking` are nested within an `options` object
- The media session ID value will be generated automatically if not provided

:::info The plugin's `id` option is equivalent to `video` in the new API and will accept:
- The `id` of an `iframe` element
- An `iframe` element directly
- An existing instance of `YT.Player`, created with the [YouTube Iframe API](https://developers.google.com/youtube/iframe_api_reference)
:::

The `enableYouTubeTracking` function takes the form:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow("enableYouTubeTracking", { id, options?: { label?, captureEvents?, boundaries?, updateRate? } })
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableYouTubeTracking({ id, options?: { label?, captureEvents?, boundaries?, updateRate? } })
```

  </TabItem>
</Tabs>


| Parameter               | Type                    | Default             | Description                                                                                                    | Required |
| ----------------------- | ----------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `id`                    | `string` or `YT.Player` | \-                  | The HTML id attribute of the media element                                                                     | Yes      |
| `options.label`         | `string`                | \-                  | An identifiable custom label sent with the event                                                               | No       |
| `options.captureEvents` | `string[]`              | `['DefaultEvents']` | The events or Event Group to capture. For a full list of events and groups, check the [section below](#events) | No       |
| `options.boundaries`    | `number[]`              | `[10, 25, 50, 75]`  | The progress percentages to fire an event at (valid values 1 - 99 inclusive) [[1]](#1)                         | No       |
| `options.*`             | `any`                   |                     | Any other options are passed through to `startMediaTracking`                                                   | No       |

Below is an example of the full `enableYouTubeTracking` function:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableYouTubeTracking', {
  id: 'example-video',
  options: {
    label: 'My Custom Video Label',
    captureEvents: ['play', 'pause', 'ended'],
    boundaries: [20, 80],
    updateRate: 500,
  }
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableYouTubeTracking({
  id: 'example-video',
  options: {
    label: 'My Custom Video Label',
    captureEvents: ['play', 'pause', 'ended'],
    boundaries: [20, 80],
    updateRate: 200,
  }
})
```

  </TabItem>
</Tabs>

### The disableYouTubeTracking function

This function is an equivalent counterpart to `endYouTubeTracking` for `enableYouTubeTracking`.

Instead of requiring the session ID to be provided, it will remove the oldest of any sessions started with `enableYouTubeTracking` so the session ID doesn't need to be known and passed explicitly.

## Schemas and Example Data

Event and entity schemas are [the same as](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md#tracked-events-and-entities) for the [Snowplow Media Plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/index.md).

In addition, there is a dedicated entity attached with YouTube-specific information to all events.

### [YouTube player specific context](https://github.com/snowplow/iglu-central/tree/master/schemas/com.youtube/youtube/jsonschema/1-0-0)

```json
{
  "autoPlay": false,
  "avaliablePlaybackRates": [
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2
  ],
  "buffering": false,
  "controls": true,
  "cued": false,
  "loaded": 17,
  "playbackQuality": "hd1080",
  "playerId": "example-id",
  "unstarted": false,
  "url": "https://www.youtube.com/watch?v=zSM4ZyVe8xs",
  "yaw": 0,
  "pitch": 0,
  "roll": 0,
  "fov": 100.00004285756798,
  "avaliableQualityLevels": [
    "hd2160",
    "hd1440",
    "hd1080",
    "hd720",
    "large",
    "medium",
    "small",
    "tiny",
    "auto"
  ]
}
```
