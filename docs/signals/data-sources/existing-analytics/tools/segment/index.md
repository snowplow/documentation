---
title: "Use Signals with Segment"
sidebar_label: "Segment"
sidebar_position: 10
description: "Send the events you already track with Segment to Snowplow, from the browser or from your Segment workspace, and calculate Signals attributes on them without retagging."
keywords: ["segment", "analytics.js", "destination plugin", "destination function", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the `analytics.page`, `track`, `identify`, and `group` calls you already make with Segment to calculate Snowplow Signals attributes, without retagging your site. An adapter maps each Segment call to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=segment#map-events-from-each-tool).

Most sites should use the client-side approach: a destination plugin in analytics.js copies each Segment call into the Snowplow JavaScript tracker on the same page. It gives you sessions, page pings, and a random visitor ID that is safe for interventions, and the visitor ID stays the same if you later move to native tracking. Use the server-side approach, a Destination Function in your Segment workspace, only for events from Segment's server or app libraries, or if you can't change the page. You can run both, as long as the Destination Function is connected only to your server and app sources. To fill [warehouse attribute groups](/docs/signals/attributes/warehouse-config/index.md) with history from before you connected, use Segment's warehouse destinations or Profiles Sync data through a Signals warehouse connection.

## Before you begin

You need:

- A Snowplow Collector URL for a pipeline with Signals enabled.
- The `external_event` and `external_identity` schemas, created in your Snowplow registry under your vendor. See [Create the schemas in your registry](/docs/signals/data-sources/existing-analytics/reference/index.md#create-the-schemas-in-your-registry).
- Segment's analytics.js 2.0 (analytics-next) on your site.
- Segment ecommerce events that use Segment's v2 spec names (`Product Viewed`, `Order Completed`, and so on) with a price and a currency. Other events become generic `external_event` events.

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup and adapter script for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository that loads analytics.js:

```text
Use the Snowplow existing-analytics skill to send our Segment events to
Snowplow with the client-side approach. Test against my Console
development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then adds the Snowplow tracker and the destination plugin next to your Segment snippet, sends test events, and checks that none failed. For the server-side approach, it gives you the Destination Function code to paste into your Segment workspace.

## Set up the client-side approach

Both approaches use the same adapter script, [`segment-snowplow-adapter.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/segment/segment-snowplow-adapter.js). If your event names differ from Segment's spec names, change the matching `name ===` checks in its `standardEvent` function. The [Segment setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/segment.md) has the code for each step.

<Steps>

### Load the Snowplow tracker

After the Segment snippet, load the [Snowplow JavaScript tracker](/docs/sources/web-trackers/index.md) with the ecommerce plugin, create a tracker that points at your Collector, and enable activity tracking. Activity tracking sends the page pings that engagement attributes need.

If your Collector is on the same site as your pages, the browser also sends Segment's `ajs_*` cookies to it, and `ajs_user_id` can hold an email address. To keep them off Collector requests, add `credentials: 'omit'` to the `newTracker` options, or use a Collector on a different site.

### Load the adapter

Save `segment-snowplow-adapter.js` on your site, set `vendor` near its top to your vendor, and load it after the tracker.

### Register the destination plugin

Add the destination plugin from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/segment.md#set-up-the-client-side-approach) to the page. Call `analytics.register` directly in the same page load as the Segment snippet, not inside `analytics.ready()`, or the plugin misses the first page view and its UTM parameters.

### Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point the tracker at it.
3. Send a page view, a product view, an order, and an `identify` call from a test page.
4. Select **Open dashboard** to see the good and failed events.

You should see:

- A `page_view` for each `analytics.page` call, including the landing page with its UTM parameters.
- `snowplow_ecommerce_action` events of type `product_view` and `transaction`, with `product` and `transaction` entities.
- An `identify` event whose only field is `id`.
- An `external_identity` entity on every event, with `tool` set to `segment` and the original Segment event name in `event_name`.
- `page_ping` events, and one `domain_sessionid` across the visit.
- No failed events. The Collector accepts events before they're validated, so a failed event shows here, not in Segment.

When the events look right, point the tracker at your pipeline's Collector, and publish the page change.

</Steps>

## Set up the server-side approach

A Destination Function maps each event Segment receives and posts it to your Collector. Segment's `anonymousId` becomes `domain_userid`, so read these attributes from your backend, not the public intervention endpoint. There are no sessions or page pings, and events arrive seconds later through Segment's queue. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay). Segment bills function execution time beyond its free allotment.

:::note[Not yet validated in a full workspace]
This approach was tested by running the function code outside Segment, not yet as a Destination Function in a Segment workspace. Check it against your development environment before you go live.
:::

<Steps>

### Create the function

In your Segment workspace, create a new Destination Function with two settings: `collectorUrl`, your Collector URL without a path (for example `https://collector.example.com`), and `appId`.

### Add the code

Paste `segment-snowplow-adapter.js`, with `vendor` near its top set to your vendor, followed by the handlers from the [Segment setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/segment.md#server-side-destination-function).

### Connect the function

Connect the function to the sources you want in Snowplow, and enable it. If your Collector is behind a firewall, add Segment's functions, which run in AWS us-west-2 and eu-west-1, to your allowlist.

### Check it works

Set `collectorUrl` to your Console development environment's Collector endpoint, and send test events from Segment's debugger. Check for the same events as the [client-side approach](#check-it-works), except page pings and sessions. Then set `collectorUrl` to your pipeline's Collector.

</Steps>

## Troubleshooting

- **No first page view or UTM parameters:** the plugin was registered inside `analytics.ready()`. Call `analytics.register` directly.
- **Ecommerce events arrive as `external_event`:** the event name isn't a Segment spec name, or it lacks a price, currency, or order ID. Rename it, or add the missing field.
- **Events arrive twice:** both approaches receive your browser source. Connect the Destination Function only to server and app sources.
- **No events when analytics.js is blocked:** the plugin runs inside analytics.js, so an ad blocker or consent tool that stops it stops the plugin too.
- **A property is missing from attributes:** Signals only reads fields a schema declares. See [`external_event`](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md). Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=segment#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/data-sources/existing-analytics/receive-interventions/index.md). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
