---
position: 4.5
title: Define a service for retrieving attributes
---

To retrieve the calculated attributes from the Profiles Store, Signals provides a configuration wrapper called a service. It allows you to retrieve attributes in bulk, from multiple attribute groups. It's how you define the data contract for what the application expects.

To define a service, run this code. Again, update the `owner` field to your email address.

```python
from snowplow_signals import Service

my_service = Service(
    name='my_quickstart_service',
    owner="user@company.com", # UPDATE THIS
    attribute_groups=[my_attribute_group]
)
```
