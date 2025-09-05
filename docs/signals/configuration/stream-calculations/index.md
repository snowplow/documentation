---
title: "Calculate in real-time"
sidebar_position: 49
---

To calculate attributes in near real time, apply a `StreamAttributeGroup` [attribute group](/docs/signals/configuration/attribute-groups/index.md) configuration to Signals.

If you've defined a service, you'll also need to apply that configuration to Signals.

Deploy the configurations using the `publish` method:

```python
from snowplow_signals import Signals

# Connect to Signals
# See the main Configuration section for more on this
sp_signals = Signals(
        {{ config }}
    )

# Apply attribute groups
sp_signals.publish([
        my_attribute_group,
        my_other_attribute_group
    ])

# Apply services
sp_signals.publish([
        my_service,
        my_other_service
    ])
```

Once applied, Signals will calculate the attributes within these attribute groups or services from the Snowplow event stream.

If you only want to publish the attribute definitions, and don't want to calculate the attribute values now, use the `online=False` [attribute group configuration option](/docs/signals/configuration/attribute-groups/index.md).
