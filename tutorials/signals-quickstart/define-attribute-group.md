---
position: 3
title: Define an attribute group
---

An `Attribute` describes a specific fact about user behavior. They're grouped into attribute groups for management and deployment.

## Define attributes

In this tutorial you will define three attributes based on page view events.

### Page view counter

The first attribute counts the number of page view events within the last 15 minutes. It uses the `counter` aggregation. The time window is defined by the `period` parameter.

```python
from snowplow_signals import Attribute, Event
from datetime import timedelta

page_view_count = Attribute(
    name="page_view_count",
    description="Page views in the last 15 minutes.",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="counter",
    period=timedelta(minutes=15),
)
```

Note that there's a limit on how many events can be considered for time-windowed [event processing in stream](/docs/signals/configuration/stream-calculations).

### Most recent browser

The second attribute stores the last seen browser name (e.g. "Safari"), using the `last` aggregation. The `property` tells Signals where to look in the event for the value.

Browser information is appended to every event by the [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/) as an entity with schema URI `iglu:nl.basjes/yauaa_context/jsonschema/1-0-1`. Within the event payload, this URI becomes `contexts_nl_basjes_yauaa_context_1`. The `property` defined in this attribute uses the `agentName` field from the YAUAA entity. Note the `[0]` index to access the entity data.

In general, your attribute `property` definitions will be based on a column or field from the event, with the column name as seen in your warehouse.

```python
from snowplow_signals import Attribute, Event
from datetime import timedelta

most_recent_browser = Attribute(
    name="most_recent_browser",
    description="The last browser name tracked.",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="last",
    property="contexts_nl_basjes_yauaa_context_1[0].agentName",
)
```

### First referrer

The third attribute stores the first seen referrer path, based on the `refr_urlhost` [atomic event property](/docs/fundamentals/canonical-event/#platform-specific-fields) and the `first` aggregation. By using a `criteria` filter, it's only calculated for page views where the referrer isn't an empty string.

```python
from snowplow_signals import Attribute, Event, Criteria, Criterion
from datetime import timedelta

first_referrer = Attribute(
    name="first_referrer",
    description="The first referrer tracked.",
    type="string",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="first",
    property="refr_urlhost",
    criteria=Criteria(
        all=[
            Criterion(
                property="page_referrer",
                operator="!=",
                value=""
            )
        ]
    ),
    default_value=None
)
```

Add all three attribute definitions to your notebook, and run the cell.

## Define an attribute group

Single attribute definitions can't be deployed to Signals, as they don't make sense without the additional context defined in an `AttributeGroup`.

Group the attributes together, adding the session attribute key identifier `domain_sessionid`. You'll need to update the `owner` field to your email address.

```python
from snowplow_signals import StreamAttributeGroup, domain_sessionid

my_attribute_group = StreamAttributeGroup(
    name="quickstart_group",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com", # UPDATE THIS
    attributes=[
        page_view_count,
        most_recent_browser,
        first_referrer
    ],
)
```

Because of the session attribute key, Signals will calculate these attributes as follows:
* How many page views in the last 5 minutes for each session
* The last seen browser name for each session
* The first seen referrer for each session

Add this attribute group definition to your notebook, and run the cell.


## Testing


Signals will start processing events and computing attributes as soon as you apply the attribute group configuration.

It's a good idea to test the definitions before deployment.

Add a new cell to your notebook with the following code:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group
)
print(data)
```

Running this will calculate the attributes from your atomic events table. By default, events from the last hour are considered.

You should see something like this:

|     | `domain_sessionid`                     | `page_view_count` | `most_recent_browser` | `first_referrer` |
| --- | -------------------------------------- | ----------------- | --------------------- | ---------------- |
| 0   | `d99f6db1-7b28-46ca-a3ef-f0aace99ed86` | 0                 | "Firefox"             | None             |
| 1   | `08d833ec-5eef-461c-b452-842e7bd27067` | 1                 | "Chrome"              | "www.google.com" |
| 2   | `c4311466-231a-41ca-89d8-f2ff85e62a29` | 0                 | "Chrome"              | "duckduckgo.com" |
| 3   | `23937e09-b640-447e-82d9-c01bc16decb2` | 0                 | "Chrome"              | "www.google.com" |
| 4   | `61fb46c9-bfd3-48cd-a991-7a8484d1de8c` | 0                 | None                  | None             |
| 5   | `b0625a55-8382-4bfb-be9f-fefd75ad7e63` | 1                 | "Chrome"              | None             |
| 6   | `d97140c3-3c5e-426e-8527-15314efb2be3` | 0                 | "Chrome"              | None             |
| 7   | `4da52032-f6d1-41b4-9cf2-b40e164cbe6e` | 1                 | "Chrome"              | None             |
| 8   | `2ee80a4a-86dd-4a24-b697-0709b29ed079` | 0                 | "Safari"              | None             |

The test method returns results from a random 10 attribute key values. The first column shows the attribute key values, in this case for the session attribute key `domain_sessionid`.

The attributes look as expected, so the attribute group is ready to deploy.

## Testing for individual entities

You can also test specific attribute key instances, by providing a list of IDs.

This example will be calculated for just these two `domain_sessionid`s:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group,
    attribute_key_ids=["d99f6db1-7b28-46ca-a3ef-f0aace99ed86", "08d833ec-5eef-461c-b452-842e7bd27067"]
)
```

|     | `domain_sessionid`                     | `page_view_count` | `most_recent_browser` | `first_referrer` |
| --- | -------------------------------------- | ----------------- | --------------------- | ---------------- |
| 0   | `d99f6db1-7b28-46ca-a3ef-f0aace99ed86` | 0                 | "Firefox"             | None             |
| 1   | `08d833ec-5eef-461c-b452-842e7bd27067` | 1                 | "Chrome"              | "www.google.com" |

## Testing on a subset of events

Depending on your Snowplow tracking configuration, you might want to test only on events from specific applications, using `app_ids`:

```python
data = sp_signals.test(
    attribute_group=my_attribute_group,
    app_ids=["website"],
)
print(data)
```

If you don't see any results, check your Signals configuration to confirm that it's processing events from those `app_id`s.
