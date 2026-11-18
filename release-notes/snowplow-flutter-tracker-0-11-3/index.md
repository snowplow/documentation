---
title: "Snowplow Flutter tracker 0.11.3"
sidebar_label: "Flutter tracker 0.11.3"
description: "Flutter tracker 0.11.3 lets events keep a screen entity captured by the app, adds entities to plugins that you can replace at runtime, and updates the native mobile trackers."
keywords: ["flutter tracker", "release notes", "screen entity", "plugin entities", "screencontextfromevent"]
date: "2026-11-17"
category:
  - "Release notes"
components:
  - "Trackers"
---
Version 0.11.3 of the Flutter tracker helps apps attribute events to the right screen and user when they track events after async work.

**New features**

* Enable the `screenContextFromEvent` option in `TrackerConfiguration` to let events tracked with their own screen entity keep it, instead of getting the screen the user is on when the event reaches the native tracker. Use it to attach the screen the user was on when they acted. It works on iOS and Android, and the tracker ignores it on web. See [keep the screen an event was triggered on](/docs/sources/flutter-tracker/tracking-events/#keep-the-screen-an-event-was-triggered-on).
* Add `entities` to a plugin to attach them to every tracked event, including the events the tracker tracks automatically, and replace them at runtime with `setPluginEntities()`. Each event gets the entities that were set when it was tracked. See [attach entities from a plugin](/docs/sources/flutter-tracker/plugins/#attach-entities-from-a-plugin).
* Update the native trackers to Android tracker 6.6 and iOS tracker 6.5.

**Bug fixes**

* The tracker calls `afterTrack` plugin callbacks in every Flutter engine that the app attaches, not only the last one.

**Upgrade notes**

Both features are opt-in, so existing apps behave the same after upgrading.
