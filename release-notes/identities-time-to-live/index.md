---
title: "Time to live for identifiers in Identities"
sidebar_label: "Identities time to live"
description: "Each identifier type in Identities can now have a time to live, which removes identifier values that haven't been seen in events for a set number of days."
keywords: ["identities", "time to live", "TTL", "identifiers", "identity resolution"]
date: "2026-11-17"
category:
  - "Product news"
components:
  - "Identities"
---

You can now set a [time to live](/docs/identities/concepts/time-to-live/) (TTL) for each identifier type in [Identities](/docs/identities/). For example, you can configure stale `domain_userid` values to be removed from the graph after 30 days.

This feature helps optimize the storage cost of running Identities. With many identifiers, there is no need to store them indefinitely because they naturally stop appearing in the data after a certain time. For instance, if you reset `domain_userid` when a user logs out, the user gets a new `domain_userid` value when they log back in. The old value no longer contributes to the identity graph. Adding a TTL to such identifiers makes sure that stale values are removed and don’t take space in the database.

Set the TTL in Console as a number of days between 7 and 36500, or choose **Forever** to keep values indefinitely. New identifiers default to 180 days, and identifiers deployed without a TTL show as **Forever**. Removing a value never changes an existing Snowplow ID and never rewrites a [merge](/docs/identities/concepts/merges/).

See [Configure and manage Identities](/docs/identities/configuration/#set-a-time-to-live) for how TTL changes apply to values already in the graph.
