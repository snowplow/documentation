---
title: "Optimizely Classic"
date: "2021-04-07"
sidebar_position: 13000
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

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-optimizely@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-optimizely`
- `yarn add @snowplow/browser-plugin-optimizely`
- `pnpm add @snowplow/browser-plugin-optimizely`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely@latest/dist/index.umd.min.js",
  ["snowplowOptimizely", "OptimizelyPlugin"],
  [true, true, true, true, true, true, true]
);
```
The parameter array of booleans is used to initialize the plugin. If you do not include this, all the Optimizely contexts will be included. To alter this behavior you can flip some of the booleans. The array represent enabling the following contexts:

```javascript
[ 
  summary: boolean, 
  experiments: boolean,  
  states: boolean, 
  variations: boolean, 
  visitor: boolean, 
  audiences: boolean, 
  dimensions: boolean 
]
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { OptimizelyPlugin } from '@snowplow/browser-plugin-optimizely';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ OptimizelyPlugin() ],
});
```

The constructor parameters allow for configuration of the contexts to include. If you do not specify any, all the Optimizely contexts will be included. To alter this behavior you can flip some of the booleans. The constructor has the following definition:

```javascript
OptimizelyPlugin(
  summary: boolean = true,
  experiments: boolean = true,
  states: boolean = true,
  variations: boolean = true,
  visitor: boolean = true,
  audiences: boolean = true,
  dimensions: boolean = true
)
```

  </TabItem>
</Tabs>

### Context

Adding this plugin will automatically capture the following context:

| Context |
| --- |
| [iglu:com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0)  |
[iglu:com.optimizely/experiment/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/experiment/jsonschema)  |
[iglu:com.optimizely/state/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/state/jsonschema/1-0-0)  |
[iglu:com.optimizely/variation/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/variation/jsonschema/1-0-0)  |
[iglu:com.optimizely/visitor/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor/jsonschema/1-0-0)  |
[iglu:com.optimizely/visitor_audience/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor_audience/jsonschema/1-0-0)  |
[iglu:com.optimizely/visitor_dimension/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor_dimension/jsonschema/1-0-0) |
