---
title: "Use Signals with experimentation platforms"
sidebar_position: 10
sidebar_label: "Experimentation platforms"
description: "Pass Signals attributes to your A/B testing or feature flag platform when it assigns a variant, and track exposures in Snowplow so results join to your behavioral data."
keywords: ["signals", "experimentation platform", "public services", "a/b testing", "feature flags", "optimizely", "growthbook", "launchdarkly", "conductrics", "exposure tracking"]
date: "2026-11-04"
content_type: concept
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Experimentation platforms, the A/B testing and feature flag tools such as Optimizely, GrowthBook, LaunchDarkly, and Conductrics, decide which variant each user sees. They make that decision using the attributes your application passes in. Signals gives them attributes that describe what the user is doing right now, so your experiments can target and learn from behavior in the current session.

Your experimentation platform still assigns variants, holds out a control group, and calculates results. Signals provides the attributes, and Snowplow records which variant each user saw.

This page covers the pattern every platform shares. Each platform page shows the code for that platform:

| Platform | How it takes Signals attributes |
| --- | --- |
| [Conductrics](/docs/signals/integrations/experimentation-platforms/conductrics/index.md) | Traits on the selection API call |
| [GrowthBook](/docs/signals/integrations/experimentation-platforms/growthbook/index.md) | Attributes on a scoped SDK instance |
| [LaunchDarkly](/docs/signals/integrations/experimentation-platforms/launchdarkly/index.md) | Attributes in the evaluation context |
| [Optimizely](/docs/signals/integrations/experimentation-platforms/optimizely/index.md) | Attributes on the user context |

Other platforms follow the same pattern. For example, Kameleoon calls user attributes custom data.

## Why use Signals with an experimentation platform

Experimentation platforms usually target on what they can see on the page, or on audiences synced from another system. Synced audiences arrive minutes or hours later, so they describe a past session rather than the current one.

Passing Signals attributes at assignment lets you:

* Target on in-session behavior: show a variant to users who are comparing prices, hesitating at checkout, or returning for the third time today
* Give bandits better context: contextual bandits and predictive targeting learn from the attributes they receive at each decision
* Use one definition everywhere: the attribute you target on is the same attribute you segment results by, so "high intent" means the same thing in targeting and in analysis
* Analyze results in your own warehouse: exposures are part of your Snowplow data, so you can join them to every other event a user generated
* Start an experiment at the right moment: assign a variant when a user meets a condition, using [interventions](/docs/signals/interventions/index.md)

## How it works

Your server can read any Signals service with an API key. Websites and mobile apps can read a [public service](/docs/signals/applications/public-services/index.md) directly, without a key, for the current user. So the experimentation decision can happen wherever your platform's SDK already runs:

| | On your server | In the browser | In a mobile app |
| --- | --- | --- | --- |
| Use it when | Your server renders pages, or already calls the platform's server-side SDK | Your site is a single-page app or a static site, or the platform runs only in the browser | Your iOS or Android app runs the platform's mobile SDK |
| How attributes reach the SDK | Your server reads them with an API key | The Signals browser plugin reads a public service | The Snowplow mobile tracker reads a public service |
| What the user sees | The page arrives with the variant already applied | The page waits for the attributes before it shows the variant | The screen waits for the attributes before it shows the variant |

On your server, you read attributes like this. In these examples, `checkout_intent` is a Signals service and `domainUserId` is the user's Snowplow ID. Create the `Signals` client once when your server starts, as described in [Connect to Signals](/docs/signals/connection/index.md), and reuse it for every request.

<Tabs groupId="signals-language" queryString>
<TabItem value="nodejs" label="Node.js" default>

```typescript
const attributes = await signals.getServiceAttributes({
  name: 'checkout_intent',
  attribute_key: 'domain_userid',
  identifier: domainUserId,
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
attributes = sp_signals.get_service_attributes(
    name="checkout_intent",
    attribute_key="domain_userid",
    identifier=domain_user_id,
)
```

</TabItem>
</Tabs>

Signals returns the service's attributes for that user, for example:

```json
{
  "cart_value": 120,
  "product_views_last_10_min": 6,
  "is_returning_customer": true
}
```

Your platform then applies a rule such as "show the offer when `product_views_last_10_min` is at least 5".

### On your server

Your request handler reads the attributes. A request handler is the server code that runs when a browser requests a page or calls your API, for example an Express route, a Next.js route handler or server component, or a Django view. It passes the attributes to the platform's server-side SDK before the page is rendered.

