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

You can send Segment events to Snowplow in two ways, and add a third for history later.

- **Client-side:** a destination plugin in analytics.js copies each Segment call into the Snowplow JavaScript tracker, which runs on the same page.
- **Server-side:** a Destination Function in your Segment workspace converts each event Segment receives and posts it to your Snowplow Collector.
- **Warehouse:** Segment's warehouse destinations or Profiles Sync give you history for batch attributes.

| | Client-side: destination plugin | Server-side: Destination Function | Warehouse: Segment warehouse or Profiles Sync |
|---|---|---|---|
| What you change | A few lines in the page where analytics.js loads, plus the Snowplow tracker script | A function in your Segment workspace, connected to your sources. No page change | A warehouse connection in Signals |
| Events covered | Browser calls made through analytics.js | Every event your connected Segment sources send: browser, server and app libraries | Whatever Segment has loaded into your warehouse |
| Visitor key | Snowplow's own random cookie ID (`domain_userid`) | Segment's `anonymousId`, copied into `domain_userid` | Depends on the tables you read |
| Sessions and engagement | Yes: Snowplow sessions, page pings, scroll depth | No. Segment has no session ID | No |
| Delivery | Straight from the browser to your Collector | Through Segment's queue, then to your Collector. With batching on, batches can wait up to 10 seconds | Batch, on your warehouse load schedule |
| Personal data path | Browser to Collector: IP address, user agent, page URLs, the user ID, and Segment's own cookies if the Collector is on the same site | Segment's cloud to Collector: IP address, user agent, page URLs, referrer, title, the user ID and search terms. Traits stay in Segment | Stays in your warehouse |
| Plan or license needed | No Segment plan requirement known. Snowplow pipeline with Signals | Segment Functions, which Segment documents as available on all plans with a free allotment of usage hours, billed beyond that. Snowplow pipeline with Signals | A Segment warehouse destination or Profiles Sync. A Signals warehouse connection |

Choose client-side if:

- You want session or engagement attributes, such as pages per session or seconds engaged.
- You want the quickest reaction to what a visitor does, for interventions in the page.
- You plan to move to native Snowplow tracking later, because the visitor ID stays the same when you do.

Choose server-side if:

- You need events from Segment's server or app libraries, not only the browser.
- You can't change the page, or you want the setup to live in your Segment workspace.
- Visitor and account attributes are enough, and a delay of seconds is acceptable.

You can run both. If you do, connect the Destination Function only to your server and app sources, so browser events don't arrive twice under two visitor keys. Giving each approach its own app ID makes the split easy to check.

## Before you begin

You need:

- Segment's analytics.js 2.0 (analytics-next) on your site for the client-side approach. These steps use analytics-next 1.84.3 and snippet 5.2.1.
- Permission to create Functions in your Segment workspace for the server-side approach. Segment's docs set a default limit of 25 functions per workspace.
- A Snowplow Collector URL. For the server-side approach, the Collector must accept requests from Segment's functions, which Segment runs in AWS us-west-2 and eu-west-1. Allow-list them if your Collector is behind a firewall.
- Snowplow Signals enabled on your pipeline.
- The `external_event` and `external_identity` schemas, published on Iglu Central, alongside the ecommerce, `site_search` and `identify` schemas the adapter also uses. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md). If you register your own copies, for example under your own vendor, deploy them to production before you send any events.
- The Segment adapter script, which maps each Segment call to a Snowplow event. It sends the two schemas under the `com.snowplowanalytics.snowplow` vendor. If you register your own copies under another vendor, change the vendor in the `external` and `identity` entries of the adapter's `IGLU` object to match. An event that uses a schema your pipeline can't resolve still gets a 200 response from the Collector, then fails validation, so nothing reaches Signals and no error shows in the page or in Segment. Check failed events after your first test.

Check your Segment ecommerce events use Segment's v2 spec names (`Product Viewed`, `Order Completed` and so on) with a price and a currency. Events with other names, or without a currency, become generic `external_event` events instead of Snowplow ecommerce events. See [How Segment events map to Snowplow](#how-segment-events-map-to-snowplow).

## Set up the client-side approach

The client-side approach loads the Snowplow JavaScript tracker and its ecommerce plugin next to analytics.js, then registers a Segment destination plugin. The plugin receives every call after Segment has processed it and replays it into the Snowplow tracker.

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

