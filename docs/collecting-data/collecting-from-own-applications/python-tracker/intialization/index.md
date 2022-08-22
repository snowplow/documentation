---
title: "Initialization"
date: "2020-02-26"
sidebar_position: 20
---

Assuming you have completed the Python Tracker Setup for your Python project, you are now ready to initialize the Python Tracker.

### Importing the module

Require the Python Tracker's module into your Python code like so:

```python
from snowplow_tracker import Tracker, Emitter, Subject
```

That's it - you are now ready to initialize a tracker instance.

### Creating a tracker

The simplest tracker initialization only requires you to provide the Emitter's endpoint to which the tracker will log events:

```python
e = Emitter("d3rkrsqld9gmqf.cloudfront.net")
t = Tracker(e)
```

The tracker parameters are:

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `emitters` | The emitter(s) to which events are sent | Yes |  |
| `subject` | The user being tracked | No | `subject.Subject()` |
| `namespace` | The name of the tracker instance | No | `None` |
| `app_id` | The application ID | No | `None` |
| `encode_base64` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No | `True` |
| `json_encoder` | Custom JSON serializer | No | `None` |

Here is a more complete example in which every tracker parameter is set:

```python
e = Emitter("d3rkrsqld9gmqf.cloudfront.net")
s = Subject().set_platform("srv")

tracker = Tracker( e, 
                   subject=s, 
                   namespace="cf", 
                   app_id="aid", 
                   encode_base64=False,
                   json_encoder=my_custom_encoder)
```

#### `emitters`

This can be a single emitter or an array containing at least one emitter. The tracker will send events to these emitters, which will in turn send them to a collector.

```python
e1 = Emitter("mycollector.com")
e2 = Emitter("myothercollector.com", port=8080)
tracker = Tracker([e1, e2])
```

#### `subject`

The user which the Tracker will track. This should be an instance of the Subject class. You don't need to set this during Tracker construction; in this case the tracker will set a default subject, which you can also change using the `Tracker.set_subject` method afterwards.

\*\*_**New in v0.9.0**_

Since version 0.9.0, you can also set a different subject per event instead of having to change the default subject. You can read more about it in the Subject documentation [here](/docs/collecting-data/collecting-from-own-applications/python-tracker/adding-extra-data-the-subject-class/index.md).

#### `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### `app_id`

The `app_id` argument lets you set the application ID to any string.

#### `encode_base64`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `encode_base64` argument.

#### `json_encoder` - (new in v0.9.0)

This parameter allows you to customize the JSON encoder used to serialize objects added to the payload. For example:

```python
from json.encoder import JSONEncoder
def complex_encoder(c):
    if isinstance(c,complex):
        return [c.real, c.imag]
    return JSONEncoder.default(c)

t = Tracker(e, json_encoder=complex_encoder)
```