```mermaid
flowchart LR
    A["Your website"] -->|"1. Events"| S["Signals"]
    S -->|"2. Attributes"| B["Your server"]
    B -->|"3. Attributes"| E["Experimentation platform"]
    E -->|"4. Variant"| B
    B -->|"5. Variant"| A
    A -->|"6. Exposure"| P["Snowplow"]
```

In order:

1. Your website sends events to Snowplow, and Signals updates the user's attributes
2. When the user requests a page, your server reads their attributes from a Signals [service](/docs/signals/applications/services/index.md)
3. Your server passes the attributes to the experimentation SDK
4. The SDK applies your targeting rules and assigns a variant
5. Your server renders the variant
6. Your website tracks which variant the user saw, as part of the page view

### In the browser

The browser reads the current user's attributes from a public service, with the Signals browser plugin, and passes them to the platform's browser SDK. No request goes through your server.

```mermaid
flowchart LR
    A["Your website"] -->|"1. Events"| S["Signals"]
    A -->|"2. Read"| S
    S -->|"3. Attributes"| A
    A -->|"5. Exposure"| P["Snowplow"]
```

In order:

1. Your website sends events to Snowplow, and Signals updates the user's attributes
2. When the page loads, the browser plugin reads the public service for the tracker's `domain_userid`
3. Signals returns the attributes in that service
4. The browser SDK applies your targeting rules and assigns a variant
5. Your website shows the variant, and tracks which variant the user saw as part of the page view

The user waits for the read before the variant appears, so keep its timeout short. Most platforms' browser snippets already hide the page until they assign a variant.

A public service can be read by anyone who has the user's identifier, and the attributes you pass to a browser SDK are visible in the browser. Create a separate public service for the browser that contains only attributes that are safe to show to the user they describe, and keep the rest in a service that only your server reads. See [Read attributes in the browser](#read-attributes-in-the-browser).

### In a mobile app

The [iOS and Android trackers](/docs/sources/mobile-trackers/signals/index.md) read a public service in the same way, keyed by the tracker's session `userId` under the built-in `client_session_user_id` attribute key. Define the attribute groups behind the service with that key, and pass the attributes to the platform's mobile SDK as you would in the browser.

```swift
let attributes = try await tracker.signals.getServiceAttributes(service: "checkout_intent_app")
```

Use the same rules as in the browser: keep the timeout short, show the default experience if the read fails, and only include attributes that are safe to show to the user.

## Choose the user key

The user key is the identifier the experimentation platform uses to assign a variant. Use `domain_userid` by default, so experiment exposures, Signals attributes, and Snowplow events all join on the same ID. Don't let the platform create its own anonymous ID as well.

Use `domain_sessionid` only for experiments where the outcome happens in the same session, because a new session would assign the user again. Use `user_id` only if your platform keeps assignments the same across login.

The JavaScript tracker stores `domain_userid` as the first value in its `_sp_id` cookie, as described in [Getting cookie values](/docs/sources/web-trackers/cookies-and-local-storage/getting-cookie-values/index.md). The cookie's full name is `_sp_id.` followed by a hash. This helper reads it from a cookie header on your server, or from `document.cookie` in the browser:

<Tabs groupId="signals-language" queryString>
<TabItem value="nodejs" label="Node.js" default>

```typescript
export function getDomainUserId(cookies: string): string | undefined {
  return cookies.match(/(?:^|;\s*)_sp_id\.[^=]+=([^.;]+)/)?.[1];
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
def get_domain_user_id(cookies: dict) -> str | None:
    for name, value in cookies.items():
        if name.startswith("_sp_id."):
            return value.split(".")[0]
    return None
```

</TabItem>
</Tabs>

If you've changed the tracker's `cookieName`, change the `_sp_id` prefix to match. On a user's first page view, your server may not receive the cookie yet, so experiments that target in-session behavior should assign on a later request.

In a mobile app, use the session `userId` from the Snowplow tracker, `tracker.session?.userId`, as the user key. It's the identifier the tracker reads Signals attributes by.

## Handle slow or missing attributes

Assignment shouldn't depend on Signals. If a read is slow or fails, assign without Signals attributes rather than delay the page. The platform pages call this helper in place of the direct read. It does two things:

* Returns an empty set of attributes if Signals doesn't reply within your timeout, or returns an error
* Drops `null` values, because experimentation platforms skip targeting conditions on missing or wrongly typed values

<Tabs groupId="signals-language" queryString>
<TabItem value="nodejs" label="Node.js" default>

```typescript
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

</TabItem>
<TabItem value="python" label="Python">

The Python SDK call is synchronous, so this helper runs it in a thread pool to apply a timeout.

```python
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=8)

