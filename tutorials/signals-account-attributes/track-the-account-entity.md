---
title: "Track the account entity"
position: 2
sidebar_label: "Track the account entity"
description: "Create an account entity schema, attach it to task_completed events, and track activity from multiple users of the same B2B account with the Snowplow Python tracker."
keywords: ["snowplow python tracker", "entity schema", "account entity", "multi-tenant tracking", "server-side tracking"]
date: "2026-07-30"
---

In this section you'll make your project-management app's tracking multi-tenant. You'll create a [schema](/docs/fundamentals/schemas/) for an `account` [entity](/docs/fundamentals/entities/), attach it to `task_completed` events, and track activity from two different users who belong to the same account.

The key idea is identity: every event carries the account's `account_id` in the entity. Signals later uses that property as the attribute key, so all events with the same `account_id` roll up into one account profile, no matter which user sent them.

Start by installing both Python SDKs. You'll use the tracker in this section, and the Signals SDK in the next ones.

```bash
pip install snowplow-tracker snowplow-signals
```

Run this on Python 3.11 or later. Every published version of `snowplow-signals` declares `>=3.11,<4.0`, so on Python 3.9 or 3.10 the install fails with a "could not find a version that satisfies the requirement" error that doesn't mention your Python version at all.

This tutorial is written against `snowplow-tracker` 1.1.0 and `snowplow-signals` 0.4.6. If your installed versions differ, check the [Python tracker](/docs/sources/python-tracker/) and [Signals](/docs/signals/) documentation for any signature changes.

## Create the schemas

