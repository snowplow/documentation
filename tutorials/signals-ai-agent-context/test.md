---
title: "Try out the Signals and Vercel AI integration"
position: 6
sidebar_label: "Test the app"
description: "Run your Next.js app, build up behavioral context by browsing, and see how the AI agent uses real-time Signals data."
keywords: ["testing", "signals context", "ai agent demo", "real-time personalization"]
date: "2026-04-10"
---

Your application is now ready to try out.

Run it with:

```bash
npm run dev
```

Make sure you've replaced the placeholder values in `.env.local` with real credentials.

## Build up behavioral context

Open your app in a browser and browse around for a few minutes. Visit different pages, click some links, and spend time on different sections. The Browser tracker will record these interactions, and Signals will compute your attributes in real time.

Open the chat and ask a general question. If your Signals service is returning attributes for your session, the agent's response will reference what you've been doing.

## Verify tracking and attributes in Snowplow Inspector

The [Snowplow Inspector](/docs/testing/snowplow-inspector/) browser extension lets you check both tracking and attribute calculation without touching any code. Its [Signals integration](/docs/testing/snowplow-inspector/signals-integration/) connects to Signals and displays live attribute values in your browser developer tools.

With your app open, open the Inspector:

* the **Events** tab lists the events the Browser tracker is sending, so you can confirm your interactions are being tracked
* the **Attributes** tab shows the values Signals has calculated for your session, refreshing automatically as new events arrive

If events appear but the attribute values stay empty, the problem is on the Signals side rather than in your app. If both look correct but the agent's responses don't reflect your behavior, move on to checking the app itself.

## Verify Signals context

You can also verify that the app is receiving the Signals context by adding a log to the API route:

```tsx
console.log(
  "[chat] signals context:",
  signalsContext || "(empty — no session data yet)",
);
```

If the context is empty, check:
* Is your attribute group published?
* Did you create a service with the right name?
* Have you been browsing for long enough for events to flow through the pipeline?

To rerun the attribute group test query in Console, click **Edit** on your attribute group page > **Run Preview**.
