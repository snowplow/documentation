---
title: "Link Click Tracking"
date: "2021-04-07"
sidebar_position: 12000
---

Link click tracking is enabled using the `enableLinkClickTracking` method. Use this method once and the tracker will add click event listeners to all link elements. Link clicks are tracked as self describing events. Each link click event captures the link’s href attribute. The event also has fields for the link’s id, classes, and target (where the linked document is opened, such as a new tab or new window).

## Installation

- `npm install @snowplow/browser-plugin-link-click-tracking`
- `yarn add @snowplow/browser-plugin-link-click-tracking`
- `pnpm add @snowplow/browser-plugin-link-click-tracking`

## Initialization

```
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ LinkClickTrackingPlugin() ],
});

enableLinkClickTracking();
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>enableLinkClickTracking</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#enableLinkClickTracking">Documentation</a></td></tr><tr><td><code>refreshLinkClickTracking</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#enableLinkClickTracking">Documen</a><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#refreshLinkClickTracking">t</a><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#enableLinkClickTracking">ation</a></td></tr><tr><td><code>trackLinkClick</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#trackLinkClick">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
