---
title: "Adding extra data: The Subject class"
sidebar_label: "Subject class"
date: "2020-02-26"
sidebar_position: 30
description: "Add user and environment data to events in Python tracker v0.15 using the Subject class with platform, user ID, and device properties."
keywords: ["python tracker v0.15 subject", "user data tracking", "subject properties"]
---

You may have additional information about the user (i.e. subject) performing the action or the environment in which the user has performed the action. Some of that additional data can be sent into Snowplow with each event as part of the subject class.

You can create a subject like this:

```python
from snowplow_tracker import Subject
s = Subject()
```

The Subject class has a set of `set_...()` methods to attach extra data relating to the user:

- [`set_platform`](#change-the-trackers-platform-withset_platform)
- [`set_user_id`](#set-user-id-withset_user_id)
- [`set_screen_resolution`](#set-screen-resolution-with-set_screen_resolution)
- [`set_viewport`](#set-viewport-dimensions-withset_viewport)
- [`set_color_depth`](#set-color-depth-withset_color_depth)
- [`set_timezone`](#set-timezone-withset_timezone)
- [`set_lang`](#set-the-language-withset_lang)

If you initialize a `Tracker` instance without a subject, a default `Subject` instance will be attached to the tracker. You can access that subject like this:

```python
t = Tracker(my_emitter)
t.subject.set_platform("mob").set_user_id("user-12345").set_lang("en")
```

We will discuss each of these in turn below:

#### Change the tracker's platform with `set_platform`

The default platform is "pc". You can change the platform the subject is using by calling for example:

```python
s.set_platform( {{ PLATFORM }})
```

For example:

```python
s.set_platform("tv") # Running on a Connected TV
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/events/index.md).

### Set user ID with `set_user_id`

You can set the user ID to any string:

```python
s.set_user_id( "{{USER ID}}" )
```

Example:

```python
s.set_user_id("alexd")
```

### Set screen resolution with `set_screen_resolution`

If your Python code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```python
s.set_screen_resolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```python
s.set_screen_resolution(1366, 768)
```

### Set viewport dimensions with `set_viewport`

If your Python code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```python
s.set_viewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```python
s.set_viewport(300, 200)
```

### Set color depth with `set_color_depth`

If your Python code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```python
s.set_color_depth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```python
s.set_color_depth(32)
```

### Set timezone with `set_timezone`

This method lets you pass a user's timezone into Snowplow:

```python
s.set_timezone( {{TIMEZONE}} )
```

The timezone should be a string:

```python
s.set_timezone("Europe/London")
```

### Set the language with `set_lang`

This method lets you pass a user's language into Snowplow:

```python
s.set_lang( {{LANGUAGE}} )
```

The language should be a string:

```python
s.set_lang('en')
```

### Setting the IP address with `set_ip_address`

If you have access to the user's IP address, you can set it like this:

```python
s.set_ip_address('34.633.11.139')
```

### Setting the useragent with `set_useragent`

If you have access to the user's useragent (sometimes called "browser string"), you can set it like this:

```python
s.set_useragent('Mozilla/5.0 (Windows NT 5.1; rv:23.0) Gecko/20100101 Firefox/23.0')
```

### Setting the domain user ID with `set_domain_user_id`

The `domain_userid` field of the Snowplow event model corresponds to the ID stored in the first party cookie set by the Snowplow JavaScript Tracker. If you want to match up server-side events with client-side events, you can set the domain user ID for server-side events like this:

```python
s.set_domain_user_id('c7aadf5c60a5dff9')
```

You can extract the domain user ID from the cookies of a request using the `get_domain_user_id` function below. The `request` argument is, as an example, the [Django request object](https://docs.djangoproject.com/en/1.7/ref/request-response/).

**Note that this function has not been tested.**

```python
import re
def snowplow_cookie(request):
    for name in request.COOKIES:
        if re.match(r"_sp_id", name) != None:
           return request.COOKIES[name]
    return None

def get_domain_user_id(request):
    cookie = snowplow_cookie(request)
    if cookie != None:
        return cookie.split(".")[0]
```

If you used the "cookieName" configuration option of the Snowplow JavaScript Tracker, replace "_sp_" with the same string you passed as the cookieName.

### Setting the network user ID with `set_network_user_id`

The `network_user_id` field of the Snowplow event model corresponds to the ID stored in the third party cookie set by the Snowplow Collector. You can set the network user ID for server-side events like this:

```python
s.set_network_user_id('ecdff4d0-9175-40ac-a8bb-325c49733607')
```
### Setting Domain Session ID with `set_domain_session_id`
This method lets you pass a Domain Session ID in to Snowplow:

```python
s.set_domain_session_id('ecdff4d0-9175-40ac-a8bb-325c49733607')
```
### Setting Domain Session index with `set_domain_session_index`
This method lets you pass a Domain Session index in to Snowplow:
```python
s.set_domain_session_index(4)
```

## Tracking multiple subjects

You may want to track more than one subject concurrently. To avoid data about one subject being added to events pertaining to another subject, create two subject instances and switch between them using `Tracker.set_subject`:

```python
from snowplow_tracker import Subject, Emitter, Tracker

# Create a simple Emitter which will log events to https://d3rkrsqld9gmqf.cloudfront.net/com.snowplowanalytics.snowplow/tp2
e = Emitter("d3rkrsqld9gmqf.cloudfront.net")

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
t.track_page_view("http://www.example.com")

# Create another Subject instance corresponding to a mobile user
s2 = Subject()

# All methods of the Subject class return the Subject instance so methods can be chained:
s2.set_platform("mob").set_user_id("0b08f8be3f1")

# Change the tracker subject from s1 to s2
# All events fired will have instead have information we set about s2 attached
t.set_subject(s2)

# Track user s2 viewing a page
t.track_page_view("http://www.example.com")

# Switch back to s1 and track a structured event, this time using method chaining:
t.set_subject(s1).track_struct_event("Ecomm", "add-to-basket", "dog-skateboarding-video", "hd", 13.99)
```

  

**_\*\*New in v0.9.0_**

Since version 0.9.0, it is now possible to set the subject per event, instead of having to mutate the Tracker's subject. This enables a fine-grained control of the information you may want to add during the user journeys. It also makes the tracking of events idempotent even for multi-threaded applications, since it avoids mutating a shared state. The Tracker-level subject will only be used for events that don't specify an event subject.

You can specify an `event_subject` in all track methods. For example:

```python
from snowplow_tracker import Emitter, Tracker, Subject

e = Emitter("0.0.0.0", port=9090)
default_subject = Subject().set_platform("srv")
t = Tracker([e], s) 
# at this point the Tracker's subject is the default_subject. 
# The default_subject will be used in cases where an event_subject is not provided

# specifying event_subject - supported by all track methods
evSubject = Subject().set_platform("srv").set_user_id("tester")
t.track_page_view("www.example.com", event_subject=evSubject)

t.track_add_to_cart("sku1234", 1, event_subject=Subject().set_user_id("Bob"))
```
