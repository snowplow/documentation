---
title: "Correction events in Identities"
sidebar_label: "Identities corrections"
description: "Keep the identity graph consistent under extreme concurrency"
keywords: ["identities", "corrections", "correction event", "late merge", "identity resolution"]
date: "2026-11-18"
category:
  - "Product news"
components:
  - "Identities"
---

A burst of concurrent events or an outage can cause an inconsistency in the identity graph, missing some merges. To mitigate this, we are releasing [correction events](/docs/identities/concepts/#correction-events). With this feature, Identities finds missing merges in the background and applies them with the same rules as a real-time merge.

Under normal operation, every merge happens as Identities processes the event. Here is an example where this might not happen initially. Consider two instances of Identities that resolve two events for the same user at the same exact moment. Each then links the same identifier to a different Snowplow ID with no merging. _Correction events_ address this. First, Identities merges the two Snowplow IDs at a later point. Then your warehouse receives a merge event for the merge, and a correction event with the surviving Snowplow ID, the Snowplow IDs merged into it, and a `correction_id` that identifies the correction.

Correction events arrive in your enriched event stream like merge events, as `identity_correction` events. Because a merge event is also emitted, there is nothing to change in your models. To find out which merges were late, query the correction events instead. See [Corrections](/docs/identities/concepts/corrections/) for how a late merge happens and what a correction changes.
