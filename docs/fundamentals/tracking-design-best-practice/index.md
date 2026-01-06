---
title: "Introduction to tracking design"
sidebar_label: "Tracking design"
date: "2020-02-15"
sidebar_position: 8
description: "Learn how to design effective behavioral data tracking by analyzing use cases, defining entities and events, and creating comprehensive tracking plans."
keywords: ["tracking design", "event tracking", "entity design", "tracking plan", "schema design"]
---

Good tracking design is essential for successful data collection. This guide will help you approach the design process systematically.

To use Snowplow successfully, you need to have a good idea of:

* What events you care about in your business
* What events occur in your website, mobile application, or server-side systems
* What decisions you make based on those events
* What you need to know about those events to make those decisions

The final outcome of your planning will be a set of tracking plans.

## Snowplow tracking concepts

![Tracking plan overview showing the relationship between tracking plans, event specifications, data structures](images/tracking-plan-overview.png)

This diagram shows how tracking plans are represented in Snowplow Console.
 * **Tracking plans** are containers for related event specifications. They were previously named "data products".
 * **Event specification** represents a single business event. It contains all the relevant information about the event, including its purpose, origin, and associated data structures. Each has a single event data structure to define the event's properties, and can have multiple associated entity data structures.
 * **Event and entity data structures** define the structure of the captured data to allow in JSON schemas for consistent data collection and analysis.
 *
