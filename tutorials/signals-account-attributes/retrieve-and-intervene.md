---
title: "Retrieve attributes and intervene on account activity"
position: 5
sidebar_label: "Retrieve and intervene"
description: "Retrieve live account-level attributes by account_id, define an intervention targeting the custom attribute key, and run the full multi-user loop end to end."
keywords: ["retrieve signals attributes", "rule intervention", "subscribe to interventions", "account-level intervention", "custom attribute key"]
date: "2026-07-30"
---

With definitions published, your application can look up any account's live profile and react when the whole team's activity crosses a threshold. Everything keys on `account_id`, so it works the same no matter which user triggered the events.

## Retrieve attributes by account

Retrieve an account's attributes through the service you defined. Pass the custom key's name as `attribute_key`, and the account's UUID as the `identifier`. Use the same `account_id` value that your events carry in the `account` entity, which is the value printed by the tracking section.

```python
attributes = sp_signals.get_service_attributes(
    name="account_activity_service",
    attribute_key="account_id",
    identifier=account_id,
)

print("active_users:", attributes.get("active_users"))
print("tasks_completed_count:", attributes.get("tasks_completed_count"))
print("last_plan:", attributes.get("last_plan"))
```

The result is a plain dictionary keyed by attribute name. Read it with `.get()` rather than `attributes["..."]`, so an attribute Signals hasn't computed yet returns `None` instead of raising `KeyError` halfway through your output.

The first time you run this, expect `0`, `None`, and `None`: the empty profile described in the previous section. Signals computes attributes only from events processed after your published definitions reached the streaming engine, so the events you tracked earlier don't appear. Once a minute or two has passed since publishing, re-run the **Track team activity** block from the [tracking section](/tutorials/signals-account-attributes/track-the-account-entity#track-team-activity) to send fresh events under the same `account_id`, then retrieve again.

:::note[Allow for propagation latency]
Attributes are computed from a live stream, so there's a short delay between tracking an event and the updated attribute becoming available. If a value looks stale or comes back as `None` immediately after tracking, wait a moment and retrieve again, rather than assuming the value is wrong.
:::

Retrieving through a service is one of several options. See [retrieve attributes](/docs/signals/applications/retrieve-attributes/) for the alternatives, including reading a single attribute group directly, and the Node.js SDK and HTTP API equivalents.

## Define an account-level intervention

An [intervention](/docs/signals/interventions/) fires when its criteria are met for a target. This one fires when an account's team completes ten or more tasks in the rolling window: a natural moment to suggest an upgrade or invite more of the team.

Reference the attribute as `group_name:attribute_name`, and target the custom key with a `LinkAttributeKey`. Targeting `account_id` means the intervention is delivered for the account, not for any individual user.

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriterion,
    LinkAttributeKey,
)

account_expansion_nudge = RuleIntervention(
    name="account_expansion_nudge",
    version=1,
    owner=OWNER,
    description="Fire when an account's team completes 10 or more tasks in the period",
    criteria=InterventionCriterion(
        attribute="account_activity:tasks_completed_count",
        operator=">=",
        value=10,
    ),
    target_attribute_keys=[LinkAttributeKey(name="account_id")],
)

sp_signals.publish([account_expansion_nudge])
```

A single condition goes straight into `criteria`. To combine several, wrap them in `InterventionCriteriaAll` or `InterventionCriteriaAny`.

`target_attribute_keys` is technically optional. Left out, it defaults to the attribute keys of the groups named in the criteria, which here is `account_id` anyway. Set it explicitly when you want the targeting to be obvious to the next person reading the definition, or when your criteria span groups with different keys.

## Subscribe to account interventions

Subscribe to interventions for the accounts you care about by their key values. This is where the UUID requirement from the tracking section pays off: the subscription endpoint only accepts UUID-formatted identifiers.

```python
import queue
from snowplow_signals import AttributeKeyIdentifiers

targets = AttributeKeyIdentifiers({"account_id": [account_id]})

subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

