---
title: "Introduction to Python tracker initialization"
sidebar_label: "Initialization"
sidebar_position: 20
---

Assuming you have completed the Python Tracker Setup for your Python project, you are now ready to initialize the Python Tracker. There are two ways to this:

1. Using the `Snowplow` class. This is preferable for most use cases.
2. Using the `Tracker`, `Emitter` and `Subject` classes. This option is useful in case you want to replace one of the internal tracker components (for instance, you want to provide a custom `Emitter` class).

## Option 1: Initialization using the Snowplow class
The Snowplow class contains `static` methods to help manage `Tracker` objects. 

Import the Snowplow class along with the required configuration objects:

```python
from snowplow_tracker import Snowplow, EmitterConfiguration, Subject, TrackerConfiguration
```

The simplest tracker configuration can be instantiated with the `create_tracker()` method as follows:

```python
Snowplow.create_tracker(namespace='ns', endpoint='collector.example.com')
```

This creates a `Tracker` and `Emitter` with default settings, with events logged to `collector.example.com`.

You can access a tracker in the following way:

```python
Snowplow.get_tracker('ns')
```

The Snowplow class can be used to initialize trackers using the following properties:

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `namespace` | The name of the tracker  | Yes |  |
| `endpoint` | The collector URL events are sent to  | Yes |  |
| `method` | The method to use: “get” or “post” | No | `post` |
| `emitter_config` | The emitter configuration object | No | `EmitterConfiguration()` |
| `app_id` | The application ID | No | `None` |
| `subject` | The user being tracked | No | `subject.Subject()` |
| `tracker_config` | The tracker configuration object | No | `TrackerConfiguration()` |

Optionally, you may choose to use the `TrackerConfiguration` and `EmitterConfiguration` classes to configure the emitter and tracker respectively.  

### Tracker configuration using `TrackerConfiguration`

The `TrackerConfiguration` class contains settings to encode the payload and provide a custom json serializer. For example:

```python
tracker_config = TrackerConfiguration(
    encode_base64=False,
    json_encoder=my_custom_encoder
)

Snowplow.create_tracker(
    namespace='ns', 
    endpoint='collector.example.com',
    tracker_config = tracker_config
)
```

| **Argument Name** | **Description** | **Default** |
| --- | --- | --- |
| `encode_base64` | Whether JSONs in the payload should be base-64 encoded. | `True` |
| `json_encoder` | Custom JSON serializer that gets called on non-serializable object. | `None` |
### Emitter configuration using `EmitterConfiguration`

The `EmitterConfiguration` class contains additional settings for the `Emitter` initialization. For example:

```python
emitter_config = EmitterConfiguration(
    batch_size = 50,
    on_success = my_success_function,
    on_failure= my_failure_function,
    byte_limit = 25000,
    request_timeout = (10, 20),
    custom_retry_codes = {500: False, 401: True}, # Don't retry 500, retry 401
    event_store=my_custom_event_store,
    session=requests.Session
)

Snowplow.create_tracker(
    namespace='ns', 
    endpoint='collector.example.com',
    emitter_config = emitter_config
)
```

The full list of arguments is below:

| **Argument Name** | **Description** | **Default** |
| --- | --- | --- | 
| `batch_size` | The maximum number of queued events before the buffer is flushed. | `10` |
| `on_success` | Callback executed after every HTTP request in a flush has status code 200. | `None` |
| `on_failure` | Callback executed if at least one HTTP request in a flush has status code other than 200. | `None` |
| `byte_limit` | The size event list after reaching which queued events will be flushed. | `None` |
| `request_timeout` | Timeout for the HTTP requests. Can be set either as single float value which applies to both "connect" AND "read" timeout, or as tuple with two float values which specify the "connect" and "read" timeouts separately. | `None` |
| `custom_retry_codes` | Set custom retry rules for HTTP status codes received in emit responses from the Collector. By default, retry will not occur for status codes 400, 401, 403, 410 or 422. This can be overridden here. Note that 2xx codes will never retry as they are considered successful. | `None` |
| `event_store` | Stores the event buffer and buffer capacity. | `InMemoryEventStore` |
| `session` | Persist parameters across requests by using a session object | `None` |



## Option 2: Managing "Tracker", "Emitter", and "Subject" directly

Require the Python Tracker's module into your Python code like so:

```python
from snowplow_tracker import Tracker, Emitter, Subject
```

That's it - you are now ready to initialize a tracker instance.

### Creating a tracker

The simplest tracker initialization only requires you to provide the Emitter's endpoint to which the tracker will log events:

```python
e = Emitter(endpoint="collector.example.com")
t = Tracker(namespace="snowplow_tracker", emitters=e)
```

The tracker parameters are:

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `namespace` | The name of the tracker instance | Yes |  |
| `emitters` | The emitter(s) to which events are sent | Yes |  |
| `subject` | The user being tracked | No | `subject.Subject()` |
| `app_id` | The application ID | No | `None` |
| `encode_base64` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No | `True` |
| `json_encoder` | Custom JSON serializer | No | `None` |

Here is a more complete example in which every tracker parameter is set:

```python
e = Emitter(endpoint="collector.example.com")
s = Subject().set_platform("srv")

tracker = Tracker( 
    namespace="cf", 
    emitter=e, 
    subject=s, 
    app_id="aid", 
    encode_base64=False,
    json_encoder=my_custom_encoder
)
```

#### `namespace`

The `namespace` argument is attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### `emitters`

This can be a single emitter or an array containing at least one emitter. The tracker will send events to these emitters, which will in turn send them to a collector.

```python
e1 = Emitter(endpoint="mycollector.com")
e2 = Emitter(endpoint="myothercollector.com", port=8080)
tracker = Tracker(namespace="snowplow_tracker", emitters=[e1, e2])
```

#### `subject`

The user which the Tracker will track. This should be an instance of the Subject class. You don't need to set this during Tracker construction; in this case the tracker will set a default subject, which you can also change using the `Tracker.set_subject` method afterwards.

#### `app_id`

The `app_id` argument lets you set the application ID to any string.

#### `encode_base64`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `encode_base64` argument.

#### `json_encoder` 

This parameter allows you to customize the JSON encoder used to serialize objects added to the payload. For example:

```python
from json.encoder import JSONEncoder
def complex_encoder(c):
    if isinstance(c,complex):
        return [c.real, c.imag]
    return JSONEncoder.default(c)

t = Tracker(
    namespace="snowplow_tracker", 
    emitter=e, 
    json_encoder=complex_encoder
)
```
