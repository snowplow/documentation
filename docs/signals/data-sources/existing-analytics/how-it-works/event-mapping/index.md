---
title: "How events from your tool map to Snowplow events"
sidebar_label: "Event mapping"
sidebar_position: 10
description: "Every adapter maps each event to the first Snowplow event that fits: page view, ecommerce, site search, identify, a Google schema on GA4, or external_event."
keywords: ["event mapping", "external_event", "snowplow_ecommerce_action", "site_search", "identify", "signals attributes"]
date: "2026-11-13"
content_type: concept
---

Every adapter, client-side or server-side and for every tool, maps an event the same way. It goes down a ladder of Snowplow event types and takes the first rung that fits. Events that have a standard Snowplow equivalent become that event, so Signals attributes and Snowplow data models built for those events work unchanged. Only what's left becomes the generic `external_event`.

## The ladder

| Rung | Snowplow event | Examples from your tool |
| --- | --- | --- |
| 1 | Page view (`page_view`, native) | Segment and RudderStack `page`, GA4 `page_view`, Amplitude `[Amplitude] Page Viewed`, Adobe page view events |
| 2 | Ecommerce (`com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action` 1-0-2, with product, cart, checkout step, transaction or refund entities) | Segment and RudderStack `Product Viewed` and `Order Completed`, GA4 `view_item` and `purchase`, Adobe `commerce.purchases` and `purchase` |
| 3 | Site search (`com.snowplowanalytics.snowplow/site_search` 1-0-0) | Segment and RudderStack `Products Searched`, GA4 `search` and `view_search_results` |
| 4 | Identify (`com.snowplowanalytics.snowplow/identify` 1-0-0, ID only) | Segment and RudderStack `identify`, GA4 `login`, Amplitude `$identify` with a user ID, Adobe logins |
| 5 | Google's schemas (GA4 only) | GA4 Enhanced Measurement events such as `scroll`, `click` and `file_download`, `user_engagement`, and recommended events such as `sign_up` and `generate_lead` |
| 6 | `com.snowplowanalytics.snowplow/external_event` 1-0-0 | Everything else: group and alias calls, your own custom events, autocaptured events, and ecommerce events missing a field Snowplow requires |

Every event, on every rung, also carries an `external_identity` entity with your tool's IDs and the original event name. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

:::note
Every schema on this page is published on Iglu Central. If you register your own copies of `external_event` and `external_identity`, deploy them to production before you send events that use them. Events sent before deployment are rejected for several minutes after it.
:::

## Rung 1: page views

Page views stay native Snowplow page views, with the page URL, title and referrer in the standard fields. On server-side approaches, Segment and RudderStack `screen` calls also become page views. When the call has no page URL, the URL is `screen://` followed by the screen name.

On client-side approaches, the Snowplow tracker records each page view itself, so it also sets the referrer between pages of a single-page app.

## Rung 2: ecommerce

Ecommerce events become `snowplow_ecommerce_action` events, shaped the way the [Snowplow ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) sends them. Each product becomes its own product entity, so every line of an order is kept in your data. A Signals attribute reads one product entity per event, the first by default or the one at the index you set.

This is a Segment `Order Completed` with two products, as the Segment adapter sends it:

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

Which events take this rung:

| Tool | Events |
| --- | --- |
| Segment, RudderStack | `Product Viewed`, `Product Added`, `Product Removed`, `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed`, `Order Completed`, `Order Refunded` |
| GA4 | `view_item`, `view_item_list`, `select_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_payment_info`, `purchase`, `refund` |
| Amplitude | Product viewed, added and removed, checkout started, order completed, refunds and the revenue call, matched by event name, so you list your own names |
| Adobe | XDM `commerce.productViews`, `productListAdds`, `productListRemovals`, `checkouts` and `purchases`; Analytics `prodView`, `scAdd`, `scRemove`, `scCheckout` and `purchase` |

The Snowplow ecommerce schemas require some fields that other tools treat as optional. The adapters fill or skip them like this:

- **Payment method.** The transaction entity requires one. When the event has none, the adapter sends `unknown`. Adobe AppMeasurement hits never carry one.
- **Product category.** Required on the product entity. Segment and RudderStack adapters send an empty string when it's missing; the GA4 and AppMeasurement adapters send `unknown`.
- **Price and currency.** The Segment adapter leaves out a product with no price or currency. An order with no currency or order ID drops to `external_event` instead.
- **Cart total.** The cart entity requires a total value, which most tools don't send with add to cart. Segment's adapter leaves the cart entity off when there's no cart total. The GA4 adapter uses the event's value, which is what was added rather than the whole cart. The Adobe and RudderStack adapters fall back to the value of the items in the event.

:::caution
An event whose name isn't in your tool's ecommerce list never reaches this rung. For example, Segment's `Cart Abandoned` isn't one of Segment's ecommerce events, so it becomes `external_event` and keeps only its first product.
:::

## Rung 3: site search

