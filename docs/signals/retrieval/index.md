---
title: "Retrieving calculated values from the Profiles Store"
sidebar_position: 1.5
sidebar_label: "Retrieving values TODO"
---

Your calculated attributes are stored in the Profiles Store. To retrieve them, you can use:
* Signals Python SDK
* Signals Node.js SDK (TypeScript)
* Signals API

## Python SDK

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md).

### Attributes from a service

Use `get_service_attributes()` to retrieve attributes from a specific service. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

calculated_values = sp_signals.get_service_attributes(
    source="my_service",
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(calculated_values)
```

The table below lists all available arguments for `get_service_attributes()`

| Argument     | Description                                | Type     | Required? |
| ------------ | ------------------------------------------ | -------- | --------- |
| `name`       | The name of the service                    | `string` | ✅         |
| `entity`     | The entity name to retrieve attributes for | `string` | ✅         |
| `identifier` | The specific entity value                  | `string` | ✅         |

TODO example output

### Attributes from a view

You can also retrieve a subset of attributes from a specific view using `get_view_attributes()`. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

calculated_values = sp_signals.get_view_attributes(
    name="my_view",
    version=1,
    attributes=["page_view_count"],
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(calculated_values)
```

The table below lists all available arguments for `get_view_attributes()`

| Argument     | Description                             | Type                         | Required? |
| ------------ | --------------------------------------- | ---------------------------- | --------- |
| `name`       | The name of the view                    | `string`                     | ✅         |
| `version`    | The view version                        | `int`                        | ✅         |
| `attributes` | The names of the attributes to retrieve | `string` or list of `string` | ✅         |
| `entity`     | The entity name                         | `string`                     | ✅         |
| `identifier` | The specific entity value               | `string`                     | ✅         |

TODO example output

## Node.js SDK TODO

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md).

TODO

## Signals API TODO
