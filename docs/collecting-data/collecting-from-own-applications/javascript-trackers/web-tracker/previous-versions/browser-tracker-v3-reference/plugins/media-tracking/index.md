---
title: "HTML5 Media Tracking"
date: "2022-01-11"
sidebar_position: 12500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

This plugin will allow the tracking of any HTML5 `<video>` or `<audio>` element, along with many HTML5 based video player frameworks.

## Installation

- `npm install @snowplow/browser-plugin-media-tracking`
- `yarn add @snowplow/browser-plugin-media-tracking`
- `pnpm add @snowplow/browser-plugin-media-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { MediaTrackingPlugin, enableMediaTracking } from '@snowplow/browser-plugin-media-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ MediaTrackingPlugin() ],
});

enableMediaTracking(/* options */);
```

## Quick Start

To start tracking media with default settings, use the snippet below, using your id and source:

**`index.html`**

```html
<html>
  <head>
    <title>Snowplow Media Tracking Example</title>
  </head>
  <body>
    <video id='example-id' src='./example-video.mp4'></video>
  </body>
</html>
```

**`main.js`**

```javascript
import { enableMediaTracking } from '@snowplow/browser-plugin-media-tracking'

enableMediaTracking({
  id: 'example-id'
})
```

## The enableMediaTracking function

The `enableMediaTracking` function takes the form:

```javascript
enableMediaTracking({ 
  id, 
  options?: { 
    label?, 
    captureEvents?, 
    boundaries?, 
    volumeChangeTrackingInterval? 
  }
})
```

| Parameter                              | Type       | Default             | Description                                                                                                    | Required |
|----------------------------------------|------------|---------------------|----------------------------------------------------------------------------------------------------------------|----------|
| `id`                                   | `string`   | \-                  | The HTML id attribute of the media element                                                                     | Yes      |
| `options.label`                        | `string`   | \-                  | An identifiable custom label sent with the event                                                               | No       |
| `options.captureEvents`                | `string[]` | `['DefaultEvents']` | The events or Event Group to capture. For a full list of events and groups, check the [section below](#events) | No       |
| `options.boundaries`                   | `number[]` | `[10, 25, 50, 75]`  | The progress percentages to fire an event at (valid values 1 - 99 inclusive) [[1]](#1)                       | No       |
| `options.volumeChangeTrackingInterval` | `number`   | `250`               | The rate at which volume events can be sent [[2]](#2)                                                        | No       |

Below is an example of the full `enableMediaTracking` function:

```javascript
enableMediaTracking({
  id: 'example-video',
  options: {
    label: 'My Custom Video Label',
    captureEvents: ['play', 'pause', 'ended'],
    boundaries: [20, 80],
    volumeChangeTrackingInterval: 200,
  }
})
```

## Usage

For this plugin to find your media element, one of the following conditions must be true:

Case 1

The `<audio>` or `<video>` element has the HTML id passed into `enableMediaTracking`

**`index.html`**

```html
<video id='example-id'></video>
```

**`main.js`**

```javascript
enableMediaTracking({
  id: 'example-id'
})
```

Case 2

The media element is the only `<audio>` or `<video>` child of a parent element with the HTML id passed into `enableMediaTracking`

**`index.html`**

```html
<div id='example-id'>
  <video src='./example-video.mp4'></video>
</div>
```

**`main.js`**

```javascript
enableMediaTracking({
  id: 'example-id'
})
```

## Events

### Capturable Events

Below is a table of all the events that can be used in `options.captureEvents`

| Name                  | Fire Condition                                                                                                                                                                |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| abort                 | The resource was not fully loaded, but not as the result of an error.                                                                                                         |
| canplay               | The user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content |
| canplaythrough        | The user agent can play the media, and estimates that enough data has been loaded to play the media up to its end without having to stop for further buffering of content.    |
| durationchange        | The duration attribute has been updated.                                                                                                                                      |
| emptied               | The media has become empty; for example, when the media has already been loaded (or partially loaded), and the HTMLMediaElement.load() method is called to reload it.         |
| ended                 | When playback stops when end of the media (`<audio>` or `<video>`) is reached or because no further data is available.                                                        |
| error                 | The resource could not be loaded due to an error.                                                                                                                             |
| loadeddata            | The first frame of the media has finished loading.                                                                                                                            |
| loadedmetadata        | The metadata has been loaded                                                                                                                                                  |
| loadstart             | The browser has started to load a resource.                                                                                                                                   |
| pause                 | When a request to pause play is handled and the activity has entered its paused state, most commonly occurring when the media's HTMLMediaElement.pause() method is called.    |
| play                  | The paused property is changed from true to false, as a result of the HTMLMediaElement.play() method, or the autoplay attribute                                               |
| playing               | When playback is ready to start after having been paused or delayed due to lack of data                                                                                       |
| progress              | Fired periodically as the browser loads a resource.                                                                                                                           |
| ratechange            | The playback rate has changed.                                                                                                                                                |
| seeked                | When a seek operation completes                                                                                                                                               |
| seeking               | When a seek operation begins                                                                                                                                                  |
| stalled               | The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.                                                                                       |
| suspend               | The media data loading has been suspended.                                                                                                                                    |
| timeupdate            | The time indicated by the currentTime attribute has been updated.                                                                                                             |
| volumechange          | The volume has changed.                                                                                                                                                       |
| waiting               | When playback has stopped because of a temporary lack of data.                                                                                                                |
| enterpictureinpicture | When the element enters picture-in-picture mode                                                                                                                               |
| leavepictureinpicture | When the element leaves picture-in-picture mode                                                                                                                               |
| fullscreenchange      | Fired immediately after the browser switches into or out of full-screen. mode.                                                                                                |
| cuechange             | When a text track has changed the currently displaying cues.                                                                                                                  |
| percentprogress       | When a percentage boundary set in `options.boundaries` is reached.                                                                                                            |

Note

Not all events are available in all browsers (though most are). To check, use the following links:

[https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#browser_compatibility)

[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#browser_compatibility)

### Event Groups

You can also use a pre-made event group in `options.captureEvents`:

| Name            | Events                                                                                                      |
|-----------------|-------------------------------------------------------------------------------------------------------------|
| `DefaultEvents` | `['pause', 'play', 'seeked', 'ratechange', 'volumechange', 'ended', 'fullscreenchange', 'percentprogress']` |
| `AllEvents`     | Every event listed in [Capturable Events](#capturable-events)                                               |

It is possible to extend an event group with any event in the Events table above. This could be useful if you want all the events contained in the 'DefaultEvents' group, along with the 'emptied' event (for example). This could be expressed in the following way:

```javascript
enableMediaTracking({
  id: 'example-video',
  options: {
    captureEvents: ['DefaultEvents', 'emptied'],
  }
})
```

## Schemas and Example Data

Four schemas are used with this plugin:

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

Note

Not all properties in the HTML5 Media/Video specific schemas will be available on all browsers. Use the following links to check availability:

[https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#browser_compatibility)

[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#browser_compatibility)

### Video Frameworks

This plugin has been tested with [VideoJS](https://videojs.com/) and [Plyr](https://plyr.io/), but should work with almost any player framework that results in a `<video>` or `<audio>` element). You may find that some frameworks render out in a way that means the id given to the component doesn't exist in the actual DOM.

* * *

1. To track when a video ends, use the 'ended' event.

2. When holding and dragging the volume slider, 'volumechange' events would be fired extremely quickly. This is used to limit the rate they can be sent out at. The default value is likely to be appropriate, but you can adjust it if you find you want fewer/more volume events through.
