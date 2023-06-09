---
title: "Ecommerce tracking"
sidebar_position: 70
---

# Ecommerce tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```
:::note
Snowplow ecommerce tracking is currently available for Android (and web) only. Stay tuned for the iOS release.

With the addition of these Snowplow ecommerce events and entities, we have deprecated the old `EcommerceTransaction` and `EcommerceTransactionItem` events.
:::

The Snowplow ecommerce tracking APIs enable you to track events from your ecommerce store on the web ([Javascript](docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/snowplow-ecommerce/index.md) and [browser](docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/plugins/snowplow-ecommerce/index.md) trackers) as well as mobile apps. For the web, a complete setup journey, including data modeling, is showcased on the [Ecommerce Web Accelerator](https://docs.snowplow.io/accelerators/ecommerce/).

All ecommerce events must be manually tracked; there is no ecommerce auto-tracking.

## Ecommerce events

Ecommerce events are tracked like normal Snowplow events. For example, tracking an ecommerce `ProductView` event:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val tracker = Snowplow.createTracker(
        applicationContext, // Android context
        "appTracker", // namespace
        "https://snowplow-collector-url.com" // Event collector URL
    )

val event = ProductView(Product("productId", "category", "GBP", 100))
tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerController tracker = Snowplow.createTracker(
      getApplicationContext(), // Android context
      "appTracker", // namespace
      "https://snowplow-collector-url.com" // Event collector URL
);

ProductView event = new ProductView(new Product("productId", "category", "GBP", 100));         
tracker.track(event);
```
  </TabItem>
</Tabs>


Older out-of-the-box Snowplow event types provide builder methods, reflecting the Android tracker's Java heritage. Now that the tracker is written in Kotlin, we have provided similar functionality by setting all ecommerce event/entity properties as `var`. For example, adding data to a Promotion object: 

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = Promotion("promoId")
promotion.type = "popup"
promotion.name = "bogof"
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Promotion promotion = new Promotion("promoId");
promotion.setName("bogof");
promotion.setType("popup");
```
  </TabItem>
</Tabs>

This table lists all the ecommerce events.

`Event`            | Used for
-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------
`ProductView`      | Tracking a visit to a product detail screen. Also known as product detail view.
`AddToCart`        | Track an addition to cart.
`RemoveFromCart`   | Track a removal from cart.
`ProductListView`  | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.
`ProductListClick` | Track the click/selection of a product from a product list.
`PromotionView`    | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.
`PromotionClick`   | Track the click/selection of an internal promotion.
`CheckoutStep`     | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel.
`Transaction`      | Track a transaction/purchase completion.
`Refund`           | Track a transaction partial or complete refund.


Each ecommerce event is a [self-describing](docs/collecting-data/collecting-from-own-applications/mobile-trackers/custom-tracking-using-schemas/index.md) event using a single schema, 
`iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-1`.

<details>
    <summary>Ecommerce action event properties</summary>

| Request Key | Required | Type/Format | Description                                                                   |
|-------------|----------|-------------|-------------------------------------------------------------------------------|
| type        | Y        | string      | Specific ecommerce event type (automatically tracked).                                                |
| name        | N        | string      | For `ProductListView` and `ProductListClick` events: human-readable list name |
</details>

The events are distinguished by their `type` property, which is different for each `Event` class tracked. Aside from the optional list `name` in the `ProductListView` and `ProductListClick` events, all tracked ecommerce properties are tracked as entities - see [below](#entities) for details.

Check out the API docs ([Android](https://snowplow.github.io/snowplow-android-tracker/)) for the full details and method signatures.

### ProductView

Tracking a visit to a details screen for a specific product.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = Product("productId", "category", "GBP", 100)
val event = ProductView(product)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Product product = new Product("productId", "category", "GBP", 100);
ProductView event = new ProductView(product);

tracker.track(event);
```

  </TabItem>
</Tabs>

### AddToCart

Tracking one or more products being added to a cart.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = Product("productId", "clothes/shirts", "EUR", 100.50)
val event = AddToCart(listOf(product), 200, "EUR")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Product product = new Product("productId", "clothes/shirts", "EUR", 100.50);
List<Product> products = new ArrayList<>();
products.add(product);
AddToCart event = new AddToCart(products, 200, "EUR");

tracker.track(event);
```

  </TabItem>
</Tabs>

### RemoveFromCart

Tracking one or more products being removed from a cart.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = Product("productId", "clothes/shirts", "EUR", 100.50)
val event = RemoveFromCart(listOf(product), 200, "EUR")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Product product = new Product("productId", "clothes/shirts", "EUR", 100.50);
List<Product> products = new ArrayList<>();
products.add(product);
RemoveFromCart event = new RemoveFromCart(products, 200, "EUR");

tracker.track(event);
```
  </TabItem>
</Tabs>

### ProductListView

Track an impression of a list of products. You can optionally provide a name for the list.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = Product("productId", "software", "USD", 99.99)
val event = ProductListView(listOf(product), "snowplowProducts")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Product product = new Product("productId", "software", "USD", 99.99);
List<Product> products = new ArrayList<>();
products.add(product);
ProductListView event = new ProductListView(products, "snowplowProducts");

tracker.track(event);
```
  </TabItem>
</Tabs>

### ProductListClick

Track a specific product being selected from a list. You can optionally provide a name for the list.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = Product("productId", "software", "USD", 99.99)
val event = ProductListClick(product, "snowplowProducts")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Product product = new Product("productId", "software", "USD", 99.99);
ProductListClick event = new ProductListClick(product, "snowplowProducts");

tracker.track(event);
```
  </TabItem>
</Tabs>

### CheckoutStep

Track the completion of a step in the checkout funnel, along with common checkout properties.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = CheckoutStep(3)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
CheckoutStep event = new CheckoutStep(3);

tracker.track(event);
```
  </TabItem>
</Tabs>

### Transaction

Track the completion of a purchase or transaction.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = Transaction(
    "id-123", 
    50000,
    "JPY",
    "debit",
    2,
)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Transaction event = new Transaction(
    "id-123", 
    50000,
    "JPY",
    "debit",
    2,
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### Refund

Track a refund being requested for part of, or the entirety of, a transaction.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = Refund(
    "id-123", // use the transaction ID from the original Transaction event
    20000,
    "JPY"
)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Refund event = new Refund(
    "id-123", // use the transaction ID from the original Transaction event
    20000,
    "JPY"
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### PromotionView

Track an impression for any kind of internal promotion.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = Promotion("promoId")
val event = PromotionView(promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Promotion promotion = new Promotion("promoId");
ProductView event = new PromotionView(promotion);

tracker.track(event);
```

  </TabItem>
</Tabs>

### PromotionClick

Track an internal promotion being selected.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = Promotion("promoId")
val event = PromotionClick(promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Promotion promotion = new Promotion("promoId");
PromotionClick event = new PromotionClick(promotion);

tracker.track(event);
```
  </TabItem>
</Tabs>

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
Snowplow.defaultTracker?.ecommerce.setEcommerceUser("userId12345")

// setting EcommerceUser again will replace the original entity
Snowplow.defaultTracker?.ecommerce.setEcommerceUser("userId67890")

// remove the saved properties and stop the User entity being added
Snowplow.defaultTracker?.ecommerce.removeEcommerceUser()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser("userId12345");

// setting ScreenType again will replace the original entity
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser("userId67890");

// remove the saved properties and stop the Page entity being added
Snowplow.getDefaultTracker().getEcommerce().removeEcommerceUser();
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

### ScreenType entity

Note that the `setScreenType` method adds a `Page` (rather than `Screen`) entity to all events, to be consistent with web tracking.

To set a Page entity you can use the `setScreenType` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

Coming soon!

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
Snowplow.defaultTracker?.ecommerce.setScreenType("demo_app_screen")

// setting ScreenType again will replace the original entity
Snowplow.defaultTracker?.ecommerce.setScreenType("product_list", "EN-GB", "UK")

// remove the saved properties and stop the Page entity being added
Snowplow.defaultTracker?.ecommerce.removeScreenType()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Snowplow.getDefaultTracker().getEcommerce().setScreenType("demo_app_screen");

// setting ScreenType again will replace the original entity
Snowplow.getDefaultTracker().getEcommerce().setScreenType("product_list", "EN-GB", "UK");

// remove the saved properties and stop the Page entity being added
Snowplow.getDefaultTracker().getEcommerce().removeScreenType();
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
