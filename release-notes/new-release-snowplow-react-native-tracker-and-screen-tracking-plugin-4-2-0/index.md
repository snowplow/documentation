---
title: "Snowplow React Native tracker and screen tracking plugin 4.2.0 released"
description: "We are excited to announce the 4.2 release of the Snowplow JavaScript trackers!"
date: "2025-01-13"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
We are excited to announce the 4.2 release of the Snowplow JavaScript trackers! This version includes two new libraries – React Native tracker and Screen Tracking plugin.

The new React Native tracker is now fully built in JavaScript. The tracker now adds full support for the **Expo Go** framework and **React Native for Web**. It also improves global context, adds support for JavaScript tracker plugins (e.g., ecommerce and consent).

You can find the tracker as `@snowplow/react-native-tracker` [on npm](https://www.npmjs.com/package/@snowplow/react-native-tracker). Check out the [documentation](/docs/sources/react-native-tracker/) and the [migration guide](/docs/sources/react-native-tracker/migration-guides/migrating-from-v2-x-to-v4/) for the full list of breaking changes.

A new screen tracking plugin for the JavaScript tracker is also introduced. This plugin has full support for screen view tracking including the screen context entity and screen engagement tracking.

You can find the plugin as `@snowplow/browser-plugin-screen-tracking` [on npm](https://www.npmjs.com/package/@snowplow/browser-plugin-screen-tracking). See [the documentation](/docs/sources/web-trackers/tracking-events/screen-views/) for more details.

### **Enhancements**

* Add new tracker for React Native ([#1377](https://github.com/snowplow/snowplow-javascript-tracker/pull/1377))
* Add screen tracking plugin and add support for browser plugins ([#1394](https://github.com/snowplow/snowplow-javascript-tracker/pull/1394))
* Add WebView tracker integration to the React Native tracker ([#1399](https://github.com/snowplow/snowplow-javascript-tracker/pull/1399))
* Add app install, foreground and background event and application entity tracking ([#1396](https://github.com/snowplow/snowplow-javascript-tracker/pull/1396))
* Add deep link tracking to the React Native tracker ([#1398](https://github.com/snowplow/snowplow-javascript-tracker/pull/1398))
* Add a platform context plugin to the React Native tracker to track device information ([#1395](https://github.com/snowplow/snowplow-javascript-tracker/pull/1395))
* Add internal session plugin to the React Native tracker ([#1388](https://github.com/snowplow/snowplow-javascript-tracker/pull/1388))

### **Under the hood**

* Silence console output in jest tests
