---
title: "Introduction"
position: 1
sidebar_label: "Introduction"
description: "Aggregate real-time behavior across all users of a B2B account by defining a custom Signals attribute key from an entity property, then trigger account-level interventions."
keywords: ["snowplow signals", "custom attribute key", "account-level attributes", "B2B personalization", "entity property"]
date: "2026-07-30"
---

In this tutorial you'll compute real-time attributes for a B2B account, rather than for an individual user, using a custom Signals [attribute key](/docs/signals/attributes/attribute-keys/).

Signals computes attributes against an attribute key: the identifier that event data is grouped by. The built-in keys (`user_id`, `domain_userid`, `domain_sessionid`, and `network_userid`) all identify a single user, device, or session. That's the right granularity for questions like "how many tasks has this user completed", but it can't answer "how active is this *account*", because an account's activity is spread across many users.

Custom attribute keys solve this. You can key an [attribute group](/docs/signals/attributes/attribute-groups/) on any property in your events: an atomic field, a self-describing event property, or an [entity](/docs/fundamentals/entities/) property. Here you'll key on an `account_id` property carried by an entity, so Signals aggregates behavior from every user in the account into one profile.

To make this concrete, you'll extend the imaginary SaaS project-management app from the [Python tracking and Signals tutorial](/tutorials/python-tracking-and-signals/introduction) to be multi-tenant. Every event carries an `account` entity, and Signals computes account-level attributes: how many users are active, how many tasks the whole team has completed, and which plan the account is on. When the team's activity crosses a threshold, Signals fires an [intervention](/docs/signals/interventions/) so your app can react, for example by suggesting an upgrade.

By the end you'll have working code that:

* Tracks `task_completed` events from multiple users, each carrying an `account` entity
* Defines a custom attribute key from the entity's `account_id` property, in Console or with the Signals Python SDK
* Computes account-level attributes, including a distinct count of active users
* Retrieves an account's live attributes and reacts to an account-level intervention

You don't need to complete the Python tracking and Signals tutorial first, although this tutorial follows the same patterns. All of the code here stands alone.

This tutorial takes about 45 minutes of hands-on work to complete, plus some waiting. Published Signals definitions take a short while to reach the streaming engine, and if you create the attribute key in Console you'll also wait for your new entity to appear in the data catalog. The Python SDK path doesn't depend on the catalog, so choose it if you'd rather not wait.

## Prerequisites

This tutorial assumes that you have:

* A Snowplow pipeline with a [Collector endpoint](/docs/sources/) you can send events to, because Signals computes attributes from your live event stream
* [Signals enabled](/docs/signals/setup/) on your Snowplow account, since the account-level attributes and interventions depend on it
* Python 3.11 or later, because `snowplow-signals` requires it: the package declares `>=3.11,<4.0`, so `pip install` fails on Python 3.9 or 3.10
* Basic familiarity with Python and with [Snowplow events, entities, and schemas](/docs/fundamentals/events/)

You also need Snowplow Console access that lets you do three things: create [data structures](/docs/event-studio/data-structures/), migrate them to production, and create an API key. Only Admin users can migrate a data structure to production, so if you're not an Admin, line up someone who is before you start. You don't need any API keys yet, because you'll generate the Signals credentials as one of the steps.

:::note[Run the code in one session]
The Python snippets build on each other and share variables, including `account_id`, the attribute key, and the `Signals` client. Run them all in one Python session, in page order. A Jupyter notebook or an IPython shell works well for this. The final page also collects everything into a single script if you'd rather run the whole loop at once.
:::

:::note[A full pipeline is required]
The Signals parts of this tutorial compute attributes from real events flowing through your pipeline, so they can't be completed with [Snowplow Micro](/docs/testing/snowplow-micro/) or in a purely local setup. You need a running Snowplow pipeline with Signals enabled.

If you don't have one, you can deploy and use a [Snowplow free trial](https://snowplow.io/get-started/snowplow-free-trial) to follow along.
:::
