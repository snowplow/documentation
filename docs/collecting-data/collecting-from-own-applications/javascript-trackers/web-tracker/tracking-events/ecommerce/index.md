---
title: "Ecommerce"
sidebar_position: 70
---

# Snowplow ecommerce tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This plugin is the recommended way to track ecommerce events on your store. Functions, usage and a complete setup journey is showcased on the [E-commerce Web Accelerator](https://docs.snowplow.io/accelerators/ecommerce/).

It provides several `trackX` methods, which each create a Snowplow ecommerce action event with the appropriate entities attached. The event itself has only one property, an enum describing the ecommerce action taken e.g. "add_to_cart". View the schema [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2). All the provided data is sent in context entities.

There are also two context entities that can be globally configured: ecommerce page and ecommerce user.

:::note
The plugin is available since version 3.8 of the tracker.
:::

Snowplow ecommerce events and entities must be **manually tracked**.

## Install plugin

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

| Tracker Distribution | Included |
|----------------------|----------|
| `sp.js`              | ✅        |
| `sp.lite.js`         | ❌        |

**Download:**

<table><tbody><tr><td>Download from GitHub Releases (Recommended)</td><td><a href="https://github.com/snowplow/snowplow-javascript-tracker/releases">Github Releases (plugins.umd.zip)</a></td></tr><tr><td>Available on jsDelivr</td><td><a href="https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@latest/dist/index.umd.min.js">jsDelivr</a> (latest)</td></tr><tr><td>Available on unpkg</td><td><a href="https://unpkg.com/@snowplow/browser-plugin-snowplow-ecommerce@latest/dist/index.umd.min.js">unpkg</a> (latest)</td></tr></tbody></table>

```javascript
window.snowplow(
    'addPlugin',
    'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@latest/dist/index.umd.min.js',
    ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']
);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

- `npm install @snowplow/browser-plugin-snowplow-ecommerce`
- `yarn add @snowplow/browser-plugin-snowplow-ecommerce`
- `pnpm add @snowplow/browser-plugin-snowplow-ecommerce`

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowEcommercePlugin } from '@snowplow/browser-plugin-snowplow-ecommerce';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ SnowplowEcommercePlugin() ],
});
```

  </TabItem>
</Tabs>

## Events

API                     | Used for:
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------
`trackProductView`      | Tracking a visit to a product page. Known also as product detail view.
`trackAddToCart`        | Track an addition to cart.
`trackRemoveFromCart`   | Track a removal from cart.
`trackProductListView`  | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.
`trackProductListClick` | Track the click/selection of a product from a product list.
`trackPromotionView`    | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.
`trackPromotionClick`   | Track the click/selection of an internal promotion.
`trackCheckoutStep`     | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel.
`trackTransaction`      | Track a transaction/purchase completion.
`trackRefund`           | Track a transaction partial or complete refund.
`trackTransactionError` | Track an error happening during a transaction process.

### Product view

To track a product view you can use the `trackProductView` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackProductView:{trackerName}", {
    id: "12345",
    name: "Baseball T",
    brand: "Snowplow",
    category: "apparel",
    price: 200,
    currency: "USD",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackProductView } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackProductView({
    id: "12345",
    name: "Baseball T",
    brand: "Snowplow",
    category: "apparel",
    price: 200,
    currency: "USD",
});
```

  </TabItem>
</Tabs>

### Add to cart

To track a product/s addition to the cart you can use the `trackAddToCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackAddToCart:{trackerName}", {
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      currency: "USD",
    },
  ],
  total_value: 200,
  currency: "USD",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackAddToCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackAddToCart({
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      currency: "USD",
    },
  ],
  total_value: 200,
  currency: "USD",
});
```

  </TabItem>
</Tabs>

- Where `products` is an array with the product/s added to cart.
- Where `total_value` is the value of the cart after the addition.
- Where `currency` is the currency of the cart.

### Remove from cart

To track a product/s removal from the cart you can use the `trackRemoveFromCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackRemoveFromCart:{trackerName}", {
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      currency: "USD",
    },
  ],
  total_value: 0,
  currency: "USD",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackRemoveFromCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackRemoveFromCart({
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      currency: "USD",
    },
  ],
  total_value: 0,
  currency: "USD",
});
```

  </TabItem>
</Tabs>

- Where `products` is an array with the product/s removed from the cart.
- Where `total_value` is the value of the cart after the removal of the product/s.
- Where `currency` is the currency of the cart.

### Product list view

To track a product list view you can use the `trackProductListView` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackProductListView:{trackerName}", {
  products: [
    {
      id: "P123",
      name: "Fashion red",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 100,
      inventory_status: "in stock",
      currency: "USD",
      position: 1,
    },
    {
      id: "P124",
      name: "Fashion green",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 119,
      inventory_status: "in stock",
      currency: "USD",
      position: 2,
    },
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      position: 3,
    },
  ],
  name: "Recommended Products",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackProductListView } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackProductListView({
  products: [
    {
      id: "P123",
      name: "Fashion red",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 100,
      inventory_status: "in stock",
      currency: "USD",
      position: 1,
    },
    {
      id: "P124",
      name: "Fashion green",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 119,
      inventory_status: "in stock",
      currency: "USD",
      position: 2,
    },
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      position: 3,
    },
  ],
  name: "Recommended Products",
});
```

  </TabItem>
