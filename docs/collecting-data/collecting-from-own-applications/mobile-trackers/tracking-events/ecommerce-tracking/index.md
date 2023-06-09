---
title: "Ecommerce tracking"
sidebar_position: 70
---

# Ecommerce tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The Snowplow ecommerce tracking APIs enable you to track events from your ecommerce store on the Web as well as mobile apps.

:::note
Snowplow ecommerce tracking is currently available for Android (and web) only. Stay tuned for an iOS release.
:::

The trackers provide a set of tracking APIs that enable you to (manually) track ecommerce activity. For the web, a complete setup journey, including data modeling, is showcased on the [Ecommerce Web Accelerator](https://docs.snowplow.io/accelerators/ecommerce/).

All Ecommerce events must be manually tracked: there is no Ecommerce auto-tracking.


<TOCInline toc={toc} maxHeadingLevel={4} />

## Ecommerce events

`Event`            | Used for
-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------
`ProductView`      | Tracking a visit to a product page. Also known as product detail view.
`AddToCart`        | Track an addition to cart.
`RemoveFromCart`   | Track a removal from cart.
`ProductListView`  | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.
`ProductListClick` | Track the click/selection of a product from a product list.
`PromotionView`    | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.
`PromotionClick`   | Track the click/selection of an internal promotion.
`CheckoutStep`     | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel.
`Transaction`      | Track a transaction/purchase completion.
`Refund`           | Track a transaction partial or complete refund.

TODO currency ISO 4217

Each ecommerce event is a TODO self-describing event with a single schema, 
`iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-1`.

<details>
    <summary>Ecommerce action event properties</summary>

| Request Key | Required | Type/Format | Description                                                                   |
|-------------|----------|-------------|-------------------------------------------------------------------------------|
| type        | Y        | string      | Specific Ecommerce event type - automatically tracked.                                                |
| name        | N        | string      | For `ProductListView` and `ProductListClick` events: human-readable list name |
</details>

The events are distinguished by their `type` property, which is different for each `Event` class tracked. Aside from the optional list `name` in the `ProductListView` and `ProductListClick` events, all tracked ecommerce properties are tracked as entities.

## Ecommerce entities

### Product entity

The product entity is used in several ecommerce events.
It contains information about the product the user is interacting with.

<details>
    <summary>Product entity properties</summary>

| Request Key     | Required | Type/Format | Description                                |
|-----------------|----------|-------------|--------------------------------------------|
| id              | Y        | string      | The SKU or product ID.                     |
| category        | Y        | string      | Category the product belongs to.           |
| currency        | Y        | string      | Currency in which the product is priced.   |
| price           | Y        | number      | Current price.                             |
| listPrice       | N        | boolean     | Recommended or list price.                 |
| name            | N        | string      | Product name or title.                     |
| quantity        | N        | integer     | Quantity of the product (for cart events). |
| size            | N        | string      | Product size.                              |
| variant         | N        | string      | Product variant.                           |
| brand           | N        | string      | Product brand.                             |
| inventoryStatus | N        | string      | Inventory status, e.g. in stock.           |
| position        | N        | integer     | Position in a list of products.            |
| creativeId      | N        | string      | Identifier for the creative shown.         |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0`.

### Cart entity

The cart entity is used for `AddToCart` and `RemoveFromCart` events.

<details>
    <summary>Cart entity properties</summary>

| Request Key | Required | Type/Format | Description                         |
|-------------|----------|-------------|-------------------------------------|
| totalValue  | Y        | number      | Total cart value after this action. |
| currency    | Y        | string      | Currency used for the cart.         |
| cartId      | N        | string      | Unique cart identifier.             |
</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0`.

### Checkout step entity

The checkout step entity is used for `CheckoutStep` events.

<details>
    <summary>Checkout step entity properties</summary>

| Request Key         | Required | Type/Format | Description                                                       |
|---------------------|----------|-------------|-------------------------------------------------------------------|
| step                | Y        | integer     | Checkout step index.                                              |
| shippingPostcode    | N        | string      | Shipping address postcode.                                        |
| billingPostcode     | N        | string      | Billing address postcode.                                         |
| shippingFullAddress | N        | string      | Shipping address.                                                 |
| billingFullAddress  | N        | string      | Billing address.                                                  |
| deliveryProvider    | N        | string      | Delivery provider e.g. DHL, Royal Mail.                           |
| deliveryMethod      | N        | string      | How the customer will get the product.                            |
| couponCode          | N        | string      | An applied coupon.                                                |
| accountType         | N        | string      | Customer account type, e.g. guest                                 |
| paymentMethod       | N        | string      | Payment method selected.                                          |
| proofOfPayment      | N        | string      | e.g. invoice, receipt                                             |
| marketingOptIn      | N        | boolean      | Whether the user email address is opted into marketing campaigns. |
</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0`.

### Transaction entity

The transaction entity is used for `Transaction` events.

<details>
    <summary>Transaction entity properties</summary>

| Request Key    | Required | Type/Format | Description                                |
|----------------|----------|-------------|--------------------------------------------|
| transactionId  | Y        | string      | Unique transaction identifier.             |
| revenue        | Y        | number      | Value of transaction.                      |
| currency       | Y        | string      | Currency used in transaction.              |
| paymentMethod  | Y        | string      | Payment method used.                       |
| totalQuantity  | Y        | integer     | Number of items in the transaction.        |
| tax            | N        | number      | Tax value in transaction.                  |
| shipping       | N        | number      | Shipping costs in transaction.             |
| discountCode   | N        | string      | An applied discount code.                  |
| discountAmount | N        | string      | Amount discounted from transaction.        |
| creditOrder    | N        | boolean     | Whether the transaction is a credit order. |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0`.

### Refund entity

The refund entity is used for `Refund` events.

<details>
    <summary>Refund entity properties</summary>

| Request Key   | Required | Type/Format | Description                                   |
|---------------|----------|-------------|-----------------------------------------------|
| transactionId | Y        | string      | The identifier from the original transaction. |
| refundAmount  | Y        | number      | Amount to be refunded.                        |
| currency      | Y        | string      | Currency used in transaction.                 |
| refundReason  | N        | string      | Reason for the refund.                        |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0`.

### Promotion entity

The promotion entity is used for `PromotionView` and `PromotionClick` events.

<details>
    <summary>Promotion entity properties</summary>

| Request Key | Required | Type/Format     | Description                                        |
|-------------|----------|-----------------|----------------------------------------------------|
| id          | Y        | string          | The unique promotion identifier.                   |
| name        | N        | string          | Promotion name.                                    |
| productIds  | N        | list of strings | IDs of products in the promotion.                  |
| position    | N        | integer         | Index of the promotion in a list such as a banner. |
| creativeId  | N        | string          | Identifier for the promotion creative.             |
| type        | N        | string          | Type of promotion.                                 |
| slot        | N        | string          | Where the promotion was displayed.                 |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/promotion/jsonschema/1-0-0`.

## Global ecommerce entities Screen and User

Use these APIs to add ecommerce context information to every subsequent event tracked - including non-ecommerce events.

### EcommerceUser entity

To set an Ecommerce User entity you can use the `setEcommerceUser` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
Snowplow.tracker.ecommerce.setEcommerceUser("userId12345")

// setting EcommerceUser again will replace the original entity
Snowplow.tracker.ecommerce.setEcommerceUser("userId67890")

// remove the saved properties and stop the User entity being added
Snowplow.tracker.ecommerce.removeEcommerceUser()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser("userId12345")

// setting ScreenType again will replace the original entity
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser("userId67890")

// remove the saved properties and stop the Page entity being added
Snowplow.getDefaultTracker().getEcommerce().removeEcommerceUser()
```

  </TabItem>
</Tabs>

<details>
    <summary>User entity properties</summary>

| Request Key | Required | Type/Format | Description                  |
|-------------|----------|-------------|------------------------------|
| id          | Y        | string      | The unique user identifier.  |
| isGuest     | N        | boolean     | Whether the user is a guest. |
| email       | N        | string      | User email address.          |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/user/jsonschema/1-0-0`.

### ScreenType

Note that the `setScreenType` method adds a `Page` (rather than `Screen`) entity to all events, to be consistent with web tracking.

To set a Page entity you can use the `setScreenType` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
Snowplow.tracker.ecommerce.setScreenType("demo_app_screen")

// setting ScreenType again will replace the original entity
Snowplow.tracker.ecommerce.setScreenType("product_list", "EN-GB", "UK")

// remove the saved properties and stop the Page entity being added
Snowplow.tracker.ecommerce.removeScreenType()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Snowplow.getDefaultTracker().getEcommerce().setScreenType("demo_app_screen")

// setting ScreenType again will replace the original entity
Snowplow.getDefaultTracker().getEcommerce().setScreenType("product_list", "EN-GB", "UK")

// remove the saved properties and stop the Page entity being added
Snowplow.getDefaultTracker().getEcommerce().removeScreenType()
```

  </TabItem>
</Tabs>

<details>
    <summary>Page entity properties</summary>

| Request Key | Required | Type/Format | Description                   |
|-------------|----------|-------------|-------------------------------|
| type        | Y        | string      | Type of screen.               |
| language    | N        | string      | Language used for the screen. |
| locale      | N        | string      | Locale version. |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/page/jsonschema/1-0-0`.
