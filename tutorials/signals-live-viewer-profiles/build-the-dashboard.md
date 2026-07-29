---
title: "Build the dashboard"
position: 4
sidebar_label: "Build the dashboard"
description: "Serve live viewer profiles to a React dashboard with a one-route Node.js back-end that registers sessions and retrieves attributes in batch with the Signals Node.js SDK."
keywords: ["signals node sdk", "getBatchServiceAttributes", "live dashboard", "domain_sessionid", "profiles store"]
date: "2026-07-29"
---

In this section you'll build the dashboard: a page that lists every live viewer with their state, watch time, and skipped ads, polling for fresh values every few seconds.

There's one design problem to solve first. Signals is a lookup store: given an attribute key value such as a `domain_sessionid`, it returns that profile's attributes. It doesn't provide a way to enumerate all sessions that have profiles. The dashboard therefore needs to learn which sessions to look up. The simplest solution is for the video page to announce itself: on load, it sends its `domain_sessionid` to a small back-end, which keeps the set of live sessions in memory. The dashboard asks that back-end for one profile row per registered session.

The back-end has one route, with two methods:

* `POST /api/viewers` registers a session ID
* `GET /api/viewers` fetches attributes for all registered sessions from Signals, using the [Node.js SDK](/docs/signals/connection/), and returns one row per viewer

In production you'd use whatever session registry you already have, for example your platform's concurrent-stream or heartbeat service, and add an expiry to the set. The in-memory version keeps this accelerator focused on the Signals integration.

## Add the Signals credentials

The back-end needs the same four connection values you used for the Python SDK. Add them to the app's `.env` file, below the Collector URL. Only variables prefixed with `VITE_` are exposed to the browser, so these stay server-side:

```text
SIGNALS_API_URL=https://YOUR_ID.signals.snowplowanalytics.com
SIGNALS_API_KEY=your-api-key
SIGNALS_API_KEY_ID=your-api-key-id
SNOWPLOW_ORG_ID=your-organization-id
```

## Create the back-end

Create `server.js` in the project root:

```javascript
import express from 'express';
import { Signals } from '@snowplow/signals-node';

const signals = new Signals({
  baseUrl: process.env.SIGNALS_API_URL,
  apiKey: process.env.SIGNALS_API_KEY,
  apiKeyId: process.env.SIGNALS_API_KEY_ID,
  organizationId: process.env.SNOWPLOW_ORG_ID,
});

// The sessions that have opened the video page, mapped to when they arrived.
const viewers = new Map();

const app = express();
app.use(express.json());

// The video page calls this on load to make its session discoverable.
app.post('/api/viewers', (req, res) => {
  const { sessionId } = req.body ?? {};
  if (typeof sessionId === 'string' && sessionId.length > 0) {
    viewers.set(sessionId, Date.now());
  }
  res.status(204).end();
});

// The dashboard polls this to get one profile row per registered viewer.
app.get('/api/viewers', async (req, res) => {
  const identifiers = [...viewers.keys()];
  if (identifiers.length === 0) {
    res.json([]);
    return;
  }
  try {
    const attributes = await signals.getBatchServiceAttributes({
      name: 'viewer_profile_service',
      attribute_key: 'domain_sessionid',
      identifiers,
    });
    // The response is columnar: each attribute maps to an array of values
    // aligned with the order of the identifiers in the request.
    const rows = identifiers.map((sessionId, i) => ({
      sessionId,
      viewerState: attributes.viewer_state?.[i] ?? null,
      secondsWatched: attributes.seconds_watched?.[i] ?? null,
      adsSkipped: attributes.ads_skipped?.[i] ?? null,
    }));
    res.json(rows);
  } catch (err) {
    res.status(502).json({ error: String(err) });
  }
});

app.listen(3001, () => {
  console.log('Dashboard backend listening on http://localhost:3001');
});
```

The interesting call is `getBatchServiceAttributes`, which fetches attributes for any number of identifiers in a single request. It returns an object with one key per attribute, each holding an array of values in the same order as the `identifiers` array. A session that hasn't produced any counted events yet returns `null` values, which the dashboard renders as a waiting state. See [retrieve attributes](/docs/signals/applications/retrieve-attributes/) for the full SDK reference.

