---
title: "Track the account entity"
position: 2
sidebar_label: "Track the account entity"
description: "Create an account entity schema, attach it to task_completed events, and track activity from multiple users of the same B2B account with the Snowplow Python tracker."
keywords: ["snowplow python tracker", "entity", "account entity", "multi-tenant tracking", "subject"]
date: "2026-07-29"
---

In this section you'll make your project-management app's tracking multi-tenant. You'll create a [schema](/docs/fundamentals/schemas/) for an `account` [entity](/docs/fundamentals/entities/), attach it to `task_completed` events, and track activity from two different users who belong to the same account.

The key idea is identity: every event carries the account's `account_id` in the entity. Signals later uses that property as the attribute key, so all events with the same `account_id` roll up into one account profile, no matter which user sent them.

## Install the SDKs

Install both Python SDKs. You'll use the tracker in this section, and the Signals SDK in the next ones.

```bash
pip install snowplow-tracker snowplow-signals
```

This tutorial is written against `snowplow-tracker` 1.1.0 and `snowplow-signals` 0.4.6. If your installed versions differ, check the [Python tracker](/docs/sources/python-tracker/) and [Signals](/docs/signals/) documentation for any signature changes.

## Create the schemas

Your app emits a custom `task_completed` [self-describing event](/docs/fundamentals/events/#self-describing-events) and attaches an `account` entity to it. Both need a schema before Signals can read their properties.

Create two [data structures](/docs/event-studio/data-structures/) in Console (or with the [Snowplow CLI](/docs/api-reference/snowplow-cli/)). Use the vendor `com.example` to match the rest of this tutorial. If you completed the [Python tracking and Signals tutorial](/tutorials/python-tracking-and-signals/set-up-tracking), you already have the `task_completed` event schema.

A `task_completed` event schema with these properties:

* `task_id` (string)
* `priority` (string: `low`, `medium`, or `high`)

An `account` entity schema with these properties:

* `account_id` (string, carrying a UUID)
* `plan` (string)

Once published, these resolve to the following Iglu URIs, which you'll reference from both the tracker and Signals:

* `iglu:com.example/task_completed/jsonschema/1-0-0`
* `iglu:com.example/account/jsonschema/1-0-0`

:::tip[Use your own vendor]
`com.example` is a placeholder. In a real project, use your organization's vendor (for example `com.acme`) consistently across your schemas, tracking code, and Signals definitions.
:::

## Use a UUID for the account ID

Choose the `account_id` format deliberately, because it becomes a Signals attribute key identifier. You'll retrieve attributes by it, and target interventions at it.

The intervention subscription endpoint doesn't perform authentication: knowing an attribute key ID grants access to its interventions. That's why Signals requires key ID values to be [non-enumerable](/docs/signals/applications/subscribe/), so they can't be guessed. In practice, Signals only accepts canonically formatted UUIDs when you subscribe to interventions, and rejects other formats with a `400` error. Attribute computation and retrieval accept any string value, but because this tutorial subscribes to account-level interventions, use a UUID for every `account_id`.

In a real application, don't expose your internal account identifiers. Map each account to a stable UUID (for example, a deterministic UUID derived from the internal ID) and use that mapped value in the entity.

## Initialize the tracker

Create a tracker using the `Snowplow` factory, which is the recommended initialization path. To simulate a team, create a `Subject` for each of two users in the same account.

Each `Subject` sets two identifiers:

* `user_id`: the signed-in user's ID, as set by your authentication layer
* `domain_userid`: a device-level identifier. Web and mobile trackers set this automatically, but server-side events don't carry one unless you set it. The account-level attributes you'll define later count distinct `domain_userid` values, so set it explicitly here to represent each user's device.

```python
import uuid
from snowplow_tracker import Snowplow, Subject

COLLECTOR_URL = "YOUR_COLLECTOR_HOST"  # e.g. https://collector.acme.com

# One B2B account, identified by a UUID.
account_id = str(uuid.uuid4())

# Two users who belong to the account.
alice = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))
bob = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))

Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
)
tracker = Snowplow.get_tracker("project-app")
```

In production, you wouldn't mint these identifiers with `uuid.uuid4()` on every run. The account UUID comes from your tenant model, and each user's identifiers come from your authentication layer. What matters is that the same `account_id` value appears on every event from that account.

## Track team activity

Define the `account` entity once, then attach it to every event as context. Pass each event's `Subject` with the `event_subject` argument, so one tracker can send events on behalf of different users.

```python
from snowplow_tracker import SelfDescribing, SelfDescribingJson

# The account entity, attached to every event from this account.
account = SelfDescribingJson(
    "iglu:com.example/account/jsonschema/1-0-0",
    {"account_id": account_id, "plan": "team"},
)

# Each team member completes six tasks.
for member in (alice, bob):
    for _ in range(6):
        tracker.track(
            SelfDescribing(
                SelfDescribingJson(
                    "iglu:com.example/task_completed/jsonschema/1-0-0",
                    {"task_id": str(uuid.uuid4()), "priority": "high"},
                ),
                event_subject=member,
                context=[account],
            )
        )

tracker.flush()
```

By default the tracker batches events before sending them, so the `tracker.flush()` call forces any buffered events to be sent immediately.

Send these events now, rather than waiting until the Signals definitions exist. The Console property picker you'll use in the next section lists entities from your pipeline's data catalog, which is built from processed events, so tracking first is what makes the `account` entity selectable there.

## Troubleshooting

* `SelfDescribing.__init__() got an unexpected keyword argument 'event'`: `SelfDescribing` takes the `SelfDescribingJson` as its first positional argument. The keyword form is `event_json=`, not `event=`.
* Events arrive but the entity is missing: pass the entity in the `context` list argument, not inside the event's data payload. The entity must be a `SelfDescribingJson` referencing the `account` schema.
* Events fail validation: check that the entity payload matches the schema exactly, including property names. Failed events appear in Console under **Data quality**.
* All events attributed to one user: pass `event_subject=member` on each `track()` call. Without it, events carry no per-user identifiers.
