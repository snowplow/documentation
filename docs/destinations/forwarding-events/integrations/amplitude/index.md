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

## What you will need

Before setting up the forwarder in Console, you'll need an Amplitude API Key. To find your API key:

1. Log in to your Amplitude workspace
2. Click **Settings** in the top right, then click **Organization Settings**
3. From the sidebar, select **Projects**, then select your Project to view its details
4. Copy the **API Key**

:::tip Test in a non-production project first
To avoid introducing bad data in your production Amplitude project, we recommend using a test or development Amplitude project to test your transformations first. Then, create a new Connection in Console with your production API key, and a new forwarder that imports the configuration from your development forwarder.
:::

## Getting started

### Configure the forwarder

To create the connection and forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **Amplitude** for the connection type, enter your API key, and select the **Server Location** where your Amplitude project is hosted.

### Validate data flow

You can confirm events are reaching Amplitude by checking the **Ingestion Debugger** page in your Amplitude account:

1. From the left navigation bar, click **Data**, then select **Sources** from the sidebar. You will see a list of sources.
2. Select the **Ingestion Debugger** tab
3. Filter the graphs to show only events from the **HTTP API** to confirm data is flowing as expected from Snowplow.

## Schema reference

This section contains information on the fields you can send to Amplitude, including field names, data types, required fields, and default Snowplow mapping expressions.

<EventForwardingSchemaTable schema={amplitudeSchema}/>
