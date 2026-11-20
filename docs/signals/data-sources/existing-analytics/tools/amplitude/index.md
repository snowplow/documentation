---
title: "Use Signals with Amplitude"
sidebar_label: "Amplitude"
sidebar_position: 40
description: "Send the events your Amplitude Browser SDK or Webhook destination already produces to Snowplow, so Signals can calculate attributes on them."
keywords: ["amplitude", "browser sdk", "destination plugin", "webhook", "freemarker", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the events your Amplitude implementation already sends in Signals, by copying each one to your Snowplow Collector from the browser or from Amplitude's Webhook destination.

## Choose an approach

Most sites should use the **client-side plugin with the Snowplow tracker**. It's a few lines of JavaScript next to `amplitude.init`, it reacts while the visitor is still on the page, and it gives you a random visitor key that is safe to use for interventions.

Use one of the [other approaches](#other-approaches) when:

| Approach | Use it when |
|---|---|
| [Send without the Snowplow tracker](#send-without-the-snowplow-tracker) | You can't add the Snowplow tracker to your pages |
| [Webhook destination](#webhook-destination) | Important events come from your servers, mobile apps or the HTTP API, or you can't change the page code. Events arrive within about a minute |
| [Warehouse history](#warehouse-history) | You want history, such as a lifetime order count, alongside a real-time approach |

You can run the plugin and the webhook together. Send only server and app events through the webhook, so the same event isn't counted twice.

## Before you begin

- Amplitude Browser SDK 2 (`@amplitude/analytics-browser`).
- The Admin or Manager role on your Amplitude project, or someone who has it. Only those roles can see the API key and add destinations.
- A Snowplow Collector URL and Signals enabled on your pipeline.
- Your Amplitude tracking plan, so you can match your event names to the ecommerce and search lists described in [How Amplitude events map to Snowplow](#how-amplitude-events-map-to-snowplow).

## Set up the client-side approach

A destination plugin receives every event the Browser SDK sends, converts it, and passes it to the Snowplow browser tracker. Amplitude keeps receiving its events as before.

1. Load the Snowplow JavaScript tracker with the [tag snippet](/docs/sources/web-trackers/quick-start-guide/index.md), and the [converter](#mapping-code), before the Amplitude SDK, and create a tracker. The plugin calls `window.snowplow`, which the tag snippet defines, so use the tag snippet rather than the npm package.

   ```javascript
   window.snowplow('newTracker', 'sp', 'https://collector.example.com', {
     appId: 'my-site',
     eventMethod: 'post',
     contexts: { webPage: true },
   });
   window.snowplow('enableActivityTracking', { minimumVisitLength: 30, heartbeatDelay: 10 });
   ```

   Activity tracking sends the page pings that engagement attributes need. Don't call `trackPageView` yourself: the plugin forwards Amplitude's page views, so keep page views on in the Browser SDK's `autocapture` option, as they are by default.

2. Add the destination plugin before you call `amplitude.init`.

   ```javascript
   const snowplowDestination = {
     name: 'snowplow-destination',
     type: 'destination',
     setup: async () => undefined,
     execute: async (event) => {
       const c = AmplitudeSnowplow.fromBrowser(event, Date.now());
       const sp = AmplitudeSnowplow.toSnowplow(c);
       const context = [AmplitudeSnowplow.identity(c, event.device_id)].concat(sp.entities);
       window.snowplow('setUserId', event.user_id || null);
       if (sp.e === 'pv') {
         window.snowplow('trackPageView', {
           title: event.event_properties['[Amplitude] Page Title'],
           context,
           timestamp: { type: 'ttm', value: event.time },
         });
       } else {
         window.snowplow('trackSelfDescribingEvent', {
           event: sp.event,
           context,
           timestamp: { type: 'ttm', value: event.time },
         });
       }
       return { event, code: 200, message: 'forwarded' };
     },
   };

   amplitude.add(snowplowDestination);
   amplitude.init('YOUR_AMPLITUDE_API_KEY', {
     // your existing options, unchanged
   });
   ```

3. If your ecommerce or search event names differ from the defaults, add them to the converter's `ECOM` and `SEARCH` lists. Events whose names aren't in a list arrive as `external_event`.

4. Gate both tools on consent. The Snowplow tracker sets its own cookies as soon as `newTracker` runs, so create it only after the visitor consents. Add `optOut: true` to the `amplitude.init` call from step 2, and move the step 1 tracker code into a function that runs on consent and then opts Amplitude back in:

   ```javascript
   amplitude.add(snowplowDestination);
   amplitude.init('YOUR_AMPLITUDE_API_KEY', {
     optOut: true,
     // your existing options, unchanged
   });

   function onAnalyticsConsent() {
     window.snowplow('newTracker', 'sp', 'https://collector.example.com', {
       appId: 'my-site',
       eventMethod: 'post',
       contexts: { webPage: true },
     });
     window.snowplow('enableActivityTracking', { minimumVisitLength: 30, heartbeatDelay: 10 });
     amplitude.setOptOut(false);
   }
   ```

   Call `onAnalyticsConsent` from your consent tool. Events tracked before consent are dropped, so neither Amplitude nor Snowplow receives them. See [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

5. Publish the change to your site.

To react to interventions in the page, add the Signals browser plugin to the Snowplow tracker. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

## Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one: it runs Snowplow Micro, hosted by Snowplow. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines** and select your development environment.
2. Copy its Collector endpoint, and point the Snowplow tracker at it. For the other approaches, use it as the plugin's or Webhook destination's URL, keeping the `/com.snowplowanalytics.snowplow/tp2` path.
3. Send test events from your site.
4. Select **Open dashboard** to see the good and failed events.

In the dashboard, check that:

- Every Amplitude event arrives once, with no failed events.
- `[Amplitude] Page Viewed` arrives as a `page_view`.
- Product views and orders arrive as `snowplow_ecommerce_action`, with one `product` entity per item and a `transaction` entity on orders.
- Searches arrive as `site_search`, and identifies with a user ID arrive as `identify` with the ID only.
- Every other event arrives as `external_event`, with `name` set to the Amplitude event type.
- Every event carries an `external_identity` entity with `tool` set to `amplitude` and `anonymous_id` set to the Amplitude `device_id`.

Once the events look right, point the tracker at your pipeline's Collector.

## Other approaches

### Send without the Snowplow tracker

The plugin can also post each converted event straight to the Collector, without loading the Snowplow tracker. Use it instead of the plugin above, not alongside it, or every event reaches Snowplow twice. It uses Amplitude's `device_id` as `domain_userid`, and builds `domain_sessionid` from the `device_id` and Amplitude's `session_id`. Set your app ID after loading the converter with `AmplitudeSnowplow.ADAPTER.aid = 'my-site';`.

```javascript
const snowplowDirect = {
  name: 'snowplow-direct',
  type: 'destination',
  setup: async () => undefined,
  execute: async (event) => {
    const body = JSON.stringify(
      AmplitudeSnowplow.toPayload([AmplitudeSnowplow.fromBrowser(event, Date.now())])
    );
    fetch('https://collector.example.com/com.snowplowanalytics.snowplow/tp2', {
      method: 'POST',
      body,
      keepalive: true,
      credentials: 'include',
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
    return { event, code: 200, message: 'forwarded' };
  },
};
amplitude.add(snowplowDirect);
```

Without the tracker there are no page pings, no retries and no in-page interventions. A `?deviceId=` link can set Amplitude's `device_id`, so don't use `domain_userid` or `domain_sessionid` as a key on the public intervention endpoint in this mode.

### Webhook destination

Amplitude's Webhook destination can format each event with a FreeMarker template. The template below writes a Snowplow Collector payload, so Amplitude posts straight to your Collector with no service in between. It covers every source Amplitude streams, including server SDKs, the HTTP API and mobile apps. Check that your Amplitude plan includes the Webhook destination.

1. In Amplitude, go to **Data** > **Catalog**, open the **Destinations** tab, and create a Webhook destination that sends events. See Amplitude's [Webhooks](https://amplitude.com/docs/data/destination-catalog/webhooks) documentation.
2. Set the URL to your Collector's `tp2` endpoint, for example `https://collector.example.com/com.snowplowanalytics.snowplow/tp2`, and add the header `Content-Type: application/json`.
3. Choose to send events, and select the events to forward. If you also run the client-side plugin, forward only events that don't come from the browser.
4. Paste the template below as the event payload. Change `"aid":"my-app"` to the app ID you want these events to carry. If you added event names to the converter's lists, add them to the same lists near the top of the template.

   <details>
   <summary>FreeMarker template for the Snowplow Collector</summary>

   ```text
   <#setting time_zone="UTC">
   <#setting datetime_format="yyyy-MM-dd HH:mm:ss.SSS">
   <#setting number_format="computer">
   <#assign p = input.event_properties!{}>
   <#assign et = input.event_type>
   <#assign isPv = et == "[Amplitude] Page Viewed">
   <#assign kind = "track">
   <#if et == "$groupidentify"><#assign kind = "group"><#elseif et == "$identify"><#assign kind = (input.groups?? && input.groups?size > 0)?then("group", "identify")></#if>
   <#assign name = (et == "revenue_amount")?then(p["$revenueType"]!et, et)>
   <#assign lname = name?trim?lower_case>
   <#function hex12 n><#local digits = "0123456789abcdef"><#local out = ""><#local v = n><#list 1..12 as i><#local out = digits[(v % 16)] + out><#local v = (v / 16)?floor></#list><#return out></#function>
   <#function ms t><#local s = t?replace("T", " ")?replace("Z", "")><#local frac = s?contains(".")?then(s?keep_after_last("."), "")><#local base = s?contains(".")?then(s?keep_before_last("."), s)><#return base?datetime("yyyy-MM-dd HH:mm:ss")?long + ((frac + "000")?substring(0, 3))?number></#function>
   <#function cur3 v><#if v?is_string && v?matches("[A-Za-z]{3}")><#return v?upper_case></#if><#return ""></#function>
   <#function money v><#return ((v * 100)?round / 100)></#function>
   <#function str v><#if v?is_number><#return v?c></#if><#if v?is_string><#return v></#if><#return ""></#function>
   <#function num v><#if v?is_number><#return v></#if><#if v?is_string && v?trim?matches(r"-?[0-9]+(\.[0-9]+)?")><#return v?trim?number></#if><#return ""></#function>
   <#assign E = "iglu:com.snowplowanalytics.snowplow.ecommerce/">
   <#assign ECOM = {"product_view": ["product viewed", "view item", "view_item", "viewed product"], "add_to_cart": ["product added", "add to cart", "add_to_cart", "added to cart"], "remove_from_cart": ["product removed", "remove from cart", "remove_from_cart"], "checkout_step": ["checkout started", "begin checkout", "begin_checkout", "checkout step completed"], "transaction": ["order completed", "purchase", "purchase completed", "checkout completed"], "refund": ["order refunded", "refund", "refund completed"]}>
   <#assign SEARCH = ["products searched", "search", "searched", "site search", "search submitted"]>
   <#assign etype = "">
   <#if kind == "track"><#list ECOM?keys as t><#if ECOM[t]?seq_contains(lname)><#assign etype = t></#if></#list>
   <#if etype == "" && et == "revenue_amount"><#assign etype = (((p["$price"]!0) * (p["$quantity"]!1)) lt 0)?then("refund", "transaction")></#if></#if>
   <#assign currency = cur3(p.currency!p["$currency"]!"")>
   <#if p.products?? && p.products?is_sequence && p.products?size gt 0><#assign items = p.products>
   <#else><#assign items = [{"product_id": (p.product_id!p["$productId"]!p.sku!""), "name": (p.name!""), "category": (p.category!""), "price": num(p.price!p["$price"]!""), "quantity": num(p.quantity!p["$quantity"]!""), "brand": (p.brand!""), "variant": (p.variant!"")}]></#if>
   <#assign prods = []><#assign prodsOk = true><#assign lines = 0><#assign qty = 0>
   <#list items as it>
   <#assign pid = str(it.product_id!it.sku!it.id!it["$productId"]!"")><#assign pprice = num(it.price!"")>
   <#assign pcur = cur3(it.currency!"")><#if pcur == ""><#assign pcur = currency></#if>
   <#if pid == "" || !pprice?is_number || pprice lt 0 || pcur == ""><#assign prodsOk = false><#else>
   <#assign pq = num(it.quantity!"")><#assign hasQ = pq?is_number>
   <#assign prods = prods + [{"id": pid, "price": money(pprice), "currency": pcur, "q": hasQ?then(pq?round, -1), "name": str(it.name!""), "category": str(it.category!""), "brand": str(it.brand!""), "variant": str(it.variant!"")}]>
   <#assign lines = lines + pprice * hasQ?then(pq, 1)><#assign qty = qty + hasQ?then(pq?round, 1)>
   </#if>
   </#list>
   <#assign ents = "">
   <#list prods as x><#assign ents>${ents},{"schema":"${E}product/jsonschema/1-0-0","data":{"id":"${x.id?json_string}"<#if x.name != "">,"name":"${x.name?json_string}"</#if>,"category":"${x.category?json_string}","price":${x.price?c},"currency":"${x.currency}"<#if x.q gte 0>,"quantity":${x.q?c}</#if><#if x.brand != "">,"brand":"${x.brand?json_string}"</#if><#if x.variant != "">,"variant":"${x.variant?json_string}"</#if>}}</#assign></#list>
   <#if currency == "" && prods?size gt 0><#assign currency = prods[0].currency></#if>
   <#assign orderId = str(p.order_id!p.transaction_id!p.orderId!"")>
   <#assign ev = "">
   <#if etype == "checkout_step">
   <#assign step = p.step!1><#if !step?is_number || step lt 1><#assign step = 1></#if>
   <#assign ents>,{"schema":"${E}checkout_step/jsonschema/1-0-0","data":{"step":${step?round?c}}}<#if prodsOk>${ents}</#if></#assign>
   <#assign ev>{"schema":"${E}snowplow_ecommerce_action/jsonschema/1-0-2","data":{"type":"checkout_step"}}</#assign>
   <#elseif etype == "refund">
   <#assign amt = p.refund_amount!p.revenue!p["$revenue"]!(((p["$price"]!0) * (p["$quantity"]!1)))>
   <#if orderId != "" && currency != "" && amt?is_number>
   <#if !prodsOk><#assign ents = ""></#if>
   <#assign amt = (amt lt 0)?then(-amt, amt)>
   <#assign ents>${ents},{"schema":"${E}refund/jsonschema/1-0-0","data":{"transaction_id":"${orderId?json_string}","currency":"${currency}","refund_amount":${money(amt)?c}}}</#assign>
   <#assign ev>{"schema":"${E}snowplow_ecommerce_action/jsonschema/1-0-2","data":{"type":"refund"}}</#assign>
   </#if>
   <#elseif etype != "" && prodsOk>
   <#if etype == "transaction">
   <#assign rev = num(p.revenue!p["$revenue"]!p.total!lines)><#if !rev?is_number || rev lt 0><#assign rev = lines></#if>
   <#assign ents>${ents},{"schema":"${E}transaction/jsonschema/1-0-0","data":{"transaction_id":"${(orderId != "")?then(orderId, input["$insert_id"]!input.uuid)?json_string}","revenue":${money(rev)?c},"currency":"${currency}","total_quantity":${qty?c},"payment_method":"${str(p.payment_method!"unknown")?json_string}"}}</#assign>
   <#elseif (etype == "add_to_cart" || etype == "remove_from_cart") && (p.cart_total!p.cart_value!"")?is_number>
   <#assign ents>${ents},{"schema":"${E}cart/jsonschema/1-0-0","data":{"total_value":${money(p.cart_total!p.cart_value)?c},"currency":"${currency}"}}</#assign>
   </#if>
   <#assign ev>{"schema":"${E}snowplow_ecommerce_action/jsonschema/1-0-2","data":{"type":"${etype}"}}</#assign>
   </#if>
   <#if ev == ""><#assign ents = ""></#if>
   <#assign term = str(p.query!p.search_term!p.term!p.keyword!"")>
   <#if ev == "" && kind == "track" && SEARCH?seq_contains(lname) && term != "">
   <#assign ev>{"schema":"iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0","data":{"terms":["${term?json_string}"]<#if (p.results_count!"")?is_number>,"totalResults":${p.results_count?round?c}</#if>}}</#assign>
   </#if>
   <#if ev == "" && kind == "identify" && input.user_id??>
   <#assign ev>{"schema":"iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0","data":{"id":"${input.user_id?json_string}"}}</#assign>
   </#if>
   <#if ev == "" && !isPv>
   <#assign data>{"name":"${name?json_string}","tool":"amplitude","kind":"${kind}"<#rt>
   <#if num(p.price!"")?is_number>,"value":${num(p.price)?c}<#elseif (p["$price"]!"")?is_number>,"value":${(p["$price"] * (p["$quantity"]!1))?c}</#if><#rt>
   <#if (p.currency!p["$currency"]!"")?matches("[A-Za-z]{3}")>,"currency":"${(p.currency!p["$currency"])?upper_case}"</#if><#rt>
   <#if (p.product_id!p["$productId"])??>,"item_id":"${(p.product_id!p["$productId"])?json_string}"</#if><#rt>
   <#if p.category??>,"item_category":"${p.category?json_string}"</#if><#rt>
   <#if p.query??>,"search_term":"${p.query?json_string}"</#if><#rt>
   <#if p.plan??>,"plan":"${p.plan?json_string}"<#elseif kind == "group" && (input.group_properties.plan)??>,"plan":"${input.group_properties.plan?json_string}"</#if><#rt>
   <#if kind == "group" && input.groups?? && input.groups?size gt 0>,"group_id":"${input.groups?values[0]?json_string}"</#if>}</#assign>
   <#assign ev>{"schema":"iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0","data":${data}}</#assign>
   </#if>
   <#assign ue>{"schema":"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0","data":${ev}}</#assign>
   <#assign co>{"schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1","data":[{"schema":"iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0","data":{"tool":"amplitude","anonymous_id":"${input.device_id?json_string}","event_id":"${(input["$insert_id"]!input.uuid)?json_string}","user_id":<#if input.user_id??>"${input.user_id?json_string}"<#else>null</#if>,"session_id":<#if input.session_id?? && input.session_id gte 0>"${input.session_id?c}"<#else>null</#if>,"event_name":"${et?json_string}"}}${ents}]}</#assign>
   {"schema":"iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4","data":[{
   "e":"<#if isPv>pv<#else>ue</#if>","p":"web","tv":"amplitude-webhook-0.2","aid":"my-app",
   "eid":"${input.uuid}",
   "dtm":"${ms(input.client_event_time!input.event_time)?c}","ttm":"${ms(input.client_event_time!input.event_time)?c}","stm":"${ms(input.client_upload_time!input.event_time)?c}",
   <#assign did = input.device_id?lower_case>
   "duid":"${input.device_id?json_string}","tnuid":"${input.device_id?json_string}",
   <#if input.session_id?? && input.session_id gt 0 && did?matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")>"sid":"${did[0..23]}${hex12(input.session_id)}",</#if>
   <#if input.user_id??>"uid":"${input.user_id?json_string}",</#if>
   <#if input.ip_address??>"ip":"${input.ip_address}",</#if>
   <#if p["[Amplitude] Page Location"]??>"url":"${p["[Amplitude] Page Location"]?json_string}",</#if>
   <#if (p["[Amplitude] Previous Page Location"]!"") != "">"refr":"${p["[Amplitude] Previous Page Location"]?json_string}",</#if>
   <#if isPv>"page":"${(p["[Amplitude] Page Title"]!"")?json_string}",<#else>"ue_pr":"${ue?json_string}",</#if>
   "co":"${co?json_string}"
   }]}
   ```

   </details>

5. Send test events from Amplitude, then check them as described in [Check it works](#check-it-works).

The webhook keys visitors on Amplitude's `device_id`, which a `?deviceId=` link can set, so read these attributes from your backend only. Amplitude's documented delivery target is 60 seconds at the 95th percentile, so don't rely on this approach for reactions within a page view. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).

### Warehouse history

If you already export Amplitude events to a warehouse such as Snowflake or BigQuery, Signals can read pre-calculated attributes from a table there. Build a table of attributes per Amplitude `device_id` or `user_id` from the export, then configure it as described in [Warehouse configuration](/docs/signals/attributes/warehouse-config/index.md), with a custom attribute key for the Amplitude ID. This needs a warehouse connection in Signals, and attributes update on your sync schedule.

## How Amplitude events map to Snowplow

Each event takes the first row that fits. The same mapping runs in the converter and in the webhook template. See [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) for the reasoning.

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
| Any other event | `external_event`, kind `track` | `name` is the Amplitude event type. Typed fields from `price`, `currency`, `product_id`, `category`, `query` and `plan` |

Ecommerce and search events are matched by name, ignoring case. An ecommerce event falls back to `external_event` if any item lacks an ID, a price or a currency. Amplitude properties outside the typed fields aren't sent.

## Identifiers

| Amplitude field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow's own visitor and session cookies (with the tracker) | `domain_userid`, `domain_sessionid` | Yes, including on the public intervention endpoint |
| `device_id` | `external_identity.anonymous_id`. Also `domain_userid` without the tracker and on the webhook | Server-side reads only: a `?deviceId=` link can set it |
| `session_id` | `external_identity.session_id`. Without the tracker and on the webhook, also part of `domain_sessionid` | Never on its own: it's a timestamp |
| `user_id` | `user_id`, `external_identity.user_id` and `identify.id`, unchanged | Server-side reads only |
| `groups` | `external_event.group_id` | As a custom key for account attributes, server-side reads only |

To combine a visitor's activity across devices and logins, key stream attribute groups on `snowplow_id` with Snowplow Identities. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Troubleshooting

- **No page views in Snowplow:** page view autocapture is off in the Browser SDK. Turn it back on, or no visitor or session attributes fill.
- **Events reach Snowplow but not Amplitude:** the plugin forwards events even when Amplitude rejects them, for example with a wrong API key. Check **Data** > **Sources** > **Ingestion Debugger** in Amplitude.
- **Every event arrives twice:** both the tracker plugin and the no-tracker plugin are loaded, or the webhook forwards browser events the plugin already sends. Keep one path per event.
- **Server or app events are missing:** the client-side plugin sees browser events only. Add the Webhook destination for the rest.
- **`plan` changes unexpectedly:** any event with a `plan` property updates it, so a later track event replaces the plan from `groupIdentify`.

Where to go next:

- Create attributes from these events with the [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. With the tracker, `domain_userid` stays the same as you switch, so attributes carry over.
- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.

## Mapping code

The client-side plugin loads this converter, `window.AmplitudeSnowplow`. Save it on your site, for example as `/js/amplitude-snowplow.js`, and load it with a `<script>` tag before the Amplitude SDK.

<details>
<summary>amplitude-snowplow.js</summary>


```js
// Amplitude event (Browser SDK 2 HTTP V2 shape, or the export/webhook shape) -> Snowplow tracker payload.
// Dependency-free so the same file runs in the page (Amplitude destination plugin) and on a server.
// Wrapped so that only AmplitudeSnowplow is added to window.
(function (root) {
var ADAPTER = { tool: 'amplitude', tv: 'amplitude-adapter-1.0', aid: 'amplitude-adapter', ns: '6f1c3c2e-5b7a-4d2e-9a51-3e0f6c1d2b4a' };
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

function pick() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}
function str255(v) { return v === undefined || v === null || typeof v === 'object' ? undefined : String(v).slice(0, 255); }
function num(v) {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v))) return Number(v);
  return undefined;
}
function firstKey(o) { if (!o || typeof o !== 'object') return undefined; for (var k in o) return k; return undefined; }
function firstVal(o) { var k = firstKey(o); if (k === undefined) return undefined; var v = o[k]; return Array.isArray(v) ? v[0] : v; }
// Export and webhook times are UTC strings like "2026-11-13 10:00:00.123456" with no zone.
function amplitudeTime(v) {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'number') return Math.round(v);
  var s = String(v);
  if (/^\d+$/.test(s)) return Number(s);
  var m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d{1,3})?\d*(Z|[+-]\d{2}:?\d{2})?$/);
  var n = m ? Date.parse(m[1] + 'T' + m[2] + (m[3] || '') + (m[4] || 'Z')) : Date.parse(s);
  return isNaN(n) ? undefined : n;
}

var PV = '[Amplitude] Page Viewed';

// domain_sessionid must be a UUID. Keep device_id's first 24 hex chars (74 random bits) and put session_id
// (epoch ms) in hex in the last 12, so a FreeMarker template and the page can build the same key.
function sessionKey(deviceId, sessionId) {
  if (!deviceId || sessionId === undefined || sessionId === null || sessionId < 0) return undefined;
  var d = String(deviceId).toLowerCase();
  var tail = ('000000000000' + Number(sessionId).toString(16)).slice(-12);
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(d)) return d.slice(0, 24) + tail;
  return uuidv5('amplitude-session:' + deviceId + ':' + sessionId, ADAPTER.ns);
}

// Both input shapes reduce to one canonical event.
function fromBrowser(ev, sentMs) {
  return {
    eventType: ev.event_type, insertId: ev.insert_id, deviceId: ev.device_id, userId: ev.user_id,
    sessionId: ev.session_id, timeMs: ev.time, sentMs: sentMs, receivedMs: undefined,
    props: ev.event_properties || {}, groups: ev.groups, groupProps: ev.group_properties,
    ip: ev.ip && ev.ip !== '$remote' ? ev.ip : undefined, ua: ev.user_agent, lang: ev.language,
  };
}
function fromExport(ev) {
  return {
    eventType: ev.event_type, insertId: pick(ev.$insert_id, ev.uuid), deviceId: ev.device_id, userId: ev.user_id,
    sessionId: ev.session_id, timeMs: amplitudeTime(pick(ev.client_event_time, ev.event_time)),
    sentMs: amplitudeTime(ev.client_upload_time), receivedMs: amplitudeTime(pick(ev.server_received_time, ev.event_time)),
    props: ev.event_properties || {}, groups: ev.groups, groupProps: ev.group_properties,
    ip: ev.ip_address, ua: undefined, lang: ev.language,
  };
}

function kindOf(c) {
  if (c.eventType === PV) return 'page';
  if (c.eventType === '$groupidentify') return 'group';
  if (c.eventType === '$identify') return firstKey(c.groups) ? 'group' : 'identify';
  return 'track';
}

// Fallback slots for external_event only; ecommerce events carry every product as entities instead.
function slots(c, kind) {
  var p = c.props, first = Array.isArray(p.products) && p.products.length ? p.products[0] || {} : {};
  var gset = c.groupProps && c.groupProps.$set ? c.groupProps.$set : c.groupProps || {};
  var s = {
    value: num(pick(p.revenue, p.$revenue, p.value,
      num(p.$price) !== undefined ? num(p.$price) * (num(p.$quantity) || 1) : undefined, p.price)),
    currency: cur3(pick(p.currency, p.$currency)),
    item_id: str255(pick(p.product_id, p.$productId, p.sku, first.product_id)),
    item_category: str255(pick(p.category, first.category)),
    search_term: str255(p.query),
    plan: str255(pick(p.plan, kind === 'group' ? gset.plan : undefined)),
  };
  if (kind === 'group') s.group_id = str255(firstVal(c.groups));
  return s;
}

function cur3(v) { return typeof v === 'string' && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : undefined; }
function money(v) { v = num(v); return v === undefined || v < 0 ? undefined : Math.round(v * 100) / 100; }
function sdj(schema, data) { return { schema: 'iglu:' + schema, data: data }; }
function compact(o) { var r = {}; for (var k in o) if (o[k] !== undefined) r[k] = o[k]; return r; }

// Common Amplitude event names. Add your own names here if they differ.
var ECOM = {
  product_view: ['product viewed', 'view item', 'view_item', 'viewed product'],
  add_to_cart: ['product added', 'add to cart', 'add_to_cart', 'added to cart'],
  remove_from_cart: ['product removed', 'remove from cart', 'remove_from_cart'],
  checkout_step: ['checkout started', 'begin checkout', 'begin_checkout', 'checkout step completed'],
  transaction: ['order completed', 'purchase', 'purchase completed', 'checkout completed'],
  refund: ['order refunded', 'refund', 'refund completed'],
};
var SEARCH = ['products searched', 'search', 'searched', 'site search', 'search submitted'];
function ecomType(c, name) {
  var n = String(name || '').trim().toLowerCase();
  for (var t in ECOM) if (ECOM[t].indexOf(n) >= 0) return t;
  // Amplitude's revenue() call: a negative amount is a refund.
  if (c.eventType === 'revenue_amount') return (num(c.props.$price) || 0) * (num(c.props.$quantity) || 1) < 0 ? 'refund' : 'transaction';
  return undefined;
}

// One product entity per item. Returns undefined if any item lacks a field the product schema requires.
function products(p, currency) {
  var items = Array.isArray(p.products) && p.products.length ? p.products
    : [{ product_id: pick(p.product_id, p.$productId, p.sku), name: p.name, category: p.category,
      price: pick(p.price, p.$price), quantity: pick(p.quantity, p.$quantity), brand: p.brand, variant: p.variant }];
  var out = [];
  for (var i = 0; i < items.length; i++) {
    var it = items[i] || {};
    var id = pick(it.product_id, it.sku, it.id, it.$productId), price = money(it.price);
    var cur = cur3(pick(it.currency, currency));
    if (id === undefined || price === undefined || !cur) return undefined;
    var q = num(it.quantity);
    out.push(compact({
      id: String(id), name: str255(it.name), category: str255(pick(it.category)) || '', price: price, currency: cur,
      quantity: q !== undefined ? Math.max(0, Math.round(q)) : undefined, brand: str255(it.brand), variant: str255(it.variant),
      position: num(it.position) !== undefined ? Math.round(it.position) : undefined,
    }));
  }
  return out;
}

// The ladder: Iglu Central schemas where one fits, external_event for the rest.
function toSnowplow(c) {
  var p = c.props, kind = kindOf(c), E = 'com.snowplowanalytics.snowplow.ecommerce/';
  var name = c.eventType === 'revenue_amount' ? pick(p.$revenueType, c.eventType) : c.eventType;
  if (kind === 'page') return { e: 'pv', entities: [] };
  // An $identify without a user_id only sets user properties (the SDK's attribution call), so it stays external_event.
  if (kind === 'identify' && c.userId) return { e: 'ue', event: sdj('com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0', { id: String(c.userId).slice(0, 256) }), entities: [] };
  var type = kind === 'track' ? ecomType(c, name) : undefined;
  if (type) {
    var currency = cur3(pick(p.currency, p.$currency));
    var prods = products(p, currency);
    if (type === 'checkout_step') {
      return { e: 'ue', event: sdj(E + 'snowplow_ecommerce_action/jsonschema/1-0-2', { type: type }),
        entities: [sdj(E + 'checkout_step/jsonschema/1-0-0', { step: Math.max(1, Math.round(num(p.step) || 1)) })]
          .concat((prods || []).map(function (x) { return sdj(E + 'product/jsonschema/1-0-0', x); })) };
    }
    if (prods || type === 'refund') {
      var ents = (prods || []).map(function (x) { return sdj(E + 'product/jsonschema/1-0-0', x); });
      var cur = currency || (prods && prods[0].currency);
      var lines = (prods || []).reduce(function (s, x) { return s + x.price * (x.quantity === undefined ? 1 : x.quantity); }, 0);
      var orderId = pick(p.order_id, p.transaction_id, p.orderId);
      if (type === 'transaction') {
        ents.push(sdj(E + 'transaction/jsonschema/1-0-0', compact({
          transaction_id: String(pick(orderId, c.insertId)), revenue: pick(money(pick(p.revenue, p.$revenue, p.total)), money(lines)),
          currency: cur, total_quantity: (prods || []).reduce(function (s, x) { return s + (x.quantity === undefined ? 1 : x.quantity); }, 0),
          // Required by the schema; Amplitude has no standard field for it.
          payment_method: String(pick(p.payment_method, 'unknown')).slice(0, 128),
          tax: money(p.tax), shipping: money(p.shipping), discount_amount: money(p.discount),
          discount_code: str255(p.coupon) ? String(p.coupon).slice(0, 99) : undefined,
        })));
      } else if (type === 'refund') {
        var amt = money(Math.abs(num(pick(p.refund_amount, p.revenue, p.$revenue, p.$price !== undefined ? num(p.$price) * (num(p.$quantity) || 1) : undefined)) || 0));
        if (orderId === undefined || !cur || amt === undefined) type = undefined;
        else ents.push(sdj(E + 'refund/jsonschema/1-0-0', compact({ transaction_id: String(orderId), currency: cur, refund_amount: amt, refund_reason: str255(p.reason) })));
      } else if (type === 'add_to_cart' || type === 'remove_from_cart') {
        var total = money(pick(p.cart_total, p.cart_value));
        // The cart entity needs the cart total after the change, which the event may not carry.
        if (total !== undefined && cur) ents.push(sdj(E + 'cart/jsonschema/1-0-0', compact({ cart_id: str255(p.cart_id), total_value: total, currency: cur })));
      }
      if (type) return { e: 'ue', event: sdj(E + 'snowplow_ecommerce_action/jsonschema/1-0-2', { type: type }), entities: ents };
    }
  }
  var term = kind === 'track' && SEARCH.indexOf(String(name).trim().toLowerCase()) >= 0 ? str255(pick(p.query, p.search_term, p.term, p.keyword)) : undefined;
  if (term) {
    var total2 = num(pick(p.results_count, p.total_results));
    return { e: 'ue', event: sdj('com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0', compact({ terms: [term], totalResults: total2 !== undefined ? Math.max(0, Math.round(total2)) : undefined })), entities: [] };
  }
  var data = { name: String(pick(name, 'unknown')).slice(0, 255), tool: ADAPTER.tool, kind: kind };
  var sl = slots(c, kind);
  for (var k in sl) if (sl[k] !== undefined) data[k] = sl[k];
  return { e: 'ue', event: sdj('com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0', data), entities: [] };
}

function identity(c, anon) {
  return sdj('com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', compact({
    tool: ADAPTER.tool, anonymous_id: anon ? String(anon).slice(0, 255) : null, user_id: c.userId ? String(c.userId).slice(0, 255) : null,
    session_id: c.sessionId !== undefined && c.sessionId !== null && c.sessionId >= 0 ? String(c.sessionId) : null,
    event_id: c.insertId ? String(c.insertId).slice(0, 255) : null,
    event_name: c.eventType ? String(c.eventType).slice(0, 255) : null,
  }));
}

function toTrackerEvent(c) {
  var p = c.props;
  var anon = pick(c.deviceId, c.userId, c.insertId);
  // Page Location keeps the query string (UTMs, click ids); Page URL drops it.
  var url = pick(p['[Amplitude] Page Location'], p['[Amplitude] Page URL']);
  var ref = pick(p['[Amplitude] Previous Page Location'], p.referrer);
  var sp = toSnowplow(c);
  var out = {
    e: sp.e, p: 'web', tv: ADAPTER.tv, aid: ADAPTER.aid,
    // UUIDv5 of insert_id, so the browser route and the webhook route give the same event_id.
    eid: uuidv5(pick(c.insertId, JSON.stringify(c)), ADAPTER.ns),
    dtm: c.timeMs !== undefined ? String(c.timeMs) : undefined,
    stm: c.sentMs !== undefined ? String(c.sentMs) : undefined,
    ttm: c.timeMs !== undefined ? String(c.timeMs) : undefined,
    ip: c.ip, ua: c.ua,
    tnuid: fitId(anon), duid: fitId(anon),
    sid: sessionKey(c.deviceId, c.sessionId),
    uid: c.userId ? String(c.userId).slice(0, 255) : undefined,
    url: url, refr: ref || undefined, lang: c.lang,
  };
  if (sp.e === 'pv') out.page = p['[Amplitude] Page Title'];
  else out.ue_pr = JSON.stringify(sdj('com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0', sp.event));
  out.co = JSON.stringify(sdj('com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1', [identity(c, anon)].concat(sp.entities)));
  var clean = {};
  for (var key in out) if (out[key] !== undefined && out[key] !== null && out[key] !== '') clean[key] = String(out[key]);
  return clean;
}

function toPayload(canon) {
  return { schema: 'iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4', data: canon.map(toTrackerEvent) };
}

var AmplitudeSnowplow = { toTrackerEvent: toTrackerEvent, toPayload: toPayload, fromBrowser: fromBrowser, fromExport: fromExport, kindOf: kindOf, slots: slots, toSnowplow: toSnowplow, identity: identity, uuidv5: uuidv5, sessionKey: sessionKey, amplitudeTime: amplitudeTime, ADAPTER: ADAPTER };
if (typeof module !== 'undefined' && module.exports) module.exports = AmplitudeSnowplow;
else root.AmplitudeSnowplow = AmplitudeSnowplow;
})(typeof window !== 'undefined' ? window : this);
```

</details>