# Block until an intervention arrives. This account crossed the threshold
# before anything was subscribed to it, so there's nothing left to deliver and
# queue.Empty is the expected outcome. The full script below triggers the
# intervention for real, on a fresh account.
try:
    print("Received:", subscription.get(timeout=30))
except queue.Empty:
    print("No intervention within the timeout")
finally:
    subscription.stop()
```

The handler runs for every intervention as it arrives, and `subscription.get()` additionally returns each one, blocking until an intervention is available or the timeout raises `queue.Empty`. In your app, the handler is where you'd act, for example by notifying the account's admin that the team is outgrowing its plan.

:::note[A successful `start()` proves nothing]
`subscription.start()` returns immediately whatever happens, because it only builds the request and hands it to a background thread. If the request is rejected, for instance because the credentials are wrong or an identifier isn't a UUID, you get a traceback from a thread named `SignalsInterventions-` followed by a number, while your own code waits out the full timeout and then raises `queue.Empty`. When nothing arrives, search your output for that thread name before concluding that the intervention never fired.

To prove the delivery path independently of your criteria, open the intervention in Console, find **Test this intervention**, enter an `account_id` value, and click **Send**. A subscription listening for that value receives the intervention within a few seconds.
:::

:::note[Interventions fire only once per target]
An intervention is sent only the first time its criteria are met for a given target. Re-running with the same `account_id` won't fire it again. To test repeatedly, mint a fresh `account_id` (a new UUID) and track enough `task_completed` events to cross the threshold under that new account.
:::

## Put it all together

Here's the full loop in one script: simulate a two-person team crossing the threshold, retrieve the live account attributes, and catch the intervention. Subscribe before tracking, so the subscription is listening when the threshold is crossed. It assumes the attribute key, attribute group, service, and intervention from the previous pages are already published, and it reads your Signals credentials from the same environment variables.

```python
import os
import queue
import sys
import time
import uuid
from snowplow_tracker import (
    EmitterConfiguration,
    SelfDescribing,
    SelfDescribingJson,
    Snowplow,
    Subject,
)
from snowplow_signals import AttributeKeyIdentifiers, Signals

# --- Configuration ---
COLLECTOR_URL = "https://YOUR_COLLECTOR_HOST"  # your Collector endpoint, including https://

if "YOUR_" in COLLECTOR_URL:
    sys.exit("Set COLLECTOR_URL to your own Collector endpoint before running.")

# --- Identity: one account (a UUID), two team members ---
account_id = str(uuid.uuid4())
print("account_id:", account_id)
alice = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))
bob = Subject().set_user_id(str(uuid.uuid4())).set_domain_user_id(str(uuid.uuid4()))


def on_send_failure(successful_count, unsent_events):
    print(f"Collector rejected {len(unsent_events)} events ({successful_count} sent)")


# --- Tracker. The namespace differs from the earlier snippets, so this script
# --- can run in a session that already created a "project-app" tracker.
tracker = Snowplow.create_tracker(
    namespace="project-app-full-run",
    endpoint=COLLECTOR_URL,
    app_id="project-app-backend",
    emitter_config=EmitterConfiguration(on_failure=on_send_failure),
)

# --- Signals client ---
sp_signals = Signals(
    api_url=os.environ["SIGNALS_API_URL"],
    api_key=os.environ["SIGNALS_API_KEY"],
    api_key_id=os.environ["SIGNALS_API_KEY_ID"],
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)

# --- Subscribe to the account's interventions before tracking ---
targets = AttributeKeyIdentifiers({"account_id": [account_id]})
subscription = sp_signals.pull_interventions(targets)
subscription.add_handler(lambda intervention: print("INTERVENTION:", intervention))
subscription.start()

try:
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

    # --- Poll until the attributes compute (stream propagation takes a few seconds) ---
    attributes = {}
    for _ in range(12):
        time.sleep(5)
        attributes = sp_signals.get_service_attributes(
            name="account_activity_service",
            attribute_key="account_id",
            identifier=account_id,
        )
        if attributes.get("tasks_completed_count"):
            break
    print("active_users:", attributes.get("active_users"))
    print("tasks_completed_count:", attributes.get("tasks_completed_count"))
    print("last_plan:", attributes.get("last_plan"))

    # --- Wait for the intervention to arrive ---
    print("Waiting for intervention...")
    try:
        print("Received:", subscription.get(timeout=120))
    except queue.Empty:
        print("No intervention within the timeout")
