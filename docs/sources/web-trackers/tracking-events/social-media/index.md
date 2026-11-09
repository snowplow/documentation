---
title: "Track social media interactions with the web trackers"
sidebar_label: "Social media"
sidebar_position: 140
description: "Track user interactions with social media widgets including likes, shares, and retweets across Facebook, Twitter, and other platforms."
keywords: ["social media", "social interactions"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Social interaction tracking is provided as part of the Site tracking plugin. This plugin also provides events for [site search](/docs/sources/web-trackers/tracking-events/site-search/index.md) and [timings](/docs/sources/web-trackers/tracking-events/timings/generic/index.md).

Social media interaction events must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@4.10.2/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a></td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-site-tracking@4.10.2/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a></td></tr></tbody></table>

**Note:** The links to the CDNs above are pinned to a specific version at the time of writing. Check the [plugin's GitHub releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) for newer versions, and update the pinned version when you upgrade.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-site-tracking@4.10.2/dist/index.umd.min.js",
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
