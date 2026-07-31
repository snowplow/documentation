---
title: "Track the account entity"
position: 2
sidebar_label: "Track the account entity"
description: "Create an account entity schema, attach it to task_completed events, and track activity from multiple users of the same B2B account with the Snowplow Python tracker."
keywords: ["snowplow python tracker", "entity schema", "account entity", "multi-tenant tracking", "server-side tracking", "snowplow assistant"]
date: "2026-07-31"
---

In this section you'll make your project-management app's tracking multi-tenant. You'll create a [schema](/docs/fundamentals/schemas/) for an `account` [entity](/docs/fundamentals/entities/), attach it to `task_completed` events, and track activity from two different users who belong to the same account.

The key idea is identity: every event carries the account's `account_id` in the entity. Signals later uses that property as the attribute key, so all events with the same `account_id` roll up into one account profile, no matter which user sent them.

Start by installing both Python SDKs. You'll use the tracker in this section, and the Signals SDK in the next ones.

```bash
pip install snowplow-tracker snowplow-signals
```

Run this on Python 3.11 or later.

This tutorial is written against `snowplow-tracker` 1.1.0 and `snowplow-signals` 0.4.6. If your installed versions differ, check the [Python tracker](/docs/sources/python-tracker/) and [Signals](/docs/signals/) documentation for any signature changes.

## Create the schemas

