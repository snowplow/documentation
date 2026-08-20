---
title: "Conclusion"
position: 6
sidebar_label: "Conclusion"
description: "Review the infrastructure you didn't have to build for live viewer profiles, and extend the accelerator with push updates, engagement scoring, and ad performance attributes."
keywords: ["signals conclusion", "streaming infrastructure", "changed operator", "engagement scoring", "concurrent viewers"]
date: "2026-07-31"
---

You've built a live viewer profile system for a video streaming site. A React page tracks standard Snowplow media events, Signals computes each session's state, watch time, and skipped ads alongside per-video audience metrics, and a dashboard reads both through services with one batch call each.

The same outcome built by hand means deploying something to forward the event stream, running stream processing to fold events into viewer state, provisioning a low-latency store for the profiles, and maintaining a service to serve them, which is what the [Kafka accelerator](/tutorials/kafka-live-viewer-profiles/introduction) walks through. With Signals, the state computation, storage, and serving are managed inside your Snowplow pipeline, and your code shrinks to the two things that are genuinely yours: the tracking and the UI.

Switching from session-level to video-level metrics was a custom attribute key and a second attribute group, with no change to the tracking and no new schema. Any property your events already carry can become an aggregation key that way.

## Extend the accelerator

Some directions to take this further:

* Push instead of polling: the dashboard polls every three seconds. Signals [interventions](/docs/signals/interventions/) support a [`changed` operator](/docs/signals/interventions/#the-changed-operator) that fires every time an attribute's value changes, which is a natural fit for pushing `viewer_state` transitions to the dashboard the moment a viewer pauses. Note that the Node.js SDK doesn't support intervention subscriptions: subscribe with the Python SDK, the browser plugin, or the Signals API, as described in [subscribe to interventions](/docs/signals/applications/subscribe/). The [interventions tutorial](/tutorials/signals-interventions/start) walks through the full workflow.
* Engagement scoring: add attributes such as a `seek_count` counter or a `mean` of playback rate, and combine them into an engagement score for each session in your back-end
* Trending titles: the `video_audience` group already gives you a live count per video. Add a shorter `period` for a "watching in the last minute" figure, and sort the dashboard's video table by it to get a trending list.
* Ad performance: the media schemas include ad quartile, click, pause, and resume events. Attributes over those events give you per-session or per-video ad engagement, for example a `category_count` of ad event names.
* Viewer-level profiles: this accelerator keys sessions on `domain_sessionid`. Adding a third attribute group keyed on `domain_userid` gives you profiles that persist across sessions on the same device.

## Next steps

Continue with these related resources:

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start) is the quick start for the wider Signals workflow
* [Trigger real-time actions with interventions](/tutorials/signals-interventions/start) covers the push-based side of Signals
* [Attribute keys](/docs/signals/attributes/attribute-keys/) documents the built-in keys and how to define your own
* [The Snowplow MCP server](/docs/llms-support/snowplow-mcp/) lets an AI assistant create Signals definitions like these from a prompt
* [Live viewer profiles with Kafka](/tutorials/kafka-live-viewer-profiles/introduction) is the self-managed alternative to this accelerator
