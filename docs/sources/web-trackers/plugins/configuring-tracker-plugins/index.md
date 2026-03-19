---
title: "Configure web tracker plugins"
sidebar_label: "Configure plugins"
description: "Install and configure plugins for the JavaScript tag and Browser npm versions of the Snowplow web tracker."
keywords: ["plugin configuration", "plugin installation", "addplugin", "browser tracker plugins", "javascript tracker plugins", "custom plugins"]
date: "2021-04-07"
sidebar_position: 750
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow web trackers allow extension via plugins. There are a number of [out-of-the-box Snowplow plugins](/docs/sources/web-trackers/plugins/index.md), but you can also [build your own](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md).

## Install plugins

The installation method depends on which version of the web tracker you are using.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

The [JavaScript tracker distributions](/docs/sources/web-trackers/tracker-setup/index.md) include a full-featured `sp.js` version with [some plugins](/docs/sources/web-trackers/plugins/index.md), and a smaller `sp.lite.js` version with no plugins.

If the plugin you need is present in your `sp.js` version, you can use it without additional installation. Otherwise, you can either build a custom `sp.js` bundle with the required plugins included, or load plugins dynamically at runtime.

While plugins can be loaded dynamically, self-hosting the additional files adds complexity, and additional resource requests can negatively impact page performance. Consider building a custom bundle with only the plugins you need.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

The tracker doesn't come with any plugins pre-installed.

Install plugins as npm packages. For example, to use the Button Click tracking plugin:

```bash
npm install @snowplow/browser-plugin-button-click-tracking
# or
yarn add @snowplow/browser-plugin-button-click-tracking
# or
pnpm add @snowplow/browser-plugin-button-click-tracking
```

  </TabItem>
</Tabs>

## Make plugins available to the tracker

You can make plugins available to the tracker in different ways.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

Bundled plugins are automatically available, and their methods are exposed directly.

You can configure bundled plugins that add entities during initialization via the [`contexts` option](/docs/sources/web-trackers/tracker-setup/initialization-options/index.md):

```javascript
snowplow('newTracker', 'sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  contexts: {
    performanceNavigationTiming: true
  }
});

// Methods from bundled plugins are available directly
snowplow('enableFormTracking');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Include plugins in the `plugins` array when creating the tracker:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { PerformanceNavigationTimingPlugin } from '@snowplow/browser-plugin-performance-navigation-timing';
import { FormTrackingPlugin, enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [
    PerformanceNavigationTimingPlugin(),
    FormTrackingPlugin()
]
});

// For plugins that add entities, no additional configuration is needed
// Adding the plugin makes it active

// Use the methods provided by the plugins
enableFormTracking();
```

  </TabItem>
</Tabs>

You can add plugins dynamically at any time. This also works for [inline plugins](/docs/sources/web-trackers/plugins/creating-your-own-plugins/index.md#inline-plugins) that are part of your codebase rather than published separately.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

Use `addPlugin` with a URL to load the plugin dynamically.

```javascript
snowplow(
  'addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js",
  ["snowplowPerformanceNavigationTiming", "PerformanceNavigationTimingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Use the `addPlugin` function:

```javascript
import { newTracker, addPlugin } from '@snowplow/browser-tracker';
import { PerformanceNavigationTimingPlugin } from '@snowplow/browser-plugin-performance-navigation-timing';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id'
});

// Later...
addPlugin({ plugin: PerformanceNavigationTimingPlugin() });
```

  </TabItem>
</Tabs>

## Build a custom bundle

If you use the JavaScript (tag) tracker and want to reduce file size or include only specific plugins, you can build a custom `sp.js` bundle.

To do this, clone the [tracker repository](https://github.com/snowplow/snowplow-javascript-tracker) and update the plugins config file to include the plugins you want. Then build the tracker to create your custom `sp.js`.

You'll need git and Node.js (version 14+) installed:

```bash
git clone https://github.com/snowplow/snowplow-javascript-tracker.git
cd snowplow-javascript-tracker
npx @microsoft/rush update
```

Edit `trackers/javascript-tracker/tracker.config.ts` and set plugins to `true` or `false` based on your needs.

```ts
/* By default included plugins in sp.js */
export const adTracking = true;
export const enhancedConsent = true;
export const errorTracking = true;
export const formTracking = true;
export const gaCookies = true;
export const linkClickTracking = true;
export const performanceNavigationTiming = true;
export const siteTracking = true;
export const snowplowEcommerceTracking = true;
export const buttonClickTracking = true;
export const webVitals = true;