Your app emits a custom `task_completed` [self-describing event](/docs/fundamentals/events/#self-describing-events) and attaches an `account` entity to it. Both need a schema before Signals can read their properties.

You'll create two [data structures](/docs/event-studio/data-structures/) in Console, using the vendor `com.example` to match the rest of this tutorial:

* `task_completed`, a self-describing event with a required `task_id` string and an optional `priority` of `low`, `medium`, or `high`
* `account`, an entity with a required `account_id` string carrying a UUID, and an optional `plan` string

The quickest way to build both is to ask the [Snowplow Assistant](/docs/llms-support/console-agent/) in Console. Paste this prompt into the chat:

```text
Create two data structures with the vendor com.example, then deploy both of them to
production.

1. A self-describing event called task_completed, for a task being completed in a
   project-management app, with these properties:
   - task_id: string, required, the identifier of the completed task
   - priority: string, optional, one of low, medium, or high
2. An entity called account, for the B2B account an event belongs to, with these
   properties:
   - account_id: string, required, the unique identifier for the account, as a UUID
   - plan: string, optional, the account's subscription plan

Neither schema should allow additional properties.
```

The Assistant asks you to confirm before it creates anything, and it shows you each schema so you can check it against the list above.

You can also build the data structures by hand in the **Data structures** section of Console, or with the [Snowplow CLI](/docs/api-reference/snowplow-cli/). Whichever route you take, both data structures need to be in production, so that your pipeline validates events against them.

Once in production, these schemas resolve to the following Iglu URIs, which you'll reference from both the tracker and Signals:

* `iglu:com.example/task_completed/jsonschema/1-0-0`
* `iglu:com.example/account/jsonschema/1-0-0`

:::tip[Use your own vendor]
`com.example` is a placeholder. In a real project, use your organization's vendor (for example `com.acme`) consistently across your schemas, tracking code, and Signals definitions.
:::

### Use a UUID for the account ID

Choose the `account_id` format deliberately, because it becomes a Signals attribute key identifier. You'll retrieve attributes by it, and target interventions at it.

The intervention subscription endpoint doesn't perform authentication: knowing an attribute key ID grants access to its interventions. That's why Signals requires key ID values to be [non-enumerable](/docs/signals/applications/subscribe/), so they can't be guessed. In practice, Signals only accepts canonically formatted UUIDs when you subscribe to interventions. Attribute computation and retrieval accept any string value, but because this tutorial subscribes to account-level interventions, use a UUID for every `account_id`.

In a real application, don't expose your internal account identifiers. Map each account to a stable UUID (for example, a deterministic UUID derived from the internal ID) and use that mapped value in the entity.

## Initialize the tracker

Create a tracker using the `Snowplow` factory, which is the recommended initialization path. To simulate a team, create a `Subject` for each of two users in the same account.

Each `Subject` sets two identifiers:

* `user_id`: the signed-in user's ID, as set by your authentication layer
* `domain_userid`: a device-level identifier. Web and mobile trackers set this automatically, but server-side events don't carry one unless you set it. The `active_users` attribute you'll define later counts distinct `domain_userid` values, for [reasons covered on that page](/tutorials/signals-account-attributes/define-account-attributes), so set it explicitly here to represent each user's device.

```python
import uuid
from snowplow_tracker import Snowplow, Subject

COLLECTOR_URL = "https://YOUR_COLLECTOR_HOST"  # your Collector endpoint, including https://

# One B2B account, identified by a UUID.
account_id = str(uuid.uuid4())
print("account_id:", account_id)

# Two users who belong to the account.
alice = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))
bob = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))

tracker = Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
)
```

Once you're running this inside an application, the tracker's [emitter](/docs/sources/python-tracker/emitters/) also accepts success and failure callbacks through `EmitterConfiguration`, so your own code can react to each batch.

Keep the printed `account_id` to hand: you'll retrieve attributes and interventions for exactly that value later. Re-running this block mints a new account, which is the right behavior for testing but means the old value stops being interesting.

In production, you wouldn't mint these identifiers with `uuid.uuid4()` on every run. The account UUID comes from your tenant model, and each user's identifiers come from your authentication layer. What matters is that the same `account_id` value appears on every event from that account.

## Track team activity

Define the `account` entity once, then attach it to every event. Pass each event's `Subject` with the `event_subject` argument, so one tracker can send events on behalf of different users.

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

When a later section asks you to send fresh events, re-run this block only. Re-running the whole tracker section would mint a new `account_id`, and creating a second tracker with the `project-app` namespace in the same session isn't allowed.

## Verify your events in Console

Confirm the events reached your pipeline before you move on.

In [Snowplow Console](https://console.snowplowanalytics.com), go to **Monitoring** > **Collection volumes** and select **Group by App ID**. Your events appear under the `project-app-backend` app ID with a `py-1.1.0` tracker, and the **EVENT COUNT** and **LAST SEEN** columns show the twelve events landing. Use the **Refresh** button to pick up the latest numbers. **Monitoring** > **Data quality** then shows the same period's valid events alongside any failed events.

The [Snowplow Assistant](/docs/llms-support/console-agent/) can run the same check conversationally:

```text
Have my project-app-backend events arrived successfully? Show me the pipeline's
event volume and any failed events for the last hour, and confirm that the
com.example task_completed event and the com.example account entity are both in
the data catalog.
```

Events flowing, no failed events, and both schemas in the data catalog means you're ready for the next section.

## Troubleshooting

These are the failures you're most likely to hit in this section:

* `pip` can't find a version of `snowplow-signals` to install: you're on Python 3.10 or earlier. Create a virtual environment with Python 3.11 or later and install again.
* Creating the tracker fails: you can only call `Snowplow.create_tracker()` once per namespace in a session. Reuse the existing `tracker` variable, or call `Snowplow.remove_tracker_by_namespace("project-app")` first.
* Constructing the event fails: `SelfDescribing` takes the `SelfDescribingJson` as its first positional argument. The keyword form is `event_json=`, not `event=`.
* Events arrive but the entity is missing: pass the entity in the `context` list argument, not inside the event's data payload. The entity must be a `SelfDescribingJson` referencing the `account` schema.
* Events fail validation: check that both data structures are in production, and that the entity payload matches the schema exactly, including property names. Failed events appear in Console under **Monitoring** > **Data quality**.
* All events attributed to one user: pass `event_subject=member` on each `track()` call. Without it, events carry no per-user identifiers.
