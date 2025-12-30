---
title: "Tracking specific events with the Python tracker"
sidebar_label: "Event Tracking"
sidebar_position: 50
---

The Python tracker makes it simple to track a selection of out-of-the-box events as well as the ability to define your own custom events. 

To track an event, simply pass the `Event` object to the `tracker.track()` method. For example, tracking a page view:

```python 
page_view = PageView(
  page_url="https://www.snowplow.io",
  page_title="Homepage",
)
tracker.track(page_view) 
```

Every tracked event payload has a unique event_id UUID string (`eid`). Other properties include the name_tracker (`namespace`) and `app_id` set when the Tracker was initialized. From version 1 onwards, `tracker.track()` returns the payload's `eid`.

Snowplow events have a defined structure and protocol that is identical regardless of the tracker used. Further information on this structure can be found [here](/docs/events/index.md). 

The Python tracker [Github repository](https://github.com/snowplow/snowplow-python-tracker) includes 3 example apps demonstrating different ways to send events to your collector.

## Event Tracking
The Python tracker provides classes for tracking different types of events. They are listed below:

| **Event** | **Description** |
| --- | --- |
| `SelfDescribing` | Track custom events with custom schemas |
| `PageView` | Track views of web pages |
| `PagePing` | Track engagement on web pages over time |
| `ScreenView` | Track views of a screen (non-web e.g. in-app) |
| `StructuredEvent` | Track custom events without schemas |

## Creating a custom event (`SelfDescribing`)
To track data using a `SelfDescribing` event, the data must be structured as a `SelfDescribingJson` object. These require two fields, a URI for a self-describing JSON schema and the data in the form of a `PayloadDict`. The data must be valid against the schema. 

A simple initialization for a link click event looks like this:

```python
link_click = SelfDescribing(
  SelfDescribingJson(
    "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
    {"targetUrl": "https://www.snowplow.io"},
  ),
)
tracker.track(link_click)
```

## Creating a `PageView` Event
Track views of a web page with the `PageView` event. 

| **Property** | **Description** | **Type** | **Required?** |
| --- | --- | --- | --- |
| `page_url` | URL of the viewed page | `string` | Yes |
| `page_title` | Title of the viewed page | `string` | No |
| `referrer` | The address which linked to the page | `string` | No |
| `event_subject` | The subject for the event | `Subject` | No |
| `context` | Custom context for the event | `List(SelfDescribingJson)` | No |
| `true_timestamp` | When the page view occurred | `int or float` | No |

Example:

```python
page_view = PageView(
  page_url="https://www.snowplow.io",
  page_title="Homepage",
  referrer="https://docs.snowplow.io/docs",
)
tracker.track(page_view)
```
## Creating a `PagePing` Event
Track engagement with a web page over time, via a `PagePing` event. Each ping represents a single heartbeat.

| **Property** | **Description** | **Type** | **Required?** |
| --- | --- | --- | --- |
| `page_url` | URL of the viewed page | `string` | Yes |
| `page_title` | Title of the viewed page | `string` | No |
| `referrer` | The address which linked to the page | `string` | No |
| `min_x` | Minimum page x offset seen in the last ping period | `int` | No |
| `max_x` | Maximum page x offset seen in the last ping period | `int` | No |
| `min_y` | Minimum page y offset seen in the last ping period | `int` | No |
| `max_y` | Maximum page y offset seen in the last ping period | `int` | No |
| `event_subject` | The subject for the event | `Subject` | No |
| `context` | Custom context for the event | `List(SelfDescribingJson)` | No |
| `true_timestamp` | When the page ping occurred | `int or float` | No |

Example:
```python
page_ping = PagePing(
  page_url="https://www.snowplow.io",
  page_title="Homepage",
  referrer="https://docs.snowplow.io/docs",
)
tracker.track(page_ping)
```

## Creating a `ScreenView` Event

Use the `ScreenView` to track a user viewing a screen (or equivalent) within your app.

| **Property** | **Description** | **Type** | **Required?** |
| --- | --- | --- | --- |
| `id_` | Unique identifier for this screen (UUID) | `string` | No |
| `name` | Human-readable name for this screen | `Non-empty string` | No |
| `type`|The type of screen that was viewed e.g feed / carousel.| `string` | No |
| `previous_name` | The name of the previous screenview. | `string` | No |
| `previous_id` | The id of the previous screenview. | `string` | No |
| `previous_type` | The type of the previous screenview. | `string` | No |
| `transition_type` | The type of transition that led to the screen being viewed. | `string` | No |
| `event_subject` | The subject for the event | `Subject` | No |
| `context` | Custom context for the event | `List(SelfDescribingJson)` | No |
| `true_timestamp` | When the screen was viewed | `int or float` | No |

Example:

```python
id = tracker.get_uuid()
screen_view = ScreenView(
  id_=id, 
  name="name",
  type="feed",
  previous_name="Home Page", 
  previous_id="1368725287000", 
  previous_type="feed"
)
tracker.track(screen_view)
```
## Creating a `StructuredEvent`
Use `StructuredEvent` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Property** | **Description** | **Type** | **Required?** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | `Non-empty string` | Yes |
| `action` | Defines the type of user interaction which this event involves | `Non-empty string` | Yes |
| `label` | A string to provide additional dimensions to the event data | `string` | No |
| `property` | A string describing the object or the action performed on it | `string` | No |
| `value` | A value to provide numerical data about the event | `int or float` | No |
| `event_subject` | The subject for the event | `Subject` | No |
| `context` | Custom context for the event | `List(SelfDescribingJson)` | No |
| `true_timestamp` | When the structured event occurred | `int or float` | No |

Example:

```python
struct_event = StructuredEvent(
  category="shop",
  action="add-to-basket",
  label="web-shop",
  property_="pcs",
  value=2,
)
tracker.track(struct_event)
```

## Common tracking parameters

All events are tracked with specific event classes on the tracker instance, of the form `track(Event)`. The parameters that are common for all track methods are:

- `event_subject`
- `context`
- `true_timestamp`

### Event subject 

It is possible to set the Subject per-event, in order to augment the event with extra information without having to change the Subject at the Tracker level. This provides a thread safe way to track multiple subjects. 

Event level subjects are combined with any tracker subjects that have been initialized, with the event subject taking priority over tracker subject parameters.

This is supported as an optional keyword argument by all event classes. For example:

```python

event_subject = Subject().set_user_id("1234")
page_view = PageView(
  page_url="https://www.snowplow.io",
  page_title="Homepage",
  event_subject=event_subject
)

tracker.track(page_view)
```

More detail on the `Subject` class can be found [here](/docs/sources/python-tracker/subject/index.md). 

### Custom context

Custom context can be used to augment any standard Snowplow event type, including self describing events, with additional data. You can read more about custom contexts and the possible use cases [here](/docs/fundamentals/entities/index.md#custom-entities).

Custom context can be added as an extra argument to any of Snowplow’s Event classes. The `context` argument should consist of a list of one or more instances of the `SelfDescribingJson` class.

For example, if a server-side Python application can determine visitor's geoposition, this can be attached to the event using the `geolocation_context` that is predefined on [Iglu Central](https://github.com/snowplow/iglu-central):

```python
from snowplow_tracker import SelfDescribingJson

geo_context = SelfDescribingJson(
  "iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-0-0",
  {
    "latitude": -23.2,
    "longitude": 43.0
  }
)
```

As another example, if a visitor arrives on a page advertising a movie, the context object might look like this (`movie_poster` is custom context, not predefined):

```python
poster_context = SelfDescribingJson(
  "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
  {
    "movie_name": "Solaris",
    "poster_country": "JP",
    "poster_year": "1978-01-01"
  }
)
```

This is how to fire a page view event with both above contexts:

```python
page_view = PageView(
  page_url="https://www.snowplow.io",
  page_title="Homepage",
  context=[poster_context, geo_context]
)

tracker.track(page_view)
```

**Important:** Even if only one custom context is being attached to an event, it still needs to be parsed as a list.

### Timestamp argument

Each event class supports an optional timestamp as an argument. The timestamp should be in milliseconds since the Unix epoch, the same format as generated by `time.time() * 1000`.

Generally, according to the Snowplow Tracker Protocol, every event tracked will be recorded with two timestamps:

- the `dvce_created_tstamp`, which is the timestamp when the event was created

- the `dvce_sent_tstamp`, which is the timestamp when the event was sent

These are going to be used downstream, to calculate the `derived_tstamp` for the event, which takes also into account the collector timestamp, in order to best approximate the exact time the event occurred.

The optional timestamp argument is for the cases where you might want to set the event timestamp yourself. If this argument is not provided or set to None, then the Python Tracker will use the current time to be the `dvce_created_tstamp` for the event.

Here is an example tracking a structured event and supplying the optional timestamp argument. We can explicitly supply `None` for the intervening arguments which are empty:

```python
struct_event = StructuredEvent(
  category="shop",
  action="add-to-basket",
  label="web-shop",
  property_="pcs",
  value=2,
  true_timestamp=1368725287000
)
tracker.track(struct_event)
```
