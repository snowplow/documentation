---
title: "Set up media tracking"
position: 2
sidebar_label: "Set up media tracking"
description: "Build a React video page that tracks play, pause, seek, ping, and ad events with the Snowplow browser tracker and media plugin, and verify the events in Snowplow Inspector."
keywords: ["media tracking plugin", "snowplow browser tracker", "react video player", "ad events", "media session"]
date: "2026-07-30"
---

In this section you'll build the video page: a React app that plays a trailer and tracks how the user interacts with it. The [Snowplow media plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/) sends a [self-describing event](/docs/fundamentals/events/#self-describing-events) for each playback action, along with entities describing the player state and the media session. Signals will compute the viewer profiles from these events in the next section.

The page also simulates a pre-roll ad break with a **Skip ad** button. Real streaming sites track ad events from their ad framework, and the skip button gives you a hands-on way to generate `ad_skip_event` events for the `ads_skipped` attribute.

## Create the app

Scaffold a React app with Vite, and install the Snowplow browser tracker and media plugin. The other two packages are for the dashboard back-end, which you'll build later.

```bash
npm create vite@latest signals-live-viewer -- --template react
cd signals-live-viewer
npm install
npm install @snowplow/browser-tracker @snowplow/browser-plugin-media @snowplow/signals-node express
```

The scaffold includes example components that you won't need. Delete `src/App.jsx`, `src/App.css`, and the `src/assets` directory.

Create a `.env` file in the project root with your Collector endpoint. Vite exposes environment variables prefixed with `VITE_` to the browser code. You'll add the Signals credentials to this same file later.

```text
VITE_COLLECTOR_URL=https://collector.example.com
```

## Initialize the tracker

Create `src/tracker.js` to initialize the [browser tracker](/docs/sources/web-trackers/) with the media plugin:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media';

export const tracker = newTracker('sp1', import.meta.env.VITE_COLLECTOR_URL, {
  appId: 'signals-live-viewer',
  plugins: [SnowplowMediaPlugin()],
});
```

## Build the video page

Create `src/VideoPage.jsx`. It renders an HTML5 `<video>` element and wires its DOM events to the media plugin's tracking functions:

* `startMediaTracking` begins a media session when the page loads, with a ping every 10 seconds during playback. Each ping carries a media session [entity](/docs/fundamentals/entities/) with cumulative statistics such as `timePlayed`, which Signals will use for watch time.
* `onPlay`, `onPause`, `onEnded`, `onSeeking`, and `onSeeked` track the corresponding media events.
* `onTimeUpdate` calls `updateMediaTracking` so the plugin always knows the current playback position. It updates internal state without sending an event.
* The first play triggers a simulated pre-roll ad break. Completing it tracks `ad_complete_event`, and the skip button tracks `ad_skip_event`.

The page offers a catalog of two videos, chosen with a `?video=` query parameter, because the dashboard reports metrics per video as well as per session. The `label` you pass to `startMediaTracking` is attached to every media event in the `media_player` entity, so this page sets it to the video's ID. That gives Signals a per-video value to aggregate on.

The videos are trailers for [Sintel](https://durian.blender.org/) and [Big Buck Bunny](https://peach.blender.org/), open movies by the Blender Foundation, served from the W3C's public media server.

```jsx
import { useEffect, useRef, useState } from 'react';
import {
  startMediaTracking,
  endMediaTracking,
  updateMediaTracking,
  trackMediaPlay,
  trackMediaPause,
  trackMediaEnd,
  trackMediaSeekStart,
  trackMediaSeekEnd,
  trackMediaAdBreakStart,
  trackMediaAdBreakEnd,
  trackMediaAdStart,
  trackMediaAdComplete,
  trackMediaAdSkip,
  MediaPlayerAdBreakType,
} from '@snowplow/browser-plugin-media';

const VIDEOS = {
  'sintel-trailer': {
    title: 'Sintel',
    src: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  },
  'bunny-trailer': {
    title: 'Big Buck Bunny',
    src: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  },
};
const AD_LENGTH = 8; // seconds

// The video to play, from ?video=<id>, falling back to the first one.
const requested = new URLSearchParams(window.location.search).get('video');
const videoId = Object.hasOwn(VIDEOS, requested) ? requested : Object.keys(VIDEOS)[0];

