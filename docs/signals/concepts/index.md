---
title: "Signals concepts"
sidebar_position: 1
sidebar_label: "Concepts"
---

Signals introduces a new set of data governance concepts to Snowplow. As with schemas for Snowplow event data, Signals components are strictly defined, structured, and versioned.

The fundamental Signals component is the `Entity`. The Signals components attributes and interventions are defined relative to entities. Attributes for a given entity are grouped together into views and services, for ease of management and deployment.

```mermaid
flowchart TD
    Entity --> Stream
    Entity --> Batch
    Entity --> Int1[**Intervention 1**]
    Entity --> Int2[**Intervention 2**]

    subgraph Stream
        SA1[Attribute 1]
        SA2[Attribute 2]
    end

    subgraph Batch
        BA1[Attribute 1]
        BA2[Attribute 2]
    end

    Stream --> StreamView[**View**]
    Batch --> BatchView[**View**]

    StreamView --> Service
    BatchView --> Service
```

The components in bold are versioned.

## Entities define the attribute context

An entity can be anything with an "identifier" that you capture in a Snowplow event. TODO actually this isn't true yet? only supporting atomic properties?

This diagram shows some entities that could be useful for analysis:

```mermaid
flowchart TD
    User["  o<br/> /|\ <br/> / \ <br/>User"] --> Device["  ___<br/> |___|<br/> |___|<br/>Device"]
    User --> PhoneDevice[" |---| <br/> |    | <br/> |__| <br/>Device"]

    Device --> App1["[www] App"]
    PhoneDevice --> App2["[app] App"]

    App1 -.-> Page[Page]
    App1 -.-> Product[Product]

    App2 -.-> Screen[Screen]
    App2 -.-> ScreenView[Screen View]
```

Signals comes with predefined entities for user, device, and session. These are defined based on the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

| Entity  | Out-of-the-box identifier            |
| ------- | ------------------------------------ |
| User    | `user_id`                            |
| Device  | `domain_userid` and `network_userid` |
| Session | `domain_sessionid`                   |

You can define any entities you like, and expand this to broader concepts.

