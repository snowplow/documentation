---
position: 3
title: Define an attribute
---

An `Attribute` represents a specific fact about a user's behavior. For example, you can define an attribute to count the number of `page_view` events a user has made.

```python
from snowplow_signals import Attribute, Event

page_view_count = Attribute(
    name="page_view_count",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="counter"
)
```
You can refine to your attributes by adding `Criteria` to filter for specific events. For example:

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion

products_added_to_cart_feature = Attribute(
    name="products_added_to_cart",
    type="string_list",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow.ecommerce",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="unique_list",
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].name",
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="add_to_cart",
            ),
        ],
    ),
)
```
