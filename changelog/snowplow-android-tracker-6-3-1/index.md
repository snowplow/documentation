---
title: "Snowplow Android tracker 6.3.1"
description: "We’re happy to announce a new release of the Snowplow Android Tracker."
date: "2026-02-19"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
We’re happy to announce a new [release](https://github.com/snowplow/snowplow-android-tracker/releases/tag/6.3.1) of the Snowplow Android Tracker.

**Summary**

This is a patch release fixing 2 bugs related to the platform entity management.

**Bug fixes**

* Allow platformContext to be toggled at runtime (close [#720](https://github.com/snowplow/snowplow-android-tracker/issues/720))
* Filter negative storage values from platform context