Proxy the app's `/api` requests to the back-end by updating `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
```

## Register the session from the video page

The video page needs to send its `domain_sessionid` to the back-end on load. The tracker exposes the session ID through the [`getDomainSessionId` method](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/).

In `src/VideoPage.jsx`, import the tracker at the top of the file:

```javascript
import { tracker } from './tracker';
```

Then add the registration call to the existing mount effect, after `startMediaTracking`, so the effect reads:

```jsx
  // Start a media tracking session when the page loads, and register this
  // viewer's session with the dashboard backend.
  useEffect(() => {
    const id = crypto.randomUUID();
    mediaIdRef.current = id;
    startMediaTracking({
      id,
      player: { label: 'Sintel trailer', mediaType: 'video' },
      pings: { pingInterval: 10 },
    });
    fetch('/api/viewers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: tracker.getDomainSessionId() }),
    });
    return () => endMediaTracking({ id });
  }, []);
```

Start the back-end before you open the video page. This `fetch` has no error handling, so if nothing is listening the registration fails silently and the viewer never appears on the dashboard.

## Build the dashboard page

Create `src/DashboardPage.jsx`. It polls the back-end every three seconds and renders a table, translating the raw `viewer_state` event names into labels:

```jsx
import { useEffect, useState } from 'react';

const STATE_LABELS = {
  play_event: 'Playing',
  pause_event: 'Paused',
  end_event: 'Finished',
};

export default function DashboardPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeout;
    async function poll() {
      try {
        const response = await fetch('/api/viewers');
        if (!response.ok) throw new Error(`Backend returned ${response.status}`);
        setRows(await response.json());
        setError(null);
      } catch (err) {
        setError(String(err));
      }
      timeout = setTimeout(poll, 3000);
    }
    poll();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="page">
      <h1>Live viewers</h1>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && !error && (
        <p>No viewers yet. Open the video page in another tab and press play.</p>
      )}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Session</th>
              <th>State</th>
              <th>Seconds watched</th>
              <th>Ads skipped</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.sessionId}>
                <td>
                  <code>{row.sessionId.slice(0, 8)}</code>
                </td>
                <td>{STATE_LABELS[row.viewerState] ?? 'Waiting for events'}</td>
                <td>{Math.round(row.secondsWatched ?? 0)}</td>
                <td>{row.adsSkipped ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
```

Replace `src/main.jsx` to route between the two pages based on the path:

```jsx
import { createRoot } from 'react-dom/client';
import './index.css';
import './tracker';
import VideoPage from './VideoPage.jsx';
import DashboardPage from './DashboardPage.jsx';

const page =
  window.location.pathname === '/dashboard' ? <DashboardPage /> : <VideoPage />;

createRoot(document.getElementById('root')).render(page);
```

## Run it end to end

Run the back-end and the dev server in two terminals. Node.js loads the `.env` file itself with the `--env-file` flag:

```bash
node --env-file=.env server.js
```

```bash
npm run dev
```

Open `http://localhost:5173` and start the video, then open `http://localhost:5173/dashboard` in a second tab or window. Within a few seconds the dashboard shows your session's row. Skip an ad and watch `Ads skipped` increment, pause the video and watch the state flip to `Paused`, and leave it playing to see `Seconds watched` climb with each ping.

![Live viewers dashboard showing one session row with state Paused, 81 seconds watched, and 1 ad skipped](images/dashboard-live-viewers.png)

Each extra browser or device that opens the video page registers its own session and appears as another row.

## Troubleshooting

* `Backend returned 502` with a `404` from Signals: the service name in `server.js` doesn't match a published service. Check **Signals** > **Services** in Console.
* The row shows `Waiting for events` and zeros: the session is registered but has no computed attributes yet. Make sure you interacted with the video after the attribute group finished publishing, since earlier events are never counted, and allow a minute or two for the definition to be applied to the streaming engine.
* The row disappears after a back-end restart: the in-memory set is empty again. Reload the video page to re-register.
* `[Signals] Failed to fetch access token`: check all four credential values in `.env`, and make sure you started the server with `--env-file=.env`.
