---
title: "Signals concepts"
sidebar_position: 10
sidebar_label: "Concepts"
---

Signals introduces a new set of data governance concepts to Snowplow. As with schemas for Snowplow event data, Signals components are strictly defined, structured, and versioned.

## Overview

**Attributes** define a specific fact about user behavior.

They don't include any configuration for real-time or batch processing, versioning, or calculation context. To define that important metadata, you'll need to configure attribute groups. Signals has two attribute groupings:
* **Views**, for defining attributes
* **Services**, for consuming attributes

Start by creating views. At this point, you'll define:
* The data source - whether to calculate the attributes from the real-time stream, or in batch from the warehouse
* What **entity** to calculate the attributes for
* The version number of the view

Apply the view configuration to Signals, so that it can start calculating attributes and populating your Profiles Store. You'll need additional configuration if you're using batch processing.

Next, choose which attributes from which views you want to consume in your applications. Group them into services, and apply the configuration to Signals.

Finally, retrieve calculated attributes in your application, and use them to trigger actions.

### Example diagrams

This diagram shows a simple example configuration:

```mermaid
flowchart TD
    subgraph Section1[Defining what to calculate]
        subgraph View[View]
            V_Entity[Entity]
            V_Attr1[Attribute 1]
        end

        View --> ProfilesStore[Profiles Store]
    end

    subgraph Section2[Using attributes]
        ProfilesStore --> Service[Service]

        subgraph Service
            S_Attr1[Attribute 1]
        end

        Service --> Application[Application]
    end
```
A single attribute has been defined, calculated, and retrieved to use in an application.

The next diagram shows a more complex example configuration. Things to note:
* Views can have multiple attributes, but only one entity
* Attributes can be reused across views
* All calculated attributes are stored in the Profiles Store
* Services can selectively retrieve attribute values from different views

```mermaid
flowchart TD
    subgraph Section1[Defining what to calculate]
        subgraph Attributes[Attributes]
            Attr1[Attribute 1]
            Attr2[Attribute 2]
            Attr3[Attribute 3]
        end

        subgraph StreamView[StreamView]
            SV_Entity[Entity]
            SV_Attr1[Attribute 1]
            SV_Attr2[Attribute 2]
        end

        subgraph BatchView[BatchView]
            BV_Entity[Entity]
            BV_Attr2[Attribute 2]
            BV_Attr3[Attribute 3]
        end

        Attr1 -.-> SV_Attr1
        Attr2 -.-> SV_Attr2
        Attr2 -.-> BV_Attr2
        Attr3 -.-> BV_Attr3

        StreamView --> ProfilesStore[Profiles Store]
        BatchView --> ProfilesStore
    end

    subgraph Section2[Using attributes]
        ProfilesStore --> Service[Service]

        subgraph Service
            S_Attr1[Attribute 1 from StreamView]
            S_Attr2[Attribute 2 from BatchView]
        end

        Service --> Application[Application]
    end
```

## Attributes

An attribute describes what kind of calculation to perform, and what event data to evaluate.

There are four main types of attribute, depending on the type of user behavior you want to understand:

| Type          | Description                                            | Example                              |
| ------------- | ------------------------------------------------------ | ------------------------------------ |
| Time windowed | Actions that happened within the last X number of days | `products_added_to_cart_last_7_days` |
| Lifetime      | Calculated over all the available data                 | `total_product_price_clv`            |
| First touch   | The first event or property that happened              | `first_mkt_source`                   |
| Last touch    | The most recent event or property that happened        | `last_device_class`                  |

Attribute values can be updated in multiple ways, depending how they're configured:
* Events in real time (stream source only)
* Data in warehouse (batch source only)
* Interventions

Real-time attribute calculation uses the Snowplow event stream, and therefore ingests only Snowplow events. For historical warehouse attributes, you can import values from any table—whether created by Signals or not, even whether derived from Snowplow data or not.

Calculated attribute values are stored in the Profiles Store.

## Entities

An entity is an identifier that provides the analytical context for attribute calculations. The identifier can be any field of a Snowplow event, such as `domain_userid`.

To demonstrate the necessity of entities, consider the attribute `num_views_in_last_7_days`. This table lists some possible meanings of the attribute, based on the entity it's calculated against:

