---
title: "Tracking Design Best Practice"
date: "2025-11-26"
sidebar_position: 8
description: "Learn how to design effective behavioral data tracking by analyzing use cases, defining entities and events, and creating comprehensive tracking plans."
keywords: ["tracking design", "event tracking", "entity design", "tracking plan", "schema design"]
---

Good tracking design is essential for successful data collection with Snowplow. This guide will help you approach the design process systematically by analyzing your business use cases, defining your data structures, and documenting your implementation.

## Understanding your tracking needs

To use Snowplow successfully, you need to have a good idea of:

* What events you care about in your business
* What events occur in your website, mobile application, or server side systems
* What decisions you make based on those events
* What you need to know about those events to make those decisions

Based on our experience, we recommend taking the following steps:

1. Analyze the business use case and define the reports to be produced
2. Check our out-of-the-box data products to see if you can reuse or build on top of them
3. Choose the naming convention to follow in your schemas
4. Define your entities first
5. Introduce events as interactions of the entities
6. Bring it all together in a tracking plan

## Tracking plans

A **Tracking Plan** is a comprehensive document that adds a semantic layer to the events your business is interested in tracking. For each event, it defines:

* A description of the event, often illustrated with screenshots
* The data that is captured with the event, and its structure
* The origin of the data (what platforms or apps this data is created by)
* Other relevant information

:::info
Snowplow customers can create tracking plans directly in Snowplow Console by using [Data Products](/docs/data-product-studio/data-products/index.md) and [Event Specifications](/docs/data-product-studio/event-specifications/index.md).
:::

![Tracking plan overview showing the relationship between data products, event specifications, data structures](/img/tracking-plan-overview.png)

This diagram shows how tracking plans are represented in Snowplow Console.
* A **Data Product** represents a tracking plan. It is a container for related event specifications that belong to the same tracking plan.
* An **Event Specification** represents a single business event in the tracking plan. It contains all the relevant information about the event, including its purpose, origin, and associated data structures.
* **Event and Entity Data Structures** represent the JSON schemas that define the structure of the data captured by the events and are validated by the Snowplow pipeline.

## Step 1: Analyze your business use case and define reports

Good tracking design comes from an understanding of the business use case. Identifying and analyzing the use case should be the first step before you design your tracking. This involves identifying the business outcomes that you want to achieve (for example, acquire new customers, increase the number of signups, minimize abandoned carts). It can often be answered by interviewing stakeholders who will consume the data in your organization. These are not only the end stakeholders but also the analysts who are the experts in the data.

One of the ways to think about this is to sketch the reports that you want to have - the derived tables that the modeling process will extract from the raw events. Based on the reports, you can identify the entities, events, and SQL queries to be performed on top of them.

:::tip Example – abandoned carts in e-commerce

For example, if one of the use cases is to identify abandoned carts, we may want the following reports to explore the data:

* What is the frequency of users abandoning carts for different segments of users?
* What are the most commonly abandoned products in carts?
* What leads users to return to the store and continue their purchase?

We need to go deeper into specifying what exactly the derived tables for these reports should contain.
However, we can already see a few reusable entities that we need to track: user, cart, product, page referrer.
The reports can also tell us what events we'll need as interactions of these entities: add product to cart, checkout step, transaction, page view.

:::

## Step 2: Make use of our out-of-the-box schemas

Snowplow trackers and data models provide a rich set of events and entities to cover common use cases. These include:

* User and session identification
* Device and browser information
* E-commerce events and entities
* Media playback events and entities
* Error and performance tracking

It is recommended to use and build on top of these data structures in order to save effort and make use of the existing Snowplow dbt packages and tooling. To get a comprehensive overview of the out-of-the-box provided schemas, [refer to the events documentation](/docs/events/index.md).

## Step 3: Choose your naming convention

Having a common standard for how to name events, entities and properties makes it easier to understand and extend the tracking design. The following are our recommendations, but in general, it's more important to be consistent across your schemas than to follow these recommendations:

* **Snake case**: use snake case for both the schema and properties. This ensures that the names are consistent with how the properties end up in the warehouse (for some warehouses, property names are converted to snake case regardless of how they are defined in the schemas). Avoid using hyphens to separate words, instead use underscores
* **Verb-noun convention**: use the verb-noun convention for event names. For instance, `add_to_cart`, `play_video`
* **Consistent tense**: be consistent about the tense (present or past) for event and property names. For example, `play` and `pause` events, instead of `played` (past tense) and `pause` (present tense)
* **Singular names**: use singular in the entity name (for example, `product` instead of `products`)
* **Avoid nesting**: prefer not to use nested objects in the JSON schema as this can make it more difficult to work in the warehouse

