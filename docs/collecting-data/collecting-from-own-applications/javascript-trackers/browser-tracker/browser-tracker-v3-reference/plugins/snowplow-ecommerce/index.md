---
title: "Snowplow Ecommerce"
sidebar_position: 16000
---

```mdx-code-block
import Block5966 from "@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md"
<Block5966/>
```

This plugin is the recommended way to track ecommerce events on your store. Functions, usage and a complete setup journey is showcased on the [E-commerce Web Accelerator](https://docs.snowplow.io/accelerators/ecommerce/).

## Installation

- `npm install @snowplow/browser-plugin-snowplow-ecommerce`
- `yarn add @snowplow/browser-plugin-snowplow-ecommerce`
- `pnpm add @snowplow/browser-plugin-snowplow-ecommerce`

:::note
The plugin is available since version 3.8 of the tracker.
:::

## Initialization

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SnowplowEcommercePlugin } from '@snowplow/browser-plugin-snowplow-ecommerce';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ SnowplowEcommercePlugin() ],
});
```

## Functions

API | Used for:
-- | -- 
`trackProductView` | Tracking a visit to a product page. Known also as product detail view. 
`trackAddToCart` | Track an addition to cart.
`trackRemoveFromCart` | Track a removal from cart.
`trackProductListView` | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.
`trackProductListClick` | Track the click/selection of a product from a product list.
`trackPromotionView` | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.
`trackPromotionClick` | Track the click/selection of an internal promotion.
`trackCheckoutStep` | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel.
`trackTransaction` | Track a transaction/purchase completion.
`setPageType` | Set a Page type context which would allow the analyst to discern between types of pages with ecommerce value. E.g. Category Page, Product Page, Cart Page, etc.
`setEcommerceUser` | Set a User type context with a few standard user attributes.

## Usage

### trackProductView

To track a product view you can use the `trackProductView` method with the following attributes:

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

### trackAddToCart

To track a product/s addition to the cart you can use the `trackAddToCart` method with the following attributes:

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

- Where `products` is an array with the product/s added to cart.
- Where `total_value` is the value of the cart after the addition.
- Where `currency` is the currency of the cart.

### trackRemoveFromCart

To track a product/s removal from the cart you can use the `trackRemoveFromCart` method with the following attributes:

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

- Where `products` is an array with the product/s removed from the cart.
- Where `total_value` is the value of the cart after the removal of the product/s.
- Where `currency` is the currency of the cart.

### trackProductListView

To track a product list view you can use the `trackProductListView` method with the following attributes:

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

- Where `products` is an array of products being viewed from the list.
- Where `name` is the name of the list being viewed. For the list names, you can use any kind of friendly name or a codified language to express the labeling of the list. E.g. 'Shoes - Men - Sneakers','Search results: "unisex shoes"', 'Product page upsells'

### trackProductListClick

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

- Where `product` is the product being clicked/selected from the list.
- Where `name` is the name of the list the product is currently in. For the list names, you can use any kind of friendly name or a codified language to express the labeling of the list. E.g. 'Shoes - Men - Sneakers','Search results: "unisex shoes"', 'Product page upsells'

### trackPromotionView
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

### trackPromotionClick

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

### trackCheckoutStep

To track a checkout step you can use the `trackCheckoutStep` method with the following attributes:

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

### trackTransaction

To track a completed transaction you can use the `trackTransaction` method with the following attributes:

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
    },
  ],
});
```

- Where `products` is an array with the product/s taking part in the transaction.

### setPageType

To set a Page type context you can use the `setPageType` method with the following attributes:

```js
import { setPageType } from '@snowplow/browser-plugin-snowplow-ecommerce';

setPageType({ type, language, locale });
```

After setting the Page context, it will getting attached to every consecutive Snowplow event.

### setEcommerceUser

To set an Ecommerce User context you can use the `setEcommerceUser` method with the following attributes:

```js
import { setEcommerceUser } from '@snowplow/browser-plugin-snowplow-ecommerce';

setEcommerceUser({ id, is_guest, email });
```

After setting the Page context, it will getting attached to every consecutive Snowplow event.

## Entities

Below is the set of entities and attributes that can be used in the Snowplow Ecommerce implementation.

### Ecommerce page entity

An ecommerce page entity can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| type | `string` | The type of the page that was visited E.g. homepage, product page, checkout page. | ✅ |
| language | `string` | The language that the web page is based in. | ✘ |
| locale | `string` | The locale version of the site that is running. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/page/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Ecommerce user entity

