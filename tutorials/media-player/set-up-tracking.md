---
title: Set up tracking
position: 7
---

This section covers how to set up Snowplow tracking for your media players. The approach you choose depends on your platform, media player, and tracking requirements.

## Choose your tracking SDK

Snowplow provides a range of tracking SDKs to address different media players and platforms that you may be collecting your data from. Choosing the right SDK for you depends on the following questions:

1. Do you want to collect data from a web app or a mobile app?
2. What media player do you use to play media in your app?
3. Do you prefer our tracking SDK to automatically subscribe to and track events from the media player or do you prefer to track the events manually by calling track event functions in our tracking SDK (e.g., you have a wrapper around the media player which listens to the player events and can send them to Snowplow)?
4. What data do you want to track? This will have an effect on whether you can choose a tracking SDK that tracks version 1 of our media schemas or should only look for SDKs that track version 2 Snowplow media schemas.

### Version 1 vs Version 2 media schemas

There are two versions of schemas for media events that our trackers may use to track media events. We recommend adopting the v2 schemas, but you may choose v1 schemas in case you want use a tracking SDK that doesn't yet support v2 schemas and you don't need the additional features of v2 schemas.

They differ in the following ways:

1. V2 schemas enable more accurate metrics about the playback (e.g., played duration, average playback rate) that are computed on the tracker instead of estimated in modeling
2. V2 schemas enable tracking ads played during media playback
3. V2 schemas provide additional events to track playback quality and periodic media pings during playback
4. V2 schemas support live streaming video (in addition to VOD)

| Tracking SDK | Platform | Media schemas version | Provides auto-tracking? | Player |
| --- | --- | --- | --- | --- |
| [Media Plugin for JS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/media/) | Web | v2 | No | Any |
| [Vimeo Plugin for JS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/vimeo-tracking/) | Web  | v2 | Yes | Vimeo |
| [iOS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/) | Mobile (iOS) | v2 | No | Any |
| [iOS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/) | Mobile (iOS) | v2 | Yes | AVPlayer |
| [Android tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/media-tracking/) | Mobile (Android) | v2 | No | Any |
| [HTML5 Media Tracking Plugin for JS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/media-tracking/) | Web | v1 | Yes | HTML5 media or video |
| [YouTube Plugin for JS tracker](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/youtube-tracking/) | Web | v1 | Yes | YouTube |

## Install the tracking SDK in your app

Once you have chosen the tracking SDK to use, the next step is to install it in your app.

### Media JS plugin

Install the `@snowplow/browser-tracker` and `@snowplow/browser-plugin-media` via npm, yarn or any other package manager of your choice. Example using `npm`:

```bash
npm install @snowplow/browser-tracker @snowplow/browser-plugin-media
```

It is also possible to integrate this plugin using a JavaScript script tag. For instructions on installing the tracker with the JavaScript tag, [please visit this page in our documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/installing-the-tracker/), and then for instructions on installing the plugin, [see this page in our documentation](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/media/).

### Other tracking SDKs

For detailed installation instructions for other tracking SDKs including Vimeo, YouTube, HTML5 media tracking, iOS, and Android trackers, please refer to their respective documentation pages linked in the table above.

## Create and configure the tracker

Next, you will need to create a configured tracker instance.

### Media JS plugin

To add the `SnowplowMediaPlugin` on the JavaScript tracker, you should include it as shown below:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media';

newTracker('sp1', '{{collector_url}}', { 
    appId: 'my-app-id', 
    plugins: [ SnowplowMediaPlugin() ],
});
```

### Other configurations

For configuration examples for other tracking SDKs, please refer to the tracking setup page content or the respective documentation pages.

## Start tracking events

Having created a tracker, we can now start tracking media events.

### Media JS plugin

Media tracking instances are identified by a unique ID. This is an identifier that you provide. Make sure that each media player and content tracked have a different ID.

```javascript
const id = 'XXXXX'; // randomly generated ID
```

To start tracking media events, call the `startMediaTracking` function with the ID.

```javascript
import { startMediaTracking } from "@snowplow/browser-plugin-media";
startMediaTracking({
  id,
  player: {
      duration: 150, // A double-precision floating-point value indicating the duration of the media in seconds
      label: 'Sample video', // A human-readable title for the media
      playerType: 'html5', // The type of player
  },
  boundaries: [10, 25, 50, 75] // Percentage progress events will be tracked when playback reaches the boundaries
});
```

See [the documentation for the full list](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/media/#media-player-properties) of options.

Subscribe for playback position changes on the media player and make sure to update the player properties as follows.

```javascript
import { updateMediaTracking } from "@snowplow/browser-plugin-media";
updateMediaTracking({
  id,
  player: { currentTime: 10 }
});
```

Subscribe to the player events that you are interested in and use the relevant functions to track the events (see the [documentation for the full list](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/media/#tracking-media-events)), for example:

- `trackMediaPlay` – player changes state to playing from previously being paused
- `trackMediaPause` – user pauses the playback
- `trackMediaEnd` – playback stops when end of the media is reached
- `trackMediaSeekStart` – seek operation begins
- `trackMediaSeekEnd` – seek operation completes

To track the events, simply provide the media tracking ID to the respective tracking function:

```javascript
import { trackMediaPlay } from "@snowplow/browser-plugin-media";
trackMediaPlay({ id });
```

Finally, use the `endMediaTracking` call to end media tracking. This will clear the local state for the media tracking and stop any background updates.

```javascript
import { endMediaTracking } from "@snowplow/browser-plugin-media";
endMediaTracking({ id });
```

For detailed implementation examples for other tracking SDKs, please refer to the full tracking setup documentation or the respective SDK documentation pages.
