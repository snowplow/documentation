---
title: "How events from your tool map to Snowplow events"
sidebar_label: "Event mapping"
sidebar_position: 10
description: "Every adapter maps each event to the first Snowplow event that fits: page view, ecommerce, site search, identify, a Google schema on GA4, or external_event."
keywords: ["event mapping", "external_event", "snowplow_ecommerce_action", "site_search", "identify", "signals attributes"]
date: "2026-11-17"
content_type: concept
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Every adapter maps an event the same way, whatever the tool or approach. It goes down a ladder of Snowplow event types and takes the first one that fits. Events with a standard Snowplow equivalent become that event, so Signals attributes and Snowplow data models built for them work unchanged. Only what's left becomes the generic `external_event`.

## The ladder

| Rung | Snowplow event | Examples from your tool |
| --- | --- | --- |
| 1 | Page view (`page_view`, native) | Segment and RudderStack `page`, GA4 `page_view`, Amplitude `[Amplitude] Page Viewed`, Adobe page view events, PostHog `$pageview` |
| 2 | Ecommerce (`com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action` 1-0-2, with product, cart, checkout step, transaction, or refund entities) | Segment and RudderStack `Product Viewed` and `Order Completed`, GA4 `view_item` and `purchase`, Adobe `commerce.purchases` and `purchase`, PostHog `Product Viewed` and `Order Completed` |
| 3 | Site search (`com.snowplowanalytics.snowplow/site_search` 1-0-0) | Segment, RudderStack, and PostHog `Products Searched`, GA4 `search` and `view_search_results` |
| 4 | Identify (`com.snowplowanalytics.snowplow/identify` 1-0-0, ID only) | Segment and RudderStack `identify`, GA4 `login`, Amplitude and PostHog `$identify` with a user ID, Adobe logins |
| 5 | Google's schemas (GA4 only) | Recommended events such as `sign_up` and `generate_lead` on every GA4 approach. On server-side GTM only, `user_engagement` and Enhanced Measurement events such as `scroll`, `click`, and `file_download` |
| 6 | `com.example/external_event` 1-0-0, under your vendor | Everything else: group and alias calls, your own custom events, autocaptured events, and, on most tools, ecommerce events missing a field Snowplow requires |

Every event also carries an `external_identity` entity with your tool's IDs and the original event name. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

The `external_event` and `external_identity` schemas aren't on Iglu Central. You create them in your own registry, under your own vendor, shown on this page as `com.example`. See [Create the schemas in your registry](/docs/signals/data-sources/existing-analytics/reference/index.md#create-the-schemas-in-your-registry). Every other schema on this page is on Iglu Central.

### Page views

Page views stay native Snowplow page views, with the page URL, title, and referrer in the standard fields.

### Ecommerce

Ecommerce events become `snowplow_ecommerce_action` events, shaped the way the [Snowplow ecommerce plugin](/docs/sources/web-trackers/tracking-events/ecommerce/index.md) sends them. Each product becomes its own product entity, so every line of an order is kept. A Signals attribute reads one product entity per event.

