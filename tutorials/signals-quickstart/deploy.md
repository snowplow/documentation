---
position: 4.5
title: Deploy configuration
---

Once you're satisfied with the view, deploy it to the API using the `apply` method:

```python
sp_signals.apply([my_attribute_view])
```

This makes the view live, and events will start being processed based on the defined attributes.
