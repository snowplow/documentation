---
title: "Migration guide for Snowplow iOS Tracker SDK from version 1.x to 2.0"
date: "2021-03-24"
sidebar_label: "From version 1.x to 2.0 for iOS"
sidebar_position: -1
---

This section describes the main changes when converting an applications instrumentation of the Snowplow iOS tracker SDK from version 1.x to version 2.0.

## The new approach

The main objective of this new release is a revision of the public API. Currently, the tracker configuration requires the creation of the Tracker and Emitter components. Optionally, the Subject component can be configured as well. Then both need to be passed to the Tracker component. The version 2.0 simplifies this process, letting the developer to specify the configuration with Configuration objects and passing them to a `createTracker` method able to return the tracker ready to use, without any other extra steps.

The tracker has been also updated improving the compatibility with Swift. Now, the classes of the public API don't need the `SP` prefix required on Objective-C.

### Setup of the tracker

The entry point to setup the tracker is now the `Snowplow` class and the `createTracker` methods. They need a namespace string which is now mandatory. The namespace string uniquely identifies the tracker in the app. It's important to note that all the events not sent to the collector but stored in the tracker are attached to the namespace string. This means that if a new configuration uses a different namespace, all those unsent event will still stored in the tracker, in a sort of zombie state, with no way to send them to any collector. To send them you need to reuse the original namespace string or delete them.

Fine tuning of the tracker is now possible with Configuration classes.

These are the classes now available:

- `NetworkConfiguration`: to configure network connection with the Snowplow collector.
- `TrackerConfiguration`: to configure contexts and automatic events of the tracker, and general behavior.
- `SessionConfiguration`: to configure session behavior.
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

- **For the versions 2.0 and 2.1**, the application install events report the timestamp of when installation happened in the `true_timestamp` rather than the `device_timestamp`. It caused an [issue](https://github.com/snowplow/snowplow-ios-tracker/issues/625) with the `derived_timestamp`. For this reason, since the version 2.2, the application install events report the timestamp of then installation happened in the `device_timestamp` like the previous 1.x versions.
