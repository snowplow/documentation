---
position: 3
title: Define attributes and service with Python
description: "Use the Signals Python SDK to programmatically define real-time ecommerce attributes."
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

In this section, you'll define [attributes](/docs/signals/concepts/#attribute-groups) that calculate real-time user behavior metrics from ecommerce events. These attributes will track product views, cart additions, and cart value.

You'll create three attributes to track user shopping behavior:

* **`count_product_views`** counts the number of product view events
* **`count_add_to_cart`** counts the number of add-to-cart events
* **`total_cart_value`** sums the prices of items added to the cart

These attributes use the [Snowplow ecommerce plugin](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/), which tracks standardized ecommerce events.

## Import required classes

Start by importing the classes you'll need from the [Signals Python SDK](https://pypi.org/project/snowplow-signals/):

```python
from snowplow_signals import (
    Attribute,
    Event,
    Criterion,
    Criteria,
    EventProperty,
    EntityProperty,
    StreamAttributeGroup,
    Service,
    domain_userid,
)
```

## Define the attributes

Each [attribute](/docs/signals/define-attributes/using-python-sdk/attribute-groups/attributes/) defines which event it will be calculated from, and what kind of aggregation will be performed.

### Product views counter

This attribute counts product view events:

```python
count_product_views = Attribute(
    name="count_product_views",
    type="int32",
    events=[Event(name="snowplow_ecommerce_action")],
    criteria=Criteria(
        all=[
            Criterion.eq(
                property=EventProperty(
                    vendor="com.snowplowanalytics.snowplow.ecommerce",
                    name="snowplow_ecommerce_action",
                    major_version=1,
                    path="type",
                ),
                value="product_view",
            )
        ]
    ),
    aggregation="counter",
)
```

This attribute:

* Uses the `snowplow_ecommerce_action` [event](/docs/fundamentals/events/)
* Filters for events where the action type is `product_view`
* Counts matching events using the `counter` aggregation

### Add to cart counter

This attribute counts when users add items to their cart:

```python
count_add_to_cart = Attribute(
    name="count_add_to_cart",
    type="int32",
    events=[Event(name="snowplow_ecommerce_action")],
    criteria=Criteria(
        all=[
            Criterion.eq(
                property=EventProperty(
                    vendor="com.snowplowanalytics.snowplow.ecommerce",
                    name="snowplow_ecommerce_action",
                    major_version=1,
                    path="type",
                ),
                value="add_to_cart",
            )
        ]
    ),
    aggregation="counter",
)
```

### Total cart value

This attribute sums the prices of products added to the cart:

```python
total_cart_value = Attribute(
    name="total_cart_value",
    type="double",
    events=[Event(name="snowplow_ecommerce_action")],
    criteria=Criteria(
        all=[
            Criterion.eq(
                property=EventProperty(
                    vendor="com.snowplowanalytics.snowplow.ecommerce",
                    name="snowplow_ecommerce_action",
                    major_version=1,
                    path="type",
                ),
                value="add_to_cart",
            )
        ]
    ),
    property=EntityProperty(
        vendor="com.snowplowanalytics.snowplow.ecommerce",
        name="product",
        major_version=1,
        path="price",
    ),
    aggregation="sum",
)
```

This attribute:

* Filters for `add_to_cart` events
* Extracts the `price` field from the `product` [entity](/docs/fundamentals/entities/)
* Sums the prices using the `sum` aggregation

## Create an attribute group

[Attribute groups](/docs/signals/concepts/#attribute-groups) organize related attributes together. They can be considered as "tables" of attributes.

Create a group to hold your ecommerce attributes:

```python
attribute_group = StreamAttributeGroup(
    name="ecom_attributes",
    version=1,
    attribute_key=domain_userid,
    attributes=[
        count_product_views,
        count_add_to_cart,
        total_cart_value,
    ],
    owner="user@company.com",
)
```

The `attribute_key` parameter specifies the [user identifier](/docs/signals/concepts/#attribute-keys) that the attributes are grouped by. In this case, `domain_userid` means the attributes track behavior for each anonymous user.

This is a `StreamAttributeGroup`, because Signals will process events from the real-time event stream.

:::note

Attribute groups are immutable and versioned. If you need to modify attributes, create a new version of the group.

:::

## Create a service

[Services](/docs/signals/concepts/#services) provide an interface for applications to retrieve attributes. Create a service that includes your attribute group:

```python
stream_service = Service(
    name="ecom_attributes",
    attribute_groups=[attribute_group],
    owner="user@company.com",
)
```

## Publish to Signals

Now publish both the attribute group and service to your Signals instance:

```python
sp_signals.publish([attribute_group, stream_service])
```

Once published, Signals begins calculating these attributes in real time as events arrive at the Collector.

:::tip

You can retrieve attribute values for a specific user by calling:

```python
stream_service.get_attributes(
    signals=sp_signals,
    attribute_key="domain_userid",
    identifier="your-domain-userid-here", # the value will be a UUID
)
```

:::

Your attributes are now live and ready to power personalization experiences. Next, you'll define interventions that trigger based on these attribute values.
