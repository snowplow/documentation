---
title: "Snowplow Flutter tracker 0.11.1"
sidebar_label: "Flutter tracker 0.11.1"
description: "Flutter tracker 0.11.1 adds install tracking, limits for how many unsent events the tracker keeps, session timeout configuration, and a method to start a new session."
keywords: ["flutter tracker", "release notes", "session configuration", "install tracking", "event store"]
date: "2026-09-29"
category:
  - "Release notes"
components:
  - "Trackers"
---
Version 0.11.1 of the Flutter tracker exposes configuration options of the native mobile trackers that Flutter apps couldn't previously set.

**New features**

* Start a new session on demand with `startNewSession()`, for example when the user logs out. See [start a new session](/docs/sources/flutter-tracker/sessions-and-data-model/#start-a-new-session).
* Configure session timeouts with the new `SessionConfiguration`. It sets the foreground and background timeouts, and whether to continue the previous session when the app restarts. On Web, the foreground timeout sets the session cookie timeout. See [configure session timeouts](/docs/sources/flutter-tracker/sessions-and-data-model/#configure-session-timeouts).
* Limit how many unsent events the tracker keeps, and for how long, with the `maxEventStoreSize` and `maxEventStoreAge` options in `EmitterConfiguration`. See [emitter configuration](/docs/sources/flutter-tracker/initialization-and-configuration/#configuration-of-emitter-properties-emitterconfiguration).
* Track [application install](/docs/events/ootb-data/mobile-lifecycle-events/#install-events) events with the `installAutotracking` option in `TrackerConfiguration`. It's disabled by default.

**Upgrade notes**

All new options are opt-in, so existing apps behave the same after upgrading.

If you enable `installAutotracking` in an app version that is already released, each existing user sends one install event the first time they open the updated app. The tracker only records that the install event was sent while the option is enabled.