Your app emits a custom `task_completed` [self-describing event](/docs/fundamentals/events/#self-describing-events) and attaches an `account` entity to it. Both need a schema before Signals can read their properties.

Create two [data structures](/docs/event-studio/data-structures/) in Console (or with the [Snowplow CLI](/docs/api-reference/snowplow-cli/)). Use the vendor `com.example` to match the rest of this tutorial. If you completed the [Python tracking and Signals tutorial](/tutorials/python-tracking-and-signals/set-up-tracking), you already have the `task_completed` event schema.

The `task_completed` event schema needs these properties:

* `task_id` (string)
* `priority` (string: `low`, `medium`, or `high`)

The `account` entity schema needs these properties:

* `account_id` (string, carrying a UUID)
* `plan` (string)

Then take each schema all the way to production. A data structure moves through three states, and only the last one is any use to you here:

1. **Draft**: clicking **Save** in Console stores a draft. Drafts aren't deployed anywhere and can't validate events.
2. **Development**: deploying the draft makes the schema available to a development pipeline.
3. **Production**: migrating the version makes it available to your production pipeline. In the **Data structures** list, the **DEVELOPMENT** and **PRODUCTION** columns show which version each environment has.

Migrating to production is an Admin-only action in Console, so ask an Admin to do it if you aren't one. See [promote a data structure](/docs/event-studio/data-structures/#promote-a-data-structure) for the exact steps.

:::warning[Stopping at draft or development breaks everything downstream]
Events validated against a schema your pipeline doesn't have become [failed events](/docs/fundamentals/failed-events/). They never reach Signals, so your attributes stay empty. The symptom looks exactly like Signals being slow, which is why the [confirmation step](#confirm-your-events-arrived) below matters.
:::

Once in production, these schemas resolve to the following Iglu URIs, which you'll reference from both the tracker and Signals:

* `iglu:com.example/task_completed/jsonschema/1-0-0`
* `iglu:com.example/account/jsonschema/1-0-0`

:::tip[Use your own vendor]
`com.example` is a placeholder. In a real project, use your organization's vendor (for example `com.acme`) consistently across your schemas, tracking code, and Signals definitions.
:::

### Use a UUID for the account ID

Choose the `account_id` format deliberately, because it becomes a Signals attribute key identifier. You'll retrieve attributes by it, and target interventions at it.

The intervention subscription endpoint doesn't perform authentication: knowing an attribute key ID grants access to its interventions. That's why Signals requires key ID values to be [non-enumerable](/docs/signals/applications/subscribe/), so they can't be guessed. In practice, Signals only accepts canonically formatted UUIDs when you subscribe to interventions, and rejects other formats with a `400` error. Attribute computation and retrieval accept any string value, but because this tutorial subscribes to account-level interventions, use a UUID for every `account_id`.

In a real application, don't expose your internal account identifiers. Map each account to a stable UUID (for example, a deterministic UUID derived from the internal ID) and use that mapped value in the entity.

## Initialize the tracker

Create a tracker using the `Snowplow` factory, which is the recommended initialization path. To simulate a team, create a `Subject` for each of two users in the same account.

Each `Subject` sets two identifiers:

* `user_id`: the signed-in user's ID, as set by your authentication layer
* `domain_userid`: a device-level identifier. Web and mobile trackers set this automatically, but server-side events don't carry one unless you set it. The `active_users` attribute you'll define later counts distinct `domain_userid` values, for [reasons covered on that page](/tutorials/signals-account-attributes/define-account-attributes), so set it explicitly here to represent each user's device.

Pass an `EmitterConfiguration` with an `on_failure` callback as well. Without it, the tracker sends events into the void silently, as the [confirmation step](#confirm-your-events-arrived) explains.

```python
import uuid
from snowplow_tracker import EmitterConfiguration, Snowplow, Subject

COLLECTOR_URL = "https://YOUR_COLLECTOR_HOST"  # your Collector endpoint, including https://

# One B2B account, identified by a UUID.
account_id = str(uuid.uuid4())
print("account_id:", account_id)

# Two users who belong to the account.
alice = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))
bob = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))


def on_send_failure(successful_count, unsent_events):
    print(f"Collector rejected {len(unsent_events)} events ({successful_count} sent)")


tracker = Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
    emitter_config=EmitterConfiguration(on_failure=on_send_failure),
)
```

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

When a later section asks you to send fresh events, re-run this block only. Running `Snowplow.create_tracker()` a second time with the same namespace raises `TypeError: Tracker with this namespace already exists`, and re-running the whole tracker section would also mint a new `account_id` behind your back.

Send these events before you move on, rather than waiting until the Signals definitions exist. The Console property picker you'll use in the next section lists entities from your pipeline's data catalog, which is built from processed events, so tracking first is what makes the `account` entity selectable there. That catalog is not quick: on a trial pipeline the new entity appeared somewhere between 25 minutes and two hours after the first events.

## Confirm your events arrived

Do this before moving on. Everything from here depends on these events reaching your pipeline and validating, and the tracker is close to useless as a witness:

* `tracker.flush()` never raises, whatever happens
* The emitter logs `Sending POST request to <your collector>...` and `Finished synchronous flush` at INFO level, which proves only that a request was attempted
* A non-2xx answer from the Collector is logged nowhere at all, so your `on_failure` callback is the only thing that makes it visible
* A request that can't connect, for example because the host doesn't resolve, does at least produce a `WARNING`
* Events that reach the Collector and then fail validation look like complete success from the tracker's side, because the Collector accepted them

To watch both failure mechanisms fire, point `COLLECTOR_URL` at a hostname that doesn't exist and re-run this section. You get a warning naming the resolution failure, then your own `Collector rejected 10 events (0 sent)` line, because the callback runs once per failed request rather than once per `flush()`. Ten rather than twelve, because the emitter had already flushed a batch of ten automatically and stops attempting sends once it's backing off.

Then check the pipeline itself, in Console:

1. Go to **Monitoring** > **Collection volumes**. With **Group by App ID** selected, look for `project-app-backend` with a `py-1.1.0` tracker. The **EVENT COUNT** and **LAST SEEN** columns tell you whether your events arrived. The page auto-refreshes every five minutes, so use the **Refresh** button rather than waiting.
2. Go to **Monitoring** > **Data quality**. The overview compares **Valid events** with **Failed events** for the period. Twelve valid events and no new failed events means you're ready for the next section. A jump in failed events means the events arrived but didn't validate, and the **Failed events by type** breakdown names the schema at fault. Failed events can take up to 20 minutes to appear here.

If your events are missing from **Collection volumes** entirely, the problem is between your code and the Collector: check `COLLECTOR_URL` and look for your `on_failure` output. If they're there but counted as failed events, the problem is the schemas: check that both are in production, and that the entity payload matches the schema.

## Troubleshooting

These are the failures you're most likely to hit in this section:

* `pip` reports it "could not find a version that satisfies the requirement snowplow-signals": you're on Python 3.10 or earlier. Create a virtual environment with Python 3.11 or later and install again.
* `TypeError: Tracker with this namespace already exists`: you ran `Snowplow.create_tracker()` twice in the same session. Reuse the existing `tracker` variable, or call `Snowplow.remove_tracker_by_namespace("project-app")` first.
* `SelfDescribing.__init__() got an unexpected keyword argument 'event'`: `SelfDescribing` takes the `SelfDescribingJson` as its first positional argument. The keyword form is `event_json=`, not `event=`.
* Events arrive but the entity is missing: pass the entity in the `context` list argument, not inside the event's data payload. The entity must be a `SelfDescribingJson` referencing the `account` schema.
* Events fail validation: check that both schemas are in production, not still drafts or development-only, and that the entity payload matches the schema exactly, including property names. Failed events appear in Console under **Monitoring** > **Data quality**.
* All events attributed to one user: pass `event_subject=member` on each `track()` call. Without it, events carry no per-user identifiers.
