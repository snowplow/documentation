---
title: "Retrieve attributes and intervene on account activity"
position: 5
sidebar_label: "Retrieve and intervene"
description: "Retrieve live account-level attributes by account_id, define an intervention targeting the custom attribute key, and run the full multi-user loop end to end."
keywords: ["get_service_attributes", "rule intervention", "pull_interventions", "account-level intervention", "custom attribute key"]
date: "2026-07-29"
---

With definitions published, your application can now look up any account's live profile and react when the whole team's activity crosses a threshold. Everything keys on `account_id`, so it works the same no matter which user triggered the events.

## Retrieve attributes by account

Retrieve an account's attributes through the service you defined. Pass the custom key's name as `attribute_key`, and the account's UUID as the `identifier`. Use the same `account_id` value that your events carry in the `account` entity.

```python
attributes = sp_signals.get_service_attributes(
    name="account_activity_service",
    attribute_key="account_id",
    identifier=account_id,
)

print(attributes["active_users"])
print(attributes["tasks_completed_count"])
print(attributes["last_plan"])
```

The result is a plain dictionary, so index it by attribute name.

Expect empty values (`None`, or `0` for `active_users`) the first time you run this. Signals computes attributes only from events processed after your published definitions were applied to the streaming engine, so the events you tracked earlier don't appear. Once a minute or two has passed since publishing, re-run the tracking loop from the [tracking section](/tutorials/signals-account-attributes/track-the-account-entity) to send fresh events, then retrieve again to see real values.

:::note[Allow for propagation latency]
Attributes are computed from a live stream, so there's a short delay between tracking an event and the updated attribute becoming available. If a value looks stale or comes back as `None` immediately after tracking, wait a moment and retrieve again, rather than assuming the value is wrong.
:::

## Define an account-level intervention

An [intervention](/docs/signals/interventions/) fires when its criteria are met for a target. This one fires when an account's team completes ten or more tasks in the rolling window: a natural moment to suggest an upgrade or invite more of the team.

Reference the attribute as `group_name:attribute_name`, and target the custom key with a `LinkAttributeKey`. Targeting `account_id` means the intervention is delivered for the account, not for any individual user.

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriteriaAny,
    InterventionCriterion,
    LinkAttributeKey,
)

account_expansion_nudge = RuleIntervention(
    name="account_expansion_nudge",
    version=1,
    owner=OWNER,
    description="Fire when an account's team completes 10 or more tasks in the period",
    criteria=InterventionCriteriaAny(
        any=[
            InterventionCriterion(
                attribute="account_activity:tasks_completed_count",
                operator=">=",
                value=10,
            ),
        ]
    ),
    target_attribute_keys=[LinkAttributeKey(name="account_id")],
)

sp_signals.publish([account_expansion_nudge])
```

## Subscribe to account interventions

Subscribe to interventions for the accounts you care about by their key values. This is where the UUID requirement from the tracking section pays off: the subscription endpoint only accepts UUID-formatted identifiers.

```python
import queue
from snowplow_signals import AttributeKeyIdentifiers

targets = AttributeKeyIdentifiers({"account_id": [account_id]})

subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

# Block until an intervention arrives. Nothing has crossed the threshold
# since the intervention was published, so expect queue.Empty here.
# The full script below triggers the intervention for real.
try:
    print("Received:", subscription.get(timeout=30))
except queue.Empty:
    print("No intervention within the timeout")

subscription.stop()
```

The handler runs for every intervention as it arrives, and `subscription.get()` additionally returns each one, blocking until an intervention is available or the timeout raises `queue.Empty`. In your app, the handler is where you'd act, for example by notifying the account's admin that the team is outgrowing its plan.

:::warning[Interventions fire only once per target]
An intervention is sent only the first time its criteria are met for a given target. Re-running with the same `account_id` won't fire it again. To test repeatedly, mint a fresh `account_id` (a new UUID) and track enough `task_completed` events to cross the threshold under that new account.
:::

## Put it all together

Here's the full loop in one script: simulate a two-person team crossing the threshold, retrieve the live account attributes, and catch the intervention. Subscribe before tracking, so the subscription is listening when the threshold is crossed. Fill in the placeholder constants before running; the guard exits early if any are left unfilled.

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

# --- Identity: one account (a UUID), two team members ---
account_id = str(uuid.uuid4())
alice = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))
bob = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))

# --- Tracker ---
Snowplow.create_tracker(
    namespace="project-app",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
)
tracker = Snowplow.get_tracker("project-app")

# --- Signals client ---
sp_signals = Signals(
    api_url=SIGNALS_API_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)

# --- Subscribe to the account's interventions before tracking ---
targets = AttributeKeyIdentifiers({"account_id": [account_id]})
subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

# --- The team completes 12 tasks, crossing the threshold of 10 ---
account = SelfDescribingJson(
    "iglu:com.example/account/jsonschema/1-0-0",
    {"account_id": account_id, "plan": "team"},
)
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

# --- Poll for the attributes to compute (stream propagation takes a few seconds) ---
attributes = None
for _ in range(12):
    time.sleep(5)
    attributes = sp_signals.get_service_attributes(
        name="account_activity_service",
        attribute_key="account_id",
        identifier=account_id,
    )
    if attributes.get("tasks_completed_count") is not None:
        break
print("active_users:", attributes["active_users"])
print("tasks_completed_count:", attributes["tasks_completed_count"])
print("last_plan:", attributes["last_plan"])

# --- Wait for the intervention to arrive ---
print("Waiting for intervention...")
intervention = subscription.get(timeout=120)
print("Received:", intervention)
subscription.stop()
```

When you run this, you should see `active_users: 2`, even though the tasks came from two different users' events, followed by the `account_expansion_nudge` intervention once Signals has processed the events. The intervention payload's `target_attribute_key` names the `account_id` key and carries the account's UUID.

The script mints a fresh account each run, so you can run it repeatedly. If you run it within a minute or two of publishing and the values print as `None`, the streaming engine hadn't applied your definitions yet when the events flowed through. Wait a moment and run it again.

## Troubleshooting

* Attributes are `None` or missing: confirm you're retrieving with the same `account_id` value your events carry, and that the group and service are published.
* Attributes stay `None` even though you tracked events after publishing: the streaming engine applies new definitions with a delay of a minute or two, and events processed before then aren't counted retroactively. Wait, send fresh events, and retrieve again.
* `active_users` is `1` instead of `2`: all the events carried the same `domain_userid`. Check that each `Subject` sets its own `domain_user_id` and that each `track()` call passes the right `event_subject`.
* The subscription thread fails with `400: only UUIDs allowed as attribute key values`: your `account_id` isn't a canonically formatted UUID. Attribute retrieval works with any string, but intervention subscriptions require UUIDs.
* The intervention never arrives: it fires only the first time the threshold is crossed for a target. Use a fresh `account_id` and re-track enough events. Also confirm the intervention is published and its threshold matches how many events you sent.
