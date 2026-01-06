---
title: "Optimizely X"
date: "2021-04-07"
sidebar_position: 14000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-optimizely-x`
- `yarn add @snowplow/browser-plugin-optimizely-x`
- `pnpm add @snowplow/browser-plugin-optimizely-x`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { OptimizelyXPlugin } from '@snowplow/browser-plugin-optimizely-x';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ OptimizelyXPlugin() ],
});
```

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                                      |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:com.optimizely.optimizelyx/summary/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.optimizely.optimizelyx/summary/jsonschema/1-0-0) |
