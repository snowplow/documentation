---
title: "Use Signals with Segment"
sidebar_label: "Segment"
sidebar_position: 10
description: "Send the events you already track with Segment to Snowplow, from the browser or from your Segment workspace, and build Signals attributes on them without retagging."
keywords: ["segment", "analytics.js", "destination plugin", "destination function", "external_event", "signals"]
date: "2026-11-13"
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

2. Load the Segment adapter script. It defines `ladder`, `userIdOut` and `externalIdentity`, which the plugin uses to map each call.

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
         // An email-like userId is hashed with SHA-256 before it leaves the page.
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
If your Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends Segment's `ajs_anonymous_id`, `ajs_user_id` and `ajs_group_id` cookies with every request to it. `ajs_user_id` can hold an email address if that is what you pass to `identify`, in clear, even though the events themselves carry only its hash. Use a Collector on a different site, or confirm this is acceptable in your privacy review.
:::

## Set up the server-side approach

The server-side approach runs in your Segment workspace. A Destination Function receives each event, maps it, and posts it to your Collector in Snowplow's tracker protocol. Segment retries failed deliveries, so the function has no state to manage.

1. In your Segment workspace, create a new Destination Function.

2. Add two settings to the function: `collectorUrl` (for example `https://collector.example.com`) and `appId`.

3. Paste the function source. It is the Segment adapter script followed by these handlers. The adapter keeps its settings in `ADAPTER`.

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
| `anonymousId` | Server-side: `domain_userid` and `network_userid`. Both: `external_identity.anonymous_id` | Server-side key, for reads from your backend. Not recommended on the public intervention endpoint; see the caution below |
| Snowplow cookie ID (client-side only) | `domain_userid` | Yes. A random ID set by the Snowplow tracker, safe on the public intervention endpoint |
| Snowplow session ID (client-side only) | `domain_sessionid` | Yes, for session attributes |
| `userId` | `user_id`, `external_identity.user_id` and `identify.id`. Hashed with SHA-256 when it contains `@` | Server-side reads only. Never on the public intervention endpoint, because it can be guessed |
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
4. **The user ID is sent in clear unless it contains `@`.** A user ID with `@` is hashed with SHA-256, unsalted, which is still personal data.
5. **`alias` loses the previous ID.** The call reaches the plugin without `previousId`, so `external_event.previous_id` is empty.
6. **Two visitor IDs.** Snowplow's `domain_userid` differs from Segment's `anonymousId`. They are linked through the `external_identity` entity, but attributes keyed on one don't read by the other.
7. **Two extra scripts.** The page loads the Snowplow tracker and its ecommerce plugin.

### Server-side approach

1. **No sessions or engagement.** Segment has no session ID, so `domain_sessionid` is empty and there are no page pings.
2. **Delivery depends on Segment's queue.** Events arrive after Segment processes them. Don't rely on the server-side approach for reactions within a page view.
3. **Function timeouts can duplicate events.** Segment stops a function after 5 seconds and retries it. If the Collector accepted the event but answered late, the event arrives twice with the same `event_id`. Signals counts it once, but both copies reach your pipeline.
4. **Personal data reaches Snowplow.** IP address, user agent, page URL, referrer, title, the user ID (hashed when it contains `@`) and free-text search terms.
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
