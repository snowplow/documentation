---
title: "Integrating Optimizely with the web trackers"
sidebar_label: "Optimizely"
sidebar_position: 170
---

# Optimizely tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The web tracker supports Optimizely X (Next Generation Platform).

The Optimizely context entities are **automatically tracked** once configured.
You can have a look at the JsonSchema [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) to see what is being captured.

### Install plugin

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


### Context entity

Adding this plugin will automatically capture [this](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) context entity (`iglu:com.optimizely.optimizelyx/summary/jsonschema/1-0-0`).

If you’re planning on leveraging the entity’s variation names, you’ll have to untick ‘Mask descriptive names in project code and third-party integrations’ in the OptimizelyX menu -> Settings -> Privacy. Otherwise, all variation names will be null.