Only the events your tool defines as ecommerce take this rung, such as Segment's `Order Completed` or GA4's `purchase`. [Map events from each tool](#map-events-from-each-tool) lists them. Where your tool leaves out an optional field Snowplow's ecommerce schemas need, the adapter fills a placeholder, such as a payment method of `unknown`. What happens when a required field, such as the currency or order ID, is missing depends on the tool and approach:

- **Segment, RudderStack (client-side and transformation), PostHog, and the GA4 page script:** the event becomes `external_event`.
- **Adobe:** the adapter fills a currency of `USD` and an order ID of `unknown`.
- **Amplitude:** the adapter uses the event's `insert_id` as the order ID. Only product view, cart, and order events fall back to `external_event`; checkout and refund events are sent without product entities.
- **GA4 GTM tag templates and RudderStack's no-code HTTP Webhook mappings:** nothing checks, so the event fails validation and appears as a [failed event](/docs/fundamentals/failed-events/index.md).

Each tab in [Map events from each tool](#map-events-from-each-tool) gives its tool's behavior.

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
  { "schema": "iglu:com.example/external_identity/jsonschema/1-0-0",
    "data": { "tool": "segment", "anonymous_id": "a525264d-56e3-4050-9599-397af94571a2", "user_id": null,
              "session_id": null, "session_number": null, "event_name": "Order Completed" } }
]
```

</details>

### Site search

Searches become `site_search`, with the search term in the `terms` list. In Signals, count searches with a `counter` on `site_search`, and count terms with the `category_count` aggregation on `terms`.

### Identify

Logins and identify calls become a Snowplow `identify` event that holds the user ID and nothing else. Identify traits, such as name, email, and plan, are dropped. The user ID is sent unchanged, so if it's an email address, the email reaches Snowplow. To use a plan in attributes, send it on a group call or a track event, where it fills the `plan` field of `external_event`.

### Google's schemas on GA4

On GA4, events that Google defines and Snowplow has no equivalent for use Google's schemas on Iglu Central, under three vendors:

| Vendor | Events | Sent by |
| --- | --- | --- |
| `com.google.tag-manager.server-side` | Recommended events such as `sign_up`, `generate_lead`, and `share` | Every GA4 approach: the GTM tag templates, the page script, and server-side GTM |
| `com.google.ga4` | `user_engagement` | Server-side GTM only |
| `com.google.ga4.enhanced-measurement` | Enhanced Measurement events such as `scroll`, `click`, and `file_download` | Server-side GTM only |

On the client-side approaches, use the Snowplow tracker's own page pings and link clicks instead of `user_engagement` and Enhanced Measurement events.

Signals attributes work on these schemas like any other. This one adds up GA4 engagement time from server-side GTM:

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

### external_event

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
  "schema": "iglu:com.example/external_event/jsonschema/1-0-0",
  "data": { "name": "group", "tool": "segment", "kind": "group", "plan": "enterprise", "group_id": "acct-9" }
}
```

Signals calculates attributes only on properties a schema declares, which is why `external_event` has fixed fields instead of carrying your tool's properties as they are. Any property that doesn't map to a field is dropped, and events with several items keep only the first in `item_id` and `item_category`. If you need an attribute on a property `external_event` doesn't have, track that event natively. See [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).

## Map events from each tool

The adapter for each tool applies the ladder to that tool's own event names. Properties that don't match a typed field stay in your tool.

<Tabs groupId="analytics-tool" queryString>
  <TabItem value="segment" label="Segment" default>

| Segment call or event | Snowplow event | Notes |
|---|---|---|
| `page` | `page_view` | Title from the page context, or the page name |
| `screen` | `page_view` | Server-side only |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price, and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product` | |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total, and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `identify` | `identify` | The user ID only. Traits, including email, are dropped |
| `group` | `external_event` | `group_id` from `groupId`, `plan` from the group traits |
| `alias` | `external_event` | `previous_id` from `previousId` (server-side only) |
| Any other `track` call, or an ecommerce event missing a required field | `external_event` | `name` is the Segment event name. Typed fields such as `value`, `currency`, `item_id`, and `plan` are filled from matching properties |

  </TabItem>
  <TabItem value="rudderstack" label="RudderStack">

| RudderStack call or event | Snowplow event | Notes |
|---|---|---|
| `page` | `page_view` | Title from the page context, or the page name. A `$direct` referrer is dropped |
| `screen` | `page_view` | Server-side only. URL is `screen://<name>` when there is no page URL |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price, and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product` and `cart` | Cart total is `cart_total`, then `value`, then price times quantity, which is not the true cart total |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency. `payment_method` is set to `unknown` when absent |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total, and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `identify` | `identify` | The user ID only. Traits, including email, are dropped |
| `group` | `external_event` | `group_id` from `groupId`, `plan` from the group traits |
| `alias` | `external_event` | `previous_id` from `previousId` |
| Any other `track` call | `external_event` | `name` is the RudderStack event name. Typed fields such as `value`, `currency`, `item_id`, and `plan` are filled from matching properties |
| An ecommerce event missing a required field | `external_event` | For example an `Order Completed` with no currency, or a `Product Viewed` with no price. The HTTP Webhook mappings check only for a currency, so an event with a currency but no order ID, price, or product ID fails validation |

  </TabItem>
  <TabItem value="ga4-and-google-tag-manager" label="GA4 and GTM">

| GA4 event | Snowplow event |
|---|---|
| `page_view`, including single-page-app page views | `page_view` |
| `view_item`, `view_item_list`, `select_item` | `snowplow_ecommerce_action` with a product entity |
| `add_to_cart`, `remove_from_cart` | `snowplow_ecommerce_action` with product and cart entities |
| `begin_checkout`, `add_payment_info` | `snowplow_ecommerce_action` with `type` `checkout_step` |
| `purchase`, `refund` | `snowplow_ecommerce_action` with a transaction entity and one product entity per item |
| `search`, `view_search_results` | `site_search` |
| `login` | `identify` with `id` only |
| `sign_up`, `generate_lead`, and other recommended events with a Google schema | Google's schema under `com.google.tag-manager.server-side` |
| `user_engagement`, and Enhanced Measurement events such as `scroll` (server-side GTM only) | Google's schema under `com.google.ga4` or `com.google.ga4.enhanced-measurement` |
| Any other event, such as `join_group` or your custom events | `external_event` with `tool` `ga4` and `name` set to the event name |
| `gtag('set', 'user_properties', ...)` | Not sent |

On the page script, an ecommerce event missing a required field, such as the currency or `transaction_id`, becomes `external_event`. The GTM tag templates don't check, so the same event fails validation.

On server-side GTM, only the events you map get Snowplow schemas. See [Google's schemas on GA4](#googles-schemas-on-ga4) for which approach sends each Google schema.

  </TabItem>
  <TabItem value="amplitude" label="Amplitude">

The same mapping runs in the converter and in the webhook template.

| Amplitude event or call | Snowplow event | Notes |
|---|---|---|
| `[Amplitude] Page Viewed` | `page_view` | Title from `[Amplitude] Page Title`, URL from `[Amplitude] Page Location` |
| `track` with a product view name, such as `Product Viewed` | `snowplow_ecommerce_action`, type `product_view`, with a `product` entity | |
| `track` with an add or remove name, such as `Product Added` | `snowplow_ecommerce_action`, type `add_to_cart` or `remove_from_cart` | A `cart` entity when the event has `cart_total` or `cart_value` |
| `track` with a checkout name, such as `Checkout Started` | `snowplow_ecommerce_action`, type `checkout_step` | |
| `track` with an order name, such as `Order Completed`, or `amplitude.revenue()` | `snowplow_ecommerce_action`, type `transaction`, with `product` and `transaction` entities | `payment_method` is `unknown` when the event has none |
| `track` with a refund name, or a negative `amplitude.revenue()` | `snowplow_ecommerce_action`, type `refund` | Needs an order ID and a currency |
| `track` with a search name, such as `Products Searched`, and a `query` | `site_search` | |
| `identify` after `setUserId` | `identify` | ID only. User properties, including any email, aren't sent |
| `setGroup` and `groupIdentify` | `external_event`, kind `group` | `group_id` from the group value, `plan` from the group's `plan` property |
| Any other event | `external_event`, kind `track` | `name` is the Amplitude event type. Typed fields from `price`, `currency`, `product_id`, `category`, `query`, and `plan` |

Ecommerce and search events are matched by name, ignoring case. A product view, cart, or order event falls back to `external_event` if any item lacks an ID, a price, or a currency. An order with no order ID uses the event's `insert_id` instead. Checkout and refund events are sent without product entities.

  </TabItem>
  <TabItem value="adobe" label="Adobe">

| Adobe event | Snowplow event |
|---|---|
| Web SDK `web.webpagedetails.pageViews`; AppMeasurement `s.t()`; data layer page event | `page_view` |
| Web SDK `commerce.productViews`; Analytics `prodView` | `snowplow_ecommerce_action`, type `product_view` |
| Web SDK `commerce.productListAdds`, `commerce.productListRemovals`; Analytics `scAdd`, `scRemove` | `snowplow_ecommerce_action`, type `add_to_cart` or `remove_from_cart`, with a `cart` entity |
| Web SDK `commerce.checkouts`; Analytics `scCheckout` | `snowplow_ecommerce_action`, type `checkout_step` |
| Web SDK `commerce.purchases`; Analytics `purchase` | `snowplow_ecommerce_action`, type `transaction`, with a `transaction` entity and one `product` entity per line |
| Any Web SDK event with `siteSearch.query`; your Analytics search event | `site_search` |
| Web SDK `userAccount.login` with a CRMID; an AppMeasurement hit with the user ID variable | `identify`, with `id` only |
| Web SDK `commerce.refunds`, a custom eventType, if you send one | `snowplow_ecommerce_action`, type `refund` |
| Everything else: link clicks, form events, your own event types, and link names | `external_event`, `tool` set to `adobe` |

An ecommerce event with no currency gets `USD`, and an order with no order ID gets `unknown`.

  </TabItem>
  <TabItem value="posthog" label="PostHog">

| PostHog event | Snowplow event | Notes |
|---|---|---|
| `$pageview` | `page_view` | URL from `$current_url`, title from `title` |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price, and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product` | A `cart` entity when there's a `cart_total` or `value` |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) | |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) | Needs an order ID, total, and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `$identify` | `identify` | The user ID only. Person properties are dropped |
| `$groupidentify` | `external_event`, kind `group` | `group_id` from `$group_key`, `plan` from `$group_set` |
| `$pageleave` | `external_event`, kind `track` | `value` is the seconds the page was open |
| `$autocapture`, `$rageclick`, and any other event | `external_event`, kind `track` | `name` is the PostHog event name. Element details aren't sent |
| `$snapshot`, `$$heatmap`, and SDK bookkeeping events | Not sent | |

Ecommerce and search events are matched by name, ignoring case. An ecommerce event missing a required field falls back to `external_event`.

  </TabItem>
</Tabs>

## Filter attributes on the event name

Every custom event from your tool is the same Snowplow event type, so an attribute on `external_event` needs a [criteria filter](/docs/signals/attributes/attributes/index.md#filter-with-criteria) on `name`. Use the name exactly as your tool sends it. This attribute counts Segment `Signup Form Submitted` events:

```python
from snowplow_signals import Attribute, Criteria, Criterion, Event, EventProperty

external_event = Event(
    vendor="com.example",
    name="external_event",
    version="1-0-0",
)

external_event_name = EventProperty(
    vendor="com.example",
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
    vendor="com.example",
    name="external_identity",
    major_version=1,
    path="event_name",
)
```
