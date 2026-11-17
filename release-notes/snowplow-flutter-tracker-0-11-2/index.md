---
title: "Snowplow Flutter tracker 0.11.2"
sidebar_label: "Flutter tracker 0.11.2"
description: "Flutter tracker 0.11.2 adds plugins with an afterTrack callback that sees every tracked event, and fixes tracking on web for some Flutter versions."
keywords: ["flutter tracker", "release notes", "plugins", "aftertrack", "inspectable event"]
date: "2026-10-26"
category:
  - "Release notes"
components:
  - "Trackers"
---
Version 0.11.2 of the Flutter tracker lets your Dart code see every event the tracker tracks.

**New features**

* Register plugins with an `afterTrack` callback that the tracker calls after each tracked event, including the events it tracks automatically, such as screen views from the `SnowplowObserver`, screen end, lifecycle, and media events. The callback receives an `InspectableEvent` with the event's schema or name, payload, and entities. Pass plugins to `Snowplow.createTracker()` with the new `plugins` argument, or add and remove them at runtime with `addPlugin()` and `removePlugin()`. It works on iOS, Android, and web. See [Flutter tracker plugins](/docs/sources/flutter-tracker/plugins/).

**Bug fixes**

* On web, `Snowplow.createTracker()` and `track()` could throw `NoSuchMethodError: 'jsify'` on some Flutter versions. This affected versions 0.10.0 to 0.11.1 of the Flutter tracker.

**Upgrade notes**

Plugins are opt-in, so existing apps behave the same after upgrading.
