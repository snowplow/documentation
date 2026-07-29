---
title: "Conclusion"
position: 5
sidebar_label: "Conclusion"
description: "Review the infrastructure you didn't have to build for live viewer profiles, and extend the accelerator with push updates, engagement scoring, and ad performance attributes."
keywords: ["signals conclusion", "streaming infrastructure", "changed operator", "engagement scoring", "concurrent viewers"]
date: "2026-07-29"
---

You've built a live viewer profile system for a video streaming site. A React page tracks standard Snowplow media events, Signals computes each session's state, watch time, and skipped ads in real time, and a dashboard reads the profiles through a service with one batch call.

Compare that with what the same outcome takes in the [Kafka accelerator](/tutorials/kafka-live-viewer-profiles/introduction): deploying Snowbridge to forward events, running Kafka, writing and operating a Java consumer to fold events into viewer state, provisioning DynamoDB for storage, and maintaining a WebSocket back-end to serve the results. With Signals, the state computation, storage, and serving are managed inside your Snowplow pipeline, and your code shrinks to the two things that are genuinely yours: the tracking and the UI.

## Extend the accelerator

Some directions to take this further:

* **Push instead of polling**: the dashboard polls every three seconds. Signals [interventions](/docs/signals/interventions/) support a [`changed` operator](/docs/signals/interventions/#the-changed-operator) that fires every time an attribute's value changes, which is a natural fit for pushing `viewer_state` transitions to the dashboard the moment a viewer pauses. Note that the Node.js SDK doesn't support intervention subscriptions: subscribe with the Python SDK, the browser plugin, or the Signals API, as described in [subscribe to interventions](/docs/signals/applications/subscribe/). The [interventions tutorial](/tutorials/signals-interventions/start) walks through the full workflow.
* **Engagement scoring**: add attributes such as a `seek_count` counter or a `mean` of playback rate, and combine them into an engagement score for each session in your back-end.
* **Concurrent viewers**: the dashboard already knows the registered sessions. Count the rows with `viewer_state` of `play_event` to display a live concurrent-viewer figure, the metric the Kafka accelerator's dashboard leads with.
* **Ad performance**: the media schemas include ad quartile, click, pause, and resume events. Attributes over those events give you per-session ad engagement, for example a `category_count` of ad event names.
* **Viewer-level profiles**: this accelerator keys everything on `domain_sessionid`. Adding a second attribute group keyed on `domain_userid` gives you profiles that persist across sessions on the same device.

## Learn more

* [Set up Signals for real-time calculation](/tutorials/signals-quickstart/start) is the quick start for the wider Signals workflow
* [Trigger real-time actions with interventions](/tutorials/signals-interventions/start) covers the push-based side of Signals
* [Live viewer profiles with Kafka](/tutorials/kafka-live-viewer-profiles/introduction) is the self-managed alternative to this accelerator
