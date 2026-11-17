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

You can now set a [time to live](/docs/identities/concepts/time-to-live/) (TTL) for each identifier type in [Identities](/docs/identities/). Identities removes an identifier value from the graph once that value has gone unseen in events for longer than the TTL.

A TTL suits identifiers whose old values stop appearing in events, such as the web tracker's `domain_userid` when you reset it on logout. Without a TTL, those values stay in the graph indefinitely, and each one adds to the storage cost of running Identities.

You set the TTL in Console as a number of days between 7 and 36500, or choose **Forever** to keep values indefinitely. New identifiers default to 180 days, and identifiers deployed without a TTL show as **Forever**. Removing a value never changes an existing Snowplow ID or rewrites a [merge](/docs/identities/concepts/merges/).

See [Configure and manage Identities](/docs/identities/configuration/#set-a-time-to-live) for how TTL changes apply to values already in the graph.
