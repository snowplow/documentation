---
title: "Track ads on web"
sidebar_label: "Ads"
sidebar_position: 95
description: "Track ad impressions, clicks, and conversions with support for various cost models across ad networks and campaigns."
keywords: ["ad tracking", "impressions"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow tracking code can be included in ad tags in order to track impressions and ad clicks. This is used by e.g. ad networks to identify which sites and web pages users visit across a network, so that they can be segmented, for example.

Each ad tracking method has a `costModel` field and a `cost` field. If you provide the `cost` field, you must also provide one of `'cpa'`, `'cpc'`, and `'cpm'` for the `costModel` field.

It may be the case that multiple ads from the same source end up on a single page. If this happens, it is important that the different Snowplow code snippets associated with those ads not interfere with one another. The best way to prevent this is to randomly name each tracker instance you create so that the probability of a name collision is negligible. See [Managing multiple trackers](/docs/sources/web-trackers/tracker-setup/managing-multiple-trackers/index.md) for more on having more than one tracker instance on a single page.

Snowplow ad events must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js",
  ["snowplowAdTracking", "AdTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-ad-tracking`
- `yarn add @snowplow/browser-plugin-ad-tracking`
- `pnpm add @snowplow/browser-plugin-ad-tracking`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { AdTrackingPlugin, trackAdClick } from '@snowplow/browser-plugin-ad-tracking';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ AdTrackingPlugin() ],
});
```

  </TabItem>
</Tabs>

## Events

The ad tracking plugin includes three event types: ad impression, ad click, and ad conversion.

### Impression

Ad impression tracking is accomplished using the `trackAdImpression` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `impressionId` | No            | Identifier for the particular impression instance                    | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `targetUrl`    | No            | The destination URL                                                  | string   |
| `bannerId`     | No            | Adserver identifier for the ad banner (creative) being displayed     | string   |
| `zoneId`       | No            | Adserver identifier for the zone where the ad banner is located      | string   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

:::note
All properties are optional but you must specify at least 1 for this to be a valid call to `trackAdImpression`.
:::

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackAdImpression', {
    impressionId: '67965967893',
    costModel: 'cpm', // 'cpa', 'cpc', or 'cpm'
    cost: 5.5,
    targetUrl: 'http://www.example.com',
    bannerId: '23',
    zoneId: '7',
    advertiserId: '201',
    campaignId: '12'
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Example usage:
```javascript
import { trackAdImpression } from '@snowplow/browser-plugin-ad-tracking';

trackAdImpression({
    impressionId: '67965967893',
    costModel: 'cpm', // 'cpa', 'cpc', or 'cpm'
    cost: 5.5,
    targetUrl: 'http://www.example.com',
    bannerId: '23',
    zoneId: '7',
    advertiserId: '201',
    campaignId: '12'
});
```

  </TabItem>
</Tabs>

Ad impression events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0) is the JSON schema for an ad impression event.

### Click

Ad click tracking is accomplished using the `trackAdClick` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `targetUrl`    | Yes           | The destination URL                                                  | string   |
| `clickId`      | No            | Identifier for the particular click instance                         | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `bannerId`     | No            | Adserver identifier for the ad banner (creative) being displayed     | string   |
| `zoneId`       | No            | Adserver identifier for the zone where the ad banner is located      | string   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackAdClick',
  targetUrl: 'http://www.example.com',
  clickId: '12243253',
  costModel: 'cpm',
  cost: 2.5,
  bannerId: '23',
  zoneId: '7',
  impressionId: '67965967893', // the same as in trackAdImpression
  advertiserId: '201',
  campaignId: '12'
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackAdClick } from '@snowplow/browser-plugin-ad-tracking';

trackAdClick({
  targetUrl: 'http://www.example.com',
  clickId: '12243253',
  costModel: 'cpm',
  cost: 2.5,
  bannerId: '23',
  zoneId: '7',
  impressionId: '67965967893', // the same as in trackAdImpression
  advertiserId: '201',
  campaignId: '12'
});
```

  </TabItem>
</Tabs>

Ad click events are implemented as Snowplow self describing events.[Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_click/jsonschema/1-0-0) is the JSON schema for an ad click event.