</Tabs>

- Where `products` is an array of products being viewed from the list.
- Where `name` is the name of the list being viewed. For the list names, you can use any kind of friendly name or a codified language to express the labeling of the list. E.g. 'Shoes - Men - Sneakers','Search results: "unisex shoes"', 'Product page upsells'

### Product list click

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackProductListClick:{trackerName}", {
  product: {
    id: "P124",
    name: "Fashion green",
    brand: "Snowplow",
    category: "Mens/Apparel",
    price: 119,
    inventory_status: "in stock",
    currency: "USD",
    position: 2,
  },
  name: "Recommended Products",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackProductListClick } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackProductListClick({
  product: {
    id: "P124",
    name: "Fashion green",
    brand: "Snowplow",
    category: "Mens/Apparel",
    price: 119,
    inventory_status: "in stock",
    currency: "USD",
    position: 2,
  },
  name: "Recommended Products",
});
```

  </TabItem>
</Tabs>

- Where `product` is the product being clicked/selected from the list.
- Where `name` is the name of the list the product is currently in. For the list names, you can use any kind of friendly name or a codified language to express the labeling of the list. E.g. 'Shoes - Men - Sneakers','Search results: "unisex shoes"', 'Product page upsells'

### Promotion view

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
/* Carousel slide 1 viewed */
window.snowplow("trackPromotionView:{trackerName}", { 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 1,
    product_ids: ['P1234'],
});

/* On carousel slide 2 view */
window.snowplow("trackPromotionView:{trackerName}", { 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 2,
    product_ids: ['P1235'],
});
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackPromotionView } from '@snowplow/browser-plugin-snowplow-ecommerce';

/* Carousel slide 1 viewed */
trackPromotionView({ 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 1,
    product_ids: ['P1234'],
});

/* On carousel slide 2 view */
trackPromotionView({ 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 2,
    product_ids: ['P1235'],
});
```


  </TabItem>
</Tabs>

### Promotion click

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackPromotionClick:{trackerName}", { 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 1,
    product_ids: ['P1234'],
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackPromotionClick } from "@snowplow/browser-plugin-snowplow-ecommerce";

trackPromotionClick({ 
    id: 'IP1234',
    name: 'promo_winter',
    type: 'carousel',
    position: 1,
    product_ids: ['P1234'],
});
```

  </TabItem>
</Tabs>

### Checkout step

To track a checkout step you can use the `trackCheckoutStep` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
/* Step 1 - Account type selection */
window.snowplow("trackCheckoutStep:{trackerName}", {
  step: 1,
  account_type: "guest checkout",
});

/* Step 2 - Billing options selection */
window.snowplow("trackCheckoutStep:{trackerName}", {
  step: 2,
  payment_method: "credit card",
  proof_of_payment: "invoice",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackCheckoutStep } from '@snowplow/browser-plugin-snowplow-ecommerce';

/* Step 1 - Account type selection */
trackCheckoutStep({
  step: 1,
  account_type: "guest checkout",
});

/* Step 2 - Billing options selection */
trackCheckoutStep({
  step: 2,
  payment_method: "credit card",
  proof_of_payment: "invoice",
});
```

  </TabItem>
