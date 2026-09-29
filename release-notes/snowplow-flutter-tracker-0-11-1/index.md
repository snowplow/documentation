---
title: "Snowplow Flutter tracker 0.11.1"
description: "The Flutter tracker can now track app installs, limit how many unsent events it keeps, configure session timeouts, and start a new session on demand."
date: "2026-09-29"
category:
  - "Release notes"
components:
  - "Trackers"
---
Version 0.11.1 of the Flutter tracker exposes configuration that the underlying iOS and Android trackers already supported, but that Flutter apps couldn't set until now.

**New features**

* Start a new session on demand with `startNewSession()`, for example when a user logs out. See [start a new session](/docs/sources/flutter-tracker/sessions-and-data-model/#start-a-new-session).
* Configure session timeouts with the new `SessionConfiguration`. It sets the foreground and background timeouts, and whether to continue the previous session when the app restarts. On Web, the foreground timeout sets the session cookie timeout. See [configure session timeouts](/docs/sources/flutter-tracker/sessions-and-data-model/#configure-session-timeouts).
* Limit how many unsent events the tracker keeps, and for how long, with the `maxEventStoreSize` and `maxEventStoreAge` options in `EmitterConfiguration`. See [emitter configuration](/docs/sources/flutter-tracker/initialization-and-configuration/#configuration-of-emitter-properties-emitterconfiguration).
* Track [application install](/docs/events/ootb-data/mobile-lifecycle-events/#install-events) events with the `installAutotracking` option in `TrackerConfiguration`. It's disabled by default.

**Upgrade notes**

All new options are opt-in, so existing apps behave the same after upgrading.

If you enable `installAutotracking` in an app version that is already released, each existing user sends one install event the first time they open the updated app. The tracker only records that the install event was sent while the option is enabled.
