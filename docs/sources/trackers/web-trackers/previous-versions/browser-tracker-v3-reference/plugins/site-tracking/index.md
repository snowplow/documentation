---
title: "Site Tracking"
description: "Site tracking plugin for browser tracker v3 to capture comprehensive behavioral website analytics."
schema: "TechArticle"
keywords: ["Browser V3 Site", "Site Tracking", "Legacy Site", "Site Analytics", "Website Analytics", "Site Events"]
date: "2021-04-07"
sidebar_position: 15000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-site-tracking`
- `yarn add @snowplow/browser-plugin-site-tracking`
- `pnpm add @snowplow/browser-plugin-site-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { SiteTrackingPlugin, trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ SiteTrackingPlugin() ],
});
```

### Functions

<table className="has-fixed-layout"><tbody><tr><td><code>trackSocialInteraction</code></td><td><a href="/docs/sources/trackers/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#tracksocialinteraction">Documentation</a></td></tr><tr><td><code>trackSiteSearch</code></td><td><a href="/docs/sources/trackers/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#tracksitesearch">Documentation</a></td></tr><tr><td><code>trackTiming</code></td><td><a href="/docs/sources/trackers/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#tracktiming">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