</Tabs>

### Transaction

To track a completed transaction you can use the `trackTransaction` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackTransaction:{trackerName}", {
  transaction_id: "T12345",
  revenue: 230,
  currency: "USD",
  payment_method: "credit_card",
  total_quantity: 1,
  tax: 20,
  shipping: 10,
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      quantity: 1,
    },
  ],
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackTransaction } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackTransaction({
  transaction_id: "T12345",
  revenue: 230,
  currency: "USD",
  payment_method: "credit_card",
  total_quantity: 1,
  tax: 20,
  shipping: 10,
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      quantity: 1,
    },
  ],
});
```

  </TabItem>
</Tabs>

- Where `products` is an array with the product/s taking part in the transaction.

### Refund

:::note
Available from version 3.10.
:::

To track a complete or partial refund you can use the `trackRefund` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackRefund:{trackerName}", {
  transaction_id: "T12345",
  currency: "USD",
  refund_amount: 200,
  refund_reason: "return",
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      quantity: 1,
    },
  ],
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackRefund } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackRefund({
  transaction_id: "T12345",
  currency: "USD",
  refund_amount: 200,
  refund_reason: "return",
  products: [
    {
      id: "P125",
      name: "Baseball T",
      brand: "Snowplow",
      category: "Mens/Apparel",
      price: 200,
      inventory_status: "in stock",
      currency: "USD",
      quantity: 1,
    },
  ],
});
```

  </TabItem>
</Tabs>

- Where `products` is an array with the product/s taking part in the refund.

### Transaction error

:::note
Available from version 3.13.
:::

To track an error happening during a transaction process you can use the `trackTransactionError` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackTransactionError:{trackerName}", {
  resolution: "rejection",
  error_code: "E123",
  error_shortcode: "CARD_DECLINE",
  error_description: "Card has been declined by the issuing bank.",
  error_type: "hard",
  transaction: {
    revenue: 45,
    currency: "EUR",
    transaction_id: "T12345",
    payment_method: "card",
    total_quantity: 1
  }
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackTransactionError } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackTransactionError({
  resolution: "rejection",
  error_code: "E123",
  error_shortcode: "CARD_DECLINE",
  error_description: "Card has been declined by the issuing bank.",
  error_type: "hard",
  transaction: {
    revenue: 45,
    currency: "EUR",
    transaction_id: "T12345",
    payment_method: "card",
    total_quantity: 1
  }
});
```
  </TabItem>
</Tabs>


- Where `transaction` is the transaction entity being processed.

## Page and user entities

Once set, the ecommerce page or user context entity will be attached to **all* subsequent Snowplow events.

### Page type

To set a Page type context entity you can use the `setPageType` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("setPageType:{trackerName}", { type, language, locale });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { setPageType } from '@snowplow/browser-plugin-snowplow-ecommerce';

setPageType({ type, language, locale });
```

  </TabItem>
</Tabs>

After setting the Page context entity, it will be attached to every subsequent Snowplow event.

An ecommerce page entity can have the following attributes:

| attribute |   type   |                                    description                                    | required |
|:---------:|:--------:|:---------------------------------------------------------------------------------:|:--------:|
|   type    | `string` | The type of the page that was visited E.g. homepage, product page, checkout page. |    ✅     |
| language  | `string` |                    The language that the web page is based in.                    |    ✘     |
|  locale   | `string` |                  The locale version of the site that is running.                  |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/page/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Ecommerce user

To set an Ecommerce User context entity you can use the `setEcommerceUser` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("setEcommerceUser:{trackerName}", { id, is_guest, email });
```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { setEcommerceUser } from '@snowplow/browser-plugin-snowplow-ecommerce';

setEcommerceUser({ id, is_guest, email });
```

  </TabItem>
</Tabs>

After setting the User context entity, it will be attached to every subsequent Snowplow event.

An ecommerce user entity can have the following attributes:

