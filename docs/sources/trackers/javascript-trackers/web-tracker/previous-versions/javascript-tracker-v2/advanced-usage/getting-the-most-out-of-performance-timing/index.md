---
title: "Getting the most out of performance timing"
date: "2020-02-26"
sidebar_position: 30
---

```mdx-code-block
import DeprecatedV2 from "@site/docs/reusable/javascript-tracker-v2-deprecation/_index.md"
```

<DeprecatedV2/>

The `domComplete`, `loadEventStart`, and `loadEventEnd` metrics in the NavigationTiming API are set to 0 until after every script on the page has finished executing, including sp.js. This means that the corresponding fields in the PerformanceTiming reported by the tracker will be 0. To get around this limitation, you can wrap all Snowplow code in a `setTimeout` call:

```javascript
setTimeout(function () {

 // Load Snowplow and call tracking methods here

}, 0);
```

This delays its execution until after those NavigationTiming fields are set.
For further information, see [Measuring page load times with the performance timing context [tutorial] - Discourse](https://discourse.snowplow.io/t/measuring-page-load-times-with-the-performance-timing-context-tutorial/100)
