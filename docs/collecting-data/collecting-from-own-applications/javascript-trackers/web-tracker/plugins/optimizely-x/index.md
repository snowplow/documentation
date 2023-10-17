---
title: "Optimizely X"
date: "2021-04-07"
sidebar_position: 14000
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

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-optimizely-x`
- `yarn add @snowplow/browser-plugin-optimizely-x`
- `pnpm add @snowplow/browser-plugin-optimizely-x`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js",
  ["snowplowOptimizelyX", "OptimizelyXPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { OptimizelyXPlugin } from '@snowplow/browser-plugin-optimizely-x';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ OptimizelyXPlugin() ],
});
```

  </TabItem>
</Tabs>

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                                      |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:com.optimizely.optimizelyx/summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) |
