---
title: "Performance Timing"
description: "Performance timing plugin for browser tracker v3 to measure behavioral analytics performance metrics."
schema: "TechArticle"
keywords: ["Browser V3 Performance", "Performance Timing", "Legacy Performance", "Web Performance", "Timing Metrics", "Browser Metrics"]
date: "2021-04-07"
sidebar_position: 14000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-performance-timing`
- `yarn add @snowplow/browser-plugin-performance-timing`
- `pnpm add @snowplow/browser-plugin-performance-timing`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PerformanceTimingPlugin() ],
});
```

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:org.w3/PerformanceTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceTiming/jsonschema/1-0-0) |
