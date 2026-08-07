---
title: "Verify the attributes while a video plays"
position: 4
sidebar_label: "Verify the attributes"
description: "Check that Signals is computing the viewer profile attributes from your media events. Read the live values for your own session with the Snowplow Inspector Signals integration."
keywords: ["snowplow inspector", "signals integration", "viewer_profile", "domain_sessionid", "verify attributes"]
date: "2026-07-31"
---

The definitions are published, so Signals is computing attributes from every media event your page sends. Before you build a dashboard on top of them, it's worth confirming that the values look right for a single session: your own.

## Track a few events

Go back to the video page, reload it, and interact with the video: skip the pre-roll ad, play for at least 10 seconds so a ping fires, and pause.

Signals only counts events processed after the attribute groups were published, so events from your earlier tracking run don't contribute. This fresh set of interactions is what you'll see in the values.

## Check the values in Snowplow Inspector

You can watch the attribute values update with the [Snowplow Inspector Signals integration](/docs/testing/snowplow-inspector/signals-integration/). Connect the extension to your organization, then open its **Attributes** tab: the Inspector discovers your session's `domain_sessionid` from the observed events and fetches the `viewer_profile` values for it. After pausing, you should see:

* `viewer_state`: `pause_event`
* `seconds_watched`: roughly the seconds you spent playing
* `ads_skipped`: `1` if you skipped the pre-roll

If the values stay empty, check that the events were sent after the group finished publishing, and remember that pre-publish events are never counted. Track a few more play and pause events, and use the Inspector's refresh button.

The `video_audience` values are keyed on the video rather than your session, so the Inspector doesn't discover them automatically. You'll see them on the dashboard in the next section, where they're worth watching with two browsers open on the same video.
