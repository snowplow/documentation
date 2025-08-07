---
title: "Signals concepts"
sidebar_position: 10
sidebar_label: "Concepts"
---

Signals introduces a new set of data governance concepts to Snowplow. As with schemas for Snowplow event data, Signals components are strictly defined, structured, and versioned.

**Attributes** define a specific fact about user behavior.

They don't include any configuration for real-time or batch processing, versioning, or calculation context. To define that important metadata, you'll need to configure attribute groups. Signals has two attribute groupings:
* **Attribute groups**, for defining attributes
* **Services**, for consuming attributes

Start by creating attribute groups. At this point, you'll define:
* The data source - whether to calculate the attributes from the real-time stream, or in batch from the warehouse
* What **attribute key** to calculate the attributes for
* The version number of the attribute group

Apply the attribute group configuration to Signals, so that it can start calculating attributes and populating your Profiles Store. You'll need additional configuration if you're using batch processing.

Next, choose which attributes from which attribute groups you want to consume in your applications. Group them into services, and apply the configuration to Signals.

Finally, retrieve calculated attributes in your application, and use them to trigger actions.

## Overview diagrams

This diagram shows a simple example configuration:

```mermaid
flowchart TD
    subgraph Section1[Defining what to calculate]
        subgraph AttributeGroup[AttributeGroup]
            AG_AttributeKey[AttributeKey]
            AG_Attr1[Attribute 1]
        end

        AttributeGroup --> ProfilesStore[Profiles Store]
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
* Attribute groups can have multiple attributes, but only one attribute key
* Attributes can be reused across attribute groups
* All calculated attributes are stored in the Profiles Store
* Services can selectively retrieve attribute values from different attribute groups

```mermaid
flowchart TD
    subgraph Section1[Defining what to calculate]
        subgraph Attributes[Attributes]
            Attr1[Attribute 1]
            Attr2[Attribute 2]
            Attr3[Attribute 3]
        end

        subgraph StreamAttributeGroup[StreamAttributeGroup]
            SAG_AttributeKey[AttributeKey]
            SAG_Attr1[Attribute 1]
            SAG_Attr2[Attribute 2]
        end

        subgraph BatchAttributeGroup[BatchAttributeGroup]
            BAG_AttributeKey[AttributeKey]
            BAG_Attr2[Attribute 2]
            BAG_Attr3[Attribute 3]
        end

        Attr1 -.-> SAG_Attr1
        Attr2 -.-> SAG_Attr2
        Attr2 -.-> BAG_Attr2
        Attr3 -.-> BAG_Attr3

        StreamAttributeGroup --> ProfilesStore[Profiles Store]
        BatchAttributeGroup --> ProfilesStore
    end

    subgraph Section2[Using attributes]
        ProfilesStore --> Service[Service]

        subgraph Service
            SAG_Attr1[Attribute 1 from StreamAttributeGroup]
            BAG_Attr2[Attribute 2 from BatchAttributeGroup]
        end

        Service --> Application[Application]
    end
```

## Attributes

An attribute describes what kind of calculation to perform, and what event data to evaluate.

There are four main types of attribute, depending on the type of user behavior you want to understand:

| Type          | Description                                            | Example                              |
| ------------- | ------------------------------------------------------ | ------------------------------------ |
| Time windowed | Actions that happened within the last X period of time | `products_added_to_cart_last_10_min` |
| Lifetime      | Calculated over all the available data                 | `total_product_price_clv`            |
| First touch   | The first event or property that happened              | `first_mkt_source`                   |
| Last touch    | The most recent event or property that happened        | `last_device_class`                  |

Attribute values can be updated in multiple ways, depending how they're configured:
* Events in real time (stream source only)
* Data in warehouse (batch source only)
* Interventions

Real-time attribute calculation uses the Snowplow event stream, and therefore ingests only Snowplow events. For historical warehouse attributes, you can import values from any table—whether created by Signals or not, even whether derived from Snowplow data or not.

Calculated attribute values are stored in the Profiles Store.

## Attribute keys

An attribute key is an identifier that provides the analytical context for attribute calculations. The identifier can be any field of a Snowplow event, such as `domain_userid`.

To demonstrate the necessity of attribute keys, consider the attribute `num_views_in_last_10_min`. This table lists some possible meanings of the attribute, based on the attribute key it's calculated against:

| Attribute                  | Attribute key      | Description                                                                         |
| -------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| `num_views_in_last_10_min` | User               | How many pages a user has viewed within the last 10 minutes                         |
| `num_views_in_last_10_min` | Page               | How many page views a page has received within the last 10 minutes                  |
| `num_views_in_last_10_min` | Product            | How many times a product has been viewed within the last 10 minutes                 |
| `num_views_in_last_10_min` | App                | How many page views occurred within an app in the last 10 minutes                   |
| `num_views_in_last_10_min` | Device             | How many page views came from a specific device in the last 10 minutes              |
| `num_views_in_last_10_min` | Marketing campaign | How many page views were generated by a campaign in the last 10 minutes             |
| `num_views_in_last_10_min` | Geographic region  | How many page views came from users in a region within the last 10 minutes          |
| `num_views_in_last_10_min` | Customer segment   | How many page views were generated by users in a segment within the last 10 minutes |

Each of these is likely to have a different calculated value.

You can define your own attribute keys, or use the built-in ones. Signals comes with predefined attribute keys for user, device, and session. Their identifiers are from the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

This table lists the built-in attribute keys, and suggests others that could be useful:

| Attribute key     | Identifier                                                                                                                 | Built-in |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| User              | `user_id` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields)                            | ✅        |
| Device            | `domain_userid` and `network_userid` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) | ✅        |
| Session           | `domain_sessionid` from [atomic fields](/docs/fundamentals/canonical-event/index.md#user-related-fields)                   | ✅        |
| App               | `app_id` from [atomic fields](/docs/fundamentals/canonical-event/index.md#application-fields)                              |          |
| Page              | `page_urlpath` from [atomic fields](/docs/fundamentals/canonical-event/index.md#platform-specific-fields)                  |          |
| Product           | `id` from [ecommerce product](/docs/events/ootb-data/ecommerce-events/index.md#product) or custom attribute key            |          |
| Screen view       | `id` in `screen_view` attribute key                                                                                        |          |
| Geographic region | `geo_country` from [IP Enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)         |          |
| Content category  | from custom attribute key                                                                                                  |          |
| Video game level  | from custom attribute key                                                                                                  |          |

## Attribute groups

Attribute groups are where you define the metrics that you want to calculate.

An attribute group is a versioned set of attributes that are calculated against a specific attribute key, from a specific source. The source could be the real-time event stream, or a warehouse table batch source.

An example configuration for an attribute group based on a user attribute key, with a stream (default) source:

```mermaid
flowchart TD
    subgraph Stream[Attributes]
        SA1[`number_of_pageviews`]
        SA2[`last_product_viewed`]
    end

    Stream --> AttributeGroup

    subgraph AttributeGroup[AttributeGroup: `user_attributes_realtime`]
        AG_User[user_attribute_key: `user_id`]
        AG_SA1[`number_of_pageviews`]
        AG_SA2[`last_product_viewed`]
    end