### Conversion

Use the `trackAdConversion` method to track ad conversions. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
| -------------- | ------------- | -------------------------------------------------------------------- | -------- |
| `conversionId` | No            | Identifier for the particular conversion instance                    | string   |
| `costModel`    | No            | The cost model for the campaign: 'cpc', 'cpm', or 'cpa'              | string   |
| `cost`         | No            | Ad cost                                                              | number   |
| `category`     | No            | Conversion category                                                  | number   |
| `action`       | No            | The type of user interaction, e.g. 'purchase'                        | string   |
| `property`     | No            | Describes the object of the conversion                               | string   |
| `initialValue` | No            | How much the conversion is initially worth                           | number   |
| `advertiserID` | No            | Adserver identifier for the advertiser which the campaign belongs to | string   |
| `campaignId`   | No            | Adserver identifier for the ad campaign which the banner belongs to  | string   |

:::note
All properties are optional but you must specify at least one for this to be a valid call to `trackAdConversion`.
:::

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackAdConversion', {
    conversionId: '743560297',
    costModel: 'cpa',
    cost: 10,
    category: 'ecommerce',
    action: 'purchase',
    property: '',
    initialValue: 99,
    advertiserId: '201',
    campaignId: '12'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackAdConversion } from '@snowplow/browser-plugin-ad-tracking';

trackAdConversion({
    conversionId: '743560297',
    costModel: 'cpa',
    cost: 10,
    category: 'ecommerce',
    action: 'purchase',
    property: '',
    initialValue: 99,
    advertiserId: '201',
    campaignId: '12'
});
```

  </TabItem>
</Tabs>

Ad conversion events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_conversion/jsonschema/1-0-0) is the schema for an ad conversion event.

## Avoiding name collisions

It may be the case that multiple ads from the same source end up on a single page. If this happens, it is important that the different Snowplow code snippets associated with those ads not interfere with one another. The best way to prevent this is to randomly name each tracker instance you create so that the probability of a name collision is negligible. See [Managing multiple trackers](/docs/sources/web-trackers/tracker-setup/managing-multiple-trackers/index.md) for more on having more than one tracker instance on a single page.

Below is an example of how to achieve this when using Snowplow ad impression tracking.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
<!-- Snowplow starts plowing -->
<script type="text/javascript">

// Wrap script in a closure.
// This prevents rnd from becoming a global variable.
// So if multiple copies of the script are loaded on the same page,
// each instance of rnd will be inside its own namespace and will
// not overwrite any of the others.
// See http://benalman.com/news/2010/11/immediately-invoked-function-expression/
(function(){
  // Randomly generate tracker namespace to prevent clashes
  var rnd = Math.random().toString(36).substring(2);

  // Load Snowplow
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  // Create a new tracker namespaced to rnd
  snowplow('newTracker', rnd, '{{COLLECTOR_URL}}', {
    appId: 'myApp',
  });

  // Replace the values below with macros from your adserver
  snowplow('trackAdImpression:' + rnd, {
    impressionId: '67965967893',
    costModel: 'cpm',          // 'cpa', 'cpc', or 'cpm'
    cost: 5.5,
    targetUrl: 'http://www.example.com',
    bannerId: '23',
    zoneId: '7',
    advertiserId: '201',
    campaignId: '12'
  });
}());
</script>
<!-- Snowplow stops plowing -->
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from "@snowplow/browser-tracker";
import { trackAdImpression } from '@snowplow/browser-plugin-ad-tracking';

var rnd = Math.random().toString(36).substring(2);

newTracker(rnd, {{COLLECTOR_URL}}, {
  appId: "myApp",
  platform: "web"
});

trackAdImpression({
  impressionId: '67965967893',
  costModel: 'cpm',          // 'cpa', 'cpc', or 'cpm'
  cost: 5.5,
  targetUrl: 'http://www.example.com',
  bannerId: '23',
  zoneId: '7',
  advertiserId: '201',
  campaignId: '12',
}, [rnd]);
```

  </TabItem>
</Tabs>

Even if several copies of the above script appear on a page, the trackers created will all (probably) have different names and so will not interfere with one another. The same technique should be used when tracking ad clicks.