| attribute |   type    |             description             | required |
|:---------:|:---------:|:-----------------------------------:|:--------:|
|    id     | `string`  |            The user ID.             |    ✅     |
| is_guest  | `boolean` | Whether or not the user is a guest. |    ✘     |
|   email   | `string`  |      The user's email address.      |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/user/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

## Automatically generated entities

All the provided data is sent as context entities attached to the generic Snowplow ecommerce action event. For example, tracking a product view results in an ecommerce action event (type "product_view") with one product entity attached. 

### Product

Whenever there is a product entity involved in the ecommerce interaction event, the `product` or array of `products` can have the following attributes:

|    attribute     |   type   |                                                                           description                                                                           | required |
|:----------------:|:--------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|
|        id        | `string` |                                                                       SKU or product ID.                                                                        |    ✅     |
|     currency     | `string` |                                                    Currency in which the product is being priced (ISO 4217).                                                    |    ✅     |
|      price       | `number` |                                                            Price of the product at the current time.                                                            |    ✅     |
|       name       | `string` |                                                                  Name or title of the product.                                                                  |    ✘     |
|     category     | `string` | Category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers. The number of levels is defined by the user. |    ✘     |
|    list_price    | `number` |                                                             Recommended or list price of a product.                                                             |    ✘     |
|     quantity     | `number` |                                            Quantity of the product taking part in the action. Used for Cart events.                                             |    ✘     |
|       size       | `string` |                                                              Size of the product. E.g. XL, XS, M.                                                               |    ✘     |
|     variant      | `string` |                                                        Variant of the product. E.g. Red, Heavy, Leather.                                                        |    ✘     |
|      brand       | `string` |                                                                      Brand of the product.                                                                      |    ✘     |
| inventory_status | `string` |                                       Inventory status of the product. E.g. in stock, out of stock, preorder, backorder.                                        |    ✘     |
|     position     | `number` |                                     Position the product was presented in a list of products. Used in Product List events.                                      |    ✘     |
|   creative_id    | `string` |                                            Identifier/Name/Url for the creative presented on a list or product view.                                            |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Internal promotion

On internal promotion events, an internal promotion can have the following attributes:

|  attribute  |    type    |                                                     description                                                      | required |
|:-----------:|:----------:|:--------------------------------------------------------------------------------------------------------------------:|:--------:|
|     id      |  `string`  |                                  The unique ID representing this promotion element.                                  |    ✅     |
|    name     |  `string`  |                                    The friendly name for this promotion element.                                     |    ✘     |
| product_ids | `string[]` |                         An array of SKUs or product IDs showcased in this promotion element.                         |    ✘     |
|  position   | `integer`  |            The position this promotion element was presented in a list of promotions E.g. banner, slider.            |    ✘     |
| creative_id |  `string`  |                      Identifier/Name/Url for the creative presented on this promotion element.                       |    ✘     |
|    type     |  `string`  |                   The type of the promotion delivery mechanism. E.g. popup, banner, intra-content.                   |    ✘     |
|    slot     |  `string`  | The website slot in which the promotional content was added to. E.g. Identifier for slot sidebar-1, intra-content-2. |    ✘     |


<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/promotion/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Cart

On cart interaction ecommerce events, a cart can have the following attributes:

|  attribute  |   type   |                     description                     | required |
|:-----------:|:--------:|:---------------------------------------------------:|:--------:|
| total_value | `number` | The total value of the cart after this interaction. |    ✅     |
|  currency   | `string` |     The currency used for this cart (ISO 4217).     |    ✅     |
|   cart_id   | `string` |        The unique ID representing this cart.        |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Checkout step

Whenever there is a checkout entity involved in the ecommerce interaction event, it can have the following attributes:

