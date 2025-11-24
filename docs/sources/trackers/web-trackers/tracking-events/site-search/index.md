---
title: "Tracking site search on web"
sidebar_label: "Site search"
sidebar_position: 120
---

# Site search tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Site search tracking are provided as part of the Site tracking plugin. This plugin also provides events for [social media interactions](/docs/sources/trackers/web-trackers/tracking-events/social-media/index.md) and [timings](/docs/sources/trackers/web-trackers/tracking-events/timings/generic/index.md).

Site search events must be **manually tracked**.

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

## Event

Use the `trackSiteSearch` method to track users searching your website. Here are its arguments:

| **Name**       | **Required?** | **Description**                 | **Type** |
| -------------- | ------------- | ------------------------------- | -------- |
| `terms`        | Yes           | Search terms                    | array    |
| `filters`      | No            | Search filters                  | JSON     |
| `totalResults` | No            | Results found                   | number   |
| `pageResults`  | No            | Results displayed on first page | number   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSiteSearch', {
    terms: ['unified', 'log'],
    filters: {'category': 'books', 'sub-category': 'non-fiction'},
    totalResults: 14,
    pageResults: 8
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

trackSiteSearch({
    terms: ['unified', 'log'],
    filters: {'category': 'books', 'sub-category': 'non-fiction'},
    totalResults: 14,
    pageResults: 8
});
```

  </TabItem>
</Tabs>

Site search events are implemented as Snowplow self-describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0) is the schema for a `site_search` event.
