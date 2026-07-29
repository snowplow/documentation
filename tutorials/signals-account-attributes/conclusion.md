---
title: "Conclusion"
position: 6
sidebar_label: "Conclusion"
description: "Recap of building account-level attributes with a custom Signals attribute key, with variations and next steps."
keywords: ["snowplow signals", "custom attribute keys", "account-level attributes", "next steps"]
date: "2026-07-29"
---

You've built a real-time, account-level personalization loop for a multi-tenant B2B app. Along the way you:

* attached an `account` entity, carrying a UUID-formatted `account_id`, to events from multiple users
* defined a custom attribute key from the entity property, in Console or with the Signals Python SDK
* computed cross-user account attributes with three different aggregations, including a distinct count of active users
* retrieved an account's live profile by `account_id` and reacted to an account-level intervention

The pattern generalizes to any grouping your events carry. The attribute key doesn't have to mean "account": it's whatever identifier you point it at.

## Variations

Some other custom keys that follow the same recipe:

* A `workspace_id` or `project_id` entity property, for attributes per workspace or project rather than per tenant.
* An event property, such as an `order_id` in a checkout event, for attributes scoped to a business process.
* An atomic property, such as `app_id`, for attributes per application. See [attribute keys](/docs/signals/attributes/attribute-keys/) for the property types you can key on.

Whatever the key, the same rule applies: if you'll target interventions at it, its values must be non-enumerable UUIDs.

## Next steps

* If your account-level facts already live in a warehouse table, for example contract value or seat count, define a [warehouse attribute group](/docs/signals/attributes/warehouse-config/) instead, with an attribute key based on the table's account ID column via `external_column`.
* Explore richer [aggregations and criteria](/docs/signals/attributes/attributes/), such as `unique_list` to hold the set of active user IDs, or criteria filters to count only high-priority tasks.
* Follow the [interventions tutorial](/tutorials/signals-interventions/start) to build out more sophisticated intervention flows in a demo app.
* Read more about the different ways to [subscribe to interventions](/docs/signals/applications/subscribe/), including the browser plugin for web apps.
