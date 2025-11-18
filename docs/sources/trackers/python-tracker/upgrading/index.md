---
title: "Upgrading the Python Tracker"
sidebar_position: 100
---

This page gives instructions to upgrading to newer versions of the Python Tracker
## Upgrading to v1.0.0
There are a number of breaking changes and new features in the V1 release, in order to make use of the latest tracker make sure to:

- Tracker `namespace` is now a required property in the tracker and should be parsed on initialization of a new tracker.
- The `track_xxx()` functions have been deprecated in favor of the `Event` class, further information on tracking events using the new API can be found on the [Event Tracking](/docs/sources/trackers/python-tracker/tracking-specific-events/index.md) page.
- The `track()` function in the tracker now returns an event id, instead of a tracker instance. Chaining methods using the `track()` function will no longer work, and methods should be applied to the tracker itself.
- The `track()` function no longer accepts a `Payload` object as an argument and instead accepts an `Event` object. 
- The parameters in the `Tracker` constructor have changed order, to avoid errors we suggest explicitly defining the variables.
- Event subjects and tracker subjects are now combined when an event is tracked on a given tracker. The old API will continue to work, however the contents of the payload in the event will contain additional tracker subject data.
- The `Redis` and `Celery` emitters have now been removed from the Python tracker. An example of a redis implementation can be found in the [examples](https://github.com/snowplow/snowplow-python-tracker/tree/master/examples/redis_example) section of the tracker repo. 
## Upgrading to v0.13.0+
There are a number of breaking changes in this release, in order to make use of the new features please make sure to:

- Use the `batch_size` argument instead of `buffer_size` in the Emitter initialization.
- Users should no longer use the `on_failure` method to determine retry behaviors. Retry failed events is now a built in feature which can be configured in the `Emitter` directly or via `EmitterConfiguration` object.

