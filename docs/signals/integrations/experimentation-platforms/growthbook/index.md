---
title: "Use Signals with GrowthBook"
sidebar_position: 20
sidebar_label: "GrowthBook"
description: "Pass Signals attributes to GrowthBook when it evaluates features and experiments, so targeting uses in-session behavior, and track exposures in Snowplow."
keywords: ["signals", "growthbook", "feature flags", "a/b testing", "targeting attributes", "exposure tracking"]
date: "2026-11-13"
content_type: how-to
---

GrowthBook evaluates features and experiments against whatever attributes your application passes. Signals fills those attributes with what each user is doing right now.

GrowthBook evaluates rules in your own process, and attribute values are never sent to GrowthBook. With Signals and GrowthBook you can:

* Target features and experiments on in-session behavior, such as cart value or recent product views
* Record which Signals attributes each assignment used, because GrowthBook's tracking callback receives the attributes it evaluated
* Analyze results in GrowthBook from your Snowplow data in the warehouse, and break them down by the same Signals attributes

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on, and a [connection to Signals](/docs/signals/connection/index.md) from your server
* The `readSignals` helper from [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes)
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* Each Signals attribute added in GrowthBook under **SDK Configuration** > **Attributes**, so you can target on it

## Integrate Signals with GrowthBook

Each time your server evaluates a feature, it reads the user's attributes from Signals and passes them to a GrowthBook instance scoped to that request.

<Steps>

### Initialize GrowthBook

Create the GrowthBook client once when your server starts.

```typescript
import { GrowthBookClient } from '@growthbook/growthbook';

const growthbook = new GrowthBookClient({
  apiHost: GROWTHBOOK_API_HOST,
  clientKey: GROWTHBOOK_CLIENT_KEY,
});
await growthbook.init();
```

### Pass Signals attributes and track exposures

In your request handler, read the attributes and create a scoped instance with `domain_userid` as the `id` attribute. GrowthBook calls `trackingCallback` for each experiment the user is assigned to, so build the exposures there and return them with the page.

```typescript
const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

const exposures = [];
const gb = growthbook.createScopedInstance({
  attributes: { id: domainUserId, ...attributes },
  trackingCallback: (experiment, result) => {
    exposures.push({
      vendor: 'growthbook',
      experiment_id: experiment.key,
      variation_id: String(result.key),
      signals_attributes_used: Object.keys(attributes),
    });
  },
});
const offer = gb.getFeatureValue('checkout-offer', 'control');
```

In the browser, attach `exposures` to the page view, as shown in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow). GrowthBook also publishes its own exposure event, `iglu:io.growthbook/experiment_viewed/jsonschema/1-0-0`, which you can track instead.

### Verify the integration

Open a page that runs the experiment with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed. The page view should carry an `experiment_exposure` entity with `vendor` set to `growthbook` and the variation you were assigned. If no exposure appears, check that the experiment's targeting conditions use attribute names that match the Signals service.

</Steps>

## Assign a variation from an intervention

To evaluate a feature at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler adds them to the GrowthBook browser SDK. `setAttributes` replaces all attributes, so merge the new values with the existing ones. This example assumes you've already initialized the browser SDK.

```typescript
addInterventionHandlers({
  async checkoutHesitation(intervention) {
    await growthbook.setAttributes({ ...growthbook.getAttributes(), ...intervention.attributes });
    const offer = growthbook.getFeatureValue('checkout-offer', 'control');
    if (offer !== 'control') {
      showOffer(offer);
    }
  },
});
```

Users in the control group still trigger the intervention but see no change, which gives you a fair comparison. Track the exposure with the same entity.

For the pattern behind this page, see [Use Signals with experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md).