2. Load the Segment adapter script from [Mapping code](#mapping-code). It defines `ladder`, `userIdOut` and `externalIdentity`, which the plugin uses to map each call.

   ```html
   <script src="/js/segment-snowplow-adapter.js"></script>
   ```

3. Register the destination plugin in the same page load as the Segment snippet. Call `analytics.register` directly, not inside `analytics.ready()`. The snippet holds the registration until analytics.js loads, so the plugin receives the snippet's own `analytics.page()` call. A plugin registered inside `analytics.ready()` misses that first page view, and with it the landing page's UTM parameters and referrer.

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

   Ecommerce calls go through the Snowplow ecommerce plugin's own methods, such as `trackProductView` and `trackTransaction`. Everything else is sent with `trackSelfDescribingEvent`.

   Keep the `analytics.page()` call in the Segment snippet. It records the landing page view.

4. Publish the page change.

:::caution[Segment cookies and a same-site Collector]
If your Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends Segment's `ajs_anonymous_id`, `ajs_user_id` and `ajs_group_id` cookies with every request to it. `ajs_user_id` can hold an email address if that is what you pass to `identify`. Use a Collector on a different site, or confirm this is acceptable in your privacy review.
:::

## Set up the server-side approach

The server-side approach runs in your Segment workspace. A Destination Function receives each event, maps it, and posts it to your Collector in Snowplow's tracker protocol. Segment retries failed deliveries, so the function has no state to manage.

1. In your Segment workspace, create a new Destination Function.

2. Add two settings to the function: `collectorUrl` (for example `https://collector.example.com`) and `appId`.

3. Paste the function source. It is the Segment adapter script from [Mapping code](#mapping-code), followed by these handlers. The adapter keeps its settings in `ADAPTER`.

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

   `RetryError` tells Segment to try again later. Segment's docs say it retries for up to four hours. `ValidationError` tells Segment not to retry.

4. Connect the function to the sources whose events you want in Snowplow, such as your website source and any server sources.

5. Enable the destination.

Each event gets a Snowplow `event_id` derived from Segment's `messageId` (a UUID version 5), so a retried event keeps the same ID and Signals counts it once.

:::caution
`onBatch` sends the whole batch in one request. Segment's docs say batches can hold 20 events and wait up to 10 seconds to fill, so batching adds delay. Leave it off if you want each event delivered as soon as Segment hands it over.
:::

## Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one: it runs Snowplow Micro, hosted by Snowplow. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines** and select your development environment.
2. Copy its Collector endpoint.
3. Point the tracker (client-side) or the function's `collectorUrl` setting (server-side) at it.
4. Send a few calls from a test page or Segment's debugger.
5. Select **Open dashboard** to see the good and failed events.

Development environments use your development data structures, so you can also test your own copies of `external_event` and `external_identity` there before you deploy them to production.

For a page view, a product view, an order with two products and an `identify` call, you should see:

- A native `page_view` for each `analytics.page` call, including the snippet's first one with the landing page URL and its UTM parameters.
- A `snowplow_ecommerce_action` event of type `product_view` with one `product` entity.
- A `snowplow_ecommerce_action` event of type `transaction` with one `product` entity per product and a `transaction` entity.
- An `identify` event whose only field is `id`. The email and other traits are not there.
- An `external_identity` entity on every event that has a Segment `anonymousId`, with `tool` set to `segment` and the original Segment event name in `event_name`.
- With the client-side approach, `page_ping` events and the same `domain_sessionid` on every event in the visit.
- No failed events.

Once the events look right, point the tracker or the function at your pipeline's Collector, and read the attributes in Signals.

Check failed events in your pipeline as well as Segment's delivery overview. The Collector accepts events before they are validated, so Segment counts an event as delivered even when it later fails validation.

## How Segment events map to Snowplow

Each Segment call takes the first rung of the [event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) ladder that fits. Both approaches use the same mapping.

| Segment call or event | Snowplow event | Notes |
|---|---|---|
| `page` | `page_view` | Title from the page context, or the page name |
| `screen` | `page_view` | Server-side only. URL is `screen://<name>` when there is no page URL |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product`, and `cart` when there is a cart total | Segment sends no cart total by default, so the `cart` entity is usually left off |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency. `payment_method` is set to `unknown` when absent |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `identify` | `identify` | The user ID only. Traits, including email, are dropped |
| `group` | `external_event` | `group_id` from `groupId`, `plan` from the group traits |
| `alias` | `external_event` | `previous_id` from `previousId` (server-side only) |
| Any other `track` call | `external_event` | `name` is the Segment event name. Typed fields such as `value`, `currency`, `item_id` and `plan` are filled from matching properties |
| An ecommerce event missing a required field | `external_event` | For example an `Order Completed` with no currency |

A product with no category gets an empty category. A product with no price or currency is left off the event. Segment properties that don't match a typed field stay in Segment.

## Identifiers

| Segment field | Snowplow field | Use as a Signals key? |
|---|---|---|
| `anonymousId` | Server-side: `domain_userid` and `network_userid`, replaced by its SHA-256 hash when longer than 128 characters. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend. Not recommended on the public intervention endpoint; see the caution below |
| Snowplow cookie ID (client-side only) | `domain_userid` | Yes. A random ID set by the Snowplow tracker, safe on the public intervention endpoint |
| Snowplow session ID (client-side only) | `domain_sessionid` | Yes, for session attributes |
| `userId` | `user_id`, `external_identity.user_id` and `identify.id`, unchanged, up to 255 characters. If it's an email address, the email reaches Snowplow | Server-side reads only. Never on the public intervention endpoint, because it can be guessed |
| `groupId` | `external_event.group_id` | Server-side reads only, for account attributes |
| `previousId` | `external_event.previous_id` | No. Recorded only |
| `messageId` | `event_id` (server-side, as a UUID version 5) | No. Used to spot duplicates |
| Event name | `external_identity.event_name` on every event | No. Lets an attribute filter on the original Segment name |
| `context.ip`, `context.userAgent` | `user_ipaddress`, `useragent` | No |

:::caution[anonymousId on the public intervention endpoint]
analytics-next 1.84.3 builds `anonymousId` and each event's `messageId` from the same random pool, and neighboring IDs share most of their bytes. Anyone who can see raw Segment `messageId`s, such as another Segment destination, could nearly rebuild a visitor's `anonymousId`. Server libraries and `setAnonymousId()` also accept any string. So don't use `anonymousId` as the key on the public intervention endpoint. For interventions, use the client-side approach, which keys on Snowplow's own random cookie ID.
:::

The key each approach uses:

- Server-side approach: Segment's `anonymousId`, which your page can read with `analytics.user().anonymousId()` and pass to your backend.
- Client-side approach: the Snowplow tracker's `domain_userid`.

Server events that carry only a `userId` have an empty `domain_userid`, a new `network_userid` on every event, and no `external_identity` entity, because that entity needs an anonymous ID. Read them by `user_id` from your servers.

If your pipeline runs Snowplow Identities, stream attribute groups can be keyed on `snowplow_id`, so a visitor's browser events and their logged-in server events count towards the same attributes. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Starter attribute groups

The [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) work on Segment data with these notes:

- **Visitor activity, purchase intent, funnel:** both approaches. To count your own events, filter `external_event` on `name`, for example `Signup Form Submitted`. To count any event by its Segment name, including ones mapped to ecommerce, filter on `external_identity.event_name`.
- **Account and plan:** both approaches. `plan` comes from `track` properties or `group` traits. A plan set only in `identify` traits is dropped.
- **Session engagement:** client-side only. The server-side approach has no sessions and no page pings.

## Limits

### Client-side approach

1. **Browser calls only.** Calls from Segment's server and app libraries don't pass through analytics.js.
2. **Blocked with analytics.js.** If an ad blocker or consent tool stops analytics.js from loading, the plugin doesn't run either.
3. **Segment cookies can reach a same-site Collector.** See the caution under the setup steps.
4. **`alias` loses the previous ID.** The call reaches the plugin without `previousId`, so `external_event.previous_id` is empty.
5. **Two visitor IDs.** Snowplow's `domain_userid` differs from Segment's `anonymousId`. They are linked through the `external_identity` entity, but attributes keyed on one don't read by the other.
6. **Two extra scripts.** The page loads the Snowplow tracker and its ecommerce plugin.

### Server-side approach

1. **No sessions or engagement.** Segment has no session ID, so `domain_sessionid` is empty and there are no page pings.
2. **Delivery depends on Segment's queue.** Events arrive after Segment processes them, and with batching on, batches can wait up to 10 seconds. Signals' own processing comes on top. Don't rely on the server-side approach for reactions within a page view. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).
3. **Function timeouts can duplicate events.** Segment stops a function after 5 seconds and retries it. If the Collector accepted the event but answered late, the event arrives twice with the same `event_id`. Signals counts it once, but both copies reach your pipeline.
4. **Personal data reaches Snowplow.** IP address, user agent, page URL, referrer, title, the user ID and free-text search terms.
5. **Server events without context.** Events that don't set `context.ip` or `context.userAgent` record the sender's IP address and the function runtime's user agent. Every event is recorded with platform `web`.
6. **Usage is billed.** Function execution time beyond Segment's free allotment is billed by Segment.

### Both approaches

1. **Attributes only on declared fields.** Signals builds attributes only on properties a schema declares. Outside the ecommerce events, only `external_event`'s typed fields are kept. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).
2. **First product only outside the ecommerce rung.** `external_event` has one `item_id`, so a multi-product event that isn't a Segment ecommerce event keeps only its first product.
3. **No user traits.** `identify` carries the user ID only.

### Warehouse approach

Batch attributes need a Signals warehouse connection, and a Signals deployment reads one warehouse.

Where to go next:

- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Copy the definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- When you are ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approach the visitor ID stays the same, so attributes carry over.
- Field reference: [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Mapping code

Both approaches use this adapter script. For the client-side approach, save it on your site as `/js/segment-snowplow-adapter.js` and load it before the plugin. For the server-side approach, paste it at the top of the Destination Function, above the handlers.

- `standardEvent` matches Segment's spec event names, such as `Product Viewed`, `Order Completed` and `Products Searched`. If your names differ, change the matching `name ===` checks.
- To use your own copies of `external_event` and `external_identity`, change the vendor in the `IGLU` entries `external` and `identity`.
- On the client-side approach, the tracker sets the app ID. On the server-side approach, the function's `appId` setting overrides `ADAPTER.aid`.

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
