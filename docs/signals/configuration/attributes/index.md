---
title: "Defining Attributes"
sidebar_position: 10
sidebar_label: "Attributes"
---

Attributes represent specific facts about user behavior, and are calculated based on events in your Snowplow pipeline.

To configure an attribute, you will need to set:
* A name, ideally one that describes the attribute
* Which event schemas it will be calculated from, and what property in those schemas
* What kind of aggregation you want to calculate over time, e.g. `mean` or `last`
* What type of value you want the attribute to hold, e.g. `double` or `string`

Attribute calculation starts when the definitions are applied, and aren't backdated.

All configuration is defined using the Signals Python SDK.

## Minimal example

This is the minimum configuration needed to create an attribute:

```python
from snowplow_signals import Attribute, Event

my_attribute = Attribute(
    name="button_click_counter",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="button_click",
            version="1-0-0",
        )
    ],
    aggregation="counter"
)
```

Once applied and active, this attribute definition will trigger every time Signals processes an event with the schema [`iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0). Starting from 0, the stored attribute will be an integer value that increases by 1 with every `button_click` event.

## Options

The table below lists all available arguments for an `Attribute`:

| Argument        | Description                                                                                                                                  | Type                                                                                                                                                                                                                | Required? |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `name`          | The name of the attribute                                                                                                                    | `string`                                                                                                                                                                                                            | ✅         |
| `description`   | The description of the attribute                                                                                                             | `string`                                                                                                                                                                                                            | ❌         |
| `events`        | List of Snowplow `Event`s that the attribute is calculated on                                                                                | List of `Event` type                                                                                                                                                                                                | ✅         |
| `aggregation`   | The calculation to be performed                                                                                                              | One of:  `counter`, `sum`, `min`, `max`, `mean`, `first`, `last`, `unique_list`                                                                                                                                     | ✅         |
| `type`          | The type of the aggregation result                                                                                                           | One of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list`, | ✅         |
| `criteria`      | List of `Criteria` to filter the events                                                                                                      | List of `Criteria` type                                                                                                                                                                                             | ❌         |
| `property`      | The property of the event or entity you wish to use in the aggregation                                                                       | `string`                                                                                                                                                                                                            | ❌         |
| `period`        | The time period window over which the aggregation should be calculated                                                                       | Python `timedelta`                                                                                                                                                                                                  | ❌         |
| `default_value` | The default value to use if the aggregation returns no results. If not set, the default value is automatically assigned based on the `type`. |                                                                                                                                                                                                                     | ❌         |
| `tags`          | Metadata for the attribute, as a dictionary                                                                                                  |                                                                                                                                                                                                                     | ❌         |

### Specifying events

The `events` list describes the types of events that the attribute is calculated from. They're references to Snowplow events that exist in your Snowplow account, based on event schemas.

An `Event` accepts the following parameters:

| Argument  | Description                                     | Type     |
| --------- | ----------------------------------------------- | -------- |
| `name`    | `event_name` column in `atomic.events` table    | `string` |
| `vendor`  | `event_vendor` column in `atomic.events` table  | `string` |
| `version` | `event_version` column in `atomic.events` table | `string` |

Use the following details for Snowplow page view, page ping, or structured events:

```python
# Page view event
sp_page_view=Event(
    name="page_view",
    vendor="com.snowplowanalytics.snowplow",
    version="1-0-0"
)

# Page ping event
sp_page_ping=Event(
    name="page_ping",
    vendor="com.snowplowanalytics.snowplow",
    version="1-0-0"
)

# Structured event
sp_structured=Event(
    name="event",
    vendor="com.google.analytics",
    version="1-0-0"
)
```

All of these parameters are optional, and work like wildcards.

To calculate an attribute for version 2-0-2 only of an event data structure with the schema `iglu:com.snowplowanalytics.snowplow.media/destination/jsonschema/2-0-2`, the `Event` would be:

```python
event=Event(
    name="destination",
    vendor="com.snowplowanalytics.snowplow.media",
    version="2-0-2"
)
```

To calculate an attribute for all versions of that event:

```python
event=Event(
    name="destination",
    vendor="com.snowplowanalytics.snowplow.media",
)
```

To calculate an attribute for all events for a specific vendor:

```python
event=Event(
    vendor="com.snowplowanalytics.snowplow.media",
)
```

### Filtering events by specific values

The `criteria` list filters the events used to calculate an attribute.

It allows you to be specific about which subsets of events should trigger attribute updates. For example, instead of counting all page views in a user's session, you may wish to calculate only views for an FAQs page, or a "contact us" page.

The `criteria` list takes a `Criteria` type, with possible arguments:

| Argument | Description                                                                            | Type                |
| -------- | -------------------------------------------------------------------------------------- | ------------------- |
| `all`    | Conditions used to filter the events, where all conditions must be met                 | list of `Criterion` |
| `any`    | Conditions used to filter the events, where at least one of the conditions must be met | list of `Criterion` |

A `Criterion` specifies the individual filter conditions for an attribute, using the following properties:

| Argument   | Description                                                         | Type                                                                                    |
| ---------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `property` | The path to the property on the event or entity you wish to filter. | `string`                                                                                |
| `operator` | The operator used to compare the property to the value.             | One of: `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `in`                                   |
| `value`    | The value to compare the property to.                               | `str`, `int`, `float`, `bool`, `List[str]`, `List[int]`, `List[float]`, or `List[bool]` |

For example, if you want to calculate an attribute for page views of either the FAQs or "contact us" page, the `Criteria` could be:

```python
criteria=Criteria(
    any=[
        Criterion(
            property="page_url",
            operator="like",
            value="%/faq%"
        ),
        Criterion(
            property="page_url",
            operator="like",
            value="%/contact-us%"
        )
    ]
)
```

The `page_url` property is from the built-in [atomic event properties](/docs/fundamentals/canonical-event/index.md) in all Snowplow events.

## Extended examples

These examples use all the available configuration options.

### Example 1

This example extends the previous minimal example. Now the attribute is only calculated for `button_click` events where the `id` property is equal to `generate_emoji_btn`.

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion

my_attribute = Attribute(
    name="emoji_button_click_counter",
    description="The number of clicks for the 'generate emoji' button",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="button_click",
            version="1-0-0",
        )
    ],
    aggregation="counter"
    criteria=Criteria(
        all=[
            Criterion(
                property="id",
                operator="=",
                value="generate_emoji_btn"
            )
        ]
    ),
    period=timedelta(days=7),
    default_value=0
    tags={
        "component": "emoji_generator",
        "feature": "user_interaction",
        "priority": "medium"
    },
    property=None,
)
```

The attribute will be calculated over the last 7 days as a rolling window.

### Example 2

Here's a new example showing how to use the `property` option to access one of the [atomic event properties](/docs/fundamentals/canonical-event/index.md), in this case `mkt_medium`.

In this example the attribute is calculated from either a page view or a custom event:

```python
from snowplow_signals import Attribute, Event

my_new_attribute = Attribute(
    name="referrer_source",
    description="Referrer",
    type="string",
    events=[
        Event(
            name="page_view",
            vendor="com.snowplowanalytics.snowplow",
            version="1-0-0"
        ),
        Event(
            name="login_landing",
            vendor="com.business.example",
            version="1-0-0"
        )
    ],
    aggregation="last"
    criteria=None,
    property="mkt_medium",
    period=None,
    default_value=None
    tags={},
)
```

This attribute will be updated to the most recent referrer URL every time a page view or `login_landing` event is processed.

### Example 3

This example shows how to use the `property` option to access values in any part of a tracked event.

Tthe attribute is based on product prices, tracked within the product entity in an ecommerce transaction event:

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion

my_new_attribute = Attribute(
    name="products_total_purchase_value",
    description="Total purchase value for all products",
    type="int64",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow.ecommerce",
            name="snowplow_ecommerce_action",
            version="1-0-2",
        )
    ],
    aggregation="sum"
    criteria=Criteria(
        all=[
            Criterion(
                property="unstruct_event_com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1:type",
                operator="=",
                value="transaction"
            )
        ]
    ),
    property="contexts_com_snowplowanalytics_snowplow_ecommerce_product_1[0].price",
    period=None,
    default_value=0
    tags={},
)
```

This attribute will be calculated for Snowplow ecommerce events with schema [`iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2) and the `type` property `transaction`. The products in a transaction are stored as [product entities](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0) in the `contexts_com_snowplowanalytics_snowplow_ecommerce_product_1` array. The `price` property of the first product is used to calculate the attribute.
