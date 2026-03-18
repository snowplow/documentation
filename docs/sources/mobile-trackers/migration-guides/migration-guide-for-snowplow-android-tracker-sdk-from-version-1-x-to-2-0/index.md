---
title: "Migration guide for Snowplow Android Tracker SDK from version 1.x to 2.0"
date: "2021-03-19"
sidebar_label: "From version 1.x to 2.0 for Android"
sidebar_position: -1
description: "Migrate your Android tracker instrumentation from version 1.x to 2.0 with updated configuration and API changes."
keywords: ["android migration", "version 2.0", "tracker upgrade"]
---

This section describes the main changes when converting an applications instrumentation of the Snowplow Android tracker SDK from version 1.x to version 2.0.

## The new approach

The main objective of this new release is a revision of the public API. Currently, the tracker configuration requires the creation of the Tracker and Emitter components. Optionally, the Subject component can be configured as well. Then both need to be passed to the Tracker component. The version 2.0 simplifies this process, letting the developer to specify the configuration with Configuration objects and passing them to a `createTracker` method able to return the tracker ready to use, without any other extra steps.

### Setup of the tracker

The entry point to setup the tracker is now the `Snowplow` static class and the `createTracker` methods. They need a namespace string which is now mandatory. The namespace string uniquely identifies the tracker in the app. It's important to note that all the events not sent to the collector but stored in the tracker are attached to the namespace string. This means that if a new configuration uses a different namespace, all those unsent event will still stored in the tracker, in a sort of zombie state, with no way to send them to any collector. To send them you need to reuse the original namespace string or delete them.

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

```java
TrackerController initAndroidTracker(Context context, String trackerNamespace) {
        NetworkConfiguration networkConfiguration = new NetworkConfiguration("https://snowplow-collector-url.com");
        TrackerConfiguration trackerConfiguration = new TrackerConfiguration("example-of-app-id")
                .sessionContext(true)
                .platformContext(true)
                .applicationContext(true)
                .geoLocationContext(true)
                .lifecycleAutotracking(true)
                .screenViewAutotracking(true)
                .screenContext(true)
                .exceptionAutotracking(true)
                .installAutotracking(true)
                .diagnosticAutotracking(true);
        SessionConfiguration sessionConfiguration = new SessionConfiguration(
                new TimeMeasure(60, TimeUnit.SECONDS),
                new TimeMeasure(30, TimeUnit.SECONDS)
        );
        GdprConfiguration gdprConfiguration = new GdprConfiguration(
                Basis.CONSENT,
                "someId",
                "0.1.0",
                "this is a demo document description"
        );

        return Snowplow.createTracker(context,
                trackerNamespace,
                networkConfiguration,
                trackerConfiguration,
                sessionConfiguration,
                gdprConfiguration
        );
    }
```

The tracker can be controlled by the `TrackerController` (the `Tracker` class is now deprecated). Through the `TrackerController` it will be possible to update settings at runtime and get information about the tracking state. From the `TrackerController` it's also possible to access all the other controllers. This allows you to access and update settings about communication with the collector, emission of the events, session of the tracker (if enabled) and so on. In general, there is a specific controller for each area covered by a configuration. All of them are accessible through the `TrackerController`.

**Note:** Please, don't retain a reference to the sub-controllers. If you invalidate or recreate the tracker, all the sub-controller instances will no longer be active.

## Low level migration from 1.x

- Minimum supported version is API 21 (Android 5).

- Migrated from Android Support Library to AndroidX.

- Minimum OkHttpClient dependency is 4.9.1.

- `lifecycleAutotracking` (background and foreground events and indexes on sessions) are optional and off by default.

- `lifecycleAutotracking` requires `androidx.lifecycle:lifecycle-extensions` among the dependencies of the app.

- `RequestSecurity` class has been renamed `Protocol`.

- `mobileContext` property has been renamed `platformContext`.

- `DevicePlatforms` has been renamed `DevicePlatform`.

- `ReadyRequest` has been replaced by `Request` (not needed in the new API).

- `namespace` on Tracker is now mandatory for the correct operativity.

- `name` field on `ScreenView` is now mandatory.

- `EcommerceItem`s aren't forced to have the same timestamp of the `EcommerceTransaction` event.

- `SPEcommerceItem` constructor doesn't require `itemId` as it's added by the tracker when the e-commerce event is sent.

- Deprecated classes of the previous API (Tracker, Emitter, Subject, ...) are now accessible from the `internal` sub-package.

- The `internal` package is considered private API so it doesn't follow the restrictions of the [Semantic Version](https://semver.org/) policy. Although we will keep the legacy deprecated API with minimum changes until the release of the version 3.0.

- Global Contexts implementation is changed and uniformed to the one on iOS tracker.

- **For the versions 2.0 and 2.1**, the application install events report the timestamp of when installation happened in the `true_timestamp` rather than the `device_timestamp`. It caused an [issue](https://github.com/snowplow/snowplow-android-tracker/issues/462) with the `derived_timestamp`. For this reason, since the version 2.2, the application install events report the timestamp of then installation happened in the `device_timestamp` like the previous 1.x versions.


## Migrate to new Global Contexts API

- The `ContextGenerator` no longer owns the `tag` string used to identify the Global Context generator in the tracker. The `ContextGenerator` replacement is simply called `GlobalContext` which is the new generator class for the Global Contexts feature.
- The generator `GlobalContext` is added to the tracker and associated to the specified tag through the method `add` of `GlobalContextsConfiguration`.
- The classes `FilterProvider` and `RulesetProvider` have been removed. `GlobalContext` class and `ContextGenerator` protocol can be used to filter events through specific event fields or rulesets.
