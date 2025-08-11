---
position: 3
title: Define what attributes to calculate
---

An `Attribute` describes a specific fact about user behavior. They're grouped into attribute groups for management and deployment.

## Define attributes

In this tutorial you will define three attributes based on page view events.

### Page view counter

The first attribute counts the number of page view events within the last 5 minutes. It uses the `counter` aggregation. The time window is defined by the `period` parameter.

```python
from snowplow_signals import Attribute, Event
from datetime import timedelta

page_view_count = Attribute(
    name="page_view_count",
    description="Page views in the last 5 minutes.",
    type="int32",
    events=[
        Event(
            vendor="com.snowplowanalytics.snowplow",
            name="page_view",
            version="1-0-0",
        )
    ],
    aggregation="counter",
    period=timedelta(minutes=5),
)
```

Note that there's a limit on how many events can be considered for time-windowed [event processing in stream](/docs/signals/configuration/stream-calculations).

### Most recent browser

The second attribute stores the last seen browser name (e.g. "Safari"), using the `last` aggregation. The `property` tells Signals where to look in the event for the value.

Browser information is appended to every event by the [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/) as an attribute key with schema URI `iglu:nl.basjes/yauaa_context/jsonschema/1-0-1`. Within the event payload, this URI becomes `contexts_nl_basjes_yauaa_context_1`. The `property` defined in this attribute uses the `agentName` field from the YAUAA attribute key. Note the `[0]` index to access the attribute key data.

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
    name="my_quickstart_attribute_group",
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
