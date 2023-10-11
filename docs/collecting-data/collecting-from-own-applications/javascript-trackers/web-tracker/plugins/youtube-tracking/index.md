---
title: "YouTube Tracking"
date: "2022-01-12"
sidebar_position: 17000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin will allow the tracking of an embedded YouTube IFrame.

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** This plugin will not work if using GAv4 Enhanced Measurement Video engagement, as both the GAv4 and Snowplow trackers will attempt to attach to the Youtube video.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-youtube-tracking`
- `yarn add @snowplow/browser-plugin-youtube-tracking`
- `pnpm add @snowplow/browser-plugin-youtube-tracking`


  </TabItem>
</Tabs>

## Quick Start

The snippets below show how to get started with the plugin, after [setting up your tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/installing-the-tracker/index.md).

:::info The plugin's `id` attribute will accept:
- The `id` of an `iframe` element
- An existing instance of `YT.Player`, created with the [YouTube Iframe API](https://developers.google.com/youtube/iframe_api_reference)
:::

1. `iFrame`

For this plugin to find your media element, your iFrame must be given the id that is passed into `enableYouTubeTracking`.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

      window.snowplow('enableYouTubeTracking', {
        id: 'yt-player'
      });
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```html
<iframe
  id="yt-player"
  src="https://www.youtube.com/embed/zSM4ZyVe8xs"
></iframe>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, enableYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ YouTubeTrackingPlugin() ],
});

enableYouTubeTracking({
  id: 'yt-player'
})
```

  </TabItem>
</Tabs>

1. `YT.Player`

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

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

      window.snowplow('enableYouTubeTracking', {
          id: player
      });
    </script>
  </body>
</html>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```html
<div id="yt-player"></div>
```

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { YouTubeTrackingPlugin, enableYouTubeTracking } from '@snowplow/browser-plugin-youtube-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ YouTubeTrackingPlugin() ],
});

const player = new YT.Player('yt-player', {
  videoId: 'zSM4ZyVe8xs'
});

enableYouTubeTracking({
  id: player,
})
```

  </TabItem>
</Tabs>

## The enableYouTubeTracking function

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
| `options.updateRate`    | `number`                | `250`               | The rate at which `seek` and `volumechange` events can occur [[2]](#2)                                         | No       |

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

## Events

### Capturable Events

Below is a table of all the events that can be used in `options.captureEvents`

| Name                  | Fire Condition                                                    |
| --------------------- | ----------------------------------------------------------------- |
| play                  | The video is played                                               |
| pause                 | The video is paused                                               |
| seek                  | On seek                                                           |
| volumechange          | Volume has changed                                                |
| ended                 | When playback stops at the end of the video                       |
| error                 | An error occurs in the player                                     |
| percentprogress       | When a percentage boundary set in `options.boundaries` is reached |
| playbackratechange    | Playback rate has changed                                         |
| playbackqualitychange | Playback quality has changed                                      |

### Event Groups

You can also use a pre-made event group in `options.captureEvents`:

| Name            | Events                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DefaultEvents` | `['play', 'pause', 'seek', 'volumechange', 'ended', 'percentprogress', 'playbackratechange', 'playbackqualitychange']` |
| `AllEvents`     | Every event listed in [Capturable Events](#capturable-events)                                                          |

It is possible to extend an event group with any event in the Events table above. This could be useful if you want, for example, all the events contained in the 'DefaultEvents' group, along with the 'error' event. This is expressed in the following way:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('enableYouTubeTracking', {
  id: "example-video",
  options: {
    captureEvents: ["DefaultEvents", "error"],
  }
})
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
enableYouTubeTracking({
  id: 'example-video',
  options: {
    captureEvents: ['DefaultEvents', 'error'],
  }
})
```

  </TabItem>
</Tabs>

## Schemas and Example Data

Three schemas are used with this plugin:

### [An unstructured event with identifying information](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0)

```json
{
    "type": "play",
    "label": "Identifying Label"
}
```

### [Snowplow platform-agnostic media context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0)

```json
{
    "currentTime": 12.32,
    "duration": 20,
    "ended": false,
    "loop": false,
    "muted": true,
    "paused": false,
    "playbackRate": 1,
    "volume": 100
}
```

### [YouTube player specific context](https://github.com/snowplow/iglu-central/blob/master/schemas/org.whatwg/media_element/jsonschema/1-0-0)

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

* * *

1. To track when a video ends, use the 'ended' event.

2. `seek` and `volumechange` use `setInterval` to poll the player every `n` ms. You are able to adjust the poll rate, however, lower values may cause performance issues.
