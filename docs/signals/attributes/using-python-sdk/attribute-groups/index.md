---
title: "Define attribute groups with the Signals Python SDK"
sidebar_position: 30
sidebar_label: "Attribute groups"
description: "Define StreamAttributeGroup objects programmatically using the Signals Python SDK. Configure attributes, TTL, and versioning for real-time stream attribute groups."
keywords: ["python sdk attribute groups", "stream attribute group", "attribute groups"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Define the behavior you want to capture in [attribute groups](/docs/signals/concepts/index.md#attribute-groups).

## Defining a stream attribute group

Use a `StreamAttributeGroup` to calculate attributes from the real-time event stream.

```python
from snowplow_signals import StreamAttributeGroup, domain_sessionid

my_stream_attribute_group = StreamAttributeGroup(
    name="my_stream_attribute_group",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com",
    attributes=[
        # Previously defined attributes
        page_view_count,
        products_added_to_cart_feature,
    ],
)
```

## Attribute group options

The table below lists all available arguments for `StreamAttributeGroup`:

| Argument        | Description                                           | Type                | Default | Required? |
| --------------- | ----------------------------------------------------- | ------------------- | ------- | --------- |
| `name`          | The name of the attribute group                       | `string`            |         | ✅         |
| `version`       | The version of the attribute group                    | `int`               | 1       | ❌         |
| `attribute_key` | The attribute key associated with the attribute group | `AttributeKey`      |         | ✅         |
| `owner`         | The owner of the attribute group                      | `Email`             |         | ✅         |
| `description`   | A description of the attribute group                  | `string`            |         | ❌         |
| `ttl`           | Time-to-live for attributes in the Profile Store      | `timedelta`         |         | ❌         |
| `attributes`    | List of attributes to calculate                       | list of `Attribute` |         | ✅         |
| `online`        | Calculate attributes (`True`) or not (`False`)        | `bool`              | `True`  | ❌         |

If no `ttl` is set, the attribute key's `ttl` will be used. If the attribute key also has no `ttl`, there will be no time limit for attributes. We highly recommend setting a TTL. The suggested default is 7 days.

Use the `online` property to control whether or not Signals should actively compute the attributes, or just register the configuration.

### Versioning

Use `version=1` for the first version of an attribute group. After publishing, if you want to change the definition in any way, iterate the version number.

## Testing attribute groups

To understand what the output of an attribute group will look like, use the Signals `test` method. This will output a table of attributes calculated from your `atomic` events table.

```python
from snowplow_signals import Signals

# Connect to Signals
sp_signals = Signals(
        {{ config }}
    )

# Run the test
test_data = sp_signals.test(
    attribute_group=my_attribute_group,
    app_ids=["website"] # The app_id in your Snowplow events
)
```

:::note
While you can filter on specific app_ids during testing, the streaming engine may be configured to process only a subset of relevant app_ids to avoid unnecessary compute. As a result, testing with an arbitrary app_id may not yield expected data if it isn’t included in the configured subset.
:::

To see which attributes an attribute group has, use `get_attribute_group()`. Here's an example:

```python
attribute_definitions = sp_signals.get_attribute_group(
    name="my_attribute_group",
    version=1,
)

print(attribute_definitions)
```

The table below lists all available arguments for `get_attribute_group()`

| Argument  | Description                     | Type     | Required? |
| --------- | ------------------------------- | -------- | --------- |
| `name`    | The name of the attribute group | `string` | ✅         |
| `version` | The attribute group version     | `int`    | ❌         |

If you don't specify a version, Signals will retrieve the latest version.

## Publishing attribute groups

Use the [`publish()` method](/docs/signals/connection/index.md#publishing-and-deleting) to register attribute groups with Signals. This makes them available for real-time calculation and retrieval.

```python
from snowplow_signals import Signals

# Connect to Signals
sp_signals = Signals(
        {{ config }}
    )

# Publish attribute groups
sp_signals.publish([
        my_attribute_group,
        my_other_attribute_group
    ])
```

If you only want to publish the attribute group definitions, and don't want to calculate the attribute values now, set the `online=False` option.

## Attribute groups can be set to expire

Some attributes will only be relevant for a certain amount of time, and eventually stop being updated.

To avoid stale attributes staying in your Profiles Store forever, you can configure TTL lifetimes for attribute keys and attribute groups. When none of the attributes for an attribute key or attribute group have been updated for the defined lifespan, the attribute key or attribute group expires. Any attribute values for this attribute key or attribute group will be deleted: fetching them will return `None` values.

If Signals then processes a new event that calculates the attribute again, or syncs the attribute from the warehouse again, the expiration timer is reset.

## Extended stream attribute group example

This example shows all the available configuration options for a stream attribute group.

This attribute group groups attributes for a user attribute key, to be calculated in real-time.

```python
from snowplow_signals import StreamAttributeGroup, user_id

stream_attribute_group = StreamAttributeGroup(
    name="comprehensive_stream_attribute_group",
    version=2,
    attribute_key=user_id,
    owner="data-team@company.com",
    attributes=[
        page_view_count,
        session_duration,
        conversion_rate,
    ],
    description="User engagement attributes in real-time",
    ttl=timedelta(days=90),  # Attributes live in the Profiles Store for 90 days
)
```

Signals will start calculating attributes as soon as this attribute group configuration is applied.
