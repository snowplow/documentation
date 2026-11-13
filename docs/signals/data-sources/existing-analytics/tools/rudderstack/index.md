---
title: "Use Signals with RudderStack"
sidebar_label: "RudderStack"
sidebar_position: 20
description: "Send the events you already track with RudderStack to Snowplow, from the browser or from your RudderStack workspace, and build Signals attributes on them without retagging."
keywords: ["rudderstack", "transformation", "webhook destination", "custom device mode", "external_event", "signals"]
date: "2026-11-13"
content_type: how-to
---

Use the `page`, `track`, `identify`, `group` and `alias` calls you already make with RudderStack to build Snowplow Signals attributes, without retagging your site.

## Choose an approach

You can send RudderStack events to Snowplow in two ways, and add a third for history later.

- **Client-side:** a custom device mode integration in the RudderStack JavaScript SDK copies each call into the Snowplow JavaScript tracker, which runs on the same page.
- **Server-side:** a transformation in your RudderStack workspace converts each event and a Webhook destination posts it to your Snowplow Collector. If you can't use transformations, the HTTP Webhook destination can do the same with field mappings and no code.
- **Warehouse:** RudderStack's warehouse destinations give you history for batch attributes.

| | Client-side: custom device mode integration | Server-side: transformation and Webhook destination | Warehouse: RudderStack warehouse destination |
|---|---|---|---|
| What you change | A few lines in the page where the RudderStack SDK loads, the Snowplow tracker script, and a Custom Device Mode destination in your workspace | A transformation and a Webhook destination in your RudderStack workspace. No page change | A warehouse connection in Signals |
| Events covered | Browser calls made through the RudderStack JavaScript SDK | Every event your connected RudderStack sources send: browser, server and app SDKs | Whatever RudderStack has loaded into your warehouse |
| Visitor key | Snowplow's own random cookie ID (`domain_userid`) | RudderStack's `anonymousId`, copied into `domain_userid` | Depends on the tables you read |
| Sessions and engagement | Yes: Snowplow sessions, page pings, scroll depth | No Snowplow sessions or page pings. RudderStack's session ID is kept for reference only | No |
| Delivery | Straight from the browser to your Collector | Through RudderStack's processing and router queues, then to your Collector. Expect seconds, not milliseconds | Batch, on your warehouse sync schedule |
| Personal data path | Browser to Collector: IP address, user agent, page URLs, the user ID, and RudderStack's own cookies if the Collector is on the same site | RudderStack to Collector: IP address, user agent, page URL, referrer, title, the user ID and search terms. Traits stay in RudderStack | Stays in your warehouse |
| Plan or license needed | A Custom Device Mode destination in RudderStack, which RudderStack documents as generally available. Snowplow pipeline with Signals | RudderStack transformations, which RudderStack lists on its free plan (up to 5 JavaScript transformations), Growth and Enterprise. Snowplow pipeline with Signals | A RudderStack warehouse destination. A Signals warehouse connection |

Choose client-side if:

- You want session or engagement attributes, such as pages per session or seconds engaged.
- You want the quickest reaction to what a visitor does, for interventions in the page.
- You plan to move to native Snowplow tracking later, because the visitor ID stays the same when you do.

Choose server-side if:

- You need events from RudderStack's server or mobile SDKs, not only the browser.
- You can't change the page, or you want the setup to live in your RudderStack workspace.
- Visitor and account attributes are enough, and a delay of seconds is acceptable.

You can run both. If you do, connect the server-side destination only to your server and app sources, so browser events don't arrive twice under two visitor keys. Giving each approach its own app ID makes the split easy to check.

## Before you begin

You need:

- The RudderStack JavaScript SDK v3 (`@rudderstack/analytics-js`) on your site for the client-side approach. Custom device mode integrations need version 3.23.0 or later. Your loading snippet must list `addCustomIntegration` among its methods; older snippets don't, so copy a current one from your source's **Setup** tab if yours lacks it.
- Permission to create transformations and destinations in your RudderStack workspace for the server-side approach.
- A Snowplow Collector URL that RudderStack can reach. Allow-list RudderStack's outbound IP addresses if your Collector is behind a firewall.
- Snowplow Signals enabled on your pipeline.
- The `external_event` and `external_identity` schemas, published on Iglu Central, alongside the ecommerce, `site_search` and `identify` schemas the adapter also uses. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md). If you register your own copies, deploy them to production before you send any events.

