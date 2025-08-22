---
title: "Services"
sidebar_position: 32
---

Signals has two attribute groupings:
* Views, for defining attributes
* Services, for consuming attributes

Here's an example showing how to create a service to manage attributes from two views:

```python
from snowplow_signals import Service

my_service = Service(
    name='my_service',
    description='A collection of views',
    owner="user@company.com",
    views=[
        # Previously defined views
        my_attribute_view,
        another_view
    ],
)
```

### Service options

The table below lists all available arguments for a `Service`

| Argument      | Description                                                             | Type        | Required? |
| ------------- | ----------------------------------------------------------------------- | ----------- | --------- |
| `name`        | The name of the service                                                 | `string`    | ✅         |
| `description` | A description of the service                                            | `string`    | ❌         |
| `owner`       | The owner of the service, typically the email of the primary maintainer | `string`    | ✅         |
| `views`       | A list of views                                                         | `timedelta` | ❌         |
| `tags`        | String key-value pairs of arbitrary metadata                            | dictionary  | ❌         |
