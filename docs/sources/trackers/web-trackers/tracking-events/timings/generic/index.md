---
title: "Generic timing"
description: "Track generic timing events and user interactions using web trackers for performance analysis."
schema: "TechArticle"
keywords: ["Generic Timing", "Custom Timing", "Performance Events", "Timing Metrics", "Custom Performance", "Timing Analytics"]
sidebar_position: 98
---

# Generic site timing tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Use the `trackTiming` method to track user timing events such as how long resources take to load. This method is provided as part of the `site-tracking` plugin.

Timing events must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@latest/dist/index.umd.min.js",
  ["snowplowSiteTracking", "SiteTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-site-tracking`
- `yarn add @snowplow/browser-plugin-site-tracking`
- `pnpm add @snowplow/browser-plugin-site-tracking`

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


## Timing event

Use the `trackTiming` method to track how long something took. Here are its arguments:

| **Name**   | **Required?** | **Description**                | **Type** |
| ---------- | ------------- | ------------------------------ | -------- |
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
