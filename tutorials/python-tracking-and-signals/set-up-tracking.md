---
title: "Set up tracking"
position: 2
sidebar_label: "Set up tracking"
description: "Install the Snowplow Python tracker, create the event schema, initialize a tracker with stable user identifiers, and track project activity."
keywords: ["snowplow python tracker", "self-describing event", "subject", "user_id"]
date: "2026-06-19"
---

In this section you'll instrument your project-management app's backend to send events. You'll install the Python tracker, create the [schema](/docs/fundamentals/schemas/) for a custom event, initialize a tracker, and track a user completing some work.

The key idea that makes the rest of the tutorial work is identity: you'll attach a stable `user_id` to every event. Signals later uses that same `user_id` to compute and retrieve attributes for that user. Signals requires attribute key values to be UUID-formatted, so you'll use a UUID as the `user_id`.

## Install the SDKs

Install both Python SDKs. You'll use the tracker in this section, and the Signals SDK in the next ones.

```bash
pip install snowplow-tracker snowplow-signals
```

This tutorial is written against `snowplow-tracker` 1.1.0 and `snowplow-signals` 0.4.3. If your installed versions differ, check the [Python tracker](/docs/sources/python-tracker/) and [Signals](/docs/signals/) documentation for any signature changes.

## Create the event schema

Your app emits a custom `task_completed` [self-describing event](/docs/fundamentals/events/#self-describing-events) and attaches a `project` [entity](/docs/fundamentals/entities/) to events. Both need a schema before Signals can read their properties.

Create two [data structures](/docs/event-studio/data-structures/) in Console (or with the [Snowplow CLI](/docs/api-reference/snowplow-cli/)). Use the vendor `com.example` to match the rest of this tutorial.

A `task_completed` event schema with these properties:

* `task_id` (string)
* `priority` (string: `low`, `medium`, or `high`)

A `project` entity schema with these properties:

* `project_id` (string)
* `plan` (string)

Once published, these resolve to the following Iglu URIs, which you'll reference from both the tracker and Signals:

* `iglu:com.example/task_completed/jsonschema/1-0-0`
* `iglu:com.example/project/jsonschema/1-0-0`

:::tip[Use your own vendor]
`com.example` is a placeholder. In a real project, use your organization's vendor (for example `com.acme`) consistently across your schemas, tracking code, and Signals definitions.
:::

## Initialize the tracker

Create a tracker using the `Snowplow` factory, which is the recommended initialization path. Attach a `Subject` carrying the user's ID so that every event is associated with the same user.

```python
import uuid
from snowplow_tracker import Snowplow, Subject

COLLECTOR_URL = "YOUR_COLLECTOR_HOST"  # e.g. https://collector.acme.com

# The signed-in user's ID. Signals requires attribute key values to be
# UUID-formatted, so use a UUID and reuse it for tracking AND retrieval.
user_id = str(uuid.uuid4())

# The Subject attaches the user_id to every event.
subject = Subject().set_user_id(user_id)

Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
    subject=subject,
)
tracker = Snowplow.get_tracker("project-app")
```

:::warning[Identifiers must be UUID-formatted, and set via a Subject]
Two things will silently cost you all your attributes if you get them wrong:

* **Attach a `Subject` that sets `user_id`.** Without it, your events carry no `user_id`, so Signals can't attribute them to a user and your retrieval calls (which look up by `user_id`) return `None`. Always set `user_id` explicitly and reuse the same value when you retrieve attributes.
* **Use a UUID-formatted value.** Signals requires attribute key values to be UUIDs. A non-UUID value doesn't raise an error, but no attributes will ever compute or be retrievable for it and interventions won't fire. Because this tutorial keys on `user_id`, the `user_id` value itself must be a UUID — so map your application's real user IDs to UUIDs (for example, a deterministic UUID per user) and use that mapped value everywhere.
:::

## Track project activity

Track events by passing an event object to `tracker.track()`. Use the current event classes rather than the deprecated `track_page_view` and `track_self_describing_event` helpers.

```python
from snowplow_tracker import (
    PageView,
    ScreenView,
    StructuredEvent,
    SelfDescribing,
    SelfDescribingJson,
)

# A reusable project entity, attached to events as context.
project = SelfDescribingJson(
    "iglu:com.example/project/jsonschema/1-0-0",
    {"project_id": "proj_42", "plan": "team"},
)

# A page view (for web surfaces) and a screen view (for app surfaces).
tracker.track(PageView(page_url="https://app.example.com/board", page_title="Board"))
tracker.track(ScreenView(id_=str(uuid.uuid4()), name="Project board", context=[project]))

# A structured event for a simple interaction.
tracker.track(StructuredEvent(category="board", action="filter", label="status", property_="in_progress"))

# The custom self-describing event. Pass the SelfDescribingJson positionally.
tracker.track(
    SelfDescribing(
        SelfDescribingJson(
            "iglu:com.example/task_completed/jsonschema/1-0-0",
            {"task_id": "task_99", "priority": "high"},
        ),
        context=[project],
    )
)
```

To simulate a user becoming a power user, track several `task_completed` events. You'll set the threshold for the intervention to 5 later, so send at least that many.

```python
for n in range(6):
    tracker.track(
        SelfDescribing(
            SelfDescribingJson(
                "iglu:com.example/task_completed/jsonschema/1-0-0",
                {"task_id": f"task_{n}", "priority": "high"},
            ),
            context=[project],
        )
    )
```

By default the tracker batches events before sending them. To force any buffered events to be sent immediately, flush the tracker:

```python
tracker.flush()
```

:::note[Controlling when events are sent]
There is no `Snowplow.flush()`. Flush from the tracker instance with `tracker.flush()`. Alternatively, configure the [emitter](/docs/sources/python-tracker/emitters/) with `batch_size=1` to send each event as soon as it's tracked, which is convenient when testing. The emitter has no `buffer_size` argument; use `batch_size` or `buffer_capacity`.
:::

## Troubleshooting

* `SelfDescribing.__init__() got an unexpected keyword argument 'event'`: `SelfDescribing` takes the `SelfDescribingJson` as its first positional argument. The keyword form is `event_json=`, not `event=`.
* `Tracker.__init__() got multiple values for argument 'namespace'`: if you construct components manually, pass everything as keyword arguments — `Tracker(namespace=..., emitters=...)`. The parameter is `emitters` (plural), and accepts a single emitter or a list.
* Events tracked but no attributes later: confirm you attached a `Subject` that sets `user_id`, that the value is UUID-formatted, and that the same `user_id` is used for retrieval.
