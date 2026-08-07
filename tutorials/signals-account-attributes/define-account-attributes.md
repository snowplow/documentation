---
title: "Define account attributes"
position: 4
sidebar_label: "Define account attributes"
description: "Define a stream attribute group keyed on the custom account_id attribute key, with distinct-user, counter, and last-value aggregations, then publish it with a service."
keywords: ["stream attribute group", "distinct count attributes", "signals aggregations", "signals python sdk", "signals service", "snowplow assistant"]
date: "2026-07-31"
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

With the attribute key defined, you can describe what Signals should compute for each account. In this section you'll define two things:

* An [attribute group](/docs/signals/attributes/attribute-groups/) that computes three account-level attributes
* A [service](/docs/signals/applications/services/) that bundles the group, so you can retrieve all of its attributes in one call

Build both in Snowplow Console or with the Signals Python SDK. Either way, start by setting up your Signals credentials, because the next section retrieves attributes and publishes an intervention in Python.

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

OWNER = "YOUR_EMAIL@example.com"  # a valid email; identifies the owner of a definition
if "YOUR_" in OWNER:
    raise SystemExit("Set OWNER to your own email address before publishing.")

sp_signals = Signals(
    api_url=os.environ["SIGNALS_API_URL"],        # must include https://
    api_key=os.environ["SIGNALS_API_KEY"],
    api_key_id=os.environ["SIGNALS_API_KEY_ID"],  # required, don't omit it
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)
```

Every definition you create in Python carries an `owner`, which is why `OWNER` is set here alongside the client. In Console, the **Owner** field defaults to your Console user instead.

## Define the attribute group

A stream attribute group computes attributes from the live event stream for a given attribute key. Keying this group on `account_id` is what makes every attribute in it account-level: events from all of an account's users update the same profile.

The three attributes deliberately use three different aggregations:

* `active_users` uses `approx_count_distinct`, which approximates the number of unique values of a property. Pointed at the `domain_userid` atomic property, it counts how many distinct users have been active in the account.
* `tasks_completed_count` uses `counter`, which counts matching events without reading a property.
* `last_plan` uses `last`, which keeps the most recent value of a property. Pointed at the entity's `plan` property, it always reflects the account's current plan.

`active_users` counts distinct `domain_userid` values rather than `user_id` values, and that choice is worth a moment. Both are [atomic properties](/docs/signals/attributes/attributes/#select-a-property), so swapping one for the other is a one-line change. `domain_userid` is the safer default in a real multi-tenant app, because web and mobile trackers set it on every event, including events sent before anyone signs in, while `user_id` only appears once your app knows who the user is. The cost is that you're counting devices, so one person on a laptop and a phone counts twice. If every event in your app carries a `user_id`, count that instead.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

The quickest way to build the group is to ask the [Snowplow Assistant](/docs/llms-support/console-agent/) in Console. Paste this prompt into the chat:

```text
Create a Signals stream attribute group called account_activity, version 1, keyed on
my custom account_id attribute key, described as "Cross-user activity for each B2B
account". Compute all three attributes from the com.example task_completed event,
version 1-0-0, each over a rolling 7-day period:

- active_users: type int32, approx_count_distinct aggregation of the atomic
  domain_userid property
- tasks_completed_count: type int32, counter aggregation
- last_plan: type string, last aggregation of the plan property from the com.example
  account entity, major version 1

Don't publish it yet.
```

The Assistant shows you the group it's about to create and asks you to confirm. You can also build the group by hand under **Signals** > **Attribute groups** in Console.

</TabItem>
<TabItem value="sdk" label="Python SDK">

Define the group with `StreamAttributeGroup`, setting `attribute_key` to the `AttributeKey` object. Define that key here too, whether you [created it in Console](/tutorials/signals-account-attributes/define-the-attribute-key) or with the SDK. It refers to the same key by name, and republishing an identical key is harmless:

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

```python
from datetime import timedelta
from snowplow_signals import (
    Attribute,
    AtomicProperty,
    EntityProperty,
    Event,
    StreamAttributeGroup,
)

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

</TabItem>
</Tabs>

It's worth knowing what an untouched account looks like, because you'll see it in the next section. For an `account_id` that Signals has no data for, `active_users` comes back as `0` and the other two come back as `None`. The `0` isn't a special case for missing profiles: it's what counting distinct values of nothing produces, whereas a counter and a last-value have no result at all to report. Retrieval code needs to cope with both shapes.

Every attribute uses a rolling seven-day window, so the values describe the account's trailing week of activity. `approx_count_distinct` uses [HyperLogLog](https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/) internally: at high cardinality the count is a close approximation, and at the low counts in this tutorial it's exact. See [attributes](/docs/signals/attributes/attributes/) for all available aggregations.

## Group the attributes into a service

A service is a named bundle of attribute groups. Retrieving by service is the recommended way to read attributes in an application, because you fetch everything you need in one call.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Ask the Assistant for the service as well:

```text
Create a Signals service called account_activity_service that bundles version 1 of my
account_activity attribute group, so that my application can retrieve all three
account attributes in one call. Don't publish it yet.
```

You can also create the service by hand under **Signals** > **Services** in Console.

</TabItem>
<TabItem value="sdk" label="Python SDK">

```python
from snowplow_signals import Service

account_service = Service(
    name="account_activity_service",
    owner=OWNER,
    attribute_groups=[account_activity],
)
```

</TabItem>
</Tabs>

## Publish your definitions

Definitions don't take effect until you publish them. Publish the attribute key first, because an attribute group can only be published once its key exists in Signals.

<Tabs groupId="signals-impl" queryString>
<TabItem value="console" label="Console" default>

Publish each definition from its own page in Console, or ask the Assistant to publish all three in the right order:

```text
Publish my account_id attribute key, then version 1 of my account_activity attribute
group, then my account_activity_service service.
```

</TabItem>
<TabItem value="sdk" label="Python SDK">

Include the attribute key in the same `publish()` call as the group. The order of the list doesn't matter, because the SDK publishes by type, sending all attribute keys first, then groups, then services, then interventions. If you already created the key in Console, publishing it again is harmless.

```python
sp_signals.publish([account_id_key, account_activity, account_service])
```

</TabItem>
</Tabs>

Open **Signals** in Console to confirm that your attribute key, attribute group, and service appear there.

A published attribute group can't be edited in place, so to change an attribute, unpublish the group first, or publish your change as a new version of the group.

:::note[Counting events from before you published]
If you want an attribute group to start life with history rather than at zero, [enable backfill](/docs/signals/attributes/attribute-groups/#backfill-attributes) by setting `backfill_since_tstamp` on the group. Signals then computes the initial values from your `atomic` events table for the period between that timestamp and the publish time. This needs a warehouse connection, and only Snowflake and BigQuery are supported, so it isn't an option on a bare trial pipeline. This tutorial starts from zero instead.
:::

## Troubleshooting

Publishing rejects invalid definitions. If `publish()` fails, check these:

* Every attribute group must be published together with the attribute key it uses, so include the `AttributeKey` object in the `publish()` list alongside the group, or create the key in Console first.
* Value-reading aggregations such as `approx_count_distinct` and `last` need a `property` (an `AtomicProperty`, `EventProperty`, or `EntityProperty`). Only `counter` works without one.
* `owner` must be a valid email address.
* If Python can't read the credential environment variables, they weren't set in the shell that started this session. Export them and restart the session, since a notebook kernel won't pick up variables exported after it launched.
* Attributes stay empty later: check that the `EntityProperty` vendor, name, and version match the schema exactly, and that your events actually attach the `account` entity.
