---
title: "Enhanced Ecommerce"
date: "2021-04-07"
sidebar_position: 7000
description: "Documentation for Enhanced Ecommerce in the web tracker."
keywords: ["tracker", "configuration"]
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-enhanced-ecommerce`
- `yarn add @snowplow/browser-plugin-enhanced-ecommerce`
- `pnpm add @snowplow/browser-plugin-enhanced-ecommerce`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { EnhancedEcommercePlugin, trackEnhancedEcommerceAction } from '@snowplow/browser-plugin-enhanced-ecommerce';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ EnhancedEcommercePlugin() ],
});
```

### Functions

<table className="has-fixed-layout"><tbody><tr><td><code>trackEnhancedEcommerceAction</code></td><td><a href="/docs/sources/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#trackEnhancedEcommerceAction">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceActionContext</code></td><td><a href="/docs/sources/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#addEnhancedEcommerceActionContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceImpressionContext</code></td><td><a href="/docs/sources/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#addEnhancedEcommerceImpressionContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceProductContext</code></td><td><a href="/docs/sources/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#addEnhancedEcommerceProductContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommercePromoContext</code></td><td><a href="/docs/sources/web-trackers/previous-versions/browser-tracker-v3-reference/tracking-events/#addEnhancedEcommercePromoContext">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
