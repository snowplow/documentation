---
title: "Attribute keys"
sidebar_position: 15
sidebar_label: "Attribute keys"
description: "Define built-in and custom attribute keys to specify the analytical context for attribute calculations in Snowplow Signals."
---

An attribute key is the identifier that attributes are calculated against.

Signals includes a number of out-of-the-box attribute keys based on commonly used identifiers from the out-of-the-box atomic [user-related fields](/docs/fundamentals/canonical-event/index.md#user-related-fields) in all Snowplow events.

This table lists the built-in attribute keys, and suggests others that could be useful:

| Attribute key     | Identifier                                                                                                                 | Built-in |
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

These are the built-in attribute keys provided by Signals:

| Attribute key | Out-of-the-box identifier           | Type     |
| ------------- | ----------------------------------- | -------- |
| User          | `user_id`                           | `string` |
| Device        | `domain_userid` and`network_userid` | `uuid`   |
| Session       | `domain_sessionid`                  | `uuid`   |

Import them into your notebook like this:

```python
from snowplow_signals import (
    domain_userid,
    domain_sessionid
    user_id
    network_userid
)
```

All the attributes within a specific attribute group are calculated based on the provided attribute key.

## Custom attribute keys

You can also define custom attribute keys, which allows you to calculate attributes on any other Snowplow atomic property you want. Atomic properties are those that are defined in the [atomic fields](/docs/fundamentals/canonical-event/index.md#atomic-fields) of the core Snowplow event, not properties tracked as part of an entity.

For example, an attribute key that groups by `app_id` can be defined as:

```python
app_id_attribute_key = AttributeKey(
    name="app_id_attribute_key",
    description="The id for the app"
    key="app_id",
)
```

## Options

The table below lists all available arguments for a custom attribute key:

| Argument      | Description                                                                              | Type        | Required? |
| ------------- | ---------------------------------------------------------------------------------------- | ----------- | --------- |
| `name`        | The name of the attribute key                                                            | `string`    | ✅         |
| `description` | A description of the attribute key                                                       | `string`    | ❌         |
| `key`         | The key used to join this attribute key to an attribute table                            | `string`    | ❌         |
| `owner`       | The owner of the attribute key, typically the email of the primary maintainer            | `string`    | ❌         |
| `ttl`         | The amount of time that attributes for the attribute key will live in the Profiles Store | `timedelta` | ❌         |
| `tags`        | String key-value pairs of arbitrary metadata                                             | dictionary  | ❌         |

If a `key` isn't specified, the `name` will be used.

Here's an extended example using all possible arguments, based on the atomic `platform` property:

```python
from datetime import timedelta

platform_attribute_key = AttributeKey(
    name="platform_tracking_attribute_key",
    description="Attribute key for analyzing user behavior patterns across different platforms (web, mobile, server-side) to understand cross-platform engagement and optimize user experience",
    key="platform",
    owner="analytics-team@snowplow.com",
    ttl=timedelta(days=365),
    tags={
        "category": "platform_analytics",
        "business_unit": "product",
        "created_by": "data_engineering_team"
    }
)
```

Custom attribute keys are added to attribute groups in the same way as any of the out-of-the-box attribute keys.
