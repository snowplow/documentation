---
title: "Entities"
sidebar_position: 1
sidebar_label: "Entities"
---

An `Entity` is the foundational identifier that attributes are calculated against.

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

Entities become associated with attributes when you group the attributes into views.

## Custom entities

You can also define custom entities, which allows you to calculate attributes on any other Snowplow atomic property you want. Atomic properties are those that are defined in the [atomic fields](/docs/fundamentals/canonical-event/index.md#atomic-fields) of the core Snowplow event, not properties tracked as part of an entity.

For example, an entity that groups by `app_id` can be defined as:

```python
app_id_entity = Entity(
    name="app_id_entity",
    key="app_id",
    description="The id for the app"
)
```

TODO full config options

TODO another example

Custom entities are used in the same way as any of the out-of-the-box entities.
