---
title: "Vimeo"
sidebar_position: 15
---

# Vimeo media tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin enables the automatic tracking of a Vimeo video, utilising the [Snowplow Media Plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/index.md).

:::info Example app
To illustrate the tracked [events](/docs/understanding-your-pipeline/events/index.md) and [entities](/docs/understanding-your-pipeline/entities/index.md), you can visit an example app that showcases the tracked media events and entities live as you watch a video.

There are examples for both the [iframe](https://snowplow-incubator.github.io/snowplow-javascript-tracker-examples/vimeoIframe) and [player](https://snowplow-incubator.github.io/snowplow-javascript-tracker-examples/vimeoPlayer) methods of tracking a Vimeo video.

Source code for the app is [available here](https://github.com/snowplow-incubator/snowplow-javascript-tracker-examples).
:::

Vimeo media events and entities are **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
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

## Basic usage

The snippets below show how to get started with the plugin, after [setting up your tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/index.md).

:::info Accepted `video` attribute values
The plugin's `video` attribute will accept either:
- An `iframe` element
- An instance of `Vimeo.Player`, created with the [Vimeo Player SDK](https://developer.vimeo.com/player/sdk)
:::


### `iFrame`

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

### `Vimeo.Player`

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

:::caution

It's important to call `endVimeoTracking` as this will end any recurring ping events, clear all listeners set by the Vimeo plugin, along with resetting statistics counters used by the Snowplow Media plugin.

:::

## Selecting events to track

<details>
<summary>The plugin provides automatic tracking of the following events</summary>

| Vimeo Event Name               | Description                                                                                        |
|--------------------------------|----------------------------------------------------------------------------------------------------|
| Ready                          | Sent when the media tracking is successfully attached to the player and can track events.          |
| Play                           | Sent when the player changes state to playing from previously being paused.                        |
| Pause                          | Sent when the user pauses the playback.                                                            |
| End                            | Sent when playback stops when end of the media is reached or because no further data is available. |
| SeekStart                      | Sent when a seek operation begins.                                                                 |
| SeekEnd                        | Sent when a seek operation completes.                                                              |
| PlaybackRateChange             | Sent when the playback rate has changed.                                                           |
| VolumeChange                   | Sent when the volume has changed.                                                                  |
| FullscreenChange               | Sent immediately after the browser switches into or out of full-screen mode.                       |
| PictureInPictureChange         | Sent immediately after the browser switches into or out of picture-in-picture mode.                |
| BufferStart                    | Sent when the player goes into the buffering state and begins to buffer content.                   |
| BufferEnd                      | Sent when the the player finishes buffering content and resumes playback.                          |
| QualityChange                  | Sent when the video playback quality changes automatically.                                        |
| Error                          | Sent when the Vimeo player encounters an error                                                     |
| CuePoint                       | Sent when a cue point is reached.                                                                  |
| ChapterChange                  | Sent when the chapter changes.                                                                     |
| TextTrackChange                | Sent when the text track changes.                                                                  |
| InteractiveHotspotClicked      | Sent when an interactive hotspot is clicked.                                                       |
| InteractiveOverlayPanelClicked | Sent when an interactive overlay panel is clicked.                                                 |
</details>

If you wish to track only a subset of these events, you can pass an array of `VimeoEvent`s to the `startVimeoTracking` function:

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

## Advanced usage

As the Vimeo plugin uses Snowplow Media internally, for more granular control over events, you can utilise any of the functions provided by the [Snowplow Media Plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/index.md).

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

### Tracking advertising events

Advertising events are not tracked automatically, but can be tracked using the `trackAd*` functions provided by Snowplow Media. For a full list of available functions, see the [Snowplow Media Plugin documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/media/index.md#update-ad-and-ad-break-properties).

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
