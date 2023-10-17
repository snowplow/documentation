---
title: "Loading tracker with the Snowplow tag"
date: "2021-03-25"
sidebar_position: 1000
---

There are two distributions of the JavaScript Tracker:

- `sp.js` is fully featured and is bundled with the majority of the available plugins.
- `sp.lite.js` is a smaller distribution with no bundled plugins. Included is Page View, Self Describing and Structured Event tracking as well as Activity Tracking and Anonymous Tracking. All other features can be loaded as separate [plugins](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/plugins/index.md).

```mdx-code-block
import LoadWithTag from "@site/docs/reusable/javascript-tracker-load-with-tag/_index.md"

<LoadWithTag/>
```

Once the tracker is loaded via the tag, you can move on to initializing the tracker.
