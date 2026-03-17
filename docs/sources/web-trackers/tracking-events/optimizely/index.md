---
title: "Integrate Optimizely with the web trackers"
sidebar_label: "Optimizely"
sidebar_position: 170
description: "Automatically capture Optimizely X experiment and variation data as context entities on all tracked events for A/B testing analysis."
keywords: ["optimizely", "ab testing"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The web tracker supports [Optimizely X](https://www.optimizely.com/) (Next Generation Platform) for campaign and A/B test management.

The Optimizely entity is **automatically tracked** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely-x@latest/dist/index.umd.min.js",
  ["snowplowOptimizelyX", "OptimizelyXPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-optimizely-x`
- `yarn add @snowplow/browser-plugin-optimizely-x`
- `pnpm add @snowplow/browser-plugin-optimizely-x`

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

Check out the [third-party sources overview page](/docs/events/ootb-data/third-party-sources/index.md) to see the entity schema.

If you're planning on leveraging the entity's `variationName`, you'll have to untick "Mask descriptive names in project code and third-party integrations" in the **OptimizelyX menu** > **Settings** > **Privacy**. Otherwise, all variation names will be null.

## Legacy plugin

The `browser-plugin-optimizely-x` plugin supersedes the earlier `browser-plugin-optimizely` plugin that was added in version 3.0. We deprecated and fully [removed it in version 4.0](/docs/sources/web-trackers/migration-guides/v3-to-v4-migration-guide/index.md).
