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
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* Your Conductrics owner code and API key
* Each trait you plan to send, created in the Conductrics admin. Conductrics ignores traits it doesn't know.

This page calls the Conductrics selection API from your server, so your API key stays there. Your server reads Signals with its own API key at the same time, so you don't need a [public service](/docs/signals/applications/public-services/index.md). If your site renders in the browser, the browser asks your server for the selection, as shown in [Select from the browser](#select-from-the-browser). [How it works](/docs/signals/integrations/experimentation-platforms/index.md#how-it-works) compares the two setups.

## Integrate on your server

Each time your server needs a selection, it reads the user's attributes from Signals, turns them into traits, and sends them on the selection call. The request makes two calls in sequence, so keep the Signals timeout short.

<Steps>

### Read Signals attributes

Add two helpers to your server. `getDomainUserId` reads the user's `domain_userid` from the `_sp_id` cookie that the JavaScript tracker sets. `readSignals` reads the user's attributes from your Signals service, using the `Signals` client you created when your server started, as described in [Connect to Signals](/docs/signals/connection/index.md).

```typescript
export function getDomainUserId(cookies: string): string | undefined {
  return cookies.match(/(?:^|;\s*)_sp_id\.[^=]+=([^.;]+)/)?.[1];
}

type Scalar = string | number | boolean;

export async function readSignals(
  service: string,
  domainUserId: string,
  timeoutMs: number,
): Promise<Record<string, Scalar>> {
  const timeout = new Promise<Record<string, unknown>>((resolve) =>
    setTimeout(() => resolve({}), timeoutMs),
  );
  try {
    const values = await Promise.race([
      signals.getServiceAttributes({
        name: service,
        attribute_key: 'domain_userid',
        identifier: domainUserId,
      }),
      timeout,
    ]);
    return Object.fromEntries(
      Object.entries(values ?? {}).filter(([, v]) =>
        ['string', 'number', 'boolean'].includes(typeof v),
      ),
    ) as Record<string, Scalar>;
  } catch {
    return {};
  }
}
```

If Signals is slow or returns an error, `readSignals` returns no attributes, so the user still gets the default experience without waiting. It also drops `null` values, which Conductrics can't target on. See [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes). If you've changed the tracker's `cookieName`, change the `_sp_id` prefix to match.

### Turn attributes into traits

Traits use `type:value` form. Group numeric attributes into the trait values you created in Conductrics, such as `intent:high`, or send them as `inputs`.

```typescript
function toTraits(attributes: Record<string, string | number | boolean>): string[] {
  const views = Number(attributes.product_views_last_10_min ?? 0);
  return [`intent:${views >= 5 ? 'high' : views >= 2 ? 'medium' : 'low'}`];
}
```

### Pass traits on the selection call

Read the attributes and call the selection API with `domain_userid` as the session. Wrap this in a function, so your request handler and the browser endpoint can both use it.

```typescript
const CONDUCTRICS_URL = 'https://api.v3.conductrics.com/{{owner_code}}/v3/agent-api';

async function selectVariation(agent: string, domainUserId: string) {
  const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

  const params = new URLSearchParams({ apikey: CONDUCTRICS_API_KEY, session: domainUserId });
  const response = await fetch(`${CONDUCTRICS_URL}?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      commands: [{ a: agent }],
      traits: toTraits(attributes),
    }),
  });
  const selection = await response.json();
  return { variation: selection.sels[agent], selection, attributes };
}
```

In your request handler, call it for each agent on the page:

```typescript
const domainUserId = getDomainUserId(req.headers.cookie ?? '');
const { variation, selection, attributes } = await selectVariation('checkout-offer', domainUserId);
```

### Track the selection

Each selection in the response includes a policy, `p`. A policy of `p` means the agent is paused, so the user isn't in an experiment. Build the exposures from the other selections, and return them with the page.

```typescript
function toExposures(selection, attributes) {
  return selection.items
    .filter((item) => item.p !== 'p')
    .map((item) => ({
      vendor: 'conductrics',
      experiment_id: item.a,
      variation_id: item.c,
      signals_attributes_used: Object.keys(attributes),
    }));
}

const exposures = toExposures(selection, attributes);
```

In the browser, attach `exposures` to the page view, as shown in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow). Conductrics can also send its own selection events to your Snowplow pipeline. Ask Conductrics to set this up for your account.

### Verify the integration

Open a page that runs the agent with [Snowplow Inspector](/docs/testing/snowplow-inspector/index.md) installed. The page view should carry an `experiment_exposure` entity with `vendor` set to `conductrics`. If selections ignore your targeting, check that every trait in the request exists in the Conductrics admin with the same spelling.

</Steps>

## Select from the browser

If your site is a single-page app or a static site, add an endpoint that runs the selection on your server, and call it from the browser. The endpoint reads `domain_userid` from the request's cookie, so a visitor can only get selections for themselves.

<Steps>

### Add a selection endpoint

This example uses Express.

```typescript
app.post('/api/conductrics/select', express.json(), async (req, res) => {
  const domainUserId = getDomainUserId(req.headers.cookie ?? '');
  res.set('Cache-Control', 'private, no-store');
  if (!domainUserId) {
    return res.json({ variation: null, exposures: [] });
  }
  const { variation, selection, attributes } = await selectVariation(req.body.agent, domainUserId);
  res.json({ variation, exposures: toExposures(selection, attributes) });
});
```

### Request the selection and track it

In the browser, call the endpoint with a short timeout, and show the default experience if it's slow or fails. Then attach the exposures to the page view.

```typescript
let result = { variation: null, exposures: [] };
try {
  const response = await fetch('/api/conductrics/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent: 'checkout-offer' }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (response.ok) {
    result = await response.json();
  }
} catch {
  // Keep the default experience
}

// In this example, variation A is the control
if (result.variation && result.variation !== 'A') {
  showOffer(result.variation);
}

window.snowplow('trackPageView', {
  context: result.exposures.map((data) => ({
    schema: 'iglu:com.example/experiment_exposure/jsonschema/1-0-0',
    data,
  })),
});
```

The timeout covers both the Signals read and the Conductrics call, so allow for both.

### Check the browser integration

Open the page with Snowplow Inspector installed, and with your browser's developer tools on the **Network** tab. The request to `/api/conductrics/select` should return a variation, and the page view should carry an `experiment_exposure` entity with `vendor` set to `conductrics`.

</Steps>

## Select from an intervention

To make a selection at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The handler calls the selection endpoint from [Select from the browser](#select-from-the-browser). Signals has already updated the user's attributes, so the endpoint sends the latest traits.

```typescript
addInterventionHandlers({
  async checkoutHesitation() {
    const response = await fetch('/api/conductrics/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent: 'checkout-offer' }),
    });
    const { variation } = await response.json();
    // In this example, variation A is the control
    if (variation && variation !== 'A') {
      showOffer(variation);
    }
  },
});
```

Users in the control group still trigger the intervention but see no change, which gives you a fair comparison. Track the exposure with the same entity.

For the pattern behind this page, see [Use Signals with experimentation platforms](/docs/signals/integrations/experimentation-platforms/index.md).
