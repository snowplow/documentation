---
title: "Migration guide for Snowplow iOS Tracker SDK from version 2.x to 3.0"
date: "2021-11-23"
sidebar_label: "From version 2.x to 3.0 for iOS"
sidebar_position: -2
description: "Migrate your iOS tracker from version 2.x to 3.0 which removes the deprecated v1 API."
keywords: ["ios migration", "version 3.0", "api removal"]
---

This new release doesn't introduce breaking changes with the previous 2.x version. The version 2.0 can be considered a transitory release because two different APIs were available for the developer: v1 API (deprecated) and v2 API (the new one). The version 3.0 doesn't introduce changes to the v2 API but it completely remove the v1 API. Hence, this version introduces breking changes only for the developer that have instrumented the v2.0 using the old deprecated v1 API.

In this release we've marked as deprecated:

- `PageView` event: this event has been designed for web tracking. Its role can be replaced on mobile with two different events: `ScreenView` event and `DeepLinkReceived` event. The first covers the need of tracking the screen visualized to the user by the app. The latter covers the case where the shown content is referred to an external url referral and we want to track that down, exactly like the PageView does in the web tracker.

- `PushNotification` event: this event is available only on iOS tracker and it's strongly influenced by the format of push notifications in the iOS platform. It has been replaced with `MessageNotification` which is usable in both iOS and Android trackers v3.0.


In this release there are some breaking changes:

- The v1 API has been removed from this new version of the trackers, which means the v1 components (Tracker, Emitter, Subject, Session) used to set up the tracker are no longer available. If you have already migrated your instrumentation to the v2 API there aren't breaking changes.

- The events can be built using the constructor and builder methods. The builder classes available with v1 are no longer available. If you already build events using events' constructor suggested with the v2 API, there aren't breaking changes.

- Session callbacks have been removed. They will be reintroduced soon in one of the next minor versions. More details will be provided at the release.

- Utilities or Utils methods, available in v1 API, have been removed.
