---
title: "Identities concepts"
sidebar_label: "Concepts"
date: "2025-02-25"
sidebar_position: 1
description: "Core concepts behind Snowplow Identities: identifiers, profiles, merges, and identity resolution."
keywords: ["identities", "identity resolution", "identifiers", "profiles", "merges"]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Identities is based on several core concepts.
* **Identifiers** are the properties in the event payload that correspond to a user
* **Profiles** are collections of linked identifiers that represent a single user
* **Merges** occur when identifiers link two previously separate profiles together

## Identifiers

Identifiers are the properties in the event payload that Identities uses to resolve identity. They're key-value pairs. Each identifier has a type key, such as `domain_userid`, and a value that's the actual ID in the event payload, such as `a43eb2f1-...`.

You can configure identifiers from atomic event fields, or from a property inside an event or entity data structure. For example, you might add a hashed email address from a form submission event, or a global user ID from a custom user profile entity.

## Profiles

A profile is a collection of linked identifiers that represent a single user. Each profile has a persistent, immutable Snowplow ID that identifies it.

When Identities receives a new identifier not found in another profile, it creates a new profile and links the identifier to it. The pipeline adds the new profile's Snowplow ID to the event in an [identity entity](#identity-entity).

In subsequent events, if the original identifier appears alongside new identifiers or identifier values, those are also linked to the same profile. Events containing one or more of the profile identifiers will receive the same Snowplow ID.
<!-- TODO: it's called `identity` instead of `profile` in the backend; is that a problem? I've been using the term `profile` with customers -->

### Example profile creation

In this example, a user browses an ExampleCompany website anonymously, then logs in. Identities, running in the ExampleCompany Snowplow pipeline, is able to identify the events as belonging to the same user.

The configured identifiers for this example are:
- `domain_userid`: browser cookie ID from the web tracker
- `user_id`: the authenticated user's email address

During the anonymous browsing session, the only configured identifier in the events is the `domain_userid`. Since this is a new identifier, Identities creates a new profile and links the identifier to it.

| Event property  | Value        |
| --------------- | ------------ |
| `domain_userid` | `4b0dfa-...` |
| `user_id`       | -            |

```mermaid
graph TD
    A(["domain_userid:<br/>4b0dfa-..."])
    B(("**Profile:<br/>sp_001**"))

    A --- B
```

After the user logs in, the next event contains both the `domain_userid` and their `user_id`. Identities finds the existing profile via the `domain_userid` and adds the `user_id` to it.

| Event property  | Value               |
| --------------- | ------------------- |
| `domain_userid` | `4b0dfa-...`        |
| `user_id`       | `alice@company.com` |

```mermaid
graph TD
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C(("**Profile:<br/>sp_001**"))

    A --- C
    B --- C
```

All events associated with this user both pre- and post-login will have the same Snowplow ID `sp_001` attached in an identity entity.

## Identity resolution process

Identities stores the relationships between identifiers and profiles using a graph-based model. This graph is the source of truth for identity resolution. It dynamically links and merges profiles as new identifiers appear.

The identity resolution process for each event is as follows:
1. The Snowplow pipeline extracts the configured identifiers from the event payload
2. The pipeline sends the identifiers to the Identities service
3. The Identities service checks the graph for existing profiles linked to the identifiers
4. Are any of the identifiers linked to existing profiles?
   * No: Identities creates a new profile, links all identifiers to it, and returns the new profile Snowplow ID
   * Yes: processing continues
5. Identities creates links to that profile for any identifiers that aren't already linked
6. Do any of the identifiers have another linked profile?
   * No: Identities returns the existing profile Snowplow ID
   * Yes: processing continues
7. Identities creates a profile-profile merge relationship from the newer profile to the older profile
8. Identities returns the parent profile Snowplow ID and emits a merge event into the Snowplow pipeline to signal to downstream systems that a merge has occurred.

Identities resolves identity in real time. Each event is resolved against the current state of the graph, ensuring that the Snowplow ID reflects the most up-to-date identity information.

If the graph database is temporarily unavailable or slow to respond, Identities generates a deterministic fallback Snowplow ID linked to the event's identifiers, without looking up existing profiles. Full identity resolution is deferred to avoid additional pipeline latency. An automatic background reconciliation process later replays the affected events to update the graph and generate any necessary merge events. <!-- TODO: ask peel to confirm -->

