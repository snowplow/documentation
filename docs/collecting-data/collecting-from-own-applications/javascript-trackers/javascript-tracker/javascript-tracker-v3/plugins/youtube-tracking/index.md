---
title: "YouTube Tracking"
date: "2022-01-12"
sidebar_position: 17000
---

```mdx-code-block
import Block5966 from "@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md"

<Block5966/>
```

# Snowplow Media Tracking

This plugin will allow the tracking of an embedded YouTube IFrame.

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

## Download

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** This plugin will not work if using GAv4 Enhanced Measurement Video engagement, as both the GAv4 and Snowplow trackers will attempt to attach to the Youtube video.

## Quick Start

To start tracking a YouTube video with default settings, use the snippet below after [setting up your tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/web-quick-start-guide/index.md):

**`index.html`**

```html
<html>
  <head>
    <title>Snowplow YouTube Tracking Example</title>
    <script src="main.js"></script>
  </head>
  <body>
    <iframe
      id="example-id"
      src="https://www.youtube.com/embed/zSM4ZyVe8xs"
    ></iframe>  
  </body>
</html>
```

**`main.js`**

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-youtube-tracking@latest/dist/index.umd.min.js',
    ['snowplowYouTubeTracking', 'YouTubeTrackingPlugin']
);

window.snowplow('enableYouTubeTracking', {
    id: 'example-id',
    options: {
        label: 'My Video Title',
        boundaries: [10, 25, 50, 75]
    }
});
```

## The enableYouTubeTracking function

The `enableYouTubeTracking` function takes the form:

```javascript
window.snowplow("enableYouTubeTracking", { id, options?: { label?, captureEvents?, boundaries?, updateRate? } })
```

| Parameter | Type | Default | Description | Required |
| --- | --- | --- | --- | --- |
| `id` | `string` | \- | The HTML id attribute of the media element | Yes |
| `options.label` | `string` | \- | An identifiable custom label sent with the event | No |
| `options.captureEvents` | `string[]` | `["DefaultEvents"]` | The events or Event Group to capture. For a full list of events and groups, check the [section below](#events) | No |
| `options.boundaries` | `number[]` | `[10, 25, 50, 75]` | The progress percentages to fire an event at (valid values 1 - 99 inclusive) [[1]](#1) | No |
| `options.updateRate` | `number` | `250` | The rate at which `seek` and `volumechange` events can occur [[2]](#2) | No |

Below is an example of the full `enableYouTubeTracking` function:

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

## Usage

For this plugin to find your media element, your IFrame must be given the id that is passed into `enableYouTubeTracking`:

**`index.html`**

```html
 <iframe
      id="example-id"
      src="https://www.youtube.com/embed/zSM4ZyVe8xs"
></iframe>
```

**`main.js`**

```javascript
window.snowplow('enableYouTubeTracking', {
  id: "example-id"
})
```

## Events

### Capturable Events

Below is a table of all the events that can be used in `options.captureEvents`

| Name | Fire Condition |
| --- | --- |
| play | The video is played |
| pause | The video is paused |
| seek | On seek |
| volumechange | Volume has changed |
| ended | When playback stops at the end of the video |
| error | An error occurs in the player |
| percentprogress | When a percentage boundary set in `options.boundaries` is reached |
| playbackratechange | Playback rate has changed |
| playbackqualitychange | Playback quality has changed |

### Event Groups

You can also use a pre-made event group in `options.captureEvents`:

| Name | Events |
| --- | --- |
| `DefaultEvents` | `["play", "pause", "seek", "volumechange", "ended", "percentprogress", "playbackratechange", "playbackqualitychange"]` |
| `AllEvents` | Every event listed in [Capturable Events](#capturable-events) |

It is possible to extend an event group with any event in the Events table above. This could be useful if you want, for example, all the events contained in the "DefaultEvents" group, along with the "error" event. This is expressed in the following way:

```javascript
window.snowplow('enableYouTubeTracking', {
  id: "example-video",
  options: {
    captureEvents: ["DefaultEvents", "error"],
  }
})
```

## Schemas and Example Data

Three schemas are used with this plugin:

### [An unstructured event with identifying information](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player_event/jsonschema/1-0-0)

```javascript
{
    "type": "play",
    "label": "Identifying Label"
}
```

### [Snowplow platform-agnostic media context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/media_player/jsonschema/1-0-0)

```javascript
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

```javascript
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
  "playerId": "youtube",
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

1. To track when a video ends, use the "ended" event. 

2. `seek` and `volumechange` use `setInterval` to poll the player every `n` ms. You are able to adjust the poll rate, however, lower values may cause performance issues.
