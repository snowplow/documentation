---
title: "Attribute keys"
sidebar_position: 15
sidebar_label: "Attribute keys"
description: "Define built-in and custom attribute keys to specify the analytical context for attribute calculations in Snowplow Signals."
---

An [attribute key](/docs/signals/concepts/index.md#attribute-keys) is the identifier that attributes are calculated against.

Signals includes a number of out-of-the-box attribute keys based on commonly used identifiers from the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

Import them into your notebook like this:

```python
from snowplow_signals import (
    domain_userid,
    domain_sessionid,
    user_id,
    network_userid,
)
```

## Custom attribute keys

You can also define custom attribute keys, which allows you to calculate attributes on any other Snowplow atomic property you want. Atomic properties are those that are defined in the [atomic fields](/docs/fundamentals/canonical-event/index.md#atomic-fields) of the core Snowplow event, not properties tracked as part of an entity.

For example, an attribute key that groups by `app_id` can be defined as:

```python
from snowplow_signals import AttributeKey

app_id_attribute_key = AttributeKey(
    name="app_id_attribute_key",
    description="The id for the app",
    key="app_id",
)
```

## Options

The table below lists all available arguments for a custom attribute key:

| Argument      | Description                                                                              | Type        | Required? |
| ------------- | ---------------------------------------------------------------------------------------- | ----------- | --------- |
| `name`        | The name of the attribute key                                                            | `string`    | ✅         |
| `description` | A description of the attribute key                                                       | `string`    | ❌         |
| `key`         | The key used to join this attribute key to an attribute table                            | `string`    | ❌         |
| `owner`       | The owner of the attribute key, typically the email of the primary maintainer            | `string`    | ❌         |
| `ttl`         | The amount of time that attributes for the attribute key will live in the Profiles Store | `timedelta` | ❌         |
| `tags`        | String key-value pairs of arbitrary metadata                                             | `dict`      | ❌         |

If a `key` isn't specified, the `name` will be used.

Here's an extended example using all possible arguments, based on the atomic `platform` property:

```python
from datetime import timedelta
from snowplow_signals import AttributeKey

platform_attribute_key = AttributeKey(
    name="platform_tracking_attribute_key",
    description="Attribute key for analyzing user behavior patterns across different platforms (web, mobile, server-side) to understand cross-platform engagement and optimize user experience",
    key="platform",
    owner="analytics-team@snowplow.com",
    ttl=timedelta(days=365),
    tags={
        "category": "platform_analytics",
        "business_unit": "product",
        "created_by": "data_engineering_team"
    }
)
```

Custom attribute keys are added to attribute groups in the same way as any of the out-of-the-box attribute keys.
