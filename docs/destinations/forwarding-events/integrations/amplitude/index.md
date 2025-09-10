---
title: "Amplitude"
description: "Send Snowplow events to Amplitude for product analytics and behavioral insights using the HTTP API v2 with support for event tracking and user properties."
sidebar_position: 1
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
```

Send Snowplow events to Amplitude to power product and marketing analytics or guide and survey personalization using Amplitude's [HTTP API v2](https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/).

## Getting started

Before setting up the forwarder in BDP Console, you'll need an Amplitude API Key. To find your API key:

1. Log in to your Amplitude workspace
2. Click **Settings** in the top right, then click **Organization Settings**
3. From the sidebar, select **Projects**, then select your Project to view its details
4. Copy the **API Key**

:::tip Test in a non-production project first
To avoid introducing bad data in your production Amplitude project, we recommend using a test or development Amplitude project to test your transformations first. Then, create a new Connection in Console with your production API key, and a new forwarder that imports the configuration from your development forwarder.
:::

### Step 1: Create a connection

1. In Console, navigate to **Destinations** > **Connections**
2. Select **Set up connection**
3. Choose **Loader connection**, then **Amplitude**
4. Enter your API key and select the **Server Location** where your Amplitude project is hosted
5. Select **Confirm** to deploy the connection

### Step 2: Create a forwarder

1. From Console, navigate to **Destinations** > **Destination list**. Navigate to the **Available** tab, filter for **SaaS applications**, and select **Configure** under Braze.
2. **Select a pipeline**: choose the pipeline where you want to deploy your destination.
3. **Select a connection**: choose the Amplitude connection you configured in step 1.
4. Optionally, you can choose to **Import configuration from** an existing forwarder. This is helpful when migrating a forwarder setup from development to production.
5. Click **Continue** to configure event filters and data mapping.

### Step 3: Configure event filters and field mappings

Use JavaScript expressions to define which events to forward and how to map Snowplow data to Amplitude fields:

1. **Event filtering**: use JavaScript expressions to select which events to forward. Only events matching your filter will be sent to Amplitude. Leave blank to forward all events of the selected type. For example:
  ```javascript
  // Forward page views from website
  event.app_id == "website" && event.event_name == "page_view"

  // Forward a list of custom events
  ["add_to_cart", "purchase"].includes(event.event_name)
  ```
2. **Field mapping**: configure how Snowplow data maps to Amplitude fields. For each mapping, **Amplitude Field** represents the property name and **Snowplow Expression** is a Javascript expression used to extract data from your Snowplow event. Snowplow provides default mappings based on common fields which can be overridden or deleted.
<!-- TODO: add screenshot -->
3. **Custom functions**: you can also write JavaScript functions for complex data transformations such as converting date formats, transforming enum values, combining multiple fields, or applying business logic. Functions can then be referenced in both the event filter and field mapping sections.

:::info
To learn more about the supported filter and mapping expressions, check out the [filter and mapping reference](/docs/destinations/forwarding-events/reference/index.md).
:::

### Step 4: Deploy and validate

Select **Deploy** to create the forwarder. This will deploy the underlying Snowbridge instance to your cloud account and begin forwarding events based on your configuration.

You can confirm events are reaching Amplitude by checking the **Ingestion Debugger** page in your Amplitude account:

1. From the left navigation bar, click **Data**, then select **Sources** from the sidebar. The list of sources is shown.
2. Select the **Ingestion Debugger** tab
3. Filter the graphs to show only events from the **HTTP API** to confirm data is flowing as expected from Snowplow.

## Mapping schema

This section contains information on the fields you can send to Amplitude, including field names, data types, required fields, and default Snowplow mapping expressions.

export const amplitudeSchema = {"$schema":"http://json-schema.org/draft-07/schema#","type":"object","properties":{"user_id":{"$ref":"#/$defs/id","description":"ID for the user","consoleDefault":"event?.user_id"},"device_id":{"$ref":"#/$defs/id","description":"A device-specific identifier, such as the Identifier for Vendor on iOS","consoleDefault":"event?.domain_userid ??  event?.contexts_com_snowplowanalytics_snowplow_client_session_1?.[0]?.userId"},"event_type":{"type":"string","minLength":1,"maxLength":1024,"description":"A unique identifier for your event","consoleDefault":"event?.event_name"},"event_id":{"type":"integer","description":"An incrementing counter to distinguish events with the same user_id and timestamp from each other"},"session_id":{"type":"integer","description":"The start time of the session in milliseconds since epoch, necessary if you want to associate events with a particular system","consoleDefault":"spTstampToEpochMillis(event?.contexts_com_snowplowanalytics_snowplow_client_session_1?.[0]?.firstEventTimestamp)"},"insert_id":{"type":"string","minLength":1,"maxLength":1024,"description":"A unique identifier for the event. Amplitude deduplicates subsequent events sent with the same device_id and insert_id within the past 7 days","consoleDefault":"event?.event_id"},"time":{"type":"integer","description":"The timestamp of the event in milliseconds since epoch","consoleDefault":"spTstampToEpochMillis(event?.derived_tstamp)"},"event_properties":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs assigned to the event"},"user_properties":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs assigned to the user"},"groups":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs representing groups of users"},"group_properties":{"type":"object","additionalProperties":true,"description":"Arbitrary key-value pairs assigned to the groups listed in the 'groups'"},"$skip_user_properties_sync":{"type":"boolean","description":"When true user properties aren't synced. Defaults to false","consoleDefault":"false"},"app_version":{"type":"string","minLength":1,"maxLength":1024,"description":"The current version of your application","consoleDefault":"event?.contexts_com_snowplowanalytics_mobile_application_1?.[0]?.version"},"platform":{"type":"string","minLength":1,"maxLength":1024,"description":"Platform of the device","consoleDefault":"event?.platform"},"os_name":{"type":"string","minLength":1,"maxLength":1024,"description":"The name of the mobile operating system or browser that the user is using","consoleDefault":"event?.os_name"},"os_version":{"type":"string","minLength":1,"maxLength":1024,"description":"The version of the mobile operating system or browser the user is using","consoleDefault":"event?.contexts_nl_basjes_yauaa_context_1?.[0]?.operatingSystemVersion"},"device_brand":{"type":"string","minLength":1,"maxLength":1024,"description":"The device brand that the user is using","consoleDefault":"event?.contexts_nl_basjes_yauaa_context_1?.[0]?.deviceBrand"},"device_manufacturer":{"type":"string","minLength":1,"maxLength":1024,"description":"The device manufacturer that the user is using"},"device_model":{"type":"string","minLength":1,"maxLength":1024,"description":"The device model that the user is using","consoleDefault":"event?.contexts_nl_basjes_yauaa_context_1?.[0]?.deviceName"},"carrier":{"type":"string","minLength":1,"maxLength":1024,"description":"The carrier that the user is using","consoleDefault":"event?.contexts_nl_basjes_yauaa_context_1?.[0]?.carrier"},"country":{"type":"string","minLength":1,"maxLength":1024,"description":"The current country of the user","consoleDefault":"event?.geo_country"},"region":{"type":"string","minLength":1,"maxLength":1024,"description":"The current region of the user","consoleDefault":"event?.geo_region"},"city":{"type":"string","minLength":1,"maxLength":1024,"description":"The current city of the user","consoleDefault":"event?.geo_city"},"dma":{"type":"string","minLength":1,"maxLength":1024,"description":"The current Designated Market Area of the user"},"language":{"type":"string","minLength":1,"maxLength":1024,"description":"The language set by the user","consoleDefault":"event?.br_lang"},"price":{"type":"number","description":"The price of the item purchased. Required for revenue data if the revenue field isn't sent. You can use negative values for refunds"},"quantity":{"type":"integer","description":"The quantity of the item purchased"},"revenue":{"type":"number","description":"Revenue = (price x quantity). If you send all 3 fields of price, quantity, and revenue, then the revenue value is (price x quantity). Use negative values for refunds."},"productId":{"type":"string","minLength":1,"maxLength":1024,"description":"An identifier for the item purchased. You must send a price and quantity or revenue with this field"},"revenueType":{"type":"string","minLength":1,"maxLength":1024,"description":"The type of revenue for the item purchased. You must send a price and quantity or revenue with this field"},"location_lat":{"type":"number","description":"The current Latitude of the user","consoleDefault":"event?.geo_latitude"},"location_lng":{"type":"number","description":"The current Longitude of the user","consoleDefault":"event?.geo_longitude"},"ip":{"type":"string","oneOf":[{"format":"ipv4"},{"format":"ipv6"}],"description":"The IP address of the user","consoleDefault":"event?.user_ipaddress"},"idfa":{"type":"string","minLength":1,"maxLength":1024,"description":"(iOS) Identifier for Advertiser","consoleDefault":"event?.contexts_com_snowplowanalytics_snowplow_mobile_context_1?.[0]?.appleIdfa"},"idfv":{"type":"string","minLength":1,"maxLength":1024,"description":"(iOS) Identifier for Vendor","consoleDefault":"event?.contexts_com_snowplowanalytics_snowplow_mobile_context_1?.[0]?.appleIdfv"},"adid":{"type":"string","minLength":1,"maxLength":1024,"description":"(Android) Google Play Services advertising ID","consoleDefault":"event?.contexts_com_snowplowanalytics_snowplow_mobile_context_1?.[0]?.androidIdf"},"android_id":{"type":"string","minLength":1,"maxLength":1024,"description":"(Android) Android ID (not the advertising ID)"},"plan":{"type":"object","properties":{"branch":{"type":"string","minLength":1,"maxLength":1024,"description":"The tracking plan branch name"},"source":{"type":"string","minLength":1,"maxLength":1024,"description":"The tracking plan source"},"version":{"type":"string","minLength":1,"maxLength":1024,"description":"The tracking plan version"}},"additionalProperties":false,"description":"Tracking plan properties"}},"anyOf":[{"required":["user_id"]},{"required":["device_id"]}],"required":["event_type"],"additionalProperties":false,"$defs":{"id":{"type":"string","minLength":5,"maxLength":1024,"not":{"enum":["anonymous","undefined","unknown","00000000-0000-0000-0000-000000000000"]}}}}

<EventForwardingSchemaTable schema={amplitudeSchema}/>
