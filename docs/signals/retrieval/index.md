---
title: "Retrieving calculated values from the Profiles Store"
sidebar_position: 30
sidebar_label: "Retrieving values"
---

Your calculated attributes are stored in the Profiles Store. To retrieve them, you can use:
* Signals Python SDK
* Signals Node.js SDK
* Signals API

## Python SDK

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md#connecting-to-signals).

### Retrieve attributes from a service

Use `get_service_attributes()` to retrieve attributes from a service. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

service_attributes = sp_signals.get_service_attributes(
    name="my_service",
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(service_attributes)
```

The table below lists all available arguments for `get_service_attributes()`

| Argument     | Description                                | Type     | Required? |
| ------------ | ------------------------------------------ | -------- | --------- |
| `name`       | The name of the service                    | `string` | ✅         |
| `entity`     | The entity name to retrieve attributes for | `string` | ✅         |
| `identifier` | The entity value                  | `string` | ✅         |


### Retrieve attributes from a view

You can also retrieve a subset of attributes from a view using `get_view_attributes()`. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

view_attributes = sp_signals.get_view_attributes(
    name="my_view",
    version=1,
    attributes=["page_view_count"],
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(view_attributes)
```

The table below lists all available arguments for `get_view_attributes()`

| Argument     | Description                             | Type                         | Required? |
| ------------ | --------------------------------------- | ---------------------------- | --------- |
| `name`       | The name of the view                    | `string`                     | ✅         |
| `version`    | The view version                        | `int`                        | ✅         |
| `attributes` | The names of the attributes to retrieve | `string` or list of `string` | ✅         |
| `entity`     | The entity name                         | `string`                     | ✅         |
| `identifier` | The specific entity value               | `string`                     | ✅         |

## Node.js SDK

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md#setting-up-the-nodejs-sdk).

### Retrieve attributes from a service

Use `getServiceAttributes()` to retrieve attributes from a service. Signals will return the attributes as an object.

Here's an example:

```typescript
//  The Signals connection object has been created as signals

serviceAttributes = signals.getServiceAttributes(
    name="my_service",
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

The table below lists all available arguments for `getServiceAttributes()`

| Argument     | Description                                | Type     | Required? |
| ------------ | ------------------------------------------ | -------- | --------- |
| `name`       | The name of the service                    | `string` | ✅         |
| `entity`     | The entity name to retrieve attributes for | `string` | ✅         |
| `identifier` | The entity value                  | `string` | ✅         |


### Retrieve attributes from a view

You can also retrieve a subset of attributes from a view using `getViewAttributes()`. Signals will return the attributes as an object.

Here's an example:

```typescript
//  The Signals connection object has been created as signals

viewAttributes = signals.getViewAttributes(
    name="my_view",
    version=1,
    attributes=["page_view_count"],
    entity="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)
```

The table below lists all available arguments for `getViewAttributes()`

| Argument     | Description                             | Type                         | Required? |
| ------------ | --------------------------------------- | ---------------------------- | --------- |
| `name`       | The name of the view                    | `string`                     | ✅         |
| `version`    | The view version                        | `int`                        | ✅         |
| `attributes` | The names of the attributes to retrieve | array of `string` | ✅         |
| `entity`     | The entity name                         | `string`                     | ✅         |
| `identifier` | The entity value               | `string`                     | ✅         |


## Signals API TODO
