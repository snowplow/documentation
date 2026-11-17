---
title: "Snowplow iOS tracker 6.3.1 and Android trackers 6.4.1 and 6.4.2"
sidebar_label: "iOS 6.3.1 and Android 6.4.2 trackers"
description: "The iOS and Android trackers stop attaching an ended screen to later events after a manual ScreenEnd, and fix foreground events and app visibility around background launches."
keywords: ["ios tracker", "android tracker", "release notes", "screen end", "lifecycle"]
date: "2026-10-12"
category:
  - "Release notes"
components:
  - "Trackers"
---
These releases fix screen and lifecycle tracking in the iOS and Android trackers.

After a manually tracked `ScreenEnd` event, later events no longer carry the ended screen's `screen` and `screen_summary` entities, and the tracker no longer sends a second `screen_end` event before the next screen view. See [manually ending a screen](/docs/sources/mobile-trackers/tracking-events/screen-tracking/#manually-ending-a-screen).

**Bug fixes**

* Stop attaching the ended screen's entities after a manual `ScreenEnd` (iOS 6.3.1 [#959](https://github.com/snowplow/snowplow-ios-tracker/pull/959), Android 6.4.2 [#743](https://github.com/snowplow/snowplow-android-tracker/pull/743))
* iOS 6.3.1: only track a `Foreground` event after a `Background` event, so scene-based apps don't track one on every launch ([#958](https://github.com/snowplow/snowplow-ios-tracker/pull/958))
* iOS 6.3.1: avoid a crash when the tracker is used from its own callbacks ([#957](https://github.com/snowplow/snowplow-ios-tracker/pull/957))
* Android 6.4.1: report the real app visibility and background state when the app launches in the background, for example for a push notification ([#740](https://github.com/snowplow/snowplow-android-tracker/pull/740))

See [lifecycle tracking](/docs/sources/mobile-trackers/tracking-events/lifecycle-tracking/) for how the trackers handle background launches.
