---
title: "Getting the most out of performance timing"
date: "2021-03-26"
sidebar_position: 3000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The `domComplete`, `loadEventStart`, and `loadEventEnd` metrics in the NavigationTiming API are set to 0 until after every script on the page has finished executing, including sp.js. This means that the corresponding fields in the PerformanceTiming reported by the tracker will be 0. To get around this limitation, you can wrap all Snowplow code in a `setTimeout` call:

```javascript
setTimeout(function () {

 // Load Snowplow and call tracking methods here

}, 0);
```

This delays its execution until after those NavigationTiming fields are set.
