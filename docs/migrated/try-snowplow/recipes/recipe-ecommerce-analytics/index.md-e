---
title: "Tutorial: E-commerce analytics"
date: "2020-10-12"
sidebar_position: 40
---

## Introduction

Snowplow empowers you to collect granular data from your e-commerce store. Specifically, you'll want to capture all types of product interactions, such as product views, add to carts, remove from carts and purchases. Aggregating these events into a table of one row per product will allow you to easily see how the different products are performing.

## What you'll be doing

You have already set up Snowplow’s out of the box web tracking by instrumenting the Javascript Tracker in your application. This includes tracking `page_view` and `page_ping` events.

To understand how people are engaging with your products, you’ll want to make a couple of tracking additions:

- You’ll want to be able to tie all of the events you are capturing to specific products, not just pages; to achieve this you'll attach a product entity to all of your product-related events. Learn more about Snowplow events and entities [here](/docs/migrated/understanding-tracking-design/understanding-events-entities/).
- You'll want to extend this tracking to include cart actions and purchases; for this purpose, we've created a couple of custom events for you to instrument.

You can then run a simple SQL query to model this data into a product table. This is straightforward as the information about the product is always captured in the same place across events, in the product entity.

## Designing and implementing the `product` entity

#### Designing the `product` entity

We have already created a custom `product` entity for you, and uploaded its data structure to [your Iglu server](/docs/migrated/pipeline-components-and-applications/iglu/iglu-resolver/).

Snowplow uses self-describing JSON schemas to structure events and entities so that they can be validated in the pipeline and loaded into tidy tables in the warehouse. You can learn more about these data structures [here](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/), and about why we take this approach [here](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/).

While Try Snowplow only ships with a pre-designed set of custom events and entities required for the recipes, Snowplow BDP lets you create an unlimited number of your own via the [Data Structures UI](/docs/migrated/understanding-tracking-design/managing-data-structures/) (and API).

The `product` entity has the following fields:

<table><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td><td><strong>Validation</strong></td><td><strong>Required?</strong></td></tr><tr><td><code>name</code></td><td>The name of the piece of content</td><td>string</td><td><code>maxLength: 255</code></td><td>✅&nbsp;</td></tr><tr><td><code>price</code></td><td>The current price of the product</td><td>number</td><td><code>minimum: 0</code><br/><code>maximum: 100000 multipleOf: 0.01</code></td><td>✅</td></tr><tr><td><code>quantity</code></td><td>The number of this product (used in basket events)</td><td>integer</td><td><code>minimum: 0 maximum: 100000</code></td><td>✅</td></tr><tr><td><code>category</code></td><td>The category of the product</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr><tr><td><code>sku</code></td><td>The SKU for the product</td><td>string</td><td><code>maxLength: 255</code></td><td>❌</td></tr></tbody></table>

#### Implementing the `product` entity

#### In the Javascript Tracker

Add the product entity to your `page_view` and `page_ping` events by editing your `trackPageView` events to include the entity. Specifically, you'll update

```
window.snowplow('trackPageView');
```

to

```
window.snowplow('trackPageView', { 
   "context": [{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "example_name",
         "quantity": 1,
         "price": 100,
         "category": "example_category",
         "sku": "example_sku"
     }
   }]
});
```

#### Via Google Tag Manager

If you are using Google Tag Manager, you can add the variables like so:

```
window.snowplow('trackPageView', {
   "context": [{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "{{example_name_variable}}",
	 "quantity": {{example_quantity_variable}},
	 "price": {{example_price_variable}},
	 "category": "{{example_category_variable}}",
	 "sku": "{{example_sku_variable}}"
      }
   }]
});
```

## Designing and implementing the `cart_action` event

#### Designing the `cart_action` event

The `cart_action` event records actions that the user performs to their cart. In this simplified version you'll be recording a single property that describes whether an item was added or removed.

<table><tbody><tr><td><strong>Field</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td><td><strong>Validation</strong></td><td><strong>Required?</strong></td></tr><tr><td><code>type</code></td><td>The type of action taken by the user</td><td>string</td><td><code>enum: ["add", "remove</code>"]</td><td>✅&nbsp;</td></tr></tbody></table>

#### Implementing the `cart_action` event

When you trigger the `cart_action` event, you'll also want to attach the `product` entity that we designed earlier to describe which product is being changed in the cart.

Instrument the `cart_action` event when items are added to or removed from the cart on your website.

