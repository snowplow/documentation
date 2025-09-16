---
title: "Amplitude"
description: "Send Snowplow events to Amplitude for product analytics and behavioral insights using the HTTP API v2 with support for event tracking and user properties."
sidebar_position: 1
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import amplitudeSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/amplitude.json';
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

## Schema reference

This section contains information on the fields you can send to Amplitude, including field names, data types, required fields, and default Snowplow mapping expressions.

<EventForwardingSchemaTable schema={amplitudeSchema}/>
