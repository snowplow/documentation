---
title: "Manually ending screen tracking on iOS and Android"
description: "The iOS and Android trackers can manually close out an active screen, so engagement metrics stop accumulating on screens that automatic tracking can't end."
date: "2026-09-04"
category:
  - "Release notes"
components:
  - "Trackers"
---
The iOS tracker version 6.3.0 makes the `ScreenEnd` event public, so you can manually end the currently active screen. The event has always been public on the Android tracker.

Automatic screen view tracking doesn't always produce a `screen_end` event when the user actually leaves a screen. This happens, for example, when a WebView is presented on top of a native screen and a page view tracked from the WebView doesn't end the underlying native screen, so [screen engagement metrics](/docs/events/ootb-data/page-activity-tracking/#screen-engagement) keep accumulating against a screen that's no longer visible. The same gap appears on screens built with Jetpack Compose or SwiftUI that aren't covered by automatic screen view tracking.

Tracking a `ScreenEnd` event closes out engagement tracking for the active screen without tracking a new screen view. It's the same event the tracker already sends automatically before each screen view, so tracking it yourself doesn't interfere with automatic screen tracking or double-count engagement time.

See [manually ending a screen](/docs/sources/mobile-trackers/tracking-events/screen-tracking/#manually-ending-a-screen) for details and code examples.
