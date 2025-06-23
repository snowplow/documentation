---
title: "Defining Attributes"
sidebar_position: 20
sidebar_label: "Attributes"
---

Attributes are the building blocks of Snowplow Signals. They represent specific facts about user behavior and are calculated based on events in your Snowplow pipeline. This guide explains how to define an `Attribute`, and use `Criteria` to filter events for precise data aggregation.

- **Number of page views in the last 7 Days:** counts how many pages a user has viewed within the past week.
- **Last product viewed:** identifies the most recent product a user interacted with.
- **Previous purchases:** provides a record of the user's past transactions. 

:::note Attribute Calculations

Attribute calculation starts when the definitions are applied, and are not backdated. 

:::


### Basic usage

An `Attribute` can be defined to count the number of pageviews in a session through the Python SDK as follows:

```python
from snowplow_signals import Attribute, Event

page_views_attribute = Attribute(
    name='page_views_count',
    type='int32',
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation='counter'
)

```

### Advanced Usage

Add a `Criteria` to refine the events used to calculate the `Attribute`. For example, if you want to see the number of pageviews on a particular web page on your site.


```python
from snowplow_signals import Attribute, Event, Criteria, Criterion

page_views_attribute = Attribute(
    name='page_views_count',
    type='int32',
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation='counter',
    criteria=Criteria(
        all=[
            Criterion(
                property="page_title",
                operator="=",
                value="home_page",
            ),
        ],
    ),
)

```

The table below lists all arguments for an `Attribute`:

| **Argument Name** | **Description** | **Type** |
| --- | --- | --- | 
| `name` | The name of the Attribute | `string` |
| `description` | The description of the Attribute | `string` |
| `type` | The type of the aggregation | One of: `bytes`, `string`, `int32`, `int64`, `double`, `float`, `bool`, `unix_timestamp`, `bytes_list`, `string_list`, `int32_list`, `int64_list`, `double_list`, `float_list`, `bool_list`, `unix_timestamp_list`,  |
| `tags` | Metadata for the Attribute | |
| `events` | List of Snowplow Events that the Attribute is calculated on | List of `Event` type; see next section |
| `aggregation` | The aggregation type of the Attribute  | One of:  `counter`, `sum`, `min`, `max`, `mean`, `first`, `last`, `unique_list` |
| `property` | The property of the event or entity you wish to use in the aggregation | `string` |
| `criteria` | List of `Criteria` to filter the events | List of `Criteria` type |
| `period` | The time period over which the aggregation should be calculated | |
| `default_value` | The default value to use if the aggregation returns no results. If not set, the default value is automatically assigned based on the `type`. | |


### Event Type
The `Event` informs the type of event that the `Attribute` is calculated on. It should be a reference to a Snowplow event that exists on your Snowplow account.

| **Argument Name** | **Description** | **Type** |
| --- | --- | --- | 
| `name` | Name of the event (`event_name` column in atomic.events table) | `string` |
| `vendor` | Vendor of the event (`event_vendor` column in atomic.events table). | `string` |
| `version` | Version of the event (`event_version` column in atomic.events table). | `string` |

### Criteria 
The `Criteria` filters the events used to calculate an `Attribute`. They are made up of individual `Criterion`.

A `Criteria` accepts one of 2 parameters, both lists of individual `Criterion`:

- `all`: An array of conditions used to filter the events. All conditions must be met.
- `any`: An array of conditions used to filter the events. At least one of the conditions must be met.

A `Criterion` specifies the individual filter conditions for an `Attribute` using the following properties.

| **Argument Name** | **Description** | **Type** |
| --- | --- | --- | 
| `property` | The path to the property on the event or entity you wish to filter. | `string` |
| `operator` | The operator used to compare the property to the value. | One of: `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `in` |
| `value` | The value to compare the property to. | One of:  `str`, `int`, `float`, `bool`, `List[str]`, `List[int]`, `List[float]`, `List[bool]` |

### Period
The `period` property of the `Attribute` definition accepts a Python `timedelta` type. The attribute will then be calculated over this period, for example:

```python
from datetime import timedelta

l7d = timedelta(days=7)

page_views_attribute = Attribute(
    name='page_views_count_l7d',
    type='int32',
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation='counter',
    period=l7d #calculates pageviews over last 7 days
)


```