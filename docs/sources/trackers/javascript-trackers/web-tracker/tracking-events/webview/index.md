---
title: "WebViews"
sidebar_position: 180
---

# WebView integration for mobile

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin provides integration for WebViews on mobile platforms, when using the Snowplow native mobile ([Android and iOS v6.1+](/docs/sources/trackers/mobile-trackers/hybrid-apps/index.md)) or [React Native v4.2+](docs/sources/trackers/react-native-tracker/hybrid-apps/index.md) trackers.

When the plugin is active, for every event the web tracker checks if it is running in a WebView with at least one of the mobile interfaces available. If it is, the event is forwarded to the mobile tracker, and not tracked by the web tracker. If not, the event is tracked as normal.

This plugin uses the [Snowplow WebView tracker](/docs/sources/trackers/webview-tracker/index.md) as a dependency.

:::note
The plugin is available since version 4.2 of the tracker.
:::

The WebView integration is **automatic** once configured.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js',
    ['snowplowWebViewTracking', 'WebViewPlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-webview@webview_plugin`
- `yarn add @snowplow/browser-plugin-webview@webview_plugin`
- `pnpm add @snowplow/browser-plugin-webview@webview_plugin`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { WebViewPlugin } from '@snowplow/browser-plugin-webview';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ WebViewPlugin() ],
});
```

</TabItem>
</Tabs>

## Configuration

By default, the plugin will forward events to the default initialized Snowplow tracker on each platform. To specify a different tracker instance, or multiple trackers, pass in a list of tracker namespaces at setup.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js',
    ["snowplowWebViewTracking", "WebViewPlugin"][
      {
        trackerNamespaces: ["sp1", "sp2"],
      }
    ]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { WebViewPlugin } from '@snowplow/browser-plugin-webview';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ WebViewPlugin({ trackerNamespaces: ['sp1', 'sp2'] }) ],
});
```

</TabItem>
</Tabs>

:::warning
If there is no mobile tracker with the specified namespace(s), the event will not be tracked.
:::
