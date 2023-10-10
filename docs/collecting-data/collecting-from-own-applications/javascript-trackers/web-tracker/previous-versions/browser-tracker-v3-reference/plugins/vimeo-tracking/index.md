---
title: 'Vimeo Tracking'
sidebar_position: 16500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin enables the automatic tracking of a Vimeo video, utilising the [Snowplow Media Plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/plugins/media/index.md).

## Installation

- `npm install @snowplow/browser-plugin-vimeo-tracking`
- `yarn add @snowplow/browser-plugin-vimeo-tracking`
- `pnpm add @snowplow/browser-plugin-vimeo-tracking`

:::info Example app
To illustrate the tracked [events](/docs/understanding-your-pipeline/events/index.md) and [entities](/docs/understanding-your-pipeline/entities/index.md), you can visit an example app that showcases the tracked media events and entities live as you watch a video.

There are examples for both the [iframe](https://snowplow-incubator.github.io/snowplow-javascript-tracker-examples/vimeoIframe) and [player](https://snowplow-incubator.github.io/snowplow-javascript-tracker-examples/vimeoPlayer) methods of tracking a Vimeo video.

Source code for the app is [available here](https://github.com/snowplow-incubator/snowplow-javascript-tracker-examples).
:::

## Basic Usage

The snippets below show how to get started with the plugin, after [setting up your tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracker-setup/installing-the-tracker-from-npm/index.md).

:::info Accepted `video` attribute values

The plugin's `video` attribute will accept either:

- An `iframe` element
- An instance of `Vimeo.Player`, created with the [Vimeo Player SDK](https://developer.vimeo.com/player/sdk)

:::

<Tabs>
  <TabItem value='iframe' label='Iframe' default>

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
<TabItem value='player' label='Vimeo.Player'>

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
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
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

```javascript
import { VimeoEvent } from '@snowplow/browser-plugin-vimeo-tracking'

startVimeoTracking({
  id,
  video,
  captureEvents: [VimeoEvent.Play, VimeoEvent.Pause], 
})
```

## Advanced Usage

As the Vimeo plugin uses Snowplow Media internally, for more granular control over events, you can utilise any of the functions provided by the [Snowplow Media Plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/plugins/media/index.md).

For example, if you wish to include additional behaviour when a video is paused, you can create callback on the `pause` event of an instance of a Vimeo player.

:::note 

In the following example, ensure you aren't passing the `pause` event to the `startVimeoTracking` function, as this will result in the event being tracked twice.

:::

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

### Tracking Advertising Events

Advertising events are not tracked automatically, but can be tracked using the `trackAd*` functions provided by Snowplow Media. For a full list of available functions, see the [Snowplow Media Plugin documentation](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/plugins/media/index.md#update-ad-and-ad-break-properties).

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
