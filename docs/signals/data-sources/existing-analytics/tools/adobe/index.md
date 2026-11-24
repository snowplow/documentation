---
title: "Use Signals with Adobe Analytics and Adobe Experience Platform"
sidebar_label: "Adobe"
sidebar_position: 50
description: "Copy the events your Adobe Web SDK, AppMeasurement, or Adobe Client Data Layer already sends into Snowplow, so Signals can compute attributes without retagging."
keywords: ["adobe analytics", "adobe experience platform", "web sdk", "appmeasurement", "event forwarding", "data feeds", "signals"]
date: "2026-11-16"
content_type: how-to
---

Copy the events your Adobe setup already sends into Snowplow, so Snowplow Signals can calculate visitor, session, and account attributes from them without retagging your site. An adapter maps each Adobe event to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=adobe#map-events-from-each-tool).

Most sites should use the Web SDK callback: one `onBeforeEventSend` callback in your Web SDK configuration copies each event into the Snowplow JavaScript tracker as Adobe sends it. The tracker runs in the browser, so you get Snowplow sessions, page pings, and interventions in the page. If your site uses AppMeasurement instead, use the AppMeasurement callback. If it pushes events to the Adobe Client Data Layer, you can fire Snowplow events from Tags rules instead. Use event forwarding only if your contract includes it and you can't add a browser script: it has no sessions or in-page interventions, and values arrive later. If you receive Adobe Analytics Data Feeds in a warehouse, you can also turn them into batch attributes beside a live approach.

To tell which setup you have: if `alloy` exists on the page, you use the Web SDK. If `s_gi` exists, or requests go to `/b/ss/`, you use AppMeasurement. If `adobeDataLayer` exists, you can use Tags rules.

If your site runs both the Web SDK and AppMeasurement, pick one hook. Using both copies each event twice.

## Before you begin

You need:

- A Snowplow pipeline with Signals enabled, and its Collector URL.
- Access to change your Adobe setup: the Tags property, or the page code that configures the Web SDK.
- A list of the XDM fields that hold the user ID, plan, account ID, and search term. The adapter reads only the fields you name.
- The `external_event` and `external_identity` schemas, created in your Snowplow registry under your vendor. See [Where to start](/docs/signals/data-sources/existing-analytics/index.md#where-to-start).

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup and adapter scripts for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository that configures the Web SDK:

```text
Use the Snowplow existing-analytics skill to send our Adobe Web SDK
events to Snowplow with the onBeforeEventSend callback. Test against my
Console development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then adds the shared script and the Web SDK mapping to your site, asks you for your XDM field paths, adds the callback, sends test events, and checks that none failed. If you deploy the Web SDK, AppMeasurement, or event forwarding with Tags, the agent gives you the code and settings to add in Adobe Experience Platform Data Collection, and you publish the library yourself.

## Set up the Web SDK callback

The Web SDK calls `onBeforeEventSend` with each event just before it sends it. The callback copies the event into Snowplow and lets Adobe's request continue unchanged. The [Adobe setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#set-up-the-web-sdk-callback) has the code for each step.

<Steps>

### Add the shared script

Host the [Snowplow JavaScript tracker](/docs/sources/web-trackers/index.md) and ecommerce plugin, version 4.10.3, where your pages can load them. Then add [`snowplow-adobe.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/adobe/snowplow-adobe.js) to your pages, or to your Tags library, so that it runs before the Web SDK sends its first event. All Adobe approaches use this script. Set `collector` to your Collector URL, `appId` to your app ID, and `VENDOR` near the top to your vendor, and change the `/js/sp.js` and `/js/snowplow-ecommerce.js` paths to where you host the tracker and plugin.

To send page pings for engagement attributes, add this after `newTracker`:

```js
snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
```

### Add the field map

