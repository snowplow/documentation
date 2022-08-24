---
title: "Understanding events and entities"
date: "2020-02-13"
sidebar_position: 20
---

**Snowplow** is an _event collection platform_. Once you have set up one or more [Snowplow trackers](/docs/collecting-data/index.md), every time an event occurs, Snowplow will generate a packet of data to describe the event and send that event into your Snowplow data pipeline.

## What is an event?

An **event** signifies an action for which we gave a specific name and we are interested in a set of data characterising the event. For example:

An **event** is something that occurred in a particular point in time. Examples of events include:

- Load a web page
- Add an item to basket
- Enter a destination
- Check a balance
- Search for an item
- Share a video

## What is an entity?

An **entity** (aka context) describes the setting in which an **event** has taken place.

When an **event** occurs, it generally involves a number of **entities** (aka contexts), and takes place in a particular setting. Those entities give the event extra context.

Let's take the example of a search event. It may have the following entities associated with it:

1. A user entity, who performed the search
2. A web page in which the event occurred
3. A variation on the web page that was part of an A/B test
4. A set of products that were returned from the search

All the above are examples of the context in which the event happened, described by entities.

What makes contexts interesting is that they are common across multiple different event types. For example, the following events for a retailer will all involve a "product" context:

- View product
- Select product
- Like product
- Add product to basket
- Purchase product
- Review product
- Recommend product

Our retailer might want to describe product using a number of fields including:

- SKU
- Name
- Unit price
- Category
- Tags

Rather than define all the set of product-related fields for all the different product-related events in their respective schemas, they would define the product entity with a single schema, and pass this as a context with any product related event.

Contexts provide a convenient way in Snowplow to schema common entities once, and then use those schemas across all the different events where those entities are relevant.

Moreover, _multiple_ contexts of either different or the same type can be sent with a single event. For example, you could send multiple product impressions (one for each product) with a page view event (say, if a user has loaded a catalogue page) or a transaction event (if a user has multiple line items in a transaction).
