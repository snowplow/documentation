---
position: 3
title: Define and group attributes
---

An `Attribute` describes a specific fact about user behavior. They're grouped into `View`s for management and deployment.

In this tutorial you will define three attributes based on page view events.

## Define attributes

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
    aggregation="counter"
    period=timedelta(minutes=5),
)
```

### Most recent browser

The second attribute stores the last seen browser name (e.g. "Safari"), using the `last` aggregation. The `property` tells Signals where to look in the event for the value. Browser information is parsed from an event by the YAUAA enrichment, and appended to the event as an YAUAA entity ADD LINK. Within this entity, the browser name is stored in the `agentName` property.

```python
from snowplow_signals import Attribute, Event

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

The third attribute stores the first seen referrer path, based on the `refr_urlhost` event property ADD LINK and the `first` aggregation. By using a `criteria` filter, it's only calculated for page views with a non-empty referrer ADD LINK.

```python
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

## Define a view

Single attribute definitions can't be deployed to Signals, as they don't make sense without the additional context defined in a `View`.

Group the attributes together, adding the session entity identifier `domain_sessionid`.

```python
from snowplow_signals import View, domain_sessionid

my_attribute_view = View(
    name="my_attribute_view",
    version=1,
    entity=domain_sessionid,
    owner="user@company.com",
    attributes=[
        page_view_count,
        most_recent_browser,
        first_referrer
    ],
)
```

Because of the session entity, Signals will calculate these attributes as follows:
* How many page views in the last 5 minutes for each session
* The last seen browser name for each session
* The first seen referrer for each session

Add this view definition to your notebook, and run the cell.
