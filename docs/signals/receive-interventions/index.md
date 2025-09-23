---
title: "Receive interventions"
sidebar_position: 50
description: "Configure and deploy interventions to trigger real-time actions based on user attribute changes in Snowplow Signals."
---

[Interventions](/docs/signals/concepts/index.md#interventions) are automated triggers that enable real-time actions based on user behavior.

Subscribe to intervention changes to automatically respond within your application. You have three options for receiving interventions, depending on your use case or application:
* Plugin for the JavaScript tracker
* Signals Python SDK
* Signals API

Subscription is by attribute key ID, not by individual intervention. Start by [connecting to Signals](/docs/signals/connection/index.md).


## Using the Signals Python SDK

Subscribe by providing IDs for the attribute keys you're interested in receiving interventions for. The IDs must be UUIDs.

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

This code would receive interventions when:
* Attribute value changes related to session `8c9104e3-c300-4b20-82f2-93b7fa0b8feb` trigger an intervention
* Attribute value changes related to user `218e8926-3858-431d-b2ed-66da03a1cbe5` trigger an intervention

## Using the browser tracker plugin

You can deploy the [Signals Interventions plugin](https://github.com/snowplow-incubator/signals-browser-plugin) <!-- TODO: Update URL to non-private repo --> on your website with the [Snowplow web trackers](/docs/sources/trackers/web-trackers/index.md) to allow individual visitors to subscribe to interventions relevant to them.

In the below example we:

1. use the Browser Tracker to create a Snowplow tracker
2. install the plugin
3. add custom handlers to react to the interventions
4. subscribe to interventions

```typescript
import { newTracker } from '@snowplow/browser-tracker';
import {
  SignalsInterventionsPlugin,
  addInterventionHandlers,
  subscribeToInterventions,
} from '@snowplow/browser-plugin-signals-interventions';

newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [ SignalsInterventionsPlugin() ], // install the Signals Intervention plugin
});

addInterventionHandlers({
  myHandler(intervention) {
    console.log("intervention received!", intervention); // add custom handlers
  },
});

subscribeToInterventions({
  endpoint: "000000000000.signals.snowplowanalytics.com", // subscribe to interventions
});
```

By default the plugin will automatically subscribe to interventions for the `domain_userid` and `domain_sessionid` attribute keys.
Any rule-based interventions triggered by attributes that target those attribute keys will be published as they get processed by the stream engine.

You can optionally configure the plugin to listen for additional attribute keys as well.
In the below example, we configure a specific attribute key and instructions for how to extract further attribute keys from Snowplow events that the tracker generates.
Interventions will be requested targeting the following attribute keys:

- `domain_userid`: (unique visitor ID value)
- `domain_sessionid`: (unique session ID value)
- `pageview_id`: (unique page view ID value)
- `app`: (configured tracker app ID value)
- `myCustomAttributeKey`: `unique value`

(The `mistake` attribute key will not be subscribed to because the plugin can not find an ID value to use since that isn't a valid event field)

```typescript
subscribeToInterventions({
  endpoint: "000000000000.signals.snowplowanalytics.com", // Signals API endpoint
  attributeKeyTargets: {
    pageview_id: "context/com.snowplowanalytics.snowplow/web_page/id",
    app: "app_id",
    mistake: "not_a_real_field",
  },
  attributeKeyIds: {
    myCustomAttributeKey: "unique value",
  },
});
```

If you track multiple pageviews and the `pageview_id` attribute key value changes, the plugin will automatically disconnect and resubscribe to the new attribute key value as value changes are observed.

If an intervention is published to any of these attribute keys while the subscription is open, the `myHandler` function above will be called with the intervention payload.

### Intervention tracking

When the plugin receives interventions and dispatches them to handler functions, it will generate Snowplow tracking events.
The following self-describing events are generated, and include the intervention payload as a custom entity:

<!-- TODO: link to iglu central once published -->
- `iglu:com.snowplowanalytics.signals/intervention_receive/jsonschema/1-0-0`: Fires when an intervention is received by the plugin
- `iglu:com.snowplowanalytics.signals/intervention_handle/jsonschema/1-0-0`: Fires when a custom handler is passed the intervention payload and reports successful handling (does not return an error)
- `iglu:com.snowplowanalytics.signals/intervention_handle_error/jsonschema/1-0-0`: Fires when a custom handler is passed the intervention payload and reports failure (throws an error)


## Intervention payload

When delivered, interventions contain the following information:

| Argument                    | Description                                                                                    | Type      | Required? |
| --------------------------- | ---------------------------------------------------------------------------------------------- | --------- | --------- |
| `intervention_id`           | A unique identifier for this triggered intervention                                            | `string`  | ✅         |
| `name`                      | The unique name/identifier of the intervention                                                 | `string`  | ✅         |
| `version`                   | A numeric version for this intervention's definition (if applicable)                           | `integer` | ✅         |
| `attributes`                | An object containing the target attribute key's attributes when the intervention was triggered | `object`  | ✅         |
| `target_attribute_key`      | An object containing the attribute key information used to target this intervention            | `object`  | ✅         |
| `target_attribute_key.name` | The name of the attribute key used to target this intervention                                 | `string`  | ✅         |
| `target_attribute_key.id`   | The attribute key value used to target this intervention                                       | `string`  | ✅         |