/* By default excluded plugins in sp.js */
export const clientHints = false;
export const mediaTracking = false;
export const optimizelyX = false;
export const youtubeTracking = false;
export const snowplowMedia = false;
export const vimeoTracking = false;
export const privacySandbox = false;
export const eventSpecifications = false;
export const geolocation = false;
export const timezone = false;
export const elementTracking = false;

/* Deprecated */
export const enhancedEcommerce = false;
export const performanceTiming = false;
```

Once you've edited the file, run the build command:

```bash
npx @microsoft/rush build
```

Your custom `sp.js` will be at `trackers/javascript-tracker/dist/sp.js`, along with a sourcemap `sp.js.map`. Host both files together for a better developer experience.

## Include custom plugins in a bundle

To include your own plugins or third-party plugins in a custom JavaScript tracker bundle, you need to make the following changes:

1. Add the plugin as a dependency in `trackers/javascript-tracker/package.json`
2. Import the plugin in `trackers/javascript-tracker/src/features.ts`
3. Add conditional logic in `features.ts` to check a feature flag for the plugin
4. Add a feature flag in both `tracker.config.ts` and `tracker.lite.config.ts`
5. Run `npx @microsoft/rush update` and `npx @microsoft/rush build`

For example, to embed the [SimpleContextTemplate](https://github.com/snowplow-incubator/snowplow-browser-plugin-simple-template) plugin:

```diff
diff --git a/trackers/javascript-tracker/package.json b/trackers/javascript-tracker/package.json
--- a/trackers/javascript-tracker/package.json
+++ b/trackers/javascript-tracker/package.json
@@ -59,7 +59,8 @@
     "@snowplow/browser-tracker-core": "workspace:*",
     "@snowplow/tracker-core": "workspace:*",
     "tslib": "^2.3.1",
-    "@snowplow/browser-plugin-enhanced-consent": "workspace:*"
+    "@snowplow/browser-plugin-enhanced-consent": "workspace:*",
+    "snowplow-browser-plugin-simple-template": "snowplow-incubator/snowplow-browser-plugin-simple-template"
   },

diff --git a/trackers/javascript-tracker/src/features.ts b/trackers/javascript-tracker/src/features.ts
--- a/trackers/javascript-tracker/src/features.ts
+++ b/trackers/javascript-tracker/src/features.ts
@@ -47,6 +47,7 @@ import * as SiteTracking from '@snowplow/browser-plugin-site-tracking';
 import * as SnowplowEcommerce from '@snowplow/browser-plugin-snowplow-ecommerce';
 import * as MediaTracking from '@snowplow/browser-plugin-media-tracking';
 import * as YouTubeTracking from '@snowplow/browser-plugin-youtube-tracking';
+import * as SimpleContext from 'snowplow-browser-plugin-simple-template';
 import * as plugins from '../tracker.config';
 import { BrowserPlugin } from '@snowplow/browser-tracker-core';
 import { JavaScriptTrackerConfiguration } from './configuration';
@@ -196,5 +197,10 @@ export function Plugins(configuration: JavaScriptTrackerConfiguration) {
     activatedPlugins.push([EnhancedConsentPlugin(), apiMethods]);
   }

+  if (plugins.simpleContext) {
+    const { SimpleContextPlugin, ...apiMethods } = SimpleContext;
+    activatedPlugins.push([SimpleContextPlugin(), apiMethods]);
+  }
+
   return activatedPlugins;
 }

diff --git a/trackers/javascript-tracker/tracker.config.ts b/trackers/javascript-tracker/tracker.config.ts
--- a/trackers/javascript-tracker/tracker.config.ts
+++ b/trackers/javascript-tracker/tracker.config.ts
@@ -48,3 +48,4 @@ export const browserFeatures = false;
 export const mediaTracking = false;
 export const youtubeTracking = false;
 export const enhancedConsent = false;
+export const simpleContext = true;

diff --git a/trackers/javascript-tracker/tracker.lite.config.ts b/trackers/javascript-tracker/tracker.lite.config.ts
--- a/trackers/javascript-tracker/tracker.lite.config.ts
+++ b/trackers/javascript-tracker/tracker.lite.config.ts
@@ -48,3 +48,4 @@ export const browserFeatures = false;
 export const mediaTracking = false;
 export const youtubeTracking = false;
 export const enhancedConsent = false;
+export const simpleContext = false;
```

With these changes, the resulting `sp.js` will include the custom plugin, while `sp.lite.js` will not.
