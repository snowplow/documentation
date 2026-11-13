---
title: "Use Signals with Conductrics"
sidebar_position: 10
sidebar_label: "Conductrics"
description: "Pass Signals attributes to Conductrics as traits on each selection, so rules and predictive agents use in-session behavior, and track selections in Snowplow."
keywords: ["signals", "conductrics", "predictive agents", "traits", "a/b testing", "exposure tracking"]
date: "2026-11-13"
content_type: how-to
---

Conductrics picks the best experience for each user. Signals tells it what that user is doing in this session, at the moment it selects.

Conductrics takes user attributes as traits on each selection call. Its predictive agents learn which traits predict a better response to each option, and count each goal against the traits present at selection. That makes fresh traits at selection time the input that matters most. With Signals and Conductrics you can:

* Target selections on in-session behavior, such as a high intent score in the current visit
* Give predictive agents traits from today's session, rather than from an export that lags behind it
* Analyze selections in your warehouse next to the rest of your Snowplow data

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on, and a [connection to Signals](/docs/signals/connection/index.md) from your server
* The `readSignals` helper from [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes)
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* Your Conductrics owner code and API key
* Each trait you plan to send, created in the Conductrics admin. Conductrics ignores traits it doesn't know.

## Integrate Signals with Conductrics

Conductrics selects a variation through its REST API. Each time your server needs a selection, it reads the user's attributes from Signals, turns them into traits, and sends them on the selection call. The request makes two calls in sequence, so keep the Signals timeout short.

<Steps>

### Turn attributes into traits

Traits use `type:value` form. Group numeric attributes into the trait values you created in Conductrics, such as `intent:high`, or send them as `inputs`.

```typescript
function toTraits(attributes: Record<string, string | number | boolean>): string[] {
  const views = Number(attributes.product_views_last_10_min ?? 0);
  return [`intent:${views >= 5 ? 'high' : views >= 2 ? 'medium' : 'low'}`];
}
```

### Pass traits on the selection call

In your request handler, read the attributes and call the selection API with `domain_userid` as the session.

```typescript
const CONDUCTRICS_URL = 'https://api.v3.conductrics.com/{{owner_code}}/v3/agent-api';

const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

const params = new URLSearchParams({ apikey: CONDUCTRICS_API_KEY, session: domainUserId });
const response = await fetch(`${CONDUCTRICS_URL}?${params}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    commands: [{ a: 'checkout-offer' }],
    traits: toTraits(attributes),
  }),
});
const selection = await response.json();
const offer = selection.sels['checkout-offer'];
```

### Track the selection

Each selection in the response includes a policy, `p`. A policy of `p` means the agent is paused, so the user isn't in an experiment. Build the exposures from the other selections, and return them with the page.

```typescript
const exposures = selection.items
  .filter((item) => item.p !== 'p')
  .map((item) => ({
    vendor: 'conductrics',
    experiment_id: item.a,
    variation_id: item.c,
    signals_attributes_used: Object.keys(attributes),
  }));
```

In the browser, attach `exposures` to the page view, as shown in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow). Conductrics can also send its own selection events to your Snowplow pipeline. Ask Conductrics to set this up for your account.

### Verify the integration

Open a page that runs the agent with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed. The page view should carry an `experiment_exposure` entity with `vendor` set to `conductrics`. If selections ignore your targeting, check that every trait in the request exists in the Conductrics admin with the same spelling.

</Steps>

## Select from an intervention

To make a selection at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The Conductrics API key stays on your server, so the handler asks your server to make the selection. The server endpoint runs the selection call above, with the intervention's attributes converted to traits.

```typescript
addInterventionHandlers({
  async checkoutHesitation(intervention) {
    const response = await fetch('/api/conductrics/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: 'checkout-offer', attributes: intervention.attributes }),
    });
    const { offer } = await response.json();
    // In this example, variation A is the control
    if (offer !== 'A') {
      showOffer(offer);
    }
  },
});
```

Users in the control group still trigger the intervention but see no change, which gives you a fair comparison. Track the exposure with the same entity.

For the pattern behind this page, see [Use Signals with experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md).
