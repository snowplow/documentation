---
title: "Define services programmatically with the Signals Python SDK"
sidebar_label: "Services"
sidebar_position: 32
description: "Define Service objects that group multiple attribute groups with version control. Use the Python SDK to publish services for stable attribute consumption."
keywords: ["python sdk services", "service configuration", "attribute group grouping"]
---

[Services](/docs/signals/concepts/index.md#services) group attribute groups together for serving to your applications.

There are two ways to define the attribute groups in your service:
- `AttributeGroup` objects: use the objects directly if you have them available in your code
- Dictionaries: refer to the attribute group by name and version, in the format `{"name": "group_name", "version": 1}`

This example code shows both options:

```python
from snowplow_signals import Service

# Refers to the attribute groups by name
my_service = Service(
    name='my_service',
    description='A collection of attribute groups',
    owner="user@company.com",
    attribute_groups=[
        # Specify exact versions using dictionaries
        {"name": "user_attributes", "version": 2},
        {"name": "session_attributes", "version": 1},
    ],
)

# Uses the objects directly
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

The table below lists all available arguments for a `Service`

| Argument           | Description                                                             | Type                             | Required? |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------- | --------- |
| `name`             | The name of the service                                                 | `string`                         | ✅         |
| `description`      | A description of the service                                            | `string`                         | ❌         |
| `owner`            | The owner of the service, typically the email of the primary maintainer | `string`                         | ✅         |
| `attribute_groups` | List of attribute groups with optional version specification            | list of `AttributeGroup` or dict | ❌         |

## Publishing services

Use the [`publish()` method](/docs/signals/connection/index.md#publishing-and-deleting) to register services with Signals. This makes them available for use.

```python
from snowplow_signals import Signals

# Connect to Signals
sp_signals = Signals(
        {{ config }}
    )

# Publish services
sp_signals.publish([
        my_service,
        my_other_service
    ])
```
