---
title: "Snowplow media"
sidebar_position: 5
---

# Snowplow media tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Media from "@site/docs/reusable/media/_index.md"
```

This plugin is the recommended way to manually track media events from video players. This plugin allows you to implement media tracking for any player.

:::note
The plugin is available since version 3.12 of the tracker.
:::

Snowplow media events and entities must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@3/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-media@3/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@3/dist/index.umd.min.js',
    ['snowplowMedia', 'SnowplowMediaPlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-media@3`
- `yarn add @snowplow/browser-plugin-media@3`
- `pnpm add @snowplow/browser-plugin-media@3`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { SnowplowMediaPlugin } from '@snowplow/browser-plugin-media';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ SnowplowMediaPlugin() ],
});
```

  </TabItem>
</Tabs>

## Usage

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```mdx-code-block
<Media tracker="js-tag" />
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```mdx-code-block
<Media tracker="js-browser" />
```

  </TabItem>
</Tabs>
