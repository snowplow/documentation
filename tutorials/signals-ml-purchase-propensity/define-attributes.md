---
title: "Define the model features as attributes"
position: 2
sidebar_label: "Define attributes"
description: "Define and publish a Signals attribute group with in-session ecommerce behavior to use as features for a purchase propensity model."
keywords: ["signals attributes", "ml features", "ecommerce attributes", "attribute group"]
date: "2026-10-25"
---

The features for your model are Signals [attributes](/docs/signals/attributes/attributes/). You'll define them once in this step, and use the same definitions for training and serving.

## Connect to Signals

Create a `Signals` client using your API credentials. To generate them, follow the instructions in [Connect to Signals](/docs/signals/connection/).

```python
import os

from snowplow_signals import Signals

sp_signals = Signals(
    api_url=os.environ["SP_API_URL"],
    api_key=os.environ["SP_API_KEY"],
    api_key_id=os.environ["SP_API_KEY_ID"],
    org_id=os.environ["SP_ORG_ID"],
)
```

## Define the attribute group

The model predicts whether the current session will end in a purchase, so the features describe the current session. You'll calculate them against the `domain_sessionid` [attribute key](/docs/signals/attributes/attribute-keys/). The dataset builder requires this key when it generates session anchors.

This starter set counts the main shopping actions and measures how long the session has lasted:

| Attribute | Description | Aggregation |
| --- | --- | --- |
| `page_views` | Page views in the session | `counter` |
| `product_views` | Product detail views in the session | `counter` |
| `add_to_carts` | Cart additions in the session | `counter` |
| `remove_from_carts` | Cart removals in the session | `counter` |
| `checkout_steps` | Checkout steps reached in the session | `counter` |
| `minutes_in_session` | Minutes since the first event in the session | `time_since_first` |

All the ecommerce actions are the same `snowplow_ecommerce_action` event, so each counter filters on the event's `type` property:

```python
from snowplow_signals import (
    Attribute,
    Criteria,
    Criterion,
    Event,
    EventProperty,
    PageView,
)

# UPDATE THIS if your tracker sends a different version of the event
ecommerce_action = Event(
    vendor="com.snowplowanalytics.snowplow.ecommerce",
    name="snowplow_ecommerce_action",
    version="1-0-2",
)


def ecommerce_counter(name: str, action_type: str) -> Attribute:
    return Attribute(
        name=name,
        type="int32",
        events=[ecommerce_action],
        aggregation="counter",
        criteria=Criteria(
            all=[
                Criterion.eq(
                    EventProperty(
                        vendor="com.snowplowanalytics.snowplow.ecommerce",
                        name="snowplow_ecommerce_action",
                        major_version=1,
                        path="type",
                    ),
                    action_type,
                )
            ]
        ),
    )


attributes = [
    Attribute(
        name="page_views",
        type="int32",
        events=[PageView()],
        aggregation="counter",
    ),
    ecommerce_counter("product_views", "product_view"),
    ecommerce_counter("add_to_carts", "add_to_cart"),
    ecommerce_counter("remove_from_carts", "remove_from_cart"),
    ecommerce_counter("checkout_steps", "checkout_step"),
    Attribute(
        name="minutes_in_session",
        type="double",
        events=[],
        aggregation="time_since_first",
        time_unit="min",
    ),
]
```

Signals matches events by exact version. Check which version of `snowplow_ecommerce_action` your tracker sends, for example in the `event_version` column of `atomic.events`, and update `ecommerce_action` if it differs.

Group the attributes, and create a [service](/docs/signals/applications/services/) to retrieve them from your `/predict` endpoint later. Use your own email address for `owner`.

```python
from snowplow_signals import Service, StreamAttributeGroup, domain_sessionid

propensity_group = StreamAttributeGroup(
    name="purchase_propensity",
    version=1,
    owner="your_email@example.com",  # UPDATE THIS
    attribute_key=domain_sessionid,
    attributes=attributes,
)

propensity_service = Service(
    name="purchase_propensity_service",
    owner="your_email@example.com",  # UPDATE THIS
    attribute_groups=[propensity_group],
)
```

### Choose features that exist at prediction time

A feature is only useful if it has a value when you score. Two kinds of attribute cause problems:

* Attributes that only change after the outcome, such as a count of `transaction` events in the session: the dataset builder only places anchors before a session's first purchase, so this column would always be empty in training
* Attributes whose meaning depends on exactly when you read them, such as `time_since_last` on all events: in training it measures the gap before the anchor event, but if you score right after an event it's close to zero every time

Counts and session duration don't have these problems, which is why the starter set uses them. Once the pipeline works, try adding attributes such as the number of distinct products viewed or the value of items added to the cart, and keep the ones that improve the evaluation metrics in [Train the model](../train-model/).

## Publish the attribute group

Publish the attribute group and service. From this point, Signals calculates the attributes in real time for every session on your site.

```python
published = sp_signals.publish([propensity_group, propensity_service])
print(f"{len(published)} objects published")
```

Publishing doesn't affect the training dataset. The dataset builder computes historical values directly from `atomic.events`, so you don't have to wait for Signals to accumulate data before you train.
