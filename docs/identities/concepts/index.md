---
title: "Identities concepts"
sidebar_label: "Concepts"
date: "2025-02-25"
sidebar_position: 1
---

Identities is based on several core concepts.
* **Identifiers** are the key/value pairs extracted from events and used to resolve identity
* **Profiles** are collections of linked identifiers that represent a single user
* **Merges** occur when identifiers link two previously separate profiles together

## Identifiers

Identifiers are the key/value pairs that Identities extracts from events and uses to resolve identity. Each identifier has a name, such as `domain_userid`, and a value that's the actual ID in the event payload, such as `a43eb2f1-...`.

You can configure identifiers from atomic event fields, custom event fields, or from your own entities. For example, you might add a hashed email address from a user profile entity, or a legacy user ID from a custom entity.

### Identifier priority

Each identifier has a priority that determines how the `snowplow_id` is generated when Identities can't reach the graph database, e.g. during a traffic spike. Higher-priority identifiers are preferred when generating fallback IDs.

In normal operation, priority doesn't affect how profiles are linked. All identifiers contribute equally to identity resolution.

### Unique identifiers

Unique identifiers are identifiers that should never cause two profiles to merge together if they have different values. For example, if you mark `user_id` as unique, two events with different `user_id` values will never cause their profiles to merge, even if they share other identifiers like `domain_userid`. This prevents incorrect merges when multiple users share a device or browser.

When Identities processes an event that would cause a merge, it checks whether any unique identifiers would conflict. If they do, Identities creates a new anonymous profile for any identifiers that cannot be definitively attributed to either existing profile.

### Identifier aliases

Identifier aliases allow you to map multiple event fields to the same identifier type. This is useful for cross-domain tracking, where the `refr_domain_userid` field contains the `domain_userid` from the referring site.

When you create an alias, events with values in the aliased field are treated as if they contained that identifier type. For example, if you alias `refr_domain_userid` to `domain_userid`, a user clicking from one site to another will have their profiles linked even though the identifier appears in different fields.

## Profiles

A profile is a collection of linked identifiers that represent a single user. Each profile has a persistent, immutable `snowplow_id` that identifies it.

When Identities receives a new identifier, it creates a new profile and links the identifier to it. The pipeline adds the new `snowplow_id` to the event. In subsequent events, if the original identifier appears alongside new identifiers or identifier values, those are also linked to the same profile. Events containing one or more of the profile identifiers will receive the same `snowplow_id`.

### Identity entity

The added entity uses schema X. The `snowplow_id` has format Y.

Here's an example:

```json
{ "some":"json"}
```

## Merges

Merges happen when an event contains identifiers that are currently linked to different profiles. This typically occurs when a user's anonymous activity is later connected to their known identity.

When profiles merge, the older profile's `snowplow_id` becomes the ID for the combined profile. All identifiers from both profiles are linked to the combined profile.

Merged profiles can also be merged again in the future if new connecting identifiers are observed. The `snowplow_id` always reflects the oldest profile in the merge chain.

### Merge events

When merges occur, a merge event is emitted into the Snowplow pipeline. This event indicates to downstream systems, such as warehouse data models, Signals, or third party event forwarding destinations, that two users were determined to be the same user.

The merge event uses this schema ADD LINK:

```json
{ "some":"json"}
```

## Identity resolution

Identities stores the relationships between identifiers and profiles in a Postgres database using a graph-based model. This graph is the source of truth for identity resolution. It dynamically links and merges profiles as new identifiers appear.

Identities resolves identity in real time. Each event is resolved against the current state of the graph, ensuring that the `snowplow_id` reflects the most up-to-date identity information.

If the graph database is temporarily unavailable or slow to respond, Identities generates a deterministic fallback `snowplow_id` linked to the event's identifiers, without looking up existing profiles. Full identity resolution is deferred to avoid additional pipeline latency. An automatic background reconciliation process later replays the affected events to update the graph and generate any necessary merge events.

:::info Data privacy
Identities works inside your cloud environment. All requests are encrypted in transit and at rest.
:::

Tracked events are sometimes delayed in arriving into your pipeline, for example due to network issues or offline tracking. When they're eventually processed, they're resolved against the current state of the identity graph.

## Examples

These examples, based on a fictional company, show how Identities builds and merges profiles over time. They follow ExampleCompany employees Alice, Bob, and Carol. ExampleCompany has implemented Snowplow tracking across their platforms.

ExampleCompany configured these identifiers for identity resolution:
- `user_id` (marked as unique) — the authenticated user's email address
- `domain_userid` — browser cookie ID from the web tracker
- `network_userid` — server-side cookie ID from the Collector
- `appleIdfa` — device identifier from mobile apps
- `androidIdfa` — device identifier from mobile apps
- TODO

### Creating a new profile

Alice browses the ExampleCompany website on her tablet without logging in. This is the first time Identities has seen her tablet's `domain_userid`. She's an anonymous user.

Since no existing profile contains this identifier, Identities creates a new profile and links the `domain_userid` to it.

```mermaid
graph LR
    A["domain_userid
    4b0dfa75-..."]
    B["Profile: sp_001"]

    A --> B

    style A fill:#fff9c4
    style B fill:#fff9c4
```

All events from Alice's tablet browsing session are tagged with an identity entity referencing `snowplow_id: "sp_001"`.

Later, Alice logs in to the website using the same tablet. Identities receives an event that contains both her `domain_userid` from the browser cookie, and her `user_id` from authentication.

