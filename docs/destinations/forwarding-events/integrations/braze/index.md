---
title: "Forward events to Braze"
sidebar_label: "Braze"
sidebar_position: 2
description: "Send Snowplow events to Braze for real-time personalization and campaign automation using the Track Users API with support for user attributes, custom events, and purchases."
keywords: ["Braze", "personalization", "campaign automation", "Track Users API", "marketing automation", "event forwarding"]
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import brazeAttributes from '@site/src/components/EventForwardingSchemaTable/Schemas/brazeAttributes.json';
import brazeEvents from '@site/src/components/EventForwardingSchemaTable/Schemas/brazeEvents.json';
import brazePurchases from '@site/src/components/EventForwardingSchemaTable/Schemas/brazePurchases.json';
```

Send Snowplow events to Braze for real-time personalization, user tracking, and campaign automation using Braze's [Track Users API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track).

Snowplow supports the following Braze object types:

- **[User attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: Profile data and custom user properties
- **[Custom events](https://www.braze.com/docs/api/objects_filters/event_object)**: User actions and behaviors
- **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: Transaction data with product details

## Prerequisites

Before setting up the forwarder in Console, you'll need the following from your Braze account:

- Braze REST API key with these permissions:
  - `users.track`
  - `users.alias.new`
  - `users.identify`
  - `users.export.ids`
  - `users.merge`
  - `users.external_ids.rename`
  - `users.alias.update`
- Braze REST API endpoint, found in Braze under **Settings** > **APIs and Identifiers**

## Getting started

### Configure the destination

To create the forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **Braze** for the connection type and enter your API key and endpoint.

When configuring the forwarder, you can choose from the following **Braze object types** to map:
   - **[Attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: update user profile data
   - **[Events](https://www.braze.com/docs/api/objects_filters/event_object)**: send custom user actions
   - **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: send transaction events

### Validate the integration

You can confirm events are reaching Braze by checking the following pages in your Braze account:

1. Query Builder: in Braze, navigate to **Analytics** > **Query Builder**. You can write queries on the following tables to preview the data forwarded from Snowplow: `USER_BEHAVIORS_CUSTOMEVENT_SHARED`, `USERS_BEHAVIORS_PURCHASE_SHARED`.
2. API Usage Dashboard: in Braze, navigate to **Settings** > **API and Identifiers** to see a chart of API usage over time. You can filter specifically for the API key used by Snowplow and see both successes and failures.

## Sending custom properties

You can send custom properties beyond the standard fields defined in the schema reference below. The structure depends on which Braze object type you're using:

- **User attributes**: add as top-level fields (e.g., `subscription_tier`, `loyalty_points`)
- **Event properties**: nest under `properties` object (e.g., `properties.plan_type`, `properties.feature_flag`)
- **Purchase properties**: nest under `properties` object (e.g., `properties.color`, `properties.size`)

For property names containing spaces, use bracket notation (e.g., `["account type"]` or `properties["campaign source"]`).

See Braze's [Event Object documentation](https://www.braze.com/docs/api/objects_filters/event_object) for details on supported data types, property naming requirements, and payload size limits. See [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) for details on configuring field mappings.

## Limitations

**Rate limits:** Braze enforces a rate limit of 3,000 API calls every three seconds for the Track Users API. Because Snowplow does not currently support batching for event forwarders, this API rate limit also functions as the event rate limit. If your input throughput exceeds 3,000 events per three seconds, you will experience increased latency.

## Schema reference

The sections below contain information on the fields you can send to Braze, including field names, data types, required fields, and default Snowplow mapping expressions.

### User attributes

Use the user attributes object to update standard user profile fields or add your own custom attribute data to the user.

<EventForwardingSchemaTable schema={brazeAttributes} />

### Events

Each event object represents a single occurrence of a custom event by a particular user at the specific time. You can set and use custom event properties in messages, data collection, and personalization.

<EventForwardingSchemaTable schema={brazeEvents} />

### Purchases

The purchase object represents a user purchasing a single item by a user at a particular time. Each purchase object is located within a purchase array, which can represent a transaction with multiple items. The purchase object has fields that allow the Braze back-end to store and use this information for messages, data collection, and personalization.

<EventForwardingSchemaTable schema={brazePurchases} />
