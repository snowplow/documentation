---
title: "Use Signals with Optimizely"
sidebar_position: 40
sidebar_label: "Optimizely"
description: "Pass Signals attributes to Optimizely Feature Experimentation at decision time, so audiences and contextual bandits act on in-session behavior, and track exposures in Snowplow."
keywords: ["signals", "optimizely", "feature experimentation", "contextual multi-armed bandit", "audience targeting", "exposure tracking"]
date: "2026-11-13"
content_type: how-to
---

Optimizely decides which variation each user sees. Signals gives every decision what the user has done in this session, so your audiences and contextual bandits act on it while the user is still on the page.

Optimizely can also target on audiences synced from other systems, but a sync lags behind the session. Attributes passed at decision time don't. With Signals and Optimizely you can:

* Target audiences on in-session behavior, such as "viewed 5 or more products in the last 10 minutes"
* Give a contextual multi-armed bandit the user's current behavior as its context, so it learns which variation works for which kind of session
* Segment results in Optimizely by the same attributes you targeted on
* Analyze exposures in your warehouse next to the rest of your Snowplow data

This page uses Optimizely Feature Experimentation with the JavaScript SDK v6. For Optimizely Web Experimentation, use the [Optimizely tracking](/docs/sources/web-trackers/tracking-events/optimizely/index.md) plugin to record exposures.

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on, and a [connection to Signals](/docs/signals/connection/index.md) from your server
* The `readSignals` helper from [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes)
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* An Optimizely Feature Experimentation project, with an attribute created for each Signals attribute you want to use in an audience

## Integrate Signals with Optimizely

Each time your server decides which variation to show, it reads the user's attributes from Signals and passes them to the Optimizely user context.

<Steps>

### Initialize Optimizely

Create the Optimizely client once when your server starts.

```typescript
import {
  createInstance,
  createPollingProjectConfigManager,
  createBatchEventProcessor,
} from '@optimizely/optimizely-sdk';

const optimizely = createInstance({
  projectConfigManager: createPollingProjectConfigManager({ sdkKey: OPTIMIZELY_SDK_KEY }),
  eventProcessor: createBatchEventProcessor(),
});
await optimizely.onReady();
```

### Pass Signals attributes to the user context

In your request handler, read the attributes and create the user context with `domain_userid` as the user ID.

```typescript
const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

const user = optimizely.createUserContext(domainUserId, attributes);
const decision = user.decide('checkout_offer');
```

Optimizely attributes aren't typed, and a value of the wrong type makes the audience condition evaluate to false. Keep numeric Signals attributes as numbers, and use the `readSignals` helper to drop `null` values.

For rules that use a contextual multi-armed bandit, call `decideAsync` instead of `decide`. Optimizely caches bandit decisions for each combination of attribute values, so pass grouped values, such as an intent band of `low`, `medium`, or `high`, rather than raw counts that change on every event.

### Track the exposure

Build the exposure from the decision, and return it with the page.

```typescript
const exposures = decision.variationKey
  ? [{
      vendor: 'optimizely',
      experiment_id: decision.ruleKey ?? decision.flagKey,
      variation_id: decision.variationKey,
      signals_attributes_used: Object.keys(attributes),
    }]
  : [];
```

In the browser, attach `exposures` to the page view, as shown in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow).

### Verify the integration

Open a page that runs the flag with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed. The page view should carry an `experiment_exposure` entity with `vendor` set to `optimizely` and the variation you were assigned. To see why Optimizely chose a variation, pass `[OptimizelyDecideOption.INCLUDE_REASONS]` to `decide` and log `decision.reasons`.

</Steps>

## Assign a variation from an intervention

To decide at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler passes them straight to the Optimizely browser SDK. This example assumes you've already initialized the browser SDK.

```typescript
addInterventionHandlers({
  checkoutHesitation(intervention) {
    const user = optimizely.createUserContext(domainUserId, intervention.attributes);
    const decision = user.decide('checkout_offer');
    if (decision.variationKey && decision.variationKey !== 'control') {
      showOffer(decision.variationKey);
    }
  },
});
```

Users in the control group still trigger the intervention but see no change, which gives you a fair comparison. Track the exposure with the same entity.

For the pattern behind this page, see [Use Signals with experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md).
