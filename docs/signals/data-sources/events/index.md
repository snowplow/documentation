---
title: "Send events to Signals"
sidebar_position: 10
sidebar_label: "Events"
description: "Add a Snowplow tracker to your application so Signals can calculate stream attributes from your events in real time."
keywords: ["signals tracking", "signals events", "stream attributes", "snowplow tracker", "signals data source"]
date: "2026-11-06"
content_type: how-to
---

Signals calculates stream attributes from Snowplow [events](/docs/fundamentals/events/index.md). On the free tier, event collection is included, so you add a Snowplow tracker to your application and point it at your Collector endpoint. If you already run Snowplow, Signals reads the events from your existing pipeline, and you don't need to change your tracking.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```

Use events as the data source when you need attributes that update in real time, such as the number of products a user viewed in the last ten minutes. To bring in pre-calculated values such as CRM or transactional data, [sync warehouse tables](/docs/signals/attributes/warehouse-config/index.md) instead. [Data sources](/docs/signals/concepts/index.md#data-sources) compares the two.

## Before you begin

You need a Signals environment. If you don't have one yet, [set up Signals](/docs/signals/setup/index.md) first. Then:

* On the free tier: have your Collector endpoint and Signals API URL ready.
* With an existing Snowplow pipeline: nothing changes, because your trackers already send to your Collector.

On either path, these are the only additions Signals needs:

* Set `user_id` in your tracker if you want attributes per logged-in user.
* Add the [Signals browser plugin](/docs/signals/applications/subscribe/index.md) if a web application receives interventions.
* Check that your events carry the identifiers your [attribute keys](/docs/signals/attributes/attribute-keys/index.md) need.

## Add a tracker to your application

Each Snowplow tracker sends events to the Collector, and the Signals streaming engine inspects every event as it arrives. Choose the tracker for the platform that generates the behavior you want to calculate attributes from:

| Platform | Tracker | Start here |
| --- | --- | --- |
| Website or single-page app | JavaScript tracker | [Web tracker quick start](/docs/sources/web-trackers/quick-start-guide/index.md) |
| iOS or Android app | Native mobile trackers | [Mobile trackers](/docs/sources/mobile-trackers/index.md) |
| Node.js backend | Node.js tracker | [Node.js tracker](/docs/sources/node-js-tracker/index.md) |
| Python backend | Python tracker | [Python tracker](/docs/sources/python-tracker/index.md) |
| Any other platform | | [All trackers](/docs/sources/index.md) |

Built-in events such as page views, page pings, and screen views work without extra setup. For behavior that the built-in events don't cover, track [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and attach [entities](/docs/fundamentals/entities/index.md), then define attributes on their properties.

To have a coding agent add the tracking for you, follow the [Signals quickstart with your coding agent](/docs/signals/quickstart/index.md).

## Send the identifiers your attribute keys use

Signals calculates each attribute per [attribute key](/docs/signals/attributes/attribute-keys/index.md), such as a user or a session. The built-in attribute keys read the atomic [user fields](/docs/fundamentals/canonical-event/index.md#user-fields) that the trackers set on every event:

* `domain_userid` and `domain_sessionid`: set automatically by the JavaScript tracker
* `network_userid`: set by the Collector cookie
* `user_id`: set by your application after the user logs in

If you want attributes per logged-in user, set the user ID in your tracker when the user logs in.

To receive interventions in a web application, also add the [Signals browser plugin](/docs/signals/applications/subscribe/index.md) to the JavaScript tracker.

## Check that events arrive

Signals only calculates attributes from events received after you publish the attribute group, unless you enable [backfill](/docs/signals/concepts/index.md#backfill). To check your tracking:

1. Open your application and generate a few events.
2. Check your browser's network tab for tracking requests to the Collector endpoint. If an ad blocker stops them, see [cookies and ad blockers](/docs/get-started/tracking/cookies-and-ad-blockers/index.md).
3. Inspect the events with the [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) browser extension to confirm they include the identifiers your attribute keys need.
4. [Retrieve the attributes](/docs/signals/applications/retrieve-attributes/index.md) to confirm Signals is calculating them.
