---
title: "Snowplow iOS tracker 6.4.0 and Android tracker 6.5.0"
sidebar_label: "iOS 6.4.0 and Android 6.5.0 trackers"
description: "The iOS and Android trackers add the screenContextFromEvent option, so events tracked with their own screen entity keep it instead of getting the current screen."
keywords: ["ios tracker", "android tracker", "release notes", "screen entity", "screencontextfromevent"]
date: "2026-11-17"
category:
  - "Release notes"
components:
  - "Trackers"
---
Version 6.4.0 of the iOS tracker and version 6.5.0 of the Android tracker add the `screenContextFromEvent` option to `TrackerConfiguration`.

With screen context enabled, the tracker adds the current screen to each event when the event is tracked. An event tracked after async work can get the screen the user moved to, rather than the one they were on when they acted. If the app attached its own screen entity, the event had two.

With `screenContextFromEvent` on, an event tracked with its own screen entity keeps it, and the tracker doesn't add the current screen. The option is off by default. See [keep the screen an event was triggered on](/docs/sources/mobile-trackers/tracking-events/screen-tracking/#keep-the-screen-an-event-was-triggered-on).

**New features**

* Add the `screenContextFromEvent` option to keep a screen entity attached to the event ([iOS #964](https://github.com/snowplow/snowplow-ios-tracker/pull/964), [Android #748](https://github.com/snowplow/snowplow-android-tracker/pull/748))

**Bug fixes**

* iOS: read view controller class names without conformance lookups ([#965](https://github.com/snowplow/snowplow-ios-tracker/issues/965))
