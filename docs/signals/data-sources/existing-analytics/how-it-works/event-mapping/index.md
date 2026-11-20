---
title: "How events from your tool map to Snowplow events"
sidebar_label: "Event mapping"
sidebar_position: 10
description: "Every adapter maps each event to the first Snowplow event that fits: page view, ecommerce, site search, identify, a Google schema on GA4, or external_event."
keywords: ["event mapping", "external_event", "snowplow_ecommerce_action", "site_search", "identify", "signals attributes"]
date: "2026-11-17"
content_type: concept
---

Every adapter maps an event the same way, whatever the tool or approach. It goes down a ladder of Snowplow event types and takes the first one that fits. Events with a standard Snowplow equivalent become that event, so Signals attributes and Snowplow data models built for them work unchanged. Only what's left becomes the generic `external_event`.

## The ladder

| Rung | Snowplow event | Examples from your tool |
| --- | --- | --- |
| 1 | Page view (`page_view`, native) | Segment and RudderStack `page`, GA4 `page_view`, Amplitude `[Amplitude] Page Viewed`, Adobe page view events, PostHog `$pageview` |
| 2 | Ecommerce (`com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action` 1-0-2, with product, cart, checkout step, transaction or refund entities) | Segment and RudderStack `Product Viewed` and `Order Completed`, GA4 `view_item` and `purchase`, Adobe `commerce.purchases` and `purchase`, PostHog `Product Viewed` and `Order Completed` |
| 3 | Site search (`com.snowplowanalytics.snowplow/site_search` 1-0-0) | Segment, RudderStack and PostHog `Products Searched`, GA4 `search` and `view_search_results` |
| 4 | Identify (`com.snowplowanalytics.snowplow/identify` 1-0-0, ID only) | Segment and RudderStack `identify`, GA4 `login`, Amplitude and PostHog `$identify` with a user ID, Adobe logins |
| 5 | Google's schemas (GA4 only) | GA4 Enhanced Measurement events such as `scroll`, `click` and `file_download`, `user_engagement`, and recommended events such as `sign_up` and `generate_lead` |
| 6 | `com.snowplowanalytics.snowplow/external_event` 1-0-0 | Everything else: group and alias calls, your own custom events, autocaptured events, and ecommerce events missing a field Snowplow requires |

Every event also carries an `external_identity` entity with your tool's IDs and the original event name. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md). Every schema on this page is published on Iglu Central.

## Page views

Page views stay native Snowplow page views, with the page URL, title and referrer in the standard fields.

## Ecommerce

Ecommerce events become `snowplow_ecommerce_action` events, shaped the way the [Snowplow ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) sends them. Each product becomes its own product entity, so every line of an order is kept. A Signals attribute reads one product entity per event.

Only the events your tool defines as ecommerce take this rung, such as Segment's `Order Completed` or GA4's `purchase`. Each tool page lists them. Where your tool leaves out a field Snowplow requires, the adapter fills a placeholder, such as a payment method of `unknown`. An order with no currency or order ID becomes `external_event` instead.

<details>
<summary>Example: a Segment order with two products</summary>

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2",
  "data": { "type": "transaction" }
}
```

With these entities:

```json
[
  { "schema": "iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0",
    "data": { "id": "sku-42", "price": 12.5, "currency": "USD", "quantity": 3, "category": "Mugs" } },
  { "schema": "iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0",
    "data": { "id": "sku-77", "name": "Cork Coaster", "price": 8, "currency": "USD", "quantity": 2, "category": "Coasters" } },
  { "schema": "iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0",
    "data": { "transaction_id": "o-1001", "revenue": 53.5, "currency": "USD", "payment_method": "unknown", "total_quantity": 5 } },
  { "schema": "iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0",
    "data": { "tool": "segment", "anonymous_id": "a525264d-56e3-4050-9599-397af94571a2", "user_id": null,
              "session_id": null, "session_number": null, "event_name": "Order Completed" } }
]
```

</details>

## Site search

Searches become `site_search`, with the search term in the `terms` list. In Signals, count searches with a `counter` on `site_search`, and count terms with the `category_count` aggregation on `terms`.

## Identify

Logins and identify calls become a Snowplow `identify` event that holds the user ID and nothing else. Identify traits, such as name, email and plan, are dropped. The user ID is sent unchanged, so if it's an email address, the email reaches Snowplow. To use a plan in attributes, send it on a group call or a track event, where it fills the `plan` field of `external_event`.

## Google's schemas on GA4

On GA4, events that Google defines and Snowplow has no equivalent for, such as Enhanced Measurement's `scroll` and `file_download`, `user_engagement` and recommended events such as `sign_up`, use the Google schemas on Iglu Central. These are the same schemas Snowplow's server-side GTM tag uses. Enhanced Measurement events come only through server-side GTM; on client-side approaches, use the Snowplow tracker's own page pings and link clicks instead.

Signals attributes work on these schemas like any other. This one adds up GA4 engagement time:

```python
from snowplow_signals import Attribute, Event, EventProperty

