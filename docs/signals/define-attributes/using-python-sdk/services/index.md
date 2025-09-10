---
title: "Services"
sidebar_position: 32
description: "Create services programmatically using the Python SDK to group attribute groups for stable consumption interfaces."
---

[Services](/docs/signals/concepts/index.md#services) group attribute groups together for serving to your applications.

Here's an example showing how to create a service to manage attributes from two attribute groups:

```python
from snowplow_signals import Service

my_service = Service(
    name='my_service',
    description='A collection of attribute groups',
    owner="user@company.com",
    attribute_groups=[
        # Previously defined attribute groups
        my_attribute_group,
        another_attribute_group
    ],
)
```

### Service options

The table below lists all available arguments for a `Service`

| Argument           | Description                                                             | Type        | Required? |
| ------------------ | ----------------------------------------------------------------------- | ----------- | --------- |
| `name`             | The name of the service                                                 | `string`    | ✅         |
| `description`      | A description of the service                                            | `string`    | ❌         |
| `owner`            | The owner of the service, typically the email of the primary maintainer | `string`    | ✅         |
| `attribute_groups` | A list of attribute groups                                              | `timedelta` | ❌         |
| `tags`             | String key-value pairs of arbitrary metadata                            | dictionary  | ❌         |
