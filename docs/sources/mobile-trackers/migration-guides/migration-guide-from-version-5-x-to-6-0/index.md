---
title: "Migration guide from version 5.x to 6.0"
sidebar_label: "From version 5.x to 6.0"
sidebar_position: -7
description: "Migrate to mobile tracker version 6.0 with changes to lifecycle tracking, event batching, and screen engagement features."
keywords: ["migration", "version 6.0", "lifecycle tracking"]
---

There were a few breaking changes within v6, for both iOS and Android. These are described here, with a quick summary of the rest of the changelog at the end.

## Changes to events

These changes probably won't break your app code, but they will affect the events generated.

### Lifecycle autotracking

Affects: iOS ✅ Android ✅

[Lifecycle autotracking](/docs/sources/mobile-trackers/tracking-events/lifecycle-tracking/index.md) is now on by default, for both trackers. This is because it's a prerequisite for the new [screen engagement tracking](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md#screen-engagement-tracking), which is also on by default.

### Removed properties from platform context entity

Affects: iOS ✅ Android ❌

To comply with Apple's Privacy Manifest rules, we have removed the automatic tracking of `totalStorage` and `availableStorage` metrics from the [platform context entity](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md). We've also added a Privacy Manifest for the SDK.

To track `totalStorage` or `availableStorage`, use the new `PlatformContextRetriever` callbacks class to configure the platform context entity.

### Preventing unnecessary ScreenView event

Affects: iOS ❌ Android ✅

Previously a screen view event was tracked again by the [screen view autotracking](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md) feature when the app moved to foreground. This is not expected because the screen doesn't change when the app is in background, and it is not consistent with how the screen view autotracking works on iOS. The extra event will no longer be tracked.

### Event entities API

Affects: iOS ✅ Android ❌

To standardise the behavior between trackers, we've changed how the `entities()` method of all events works on iOS. Previously, calling `event.entities(newListEntities)` replaced all the context entities currently attached to the event. Now, the new entities are appended instead.

There's no change to the behavior of the variable `entities`, so you could still replace them all using `event.entities = newListEntities`.

## Event batching

Affects: iOS ✅ Android ✅

In both trackers, we have changed how the `EmitterConfiguration` options `bufferOption` and `emitRange` are used, as well as changing the defaults. Read more about that [here](/docs/sources/mobile-trackers/configuring-how-events-are-sent/index.md#configuring-how-many-events-to-send-in-one-request). The `BufferOption.defaultGroup` has been renamed to `BufferOption.SmallGroup`.

Network requests are now made serially. If you are using a custom `EmitterConfiguration.emitRange`, you may wish to set it to a lower value. The new default `emitRange` is 25 (down from 150).

## Non-optional tracker

Affects: iOS ✅ Android ❌

In the v5.x of the iOS tracker, `createTracker` returned an optional `TrackerController?`. This was an oversight. In v6, the iOS tracker again returns a non-optional `TrackerController`.

## `Tracker.track()` return type

Affects: iOS ✅ Android ❌

The return type of the `Tracker.track()` method has changed from `UUID?` to `UUID` on iOS. Previously, `nil` could be returned if the tracker was paused, or if the event was filtered out and not actually tracked. From v6 onwards it will always return a UUID. If the event is tracked, this will be the `eventId`.

This change was necessary as part of the comprehensive refactoring of the tracker thread model. The iOS tracker now uses a global dispatch queue. This single queue makes the tracker much safer. Almost all actions are now performed concurrently. Network requests in Emitter are still asynchronous.

## Changes to the `EventStore` interface

Affects: iOS ✅ Android ✅

A new method, `removeOldEvents()` has been added to the `EventStore` protocol on both trackers. This method is used in the new feature that deletes events from storage if they get too old (by default, 30 days). Also, if too many events collect in the `EventStore`, the older ones will be deleted (default 1000 events).

For the Android tracker, we have updated the `EventStore` interface to remove the optional types.

## Other changes

See the full changelog on Github, for [iOS](https://github.com/snowplow/snowplow-ios-tracker/releases/tag/6.0.0) and [Android](https://github.com/snowplow/snowplow-android-tracker/releases/tag/6.0.0).

### New events

The [screen engagement](/docs/sources/mobile-trackers/tracking-events/screen-tracking/index.md#screen-engagement-tracking) feature adds new events for both iOS and Android. For iOS only, there are new events (and a new demo app) for [visionOS](/docs/sources/mobile-trackers/tracking-events/visionos/index.md). For Android, the `PageView` event has been restored, after accidental deprecation in v5.

### Cross-navigation tracking

Decorate URIs with [user and session information](/docs/sources/mobile-trackers/tracking-events/session-tracking/index.md#decorating-outgoing-links-using-cross-navigation-tracking) in both trackers using the new `CrossDeviceParameterConfiguration`. This is the equivalent of cross-domain tracking for web.

### Access to `EventStore` in iOS tracker

The `EventStore` is now exposed as part of the `EmitterController`, allowing access for e.g. deleting all stored events like this `tracker?.emitter?.eventStore?.removeAllEvents()`. This was already possible on Android.

### Codable structs in the iOS tracker

The custom event and entity classes `SelfDescribing` and `SelfDescribingJson` now accept data represented using `Encodable` structs. This alllows you to define the data using typed structs, and track that directly instead of using untyped dictionaries.

### Provide custom values to platform context entity

As mentioned above, the new `PlatformContextRetriever` callbacks class allows you to override any [platform entity](/docs/sources/mobile-trackers/tracking-events/platform-and-application-context/index.md#overriding-platform-context-properties) properties. The `PlatformContextRetriever` is available for both iOS and Android.

### Emitter and network connection behavior

The Android tracker default emit timeout has been increased to 30 seconds, from 5 seconds. This setting is configured using `NetworkConfiguration`. The `timeout` configuration option has been added to the iOS tracker.

In both trackers, the internal `Emitter` constructor has been updated. The change moves the namespace and event store into the constructor, enabling removing some optionals, and makes the properties immutable and safer.

### Removed FMDB dependency for iOS

The FMDB dependency has been removed from `SQLiteEventStore`. The built-in `sqlite` methods are used instead.
