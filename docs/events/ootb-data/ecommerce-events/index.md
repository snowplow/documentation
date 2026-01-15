---
title: "Ecommerce events and entities"
sidebar_label: "Ecommerce"
sidebar_position: 70
description: "Track ecommerce transactions, carts, checkouts, products, and promotions with Snowplow ecommerce events and context entities."
keywords: ["ecommerce tracking", "transaction events", "cart tracking", "checkout tracking", "product events"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

The Snowplow ecommerce tracking APIs enable you to track user behavior and interactions across your ecommerce store. Track product views, cart interactions, checkout steps, transactions, promotions, and more.

Use ecommerce tracking to answer questions such as:
- Which products do users view but not add to cart?
- Where do users drop off in the checkout process?
- How do promotions affect purchase behavior?
- What is the average order value by user segment?
- Which products are frequently purchased together?

Every ecommerce event uses the `snowplow_ecommerce_action` event schema, with additional entities.

## Tracker support

This table shows the support for ecommerce tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md). The server-side trackers can send ecommerce events as custom [self-describing events](/docs/fundamentals/events/index.md#self-describing-events).

| Tracker                                                                                | Supported | Since version | Auto-tracking | Notes                                                |
| -------------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ---------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/ecommerce/index.md)                   | ✅         | 3.7.0         | ❌             | Requires ecommerce plugin                            |
| [iOS](/docs/sources/mobile-trackers/tracking-events/ecommerce-tracking/index.md)       | ✅         | 5.4.0         | ❌             |                                                      |
| [Android](/docs/sources/mobile-trackers/tracking-events/ecommerce-tracking/index.md)   | ✅         | 5.4.0         | ❌             |                                                      |
| [React Native](/docs/sources/react-native-tracker/index.md)                            | ✅         | 4.2.0         | ❌             | Requires ecommerce plugin*                           |
| Flutter                                                                                | ❌         |               |               |                                                      |
| Roku                                                                                   | ❌         |               |               | Use the ecommerce schemas for your own custom events |
| [Google Tag Manager](/docs/sources/google-tag-manager/ecommerce-tag-template/index.md) | ✅         | v3            | ❌             |                                                      |

*You can use the [JavaScript ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) and APIs for React Native ecommerce tracking.

The Snowplow ecommerce tracking APIs are supported by the [Ecommerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) dbt data model. It's a fully incremental model that transforms raw ecommerce event data into a set of derived tables based around carts, checkouts, products, and transactions.

