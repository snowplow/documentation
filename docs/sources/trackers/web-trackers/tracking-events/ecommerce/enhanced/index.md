---
title: "Legacy enhanced ecommerce plugin for web"
sidebar_label: "Enhanced"
sidebar_position: 70
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::warning
This plugin has been deprecated and superseded by the [Snowplow ecommerce plugin](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/index.md). We highly recommend using this newer plugin, which is more fully featured and allows you to use the DBT model we provide.
:::

This plugin is based on Google Analytics' Enhanced Ecommerce package. For more information on the Enhanced Ecommerce functions please see the Google Analytics [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce).

Enhanced ecommerce events must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ❌        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-enhanced-ecommerce@latest/dist/index.umd.min.js",
  ["snowplowEnhancedEcommerce", "EnhancedEcommercePlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-enhanced-ecommerce`
- `yarn add @snowplow/browser-plugin-enhanced-ecommerce`
- `pnpm add @snowplow/browser-plugin-enhanced-ecommerce`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { EnhancedEcommercePlugin, trackEnhancedEcommerceAction } from '@snowplow/browser-plugin-enhanced-ecommerce';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ EnhancedEcommercePlugin() ],
});
```

  </TabItem>
</Tabs>

## Event

The enhanced ecommerce plugin is based around the `EnhancedEcommerceAction` event, to which can be added the Action, Impression, Product and Promo context entities. The context entities must be added first, before the event is tracked.

Use the `trackEnhancedEcommerceAction` method to track a GA Enhanced Ecommerce Action. When this function is called all of the added Ecommerce context entities are attached to this action and flushed from the tracker.

| **Name** | **Required?** | **Type** |
| -------- | ------------- | -------- |
| `action` | Yes           | string   |

The allowed actions:

- `click`
- `detail`
- `add`
- `remove`
- `checkout`
- `checkout_option`
- `purchase`
- `refund`
- `promo_click`
- `view`

Adding an action using Google Analytics:

```javascript
ga('ec:setAction', 'refund', {
  'id': 'T12345'
});
```

Adding an action using Snowplow:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addEnhancedEcommerceActionContext', {
  id: 'T12345'
});
snowplow('trackEnhancedEcommerceAction', {
  action: 'refund'
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
addEnhancedEcommerceActionContext({ id: 'T12345' });
trackEnhancedEcommerceAction({ action: 'refund' });
```
  </TabItem>
</Tabs>

## Context entities

The enhanced ecommerce context entities are specific to this plugin, and cannot be added to any other event types.

### Action

Use the `addEnhancedEcommerceActionContext` method to add a GA Enhanced Ecommerce Action Context to the Tracker:

| **Name**      | **Required?** | **Type**          |
| ------------- | ------------- | ----------------- |
| `id`          | Yes           | string            |
| `affiliation` | No            | string            |
| `revenue`     | No            | number OR string  |
| `tax`         | No            | number OR string  |
| `shipping`    | No            | number OR string  |
| `coupon`      | No            | string            |
| `list`        | No            | string            |
| `step`        | No            | integer OR string |
| `option`      | No            | string            |
| `currency`    | No            | string            |

Adding an action using Google Analytics:

```javascript
ga('ec:setAction', 'purchase', {
  'id': 'T12345',
  'affiliation': 'Google Store - Online',
  'revenue': '37.39',
  'tax': '2.85',
  'shipping': '5.34',
  'coupon': 'SUMMER2013'
});
```

:::note
The action type is passed with the action context in the Google Analytics example. We have separated this by asking you to call the `trackEnhancedEcommerceAction` function to actually send the context and the action.
:::

