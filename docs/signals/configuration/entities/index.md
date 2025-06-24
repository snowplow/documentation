---
title: "Entities"
sidebar_position: 40
sidebar_label: "Entities"
---

### What is an entity?
An `Entity` is the identifier that an attribute is calculated on, for example `user_id` or `session_id`. 

### Built-in entities
Signals has a number of out-of-the-box entities included based on commonly used Snowplow identifiers. These can be accessed as follows:

```python
from snowplow_signals import (
    domain_userid, 
    domain_sessionid
    user_id
    network_userid
)
```
### Defining an entity
You can also define a custom entity, which allows you to calculate attributes on whichever Snowplow atomic property you want. 

For example, an entity that groups by `app_id` can be defined as:

```python
app_id_entity = Entity(
    name="app_id_entity", 
    key="app_id",
    description="The id for the app"    
)

```

This can be passed to a `View` in the same way as any of the out-of-the-box entities.