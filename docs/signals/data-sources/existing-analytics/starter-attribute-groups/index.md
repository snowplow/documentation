---
title: "Starter attribute groups for events from your existing analytics"
sidebar_label: "Starter attribute groups"
sidebar_position: 40
description: "Five attribute groups you can copy to calculate visitor, session, purchase, account and funnel attributes from events that reach Snowplow from Segment, RudderStack, GA4, Amplitude, Adobe or PostHog."
keywords: ["attribute groups", "external_event", "segment", "ga4", "amplitude", "adobe", "rudderstack", "posthog", "python sdk"]
date: "2026-11-16"
content_type: how-to
---

Once your existing analytics events reach Snowplow, you can calculate Signals attributes on them the same way as on events from a Snowplow tracker. This page gives five attribute groups to start from:

- [Visitor activity](#visitor-activity): page views, pages and where visitors came from
- [Session engagement](#session-engagement): what a visitor is doing in the current session
- [Purchase intent](#purchase-intent): products viewed, carts, orders and searches
- [Account and plan](#account-and-plan): the account and plan a visitor belongs to
- [Funnel](#funnel): your own events, such as a signup or a login

Each group lists its attributes, with its definition in the [Signals Python SDK](/docs/signals/connection/index.md) below. You can create the same attributes in Console instead: each `Attribute` maps one to one to the fields of Console's attribute form.

## What the attributes read

Every adapter maps your tool's events the same way, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md). The groups read the result:

| Your tool's event | Snowplow event | Fields the starter groups read |
| --- | --- | --- |
| Page view | `page_view` | `page_url`, `page_title`, `refr_medium`, `mkt_source` |
| Product view, add to cart, checkout, order | `snowplow_ecommerce_action` with `product` and `transaction` entities | Action `type`, product `id` and `category`, transaction `revenue` and `currency` |
| Site search | `site_search` | `terms` |
| Identify or login | `identify` | The event itself |
| Anything else | [`external_event`](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) | `name`, `kind`, `plan`, `group_id` |
| Every event | [`external_identity`](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) entity | `event_name`, the event's original name in your tool |

A property of your tool's event that doesn't map to one of these fields isn't available to attributes.

## Choose a key

Key the groups on `domain_userid`, and the session group on `domain_sessionid`. On a client-side approach, these are the Snowplow tracker's own random IDs. On a server-side approach, `domain_userid` holds your tool's visitor ID, and the session group works only on PostHog and Amplitude.

:::caution[Keys on the public intervention endpoint]
Interventions are delivered through a public endpoint, so deliver them only to a key nobody can guess: `domain_userid` or `domain_sessionid` from a client-side approach. On a server-side approach, `domain_userid` holds your tool's ID, so read those attributes from your backend only. See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).
:::

## Set up the SDK

The definitions share this setup. It assumes you have [connected to Signals](/docs/signals/connection/index.md) and have API credentials in environment variables.

<details>
<summary>SDK setup</summary>

```python
import os
from datetime import timedelta

from snowplow_signals import (
    AtomicProperty,
    Attribute,
    AttributeKey,
    Criteria,
    Criterion,
    EntityProperty,
    Event,
    EventProperty,
    Signals,
    StreamAttributeGroup,
    domain_sessionid,
    domain_userid,
)

VENDOR = "com.snowplowanalytics.snowplow"

sp_signals = Signals(
    api_url=os.environ["SIGNALS_API_URL"],
    api_key=os.environ["SNOWPLOW_API_KEY"],
    api_key_id=os.environ["SNOWPLOW_API_KEY_ID"],
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)

page_view = Event(vendor="com.snowplowanalytics.snowplow", name="page_view", version="1-0-0")
page_ping = Event(vendor="com.snowplowanalytics.snowplow", name="page_ping", version="1-0-0")
ecommerce_action = Event(
    vendor="com.snowplowanalytics.snowplow.ecommerce",
    name="snowplow_ecommerce_action",
    version="1-0-2",
)
site_search = Event(vendor="com.snowplowanalytics.snowplow", name="site_search", version="1-0-0")
identify = Event(vendor="com.snowplowanalytics.snowplow", name="identify", version="1-0-0")
external_event = Event(vendor=VENDOR, name="external_event", version="1-0-0")


def ecommerce_type(action_type):
    """Matches one ecommerce action, such as product_view or transaction."""
    return Criterion.eq(
        EventProperty(
            vendor="com.snowplowanalytics.snowplow.ecommerce",
            name="snowplow_ecommerce_action",
            major_version=1,
            path="type",
        ),
        action_type,
    )


def external_field(path):
    return EventProperty(
        vendor=VENDOR,
        name="external_event",
        major_version=1,
        path=path,
    )


original_event_name = EntityProperty(
    vendor=VENDOR,
    name="external_identity",
    major_version=1,
    path="event_name",
)
```

</details>

## Visitor activity

How much a visitor has browsed, and where they came from. Works on every approach. `first_referrer_medium` and `first_utm_source` need the referer parser and campaign attribution enrichments turned on in your pipeline.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `page_views_7d` | `page_view` events | Count over 7 days |
| `distinct_pages_7d` | `page_urlpath` on page views | Approximate distinct count over 7 days |
| `last_page_title` | `page_title` on page views | Last value |
| `first_referrer_medium` | `refr_medium` on page views | First value |
| `first_utm_source` | `mkt_source` on any event | First value |

<details>
<summary>visitor_activity</summary>

```python
visitor_activity = StreamAttributeGroup(
    name="visitor_activity",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="page_views_7d",
            type="int32",
            events=[page_view],
            aggregation="counter",
            period=timedelta(days=7),
            default_value=0,
        ),
        Attribute(
            name="distinct_pages_7d",
            type="int32",
            events=[page_view],
            aggregation="approx_count_distinct",
            property=AtomicProperty(name="page_urlpath"),
            period=timedelta(days=7),
        ),
        Attribute(
            name="last_page_title",
            type="string",
            events=[page_view],
            aggregation="last",
            property=AtomicProperty(name="page_title"),
        ),
        Attribute(
            name="first_referrer_medium",
            type="string",
            events=[page_view],
            aggregation="first",
            property=AtomicProperty(name="refr_medium"),
            ttl=timedelta(days=365),
        ),
        Attribute(
            name="first_utm_source",
            type="string",
            events=[],
            aggregation="first",
            property=AtomicProperty(name="mkt_source"),
            ttl=timedelta(days=365),
        ),
    ],
)
```

</details>

## Session engagement

What a visitor is doing in the current session. Works on client-side approaches, with the tracker's activity tracking turned on for page pings and scroll depth. On the PostHog and Amplitude server-side approaches, only the session counts work.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `page_views_this_session` | `page_view` events | Count |
| `page_pings_this_session` | `page_ping` events | Count |
| `max_scroll_depth` | `pp_yoffset_max` on page pings | Max |
| `product_views_this_session` | `snowplow_ecommerce_action` with type `product_view` | Count |
| `minutes_since_session_start` | Any event | Time since first |

<details>
<summary>session_engagement</summary>

```python
session_engagement = StreamAttributeGroup(
    name="session_engagement",
    version=1,
    attribute_key=domain_sessionid,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="page_views_this_session",
            type="int32",
            events=[page_view],
            aggregation="counter",
            default_value=0,
        ),
        Attribute(
            name="page_pings_this_session",
            type="int32",
            events=[page_ping],
            aggregation="counter",
            default_value=0,
        ),
        Attribute(
            name="max_scroll_depth",
            type="int32",
            events=[page_ping],
            aggregation="max",
            property=AtomicProperty(name="pp_yoffset_max"),
        ),
        Attribute(
            name="product_views_this_session",
            type="int32",
            events=[ecommerce_action],
            aggregation="counter",
            criteria=Criteria(all=[ecommerce_type("product_view")]),
            default_value=0,
        ),
        Attribute(
            name="minutes_since_session_start",
            type="double",
            events=[],
            aggregation="time_since_first",
            time_unit="min",
        ),
    ],
)
```

</details>

## Purchase intent

Products a visitor has looked at or bought, and what they searched for. Works on every approach, for events your adapter maps to ecommerce or site search. `revenue_30d_usd` counts orders in one currency: add one attribute per currency you sell in.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `product_views_30d` | `snowplow_ecommerce_action` with type `product_view` | Count over 30 days |
| `last_product_viewed` | `product` entity `id` | Last value |
| `categories_viewed` | `product` entity `category` | Unique list |
| `add_to_carts_30d` | `snowplow_ecommerce_action` with type `add_to_cart` | Count over 30 days |
| `orders_30d` | `snowplow_ecommerce_action` with type `transaction` | Count over 30 days |
| `revenue_30d_usd` | `transaction` entity `revenue`, for orders in USD | Sum over 30 days |
| `searches_30d` | `site_search` events | Count over 30 days |
| `search_terms` | `site_search` `terms` | Count per term |

<details>
<summary>purchase_intent</summary>

```python
product_view_type = Criteria(all=[ecommerce_type("product_view")])

purchase_intent = StreamAttributeGroup(
    name="purchase_intent",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="product_views_30d",
            type="int32",
            events=[ecommerce_action],
            aggregation="counter",
            criteria=product_view_type,
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="last_product_viewed",
            type="string",
            events=[ecommerce_action],
            aggregation="last",
            criteria=product_view_type,
            property=EntityProperty(
                vendor="com.snowplowanalytics.snowplow.ecommerce",
                name="product",
                major_version=1,
                path="id",
            ),
        ),
        Attribute(
            name="categories_viewed",
            type="string_list",
            events=[ecommerce_action],
            aggregation="unique_list",
            criteria=product_view_type,
            property=EntityProperty(
                vendor="com.snowplowanalytics.snowplow.ecommerce",
                name="product",
                major_version=1,
                path="category",
            ),
        ),
        Attribute(
            name="add_to_carts_30d",
            type="int32",
            events=[ecommerce_action],
            aggregation="counter",
            criteria=Criteria(all=[ecommerce_type("add_to_cart")]),
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="orders_30d",
            type="int32",
            events=[ecommerce_action],
            aggregation="counter",
            criteria=Criteria(all=[ecommerce_type("transaction")]),
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="revenue_30d_usd",
            type="double",
            events=[ecommerce_action],
            aggregation="sum",
            criteria=Criteria(
                all=[
                    ecommerce_type("transaction"),
                    Criterion.eq(
                        EntityProperty(
                            vendor="com.snowplowanalytics.snowplow.ecommerce",
                            name="transaction",
                            major_version=1,
                            path="currency",
                        ),
                        "USD",
                    ),
                ]
            ),
            property=EntityProperty(
                vendor="com.snowplowanalytics.snowplow.ecommerce",
                name="transaction",
                major_version=1,
                path="revenue",
            ),
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="searches_30d",
            type="int32",
            events=[site_search],
            aggregation="counter",
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="search_terms",
            type="dict",
            events=[site_search],
            aggregation="category_count",
            property=EventProperty(
                vendor="com.snowplowanalytics.snowplow",
                name="site_search",
                major_version=1,
                path="terms",
            ),
        ),
    ],
)
```

</details>

## Account and plan

The account a visitor belongs to and the plan they are on, for B2B and subscription products. Works on every approach, when your tool sends the plan or account on an event or a group call. A plan stored only on the user profile in your tool isn't sent.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `current_plan` | `external_event` `plan`, where set | Last value |
| `account_id` | `external_event` `group_id`, where set | Last value |
| `group_calls_30d` | `external_event` with kind `group` | Count over 30 days |

<details>
<summary>account_and_plan</summary>

```python
account_and_plan = StreamAttributeGroup(
    name="account_and_plan",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="current_plan",
            type="string",
            events=[external_event],
            aggregation="last",
            criteria=Criteria(all=[Criterion.is_not_null(external_field("plan"))]),
            property=external_field("plan"),
            ttl=timedelta(days=365),
        ),
        Attribute(
            name="account_id",
            type="string",
            events=[external_event],
            aggregation="last",
            criteria=Criteria(all=[Criterion.is_not_null(external_field("group_id"))]),
            property=external_field("group_id"),
            ttl=timedelta(days=365),
        ),
        Attribute(
            name="group_calls_30d",
            type="int32",
            events=[external_event],
            aggregation="counter",
            criteria=Criteria(all=[Criterion.eq(external_field("kind"), "group")]),
            period=timedelta(days=30),
            default_value=0,
        ),
    ],
)
```

</details>

To calculate attributes per account instead of per visitor, key a group on `group_id`. Account IDs are often guessable, so read these attributes from your backend only.

<details>
<summary>account_plan, keyed on the account</summary>

```python
account_key = AttributeKey(
    name="external_group_id",
    description="The account ID from the source tool's group call",
    property=external_field("group_id"),
)

account_plan = StreamAttributeGroup(
    name="account_plan",
    version=1,
    attribute_key=account_key,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="current_plan",
            type="string",
            events=[external_event],
            aggregation="last",
            criteria=Criteria(all=[Criterion.is_not_null(external_field("plan"))]),
            property=external_field("plan"),
            ttl=timedelta(days=365),
        ),
    ],
)
```

</details>

## Funnel

Which of your own events a visitor has triggered, and when. Replace `Signup Form Submitted` with your own event name, exactly as your tool sends it. Works on every approach.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `signup_submitted` | `external_event` with name `Signup Form Submitted` | Count |
| `minutes_since_signup` | The same events | Time since last |
| `logins_30d` | `identify` events | Count over 30 days |
| `recent_events` | `external_identity` `event_name` on any event | Unique list over 1 day |

<details>
<summary>funnel</summary>

```python
signup_name = Criteria(
    all=[Criterion.eq(external_field("name"), "Signup Form Submitted")]
)

funnel = StreamAttributeGroup(
    name="funnel",
    version=1,
    attribute_key=domain_userid,
    owner="user@company.com",
    attributes=[
        Attribute(
            name="signup_submitted",
            type="int32",
            events=[external_event],
            aggregation="counter",
            criteria=signup_name,
            default_value=0,
            ttl=timedelta(days=365),
        ),
        Attribute(
            name="minutes_since_signup",
            type="double",
            events=[external_event],
            aggregation="time_since_last",
            criteria=signup_name,
            time_unit="min",
            ttl=timedelta(days=365),
        ),
        Attribute(
            name="logins_30d",
            type="int32",
            events=[identify],
            aggregation="counter",
            period=timedelta(days=30),
            default_value=0,
        ),
        Attribute(
            name="recent_events",
            type="string_list",
            events=[],
            aggregation="unique_list",
            property=original_event_name,
            period=timedelta(days=1),
        ),
    ],
)
```

</details>

## Publish the groups

Publish the groups your approach supports:

```python
sp_signals.publish([
    visitor_activity,
    session_engagement,
    purchase_intent,
    account_and_plan,
    funnel,
])
```

Attributes are calculated from the moment you publish, within about a second of each event reaching your Collector. The first values after publishing can take a minute or more. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).

Attributes without a time window are deleted after 7 days without an update. The definitions above keep the ones meant to last, such as the first referrer and the current plan, for 365 days with `ttl`. In Console, this is the **Time to live (TTL)** field.

## Create an intervention

An intervention tells your application that a visitor's attributes have met a condition you set. Signals delivers it to an attribute key, such as `domain_userid`, and your page reacts to it. See [Define interventions](/docs/signals/interventions/index.md) for every option.

This example fires when a visitor adds a product to their cart or places an order, using the [purchase intent](#purchase-intent) group, which is keyed on `domain_userid`. Publish the group first.

In Console, go to **Signals** > **Interventions** and create an intervention named `purchase_intent_nudge` with yourself as owner. Add two criteria, `purchase_intent` `add_to_carts_30d` `>=` `1` and `purchase_intent` `orders_30d` `>=` `1`, and set the intervention to trigger when any of them is met. Keep the default target, `domain_userid`. Save it, then select **Publish**.

With the Python SDK, using the setup above:

```python
from snowplow_signals import InterventionCriteriaAny, InterventionCriterion, RuleIntervention

purchase_intent_nudge = RuleIntervention(
    name="purchase_intent_nudge",
    owner="you@example.com",
    criteria=InterventionCriteriaAny(any=[
        InterventionCriterion(attribute="purchase_intent:add_to_carts_30d", operator=">=", value=1),
        InterventionCriterion(attribute="purchase_intent:orders_30d", operator=">=", value=1),
    ]),
)

sp_signals.publish([purchase_intent_nudge])
```

Deliver interventions only to a key that's safe on the public intervention endpoint, such as `domain_userid` from a client-side approach. See [Choose a key](#choose-a-key).

## Receive interventions in the page

On a client-side approach, add the [Signals browser plugin](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin) to the Snowplow tracker and subscribe. Run this after `newTracker`, and set `endpoint` to your Signals API URL:

```js
snowplow('addPlugin', 'https://cdn.jsdelivr.net/npm/@snowplow/signals-browser-plugin@0.2.2/dist/index.umd.min.js', ['snowplowSignals', 'SignalsPlugin']);

snowplow('addInterventionHandlers', {
  purchaseIntentNudge: function (intervention) {
    if (intervention.name === 'purchase_intent_nudge') {
      // Show the offer in your UI.
    }
  },
});

snowplow('subscribeToInterventions', { endpoint: 'YOUR_SIGNALS_API_URL' });
```

Load the plugin once per page: a second copy doesn't receive your handlers. Approaches that send events without the Snowplow tracker can't use the plugin.

In Google Tag Manager:

1. On the **Snowplow v4** page view tag that fires on **Window Loaded**, open **Load Plugins** and add a row with **Plugin URL** set to the URL above and **Plugin Configuration** set to `snowplowSignals,SignalsPlugin`. If the same tag also fires on **History Change**, split it into two tags and load the plugin only on the Window Loaded one.
2. Add a **Custom HTML** tag on **Window Loaded** with the `addInterventionHandlers` and `subscribeToInterventions` calls in a `<script>` element. Under **Advanced Settings** > **Tag Sequencing**, select **Fire a tag before** this tag fires, and choose the Window Loaded page view tag.

See [Subscribe to interventions](/docs/signals/applications/subscribe/index.md) for the options.

Where to go next:

- Check which IDs your approach uses in [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).
- To combine a visitor's activity before and after they log in, see [Calculate attributes per person with identity resolution](/docs/signals/attributes/identity-resolution/index.md).
- Replace `external_event` with your own schemas one event at a time: [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).
