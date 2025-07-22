---
title: "Attribute groups: views and services"
sidebar_position: 30
sidebar_label: "Attribute groups"
---

Signals has two attribute groupings:
* Views, for defining attributes
* Services, for consuming attributes

Each view is a versioned collection of attributes, and specific to one entity and one data source (stream or batch).

Services are groups of views.

## Attribute management

Every view has a version number.

Signals provides functionality for separating attribute definition from calculation. This allows you to set up your attributes and business logic before putting them into production. The options are different depending on whether the view is for stream or batch attributes.

To configure a table for batch attributes, you may choose to set up a view using that source without defining any attributes initially. This ensures that the table is ready and tested for adding and calculating attributes. Read more about configuring batch attributes and views in the [Batch calculations](/docs/signals/configuration/batch-calculations/index.md) section.

There are 3 types of view, depending on how you want to calculate and materialize the attributes:

- `StreamView` - Processed in the streaming engine
- `BatchView` - Processed using the batch engine
- `ExternalBatchView` - Existing customer warehouse table that's materialized into Signals

When defining batch attributes, it's possible to apply configurations that just create a table without attributes, or calculate attributes in a table without materializing them to the Profiles Store. You can also define an `ExternalBatchView` with fields instead of attributes, for using pre-existing tables with pre-calculated attributes.

For stream attributes, you can choose to configure and apply views that don't calculate their attribute values.

This means that configuration, calculation, materialization, and retrieval are fully decoupled.

## Views can be set to expire

Some attributes will only be relevant for a certain amount of time, and eventually stop being updated.

To avoid stale attributes staying in your Profiles Store forever, you can configure TTL lifetimes for entities and views. When none of the attributes for an entity or view have been updated for the defined lifespan, the entity or view expires. Any attribute values for this entity or view will be deleted: fetching them will return `None` values.

If Signals then processes a new event that calculates the attribute again, or materializes the attribute from the warehouse again, the expiration timer is reset.

## When to update the view version

TODO

## StreamView

Use a `StreamView` to calculate attributes in real time from event streams.

```python
from snowplow_signals import StreamView, domain_sessionid

my_stream_view = StreamView(
    name="my_stream_view",
    version=1,
    entity=domain_sessionid,
    owner="user@company.com",
    attributes=[
        # Previously defined attributes
        page_view_count,
        products_added_to_cart_feature,
    ],
)
```

## BatchView

Use a `BatchView` to calculate attributes from batch data sources (e.g., warehouse tables).

```python
from snowplow_signals import BatchView, domain_sessionid

my_batch_view = BatchView   (
    name="my_batch_view",
    version=1,
    entity=domain_sessionid,
    owner="user@company.com",
    attributes=[
        # Previously defined attributes
        page_view_count,
        products_added_to_cart_feature,
    ],
)
```

## ExternalBatchView

Use an `ExternalBatchView` to materialize attributes from an existing warehouse table.


```python
from snowplow_signals import ExternalBatchView, domain_sessionid

my_external_batch_view = ExternalBatchView   (
    name="my_external_batch_view",
    version=1,
    entity=domain_sessionid,
    owner="user@company.com",
    batch_source=data_source, # Assuming Data source previously configured
    fields=[
        Field(
            name="TOTAL_TRANSACTIONS",
            type="int32",
        ),
        Field(
            name="TOTAL_REVENUE",
            type="int32",
        ),
        Field(
            name="AVG_TRANSACTION_REVENUE",
            type="int32",
        ),
    ],
)
```

By default, views will calculate attributes from the real-time event stream. Read more about this in the [Stream calculations](/docs/signals/configuration/stream-calculations/index.md) section.


## View options

The table below lists all available arguments for all types of `View`:

Below is a summary of all options available for configuring Views in Signals. The "Applies to" column shows which view types each option is relevant for.

| Argument       | Description                                                                         | Type                | Default | Required? | Applies to                |
| -------------- | ----------------------------------------------------------------------------------- | ------------------- | ------- | --------- | ------------------------- |
| `name`         | The name of the view                                                                | `string`            |         | ✅        | All                       |
| `version`      | The version of the view                                                             | `int`               | 1       | ❌        | All                       |
| `entity`       | The entity associated with the view                                                 | `Entity`            |         | ✅        | All                       |
| `owner`        | The owner of the view                                                               | `Email`             |         | ✅        | All                       |
| `description`  | A description of the view                                                           | `string`            |         | ❌        | All                       |
| `ttl`          | Time-to-live for attributes in the Profile Store                                    | `timedelta`         |         | ❌        | All                       |
| `tags`         | Metadata key-value pairs                                                            | `dict`              |         | ❌        | All                       |
| `attributes`   | List of attributes to calculate                                                     | list of `Attribute` |         | ✅        | `StreamView`, `BatchView`     |
| `batch_source` | The batch data source for the view                                                  | `BatchSource`       |         | ✅/❌     | `BatchView`/`ExternalBatchView` |
| `fields`       | Table columns for materialization                                                   | `Field`             |         | ✅        | `ExternalBatchView`         |
| `offline`      | Calculate in warehouse (`True`) or real-time (`False`)                              | `bool`              | varies  | ❌        | All                       |
| `online`       | Enable online retrieval (`True`) or not (`False`)                                   | `bool`              | `True`  | ❌        | All                       |


If no `ttl` is set, the entity's `ttl` will be used. If the entity also has no `ttl`, there will be no time limit for attributes.

## Extended stream view example

This example shows all the available configuration options for a stream view. To find out how to configure a batch view, see the [batch calculations](/docs/signals/configuration/batch-calculations/index.md) section.

This view groups attributes for a user entity, to be calculated in real-time.

```python
from snowplow_signals import View, user_id

stream_view = StreamView(
    name="comprehensive_stream_view",
    version=2,
    entity=user_id,
    owner="data-team@company.com",
    attributes=[
        page_view_count,
        session_duration,
        conversion_rate,
    ],
    description="User engagement attributes in real-time",
    ttl=timedelta(days=90),  # Attributes live in the Profiles Store for 90 days
    tags={
        "team": "growth",
        "priority": "high",
    },

    # Note: batch_source and fields are not used for stream views
)
```

Signals will start calculating attributes as soon as this view configuration is applied.

## Testing views

To understand what the output of a view will look like, use the Signals `test` method. This will output a table of attributes calculated from your `atomic` events table.

```python
from snowplow_signals import Signals

# Connect to Signals
# See the main Configuration section for more on this
sp_signals = Signals(
        {{ config }}
    )

# Run the test
test_data = sp_signals.test(
    view=my_attribute_view,
    app_ids=["website"] # The app_id in your Snowplow events
)
```

:::note
While you can filter on specific app_ids during testing, both the streaming and batch engines may be configured to process only a subset of relevant app_ids to avoid unnecessary compute. As a result, testing with an arbitrary app_id may not yield expected data if it isn’t included in the configured subset.
:::

To see which attributes a view has, use `get_view()`. Here's an example:

```python
attribute_definitions = sp_signals.get_view(
    name="my_view",
    version=1,
)

print(attribute_definitions)
```

The table below lists all available arguments for `get_view()`

| Argument  | Description          | Type     | Required? |
| --------- | -------------------- | -------- | --------- |
| `name`    | The name of the view | `string` | ✅         |
| `version` | The view version     | `int`    | ❌         |

If you don't specify a version, Signals will retrieve the latest version.

## Services

Here's an example showing how to create a service to manage two views:

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
