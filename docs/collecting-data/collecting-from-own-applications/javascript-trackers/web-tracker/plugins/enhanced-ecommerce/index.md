---
title: "Enhanced Ecommerce"
date: "2021-04-07"
sidebar_position: 7000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-enhanced-ecommerce`
- `yarn add @snowplow/browser-plugin-enhanced-ecommerce`
- `pnpm add @snowplow/browser-plugin-enhanced-ecommerce`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js",
  ["snowplowEnhancedEcommerce", "EnhancedEcommercePlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { EnhancedEcommercePlugin, trackEnhancedEcommerceAction } from '@snowplow/browser-plugin-enhanced-ecommerce';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ EnhancedEcommercePlugin() ],
});
```

  </TabItem>
</Tabs>

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackEnhancedEcommerceAction</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#trackenhancedecommerceaction">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceActionContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#addenhancedecommerceactioncontext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceImpressionContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#addenhancedecommerceimpressioncontext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommerceProductContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#addenhancedecommerceproductcontext">Documentation</a></td></tr><tr><td><code>addEnhancedEcommercePromoContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#addenhancedecommercepromocontext">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
