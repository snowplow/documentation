---
title: "Signals concepts"
sidebar_position: 1
sidebar_label: "Concepts"
---

Signals introduces a new set of data governance concepts to Snowplow. As with schemas for Snowplow event data, Signals components are strictly defined, structured, and versioned.

The fundamental Signals building block is the `Entity`. The other Signals features, attributes and interventions, are all defined relative to entities. Attributes can be grouped together into Views or Services for ease of management and deployment.

```mermaid
flowchart TD
    Entity --> Stream
    Entity --> Batch
    Entity --> Interventions

    subgraph Stream
        SA1[Attribute 1]
        SA2[Attribute 2]
    end

    subgraph Batch
        BA1[Attribute 1]
        BA2[Attribute 2]
    end

    Stream --> StreamView[View]
    Batch --> BatchView[View]

    StreamView --> Service
    BatchView --> Service
```

## Entities

An entity can be anything with an "identifier" that you can capture in a Snowplow event.

This diagram shows some entities that could be useful for analysis:

```mermaid
flowchart TD
    User["o-|-< User"] --> Device["[===] Device"]
    User --> PhoneDevice["|___| Device"]

    Device --> App1["[www] App"]
    PhoneDevice --> App2["[app] App"]

    App1 -.-> Page[Page]
    App1 -.-> Product[Product]

    App2 -.-> Screen[Screen]
    App2 -.-> ScreenView[Screen View]
```

Signals comes with predefined entities: "users", "devices", and "sessions". These are defined based on the out-of-the-box [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

| Built-in entity | Identifier                       |
| --------------- | -------------------------------- |
| User            | `user_id`                        |
| Device          | `domain_userid`/`network_userid` |
| Session         | `domain_sessionid`               |

You can define any entities you like, and expand this to broader concepts.

| Possible entity  | Possible identifier                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| App              | [`app_id`](/docs/fundamentals/canonical-event/index.md#application-fields)                                                                   |
| Page             | [`page_urlpath`](/docs/fundamentals/canonical-event/index.md#platform-specific-fields)                                                       |
| Product          | `id` from [ecommerce product](/docs/sources/trackers/snowplow-tracker-protocol/ootb-data/ecommerce-events/index.md#product) or custom entity |
| Screen view      | `id` in `screen_view` entity                                                                                                                 |
| Content category | from custom entity                                                                                                                           |
| Video game level | from custom entity                                                                                                                           |

## Attributes

After defining an entity, you can start to calculate attributes for it. An attribute defines a specific fact about behavior relating to an entity.

Example attributes:

| Entity               | Attribute                         | Description                                                                      |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| **User**             | `num_pages_viewed_in_last_7_days` | Counts how many pages the user has viewed within the past week                   |
| **User**             | `last_product_viewed`             | Identifies the most recent product the user interacted with                      |
| **User**             | `previous_purchases`              | Provides a record of the user's past transactions                                |
| **Page**             | `num_views_in_last_7_days`        | Counts how many page views a page has received within the past week              |
| **Product Category** | `last_product_sold`               | Identifies the most recent product any user has bought within a product category |

TODO stream vs batch


All attributes get defined as part of a [view](#views), which ties them to a specific entity and source, defining how their values get updated.

You can also set them manually via the APIs, or dynamically via interventions.

Read more [about attributes](/docs/signals/configuration/attributes/index.md).

### Views

A <dfn>View</dfn> is a versioned collection of attributes associated with a specific entity that are populated from the same source.

You can picture the result of a View as a table of attributes for an entity instance.

For example, from the [previous example attributes](#attributes) for a user-entity keyed by `user_id`:

| `user_id` | `number_of_pageviews` | `last_product_viewed` | `previous_purchases`      |
| --------- | --------------------- | --------------------- | ------------------------- |
| `abc123`  | 5                     | Red Shoes             | [`Blue Shoes`, `Red Hat`] |

The attributes of a view can be set to expire for instances if they aren't updated after a certain period of time.

Each view can be associated with metadata such as an owner, description, and tags.

When you're happy with a version of a View definition, you can associate it with a service to be consistently requested via the API for personalization.

### Services

A <dfn>Service</dfn> is a collection of [views](#views) that are grouped to make the retrieval of attributes simpler.

They allow you to retrieve attributes in bulk from multiple views, that are each pinned to specific versions so you can ensure the returned values are consistent with what you expect.
This allows you to freely iterate on your view/attribute definitions without impacting production applications that rely on your attributes, and letting you migrate to new versions when ready.

## Interventions

Once an entity is defined in Signals you can start to retrieve interventions for it, and start publishing to them.

An <dfn>intervention</dfn> describes an action that can be performed for a user to achieve a more successful result.

User devices and your own systems can request interventions for a list of specific entities, which are then delivered in real-time as they are published.
You can publish interventions manually using the API, or define them to trigger automatically when [attributes](#attributes) get updated and meet specific criteria.
There are built-in operations that interventions can perform or that can be handled by Signals SDKs, but the contents of an intervention can contain custom data to use however you need to, and can include current attribute values for dynamic, personalized, actions using the latest real-time data.

For example, a user can subscribe to interventions for their own `domain_userid`, the current `app_id`, the current `page`, and the current `product`, and any interventions published targeting any of those entities get received.
This enables both individual-level and broadcast-level messaging, so you can offer a specific user a personalized message, while also notifying all users on a specific product page that limited stock is selling fast.

<!-- TODO: Read more about interventions -->
