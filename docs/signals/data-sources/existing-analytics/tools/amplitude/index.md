---
title: "Use Signals with Amplitude"
sidebar_label: "Amplitude"
sidebar_position: 40
description: "Send the events your Amplitude Browser SDK or Webhook destination already produces to Snowplow, so Signals can calculate attributes on them."
keywords: ["amplitude", "browser sdk", "destination plugin", "webhook", "freemarker", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the events your Amplitude implementation already sends to calculate Snowplow Signals attributes, without retagging your site. A converter maps each Amplitude event to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=amplitude#map-events-from-each-tool), and Amplitude keeps receiving its events as before.

Most sites should use the client-side approach: a destination plugin in the Amplitude Browser SDK passes each event to the Snowplow JavaScript tracker on the same page. It's a few lines of JavaScript next to `amplitude.init`, it reacts while the visitor is still on the page, and it gives you a random visitor ID that is safe to use for interventions. Use Amplitude's Webhook destination for events from your servers, mobile apps, or the HTTP API, or if you can't change the page code. You can run both, as long as the webhook forwards only events that don't come from the browser.

If you can't add the Snowplow tracker to your pages, the plugin can [post events straight to the Collector](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#send-without-the-snowplow-tracker) instead, without page pings, retries, or in-page interventions. If you already export Amplitude events to a warehouse, you can also add history, such as a lifetime order count, with a [warehouse attribute group](/docs/signals/attributes/warehouse-config/index.md).

## Before you begin

You need:

- Amplitude Browser SDK 2 (`@amplitude/analytics-browser`).
- The Admin or Manager role on your Amplitude project, or someone who has it. Only those roles can see the API key and add destinations.
- A Snowplow Collector URL for a pipeline with Signals enabled.
- The `external_event` and `external_identity` schemas, created in your Snowplow registry under your vendor. See [Create the schemas in your registry](/docs/signals/data-sources/existing-analytics/reference/index.md#create-the-schemas-in-your-registry).
- Your Amplitude tracking plan, so you can check your ecommerce and search event names against the names the converter recognizes. Other events become generic `external_event` events.

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup, converter, and webhook template for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository that calls `amplitude.init`:

```text
Use the Snowplow existing-analytics skill to send our Amplitude events to Snowplow with the client-side destination plugin. Gate it on our existing consent tool, and test against my Console development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then adds the Snowplow tracker, the converter, and the destination plugin next to your `amplitude.init` call, sends test events, and checks that none failed. For the Webhook destination, it gives you the template and settings, and you create the destination in Amplitude yourself, with the Admin or Manager role.

## Set up the client-side approach

The client-side approach uses the converter script [`amplitude-snowplow.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/amplitude/amplitude-snowplow.js). If your ecommerce or search event names differ from the defaults, add them to its `ECOM` and `SEARCH` lists. The [Amplitude setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#set-up-the-client-side-approach) has the code for each step.

<Steps>

### Load the Snowplow tracker

Before the Amplitude SDK, load the Snowplow JavaScript tracker with the [tag snippet](/docs/sources/web-trackers/quick-start-guide/index.md), create a tracker that points at your Collector, and enable activity tracking. Activity tracking sends the page pings that engagement attributes need. Use the tag snippet rather than the npm package, because the plugin calls `window.snowplow`, which the tag snippet defines.

Don't call `trackPageView` yourself. The plugin forwards Amplitude's page views, so keep page views on in the Browser SDK's `autocapture` option, as they are by default.

### Load the converter

Save `amplitude-snowplow.js` on your site, for example as `/js/amplitude-snowplow.js`, set `vendor` near its top to your vendor, and load it with a `<script>` tag before the Amplitude SDK.

### Add the destination plugin

Add the destination plugin from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#set-up-the-client-side-approach) with `amplitude.add`, before you call `amplitude.init`. Keep your existing `amplitude.init` options unchanged.

### Gate both tools on consent

The Snowplow tracker sets its own cookies as soon as `newTracker` runs, so create it only after the visitor consents. Add `optOut: true` to the `amplitude.init` call, and move the tracker code into a function that your consent tool calls. The function creates the tracker, enables activity tracking, and then calls `amplitude.setOptOut(false)`. The [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#set-up-the-client-side-approach) has the code.

Events tracked before consent are dropped, so neither Amplitude nor Snowplow receives them. See [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

### Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one: it runs Snowplow Micro, hosted by Snowplow. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point the Snowplow tracker at it.
3. Send test events from your site.
4. Select **Open dashboard** to see the good and failed events.

In the dashboard, check that:

- Every Amplitude event arrives once, with no failed events.
- `[Amplitude] Page Viewed` arrives as a `page_view`.
- Product views and orders arrive as `snowplow_ecommerce_action`, with one `product` entity per item and a `transaction` entity on orders.
- Searches arrive as `site_search`, and identifies with a user ID arrive as `identify` with the ID only.
- Every other event arrives as `external_event`, with `name` set to the Amplitude event type.
- Every event carries an `external_identity` entity with `tool` set to `amplitude` and `anonymous_id` set to the Amplitude `device_id`.

When the events look right, point the tracker at your pipeline's Collector, and publish the change to your site.

</Steps>

## Set up the Webhook destination

Amplitude's Webhook destination formats each event with a FreeMarker template and posts it straight to your Collector, with no service in between. It covers every source Amplitude streams, including server SDKs, the HTTP API, and mobile apps. Check that your Amplitude plan includes the Webhook destination.

The webhook keys visitors on Amplitude's `device_id`, which a `?deviceId=` link can set, so read these attributes from your backend only. Amplitude's documented delivery target is 60 seconds at the 95th percentile, so don't rely on this approach for reactions within a page view. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).

<Steps>

### Create the destination

In Amplitude, go to **Data** > **Catalog**, open the **Destinations** tab, and create a Webhook destination that sends events. See Amplitude's [Webhooks](https://amplitude.com/docs/data/destination-catalog/webhooks) documentation.

### Set the URL and header

Set the URL to your Collector's `tp2` endpoint, for example `https://collector.example.com/com.snowplowanalytics.snowplow/tp2`, and add the header `Content-Type: application/json`.

### Choose the events

Choose to send events, and select the events to forward. If you also run the client-side plugin, forward only events that don't come from the browser.

### Add the template

Paste [`amplitude-webhook-template.ftl`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/amplitude/amplitude-webhook-template.ftl) as the event payload. Change `"aid":"my-app"` to the app ID you want these events to carry, and set `VENDOR` near the top to your vendor. If you added event names to the converter's lists, add them to the same lists near the top of the template.

### Check it works

Set the URL to your Console development environment's Collector endpoint, keeping the `/com.snowplowanalytics.snowplow/tp2` path, and send test events from Amplitude. Check for the same events as the [client-side approach](#check-it-works). Then set the URL to your pipeline's Collector.

</Steps>

## Troubleshooting

- **No page views in Snowplow:** page view autocapture is off in the Browser SDK. Turn it back on, or no visitor or session attributes fill.
- **Events reach Snowplow but not Amplitude:** the plugin forwards events even when Amplitude rejects them, for example with a wrong API key. Check **Data** > **Sources** > **Ingestion Debugger** in Amplitude.
- **Every event arrives twice:** both the tracker plugin and the no-tracker plugin are loaded, or the webhook forwards browser events the plugin already sends. Keep one path per event.
- **Server or app events are missing:** the client-side plugin sees browser events only. Add the Webhook destination for the rest.
- **`plan` changes unexpectedly:** any event with a `plan` property updates it, so a later track event replaces the plan from `groupIdentify`.

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md). Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=amplitude#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/data-sources/existing-analytics/receive-interventions/index.md). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
