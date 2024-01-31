---
title: "From version 5.x to 6.0"
sidebar_position: -7
---

# Migration guide from version 5.x to 6.0

There were a few breaking changes within v6, for both iOS and Android. These are described here, with a quick summary of the non-breaking changes at the end.

## Changes to events

These changes probably won't break your app code, but they will affect the events generated.

### Lifecycle autotracking

Lifecycle autotracking ADD LINK is now on by default, for both trackers. This is because it's a prerequisite for the new screen engagement ADD LINK tracking, which is also on by default.

### Platform context entity (iOS only)

To comply with Apple's Privacy Manifest rules, we have removed the automatic tracking of `totalStorage` and `availableStorage` metrics from the [platform context entity](docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/platform-and-application-context/index.md). We've also added a Privacy Manifest for the SDK.

To track `totalStorage` or `availableStorage`, use the new `PlatformContextRetriever` callbacks class. The `PlatformContextRetriever` is available for both iOS and Android. It allows you to override any platform entity properties.

### Preventing unnecessary ScreenView event for Android

Previously a screen view event was tracked again by the screen view autotracking ADD LINK feature when the app moved to foreground. This is not expected because the screen doesn't change when the app is in background, and it is not consistent with how the screen view autotracking works on iOS. The extra event will no longer be tracked.

### Event entities API for iOS

To standardise the behaviour between trackers, we've changed how the `entities()` method of all events works on iOS. Previously, calling `event.entities(newListEntities)` replaced all the context entities currently attached to the event. Now, the new entities are appended instead.

There's no change to the behaviour of the variable `entities`, so you could still replace them all using `event.entities = newListEntities`.

## Non-optional tracker on iOS

In the v5.x of the iOS tracker, `createTracker` returned an optional `TrackerController?`. This was an oversight. In v6, the iOS tracker again returns a non-optional `TrackerController`.

## Concurrency on iOS

The return type of the `Tracker.track()` method has changed from `UUID?` to `UUID`. Previously, `nil` could be returned if the tracker was paused, or if the event was filtered out and not actually tracked. From v6 onwards it will always return a UUID. If the event is tracked, this will be the `eventId`.

This change was necessary as part of the comprehensive refactoring of the tracker thread model. The iOS tracker now uses a global dispatch queue. This single queue makes the tracker much safer. Almost all actions are now performed concurrently. Network requests in Emitter are still asynchronous.

## Changes to the `EventStore` interface

A new method, `removeOldEvents()` has been added to the `EventStore` protocol on both trackers. This method is used in the new feature that deletes events from storage if they get too old (by default, 30 days). Also, if too many events collect in the `EventStore`, the older ones will be deleted (default 1000 events).

For the Android tracker, we have updated the `EventStore` interface to remove the optional types.

## Non-breaking changes and bug fixes

### New events

The screen engagement ADD LINK feature adds new events for both iOS and Android. For iOS only, there are new events (and a new demo app) for visionOS ADD LINK. For Android, the `PageView` event has been restored, after accidental deprecation in v5.

### Cross-device tracking

Decorate URIs in both trackers using the new `CrossDeviceParameterConfiguration`. ADD LINK 

### Emitter and network connection behaviour

The Android tracker default emit timeout has been increased to 30 seconds, from 5 seconds. This setting is configured ADD LINK using the `NetworkConfiguration`. The `timeout` option has been added to the iOS tracker.

In both trackers, we have officially set the default batch size to 1 (`BufferOption.Single`), i.e. the events are sent as soon as they are tracked. This is consistent with the web tracker, and is a good default to use in client side apps to prevent some events hanging in the event store when the app is quit/uninstalled earlier than the event store is cleared. In theory, the previous behaviour was to send batches of 10 (`BufferOption.SmallGroup`), but due to a bug, they were always sent individually. We've also fixed a bug in which the `bufferOption` in `EmitterConfiguration` was not being used correctly, making it impossible to batch events. This is now possible.

For Android, we've increased the number of threads in the `Executor` thread pool. The thread count is now properly configurable.

For both trackers, network requests are now made serially. The new behaviour updates how the `EmitterConfiguration.emitRange` configuration is used – it now tells how many events should be added to one request. The new default `emitRange` is 25.

In both trackers, the internal `Emitter` constructor has been updated. The change moves the namespace and event store into the constructor, enabling removing some optionals, and makes the properties immutable and safer.

### Access to `EventStore` in iOS tracker

The `EventStore` is now exposed as part of the `EmitterController`, allowing access for e.g. deleting all stored events like this `tracker?.emitter?.eventStore?.removeAllEvents()`. This was already possible on Android.

### Codable structs in the iOS tracker

The custom event and entity classes `SelfDescribing` and `SelfDescribingJson` now accept data represented using `Encodable` structs. This alllows you to define the data using typed structs, and track that directly instead of using untyped dictionaries.

### Removed FMDB dependency for iOS

The FMDB dependency has been removed from `SQLiteEventStore`. The built-in `sqlite` methods are used instead.
