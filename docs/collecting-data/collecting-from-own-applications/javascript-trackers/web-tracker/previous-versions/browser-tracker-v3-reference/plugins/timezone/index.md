---
title: "Timezone"
date: "2021-04-07"
sidebar_position: 16000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-timezone`
- `yarn add @snowplow/browser-plugin-timezone`
- `pnpm add @snowplow/browser-plugin-timezone`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ TimezonePlugin() ],
});
```

### Properties

This plugin will add Timezone tracking. This allows the tracker to populate the `` `os_timezone` `` field within the [canonical event model](/docs/understanding-your-pipeline/canonical-event/index.md).
