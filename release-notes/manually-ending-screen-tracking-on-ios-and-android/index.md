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

The tracker already ends a screen automatically before each new screen view. That doesn't cover a user leaving a screen without a new screen view being tracked, such as when a WebView is presented on top of a native screen: a page view tracked from the WebView doesn't end the underlying native screen, so [screen engagement metrics](/docs/events/ootb-data/page-activity-tracking/#screen-engagement) keep accumulating against a screen that's no longer visible.

Tracking a `ScreenEnd` event closes out engagement tracking for the active screen without tracking a new screen view. It's the same event the tracker already sends automatically before each screen view, so tracking it yourself doesn't interfere with automatic screen tracking or double-count engagement time.

See [manually ending a screen](/docs/sources/mobile-trackers/tracking-events/screen-tracking/#manually-ending-a-screen) for details and code examples.
