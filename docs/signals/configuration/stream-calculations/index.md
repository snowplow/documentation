---
title: "Calculate in real-time"
sidebar_position: 49
---

To calculate attributes in real time, apply a default (without specified `batch_source`) [view or service](/docs/signals/configuration/views/index.md) configuration to Signals.

Apply the configuration using the `apply` method:

```python
from snowplow_signals import Signals

# Connect to Signals
# See the main Configuration section for more on this
sp_signals = Signals(
        {{ config }}
    )

# Apply views
sp_signals.apply([
        my_view,
        my_other_view
    ])

# Apply services
sp_signals.apply([
        my_service,
        my_other_service
    ])
```

Once applied, Signals will calculate the attributes within these views or services from the Snowplow event stream.

If you only want to publish the attribute definitions, and don't want to calculate the attribute values now, use the `online=False` [view configuration option](/docs/signals/configuration/views/index.md).
