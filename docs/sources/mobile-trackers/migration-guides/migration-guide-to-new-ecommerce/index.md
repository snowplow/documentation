---
title: "Migrating to the v5.4 Ecommerce package"
sidebar_label: "Migrating to the v5.4 Ecommerce package"
sidebar_position: -6
description: "Migrate from deprecated ecommerce events to the new v5.4 ecommerce tracking package with structured entities and event types."
keywords: ["ecommerce migration", "version 5.4", "transaction events"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The [Ecommerce tracking package](/docs/sources/mobile-trackers/tracking-events/ecommerce-tracking/index.md) was introduced in Android and iOS v5.4.0. It provides 11 out-of-the-box event types to make it easier to thoroughly track user activity in an e-commerce store. A complete setup journey, including data modeling and visualization, is showcased in the [Ecommerce Accelerator](https://snowplow.io/data-product-accelerators/ecommerce-analytics-dpa/).

:::note
Migrating to the new ecommerce events is a breaking change for any relevant data models.
:::

## Replacing the deprecated events

To update your existing tracking based on the now deprecated `Ecommerce` (iOS)/`EcommerceTransaction` (Android) and `EcommerceItem`/`EcommerceTransactionItem` event types, we recommend using `TransactionEvent`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>
Old API:

```swift
let product = EcommerceItem(sku: "sku1", price: 100, quantity: 1)
    .name("itemName")
    .category("category")
    .currency("GBP")
    .orderId("id-123")

let event = Ecommerce(orderId: "id-123", totalValue: 350, items: [product])
    .currency("GBP")
    .taxValue(10)
    .shipping(15)
    .city("London")
    .state("N/A")
    .country("UK")
    .affiliation("affiliation")

tracker.track(event)
```
New API:

```swift
let product = ProductEntity(
  id: "sku1",
  price: 100,
  quantity: 1,
  name: "itemName",
  category: "category",
  currency: "GBP"
)

let transaction = TransactionEntity(
  transactionId: "id-123",
  revenue: 350,
  products: [product],
  currency: "GBP",
  tax: 10,
  shipping: 15
)

let event = TransactionEvent(transaction: transaction, products: [product])

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">
Old API:

```kotlin
val product = EcommerceTransactionItem(sku = "sku1", price = 100.0, quantity = 1)
    .name("itemName")
    .category("category")
    .currency("GBP")
    .orderId("id-123")

val event = EcommerceTransaction(orderId = "id-123", totalValue = 350.0, items = listOf(product))
    .currency("GBP")
    .taxValue(10.0)
    .shipping(15.0)
    .city("London")
    .state("N/A")
    .country("UK")
    .affiliation("affiliation")

tracker.track(event)
```
New API:

```kotlin
val product = ProductEntity(
  id = "sku1",
  price = 100.0,
  quantity = 1,
  name = "itemName",
  category = "category",
  currency = "GBP"
)

val transaction = TransactionEntity(
  transactionId = "id-123",
  revenue = 350.0,
  products = [product],
  currency = "GBP",
  tax = 10.0,
  shipping = 15.0
)

val event = TransactionEvent(transaction, listOf(product))

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">
Old API:

```java
EcommerceTransactionItem product = new EcommerceTransactionItem(
    "sku1", // sku
    100.0, // price
    1 // quantity
  ).name("itemName")
  .category("category")
  .currency("GBP")
  .orderId("id-123")

List<Product> products = new ArrayList<>();
products.add(product);

EcommerceTransaction event = EcommerceTransaction(
      "id-123", // orderId
      350.0, // totalValue
      products // items
  ).currency("GBP")
  .taxValue(10.0)
  .shipping(15.0)
  .city("London")
  .state("N/A")
  .country("UK")
  .affiliation("affiliation")

tracker.track(event)
```
New API:

```java
ProductEntity product = new ProductEntity(
  "sku1", // id
  100.0, // price
  1, // quantity
  "itemName", // name
  "category", // category
  "GBP", // currency
);
List<Product> products = new ArrayList<>();
products.add(product);

TransactionEntity transaction = new TransactionEntity(
  "id-123", // id
  350.0, // revenue
  products, // products
  "GBP", // currency
  10.0, // tax
  15.0 // shipping
);

TransactionEvent event = new TransactionEvent(transaction, products);

tracker.track(event)
```
  </TabItem>
</Tabs>

These code snippets show only the direct API replacement. Check out the [docs page](/docs/sources/mobile-trackers/tracking-events/ecommerce-tracking/index.md) or the [Ecommerce Accelerator](https://snowplow.io/data-product-accelerators/ecommerce-analytics-dpa/) for information about expanding your tracking with the other new event types.

Note that address details and affiliation are not captured in `TransactionEvent`. To track these so that they are attached to the `TransactionEvent`, we suggest creating [custom schemas](/docs/sources/mobile-trackers/custom-tracking-using-schemas/index.md) and adding the data as an entity. Alternatively for addresses, you could use the `CheckoutStepEvent` which has address and postcode as optional parameters.

## How the tracked events are different

### Old events
Using the old event types, an event is generated for each `EcommerceTransaction` event as well as each `EcommerceTransactionItem` attached. Therefore, tracking an `EcommerceTransaction` event with 3 items would result in 4 events being tracked. These events are not linked at all, unless the same `orderId` is provided to all the objects, adding potential challenges in data modeling.

In the tracked data, the events have `event_name` `transaction` or `transaction_item`. The data is sent within the legacy event properties `tr_x` and `ti_x`, e.g. `tr_id` for the `EcommerceTransaction` `orderId` property. All of these properties are listed [here](/docs/events/index.md). Each one maps to a column in the warehouse table.

### New events
The new Ecommerce event types take advantage of the Snowplow entities/event context feature. Tracking `TransactionEvent` with 3 items results in a single event being tracked. The items, and the details of the transaction, are attached as entities. That single event would have one `TransactionEntity`, three `ProductEntity`, plus whichever out-of-the-box and/or custom entities are configured.

All of the new events are `SelfDescribingEvent` with `event_name` `snowplow_ecommerce_action`. None of the data is sent as legacy properties; it is all within entities, which end up in their own table columns.

Entities such as `ProductEntity` can be added to several of the new Ecommerce events, e.g. `ProductViewEvent` or `AddToCartEvent`. Reusing the same entities makes modeling easier and keeps the code cleaner.

## Using the DBT data model

Since the structure of the events is so different, migrating to the new ecommerce events is a breaking change for any relevant data models.

We provide a dbt package that creates a set of derived tables including carts, transactions, and products from the raw ecommerce event data. Find the details of configuring this inside the [Ecommerce Accelerator](https://snowplow.io/data-product-accelerators/ecommerce-analytics-dpa/).