```
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:com.trysnowplow/cart_action/jsonschema/1-0-0",
      "data": {
         "type": "add" // or "remove"
      }
   },
   "context": [{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "example_name",
         "quantity": 1,
	 "price": 100,
	 "category": "example_category",
	 "sku": "example_sku"
      }
   }]
});
```

## Designing and implementing the `purchase` event

#### Designing the `purchase` event

The `purchase` event is a simple event that should be triggered when a purchase is made.

The event itself has no properties, but should be sent with one or more `product` entities that describe which products were purchased.

#### Implementing the `purchase` event

When you trigger the `purchase` event, you'll want to attach one or more of the `product` entity to describe what has been purchased.

Instrument the `purchase` event when a purchase is made in your store.

#### Example for a single product purchase

```
window.snowplow('trackSelfDescribingEvent', { 
   "event": {
      "schema": "iglu:com.trysnowplow/purchase/jsonschema/1-0-0",
      "data": {}
   },
   "context": [{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "example_name",
	 "quantity": 1,
	 "price": 100,
	 "category": "example_category",
	 "sku": "example_sku"
      }
   }]
});
```

#### Example for a multi-product purchase

```
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:com.trysnowplow/purchase/jsonschema/1-0-0",
      "data": {}
   },
   "context": [{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "example_name",
         "quantity": 1,
         "price": 100,
         "category": "example_category",
         "sku": "example_sku"
     }
   },{
      "schema": "iglu:com.trysnowplow/product/jsonschema/1-0-0",
      "data": {
         "name": "example_name_2",
         "quantity": 1,
         "price": 50,
         "category": "example_category_2",
         "sku": "example_sku_2"
     }
  }]
});
```

## Modeling the data you've collected

#### What does the model do?

The tracking above captures events about the user's product purchasing journey, and attaches the context of which product was engaged with to all events you are firing. You can now start to get a better understanding of how your products are performing.

For this recipe you'll create a simple table describing product engagement. Specifically, for each product you'll aggregate the number of product views, add to carts, remove from carts and purchases, as well as the revenue earned.

Once you have collected some data with your new tracking you can run the following two queries in your tool of choice.

#### First generate the table:

```
CREATE TABLE derived.products AS(

    SELECT
        p.category AS product_category, 
        p.name AS product_name, 
        p.sku AS product_sku,
        p.price AS product_price,
        SUM(CASE WHEN ev.event_name = 'page_view' THEN 1 ELSE 0 END) AS product_views,
        SUM(CASE WHEN ev.event_name = 'cart_action' AND ca.type = 'add' THEN p.quantity ELSE 0 END) AS add_to_carts,
        SUM(CASE WHEN ev.event_name = 'cart_action' AND ca.type = 'remove' THEN p.quantity ELSE 0 END) AS remove_from_carts,
        SUM(CASE WHEN ev.event_name = 'purchase' THEN p.quantity ELSE 0 END) AS purchases,
        SUM(CASE WHEN ev.event_name = 'purchase' THEN 1 ELSE 0 END * p.quantity * p.price) AS revenue

    FROM atomic.events AS ev
    INNER JOIN atomic.com_trysnowplow_product_1 AS p
        ON ev.event_id = p.root_id AND ev.collector_tstamp = p.root_tstamp
    LEFT JOIN atomic.com_trysnowplow_cart_action_1 AS ca
        USING(root_id,root_tstamp)

    WHERE ev.event_name IN ('page_view', 'cart_action', 'purchase')

    GROUP BY 1,2,3,4

);
```

#### And then view it:

```
SELECT * FROM derived.products;
```

## Let's break down what you've done

- You have captured granular data around how your users are engaging with your products throughout their purchasing journeys.
- You have modeled this data into a product engagement table that surfaces the user engagement per product.

## What you might want to do next

Understanding how your users are engaging with your products is the first step in optimizing your e-commerce store. Next, you might want to

- Extend this table to include returns by joining this data with data from your transactional databases, so you get a more accurate picture of how products are actually performing.
- Extend this table to include where these products are being promoted on your site to understand how visual merchandising affects performance.
- Join this data with your inventory data to get a 360 view of e-commerce strategy.
- Start mapping the relationships between products based on user behaviour, working towards compelling product recommendations.
- Pivot this data to look at users instead: understand which marketing channels customers come from, and their customer lifetime value.
- Etc.

To learn more about Snowplow for retail and e-commerce, check out [our blog series on the topic](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/)!
