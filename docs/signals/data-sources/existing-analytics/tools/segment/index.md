---
title: "Use Signals with Segment"
sidebar_label: "Segment"
sidebar_position: 10
description: "Send the events you already track with Segment to Snowplow, from the browser or from your Segment workspace, and build Signals attributes on them without retagging."
keywords: ["segment", "analytics.js", "destination plugin", "destination function", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the `analytics.page`, `track`, `identify` and `group` calls you already make with Segment to build Snowplow Signals attributes, without retagging your site.

## Choose an approach

Most sites should use the **client-side approach**: a destination plugin in analytics.js copies each Segment call into the Snowplow JavaScript tracker on the same page. It gives you sessions, page pings and a random visitor ID that is safe for interventions in the page, and the visitor ID stays the same if you later move to native tracking.

| Approach | Use it when |
|---|---|
| [Client-side: destination plugin](#set-up-the-client-side-approach) | You can add a few lines to the page where analytics.js loads |
| [Server-side: Destination Function](#server-side-destination-function) | You need events from Segment's server or app libraries, or you can't change the page. No sessions, and events arrive seconds later through Segment's queue |
| [Warehouse history](#warehouse-history) | You want batch attributes from the Segment data already in your warehouse |

You can run client-side and server-side together. Connect the Destination Function only to your server and app sources, so browser events don't arrive twice under two visitor keys.

## Before you begin

You need:

- A Snowplow Collector URL for a pipeline with Signals enabled.
- Segment's analytics.js 2.0 (analytics-next) on your site.
- Segment ecommerce events that use Segment's v2 spec names (`Product Viewed`, `Order Completed` and so on) with a price and a currency. Other events become generic `external_event` events. See [How Segment events map to Snowplow](#how-segment-events-map-to-snowplow).

## Set up the client-side approach

1. Load the Snowplow tracker and the ecommerce plugin, and create a tracker that points at your Collector. Put this after the Segment snippet.

   ```html
   <script>
     (function (p, l, o, w, i, n, g) { if (!p[i]) { p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []; p.GlobalSnowplowNamespace.push(i); p[i] = function () { (p[i].q = p[i].q || []).push(arguments); }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1; n.src = w; g.parentNode.insertBefore(n, g); } })(window, document, 'script', 'https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@4.10.3/dist/sp.js', 'snowplow');

     window.snowplow('newTracker', 'sp', 'https://collector.example.com', {
       appId: 'my-site',
       platform: 'web',
       contexts: { webPage: true },
       stateStorageStrategy: 'cookieAndLocalStorage',
     });
     window.snowplow('addPlugin',
       'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@4.10.3/dist/index.umd.min.js',
       ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']);
     window.snowplow('enableActivityTracking', { minimumVisitLength: 10, heartbeatDelay: 10 });
   </script>
   ```

   Replace `https://collector.example.com` with your Collector URL and `my-site` with your app ID. Activity tracking sends the page pings that engagement attributes need.

2. Save the adapter script from [Mapping code](#mapping-code) on your site and load it. It defines the functions the plugin uses to map each call.

   ```html
   <script src="/js/segment-snowplow-adapter.js"></script>
   ```

3. Register the destination plugin. Call `analytics.register` directly in the same page load as the Segment snippet, not inside `analytics.ready()`, or the plugin misses the first page view and its UTM parameters. Keep the snippet's own `analytics.page()` call.

   ```html
   <script>
     const snowplowDestination = {
       name: 'Snowplow (JavaScript tracker)', type: 'destination', version: '0.2.0',
       isLoaded: () => true, load: () => Promise.resolve(),
     };
     ['page', 'track', 'identify', 'group', 'alias', 'screen'].forEach((method) => {
       snowplowDestination[method] = async (ctx) => {
         const ev = ctx.event;
         const uid = userIdOut(ev.userId);
         const ident = externalIdentity(ev, uid);
         const context = ident ? [ident] : [];
         if (ev.type === 'identify' && uid) window.snowplow('setUserId', uid);
         if (ev.type === 'page') {
           window.snowplow('trackPageView', { title: (ev.context.page && ev.context.page.title) || ev.name, context });
           return ctx;
         }
         const l = ladder(ev, uid);
         if (l.plugin) {
           const [pluginMethod, arg] = l.plugin;
           window.snowplow(pluginMethod, Object.assign({}, arg, { context: (arg.context || []).concat(context) }));
         } else {
           window.snowplow('trackSelfDescribingEvent', { event: l.event, context: l.entities.concat(context) });
         }
         return ctx;
       };
     });

     analytics.register(snowplowDestination);
   </script>
   ```

4. Publish the page change.

If your Collector is on the same site as your pages, the browser also sends Segment's `ajs_*` cookies to it, and `ajs_user_id` can hold an email address. Use a Collector on a different site, or confirm this in your privacy review.

To react to interventions in the page, add the Signals browser plugin to the Snowplow tracker. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

## Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment and copy its Collector endpoint.
2. Point the tracker (or the function's `collectorUrl` setting) at it.
3. Send a few calls from a test page or Segment's debugger.
4. Select **Open dashboard** to see the good and failed events.

For a page view, a product view, an order and an `identify` call, you should see:

- A `page_view` for each `analytics.page` call, including the landing page with its UTM parameters.
- `snowplow_ecommerce_action` events of type `product_view` and `transaction`, with `product` and `transaction` entities.
- An `identify` event whose only field is `id`.
- An `external_identity` entity on every event, with `tool` set to `segment` and the original Segment event name in `event_name`.
- On the client-side approach, `page_ping` events and one `domain_sessionid` across the visit.
- No failed events. The Collector accepts events before they are validated, so a failed event shows here, not in Segment.

Once the events look right, point the tracker or the function at your pipeline's Collector, then create your [attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) and an [intervention](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#create-an-intervention).

## Other approaches

### Server-side: Destination Function

A Destination Function in your Segment workspace maps each event Segment receives and posts it to your Collector. It covers Segment's server and app libraries too. Segment's `anonymousId` becomes `domain_userid`, so read those attributes from your backend, not the public intervention endpoint. There are no sessions or page pings, and events arrive seconds later through Segment's queue. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).

If your Collector is behind a firewall, allow Segment's functions, which run in AWS us-west-2 and eu-west-1.

1. In your Segment workspace, create a new Destination Function.
2. Add two settings: `collectorUrl` (for example `https://collector.example.com`) and `appId`.
3. Paste the adapter script from [Mapping code](#mapping-code), followed by these handlers.

   ```js
   async function send(events, settings) {
     ADAPTER.aid = settings.appId || ADAPTER.aid;
     let res;
     try {
       res = await fetch(settings.collectorUrl.replace(/\/$/, '') + '/com.snowplowanalytics.snowplow/tp2', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json; charset=utf-8' },
         body: JSON.stringify(toPayload(events)),
       });
     } catch (e) {
       throw new RetryError('collector unreachable: ' + e.message);
     }
     if (res.status >= 500 || res.status === 429) throw new RetryError('collector ' + res.status);
     if (!res.ok) throw new ValidationError('collector rejected ' + res.status);
   }

   async function onTrack(event, settings) { await send([event], settings); }
   async function onPage(event, settings) { await send([event], settings); }
   async function onScreen(event, settings) { await send([event], settings); }
   async function onIdentify(event, settings) { await send([event], settings); }
   async function onGroup(event, settings) { await send([event], settings); }
   async function onAlias(event, settings) { await send([event], settings); }

   // One collector request per batch.
   async function onBatch(events, settings) { await send(events, settings); }
   ```

   `RetryError` tells Segment to retry later, and `ValidationError` tells it not to. Each event's `event_id` is derived from Segment's `messageId`, so a retried event counts once in Signals.

4. Connect the function to the sources you want in Snowplow, and enable it.

Segment bills function execution time beyond its free allotment.

### Warehouse history

Segment's warehouse destinations or Profiles Sync can fill a warehouse attribute group with history from before you connected. This needs a Signals warehouse connection.

## How Segment events map to Snowplow

Each Segment call takes the first rung of the [event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) ladder that fits. Both approaches use the same mapping.

| Segment call or event | Snowplow event | Notes |
|---|---|---|
| `page` | `page_view` | Title from the page context, or the page name |
| `screen` | `page_view` | Server-side only |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product` | |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `identify` | `identify` | The user ID only. Traits, including email, are dropped |
| `group` | `external_event` | `group_id` from `groupId`, `plan` from the group traits |
| `alias` | `external_event` | `previous_id` from `previousId` (server-side only) |
| Any other `track` call, or an ecommerce event missing a required field | `external_event` | `name` is the Segment event name. Typed fields such as `value`, `currency`, `item_id` and `plan` are filled from matching properties |

Segment properties that don't match a typed field stay in Segment.

## Identifiers

| Segment field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow cookie ID (client-side) | `domain_userid` | Yes. Random, and safe on the public intervention endpoint |
| Snowplow session ID (client-side) | `domain_sessionid` | Yes, for session attributes |
| `anonymousId` | Server-side: `domain_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend only. Never on the public intervention endpoint |
| `userId` | `user_id`, `external_identity.user_id` and `identify.id`, unchanged. If it's an email address, the email reaches Snowplow | Backend reads only. Never on the public intervention endpoint |
| `groupId` | `external_event.group_id` | Backend reads only, for account attributes |
| `messageId` | `event_id` (server-side) | No |

See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) for keying attributes across a visitor's browser and logged-in events.

## Troubleshooting

- **No first page view or UTM parameters:** the plugin was registered inside `analytics.ready()`. Call `analytics.register` directly.
- **Ecommerce events arrive as `external_event`:** the event name isn't a Segment spec name, or it lacks a price, currency or order ID. Rename it, or add the missing field.
- **Events arrive twice:** both approaches receive your browser source. Connect the Destination Function only to server and app sources.
- **No events when analytics.js is blocked:** the plugin runs inside analytics.js, so an ad blocker or consent tool that stops it stops the plugin too.
- **A property is missing from attributes:** Signals only reads fields a schema declares. Map it to a typed `external_event` field. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).

Where to go next:

- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Copy the definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- When you are ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approach the visitor ID stays the same, so attributes carry over.
- Field reference: [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Mapping code

Both approaches use this adapter script. For the client-side approach, save it on your site as `/js/segment-snowplow-adapter.js` and load it before the plugin. For the server-side approach, paste it at the top of the Destination Function, above the handlers. If your event names differ from Segment's spec names, change the matching `name ===` checks in `standardEvent`.

<details>
<summary>segment-snowplow-adapter.js</summary>

```js
// Segment spec event -> Snowplow tracker protocol (payload_data 1-0-4 item).
// Dependency-free on purpose: the same source runs in the browser and in a Segment Destination Function,
// which has no require.

var ADAPTER = {
  tool: 'segment',
  tv: 'segment-adapter-1.0',
  aid: 'segment-adapter',
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

// Sent as Segment holds it; user_id is 255 chars in atomic.events.
function userIdOut(id) {
  if (id === undefined || id === null || id === '') return undefined;
  return String(id).slice(0, 255);
}

function epochMs(ts) {
  if (ts === undefined || ts === null || ts === '') return undefined;
  // In the browser analytics-next holds timestamp as a Date; Date.parse(String(date)) would drop the milliseconds.
  var n = typeof ts === 'number' ? ts : ts instanceof Date ? ts.getTime() : Date.parse(ts);
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

var IGLU = {
  action: 'iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2',
  product: 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0',
  transaction: 'iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0',
  cart: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
  refund: 'iglu:com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0',
  checkout: 'iglu:com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0',
  siteSearch: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0',
  identify: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0',
  external: 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0',
  identity: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0',
};

// The ecommerce schemas declare money as multipleOf 0.01.
function money(v) {
  var n = num(v);
  return n === undefined || n < 0 ? undefined : Math.round(n * 100) / 100;
}

function int(v) {
  var n = num(v);
  return n === undefined || n < 0 ? undefined : Math.round(n);
}

function currencyOf(v) {
  return typeof v === 'string' && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : undefined;
}

function compact(o) {
  var out = {};
  for (var k in o) if (o[k] !== undefined && o[k] !== null && o[k] !== '') out[k] = o[k];
  return out;
}

// Segment v2 ecommerce product -> Snowplow product entity. The schema requires category, price and currency,
// which Segment leaves optional: category falls back to "" and a product without a price or currency is skipped.
function spProduct(p, currency) {
  var id = str255(pick(p.product_id, p.sku, p.id));
  var price = money(p.price);
  var cur = currencyOf(p.currency) || currency;
  if (id === undefined || price === undefined || !cur) return undefined;
  var out = compact({
    id: id, name: str255(p.name), price: price, currency: cur,
    quantity: int(p.quantity), variant: str255(p.variant), brand: str255(p.brand),
    position: int(p.position), list_price: money(p.list_price),
  });
  out.category = str255(p.category) || '';
  return out;
}

function spProducts(p, currency) {
  var list = Array.isArray(p.products) ? p.products : [];
  var out = [];
  for (var i = 0; i < list.length; i++) { var sp = spProduct(list[i] || {}, currency); if (sp) out.push(sp); }
  return out;
}

// Rungs 2 and 3 of the ladder. Returns the Iglu Central event plus entities, in the order the Snowplow
// ecommerce plugin sends them, and the plugin call that produces the same thing in the browser.
// Returns undefined when a required field is missing, so the event falls through to external_event.
function standardEvent(ev) {
  if (String(ev.type).toLowerCase() !== 'track') return undefined;
  var p = ev.properties || {};
  var cur = currencyOf(p.currency);
  var name = String(ev.event || '');
  var products, ents, total;
  function product(of) { return of.map(function (d) { return { schema: IGLU.product, data: d }; }); }
  function action(type) { return { schema: IGLU.action, data: { type: type } }; }

  if (name === 'Products Searched') {
    var q = str255(p.query);
    if (!q) return undefined;
    return { event: { schema: IGLU.siteSearch, data: { terms: [q] } }, entities: [], plugin: ['trackSiteSearch', { terms: [q] }] };
  }
  if (name === 'Product Viewed') {
    var one = spProduct(p, cur);
    if (!one) return undefined;
    return { event: action('product_view'), entities: product([one]), plugin: ['trackProductView', one] };
  }
  if (name === 'Product Added' || name === 'Product Removed') {
    var line = spProduct(p, cur);
    if (!line) return undefined;
    var type = name === 'Product Added' ? 'add_to_cart' : 'remove_from_cart';
    // Segment sends no cart total; without one the cart entity (total_value required) is left off.
    total = money(pick(p.cart_total, p.total, p.value));
    ents = product([line]);
    var cart = total === undefined ? undefined : compact({ cart_id: str255(p.cart_id), total_value: total, currency: line.currency });
    if (cart) ents.push({ schema: IGLU.cart, data: cart });
    return { event: action(type), entities: ents,
      plugin: cart ? [type === 'add_to_cart' ? 'trackAddToCart' : 'trackRemoveFromCart', Object.assign({ products: [line] }, cart)] : undefined };
  }
  if (name === 'Checkout Started' || name === 'Checkout Step Viewed' || name === 'Checkout Step Completed') {
    var step = int(p.step);
    var cs = compact({ step: step >= 1 && step <= 90 ? step : 1, delivery_method: str255(p.shipping_method), payment_method: str255(p.payment_method), coupon_code: str255(p.coupon) });
    products = spProducts(p, cur);
    ents = product(products).concat([{ schema: IGLU.checkout, data: cs }]);
    return { event: action('checkout_step'), entities: ents, plugin: ['trackCheckoutStep', Object.assign({ context: product(products) }, cs)] };
  }
  if (name === 'Order Completed') {
    total = money(pick(p.revenue, p.total, p.value));
    var id = str255(pick(p.order_id, p.checkout_id));
    if (!cur || total === undefined || !id) return undefined;
    products = spProducts(p, cur);
    var qty = 0;
    products.forEach(function (x) { qty += x.quantity || 1; });
    // payment_method is required by the schema and absent from Segment's Order Completed.
    var trx = compact({ transaction_id: id, revenue: total, currency: cur, payment_method: str255(p.payment_method) || 'unknown',
      total_quantity: qty, tax: money(p.tax), shipping: money(p.shipping), discount_code: str255(p.coupon), discount_amount: money(p.discount) });
    return { event: action('transaction'), entities: product(products).concat([{ schema: IGLU.transaction, data: trx }]),
      plugin: ['trackTransaction', Object.assign({ products: products }, trx)] };
  }
  if (name === 'Order Refunded') {
    total = money(pick(p.total, p.revenue, p.value));
    if (!cur || total === undefined || !p.order_id) return undefined;
    products = spProducts(p, cur);
    var rf = { transaction_id: str255(p.order_id), currency: cur, refund_amount: total };
    return { event: action('refund'), entities: product(products).concat([{ schema: IGLU.refund, data: rf }]),
      plugin: ['trackRefund', Object.assign({ products: products }, rf)] };
  }
  return undefined;
}

// Rung 5: what is left (custom track events, group, alias, and ecommerce events missing required fields).
function externalEvent(ev) {
  var p = ev.properties || {};
  var type = String(ev.type || '').toLowerCase();
  var first = Array.isArray(p.products) && p.products.length ? p.products[0] || {} : {};
  var data = compact({
    name: type === 'track' ? String(pick(ev.event, 'track')).slice(0, 255) : type,
    tool: ADAPTER.tool,
    kind: type,
    value: num(pick(p.revenue, p.value, p.total, p.price)),
    currency: currencyOf(p.currency),
    // external_event has one item slot, so a multi-product event outside the ecommerce rung keeps only the first.
    item_id: str255(pick(p.product_id, p.sku, first.product_id)),
    item_category: str255(pick(p.category, first.category)),
    search_term: str255(p.query),
    plan: str255(pick(p.plan, type === 'group' && ev.traits ? ev.traits.plan : undefined)),
    group_id: type === 'group' ? str255(ev.groupId) : undefined,
    previous_id: type === 'alias' ? str255(ev.previousId) : undefined,
  });
  return { schema: IGLU.external, data: data };
}

// Every event gets the entity. A server-side call with only a userId has a null anonymous_id.
function externalIdentity(ev, uid) {
  var anon = ev.anonymousId === undefined || ev.anonymousId === null || ev.anonymousId === '' ? null : String(ev.anonymousId).slice(0, 255);
  var type = String(ev.type || '').toLowerCase();
  return { schema: IGLU.identity, data: {
    tool: ADAPTER.tool, anonymous_id: anon, user_id: uid || null,
    session_id: null, session_number: null,
    event_id: ev.messageId ? String(ev.messageId).slice(0, 255) : null,
    event_name: (type === 'track' ? String(pick(ev.event, 'track')) : type).slice(0, 255),
  } };
}

// One Segment call -> { event, entities } on the ladder, page views excepted (they stay native).
function ladder(ev, uid) {
  var type = String(ev.type || '').toLowerCase();
  if (type === 'identify') return { rung: 'identify', event: { schema: IGLU.identify, data: compact({ id: uid }) }, entities: [] };
  var std = standardEvent(ev);
  if (std) return { rung: std.event.schema === IGLU.siteSearch ? 'site_search' : 'ecommerce', event: std.event, entities: std.entities, plugin: std.plugin };
  return { rung: 'external_event', event: externalEvent(ev), entities: [] };
}

function toTrackerEvent(ev) {
  var ctx = ev.context || {};
  var page = ctx.page || {};
  var type = String(ev.type || '').toLowerCase();
  // Server-side Segment calls often carry only userId; falling back to it would copy an email into domain_userid.
  var anon = pick(ev.anonymousId);
  var uid = userIdOut(ev.userId);
  var out = {
    p: 'web',
    tv: ADAPTER.tv,
    aid: ADAPTER.aid,
    eid: uuidv5(pick(ev.messageId, JSON.stringify(ev)), ADAPTER.ns),
    // In the browser (before Segment's API) only the client "timestamp" exists; the API renames it
    // originalTimestamp and rewrites timestamp with the clock-skew correction.
    dtm: epochMs(pick(ev.originalTimestamp, ev.timestamp)),
    stm: epochMs(ev.sentAt),
    ttm: ev.originalTimestamp ? epochMs(ev.timestamp) : undefined,
    ip: pick(ctx.ip, ev.request_ip),
    ua: ctx.userAgent,
    tnuid: fitId(anon),
    duid: fitId(anon),
    uid: uid,
    url: page.url,
    // Some SDKs send "$direct" when there is no referrer; Snowplow would parse it as a URL.
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
    var l = ladder(ev, uid);
    entities = l.entities;
    out.e = 'ue';
    out.ue_pr = JSON.stringify({ schema: 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0', data: l.event });
  }
  var ident = externalIdentity(ev, uid);
  if (ident) entities = entities.concat([ident]);
  if (entities.length) out.co = JSON.stringify({ schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1', data: entities });

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toTrackerEvent: toTrackerEvent, ladder: ladder, externalIdentity: externalIdentity, userIdOut: userIdOut, IGLU: IGLU, toPayload: toPayload, uuidv5: uuidv5, sha256Hex: function (s) { return hex(sha256(utf8Bytes(s))); }, ADAPTER: ADAPTER };
}
```

</details>
