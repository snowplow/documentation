---
title: "Use Signals with RudderStack"
sidebar_label: "RudderStack"
sidebar_position: 20
description: "Send the events you already track with RudderStack to Snowplow, from the browser or from your RudderStack workspace, and build Signals attributes on them without retagging."
keywords: ["rudderstack", "transformation", "webhook destination", "custom device mode", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the `page`, `track`, `identify`, `group`, and `alias` calls you already make with RudderStack to calculate Snowplow Signals attributes, without retagging your site. An adapter maps each RudderStack call to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=rudderstack#map-events-from-each-tool).

Most sites should use the client-side approach: a custom device mode integration in the RudderStack JavaScript SDK copies each call into the Snowplow JavaScript tracker on the same page. It gives you sessions, page pings, and a random visitor ID that is safe for interventions, and the visitor ID stays the same if you later move to native tracking. Use a server-side approach, a transformation with a Webhook destination in your RudderStack workspace, only for events from RudderStack's server or mobile SDKs, or if you can't change the page. If your workspace can't use transformations, HTTP Webhook field mappings do the same job without code. You can run client-side and server-side together, as long as the server-side destination is connected only to your server and mobile sources. To fill warehouse attribute groups with history from before you connected, use the RudderStack data already in your warehouse through a Signals warehouse connection.

## Before you begin

You need:

- A Snowplow Collector URL for a pipeline with Signals enabled.
- The `external_event` and `external_identity` schemas, created in your Snowplow registry under your vendor. See [Create the schemas in your registry](/docs/signals/data-sources/existing-analytics/reference/index.md#create-the-schemas-in-your-registry).
- The RudderStack JavaScript SDK v3 (`@rudderstack/analytics-js`) 3.23.0 or later on your site, loaded with a snippet that lists `addCustomIntegration` among its methods. If yours doesn't, copy a current snippet from your source's **Setup** tab.
- RudderStack ecommerce events that use the ecommerce spec names (`Product Viewed`, `Order Completed`, and so on) with a price and a currency. Other events become generic `external_event` events.

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup and adapter script for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository that loads the RudderStack SDK:

```text
Use the Snowplow existing-analytics skill to send our RudderStack events
to Snowplow with the client-side approach. Test against my Console
development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then adds the Snowplow tracker, the adapter, and the custom integration next to your RudderStack snippet, sends test events, and checks that none failed. You still add the Custom Device Mode destination in your RudderStack workspace and give the agent its destination ID. For the server-side approaches, the agent gives you the transformation code or the HTTP Webhook mapping values to paste into your RudderStack workspace.

## Set up the client-side approach

The client-side approach and the transformation use the same adapter script, [`rudderstack-snowplow-adapter.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/rudderstack/rudderstack-snowplow-adapter.js). If your event names differ from the ecommerce spec names, change the matching entries in its `ECOM` table. The [RudderStack setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/rudderstack.md#set-up-the-client-side-approach) has the code for each step.

<Steps>

### Add a Custom Device Mode destination

In your RudderStack workspace, add a **Custom Device Mode** destination, connect it to your JavaScript source, and copy its destination ID.

### Load the Snowplow tracker

After the RudderStack snippet, load the [Snowplow JavaScript tracker](/docs/sources/web-trackers/index.md), create a tracker that points at your Collector, and enable activity tracking. Activity tracking sends the page pings that engagement attributes need.

If your Collector is on the same site as your pages, the browser also sends RudderStack's `rl_*` cookies to it, and these can carry an email address from your traits. To keep them off Collector requests, add `credentials: 'omit'` to the `newTracker` options, or use a Collector on a different site.

### Add the adapter

Add `rudderstack-snowplow-adapter.js` to the page with a classic `<script>` tag, after the tracker, and set `vendor` in its `CONFIG` to your vendor. The integration calls the adapter's `ladder` function for each RudderStack call. Don't add `transformation-entry.js`, which only the server-side transformation uses.

### Register the integration

Add the integration code from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/rudderstack.md#set-up-the-client-side-approach), and replace `<destination_id>` with the ID you copied. Register it straight after the tracker and the adapter in the page source, not in a `rudderanalytics.ready()` callback or a tag that fires later. The SDK ignores integrations added after it has loaded. Then publish the page change.

### Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point the tracker at it.
3. Send a page view, a product view, an order, and an `identify` call from a test page.
4. Select **Open dashboard** to see the good and failed events.

You should see:

- A `page_view` for each `page` call.
- `snowplow_ecommerce_action` events of type `product_view` and `transaction`, with `product` and `transaction` entities.
- An `identify` event whose only field is `id`.
- An `external_identity` entity on every event, with `tool` set to `rudderstack` and the original event name in `event_name`.
- `page_ping` events, and one `domain_sessionid` across the visit.
- No failed events. The Collector accepts events before they're validated, so a failed event shows here, not in RudderStack.

When the events look right, point the tracker at your pipeline's Collector.

</Steps>

## Set up the server-side approaches

The server-side approaches run in your RudderStack workspace and cover RudderStack's server and mobile SDKs too. RudderStack's `anonymousId` becomes `domain_userid`, so read these attributes from your backend, not the public intervention endpoint. There are no sessions or page pings, and events arrive seconds after the call. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay). If your Collector is behind a firewall, add RudderStack's outbound IP addresses to your allowlist.

:::note[Not yet validated in a full workspace]
The transformation was tested on a self-hosted RudderStack server, and the HTTP Webhook mappings were checked by review only. Neither has run in a RudderStack Cloud workspace yet, and nor has the client-side Custom Device Mode destination. Check it against your development environment before you go live.
:::

If your workspace can't use transformations, add an **HTTP Webhook** destination instead, with URL `https://collector.example.com/i`, method `GET`, no authentication, and batching off. Build the Collector request from query parameter mappings, not the JSONata body template, and copy each value exactly from the [HTTP Webhook mappings](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/rudderstack.md#server-side-without-code-http-webhook-mappings) in the setup reference. The mappings send `messageId` as the event ID, which Snowplow requires to be a UUID, so use the transformation for sources whose `messageId` may not be one. The mappings also check only for a currency, so an ecommerce event with a currency but no order ID, price, or product ID fails validation. Then set the `aid` mapping to your app ID, and use your vendor in the `external_event` and `external_identity` schema URIs inside the `ue_pr` and `co` values. Connect the destination to your sources and enable it, then test it with your Console development environment's Collector endpoint followed by `/i`, and check for the same events as the [client-side approach](#check-it-works), except page pings and sessions.

To use a transformation:

<Steps>

### Create the transformation

In your RudderStack workspace, create a JavaScript transformation, paste `rudderstack-snowplow-adapter.js` followed by [`transformation-entry.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/rudderstack/transformation-entry.js), and set `aid` in `CONFIG` to your app ID and `vendor` to your vendor. `transformation-entry.js` holds the `transformEvent` entry point. Each event's `event_id` is derived from RudderStack's `messageId`, so a retried event counts once in Signals.

### Add a Webhook destination

Add a **Webhook** destination with **Webhook URL** `https://collector.example.com/com.snowplowanalytics.snowplow/tp2` and **Method** `POST`, and connect the transformation to it.

### Connect the destination

Connect the destination to the sources you want in Snowplow, and enable it. When you change the transformation later, publish it as a new version.

### Check it works

Set the **Webhook URL** to your Console development environment's Collector endpoint, keeping the `/com.snowplowanalytics.snowplow/tp2` path, and send test events. Check for the same events as the [client-side approach](#check-it-works), except page pings and sessions. Then set the **Webhook URL** to your pipeline's Collector.

</Steps>

## Troubleshooting

- **Nothing reaches Snowplow from the client-side integration:** the destination ID doesn't match a Custom Device Mode destination on your source, or the integration was added after the SDK loaded. Check the ID, and register the integration in the page source straight after the snippet.
- **Ecommerce events arrive as `external_event`:** the event name isn't a spec name, or it lacks a price, currency, or order ID. Rename it, or add the missing field.
- **Events arrive twice:** both approaches receive your browser source. Connect the server-side destination only to server and mobile sources.
- **A changed transformation has no effect:** publish it as a new version.
- **A property is missing from attributes:** Signals only reads fields a schema declares. Map it to a typed `external_event` field. See [`external_event`](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md). Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=rudderstack#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/data-sources/existing-analytics/receive-interventions/index.md). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
