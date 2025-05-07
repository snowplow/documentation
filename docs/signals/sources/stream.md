---
title: "Stream Sources"
sidebar_position: 20
description: "Stream"
sidebar_label: "Stream Sources"
---

By default, attributes are calculated in stream. This ensures they are available for near real-time personalization. Stream sources are automatically created in the Profile API when you apply a `View`. No additional user configuration is required.

Attributes commonly calculated with a `Stream` source include:

- Latest product viewed
- Search history 
- Number of page views in a session

### Stream Source

When you apply a `View`, a stream source is automatically created. This source calculates the attributes defined in the `View` in real-time.

Here's an example:
```python
view = View(
    name="view",
    version=1,
    entity=domain_sessionid,
    attributes=[page_view_count],

)

signals.apply([view]) #Stream Source created
```

Once applied, the stream source begins calculating the attributes in real-time.

