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
Snowplow ecommerce tracking was added in version 5.4.0. With the addition of these new ecommerce events and entities, we have deprecated the old `EcommerceTransaction` and `EcommerceTransactionItem` events. [Migration guide](docs/collecting-data/collecting-from-own-applications/mobile-trackers/migration-guides/migration-guide-to-new-ecommerce/index.md).
:::

The Snowplow ecommerce tracking APIs enable you to track events from your ecommerce store on the [web](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md) as well as mobile apps. A complete setup journey, including data modeling and visualization, is showcased in the [Ecommerce Accelerator](https://snowplow.io/data-product-accelerators/ecommerce-analytics-dpa/).

All ecommerce events must be manually tracked; there is no ecommerce auto-tracking.

## Ecommerce events

Ecommerce events are tracked like normal Snowplow events. For example, tracking an ecommerce `ProductViewEvent` event:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com")

let product = ProductEntity(
  id: "productId", 
  category: "category", 
  currency: "GBP", 
  price: 100
)
let event = ProductViewEvent(product: product)
let eventId = tracker.track(event)
```
  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val tracker = Snowplow.createTracker(
    context = applicationContext, // Android context
    namespace = "appTracker",
    endpoint = "https://snowplow-collector-url.com" // Event collector URL
)

val event = ProductViewEvent(ProductEntity(
  id = "productId", 
  category = "category", 
  currency = "GBP", 
  price = 100
  )
)
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

ProductViewEvent event = new ProductViewEvent(new ProductEntity(
  "productId", // id
  "category",  // category
  "GBP", // currency
  100 // price
  )
);         
tracker.track(event);
```
  </TabItem>
</Tabs>


Add or update properties using setters. For example, adding data to a PromotionEntity: 

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let promotion = PromotionEntity(id: "promoId")
promotion.name = "bogof"
promotion.type = "popup"
```
  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = PromotionEntity(id = "promoId")
promotion.name = "bogof"
promotion.type = "popup"
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
PromotionEvent promotion = new PromotionEntity("promoId");
promotion.setName("bogof");
promotion.setType("popup");
```
  </TabItem>
</Tabs>

This table lists all the ecommerce events.

`Event`                 | Used for
------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------
`ProductViewEvent`      | Tracking a visit to a product detail screen. Also known as product detail view.
`AddToCartEvent`        | Track an addition to cart.
`RemoveFromCartEvent`   | Track a removal from cart.
`ProductListViewEvent`  | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.
`ProductListClickEvent` | Track the click/selection of a product from a product list.
`PromotionViewEvent`    | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.
`PromotionClickEvent`   | Track the click/selection of an internal promotion.
`CheckoutStepEvent`     | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel.
`TransactionEvent`      | Track a transaction/purchase completion.
`TransactionErrorEvent` | Track a failed transaction.
`RefundEvent`           | Track a transaction partial or complete refund.


Each ecommerce event is a [self-describing](docs/collecting-data/collecting-from-own-applications/mobile-trackers/custom-tracking-using-schemas/index.md) event using a single schema, 
`iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2`.

<details>
    <summary>Ecommerce action event properties</summary>

| Request Key | Required | Type/Format | Description                                                                   |
|-------------|----------|-------------|-------------------------------------------------------------------------------|
| type        | Y        | string      | Specific ecommerce event type (automatically tracked).                                                |
| name        | N        | string      | For `ProductListView` and `ProductListClick` events: human-readable list name |
</details>

The events are distinguished by their `type` property, which is different for each `Event` class tracked. Aside from the optional list `name` in the `ProductListViewEvent` and `ProductListClickEvent` events, all tracked ecommerce properties are tracked as entities.

:::note
Check out the API docs ([Android](https://snowplow.github.io/snowplow-android-tracker/), [iOS](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/snowplow/)) for the full details of each Event and Entity.
:::

### ProductView

Tracking a visit to a details screen for a specific product.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let product = ProductEntity(
  id: "plow2", 
  category: "snow.clearance.ploughs.large", 
  currency: "NOK", 
  price: 5000
)
let event = ProductViewEvent(product: product)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = ProductEntity(
  id = "plow2", 
  category = "snow.clearance.ploughs.large", 
  currency = "NOK", 
  price = 5000
)
val event = ProductViewEvent(product)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ProductViewEvent event = new ProductViewEvent(new ProductEntity(
    "plow2", // id
    "snow.clearance.ploughs.large",  // category
    "NOK", // currency
    5000 // price
  )
); 

tracker.track(event);
```

  </TabItem>
</Tabs>

### AddToCart

Tracking one or more products being added to a cart.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let product = ProductEntity(
  id: "productId", 
  category: "clothes/shirts", 
  currency: "EUR", 
  price: 100.50
)
let cart = CartEntity(totalValue: 200, currency: "EUR")
let event = AddToCartEvent(products: [product], cart: cart)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = ProductEntity(
  id = "productId", 
  category = "clothes/shirts", 
  currency = "EUR", 
  price = 100.50
)
val cart = CartEntity(totalValue = 200, currency = "EUR")
val event = AddToCartEvent(listOf(product), cart)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ProductEntity product = new ProductEntity(
  "productId", // id
  "clothes/shirts", // category
  "EUR", // currency
  100.50 // price
);
List<Product> products = new ArrayList<>();
products.add(product);

CartEntity cart = new CartEntity(
  200, // totalValue
  "EUR" // currency
);
AddToCartEvent event = new AddToCartEvent(products, cart);

tracker.track(event);
```

  </TabItem>
</Tabs>

### RemoveFromCart

Tracking one or more products being removed from a cart.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let product = ProductEntity(id: "productId", category: "clothes/shirts", currency: "EUR", price: 100.50)
let cart = CartEntity(totalValue: 200, currency: "EUR")
let event = RemoveFromCartEvent(products: [product], cart: cart)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = ProductEntity(
  id = "productId", 
  category = "clothes/shirts", 
  currency = "EUR", 
  price = 100.50
)
val cart = CartEntity(totalValue = 200, currency = "EUR")
val event = RemoveFromCartEvent(listOf(product), cart)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ProductEntity product = new ProductEntity(
  "productId", // id
  "clothes/shirts", // category
  "EUR", // currency
  100.50 // price
);
List<Product> products = new ArrayList<>();
products.add(product);

CartEntity cart = new CartEntity(
  200, // totalValue
  "EUR" // currency
);
RemoveFromCartEvent event = new RemoveFromCartEvent(products, cart);

tracker.track(event);
```
  </TabItem>
</Tabs>

### ProductListView

Track an impression of a list of products. You can optionally provide a name for the list.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let product = ProductEntity(id: "productId", category: "software", currency: "USD", price: 99.99)
let event = ProductListViewEvent(products: [product], name: "snowplowProducts")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = ProductEntity(
  id = "productId", 
  category = "software", 
  currency = "USD", 
  price = 99.99
)
val event = ProductListViewEvent(listOf(product), name = "snowplowProducts")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ProductEntity product = new ProductEntity(
  "productId", // id
  "software", // category
  "USD", // currency
  99.99 // price
);
List<Product> products = new ArrayList<>();
products.add(product);
ProductListViewEvent event = new ProductListViewEvent(
  products, // products
  "snowplowProducts" // name
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### ProductListClick

Track a specific product being selected from a list. You can optionally provide a name for the list.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let product = ProductEntity(id: "productId", category: "software", currency: "USD", price: 99.99)
let event = ProductListClickEvent(product: product, name: "snowplowProducts")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val product = ProductEntity(
  id = "productId", 
  category = "software", 
  currency = "USD", 
  price = 99.99
)
val event = ProductListClickEvent(product, name = "snowplowProducts")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ProductEntity product = new ProductEntity(
  "productId", // id
  "software", // category
  "USD", // currency
  99.99 // price
);
ProductListClickEvent event = new ProductListClickEvent(
  product, // product
  "snowplowProducts" // name
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### CheckoutStep

Track the completion of a step in the checkout funnel, along with common checkout properties such as payment method or coupon code. See the API docs for the full details ([Android](https://snowplow.github.io/snowplow-android-tracker/), [iOS](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/snowplow/)).

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = CheckoutStepEvent(step: 3, deliveryMethod: "next_day")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = CheckoutStepEvent(step = 3, deliveryMethod = "next_day")

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
CheckoutStepEvent event = new CheckoutStepEvent(
  3, // step
  null, // shippingPostcode
  null, // billingPostcode
  null, // shippingFullAddress
  null, // billingFullAddress
  "next_day" // deliveryMethod
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### Transaction

Track the completion of a purchase or transaction, along with common transaction properties such as shipping cost or discount amount.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let transaction = TransactionEntity(
  transactionId: "id-123", 
  revenue: 50000, 
  currency: "JPY", 
  paymentMethod: "debit", 
  totalQuantity: 2
)
let event = TransactionEvent(transaction)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val transaction = TransactionEntity(
  id = "id-123", 
  revenue = 50000,
  currency = "JPY",
  paymentMethod = "debit",
  totalQuantity = 2
)
val event = TransactionEvent(transaction)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TransactionEntity transaction = new TransactionEntity(
  "id-123", // id
  50000, // revenue
  "JPY", // currency
  "debit", // paymentMethod
  2 // totalQuantity
);
TransactionEvent event = new TransactionEvent(transaction);

tracker.track(event);
```
  </TabItem>
</Tabs>

### TransactionError

Track an error occurring during a transaction.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let transaction = TransactionEntity(
  transactionId: "id-123", 
  revenue: 50000, 
  currency: "JPY", 
  paymentMethod: "debit", 
  totalQuantity: 2
)
let event = TransactionErrorEvent(
  transaction: transaction, 
  errorCode: "E05", 
  errorDescription: "connection_failure"
)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val transaction = TransactionEntity(
  id = "id-123", 
  revenue = 50000,
  currency = "JPY",
  paymentMethod = "debit",
  totalQuantity = 2
)
val event = TransactionErrorEvent(
    transaction = transaction, 
    errorCode = "E05",
    errorDescription = "connection_failure"
)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TransactionEntity transaction = new TransactionEntity(
  "id-123", // id
  50000, // revenue
  "JPY", // currency
  "debit", // paymentMethod
  2 // totalQuantity
);
TransactionErrorEvent event = new TransactionErrorEvent(
    transaction, // transaction
    "E05", // errorCode
    null, // errorShortcode
    "connection_failure" // errorDescription
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### Refund

Track a refund being requested for part of, or the entirety of, a transaction.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = RefundEvent(
  transactionId: "id-123", // use the transaction ID from the original Transaction event
  refundAmount: 20000, 
  currency: "JPY"
)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = Refund(
    id = "id-123", // use the transaction ID from the original Transaction event
    refundAmount = 20000,
    currency = "JPY"
)

tracker.track(event)
```
  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
RefundEvent event = new RefundEvent(
    "id-123", // id; use the transaction ID from the original Transaction event
    20000, // refundAmount
    "JPY" // currency
);

tracker.track(event);
```
  </TabItem>
</Tabs>

### PromotionView

Track an impression for any kind of internal promotion.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let promotion = PromotionEntity(id: "promoId")
let event = PromotionViewEvent(promotion: promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = PromotionEntity(id = "promoId")
val event = PromotionViewEvent(promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
PromotionEntity promotion = new PromotionEntity("promoId");
PromotionViewEvent event = new PromotionViewEvent(promotion);

tracker.track(event);
```

  </TabItem>
</Tabs>

### PromotionClick

Track an internal promotion being selected.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let promotion = PromotionEntity(id: "promoId")
let event = PromotionViewEvent(promotion: promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val promotion = PromotionEntity(id = "promoId")
val event = PromotionClick(promotion)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
PromotionEntity promotion = new PromotionEntity("promoId");
PromotionClickEvent event = new PromotionClickEvent(promotion);

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

The transaction entity is used for `Transaction` and `TransactionError` events.

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

### Transaction error entity

The transaction error entity is used for `TransactionError` events.

<details>
    <summary>Transaction error entity properties</summary>

| Request Key      | Required | Type/Format | Description                    |
|------------------|----------|-------------|--------------------------------|
| errorCode        | N        | string      | Error-identifying code.        |
| errorShortcode   | N        | string      | Shortcode for the error.       |
| errorDescription | N        | string      | Longer description.            |
| errorType        | N        | string enum | Is the error "hard" or "soft". |
| resolution       | N        | string      | The chosen error resolution.   |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/transaction_error/jsonschema/1-0-0`.

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

## Global ecommerce entities Screen/Page and User

Use these APIs to add ecommerce context information to every subsequent event tracked.

:::note
These entities will be added to **all** events, not just ecommerce ones. This is for consistency with entities in the JavaScript tracker.
:::

### Ecommerce Screen (Page) entity

:::note
The `setEcommerceScreen` method adds a `Page` (rather than `Screen`) entity to all events, for consistency with web tracking.
:::

The Ecommerce Screen/Page entity helps in grouping insights by screen/page type, e.g. Product description, Product list, Home screen.

To set a Screen/Page entity you can use the `setEcommerceScreen` method:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let entity = EcommerceScreenEntity(type: "demo_app_screen")
Snowplow.defaultTracker()?.ecommerce.setEcommerceScreen(entity)

// setting EcommerceScreen again will replace the original entity
let newEntity = EcommerceScreenEntity(type: "product_list", language: "EN-GB", locale: "UK")
Snowplow.defaultTracker()?.ecommerce.setEcommerceScreen(newEntity)

// remove the saved properties and stop the Page entity being added
Snowplow.defaultTracker()?.ecommerce.removeEcommerceScreen()
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val entity = EcommerceScreenEntity(type = "demo_app_screen")
Snowplow.defaultTracker?.ecommerce.setEcommerceScreen(entity)

// setting EcommerceScreen again will replace the original entity
val newEntity = EcommerceScreenEntity(type = "product_list", language = "EN-GB", locale = "UK")
Snowplow.defaultTracker?.ecommerce.setEcommerceScreen(newEntity)

// remove the saved properties and stop the Page entity being added
Snowplow.defaultTracker?.ecommerce.removeEcommerceScreen()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EcommerceScreenEntity entity = new EcommerceScreenEntity(
  "demo_app_screen" // type
)
Snowplow.getDefaultTracker().getEcommerce().setEcommerceScreen(entity);

// setting EcommerceScreen again will replace the original entity
EcommerceScreenEntity newEntity = new EcommerceScreenEntity(
  "product_list", // type
  "EN-GB", // language
  "UK" // locale
)
Snowplow.getDefaultTracker().getEcommerce().setEcommerceScreen(newEntity);

// remove the saved properties and stop the Page entity being added
Snowplow.getDefaultTracker().getEcommerce().removeEcommerceScreen();
```

  </TabItem>
</Tabs>

<details>
    <summary>Screen/Page entity properties</summary>

| Request Key | Required | Type/Format | Description                   |
|-------------|----------|-------------|-------------------------------|
| type        | Y        | string      | Type of screen.               |
| language    | N        | string      | Language used for the screen. |
| locale      | N        | string      | Locale version. |

</details>

*Schema:*
`iglu:com.snowplowanalytics.snowplow.ecommerce/page/jsonschema/1-0-0`.

### Ecommerce User entity

The Ecommerce User entity helps in modeling guest/non-guest account interactions.

To set an Ecommerce User entity you can use the `setEcommerceUser` method with the following attributes:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let entity = EcommerceUserEntity(id: "userId12345", isGuest: true)
Snowplow.defaultTracker()?.ecommerce.setEcommerceUser(entity)

// setting EcommerceUser again will replace the original entity
let newEntity = EcommerceUserEntity(id: "userId67890", isGuest: false, email: "email@email.com")
Snowplow.defaultTracker()?.ecommerce.setEcommerceUser(newEntity)

// remove the saved properties and stop the User entity being added
Snowplow.defaultTracker()?.ecommerce.removeEcommerceUser()
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val entity = EcommerceUserEntity(id = "userId12345", isGuest = true)
Snowplow.defaultTracker?.ecommerce.setEcommerceUser(entity)

// setting EcommerceUser again will replace the original entity
val newEntity = EcommerceUserEntity(id = "userId67890", isGuest = false, email = "email@email.com")
Snowplow.defaultTracker?.ecommerce.setEcommerceUser(newEntity)

// remove the saved properties and stop the User entity being added
Snowplow.defaultTracker?.ecommerce.removeEcommerceUser()
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
EcommerceUserEntity entity = new EcommerceUserEntity(
  "userId12345", // id
  true // isGuest
)
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser(entity);

// setting ScreenType again will replace the original entity
EcommerceUserEntity newEntity = new EcommerceUserEntity(
  "userId67890", // id
  false, // isGuest
  "email@email.com" // email
)
Snowplow.getDefaultTracker().getEcommerce().setEcommerceUser(newEntity);

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
