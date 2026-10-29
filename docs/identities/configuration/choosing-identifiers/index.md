---
title: "Choosing identifiers for Identities"
sidebar_label: "Choosing identifiers"
sidebar_position: 2
date: "2026-06-15"
description: "How to choose stable identifiers for Snowplow Identities and validate their cardinality against your warehouse before configuring them."
keywords: ["identities", "identity resolution", "identifiers", "cardinality", "best practices"]
---

The quality of identity resolution, and the cost and latency of running Identities, both depend on which event fields you configure as [identifiers](/docs/identities/concepts/index.md#identifiers). Before adding an identifier in [Console](/docs/identities/configuration/index.md), choose fields that are stable for each user and specific to one user, and validate their cardinality against your warehouse.

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

Also avoid identifiers whose value is shared by many users. Identities links events that carry the same identifier value, so a shared value joins unrelated users together. Shared identifiers include:
* IP addresses, which many users share behind corporate networks, mobile carriers, and VPNs
* Device or browser attributes such as `useragent`, screen resolution, or platform
* Location or account-level fields such as country, city, or company ID
* Placeholder or default values such as `unknown`, `null`, `0`, or an all-zeros advertising ID like `00000000-0000-0000-0000-000000000000`

## Why high-cardinality identifiers are a problem

Identities stores every distinct identifier value as a node in a graph database. When you configure a high-cardinality identifier, the number of nodes grows roughly in line with your event volume rather than your user count.

This has three effects:
* Storage cost increases, because the graph database holds far more nodes than there are users
* Identity resolution latency increases, because graph operations run against a much larger graph
* Resolution quality drops, because most nodes are one-off values that never link any events together

An unstable identifier can grow the identity graph by orders of magnitude. Removing an identifier later doesn't reduce the nodes already created, and [affects resolution for all future events](/docs/identities/configuration/index.md).

## Why low-cardinality identifiers are a problem

A low-cardinality identifier has few distinct values relative to the number of users, so each value is shared by many users. When an event carries a shared value, Identities links it to every other event with that value, and [merges](/docs/identities/concepts/merges/index.md) their Snowplow IDs.

This has three effects:
* Precision drops, because a single Snowplow ID represents many unrelated users
* Merges cascade, because each merged Snowplow ID brings its other identifiers along, which in turn link to more users
* Downstream data becomes unreliable, because user counts, journeys, attribution, and segments built on Snowplow IDs no longer describe real individuals

A single shared value, such as an office IP address, can merge a large share of your users into one Snowplow ID.

[Unique identifiers](/docs/identities/concepts/unique-identifiers/index.md) don't fully protect against this. They prevent merges only when the Snowplow IDs involved have conflicting values for the unique identifier, so anonymous users who share a low-cardinality identifier still merge. As with high-cardinality identifiers, removing an identifier later doesn't reverse merges that have already happened.

## Validate identifiers against your warehouse

Run these checks against your `atomic.events` table before you configure an identifier. The examples use standard atomic columns. If your identifier comes from a custom event or entity field, replace the column with the relevant `unstruct_event_*` or `contexts_*` column. See [how data structures map to warehouse columns](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md).

### Check cardinality

Compare the number of distinct values for each candidate identifier against the total number of events and the number of users. An identifier isn't suitable if:
* Its distinct count approaches the event count, because it produces a new value on nearly every event
* Its distinct count is far below your user count, because many users share each value

```sql
select
  count(*)                       as total_events,
  count(distinct user_id)        as distinct_user_id,
  count(distinct domain_userid)  as distinct_domain_userid
from atomic.events
where collector_tstamp > current_date - interval '30 days';
```

### Check identifiers per unique identifier

For each candidate identifier, measure how many distinct values it takes for a single user. Anchor on your most stable identifier, such as `user_id`, and calculate the average number of distinct values of each other identifier per anchor value. A high average means the identifier is unstable for a user and inflates the graph.

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

| Average distinct values per user    | Interpretation                                       |
| ----------------------------------- | ---------------------------------------------------- |
| Around one                          | Ideal: the identifier is stable for each user        |
| A small number, such as two to five | Acceptable: some churn across devices or sessions    |
| Tens or more                        | Reconsider: the identifier is unstable and high-cost |

### Check users per identifier value

For each candidate identifier, measure how many distinct users share a single value. Anchor on your most stable identifier, such as `user_id`, and list the values of the candidate identifier that are linked to the most users. Each value linked to many users merges those users into a single Snowplow ID.

```sql
select
  domain_userid,
  count(distinct user_id) as n_users
from atomic.events
where user_id is not null
  and domain_userid is not null
  and collector_tstamp > current_date - interval '30 days'
group by domain_userid
order by n_users desc
limit 20;
```

For a stable, user-specific identifier, most values are linked to one user, and the top values are linked to only a few users, for example on shared devices. If the top values are linked to tens or hundreds of users, inspect them. Placeholder values such as `unknown` or empty strings usually appear at the top of this list. Fix the tracking so it doesn't send them, or don't use the field as an identifier.

To check the anchor identifier itself, look for its most frequent values. A `user_id` that appears on a disproportionate share of events is often a placeholder, test, or shared account.

```sql
select
  user_id,
  count(*) as n_events
from atomic.events
where user_id is not null
  and collector_tstamp > current_date - interval '30 days'
group by user_id
order by n_events desc
limit 20;
```

## Reset identifiers on logout

When users share a device, a persistent identifier such as `domain_userid` can be associated with more than one user. To prevent this, reset the identifier when a user logs out.

For web browsers, call [`newSession`](/docs/sources/web-trackers/tracking-events/session/index.md) or [`clearUserData`](/docs/sources/web-trackers/anonymous-tracking/index.md#clear-user-data) on logout. This resets the `domain_userid` cookie so it isn't shared between users on the same browser. For more on how Identities handles shared devices, see [unique identifiers](/docs/identities/concepts/unique-identifiers/index.md).
