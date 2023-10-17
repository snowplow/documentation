---
title: "Error Tracking"
date: "2021-04-07"
sidebar_position: 8000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

This tracker plugin provides two ways of tracking exceptions: manual tracking of handled exceptions using `trackError` and automatic tracking of unhandled exceptions using `enableErrorTracking`.

## Installation

- `npm install @snowplow/browser-plugin-error-tracking`
- `yarn add @snowplow/browser-plugin-error-tracking`
- `pnpm add @snowplow/browser-plugin-error-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { ErrorTrackingPlugin, enableErrorTracking } from '@snowplow/browser-plugin-error-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ ErrorTrackingPlugin() ],
});

enableErrorTracking();
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackError</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackError">Documentation</a></td></tr><tr><td><code>enableErrorTracking</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#enableErrorTracking">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
