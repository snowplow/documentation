---
title: "Ad Tracking"
date: "2021-04-07"
sidebar_position: 1000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-ad-tracking`
- `yarn add @snowplow/browser-plugin-ad-tracking`
- `pnpm add @snowplow/browser-plugin-ad-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { AdTrackingPlugin, trackAdClick } from '@snowplow/browser-plugin-ad-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ AdTrackingPlugin() ],
});
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackAdImpression</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackAdImpression">Documentation</a></td></tr><tr><td><code>trackAdClick</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackAdClick">Documentation</a></td></tr><tr><td><code>trackAdConversion</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackAdConversion">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
