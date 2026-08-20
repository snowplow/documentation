---
title: "Snowplow iOS tracker v6.2.1 released"
description: "We’re happy to announce a new release for the iOS tracker."
date: "2025-04-04"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
We’re happy to announce a new [release](https://github.com/snowplow/snowplow-ios-tracker/releases/tag/6.2.1) for the iOS tracker

This release fixes an issue in the media tracking that could cause the app to crash in case of infinite or nan playback position information being tracked.

**Bug fixes**

* Fix handling NaN and infinite current time in media player stats
