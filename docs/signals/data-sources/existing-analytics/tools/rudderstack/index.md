---
title: "Use Signals with RudderStack"
sidebar_label: "RudderStack"
sidebar_position: 20
description: "Send the events you already track with RudderStack to Snowplow, from the browser or from your RudderStack workspace, and build Signals attributes on them without retagging."
keywords: ["rudderstack", "transformation", "webhook destination", "custom device mode", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the `page`, `track`, `identify`, `group` and `alias` calls you already make with RudderStack to build Snowplow Signals attributes, without retagging your site.

## Choose an approach

Most sites should use the **client-side approach**: a custom device mode integration in the RudderStack JavaScript SDK copies each call into the Snowplow JavaScript tracker on the same page. It gives you sessions, page pings and a random visitor ID that is safe for interventions in the page, and the visitor ID stays the same if you later move to native tracking.

| Approach | Use it when |
|---|---|
| [Client-side: custom device mode integration](#set-up-the-client-side-approach) | You can add a few lines to the page where the RudderStack SDK loads |
| [Server-side: transformation and Webhook destination](#server-side-transformation-and-webhook-destination) | You need events from RudderStack's server or mobile SDKs, or you can't change the page. No sessions, and events arrive seconds later |
| [Server-side without code: HTTP Webhook mappings](#server-side-without-code-http-webhook-mappings) | As above, but your workspace can't use transformations |
| [Warehouse history](#warehouse-history) | You want batch attributes from the RudderStack data already in your warehouse |

You can run client-side and server-side together. Connect the server-side destination only to your server and app sources, so browser events don't arrive twice under two visitor keys.

## Before you begin

You need:

- A Snowplow Collector URL for a pipeline with Signals enabled.
- The RudderStack JavaScript SDK v3 (`@rudderstack/analytics-js`) 3.23.0 or later on your site, loaded with a snippet that lists `addCustomIntegration` among its methods. If yours doesn't, copy a current snippet from your source's **Setup** tab.
- RudderStack ecommerce events that use the ecommerce spec names (`Product Viewed`, `Order Completed` and so on) with a price and a currency. Other events become generic `external_event` events. See [How RudderStack events map to Snowplow](#how-rudderstack-events-map-to-snowplow).

## Set up the client-side approach

1. In your RudderStack workspace, add a **Custom Device Mode** destination, connect it to your JavaScript source and copy its destination ID.

2. Load the Snowplow tracker and create a tracker that points at your Collector. Put this after the RudderStack snippet.

   ```html
   <script>
     (function (p, l, o, w, i, n, g) { if (!p[i]) { p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []; p.GlobalSnowplowNamespace.push(i); p[i] = function () { (p[i].q = p[i].q || []).push(arguments); }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1; n.src = w; g.parentNode.insertBefore(n, g); } })(window, document, 'script', 'https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@4.10.3/dist/sp.js', 'snowplow');

     window.snowplow('newTracker', 'sp', 'https://collector.example.com', {
       appId: 'my-site',
       platform: 'web',
       contexts: { webPage: true },
       stateStorageStrategy: 'cookieAndLocalStorage',
     });
     window.snowplow('enableActivityTracking', { minimumVisitLength: 10, heartbeatDelay: 10 });
   </script>
   ```

   Replace `https://collector.example.com` with your Collector URL and `my-site` with your app ID. Activity tracking sends the page pings that engagement attributes need.

   If your Collector is on the same site as your pages, the browser also sends RudderStack's `rl_*` cookies to it, and these can carry an email address from your traits. To keep them off Collector requests, add `credentials: 'omit'` to the `newTracker` options, or use a Collector on a different site.

3. Add the [mapping code](#mapping-code) to the page, except `toTrackerEvent`, `toPayload`, `transformEvent` and the hashing helpers `utf8Bytes`, `padBlocks`, `rotl`, `rotr`, `sha1`, `K256`, `sha256`, `hex`, `uuidv5` and `fitId`. The integration below uses its `ladder` function.

4. Register the integration straight after steps 2 and 3 in the page source, not in a `rudderanalytics.ready()` callback or a tag that fires later. The SDK ignores integrations added after it has loaded.

   ```html
   <script>
     function externalIdentity(ev, type) {
       return {
         schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0',
         data: {
           tool: 'rudderstack',
           anonymous_id: ev.anonymousId ? String(ev.anonymousId).slice(0, 255) : null,
           user_id: ev.userId ? String(ev.userId).slice(0, 255) : null,
           session_id: ev.context && ev.context.sessionId ? String(ev.context.sessionId) : null,
           session_number: null,
           event_id: ev.messageId ? String(ev.messageId).slice(0, 255) : null,
           event_name: type === 'track' ? String(ev.event || '').slice(0, 255) || null : type === 'page' ? ev.name || null : type,
         },
       };
     }

     function forward(analytics, logger, rsEvent) {
       const ev = rsEvent.message;
       const type = String(ev.type || '').toLowerCase();
       const context = ev.anonymousId ? [externalIdentity(ev, type)] : [];
       // RudderStack can hand over a call after a single-page app has changed the URL, so use the URL from the call.
       if (ev.context.page && ev.context.page.url) window.snowplow('setCustomUrl', ev.context.page.url);
       if (type === 'identify' && ev.userId) window.snowplow('setUserId', String(ev.userId));
       if (type === 'page') {
         window.snowplow('trackPageView', { title: (ev.context.page && ev.context.page.title) || ev.name, context });
         return;
       }
       const l = ladder(ev, type);
       window.snowplow('trackSelfDescribingEvent', { event: l.event, context: l.entities.concat(context) });
     }

     rudderanalytics.addCustomIntegration('<destination_id>', {
       isReady: () => typeof window.snowplow === 'function',
       page: forward,
       track: forward,
       identify: forward,
       group: forward,
       alias: forward,
     });
   </script>
   ```

   Replace `<destination_id>` with the ID from step 1.

5. Publish the page change.

To react to interventions in the page, add the Signals browser plugin to the Snowplow tracker. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

## Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment and copy its Collector endpoint.
2. Point the Snowplow tracker (or the Webhook destination's URL, keeping its path) at it.
3. Send a few calls from a test page.
4. Select **Open dashboard** to see the good and failed events.

For a page view, a product view, an order and an `identify` call, you should see:

- A `page_view` for each `page` call.
- `snowplow_ecommerce_action` events of type `product_view` and `transaction`, with `product` and `transaction` entities.
- An `identify` event whose only field is `id`.
- An `external_identity` entity on every event, with `tool` set to `rudderstack` and the original event name in `event_name`.
- On the client-side approach, `page_ping` events and one `domain_sessionid` across the visit.
- No failed events. The Collector accepts events before they are validated, so a failed event shows here, not in RudderStack.

Once the events look right, point the tracker or the destination at your pipeline's Collector, then create your [attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) and an [intervention](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#create-an-intervention).

## Other approaches

The server-side approaches run in your RudderStack workspace and cover RudderStack's server and mobile SDKs too. RudderStack's `anonymousId` becomes `domain_userid`, so read those attributes from your backend, not the public intervention endpoint. There are no sessions or page pings, and events arrive seconds after the call. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay). If your Collector is behind a firewall, allow RudderStack's outbound IP addresses.

### Server-side: transformation and Webhook destination

1. Create a JavaScript transformation and paste the [mapping code](#mapping-code). Set `aid` in `CONFIG` to your app ID. The entry point is:

   ```js
   export function transformEvent(event, metadata) {
     return toPayload([event]);
   }
   ```

   Each event's `event_id` is derived from RudderStack's `messageId`, so a retried event counts once in Signals.

2. Add a **Webhook** destination with **Webhook URL** `https://collector.example.com/com.snowplowanalytics.snowplow/tp2` and **Method** `POST`.
3. Connect the transformation to the Webhook destination.
4. Connect the destination to the sources you want in Snowplow, and enable it.

When you change the transformation, publish it as a new version.

### Server-side without code: HTTP Webhook mappings

If your workspace can't use transformations, the **HTTP Webhook** destination can build the Collector request from field mappings.

1. Add an **HTTP Webhook** destination with URL `https://collector.example.com/i`, method `GET`, no authentication and batching off. Use the query parameter mappings, not the JSONata body template.

2. Add these query parameter mappings:

   | Parameter | Value |
   |---|---|
   | `e` | `($.type === 'page' \|\| $.type === 'screen') ? 'pv' : 'ue'` |
   | `p` | `'web'` |
   | `aid` | `'my-site'` |
   | `url` | `$.context.page.url` |
   | `page` | `$.context.page.title` |
   | `refr` | `$.context.page.referrer && !$.context.page.referrer.startsWith('$') ? $.context.page.referrer : undefined` |
   | `ua` | `$.context.userAgent` |
   | `ip` | `$.context.ip ?? $.request_ip` |
   | `duid` | `$.anonymousId` |
   | `tnuid` | `$.anonymousId` |
   | `uid` | `$.userId \|\| undefined` |
   | `eid` | `$.messageId` |
   | `dtm` | `String(Date.parse($.originalTimestamp))` |
   | `stm` | `String(Date.parse($.sentAt))` |
   | `ttm` | `String(Date.parse($.timestamp))` |
   | `ue_pr` | See step 3 |
   | `co` | See step 3 |

3. Add the `ue_pr` and `co` mappings. Copy each value exactly as it is.

   <details>
   <summary><code>ue_pr</code> value</summary>

   ```js
   ($.type === 'page' || $.type === 'screen') ? undefined : JSON.stringify({schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0', data: $.type === 'identify' && $.userId ? {schema: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0', data: {id: String($.userId)}} : $.type === 'track' && $.event === 'Products Searched' && $.properties.query ? {schema: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0', data: {terms: [String($.properties.query)]}} : ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) ? {schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2', data: {type: ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined)}} : {schema: 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0', data: {name: $.type === 'track' ? $.event : $.type, tool: 'rudderstack', kind: $.type, value: $.properties.revenue ?? $.properties.value ?? $.properties.total ?? $.properties.price, currency: ($.properties.currency ? $.properties.currency.toUpperCase() : undefined), item_id: $.properties.product_id ?? $.properties.sku ?? $.properties.products[0].product_id, item_category: $.properties.category ?? $.properties.products[0].category, search_term: $.properties.query, plan: $.properties.plan ?? ($.type === 'group' ? $.traits.plan : undefined), group_id: $.groupId, previous_id: $.previousId}}})
   ```

   </details>

   <details>
   <summary><code>co</code> value</summary>

   ```js
   JSON.stringify({schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1', data: ($.type === 'page' || $.type === 'screen') ? [{schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', data: {tool: 'rudderstack', anonymous_id: $.anonymousId, user_id: $.userId || null, session_id: $.context.sessionId ? String($.context.sessionId) : null, session_number: null, event_id: $.messageId || null, event_name: $.type === 'track' ? $.event : ($.type === 'page' || $.type === 'screen') ? ($.name || null) : $.type}}] : [...(($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) && Array.isArray($.properties.products) ? $.properties.products : (($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'product_view' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'add_to_cart' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'remove_from_cart') ? [$.properties] : []).map(lambda {schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0', data: {id: String(?0.product_id ?? ?0.sku), name: ?0.name, category: ?0.category ?? '', price: Number((?0.price).toFixed(2)), currency: ($.properties.currency ? $.properties.currency.toUpperCase() : undefined), quantity: ?0.quantity, brand: ?0.brand, variant: ?0.variant}}), ...((($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'product_view' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'add_to_cart' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'remove_from_cart') && ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) !== 'product_view' ? [{schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0', data: {cart_id: $.properties.cart_id, total_value: Number((($.properties.cart_total ?? $.properties.value ?? $.properties.price * ($.properties.quantity ?? 1))).toFixed(2)), currency: ($.properties.currency ? $.properties.currency.toUpperCase() : undefined)}}] : ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'checkout_step' ? [{schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0', data: {step: $.properties.step ?? 1, payment_method: $.properties.payment_method, delivery_method: $.properties.shipping_method, coupon_code: $.properties.coupon}}] : ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'transaction' ? [{schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0', data: {transaction_id: String($.properties.order_id), revenue: Number((($.properties.revenue ?? $.properties.total ?? $.properties.value)).toFixed(2)), currency: ($.properties.currency ? $.properties.currency.toUpperCase() : undefined), payment_method: $.properties.payment_method ?? 'unknown', total_quantity: (($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) && Array.isArray($.properties.products) ? $.properties.products : (($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'product_view' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'add_to_cart' || ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'remove_from_cart') ? [$.properties] : []).map(lambda ?0.quantity ?? 1).reduce(lambda ?0 + ?1, 0), tax: $.properties.tax, shipping: $.properties.shipping, discount_amount: $.properties.discount, discount_code: $.properties.coupon}}] : ($.type === 'track' && ($.properties.currency ? $.properties.currency.toUpperCase() : undefined) ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined) === 'refund' ? [{schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0', data: {transaction_id: String($.properties.order_id), refund_amount: Number((($.properties.total ?? $.properties.revenue ?? $.properties.value)).toFixed(2)), currency: ($.properties.currency ? $.properties.currency.toUpperCase() : undefined), refund_reason: $.properties.reason}}] : []), {schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', data: {tool: 'rudderstack', anonymous_id: $.anonymousId, user_id: $.userId || null, session_id: $.context.sessionId ? String($.context.sessionId) : null, session_number: null, event_id: $.messageId || null, event_name: $.type === 'track' ? $.event : ($.type === 'page' || $.type === 'screen') ? ($.name || null) : $.type}}]})
   ```

   </details>

The mappings send `messageId` as the event ID, which Snowplow requires to be a UUID. The RudderStack JavaScript SDK sends one. For sources whose `messageId` may not be a UUID, use the transformation instead.

### Warehouse history

RudderStack's warehouse destinations can fill a warehouse attribute group with history from before you connected. This needs a Signals warehouse connection.

## How RudderStack events map to Snowplow

Each RudderStack call takes the first rung of the [event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) ladder that fits. Both approaches use the same mapping.

| RudderStack call or event | Snowplow event | Notes |
|---|---|---|
| `page` | `page_view` | Title from the page context, or the page name. A `$direct` referrer is dropped |
| `screen` | `page_view` | Server-side only. URL is `screen://<name>` when there is no page URL |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product` and `cart` | Cart total is `cart_total`, then `value`, then price times quantity, which is not the true cart total |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency. `payment_method` is set to `unknown` when absent |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `identify` | `identify` | The user ID only. Traits, including email, are dropped |
| `group` | `external_event` | `group_id` from `groupId`, `plan` from the group traits |
| `alias` | `external_event` | `previous_id` from `previousId` |
| Any other `track` call | `external_event` | `name` is the RudderStack event name. Typed fields such as `value`, `currency`, `item_id` and `plan` are filled from matching properties |
| An ecommerce event missing a required field | `external_event` | For example an `Order Completed` with no currency, or a `Product Viewed` with no price |


RudderStack properties and traits that don't match a typed field stay in RudderStack.

## Identifiers

| RudderStack field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow cookie ID (client-side) | `domain_userid` | Yes. Random, and safe on the public intervention endpoint |
| Snowplow session ID (client-side) | `domain_sessionid` | Yes, for session attributes |
| `anonymousId` | Server-side: `domain_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend only. Read it in the page with `rudderanalytics.getAnonymousId()`. Never on the public intervention endpoint |
| `userId` | `user_id`, `external_identity.user_id` and `identify.id`, unchanged. If it's an email address, the email reaches Snowplow | Backend reads only. Never on the public intervention endpoint |
| `context.sessionId` | `external_identity.session_id` | No. It's a timestamp, so it can be guessed |
| `groupId` | `external_event.group_id` | Backend reads only, for account attributes |
| `messageId` | `event_id` | No |

On the server-side approaches, an event with no `anonymousId` is keyed on its `userId`. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) for keying attributes across a visitor's browser and logged-in events.

## Troubleshooting

- **Nothing reaches Snowplow from the client-side integration:** the destination ID doesn't match a Custom Device Mode destination on your source, or the integration was added after the SDK loaded. Check the ID, and register the integration in the page source straight after the snippet.
- **Ecommerce events arrive as `external_event`:** the event name isn't a spec name, or it lacks a price, currency or order ID. Rename it, or add the missing field.
- **Events arrive twice:** both approaches receive your browser source. Connect the server-side destination only to server and mobile sources.
- **A changed transformation has no effect:** publish it as a new version.
- **A property is missing from attributes:** Signals only reads fields a schema declares. Map it to a typed `external_event` field. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).

Where to go next:

- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Copy the definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- When you are ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approach the visitor ID stays the same, so attributes carry over.
- Field reference: [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Mapping code

Both approaches use this mapping code. The server-side transformation uses all of it. The client-side integration uses everything except `toTrackerEvent`, `toPayload`, `transformEvent` and the hashing helpers, and calls its `ladder` function for each RudderStack call.

<details>
<summary>Mapping code</summary>

```js
// RudderStack event to one Snowplow tracker protocol event (payload_data 1-0-4).
// Ladder: page_view, then Iglu Central ecommerce, site_search and identify, then external_event.
// No imports on purpose: RudderStack's transformation sandbox has no require, Buffer or crypto.

var CONFIG = {
  tool: 'rudderstack',
  tv: 'rs-transformation-0.2',
  aid: 'your-app-id',
  // Fixed namespace for UUIDv5(messageId); any constant UUID works, it only has to never change.
  ns: '6f1c3c2e-5b7a-4d2e-9a51-3e0f6c1d2b4a',
};

function utf8Bytes(str) {
  var out = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
      var d = str.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) { c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00); i++; }
    }
    if (c < 0x80) out.push(c);
    else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
    else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
  }
  return out;
}

function padBlocks(bytes) {
  var len = bytes.length, msg = bytes.slice();
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  var bits = len * 8, hi = Math.floor(bits / 0x100000000), lo = bits >>> 0;
  msg.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255,
    (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
  return msg;
}

function rotl(x, n) { return (x << n) | (x >>> (32 - n)); }
function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

function sha1(bytes) {
  var m = padBlocks(bytes), h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], w = new Array(80);
  for (var o = 0; o < m.length; o += 64) {
    for (var i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
    for (i = 16; i < 80; i++) w[i] = rotl(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4];
    for (i = 0; i < 80; i++) {
      var f, k;
      if (i < 20) { f = (b & c) | (~b & d); k = 0x5a827999; }
      else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
      else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
      else { f = b ^ c ^ d; k = 0xca62c1d6; }
      var t = (rotl(a, 5) + f + e + k + w[i]) | 0;
      e = d; d = c; c = rotl(b, 30); b = a; a = t;
    }
    h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0;
  }
  var out = [];
  h.forEach(function (x) { out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255); });
  return out;
}

var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

function sha256(bytes) {
  var m = padBlocks(bytes), w = new Array(64);
  var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  for (var o = 0; o < m.length; o += 64) {
    for (var i = 0; i < 16; i++) w[i] = (m[o + 4 * i] << 24) | (m[o + 4 * i + 1] << 16) | (m[o + 4 * i + 2] << 8) | m[o + 4 * i + 3];
    for (i = 16; i < 64; i++) {
      var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      var s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (i = 0; i < 64; i++) {
      var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
      var t1 = (hh + S1 + ch + K256[i] + w[i]) | 0;
      var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & b) ^ (a & c) ^ (b & c);
      var t2 = (S0 + maj) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
  }
  var out = [];
  h.forEach(function (x) { out.push((x >>> 24) & 255, (x >>> 16) & 255, (x >>> 8) & 255, x & 255); });
  return out;
}

function hex(bytes) {
  return bytes.map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join('');
}

function uuidv5(name, ns) {
  var nsBytes = [], nsHex = ns.replace(/-/g, '');
  for (var i = 0; i < 32; i += 2) nsBytes.push(parseInt(nsHex.substr(i, 2), 16));
  var b = sha1(nsBytes.concat(utf8Bytes(String(name)))).slice(0, 16);
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  var x = hex(b);
  return x.substr(0, 8) + '-' + x.substr(8, 4) + '-' + x.substr(12, 4) + '-' + x.substr(16, 4) + '-' + x.substr(20, 12);
}

// network_userid and domain_userid are 128 chars in atomic.events.
function fitId(id) {
  if (id === undefined || id === null || id === '') return undefined;
  var s = String(id);
  return s.length > 128 ? hex(sha256(utf8Bytes(s))) : s;
}

function epochMs(ts) {
  if (ts === undefined || ts === null || ts === '') return undefined;
  var n = typeof ts === 'number' ? ts : Date.parse(ts);
  return isNaN(n) ? undefined : String(Math.round(n));
}

function pick() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

function str255(v) {
  if (v === undefined || v === null || typeof v === 'object') return undefined;
  return String(v).slice(0, 255);
}

function num(v) {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v))) return Number(v);
  return undefined;
}

var S = {
  ue: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0',
  co: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1',
  action: 'iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2',
  product: 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0',
  transaction: 'iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0',
  refund: 'iglu:com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0',
  cart: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
  checkout: 'iglu:com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0',
  search: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0',
  identify: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0',
  external: 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0',
  identity: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0',
};

// Segment ecommerce spec v2 names, which RudderStack shares.
var ECOM = {
  'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart',
  'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step',
  'order completed': 'transaction', 'order refunded': 'refund',
};

function money(v) { var n = num(v); return n === undefined || n < 0 ? undefined : Math.round(n * 100) / 100; }
function int(v) { var n = num(v); return n === undefined || n < 0 ? undefined : Math.round(n); }
function iso(v) { return typeof v === 'string' && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : undefined; }
function compact(o) { var r = {}; for (var k in o) if (o[k] !== undefined) r[k] = o[k]; return r; }
function sd(schema, data) { return { schema: schema, data: data }; }

// Snowplow's product entity requires id, price and currency; null means "cannot express this item".
function product(p, cur) {
  var id = str255(pick(p.product_id, p.sku, p.id)), price = money(p.price), currency = iso(pick(p.currency, cur));
  if (!id || price === undefined || !currency) return null;
  return compact({
    id: id, name: str255(p.name), category: str255(p.category) || '', price: price, currency: currency,
    quantity: int(p.quantity), brand: str255(p.brand), variant: str255(p.variant), position: int(p.position),
  });
}

function ecommerce(ev, action) {
  var p = ev.properties || {}, cur = iso(p.currency);
  var list = Array.isArray(p.products) ? p.products : (action === 'product_view' || action === 'add_to_cart' || action === 'remove_from_cart') ? [p] : [];
  var products = [];
  for (var i = 0; i < list.length; i++) {
    var pr = product(list[i] || {}, cur);
    if (!pr) return null;
    products.push(pr);
  }
  var ents = products.map(function (x) { return sd(S.product, x); });
  if (action === 'product_view' && products.length !== 1) return null;
  if (action === 'add_to_cart' || action === 'remove_from_cart') {
    if (products.length !== 1) return null;
    var pr0 = products[0], line = pr0.price * (pr0.quantity || 1);
    ents.push(sd(S.cart, compact({ cart_id: str255(p.cart_id), total_value: money(pick(p.cart_total, p.value, line)), currency: pr0.currency })));
  } else if (action === 'checkout_step') {
    var step = int(pick(p.step, 1));
    if (!step || step > 90) return null;
    ents.push(sd(S.checkout, compact({ step: step, payment_method: str255(p.payment_method), delivery_method: str255(p.shipping_method), coupon_code: str255(p.coupon) })));
  } else if (action === 'transaction') {
    var revenue = money(pick(p.revenue, p.total, p.value)), qty = 0;
    if (!p.order_id || revenue === undefined || !cur) return null;
    products.forEach(function (x) { qty += x.quantity || 1; });
    ents.push(sd(S.transaction, compact({
      transaction_id: str255(p.order_id), revenue: revenue, currency: cur,
      // Required by the schema; the Segment spec has no payment field.
      payment_method: str255(p.payment_method) || 'unknown', total_quantity: qty,
      tax: money(p.tax), shipping: money(p.shipping), discount_amount: money(p.discount), discount_code: str255(p.coupon),
    })));
  } else if (action === 'refund') {
    var amount = money(pick(p.total, p.revenue, p.value));
    if (!p.order_id || amount === undefined || !cur) return null;
    ents.push(sd(S.refund, compact({ transaction_id: str255(p.order_id), refund_amount: amount, currency: cur, refund_reason: str255(p.reason) })));
  }
  return { event: sd(S.action, { type: action }), entities: ents };
}

function externalEvent(ev, type) {
  var p = ev.properties || {};
  var first = Array.isArray(p.products) && p.products.length ? p.products[0] || {} : {};
  var data = {
    name: type === 'track' ? String(pick(ev.event, 'track')).slice(0, 255) : type,
    tool: CONFIG.tool,
    kind: type,
    value: num(pick(p.revenue, p.value, p.total, p.price)),
    currency: iso(p.currency),
    item_id: str255(pick(p.product_id, p.sku, first.product_id)),
    item_category: str255(pick(p.category, first.category)),
    search_term: str255(p.query),
    plan: str255(pick(p.plan, type === 'group' && ev.traits ? ev.traits.plan : undefined)),
  };
  if (type === 'group') data.group_id = str255(ev.groupId);
  if (type === 'alias') data.previous_id = str255(ev.previousId);
  return sd(S.external, compact(data));
}

// Returns {event, entities} for a non-page call, walking the ladder.
function ladder(ev, type) {
  var name = String(ev.event || '').trim().toLowerCase();
  if (type === 'track' && ECOM[name]) {
    var e = ecommerce(ev, ECOM[name]);
    if (e) return e;
  }
  if (type === 'track' && name === 'products searched' && str255((ev.properties || {}).query)) {
    return { event: sd(S.search, { terms: [str255(ev.properties.query)] }), entities: [] };
  }
  // Only the id: identify traits can hold email and other personal data.
  if (type === 'identify' && ev.userId) return { event: sd(S.identify, { id: String(ev.userId).slice(0, 256) }), entities: [] };
  return { event: externalEvent(ev, type), entities: [] };
}

function toTrackerEvent(ev) {
  var ctx = ev.context || {};
  var page = ctx.page || {};
  var type = String(ev.type || '').toLowerCase();
  var anon = pick(ev.anonymousId, ev.userId, ev.messageId);
  var out = {
    p: 'web',
    tv: CONFIG.tv,
    aid: CONFIG.aid,
    eid: uuidv5(pick(ev.messageId, JSON.stringify(ev)), CONFIG.ns),
    dtm: epochMs(ev.originalTimestamp),
    stm: epochMs(ev.sentAt),
    ttm: epochMs(ev.timestamp),
    ip: pick(ctx.ip, ev.request_ip),
    ua: ctx.userAgent,
    tnuid: fitId(anon),
    duid: fitId(anon),
    uid: ev.userId ? String(ev.userId).slice(0, 255) : undefined,
    url: page.url,
    // The RudderStack SDK sends "$direct" when there is no referrer; Snowplow would parse it as a URL.
    refr: page.referrer && page.referrer.charAt(0) !== '$' ? page.referrer : undefined,
    lang: ctx.locale,
    tz: ctx.timezone,
  };
  if (ctx.screen && ctx.screen.width) out.res = ctx.screen.width + 'x' + ctx.screen.height;

  var entities = [];
  if (type === 'page' || type === 'screen') {
    out.e = 'pv';
    out.page = pick(page.title, ev.name, ev.properties && ev.properties.title);
    if (type === 'screen') out.url = pick(out.url, ev.name ? 'screen://' + ev.name : undefined);
  } else {
    var l = ladder(ev, type);
    out.e = 'ue';
    out.ue_pr = JSON.stringify(sd(S.ue, l.event));
    entities = l.entities;
  }

  var sid = pick(ctx.sessionId);
  entities.push(sd(S.identity, {
    tool: CONFIG.tool,
    anonymous_id: String(anon).slice(0, 255),
    user_id: ev.userId ? String(ev.userId).slice(0, 255) : null,
    session_id: sid === undefined ? null : String(sid).slice(0, 255),
    // RudderStack has no session counter.
    session_number: null,
    event_id: ev.messageId ? String(ev.messageId).slice(0, 255) : null,
    event_name: type === 'track' ? str255(ev.event) || null : type === 'page' || type === 'screen' ? str255(ev.name) || null : type,
  }));
  out.co = JSON.stringify(sd(S.co, entities));

  var clean = {};
  for (var key in out) if (out[key] !== undefined && out[key] !== null && out[key] !== '') clean[key] = String(out[key]);
  return clean;
}

function toPayload(events) {
  return {
    schema: 'iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4',
    data: events.map(toTrackerEvent),
  };
}


export function transformEvent(event, metadata) {
  return toPayload([event]);
}
```

</details>
