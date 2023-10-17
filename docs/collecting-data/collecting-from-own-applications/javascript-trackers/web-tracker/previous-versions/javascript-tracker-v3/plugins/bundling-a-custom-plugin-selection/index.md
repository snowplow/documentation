---
title: "Bundling a custom plugin selection"
date: "2023-03-22"
sidebar_position: 600
---

The [default releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) of the JavaScript Tracker include a full-featured `sp.js` version, and a smaller-filesize `sp.lite.js` version that includes less [Plugins](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/plugins/index.md).

While plugins can be loaded dynamically, self hosting the additional files adds complexity and the additional resource requests can negatively impact page performance.
For this reason, it can be desirable to have your own version of `sp.js` that includes _just_ the features you need, to both reduce the filesize and not require loading additional script resources.

## Custom Plugin Selections
To do this, you'll need to install [git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/) 14 or 16 (at the time of writing) then open a Terminal or Command Prompt and run the following:

```bash
$ git clone https://github.com/snowplow/snowplow-javascript-tracker.git
$ cd snowplow-javascript-tracker
$ npx @microsoft/rush update
```

Then open the file `trackers/javascript-tracker/tracker.config.ts` in your favourite text editor and flip the `true` values to `false` for features which you don't require (or vice versa).

Then run:

```bash
$ npx @microsoft/rush build
```

Once complete (it might take a minute or two), you'll find your brand new `sp.js` at:
`trackers/javascript-tracker/dist/sp.js` along with a new sourcemap `sp.js.map` which we suggest hosting together for a better developer experience.

## Including Custom Plugins
The above only works for the official plugins included in the `snowplow-javascript-tracker` repository.
If you have [developed your own plugins](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/javascript-tracker-v3/plugins/creating-your-own-plugins/index.md), or want to include plugins from third parties, the process is similar, but with some additional small code changes:

1. Include the plugin as a dependency in `trackers/javascript-tracker/package.json`
1. Import the plugin in `trackers/javascript-tracker/src/features.ts`
1. Follow the pattern defined in `trackers/javascript-tracker/src/features.ts` to check a feature flag for the plugin to conditionally reference the plugin
1. Add a feature flag for the plugin to `trackers/javascript-tracker/tracker.config.ts` and `trackers/javascript-tracker/tracker.lite.config.ts`
1. Rerun `npx @microsoft/rush update` and `npx @microsoft/rush build` as usual (`update` may take longer if it needs to build the custom plugins from scratch if they are not already published in a package repository)

If the plugin flag is constant and set to true, the import should succeed and the plugin will be included in the bundle.
Otherwise, the "tree-shaking" should kick in and the plugin code will be excluded from the bundle output.

For example, the changes to embed the [SimpleContextTemplate](https://github.com/snowplow-incubator/snowplow-browser-plugin-simple-template) example plugin might look like the following:

```diff
diff --git a/trackers/javascript-tracker/package.json b/trackers/javascript-tracker/package.json
index abfa94aa..124bbb6b 100644
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
   "devDependencies": {
     "@ampproject/rollup-plugin-closure-compiler": "~0.27.0",
diff --git a/trackers/javascript-tracker/src/features.ts b/trackers/javascript-tracker/src/features.ts
index b08fe346..848f3369 100644
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
index 1ca88db5..80a83e4c 100644
--- a/trackers/javascript-tracker/tracker.config.ts
+++ b/trackers/javascript-tracker/tracker.config.ts
@@ -48,3 +48,4 @@ export const browserFeatures = false;
 export const mediaTracking = false;
 export const youtubeTracking = false;
 export const enhancedConsent = false;
+export const simpleContext = true;
diff --git a/trackers/javascript-tracker/tracker.lite.config.ts b/trackers/javascript-tracker/tracker.lite.config.ts
index a9ec92f7..be81d785 100644
--- a/trackers/javascript-tracker/tracker.lite.config.ts
+++ b/trackers/javascript-tracker/tracker.lite.config.ts
@@ -48,3 +48,4 @@ export const browserFeatures = false;
 export const mediaTracking = false;
 export const youtubeTracking = false;
 export const enhancedConsent = false;
+export const simpleContext = false;
```

In this case the resulting `sp.js` file will contain the `my_context` entity from the plugin, but the generated `sp.lite.js` will not.
