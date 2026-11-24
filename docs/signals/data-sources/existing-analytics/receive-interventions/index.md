---
title: "Receive interventions on pages that use an adapter"
sidebar_label: "Receive interventions"
sidebar_position: 40
description: "Deliver Signals interventions to pages that send events to Snowplow through an existing analytics adapter, with the Signals browser plugin on the Snowplow tracker or in Google Tag Manager."
keywords: ["interventions", "signals browser plugin", "google tag manager", "external_event", "signals"]
date: "2026-11-24"
content_type: how-to
---

An [intervention](/docs/signals/interventions/index.md) tells your page that a visitor's attributes have met a condition you set. On pages that send events to Snowplow through a client-side adapter, the Snowplow tracker is already on the page, so you receive interventions by adding the Signals browser plugin to it.

Only client-side approaches can receive interventions in the page. Server-side approaches key visitors on your tool's own ID, which isn't safe on the public intervention endpoint, and approaches that send events without the Snowplow tracker can't load the plugin. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md#keys-you-can-use-on-the-public-intervention-endpoint).

## Before you begin

You need:

- A client-side adapter sending events to your Collector. See [Use Signals with your existing analytics](/docs/signals/data-sources/existing-analytics/index.md).
- A published [attribute group](/docs/signals/attributes/index.md) keyed on `domain_userid` or `domain_sessionid`, and a published [intervention](/docs/signals/interventions/index.md) that targets the same key.
- Your Signals API URL, from Console under **Signals** > **Overview**.

## Receive interventions with the Snowplow tracker

Use this when the Snowplow tracker is loaded in your page code, as on the Segment, RudderStack, Amplitude, Adobe, and PostHog client-side approaches, and the GA4 page script.

<Steps>

### Add the plugin and subscribe

After `newTracker`, add the [Signals browser plugin](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin), register a handler, and subscribe. Set `endpoint` to your Signals API URL, and replace `purchase_intent_nudge` with your intervention's name.

```js
snowplow('addPlugin', 'https://cdn.jsdelivr.net/npm/@snowplow/signals-browser-plugin@0.2.2/dist/index.umd.min.js', ['snowplowSignals', 'SignalsPlugin']);

snowplow('addInterventionHandlers', {
  purchaseIntentNudge: function (intervention) {
    if (intervention.name === 'purchase_intent_nudge') {
      // Show the offer in your UI.
    }
  },
});

snowplow('subscribeToInterventions', { endpoint: 'YOUR_SIGNALS_API_URL' });
```

Load the plugin once per page: a second copy doesn't receive your handlers.

### Check it works

Trigger the intervention's condition from a test page. The handler runs, typically 1 to 2 seconds after the event. The first visitor after you publish an intervention can wait a minute or more. The plugin also sends `intervention_receive` and `intervention_handle` events, which you can see in your Console development environment.

</Steps>

## Receive interventions in Google Tag Manager

Use this when you send events with Snowplow's GTM tag templates.

<Steps>

### Load the plugin on the page view tag

On the **Snowplow v4** page view tag that fires on **Window Loaded**, open **Load Plugins** and add a row with **Plugin URL** set to `https://cdn.jsdelivr.net/npm/@snowplow/signals-browser-plugin@0.2.2/dist/index.umd.min.js` and **Plugin Configuration** set to `snowplowSignals,SignalsPlugin`. If the same tag also fires on **History Change**, split it into two tags and load the plugin only on the Window Loaded one.

### Add the handler tag

Add a **Custom HTML** tag on **Window Loaded** with the `addInterventionHandlers` and `subscribeToInterventions` calls from [Add the plugin and subscribe](#add-the-plugin-and-subscribe), in a `<script>` element. Under **Advanced Settings** > **Tag Sequencing**, select **Fire a tag before** this tag fires, and choose the Window Loaded page view tag.

### Check it works

In GTM **Preview**, trigger the intervention's condition and check that the handler runs.

</Steps>

See [Subscribe to interventions](/docs/signals/applications/subscribe/index.md) for every option, and [Define interventions](/docs/signals/interventions/index.md) to create one.
