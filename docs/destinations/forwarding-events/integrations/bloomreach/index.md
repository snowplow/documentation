---
title: "Forward events to Bloomreach"
sidebar_label: "Bloomreach"
sidebar_position: 2
description: "Send Snowplow events to Bloomreach Engagement for real-time customer analytics and personalization using the Batch Commands API."
keywords: ["Bloomreach", "Bloomreach Engagement", "event forwarding", "customer data platform", "personalization"]
date: "2026-05-05"
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import bloomreachSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/bloomreach.json';
```

Send Snowplow events to Bloomreach Engagement for real-time customer analytics, segmentation, and personalization using the [Batch Commands API](https://documentation.bloomreach.com/engagement/reference/batch-commands-2).

## Prerequisites

Before setting up the forwarder in Console, you'll need the following from your Bloomreach Engagement account:

- **API Endpoint Host**: the base URL for your Bloomreach API instance (e.g., `api-engagement.bloomreach.com`)
- **Project Token**: a unique identifier for your Bloomreach project
- **API Key ID**: the identifier for your API key
- **API Secret**: the secret associated with your API key. Save the secret in a secure location, as you can only view it once after creation.

You can find all of these values in Bloomreach under **Project settings** > **Access management** > **API**.

:::tip[Test in a non-production project first]
To avoid introducing test data in your production Bloomreach project, we recommend using a test or development project to test your transformations first. Then, create a new connection in Console with your production credentials, and a new forwarder that imports the configuration from your development forwarder.
:::

## Getting started

### Configure the destination

To create the connection and forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **Bloomreach** for the connection type and enter your API endpoint host, project token, API key ID, and API secret.

### Validate the integration

You can confirm events are reaching Bloomreach by checking the customer profiles in your Bloomreach Engagement project:

1. In Bloomreach, navigate to **Data & Assets** > **Customers**
2. Search for a customer whose events you have forwarded
3. Open the customer profile and check the **Events** tab to verify that your Snowplow events appear

## Identity management

Bloomreach uses a combination of hard and soft customer IDs to identify and merge customer profiles. The Snowplow integration defaults to using `user_id` as the hard ID (`registered`) and `domain_userid` as the soft ID (`cookie`).

When a user is anonymous, Bloomreach tracks their activity using the soft ID. When the user logs in and your event contains a `user_id` value, Bloomreach merges the anonymous profile with the identified profile, linking prior anonymous activity to the known customer.

The ID type names (`registered`, `cookie`) must match the customer ID types configured in your Bloomreach project. You can customize these mappings in the forwarder configuration if your project uses different ID type names.

## Sending custom properties

You can send custom event properties beyond the standard fields defined in the schema reference below. Custom properties are nested under the `properties` object. When configuring your forwarder, add field mappings formatted as `properties.your_custom_field` (e.g., `properties.plan_type`, `properties.feature_flag`).

For property names containing spaces, use bracket notation (e.g., `properties["referred by"]`).

See Bloomreach's [Batch Commands API documentation](https://documentation.bloomreach.com/engagement/reference/batch-commands-2) for details on supported data types and property requirements. See [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) for details on configuring field mappings.

## Schema reference

This section contains information on the fields you can send to Bloomreach, including field names, data types, required fields, and default Snowplow mapping expressions.

<EventForwardingSchemaTable schema={bloomreachSchema}/>
