---
title: "Original"
description: "Track original ecommerce events using web trackers v3 for behavioral commerce analytics."
schema: "TechArticle"
keywords: ["Web V3 Original", "Original Ecommerce", "Legacy Ecommerce", "Traditional Commerce", "Old Commerce", "Classic Ecommerce"]
sidebar_position: 70
---

# Ecommerce tracking (original)

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::tip
This plugin has been superseded by the [Snowplow ecommerce plugin](../index.md). We highly recommend using this newer plugin, which is more fully featured and allows you to use the DBT model we provide.
:::

The original Ecommerce plugin is modeled on Google Analytics ecommerce tracking capability. Snowplow uses three methods that have to be used together to track online transactions:

1. **Create a transaction object**. Use `addTrans()` method to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Add items to the transaction.** Use the `addItem()` method to add data about each individual item to the transaction object.
3. **Submit the transaction to Snowplow** using the `trackTrans()` method, once all the relevant data has been loaded into the object.

Original ecommerce events must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
| -------------------- | -------- |
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table className="has-fixed-layout"><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases" target="_blank" rel="noreferrer noopener">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ecommerce@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-ecommerce@3/dist/index.umd.min.js" target="_blank" rel="noreferrer noopener">unpkg</a> (latest)</td></tr></tbody></table>

**Note:** The links to the CDNs above point to the current latest version. You should pin to a specific version when integrating this plugin on your website if you are using a third party CDN in production.

```javascript
window.snowplow('addPlugin',
  "https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-ecommerce@3/dist/index.umd.min.js",
  ["snowplowEcommerce", "EcommercePlugin"]
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-ecommerce`
- `yarn add @snowplow/browser-plugin-ecommerce`
- `pnpm add @snowplow/browser-plugin-ecommerce`

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { EcommercePlugin, addTrans, addItem, trackTrans } from '@snowplow/browser-plugin-ecommerce';

newTracker('sp1', '{{collector_url}}', {
   appId: 'my-app-id',
   plugins: [ EcommercePlugin() ],
});
```

  </TabItem>
</Tabs>

## Transaction event

Three different event types are included in this plugin: Transaction (`trackTrans()`), Add-to-cart (`trackAddToCart()`), and Remove-from-cart (`trackRemoveFromCart()`).

The transaction object must be created first, using `addTrans()`. Add items with `addItem()`, and finally track the event with `trackTrans()`.

### `addTrans`

The `addTrans` method creates a transaction object. It takes nine possible parameters, two of which are required:

| **Parameter** | **Description**                                      | **Required?** | **Example value** |
| ------------- | ---------------------------------------------------- | ------------- | ----------------- |
| `orderId`     | Internal unique order id number for this transaction | Yes           | '1234'            |
| `affiliation` | Partner or store affiliation                         | No            | 'Womens Apparel'  |
| `total`       | Total amount of the transaction                      | Yes           | '19.99'           |
| `tax`         | Tax amount of the transaction                        | No            | '1.00'            |
| `shipping`    | Shipping charge for the transaction                  | No            | '2.99'            |
| `city`        | City to associate with transaction                   | No            | 'San Jose'        |
| `state`       | State or province to associate with transaction      | No            | 'California'      |
| `country`     | Country to associate with transaction                | No            | 'USA'             |
| `currency`    | Currency to associate with this transaction          | No            | 'USD'             |

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addTrans', {
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing',
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

This is part of the `@snowplow/browser-plugin-ecommerce` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-ecommerce@3` and then initialize it:

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { EcommercePlugin } from '@snowplow/browser-plugin-ecommerce';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [ EcommercePlugin() ]
});
```

Used like this for the first step:

```javascript
import { addTrans } from '@snowplow/browser-plugin-ecommerce'

addTrans({
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing',
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
});
```

  </TabItem>
</Tabs>

`addTrans` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

### `addItem`

The `addItem` method is used to capture the details of each product item included in the transaction. It should therefore be called once for each item.

There are six potential parameters that can be passed with each call, four of which are required:

| **Parameter** | **Description**                                    | **Required?**                                       | **Example value** |
| ------------- | -------------------------------------------------- | --------------------------------------------------- | ----------------- |
| `orderId`     | Order ID of the transaction to associate with item | Yes                                                 | '1234'            |
| `sku`         | Item's SKU code                                    | Yes                                                 | 'pbz0001234'      |
| `name`        | Product name                                       | No, but advisable (to make interpreting SKU easier) | 'Black Tarot'     |
| `category`    | Product category                                   | No                                                  | 'Large'           |
| `price`       | Product price                                      | Yes                                                 | 9.99              |
| `quantity`    | Purchase quantity                                  | Yes                                                 | 1                 |
| `currency`    | Product price currency                             | No                                                  | 'USD'             |

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('addItem', {
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { addItem } from '@snowplow/browser-plugin-ecommerce'

addItem({
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
});
```

  </TabItem>
