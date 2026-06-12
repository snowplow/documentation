---
title: "Subscribe to and receive interventions in your applications"
sidebar_position: 30
sidebar_label: "Subscribe to interventions"
description: "Subscribe to interventions by attribute key ID to automatically respond to user behavior changes. Use the Python SDK, browser tracker plugin, or Signals API to receive intervention payloads."
keywords: ["subscribe interventions", "intervention subscription", "browser plugin", "intervention payload"]
---

Subscribe to interventions to automatically respond within your application. You have three options for receiving interventions, depending on your use case or application:
* [Signals Python SDK](https://pypi.org/project/snowplow-signals/)
* Plugin for the [browser tracker](/docs/sources/web-trackers/index.md)
* [Signals API](/docs/signals/connection/index.md#signals-api)

Subscription is by attribute key ID, not by individual intervention. Start by [connecting to Signals](/docs/signals/connection/index.md).

:::note[Sent once]
An intervention is sent only the first time the criteria are met. The [delivery example](#delivery-example) below shows how this works.
:::

The subscription endpoint (`api/v1/interventions`) is public: it doesn't perform authentication or authorization, just checks the requested attribute keys. Knowing an attribute key ID grants access to its interventions. This is why ID values must be non-enumerable, such as canonically formatted UUIDs, so that they can't be guessed.

## Subscribe with the Python SDK

Subscribe by providing IDs for the attribute keys you're interested in receiving interventions for. The IDs must be in a non-enumerable format, such as UUIDs.

```python
from snowplow_signals import AttributeKeyIdentifiers, InterventionInstance

# Attribute keys to subscribe to
targets = AttributeKeyIdentifiers({
  "domain_sessionid": ["8c9104e3-c300-4b20-82f2-93b7fa0b8feb"],
  "domain_userid": ["218e8926-3858-431d-b2ed-66da03a1cbe5"],
})

# Define the subscription
subscription = sp_signals.pull_interventions(targets)

# Add a custom handler to be called with each intervention received
subscription.add_handler(print)

# Open the subscription request and begin fetching interventions as they are published
subscription.start()

# Block until an intervention is received
# Because of the `print` handler above, the intervention will be printed out
intervention_instance = subscription.get()

# Cancel the subscription and abort the connection/background thread
subscription.stop()
```

## Subscribe with the browser tracker plugin

For web applications using the Snowplow [browser tracker](/docs/sources/web-trackers/index.md), you can subscribe to interventions using the [Signals browser plugin](https://www.npmjs.com/package/@snowplow/signals-browser-plugin).

The workflow is:
1. Create a Snowplow tracker with the plugin configured
2. Add custom handlers to react to the interventions
3. Subscribe to interventions

```typescript
import { newTracker } from '@snowplow/browser-tracker';
import {
  SignalsInterventionsPlugin,
  addInterventionHandlers,
  subscribeToInterventions,
} from '@snowplow/signals-browser-plugin';

// Install the Signals Intervention plugin
newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [ SignalsInterventionsPlugin() ],
});

// Add custom handlers
addInterventionHandlers({
  myHandler(intervention) {
    console.log("intervention received!", intervention);
  },
});

// Subscribe to interventions using your Signals API endpoint
subscribeToInterventions({
  endpoint: "000000000000.signals.snowplowanalytics.com",
});
```

By default, the plugin will automatically subscribe to interventions for the `domain_userid` and `domain_sessionid` attribute keys.

You can optionally configure the plugin for additional attribute keys. There are two options:
* `attributeKeyTargets`: dynamically subscribe to attribute key IDs extracted from the tracker's generated events
* `attributeKeyIds`: subscribe to a specific attribute key ID

This example assumes you've defined a `pageview_id` attribute key, based on the `web_page` entity added by default to all web events.

```typescript
subscribeToInterventions({
  endpoint: "000000000000.signals.snowplowanalytics.com", // Signals API endpoint
  attributeKeyTargets: {
    pageview_id: "/co/com.snowplowanalytics.snowplow/web_page/id",
  },
  attributeKeyIds: {
    network_userid: "177234df-d421-412e-ad8d-8bf97515b280",
  },
});
```

The plugin will automatically disconnect/reconnect whenever the attribute key IDs change. The browser will close the connection on navigation away from the page.

### Intervention events

The plugin generates Snowplow events to track interventions. The events include the intervention payload as a custom entity.

- [`iglu:com.snowplowanalytics.signals/intervention_receive/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.signals/intervention_receive/jsonschema/1-0-0): tracked when the plugin receives an intervention
- [`iglu:com.snowplowanalytics.signals/intervention_handle/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.signals/intervention_handle/jsonschema/1-0-0): tracked when a custom handler is passed the intervention payload and reports successful handling (does not return an error)
- [`iglu:com.snowplowanalytics.signals/intervention_handle_error/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.signals/intervention_handle_error/jsonschema/1-0-0): tracked when a custom handler is passed the intervention payload and reports failure (throws an error)

## Payload

When delivered, interventions contain the following information:

| Field                       | Description                                                             | Type      |
| --------------------------- | ----------------------------------------------------------------------- | --------- |
| `intervention_id`           | A unique identifier for this triggered intervention                     | `string`  |
| `name`                      | The unique name/identifier of the intervention                          | `string`  |
| `version`                   | The intervention version                                                | `integer` |
| `attributes`                | An object containing the target's attributes on intervention triggering | `object`  |
| `target_attribute_key`      | An object containing the target attribute key information               | `object`  |
| `target_attribute_key.name` | The name of the target attribute key                                    | `string`  |
| `target_attribute_key.id`   | The value of the target attribute key                                   | `string`  |

Here's an example intervention payload:

```json
{
  "intervention_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "high_value_cart_abandonment",
  "version": 2,
  "attributes": {
    "cart_value": 250.00,
    "items_in_cart": 3,
    "time_on_checkout_page": 120,
    "previous_purchases": 8,
    "last_activity_timestamp": "2025-09-23T14:30:15Z"
  },
  "target_attribute_key": {
    "name": "domain_userid",
    "id": "218e8926-3858-431d-b2ed-66da03a1cbe5"
  }
}
```

## Delivery example

This example shows how targeting, subscription, and the send-once rule work together. Consider these two interventions:
* `intervention1` targets the `domain_userid` and `domain_sessionid` attribute keys
  * It has two criteria rules, where `any` must be met
  * The first rule is: `attribute_group1:page_view_count == 10`
  * The second rule is: `attribute_group2:ad_count is not null`
* `intervention2` targets the `domain_userid` attribute key
  * It has one criteria rule, `attribute_group3:button_click_count > 20`

To receive interventions for the current user and session, subscribe to their interventions by providing the `domain_userid` and `domain_sessionid` ID values.

Interventions will be triggered when:
* The user views 10 pages, **or** the session has an ad event
  * `intervention1` will be delivered to one of the subscribed targets.
  * Signals will initially create a payload for each target. However, they'll have the same ID as they're triggered by a single event, and will be deduped.
* The user exceeds 20 button clicks for the first time
  * `intervention2` will be delivered to the subscribed user.

Assuming it's the user's first session, the flow looks like this:
* First page view
* First ad event
  * `intervention1` is triggered and delivered to one of the targets
* More page views, button clicks, and ad events
* Tenth page view
  * Nothing happens: because `intervention1` sent already on seeing the ad event in this session, it's not triggered again
* Twenty-first button click
  * The attribute value changes from 20 to 21, crossing the required threshold
  * `intervention2` is triggered and delivered to the user target
* Twenty-second button click
  * Nothing happens: the threshold has already passed

This user has already seen more than 10 pages, so `intervention1` can never be triggered by that rule for them. However, if their current session expires, and the application subscribes to their new `domain_sessionid` ID, `intervention1` can be triggered again by the first ad event of the session.

Likewise, the user has already clicked a button more than 20 times, so `intervention2` will never be sent to them again.
