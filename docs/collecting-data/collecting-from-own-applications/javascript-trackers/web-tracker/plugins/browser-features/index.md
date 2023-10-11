---
title: "Browser Features"
date: "2021-04-07"
sidebar_position: 2000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```
:::caution
**Deprecated**: This plugin is deprecated. The `navigator.mimeTypes` API which this tracker uses is now deprecated and modern browsers may no longer populate these values.
:::

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

   * `npm install @snowplow/browser-plugin-browser-features`
   * `yarn add @snowplow/browser-plugin-browser-features`
   * `pnpm add @snowplow/browser-plugin-browser-features`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-browser-features@latest/dist/index.umd.min.js",
  ["snowplowBrowserFeatures", "BrowserFeaturesPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ BrowserFeaturesPlugin() ],
});

trackPageView();
```

  </TabItem>
</Tabs>

### Properties

This plugin will add [MIME Type](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/mimeTypes) tracking. This allows the tracker to populate the `f_*` fields within the [canonical event model](/docs/understanding-your-pipeline/canonical-event/index.md).
