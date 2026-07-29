---
title: "Define account attributes"
position: 4
sidebar_label: "Define account attributes"
description: "Define a stream attribute group keyed on the custom account_id attribute key, with distinct-user, counter, and last-value aggregations, then publish it with a service."
keywords: ["stream attribute group", "approx_count_distinct", "aggregations", "signals python sdk", "service"]
date: "2026-07-29"
---

With the attribute key defined, you can now describe what Signals should compute for each account. In this section you'll connect to Signals and define two things with the Python SDK:

* an [attribute group](/docs/signals/attributes/attribute-groups/) that computes three account-level attributes
* a [service](/docs/signals/applications/services/) that bundles the group for easy retrieval

You can also define these in the Console UI. This tutorial uses the [Python SDK](/docs/signals/connection/) so the whole loop lives in code.

## Connect to Signals

The `Signals` client takes four keyword arguments, and all four are required. To find them:

1. Go to **Signals** > **Overview** in [Snowplow Console](https://console.snowplowanalytics.com) to find your **Signals API URL** and **Organization ID**.
2. Generate an **API key** and **API key ID** in Console. Both are UUIDs, and both are required together.

See the [connection documentation](/docs/signals/connection/) for details.

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_API_URL,        # must include https://, e.g. https://YOUR_ID.signals.snowplowanalytics.com
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

## Define the attribute group

A `StreamAttributeGroup` computes attributes from the live event stream for a given attribute key. Setting `attribute_key=account_id_key` is what makes every attribute in this group account-level: events from all of an account's users update the same profile.

If you created the key in Console, define the same `AttributeKey` object in Python anyway, exactly as shown in the previous section. It refers to the same key by name, and the group definition needs the object to reference it.

The three attributes deliberately use three different aggregations:

* `active_users` uses `approx_count_distinct`, which approximates the number of unique values of a property. Pointed at the `domain_userid` atomic property, it counts how many distinct users have been active in the account.
* `tasks_completed_count` uses `counter`, which counts matching events without reading a property.
* `last_plan` uses `last`, which keeps the most recent value of a property. Pointed at the entity's `plan` property, it always reflects the account's current plan.

```python
from datetime import timedelta
from snowplow_signals import (
    Attribute,
    AtomicProperty,
    EntityProperty,
    Event,
    StreamAttributeGroup,
)

OWNER = "you@example.com"  # a valid email; identifies the owner of the definition

task_completed = Event(vendor="com.example", name="task_completed", version="1-0-0")

account_activity = StreamAttributeGroup(
    name="account_activity",
    version=1,
    attribute_key=account_id_key,
    owner=OWNER,
    description="Cross-user activity for each B2B account",
    attributes=[
        Attribute(
            name="active_users",
            type="int32",
            aggregation="approx_count_distinct",
            events=[task_completed],
            property=AtomicProperty(name="domain_userid"),
            period=timedelta(days=7),
        ),
        Attribute(
            name="tasks_completed_count",
            type="int32",
            aggregation="counter",
            events=[task_completed],
            period=timedelta(days=7),
        ),
        Attribute(
            name="last_plan",
            type="string",
            aggregation="last",
            events=[task_completed],
            property=EntityProperty(
                vendor="com.example",
                name="account",
                major_version=1,
                path="plan",
            ),
            period=timedelta(days=7),
        ),
    ],
)
```

Every attribute uses a rolling seven-day window, so the values describe the account's trailing week of activity. `approx_count_distinct` uses [HyperLogLog](https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/) internally: at high cardinality the count is a close approximation, and at the low counts in this tutorial it's exact. See [attributes](/docs/signals/attributes/attributes/) for all available aggregations.

## Group the attributes into a service

A service is a named bundle of attribute groups. Retrieving by service is the recommended way to read attributes in an application, because you fetch everything you need in one call.

```python
from snowplow_signals import Service

account_service = Service(
    name="account_activity_service",
    owner=OWNER,
    attribute_groups=[account_activity],
)
```

## Publish your definitions

Definitions don't take effect until you publish them. Include the attribute key in the publish call: an attribute group can only be published if its key already exists in Signals, and publishing the key first in the same call satisfies that. If you already created the key in Console, publishing it again is harmless.

```python
sp_signals.publish([account_id_key, account_activity, account_service])
```

Open **Signals** in Console to confirm that your attribute key, attribute group, and service now appear there.

Publishing isn't instant: it can take a minute or two for the definitions to be applied to the streaming engine. Signals computes attributes only from events processed after that point, so the events you tracked earlier don't contribute to the values, and neither do events that arrive before the definitions are applied.

## Troubleshooting

* `422: Attribute key 'account_id' does not exist`: the group was published before the key. Include the `AttributeKey` object in the `publish()` list, before the attribute group, or create the key in Console first.
* `422: ... aggregation requires a property to be set`: value-reading aggregations such as `approx_count_distinct` and `last` need a `property` (an `AtomicProperty`, `EventProperty`, or `EntityProperty`). Only `counter` works without one.
* `owner` validation error: `owner` must be a valid email address.
* Attributes stay empty later: check that the `EntityProperty` vendor, name, and version match the schema exactly, and that your events actually attach the `account` entity.
