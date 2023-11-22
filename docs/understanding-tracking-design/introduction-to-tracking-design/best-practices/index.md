---
title: "Tracking design best practices"
---

Designing the events and entities to be captured in your tracking is a challenging task.
This page aims to give guidance on how to approach it based on our experience.

Overall, it suggests taking the following steps:

1. Analyze the business use case and define the reports to be produced.
2. Check our out-of-the-box data products to see if you can reuse or build on top of them.
3. Choose the naming convention to follow in your schemas.
4. Define your entities first.
5. Introduce events as interactions of the entities.

## Analyze your business use case and define reports

Good tracking design comes from an understanding of the business use case.
Identifying and analyzing the use case should be the first step before we design our tracking.
This involves identifying the business outcomes that you want to achieve (e.g. acquire new customers, increase the number of signups, minimize abandoned carts)?
It can often be answered by interviewing stakeholders who will consume the data in your organization.

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

* user and session identification,
* device and browser information,
* e-commerce events and entities,
* media playback events and entities,
* error and performance tracking,
* and much more.

It is recommended to use and build on top of these data structures in order to save effort and make use of the existing Snowplow dbt packages and tooling.
To get a comprehensive overview of the out-of-the-box provided schemas, [please refer to this page](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md).

Our [data product accelerators](https://snowplow.io/data-product-accelerators/) are a great resource to develop your data product faster using out-of-the-box data structures based on best practices.

## Choose your naming convention

Having a common standard for how to name events, entities and properties can make it easier to understand and extend the tracking design.
The following are our recommendations, but in general, it's more important to be consistent across your schemas than to follow these recommendations:

* Use snake case for both the schema and properties. This will ensure that the names are consistent with how the properties end up in the warehouse (for some warehouses, property names are converted to snake case regardless of how they are defined in the schemas). Avoid using hyphens to separate words, instead use underscores.
* Use the verb – noun convention for event names. For instance, `add_to_cart`, `play_video`.
* Be consistent about the tense (present or past). Make sure that all your events use the same tense (e.g., `play` and `pause` instead of `played` and `pause`).
* Use singular in the entity name (e.g., `product` instead of `products`).
* Prefer not to use nested objects in the JSON schema as this will make it more difficult to work with the data in Redshift.

## Start with entities

A good practice when designing tracking is to start with [the entities](/docs/understanding-your-pipeline/entities/index.md).
Entities contextualize and join events together, and they are often the levels of analysis a business is interested in (e.g., sale, user, organization, location).

It may not be obvious whether some properties should be added to events or entities.
In general, it is preferable to place information in entities as this will enable it to be reused across multiple events.
It may often be the case that events do not have any properties – this is totally fine.
Event properties should be limited only to information that is strictly related to the event and unlikely to be reused elsewhere (e.g., error message for an application error event).

Finally, it is a good practice to ask whether certain data really needs to be captured.
Tracking unnecessary information uses extra bandwidth and battery power and may add extra overhead to manage. Schemas can be [evolved](/docs/understanding-tracking-design/versioning-your-data-structures/) to allow adding more information later.
Refer to the business reports identified earlier in order to assess what data needs to be tracked.

## Define the events

Using the entities, one can start to derive the [events](/docs/understanding-your-pipeline/events/index.md).
Events can be viewed as the interactions between entities that occur at a particular point in time (e.g., add item to basket, share video, click on a link).

These questions may help when defining your events:

* Based on the identified business reports, what actions should be captured?
* Which entities go along with the events?
* When should the events happen? What are the triggers of the events?

:::note Tracking scenarios
The last two questions above can be captured using [tracking scenarios in BDP Enterprise and Cloud](https://snowplow.io/blog/tracking-scenarios-release/).
:::

A common challenge in defining event schemas is the choice of their granularity.
Should one define an event schema for every single action, or choose to group actions into fewer event schemas?
This is a trade-off that does not have a single correct answer.
Nevertheless, there are two recommendations that we can give.

### Recommendation 1: Avoid grouping multiple unrelated actions under the same schema

A good rule of thumb is that the name of the event should be representative what it does without having to look into additional properties.

<div style={{ width: "50%", float: "left", paddingRight: "5px" }}>

:::warning Bad
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
<div style={{ width: "50%", float: "left", paddingLeft: "5px" }}>

:::tip Good
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


### Recommendation 2: Avoid more granularity than necessary

As stated in the previous recommendation, it is not desirable to group unrelated actions into a single event.
However, when dealing with multiple events targeting the same type of action, it may be desirable to use a single event schema for them.
Consider the following example.

<div style={{ width: "50%", float: "left", paddingRight: "5px" }}>

:::warning Bad
Here we define two schemas covering the same type of action in different parts of the page.

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "io.snowplow",
    "name": "contact_button_click",
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
    "name": "events_button_click",
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
<div style={{ width: "50%", float: "left", paddingLeft: "5px" }}>

:::tip Good
Instead, it may be beneficial to use a single schema covering all button clicks on the page.
This makes it easier to build reports that measure interaction across the whole page.
It can also make it easier to capture additional button click events.

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "io.snowplow",
    "name": "button_click",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the button"
    }
  },
  "required": [ "name" ],
  "additionalProperties": false
}
```
:::

</div>
<div style={{ clear: "both" }} />

The choice of the granularity of events should come from an analysis of the use case and reports that we want to produce.
Some queries may benefit from having a higher granularity of the events.
Nevertheless, keep in mind that grouping unrelated actions makes the event schemas more difficult to evolve independently and may introduce undesired dependencies.
