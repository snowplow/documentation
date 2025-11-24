---
title: "Configuring plugins for the browser (npm) tracker"
sidebar_label: "Browser (npm) tracker"
date: "2021-04-19"
sidebar_position: 500
---

The Snowplow JavaScript Trackers v3 allow extension via plugins. There a number of official Snowplow plugins, but we also encourage building your own. You can either include them directly in your codebase or tag management tool, or you could publish them to npm as public packages that the whole community can use.

There are two ways to add plugins to the browser tracker:

- During tracker initialization
- Dynamically after tracker initialization

## Installation

Plugins must first be installed. For example, to use the Performance Timing plugin, run one of the following commands:

- `npm install @snowplow/browser-plugin-performance-timing`
- `yarn add @snowplow/browser-plugin-performance-timing`
- `pnpm add @snowplow/browser-plugin-performance-timing`

## Tracker initialization

To add the plugin at tracker initialisation, you include the plugin in the `Plugins` array:

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

## After tracker initialization

To add a plugin after tracker initialisation, you can call `addPlugin` and pass the plugin in:

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

## Usage

Some plugins, such as the Performance Timing plugin shown above, work automatically after being added. Others provide methods that can be called once added.

For example, form tracking:

```javascript
newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [ FormTrackingPlugin() ],
});

// Use the new functions which this plugin includes
enableFormTracking();
```

Others may accept configuration passed directly to the constructor, such as Web Vitals or Google Analytics Cookies:

```javascript
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';
import { WebVitalsPlugin } from '@snowplow/browser-plugin-web-vitals';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [ GaCookiesPlugin({ ga4: true, ua: false }) ]
});

// after initialization:
addPlugin({
  plugin: WebVitalsPlugin({ context: [
    function(vitals) { return {
      schema: "iglu:com.example/page_speed/jsonschema/1-0-0",
      data: {
        speed: vitals.fid < 2 ? "fast" : "slow"
      }
    };},
  ]})
});
```
