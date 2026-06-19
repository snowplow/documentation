---
title: "Define attributes and interventions"
position: 3
sidebar_label: "Define attributes"
description: "Connect to Signals and define an attribute group, a service, and an intervention with the Signals Python SDK, then publish them."
keywords: ["snowplow signals", "attribute group", "service", "intervention", "python sdk"]
date: "2026-06-19"
---

Now that events are flowing, you'll tell Signals what to compute from them. In this section you'll connect to Signals and define three things with the Python SDK:

* an [attribute group](/docs/signals/attributes/attribute-groups/) that counts completed tasks per user
* a [service](/docs/signals/attributes/services/) that bundles the group for easy retrieval
* an [intervention](/docs/signals/interventions/) that fires when a user crosses an engagement threshold

You can also define all of these in the Console UI. This tutorial uses the [Python SDK](/docs/signals/attributes/using-python-sdk/) so the whole loop lives in code.

## Connect to Signals

The `Signals` client takes four keyword arguments, and all four are required. To find them:

1. Go to **Signals** > **Overview** in [Snowplow Console](https://console.snowplowanalytics.com) to find your **Signals API URL** and **Organization ID**.
2. Generate an **API key** and **API key ID** in Console. Both are UUIDs, and both are required together.

See the [connection documentation](/docs/signals/connection/) for details.

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_API_URL,        # must include https://, e.g. https://abc123.signals.snowplowanalytics.com
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,  # required — do not omit
    org_id=ORG_ID,
)
```

:::warning[Common connection mistakes]
* Pass the arguments by keyword. The client takes no positional arguments, and there is no `endpoint=` argument — use `api_url=`.
* The `api_url` must include the `https://` scheme. A bare host raises `UnsupportedProtocol`, and an empty or placeholder URL raises a `ConnectError`.
* `api_key_id` is required alongside `api_key`. Omitting it breaks the connection.
:::

## Define an attribute group

An attribute group computes one or more attributes for a given [attribute key](/docs/signals/concepts/) (the identifier the attributes are calculated against). Here you'll key on `domain_userid`, and count `task_completed` events over a rolling 7-day window.

The `Event` you reference must match the schema you created: same vendor, name, and version.

```python
from datetime import timedelta
from snowplow_signals import StreamAttributeGroup, Attribute, Event, EventProperty, domain_userid

OWNER = "you@example.com"  # a valid email; identifies the owner of the definition

task_completed = Event(vendor="com.example", name="task_completed", version="1-0-0")

engagement_group = StreamAttributeGroup(
    name="project_engagement",
    version=1,
    attribute_key=domain_userid,
    owner=OWNER,
    description="Per-user engagement with the project tool",
    attributes=[
        Attribute(
            name="tasks_completed_count",
            type="int32",
            aggregation="counter",
            events=[task_completed],
            period=timedelta(days=7),
        ),
        Attribute(
            name="last_completed_task_priority",
            type="string",
            aggregation="last",
            events=[task_completed],
            property=EventProperty(
                vendor="com.example",
                name="task_completed",
                major_version=1,
                path="priority",
            ),
            period=timedelta(days=7),
        ),
    ],
)
```

`domain_userid` is a built-in attribute key exported by the SDK. `domain_sessionid` and `user_id` are also available if you want to compute attributes per session or per logged-in user instead.

The `counter` aggregation simply counts matching events, so it needs no property. Aggregations that read a value — such as `last`, `first`, `min`, `max`, `sum`, or `mean` — require a `property` that points to the field to read. Here, `EventProperty` references the `priority` field of the `task_completed` event, using the schema's major version.

## Group attributes into a service

A service is a named bundle of attribute groups. Retrieving by service is the recommended way to read attributes in an application, because you fetch everything you need in one call.

```python
from snowplow_signals import Service

engagement_service = Service(
    name="project_engagement_service",
    owner=OWNER,
    attribute_groups=[engagement_group],
)
```

## Define an intervention

An intervention fires when its criteria are met for a target. Here it fires when a user's `tasks_completed_count` reaches 5.

In an intervention criterion, reference the attribute as `group_name:attribute_name`, and provide the target attribute keys as `LinkAttributeKey` objects.

```python
from snowplow_signals import (
    RuleIntervention,
    InterventionCriteriaAny,
    InterventionCriterion,
    LinkAttributeKey,
)

power_user_nudge = RuleIntervention(
    name="power_user_nudge",
    version=1,
    owner=OWNER,
    description="Fire when a user completes 5 or more tasks in the period",
    criteria=InterventionCriteriaAny(
        any=[
            InterventionCriterion(
                attribute="project_engagement:tasks_completed_count",
                operator=">=",
                value=5,
            ),
        ]
    ),
    target_attribute_keys=[LinkAttributeKey(name="domain_userid")],
)
```

## Publish your definitions

Definitions don't take effect until you publish them. Publish the attribute group, service, and intervention together.

```python
sp_signals.publish([engagement_group, engagement_service, power_user_nudge])
```

Open **Signals** in Console to confirm that your attribute group, service, and intervention now appear there. Signals starts computing attributes from new events as soon as the definitions are published.

## Troubleshooting

* `get_service_attributes() got an unexpected keyword argument 'service'`: the parameter is `name=`, not `service=`. The same applies to `get_group_attributes` (`name=`, not `group_name=`).
* `422: ... aggregation requires a property to be set`: value-reading aggregations such as `last`, `first`, `min`, `max`, `sum`, and `mean` need a `property` (for example an `EventProperty`). Only `counter` works without one.
* Intervention validation error on `attribute`: the attribute must be qualified as `group_name:attribute_name`, for example `project_engagement:tasks_completed_count`.
* Intervention validation error on `target_attribute_keys`: pass `LinkAttributeKey(name="domain_userid")`, not the built-in `domain_userid` attribute key object.
* `owner` validation error: `owner` must be a valid email address.
