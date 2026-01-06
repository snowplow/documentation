---
title: "Adding plugins to your tracker"
date: "2021-04-19"
sidebar_position: 500
---

The Snowplow JavaScript Trackers v3 allow extension via plugins. There a number of official Snowplow plugins, but we also encourage building your own. You can either include them directly in your codebase or tag management tool, or you could publish them to npm as public packages that the whole community can use.

There are two ways to add plugins:

- During tracker intialization
- Dynamically after tracker intialization

## Tracker Initialization

To add a plugin at tracker intialisation, you include the plugin in the `Plugins` array:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  contexts: {
    webPage: true // default, can be omitted
  },
  plugins: [ PerformanceTimingPlugin() ]
});
```

## After Tracker Initialization

To add a plugin after tracker intialisation, you can call `addPlugin` and pass the plugin in:

```javascript
import { newTracker, addPlugin } from '@snowplow/browser-tracker';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  contexts: {
    webPage: true // default, can be omitted
  }
});

...

addPlugin({ plugin: PerformanceTimingPlugin() });
```
