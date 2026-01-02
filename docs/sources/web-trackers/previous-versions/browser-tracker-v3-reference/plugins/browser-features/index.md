---
title: "Browser Features"
date: "2021-04-07"
sidebar_position: 2000
description: "Documentation for Browser Features in the web tracker."
keywords: ["tracker", "configuration"]
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

**Deprecated**: This plugin is deprecated. The `navigator.mimeTypes` API which this tracker uses is now deprecated and modern browsers may no longer populate these values.

## Installation

- `npm install @snowplow/browser-plugin-browser-features`
- `yarn add @snowplow/browser-plugin-browser-features`
- `pnpm add @snowplow/browser-plugin-browser-features`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { BrowserFeaturesPlugin } from '@snowplow/browser-plugin-browser-features';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ BrowserFeaturesPlugin() ],
});

trackPageView();
```

### Properties

This plugin will add [MIME Type](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/mimeTypes) tracking. This allows the tracker to populate the `f_*` fields within the [canonical event model](/docs/fundamentals/canonical-event/index.md).
