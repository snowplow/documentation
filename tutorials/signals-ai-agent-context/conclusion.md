---
title: "Conclusion and next steps"
position: 7
sidebar_label: "Conclusion"
description: "Summary of the Signals AI agent tutorial and ideas for extending it with richer attributes, interventions, and multi-dimensional context."
keywords: ["signals next steps", "ai agent extensions", "interventions", "attribute groups"]
date: "2026-04-10"
---

In this tutorial you've built a Next.js AI agent that uses Snowplow Signals to deliver personalized, context-aware responses based on live user behavior.

Here's what you set up:

* Snowplow Browser Tracker capturing page views, page pings, and link clicks
* A Signals attribute group computing real-time session-level attributes
* A Signals service exposing those attributes via API
* A Vercel AI SDK agent that fetches and injects those attributes into its system prompt
* A floating chat widget that passes the Snowplow session ID with every request

## Next steps

Here are some ideas for extending what you've built.

### Richer attributes

The Basic Web template covers session-level behavior. For deeper personalization, extend your attribute group with:

- **Product affinity**: count of views per product category to understand user interest
- **Engagement score**: a computed signal of session depth and intent
- **Return visitor flag**: whether this is a new or returning user
- **Funnel stage**: where the user is in a defined conversion journey

### Interventions

Signals also supports [interventions](/docs/signals/concepts/#interventions) — push-based triggers that fire when a user crosses a behavioral threshold. Rather than waiting for the user to ask a question, you can proactively provide context to your agent when something significant happens (e.g., a user who has viewed pricing 5+ times and not converted).

### Multi-dimensional context

Combine Signals real-time stream attributes with automatic ingestion of batch attributes using data sources within your warehouse such as user profile data, CRM attributes, or product usage history to give your agent a complete picture of the user. The Vercel AI SDK's system prompt is just a string: you can compose it from as many sources as you need.

## Further reading

* [Snowplow Signals documentation](/docs/signals/introduction/)
* [Snowplow Browser Tracker quick start](/docs/sources/web-trackers/quick-start-guide/)
* [Vercel AI SDK documentation](https://ai-sdk.dev)
* [AI Elements component library](https://ai-sdk.dev/elements)
* Other Signals tutorials:
  * [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start)
  * [Implement real-time interventions using Signals](/tutorials/signals-interventions/start)
  * [Score prospects in real time using Signals and ML](/tutorials/signals-ml-prospect-scoring/intro)