:::info Tracking plans in Console
Snowplow customers can create [tracking plans](/docs/event-studio/tracking-plans/index.md) and [event specifications](/docs/event-studio/event-specifications/index.md) directly in [Snowplow Console](https://console.snowplowanalytics.com).
:::

For example, an `Ecommerce Checkout Flow` data product may contain three event specifications:
* `Checkout Started` with a `checkout_started` event data structure and associated `cart` entity
* `Product Add To Cart` with an `add_to_cart` event data structure and associated `cart` and `product` entities
* `Order Completed` with an `order_completed` event data structure and associated `cart`, `product`, `order` and `payment` entities

Note that the `cart` entity data structure is reused across event specifications, this promotes consistency in your tracking design and makes analysis easier.

Additionally you can assign entities to [source applications](/docs/event-studio/source-applications/index.md) to document which entities are expected for each event within that application, these are also called [global entities](/docs/sources/web-trackers/custom-tracking-using-schemas/global-context/index.md). An example would be assigning a `user` entity to a mobile application to ensure that user information is always captured with events from that application.

## Naming conventions for tracking plans

A common standard for naming and structuring events, entities, and properties makes it easier to understand and extend your tracking design.

Here are our recommendations, but it's more important to be consistent across your tracking plans than to follow these guidelines:

For Data Products:
* Use a descriptive name in title case that reflects the business domain, application, or use-case, e.g., `Ecommerce Checkout Flow`, `Mobile App User Engagement`, `SaaS Application Usage`

For Event Specifications:
* Use a verb-noun format in title case that clearly describes the action, e.g., `Add To Cart`, `User Signup`, `Purchase Completed`
* Be consistent with tense (e.g., all present or all past tense)
* Ensure each event specification represents a single event that has a clear purpose

For Event and Entity Data Structures:
* Use snake_case for names, e.g., `add_to_cart`, `user_signup`, `purchase_completed`
* Use clear, descriptive names that reflect the purpose of the data structure

For Properties:
* Use snake_case for property names, e.g., `user_id`, `product_name`,
* Be specific and descriptive to avoid ambiguity, e.g., use `purchase_amount` instead of just `amount`
* Do not repeat information contained in the data structure name, e.g., avoid `order_id` in an `order` entity

## Data product best practices

Data Products are logical groupings of related business events with defined ownership. They help organize your tracking design and make it easier to manage and analyze your data.

When defining Data Products, consider who will own the data and what business domain or use-case the events relate to. If you have multiple teams or departments, it can be helpful to align Data Products with those organizational structures. Additionally, those teams can reflect implementation ownership or analysis ownership.

Examples of Data Products include:
* `Ecommerce Checkout Flow`: contains events related to the checkout process in an e-commerce application
* `Mobile App User Engagement`: contains events related to user interactions within a mobile application
* `SaaS Application Usage`: contains events related to user actions within a SaaS platform

Bad examples of Data Products would be overly broad or vague groupings, such as `All User Events` or `Miscellaneous Events`, which do not provide clear context or ownership. Another example would be overly specific groupings that limit reusability, such as `Product Page Views for Campaign X`.

When defining Data Products, consider the following best practices:
* **Clear purpose**: each Data Product should have a well-defined purpose and scope
* **Ownership**: assign clear ownership to each Data Product to ensure accountability for data quality and governance
* **Logical grouping**: group related events that share a common business domain or use-case. Consider a group that reflects how the data will be used in analysis.
* **Reusability**: design Data Products to promote reusability of event and entity data structures across different tracking plans

## Event Specification best practices

Event Specifications represent the key business events you are tracking. They contain a name, description, trigger conditions, and associated data structures. Event Specifications are designed to represent a single event to be implemented and analyzed. Each Event Specification should have one primary purpose.

For example, an `Add To Cart` Event Specification would represent the action of a user adding a product to their shopping cart. It would include:
* A clear name: `Add To Cart`
* A description of the event's purpose: "tracks when a user adds a product to their shopping cart"
* Trigger conditions: "fired when the user clicks the 'Add to Cart' button on a product page"
* Associated data structures: an `add_to_cart` event data structure and associated `product` and `cart` entity data structures

A bad example would be an `Ecommerce Action` Event Specification that tries to capture multiple actions like adding to cart, starting checkout, and completing a purchase in a single event. This can lead to confusion in implementation and complexity in analysis.

## Entity design best practices

**It is recommended that you adopt an "entity-first" approach to design**. This means starting by defining the key entities in your business domain before defining the events that interact with those entities. This approach helps ensure consistency and reusability across your tracking design.

If a piece of information is likely to be relevant to multiple different events, it belongs in an entity, not as a property of a single event. In fact, we often recommend not including any properties directly on event data structures, and instead placing all information in entities unless truly necessary.

Examples of common entities include:
* `user`: information about the user performing the action
* `product`: details about a product being viewed or purchased
* `cart`: information about a shopping cart
* `order`: details about an order being placed

## Event data structure granularity

A common challenge in defining event schemas is the choice of their granularity. We see customers struggle with this decision frequently in their tracking design.

### Approach 1: Group multiple actions into a single event schema

In some cases, it may be beneficial to group related actions into a single event schema. This means that a single event schema captures multiple types of actions, often distinguished by a property within the schema.

For example, you might define a single `ecommerce_action` event schema that includes a `type` property to distinguish between `view_product`, `add_to_cart`, `checkout_started`, and `purchase_completed` actions. Another example could be a `user_interaction` event schema that captures various user actions like `click`, `scroll`, and `form_submit`, with a `interaction_type` property to differentiate them.

This approach can be useful when:
* **Analysis**: the actions are closely related and often analyzed together
* **Simplicity**: you want to reduce the number of event schemas and columns in your data warehouse

Continuing the example from above, it is important to ensure the correct `type` property is set for each action and the allowed values are enforced through strong governance principles. This can be managed in Snowplow through Event Specifications with [property instructions](/docs/event-studio/event-specifications/ui/index.md#properties). Tools like [Snowtype](/docs/event-studio/snowtype/index.md) can also help simplify this complexity during implementation.

### Approach 2: One event schema per action

Defining a separate event schema for each action is often the most straightforward approach. This means that each event schema corresponds to a single user action or system event.

For example, in an ecommerce application, you might have separate event schemas for:
* `view_product`
* `add_to_cart`
* `checkout_started`
* `purchase_completed`

This approach has several advantages:
* **Clarity**: each event schema has a clear purpose, making it easier to understand
* **Flexibility**: you can evolve each event schema independently, without affecting others

However, this approach may lead to a large number of event schemas if your application has many distinct actions and can make analysis more complex.
