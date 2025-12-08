---
title: "Mixpanel"
description: "Send Snowplow events to Mixpanel for product analytics and user behavior insights using the Import API with support for event tracking and custom properties."
sidebar_position: 3
keywords: ["mixpanel", "event forwarding", "product analytics", "user tracking"]
date: "2025-11-24"
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import mixpanelSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/mixpanel.json';
```

Send Snowplow events to Mixpanel to power product analytics, user behavior tracking, and funnel analysis using Mixpanel's [Import API](https://developer.mixpanel.com/reference/import-events).

## Prerequisites

Before setting up the forwarder in Console, you'll need the following from your Mixpanel account:

- **Project ID**: found in Mixpanel under **Settings** > **Project Settings**
- **Service Account Username**: create a service account in Mixpanel under **Settings** > **Organization Settings** > **Service Accounts**. The service account must have either **Admin** or **Owner** permissions.
- **Service Account Password**: generated when you create the service account

:::tip Test in a non-production project first
To avoid introducing test data in your production Mixpanel project, we recommend using a test or development Mixpanel project to test your transformations first. Then, create a new Connection in Console with your production credentials, and a new forwarder that imports the configuration from your development forwarder.
:::

## Getting started

### Configure the destination

To create the connection and forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **Mixpanel** for the connection type, enter your project ID, service account username, and service account password. You'll also need to select the **Server Location** where your Mixpanel project is hosted:

- **United States**: `https://api.mixpanel.com/`
- **European Union**: `https://api-eu.mixpanel.com/`
- **India**: `https://api-in.mixpanel.com/`

### Validate the integration

You can confirm events are reaching Mixpanel by checking the **Events** page in your Mixpanel account:

1. From the left navigation bar, click **Events**
2. You should see your Snowplow events appearing in the live view
3. You can also navigate to **Settings** > **Project Settings** > **Data & Exports** to view import statistics

## Identity management

Mixpanel uses a combination of `distinct_id` (user identifier) and `$device_id` (device identifier) to track users across sessions. The Snowplow integration defaults to using `user_id` for `distinct_id` and a coalesce of `domain_userid` and `client_sesion.user_id` for `$device_id`, which supports Mixpanel's [Simplified ID Merge system](https://docs.mixpanel.com/docs/tracking-methods/id-management#simplified-id-merge-system).

When a user logs in and your event contains a `user_id` value, Mixpanel will automatically merge the user's anonymous activity (tracked via `$device_id`) with their identified profile (tracked via `distinct_id`).

## Sending custom properties

The schema reference below defines the standard fields supported by the Mixpanel integration. You can also send custom event properties beyond these standard fields by mapping them within the `properties` object in the field mapping configuration.

Custom properties are nested under the top-level `properties` object in the Mixpanel API. When configuring your forwarder, add additional field mappings with the destination field name formatted as `properties.your_custom_field`. For example:

- `properties.plan_type` to send subscription plan information
- `properties.feature_flag` to track feature flag states
- `properties.campaign_id` to include marketing campaign identifiers

For property names containing spaces, use bracket notation instead of dot notation. For example, use `properties["referred by"]` rather than `properties.referred by`.

You can extract these values from any field in your Snowplow events, including event properties, entities, or custom fields. See [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) for details on configuring field mappings.

## Schema reference

This section contains information on the fields you can send to Mixpanel, including field names, data types, required fields, and default Snowplow mapping expressions.

<EventForwardingSchemaTable schema={mixpanelSchema}/>
