---
title: "Learn how to create live viewer profiles using Signals"
position: 1
sidebar_label: "Introduction"
description: "Build a real-time viewer profile dashboard for a video streaming site with Snowplow media tracking and Signals, with per-session and per-video metrics and no stream processing to operate."
keywords: ["snowplow signals", "live viewer profiles", "media tracking", "real-time video analytics", "custom attribute key"]
date: "2026-07-30"
---

In this solution accelerator you'll build live viewer profiles for a video streaming site: a dashboard that shows who's watching right now, whether they're playing or paused, how many seconds they've watched, and how many ads they've skipped. It also aggregates the same events per video, so you can see how many people are watching each title across every session.

[Snowplow Signals](/docs/signals/introduction/) computes the profiles inside your Snowplow pipeline, from the media events your trackers already send. There's no stream processing to write and no profile store to operate, so the only code you write is the tracking page and a thin dashboard. If you'd rather own the stream processing yourself, the [live viewer profiles with Kafka accelerator](/tutorials/kafka-live-viewer-profiles/introduction) builds the same dashboard on self-managed infrastructure.

On the left side of the image below, someone is watching a video with Snowplow media tracking. On the right, the dashboard lists their session with its live state, watch time, and skipped ad count, alongside a row for each video, all served from the Signals Profiles Store.

![Split screen with a video page playing the Sintel trailer on the left, and the live viewers dashboard on the right showing two video rows and three session rows with their state, watch time, and skipped ad counts](images/viewer-and-dashboard-split-screen.png)

## Architecture

The video page sends media events to your Snowplow pipeline like any other tracked application. Signals reads the enriched stream, folds the events into attributes, and serves them from the Profiles Store. Your dashboard back-end reads those attributes over HTTPS:

```mermaid
flowchart LR
    page["<b>Video page</b><br/>browser tracker<br/>and media plugin"]
    collector["<b>Collector</b>"]
    enrich["<b>Enrich</b>"]
    engine["<b>Signals</b><br/>streaming engine"]
    store["<b>Profiles Store</b>"]
    backend["<b>Back-end</b><br/>Signals Node.js SDK"]
    dashboard["<b>Dashboard</b>"]

    page --> collector --> enrich --> engine --> store
    store --> backend --> dashboard
    page -. "registers its session" .-> backend
```

Everything between the Collector and the Profiles Store is managed by Snowplow. You build the boxes at either end: the video page and the dashboard, joined by a back-end that does little more than pass identifiers to Signals and hand the attributes back.

You'll build them in this order:

1. A React video page that tracks play, pause, seek, ping, and ad events with the Snowplow [media tracking plugin](/docs/sources/web-trackers/tracking-events/media/snowplow/)
2. Two Signals [attribute groups](/docs/signals/attributes/attribute-groups/): one keyed on the session, for each viewer's state, watch time, and skipped ads, and one keyed on a custom [attribute key](/docs/signals/attributes/attribute-keys/) for the video, for audience metrics across sessions
3. A dashboard page backed by a one-route Node.js server that reads both groups with the [Signals Node.js SDK](/docs/signals/connection/)

Every file you need is listed in full in these pages, so there's nothing to clone and nothing to download. This accelerator should take around one hour to complete.

## Prerequisites

This accelerator assumes that you have:

* A Snowplow pipeline with a [Collector endpoint](/docs/sources/) you can send events to, because Signals computes attributes from your live event stream
* [Signals enabled](/docs/signals/setup/) on your Snowplow account, since the viewer profiles depend on it
* Node.js 20.6 or later, to run the demo app and its back-end
* Python 3.9 or later, to define the Signals configuration with the [Signals Python SDK](/docs/signals/connection/)
* Basic familiarity with React and with [Snowplow events and entities](/docs/fundamentals/events/)

:::note[A full pipeline is required]
This accelerator computes attributes from real events flowing through your pipeline, so it can't be completed with [Snowplow Micro](/docs/testing/snowplow-micro/) or in a purely local setup. You need a running Snowplow pipeline with Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::
