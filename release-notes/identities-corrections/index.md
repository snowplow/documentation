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

[Identities](/docs/identities/) now manages the quality of the identity graph in the background, and announces each repair in a [correction event](/docs/identities/concepts/#correction-events). For example, if two instances of Identities resolve events for the same user at the same moment, each can link the same identifier to a different Snowplow ID, and no merge happens. Identities later merges the two Snowplow IDs and emits a correction event.

Corrections make the identity graph eventually consistent. Under normal operation, every merge happens as Identities processes the event. Extreme concurrency, or post-incident recovery after the graph database was unavailable or slow, can leave a merge behind. Identities finds the missed merge in the background and applies it with the same rules as a real-time merge. Your warehouse receives a merge event for the merge, and a correction event with the surviving Snowplow ID, the Snowplow IDs merged into it, and the correction that merged them.

Correction events arrive in your enriched event stream like merge events, as `identity_correction` events. The Identities dbt package doesn't read them, but it still sees each late merge through its merge event. See [Corrections](/docs/identities/concepts/corrections/) for how a late merge happens and what a correction changes.