|       attribute       |   type    |                                                       description                                                       | required |
|:---------------------:|:---------:|:-----------------------------------------------------------------------------------------------------------------------:|:--------:|
|         step          | `number`  |                                                  Checkout step index.                                                   |    ✅     |
|   shipping_postcode   | `string`  |                                               Shipping address postcode.                                                |    ✘     |
|   billing_postcode    | `string`  |                                                Billing address postcode.                                                |    ✘     |
| shipping_full_address | `string`  |                                                 Full shipping address.                                                  |    ✘     |
| billing_full_address  | `string`  |                                                  Full billing address.                                                  |    ✘     |
|   delivery_provider   | `string`  |                               Can be used to discern delivery providers DHL, PostNL etc.                                |    ✘     |
|    delivery_method    | `string`  | Can be used to discern delivery methods selected E.g. store pickup, standard delivery, express delivery, international. |    ✘     |
|      coupon_code      | `string`  |                                               Coupon applied at checkout.                                               |    ✘     |
|     account_type      | `string`  |                              Type of account used on checkout. E.g. existing user, guest.                               |    ✘     |
|    payment_method     | `string`  |                 Any kind of payment method the user selected to proceed E.g. card, PayPal, Alipay etc.                  |    ✘     |
|   proof_of_payment    | `string`  |                                                   Invoice or receipt.                                                   |    ✘     |
|   marketing_opt_in    | `boolean` |                                           If opted in to marketing campaigns.                                           |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Transaction

Whenever there is a transaction entity involved in the ecommerce interaction event, it can have the following attributes:

|    attribute    |   type    |                    description                    | required |
|:---------------:|:---------:|:-------------------------------------------------:|:--------:|
| transaction_id  | `string`  |             The ID of the transaction             |    ✅     |
|    currency     | `string`  | The currency used for the transaction (ISO 4217). |    ✅     |
|     revenue     | `number`  |          The revenue of the transaction.          |    ✅     |
| payment_method  | `string`  |   The payment method used for the transaction.    |    ✅     |
| total_quantity  | `number`  |    Total quantity of items in the transaction.    |    ✅     |
|       tax       | `number`  |      Total amount of tax on the transaction.      |    ✘     |
|    shipping     | `number`  |    Total cost of shipping on the transaction.     |    ✘     |
|  discount_code  | `string`  |                Discount code used.                |    ✘     |
| discount_amount | `number`  |            Discount amount taken off.             |    ✘     |
|  credit_order   | `boolean` | Whether the transaction is a credit order or not. |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Refund

Whenever there is a refund entity involved in the ecommerce interaction event, it can have the following attributes:

|   attribute    |   type   |                    description                    | required |
|:--------------:|:--------:|:-------------------------------------------------:|:--------:|
| transaction_id | `string` |             The ID of the transaction             |    ✅     |
|    currency    | `string` | The currency used for the transaction (ISO 4217). |    ✅     |
| refund_amount  | `number` |     The amount refunded from the transaction.     |    ✅     |
| refund_reason  | `string` |       The reason that resulted in a refund.       |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Transaction error

Whenever there is a transaction error entity involved in the ecommerce interaction event, it can have the following attributes:

|     attribute     |     type      |                                                                                                                       description                                                                                                                        | required |
|:-----------------:|:-------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------:|
|    error_code     |   `string`    |                                                                                               Error-identifying code for the transaction issue. E.g. E522                                                                                                |    ✘     |
|  error_shortcode  |   `string`    |                                                      Shortcode for the error occurred in the transaction. E.g. declined_by_stock_api, declined_by_payment_method, card_declined, pm_card_radarBlock                                                      |    ✘     |
| error_description |   `number`    |                                                                                              Longer description for the error occurred in the transaction.                                                                                               |    ✘     |
|    error_type     | `Enum string` | Either `'hard'` or `'soft'`. Hard error types mean the customer must provide another form of payment e.g. an expired card. Soft errors can be the result of temporary issues where retrying might be successful e.g. processor declined the transaction. |    ✘     |
|    resolution     |   `string`    |                                                                The resolution selected for the error scenario. E.g. retry_allowed, user_blacklisted, block_gateway, contact_user, default                                                                |    ✘     |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/transaction_error/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

## GA4/UA Ecommerce transitional API

:::note
Available from version 3.10.
:::

If you already use Google Analytics 4 ecommerce or Universal Analytics Enhanced Ecommerce to collect information about the shopping behavior of your users, we have prepared a way to quickly implement Snowplow Ecommerce without making many changes on your current setup.