```

When this attribute group configuration is applied to Signals, the attributes will be calculated and stored in the Profiles Store. On retrieval, this attribute group might look something like this as a table:

| `user_id`            | `number_of_pageviews` | `last_product_viewed` |
| -------------------- | --------------------- | --------------------- |
| `abc123@example.com` | 5                     | `"Red Shoes"`         |
| `def456@example.com` | 10                    | `"Blue Hat"`          |

## Services

Services are where you define how to use the calculated attributes in your applications.


Each service can contain multiple entire attribute groups, or individual attributes from different attribute groups, even if they have different attribute keys or different sources.
They provide a stable interface to use in your applications: by pinning specific attribute group versions, they provide a consistent set of consumable attributes.

By using services you can:
* Iterate on attribute definitions without worrying about breaking downstream processes
* Migrate to new attribute group versions by updating the service definition, without having to update the application code

Here's a service that combines the same attribute group as before with an additional batch attribute group:

```mermaid
flowchart TD
    subgraph Attributes[Attributes]
        SAG1[`number_of_pageviews`]
        SAG2[`last_product_viewed`]
        BAG1[`previous_purchases`]
        BAG2[`previous_returns`]
    end

    Attributes --> StreamAttributeGroup
    Attributes --> BatchAttributeGroup

    subgraph StreamAttributeGroup[AttributeGroup: `user_attributes_realtime`]
        SV_User[User: `user_id`]
        SV_SAG1[`number_of_pageviews`]
        SV_SAG2[`last_product_viewed`]
    end

    subgraph BatchAttributeGroup[AttributeGroup: `user_attributes_warehouse`]
        BV_User[User: `user_id`]
        BV_BAG1[`previous_purchases`]
        BV_BAG2[`previous_returns`]
    end

    StreamAttributeGroup --> Service
    BatchAttributeGroup --> Service

    subgraph Service[Service]
        S_StreamAttributeGroup[`user_attributes_realtime`]
        S_BatchAttributeGroup[`user_attributes_warehouse`]
    end
```

In this example, both attribute groups have the same attribute key, and all attributes from both attribute groups are included in the service.

This service could be imagined like this as a table:

| `user_id`            | `number_of_pageviews` | `last_product_viewed` | `previous_purchases`       | `previous_returns` |
| -------------------- | --------------------- | --------------------- | -------------------------- | ------------------ |
| `abc123@example.com` | 5                     | `"Red Shoes"`         | `[Blue Shoes", "Red Hat"]` | `["Red Hat"]`      |
| `def456@example.com` | 10                    | `"Yellow Hat"`        | `[]`                       | `[]`               |

## Interventions

Interventions are a way to trigger actions in your application, such as in-app messages, discounts, or personalized journeys.
They're calculated on top of changes in attribute values, or fired by your own applications.

This allows you to influence user behavior without requiring application updates, since you can control when the intervention should fire through Signals.

```mermaid
flowchart TD
    user -->|uses| application
    application -->|sends| event
    event -->|updates| attribute
    attribute -->|triggers| intervention
    intervention -->|influences| user
```

Like attributes, interventions target specific attribute key instances.

Interventions can be triggered automatically [based on attribute changes](/docs/signals/configuration/interventions/index.md), or manually [using the Signals API](/docs/signals/interventions/index.md#custom-intervention-via-the-api).
Subscribe [within your application](/docs/signals/interventions/index.md#retrieving-interventions-with-the-signals-sdk) for real-time updates to interventions for attribute keys of interest, or [user devices can subscribe](/docs/signals/interventions/index.md#retrieving-interventions-on-the-web-with-the-browser-tracker-plugin) to interventions that apply to their own attribute keys while they use your application.

For example, you could subscribe to interventions for a specific `domain_userid`, the current `app_id`, the current `page`, and the current `product`.
When new interventions are published for any of those, they are delivered and the contents include any relevant attribute values, that can be used by your application to react.
This enables both individual-level and broadcast-level real-time messaging: for example, offering a specific user a personalized message, while also notifying all users on a specific product page that limited stock is selling fast.
