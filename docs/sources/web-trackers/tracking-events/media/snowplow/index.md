---
title: "Snowplow media tracking on web"
sidebar_label: "Snowplow media"
sidebar_position: 5
description: "Manually track media events from any video player using flexible event tracking methods with custom entities and ad support."
keywords: ["media tracking", "video events"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Media from "@site/docs/reusable/media/_index.md"
```

This plugin is the recommended way to manually track media events from video players. This plugin allows you to implement media tracking for any player.

See the [media tracking overview page](/docs/events/ootb-data/media-events/index.md) for more details on schemas and using the plugin.

:::info Example app
To illustrate the tracked [events](/docs/fundamentals/events/index.md) and [entities](/docs/fundamentals/entities/index.md), visit our [example app](https://snowplow-industry-solutions.github.io/snowplow-javascript-tracker-examples/media) that showcases the tracked media events and entities live as you watch a video.

Source code for the app is [available here](https://github.com/snowplow-industry-solutions/snowplow-javascript-tracker-examples).
:::

:::note
The plugin is available since version 3.12 of the tracker.
:::

Snowplow media events and entities must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-media@latest/dist/index.umd.min.js',
    ['snowplowMedia', 'SnowplowMediaPlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-media`
- `yarn add @snowplow/browser-plugin-media`
- `pnpm add @snowplow/browser-plugin-media`

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

```mdx-code-block
<Media platforms={["js-tag", "js-browser"]} />
```

## Page activity during playback

When users watch video, they may not interact with the page, causing page pings to stop. The media plugin automatically keeps page activity alive during playback by calling `updatePageActivity` whenever media events are tracked.

You can turn off this behavior if not needed:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('startMediaTracking', {
    id,
    updatePageActivityWhilePlaying: false
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
startMediaTracking({
    id,
    updatePageActivityWhilePlaying: false
});
```

  </TabItem>
</Tabs>
