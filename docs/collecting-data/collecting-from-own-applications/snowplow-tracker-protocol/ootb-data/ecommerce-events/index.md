---
title: "E-commerce events"
---

```mdx-code-block
import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"
import TOCInline from '@theme/TOCInline';
```

Snowplow provides support for tracking and modeling events from e-commerce stores directly in our trackers and data models.

<TOCInline toc={toc} maxHeadingLevel={4} />

## Events and context entities

### E-commerce action event

Each ecommerce event is a self-describing event using a single e-commerce action schema.

The events are distinguished by their `type` property, which is different for each Event class tracked.

<SchemaProperties
  overview={{event: true, web: true, mobile: true, automatic: false}}
  example={{
    type: 'list_view',
    name: 'shop the look'
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an Ecommerce action", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "snowplow_ecommerce_action", "format": "jsonschema", "version": "1-0-2" }, "type": "object", "properties": { "type": { "description": "Standard ecommerce actions.", "enum": [ "add_to_cart", "remove_from_cart", "product_view", "list_click", "list_view", "promo_click", "promo_view", "checkout_step", "transaction", "refund", "trns_error" ] }, "name": { "description": "The name of the list presented to the user E.g. product list, search results, shop the look, frequently bought with.", "type": [ "string", "null" ], "maxLength": 128 } }, "required": [ "type" ], "additionalProperties": false }} />

### E-commerce context entities

All tracked e-commerce properties are tracked as context entities.

#### Cart

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
    cart_id: null,
    currency: 'EUR',
    total_value: 12
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a cart entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "cart", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "cart_id": { "description": "The unique ID representing this cart.", "type": ["string","null"], "maxLength": 4096 }, "total_value": { "description": "The total value of the cart after this interaction.", "type": "number", "minimum": 0, "multipleOf": 0.01, "maximum": 9999999 }, "currency": { "description": "The currency used for this cart (ISO 4217).", "type": "string", "maxLength": 3, "minLength": 3 } }, "required": [ "total_value", "currency" ], "additionalProperties": false }} />

#### Checkout step

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
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

#### Page

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
    type: 'checkout step 1',
    language: null,
    locale: null
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a page entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "page", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "type": { "description": "The type of the page that was visited E.g. homepage, product page, checkout page.", "type": "string", "maxLength": 128 }, "language": { "description": "The language that the web page is based in.", "type" : [ "string", "null" ], "maxLength": 128 }, "locale": { "description": "The locale version of the site that is running.", "type": [ "string", "null" ], "maxLength": 128 } }, "required": [ "type" ], "additionalProperties": false }} />

#### Product

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
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

#### Promotion

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a promotion entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "promotion", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "description" : "The ID of the promotion.", "type": "string", "maxLength": 4096 }, "name": { "description" : "The name of the promotion.", "type": [ "string", "null" ], "maxLength": 256 }, "product_ids" : { "description" : "Array of SKUs or product IDs showcased in the promotion.", "type" : [ "array", "null" ], "items" : { "type" : "string", "maxLength": 4096 } }, "position": { "description" : "The position the promotion was presented in a list of promotions E.g. banner, slider.", "type" : [ "integer", "null" ], "minimum": 0, "maximum": 9999999 }, "creative_id": { "description" : "Identifier/Name/Url for the creative presented on the promotion.", "type" : [ "string", "null" ], "maxLength": 4096 }, "type": { "description": "Type of the promotion delivery mechanism. E.g. popup, banner, intra-content", "type": [ "string", "null" ], "maxLength": 256 }, "slot": { "description": "The website slot in which the promotional content was added to. E.g. Identifier for slot sidebar-1, intra-content-2", "type": [ "string", "null" ], "maxLength": 256 } }, "required": [ "id" ], "additionalProperties": false }} />

#### Refund

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a refund in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "refund", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "transaction_id": { "description": "The ID of the transaction.", "type": "string", "maxLength": 4096 }, "currency": { "description" : "The currency in which the product is being priced (ISO 4217).", "type" : "string", "maxLength": 3, "minLength": 3 }, "refund_amount" : { "type": "number", "description": "The monetary amount refunded.", "multipleOf": 0.01, "minimum": 0.00, "maximum": 9999999 }, "refund_reason": { "type": [ "string", "null" ], "description": "Reason for refunding the whole or part of the transaction.", "maxLength": 4096 } }, "required": [ "transaction_id", "currency", "refund_amount" ], "additionalProperties": false }} />

#### Transaction

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
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

#### Transaction error

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a transaction error or rejection entity in ecommerce.", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "transaction_error", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "error_code": { "type": [ "string", "null" ], "description": "Error-identifying code for the transaction issue. E.g. E522", "maxLength": 256 }, "error_shortcode" : { "type": [ "string", "null" ], "description": "Shortcode for the error occurred in the transaction. E.g. declined_by_stock_api, declined_by_payment_method, card_declined, pm_card_radarBlock", "maxLength": 4096 }, "error_description": { "type": [ "string", "null" ], "description": "Longer description for the error occurred in the transaction.", "maxLength": 4096 }, "error_type": { "type": [ "string", "null" ], "enum": [ "hard", "soft", null ], "description": "Hard error types mean the customer must provide another form of payment e.g. an expired card. Soft errors can be the result of temporary issues where retrying might be successful e.g. processor declined the transaction." }, "resolution": { "type": [ "string", "null" ], "description": "The resolution selected for the error scenario. E.g. retry_allowed, user_blacklisted, block_gateway, contact_user, default", "maxLength": 4096  } }, "additionalProperties": false }} />

