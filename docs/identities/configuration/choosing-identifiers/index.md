---
title: "Choosing identifiers for Identities"
sidebar_label: "Choosing identifiers"
sidebar_position: 2
date: "2026-06-15"
description: "How to choose stable identifiers for Snowplow Identities and validate their cardinality against your warehouse before configuring them."
keywords: ["identities", "identity resolution", "identifiers", "cardinality", "best practices"]
---

The quality of identity resolution, and the cost and latency of running Identities, both depend on which event fields you configure as [identifiers](/docs/identities/concepts/index.md#identifiers). Before adding an identifier in [Console](/docs/identities/configuration/index.md), choose fields that are stable for each user, and validate their cardinality against your warehouse.

## What makes a good identifier

A good identifier holds the same value for a user over time and across their events. Stable identifiers let Identities link activity to a single [Snowplow ID](/docs/identities/concepts/index.md#snowplow-ids) without creating unnecessary nodes in the identity graph.

Stable identifiers include:
* `user_id`, set when a user authenticates
* `domain_userid`, the web tracker's persistent cookie ID
* A hashed email address captured at sign-in
* A device identifier such as `apple_idfv`

Avoid identifiers whose value changes frequently for the same user. Each distinct identifier value becomes a node in the [identity graph database](/docs/identities/index.md#how-identities-fits-into-the-snowplow-pipeline), so a value that changes often produces a new node on almost every event. Unstable identifiers include:
* Session identifiers such as `domain_sessionid`
* Page view identifiers
* Event identifiers such as `event_id`
* Any value that embeds a timestamp or is regenerated per session or per event

## Why high-cardinality identifiers are a problem

Identities stores every distinct identifier value as a node in a graph database. When you configure a high-cardinality identifier, the number of nodes grows roughly in line with your event volume rather than your user count.

This has three effects:
* Storage cost increases, because the graph database holds far more nodes than there are users
* Identity resolution latency increases, because graph operations run against a much larger graph
* Resolution quality drops, because most nodes are one-off values that never link any events together

An unstable identifier can grow the identity graph by orders of magnitude. Removing an identifier later doesn't reduce the nodes already created, and [affects resolution for all future events](/docs/identities/configuration/index.md).

## Validate identifiers against your warehouse

It is recommended to run these checks against your `atomic.events` table before configuring an identifier. The examples use standard atomic columns. If your identifier comes from a custom event or entity field, replace the column with the relevant `unstruct_event_*` or `contexts_*` column. See [how data structures map to warehouse columns](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

### Check cardinality

Compare the number of distinct values for each candidate identifier against the total number of events. An identifier whose distinct count approaches the event count produces a new value on nearly every event, and isn't suitable.

```sql
select
  count(*)                       as total_events,
  count(distinct user_id)        as distinct_user_id,
  count(distinct domain_userid)  as distinct_domain_userid
from atomic.events
where collector_tstamp > current_date - interval '30 days';
```

### Check identifiers per unique identifier

For each candidate identifier, measure how many distinct values it takes for a single user. Anchor on your most stable identifier, such as `user_id`, and calculate the average number of distinct values of each other identifier per anchor value. A high average means the identifier is unstable for a user and will inflate the graph.

```sql
select avg(n_values) as avg_domain_userid_per_user
from (
  select user_id, count(distinct domain_userid) as n_values
  from atomic.events
  where user_id is not null
    and collector_tstamp > current_date - interval '30 days'
  group by user_id
) t;
```

Use the result to judge whether an identifier is stable enough to configure:

| Average distinct values per user | Interpretation                                       |
| -------------------------------- | ---------------------------------------------------- |
| Around one                       | Ideal: the identifier is stable for each user        |
| A small number, e.g. two to five | Acceptable: some churn across devices or sessions    |
| Tens or more                     | Reconsider: the identifier is unstable and high-cost |

## Reset identifiers on logout

When users share a device, a persistent identifier such as `domain_userid` can be associated with more than one user. To prevent this, reset the identifier when a user logs out.

For web browsers, call [`newSession`](/docs/sources/web-trackers/tracking-events/session/index.md) or [`clearUserData`](/docs/sources/web-trackers/anonymous-tracking/index.md#clear-user-data) on logout. This resets the `domain_userid` cookie so it isn't shared between users on the same browser. For more on how Identities handles shared devices, see [unique identifiers](/docs/identities/concepts/unique-identifiers/index.md).
