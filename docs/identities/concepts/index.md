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

A profile is a collection of linked identifiers that represent a single user. Each profile has a persistent, immutable UUID `snowplow_id` that identifies it.

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

If the graph database is temporarily unavailable or slow to respond, Identities generates a deterministic fallback `snowplow_id` based on the event's identifiers. A background reconciliation process later replays these events to update the graph and generate any necessary merge events.

:::info Data privacy
Identities works inside your cloud environment. All requests are encrypted in transit and at rest.
:::
