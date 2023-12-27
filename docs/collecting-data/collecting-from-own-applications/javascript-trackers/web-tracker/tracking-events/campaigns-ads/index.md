---
title: "Campaigns, ads and UTMs"
sidebar_position: 90
---

# Campaigns, ads and UTM tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Campaign tracking is used to identify the source of traffic coming to a website.

At the highest level, we can distinguish **paid** traffic (that derives from ad spend) with **non paid** traffic: visitors who come to the website by entering the URL directly, clicking on a link from a referrer site or clicking on an organic link returned in a search results, for example.

In order to identify **paid** traffic, Snowplow users need to set five query parameters on the links used in ads. Snowplow checks for the presence of these query parameters on the web pages that users load: if it finds them, it knows that that user came from a paid source, and stores the values of those parameters so that it is possible to identify the paid source of traffic exactly.

If the query parameters are not present, Snowplow reasons that the user is from a **non paid** source of traffic. It then checks the page referrer (the url of the web page the user was on before visiting our website), and uses that to deduce the source of traffic:

1. If the URL is identified as a search engine, the traffic medium is set to "organic" and Snowplow tries to derive the search engine name from the referrer URL domain and the keywords from the query string.
2. If the URL is a non-search 3rd party website, the medium is set to "referrer". Snowplow derives the source from the referrer URL domain.

### Identifying paid sources

Your different ad campaigns (PPC campaigns, display ads, email marketing messages, Facebook campaigns etc.) will include one or more links to your website e.g.:

```html
<a href="http://mysite.com/myproduct.html">Visit website</a>
```

We want to be able to identify people who've clicked on ads e.g. in a marketing email as having come to the site having clicked on a link in that particular marketing email. To do that, we modify the link in the marketing email with query parameters, like so:

```html
<a href="http://mysite.com/myproduct.html?utm_source=newsletter-october&utm_medium=email&utm_campaign=cn0201">Visit website</a>
```

For the prospective customer clicking on the link, adding the query parameters does not change the user experience. (The user is still directed to the webpage at <http://mysite.com/myproduct.html>.) But Snowplow then has access to the fields given in the query string, and uses them to identify this user as originating from the October Newsletter, an email marketing campaign with campaign id = cn0201.

### Anatomy of the query parameters

Snowplow uses the same query parameters used by Google Analytics. Because of this, Snowplow users who are also using GA do not need to do any additional work to make their campaigns trackable in Snowplow as well as GA. Those parameters are:

| **Parameter**  | **Name**         | **Description**                                                                                                                                       |
|----------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `utm_source`   | Campaign source  | Identify the advertiser driving traffic to your site e.g. Google, Facebook, autumn-newsletter etc.                                                    |
| `utm_medium`   | Campaign medium  | The advertising / marketing medium e.g. cpc, banner, email newsletter, in-app ad, cpa                                                                 |
| `utm_campaign` | Campaign id      | A unique campaign id. This can be a descriptive name or a number / string that is then looked up against a campaign table as part of the analysis     |
| `utm_term`     | Campaign term(s) | Used for search marketing in particular, this field is used to identify the search terms that triggered the ad being displayed in the search results. |
| `utm_content`  | Campaign content | Used either to differentiate similar content or two links in the same ad. (So that it is possible to identify which is generating more traffic.)      |

The parameters are described in the [Google Analytics help page](https://support.google.com/analytics/answer/1033863). Google also provides a [urlbuilder](https://support.google.com/analytics/answer/1033867?hl=en) which can be used to construct the URL incl. query parameters to use in your campaigns.

# Ad tracking

## Installation

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table class="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-ad-tracking`  
- `yarn add @snowplow/browser-plugin-ad-tracking`  
- `pnpm add @snowplow/browser-plugin-ad-tracking`  


  </TabItem>
</Tabs>

## Initialization

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ad-tracking@latest/dist/index.umd.min.js",
  ["snowplowAdTracking", "AdTrackingPlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { AdTrackingPlugin, trackAdClick } from '@snowplow/browser-plugin-ad-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ AdTrackingPlugin() ],
});
```

  </TabItem>
</Tabs>

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>trackAdImpression</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#trackadimpression">Documentation</a></td></tr><tr><td><code>trackAdClick</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#trackadclick">Documentation</a></td></tr><tr><td><code>trackAdConversion</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/#trackadconversion">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.


Snowplow tracking code can be included in ad tags in order to track impressions and ad clicks. This is used by e.g. ad networks to identify which sites and web pages users visit across a network, so that they can be segmented, for example.

Each ad tracking method has a `costModel` field and a `cost` field. If you provide the `cost` field, you must also provide one of `'cpa'`, `'cpc'`, and `'cpm'` for the `costModel` field.

It may be the case that multiple ads from the same source end up on a single page. If this happens, it is important that the different Snowplow code snippets associated with those ads not interfere with one another. The best way to prevent this is to randomly name each tracker instance you create so that the probability of a name collision is negligible. See [Managing multiple trackers](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/managing-multiple-trackers/index.md) for more on having more than one tracker instance on a single page.

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

Even if several copies of the above script appear on a page, the trackers created will all (probably) have different names and so will not interfere with one another. The same technique should be used when tracking ad clicks. The below examples for `trackAdImpression` and `trackAdClick` assume that `rnd` has been defined in this way.

### `trackAdImpression`

Ad impression tracking is accomplished using the `trackAdImpression` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
|----------------|---------------|----------------------------------------------------------------------|----------|
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

This is part of the `@snowplow/browser-plugin-ad-tracking` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-ad-tracking` and then initialize it:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { AdTrackingPlugin } from '@snowplow/browser-plugin-ad-tracking';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [ AdTrackingPlugin() ]
});
```

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

`trackAdImpression` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

### `trackAdClick`

Ad click tracking is accomplished using the `trackAdClick` method. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
|----------------|---------------|----------------------------------------------------------------------|----------|
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

`trackAdClick` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

### `trackAdConversion`

Use the `trackAdConversion` method to track ad conversions. Here are the arguments it accepts:

| **Name**       | **Required?** | **Description**                                                      | **Type** |
|----------------|---------------|----------------------------------------------------------------------|----------|
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
All properties are optional but you must specify at least 1 for this to be a valid call to `trackAdConversion`.
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

`trackAdConversion` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.
