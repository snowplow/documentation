---
title: "Track WebViews and hybrid applications using the web trackers"
sidebar_label: "Hybrid applications"
sidebar_position: 180
description: "Integrate web tracking in hybrid mobile apps by forwarding events from web views to native iOS, Android, or React Native trackers."
keywords: ["webview", "hybrid apps"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin provides integration for hybrid apps using the Snowplow native mobile ([Android and iOS v6.1+](/docs/sources/mobile-trackers/hybrid-apps/index.md)) or [React Native v4.2+](docs/sources/react-native-tracker/hybrid-apps/index.md) trackers. Hybrid apps are mobile apps that in addition to a native interface, provide part of the UI through an embedded web view.

If your web app will run both separately and as part of a hybrid app, with this plugin you only need one tracking implementation for your web app. You still have to implement the mobile trackers too.

When the plugin is active, for every event the web tracker checks if it's running in a web view with at least one of the mobile interfaces available. If it is, the web tracker forwards the event to the mobile tracker, and doesn't track it itself. If not, the web tracker tracks the event as normal.

:::note
The plugin is available since version 4.3 of the tracker.
:::

The WebView integration is **automatic** once configured.


The diagram below shows the interaction of the WebView plugin and mobile trackers in hybrid apps.

```mermaid
flowchart TB

subgraph hybridApp[Hybrid Mobile App]

    subgraph webView[Web View]
        webViewCode[App logic]
        webViewTracker[JS tracker with WebView plugin]

        webViewCode -- "Tracks events" --> webViewTracker
    end

    subgraph nativeCode[Native Code]
        nativeAppCode[App logic]
        nativeTracker[Snowplow iOS/Android/React Native tracker]

        nativeAppCode -- "Tracks events" --> nativeTracker
    end

    webViewTracker -- "Forwards events" --> nativeTracker
end

subgraph cloud[Cloud]
    collector[Snowplow Collector]
end

nativeTracker -- "Sends tracked events" --> collector
```

To use the WebView plugin, you must have a mobile tracker initialized and configured.

The supported trackers are:
* Android v6.1+
* iOS v6.1+
* React Native v4.2+

How to set up hybrid app tracking:
1. Implement the Snowplow [iOS, Android](/docs/sources/mobile-trackers/index.md), or [React Native](docs/sources/react-native-tracker/index.md) tracker in your mobile codebase.
2. Create a web view based on your web app, with Snowplow web tracking and WebView plugin instrumented.
3. Subscribe to the web view. Read how to do this for [native mobile](/docs/sources/mobile-trackers/hybrid-apps/index.md) or [React Native](docs/sources/react-native-tracker/hybrid-apps/index.md).
4. Track events from web and mobile.

This plugin uses the [Snowplow WebView tracker](/docs/sources/webview-tracker/index.md) as a dependency.

## What do the forwarded events look like?

The forwarded hybrid events will have all the information tracked by the web tracker. This includes all entities, whether configured by the tracker [automatically](/docs/sources/web-trackers/tracking-events/index.md#add-contextual-data-with-entities) or by you as a global context. Baked-in (non-entity) properties such as user agent or URL are also included.

Additionally, any configured mobile entities will also be added. Again, this includes [auto-tracked entities](/docs/sources/mobile-trackers/tracking-events/index.md#auto-tracked-events-and-entities) such as the screen, session, or platform entities, as well as any global context entities.

The forwarded events will have the web tracker version, e.g. "js-4.3.0", but the `namespace` and `appId` from the mobile tracker.

Hybrid events are still compatible with the Snowplow [Unified Digital dbt model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md).

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">GitHub Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-webview@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

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
    ["snowplowWebViewTracking", "WebViewPlugin"],
    [
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

:::warning Specifying namespaces
When a mobile interface is available, the web tracker will forward the event rather than tracking it. If you specify namespaces in the configuration, and no mobile trackers actually exist with those namespaces, the event will be lost.
:::
