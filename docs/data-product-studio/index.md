---
title: "Data Product Studio"
date: "2020-02-15"
sidebar_position: 3
sidebar_label: "Data Product Studio"
sidebar_custom_props:
  header: " "
---

Data Product Studio is a set of tooling for designing and implementing behavioral data event tracking, including schemas (data structures), ownership, observability, and code generation. The tools help you improve data quality, and allow you to add a data contracts/governance guarantee.

The Data Product Studio UI is included in Snowplow Console.

## Tracking design basics

To use Snowplow successfully, you need to have a good idea of:

- What events you care about in your business
- What events occur in your website / mobile application / server side systems / factories / call centers / dispatch centers / etc
- What decisions you make based on those events
- What you need to know about those events to make those decisions

Designing the events and entities to be captured in your tracking is a challenging task.
This page aims to give guidance on how to approach it based on our experience.

Overall, it suggests taking the following steps:

1. Analyze the business use case and define the reports to be produced.
2. Check our out-of-the-box data products to see if you can reuse or build on top of them.
3. Choose the naming convention to follow in your schemas.
4. Define your entities first.
5. Introduce events as interactions of the entities.
6. Bring it all together in a tracking plan.

This is where creating a **Tracking Plan** comes into play. It is a comprehensive document that adds a semantic layer to the events your business is interested in tracking. For each event, it defines:

- A description of the event, often illustrated with screenshots.
- The data that is captured with the event, and its structure.
- The origin of the data, i.e. what platforms or apps this data is created by.
- Other relevant information.

:::info
Snowplow customers can create tracking plans directly in Snowplow instead of using an external document. See [Creating tracking plans](/docs/data-product-studio/event-specifications/tracking-plans/index.md) for more information.
:::

Snowplow also uses a **schema registry** to store the definition of these data structures.

> **Schema registry** provides a serving layer for your metadata. It provides a RESTful interface for storing and retrieving schemas. It stores a versioned history of all schemas and allows evolution of schemas.

When an **event** occurs, it generally involves a number of **entities**, and takes place in a particular setting.

> An **entity** is the group of entities associated with or describing the setting in which an **event** has taken place.

Due to the nature of _custom_ (as well as Snowplow authored) events/entities there has to be some mechanism in place ensuring validity of the captured data.

JSON schema plays a significant part in this mechanism. Both events and entities have schemas which define what data is recorded about the event, or entity, at data capture time.

> **JSON schema** specifies a _JSON_-based format to define the structure of JSON data for validation, documentation, and interaction control.

> **JSON** (JavaScript Object Notation) is an open-standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs.

Snowplow requires that you put together schemas for your events and entities, ahead of data collection time. It then uses those schemas to process the data, in particular:

1. To validate that the data coming in is "good data" that conforms to the schema
2. Process the data correctly, in particular, shredding the JSONs that represent the data into tidy tables in Redshift suitable for analysis

