---
title: "Enhanced Ecommerce"
date: "2021-03-30"
sidebar_position: 7000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ✅ |
| `sp.lite.js` | ❌ |

## Download

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

## Initialization

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js",
  ["snowplowEnhancedEcommerce", "EnhancedEcommercePlugin"]
);
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackEnhancedEcommerceAction</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/#trackEnhancedEcommerceAction">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceActionContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/#addEnhancedEcommerceActionContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceImpressionContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/#addEnhancedEcommerceImpressionContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceProductContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/#addEnhancedEcommerceProductContext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommercePromoContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/tracking-events/#addEnhancedEcommercePromoContext">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
