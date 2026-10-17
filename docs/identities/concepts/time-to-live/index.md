---
title: "Time to live"
sidebar_label: "Time to live"
sidebar_position: 40
date: "2026-09-16"
description: "How Snowplow Identities removes identifier values that haven't been seen in events for a configured number of days, and what removal changes."
keywords: ["identities", "identity resolution", "time to live", "TTL", "identifier expiry", "retention"]
---

Each identifier type can have a time to live (TTL), measured in days. Identities removes an identifier value from the graph once that value has gone unseen in events for longer than the TTL. Identifier types without a TTL keep their values indefinitely.

Use a TTL for identifiers whose values stop being relevant once they stop appearing in events. The web tracker's [`domain_userid`](/docs/events/identifiers/index.md#tracker-generated) is an example. [Choosing identifiers](/docs/identities/configuration/choosing-identifiers/index.md#reset-identifiers-on-logout) recommends resetting it when a user logs out. Each reset retires a value: the browser continues with a new `domain_userid`, and the old one never appears in another event, so it can no longer help resolve anyone's identity. Without a TTL it stays in the graph indefinitely. With a TTL, Identities removes it after it has gone unseen for the TTL period.

You configure the TTL per identifier type in [Console](/docs/identities/configuration/index.md#set-a-time-to-live).

## When Identities removes values

Identities records a last-seen date for an identifier value the first time it appears in an event after its type has a TTL, and updates it on each later event. Three details of the last-seen date affect when a value is removed:

* The last-seen date is the UTC date when the event is processed, not the event's own timestamp, so reprocessing an old event sets the date to the processing date
* The date never moves to an earlier day
* Identities records last-seen dates asynchronously and on a best-effort basis, so a sighting can occasionally be lost

A lost sighting leaves the last-seen date earlier than the truth, so Identities can remove a value that is still in use.

A value is due for removal once its last-seen date is more than the TTL number of days before the current UTC date. With a TTL of 30 days, a value last seen on 1 March is due for removal from 1 April. Removal runs in the background, so a value can stay in the graph for some time after it becomes due. A value that appears in an event before Identities removes it gets a new last-seen date and stays.

A value with no last-seen date is never removed. When you add a TTL to a type that already has values in the graph, each existing value is removed only after it has been seen once more and then gone unseen for the TTL period.

## What removal changes

When a value is removed, Identities deletes it and its links to Snowplow IDs. A Snowplow ID is deleted when no identifier values are linked to it and no Snowplow ID merged into it, directly or through another merge, still has linked values.

Removal never changes an existing Snowplow ID and never rewrites a [merge](/docs/identities/concepts/merges/index.md). Identities doesn't emit a merge event when values are removed. Events already in your warehouse keep the Snowplow ID they were resolved with.

If a removed value appears in a later event, Identities treats it as new. It links the value to the Snowplow ID resolved from the other identifiers in that event, or creates a new Snowplow ID if there are no other matching identifiers. A user whose identifier values have all been removed therefore receives a new Snowplow ID when they return.
