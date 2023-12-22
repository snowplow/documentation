---
title: "Ecommerce"
sidebar_position: 70
---

# Ecommerce tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This feature is modeled on Google Analytics ecommerce tracking capability, Snowplow uses three methods that have to be used together to track online transactions:

1. **Create a transaction object**. Use `addTrans()` method to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Add items to the transaction.** Use the `addItem()` method to add data about each individual item to the transaction object.
3. **Submit the transaction to Snowplow** using the trackTrans() method, once all the relevant data has been loaded into the object.

#### `addTrans`

The `addTrans` method creates a transaction object. It takes nine possible parameters, two of which are required:

| **Parameter** | **Description**                                      | **Required?** | **Example value** |
|---------------|------------------------------------------------------|---------------|-------------------|
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

This is part of the `@snowplow/browser-plugin-ecommerce` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-ecommerce` and then initialize it:

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
|---------------|----------------------------------------------------|-----------------------------------------------------|-------------------|
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

### trackTrans

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

### Putting the three methods together: a complete example

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

### `trackAddToCart` and `trackRemoveFromCart`

These methods are also part of `@snowplow/browser-plugin-ecommerce` and let you track users adding and removing items from a cart on an ecommerce site. Their arguments are identical:

| **Name**    | **Required?** | **Description**                        | **Type** |
|-------------|---------------|----------------------------------------|----------|
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

Both methods can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

## Enhanced Ecommerce tracking

For more information on the Enhanced Ecommerce functions please see the Google Analytics [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce).

### `addEnhancedEcommerceActionContext`

Use the `addEnhancedEcommerceActionContext` method to add a GA Enhanced Ecommerce Action Context to the Tracker:

| **Name**      | **Required?** | **Type**          |
|---------------|---------------|-------------------|
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

### `addEnhancedEcommerceImpressionContext`

Use the `addEnhancedEcommerceImpressionContext` method to add a GA Enhanced Ecommerce Impression Context to the Tracker:

| **Name**   | **Required?** | **Type**          |
|------------|---------------|-------------------|
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

### `addEnhancedEcommerceProductContext`

Use the `addEnhancedEcommerceProductContext` method to add a GA Enhanced Ecommerce Product Field Context:

| **Name**   | **Required?** | **Type**          |
|------------|---------------|-------------------|
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

### `addEnhancedEcommercePromoContext`

Use the `addEnhancedEcommercePromoContext` method to add a GA Enhanced Ecommerce Promotion Field Context:

| **Name**   | **Required?** | **Type** |
|------------|---------------|----------|
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

### `trackEnhancedEcommerceAction`

Use the `trackEnhancedEcommerceAction` method to track a GA Enhanced Ecommerce Action. When this function is called all of the added Ecommerce Contexts are attached to this action and flushed from the Tracker.

| **Name** | **Required?** | **Type** |
|----------|---------------|----------|
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
