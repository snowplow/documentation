---
title: "Track subject data with the Python tracker"
sidebar_label: "Subject"
sidebar_position: 40
description: "Configure subject data for tracked events including user ID, platform, screen resolution, timezone, and IP address for tracker-level or event-level subjects."
keywords: ["python subject", "user properties", "event context"]
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a number of `set_xxx()` methods to attach extra data relating to the user of the tracked events.

Here are some examples:

```python
from snowplow_tracker import Subject
subject = Subject()

subject.set_user_id("user_id")
subject.set_lang("en-gb")
subject.set_screen_resolution(1920, 1080)
```

There are two ways to provide the subject information:

1. For all tracked events. This is useful in client-side applications where all tracked events relate to the same user and share the same properties.
2. For each event individually. This is useful in server-side applications where each event might relate to a different user.

:::note
When the same parameter is set for a tracker subject and an event subject, the event subject will take priority.
:::


The full set of subject methods are listed below:

| **Subject Method** | **Description** |
| --- | --- |
| [`set_platform`](#set_platform) | Override the platform for the event (e.g. `srv`, `app`, `web`) |
| [`set_user_id`](#set_user_id) | Identify the Subject with a business ID |
| [`set_screen_resolution`](#set_screen_resolution) | Set the dimensions of the Subject's device |
| [`set_viewport`](#set_viewport) | Set the dimensions of the Subject's viewport |
| [`set_color_depth`](#set_color_depth) | Set the color depth of the Subject device's display |
| [`set_timezone`](#set_timezone) | Set the local timezone for the Subject |
| [`set_lang`](#set_lang) | Set the preferred language or locale of the Subject |
| [`set_ip_address`](#set_ip_address) | Set the IP address of the Subject |
| [`set_user_agent`](#set_user_agent) | Set the User Agent string of the Subject |
| [`set_domain_user_id`](#set_domain_user_id) | Set the Domain User ID of the Subject |
| [`set_network_user_id`](#set_network_user_id) | Set the Network User ID of the Subject |
| [`set_domain_session_id`](#set_domain_session_id) | Set the Domain Session ID of the Subject |
| [`set_domain_session_index`](#set_domain_session_index) | Set the Domain Session Index of the Subject |


### Setting a Tracker Subject
To configure a tracker subject, pass it to the tracker during initialization:

```python
subject = Subject().set_platform("mob").set_user_id("user-12345").set_lang("en")

t = Tracker(
        namespace="snowplow_tracker",
        emitters=emitter,
        subject=subject
)
```

If you initialize a `Tracker` instance without a subject, a default `Subject` instance will be attached to the tracker. You can access that subject like this:

```python
t = Tracker(
        namespace="snowplow_tracker",
        emitters=my_emitter
)
t.subject.set_platform("mob").set_user_id("user-12345").set_lang("en")
```

### Setting an Event Subject
To configure an event level subject, pass it to the event during initialization.

```python
event_subject = Subject().set_screen_resolution(1920, 1080)

id = tracker.get_uuid()
screen_view = ScreenView(
  id_=id,
  name="name",
  event_subject=event_subject
)

tracker.track(screen_view)
```
### `set_platform`

The default platform is `pc`. You can change the platform the subject is using by calling for example:

```python
s.set_platform('mob')
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/events/index.md#application-parameters).

### `set_user_id`

You can set the user ID to any string:

```python
s.set_user_id("user_id")
```

### `set_screen_resolution`

Set the screen resolution as below. Both numbers should be positive integers in the order width followed by height.

```python
s.set_screen_resolution(1366, 768)
```

### `set_viewport`

Set the viewport dimensions as below. Both numbers should be positive integers in the order width followed by height.

```python
s.set_viewport(300, 200)
```

### `set_color_depth`

Set the bit depth of the device's color palette for displaying images as below. The number should be a positive integer, in bits per pixel. For example:

```python
s.set_color_depth(32)
```

### `set_timezone`

This method lets you pass a user's timezone into Snowplow. The timezone should be a [IANA TZ identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) string.

```python
s.set_timezone("Europe/London")
```

### `set_lang`

This method lets you pass a user's language into Snowplow. The language should be a string.

```python
s.set_lang('en')
```

### `set_ip_address`

If you have access to the user's IP address, you can set it like this:

```python
s.set_ip_address('34.633.11.139')
```

The set value will be used in the [IP Lookup](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) and [IAB](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) enrichments, if enabled.

:::tip

On web applications, the remote address of an incoming request may reflect load balancers or reverse proxies instead of the actual Subject's IP.
You may need to consider the [Forwarded](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Forwarded) or [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) HTTP headers instead, though these headers can be forged by the requester.

:::

### `set_useragent`

If you have access to the user's useragent (sometimes called "browser string"), you can set it like this:

```python
s.set_useragent('Mozilla/5.0 (Windows NT 5.1; rv:23.0) Gecko/20100101 Firefox/23.0')
```

The set value will be used in the [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md), [UA Parser](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md), [IAB](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) and similar enrichments.

### `set_domain_user_id`

The `domain_userid` field of the Snowplow event model corresponds to the ID stored in the first party cookie set by the Snowplow JavaScript Tracker. If you want to match up server-side events with client-side events, you can set the domain user ID for server-side events like this:

```python
s.set_domain_user_id('c7aadf5c60a5dff9')
```
### `set_network_user_id`

The `network_user_id` field of the Snowplow event model corresponds to the ID stored in the third party cookie set by the Snowplow Collector. You can set the network user ID for server-side events like this:

```python
s.set_network_user_id('ecdff4d0-9175-40ac-a8bb-325c49733607')
```
### `set_domain_session_id`
This method lets you pass a Domain Session ID in to Snowplow:

```python
s.set_domain_session_id('ecdff4d0-9175-40ac-a8bb-325c49733607')
```

:::tip

The Domain User ID, Domain Session ID, and Domain Session Index values can all be extracted from the same cookie.

:::

### `set_domain_session_index`
This method lets you pass a Domain Session index in to Snowplow:
```python
s.set_domain_session_index(4)
```

## Tracking multiple subjects

You may want to track more than one subject concurrently. To avoid data about one subject being added to events pertaining to another subject, create two subject instances and switch between them using `Tracker.set_subject`:

```python
from snowplow_tracker import Subject, Emitter, Tracker

# Create a simple Emitter which will log events to https://d3rkrsqld9gmqf.cloudfront.net/com.snowplowanalytics.snowplow/tp2
e = Emitter(endpoint="d3rkrsqld9gmqf.cloudfront.net")

# Create a Tracker instance
t = Tracker(emitters=e, namespace="cf", app_id="CF63A")

# Create a Subject corresponding to a pc user
s1 = Subject()

# Set some data for that user
s1.set_platform("pc")
s1.set_user_id("0a78f2867de")

# Set s1 as the tracker subject
# All events fired will have the information we set about s1 attached
t.set_subject(s1)

# Track user s1 viewing a page
page_view = PageView(
        page_url="https://www.snowplow.io",
        page_title="Homepage",
)
t.track(page_view)

# Create another Subject instance corresponding to a mobile user
s2 = Subject()

# All methods of the Subject class return the Subject instance so methods can be chained:
s2.set_platform("mob").set_user_id("0b08f8be3f1")

# Change the tracker subject from s1 to s2
# All events fired will have instead have information we set about s2 attached
t.set_subject(s2)

# Track user s2 viewing a page
page_view = PageView(
        page_url="https://www.snowplow.io",
        page_title="Homepage",
)
t.track(page_view)

# Switch back to s1 and track a structured event.
t.set_subject(s1)
struct_event = StructuredEvent(
        category="shop",
        action="add-to-basket",
        label="web-shop",
        property_="pcs",
        value=2,
    )
t.track(struct_event)
```
