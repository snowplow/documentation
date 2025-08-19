---
title: "Braze"
description: "Send Snowplow events to Braze for real-time personalization and campaign automation using the Track Users API with support for user attributes, custom events, and purchases."
sidebar_position: 1
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
```

Send Snowplow events to Braze for real-time personalization, user tracking, and campaign automation using the [Track Users API](https://www.braze.com/docs/api/endpoints/user_data/post_user_track). 

Event Forwarding supports the following Braze object types:

- **[User attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: Profile data and custom user properties
- **[Custom events](https://www.braze.com/docs/api/objects_filters/event_object)**: User actions and behaviors
- **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: Transaction data with product details

## Getting started

### Prerequisites

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

### Step 2: Create the forwarder

1. From Console, navigate to **Destinations** \> **Destination list**. Navigate to the **Available** tab, filter for **SaaS applications**, and select **Configure** under Braze.  
2. **Select your pipeline**: Choose the pipeline where you want to deploy your destination.  
3. **Select your connection**: Choose the Braze connection you configured in step 1.
4. Choose from the following Braze object types:
   - **[Attributes](https://www.braze.com/docs/api/objects_filters/user_attributes_object)**: User profile data
   - **[Events](https://www.braze.com/docs/api/objects_filters/event_object)**: Custom user actions
   - **[Purchases](https://www.braze.com/docs/api/objects_filters/purchase_object)**: Transaction events

### Step 3: Configure filtering and mapping

Use JavaScript expressions to define which events to forward and how to map Snowplow data to Braze fields:

1. **Event filtering**: use JavaScript expressions to select which events to forward. Only events matching your filter will be sent to Braze. Leave blank to forward all events of the selected type. For example:
  ```javascript
  // Forward page views from website
  event.app_id == "website" && event.event_name == "page_view"

  // Forward a list of custom events
  ["add_to_cart", "purchase"].includes(event.event_name)
  ```
2. **Field mapping**: configure how Snowplow data maps to Braze fields using the default mappings or custom expressions.
3. **Custom functions**: write JavaScript functions for complex data transformations such as converting date formats, transforming enum values, combining multiple fields, or applying business logic. Functions are then available to use in both the event filter and field mapping sections.

:::info 
To learn more about the supported filter and mapping expressions, check out the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::

### Step 4: Deploy and validate

Select **Deploy** to create the forwarder. This will deploy the underlying Snowbridge instance to your cloud account and begin forwarding events based on your configuration.

You can confirm events are reaching Braze using these methods:

1. **Braze Custom Events Report**: Braze > **Analytics** > **Custom Events Report**
<!-- TODO: add screenshot -->
2. **Braze API Usage Dashboard**: Braze > **Settings** > **API and Identifiers**
<!-- TODO: add screenshot -->

## Schema information

The sections below contain information on the Braze API schemas, including field names, data types, required fields, and default Snowplow mapping expressions.

### User attributes

export const brazeAttributes = {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"_update_existing_only":{"type":"boolean","description":"If true, update only mode is used. false recommended","consoleDefault":"false","consoleRequired":false},"user_alias":{"type":"object","properties":{"alias_name":{"type":"string","description":"The actual value of the alias identifier"},"alias_label":{"type":"string","description":"The 'label' of the alias identifier - eg domain_userid"}},"description":"Braze user Alias object","required":["alias_name","alias_label"],"additionalProperties":false,"consoleRequired":false},"external_id":{"type":"string","minLength":1,"maxLength":988,"description":"Braze identifier for externally created IDs","consoleDefault":"event?.user_id","consoleRequired":false},"braze_id":{"type":"string","description":"Identifier reserved for the Braze SDK. Not recommended.","consoleRequired":false},"country":{"type":"string","description":"ISO-3166-1 alpha-2 standard standard country code. Where the value does not meet that standard, Braze attempts to map it to a country. Where it cannot, the value will be NULL.","consoleDefault":"event?.geo_country","consoleRequired":false},"current_location":{"type":"object","properties":{"longitude":{"type":"number"},"latitude":{"type":"number"}},"consoleRequired":false},"date_of_first_session":{"type":"string","format":"date-time","description":"Must be ISO 8601 format","consoleRequired":false},"date_of_last_session":{"type":"string","format":"date-time","description":"Must be ISO 8601 format","consoleRequired":false},"dob":{"type":"string","format":"date","consoleRequired":false},"email":{"type":"string","format":"email","minLength":1,"maxLength":75,"description":"Email address","consoleRequired":false},"email_subscribe":{"type":"string","enum":["opted_in","unsubscribed","subscribed"],"consoleRequired":false},"email_open_tracking_disabled":{"type":"boolean","consoleRequired":false},"email_click_tracking_disabled":{"type":"boolean","consoleRequired":false},"first_name":{"type":"string","minLength":1,"description":"User's first name","consoleRequired":false},"gender":{"type":"string","enum":["M","F","O","N","P",null],"consoleRequired":false},"home_city":{"type":"string","minLength":1,"consoleRequired":false},"language":{"type":"string","description":"ISO-639-1 standard language","consoleDefault":"event?.br_lang","consoleRequired":false},"last_name":{"type":"string","minLength":1,"description":"User's first name","consoleRequired":false},"marked_email_as_spam_at":{"type":"string","format":"date-time","description":"Must be ISO 8601 format","consoleRequired":false},"phone":{"type":"string","consoleRequired":false},"push_subscribe":{"type":"string","enum":["opted_in","unsubscribed","subscribed"],"consoleRequired":false},"push_tokens":{"type":"array","items":{"type":"object","properties":{"app_id":{"type":"string"},"token":{"type":"string"},"device_id":{"type":"string"}}},"consoleRequired":false},"time_zone":{"type":"string","description":"Time zone name from  IANA Time Zone Database","consoleDefault":"event?.geo_timezone","consoleRequired":false}},"anyOf":[{"oneOf":[{"required":["external_id"]},{"required":["user_alias"]},{"required":["braze_id"]}]},{"required":["phone"]},{"required":["email"]}],"additionalProperties":true};

<EventForwardingSchemaTable schema={brazeAttributes} />

### Events

export const brazeEvents = {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"external_id":{"type":"string","minLength":1,"maxLength":988,"description":"Braze identifier for externally created IDs","consoleDefault":"event?.user_id","consoleRequired":false},"braze_id":{"type":"string","description":"Identifier reserved for the Braze SDK. Not recommended.","consoleRequired":false},"phone":{"type":"string","consoleRequired":false},"user_alias":{"type":"object","properties":{"alias_name":{"type":"string","description":"The actual value of the alias identifier"},"alias_label":{"type":"string","description":"The 'label' of the alias identifier - eg domain_userid"}},"description":"Braze user Alias object","required":["alias_name","alias_label"],"additionalProperties":false,"consoleRequired":false},"_update_existing_only":{"type":"boolean","description":"If true, update only mode is used. false recommended","consoleDefault":"false","consoleRequired":false},"time":{"type":"string","format":"date-time","description":"Time of the event, required. Must be ISO 8601 format","consoleDefault":"spTstampToJSDate(event?.collector_tstamp)?.toISOString()","consoleRequired":true},"name":{"type":"string","minLength":1,"description":"Event name, required","consoleDefault":"event?.event_name","consoleRequired":true},"email":{"type":"string","format":"email","minLength":1,"maxLength":75,"description":"Email address","consoleRequired":false},"app_id":{"type":"string","format":"uuid","description":"Keyword in Braze. if set, should match a Braze App Identifier, found in Braze console's API section. Can be omitted, but incorrect values may result in data loss in Braze.","consoleRequired":false},"properties":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs assigned to the event in Braze","consoleRequired":false}},"anyOf":[{"oneOf":[{"required":["external_id"]},{"required":["user_alias"]},{"required":["braze_id"]}]},{"required":["phone"]},{"required":["email"]}],"required":["name","time"],"additionalProperties":false};

<EventForwardingSchemaTable schema={brazeEvents} />

### Purchases

<EventForwardingSchemaTable schema={{"$schema":"http://json-schema.org/draft-07/schema#","type":"array","items":{"type":"object","properties":{"external_id":{"type":"string","minLength":1,"maxLength":988,"description":"Braze identifier for externally created IDs"},"user_alias":{"type":"object","properties":{"alias_name":{"type":"string","description":"The actual value of the alias identifier"},"alias_label":{"type":"string","description":"The 'label' of the alias identifier - eg domain_userid"}},"description":"Braze user Alias object","required":["alias_name","alias_label"],"additionalProperties":false},"_update_existing_only":{"type":"boolean","description":"If true, update only mode is used. false recommended"},"time":{"type":"string","format":"date-time","description":"Time of the purchase, required. Must be ISO 8601 format"},"product_id":{"type":"string","minLength":1,"description":"Product ID, required"},"currency":{"type":"string","pattern":"^[A-Z]+$","minLength":3,"maxLength":3,"description":"ISO 4217 Alphabetic Currency Code, required"},"price":{"type":"number","description":"Price per item, required"},"quantity":{"type":"integer","minimum":1,"maximum":100,"description":"Quantity of the item purchased, optional. Braze treats this as multiple individual purchases"},"email":{"type":"string","format":"email","minLength":1,"maxLength":75,"description":"Email address"},"app_id":{"type":"string","format":"uuid","description":"Keyword in Braze. if set, should match a Braze App Identifier, found in Braze console's API section. Can be omitted, but incorrect values may result in data loss in Braze."},"properties":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs assigned to the purchase in Braze"}},"anyOf":[{"oneOf":[{"required":["external_id"]},{"required":["user_alias"]},{"required":["braze_id"]}]},{"required":["phone"]},{"required":["email"]}],"required":["product_id","time","currency","price"],"additionalProperties":false},"consoleDefault":"customPurchasesFunction(event)"}} />

<!-- TODO: Add troubleshooting steps when feedback is received -->