| Entity           | Possible identifier                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| App              | `app_id` from [atomic fields](/docs/fundamentals/canonical-event/index.md#application-fields)             |
| Page             | `page_urlpath` from [atomic fields](/docs/fundamentals/canonical-event/index.md#platform-specific-fields) |
| Product          | `id` from [ecommerce product](/docs/events/ootb-data/ecommerce-events/index.md#product) or custom entity  |
| Screen view      | `id` in `screen_view` entity                                                                              |
| Content category | from custom entity                                                                                        |
| Video game level | from custom entity                                                                                        |

## Attributes store calculated values

After defining an entity, you can start to calculate attributes for it. An attribute defines a specific fact about behavior relating to an entity.

Example attributes for different entities:

| Entity         | Attribute                         | Description                                                         |
| -------------- | --------------------------------- | ------------------------------------------------------------------- |
| User           | `num_pages_viewed_in_last_7_days` | Counts how many pages the user has viewed within the past week      |
| User           | `last_product_viewed`             | Identifies the most recent product the user interacted with         |
| User           | `previous_purchases`              | Provides a record of the user's past transactions                   |
| Page           | `num_views_in_last_7_days`        | Counts how many page views a page has received within the past week |
| Media category | `most_popular_article`            | Identifies the most popular article for all users within a category |

Attribute values can be updated in multiple ways, depending how they're configured:
* Events in real time (stream source only)
* Events in warehouse (batch source only)
* Interventions
* Manually via Signals API

Attributes can be defined precisely. For example, an attribute could be calculated from one event type only, or based on the value of a defined event field.

### TODO example batch attributes

Syntactically speaking, defining batch and stream attributes work the same way. For a general overview of how to do that please refer to the [attributes](/docs/signals/configuration/attributes/index.md) section.

There are 4 main types of attributes that you may likely want to define for batch processing:
1. `Time Windowed Attributes`: Actions that happened in the `last_x_number of days`. Period needs to be defined as timedelta in days.

2. `Lifetime Attributes`: Calculated over all the available data for the entity. Period needs to be left as None.

3. `First Touch Attributes`: Events (or properties) that happened for the first time for a given entity. Period needs to be left as None.

4. `Last Touch Attributes`: Events (or properties) that happened for the last time for a given entity. Period needs to be left as None.

We have illustrated each of these 4 types with an example block below.

1. `products_added_to_cart_last_7_days`: This attribute calculates the number of add to cart ecommerce events in the last 7 days

2. `total_product_price_clv`: This attribute is calculated across the customer lifetime

3. `first_mkt_source`: This attribute takes the first page_view event and reads the mkt_source property for a specific entity (e.g. domain_userid)

4. `last_device_class`: This attribute takes the first page_view event and extracts and retrieves the yauaa deviceClass property for a specific entity

### Many-many relationship between entities and attributes

A single entity will very likely have multiple attributes. For example, you could define a user entity with attributes for the number of page views, the last product they viewed, and their previous purchases.

Imagined like this:

```python
user.num_page_views_in_last_7_days
user.last_product_viewed
user.previous_purchases
```

A single attribute definition could also be associated with multiple entities. For example, an attribute that counts page views might be relevant for user, page, and product entities. Attributes for different entities are distinct, even if they use the same name and definition.

Imagined like this:

```python
user.num_page_views_in_last_7_days
page.num_page_views_in_last_7_days
product.num_page_views_in_last_7_days
```

## Attributes can be grouped for ease of management

### Views group attributes

Configure attributes by grouping them into views. Each view is associated with a specific entity, source, version, and owner. It also has other optional metadata.

Choose the source which fits your use case. For example, the attribute `last_product_viewed` is best calculated from events in-stream during a session, while `num_views_in_last_7_days` is best calculated from historical events.

An example configuration for a view based on a user entity:

```mermaid
flowchart TD
    User[User: `user_id`] --> Stream

    subgraph Stream[Stream attributes]
        SA1[number_of_pageviews]
        SA2[last_product_viewed]
    end

    Stream --> View[View: `user_attributes_realtime`]
```

This view could be imagined like this as a table once the attributes are calculated:

| `user_id` | `number_of_pageviews` | `last_product_viewed` |
| --------- | --------------------- | --------------------- |
| `abc123`  | 5                     | `"Red Shoes"`         |
| `def456`  | 10                    | `"Blue Hat"`          |

You can use views individually in your application to retrieve attributes, or combine them into services.

### Services group views

Services allow you to retrieve attributes in bulk from multiple views. One service can combine views with different sources, as long as they share the same entity.

Because each view is pinned to a specific version, a defined service is also effectively versioned, ensuring that the returned values are consistent with what you expect.

Here's the same example as before, with an additional batch view:

```mermaid
flowchart TD
    Entity[User: `user_id`] --> Stream
    Entity --> Batch

    subgraph Stream[Stream attributes]
        SA1[number_of_pageviews]
        SA2[last_product_viewed]
    end

    subgraph Batch[Batch attributes]
        BA1[previous_purchases]
        BA2[previous_returns]
    end

    Stream --> StreamView[View: `user_attributes_realtime`]
    Batch --> BatchView[View: `user_attributes_warehouse`]

    StreamView --> Service
    BatchView --> Service
```

This service could be imagined like this as a table:

| `user_id` | `number_of_pageviews` | `last_product_viewed` | `previous_purchases`       | `previous_returns` |
| --------- | --------------------- | --------------------- | -------------------------- | ------------------ |
| `abc123`  | 5                     | `"Red Shoes"`         | `[Blue Shoes", "Red Hat"]` | `["Red Hat"]`      |
| `def456`  | 10                    | `"Yellow Hat"`        | `[]`                       | `[]`               |

Retrieve calculated attributes in your application using one of the Signals SDKs, or manually using the Signals API.

## Warehouse attributes can have any origin

Signals, as you might expect for a Snowplow product, is very flexible. Real-time attribute calculation uses the Snowplow event stream, and therefore ingests only Snowplow events. For historical warehouse attributes, you can import values from any table—whether created by Signals or not, even whether derived from Snowplow data or not.

## Interventions trigger actions

Interventions are a way to trigger actions in your application, such as in-app messages, discounts, or personalized journeys. They're calculated on top of changes in attribute values.

They allow you to define logic within Signals rather than in your application. This allows you to update the behavior without requiring application updates, as well as streamlining management, development, and ownership.

```mermaid
flowchart TD
    Application[application] -->|sends| Event[event]
    Event -->|updates| Attribute[attribute]
    Intervention[intervention] -->|listens to| Attribute
    Intervention -->|fires to| Application
```

Like attributes, interventions are specific to an entity.

Interventions can be triggered automatically based on attribute changes, or manually using the Signals API. Subscribe within your application for real-time updates to interventions for entities of interest.

For example, you could subscribe to interventions for `domain_userid`, the current `app_id`, the current `page`, and the current `product`. When new interventions are published for any of those, the retrieved contents includes any relevant attribute values, or custom data that you defined. This enables both individual-level and broadcast-level real-time messaging: for example, offering a specific user a personalized message, while also notifying all users on a specific product page that limited stock is selling fast.

Interventions can also perform built-in automatic operations, including updating attribute values.

## Attributes can be set to expire

Some attributes will only be relevant for a certain amount of time, and eventually stop being updated.

To avoid stale attributes staying in your Profiles Store forever, you can configure TTL lifetimes for entities and views. When none of the attributes for an entity or view have been updated for the defined lifespan, the entity or view expires. Any attribute values for this entity or view will be deleted: fetching them will return `None` values.

If Signals then processes a new event that calculates the attribute again, or materializes the attribute from the warehouse again, the expiration timer is reset.
