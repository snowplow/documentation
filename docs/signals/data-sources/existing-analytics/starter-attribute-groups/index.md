---
title: "Starter attribute groups for events from your existing analytics"
sidebar_label: "Starter attribute groups"
sidebar_position: 40
description: "Five attribute groups you can copy to calculate visitor, session, purchase, account and funnel attributes from events that reach Snowplow from Segment, RudderStack, GA4, Amplitude or Adobe."
keywords: ["attribute groups", "external_event", "segment", "ga4", "amplitude", "adobe", "rudderstack", "python sdk"]
date: "2026-11-13"
content_type: how-to
---

Once your existing analytics events reach Snowplow, you can calculate Signals attributes on them the same way you would on events from a Snowplow tracker. This page gives five attribute groups to start from:

- [Visitor activity](#visitor-activity): page views, pages and where visitors came from
- [Session engagement](#session-engagement): what a visitor is doing in the current session
- [Purchase intent](#purchase-intent): products viewed, carts, orders and searches
- [Account and plan](#account-and-plan): the account and plan a visitor belongs to
- [Funnel](#funnel): your own event names, such as a signup or a login

Each group lists its attributes, the events and fields it reads, and which approaches support it. The definitions use the [Signals Python SDK](/docs/signals/connection/index.md). You can create the same attributes in Console.

:::caution[Deploy the schemas before you send events]
These definitions read `external_event` and `external_identity`, published on Iglu Central. If you register your own copies, deploy both to production before you create the groups, and before you send any event that uses them. Signals rejects an attribute on a schema that isn't in production. If your pipeline looks up a schema before it is deployed, it keeps rejecting events that use it for several minutes after deployment.

If you register them under your own vendor, such as `com.acme`, use that vendor in the adapter's configuration and in the definitions below. See the [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) reference pages.
:::

## What the attributes read

Every adapter maps events down the same ladder, described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md). The attribute groups read the result:

| Your tool's event | Snowplow event | Fields the starter groups read |
| --- | --- | --- |
| Page view | `page_view` | `page_url`, `page_title`, `page_referrer`, `refr_medium`, `mkt_source` |
| Product view, add to cart, checkout, order, refund | `snowplow_ecommerce_action` with `product`, `cart`, `checkout_step`, `transaction` and `refund` entities | Action `type`, product `id`, `category` and `price`, transaction `revenue` and `currency` |
| Site search | `site_search` | `terms` |
| Identify or login | `identify` | The event itself (it carries the user ID only) |
| Anything else | `external_event` | `name`, `kind`, `plan`, `group_id`, `item_id`, `value` |
| Every event | `external_identity` entity | `event_name`, the event's original name in your tool |

Signals only calculates attributes on properties a schema declares. That is why `external_event` has fixed, typed fields instead of carrying your tool's properties as they are. Any property that doesn't fit one of those fields isn't available to attributes.

## Choose an approach and a key

Most tools can send events to Snowplow in two ways. The approach you use decides which attribute groups work and which attribute key to use.

**Client-side approaches** run the Snowplow JavaScript tracker in the page alongside your tool, and copy each of your tool's calls into it. The tracker sets its own random visitor ID (`domain_userid`) and session ID (`domain_sessionid`), and can send page pings. Every starter group works, and you can key them on `domain_userid` or `domain_sessionid`.

**Server-side approaches** convert events in your tool's own workspace and post them to your Collector. They also cover events from your servers and apps. They have no Snowplow session and no page pings, and `domain_userid` holds your tool's own visitor ID. Visitor, purchase, account and funnel groups work. Session engagement does not.

**Warehouse history** from your tool's export can fill a warehouse attribute group with values from before you connected. It needs a Signals warehouse connection.

| Attribute group | Client-side | Server-side | Warehouse history |
| --- | --- | --- | --- |
| Visitor activity | Yes | Yes, keyed on your tool's visitor ID | Possible |
| Session engagement | Yes, with the tracker's activity tracking turned on | No | No |
| Purchase intent | Yes | Yes | Possible |
| Account and plan | Yes | Yes | Possible |
| Funnel | Yes | Yes | Possible |

The approaches each tool supports:

| Tool | Client-side approach | Server-side approach |
| --- | --- | --- |
| [Segment](/docs/signals/data-sources/existing-analytics/tools/segment/index.md) | A destination plugin in analytics.js that feeds the Snowplow tracker | A Destination Function in your Segment workspace |
| [RudderStack](/docs/signals/data-sources/existing-analytics/tools/rudderstack/index.md) | A custom device mode integration that feeds the Snowplow tracker | A transformation on a Webhook destination, or no-code HTTP Webhook mappings |
| [GA4 and Google Tag Manager](/docs/signals/data-sources/existing-analytics/tools/ga4-and-google-tag-manager/index.md) | Snowplow's tag templates in your web GTM container, or a page script that copies `gtag()` calls | Snowplow's tag in your server-side GTM container |
| [Amplitude](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md) | A destination plugin in the Browser SDK that feeds the Snowplow tracker | A Webhook destination with a template |
| [Adobe](/docs/signals/data-sources/existing-analytics/tools/adobe/index.md) | A Web SDK `onBeforeEventSend` callback, an AppMeasurement pre-track callback, or Tags rules on the Adobe Client Data Layer, each feeding the Snowplow tracker | Event forwarding |

:::caution[Keys on the public intervention endpoint]
Interventions are delivered through a public endpoint, so the key you use there must be a random value nobody can guess. Use `domain_userid` or `domain_sessionid` from a client-side approach that runs the Snowplow tracker. Never use `user_id`, a GA client ID, a timestamp-based session ID, an Adobe ECID, Amplitude's `device_id` or Segment's `anonymousId` there. On a server-side approach, `domain_userid` holds your tool's ID, so read those attributes from your backend only. See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) for each tool's IDs.
:::

## Set up the SDK

The examples below share this setup. They assume you have [connected to Signals](/docs/signals/connection/index.md) and have API credentials in environment variables.

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
external_event = Event(vendor="com.snowplowanalytics.snowplow", name="external_event", version="1-0-0")


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
        vendor="com.snowplowanalytics.snowplow",
        name="external_event",
        major_version=1,
        path=path,
    )


original_event_name = EntityProperty(
    vendor="com.snowplowanalytics.snowplow",
    name="external_identity",
    major_version=1,
    path="event_name",
)
```

## Visitor activity

How much a visitor has browsed, and where they came from.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `page_views_7d` | `page_view` events | Count over 7 days |
| `distinct_pages_7d` | `page_urlpath` on page views | Approximate distinct count over 7 days |
| `last_page_title` | `page_title` on page views | Last value |
| `first_referrer_medium` | `refr_medium` on page views | First value |
| `first_utm_source` | `mkt_source` on any event | First value |

**Supported on:** client-side and server-side approaches. On a server-side approach, the page URL, title and referrer come from your tool's payload, and the key is your tool's visitor ID.

`refr_medium` and `mkt_source` are filled by the referer parser and campaign attribution enrichments, so both need to be on in your pipeline. A `first` attribute keeps the first value that isn't empty: when a visitor's first page view has no referrer, `first_referrer_medium` takes `internal` from their next page view on your site. On some tools the referrer is also lost on single-page app navigation, because the tool keeps reporting the first referrer.

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
        ),
        Attribute(
            name="first_utm_source",
            type="string",
            events=[],
            aggregation="first",
            property=AtomicProperty(name="mkt_source"),
        ),
    ],
)
```

## Session engagement

What a visitor is doing right now, in the current session.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `page_views_this_session` | `page_view` events | Count |
| `page_pings_this_session` | `page_ping` events | Count |
| `max_scroll_depth` | `pp_yoffset_max` on page pings | Max |
| `product_views_this_session` | `snowplow_ecommerce_action` with type `product_view` | Count |
| `minutes_since_session_start` | Any event | Time since first |

**Supported on:** client-side approaches that run the Snowplow tracker. Page pings need the tracker's activity tracking turned on; the number of pings multiplied by your heartbeat interval approximates engaged time. Server-side approaches have no Snowplow session, so `domain_sessionid` is empty and this group gets no values.

One exception: Amplitude's client-side plugin can post events directly to the Collector without the tracker. It builds a `domain_sessionid` from Amplitude's device and session IDs, so the session counts work, but it sends no page pings. See [Amplitude](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md).

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

## Purchase intent

Products a visitor has looked at or bought, and what they searched for.

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

**Supported on:** client-side and server-side approaches, for events your adapter maps to the ecommerce or search rung. An event falls back to `external_event` when its name isn't one the adapter knows or it lacks a field Snowplow's schema requires, such as a price, currency or order ID. Those events don't count here.

Every product in an order arrives as its own `product` entity. An `EntityProperty` reads one entity per event: the first by default, or the one at the `index` you set. An attribute can't collect every product in an order, so the product attributes here are most useful on product views, which carry one product.

`terms` on `site_search` is a list, so `search_terms` uses the `category_count` aggregation, which counts each term. Other aggregations, such as `last` and `unique_list`, don't accept a list, and a path such as `terms[0]` is rejected too.

`revenue_30d_usd` filters on one currency, because adding amounts in different currencies gives a meaningless total. Add one attribute per currency you sell in.

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

## Account and plan

The account a visitor belongs to and the plan they are on, for B2B and subscription products.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `current_plan` | `external_event` `plan`, where set | Last value |
| `account_id` | `external_event` `group_id`, where set | Last value |
| `group_calls_30d` | `external_event` with kind `group` | Count over 30 days |

**Supported on:** client-side and server-side approaches, wherever your tool sends the plan or account as an event property. How each tool gets there differs:

- **Segment and RudderStack:** `plan` comes from track properties or group traits, and `group_id` from group calls. A plan set only in identify traits is dropped, because identify carries the user ID only.
- **GA4:** `plan` and `group_id` arrive only when sent as event parameters. User properties set with `gtag('set', 'user_properties', ...)` are not forwarded.
- **Amplitude:** groups appear on identify and group identify events only, not on later track events.
- **Adobe:** you map the eVar, prop or XDM field that holds the plan and account when you set up the adapter. Adobe has no group call, so these events arrive with kind `track`.

The group call's `name` differs between tools (for example `group` in Segment and `$groupidentify` in Amplitude), so `group_calls_30d` filters on `kind` instead.

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
        ),
        Attribute(
            name="account_id",
            type="string",
            events=[external_event],
            aggregation="last",
            criteria=Criteria(all=[Criterion.is_not_null(external_field("group_id"))]),
            property=external_field("group_id"),
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

### Key account attributes on the account

To calculate attributes per account instead of per visitor, define a custom attribute key on `group_id`. Only events that carry `group_id` count towards it, which on most tools means group calls.

`group_id` is chosen by you and often guessable, so read these attributes from your backend only, and never use this key on the public intervention endpoint.

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
        ),
    ],
)
```

## Funnel

Which of your own events a visitor has triggered, and when. Replace the event names in the example with your own, exactly as your tool sends them.

| Attribute | Reads | Aggregation |
| --- | --- | --- |
| `signup_submitted` | `external_event` with name `Signup Form Submitted` | Count |
| `minutes_since_signup` | The same events | Time since last |
| `logins_30d` | `identify` events | Count over 30 days |
| `recent_events` | `external_identity` `event_name` on any event | Unique list over 1 day |

**Supported on:** client-side and server-side approaches.

Events your adapter maps to a standard Snowplow event, such as an order, keep their original name in the `external_identity` entity. `recent_events` reads that entity, so it lists every event name your tool sent, whatever Snowplow event it became. Page pings repeat the entity of the page view they belong to, so on client-side approaches they carry that page view's name.

Event names differ between tools. GA4 sends `signup_form_submitted` where Segment sends `Signup Form Submitted`, so match the name exactly as your tool sends it.

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
        ),
        Attribute(
            name="minutes_since_signup",
            type="double",
            events=[external_event],
            aggregation="time_since_last",
            criteria=signup_name,
            time_unit="min",
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

Attributes are calculated from the moment you publish. They change within about a second of each event reaching your Collector, so on server-side approaches add your tool's own delivery delay. Signals counts an event ID once, so a retry from your tool that repeats the ID doesn't count twice. To include earlier events from your atomic events table, set `backfill_since_tstamp` on the group. Backfill needs a warehouse connection. See [Define attribute groups](/docs/signals/attributes/attribute-groups/index.md).

## Read attributes across identifiers

A visitor's activity before and after they log in is split across `domain_userid` and `user_id`. If your pipeline has Snowplow Identities, you can key stream attribute groups on `snowplow_id` instead, and read them by up to three lookup identifiers, such as `domain_userid` and `user_id`. Interventions on these attributes are still delivered to a device identifier such as `domain_userid`. See [Calculate attributes per person with identity resolution](/docs/signals/attributes/identity-resolution/index.md).

This works for stream attribute groups only, and the lookup identifiers must be identifiers configured in Identities.

Where to go next:

- Check which IDs your approach uses in [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).
- Replace `external_event` with your own schemas one event at a time: [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

