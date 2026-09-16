---
title: "Snowplow Flutter tracker 0.9.0 released"
description: "This release introduces global context support, a way to attach context entities to all tracked events without having to pass them to each individual track() call."
date: "2026-03-27"
category:
  - "Release notes"
components:
  - "Trackers"
---
This release introduces global context support, a way to attach context entities to all tracked events without having to pass them to each individual `track()` call. Global contexts can be configured at tracker initialization time or added and removed dynamically at runtime using string tags. See the [documentation](/docs/sources/flutter-tracker/adding-data/global-context/) for more information

**What's included**

* Global contexts configured at initialization via `GlobalContextsConfiguration`
* Dynamic runtime management with `addGlobalContexts()` and `removeGlobalContexts()`
