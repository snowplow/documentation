---
title: "Snowplow Media"
sidebar_position: 12500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'
import Media from "@site/docs/reusable/media/_index.md"

<ReleaseBadge/>
```

This plugin is the recommended way to manually track media events from video players.
While we also provide plugins for integrating with specific video players (e.g., YouTube, HTML5), this plugin allows you to implement media tracking for any player.

:::note
The plugin is available since version 3.12 of the tracker.
:::

## Installation

- `npm install @snowplow/browser-plugin-media`
- `yarn add @snowplow/browser-plugin-media`
- `pnpm add @snowplow/browser-plugin-media`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ SnowplowMediaPlugin() ],
});
```

## Overview

```mdx-code-block
<Media tracker="js-browser" />
```
