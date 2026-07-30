---
title: "Try out the Signals and Vercel AI integration"
position: 6
sidebar_label: "Test the app"
description: "Run your Next.js app, build up behavioral context by browsing, and see how the AI agent uses real-time Signals data."
keywords: ["testing", "signals context", "agentic context", "ai agent demo", "real-time personalization"]
date: "2026-07-30"
---

Your application is now ready to try out.

Run it with:

```bash
npm run dev
```

Make sure you've replaced the placeholder values in `.env.local` with real credentials.

## Build up behavioral context

Open your app in a browser and browse around for a few minutes. Visit different pages, click some links, and spend time on different sections. Revisit one product page after looking at another, so the activity narrative has a pattern worth noticing.

The Browser tracker records these interactions, Signals computes your attributes in real time, and the agentic context buffers the events themselves.

Open the chat and ask a general question. If Signals is returning context for your session, the agent's response will reference what you've been doing.

## Verify Signals context

You can verify that the app is receiving both kinds of context by adding a log to the API route:

```tsx
console.log(
  "[chat] signals context:",
  signalsContext || "(empty — no session data yet)",
);
```

A healthy log contains both sections: the profile attributes as a markdown list, and the activity narrative wrapped in `[START CONTEXT]` and `[END CONTEXT]`.

If the profile section is missing, check:
* Is your attribute group published?
* Did you create a service with the right name?
* Have you been browsing for long enough for events to flow through the pipeline?

A brand new session shows no profile section at all: the service returns every attribute as `null` until events arrive, and `getProfileSection()` filters those out.

If the activity section is missing, check:
* Is your agentic context published?
* Did you select the `page_view` event when you defined it?
* Are your events newer than the `max_age_seconds` you configured?

Because each fetch is handled independently, one section can appear without the other. That's deliberate: a failure to reach either won't take the agent down.

## Inspect the Signals integration in the browser

To confirm the tracker and Signals agree on your session, use the [Snowplow Inspector browser extension](/docs/testing/snowplow-inspector/signals-integration/). It shows the events leaving the page alongside the live attribute values Signals holds for your session, which separates a tracking problem from a Signals configuration problem.
