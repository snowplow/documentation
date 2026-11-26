---
title: "Use Signals with PostHog"
sidebar_label: "PostHog"
sidebar_position: 60
description: "Send the events you already capture with PostHog to Snowplow, from the browser or from a PostHog destination, and calculate Signals attributes on them without retagging."
keywords: ["posthog", "posthog-js", "before_send", "hog", "http webhook destination", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the pageviews, autocaptured events, custom events, and `identify` and `group` calls you already capture with PostHog to calculate Snowplow Signals attributes, without retagging your site. An adapter maps each PostHog event to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=posthog#map-events-from-each-tool).

Most sites should use the client-side approach: a hook in the posthog-js `before_send` option copies each event into the Snowplow JavaScript tracker on the same page. It's a few lines next to `posthog.init`, interventions arrive within a second or two, and it gives you a random visitor ID that is safe for interventions. Use the HTTP Webhook destination only for events from PostHog's server or mobile SDKs or the capture API, or if you can't change the page. You can run both, as long as you filter the destination so it skips browser events. If you already export PostHog events to a warehouse, Signals can also read history from a table of attributes you build there, as described in [Warehouse configuration](/docs/signals/attributes/warehouse-config/index.md). Build it per `$device_id` or `distinct_id`, with a custom attribute key for that ID, and select only the columns your attributes need: PostHog's events export includes person properties and the IP address.

## Before you begin

You need:

- A Snowplow Collector URL for a pipeline with Signals enabled.
- If you set up without an agent, the `external_event` and `external_identity` schemas in your Snowplow registry, under your vendor. See [Set up without an agent](/docs/signals/data-sources/existing-analytics/index.md#set-up-without-an-agent). With an agent, the `existing-analytics` skill creates them for you.
- posthog-js 1.187.0 or later on your site, which added `before_send`.
- Your PostHog project token. In PostHog, go to **Settings** > **Project** > **General** and copy **Project token**.
- PostHog ecommerce events that use PostHog's ecommerce spec names (`Product Viewed`, `Order Completed`, `Products Searched`, and so on) with a price and a currency. Other events become generic `external_event` events.

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup and mapping scripts for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository that calls `posthog.init`:

```text
Use the Snowplow existing-analytics skill to send our PostHog events to
Snowplow with the client-side before_send approach. Test against my
Console development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then adds the Snowplow tracker, the converter script, and the `before_send` hook next to your PostHog snippet, sends test events, and checks that none failed. For the HTTP Webhook destination, it gives you the Hog source and the inputs to set, and you create the destination in PostHog yourself.

## Set up the client-side approach

The client-side approach uses the mapping script [`converter.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/posthog/converter.js). If your ecommerce or search event names differ from PostHog's spec names, add them, in lower case, to the `ECOM` and `SEARCH` lists near the top of the script. The [PostHog setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/posthog.md#set-up-the-client-side-approach) has the code for each step.

<Steps>

### Load the Snowplow tracker

Before the PostHog snippet, load the [Snowplow JavaScript tracker](/docs/sources/web-trackers/index.md) with the ecommerce plugin, create a tracker that points at your Collector, and enable activity tracking. Activity tracking sends the page pings that engagement attributes need. Set `credentials: 'omit'` in `newTracker`, so PostHog's `ph_` cookie, which can hold your user ID, stays off requests to a Collector on the same site as your pages.

### Load the converter

Save `converter.js` on your site, set `vendor` near its top to your vendor, and load it after the tracker. It defines `PostHogSnowplow`, which maps each PostHog event to a Snowplow event.

### Define the hook

Add the `snowplowBeforeSend` function from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/posthog.md#set-up-the-client-side-approach) to the page. It must be defined before `posthog.init` runs. The hook copies each event into the Snowplow tracker and returns it unchanged, so PostHog receives exactly what it did before.

### Add the hook to `before_send`

In your `posthog.init` call, add the hook to `before_send`:

```js
posthog.init('<project_token>', {
  api_host: 'https://us.i.posthog.com',
  before_send: [snowplowBeforeSend],
});
```

If you already have `before_send` hooks, put `snowplowBeforeSend` last, so it sees events after your own redaction and sampling, for example `before_send: [redactHook, sampleHook, snowplowBeforeSend]`.

Then publish the page change.

The hook follows PostHog's consent: when the visitor has opted out, or consent is pending, posthog-js doesn't call `before_send`, so nothing reaches Snowplow either. Load the Snowplow tracker under the same consent, because it sets its own cookies. Session replay and heatmap events pass through the hook, and the converter drops them.

### Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point the tracker at it.
3. Send a page view, a product view, an order, a search, and an `identify` call from a test page.
4. Select **Open dashboard** to see the good and failed events.

You should see:

- A `page_view` for each `$pageview`, including single-page app route changes.
- `snowplow_ecommerce_action` events for product views and orders, with one `product` entity per product and a `transaction` entity on orders.
- A `site_search` event for each search, and an `identify` event whose only field is `id`.
- `external_event` for everything else, such as `$autocapture`, `$groupidentify`, and your own events, with `name` set to the PostHog event name.
- An `external_identity` entity on every event, with `tool` set to `posthog` and `anonymous_id` set to PostHog's `$device_id`.
- `page_ping` events.
- No failed events.

When the events look right, point the tracker at your pipeline's Collector.

</Steps>

## Set up the HTTP Webhook destination

A destination built from PostHog's HTTP Webhook template receives each event after PostHog has ingested it, from any PostHog SDK or the capture API. You replace its source with [`snowplow-collector-destination.hog`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/posthog/snowplow-collector-destination.hog), which maps each event the same way as the converter and posts it to your Collector. Don't edit the stock template's JSON body instead: body templating can't choose between page views, ecommerce events, and `external_event`, and its default body sends every person property, including any email.

The destination keys visitors on PostHog's `$device_id` and sessions on `$session_id`, so read these attributes from your backend, not the public intervention endpoint. Events reach your Collector a few seconds after PostHog receives them. Events from PostHog's server SDKs and the capture API usually carry only a `distinct_id`. The destination then sends the `distinct_id` as the anonymous ID, in `domain_userid` and `external_identity.anonymous_id`, with an empty `user_id`. To send it as the user ID, add a `$device_id` to those events that differs from the `distinct_id`. Check that your PostHog plan includes destinations: PostHog bills each event that triggers one beyond a free allotment.

<Steps>

### Create the destination

In PostHog, under **CDP**, open **Destinations**, click **New destination**, search for "Webhook", and click **Create** on **HTTP Webhook**.

### Set the inputs

Click **Edit source code**, then delete the template's inputs except **Log responses**: click each input's cog, then the bin. **Log responses** is the `debug` input the source reads.

Add two String inputs with **Add input variable**. Set each name in its cog panel, then enter the value in the editor under the input in the list.

| Input | Value |
|---|---|
| `collector_url` | Your Collector URL, for example `https://collector.example.com`, with no trailing slash |
| `app_id` | The app ID these events should carry |

### Add the source

Replace the source with the Hog code from `snowplow-collector-destination.hog`, and set `VENDOR` near its top to your vendor. If you added event names to the converter, add ecommerce names to the `ECOM` map near the top of the Hog source, and search names to its `lname = 'products searched'` check.

### Filter the events

In **Filters**, choose the events to forward. If you also run the client-side hook, add a property filter so `$lib` is not `web`. Browser test pages then don't reach the destination, so test from a server SDK or the capture API, or turn the filter off while you test.

### Check it works

Set `collector_url` to your Console development environment's Collector endpoint. Under **Testing**, click **Start testing**, then **Test function**. It posts a sample `$pageview` to your Collector and shows **Success**. Click **Create & enable**.

Open the **Invocations** tab to see each event's status. With **Log responses** on, a delivered event logs `sent` and `200`. Check for the same events as the [client-side approach](#check-it-works), except page pings. When the events look right, turn **Log responses** off and set `collector_url` to your pipeline's Collector.

</Steps>

## Troubleshooting

- **Nothing reaches PostHog or Snowplow in an automated browser:** posthog-js drops events from browsers it classes as bots. Set `opt_out_useragent_filter: true` in `posthog.init` for tests.
- **Nothing reaches Snowplow after an opt-out:** expected. The hook only runs for events PostHog sends.
- **The destination shows `Snowplow collector returned 404`:** the `collector_url` is wrong. Fix it, filter **Invocations** by **Logged errors**, and click **Rerun** on each failed row.
- **The destination shows delivered events but Snowplow has failed events:** the Collector accepts events before validation. Check failed events in Console as well as the destination's logs.
- **Browser events arrive twice:** both approaches send them. Add the `$lib` is not `web` filter to the destination.
- **`plan` changes unexpectedly:** any event with a `plan` property updates it, so a later event replaces the plan from `$groupidentify`.

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md). Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=posthog#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
