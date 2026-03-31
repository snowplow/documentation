---
title: "Configure and manage Identities"
sidebar_label: "Configuration"
date: "2025-02-25"
sidebar_position: 2
description: "Configure identifiers, aliases, and event filters for Snowplow Identities identity resolution."
---

Manage your Identities deployment and configure identifiers using [Snowplow Console](https://console.snowplowanalytics.com).

Navigate to **Identities** in the Console sidebar. If Identities is not yet deployed for your pipeline, you'll see a setup page. Click **Start configuration** to begin.

If Identities is already deployed, you'll see the Identities overview page with your current configuration. Click **Edit configuration** to make changes.

<!-- TODO: Add screenshot of Identities landing page -->

## Configure identifiers

Configure which fields from your events should be used as [identifiers](/docs/identities/concepts/index.md#identifiers).

Each identifier type has:

| Field    | Description                                                                          | Required? |
| -------- | ------------------------------------------------------------------------------------ | --------- |
| Name     | A unique name for this identifier type, e.g. `acme_user_id`                          | Yes       |
| Property | The event property to extract the identifier value from                              | Yes       |
| Unique   | Whether this identifier should prevent merges between Snowplow IDs with different values | No        |
| Priority | The priority used when generating fallback IDs; higher is preferred                  | Yes       |

Only one identifier can be marked as unique.

A single event field can only be mapped to one identifier type. Identifier names must be unique.

### Add an identifier

Follow the steps in Console to create a new identifier.

:::warning Removing identifiers
Removing an identifier affects identity resolution for all future events. Snowplow IDs that would have been connected through this identifier will appear as separate Snowplow IDs going forward. Historical identities won't change. This can't be undone.
:::

### Enable cross-domain tracking aliases

If you use [cross-domain tracking](/docs/events/cross-navigation/index.md), check the **Enable cross-domain tracking aliases** box. This automatically extracts `refr_domain_userid` as an identifier and maps it to `domain_userid` and `client_session_user_id`, so the same user is resolved across sites with different cookie domains.

:::note Mapping requirements
For cross-domain tracking aliases to work, you must have identifiers named `domain_userid` or `client_session_user_id` (or both) defined in the identifiers section above.
:::

## Set event filters

By default, Identities processes all events that flow through your pipeline. Use event filters to limit identity resolution to a subset of events.

Event filters are optional. Common reasons to filter events include:
- Processing only events from specific applications, using `app_id`
- Excluding server-side events that don't represent user activity
- Limiting to events from specific platforms

You can add multiple filters and combine them with **AND** (all conditions must match) or **ANY** (at least one condition must match) logic.

To add a filter, click **Add filter** and configure:

| Field    | Description                                        |
| -------- | -------------------------------------------------- |
| Property | The event property to filter on                    |
| Operator | `is one of` (include) or `is not one of` (exclude) |
| Value    | A list of values to match                          |

<!-- TODO: Add screenshot of filter form -->