| Attribute                  | Entity             | Description                                                                   |
| -------------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `num_views_in_last_7_days` | User               | How many pages a user has viewed within the past week                         |
| `num_views_in_last_7_days` | Page               | How many page views a page has received within the past week                  |
| `num_views_in_last_7_days` | Product            | How many times a product has been viewed within the past week                 |
| `num_views_in_last_7_days` | App                | How many page views occurred within an app in the past week                   |
| `num_views_in_last_7_days` | Device             | How many page views came from a specific device in the past week              |
| `num_views_in_last_7_days` | Session            | How many page views occurred within an individual session in the past week    |
| `num_views_in_last_7_days` | Marketing campaign | How many page views were generated by a campaign in the past week             |
| `num_views_in_last_7_days` | Geographic region  | How many page views came from users in a region within the past week          |
| `num_views_in_last_7_days` | Customer segment   | How many page views were generated by users in a segment within the past week |

Each of these is likely to have a different calculated value.

You can define your own entities, or use the built-in ones. Signals comes with predefined entities for user, device, and session. Their identifiers are from the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

This table lists the built-in entities, and suggests others that could be useful:

| Entity            | Identifier                                                                                                                 | Built-in |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| User              | `user_id` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields)                            | ✅        |
| Device            | `domain_userid` and `network_userid` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) | ✅        |
| Session           | `domain_sessionid` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields)                   | ✅        |
| App               | `app_id` from [atomic fields](/docs/fundamentals/canonical-event/index.md#application-fields)                              |          |
| Page              | `page_urlpath` from [atomic fields](/docs/fundamentals/canonical-event/index.md#platform-specific-fields)                  |          |
| Product           | `id` from [ecommerce product](/docs/events/ootb-data/ecommerce-events/index.md#product) or custom entity                   |          |
| Screen view       | `id` in `screen_view` entity                                                                                               |          |
| Geographic region | `geo_country` from [IP Enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)         |          |
| Content category  | from custom entity                                                                                                         |          |
| Video game level  | from custom entity                                                                                                         |          |

## Views

Views are where you define the metrics that you want to calculate.

A view is a versioned set of attributes that are calculated against a specific entity, from a specific source. The source could be the real-time event stream, or a warehouse table batch source.

An example configuration for a view based on a user entity, with a stream (default) source:

```mermaid
flowchart TD
    subgraph Stream[Attributes]
        SA1[`number_of_pageviews`]
        SA2[`last_product_viewed`]
    end

    Stream --> View

    subgraph View[View: `user_attributes_realtime`]
        V_User[User entity: `user_id`]
        V_SA1[`number_of_pageviews`]
        V_SA2[`last_product_viewed`]
    end
```

When this view configuration is applied to Signals, the attributes will be calculated and stored in the Profiles Store. On retrieval, this view might look something like this as a table:

| `user_id`            | `number_of_pageviews` | `last_product_viewed` |
| -------------------- | --------------------- | --------------------- |
| `abc123@example.com` | 5                     | `"Red Shoes"`         |
| `def456@example.com` | 10                    | `"Blue Hat"`          |

## Services

Services are where you define how to use the calculated attributes in your applications.

Each service can contain multiple entire views, or individual attributes from different views, even if they have different entities or different sources.

They provide a stable interface to use in your applications: by pinning specific view versions, they provide a consistent set of consumable attributes.

By using services you can:
* Iterate on attribute definitions without worrying about breaking downstream processes
* Migrate to new view versions by updating the service definition, without having to update the application code

Here's a service that combines the same view as before with an additional batch view:

```mermaid
flowchart TD
    subgraph Attributes[Attributes]
        SA1[`number_of_pageviews`]
        SA2[`last_product_viewed`]
        BA1[`previous_purchases`]
        BA2[`previous_returns`]
    end

    Attributes --> StreamView
    Attributes --> BatchView

    subgraph StreamView[View: `user_attributes_realtime`]
        SV_User[User: `user_id`]
        SV_SA1[`number_of_pageviews`]
        SV_SA2[`last_product_viewed`]
    end

    subgraph BatchView[View: `user_attributes_warehouse`]
        BV_User[User: `user_id`]
        BV_BA1[`previous_purchases`]
        BV_BA2[`previous_returns`]
    end

    StreamView --> Service
    BatchView --> Service

    subgraph Service[Service]
        S_StreamView[`user_attributes_realtime`]
        S_BatchView[`user_attributes_warehouse`]
    end
```

In this example, both views have the same entity, and all attributes from both views are included in the service.

This service could be imagined like this as a table:

| `user_id`            | `number_of_pageviews` | `last_product_viewed` | `previous_purchases`       | `previous_returns` |
| -------------------- | --------------------- | --------------------- | -------------------------- | ------------------ |
| `abc123@example.com` | 5                     | `"Red Shoes"`         | `[Blue Shoes", "Red Hat"]` | `["Red Hat"]`      |
| `def456@example.com` | 10                    | `"Yellow Hat"`        | `[]`                       | `[]`               |

## Interventions

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
