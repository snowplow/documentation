---
title: "Timezone"
description: "Timezone plugin for browser tracker v3 to add temporal context to behavioral analytics."
schema: "TechArticle"
keywords: ["Browser V3 Timezone", "Timezone Detection", "Legacy Timezone", "Geographic Data", "Time Analytics", "Location Data"]
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

This plugin will add Timezone tracking. This allows the tracker to populate the `` `os_timezone` `` field within the [canonical event model](/docs/fundamentals/canonical-event/index.md).
