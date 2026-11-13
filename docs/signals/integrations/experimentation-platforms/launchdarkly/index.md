---
title: "Use Signals with LaunchDarkly"
sidebar_position: 30
sidebar_label: "LaunchDarkly"
description: "Pass Signals attributes in the LaunchDarkly evaluation context, so flags, experiments, and AI Configs respond to in-session behavior, and track exposures in Snowplow."
keywords: ["signals", "launchdarkly", "feature flags", "evaluation context", "ai configs", "exposure tracking"]
date: "2026-11-13"
content_type: how-to
---

LaunchDarkly flags decide what ships to whom. Signals gives each evaluation what the user has done in this session, so a rule can respond on the first request instead of after a segment sync catches up.

LaunchDarkly targets on any attribute in the evaluation context, with no setup in the LaunchDarkly UI. With Signals and LaunchDarkly you can:

* Target flags and experiments on in-session behavior, such as "viewed 5 or more products in the last 10 minutes"
* Choose an AI Config's model or prompt from what the user is doing right now, because AI Configs use the same context targeting
* Keep sensitive attribute values out of LaunchDarkly by marking them private, while still targeting on them
* Analyze exposures in your warehouse next to the rest of your Snowplow data

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on, and a [connection to Signals](/docs/signals/connection/index.md) from your server
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* For the server setup, a LaunchDarkly server-side SDK key, and the `readSignals` helper from [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes)
* For the browser setup, a LaunchDarkly client-side ID, with the flag made available to client-side SDKs. You also need a public Signals service and the `fetchSignalsAttributes` helper, as described in [Read attributes in the browser](/docs/signals/integrations/experimentation-platforms/index.md#read-attributes-in-the-browser), and the `getDomainUserId` helper from [Choose the user key](/docs/signals/integrations/experimentation-platforms/index.md#choose-the-user-key)

Use the setup that matches where you run the LaunchDarkly SDK. [How it works](/docs/signals/integrations/experimentation-platforms/index.md#how-it-works) compares the two.

## Integrate on your server

Use this setup if your server renders the page. Each time your request handler evaluates a flag, it reads the user's attributes from Signals and adds them to the evaluation context.

<Steps>

### Initialize LaunchDarkly

Create the LaunchDarkly client once when your server starts.

```typescript
import { init } from '@launchdarkly/node-server-sdk';

const launchdarkly = init(LAUNCHDARKLY_SDK_KEY);
await launchdarkly.waitForInitialization({ timeout: 10 });
```

### Pass Signals attributes in the context

In your request handler, read the attributes and evaluate the flag with a context keyed on `domain_userid`. List any attribute you don't want sent back to LaunchDarkly in `privateAttributes`.

```typescript
const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

const context = {
  kind: 'user',
  key: domainUserId,
  ...attributes,
  _meta: { privateAttributes: ['cart_value'] },
};
const detail = await launchdarkly.variationDetail('checkout-offer', context, false);
```

If an attribute is missing or `null`, LaunchDarkly skips the rules that use it, and the user gets the default rule. For experiments where the outcome happens in the same session, you can add a custom `session` context kind keyed on `domain_sessionid` and randomize on it.

### Track the exposure

`variationDetail` tells you whether the user is in an experiment. Build the exposure from it, and return it with the page.

```typescript
const exposures = detail.reason.inExperiment
  ? [{
      vendor: 'launchdarkly',
      experiment_id: 'checkout-offer',
      variation_id: String(detail.variationIndex),
      signals_attributes_used: Object.keys(attributes),
    }]
  : [];
```

In the browser, attach `exposures` to the page view, as shown in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow).

### Verify the integration

Open a page that evaluates the flag with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed. The page view should carry an `experiment_exposure` entity with `vendor` set to `launchdarkly`. In LaunchDarkly, the **Contexts** list shows the context with its Signals attributes, except the private ones.

</Steps>

## Integrate in the browser

Use this setup if your site is a single-page app or a static site. The browser reads the user's attributes from a public Signals service and passes them to the LaunchDarkly SDK running in the browser.

For an iOS or Android app, follow the same steps with the LaunchDarkly mobile SDK. Read the attributes with the Snowplow tracker, and use the tracker's session `userId` as the user key, as described in [In a mobile app](/docs/signals/integrations/experimentation-platforms/index.md#in-a-mobile-app).

<Steps>

### Initialize LaunchDarkly with Signals attributes

The browser SDK evaluates flags for the context it starts with, so fetch the attributes first. Key the context on `domain_userid` from the tracker's cookie. Set `withReasons` so that `variationDetail` reports whether the user is in an experiment. This example uses version 4 of the JavaScript client-side SDK.

```typescript
import { createClient } from '@launchdarkly/js-client-sdk';

const attributes = await fetchSignalsAttributes(TIMEOUT_MS);

const ldClient = createClient(
  LAUNCHDARKLY_CLIENT_SIDE_ID,
  { kind: 'user', key: getDomainUserId(document.cookie), ...attributes },
  { withReasons: true },
);
ldClient.start();
await ldClient.waitForInitialization({ timeout: 5 });
```

The public service already limits which attributes reach the browser. Anything you put in the context is also sent to LaunchDarkly, unless you list it in `_meta.privateAttributes`.

### Evaluate the flag and track the exposure

Evaluate the flag, then attach the exposure to the page view.

```typescript
const detail = ldClient.variationDetail('checkout-offer', false);
if (detail.value) {
  showOffer(detail.value);
}

const exposures = detail.reason?.inExperiment
  ? [{
      vendor: 'launchdarkly',
      experiment_id: 'checkout-offer',
      variation_id: String(detail.variationIndex),
      signals_attributes_used: Object.keys(attributes),
    }]
  : [];

window.snowplow('trackPageView', {
  context: exposures.map((data) => ({
    schema: 'iglu:com.example/experiment_exposure/jsonschema/1-0-0',
    data,
  })),
});
```

### Check the browser integration

Open the page with Snowplow Inspector installed, and with your browser's developer tools on the **Network** tab. The request to your Signals API URL should return the public service's attributes, and the page view should carry an `experiment_exposure` entity with `vendor` set to `launchdarkly`.

</Steps>

## Assign a variation from an intervention

To evaluate a flag at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler adds them to the context. This example uses the client from [Integrate in the browser](#integrate-in-the-browser).

```typescript
addInterventionHandlers({
  async checkoutHesitation(intervention) {
    await ldClient.identify({ ...ldClient.getContext(), ...intervention.attributes });
    const offer = ldClient.variation('checkout-offer', false);
    if (offer) {
      showOffer(offer);
    }
  },
});
```

Users in the control group still trigger the intervention but see no change, which gives you a fair comparison. Track the exposure with the same entity.

To send Snowplow events to LaunchDarkly as experiment metrics, use the [LaunchDarkly tag for GTM Server Side](/docs/destinations/forwarding-events/google-tag-manager-server-side/launchdarkly-tag-for-gtm-ss/index.md). For the pattern behind this page, see [Use Signals with experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md).