Tracked events are sometimes delayed in arriving into your pipeline, for example due to network issues or offline tracking. When they're eventually processed, they're resolved against the current state of the identity graph.

### Fallback IDs and identifier priority

Each identifier has a priority that determines how the Snowplow ID is generated when Identities can't reach the graph database, e.g. during a traffic spike. Higher-priority identifiers are preferred when generating fallback IDs.

In normal operation, priority doesn't affect how profiles are linked. All identifiers contribute equally to identity resolution.

## Merges

Merges happen when an event contains identifiers that are linked to different profiles. This typically occurs when a user's anonymous activity is later connected to their known identity.

When profiles merge, the older profile's Snowplow ID becomes the ID for the combined profile. All identifiers from both profiles are linked to the combined profile. Merged profiles can also be merged again in the future if new connecting identifiers are observed.

When a merge occurs, Identities emits a [merge event](#merge-events) into your enriched event stream.

### Example merge process

In this example, a user installs a Snowplow-enabled ExampleCompany mobile app on their Apple phone, and uses the app anonymously (i.e. is not logged in). It's the same user as in the [profile creation example](#example-profile-creation), but that's not immediately apparent.

The ExampleCompany team has configured Identities to use the `apple_idfv` identifier from the mobile platform entity.

Identities finds a new `apple_idfv` value in the user's first event, so it creates a new profile.

| Event property | Value        |
| -------------- | ------------ |
| `apple_idfv`   | `6d920c-...` |
| `user_id`      | -            |

```mermaid
graph LR
    C(["apple_idfv:<br/>6d920c-..."])
    P2(("**Profile:<br/> sp_002**"))

    C --- P2
```

The user then logs into the mobile app. The next event contains the known `apple_idfv` and the previously seen `user_id`. Identities detects that profiles `sp_001` and `sp_002` refer to the same user because of the matching `user_id`. It merges them and emits a merge event.

| Event property | Value               |
| -------------- | ------------------- |
| `apple_idfv`   | `6d920c-...`        |
| `user_id`      | `alice@company.com` |

The older profile becomes the active Snowplow ID. All identifiers from both profiles are now linked to `sp_001`; all future events containing any of these identifiers will have an identity entity containing `sp_001` attached.

```mermaid
graph LR
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C(["apple_idfv:<br/>6d920c-..."])
    P1(("**Profile:<br/> sp_001**"))
    P2(("**Profile:<br/> sp_002**"))

    A --- P1
    B --- P1
    C --- P2
    B --- P2
    P2 -. merged .-> P1
```

## Unique identifiers and merge conflicts

**Unique identifiers** are identifiers that should never cause two profiles to merge together if they have different values. For example, if you mark `user_id` as unique, two events with different `user_id` values will never cause their profiles to merge, even if they share other identifiers like `domain_userid`. This prevents incorrect merges such as when multiple users share a device or browser.

When Identities processes an event that would cause a merge, it checks whether any unique identifiers would conflict. If they do, Identities creates a new anonymous profile for any identifiers that cannot be definitively attributed to either existing profile.

### Example merge conflict

In this example, Alice from the [profile creation](#example-profile-creation) and [merge](#example-merge-process) examples shares her phone with a colleague, Bob.

Bob logs into the ExampleCompany mobile app on Alice's phone. The event contains the device's `apple_idfv`, already linked to Alice's profile via the earlier merge, and Bob's `user_id`.

| Event property | Value             |
| -------------- | ----------------- |
| `apple_idfv`   | `6d920c-...`      |
| `user_id`      | `bob@company.com` |

Identities detects a conflict: the `apple_idfv` is linked to a profile with `user_id: alice@company.com`, but the event contains `user_id: bob@company.com`. Because `user_id` is marked as unique, Identities doesn't merge the profiles. Instead, it creates a new profile for Bob and links all of the event's identifiers to it — including the shared `apple_idfv`.

```mermaid
graph LR
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C1(["apple_idfv:<br/>6d920c-..."])
    P1(("**Profile:<br/> sp_001**"))
    P2(("**Profile:<br/> sp_002**"))

    A --- P1
    B --- P1
    C1 --- P2
    B --- P2
    P2 -. merged .-> P1

    C2(["apple_idfv:<br/>6d920c-..."])
    BobB(["user_id:<br/>bob@company.com"])
    BobC(("**Profile:<br/> sp_003**"))

    C2 --- BobC
    BobB --- BobC
```

Bob logs out, and a third person picks up the device and opens the app without logging in. The event contains only the `apple_idfv`. Identities looks up the identifier and finds it linked to profiles with two different unique `user_id` values: `alice@company.com` and `bob@company.com`.

| Event property | Value        |
| -------------- | ------------ |
| `apple_idfv`   | `6d920c-...` |
| `user_id`      | -            |

Identities can't attribute this anonymous activity to either Alice or Bob. Instead of guessing, it creates a new anonymous profile. The anonymous profile receives a deterministic Snowplow ID, so all future anonymous events from this device receive the same ID until a user logs in.

```mermaid
graph LR
    A(["domain_userid:<br/>4b0dfa-..."])
    B(["user_id:<br/>alice@company.com"])
    C1(["apple_idfv:<br/>6d920c-..."])
    P1(("**Profile:<br/> sp_001**"))
    P2(("**Profile:<br/> sp_002**"))

    A --- P1
    B --- P1
    C1 --- P2
    B --- P2
    P2 -. merged .-> P1

    C2(["apple_idfv:<br/>6d920c-..."])
    BobB(["user_id:<br/>bob@company.com"])
    BobC(("**Profile:<br/>sp_003**"))

    C2 --- BobC
    BobB --- BobC

    C3(["apple_idfv:<br/>6d920c-..."])
    AnonP(("**Profile:<br/>sp_004**<br/>_anonymous_"))

    C3 --- AnonP
```

:::tip Reset identifiers on logout
For web browsers, consider calling [`newSession`](/docs/sources/web-trackers/tracking-events/session/index.md) or [`clearUserData`](/docs/sources/web-trackers/anonymous-tracking/index.md#clear-user-data) when a user logs out. This resets the `domain_userid` cookie, preventing it from being shared between users on the same browser.
:::

## Cross-domain tracking

When users navigate between sites with different cookie domains, or from a mobile app to a webview, each destination assigns its own `domain_userid`. Without cross-domain tracking, these appear as separate users. [Cross-domain](/docs/events/cross-navigation/index.md), or cross-navigation, tracking solves this by passing the `domain_userid` from the source site or app in the URL. Events captured on the destination contain a `refr_domain_userid` field with the source's `domain_userid`.

This works for web-to-web navigation, mobile app-to-webview transitions, and any other scenario where the [web](/docs/sources/web-trackers/cross-domain-tracking/index.md) or [native mobile](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking) trackers decorate outgoing links.

You can [enable cross-domain tracking support](/docs/identities/configuration/index.md#enable-cross-domain-tracking-aliases) in the Identities configuration so that Identities automatically extracts `refr_domain_userid` and maps it to `domain_userid` and `client_session_user_id`, linking the user's profiles across sites.

### Example cross-domain resolution

In this example, ExampleCompany runs two sites on separate cookie domains: `brandA.com` and `brandB.com`. Cross-domain tracking is configured on the web tracker, and the ExampleCompany team has enabled cross-domain tracking in the Identities configuration.

A user browses `brandA.com` anonymously. The event contains a `domain_userid`. Identities creates a new profile.

| Event property  | Value        |
| --------------- | ------------ |
| `url`           | `brandA.com` |
| `domain_userid` | `d123`       |
| `user_id`       | -            |

```mermaid
graph TD
    A(["domain_userid:<br/>d123"])
    P1(("**Profile:<br/>sp_001**"))

    A --- P1
```

The user clicks a link to `brandB.com`. The destination site assigns a new `domain_userid`, but the event also contains a `refr_domain_userid` field with the `domain_userid` from `brandA.com`. Identities treats `refr_domain_userid` as equivalent to `domain_userid`, finds the existing profile, and links the new `domain_userid` to it.

| Event property       | Value        |
| -------------------- | ------------ |
| `url`                | `brandB.com` |
| `domain_userid`      | `f456`       |
| `refr_domain_userid` | `d123`       |
| `user_id`            | -            |

```mermaid
graph TD
    A(["domain_userid:<br/>d123"])
    D(["domain_userid:<br/>f456"])
    P1(("**Profile:<br/>sp_001**"))

    A --- P1
    D --- P1
```

The user then logs into `brandB.com`. The event contains the same `domain_userid` from that site plus a `user_id`. Identities adds the `user_id` to the existing profile.

| Event property  | Value                     |
| --------------- | ------------------------- |
| `url`           | `brandB.com/user-profile` |
| `domain_userid` | `f456`                    |
| `user_id`       | `u001`                    |

```mermaid
graph TD
    A(["domain_userid:<br/>d123"])
    D(["domain_userid:<br/>f456"])
    U(["user_id:<br/>u001"])
    P1(("**Profile:<br/>sp_001**"))

    A --- P1
    D --- P1
    U --- P1
```

All of the user's activity across both sites, both anonymous and authenticated, is resolved to the same Snowplow ID.

## Identities and Signals

Identities is designed to work alongside [Snowplow Signals](/docs/signals/get-started/index.md). To use the Snowplow ID as a unified profile in Signals, set an attribute group's key to `snowplowId` and map it to the `snowplowId` property in the identity entity.

## Data types

Identities adds two data types to your enriched event stream: an identity entity attached to every resolved event, and a merge event emitted when profiles are combined.

### Identity entity

When Identities resolves identity for an event, it attaches an identity [entity](/docs/fundamentals/entities/index.md) to the event payload. This entity contains the Snowplow ID for the profile that the event was resolved to. For [most warehouses](/docs/api-reference/loaders-storage-targets/schemas-in-warehouse/index.md), you'll find it as `contexts_com_snowplowanalytics_snowplow_identity_1`.

<SchemaProperties
  overview={{entity: true}}
  example={{
    snowplowId: "sp_abcdefabcdefabcdefabcdefab",
    createdAt: "2024-01-15T10:30:00.000Z"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "type": "object", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "identity", "format": "jsonschema", "version": "1-0-0" }, "description": "Identity context that is enriched onto events by Snowplow Identities", "properties": { "createdAt": { "type": "string", "format": "date-time" }, "snowplowId": { "type": "string", "maxLength": 29, "pattern": "^sp_[A-Za-z2-7]{26}$" } }, "required": ["snowplowId", "createdAt"], "additionalProperties": false }} />

### Merge events

When a merge occurs, Identities emits a [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) into the enriched event stream. Downstream consumers such as the [Identities dbt package](/docs/identities/data-models/index.md) use these events to keep identity mappings up to date.

<SchemaProperties
  overview={{event: true}}
  example={{
    snowplowId: "sp_abcdefabcdefabcdefabcdefab",
    createdAt: "2024-01-15T10:30:00.000Z",
    merges: ["sp_zyxwvuzyxwvuzyxwvuzyxwvuzy"],
    merged: [{
      snowplowId: "sp_zyxwvuzyxwvuzyxwvuzyxwvuzy",
      createdAt: "2024-01-10T08:00:00.000Z",
      mergedAt: "2024-01-15T10:30:00.000Z",
      triggeringEventId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "type": "object", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "identity_merge", "format": "jsonschema", "version": "1-0-0" }, "description": "Event emitted when Snowplow Identities merges user identities", "properties": { "merged": { "type": "array", "items": { "type": "object", "required": ["snowplowId", "createdAt", "mergedAt", "triggeringEventId"], "properties": { "mergedAt": { "type": "string", "format": "date-time" }, "createdAt": { "type": "string", "format": "date-time" }, "snowplowId": { "type": "string", "maxLength": 29, "pattern": "^sp_[A-Za-z2-7]{26}$" }, "triggeringEventId": { "type": "string", "maxLength": 36 } }, "additionalProperties": false }, "description": "Detailed info about merged identities" }, "merges": { "type": "array", "items": { "type": "string" }, "description": "List of merged identity IDs" }, "createdAt": { "type": "string", "format": "date-time", "description": "When the parent identity was created" }, "snowplowId": { "description": "The parent/surviving identity ID", "type": "string", "maxLength": 29, "pattern": "^sp_[A-Za-z2-7]{26}$" } }, "required": ["snowplowId", "createdAt", "merges", "merged"], "additionalProperties": false }} />
