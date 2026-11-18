---
title: "Correction events in Identities"
sidebar_label: "Identities corrections"
description: "Identities now manages graph quality in the background by applying merges that extreme concurrency or an incident left behind, and announces each repair in a correction event."
keywords: ["identities", "corrections", "correction event", "late merge", "identity resolution"]
date: "2026-11-18"
category:
  - "Product news"
components:
  - "Identities"
---

[Identities](/docs/identities/) now manages the quality of the identity graph in the background, and announces each repair in a [correction event](/docs/identities/concepts/#correction-events). For example, two instances of Identities resolve events for the same user at the same moment. Each links the same identifier to a different Snowplow ID, so no merge happens. Identities merges the two Snowplow IDs later and emits a correction event.

This feature makes the identity graph eventually consistent. Under normal operation, every merge happens as Identities processes the event. Under extreme concurrency, when a user's events reach more than one instance of Identities at the same moment, Identities can miss a merge. The same can happen during post-incident recovery, after the graph database was unavailable or slow. The two Snowplow IDs then stay separate. Identities finds the missed merge in the background and applies it with the same rules as a real-time merge. Your warehouse receives a merge event for the merge, and a correction event with the surviving Snowplow ID, the Snowplow IDs merged into it, and the correction that merged them.

Correction events arrive in your enriched event stream like merge events, as `identity_correction` events. The Identities dbt package doesn't read them, but it still sees each late merge through its merge event. See [Corrections](/docs/identities/concepts/corrections/) for how a late merge happens and what a correction changes.
