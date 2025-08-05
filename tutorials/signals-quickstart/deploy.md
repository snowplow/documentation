---
position: 5
title: Deploy configuration
---

Once you're satisfied with the definitions, deploy them to the Signals API using the `apply` method:

```python
sp_signals.apply(
    [my_view, my_service]
)
```

The configuration is now live. Signals will start processing events from your real-time stream, and computing attributes.