finally:
    subscription.stop()
```

A successful run looks like this, with your own UUIDs and Collector host:

```text
account_id: 1d124aec-2a1d-4316-b0aa-d5b0a1e2962d
INFO:snowplow_tracker.emitters:Emitter initialized with endpoint https://your-collector.example.com/com.snowplowanalytics.snowplow/tp2
INFO:snowplow_tracker.snowplow:Tracker with namespace: 'project-app-full-run' added to Snowplow
INFO:snowplow_tracker.emitters:Attempting to send 10 events
INFO:snowplow_tracker.emitters:Sending POST request to https://your-collector.example.com/com.snowplowanalytics.snowplow/tp2...
INFO:snowplow_tracker.emitters:Attempting to send 2 events
INFO:snowplow_tracker.emitters:Sending POST request to https://your-collector.example.com/com.snowplowanalytics.snowplow/tp2...
INFO:snowplow_tracker.emitters:Finished synchronous flush
INTERVENTION: attributes={} intervention_id='105eed7f-19ff-4093-9a52-e74cac47192a' name='account_expansion_nudge' target_attribute_key=TargetAttributeKey(id='1d124aec-2a1d-4316-b0aa-d5b0a1e2962d', name='account_id') version=1
active_users: 2
tasks_completed_count: 12
last_plan: team
Waiting for intervention...
Received: attributes={} intervention_id='105eed7f-19ff-4093-9a52-e74cac47192a' name='account_expansion_nudge' target_attribute_key=TargetAttributeKey(id='1d124aec-2a1d-4316-b0aa-d5b0a1e2962d', name='account_id') version=1
```

Five things in there are worth reading closely:

* The `INFO` lines come from the tracker, which configures logging on import. Two POST requests carry the twelve events, because the emitter flushes automatically at its default batch size of ten and `tracker.flush()` sends the remaining two.
* `active_users: 2`, even though no single event knows about more than one user. That's the whole point of the custom key: `approx_count_distinct` counted two `domain_userid` values across events keyed on one `account_id`.
* The intervention appears twice, first from the handler and then from `subscription.get()`. It's the same delivery reaching two consumers, not two firings.
* The handler line lands before the attribute prints because the intervention arrived while the script was still polling. That ordering varies between runs.
* `attributes={}` is empty because this intervention carries no attribute payload. Set `payload_attribute_groups` on the `RuleIntervention` to have the group's most recent values delivered with it. See [interventions](/docs/signals/interventions/) for the details.

The script mints a fresh account each run, so you can run it repeatedly. If it prints the empty profile (`0`, `None`, `None`) after all twelve polls, the streaming engine hadn't applied your definitions yet when the events flowed through. Wait a moment and run it again.

## Troubleshooting

If the values or the intervention don't turn up, work through these:

* Attributes come back as the empty profile (`0`, `None`, `None`): confirm you're retrieving with the same `account_id` value your events carry, and that the group and service are published.
* Attributes stay empty even though you tracked events after publishing: the streaming engine applies new definitions with a delay of a minute or two, and events processed before then aren't counted retroactively. Wait, send fresh events, and retrieve again.
* `active_users` is `1` instead of `2`: all the events carried the same `domain_userid`. Check that each `Subject` sets its own `domain_user_id` and that each `track()` call passes the right `event_subject`.
* The subscription thread fails with `400: only UUIDs allowed as attribute key values`: your `account_id` isn't a canonically formatted UUID. Attribute retrieval works with any string, but intervention subscriptions require UUIDs.
* The intervention never arrives: it fires only the first time the threshold is crossed for a target. Use a fresh `account_id` and re-track enough events. Also confirm the intervention is published and its threshold matches how many events you sent.
