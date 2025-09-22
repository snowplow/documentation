---
title: "Defining attributes using the Python SDK"
sidebar_position: 200
sidebar_label: "Using the Python SDK"
description: "Use the Snowplow Signals Python SDK to programmatically define attribute groups, services, and interventions via code."
---

The pages in this section describe how to use the [Signals Python SDK](https://pypi.org/project/snowplow-signals/) to define attribute groups and services. See the [interventions section](/docs/signals/define-interventions/index.md) to learn how to [define interventions](/docs/signals/define-interventions/using-python-sdk/index.md) using the SDK.

Start by [connecting to Signals](/docs/signals/connection/index.md) to create a `Signals` object:

```python
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=SIGNALS_DEPLOYED_URL,
    api_key=CONSOLE_API_KEY,
    api_key_id=CONSOLE_API_KEY_ID,
    org_id=ORG_ID,
)
```

The created `Signals` object has the following methods:

| Method                   | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `publish`                | Registers the provided objects with Signals                                 |
| `unpublish`              | Unpublishes objects from Signals                                            |
| `delete`                 | Fully deletes objects from Signals (must unpublish first)                   |
| `test`                   | Tests an attribute group against the atomic events table                    |
| `get_service_attributes` | Retrieves attributes for a specific service from the Profiles Store         |
| `get_group_attributes`   | Retrieves attributes for a specific attribute group from the Profiles Store |
| `get_attribute_group`    | Retrieves an attribute group from the Profiles Store                        |
| `push_intervention`      | Push an intervention to subscribers for a set of attribute keys             |
| `pull_interventions`     | Open a streaming subscription of interventions for a set of attribute keys  |

Check out the [attribute groups](/docs/signals/define-attributes/using-python-sdk/attribute-groups/index.md), [services](/docs/signals/define-attributes/using-python-sdk/services/index.md), and [interventions](/docs/signals/define-attributes/using-python-sdk/index.md) pages to learn how to configure them programmatically.

Read more about retrieving calculated attributes in [Retrieving values](/docs/signals/retrieve-attributes/index.md).

## Publishing and deleting

Use the same object management methods for attribute groups, services, attribute keys, and interventions:
* Use `publish()` to register objects with Signals. This makes them available for real-time calculation and retrieval.
* Use `unpublish()` to stop active calculation without losing the object definitions.
* Use `delete()` to permanently remove objects from Signals. Objects must be unpublished before deletion. If you delete an attribute group, the calculated attributes in the Profiles Store will also be deleted.

```python
from snowplow_signals import StreamAttributeGroup, Service, RuleIntervention

# Define your objects (assuming these are already created)
objects_to_manage = [my_attribute_group, my_service, my_intervention]

# 1. Publish objects
published_objects = sp_signals.publish(objects_to_manage)

# 2. Unpublish objects
unpublished_objects = sp_signals.unpublish(objects_to_manage)

# 3. Delete objects permanently - must unpublish first
sp_signals.delete(objects_to_manage)
```
