---
title: "Tracking design best practice guide"
sidebar_label: "Tracking design best practice"
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

## What is a tracking plan?

A tracking plan is documentation that adds a semantic layer to the events your business is interested in tracking. For each event, it defines:

* A description of the event, including:
  * The trigger for the event
  * Why it should be tracked
  * Often, screenshots for illustration
* What data is captured with the event, and its structure
  * Which events, entities, and properties are included
* The origin of the data, i.e. what platforms or apps this data is created by
* The implementation status of the tracking
* Other relevant information

Each tracking plan groups related business events.

![Tracking plan overview showing the relationship between tracking plans, event specifications, data structures](images/tracking-plan-overview.png)

This diagram shows how tracking plans are represented in Snowplow Console. A **tracking plan** represents a tracking plan. It's a container for related event specifications. An **event specification** represents a single business event. It contains all the relevant information about the event, including its purpose, origin, and associated data structures. **Event and entity data structures** represent the JSON schemas that define the structure of the captured data.

:::info Tracking plans in Console
Snowplow customers can create tracking plans directly in [Snowplow Console](https://console.snowplowanalytics.com) using [tracking plans](/docs/event-studio/tracking-plans/index.md) and [event specifications](/docs/event-studio/event-specifications/index.md).
:::

## Naming conventions for tracking plans

A common standard for naming and structuring events, entities, and properties makes it easier to understand and extend your tracking design.

Here are our recommendations, but it's more important to be consistent across your tracking plans than to follow these guidelines:

* **Snake case**: use snake case for both the schema and properties. This means using underscores rather than hyphens to separate words, for example `click_image` not `click-image`. Using snake case ensures that the names are consistent with how the properties end up in the warehouse. Some warehouses convert property names to snake case regardless of how they're defined in the schemas.
* **Verb-noun convention**: use the verb-noun convention for event names. For instance, `add_to_cart` and `play_video`, rather than `cart_add` and `video_play`.
* **Self-explanatory event names**: the name of the event should explain what it does. For example, use an event called `click_list_item`, rather than an `action` event with a `type` property of `click_list_item`.
* **Consistent tense**: be consistent about the tense (present or past) for event and property names. For example, `play` and `pause` events, instead of `played` and `pause` which mix past and present tense.
* **Singular names**: use singular in the entity name. For example, `product` instead of `products`.
* **Avoid nesting**: prefer not to use nested objects in the JSON schema, as this can make it more difficult to work in the warehouse.

## Create a tracking plan

We recommend taking the following steps to create a tracking plan:

1. Analyze the business use case and define the reports to be produced
2. Check our out-of-the-box tracking plans to see if you can reuse or build on top of them
3. Choose the naming convention to follow in your schemas
4. Define your entities first
5. Introduce events as interactions of the entities
6. Bring it all together in a tracking plan

### 1. Analyze your business use case

Identifying and analyzing the business use case is the first step. What business outcomes are you aiming to achieve? Examples include acquiring new customers, increasing the number of signups, or reducing the number of abandoned carts.

What behavior do you want to capture? Thinking about this will help you identify which events and entities to define.

Interview the stakeholders who will consume the data, including the analysts. Try sketching out the reports that you want to create. This includes the derived tables you'll need to model from the raw events.

:::info Example: abandoned carts in ecommerce

For example, if the use case is to identify abandoned carts, you may want the following reports to explore the data:

* What's the frequency of users abandoning carts for different segments of users?
* What are the most commonly abandoned products in carts?
* What leads users to return to the store and continue their purchase?

The planned reports reveal a few reusable entities to track: `user`, `cart`, `product`, and maybe `campaign`.

The analysis also suggests what events you'll need as interactions of these entities: `add product to cart`, `checkout step`, `transaction`, and `page view`.

From here, you can start specifying what exactly the derived tables for these reports should contain.

:::

### 2. Is this use case already supported by Snowplow?

Snowplow trackers and data models include a number of events and entity data structures to cover common use cases. These include:

* User and session identification
* Device and browser information
* Ecommerce events and entities
* Media playback events and entities
* Error and performance tracking

We recommend building on the [out-of-the-box data structures](/docs/events/index.md) whenever possible. This saves time and allows you to make use of the existing Snowplow dbt packages and tooling.

### 3. Start with entities

A good practice when designing tracking is to start with the [entities](/docs/fundamentals/entities/index.md).
Entities contextualize and join events together, and are often the level of analysis a business is interested in e.g., sale, user, organization, or location.

It may not be obvious whether to add some properties to events or entities. In general, it's preferable to place information in entities, as this enables them to be reused across multiple events. This will help with data modeling.

It's fine and common for events to not have any properties. Event properties should be limited to information that's strictly related to the event, and unlikely to be reused elsewhere, e.g. the error message for an application error event.

:::tip Star schema analogy
One way to think about events and entities is by relating them to the [star schema used in data warehouses](https://en.wikipedia.org/wiki/Star_schema): entities can be thought of as the dimension tables, while events map more to the fact tables.

Contain any information that would be represented using dimension tables in entities, rather than events.
:::

If you've already defined other tracking plans, check that you're re-using entities where possible. The more entities that you can re-use across your data, the more consistent and easier it will be to perform analyses.

This is also a good time to consider whether certain data really needs to be captured. Tracking unnecessary information uses extra bandwidth and battery power, and may add extra overhead to manage. You can [evolve](/docs/event-studio/data-structures/version-amend/index.md) your data structures to add more information later. Refer to the business reports identified earlier to be clear on what data needs to be tracked now.

### 4. Define the events

Using the entities, you can start to derive the [events](/docs/fundamentals/events/index.md). Events can be thought of as the interactions between entities that occur at a particular point in time. For example, an `add_item_to_basket` event is an interaction between a `user`, an `item`, and a `basket`.

These questions may help when defining your events:

* Based on the identified business reports, what actions should be captured?
* Which entities go along with the events?
* When should the events happen? What are the triggers of the events?

A common challenge in defining event schemas is the choice of their granularity. Check out the [action grouping](#event-action-granularity) section on this page for advice.

### 5. Finalize the tracking plan

Having identified your events and entities, you can now record them in a tracking plan. Create [event specifications](/docs/event-studio/event-specifications/index.md) in Console to formally document them and manage their lifecycle.

## Event action granularity

A common challenge in defining event schemas is the choice of their granularity. Should you define an event schema for every single action, or choose to group actions into fewer event schemas? This will depend on your business use case.

Here are our recommendations to help you decide.

### Avoid grouping unrelated actions into the same schema

Each event schema should represent a single action, or type of action. To understand why, consider the following example that uses the `website_action` schema for all events on the page.

This structure makes it difficult to understand what the event captures based on the event name. This could hinder collaboration across teams.

Versioning of this schema is not intuitive and has unnecessary overhead, because adding a new event type means updating the schema version for all other types as well. This means that all the tracking needs to be updated, not just for the new action.

This makes the event schemas more difficult to evolve, and may introduce undesired dependencies.

:::warning `website_action` groups unrelated events

It is not obvious from the event name `website_action` what it captures. The event groups together two unrelated actions, which are distinguished by the `type` property.

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "io.snowplow",
    "name": "website_action",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "type": {
      "enum": [
        "view_product",
        "click_list_item"
      ]
    }
  },
  "required": [ "type" ],
  "additionalProperties": false
}
```
:::

A better option is to create two separate schemas:

:::tip `view_product` and `click_list_item` events

Each action is represented using a single event schema.

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "io.snowplow",
    "name": "view_product",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {},
  "additionalProperties": false
}
```

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "io.snowplow",
    "name": "click_list_item",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {},
  "additionalProperties": false
}
```
:::

### Consider the granularity needed for your reporting

When dealing with multiple related events targeting the same type of action, you could choose to define a single event schema or multiple event schemas, depending on how you want to use the data.

Consider the example of tracking button clicks on a page. You could choose to:
* Define separate schemas for each button on the page, for example `contact_button_click`, `event_button_click`, and `checkout_button_click`
* Define a single `button_click` schema for all the button clicks, and specify the button type as a property

Choose based on how you want to use the events in your reports. If they look at the button clicks independently, it may be desirable to use separate schemas. However, if you want to report on interaction across the whole page, it may be preferable to use a single event schema.
