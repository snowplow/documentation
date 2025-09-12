---
title: "From version 0.12 to 1.0"
description: "Migration guide for upgrading Java tracker to version 1 with enhanced behavioral event capabilities."
schema: "TechArticle"
keywords: ["Java Migration", "V1 Migration", "Version Migration", "Upgrade Guide", "Migration Guide", "Breaking Changes"]
date: "2022-03-24"
sidebar_position: 90
---

We've made multiple improvements to the API, and to the configuration, for Java tracker v1. See the [Github changelog](https://github.com/snowplow/snowplow-java-tracker/releases/tag/1.0.0) for full details. See below for a guide to the changes.

## API improvements (breaking changes)
### `Snowplow` interface, `Configuration` classes, and deprecated Builders
This is a big change. We wanted an intuitive API going into v1, so we've added a `Snowplow` interface to easily create and manage trackers. We've added Configuration classes - `TrackerConfiguration`, `NetworkConfiguration`, `EmitterConfiguration` and `SubjectConfiguration` - and several new constructors for instantiating the tracker or tracker components. As part of this work, we've deprecated the builders for the `Tracker`, `BatchEmitter`, `HttpClientAdapter` and `Subject` classes.

Instantiating a tracker with default configuration only requires three strings. Use configuration objects to instantiate custom trackers.

**Example**: creating a tracker with default configuration  

Old API:
```java
BatchEmitter emitter = BatchEmitter.builder()
        .url("http://collectorEndpoint")
        .build();
Tracker tracker = new Tracker
        .TrackerBuilder(emitter, "trackerNamespace", "appId")
        .build();
```

New v1 API:
```java
Tracker tracker = Snowplow.createTracker("trackerNamespace", "appId", "http://collectorEndpoint");
```



**Example**: creating a tracker with custom configuration  

Old API:
```java
BatchEmitter emitter = BatchEmitter.builder()
        .url("http://collectorEndpoint")
        .batchSize(10)
        .threadCount(1)
        .build();
Tracker tracker = new Tracker
        .TrackerBuilder(emitter, "trackerNamespace", "appId")
        .platform(DevicePlatform.Desktop)
        .base64(false)
        .build();
```

Version 1.0.0:
```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("trackerNamespace", "appId")
        .platform(DevicePlatform.Desktop)
        .base64Encoded(false);
NetworkConfiguration networkConfig = new NetworkConfiguration("http://collectorEndpoint");
EmitterConfiguration emitterConfig = new EmitterConfiguration()
        .batchSize(10)
        .threadCount(1);
        
Tracker tracker = Snowplow.createTracker(trackerConfig, networkConfig, emitterConfig);
```

In the above examples, the `Tracker` is saved as a separate variable. That's not actually necessary with the new `Snowplow` class! Access stored `Tracker` objects by their namespace, or use the default tracker:

New v1 API:
```java
Snowplow.createTracker("trackerNamespace", "appId", "http://collectorEndpoint");
Snowplow.getDefaultTracker().track(event);
```

### `SelfDescribing` events 
The `Unstructured` class has been renamed to `SelfDescribing`, bringing consistency with other Snowplow trackers. These are the custom events, based on self-describing (self-referential) JSONs, that allow you to create the perfect data for your business needs.

**Example**: replacing `Unstructured` with `SelfDescribing`  

Old API:
```java
Unstructured event = Unstructured.builder()
            .eventData(dataAsSelfDescribingJson)
            .build();
```

New v1 API:
```java
SelfDescribing event = SelfDescribing.builder()
            .eventData(dataAsSelfDescribingJson)
            .build();
```

### Custom retry logic
The event sending retry logic has been refined. By default, the tracker will now not retry requests with the HTTP status codes 400, 401, 403, 410, or 422. This can be configured using the Emitter builder option `customRetryForStatusCodes()`, which replaces `fatalResponseCodes()`. Note that 2xx status codes will always be deemed successful, and will never be retried.

`customRetryForStatusCodes()` takes a map of integer codes and booleans - true for "yes, this should be retried" and false for "no, this should not be retried".

**Example**: setting custom retry rules  

Old API:
```java
List<Integer> noRetry = new ArrayList<>();
noRetry.add(500);

BatchEmitter emitter = BatchEmitter.builder()
        .url("https://collector")
        .fatalResponseCodes(noRetry)
        .build();
```

New v1 API:
```java
Map<Integer, Boolean> customRetry = new HashMap<>();
customRetry.put(500, false);

BatchEmitter emitter = new BatchEmitter(
      new NetworkConfiguration("https://collector"),
      new EmitterConfiguration().customRetryForStatusCodes(customRetry));
```

### New method for `Emitter` interface

The `BatchEmitter` method `close()` has been added to the `Emitter` interface. This method stops the executor service and closes the threads, and may be required to cleanly exit your application. If you are using a custom `Emitter`, you'll need to implement the method (`@Override`). The `Tracker` class now has a `close()` method too, which calls `Emitter.close()`.


### Updated method for `EventStore` interface

The `EventStore` method `cleanupAfterSendingAttempt()` now returns `List<TrackerPayload>`, rather than `void`. This is to help with the new `EmitterCallback` implementation (see below). If you are using a custom `EventStore`, you'll need to update the method signature.


## Default configuration changes

The default `bufferCapacity`, the maximum number of events that can be buffered in memory, is now 10 000 (down from `Integer.MAX_VALUE`).

By default, the Java tracker now does not retry sending events if the request received the HTTP status code `400 Bad Request`, `401 Unauthorised`, `403 Forbidden`, `410 Gone`, or `422 Unprocessable Entity`.

When requests get a "unsuccessful" response status code - anything other than 2xx - a backoff wait time is added before the next request is processed. The wait time increases exponentially with every failure. There is now a maximum wait time of 10 minutes.

## Removed features
The `SimpleEmitter` class, deprecated in v0.12, has been removed. The default `Emitter` is the `BatchEmitter`, but you can also create your own `Emitter` using the provided interface. The `BatchEmitter` sends events in batches via POST. Deleting `SimpleEmitter` allowed us to tidy up behind-the-scenes, merging `AbstractEmitter` and `BatchEmitter` into one class.

We also removed the [Guava](https://github.com/google/guava) dependency.

## New features
New and improved callbacks! You can now add custom callbacks using the `EmitterCallback` interface, for example to create tracker metrics. The `EmitterCallback` will be called when events are successfully sent, and also in response to several different failures. It's described fully [here](/docs/sources/trackers/java-tracker/configuring-how-events-are-sent/index.md#using-the-emitter-callback).

You can now add a `CookieJar` to persist the third-party event collector `sp` cookie across requests. This allows all events to have the same `network_userid`.