export default function VideoPage() {
  const videoRef = useRef(null);
  const mediaIdRef = useRef(null);
  const inAdBreak = useRef(false);
  const preRollShown = useRef(false);
  const [adSecondsLeft, setAdSecondsLeft] = useState(null);

  // Start a media tracking session when the page loads.
  useEffect(() => {
    const id = crypto.randomUUID();
    mediaIdRef.current = id;
    startMediaTracking({
      id,
      player: { label: videoId, mediaType: 'video' },
      pings: { pingInterval: 10 },
    });
    return () => endMediaTracking({ id });
  }, []);

  // Count down the simulated ad break.
  useEffect(() => {
    if (adSecondsLeft === null) return undefined;
    if (adSecondsLeft === 0) {
      finishAd(true);
      return undefined;
    }
    const timeout = setTimeout(() => setAdSecondsLeft(adSecondsLeft - 1), 1000);
    return () => clearTimeout(timeout);
  }, [adSecondsLeft]);

  const id = () => mediaIdRef.current;

  function startAd() {
    inAdBreak.current = true;
    trackMediaAdBreakStart({
      id: id(),
      adBreak: {
        breakId: 'pre-roll-1',
        name: 'pre-roll',
        breakType: MediaPlayerAdBreakType.Linear,
      },
    });
    trackMediaAdStart({
      id: id(),
      ad: { adId: 'ad-1', name: 'Demo ad', duration: AD_LENGTH, skippable: true },
    });
    setAdSecondsLeft(AD_LENGTH);
  }

  function finishAd(completed) {
    if (completed) {
      trackMediaAdComplete({ id: id() });
    } else {
      trackMediaAdSkip({ id: id() });
    }
    trackMediaAdBreakEnd({ id: id() });
    inAdBreak.current = false;
    setAdSecondsLeft(null);
    videoRef.current.play();
  }

  function onPlay() {
    if (inAdBreak.current) return;
    if (!preRollShown.current) {
      preRollShown.current = true;
      videoRef.current.pause();
      startAd();
      return;
    }
    trackMediaPlay({ id: id() });
  }

  function onPause() {
    if (inAdBreak.current || videoRef.current.ended) return;
    trackMediaPause({ id: id() });
  }

  return (
    <main className="page">
      <h1>Now playing: {VIDEOS[videoId].title}</h1>
      <nav className="catalog">
        {Object.entries(VIDEOS).map(([catalogId, video]) => (
          <a
            key={catalogId}
            href={`?video=${catalogId}`}
            aria-current={catalogId === videoId ? 'page' : undefined}
          >
            {video.title}
          </a>
        ))}
      </nav>
      <div className="player">
        <video
          ref={videoRef}
          src={VIDEOS[videoId].src}
          controls
          onPlay={onPlay}
          onPause={onPause}
          onEnded={() => trackMediaEnd({ id: id() })}
          onSeeking={() => trackMediaSeekStart({ id: id() })}
          onSeeked={() => trackMediaSeekEnd({ id: id() })}
          onTimeUpdate={(event) =>
            updateMediaTracking({
              id: id(),
              player: { currentTime: event.target.currentTime },
            })
          }
        />
        {adSecondsLeft !== null && (
          <div className="ad-overlay">
            <p>Ad break: {adSecondsLeft}s remaining</p>
            <button onClick={() => finishAd(false)}>Skip ad</button>
          </div>
        )}
      </div>
    </main>
  );
}
```

:::note[Media type strings]
Pass `mediaType` as a string, either `'video'` or `'audio'`. The media plugin exports `MediaPlayerAdBreakType` for ad break types, but media types have no exported enum.
:::

Replace `src/main.jsx` to render the video page and initialize the tracker:

```jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import './tracker';
import VideoPage from './VideoPage.jsx';

createRoot(document.getElementById('root')).render(<VideoPage />);
```

Replace `src/index.css` with styles for the player, the ad overlay, and the dashboard tables you'll add later:

```css
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #14121a;
  color: #f4f3ec;
}

.page {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.catalog {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.catalog a {
  color: #a48fd6;
}

.catalog a[aria-current='page'] {
  color: #f4f3ec;
  font-weight: 600;
}

.player {
  position: relative;
}

.player video {
  width: 100%;
  border-radius: 8px;
}

.ad-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(20, 18, 26, 0.9);
  border-radius: 8px;
}

.ad-overlay button {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: #6638b8;
  color: #fff;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

caption {
  padding-bottom: 0.5rem;
  text-align: left;
  color: #a9a5b8;
}

th,
td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid #3d3a47;
}

.error {
  color: #ff7b72;
}
```

## Watch a video and verify the events

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser and press play. The pre-roll ad break appears first: let it finish or skip it, then play, pause, and seek around the trailer.

To verify the events, open the [Snowplow Inspector](/docs/testing/snowplow-inspector/) browser extension and check the **Events** tab while you interact with the video. You should see:

* `play_event` and `pause_event` as you toggle playback
* `seek_start_event` and `seek_end_event` as you scrub the timeline
* `ping_event` every 10 seconds during playback
* `ad_break_start_event` and `ad_start_event`, then `ad_skip_event` or `ad_complete_event` depending on whether you skipped, and finally `ad_break_end_event`

Select any of these events and confirm it carries two entities: `media_player`, with the current playback position and the `label` set to the video's ID, and the media `session` entity, with cumulative statistics such as `timePlayed` and `adsSkipped`. These events and entities are all standard Snowplow media schemas, described in the [media events documentation](/docs/events/ootb-data/media-events/), so there are no custom schemas to create.