## Step 4: Start with entities

A good practice when designing tracking is to start with [the entities](/docs/fundamentals/entities/index.md).
Entities contextualize and join events together, and they are often the levels of analysis a business is interested in (e.g., sale, user, organization, location).

It may not be obvious whether some properties should be added to events or entities.
In general, it is preferable to place information in entities as this will enable it to be reused across multiple events.
It may often be the case that events do not have any properties – this is totally fine.
Event properties should be limited only to information that is strictly related to the event and unlikely to be reused elsewhere (e.g., error message for an application error event).

One useful way to think about events and entities is by relating them to the [star schema used in data warehouses](https://en.wikipedia.org/wiki/Star_schema): entities can be thought of as the dimension tables, while events map more to the fact tables. Make sure that information that would be represented using dimension tables is contained in entities rather than events.

Finally, it is a good practice to ask whether certain data really needs to be captured. Tracking unnecessary information uses extra bandwidth and battery power and may add extra overhead to manage. Schemas can be [evolved](/docs/data-product-studio/data-structures/version-amend/index.md) to allow adding more information later. Refer to the business reports identified earlier in order to assess what data needs to be tracked.

:::note Check your existing entities for re-use
Make sure that you are re-using entities that you previously defined in your other data products.
The more entities that you can re-use across your data, the more consistent and easier it will be to perform analyses.
:::

## Step 5: Define the events

Using the entities, you can start to derive the [events](/docs/fundamentals/events/index.md). Events can be viewed as the interactions between entities that occur at a particular point in time (for example, add item to basket, share video, or click on a link).

These questions may help when defining your events:

* Based on the identified business reports, what actions should be captured?
* Which entities go along with the events?
* When should the events happen? What are the triggers of the events?

:::note Event Specifications
Once you have defined your events and which entities they involve, you can create [Event Specifications](/docs/data-product-studio/event-specifications/overview/index.md) in the Snowplow Console to formally document them and manage their lifecycle.
:::

A common challenge in defining event schemas is the choice of their granularity. Should you define an event schema for every single action, or choose to group actions into fewer event schemas? This is a trade-off that does not have a single correct answer. Nevertheless, there are two recommendations that we can give.

### Recommendation 1: Avoid grouping multiple unrelated actions under the same schema

A good rule of thumb is that the name of the event should be representative of what it does without having to look into additional properties.

Consider the following example where we use the `website_action` schema for all events on the page. This makes it difficult to understand what the event captures based on the event name. Also, versioning of the schema is less intuitive, because adding a new event type means updating the schema version for all other types as well. This makes the event schemas more difficult to evolve independently and may introduce undesired dependencies.

<div style={{ width: "100%"}}>

:::warning `website_action` groups unrelated events
It is not obvious from the event name `website_action` what it captures. The event also groups together two unrelated actions that are distinguished by the `type` property.

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

Below is a much better option:

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

</div>
<div style={{ clear: "both" }} />


### Recommendation 2: Consider the granularity needed for your reporting

As stated in the previous recommendation, it is not desirable to group unrelated actions into a single event. However, when dealing with multiple events targeting the same type of action, you may choose to define a single event schema or multiple event schemas depending on how you want to use the data.

Consider the example of tracking button clicks on a page. You need to decide whether to define separate schemas for each button on the page (for example, `contact_button_click`, `event_button_click`) or use a single `button_click` schema for all the button clicks. Make this choice based on how you want to use the events in your reports. If your reports look at the button clicks independently, it may be desirable to use separate schemas for them. However, if you want to report on interaction across the whole page, it may be preferable to use a single event schema for them.

## Step 6: Putting it all together in a tracking plan

Having identified your events and entities, you can now record them in a tracking plan. Tracking plans specify:

1. What data (events, entities, and their properties) should be collected
2. Why it needs to be tracked (purpose of the data)
3. How the tracking should be implemented (what is the trigger for the events, which entities go with which events)
4. What is the implementation status of the tracking

Answering these questions will help you to have a comprehensive overview of your tracking design and ensure that all stakeholders are aligned on what data is being collected and how it is being used.

We recommend using [Event Specifications](/docs/data-product-studio/event-specifications/overview/index.md) in Snowplow Console to document and manage your tracking plan.