We recommend using the [Ecommerce base data product template](/docs/data-product-studio/data-products/data-product-templates/index.md#ecommerce-web-and-mobile) for ecommerce tracking.

## Available events

The ecommerce APIs include a number of tracking functions for different ecommerce actions. The exact API varies between trackers, but the available events are consistent across all supported trackers.

| Event behavior     | Used for                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Product view       | Tracking a visit to a product detail screen. Also known as product detail view.                                                                |
| Add to cart        | Track an addition to cart.                                                                                                                     |
| Remove from cart   | Track a removal from cart.                                                                                                                     |
| Product list view  | Track an impression of a product list. The list could be a search results page, recommended products, upsells etc.                             |
| Product list click | Track the click/selection of a product from a product list.                                                                                    |
| Promotion view     | Track an impression for an internal promotion banner or slider or any other type of content that showcases internal products/categories.       |
| Promotion click    | Track the click/selection of an internal promotion.                                                                                            |
| Checkout step      | Track a checkout step completion in the checkout process together with common step attributes for user choices throughout the checkout funnel. |
| Transaction        | Track a transaction/purchase completion.                                                                                                       |
| Transaction error  | Track a failed transaction.                                                                                                                    |
| Refund             | Track a transaction partial or complete refund.                                                                                                |

All these events use the same underlying schema. They're distinguished by their `type` property.

<SchemaProperties
  overview={{event: true}}
  example={{
    type: 'list_view',
    name: 'shop the look'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an Ecommerce action", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "snowplow_ecommerce_action", "format": "jsonschema", "version": "1-0-2" }, "type": "object", "properties": { "type": { "description": "Standard ecommerce actions.", "enum": [ "add_to_cart", "remove_from_cart", "product_view", "list_click", "list_view", "promo_click", "promo_view", "checkout_step", "transaction", "refund", "trns_error" ] }, "name": { "description": "The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with.", "type": [ "string", "null" ], "maxLength": 128 } }, "required": [ "type" ], "additionalProperties": false }} />

## Automatically included entities

Every ecommerce event includes entities that describe the user interaction. These entities are attached automatically by the tracker. You don't need to track them yourself.

### Cart

The cart entity captures the current state of the shopping cart, including its total value and currency.

<SchemaProperties
  overview={{event: false}}
  example={{
    cart_id: null,
    currency: 'EUR',
    total_value: 12
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a cart entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "cart", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "cart_id": { "description": "The unique ID representing this cart.", "type": ["string","null"], "maxLength": 4096 }, "total_value": { "description": "The total value of the cart after this interaction.", "type": "number", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "currency": { "description": "The currency used for this cart (ISO 4217).", "type": "string", "maxLength": 3, "minLength": 3 } }, "required": [ "total_value", "currency" ], "additionalProperties": false }} />

### Checkout step

The checkout step entity tracks information about a specific step in the checkout process, including delivery details, payment method, and user preferences.

<SchemaProperties
  overview={{event: false}}
  example={{
    step: 2,
    account_type: 'guest',
    billing_full_address: null,
    billing_postcode: null,
    coupon_code: null,
    delivery_method: null,
    delivery_provider: null,
    marketing_opt_in: null,
    payment_method: null,
    proof_of_payment: null,
    shipping_full_address: null,
    shipping_postcode: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a checkout step entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "checkout_step", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "step" : { "description" : "Checkout step index.", "type": "integer", "minimum": 1, "maximum": 90 }, "shipping_postcode": { "description": "Shipping address postcode.", "type" : [ "string", "null" ], "maxLength": 128 }, "billing_postcode": { "description": "Billing address postcode.", "type" : [ "string", "null" ], "maxLength": 128 }, "shipping_full_address": { "description": "Full shipping address.", "type" : [ "string", "null" ], "maxLength": 4096 }, "billing_full_address": { "description": "Full billing address.", "type" : [ "string", "null" ], "maxLength": 4096 }, "delivery_provider": { "description": "Can be used to discern delivery providers DHL, PostNL etc.", "type" : [ "string", "null" ], "maxLength": 128 }, "delivery_method": { "description": "Can be used to discern delivery methods selected E.g. store pickup, standard delivery, express delivery, international.", "type" : [ "string", "null" ], "maxLength": 128 }, "coupon_code": { "description": "Coupon applied at checkout.", "type" : [ "string", "null" ], "maxLength": 128 }, "account_type": { "description": "Type of account used on checkout. E.g. existing user, guest.", "type" : [ "string", "null" ], "maxLength": 128 }, "payment_method": { "description": "Any kind of payment method the user selected to proceed E.g. card, PayPal, Alipay etc.", "type" : [ "string", "null" ], "maxLength": 128 }, "proof_of_payment": { "description": "Invoice or receipt.", "type" : [ "string", "null" ], "maxLength": 128 }, "marketing_opt_in": { "type" : ["boolean", "null"], "description": "If opted in to marketing campaigns." } }, "required": [ "step" ], "additionalProperties": false }} />

### Product

The product entity contains detailed information about a product, including its ID, category, price, and other attributes such as brand, variant, and inventory status.

<SchemaProperties
  overview={{event: false}}
  example={{
    id: '1236',
    name: null,
    category: 'Hats',
    price: 12,
    list_price:  null,
    quantity: null,
    size: null,
    variant: null,
    brand: 'Snowplow',
    inventory_status: null,
    position: null,
    currency: 'EUR',
    creative_id: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a product entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "product", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "description" : "The SKU or product ID.", "type": "string", "maxLength": 4096 }, "name" : { "description" : "The name or title of the product.", "type": ["string", "null"], "maxLength": 4096 }, "category": { "description" : "The category the product belongs to. Use a consistent separator to express multiple levels. E.g. Woman/Shoes/Sneakers", "type": "string", "maxLength": 4096 }, "price": { "description" : "The price of the product at the current time.", "type": "number", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "list_price": { "description" : "The list or recommended retail price of a product.", "type" : ["number", "null"], "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "quantity" : { "description" : "The quantity of the product taking part in the ecommerce action.", "type": ["integer", "null"], "minimum": 0, "maximum": 9999999 }, "size": { "description" : "The size of the product.", "type" : [ "string", "null" ], "maxLength": 256 }, "variant": { "description" : "The variant of the product.", "type" : [ "string", "null" ], "maxLength": 256 }, "brand": { "description" : "The brand of the product.", "type" : [ "string", "null" ], "maxLength": 256 }, "inventory_status": { "description" : "The inventory status of the product E.g. in stock, out of stock, preorder, backorder.", "type" : [ "string", "null" ], "maxLength": 256 }, "position": { "description" : "The position the product was presented in a list of products E.g. search results, product list page.", "type" : [ "integer", "null" ], "minimum": 0, "maximum": 9999999 }, "currency": { "description" : "The currency in which the product is being priced (ISO 4217).", "type" : "string", "maxLength": 3, "minLength": 3 }, "creative_id": { "description" : "Identifier/Name/Url for the creative presented on a list or product view.", "type" : [ "string", "null" ], "maxLength": 256 } }, "required": [ "id", "category", "price", "currency" ], "additionalProperties": false }} />

### Promotion

The promotion entity tracks internal promotional content such as banners, sliders, or featured product showcases.

<SchemaProperties
  overview={{event: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a promotion entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "promotion", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "description" : "The ID of the promotion.", "type": "string", "maxLength": 4096 }, "name": { "description" : "The name of the promotion.", "type": [ "string", "null" ], "maxLength": 256 }, "product_ids" : { "description" : "Array of SKUs or product IDs showcased in the promotion.", "type" : [ "array", "null" ], "items" : { "type" : "string", "maxLength": 4096 } }, "position": { "description" : "The position the promotion was presented in a list of promotions E.g. banner, slider.", "type" : [ "integer", "null" ], "minimum": 0, "maximum": 9999999 }, "creative_id": { "description" : "Identifier/Name/Url for the creative presented on the promotion.", "type" : [ "string", "null" ], "maxLength": 4096 }, "type": { "description": "Type of the promotion delivery mechanism. E.g. popup, banner, intra-content", "type": [ "string", "null" ], "maxLength": 256 }, "slot": { "description": "The website slot in which the promotional content was added to. E.g. Identifier for slot sidebar-1, intra-content-2", "type": [ "string", "null" ], "maxLength": 256 } }, "required": [ "id" ], "additionalProperties": false }} />

### Refund

The refund entity captures information about a transaction refund, including the amount refunded and the reason for the refund.

<SchemaProperties
  overview={{event: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a refund in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "refund", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "transaction_id": { "description": "The ID of the transaction.", "type": "string", "maxLength": 4096 }, "currency": { "description" : "The currency in which the product is being priced (ISO 4217).", "type" : "string", "maxLength": 3, "minLength": 3 }, "refund_amount" : { "type": "number", "description": "The monetary amount refunded.", "multipleOf": 0.01, "minimum": 0.00, "maximum": 9999999 }, "refund_reason": { "type": [ "string", "null" ], "description": "Reason for refunding the whole or part of the transaction.", "maxLength": 4096 } }, "required": [ "transaction_id", "currency", "refund_amount" ], "additionalProperties": false }} />

### Transaction

The transaction entity contains details about a completed purchase, including revenue, payment method, shipping costs, and applied discounts.

<SchemaProperties
  overview={{event: false}}
  example={{
    transaction_id: 'TtlZ3b',
    currency: 'EUR',
    payment_method: 'BNPL',
    revenue: 13,
    total_quantity: 1,
    credit_order: null,
    discount_amount: null,
    discount_code: null,
    shipping: 1,
    tax: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a transaction entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "transaction", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "transaction_id": { "description": "The ID of the transaction.", "type": "string", "maxLength": 4096 }, "revenue" : { "type": "number", "description": "The revenue of the transaction.", "multipleOf": 0.01, "minimum": 0.00, "maximum": 9999999 }, "currency": { "type": "string", "description": "The currency used for the transaction (ISO 4217).", "maxLength": 3, "minLength": 3 }, "payment_method": { "type": "string", "description": "The payment method used for the transaction.", "maxLength": 128 }, "total_quantity": { "type": "integer", "description": "Total quantity of items in the transaction.", "minimum": 0, "maximum": 9999999 }, "tax": { "type": ["number","null"], "description": "Total amount of tax on the transaction.", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "shipping": { "type": ["number", "null"], "description": "Total cost of shipping on the transaction.", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "discount_code": { "type": [ "string", "null" ], "description": "Discount code used.", "maxLength": 99 }, "discount_amount": { "type": ["number","null"], "description": "Discount amount taken off.", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "credit_order": { "type" : ["boolean","null"], "description": "Whether the transaction is a credit order or not." } }, "required": [ "transaction_id", "revenue", "payment_method", "currency", "total_quantity" ], "additionalProperties": false }} />

### Transaction error

The transaction error entity captures information about failed transactions, including error codes, descriptions, and error types.

<SchemaProperties
  overview={{event: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a transaction error or rejection entity in ecommerce.", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "transaction_error", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "error_code": { "type": [ "string", "null" ], "description": "Error-identifying code for the transaction issue. E.g. E522", "maxLength": 256 }, "error_shortcode" : { "type": [ "string", "null" ], "description": "Shortcode for the error occurred in the transaction. E.g. declined_by_stock_api, declined_by_payment_method, card_declined, pm_card_radarBlock", "maxLength": 4096 }, "error_description": { "type": [ "string", "null" ], "description": "Longer description for the error occurred in the transaction.", "maxLength": 4096 }, "error_type": { "type": [ "string", "null" ], "enum": [ "hard", "soft", null ], "description": "Hard error types mean the customer must provide another form of payment e.g. an expired card. Soft errors can be the result of temporary issues where retrying might be successful e.g. processor declined the transaction." }, "resolution": { "type": [ "string", "null" ], "description": "The resolution selected for the error scenario. E.g. retry_allowed, user_blacklisted, block_gateway, contact_user, default", "maxLength": 4096  } }, "additionalProperties": false }} />

## Global ecommerce entities

You can configure the ecommerce `user` and `page` entities to automatically attach to **all** Snowplow events tracked by the tracker, not just the ecommerce events. This is useful if you want to have ecommerce user and page information available across your entire dataset.

### Page

The page entity describes the type of ecommerce page being viewed, such as homepage, product page, or checkout page.

<SchemaProperties
  overview={{event: false}}
  example={{
    type: 'checkout step 1',
    language: null,
    locale: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a page entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "page", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "type": { "description": "The type of the page that was visited E.g. homepage, product page, checkout page.", "type": "string", "maxLength": 128 }, "language": { "description": "The language that the web page is based in.", "type" : [ "string", "null" ], "maxLength": 128 }, "locale": { "description": "The locale version of the site that is running.", "type": [ "string", "null" ], "maxLength": 128 } }, "required": [ "type" ], "additionalProperties": false }} />

### User

The user entity provides information about the user making the purchase, including their ID, email address, and whether they're a guest.

<SchemaProperties
  overview={{event: false}}
  example={{
    id: 'U12345',
    email: 'john@email.com',
    is_guest: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an user entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "user", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "description" : "The user ID.", "type": "string", "maxLength": 128 }, "is_guest": { "description": "Whether or not the user is a guest.", "type": [ "boolean", "null" ] }, "email" : { "description" : "The user's email address.", "type": [ "string", "null" ], "maxLength": 256 } }, "required": [ "id" ], "additionalProperties": false }} />

## Legacy ecommerce events

Some Snowplow trackers also provide tracking calls for older ecommerce events. We strongly recommend using the new ecommerce tracking API instead.

The legacy transaction events populate the [transaction atomic event properties](/docs/fundamentals/canonical-event/index.md#legacy-ecommerce-fields): `tr_` fields for transaction events and `ti_` fields for transaction item events.

Transaction event properties:

| **Parameter** | **Table Column** | **Type** | **Description**                                     | **Example values** |
| ------------- | ---------------- | -------- | --------------------------------------------------- | ------------------ |
| `tr_id`       | `tr_orderid`     | text     | Order ID                                            | `12345`            |
| `tr_af`       | `tr_affiliation` | text     | Transaction affiliation (e.g. channel)              | `Web`              |
| `tr_tt`       | `tr_total`       | decimal  | Transaction total value                             | `9.99`             |
| `tr_tx`       | `tr_tax`         | decimal  | Transaction tax value (i.e. amount of VAT included) | `1.98`             |
| `tr_sh`       | `tr_shipping`    | decimal  | Delivery cost charged                               | `3.00`             |
| `tr_ci`       | `tr_city`        | text     | Delivery address: city                              | `London`           |
| `tr_st`       | `tr_state`       | text     | Delivery address: state                             | `Denver`           |
| `tr_co`       | `tr_country`     | text     | Delivery address: country                           | `United Kingdom`   |
| `tr_cu`       | `tr_currency`    | text     | Transaction Currency                                | `GBP`              |

Transaction item event properties:

| **Parameter** | **Table Column** | **Type** | **Description** | **Example values** |
| ------------- | ---------------- | -------- | --------------- | ------------------ |
| `ti_id`       | `ti_orderid`     | text     | Order ID        | `12345`            |
| `ti_sk`       | `ti_sku`         | text     | Item SKU        | \`pbz0025'         |
| `ti_nm`       | `ti_name`        | text     | Item name       | `black-tarot`      |
| `ti_ca`       | `ti_category`    | text     | Item category   | `tarot`            |
| `ti_pr`       | `ti_price`       | decimal  | Item price      | `7.99`             |
| `ti_qu`       | `ti_quantity`    | integer  | Item quantity   | `2`                |
| `ti_cu`       | `ti_currency`    | text     | Currency        | `USD`              |
