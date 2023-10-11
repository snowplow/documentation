---
title: "Optimizely Classic"
date: "2021-03-31"
sidebar_position: 13000
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

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-optimizely@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-optimizely@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

## Initialization

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

### Context

Adding this plugin will automatically capture the following context:

| Context |
| --- |
| [iglu:com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.snowplow/optimizely_summary/jsonschema/1-0-0)  
[iglu:com.optimizely/experiment/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/experiment/jsonschema)  
[iglu:com.optimizely/state/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/state/jsonschema/1-0-0)  
[iglu:com.optimizely/variation/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/variation/jsonschema/1-0-0)  
[iglu:com.optimizely/visitor/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor/jsonschema/1-0-0)  
[iglu:com.optimizely/visitor_audience/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor_audience/jsonschema/1-0-0)  
[iglu:com.optimizely/visitor_dimension/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/tree/master/schemas/com.optimizely/visitor_dimension/jsonschema/1-0-0) |
