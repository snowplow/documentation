---
title: "Receive interventions"
sidebar_position: 50
description: "Configure and deploy interventions to trigger real-time actions based on user attribute changes in Snowplow Signals."
---

[Interventions](/docs/signals/concepts/index.md#interventions) are automated triggers that enable real-time actions based on user behavior.

Subscribe to interventions to automatically respond within your application. You have three options for receiving interventions, depending on your use case or application:
* Signals Python SDK
* Plugin for the JavaScript tracker
* [Signals API](/docs/signals/connection/index.md#signals-api)

Subscription is by attribute key ID, not by individual intervention. Start by [connecting to Signals](/docs/signals/connection/index.md).


## Using the Signals Python SDK

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

## Using the browser tracker plugin

For web applications using the Snowplow browser tracker, you can subscribe to interventions using the [Signals Interventions plugin](https://github.com/snowplow-incubator/signals-browser-plugin) <!-- TODO: Update URL to non-private repo -->.

The workflow is:
1. Create a Snowplow tracker with the plugin configured
3. Add custom handlers to react to the interventions
4. Subscribe to interventions

```typescript
import { newTracker } from '@snowplow/browser-tracker';
import {
  SignalsInterventionsPlugin,
  addInterventionHandlers,
  subscribeToInterventions,
} from '@snowplow/browser-plugin-signals-interventions';

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
    network_userid: "177234df-d421-412e-ad8d-8bf97515b2807",
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

| Argument                    | Description                                                             | Type      |
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
