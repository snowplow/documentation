---
title: "See it in action"
position: 6
sidebar_label: "Test it"
description: "Run your Next.js app, build up behavioral context by browsing, and see how the AI agent uses real-time Signals data."
keywords: ["testing", "signals context", "ai agent demo", "real-time personalization"]
date: "2026-04-10"
---

Make sure you've replaced the placeholder values in `.env.local` with real credentials — particularly `AI_GATEWAY_API_KEY` and `NEXT_PUBLIC_SNOWPLOW_COLLECTOR_URL`. Then run your app:

```bash
npm run dev
```

## Build up behavioral context

Open your app in a browser and browse around for a few minutes — visit different pages, click some links, spend time on different sections. Snowplow is tracking these interactions and Signals is computing your attributes in real time.

Now open the chat and ask a general question. If your Signals service is returning attributes for your session, the agent's response will reflect what you've been doing — referencing the pages you've visited and tailoring its answers accordingly.

## Verify Signals context

You can verify the Signals context is being received by adding a log to the API route:

```tsx
console.log(
  "[chat] signals context:",
  signalsContext || "(empty — no session data yet)",
);
```

A typical Signals response for an active session looks like:

```
## Real-Time User Context (Snowplow Signals)
The following attributes describe the current user's session behavior:
- page_views_count: 7
- unique_pages_viewed: 4
- first_event_timestamp: "2026-04-09T15:02:18.000Z"
- last_event_timestamp: "2026-04-09T15:16:25.000Z"
```

:::tip[No attributes appearing?]
If the context is empty, make sure your attribute group is published, your service is created, and you've been browsing for long enough for events to flow through the pipeline. Check the Signals section of the Console to verify that attributes are being computed for your sessions.
:::
