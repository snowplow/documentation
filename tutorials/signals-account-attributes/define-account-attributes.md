---
title: "Define account attributes"
position: 4
sidebar_label: "Define account attributes"
description: "Define a stream attribute group keyed on the custom account_id attribute key, with distinct-user, counter, and last-value aggregations, then publish it with a service."
keywords: ["stream attribute group", "distinct count attributes", "signals aggregations", "signals python sdk", "signals service"]
date: "2026-07-30"
---

With the attribute key defined, you can describe what Signals should compute for each account. In this section you'll connect to Signals and define two things with the Python SDK:

* An [attribute group](/docs/signals/attributes/attribute-groups/) that computes three account-level attributes
* A [service](/docs/signals/applications/services/) that bundles the group, so you can retrieve all of its attributes in one call

You can also define these in Console. This tutorial uses the [Python SDK](/docs/signals/connection/) so the whole loop lives in code.

## Connect to Signals

The `Signals` client takes four keyword arguments, and all four are required. To find them:

1. Go to **Signals** > **Overview** in [Snowplow Console](https://console.snowplowanalytics.com) to find your **Signals API URL** and **Organization ID**.
2. Generate an **API key** and **API key ID** in Console. Both are UUIDs, and both are required together.

See the [connection documentation](/docs/signals/connection/) for details.

Your API key is a credential, so keep it out of your source files. Export the four values in the shell you'll start Python from:

```bash
export SIGNALS_API_URL="https://YOUR_ID.signals.snowplowanalytics.com"
export SIGNALS_API_KEY="YOUR_API_KEY"
export SIGNALS_API_KEY_ID="YOUR_API_KEY_ID"
export SNOWPLOW_ORG_ID="YOUR_ORG_ID"
```

Then read them back in Python:

```python
import os
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=os.environ["SIGNALS_API_URL"],        # must include https://
    api_key=os.environ["SIGNALS_API_KEY"],
    api_key_id=os.environ["SIGNALS_API_KEY_ID"],  # required, don't omit it
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)
```

:::tip[Common connection mistakes]
* Pass the arguments by keyword. The client takes no positional arguments, and there is no `endpoint=` argument — use `api_url=`.
* If `api_key`, `api_key_id`, or `org_id` is empty, the constructor raises `ValueError: When auth_mode is 'bdp' api_key, api_key_id, and org_id must be provided`.
* A bad `api_url` isn't caught until the first API call, because the constructor makes no network requests. A URL without a scheme raises `httpx.UnsupportedProtocol`, and a URL whose host doesn't resolve, such as the `YOUR_ID` placeholder, raises `httpx.ConnectError`. Both surface at `publish()`, not at construction.
:::

## Define the attribute group

A `StreamAttributeGroup` computes attributes from the live event stream for a given attribute key. Setting `attribute_key=account_id_key` is what makes every attribute in this group account-level: events from all of an account's users update the same profile.

The group needs the `AttributeKey` object, so define it here whether you [created the key in Console](/tutorials/signals-account-attributes/define-the-attribute-key) or with the SDK. It refers to the same key by name, and republishing an identical key is harmless:

```python
from snowplow_signals import AttributeKey, EntityProperty

account_id_key = AttributeKey(
    name="account_id",
    description="The B2B account the event belongs to",
    property=EntityProperty(
        vendor="com.example",
        name="account",
        major_version=1,
        path="account_id",
    ),
)
```

The three attributes deliberately use three different aggregations:

* `active_users` uses `approx_count_distinct`, which approximates the number of unique values of a property. Pointed at the `domain_userid` atomic property, it counts how many distinct users have been active in the account.
* `tasks_completed_count` uses `counter`, which counts matching events without reading a property.
* `last_plan` uses `last`, which keeps the most recent value of a property. Pointed at the entity's `plan` property, it always reflects the account's current plan.

`active_users` counts distinct `domain_userid` values rather than `user_id` values, and that choice is worth a moment. Both are [atomic properties](/docs/signals/attributes/attributes/#select-a-property), so swapping one for the other is a one-line change. `domain_userid` is the safer default in a real multi-tenant app, because web and mobile trackers set it on every event, including events sent before anyone signs in, while `user_id` only appears once your app knows who the user is. The cost is that you're counting devices, so one person on a laptop and a phone counts twice. If every event in your app carries a `user_id`, count that instead.

```python
from datetime import timedelta
from snowplow_signals import (
    Attribute,
    AtomicProperty,
    EntityProperty,
    Event,
    StreamAttributeGroup,
)

OWNER = "YOUR_EMAIL@example.com"  # a valid email; identifies the owner of the definition
if "YOUR_" in OWNER:
    raise SystemExit("Set OWNER to your own email address before publishing.")

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

The two version arguments in that block look inconsistent, but they express different things. `Event(version="1-0-0")` selects one exact event schema version, and it's optional: leave it out and the attribute is computed from every version of `task_completed`. `EntityProperty(major_version=1)` selects a major version, so the property keeps resolving as you add minor and patch revisions to the `account` schema.

It's worth knowing what an untouched account looks like, because you'll see it in the next section. For an `account_id` that Signals has no data for, `active_users` comes back as `0` and the other two come back as `None`. The `0` isn't a special case for missing profiles: it's what counting distinct values of nothing produces, whereas a counter and a last-value have no result at all to report. Retrieval code needs to cope with both shapes.

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

Definitions don't take effect until you publish them. Include the attribute key in the same `publish()` call as the group: an attribute group can only be published if its key already exists in Signals. The order of the list doesn't matter, because the SDK publishes by type, sending all attribute keys first, then groups, then services, then interventions. If you already created the key in Console, publishing it again is harmless.

```python
sp_signals.publish([account_id_key, account_activity, account_service])
```

Open **Signals** in Console to confirm that your attribute key, attribute group, and service appear there.

Publishing isn't instant: it can take a minute or two for the definitions to be applied to the [streaming engine](/docs/signals/concepts/#stream-source). Signals computes attributes only from events processed after that point, so the events you tracked earlier don't contribute to the values, and neither do events that arrive before the definitions are applied.

:::note[Counting events from before you published]
If you want an attribute group to start life with history rather than at zero, [enable backfill](/docs/signals/attributes/attribute-groups/#backfill-attributes) by setting `backfill_since_tstamp` on the group. Signals then computes the initial values from your `atomic` events table for the period between that timestamp and the publish time. This needs a warehouse connection, and only Snowflake and BigQuery are supported, so it isn't an option on a bare trial pipeline. This tutorial starts from zero instead.
:::

## Troubleshooting

Publishing rejects invalid definitions with a message that usually names the cause:

* `422: Attribute key 'account_id' does not exist`: the key wasn't part of the publish call. Include the `AttributeKey` object in the `publish()` list alongside the group, or create the key in Console first.
* `422: ... aggregation requires a property to be set`: value-reading aggregations such as `approx_count_distinct` and `last` need a `property` (an `AtomicProperty`, `EventProperty`, or `EntityProperty`). Only `counter` works without one.
* `400: Cannot update published attribute group`: a published group is immutable, so editing an attribute and republishing fails. Unpublish it first, as shown in the [cleanup section](/tutorials/signals-account-attributes/conclusion#clean-up), then publish your change.
* `owner` validation error: `owner` must be a valid email address.
* `KeyError: 'SIGNALS_API_KEY'`: the environment variables aren't set in the shell that started this Python session. Export them and restart the session, since a notebook kernel won't pick up variables exported after it launched.
* Attributes stay empty later: check that the `EntityProperty` vendor, name, and version match the schema exactly, and that your events actually attach the `account` entity.
