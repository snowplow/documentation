---
title: "Retrieve attributes and act on interventions"
position: 4
sidebar_label: "Retrieve and act"
description: "Read a user's live attributes from your application with the Signals Python SDK, subscribe to interventions, and run the full track-to-personalize loop."
keywords: ["snowplow signals", "get_service_attributes", "interventions", "real-time personalization"]
date: "2026-06-19"
---

With events flowing and definitions published, you can now read attributes and react to interventions from your application. This is where the personalization actually happens.

## Retrieve attributes from your application

Retrieve a user's attributes through the service you defined. Use the **same** `user_id` that you tracked with, as the `identifier`.

```python
attributes = sp_signals.get_service_attributes(
    name="project_engagement_service",
    attribute_key="user_id",
    identifier=user_id,
)

print(attributes["tasks_completed_count"])
print(attributes["last_completed_task_priority"])
```

The result is a plain dictionary, so index it by attribute name. Don't call `.attributes` on it.

To read a single attribute without a service, use `get_group_attributes`:

```python
attributes = sp_signals.get_group_attributes(
    name="project_engagement",
    version=1,
    attributes=["tasks_completed_count"],
    attribute_key="user_id",
    identifier=user_id,
)
```

:::note[Allow for propagation latency]
Attributes are computed from a live stream, so there's a short delay between tracking an event and the updated attribute becoming available. If a value looks stale or comes back as `None` immediately after tracking, wait a moment and retrieve again, rather than assuming the value is wrong.
:::

## Subscribe to interventions

Instead of polling attributes, you can subscribe to interventions and have Signals notify you when criteria are met. Build the targets from the same identifiers you tracked with, then use the subscription lifecycle.

```python
from snowplow_signals import AttributeKeyIdentifiers

targets = AttributeKeyIdentifiers({"user_id": [user_id]})

subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

# Block until an intervention arrives (optionally with a timeout in seconds).
intervention = subscription.get(timeout=60)
print("Received:", intervention)

subscription.stop()
```

In your app, the handler is where you'd act, for example by showing an in-app prompt inviting the user to add a teammate.

:::warning[Interventions fire only once per target]
An intervention is sent only the first time its criteria are met for a given target. Re-running the script with the same `user_id` won't fire it again. To test repeatedly, mint a fresh `user_id` (a new UUID) and track enough `task_completed` events to cross the threshold under that new identifier.
:::

## Put it all together

Here's the full loop in one script: track events, retrieve the live attribute, and catch the intervention. Subscribe before tracking, so the subscription is listening when the threshold is crossed. Fill in the placeholder constants before running; the guard exits early if any are left unfilled.

```python
import sys
import time
import uuid
from snowplow_tracker import Snowplow, Subject, SelfDescribing, SelfDescribingJson
from snowplow_signals import Signals, AttributeKeyIdentifiers

# --- Configuration ---
COLLECTOR_URL = "YOUR_COLLECTOR_HOST"
SIGNALS_API_URL = "https://YOUR_ID.signals.snowplowanalytics.com"  # must include https://
CONSOLE_API_KEY = "YOUR_API_KEY"
CONSOLE_API_KEY_ID = "YOUR_API_KEY_ID"
ORG_ID = "YOUR_ORG_ID"

if any(
    "YOUR_" in value
    for value in [COLLECTOR_URL, SIGNALS_API_URL, CONSOLE_API_KEY, CONSOLE_API_KEY_ID, ORG_ID]
):
    sys.exit("Fill in the placeholder configuration values before running.")

# --- Identity: a UUID-formatted user_id, reused for tracking and retrieval ---
user_id = str(uuid.uuid4())

# --- Tracker ---
subject = Subject().set_user_id(user_id)
Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
    subject=subject,
)
tracker = Snowplow.get_tracker("project-app")

# --- Signals client ---
sp_signals = Signals(
    api_url=SIGNALS_API_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)

# --- Subscribe to interventions before tracking ---
targets = AttributeKeyIdentifiers({"user_id": [user_id]})
subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

# --- Track enough task completions to cross the threshold ---
project = SelfDescribingJson(
    "iglu:com.example/project/jsonschema/1-0-0",
    {"project_id": "proj_42", "plan": "team"},
)
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
tracker.flush()

# --- Poll for the attribute to compute (stream propagation takes a few seconds) ---
count = None
for _ in range(12):
    time.sleep(5)
    attributes = sp_signals.get_service_attributes(
        name="project_engagement_service",
        attribute_key="user_id",
        identifier=user_id,
    )
    count = attributes["tasks_completed_count"]
    if count is not None:
        break
print("tasks_completed_count:", count)

# --- Wait for the intervention to arrive ---
print("Waiting for intervention...")
intervention = subscription.get(timeout=60)
print("Received:", intervention)
subscription.stop()
```

When you run this, you should see the `tasks_completed_count` value, followed by the `power_user_nudge` intervention once Signals has processed the events.

## Troubleshooting

* `tasks_completed_count` is `None` or missing: confirm the tracker has a `Subject` that sets `user_id`, that you're retrieving with the same `user_id`, and that you've allowed time for the stream to propagate.
* Values never compute, even after waiting: check that your `user_id` is UUID-formatted. A non-UUID value won't error, but Signals never computes or returns attributes for it, and interventions won't fire.
* The intervention never arrives: it fires only the first time the threshold is crossed for a target. Use a fresh `user_id` and re-track enough events. Also confirm the intervention is published and its threshold matches how many events you sent.
