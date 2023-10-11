---
title: "Optimizely Classic"
date: "2021-04-07"
sidebar_position: 13000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-optimizely`
- `yarn add @snowplow/browser-plugin-optimizely`
- `pnpm add @snowplow/browser-plugin-optimizely`

## Initialization

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