def read_signals(service: str, domain_user_id: str, timeout_s: float) -> dict:
    future = executor.submit(
        sp_signals.get_service_attributes,
        name=service,
        attribute_key="domain_userid",
        identifier=domain_user_id,
    )
    try:
        values = future.result(timeout=timeout_s)
    except Exception:  # Includes the timeout
        return {}
    return {k: v for k, v in (values or {}).items() if isinstance(v, (str, int, float, bool))}
```

</TabItem>
</Tabs>

Users without Signals attributes, because the read timed out or because they're new, don't match conditions built on Signals attributes, and see the default variant. Keep this in mind when you report results.

### Read attributes in the browser

For the browser setup, create a service for the browser and set its access mode to `public`, as described in [Control who can read a service](/docs/signals/applications/services/index.md#control-who-can-read-a-service). In these examples it's called `checkout_intent_browser`. Only include attribute groups whose attributes are safe to show to the user they describe, such as product view counts, and keep values like cart value or predicted revenue in a service that only your server reads.

The platform pages call this helper. It reads the public service with `getServiceAttributes()` from the [Signals browser plugin](/docs/signals/applications/public-services/index.md), for the tracker's `domain_userid`. Like the server helper, it returns an empty set of attributes if the read is slow or fails, and drops `null` values.

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
```

The plugin must be installed on your browser tracker, as shown in [Read attributes from websites and apps](/docs/signals/applications/public-services/index.md#read-the-service).

#### Serve private attributes from your server

If the browser needs an attribute that shouldn't be public, add an endpoint to your server that reads it with your API key and returns only what the browser needs. Read the user's ID from their own cookie, never from a query parameter, so a visitor can only fetch their own attributes.

<Tabs groupId="signals-language" queryString>
<TabItem value="nodejs" label="Node.js" default>

```typescript
const BROWSER_ATTRIBUTES = ['cart_value'];

app.get('/api/signals-attributes', async (req, res) => {
  const domainUserId = getDomainUserId(req.headers.cookie ?? '');
  const attributes = domainUserId
    ? await readSignals('checkout_intent', domainUserId, TIMEOUT_MS)
    : {};
  res.set('Cache-Control', 'private, no-store');
  res.json(
    Object.fromEntries(
      Object.entries(attributes).filter(([name]) => BROWSER_ATTRIBUTES.includes(name)),
    ),
  );
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
BROWSER_ATTRIBUTES = {"cart_value"}

@app.get("/api/signals-attributes")
def signals_attributes():
    domain_user_id = get_domain_user_id(request.cookies)
    attributes = read_signals("checkout_intent", domain_user_id, TIMEOUT_S) if domain_user_id else {}
    response = jsonify({k: v for k, v in attributes.items() if k in BROWSER_ATTRIBUTES})
    response.headers["Cache-Control"] = "private, no-store"
    return response
```

</TabItem>
</Tabs>

Then have `fetchSignalsAttributes` call this endpoint with `fetch`, with the same timeout, instead of or as well as reading the public service.

## Track exposures in Snowplow

Track which variant each user saw as part of your Snowplow data. You can then analyze experiment results in your warehouse alongside the rest of your behavioral data.

Define an [entity](/docs/fundamentals/entities/index.md) for exposures in [Event Studio](/docs/event-studio/data-structures/index.md). A useful exposure entity includes:

| Field | Description |
| --- | --- |
| `vendor` | The platform that assigned the variant, for example `optimizely` |
| `experiment_id` | The experiment or flag key |
| `variation_id` | The variant the user was assigned |
| `signals_attributes_used` | The names of the Signals attributes passed to the platform, not their values |

Each platform page shows how to build the exposures from the SDK's result. In the server setup, return them with the page. In the browser setup, build them in the browser, and assign the variant before you track the page view. In a mobile app, attach the entity to the screen view. Either way, attach them to the page view. The JavaScript tracker adds `domain_userid` and `domain_sessionid` to the event, so the exposure joins to the user's other events.

```javascript
window.snowplow('trackPageView', {
  context: exposures.map((data) => ({
    schema: 'iglu:com.example/experiment_exposure/jsonschema/1-0-0',
    data,
  })),
});
```

Record attribute names rather than values. The values stay in Signals, and you can join them back in the warehouse if you need them.

To assign a variant at the moment a user meets a condition rather than on the next page load, subscribe to [interventions](/docs/signals/applications/subscribe/index.md) with the browser plugin. The intervention payload includes the user's attributes, so the handler can pass them to the platform's browser SDK. The intervention subscription endpoint doesn't authenticate subscribers, so don't include personal or sensitive attributes in interventions.

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
