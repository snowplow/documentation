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

| Tracker Distribution | Included |
| --- | --- |
| `sp.js` | ❌ |
| `sp.lite.js` | ❌ |

:::note
The plugin is available since version 3.12 of the tracker.
:::

## Download

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

## Initialization

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js',
    ['snowplowMedia', 'SnowplowMediaPlugin']
);
```

## Overview

```mdx-code-block
<Media tracker="js-tag" />
```