Adding an action using Snowplow:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addEnhancedEcommerceActionContext', {
  id: 'T12345',
  affiliation: 'Google Store - Online',
  revenue: '37.39', // Can also pass as number
  tax: '2.85', // Can also pass as number
  shipping: '5.34', // Can also pass as number
  coupon: 'WINTER2016'
});
``
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
addEnhancedEcommerceActionContext({
  id: 'T12345',
  affiliation: 'Google Store - Online',
  revenue: '37.39', // Can also pass as number
  tax: '2.85', // Can also pass as number
  shipping: '5.34', // Can also pass as number
  coupon: 'WINTER2016'
});
```

  </TabItem>
</Tabs>

### Impression

Use the `addEnhancedEcommerceImpressionContext` method to add a GA Enhanced Ecommerce Impression Context to the Tracker:

| **Name**   | **Required?** | **Type**          |
| ---------- | ------------- | ----------------- |
| `id`       | Yes           | string            |
| `name`     | No            | string            |
| `list`     | No            | string            |
| `brand`    | No            | string            |
| `category` | No            | string            |
| `variant`  | No            | string            |
| `position` | No            | integer OR string |
| `price`    | No            | number OR string  |
| `currency` | No            | string            |

Adding an impression using Google Analytics:

```javascript
ga('ec:addImpression', {
  'id': 'P12345',
  'name': 'Android Warhol T-Shirt',
  'list': 'Search Results',
  'brand': 'Google',
  'category': 'Apparel/T-Shirts',
  'variant': 'Black',
  'position': 1
});
```

Adding an impression using Snowplow:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addEnhancedEcommerceImpressionContext', {
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  position: 1
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
addEnhancedEcommerceImpressionContext({
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  position: 1
});
```

  </TabItem>
</Tabs>

### Product

Use the `addEnhancedEcommerceProductContext` method to add a GA Enhanced Ecommerce Product Field Context:

| **Name**   | **Required?** | **Type**          |
| ---------- | ------------- | ----------------- |
| `id`       | Yes           | string            |
| `name`     | No            | string            |
| `list`     | No            | string            |
| `brand`    | No            | string            |
| `category` | No            | string            |
| `variant`  | No            | string            |
| `price`    | No            | number OR string  |
| `quantity` | No            | integer OR string |
| `coupon`   | No            | string            |
| `position` | No            | integer OR string |
| `currency` | No            | string            |

Adding a product using Google Analytics:

```javascript
ga('ec:addProduct', {
  'id': 'P12345',
  'name': 'Android Warhol T-Shirt',
  'brand': 'Google',
  'category': 'Apparel/T-Shirts',
  'variant': 'Black',
  'position': 1
});
```

Adding a product using Snowplow:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addEnhancedEcommerceProductContext', {
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  quantity: 1
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
addEnhancedEcommerceProductContext({
  id: 'P12345',
  name: 'Android Warhol T-Shirt',
  list: 'Search Results',
  brand: 'Google',
  category: 'Apparel/T-Shirts',
  variant: 'Black',
  quantity: 1
});
```

  </TabItem>
</Tabs>

### Promo

Use the `addEnhancedEcommercePromoContext` method to add a GA Enhanced Ecommerce Promotion Field Context:

| **Name**   | **Required?** | **Type** |
| ---------- | ------------- | -------- |
| `id`       | Yes           | string   |
| `name`     | No            | string   |
| `creative` | No            | string   |
| `position` | No            | string   |
| `currency` | No            | string   |

Adding a promotion using Google Analytics:

```javascript
ga('ec:addPromo', {
  'id': 'PROMO_1234',
  'name': 'Summer Sale',
  'creative': 'summer_banner2',
  'position': 'banner_slot1'
});
```

Adding a promotion using Snowplow:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addEnhancedEcommercePromoContext', {
  id: 'PROMO_1234', // The Promotion ID
  name: 'Summer Sale', // The name
  creative: 'summer_banner2', // The name of the creative
  position: 'banner_slot1' // The position
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
addEnhancedEcommercePromoContext({
  id: 'PROMO_1234', // The Promotion ID
  name: 'Summer Sale', // The name
  creative: 'summer_banner2', // The name of the creative
  position: 'banner_slot1' // The position
});
```

  </TabItem>
</Tabs>
