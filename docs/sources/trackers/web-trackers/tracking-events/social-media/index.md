---
title: "Social media"
description: "Track social media interactions and sharing behavior using web trackers for engagement analytics."
schema: "TechArticle"
keywords: ["Social Media", "Social Tracking", "Social Events", "Social Analytics", "Social Engagement", "Social Buttons"]
sidebar_position: 140
---

# Social media interactions tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Social interaction tracking is provided as part of the Site tracking plugin. This plugin also provides events for [site search](/docs/sources/trackers/web-trackers/tracking-events/site-search/index.md) and [timings](/docs/sources/trackers/web-trackers/tracking-events/timings/generic/index.md).

Social media interaction events must be **manually tracked**.

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

Social tracking is used to track the way users interact with Facebook, Twitter and Google + widgets, e.g. to capture "like this" or "tweet this" events.

The `trackSocialInteraction` method takes three parameters:

| **Parameter** | **Description**                                               | **Required?** | **Example value**     |
| ------------- | ------------------------------------------------------------- | ------------- | --------------------- |
| `action`      | Social action performed                                       | Yes           | 'like', 'retweet'     |
| `network`     | Social network                                                | Yes           | 'facebook', 'twitter' |
| `target`      | Object social action is performed on e.g. page ID, product ID | No            | '19.99'               |

The method is executed in as:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSocialInteraction', {
  action: string,
  network: string,
  target: string
});

```

For example:

```javascript
snowplow('trackSocialInteraction', {
  action: 'like',
  network: 'facebook',
  target: 'pbz00123'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackSocialInteraction } from '@snowplow/browser-plugin-site-tracking';

trackSocialInteraction({
  action: string,
  network: string,
  target: string
});
```

For example:

```javascript
import { trackSocialInteraction } from '@snowplow/browser-plugin-site-tracking';

trackSocialInteraction({
  action: 'like',
  network: 'facebook',
  target: 'pbz00123'
});
```
  </TabItem>
</Tabs>
