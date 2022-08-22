---
title: "Getting the most out of performance timing"
date: "2020-02-26"
sidebar_position: 30
---

Documentation for latest release

The documentation listed here is for Version 2 of the JavaScript Tracker. Version 3 is now available and upgrading is recommended.

\- [Documentation for Version 3](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md)

\- [v2 to v3 Migration Guide](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/v2-to-v3-migration-guide/index.md)

The `domComplete`, `loadEventStart`, and `loadEventEnd` metrics in the NavigationTiming API are set to 0 until after every script on the page has finished executing, including sp.js. This means that the corresponding fields in the PerformanceTiming reported by the tracker will be 0. To get around this limitation, you can wrap all Snowplow code in a `setTimeout` call:

```
setTimeout(function () {

 // Load Snowplow and call tracking methods here

}, 0);
```

This delays its execution until after those NavigationTiming fields are set.
