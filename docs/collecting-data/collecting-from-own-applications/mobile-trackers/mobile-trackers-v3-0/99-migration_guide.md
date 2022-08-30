---
title: "Migration guide"
date: "2022-08-30"
sidebar_position: 1000
---

# Migration guide for Snowplow iOS Tracker SDK from version 2.x to 3.0

This new release doesn't introduce breaking changes with the previous 2.x version.
The version 2.0 can be considered a transitory release because two different APIs were available for the developer: v1 API (deprecated) and v2 API (the new one).
The version 3.0 doesn't introduce changes to the v2 API but it completely remove the v1 API. Hence, this version introduces breking changes only for the developer that have instrumented the v2.0 using the old deprecated v1 API.

In this release we've marked as deprecated:

- `PageView` event: this event has been designed for web tracking. Its role can be replaced on mobile with two different events: `ScreenView` event and `DeepLinkReceived` event. The first covers the need of tracking the screen visualized to the user by the app. The latter covers the case where the shown content is referred to an external url referral and we want to track that down, exactly like the PageView does in the web tracker.

- `PushNotification` event: this event is available only on iOS tracker and it's strongly influenced by the format of push notifications in the iOS platform. It has been replaced with `MessageNotification` which is usable in both iOS and Android trackers v3.0.

In this release there are some breaking changes:

- The v1 API has been removed from this new version of the trackers, which means the v1 components (Tracker, Emitter, Subject, Session) used to set up the tracker are no longer available. If you have already migrated your instrumentation to the v2 API there aren't breaking changes.

- The events can be built using the constructor and builder methods. The builder classes available with v1 are no longer available. If you already build events using events' constructor suggested with the v2 API, there aren't breaking changes.

- Session callbacks have been removed. They will be reintroduced soon in one of the next minor versions. More details will be provided at the release.

- Utilities or Utils methods, available in v1 API, have been removed.

# Migration guide for Snowplow iOS Tracker SDK from version 1.x to 2.0

The main objective of this new release is a revision of the public API.
Currently, the tracker configuration requires the creation of the Tracker and Emitter components. Optionally, the Subject component can be configured as well. Then both need to be passed to the Tracker component. The version 2.0 simplifies this process, letting the developer to specify the configuration with Configuration objects and passing them to a `createTracker` method able to return the tracker ready to use, without any other extra steps.

The tracker has been also updated improving the compatibility with Swift. Now, the classes of the public API don't need the `SP` prefix required on Objective-C.

### Setup of the tracker

The entry point to setup the tracker is now the `Snowplow` class and the `createTracker` methods.
They need a namespace string which is now mandatory. The namespace string uniquely identifies the tracker in the app. It's important to note that all the events not sent to the collector but stored in the tracker are attached to the namespace string. This means that if a new configuration uses a different namespace, all those unsent event will still stored in the tracker, in a sort of zombie state, with no way to send them to any collector. To send them you need to reuse the original namespace string or delete them.

Fine tuning of the tracker is now possible with Configuration classes.

These are the classes now available:
- `NetworkConfiguration`: to configure network connection with the Snowplow collector.
- `TrackerConfiguration`: to configure contexts and automatic events of the tracker, and general behaviour.
- `SessionConfiguration`: to configure session behaviour.
- `EmitterConfiguration`: to fine tune about how the tracker sends events to the collector.
- `SubjectConfiguration`: to specify details to send with events about the user and the platform.
- `GdprConfiguration`: to configure the GDPR context.
- `GlobalContextsConfiguration`: to configure the GlobalContexts feature to dynamically send created contexts with some selected events.

They replace many of the settings previously set on the builders for the Tracker, Subject and Emitter components.

An example configuration:

```swift
func initTracker(trackerNamespace: String) -> TrackerController {
        let networkConfig = NetworkConfiguration(endpoint: "https://snowplow-collector-url.com")
        let trackerConfig = TrackerConfiguration()
            .sessionContext(true)
            .platformContext(true)
            .applicationContext(true)
            .lifecycleAutotracking(true)
            .screenViewAutotracking(true)
            .screenContext(true)
            .exceptionAutotracking(true)
            .installAutotracking(true)
            .diagnosticAutotracking(true)
        let sessionConfig = SessionConfiguration(
            foregroundTimeout: Measurement(value: 60, unit: .seconds),
            backgroundTimeout: Measurement(value: 30, unit: .seconds)
        )
        let gdprConfig = GDPRConfiguration(
            basis: .consent, 
            documentId: "id", 
            documentVersion: "1.0", 
            documentDescription: "description"
        )
        
        return Snowplow.createTracker(
            namespace: trackerNamespace,
            network: networkConfig,
            configurations: [trackerConfig, emitterConfig, sessionConfig, gdprConfig]);
}
```

The tracker can be controlled by the `TrackerController` (the `Tracker` class is now deprecated). Through the `TrackerController` it will be possible to update settings at runtime and get information about the tracking state. From the `TrackerController` it's also possible to access all the other controllers. This allows you to access and update settings about communication with the collector, emission of the events, session of the tracker (if enabled) and so on. In general, there is a specific controller for each area covered by a configuration. All of them are accessible through the `TrackerController`.

**Note:** Please, don't retain a reference to the sub-controllers. If you invalidate or recreate the tracker, all the sub-controller instances will no longer be active.

## Low level migration from 1.x

- iOS minimum supported version is bumped to iOS 9.0.
- `lifecycleAutotracking` (background and foreground events and indexes on sessions) are optional and off by default.

- Enum `SPProtocol` items have been renamed to `SPProtocolHttp` and `SPProtocolHttps`. 
- Enum `SPRequestOptions` has been renamed `SPHttpMethod` and its items are `SPHttpMethodGet` and `SPHttpMethodPost`.
- `Snowplow` class is now the entry point to create trackers. The old `Snowplow` class containing the constants has been renamed `SPTrackerConstants`.
- `SPPrimitive` and `SPSelfDescribing` have been renamed as `SPPrimitiveAbstract` and `SPSelfDescribingAbstract`.
- `SPUnstructured` class used for self-describing events has been renamed `SPSelfDescribing`.
- The property `trueTimestamp` changed the type from `NSNumber` to `NSDate`.

- `namespace` on Tracker is now mandatory for the correct operativity.
- `name` field on `ScreenView` is now mandatory.
- `EcommerceItem`s aren't forced to have the same timestamp of the `EcommerceTransaction` event.
- `SPEcommerceItem` constructor doesn't require `itemId` as it's added by the tracker when the e-commerce event is sent.

- Deprecated classes of the previous API (SPTracker, SPEmitter, SPSubject, ...).
- On data modelling, the install events report the timestamp of when installation happened in the true_timestamp rather than the device_timestamp.
