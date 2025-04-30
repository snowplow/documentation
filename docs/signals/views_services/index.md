---
title: "Views and Services"
sidebar_position: 30
description: "Views and Services."
sidebar_label: "Views and Services"
---

To access attributes, you need to define a `View` and optionally group multiple views into a `Service`. This guide explains how to define views and services, apply them to your deployment, and retrieve calculated values.


### What is a View?
A `View` is a versioned collection of attributes grouped by a common `Entity` (e.g., `session_id` or `user_id`). Once defined, a `View` allows you to retrieve the calculated values of the attributes it contains.

### What is a Service?
A `Service` is a collection of views that streamlines the retrieval of multiple views. By grouping related views into a `Service`, you can efficiently manage and access user insights, making it easier to personalize applications and analyze behavior.


### Defining a View
You can define a `View` by passing in a list of previously defined attributes. Here's an example:

```python
from snowplow_signals import View, session_entity

my_attribute_view = View(
    name="my_attribute_view",
    version=1,
    entity=session_entity,
    attributes=[ 
        #Previously defined Attributes
        page_view_count, 
        products_added_to_cart_feature,
    ],

)
```

### Testing a View
To understand what the output of a `View` will look like, use the `test` method with the `Signals` class. This will output a table of `Attributes` from your `atomic` events table.

```python
# Assuming signals object has been instantiated using the Signals() class

test_data = sp_signals.test(
    view=my_attribute_view,
    app_ids=["website"] # The app id in your Snowplow Events
)

```

### View Properties

The `View` has the following properties:


| **Argument Name** | **Description** | **Type** |
| --- | --- | --- | 
| `name` | The name of the View | `string` |
| `version` | The version of the View | `int` |
| `entity` | The entity associated with the View | `Entity` |
| `ttl` | The amount of time this group of attributes lives. If not specified, the entity's ttl is used or the ttl is not limited. | `timedelta` |
| `batch_source` | The data source for the View | `BatchSource` |
| `online` | Whether the View is calculated in real-time (`True`) or in the warehouse (`False`)	 | `bool` |
| `description` | The description of the View | `string` |
| `tags` | The metadata of the View | `dict` |
| `owner` | The owner of the feature view, typically the email of the primary maintainer. | `string` |
| `fields` | The list of table columns that are part of this view during materialization. | `Field` |
| `attributes` | The list of attributes that will be calculated from events as part of this view. | `Attribute` |


### Services
A `Service` groups multiple `Views` together, allowing you to retrieve calculated values from all the `Views` in the `Service`. Here's an example:

```python
from snowplow_signals import Service

my_service = Service(
    name='my_service',
    description='A collection of views',
    views=[
         # Previously defined Views
        my_attribute_view,
        another_view
    ]
)

```

### Applying Views and Services

To begin calculating your `Attributes`, you need to apply the `Views` or `Services` to your `Signals` deployment using the `apply` method:


```python
# Assuming signals object has been instantiated using the Signals() class

sp_signals.apply([
        my_service,
        my_other_service
    ])
```

Once applied, the attributes within these Views and Services will be calculated.


### Retrieving Calculated Values

To access the calculated values, use the `get_online_attributes` method. Here's an example:

```python
# Assuming signals object has been instantiated using the Signals() class

calculated_values = sp_signals.get_online_attributes(
    source=my_service,
    identifiers="abc-123",
)

print(calculated_values)
```
