---
title: "Manually ending screen tracking on iOS and Android"
description: "The iOS and Android trackers can now manually close out an active screen, so engagement metrics stop accumulating on screens that automatic tracking can't end."
date: "2026-09-01"
category:
  - "Release notes"
components:
  - "Trackers"
---
The iOS and Android trackers now support manually ending the currently active screen, by tracking an `EndScreenView` event.

Automatic screen view tracking doesn't always produce a `screen_end` event when the user actually leaves a screen. This happens, for example, when a WebView is presented on top of a native screen and a page view tracked from the WebView doesn't end the underlying native screen, so [screen engagement metrics](/docs/events/ootb-data/page-activity-tracking/#screen-engagement) keep accumulating against a screen that's no longer visible. The same gap appears on screens built with Jetpack Compose or SwiftUI that aren't covered by automatic screen view tracking.

Tracking an `EndScreenView` event closes out engagement tracking for the active screen and clears the [`Screen` entity](/docs/events/ootb-data/page-and-screen-view-events/#screen-entity), without tracking a new screen view. It accepts an optional `screenId` to guard against ending a screen the app has already navigated away from.

See [manually ending a screen](/docs/sources/mobile-trackers/tracking-events/screen-tracking/#manually-ending-a-screen) for details and code examples.
