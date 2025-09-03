---
title: "Retrieving calculated values from the Profiles Store"
sidebar_position: 30
sidebar_label: "Retrieving attributes"
---

Your calculated attributes are stored in the Profiles Store, and retrieved using [services](/docs/signals/concepts/#services).

To use attributes in your applications, you can use:
* Signals Node.js SDK (TypeScript)
* Signals Python SDK
* Signals API

## Connecting to Signals

For all of these methods, you'll need to connect to your Signals deployment. Use the credentials shown on the Signals overview page in BDP Console.

<!-- TODO image landing page -->

## Node.js SDK

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md).

## Python SDK

Install the SDK into your project, and connect to Signals as described in [Configuration](/docs/signals/configuration/index.md).

### Attributes from a service

Use `get_service_attributes()` to retrieve attributes from a specific service. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

calculated_values = sp_signals.get_service_attributes(
    source="my_service",
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(calculated_values)
```

The table below lists all available arguments for `get_service_attributes()`

| Argument        | Description                                  | Type     | Required? |
| --------------- | -------------------------------------------- | -------- | --------- |
| `name`          | The name of the service                      | `string` | ✅         |
| `attribute_key` | The attribute key to retrieve attributes for | `string` | ✅         |
| `identifier`    | The specific attribute key value             | `string` | ✅         |


### Attributes from an attribute group

You can also retrieve a subset of attributes from a specific attribute group using `get_attributes()`. Signals will return the attributes as a dictionary.

Here's an example:

```python
# The Signals connection object has been created as sp_signals

calculated_values = sp_signals.get_attributes(
    name="my_attribute_group",
    version=1,
    attributes=["page_view_count"],
    attribute_key="domain_userid",
    identifier="218e8926-3858-431d-b2ed-66da03a1cbe5",
)

print(calculated_values)
```

The table below lists all available arguments for `get_attributes()`

| Argument        | Description                             | Type                         | Required? |
| --------------- | --------------------------------------- | ---------------------------- | --------- |
| `name`          | The name of the attribute group         | `string`                     | ✅         |
| `version`       | The attribute group version             | `int`                        | ✅         |
| `attributes`    | The names of the attributes to retrieve | `string` or list of `string` | ✅         |
| `attribute_key` | The attribute_key name                  | `string`                     | ✅         |
| `identifier`    | The specific attribute key value        | `string`                     | ✅         |



## Signals API TODO
