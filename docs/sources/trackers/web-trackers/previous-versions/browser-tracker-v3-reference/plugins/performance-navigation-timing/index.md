---
title: "Performance Navigation Timing"
date: "2023-05-10"
sidebar_position: 14500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Adds Performance Navigation Timing contexts to your Snowplow tracking. To learn more about the properties tracked, you can visit the [specification](https://www.w3.org/TR/navigation-timing-2/) or MDN [documentation site](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming).

The following diagram shows the ResourceTiming and PerformanceNavigationTiming properties and how they connect to the navigation of the page main document.

![performance navigation timeline](./images/performance_navigation_timeline.png)

_Performance navigation timeline from the [W3C specification](https://www.w3.org/TR/navigation-timing-2/)._

:::note
The plugin is available since version 3.10 of the tracker.
:::

## Installation

- `npm install @snowplow/browser-plugin-performance-navigation-timing`
- `yarn add @snowplow/browser-plugin-performance-navigation-timing`
- `pnpm add @snowplow/browser-plugin-performance-navigation-timing`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PerformanceNavigationTimingPlugin } from '@snowplow/browser-plugin-performance-navigation-timing';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PerformanceNavigationTimingPlugin() ],
});
```

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceNavigationTiming/jsonschema/1-0-0) |