Identities finds the existing profile via the `domain_userid` and adds the `user_id` to it.

```mermaid
graph LR
    A["domain_userid
    4b0dfa75-..."]
    B["user_id
    alice@company.com"]
    C["Profile: sp_001"]

    A --> C
    B --> C

    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#fff9c4
```

The profile now has two linked identifiers. Any future events with either identifier will resolve to `sp_001`. This allows ExampleCompany analysts to identify Alice's activity across both anonymous and authenticated sessions.

### Merging profiles of known and anonymous users

Alice installs the ExampleCompany mobile app on her Apple phone, and uses the app anonymously. Identities receives an event containing her phone's `appleIdfa` within the mobile platform entity. This is a new identifier, so it creates a new profile.

```mermaid
graph LR
    A["domain_userid
    4b0dfa75-..."]
    B["user_id
    alice@company.com"]
    C["appleIdfa
    6D92078A-..."]
    P1["Profile: sp_001"]
    P2["Profile: sp_002"]

    A --> P1
    B --> P1
    C --> P2

    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#e1f5fe
    style P1 fill:#fff9c4
    style P2 fill:#e1f5fe
```

When Alice logs into the mobile app, the next event contains both her `appleIdfa` and her `user_id`. Identities detects that profiles `sp_001` and `sp_002` refer to the same user because of the matching `user_id`. It merges them and emits a merge event.

The older profile becomes the active `snowplow_id`. All identifiers from both profiles are now linked to `sp_001`; all future events containing any of these identifiers will have an identity entity containing `sp_001`.

```mermaid
graph LR
    A["domain_userid
    4b0dfa75-..."]
    B["user_id
    alice@company.com"]
    C["appleIdfa
    6D92078A-..."]
    P1["Profile: sp_001"]
    P2["Profile: sp_002"]

    A --> P1
    B --> P1
    C --> P2
    B --> P2
    P2 --> P1

    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#fff3e0
    style P1 fill:#fff9c4
    style P2 fill:#fff3e0
```

### Unique identifiers preventing incorrect merges

Bob is a new ExampleCompany employee. He has browsed the ExampleCompany website on his laptop anonymously, and then logged in. The website generated events containing a `domain_userid`, and subsequently a `domain_userid` and `user_id`.

Identities created a new profile for his `domain_userid`, and later added his `user_id` to the same profile.

```mermaid
graph LR
    A["domain_userid
    c94f860b-..."]
    B["user_id
    bob@company.com"]
    C["Profile: sp_030"]

    A --> C
    B --> C

    style A fill:#e1f5fe
    style B fill:#e1f5fe
    style C fill:#e1f5fe
```

Bob asks Alice to help with a task. She logs out of Bob's account, and logs into her own. The `domain_userid` remains the same, but the tracked `user_id` changes to Alice's.

ExampleCompany has configured `user_id` as a unique identifier. This means that two profiles with different `user_id` values will never be merged together, even if they share other identifiers.

```mermaid
graph LR
    BobA["domain_userid
    c94f860b-..."]
    BobB["user_id
    bob@company.com"]
    BobC["Profile: sp_030"]

    BobA --> BobC
    BobB --> BobC

    style BobA fill:#e1f5fe
    style BobB fill:#e1f5fe
    style BobC fill:#e1f5fe

    A["domain_userid
    4b0dfa75-..."]
    B["user_id
    alice@company.com"]
    C["appleIdfa
    6D92078A-..."]
    P1["Profile: sp_001"]
    P2["Profile: sp_002"]

    A --> P1
    B --> P1
    C --> P2
    B --> P2
    P2 --> P1

    BobA --> P1

    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#fff3e0
    style P1 fill:#fff9c4
    style P2 fill:#fff3e0
```

The events are tagged with Alice's existing profile, `sp_001`.

### Anonymous activity on a shared device

After Alice finishes helping Bob, she logs out. Their colleague Carol walks past and browses the ExampleCompany landing page anonymously on Bob's laptop.

The event contains the same `domain_userid` from the website cookies. This identifier has now been seen with two different unique `user_id` identifiers, `alice@company.com` and `bob@company.com`.

Identities can't deterministically attribute this anonymous activity to either Alice or Bob. Instead of making an incorrect attribution, Identities creates a new anonymous profile, and tags events in this session with the new Snowplow ID `sp_045`.

```mermaid
graph LR
    BobA["domain_userid
    c94f860b-..."]
    BobB["user_id
    bob@company.com"]
    BobC["Profile: sp_030"]

    BobA --> BobC
    BobB --> BobC

    style BobA fill:#e1f5fe
    style BobB fill:#e1f5fe
    style BobC fill:#e1f5fe

    A["domain_userid
    4b0dfa75-..."]
    B["user_id
    alice@company.com"]
    C["appleIdfa
    6D92078A-..."]
    P1["Profile: sp_001"]
    P2["Profile: sp_002"]

    A --> P1
    B --> P1
    C --> P2
    B --> P2
    P2 --> P1

    BobA --> P1

    style A fill:#fff9c4
    style B fill:#fff9c4
    style C fill:#fff3e0
    style P1 fill:#fff9c4
    style P2 fill:#fff3e0

    CarolP["Profile: sp_045"]

    BobA --> CarolP
```

This anonymous profile ensures that Carol's activity (or any other anonymous user of the shared laptop) isn't incorrectly attributed to Alice or Bob.

### Cross-domain tracking

TODO
