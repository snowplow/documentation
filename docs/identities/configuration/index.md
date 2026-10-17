---
title: "Configure and manage Identities"
sidebar_label: "Configuration"
date: "2025-02-25"
sidebar_position: 2
description: "Configure identifiers, time to live, aliases, and event filters for Snowplow Identities identity resolution."
keywords: ["identities", "identity resolution", "identifiers", "time to live", "TTL", "aliases", "event filters", "configuration"]
---

Manage your Identities deployment and configure identifiers using [Snowplow Console](https://console.snowplowanalytics.com).

Navigate to **Identities** in the Console sidebar. If Identities is not yet deployed for your pipeline, you'll see a setup page. Click **Start configuration** to begin.

If Identities is already deployed, you'll see the Identities overview page with your current configuration. Click **Edit configuration** to make changes.

{/* TODO: Add screenshot of Identities landing page */}

## Configure identifiers

Configure which fields from your events should be used as [identifiers](/docs/identities/concepts/index.md#identifiers).

:::tip[Choose stable identifiers]
The fields you choose affect both resolution quality and the cost and latency of running Identities. Before adding an identifier, read [choosing identifiers](/docs/identities/configuration/choosing-identifiers/index.md) and validate its cardinality against your warehouse.
:::

Each identifier type has:

| Field        | Description                                                                              | Required? |
| ------------ | ---------------------------------------------------------------------------------------- | --------- |
| Name         | A unique name for this identifier type, e.g. `acme_user_id`                              | Yes       |
| Property     | The event property to extract the identifier value from                                  | Yes       |
| Unique       | Whether this identifier should prevent merges between Snowplow IDs with different values | No        |
| Priority     | The priority used when generating fallback IDs; higher is preferred                      | Yes       |
| Time to live | How many days to keep a value after it was last seen in an event, or **Forever**         | Yes       |

Only one identifier can be marked as unique.

A single event field can only be mapped to one identifier type. Identifier names must be unique.

### Add an identifier

Follow the steps in Console to create a new identifier.

:::warning[Removing identifiers]
Removing an identifier affects identity resolution for all future events. Snowplow IDs that would have been connected through this identifier will appear as separate Snowplow IDs going forward. Historical identities won't change. This can't be undone.
:::

### Set a time to live

Set a [time to live](/docs/identities/concepts/time-to-live/index.md) (TTL) for each identifier type to remove values that haven't been seen in events for that many days. Enter a number of days between 7 and 36500, or choose **Forever** to keep values indefinitely.

Every identifier defaults to 180 days, including the identifiers Console pre-populates when you first configure Identities and the ones it adds when you enable cross-domain tracking aliases. Identifiers deployed without a time to live show as **Forever**.

Changing a TTL affects values already in the graph in three ways:

* Shortening or lengthening an existing TTL applies to every value that already has a last-seen date
* Adding a TTL to an identifier type that never had one removes existing values only after each has been seen again
* Choosing **Forever** stops removal for that identifier type but keeps its last-seen dates, so re-adding a TTL later makes any value already outside the new window due for removal

:::warning[Shortening a TTL]
When you shorten a TTL, any value whose last-seen date is already outside the new window becomes due for removal as soon as the change is deployed. Check how long the user goes between events before lowering the value.
:::

### Enable cross-domain tracking aliases

If you use [cross-domain tracking](/docs/events/cross-navigation/index.md), check the **Enable cross-domain tracking aliases** box. This automatically extracts `refr_domain_userid` as an identifier and maps it to `domain_userid` and `client_session_user_id`, so the same user is resolved across sites with different cookie domains.

:::note[Mapping requirements]
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

{/* TODO: Add screenshot of filter form */}

## Supported scale

Identities is self-serviceable from Console. The default deployment is sized for typical production event volumes and reasonable identifier configurations, where each configured identifier is stable for a user. Following the guidance in [choosing identifiers](/docs/identities/configuration/choosing-identifiers/index.md) keeps your deployment within these defaults.

:::warning[High-volume deployments]
High-volume pipelines aren't covered by the self-serve defaults and shouldn't be deployed without guidance. If you expect a large event volume, or your warehouse checks show high-cardinality identifiers you can't avoid, [contact Snowplow Support](https://support.snowplow.io/) before deploying Identities.
:::
