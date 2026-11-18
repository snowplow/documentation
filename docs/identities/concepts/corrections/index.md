---
title: "Identity graph corrections"
sidebar_label: "Corrections"
sidebar_position: 50
date: "2026-11-18"
description: "How Snowplow Identities manages graph quality in the background by applying merges that Identities missed during extreme concurrency or after an incident, and how a correction event tells your warehouse what changed."
keywords: ["identities", "identity resolution", "corrections", "late merge", "correction event", "eventual consistency", "graph quality"]
content_type: concept
---

Corrections are how Identities manages the quality of the identity graph in the background. Under normal operation, every [merge](/docs/identities/concepts/merges/index.md) happens as Identities processes the event. Two situations can leave a merge behind. One is extreme concurrency, when a user's events reach more than one instance of Identities at the same moment. The other is post-incident recovery, after the graph database was unavailable or slow. A correction applies the missed merge later and announces the repair to your warehouse in a correction event, so the graph is eventually consistent.

:::note[No action needed]
You don't need to do anything to trigger or apply a correction. Identities finds the missed merge and applies it with the same rules as a real-time merge. It then emits a merge event and a correction event, so your downstream models see the two Snowplow IDs come together.
:::

Corrections are rare. Events already in your warehouse keep the Snowplow ID that Identities assigned to them, so use the correction event to map them to the surviving Snowplow ID in your models.

## How a late merge happens

Identities runs on more than one instance. Each instance resolves events against the graph as it sees it at that moment, and it doesn't see the links another instance is still writing. When two instances resolve events for the same user at the same moment, each can link the same identifier to a different Snowplow ID. Neither instance sees the other's link, so neither merges the two Snowplow IDs. This is a late merge: a merge that should have happened as Identities processed the event, but didn't.

In this example, a user has browsed the ExampleCompany website anonymously, so `sp_001` holds their `domain_userid`. The same user has also used the ExampleCompany mobile app anonymously, so `sp_002` holds their `apple_idfv`. The user then logs in on both devices within the same second:

1. The web event carries `domain_userid` and `user_id`. The mobile event carries `apple_idfv` and the same `user_id`. Instance A receives the web event and instance B receives the mobile event.
2. Instance A links `user_id` to `sp_001`. Instance B links `user_id` to `sp_002`. Neither instance sees the other's link yet, so neither plans a merge.
3. Identities detects, in the background, that both `sp_001` and `sp_002` hold `user_id`, and creates a correction.
4. The correction merges `sp_002` into `sp_001`, because `sp_001` is older, and Identities emits a correction event.

Before the correction, the graph holds two Snowplow IDs that share `user_id`:

```mermaid
graph LR
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C(["apple_idfv:<br/>6d920c-..."])
    P1(("**Snowplow ID:<br/> sp_001**"))
    P2(("**Snowplow ID:<br/> sp_002**"))

    A --- P1
    B --- P1
    B --- P2
    C --- P2
```

After the correction, all three identifiers resolve to `sp_001`, and future events for the user carry `sp_001` in their identity entity:

```mermaid
graph LR
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C(["apple_idfv:<br/>6d920c-..."])
    P1(("**Snowplow ID:<br/> sp_001**"))
    P2(("**Snowplow ID:<br/> sp_002**"))

    A --- P1
    B --- P1
    B --- P2
    C --- P2
    P2 -. merged by correction .-> P1
```

## What a correction changes

A correction applies the merge that real-time processing missed. It follows these rules:

* A correction follows the same rules as a real-time merge. It merges the Snowplow IDs that share the identifier into the oldest of them, and it respects the merge limit and [unique identifiers](/docs/identities/concepts/unique-identifiers/index.md). A Snowplow ID that these rules refuse stays separate.
* A correction never creates a Snowplow ID and never changes an existing one
* A correction never rewrites an earlier merge

Identities emits a correction event only when the correction merged something. It also emits a merge event for the same merge, and the two events can arrive in either order. Detection and application run in the background, so some time passes between the events and the correction. During that time, events for the user carry whichever Snowplow ID their identifiers resolve to.

## Recognize a correction in your warehouse

A [correction event](/docs/identities/concepts/index.md#correction-events) arrives in your enriched event stream like a [merge event](/docs/identities/concepts/index.md#merge-events). It carries the surviving Snowplow ID and every Snowplow ID merged into it, in the same `snowplow_id`, `merges`, and `merged` fields as a merge event. A model that processes merge events can process correction events in the same way. Identities also emits a merge event for the same merge, so a model that reads both kinds of event sees the merge twice.

Four fields set a correction event apart from a merge event:

* `correction_id` identifies the correction. It equals the event's `event_id`, and the merge event for the same merge carries it as `triggering_event_id`. A merge event for a real-time merge carries the `event_id` of the event that caused the merge instead, so `triggering_event_id` tells the two apart and deduplicates them.
* `affected_snowplow_ids` lists the Snowplow IDs this correction merged, as opposed to the full merge history in `merges`
* `applied_at` is when the correction changed the graph, and the event's `true_tstamp` and `derived_tstamp` carry the same value
* `refused_snowplow_ids` lists the Snowplow IDs that the merge rules refused, when there are any

The `type` field is `late_merge` and the `source` field is `automatic`.

The Identities [dbt package](/docs/identities/data-models/index.md) doesn't read correction events, but it still sees each late merge through its merge event. See [Merges](/docs/identities/concepts/merges/index.md) for how a real-time merge works, and [Identity resolution process](/docs/identities/concepts/index.md#identity-resolution-process) for how Identities resolves each event.
