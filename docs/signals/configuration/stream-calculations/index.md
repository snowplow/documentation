---
title: "Calculate in real-time"
sidebar_position: 49
---

To calculate attributes in real time, apply a default (without specified `batch_source`) [view or service](/docs/signals/configuration/views-services/index.md) configuration to Signals.

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

If you only want to publish the attribute definitions, and don't want to calculate the attribute values now, use the `online=False` [view configuration option](/docs/signals/configuration/views-services/index.md).

## Stream volume limit

Attributes are configured based on one or more Snowplow event schemas. For stream attributes, calculation is limited to the most recent 100 instances of the specified event(s) in the pipeline.

For example, you could configure a User entity with a `latest_video_played` stream attribute based on the Snowplow media `play_event` event. The 100 event volume window isn't a problem here, as the calculation is always updated with the latest `play_event` for that user. Conversely, for aggregated attributes based on common event types such as page views, the 100 event limit might limit the analytical accuracy.

For these attributes, or for analyzing user behavior over longer periods, configuring a batch (warehouse) source could be a better fit.
