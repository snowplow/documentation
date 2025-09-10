---
title: "Braze"
description: "Send Snowplow events to Braze for real-time personalization and campaign automation using the Track Users API with support for user attributes, custom events, and purchases."
sidebar_position: 2
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

## Getting started

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

### Step 1: Create a connection

1. In Console, navigate to **Destinations** > **Connections**
2. Select **Set up connection**
3. Choose **Loader connection**, then **Braze**
4. Enter your API key and endpoint
5. Select **Confirm** to deploy the connection

### Step 2: Create a forwarder

1. From Console, navigate to **Destinations** \> **Destination list**. Navigate to the **Available** tab, filter for **SaaS applications**, and select **Configure** under Braze.
2. **Select a pipeline**: choose the pipeline where you want to deploy your destination.
3. **Select yoaur connection**: choose the Braze connection you configured in step 1.
4. Choose from the following **Braze object types**:
   - **[Attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: user profile data
   - **[Events](https://www.braze.com/docs/api/objects_filters/event_object)**: custom user actions
   - **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: transaction events
4. Optionally, you can choose to **Import configuration from** an existing forwarder. This is helpful when migrating a forwarder setup from development to production.
5. Click **Continue** to configure event filters and data mapping.

### Step 3: Configure event filters and field mappings

Use JavaScript expressions to define which events to forward and how to map Snowplow data to Braze fields:

1. **Event filtering**: use JavaScript expressions to select which events to forward. Only events matching your filter will be sent to Braze. Leave blank to forward all events of the selected type. For example:
  ```javascript
  // Forward page views from website
  event.app_id == "website" && event.event_name == "page_view"

  // Forward a list of custom events
  ["add_to_cart", "purchase"].includes(event.event_name)
  ```
2. **Field mapping**: configure how Snowplow data maps to Braze fields. For each mapping, **Braze Field** represents the property name and **Snowplow expression** is a JavaScript expression used to extract data from your Snowplow event. Snowplow provides default mappings based on common fields which can be overridden or deleted.
3. **Custom functions**: write JavaScript functions for complex data transformations such as converting date formats, transforming enum values, combining multiple fields, or applying business logic. Functions are then available to use in both the event filter and field mapping sections.

:::info
To learn more about the supported filter and mapping expressions, check out the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::

### Step 4: Deploy and validate

Select **Deploy** to create the forwarder. This will deploy the underlying Snowbridge instance to your cloud account and begin forwarding events based on your configuration.

You can confirm events are reaching Braze by checking the following pages in your Braze account:

1. **Braze Custom Events Report**: Braze > **Analytics** > **Custom Events Report**
<!-- TODO: add screenshot -->
2. **Braze API Usage Dashboard**: Braze > **Settings** > **API and Identifiers**
<!-- TODO: add screenshot -->

## Mapping schema

The sections below contain information on the fields you can send to Braze, including field names, data types, required fields, and default Snowplow mapping expressions.

### User attributes

The user attributes object can be used to update standard user profile fields or add your own custom attribute data to the user.

<EventForwardingSchemaTable schema={brazeAttributes} />

### Events

Each event object represents a single occurrence of a custom event by a particular user at the specific time. You can set and use custom event properties in messages, data collection, and personalization.

<EventForwardingSchemaTable schema={brazeEvents} />

### Purchases

The purchase object represents a user purchasing a single item by a user at a particular time. Each purchase object is located within a purchase array, which can represent a transaction with multiple items. The purchase object has fields that allow the Braze back-end to store and use this information for messages, data collection, and personalization.

<EventForwardingSchemaTable schema={brazePurchases} />

<!-- TODO: Add troubleshooting steps when feedback is received -->
