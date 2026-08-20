---
title: "Snowplow Android tracker 6.1.1 released"
description: "This patch release fixes a bug that caused screen view events to be tracked when app returns to foreground from a background state in case screen view autotracking is enabled."
date: "2025-01-22"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
This patch release fixes a bug that caused screen view events to be tracked when app returns to foreground from a background state in case screen view autotracking is enabled.

**Bug fixes**

* Do not autotrack screen view events when app comes to foreground ([#701](https://github.com/snowplow/snowplow-android-tracker/issues/701))

---

Snowplow **Android Tracker** version `6.1.1` is available on [Maven Central ](https://search.maven.org/artifact/com.snowplowanalytics/snowplow-android-tracker/6.1.1/aar).
The project’s source code can be found [here](https://github.com/snowplow/snowplow-android-tracker).
