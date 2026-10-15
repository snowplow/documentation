---
title: "Read attributes by any linked identifier with Identities"
sidebar_position: 25
sidebar_label: "Identity resolution"
description: "Calculate attributes per person with the Snowplow ID from Identities, and read them in your application with whichever identifier it already has, such as a cookie ID or a user ID."
keywords: ["identity resolution", "identity stitching", "snowplow_id", "Snowplow ID", "Identities", "caller identifiers", "cross-device"]
date: "2026-10-14"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The same person often reaches you through more than one identifier. For example, a user browses anonymously with a `domain_userid` cookie, then logs in with a `user_id`. Attributes keyed on `domain_userid` or `user_id` keep that activity in separate profiles.

With identity resolution, Signals calculates attributes against the Snowplow ID that [Identities](/docs/identities/index.md) assigns to each person, so all of their activity counts towards one profile. Your application keeps reading with whichever identifier it already has, and Signals returns that person's attributes.

## How identity resolution works

Identities resolves each event to a Snowplow ID and attaches it to the event in the [identity entity](/docs/identities/concepts/index.md#identity-entity). Signals includes a built-in `snowplow_id` [attribute key](/docs/signals/attributes/attribute-keys/index.md) that reads the Snowplow ID from that entity, so you can calculate attributes per person instead of per device or per session.

Your application never sees the Snowplow ID. To read attributes keyed on `snowplow_id`, you choose up to three **caller identifiers** from the identifiers in your Identities configuration. These are the identifiers your application can read attributes by.

When you read by a caller identifier, Signals returns the attributes of the person that identifier was most recently seen with on your events.

For examples of what a read returns, see [Supported use cases](#supported-use-cases).

## Before you start

To use identity resolution, you need:

* Identities set up on the same pipeline as your Signals deployment, with a configuration that has finished deploying. See [Configure Identities](/docs/identities/configuration/index.md).
* The identifiers you want to read by included in your Identities configuration. For advice on picking them, see [Choosing identifiers](/docs/identities/configuration/choosing-identifiers/index.md).
* Stream attribute groups. Attribute groups keyed on `snowplow_id` can't use a warehouse source or backfill yet.

{/* TODO: confirm the minimum versions (Signals, Python SDK, Node.js SDK) once released. */}

## Configure the snowplow_id attribute key

Select the caller identifiers on the built-in `snowplow_id` attribute key, then create stream attribute groups that use `snowplow_id` as their key. The selection applies to all attribute groups keyed on `snowplow_id` in your deployment.

### Choose caller identifiers

You can select up to three caller identifiers. Choose the identifiers your application has at the moment it reads attributes. They usually fall into three roles, and each one behaves differently:

| Role | Examples | Appears on | What a read by it returns |
| --- | --- | --- | --- |
| Anonymous ID | `domain_userid`, a mobile device ID, or your own device or cookie ID | Nearly every event | The person who used the device most recently |
| Known ID | `user_id`, or your own customer ID field | Events after the user logs in | The logged-in person, once they've logged in since you selected it |
| Occasional ID | `email`, a loyalty card number, or another field the user provides now and then | Only the events that capture it, such as a newsletter signup or checkout | The person it was last seen with, until it appears on an event again |

The names depend on your Identities configuration. For example, your known ID might be a custom field called `acme_customer_id`.

An identifier stops resolving if it doesn't appear on an event for longer than your attributes keyed on `snowplow_id` keep their data. That's the TTL of your lifetime attributes, 7 days by default, or the period of your longest windowed attribute, whichever is longer. Anonymous and known IDs appear often enough that this rarely matters. An occasional ID can expire between appearances. For example, with the default TTL, an email captured once at signup stops resolving a week later.

{/* TODO: confirm with the team whether occasional IDs expiring is acceptable for M1, or whether redirect keys need their own TTL. */}

### Select caller identifiers

Select the caller identifiers on the `snowplow_id` attribute key.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

{/* TODO: write once the Console UI is final. Add a screenshot to ../../images/. */}

Navigate to **Signals** > **Attribute keys** in Console and open the `snowplow_id` key. Console lists the identifiers from your pipeline's Identities configuration. Select up to three, and save.

</TabItem>
<TabItem value="sdk" label="Python SDK">

{/* TODO: SDK support is pending. Replace this with the SDK example once it's released. */}

Python SDK support for caller identifiers is coming soon.

</TabItem>
</Tabs>

After you change the selection, a new caller identifier resolves from the next event that carries it. You don't need to republish your attribute groups.

To calculate attributes per person, create a stream [attribute group](/docs/signals/attributes/attribute-groups/index.md) and select `snowplow_id` as its attribute key.

## Retrieve attributes by a caller identifier

Read attributes keyed on `snowplow_id` the same way as any other attributes, using a [service or an attribute group](/docs/signals/applications/retrieve-attributes/index.md). Set the attribute key to the name of a caller identifier, and the identifier to its value:

```python
attributes = sp_signals.get_service_attributes(
    name="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

{/* TODO: confirm the SDKs pass any attribute_key name through unchanged, and add a Node.js example. */}

If Signals hasn't seen the identifier value on an event since you selected it, the attributes come back as `null`.

## Supported use cases

Identity resolution is being released in stages. This table shows which use cases the current release supports.

| Use case | Scenario | Status |
| --- | --- | --- |
| [Anonymous to known](#anonymous-to-known) | A user browses anonymously, then logs in | ✅ Supported |
| [Cross-domain](#cross-domain) | A user moves between your sites | ✅ Supported |
| [Shared device](#shared-device) | Several people use the same device | ✅ Supported |
| [Cross-device](#cross-device) | A user switches between devices or browsers | ⚠️ Partly supported |

The [limitations](#limitations-for-every-use-case) at the end of this section apply to all of them.

The examples show what a read returns for one caller identifier of each [role](#choose-caller-identifiers): `domain_userid` as the anonymous ID, `user_id` as the known ID, and `email` as the occasional ID.

{/* TODO: interventions keyed on snowplow_id. Supported in this release, or add a limitation? */}

### Anonymous to known

✅ **Supported.** A user browses anonymously, then logs in to a new account, or to an account they've already logged in to on this device. Identities adds the login to the device's Snowplow ID, so all of the user's activity, including the browsing from before the login, counts towards one Snowplow ID.

<details>
<summary>Example: sign up after browsing</summary>

| Event | Identifiers | Snowplow ID |
| --- | --- | --- |
| Browse a product page | `domain_userid` (`d123`) | `sp_001` |
| Sign up and log in | `domain_userid` (`d123`), `user_id` (`u001`) | `sp_001` |
| Subscribe to the newsletter | `domain_userid` (`d123`), `user_id` (`u001`), `email` (`ann@example.com`) | `sp_001` |

| Read by | Returns |
| --- | --- |
| `domain_userid` (`d123`) | `sp_001`, from the first event onwards |
| `user_id` (`u001`) | `sp_001`, including the product page view from before the login, once the login event has arrived |
| `email` (`ann@example.com`) | `sp_001`, once the newsletter event has arrived. Before that, `null` |

</details>

### Cross-domain

✅ **Supported.** A user moves from one of your sites to another with a different cookie domain. With [cross-domain tracking](/docs/identities/concepts/cross-domain-tracking/index.md) enabled in Identities, the second site's `domain_userid` is linked to the first site's Snowplow ID, so the activity on both sites counts towards one Snowplow ID.

If the user has visited the second site before, its `domain_userid` already has its own Snowplow ID, and Identities merges the two. This works like [cross-device](#cross-device).

<details>
<summary>Example: follow a link to a sister site</summary>

| Event | Identifiers | Snowplow ID |
| --- | --- | --- |
| Log in on `brandA.com` | `domain_userid` (`dA1`), `user_id` (`u001`) | `sp_001` |
| Follow a link to `brandB.com` for the first time | `domain_userid` (`dB1`), `refr_domain_userid` (`dA1`) | `sp_001` |

| Read by | Returns |
| --- | --- |
| `domain_userid` (`dA1`) or `domain_userid` (`dB1`) | `sp_001`, with the activity on both sites |
| `user_id` (`u001`) | `sp_001`, with the activity on both sites, even though the user hasn't logged in on `brandB.com` |
| `email` | Not captured in this example. It works as in [anonymous to known](#anonymous-to-known) |

</details>

### Shared device

✅ **Supported**, when `user_id` is marked as a [unique identifier](/docs/identities/concepts/unique-identifiers/index.md) in Identities. Each person who logs in keeps their own Snowplow ID. Reads by a known or occasional ID return the right person. Reads by the device's anonymous ID return whoever used the device most recently.

To stop one person's anonymous activity counting towards the next, [reset identifiers on logout](/docs/identities/configuration/choosing-identifiers/index.md#reset-identifiers-on-logout).

<details>
<summary>Example: two people log in on a family tablet</summary>

| Event | Identifiers | Snowplow ID |
| --- | --- | --- |
| Ann logs in and checks out on the family tablet | `domain_userid` (`d123`), `user_id` (`u001`), `email` (`ann@example.com`) | `sp_001` |
| Ben logs in on the same tablet | `domain_userid` (`d123`), `user_id` (`u002`) | `sp_002` |

| Read by | Returns |
| --- | --- |
| `domain_userid` (`d123`) | `sp_002`, Ben, because he used the tablet last |
| `user_id` (`u001`) or `email` (`ann@example.com`) | `sp_001`, Ann |
| `user_id` (`u002`) | `sp_002`, Ben |

</details>

### Cross-device

⚠️ **Partly supported.** A user browses anonymously on a device or browser that isn't linked to their account yet, for example a new phone or a browser with cleared cookies, then logs in to their existing account. The device already has its own Snowplow ID, so Identities [merges](/docs/identities/concepts/merges/index.md) the two and keeps the older one. All new activity counts towards the Snowplow ID that's kept.

What isn't supported yet:

* **Activity from before the merge stays split.** Attributes calculated under the other Snowplow ID before the merge aren't added to the one that's kept.
* **Identifiers switch over only when they next appear.** An identifier that hasn't appeared on an event since the merge keeps returning the other Snowplow ID until it does. For an anonymous ID, this is usually the first request of a returning visit. For an occasional ID, such as an email, it can last until the user next provides it.

<details>
<summary>Example: log in on a new phone</summary>

| Event | Identifiers | Snowplow ID |
| --- | --- | --- |
| Earlier, on the website | `domain_userid` (`d123`), `user_id` (`u001`), `email` (`ann@example.com`) | `sp_001` |
| Browse the app anonymously on a new phone | `domain_userid` (`p456`) | `sp_002` |
| Log in on the phone | `domain_userid` (`p456`), `user_id` (`u001`) | `sp_001`, after merging `sp_002` into it |

| Read by | Returns |
| --- | --- |
| `domain_userid` (`d123`), `user_id` (`u001`), or `email` (`ann@example.com`) | `sp_001`: the website activity and everything from the login onwards, without the phone browsing from before the login |
| `domain_userid` (`p456`) | Before the login, `sp_002`: the phone browsing only. From the login onwards, the same as the row above |

If the device's Snowplow ID is the older one, for example because the user browsed the app before creating their account on the website, the device's ID is kept instead. The account's activity from before the merge is then the part that's missing.

</details>

<details>
<summary>Example: return to a laptop after logging in on a phone</summary>

| Event | Identifiers | Snowplow ID |
| --- | --- | --- |
| Monday: sign up on the laptop | `domain_userid` (`L1`), `user_id` (`u001`), `email` (`ann@example.com`) | `sp_002` |
| Tuesday: log in on the phone, which has an older Snowplow ID | `domain_userid` (`P1`), `user_id` (`u001`) | `sp_001`, after merging `sp_002` into it |
| Wednesday: first page view back on the laptop | `domain_userid` (`L1`) | `sp_001` |

| Read by | Returns on Wednesday |
| --- | --- |
| `user_id` (`u001`) or `domain_userid` (`P1`) | `sp_001`: the phone activity and everything since Tuesday, without Monday's laptop activity |
| `domain_userid` (`L1`) | Before the page view, `sp_002`: Monday's laptop activity only. After it, the same as the row above |
| `email` (`ann@example.com`) | `sp_002`: Monday's laptop activity only, until an event with the email arrives |

</details>

### Limitations for every use case

These apply whichever use case you're working with:

* **No activity from before you enable identity resolution.** An identifier resolves to its person only after it appears on an event sent after you select it as a caller identifier. Events from before that aren't included.
* **Occasional IDs can expire.** An identifier that doesn't appear on an event for longer than your attributes keep their data stops resolving. See [Choose caller identifiers](#choose-caller-identifiers).
* **Stream attribute groups only.** Attribute groups keyed on `snowplow_id` can't use a [warehouse source](/docs/signals/attributes/warehouse-config/index.md) or backfill.
* **Deleting by identifier doesn't delete the person's attributes.** Deleting data for a caller identifier stops it resolving to the person, but the attributes calculated for their Snowplow ID remain.
* **An identifier can briefly resolve to the wrong person.** If Identities can't resolve an event in time, it attaches a [fallback ID](/docs/identities/concepts/index.md#fallback-ids-and-identifier-priority) to it. Until the next event with that identifier arrives, reads by the identifier can return the wrong attributes, or none.

{/* TODO: confirm with Identities how often fallback IDs happen in production (snowplow-identities batch_processor.go fallback path). If they're rare enough, drop the last bullet. */}

:::warning[Identity links come from your events]
Signals links an identifier to a person based on the identifiers that arrive on your events. A request that sends someone else's identifier on an event can link it to their Snowplow ID, and a read by a caller identifier returns the whole person's attributes. Only read attributes by identifiers your application has verified, for example a `user_id` from an authenticated session.
:::

{/* TODO: review the warning wording with the team. Mitigations are planned (M5). */}

```mdx-code-block
import SignalsFreeTier from "@site/docs/reusable/signals-free-tier/_index.md"

<SignalsFreeTier/>
```
