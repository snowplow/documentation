---
title: "Conclusion"
position: 6
sidebar_label: "Conclusion"
description: "Recap of building account-level attributes with a custom Signals attribute key, with variations and next steps."
keywords: ["snowplow signals", "custom attribute keys", "account-level attributes", "next steps"]
date: "2026-07-30"
---

You've built a real-time, account-level personalization loop for a multi-tenant B2B app. Along the way you:

* Attached an `account` entity, carrying a UUID-formatted `account_id`, to events from multiple users
* Defined a custom attribute key from the entity property, in Console or with the Signals Python SDK
* Computed cross-user account attributes with three different aggregations, including a distinct count of active users
* Retrieved an account's live profile by `account_id` and reacted to an account-level intervention

The pattern generalizes to any grouping your events carry. The attribute key doesn't have to mean "account": it's whatever identifier you point it at.

## Clean up

Published definitions keep computing whether or not anything reads them, so tear yours down if this was an experiment. Signals only deletes definitions that aren't published, so unpublish each one first.

Unpublish one definition per call, in reverse dependency order: the intervention, then the service, then the attribute group, then the attribute key. A single `delete()` call is enough afterwards, because `delete()` works through the dependency order for you.

```python
for definition in (
    account_expansion_nudge,
    account_service,
    account_activity,
    account_id_key,
):
    sp_signals.unpublish([definition])

sp_signals.delete(
    [account_expansion_nudge, account_service, account_activity, account_id_key]
)
```

Your two data structures aren't Signals resources and aren't affected. Leave them in place if you want to keep tracking against them, or hide them from the **Data structures** list in Console.

## Variations

These other custom keys follow the same recipe:

* A `workspace_id` or `project_id` entity property, for attributes per workspace or project rather than per tenant
* An event property, such as an `order_id` in a checkout event, for attributes scoped to a business process
* An atomic property, such as `app_id`, for attributes per application. See [attribute keys](/docs/signals/attributes/attribute-keys/) for the property types you can key on.

Whatever the key, the same rule applies: if you'll target interventions at it, its values must be non-enumerable UUIDs.

## Next steps

Where you go from here depends on where your account-level data lives and how much you want to act on it:

* If your account-level facts already live in a warehouse table, for example contract value or seat count, define a [warehouse attribute group](/docs/signals/attributes/warehouse-config/) instead, with an attribute key based on the table's account ID column via `external_column`
* Explore richer [aggregations and criteria](/docs/signals/attributes/attributes/), such as `unique_list` to hold the set of active user IDs, or criteria filters to count only high-priority tasks
* Follow the [interventions tutorial](/tutorials/signals-interventions/start) to build out more sophisticated intervention flows in a demo app
* Read more about the different ways to [subscribe to interventions](/docs/signals/applications/subscribe/), including the browser plugin for web apps
