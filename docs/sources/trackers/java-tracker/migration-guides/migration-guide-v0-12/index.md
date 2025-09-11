---
title: "From version 0.11 to 0.12"
description: "Migration guide for upgrading Java tracker from version 0.12 with behavioral tracking improvements."
schema: "TechArticle"
keywords: ["Java Migration", "V0.12 Migration", "Version Migration", "Upgrade Guide", "Migration Guide", "Breaking Changes"]
date: "2022-03-24"
sidebar_position: 100
---

Several new features were added in v0.12. See the [Github](https://github.com/snowplow/snowplow-java-tracker) changelog for full details. Unfortunately, these improvements involve multiple breaking changes. See below for a guide to the changes.

### `BatchEmitter`

The `BatchEmitter.Builder` configuration options have changed.

**Updated**:

- `bufferSize` has been renamed `batchSize`.
- `requestExecutorService()` now requires a `ScheduledExecutorService`, rather than just `ExecutorService`.

**Removed**:

- `requestCallback()` is gone, since events that fail to send will now be automatically retried.

**Added** (these are not breaking changes):

- `eventStore()`. It's now possible to design your own event buffer using the `EventStore` interface. This is an optional setting, with a default of `InMemoryEventStore`.
- `bufferCapacity()`. Set the maximum capacity of the default `InMemoryEventStore`. Again, this setting is optional. The default is `Integer.MAX_VALUE` (the maximum capacity of the queue used).

**Example**: creating a BatchEmitter with the relevant options  
Old API:

```java
BatchEmitter batchEmitter = BatchEmitter.builder()
        .url("http://collector.url")
        .bufferSize(20)
        .requestCallback( {{ A callback }} )
        .requestExecutorService(ExecutorService)
        .build();
```

Version 0.12:

```java
BatchEmitter batchEmitter = BatchEmitter.builder()
        .url("http://collector.url")
        .batchSize(20)
        .eventStore(EventStore)
        .bufferCapacity(1000000) // this won't do anything since eventStore is specified
        .requestExecutorService(ScheduledExecutorService)
        .build();
```

### `SimpleEmitter`

`SimpleEmitter` has been deprecated. Please use `BatchEmitter` instead, or create your own `Emitter` using the provided interface. Like `SimpleEmitter`, the `BatchEmitter` sends events asynchronously. However, requests are made using POST, rather than GET. We strongly recommend sending events in batches, but to mimic SimpleEmitter in sending events one-by-one, use a `batchSize` of 1.

**Example**: replacing `SimpleEmitter` with `BatchEmitter`  
Old API:

```java
SimpleEmitter simpleEmitter = SimpleEmitter.builder()
        .url("http://collector.url")
        .build();

Tracker tracker = new Tracker.TrackerBuilder(simpleEmitter, "namespace", "appId")
        .build();
```

Version 0.12:

```java
BatchEmitter batchEmitter = BatchEmitter.builder()
        .url("http://collector.url")
        .batchSize(1)
        .build();

Tracker tracker = new Tracker.TrackerBuilder(batchEmitter, "namespace", "appId")
        .build();
```

### `Emitter` interface

Every method in the `Emitter` interface has been updated!

`setBufferSize()` and `getBufferSize()` have been renamed `setBatchSize()` and `getBatchSize()`.

`getBuffer()` now returns a list of `TrackerPayload` objects rather than `TrackerEvent` objects (which no longer exist).

Finally, `emit()` is now more accurately called `add()`, as in "add to buffer". It takes a `TrackerPayload` object, not a `TrackerEvent`, and has a new return type: a `boolean`, used to confirm that the `TrackerPayload` has been successfully added to the buffer.

### Getting an event's `eventId`

We are aware of some use cases involving exporting the `eventId`s of tracked Events to third-party apps. The `eventId` is now returned from `Tracker.track()`. It's returned in a list to allow for `EcommerceTransaction` events, which generate multiple payloads. If the event buffer is full, the event is lost. In this case, `null` will be returned instead of the `eventId`.

**Example**: getting the `eventId`  
Old API:

```java
PageView pageView = PageView.builder()
        .pageUrl("https://www.snowplowanalytics.com")
        .build();

String eventId = pageView.getEventId();
```

Version 0.12:

```java
PageView pageView = PageView.builder()
        .pageUrl("https://www.snowplowanalytics.com")
        .build();

List<String> eventIds = tracker.track(pageView);
String eventId = eventIds.get(0);
```

### `Event`, `AbstractEvent`, and child classes

Several methods have been removed: the `Event` interface and `AbstractEvent` methods `getDeviceCreatedTimestamp()`, and `getEventId()`; and the `AbstractEvent.Builder` methods `deviceCreatedTimestamp()`, and `eventId()`. The deprecated `timestamp()` and `getTimestamp()` methods have been removed from these classes too.

Having discovered them, we deleted these methods immediately (rather than deprecating) as we considered them very dangerous. Allowing custom UUIDs can accidentally lead to non-unique "unique" identifiers, which causes big problems for pipelines, and risks data loss.

Despite the name, `Event` objects are no longer associated with an `eventId` ; this is generated when the `Payload` object is made. The main purpose of the `eventId` is to provide a UUID for events once they have been received by the collector and are in the pipeline.

**Example**: creating a PageView with all the options  
Old API:

```java
PageView pageViewEvent = PageView.builder()
        .pageTitle("Snowplow Analytics")
        .pageUrl("https://www.snowplowanalytics.com")
        .referrer("https://www.google.com")
        .customContext(SelfDescribingJson)
        .subject(Subject)
        .trueTimestamp(1646834667343L)
        .deviceCreatedtimestamp(1646834667123L)
        .eventId("UUID")
        .build();
```

Version 0.12:

```java
PageView pageViewEvent = PageView.builder()
        .pageTitle("Snowplow Analytics")
        .pageUrl("https://www.snowplowanalytics.com")
        .referrer("https://www.google.com")
        .customContext(SelfDescribingJson)
        .subject(Subject)
        .trueTimestamp(1646834667343L)
        .build();
```

### `TrackerEvent` and callbacks

This class no longer exists. It was a wrapper around tracked `Event` objects to allow request callbacks. `Event`s were stored in the buffer as `TrackerEvent` until event sending, when a `TrackerPayload` would be extracted. `TrackerPayload` objects are now stored directly.

Callbacks allowed developers to re-track events that failed to send - if a HTTP response code other than 2xx was received. This put the burden on users to handle retry. Now that the tracker automatically retries, callbacks are no longer necessary, and have been removed.
