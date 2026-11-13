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

GrowthBook evaluates rules in your own code, on your server or in the browser, and attribute values are never sent to GrowthBook. With Signals and GrowthBook you can:

* Target features and experiments on in-session behavior, such as cart value or recent product views
* Record which Signals attributes each assignment used, because GrowthBook's tracking callback receives the attributes it evaluated
* Analyze results in GrowthBook from your Snowplow data in the warehouse, and break them down by the same Signals attributes

## Before you begin

You need:

* A Signals [service](/docs/signals/applications/services/index.md) that returns the attributes you want to target on
* An exposure entity, as described in [Track exposures in Snowplow](/docs/signals/integrations/experimentation-platforms/index.md#track-exposures-in-snowplow)
* Each Signals attribute added in GrowthBook under **SDK Configuration** > **Attributes**, so you can target on it
* For the server setup, a [connection to Signals](/docs/signals/connection/index.md) from your server
* For the browser setup, the [Signals browser plugin](/docs/signals/applications/public-services/index.md#read-the-service) on your tracker

Use the setup that matches where you run the GrowthBook SDK. [How it works](/docs/signals/integrations/experimentation-platforms/index.md#how-it-works) compares the two.

## Integrate on your server

Use this setup if your server renders the page. Each time your request handler evaluates a feature, it reads the user's attributes from Signals and passes them to a GrowthBook instance scoped to that request.

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

If Signals is slow or returns an error, `readSignals` returns no attributes, so the user still gets the default experience without waiting. It also drops `null` values, which GrowthBook can't target on. See [Handle slow or missing attributes](/docs/signals/integrations/experimentation-platforms/index.md#handle-slow-or-missing-attributes). If you've changed the tracker's `cookieName`, change the `_sp_id` prefix to match.

### Pass Signals attributes and track exposures

In your request handler, read the attributes and create a scoped instance with `domain_userid` as the `id` attribute. GrowthBook calls `trackingCallback` for each experiment the user is assigned to, so build the exposures there and return them with the page.

```typescript
const domainUserId = getDomainUserId(req.headers.cookie ?? '');
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

## Integrate in the browser

Use this setup if your site is a single-page app or a static site. The browser reads the user's attributes from a public Signals service and passes them to the GrowthBook SDK running in the browser.

For an iOS or Android app, follow the same steps with the GrowthBook mobile SDK. Read the attributes with the Snowplow tracker, and use the tracker's session `userId` as the user key, as described in [In a mobile app](/docs/signals/integrations/experimentation-platforms/index.md#in-a-mobile-app).

<Steps>

### Read attributes from a public service

Create a Signals service for the browser with the `public` access mode, containing only attributes that are safe to show to the user, as described in [Choose what the browser can read](/docs/signals/integrations/experimentation-platforms/index.md#choose-what-the-browser-can-read). These examples call it `checkout_intent_browser`.

Read it with `getServiceAttributes()` from the Signals browser plugin, which must be [installed on your tracker](/docs/signals/applications/public-services/index.md#read-the-service). It reads the service for the tracker's `domain_userid`. `getDomainUserId` reads the same ID from the tracker's cookie, to use as the user key in GrowthBook.

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

### Fetch attributes while GrowthBook loads

Create the GrowthBook instance, and fetch the attributes while it loads its features. Then set the attributes, with `domain_userid` from the tracker's cookie as the `id`.

```typescript
import { GrowthBook } from '@growthbook/growthbook';

const exposures = [];
let signalsAttributeNames: string[] = [];

const growthbook = new GrowthBook({
  apiHost: GROWTHBOOK_API_HOST,
  clientKey: GROWTHBOOK_CLIENT_KEY,
  trackingCallback: (experiment, result) => {
    exposures.push({
      vendor: 'growthbook',
      experiment_id: experiment.key,
      variation_id: String(result.key),
      signals_attributes_used: signalsAttributeNames,
    });
  },
});

const [attributes] = await Promise.all([
  fetchSignalsAttributes(TIMEOUT_MS),
  growthbook.init({ timeout: 1000 }),
]);
signalsAttributeNames = Object.keys(attributes);
await growthbook.setAttributes({ id: getDomainUserId(document.cookie), ...attributes });
```

### Evaluate the feature and track the exposure

Evaluate the feature, then attach the exposures that GrowthBook reported to the page view.

```typescript
const offer = growthbook.getFeatureValue('checkout-offer', 'control');
if (offer !== 'control') {
  showOffer(offer);
}

window.snowplow('trackPageView', {
  context: exposures.map((data) => ({
    schema: 'iglu:com.example/experiment_exposure/jsonschema/1-0-0',
    data,
  })),
});
```

### Check the browser integration

Open the page with Snowplow Inspector installed, and with your browser's developer tools on the **Network** tab. The request to your Signals API URL should return the public service's attributes, and the page view should carry an `experiment_exposure` entity with `vendor` set to `growthbook`.

</Steps>

## Assign a variation from an intervention

To evaluate a feature at the moment a user meets a condition, for example when they hesitate at checkout, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) in the browser. The intervention payload includes the user's attributes, so the handler adds them to the GrowthBook instance. `setAttributes` replaces all attributes, so merge the new values with the existing ones. This example uses the instance from [Integrate in the browser](#integrate-in-the-browser).

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
