---
title: "Configure and manage Identities"
sidebar_label: "Configuration"
date: "2025-02-25"
sidebar_position: 2
description: "Configure identifiers, aliases, and event filters for Snowplow Identities identity resolution."
---

Manage your Identities deployment and configure identifiers using [Snowplow Console](https://console.snowplowanalytics.com).

Navigate to **Identities** in the Console sidebar. If Identities is not yet deployed for your pipeline, you'll see a setup page. Click **Start configuration** to begin.

If Identities is already deployed, you'll see the Identities overview page with your current configuration and identity graph metrics. Click **Edit configuration** to make changes.

<!-- TODO: Add screenshot of Identities landing page -->

## Configure identifiers

Configure which fields from your events should be used as [identifiers](/docs/identities/concepts/index.md#identifiers).

Each identifier type has:

| Field    | Description                                                                          | Required? |
| -------- | ------------------------------------------------------------------------------------ | --------- |
| Name     | A unique name for this identifier type, e.g. `acme_user_id`                          | Yes       |
| Field    | The event field to extract the identifier value from                                 | Yes       |
| Unique   | Whether this identifier should prevent merges between profiles with different values | No        |
| Priority | The priority used when generating fallback IDs; higher is preferred                  | Yes       |

Only one identifier can be marked as unique.

A single event field can only be mapped to one identifier type. Identifier names must be unique.

### Add an identifier

Follow the steps in Console to create a new identifier.

:::warning Removing identifiers
Removing an identifier affects identity resolution for all future events. Profiles that would have been connected through this identifier will appear as separate profiles going forward. Historical identities won't change. This can't be undone.
:::

### Define identifier aliases

Aliases map additional event fields to existing identifier types. This is mainly used for [cross-domain tracking](/docs/events/cross-navigation/index.md).

To create an alias, enter a new identifier name and field, then select which previously defined identifier it maps to. For example, map the `refr_domain_userid` field to the `domain_userid` identifier.

Aliased identifiers don’t need a priority and can’t be unique, because they’re treated the same as the identifiers they are mapped to.

## Set event filters

By default, Identities processes all events that flow through your pipeline. Use event filters to limit identity resolution to a subset of events.

Event filters are optional. Common reasons to filter events include:
- Processing only events from specific applications (`app_id`)
- Excluding server-side events that don't represent user activity
- Limiting to events from specific platforms

To add a filter, click **Add filter** and configure:

| Field    | Description                          |
| -------- | ------------------------------------ |
| Field    | The event field to filter on         |
| Operator | `IN` (include) or `NOT IN` (exclude) |
| Values   | A list of values to match            |

<!-- TODO: Add screenshot of filter form -->