**Iglu** is a key technology for making this possible. It is machine-readable _schema registry_ for JSON and Thrift schemas. A schema registry is like [Git](https://en.wikipedia.org/wiki/Git_(software)) but holds data schemas instead of software or code.

## Analyze your business use case and define reports

Good tracking design comes from an understanding of the business use case.
Identifying and analyzing the use case should be the first step before we design our tracking.
This involves identifying the business outcomes that you want to achieve (e.g. acquire new customers, increase the number of signups, minimize abandoned carts)?
It can often be answered by interviewing stakeholders who will consume the data in your organization.
These are not only the end stakeholders but also the analysts who are the experts in the data.

One of the ways to think about this is to sketch the reports that we want to have – the derived tables that the modeling process will extract from the raw events.
Based on the reports, one can identify the entities, events, and SQL queries to be performed on top of them.

:::tip Example – abandoned carts in e-commerce

For example, if one of the use cases is to identify abandoned carts, we may want the following reports to explore the data:

* What is the frequency of users abandoning carts for different segments of users?
* What are the most commonly abandoned products in carts?
* What leads users to return to the store and continue their purchase?

We need to go deeper into specifying what exactly the derived tables for these reports should contain.
However, we can already see a few reusable entities that we need to track: user, cart, product, page referrer.
The reports can also tell us what events we'll need as interactions of these entities: add product to cart, checkout step, transaction, page view.

:::

## Make use of our out-of-the-box schemas

Snowplow trackers and data models provide a rich set of events and entities to cover common use cases.
These include:

* User and session identification.
* Device and browser information.
* E-commerce events and entities.
* Media playback events and entities.
* Error and performance tracking.

It is recommended to use and build on top of these data structures in order to save effort and make use of the existing Snowplow dbt packages and tooling.
To get a comprehensive overview of the out-of-the-box provided schemas, [please refer to this page](/docs/events/index.md).

Our [data product accelerators](https://snowplow.io/data-product-accelerators/) are a great resource to develop your data product faster using out-of-the-box data structures based on best practices.

:::note Check your existing entities for re-use
Make sure that you are re-using entities that you previously defined in your other data products.
The more entities that you can re-use across your data, the more consistent and easier it will be to perform analyses.
:::

## Choose your naming convention

Having a common standard for how to name events, entities and properties can make it easier to understand and extend the tracking design.
The following are our recommendations, but in general, it's more important to be consistent across your schemas than to follow these recommendations:

* Use snake case for both the schema and properties. This will ensure that the names are consistent with how the properties end up in the warehouse (for some warehouses, property names are converted to snake case regardless of how they are defined in the schemas). Avoid using hyphens to separate words, instead use underscores.
* Use the verb – noun convention for event names. For instance, `add_to_cart`, `play_video`.
* Be consistent about the tense (present or past) for event and property names. For example, `play` and `pause` events, instead of `played` (past tense) and `pause` (present tense).
* Use singular in the entity name (e.g., `product` instead of `products`).
* Prefer not to use nested objects in the JSON schema as this will make it more difficult to work with the data in Redshift.

## Start with entities

A good practice when designing tracking is to start with [the entities](/docs/fundamentals/entities/index.md).
Entities contextualize and join events together, and they are often the levels of analysis a business is interested in (e.g., sale, user, organization, location).

It may not be obvious whether some properties should be added to events or entities.
In general, it is preferable to place information in entities as this will enable it to be reused across multiple events.
It may often be the case that events do not have any properties – this is totally fine.
Event properties should be limited only to information that is strictly related to the event and unlikely to be reused elsewhere (e.g., error message for an application error event).

One useful way to think about events and entities is by relating them to the [star schema used in data warehouses](https://en.wikipedia.org/wiki/Star_schema) – entities can be thought of as the dimension tables, while events map more to the fact tables.
Make sure that information that would be represented using dimension tables is contained in entities rather than events.

Finally, it is a good practice to ask whether certain data really needs to be captured.
Tracking unnecessary information uses extra bandwidth and battery power and may add extra overhead to manage.
Schemas can be [evolved](/docs/data-product-studio/data-structures/version-amend/index.md) to allow adding more information later.
Refer to the business reports identified earlier in order to assess what data needs to be tracked.

## Define the events

Using the entities, one can start to derive the [events](/docs/fundamentals/events/index.md).
Events can be viewed as the interactions between entities that occur at a particular point in time (e.g., add item to basket, share video, click on a link).

These questions may help when defining your events:

* Based on the identified business reports, what actions should be captured?
* Which entities go along with the events?
* When should the events happen? What are the triggers of the events?

:::note Event Specifications
The last two questions above can be captured using [event specifications](https://snowplow.io/blog/tracking-scenarios-release/).
:::

A common challenge in defining event schemas is the choice of their granularity.
Should one define an event schema for every single action, or choose to group actions into fewer event schemas?
This is a trade-off that does not have a single correct answer.
Nevertheless, there are two recommendations that we can give.

### Recommendation 1: Avoid grouping multiple unrelated actions under the same schema

A good rule of thumb is that the name of the event should be representative of what it does without having to look into additional properties.

Consider the following example where we use the `website_action` schema for all events on the page.
This makes it difficult to understand what the event captures based on the event name.
Also, versioning of the schema is less unintuitive, because adding a new event type means updating the schema version for all other types as well.
This makes the event schemas more difficult to evolve independently and may introduce undesired dependencies.

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

</div>
Below is a much better option:
<div style={{ width: "100%" }}>

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

As stated in the previous recommendation, it is not desirable to group unrelated actions into a single event.
However, when dealing with multiple events targeting the same type of action, you may choose to define a single event schema or multiple event schemas depending on how you want to use the data.

Consider the example of tracking button clicks on a page.
There is a choice to be made whether we define separate schemas for each button on the page (e.g., `contact_button_click`, `event_button_click`) or use a single (`button_click`) schema for all the button clicks.
The choice should be made based on how you want to use the events in your reports.
If your reports look at the button clicks independently, it may be desirable to use separate schemas for them.
However, if you want to report on interaction across the whole page, it may be preferable to use a single event schema for them.

## Putting it all together in a tracking plan

Having identified your events and entities, you can now record them in a tracking plan.
Tracking plans specify:

1. What data (events, entities, and their properties) should be collected?
2. Why does it need to be tracked (purpose of the data)?
3. How should the tracking be implemented (what is the trigger for the events, which entities go with which events)?
4. What is the implementation status of the tracking?

Most commonly, they are in the form of a spreadsheet.
You can make use of an [example template covering a few e-commerce events and entities available here](https://docs.google.com/spreadsheets/d/1yu0OgmxTZ5V3k362s5-kkyWBe0ZtXLPTGMVBp36fyIw/edit?usp=sharing).

Finally, it is worth making sure that the events and entities in your tracking plan can answer the questions in the identified reports.
