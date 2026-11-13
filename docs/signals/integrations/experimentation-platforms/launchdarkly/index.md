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
* The `readSignals` helper from [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes)
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* A LaunchDarkly server-side SDK key

## Integrate Signals with LaunchDarkly

Each time your server evaluates a flag, it reads the user's attributes from Signals and adds them to the evaluation context.

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

## Assign a variation from an intervention

To evaluate a flag at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler adds them to the context in the LaunchDarkly browser SDK. This example assumes you've already initialized the browser SDK.

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
