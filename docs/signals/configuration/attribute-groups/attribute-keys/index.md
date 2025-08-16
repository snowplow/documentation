---
title: "Entities"
sidebar_position: 15
sidebar_label: "Entities"
---

An `Entity` is the identifier that attributes are calculated against.

Signals includes a number of out-of-the-box entities based on commonly used identifiers from the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

| Entity  | Out-of-the-box identifier           | Type     |
| ------- | ----------------------------------- | -------- |
| User    | `user_id`                           | `string` |
| Device  | `domain_userid` and`network_userid` | `uuid`   |
| Session | `domain_sessionid`                  | `uuid`   |

Import them into your notebook like this:

```python
from snowplow_signals import (
    domain_userid,
    domain_sessionid
    user_id
    network_userid
)
```

All the attributes within a specific attribute group are calculated based on the provided entity.

## Custom entities

You can also define custom entities, which allows you to calculate attributes on any other Snowplow atomic property you want. Atomic properties are those that are defined in the [atomic fields](/docs/fundamentals/canonical-event/index.md#atomic-fields) of the core Snowplow event, not properties tracked as part of an entity.

For example, an entity that groups by `app_id` can be defined as:

```python
app_id_entity = Entity(
    name="app_id_entity",
    description="The id for the app"
    key="app_id",
)
```

## Options

The table below lists all available arguments for a custom `Entity`:

| Argument      | Description                                                                       | Type        | Required? |
| ------------- | --------------------------------------------------------------------------------- | ----------- | --------- |
| `name`        | The name of the entity                                                            | `string`    | ✅         |
| `description` | A description of the entity                                                       | `string`    | ❌         |
| `key`         | The key used to join this entity to an attribute table                            | `string`    | ❌         |
| `owner`       | The owner of the entity, typically the email of the primary maintainer            | `string`    | ❌         |
| `ttl`         | The amount of time that attributes for the entity will live in the Profiles Store | `timedelta` | ❌         |
| `tags`        | String key-value pairs of arbitrary metadata                                      | dictionary  | ❌         |

If a `key` isn't specified, the `name` will be used.

Here's an extended example using all possible arguments, based on the atomic `platform` property:

```python
from datetime import timedelta

platform_entity = Entity(
    name="platform_tracking_entity",
    description="Entity for analyzing user behavior patterns across different platforms (web, mobile, server-side) to understand cross-platform engagement and optimize user experience",
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

Custom entities are added to views in the same way as any of the out-of-the-box entities.
