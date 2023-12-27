---
title: "Timings"
sidebar_position: 90
---

# Timings tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-site-tracking`
- `yarn add @snowplow/browser-plugin-site-tracking`
- `pnpm add @snowplow/browser-plugin-site-tracking`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js",
  ["snowplowSiteTracking", "SiteTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { SiteTrackingPlugin, trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ SiteTrackingPlugin() ],
});
```

  </TabItem>
</Tabs>

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackSocialInteraction</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#tracksocialinteraction">Docume</a><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#tracksocialinteraction">ntation</a></td></tr><tr><td><code>trackSiteSearch</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#tracksitesearch">Documentation</a></td></tr><tr><td><code>trackTiming</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#tracktiming">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.


Use the `trackTiming` method to track user timing events such as how long resources take to load. Here are its arguments:

| **Name**   | **Required?** | **Description**                | **Type** |
|------------|---------------|--------------------------------|----------|
| `category` | Yes           | Timing category                | string   |
| `variable` | Yes           | Timed variable                 | string   |
| `timing`   | Yes           | Number of milliseconds elapsed | number   |
| `label`    | No            | Label for the event            | string   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackTiming', {
  category: 'load',
  variable: 'map_loaded',
  timing: 50,
  label: 'Map loading time'
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackTiming } from '@snowplow/browser-plugin-site-tracking';

trackTiming({
  category: 'load',
  variable: 'map_loaded',
  timing: 50,
  label: 'Map loading time'
});
```
  </TabItem>
</Tabs>


Timing events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0) is the schema for a `timing` event.

`trackTiming` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

# Performance timing

Adds Performance Timing context entities to your Snowplow tracking. There is a different version of this plugin called `Performance Navigation Timing` that uses a newer API, therefore it is recommended to use that instead (it also adds some additional metrics like the compressed/decompressed page size, and information about the navigation that can contextualise cache usage that can impact the measured metrics, as well as server-side metrics, etc).

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-performance-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-performance-timing`
- `yarn add @snowplow/browser-plugin-performance-timing`
- `pnpm add @snowplow/browser-plugin-performance-timing`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-timing@latest/dist/index.umd.min.js",
  ["snowplowPerformanceTiming", "PerformanceTimingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PerformanceTimingPlugin } from '@snowplow/browser-plugin-performance-timing';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PerformanceTimingPlugin() ],
});
```

  </TabItem>
</Tabs>

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                  |
|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:org.w3/PerformanceTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceTiming/jsonschema/1-0-0) |



# Performance navigation timing

Adds Performance Navigation Timing context entities to your Snowplow tracking. By default all its metrics are relative to the page load rather than absolute time stamps, making it easy to analyze and aggregate. To learn more about the properties tracked, you can visit the [specification](https://www.w3.org/TR/navigation-timing-2/) or MDN [documentation site](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming).

The following diagram shows the ResourceTiming and PerformanceNavigationTiming properties and how they connect to the navigation of the page main document.

![performance navigation timeline](./images/performance_navigation_timeline.png)

_Performance navigation timeline from the [W3C specification](https://www.w3.org/TR/navigation-timing-2/)._

:::note
The plugin is available since version 3.10 of the tracker.
:::

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-performance-navigation-timing`
- `yarn add @snowplow/browser-plugin-performance-navigation-timing`
- `pnpm add @snowplow/browser-plugin-performance-navigation-timing`


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-performance-navigation-timing@latest/dist/index.umd.min.js",
  ["snowplowPerformanceNavigationTiming", "PerformanceNavigationTimingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PerformanceNavigationTimingPlugin } from '@snowplow/browser-plugin-performance-navigation-timing';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PerformanceNavigationTimingPlugin() ],
});
```

  </TabItem>
</Tabs>

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                                      |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [iglu:org.w3/PerformanceNavigationTiming/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/org.w3/PerformanceNavigationTiming/jsonschema/1-0-0) |

### More detailed analysis for Single Page Applications (SPA)

As these metrics are primarily related to the initial page serve and load, after the window.onload handler ends the metrics will likely stay static for the life of the SPA page. If there's a pattern to the API requests the SPA makes for new content, the [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) could be used to capture the network metrics for that request from the performance API and re-use the schema. 

For actual rendering performance, the application will have to use the PerformanceMark/PerformanceMeasure [User timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing) APIs. These allow custom timing milestones, but since it's completely custom and there are no common conventions for using these APIs, currently there is no automatic support in the tracker for tracking these. Therefore we encourage you to build your custom schema in case you believe you would benefit from these additional metrics.




