---
title: "Site Tracking"
date: "2021-04-07"
sidebar_position: 15000
---

## Installation

- `npm install @snowplow/browser-plugin-site-tracking`
- `yarn add @snowplow/browser-plugin-site-tracking`
- `pnpm add @snowplow/browser-plugin-site-tracking`

## Initialization

```
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { SiteTrackingPlugin, trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ SiteTrackingPlugin() ],
});
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackSocialInteraction</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/tracking-events/#trackSocialInteraction">Docume</a><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#trackSocialInteraction">ntation</a></td></tr><tr><td><code>trackSiteSearch</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#trackSiteSearch">Documentation</a></td></tr><tr><td><code>trackTiming</code></td><td><a href="/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/#trackTiming">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
