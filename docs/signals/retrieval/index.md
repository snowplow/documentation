---
title: "Retrieving calculated values from the Profiles Store"
sidebar_position: 1.5
sidebar_label: "Retrieving values TODO"
---

TODO



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