Check your RudderStack ecommerce events use the ecommerce spec names (`Product Viewed`, `Order Completed` and so on) with a price and a currency. RudderStack shares these names with Segment's v2 spec. Events with other names, or without a currency, become generic `external_event` events instead of Snowplow ecommerce events. See [How RudderStack events map to Snowplow](#how-rudderstack-events-map-to-snowplow).

## Set up the client-side approach

The client-side approach loads the Snowplow JavaScript tracker next to the RudderStack SDK, then registers a custom device mode integration. RudderStack hands every call to the integration in the browser, and the integration replays it into the Snowplow tracker.

1. In your RudderStack workspace, add a **Custom Device Mode** destination and connect it to your JavaScript source. Copy its destination ID. The SDK only forwards events to a custom integration whose ID matches a Custom Device Mode destination in your source's configuration. With any other ID, the SDK logs an error and nothing reaches Snowplow.

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

3. Add the mapping functions from the [server-side transformation](#set-up-the-server-side-approach) to the page: everything in it except `toTrackerEvent`, `toPayload`, `transformEvent` and the hashing helpers. The integration below uses its `ladder` function, which returns the Snowplow event and entities for each call.

4. Register the integration. Put this in the page source straight after steps 2 and 3, not in a `rudderanalytics.ready()` callback or a tag that fires later. The SDK only accepts `addCustomIntegration` before it has finished loading; after that it logs `Cannot add custom integration ... after the SDK is loaded` and ignores the integration.

   ```html
   <script>
     function externalIdentity(ev, type) {
       return {
         schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0',
         data: {
           tool: 'rudderstack',
           anonymous_id: String(ev.anonymousId).slice(0, 255),
           user_id: ev.userId ? String(ev.userId).slice(0, 255) : null,
           session_id: ev.context && ev.context.sessionId ? String(ev.context.sessionId) : null,
           session_number: null,
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

   Replace `<destination_id>` with the ID from step 1. Ecommerce calls are sent as the same `snowplow_ecommerce_action` event and entities that the Snowplow ecommerce plugin produces, through `trackSelfDescribingEvent`, so this approach doesn't need the ecommerce plugin.

   The SDK checks `isReady` every 100 milliseconds for up to 11 seconds. Calls made before it returns `true`, including calls made before the SDK itself has loaded, are queued and handed to the integration once it is ready. If it isn't ready within 11 seconds, the SDK drops the integration for that page view and nothing reaches Snowplow. `rudderanalytics.ready()` callbacks wait for the integration, so a slow `isReady` delays them too.

5. Publish the page change.

:::caution[RudderStack cookies and a same-site Collector]
If your Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends RudderStack's cookies with every request to it: `rl_anonymous_id`, `rl_user_id`, `rl_trait`, `rl_group_id`, `rl_group_trait`, `rl_session` and `rl_page_init_referrer`. Their values are base64-encoded, which is not encryption, so `rl_trait` and `rl_group_trait` carry any email address you pass in `identify` or `group` traits. The email doesn't reach the Snowplow events, but it is in the request headers your Collector receives.

To keep these cookies off Collector requests, add `credentials: 'omit'` to the `newTracker` options in step 2. The browser then sends no cookies to the Collector, including the Collector's own cookie, so if you rely on `network_userid`, check how your Collector sets it before you use this option. `domain_userid` and `domain_sessionid` are unaffected. Otherwise, use a Collector on a different site, or confirm this is acceptable in your privacy review.
:::

## Set up the server-side approach

The server-side approach runs in your RudderStack workspace. A JavaScript transformation turns each RudderStack event into one Snowplow tracker request, and a Webhook destination posts the result to your Collector. RudderStack retries failed deliveries.

1. In your RudderStack workspace, create a JavaScript transformation and paste the code below. It has no imports, so it runs in RudderStack's transformation sandbox as it is. Set `aid` in `CONFIG` to your app ID.

   The entry point is short:

   ```js
   export function transformEvent(event, metadata) {
     return toPayload([event]);
   }
   ```

   `toPayload` maps the event and wraps it as a Snowplow `payload_data` body. Each event gets a Snowplow `event_id` derived from RudderStack's `messageId` (a UUID version 5), so a retried event keeps the same ID and Signals counts it once.

   <details>
   <summary>Full transformation code</summary>

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

2. Add a **Webhook** destination with these settings:

   - **Webhook URL:** `https://collector.example.com/com.snowplowanalytics.snowplow/tp2`
   - **Method:** `POST`

3. Connect the transformation to the Webhook destination.

4. Connect the destination to the sources whose events you want in Snowplow, such as your website source and any server sources.

5. Enable the destination.

The Webhook destination sends one event per request, with the transformation's output as the body.

:::caution
RudderStack caches transformation code, for 24 hours by default on a self-hosted rudder-transformer. Publish each change as a new transformation version.
:::

### No-code alternative: HTTP Webhook mappings

If your workspace can't use transformations, the **HTTP Webhook** destination can build the Collector request from field mappings. Each mapping sets one query parameter of Snowplow's `GET /i` endpoint from an expression on the RudderStack event. The mapping engine accepts conditions, `??`, `Date.parse`, `JSON.stringify`, `.map` and `.reduce`, so it can follow the whole event ladder, including one product entity per product.

1. Add an **HTTP Webhook** destination with URL `https://collector.example.com/i`, method `GET`, no authentication and batching off.

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
   | `ue_pr` | The self-describing event, built from the expressions below |
   | `co` | The entities, built from the expressions below |

3. Build `ue_pr` and `co` from these parts. Each part is an expression; substitute it where its name appears.

   ```js
   // CUR: the event currency, upper-cased
   ($.properties.currency ? $.properties.currency.toUpperCase() : undefined)

   // ACT: the ecommerce action for a spec event name, only when the event has a currency
   ($.type === 'track' && CUR ? ({'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart', 'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step', 'order completed': 'transaction', 'order refunded': 'refund'})[($.event ?? '').toLowerCase()] : undefined)

   // IDENTITY: the external_identity entity
   {schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', data: {tool: 'rudderstack', anonymous_id: $.anonymousId, user_id: $.userId || null, session_id: $.context.sessionId ? String($.context.sessionId) : null, session_number: null, event_name: $.type === 'track' ? $.event : ($.type === 'page' || $.type === 'screen') ? ($.name || null) : $.type}}

   // EXTERNAL: the external_event for everything else
   {schema: 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0', data: {name: $.type === 'track' ? $.event : $.type, tool: 'rudderstack', kind: $.type, value: $.properties.revenue ?? $.properties.value ?? $.properties.total ?? $.properties.price, currency: CUR, item_id: $.properties.product_id ?? $.properties.sku ?? $.properties.products[0].product_id, item_category: $.properties.category ?? $.properties.products[0].category, search_term: $.properties.query, plan: $.properties.plan ?? ($.type === 'group' ? $.traits.plan : undefined), group_id: $.groupId, previous_id: $.previousId}}

   // UE: walk the ladder
   $.type === 'identify' && $.userId ? {schema: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0', data: {id: String($.userId)}}
     : $.type === 'track' && $.event === 'Products Searched' && $.properties.query ? {schema: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0', data: {terms: [String($.properties.query)]}}
     : ACT ? {schema: 'iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2', data: {type: ACT}}
     : EXTERNAL

   // ue_pr
   ($.type === 'page' || $.type === 'screen') ? undefined : JSON.stringify({schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0', data: UE})

   // co
   JSON.stringify({schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1', data: ($.type === 'page' || $.type === 'screen') ? [IDENTITY] : [...PRODUCTS, ...EXTRA, IDENTITY]})
   ```

   `PRODUCTS` builds one `product` entity per item with `.map(lambda ...)`, and `EXTRA` adds the `cart`, `checkout_step`, `transaction` or `refund` entity for the action. They are too long to print here.

:::caution[HTTP Webhook mappings]
- Wrap numbers you put in a query parameter in `String()`. Without it, timestamps are sent as `1.794478733726e+12` and fail.
- A second `/` in one expression is read as the start of a regular expression. To round, use `Number(x.toFixed(2))` rather than dividing.
- The ecommerce rung needs a currency on every event, so a `Checkout Step Completed` without one becomes `external_event` here but `checkout_step` with the transformation.
- `eid` is the raw `messageId`, and Snowplow requires it to be a UUID. The RudderStack JavaScript SDK sends a UUID. For sources whose `messageId` may not be one, use the transformation, which derives a UUID version 5 from any `messageId`.
- RudderStack has a second version of this destination that builds the body from a JSONata template. Its template language has no conditions or string functions, so it can only map page views. Use the query parameter mappings.
:::

## Check it works

Send a few calls from a test page, then look at the events in your pipeline or in Snowplow Micro.

To check locally with Snowplow Micro, start it as below. If you registered your own copies of the two schemas, put them in `iglu/` so Micro loads them as an embedded registry:

```bash
docker run -p 9090:9090 \
  -v "$PWD/iglu:/config/iglu-client-embedded" \
  snowplow/snowplow-micro:4.6.2 --yauaa
```

Here `iglu/` holds `schemas/com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0` and `.../external_identity/jsonschema/1-0-0`. Point the Snowplow tracker or the Webhook URL at Micro, then open `/micro/good` and `/micro/bad` on it. RudderStack Cloud can't reach a Micro on your laptop, so for the server-side approach run Micro somewhere RudderStack can reach, or test against your pipeline.

For a page view, a product view, an order with two products and an `identify` call, you should see:

- A native `page_view` for each `page` call.
- A `snowplow_ecommerce_action` event of type `product_view` with one `product` entity.
- A `snowplow_ecommerce_action` event of type `transaction` with one `product` entity per product and a `transaction` entity whose `total_quantity` counts every item.
- An `identify` event whose only field is `id`. The email and other traits are not there.
- An `external_identity` entity on every event, with `tool` set to `rudderstack`, RudderStack's `anonymousId`, its session ID and the original event name in `event_name`.
- With the server-side approach, `domain_userid` equal to RudderStack's `anonymousId`.
- With the client-side approach, `page_ping` events and the same `domain_sessionid` on every event in the visit. Page pings carry the `external_identity` entity of the page view they follow.
- Nothing in `/micro/bad`.

Check failed events in your pipeline as well as RudderStack's delivery status. The Collector accepts events before they are validated, so RudderStack counts an event as delivered even when it later fails validation.

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

A product with no category gets an empty category. With the transformation, an ecommerce event with a product that has no price or currency falls to `external_event`. RudderStack properties and traits that don't match a typed field stay in RudderStack.

## Identifiers

| RudderStack field | Snowplow field | Use as a Signals key? |
|---|---|---|
| `anonymousId` (JavaScript SDK: a UUID version 4) | Server-side: `domain_userid` and `network_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend. Read it in the page with `rudderanalytics.getAnonymousId()`. Not recommended on the public intervention endpoint, because RudderStack doesn't document how it's generated. For interventions, use the client-side approach |
| Snowplow cookie ID (client-side only) | `domain_userid` | Yes. A random ID set by the Snowplow tracker, safe on the public intervention endpoint |
| Snowplow session ID (client-side only) | `domain_sessionid` | Yes, for session attributes |
| `userId` | `user_id`, `external_identity.user_id` and `identify.id`, in clear | Server-side reads only. Never on the public intervention endpoint, because it can be guessed |
| `context.sessionId` | `external_identity.session_id` | No. It is a timestamp in milliseconds, so it can be guessed |
| `groupId` | `external_event.group_id` | Server-side reads only, for account attributes |
| `previousId` | `external_event.previous_id` | No. Recorded only |
| `messageId` | `event_id` (transformation: UUID version 5; HTTP Webhook: as sent) | No. Used to spot duplicates |
| Event name | `external_identity.event_name` on every event | No. Lets an attribute filter on the original RudderStack name |
| `context.ip`, or `request_ip` when it is absent | `user_ipaddress` | No |
| `context.userAgent` | `useragent`, parsed by YAUAA | No |

:::caution[anonymousId from server SDKs]
RudderStack's server SDKs and HTTP API accept any string as `anonymousId`. A value longer than 128 characters is stored in `domain_userid` as its SHA-256 hash, with the original in `external_identity`. An event with no `anonymousId` falls back to the `userId`, which then becomes `domain_userid`, `network_userid` and `external_identity.anonymous_id`.
:::

Unlike the Segment adapter, the RudderStack transformation does not hash a `userId` that contains `@`. If your user IDs can be email addresses, hash them before they leave RudderStack.

If your pipeline runs Snowplow Identities, stream attribute groups can be keyed on `snowplow_id`, so a visitor's browser events and their logged-in server events count towards the same attributes. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Starter attribute groups

The [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) work on RudderStack data with these notes:

- **Visitor activity, purchase intent, funnel:** both approaches. To count your own events, filter `external_event` on `name`, for example `Signup Form Submitted`. To count any event by its RudderStack name, including ones mapped to ecommerce, filter on `external_identity.event_name`.
- **Account and plan:** both approaches. `plan` comes from `track` properties or `group` traits. A plan set only in `identify` traits is dropped.
- **Session engagement:** client-side only. The server-side approach has no Snowplow sessions and no page pings.

## Limits

### Client-side approach

1. **Browser calls only.** Calls from RudderStack's server and mobile SDKs don't pass through the JavaScript SDK.
2. **Blocked with the RudderStack SDK.** If an ad blocker stops the SDK file or its source configuration from loading, the integration doesn't run and nothing reaches Snowplow. Blocking only RudderStack's data plane doesn't matter: every event still reaches Snowplow.
3. **Registered too late, it never runs.** The integration must be added before the SDK finishes loading, from a snippet that lists `addCustomIntegration`. See step 4.
4. **RudderStack cookies can reach a same-site Collector.** See the caution under the setup steps.
5. **The user ID is sent in clear.**
6. **Two visitor IDs.** Snowplow's `domain_userid` differs from RudderStack's `anonymousId`. They are linked through the `external_identity` entity, but attributes keyed on one don't read by the other.

### Server-side approach

1. **No sessions or engagement.** `domain_sessionid` is empty and there are no page pings. RudderStack's session ID is kept in `external_identity` but Signals doesn't build session attributes from it.
2. **Seconds of delay.** RudderStack's processor and router poll their queues, so events arrive seconds after the call. Don't rely on the server-side approach for reactions within a page view.
3. **A failed event holds up later ones.** RudderStack delivers each user's events in order, so while one event is being retried, that user's later events wait behind it.
4. **Personal data reaches Snowplow.** IP address, user agent, page URL, referrer, title, the user ID in clear and free-text search terms.
5. **Server events without context.** Events with no `context.userAgent` are recorded with RudderStack's own user agent. Events with no IP address record the address of the RudderStack server. Every event is recorded with platform `web`.
6. **Events with only a `userId` are keyed on it.** The transformation falls back to the `userId` when there is no `anonymousId`, so `domain_userid` holds a guessable value, and an email in clear if your user IDs are emails.

### Both approaches

1. **Attributes only on declared fields.** Signals builds attributes only on properties a schema declares. Outside the ecommerce events, only `external_event`'s typed fields are kept. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).
2. **First product only outside the ecommerce rung.** `external_event` has one `item_id`, so a multi-product event that isn't a spec ecommerce event keeps only its first product.
3. **No user traits.** `identify` carries the user ID only.
4. **Ecommerce fields RudderStack doesn't send.** `payment_method` defaults to `unknown`, a missing category becomes empty, and the cart total falls back to the line value.

### Warehouse approach

Batch attributes need a Signals warehouse connection, and a Signals deployment reads one warehouse.

Where to go next:

- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Copy the definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- When you are ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approach the visitor ID stays the same, so attributes carry over. On the server-side approach, `domain_userid` changes from RudderStack's `anonymousId` to Snowplow's cookie ID when you switch.
- Field reference: [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).