</Tabs>

`addItem` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

### `trackTrans`

Once the transaction object has been created (using `addTrans`) and the relevant item data added to it using the `addItem` method, we are ready to send the data to the collector. This is initiated using the `trackTrans` method:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackTrans');
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackTrans } from '@snowplow/browser-plugin-ecommerce';

trackTrans();
```

  </TabItem>
</Tabs>

### Example

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```html
<html>
<head>
<title>Receipt for your clothing purchase from Acme Clothing</title>
<script type="text/javascript">

  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  snowplow('newTracker', 'sp', '{{collector_url_here}}', { appId: 'my-store' });
  snowplow('enableActivityTracking',{
    minimumVisitLength: 30,
    heartbeatDelay: 10
  });
  snowplow('trackPageView');
  snowplow('enableLinkClickTracking');

  snowplow('addTrans', {
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing',
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
  });

   // add item might be called for every item in the shopping cart
   // where your ecommerce engine loops through each item in the cart and
   // prints out _addItem for each
  snowplow('addItem', {
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
  });

  // trackTrans sends the transaction to Snowplow tracking servers.
  // Must be called last to commit the transaction.
  snowplow('trackTrans'); //submits transaction to the collector

</script>
</head>
<body>

  Thank you for your order.  You will receive an email containing all your order details.

</body>
</html>
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { EcommercePlugin, addTrans, addItem, trackTrans } from '@snowplow/browser-plugin-ecommerce';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [ EcommercePlugin() ]
});

addTrans({
    orderId: '1234',  // required
    total: 11.99,   // required
    affiliation: 'Acme Clothing',
    tax: 1.29,
    shipping: 5,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD'
});

// add item might be called for every item in the shopping cart
// where your ecommerce engine loops through each item in the cart and
// prints out _addItem for each
addItem({
    orderId: '1234', // required
    sku: 'DD44',     // required
    name: 'T-Shirt',
    category: 'Green Medium',
    price: 11.99,
    quantity: 1,
    currency: 'USD'
});

// trackTrans sends the transaction to Snowplow tracking servers.
// Must be called last to commit the transaction.
trackTrans();
```

  </TabItem>
</Tabs>

## Add to cart & remove from cart events

These methods are also part of `@snowplow/browser-plugin-ecommerce` and let you track users adding and removing items from a cart on an ecommerce site. Their arguments are identical:

| **Name**    | **Required?** | **Description**                        | **Type** |
| ----------- | ------------- | -------------------------------------- | -------- |
| `sku`       | Yes           | Item SKU                               | string   |
| `name`      | No            | Item name                              | string   |
| `category`  | No            | Item category                          | string   |
| `unitPrice` | Yes           | Item price                             | number   |
| `quantity`  | Yes           | Quantity added to or removed from cart | number   |
| `currency`  | No            | Item price currency                    | string   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackAddToCart', {
  sku: '000345',
  name: 'blue tie',
  category: 'clothing',
  unitPrice: 3.49,
  quantity: 2,
  currency: 'GBP'
});

snowplow('trackRemoveFromCart', {
  sku: '000345',
  name: 'blue tie',
  category: 'clothing',
  unitPrice: 3.49,
  quantity: 2,
  currency: 'GBP'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackAddToCart, trackRemoveFromCart } from '@snowplow/browser-plugin-ecommerce';

trackAddToCart({
  sku: '000345',
  name: 'blue tie',
  category: 'clothing',
  unitPrice: 3.49,
  quantity: 2,
  currency: 'GBP'
});

trackRemoveFromCart({
  sku: '000345',
  name: 'blue tie',
  category: 'clothing',
  unitPrice: 3.49,
  quantity: 2,
  currency: 'GBP'
});
```
  </TabItem>
</Tabs>

Both methods are implemented as Snowplow self describing events. You can see schemas for the [`add_to_cart`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0) and [`remove_from_cart`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/remove_from_cart/jsonschema/1-0-0) events.
