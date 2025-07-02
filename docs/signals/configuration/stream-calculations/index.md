---
title: "Calculate in real-time"
sidebar_position: 49
---

To calculate attributes in real time, apply a default (without specified `batch_source`) [view or service](/docs/signals/configuration/views-services/index.md) configuration to Signals.

Apply the configuration using the `apply` method:

```python
from snowplow_signals import Signals

sp_signals = Signals(
        {{ config }} # See the main Configuration section for more on this
    )

# Applying views
sp_signals.apply([
        my_view,
        my_other_view
    ])

# Applying services
sp_signals.apply([
        my_service,
        my_other_service
    ])
```

Once applied, Signals will calculate the attributes within these views or services from the Snowplow event stream.

If you only want to publish the attribute definitions, and don't want to calculate the attribute values now, use the `online=False` [view configuration option](/docs/signals/configuration/views-services/index.md).
