---
title: "Stream calculations"
sidebar_position: 49
---

TODO


## Applying views and services

To begin calculating your `Attributes`, you need to apply the `Views` or `Services` to your `Signals` deployment using the `apply` method:


```python
# Assuming signals object has been instantiated using the Signals() class

sp_signals.apply([
        my_service,
        my_other_service
    ])
```

Once applied, the attributes within these Views and Services will be calculated.


## Stream source

When you apply a `View`, a stream source is automatically created. This source calculates the attributes defined in the `View` in real-time.

Here's an example:
```python
view = View(
    name="view",
    version=1,
    entity=domain_sessionid,
    attributes=[page_view_count],
    owner="user@company.com",
)

sp_signals.apply([view]) #Stream Source created
```

Once applied, the stream source begins calculating the attributes in real-time.


## Retrieving calculated values

To access the calculated values, use the `get_online_attributes` method. Here's an example:

```python
# Assuming signals object has been instantiated using the Signals() class

calculated_values = sp_signals.get_online_attributes(
    source=my_service,
    identifiers="abc-123",
)

print(calculated_values)
```

:::warning
**Note:** While you can filter on specific app_ids during testing, both the streaming and batch engines may be configured to process only a subset of relevant app_ids to avoid unnecessary compute. As a result, testing with an arbitrary app_id may not yield expected data if it isn’t included in the configured subset.
:::