engagement_msec = Attribute(
    name="engagement_msec",
    type="int64",
    events=[Event(vendor="com.google.ga4", name="user_engagement", version="1-0-0")],
    aggregation="sum",
    property=EventProperty(
        vendor="com.google.ga4",
        name="user_engagement",
        major_version=1,
        path="engagement_time_msec",
    ),
    default_value=0,
)
```

## external_event

Everything else becomes `external_event`, with a fixed set of typed fields:

| Field | Type | Holds |
| --- | --- | --- |
| `name` | string, required | The event name in your tool, such as `Signup Form Submitted`, `signup_form_submitted` or `[Amplitude] Form Submitted` |
| `tool` | string, required | Your tool's name in lower case, such as `segment`, `ga4` or `posthog` |
| `kind` | string, required | `track`, `identify`, `group`, `alias`, `screen` or `page` |
| `value` | number | A revenue, value, total or price property |
| `currency` | string | A three-letter currency code |
| `item_id` | string | The product or item ID; on events with several items, the first one |
| `item_category` | string | The product or item category; on events with several items, the first one |
| `search_term` | string | A search query property |
| `plan` | string | A plan property, from track properties or group traits |
| `group_id` | string | The account or group ID on group calls |
| `previous_id` | string | The previous ID on alias calls |

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": { "name": "group", "tool": "segment", "kind": "group", "plan": "enterprise", "group_id": "acct-9" }
}
```

Signals calculates attributes only on properties a schema declares, which is why `external_event` has fixed fields instead of carrying your tool's properties as they are. Any property that doesn't map to a field is dropped, and events with several items keep only the first in `item_id` and `item_category`. If you need an attribute on a property `external_event` doesn't have, track that event natively. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

## Filter attributes on the event name

Every custom event from your tool is the same Snowplow event type, so an attribute on `external_event` needs a [criteria filter](/docs/signals/attributes/attributes/index.md#filter-with-criteria) on `name`. Use the name exactly as your tool sends it. This attribute counts Segment `Signup Form Submitted` events:

```python
from snowplow_signals import Attribute, Criteria, Criterion, Event, EventProperty

external_event = Event(
    vendor="com.snowplowanalytics.snowplow",
    name="external_event",
    version="1-0-0",
)

external_event_name = EventProperty(
    vendor="com.snowplowanalytics.snowplow",
    name="external_event",
    major_version=1,
    path="name",
)

signup_count = Attribute(
    name="signup_form_submitted_count",
    description="Number of Signup Form Submitted events from Segment",
    type="int32",
    events=[external_event],
    aggregation="counter",
    criteria=Criteria(
        all=[Criterion.eq(external_event_name, "Signup Form Submitted")]
    ),
)
```

In Console, select the `external_event` schema as the attribute's event, choose the `counter` aggregation, and under **More options** add a criterion on the `name` event property with the `=` operator.

To filter on the original name of any event, including events that became page views or ecommerce events, use `event_name` in the `external_identity` entity:

```python
from snowplow_signals import EntityProperty

original_event_name = EntityProperty(
    vendor="com.snowplowanalytics.snowplow",
    name="external_identity",
    major_version=1,
    path="event_name",
)
```
