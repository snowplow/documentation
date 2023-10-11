---
title: "Link Click Tracking"
date: "2021-04-07"
sidebar_position: 12000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Link click tracking is enabled using the `enableLinkClickTracking` method. Use this method once and the tracker will add click event listeners to all link elements. Link clicks are tracked as self describing events. Each link click event captures the link’s href attribute. The event also has fields for the link’s id, classes, and target (where the linked document is opened, such as a new tab or new window).

## Installation

- `npm install @snowplow/browser-plugin-link-click-tracking`
- `yarn add @snowplow/browser-plugin-link-click-tracking`
- `pnpm add @snowplow/browser-plugin-link-click-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ LinkClickTrackingPlugin() ],
});

enableLinkClickTracking();
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>enableLinkClickTracking</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#enablelinkclicktracking">Documentation</a></td></tr><tr><td><code>refreshLinkClickTracking</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#refreshlinkclicktracking">Documentation</a></td></tr><tr><td><code>trackLinkClick</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#tracklinkclick">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
