---
title: "Privacy Sandbox"
sidebar_position: 14500
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The plugin allows for adding Privacy Sandbox related data to your Snowplow tracking. To learn more about the Privacy Sandbox you can visit the official [website](https://www.privacysandbox.com/). As more and more APIs become available or further refined, we will be upgrading the plugin with more capabilities and options as more APIs are added to the Privacy Sandbox.

Currently supported APIs:
- [Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/overview/)

__Note:__ Some of the APIs and data will not be available by default in all users. This is commonly due to these APIs being dependent on browser support, user privacy preferences, browser feature-flags or ad-blocking software. The plugin will not modify or request access explicitly to any of these features if not available by default.

:::note
The plugin is available since version 3.14 of the tracker.
:::

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-privacy-sandbox@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-privacy-sandbox@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-privacy-sandbox`
- `yarn add @snowplow/browser-plugin-privacy-sandbox`
- `pnpm add @snowplow/browser-plugin-privacy-sandbox`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-privacy-sandbox@latest/dist/index.umd.min.js",
  ["snowplowPrivacySandbox", "PrivacySandboxPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PrivacySandboxPlugin } from '@snowplow/browser-plugin-privacy-sandbox';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PrivacySandboxPlugin() ],
});
```

  </TabItem>
</Tabs>

### Context

Adding this plugin will automatically capture the following context:

| Context |
| --- |
| [iglu:com.google.privacysandbox/topics/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.google.privacysandbox/topics/jsonschema/1-0-0) |
