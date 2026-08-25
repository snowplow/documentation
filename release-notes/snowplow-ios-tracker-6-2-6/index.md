---
title: "Snowplow iOS tracker 6.2.6"
description: "Events tracked when an iOS app launches directly into the background now report the real app visibility instead of always claiming the app was visible."
date: "2026-08-25"
category:
  - "Release notes"
components:
  - "Trackers"
---
Events tracked when an iOS app launches directly into the background now report the real app visibility instead of always claiming the app was visible.

An app can launch straight into the background, for example when a silent push notification arrives, when the system runs a background app refresh, or when a background upload completes. Until this release, the lifecycle entity on every event from those launches reported `isVisible` as `true`, as if the app were on screen. The tracker now derives visibility from the app state at launch, so background-launched events are marked as not visible and the matching foreground and background session tracking stays accurate.

**Bug fixes**

* Derive `isVisible` from the real app state on background launches ([#948](https://github.com/snowplow/snowplow-ios-tracker/issues/948))