An ecommerce user entity can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| id | `string` | The user ID. | ✅ |
| is_guest | `boolean` | Whether or not the user is a guest. | ✘ |
| email | `string` | The user's email address. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/user/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Product entity

Whenever there is a product entity involved in the ecommerce interaction event, the `product` or array of `products` can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| id | `string` | SKU or product ID. | ✅ |
| currency | `string` | Currency in which the product is being priced (ISO 4217). | ✅ |
| price | `number` | Price of the product at the current time. | ✅ |
| name | `string` | Name or title of the product. | ✘ |
| category | `string` | Category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers. The number of levels is defined by the user. | ✘ |
| list_price | `number` | Recommended or list price of a product. | ✘ |
| quantity | `number` | Quantity of the product taking part in the action. Used for Cart events. | ✘ |
| size | `string` | Size of the product. E.g. XL, XS, M. | ✘ |
| variant | `string` | Variant of the product. E.g. Red, Heavy, Leather. | ✘ |
| brand | `string` | Brand of the product. | ✘ |
| inventory_status | `string` | Inventory status of the product. E.g. in stock, out of stock, preorder, backorder. | ✘ |
| position | `number` | Position the product was presented in a list of products. Used in Product List events. | ✘ |
| creative_id | `string` | Identifier/Name/Url for the creative presented on a list or product view. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/product/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Internal promotion entity

On internal promotion events, an internal promotion can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| id | `string` | The unique ID representing this promotion element. | ✅ |
| name | `string` | The friendly name for this promotion element. | ✘ |
| product_ids | `string[]` | An array of SKUs or product IDs showcased in this promotion element. | ✘ |
| position | `integer` | The position this promotion element was presented in a list of promotions E.g. banner, slider. | ✘ |
| creative_id | `string` | Identifier/Name/Url for the creative presented on this promotion element. | ✘ |
| type | `string` | The type of the promotion delivery mechanism. E.g. popup, banner, intra-content. | ✘ |
| slot | `string` | The website slot in which the promotional content was added to. E.g. Identifier for slot sidebar-1, intra-content-2. | ✘ |


<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/promotion/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Cart entity

On cart interaction ecommerce events, a cart can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| total_value | `number` | The total value of the cart after this interaction. | ✅ |
| currency | `string` | The currency used for this cart (ISO 4217). | ✅ |
| cart_id | `string` | The unique ID representing this cart. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Checkout step entity

Whenever there is a checkout entity involved in the ecommerce interaction event, it can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| step | `number` | Checkout step index. | ✅ |
| shipping_postcode | `string` | Shipping address postcode. | ✘ |
| billing_postcode | `string` | Billing address postcode. | ✘ |
| shipping_full_address | `string` | Full shipping address. | ✘ |
| billing_full_address | `string` | Full billing address. | ✘ |
| delivery_provider | `string` | Can be used to discern delivery providers DHL, PostNL etc. | ✘ |
| delivery_method | `string` | Can be used to discern delivery methods selected E.g. store pickup, standard delivery, express delivery, international. | ✘ |
| coupon_code | `string` | Coupon applied at checkout. | ✘ |
| account_type | `string` | Type of account used on checkout. E.g. existing user, guest. | ✘ |
| payment_method | `string` | Any kind of payment method the user selected to proceed E.g. card, PayPal, Alipay etc. | ✘ |
| proof_of_payment | `string` | Invoice or receipt. | ✘ |
| marketing_opt_in | `boolean` | If opted in to marketing campaigns. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>

### Transaction entity

Whenever there is a transaction entity involved in the ecommerce interaction event, it can have the following attributes:

| attribute | type | description | required |
| :--------------: | :------: | :----------------------------------------------------------------------------------------------------------------: | :------: |
| transaction_id | `string` | The ID of the transaction | ✅ |
| currency | `string` | The currency used for the transaction (ISO 4217). | ✅ |
| revenue | `number` | The revenue of the transaction. | ✅ |
| payment_method | `string` | The payment method used for the transaction. | ✅ |
| total_quantity | `number` | Total quantity of items in the transaction. | ✅ |
| tax | `number` | Total amount of tax on the transaction. | ✘ |
| shipping | `number` | Total cost of shipping on the transaction. | ✘ |
| discount_code | `string` | Discount code used. | ✘ |
| discount_amount | `number` | Discount amount taken off. | ✘ |
| credit_order | `boolean` | Whether the transaction is a credit order or not. | ✘ |

<a href="https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema" target="_blank" rel="noreferrer noopener">Relevant Iglu schema</a>