Searches become `site_search` with the search term in `terms`. This is an Amplitude `Products Searched` event as the adapter sends it:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0",
  "data": { "terms": ["blue mug"], "totalResults": 4 }
}
```

`terms` is a list. In Signals, count searches with a `counter` on `site_search`, and count terms with the `category_count` aggregation on `terms`, which returns each term with its count.

On Adobe, searches come from the XDM `siteSearch.query` field or from an Analytics search event you configure.

## Rung 4: identify

Logins and identify calls become a Snowplow `identify` event that holds the user ID and nothing else. The `identify` schema also has an email field; the adapters never fill it, and they drop identify traits such as name, email and plan.

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0",
  "data": { "id": "user-123" }
}
```

When a user ID contains `@`, the Segment adapter and the Adobe event forwarding converter send an unsalted SHA-256 hash of it instead, and the Adobe client-side adapters drop it. The RudderStack and Amplitude adapters send the user ID unchanged, so hash it in your tool first if your user IDs can be emails. See [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

Because traits are dropped, a plan set only in identify traits, or only on an Adobe login hit, doesn't reach Snowplow. Send it on a group call or a track event instead, where it fills the `plan` field of `external_event`.

## Rung 5: Google's schemas on GA4

On GA4 approaches, events that Google defines and Snowplow has no equivalent for use the Google schemas on Iglu Central, the same ones Snowplow's server-side GTM tag uses:

- `com.google.ga4.enhanced-measurement`: `scroll`, `click`, `file_download` and the other Enhanced Measurement events.
- `com.google.ga4`: `user_engagement`, with `engagement_time_msec`.
- `com.google.tag-manager.server-side`: recommended events such as `sign_up`, `generate_lead`, `share`, `select_content`, `add_to_wishlist` and `exception`.

```json
{
  "schema": "iglu:com.google.ga4/user_engagement/jsonschema/1-0-0",
  "data": { "engagement_time_msec": 3024 }
}
```

GA4 sends Enhanced Measurement events from gtag itself, not through the data layer, so only the server-side GTM approach receives them. On client-side GA4 approaches, turn on the Snowplow tracker's own page pings, link clicks and site search tracking instead.

Signals attributes work on these schemas like any other. This attribute adds up GA4 engagement time:

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

## Rung 6: external_event

Everything else becomes `external_event`. It has a fixed set of typed fields:

| Field | Type | Holds |
| --- | --- | --- |
| `name` | string, required | The event name in your tool, such as `Signup Form Submitted`, `signup_form_submitted` or `[Amplitude] Form Submitted` |
| `tool` | string, required | `segment`, `rudderstack`, `amplitude`, `mixpanel`, `ga4`, `adobe`, `heap`, `tealium` or `other` |
| `kind` | string, required | `track`, `identify`, `group`, `alias`, `screen` or `page` |
| `value` | number | A revenue, value, total or price property |
| `currency` | string | A three-letter currency code |
| `item_id` | string | The product or item ID; on events with several items, the first one |
| `item_category` | string | The product or item category; on events with several items, the first one |
| `search_term` | string | A search query property |
| `plan` | string | A plan property, from track properties or group traits |
| `group_id` | string | The account or group ID on group calls |
| `previous_id` | string | The previous ID on alias calls |

This is a Segment group call as the adapter sends it:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": { "name": "group", "tool": "segment", "kind": "group", "plan": "enterprise", "group_id": "acct-9" }
}
```

And a custom event that carried an email, a search term and a plan. The email doesn't fit any field, so it's dropped:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0",
  "data": { "name": "Signup Form Submitted", "tool": "segment", "kind": "track", "search_term": "snowplow signals", "plan": "pro" }
}
```

On Adobe, which eVars, props or XDM fields hold the plan, account and search term differs for every report suite and datastream, so you configure that map yourself. See the [Adobe page](/docs/signals/data-sources/existing-analytics/tools/adobe/index.md).

### Why external_event has fixed fields

Signals calculates attributes only on properties that a schema declares. If `external_event` carried a free-form `properties` object, you couldn't build an attribute on anything inside it. So the schema declares the fields that the starter attribute groups need, such as value, item, plan and account, and the adapter maps your tool's properties into them. Any property that doesn't map to a field is dropped.

This has two consequences:

- Events with several items keep only the first item in `item_id` and `item_category`. Events on the ecommerce rung aren't affected, because each product there is its own entity.
- If you need an attribute on a property `external_event` doesn't have, track that event natively with its own schema. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

## Filter attributes on the event name

Because every custom event from your tool is the same Snowplow event type, an attribute on `external_event` needs a criteria filter on `name` to pick out one event. Use the name exactly as your tool sends it.

This attribute counts Segment `Signup Form Submitted` events. It uses the Signals Python SDK's [criteria filters](/docs/signals/attributes/attributes/index.md#filter-with-criteria):

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

To filter on the original name of any event, including events that became page views or ecommerce events, use the `event_name` property of the `external_identity` entity instead:

```python
from snowplow_signals import EntityProperty

original_event_name = EntityProperty(
    vendor="com.snowplowanalytics.snowplow",
    name="external_identity",
    major_version=1,
    path="event_name",
)
```
