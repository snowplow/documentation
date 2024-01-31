---
title: "From version 5.x to 6.0"
sidebar_position: -7
---

# Migration guide from version 5.x to 6.0

There were a few breaking changes within the new features and updates in v6, for both iOS and Android.

## Changes to events

These changes probably won't affect your app code, but they will affect the events generated.

### Lifecycle autotracking

Lifecycle autotracking is now on by default, for both trackers. This is because it's a prerequisite for the new screen engagement tracking, which is also on by default.

### Platform context entity (iOS only)

To comply with 



TODO

Although the trackers underwent a huge internal rewrite (from Objective-C to Swift and from Java to Kotlin), we tried to keep the API with as little breaking changes as possible.

## iOS tracker

The supported platforms have changed on the iOS tracker:

* Minimum iOS deployment target changed from 9.0 to 11.0.
* On macOS, from 10.10 to 10.13.
* On tvOS, from 9.0 to 12.0.
* On watchOS, from 2.0 to 6.0.

Additionally, there is a new way to enable tracking the IDFA identifier – instead of adding the `SNOWPLOW_IDFA_ENABLED` compiler flag, one now needs to implement a callback (`TrackerConfiguration.advertisingIdentifierRetriever`) that retrieves the value. See the [documentation for more information](../../tracking-events/platform-and-application-context/index.md#identifier-for-advertisers-idfaaaid).

If using `EmitterConfiguration` when creating a new tracker, the default buffer option configuration changed from `single` (max 1 event per batch) to `default` (max 10 events per batch). If not using an `EmitterConfiguration`, the buffer option was set to `default` also in tracker v4.

## Android tracker

We adopted using Kotlin properties instead of Java fields for public properties of the event classes. This doesn't change the API in Kotlin. On the other hand, in Java, the properties are now accessible through getter and setter methods instead of directly as Java fields.

For example, to set the true timestamp of events in Java the API changes as follows:

```java
// v4 API:
event.trueTimestamp = 123456789L; // doesn't work anymore
// v5 API:
event.setTrueTimestamp(123456789L);
```

However, the API hasn't changed if you use the builder methods to set the properties. For example, this approach works in both the v4 and v5 tracker:

```java
// works both in v4 and v5 API:
event.trueTimestamp(123456789L);
```

If using `EmitterConfiguration` when creating a new tracker, the default buffer option configuration changed from `single` (max 1 event per batch) to `default` (max 10 events per batch). If not using an `EmitterConfiguration`, the buffer option was set to `default` also in tracker v4.

## Renaming contexts to entities

The `contexts` property in events used to assign custom context entities to events has been renamed to `entities`. The previous naming is still available but it is deprecated.

In the Android tracker, the `customContexts` property in events has been deprecated in favor of the `entities` property.
