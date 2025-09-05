---
position: 5
title: Deploy configuration
---

Once you're satisfied with the definitions, deploy them to the Signals API using the `publish` method:

```python
sp_signals.publish(
    [my_attribute_group, my_service]
)
```

The configuration is now live. Signals will start processing events from your real-time stream, and will populate your Profiles Store with computed attributes.