#### User

<SchemaProperties
  overview={{event: false, web: true, mobile: true, automatic: false}}
  example={{
    id: 'U12345',
    email: 'john@email.com',
    is_guest: true
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for an user entity in Ecommerce", "self": { "vendor": "com.snowplowanalytics.snowplow.ecommerce", "name": "user", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "id": { "description" : "The user ID.", "type": "string", "maxLength": 128 }, "is_guest": { "description": "Whether or not the user is a guest.", "type": [ "boolean", "null" ] }, "email" : { "description" : "The user's email address.", "type": [ "string", "null" ], "maxLength": 256 } }, "required": [ "id" ], "additionalProperties": false }} />

## How to track?

* Using the [JavaScript tracker on the Web](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/ecommerce/index.md).
* Using the [iOS and Android trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/ecommerce-tracking/index.md).

## Modeled data using the snowplow-ecommerce dbt package

[The package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) contains a fully incremental model that transforms raw e-commerce event data into a set of derived tables based around the following e-commerce data objects: carts, checkouts, products and transactions.

Derived table | Table description | dbt
---|---|---
`snowplow_ecommerce_base_events_this_run` | Base: Performs the incremental logic, the table contains a de-duped data set of all events required for the current run of the model, and is the foundation for all other models generated. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_this_run)
`snowplow_ecommerce_cart_interactions` | Carts: Parses the cart interactions that occur to provide handy filters and aggregations, which helps identify what happened to carts on a session level to extract, for example, abandoned carts with ease. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_cart_interactions)
`snowplow_ecommerce_checkout_interactions` | Checkouts: Parses checkout steps that occur to provide handy filters and aggregations to help identify which checkout steps were walked through, and what details were entered in each of these steps. This lends itself well to a funnel analysis. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_checkout_interactions)
`snowplow_ecommerce_product_interactions` | Products: Parses product view and list information to provide insights into which products were being viewed, what details were being shown to the end user and how the user then interacted with these products. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_product_interactions)
`snowplow_ecommerce_transaction_interactions` | Transactions: Parses transaction actions to provide insights into which transactions occurred, how much revenue was generated from them, and other insights leveraging the many properties of the transaction e-commerce context. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_transaction_interactions)
`snowplow_ecommerce_sessions` | Sessions: Aggregates all other data into a sessions table which leverages the  `domain_sessionid`. | [Docs](https://snowplow.github.io/dbt-snowplow-ecommerce/#!/model/model.snowplow_ecommerce.snowplow_ecommerce_sessions)

## E-commerce analytics accelerator

Follow the [e-commerce accelerator](https://snowplow.io/data-product-accelerators/ecommerce-analytics-dpa/) for a complete guide to build a deeper understanding of customer behavior in your ecommerce store.

<details>
  <summary>Old e-commerce events</summary>
  <div>

Some of our trackers also provide ecommerce tracking APIs for older ecommerce events. This is no longer the recommended approach to track ecommerce events.

#### Transaction tracking

Transaction events allow you to track a transaction. The items of the transaction can be tracked using [Transaction Item events](#transaction-item-events).

| **Parameter** | **Table Column**      | **Type** | **Description**                                      | **Example values** |
|----------------|----------|------------------------------------------------------|--------------------|
| `tr_id`       | `tr_orderid`     | text     | Order ID                                             | `12345`            |
| `tr_af`       | `tr_affiliation` | text     | Transaction affiliation (e.g. channel)               | `Web`              |
| `tr_tt`       | `tr_total`       | decimal  | Transaction total value                              | `9.99`             |
| `tr_tx`       | `tr_tax`         | decimal  | Transaction tax value (i.e. amount of VAT included)  | `1.98`             |
| `tr_sh`       | `tr_shipping`    | decimal  | Delivery cost charged                                | `3.00`             |
| `tr_ci`       | `tr_city`        | text     | Delivery address: city                               | `London`           |
| `tr_st`       | `tr_state`       | text     | Delivery address: state                              | `Denver`           |
| `tr_co`       | `tr_country`     | text     | Delivery address: country                            | `United Kingdom`   |
| `tr_cu`       | `tr_currency`    | text     | Transaction Currency                                 | `GBP`              |

#### Transaction item events

Transaction item events are separate events, representing the items of a transaction, which are linked to a Transaction event via `ti_id` which should map to `tr_id` of a transaction event.

| **Parameter** | **Table Column**  | **Type** | **Description**  | **Example values** |
|---------------|---------------|----------|------------------|--------------------|
| `ti_id`       | `ti_orderid`  | text     | Order ID         | `12345`            |
| `ti_sk`       | `ti_sku`      | text | Item SKU | Yes | \`pbz0025' |
| `ti_nm`       | `ti_name`     | text | Item name | Yes | `black-tarot` |
| `ti_ca`       | `ti_category` | text | Item category | Yes | `tarot` |
| `ti_pr`       | `ti_price`    | decimal | Item price | Yes | `7.99` |
| `ti_qu`       | `ti_quantity` | integer | Item quantity | Yes | `2` |
| `ti_cu`       | `ti_currency` | text | Currency | Yes | `USD` |

  </div>
</details>