Add [`web-sdk-mapping.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/adobe/web-sdk-mapping.js) to `snowplow-adobe.js`, after the helpers. Replace the paths in `FIELDS` with the paths in your own XDM schema. Tenant fields start with your tenant ID, such as `xdm._yourtenant`.

### Read the ECID

Call `getIdentity` once after your first `sendEvent` resolves, set `window.snowplowAdobe.vendorId` to a function that returns the ECID, then call `window.snowplowAdobe.idReady()` so held events are sent. The [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#set-up-the-web-sdk-callback) has the code, in step 3. Use your Web SDK instance name, which is `alloy` by default. On a first visit, the shared script holds events for up to 5 seconds until the ECID is available.

### Add the callback

If you configure the Web SDK in page code, add `onBeforeEventSend` to your `configure` call:

```js
alloy('configure', {
  datastreamId: 'YOUR_DATASTREAM_ID',
  orgId: 'YOUR_ORG_ID@AdobeOrg',
  // An exception here would stop the Web SDK sending to Adobe too, so the copy never throws.
  onBeforeEventSend: function (content) {
    try { window.snowplowAdobe.mirrorXdm(content); } catch (e) {}
  },
});
```

If you deploy the Web SDK with Tags, add this to the **On before event send callback** code in the **Adobe Experience Platform Web SDK** extension settings. The extension provides the event as `content`:

```js
try { if (window.snowplowAdobe && window.snowplowAdobe.mirrorXdm) window.snowplowAdobe.mirrorXdm(content); } catch (e) {}
```

Keep the `try` and `catch`, and never return `false`: either would stop the event for Adobe too. The Tags extension setup hasn't yet been validated in a full Adobe Tags property, so check it against your development environment before you publish the library.

### Gate the tracker on consent

The tracker sets its own cookies when it loads. Load `snowplow-adobe.js` only once your consent management platform allows analytics.

### Publish the change

Publish your Tags library, or deploy your page code.

### Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point `collector` in the shared script at it. For event forwarding, point the **Make Fetch Call** action at it, keeping the `/com.snowplowanalytics.snowplow/tp2` path.
3. Send a page view, a product view, a purchase, and a login.
4. Select **Open dashboard** to see the good and failed events.

You should see:

- No failed events.
- A `page_view` event for each Adobe page view.
- `snowplow_ecommerce_action` events for product views and orders, with a `product` entity per line and a `transaction` entity.
- An `identify` event for each login, with `id` only.
- `external_event` events for everything else, with `name` set to the XDM `eventType`, the link name, or the data layer event.
- An `external_identity` entity on every event, with the ECID in `anonymous_id`.
- Every event still reaching Adobe, in the Adobe Experience Platform Debugger.

When the events look right, point the shared script at your pipeline's Collector.

</Steps>

## Set up another approach

Each of these approaches sends the same Snowplow events as the Web SDK callback. The AppMeasurement callback and Tags rules also use `snowplow-adobe.js`. The [Adobe setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#other-approaches) has the steps and code for each one. When you've set one up, [check it works](#check-it-works).

### AppMeasurement callback

AppMeasurement calls the function you pass to `s.registerPreTrackCallback` with the request URL of every `s.t()` and `s.tl()` call, and the callback sends the matching Snowplow event. Add the shared script and [`appmeasurement-mapping.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/adobe/appmeasurement-mapping.js), and set `MAP` to the eVars, props, and events that hold the user ID, plan, account ID, and search term. In the request URL, `eVar1` appears as `v1` and `prop3` as `c3`. Then [register the callback](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#appmeasurement-callback) on your `s` object. If Tags deploys AppMeasurement, put it in the **Adobe Analytics** extension's custom code.

### Tags rules on the Adobe Client Data Layer

If your site pushes events to the Adobe Client Data Layer (`adobeDataLayer`), you can fire Snowplow events from Tags rules, one rule per event. In the **Adobe Client Data Layer** extension, create data elements that read named paths only, such as `page.name` and `user.id`: the data layer keeps every field ever pushed, including emails. Then create a rule per data layer event, with the extension's **Data Pushed** event and a **Core Custom Code** action that calls a helper in the shared script. The reference has [example rules](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#tags-rules-on-the-adobe-client-data-layer).

### Event forwarding

Event forwarding runs a rule on Adobe's servers for each Web SDK or Mobile SDK event that reaches the Edge Network, and posts a Snowplow event to your Collector. Nothing changes in the browser or the app. It has no Snowplow sessions, the visitor key is the ECID, and values arrive later than client-side. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay). Adobe includes event forwarding with Real-Time CDP Connections, Prime, and Ultimate.

:::note[Not yet validated in a full workspace]
The converter was tested outside Adobe's runtime, not yet in an event forwarding property. Check it against your development environment before you go live.
:::

In your event forwarding property, create a **Core Custom Code** data element, for example `snowplow body`, that holds [`event-forwarding-converter.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/adobe/event-forwarding-converter.js) and the [closing lines from the reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#event-forwarding). In the converter, set `VENDOR` to your vendor, `aid` to your app ID, and `slots` to the same XDM paths as `FIELDS` in `web-sdk-mapping.js`, and change `searchQuery`, `loginTypes`, and `userNamespaces` if yours differ. Then install the **Adobe Cloud Connector** extension, and create a rule with a **Make Fetch Call** action that sends a `POST` to `https://<your collector>/com.snowplowanalytics.snowplow/tp2`, with the header `Content-Type: application/json` and the `snowplow body` data element as the body. Publish the event forwarding library.

### Warehouse history from Data Feeds

If you load Adobe Analytics Data Feeds into the warehouse Signals reads, you can aggregate them per ECID and add the result as a [batch source](/docs/signals/attributes/warehouse-config/index.md). The reference has an [example model](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/adobe.md#warehouse-history-data-feeds). Warehouse attributes update periodically, so they can't trigger interventions.

## Troubleshooting

- **Adobe stops receiving an event:** the callback is throwing or returning `false`. Keep the `try` and `catch`, and return nothing.
- **The first events on a page aren't copied:** `snowplow-adobe.js` loaded after the Web SDK sent them. Load it first, or from a Library Loaded rule ordered before your first event.
- **Events arrive without `external_identity`:** the ECID wasn't available within 5 seconds. Check the `getIdentity` call from [Read the ECID](#read-the-ecid).
- **Each event arrives twice:** your site runs both the Web SDK and AppMeasurement hooks. Keep one.
- **A value is missing from `external_event`:** add its XDM path, eVar, or prop to your field map. Attributes read only the typed fields of `external_event`, and Adobe's own processing, such as eVar persistence and processing rules, isn't applied.

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md). Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=adobe#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