The _transitional_ API that we provide, depends on the standardized [dataLayer](https://developers.google.com/tag-platform/tag-manager/web/datalayer) structure for both Google Analytics ecommerce implementations. This would make it easier for the transition to happen either through Google Tag Manager, which has more control over the dataLayer, or custom code that uses the standard ecommerce structures. 

:::info
To learn more about how to use this transitional API, you should go ahead and visit our [Ecommerce Web Accelerator](https://docs.snowplow.io/accelerators/ecommerce/tracking/ua_ga4_migration/) dedicated page which describes the usage of these methods and more.
:::

### Universal Analytics Enhanced Ecommerce

The standard Universal Analytics Enhanced Ecommerce implementation is based on the official [guide reference](https://developers.google.com/analytics/devguides/collection/ua/gtm/enhanced-ecommerce).

**Important:** The `dataLayer.currencyCode` attribute must be available for all product interactions. Otherwise, almost all methods accept an `Options` object which can include the currency code as follows:

```ts
method({{dataLayer.ecommerce reference}} , { currency: "currency code" });
```

#### trackEnhancedEcommerceProductListView

To track an Enhanced Ecommerce product list view, you can use the `trackEnhancedEcommerceProductListView` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceProductListView:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceProductListView } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceProductListView({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackEnhancedEcommerceProductListClick

To track an Enhanced Ecommerce product list click, you can use the `trackEnhancedEcommerceProductListClick` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceProductListClick:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceProductListClick } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceProductListClick({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackEnhancedEcommerceProductDetail

To track an Enhanced Ecommerce product detail view, you can use the `trackEnhancedEcommerceProductDetail` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceProductDetail:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceProductDetail } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceProductDetail({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackEnhancedEcommercePromoView

To track an Enhanced Ecommerce internal promotion view, you can use the `trackEnhancedEcommercePromoView` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommercePromoView:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommercePromoView } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommercePromoView({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackEnhancedEcommercePromoClick

To track an Enhanced Ecommerce internal promotion click, you can use the `trackEnhancedEcommercePromoClick` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommercePromoClick:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommercePromoClick } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommercePromoClick({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackEnhancedEcommerceAddToCart

To track an Enhanced Ecommerce add to cart event, you can use the `trackEnhancedEcommerceAddToCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceAddToCart:{trackerName}", {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceAddToCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceAddToCart( {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
</Tabs>

- Where `finalCartValue` is the value of the cart after the addition.

#### trackEnhancedEcommerceRemoveFromCart

To track an Enhanced Ecommerce remove from cart event, you can use the `trackEnhancedEcommerceRemoveFromCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceRemoveFromCart:{trackerName}", {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceRemoveFromCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceRemoveFromCart( {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
</Tabs>

- Where `finalCartValue` is the value of the cart after the removal.

#### trackEnhancedEcommerceCheckoutStep

To track an Enhanced Ecommerce remove from cart event, you can use the `trackEnhancedEcommerceCheckoutStep` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommerceCheckoutStep:{trackerName}", {{dataLayer.ecommerce reference}}, {
    checkoutOption: { delivery_method: "express_delivery" },
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommerceCheckoutStep } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommerceCheckoutStep( {{dataLayer.ecommerce reference}}, {
    checkoutOption: { delivery_method: "express_delivery" },
});
```

  </TabItem>
</Tabs>

- Where `checkoutOption` is a key value pair object of available [Snowplow checkout options](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/checkout_step), except `step` which is retrieved from the dataLayer directly.

#### trackEnhancedEcommercePurchase

To track an Enhanced Ecommerce remove from cart event, you can use the `trackEnhancedEcommercePurchase` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackEnhancedEcommercePurchase:{trackerName}", {{dataLayer.ecommerce reference}}, {
    paymentMethod: "bank_transfer",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackEnhancedEcommercePurchase } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackEnhancedEcommercePurchase( {{dataLayer.ecommerce reference}}, {
    paymentMethod: "bank_transfer",
});
```

  </TabItem>
</Tabs>

- Where `paymentMethod` is the payment method selected in this transaction. This attributes corresponds to the `payment_method` of the [transaction schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0#L30). Defaults to `unknown`. 

### Google Analytics 4 Ecommerce

The Google Analytics 4 ecommerce implementation is based on the official [guide reference](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm).

**Important:** The `dataLayer.ecommerce.currency` attribute must be available for all product interactions. Otherwise, almost all methods accept an `Options` object which can include the currency code as follows:

```ts
method( {{dataLayer.ecommerce reference}} , { currency: "currency code" });
```

#### trackGA4ViewItemList

To track an GA4 Ecommerce item list view, you can use the `trackGA4ViewItemList` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4ViewItemList:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4ViewItemList } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4ViewItemList({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackGA4SelectItem

To track an GA4 Ecommerce item selection from a list, you can use the `trackGA4SelectItem` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4SelectItem:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4SelectItem } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4SelectItem({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackGA4ViewItem

To track an GA4 Ecommerce item view, you can use the `trackGA4ViewItem` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4ViewItem:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4ViewItem } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4ViewItem({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackGA4ViewPromotion

To track an GA4 Ecommerce internal promotion view, you can use the `trackGA4ViewPromotion` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4ViewPromotion:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4ViewPromotion } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4ViewPromotion({{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackGA4SelectPromotion

To track an GA4 Ecommerce internal promotion selection, you can use the `trackGA4SelectPromotion` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4SelectPromotion:{trackerName}", {{dataLayer.ecommerce reference}});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4SelectPromotion } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4SelectPromotion( {{dataLayer.ecommerce reference}});
```

  </TabItem>
</Tabs>

#### trackGA4AddToCart

To track an GA4 Ecommerce add to cart event, you can use the `trackGA4AddToCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4AddToCart:{trackerName}", {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4AddToCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4AddToCart( {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
</Tabs>

- Where `finalCartValue` is the value of the cart after the addition.

#### trackGA4RemoveFromCart

To track an GA4 Ecommerce remove from cart event, you can use the `trackGA4RemoveFromCart` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4RemoveFromCart:{trackerName}", {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4RemoveFromCart } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4RemoveFromCart( {{dataLayer.ecommerce reference}}, {
    finalCartValue: 20,
});
```

  </TabItem>
</Tabs>

- Where `finalCartValue` is the value of the cart after the removal.

#### trackGA4BeginCheckout

To track an GA4 Ecommerce checkout beginning, you can use the `trackGA4BeginCheckout` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4BeginCheckout:{trackerName}", {
    step: 1,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4BeginCheckout } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4BeginCheckout({
    step: 1,
});
```

  </TabItem>
</Tabs>

- Where `step` is a number representing the step of the checkout funnel. Defaults to 1, mimicking the `begin_checkout` GA4 event.

#### trackGA4AddShippingInfo

To track an GA4 Ecommerce checkout shipping info step completion, you can use the `trackGA4AddShippingInfo` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4AddShippingInfo:{trackerName}", {
    step: 1,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4AddShippingInfo } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4AddShippingInfo({
    step: 1,
});
```

  </TabItem>
</Tabs>

- Where `step` is a number representing the step of the checkout funnel.

#### trackGA4AddPaymentOptions

To track an GA4 Ecommerce checkout payment option step completion, you can use the `trackGA4AddPaymentOptions` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4AddPaymentOptions:{trackerName}", {
    step: 1,
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4AddPaymentOptions } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4AddPaymentOptions({
    step: 1,
});
```

  </TabItem>
</Tabs>

- Where `step` is a number representing the step of the checkout funnel.

#### trackGA4Transaction

To track an GA4 Ecommerce checkout payment option step completion, you can use the `trackGA4Transaction` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```js
window.snowplow("trackGA4Transaction:{trackerName}", {
    paymentMethod: "bank_transfer",
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```js
import { trackGA4Transaction } from '@snowplow/browser-plugin-snowplow-ecommerce';

trackGA4Transaction({
    paymentMethod: "bank_transfer",
});
```

  </TabItem>
</Tabs>

- Where `paymentMethod` is the payment method selected in this transaction. This attributes corresponds to the `payment_method` of the [transaction schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0#L30). Defaults to `unknown`. 
