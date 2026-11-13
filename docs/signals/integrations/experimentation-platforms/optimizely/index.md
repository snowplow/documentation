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

This page uses Optimizely Feature Experimentation with the JavaScript SDK v6, which runs on your server or in the browser. For Optimizely Web Experimentation, use the [Optimizely tracking](/docs/sources/web-trackers/tracking-events/optimizely/index.md) plugin to record exposures.

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* An Optimizely Feature Experimentation project, with an attribute created for each Signals attribute you want to use in an audience
* For the server setup, a [connection to Signals](/docs/signals/connection/index.md) from your server
* For the browser setup, the [Signals browser plugin](/docs/signals/applications/public-services/index.md#read-the-service) on your tracker

Use the setup that matches where you run the Optimizely SDK. [How it works](/docs/signals/integrations/experimentation-platforms/index.md#how-it-works) compares the two.

## Integrate on your server

Use this setup if your server renders the page. Each time your request handler decides which variation to show, it reads the user's attributes from Signals and passes them to the Optimizely user context.

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

If Signals is slow or returns an error, `readSignals` returns no attributes, so the user still gets the default experience without waiting. It also drops `null` values, which Optimizely can't target on. See [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes). If you've changed the tracker's `cookieName`, change the `_sp_id` prefix to match.

### Pass Signals attributes to the user context

In your request handler, read the attributes and create the user context with `domain_userid` as the user ID.

```typescript
const domainUserId = getDomainUserId(req.headers.cookie ?? '');
const attributes = await readSignals('checkout_intent', domainUserId, TIMEOUT_MS);

const user = optimizely.createUserContext(domainUserId, attributes);
const decision = user.decide('checkout_offer');
```

Optimizely attributes aren't typed, and a value of the wrong type makes the audience condition evaluate to false. Keep numeric Signals attributes as numbers. `readSignals` already drops `null` values.

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

## Integrate in the browser

Use this setup if your site is a single-page app or a static site. The browser reads the user's attributes from a public Signals service and passes them to the Optimizely SDK running in the browser.

For an iOS or Android app, follow the same steps with the Optimizely mobile SDK. Read the attributes with the Snowplow tracker, and use the tracker's session `userId` as the user key, as described in [In a mobile app](/docs/signals/integrations/experimentation-platforms/index.md#in-a-mobile-app).

<Steps>

### Read attributes from a public service

Create a Signals service for the browser with the `public` access mode, containing only attributes that are safe to show to the user, as described in [Choose what the browser can read](/docs/signals/integrations/experimentation-platforms/index.md#choose-what-the-browser-can-read). These examples call it `checkout_intent_browser`.

Read it with `getServiceAttributes()` from the Signals browser plugin, which must be [installed on your tracker](/docs/signals/applications/public-services/index.md#read-the-service). It reads the service for the tracker's `domain_userid`. `getDomainUserId` reads the same ID from the tracker's cookie, to use as the user key in Optimizely.

```typescript
import { getServiceAttributes } from '@snowplow/signals-browser-plugin';

export async function fetchSignalsAttributes(
  timeoutMs: number,
): Promise<Record<string, string | number | boolean>> {
  try {
    const values = await getServiceAttributes({
      endpoint: SIGNALS_API_URL,
      service: 'checkout_intent_browser',
      timeoutMs,
    });
    return Object.fromEntries(
      Object.entries(values).filter(([, v]) =>
        ['string', 'number', 'boolean'].includes(typeof v),
      ),
    ) as Record<string, string | number | boolean>;
  } catch {
    return {};
  }
}

export function getDomainUserId(cookies: string): string | undefined {
  return cookies.match(/(?:^|;\s*)_sp_id\.[^=]+=([^.;]+)/)?.[1];
}
```

Like the server helper, `fetchSignalsAttributes` returns no attributes if the read is slow or fails, and drops `null` values.

### Fetch attributes while Optimizely loads

Create the Optimizely client, and fetch the attributes at the same time, so the user waits for whichever takes longer rather than both in turn.

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

const [attributes] = await Promise.all([
  fetchSignalsAttributes(TIMEOUT_MS),
  optimizely.onReady(),
]);
```

### Decide with Signals attributes

Create the user context with `domain_userid` from the tracker's cookie, and show the variation.

```typescript
const domainUserId = getDomainUserId(document.cookie);
const user = optimizely.createUserContext(domainUserId, attributes);
const decision = user.decide('checkout_offer');

if (decision.variationKey && decision.variationKey !== 'control') {
  showOffer(decision.variationKey);
}
```

The same advice on attribute types and contextual bandits applies as in the server setup.

### Track the exposure with the page view

Build the exposure from the decision, and attach it to the page view.

```typescript
const exposures = decision.variationKey
  ? [{
      vendor: 'optimizely',
      experiment_id: decision.ruleKey ?? decision.flagKey,
      variation_id: decision.variationKey,
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

Open the page with Snowplow Inspector installed, and with your browser's developer tools on the **Network** tab. The request to your Signals API URL should return the public service's attributes, and the page view should carry an `experiment_exposure` entity with `vendor` set to `optimizely`.

</Steps>

## Assign a variation from an intervention

To decide at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler passes them straight to the Optimizely SDK. This example uses the client from [Integrate in the browser](#integrate-in-the-browser).

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
