---
title: "Use Signals with Google Analytics 4 and Google Tag Manager"
sidebar_label: "Google Analytics 4 and Google Tag Manager"
sidebar_position: 30
description: "Send the events your site already sends to Google Analytics 4 into Snowplow, through Google Tag Manager, a page script or server-side Google Tag Manager, and build Signals attributes on them."
keywords: ["ga4", "google analytics 4", "google tag manager", "server-side gtm", "external_event", "signals"]
date: "2026-11-16"
content_type: how-to
---

Use the events your site already sends to Google Analytics 4 (GA4) in Signals, by adding Snowplow tags next to your GA4 tags in Google Tag Manager (GTM).

## Choose an approach

Most sites should use **GTM tag templates**. You add Snowplow tags to the web GTM container that already sends your GA4 events, with no page code to change. The Snowplow tracker runs in the browser, so you get Snowplow sessions, page pings and interventions in the page.

| Approach | Use it when |
|---|---|
| [GTM tag templates](#set-up-gtm-tag-templates) (recommended) | Your GA4 tags run in a web GTM container |
| [Page script](#page-script) | You call `gtag()` directly and don't use GTM |
| [Server-side GTM](#server-side-gtm) | You already run server-side GTM and can't change the web container or the page. No sessions or in-page interventions, and values arrive a couple of minutes later |
| [BigQuery export](#warehouse-history-bigquery-export) | You want history from before you connected Snowplow. Needs a Signals warehouse connection |

You can combine them, for example GTM tag templates for live attributes plus the BigQuery export for history.

## Before you begin

You need:

- GA4 on your site, through GTM
- a Snowplow Collector URL for a pipeline with Signals enabled

The `external_event` and `external_identity` schemas, and every other schema on this page, are published on Iglu Central. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Set up GTM tag templates

The Snowplow tags fire on the same data layer pushes as your GA4 tags. For the templates themselves, see [Snowplow Google Tag Manager templates](/docs/sources/google-tag-manager/index.md).

1. **Add the templates.** In GTM, go to **Templates**. Under **Tag Templates**, select **Search Gallery** and add **Snowplow v4** and **Snowplow Ecommerce**, both by snowplow. Under **Variable Templates**, select its own **Search Gallery** and add **Snowplow v4 Settings** by snowplow.

2. **Create the settings variable.** Go to **Variables**, then under **User-Defined Variables** select **New** and choose **Snowplow v4 Settings**. Then:

   - Set **Collector Endpoint Hostname** to your Collector as a full URL starting with `https://`.
   - Under **JavaScript Tracker**, set **Snowplow JavaScript Tracker Library** to **jsDelivr** and **Library version** to `4.10.3`.
   - Set **Application ID** to your app ID.
   - Under **Predefined Contexts**, keep **webPage** and select **session**.

   Select this variable on every Snowplow tag you create below: **Snowplow Settings** on a **Snowplow v4** tag, **Tracker Settings** on a **Snowplow Ecommerce** tag.

3. **Create the identity variable.** This Custom JavaScript variable reads the GA client ID and session from the `_ga` cookies and builds the `external_identity` entity, so you can join Snowplow data back to GA4. Name it `CJS - external_identity`. Replace the measurement ID with yours, and create a Data Layer Variable `DLV - user_id` for the `user_id` key your site pushes.

   ```js
   function () {
     var MEASUREMENT_ID = 'G-XXXXXXXXXX';
     var jar = {};
     document.cookie.split(/;\s*/).forEach(function (c) {
       var i = c.indexOf('=');
       if (i > 0) jar[c.slice(0, i)] = c.slice(i + 1);
     });
     var parts = jar._ga ? jar._ga.split('.') : [];
     var data = { tool: 'ga4', anonymous_id: parts.length >= 4 ? parts.slice(-2).join('.') : null };
     var s = jar['_ga_' + MEASUREMENT_ID.replace(/^G-/, '')];
     var m = s && (/^GS2\.\d+\.s(\d+)\$o(\d+)/.exec(s) || /^GS1\.\d+\.(\d+)\.(\d+)/.exec(s));
     if (m) { data.session_id = m[1]; data.session_number = Number(m[2]); }
     if ({{DLV - user_id}}) data.user_id = String({{DLV - user_id}});
     if ({{Event}} && {{Event}}.indexOf('gtm.') !== 0) data.event_name = {{Event}};
     return [{ schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', data: data }];
   }
   ```

   On every Snowplow tag you create below, open **Additional Tracking Parameters**, then **Add Custom Context Entities**, and add `{{CJS - external_identity}}` in the **Context Entities** column.

4. **Add page views.** Create a **Snowplow v4** tag with **Tag Type** set to **Page View**, fired on a **Window Loaded** trigger. Use **Window Loaded**, not **All Pages**, so the `_ga` cookie is set before the first page view. Under **Page View Configuration**, set **Enable Page Activity Tracking** to **Yes**, with **Minimum Visit Length** and **Heartbeat Interval** set to `5` seconds, to send page pings.

   If your site changes pages with `history.pushState`, create a second page view tag with the same settings, fired on a **History Change** trigger. Load the Signals plugin from the Window Loaded tag only (step 10).

5. **Add site search.** Create a **Snowplow v4** tag with **Tag Type** set to **Site Search**. Add a **terms (required)** parameter set to a variable holding the search term, and fire it on your GA4 `search` or `view_search_results` event.

6. **Add ecommerce.** Create a Data Layer Variable `DLV - ecommerce` (Data Layer Version 2) for the `ecommerce` key. Then create a Custom JavaScript variable named `CJS - snowplow_ecommerce_arg` with the code below. It turns the GA4 `ecommerce` object into the argument the Snowplow Ecommerce tag expects, with every item in the order as a product.

   <details>
   <summary>CJS - snowplow_ecommerce_arg</summary>

   ```js
   function () {
     var ev = {{Event}}, p = {{DLV - ecommerce}} || {};
     function num(v) { var n = typeof v === 'string' && v !== '' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : undefined; }
     function money(v) { var n = num(v); return n === undefined ? undefined : Math.round(n * 100) / 100; }
     function clean(o) { for (var k in o) if (o[k] === undefined || o[k] === '') delete o[k]; return o; }
     var cur = /^[A-Z]{3}$/.test(String(p.currency || '').toUpperCase()) ? String(p.currency).toUpperCase() : undefined;
     var products = (p.items || []).map(function (it) {
       var cat = [it.item_category, it.item_category2, it.item_category3, it.item_category4, it.item_category5].filter(Boolean).join('/');
       return clean({
         id: String(it.item_id), name: it.item_name, category: cat || 'unknown',
         price: money((num(it.price) || 0) - (num(it.discount) || 0)), list_price: money(it.price),
         quantity: num(it.quantity), brand: it.item_brand, variant: it.item_variant, currency: cur
       });
     });
     switch (ev) {
       case 'view_item': return products[0];
       case 'add_to_cart':
       case 'remove_from_cart': return { products: products, total_value: money(p.value) || 0, currency: cur };
       case 'begin_checkout': return { step: 1 };
       case 'purchase': return clean({
         transaction_id: String(p.transaction_id), revenue: money(p.value), currency: cur,
         payment_method: p.payment_type || 'unknown', tax: money(p.tax), shipping: money(p.shipping),
         discount_code: p.coupon, products: products
       });
       case 'refund': return clean({ transaction_id: String(p.transaction_id), currency: cur, refund_amount: money(p.value), products: products });
     }
   }
   ```

   </details>

   Then create one **Snowplow Ecommerce** tag per GA4 ecommerce event you send. In each, set **Ecommerce API** to **Snowplow Ecommerce**, **Ecommerce Function** to the matching function, and **Ecommerce Argument** to `{{CJS - snowplow_ecommerce_arg}}`. Under **Plugin Settings**, set **Snowplow Ecommerce Plugin Library** to **Do not add**, because the tracker build already includes it.

   | GA4 event (trigger) | Ecommerce Function |
   |---|---|
   | `view_item` | Track Product View |
   | `add_to_cart` | Track Add To Cart |
   | `remove_from_cart` | Track Remove From Cart |
   | `begin_checkout` | Track Checkout Step |
   | `purchase` | Track Transaction |
   | `refund` | Track Refund |

7. **Add login.** Create a **Snowplow v4** tag with **Tag Type** set to **[Custom Command]**, with the command `setUserId` and the argument `{{DLV - user_id}}`. Then create a **Self-describing Event** tag with **Schema URL** `iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0` and one parameter, `id`, set to `{{DLV - user_id}}`. Fire both on your `login` event. Never map an email address here.

8. **Add your other events.** For GA4 events with no Snowplow equivalent, create two **Snowplow v4** tags with **Tag Type** set to **Self-describing Event** and **Schema URL** `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0`: one for `join_group` and one for your other events. Add these parameters:

   | Parameter name | Parameter value |
   |---|---|
   | `name` | `{{Event}}` |
   | `tool` | `ga4` |
   | `kind` | `group` on the `join_group` tag, `track` on the other |
   | `plan` | a Data Layer Variable for `plan`, if you send it |
   | `group_id` | on the `join_group` tag only: a Data Layer Variable for `group_id` |
   | `item_id`, `item_category`, `search_term`, `currency` | Data Layer Variables, if your events carry them |

   A Data Layer Variable keeps the last value pushed for its key, so `group_id` goes on the `join_group` tag only. Fire the `join_group` tag on a Custom Event trigger for `join_group`, and the other tag on a Custom Event trigger matching your event names, for example `^(signup_form_submitted|request_demo)$` as a regular expression.

   For `sign_up` and `generate_lead`, which have Google schemas, use a Self-describing Event tag with **Schema URL** `iglu:com.google.tag-manager.server-side/sign_up/jsonschema/1-0-0` (parameter `method`) or `iglu:com.google.tag-manager.server-side/generate_lead/jsonschema/1-0-0` (parameters `currency` and `value`).

9. **Set consent.** The Snowplow tags fire whatever the consent state until you add a requirement. On each Snowplow tag, open **Advanced Settings**, then **Consent Settings**, select **Require additional consent for tag to fire**, and add `analytics_storage`, or the consent types your consent management platform sets.

10. **Receive interventions.** On the Window Loaded page view tag, open **Load Plugins** and add the Signals browser plugin. Then add a **Custom HTML** tag that subscribes to interventions, with the Window Loaded page view tag as its **Set-up Tag** under **Advanced Settings**, then **Tag Sequencing**. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

11. **Preview and publish.** Use GTM Preview to check that each tag fires once per event, then publish the container. After you save a change, close the Tag Assistant tab and your site's tab, then select **Preview** again.

## Check it works

Test with your Console development environment, which runs Snowplow Micro hosted by Snowplow. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment and copy its Collector endpoint.
2. Point the Snowplow v4 Settings variable at it, as a full URL starting with `https://`.
3. Send test traffic from GTM Preview.
4. Select **Open dashboard** to see the good and failed events.

Check that:

- page views arrive for full loads and route changes, with a `domain_userid` and a `domain_sessionid`
- a purchase arrives as one `snowplow_ecommerce_action` with `type` `transaction`, a transaction entity and one product entity per item
- custom events arrive as `external_event` with `tool` `ga4` and `name` set to the GA4 event name
- every event carries an `external_identity` entity with the GA client ID in `anonymous_id`
- no event failed, and no email address appears in any event

Once the events look right, point the settings variable at your pipeline's Collector, then create your attribute groups from the [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).

## Other approaches

### Page script

Use this if you call `gtag()` directly without GTM. A script wraps `dataLayer.push`, which `gtag()` writes to, and sends each GA4 call through the Snowplow JavaScript tracker. It also turns on Snowplow's own page view, page ping, link click and form tracking, because `gtag.js` sends some events without a `dataLayer.push`.

Save the [ladder.js mapping file](#mapping-file-ladderjs) on your site and load it before the script. Put the steps below in one script, in this order.

1. **Load the tracker.** Add the Snowplow loader and tracker setup with your Collector URL and app ID.

   ```js
   ;(function (p, l, o, w, i, n, g) { if (!p[i]) { p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
   p.GlobalSnowplowNamespace.push(i); p[i] = function () { (p[i].q = p[i].q || []).push(arguments); }; p[i].q = p[i].q || [];
   n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1; n.src = w; g.parentNode.insertBefore(n, g); } })
   (window, document, 'script', 'https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@4.10.3/dist/sp.js', 'snowplow');
   ```

   ```js
   snowplow('newTracker', 'sp1', 'https://collector.example.com', {
     appId: 'my-site', platform: 'web',
     contexts: { webPage: true, session: true }
   });
   snowplow('addPlugin:sp1', 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@4.10.3/dist/index.umd.min.js',
     ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']);
   ```

   Then add the identity helpers the later steps use. `send` holds each event until `gtag.js` has set the `_ga` cookie, for up to 3 seconds. Replace the measurement ID with yours.

   ```js
   var MID = 'G-XXXXXXXXXX';
   var L = window.GA4Snowplow;
   var userId = null;
   function ids() { var g = L.readGaCookies(document.cookie, MID); g.userId = userId; return g; }
   var held = [];
   function send(eventName, fn) {
     if (!held.length && ids().clientId) return fn(L.identityEntity(ids(), eventName));
     held.push([eventName, fn]);
     if (held.length > 1) return;
     var t0 = Date.now();
     (function poll() {
       if (!ids().clientId && Date.now() - t0 < 3000) return setTimeout(poll, 25);
       held.splice(0).forEach(function (h) { h[1](L.identityEntity(ids(), h[0])); });
     })();
   }
   function ctx(ent) { return ent ? [ent] : []; }
   ```

2. **Turn on Snowplow's own tracking** for engagement, link clicks and forms. Form tracking sends the values people type, so denylist every field that can hold personal data, or leave it off.

   ```js
   snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
   snowplow('enableLinkClickTracking', { pseudoClicks: true, trackContent: false });
   snowplow('enableFormTracking', { options: { fields: { denylist: ['email', 'phone'] } } });
   ```

3. **Send single-page-app page views.** Wrap `history.pushState` so each route change sends a page view, and a site search when the URL has a search term. If your site also sends a GA4 `search` event for the same search, delete the `if (q)` line.

   ```js
   var lastUrl = location.href;
   var origPush = history.pushState;
   history.pushState = function () {
     var r = origPush.apply(this, arguments);
     setTimeout(function () {
       if (location.href === lastUrl) return;
       snowplow('setReferrerUrl', lastUrl);
       lastUrl = location.href;
       var q = new URLSearchParams(location.search).get('q');
       send('page_view', function (ent) { snowplow('trackPageView', { title: document.title, context: ctx(ent) }); });
       if (q) send('view_search_results', function (ent) { snowplow('trackSiteSearch', { terms: [q], context: ctx(ent) }); });
     }, 0);
     return r;
   };
   ```

   Then add `external_identity` to Snowplow's own link click and form events:

   ```js
   snowplow('addGlobalContexts', [function (a) {
     var native = /\/(link_click|focus_form|change_form|submit_form)\//.test(a.eventSchema || '');
     var ent = native && L.identityEntity(ids(), null);
     return ent ? [ent] : [];
   }]);
   ```

4. **Mirror each `gtag()` call.** Each GA4 event takes the first rung of the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) that fits, with `external_identity` attached.

   ```js
   function handleEvent(name, p) {
     p = p || {};
     var r = L.rung(name);
     send(name, function (ent) {
       if (r === 'page_view') return snowplow('trackPageView', { context: ctx(ent) });
       // Every GA4 item becomes a product entity.
       if (r === 'ecommerce') return L.ecommerceCalls(name, p).forEach(function (c) { c[1].context = ctx(ent); snowplow(c[0], c[1]); });
       if (r === 'site_search' && p.search_term) return snowplow('trackSiteSearch', { terms: [String(p.search_term)], context: ctx(ent) });
       if (r === 'identify' && userId) return snowplow('trackSelfDescribingEvent', { event: { schema: L.S.identify, data: { id: userId } }, context: ctx(ent) });
       if (r === 'google') return snowplow('trackSelfDescribingEvent', { event: L.googleEvent(name, p), context: ctx(ent) });
       snowplow('trackSelfDescribingEvent', {
         event: { schema: L.S.externalEvent, data: L.externalEvent(name, p, name === 'join_group' ? 'group' : 'track') },
         context: ctx(ent)
       });
     });
   }
   ```

   Last, hook the data layer. This handles `gtag('config', ...)` as a page view, `gtag('set', {user_id})` as `setUserId`, and `gtag('event', ...)` through `handleEvent`.

   <details>
   <summary>Data layer hook</summary>

   ```js
   var done = new WeakSet();
   function handle(entry) {
     if (entry && typeof entry === 'object') { if (done.has(entry)) return; done.add(entry); }
     var isArgs = Object.prototype.toString.call(entry) === '[object Arguments]';
     var a = isArgs ? Array.prototype.slice.call(entry) : null;
     if (a) {
       var cmd = a[0];
       if (cmd === 'config') {
         if (a[2] && a[2].user_id) { userId = String(a[2].user_id); snowplow('setUserId', userId); }
         if (!a[2] || a[2].send_page_view !== false) handleEvent('page_view');
         return;
       }
       if (cmd === 'set') {
         if (a[1] && typeof a[1] === 'object' && 'user_id' in a[1]) { userId = a[1].user_id ? String(a[1].user_id) : null; snowplow('setUserId', userId); }
         return;
       }
       if (cmd === 'event') return handleEvent(a[1], a[2]);
       return;
     }
     if (entry && typeof entry.event === 'string' && entry.event.indexOf('gtm.') !== 0) {
       var params = entry.ecommerce ? Object.assign({}, entry, entry.ecommerce) : entry;
       return handleEvent(entry.event, params);
     }
   }
   var dl = (window.dataLayer = window.dataLayer || []);
   for (var i = 0; i < dl.length; i++) handle(dl[i]);
   function wrap(fn) { return function () { for (var j = 0; j < arguments.length; j++) handle(arguments[j]); return fn.apply(dl, arguments); }; }
   var wrapped = wrap(dl.push);
   Object.defineProperty(dl, 'push', {
     configurable: true,
     get: function () { return wrapped; },
     set: function (fn) { wrapped = wrap(fn); }
   });
   ```

   </details>

5. **Gate it on consent.** The script doesn't read Google Consent Mode. Load it only after your consent management platform grants analytics consent.

To receive interventions, add the Signals browser plugin with `addPlugin`. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

### Server-side GTM

This approach adds Snowplow's tag to a server-side GTM container that already receives your GA4 hits through the GA4 client. It has no Snowplow sessions, no key that's safe on the public intervention endpoint, and values can take a couple of minutes to reach Signals. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay). For the tag, see [Google Tag Manager server-side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md).

Your tagging server needs an `https://` URL, set in **Admin**, then **Container Settings**, under **Server container URLs**.

1. **Add the Snowplow tag.** In the server container, go to **Templates**, select **Search Gallery** and add **Snowplow** by snowplow. Create a tag from it, with your **Collector URL** and an app ID. Turn on the built-in **Client Name** variable, and fire the tag on a Custom trigger where **Client Name** equals your GA4 client's name, `GA4` by default.

2. **Map events to schemas.** Under **Advanced Event Settings**, select **Define events to be sent as Snowplow Self-Describing Events**, then add rows to **Event Name to Schema**. Each schema can appear in one row only, so choose the event your attributes need most for each:

   | Event Name | Event Schema |
   |---|---|
   | `view_item` | `iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2` |
   | `view_search_results` | `iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0` |
   | `login` | `iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0` |
   | one custom event, for example `signup_form_submitted` | `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0` |

   Events you don't list keep the tag's defaults: `page_view` arrives as a page view, and GA4 recommended and Enhanced Measurement events arrive with Google's schemas, which Signals can build attributes on. A custom event that isn't listed and has no Google schema isn't sent.

3. **Fill each event's fields.** Add rows to **Event Definitions** for the events you mapped:

   | Event Name | Snowplow property name | Type | Reference | Value |
   |---|---|---|---|---|
   | `view_item` | `type` | String | Constant or Variable | `product_view` |
   | `view_search_results` | `terms.0` | String | Client Event Property | `search_term` |
   | `login` | `id` | Default | Client Event Property | `user_id` |
   | `signup_form_submitted` | `name` | String | Constant or Variable | `signup_form_submitted` |
   | `signup_form_submitted` | `tool` | String | Constant or Variable | `ga4` |
   | `signup_form_submitted` | `kind` | String | Constant or Variable | `track` |
   | `signup_form_submitted` | `plan` | Default | Client Event Property | `plan` |
   | `signup_form_submitted` | `group_id` | Default | Client Event Property | `group_id` |
   | `signup_form_submitted` | `item_id` | Default | Client Event Property | `items.0.item_id` |

   The mapped ecommerce event arrives with its `type` only, without product or transaction entities.

4. **Add `external_identity` to every event.** Under **Context entities**, add rows to **Define global context entities**, each with **Entity schema** `iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0`:

   | Entity Property Name | Type | Reference | Value |
   |---|---|---|---|
   | `tool` | String | Constant or Variable | `ga4` |
   | `anonymous_id` | String | Client Event Property | `client_id` |
   | `user_id` | Default | Client Event Property | `user_id` |
   | `session_id` | Default | Client Event Property | `ga_session_id` |
   | `session_number` | Default | Client Event Property | `ga_session_number` |
   | `event_name` | String | Client Event Property | `event_name` |

5. **Add a consent condition if you use Google Consent Mode.** The tag forwards every event whatever the consent state. Create a variable that reads the `gcs` query parameter from the request, and add a trigger condition that it matches `^G1[01]1$`. Without Consent Mode, leave this off. See [Gate server-side GTM on Consent Mode](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md#gate-server-side-gtm-on-consent-mode).

6. **Preview and publish.** Set `server_container_url` on your Google tag to your tagging server URL, check each event's outgoing request in Preview, then publish.

### Warehouse history: BigQuery export

If the GA4 BigQuery export is on, you can give Signals history for visitors it hasn't seen yet. This query builds one row per GA client ID with 90-day totals:

```sql
CREATE OR REPLACE TABLE `my-project.signals.ga4_visitor_history` AS
SELECT
  user_pseudo_id AS ga_client_id,
  COUNTIF(event_name = 'page_view') AS page_views_90d,
  COUNT(DISTINCT CONCAT(user_pseudo_id, CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING))) AS sessions_90d,
  COUNTIF(event_name = 'purchase') AS purchases_90d,
  SUM(IF(event_name = 'purchase', ecommerce.purchase_revenue_in_usd, 0)) AS revenue_usd_90d,
  ARRAY_AGG(IF(event_name = 'view_item', items[SAFE_OFFSET(0)].item_category, NULL) IGNORE NULLS ORDER BY event_timestamp DESC LIMIT 1)[SAFE_OFFSET(0)] AS last_viewed_category,
  MAX(user_id) AS user_id,
  TIMESTAMP_MICROS(MAX(event_timestamp)) AS updated_at
FROM `my-project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                        AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
GROUP BY user_pseudo_id;
```

1. Schedule the query in BigQuery, replacing the project and dataset names.
2. In Signals, create a batch source on the table, with `ga_client_id` as the key column and `updated_at` as the timestamp field.
3. Create an attribute key for the GA client ID.

Warehouse attributes update periodically, so they can't trigger interventions.

## How GA4 events map to Snowplow

Each GA4 event takes the first rung of the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) that fits.

| GA4 event | Snowplow event |
|---|---|
| `page_view`, including single-page-app page views | `page_view` |
| `view_item`, `view_item_list`, `select_item` | `snowplow_ecommerce_action` with a product entity |
| `add_to_cart`, `remove_from_cart` | `snowplow_ecommerce_action` with product and cart entities |
| `begin_checkout`, `add_payment_info` | `snowplow_ecommerce_action` with `type` `checkout_step` |
| `purchase`, `refund` | `snowplow_ecommerce_action` with a transaction entity and one product entity per item |
| `search`, `view_search_results` | `site_search` |
| `login` | `identify` with `id` only |
| `sign_up`, `generate_lead` and other recommended events with a Google schema | Google's schema under `com.google.tag-manager.server-side` |
| Any other event, such as `join_group` or your custom events | `external_event` with `tool` `ga4` and `name` set to the event name |
| `gtag('set', 'user_properties', ...)` | Not sent |

Every event also carries an `external_identity` entity. See [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md). On server-side GTM, only the events you map get Snowplow schemas.

## Identifiers

| GA4 or GTM field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow first-party cookie | `domain_userid` | Yes. A random ID, safe on the public intervention endpoint |
| Snowplow session | `domain_sessionid` | Yes, for session attributes. Server-side GTM has none |
| GA client ID (`_ga` cookie, `user_pseudo_id` in BigQuery) | `external_identity.anonymous_id`. On server-side GTM, also `domain_userid` | Only for reads from your own servers. Never on the public intervention endpoint |
| GA session ID and session number | `external_identity.session_id` and `session_number` | No |
| GA `user_id` | `user_id`, `external_identity.user_id`, and `identify.id` on login | Only for reads from your own servers |

See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Troubleshooting

- **No events arrive:** set **Collector Endpoint Hostname** to a full `https://` URL, and set the tracker library to **jsDelivr** with a version. The default loads no tracker.
- **A purchase also resends the product view:** set **Snowplow Ecommerce Plugin Library** to **Do not add** on every ecommerce tag.
- **Route changes send extra page views:** load the Signals plugin only from the Window Loaded page view tag, not the History Change one.
- **An event you expected is missing:** every GA4 event needs its own Snowplow tag and trigger. Enhanced Measurement events, such as scroll and file downloads, aren't in the data layer; use Snowplow's page pings and link clicks.
- **A custom event carries an old `group_id` or `plan`:** Data Layer Variables keep the last value pushed. Put `group_id` on the `join_group` tag only.
- **Funnel attributes stay empty:** GA4 event names are lowercase with underscores, such as `signup_form_submitted`. Use them exactly in your attribute filters.

For how each approach handles consent and personal data, see [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

Where to go next:

- Build your first attributes from [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- Replace `external_event` with native Snowplow events one at a time: see [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md).
- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.

## Mapping file: ladder.js

The page script loads this file before its own code. Save it on your site, for example as `/js/ladder.js`, and load it with a `<script>` tag before the page script. It defines `window.GA4Snowplow`.

<details>
<summary>ladder.js</summary>

```js
// Maps a GA4 event to the first rung that fits: page_view, Snowplow ecommerce, site_search,
// identify (id only), a Google schema from Iglu Central, then external_event.
(function (root) {
  var S = {
    externalEvent: 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0',
    externalIdentity: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0',
    identify: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0',
    siteSearch: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0',
    ecomAction: 'iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2',
    product: 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0',
    transaction: 'iglu:com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0',
    cart: 'iglu:com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
    refund: 'iglu:com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0',
    checkoutStep: 'iglu:com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0',
  };

  // GA4 recommended events with a Google schema and no Snowplow equivalent, with the fields each keeps.
  var GOOGLE = {
    add_to_wishlist: ['com.google.tag-manager.server-side/add_to_wishlist/jsonschema/1-0-0', ['currency', 'value', 'items']],
    exception: ['com.google.tag-manager.server-side/exception/jsonschema/1-0-0', ['description', 'fatal']],
    generate_lead: ['com.google.tag-manager.server-side/generate_lead/jsonschema/1-0-0', ['currency', 'value']],
    select_content: ['com.google.tag-manager.server-side/select_content/jsonschema/1-0-0', ['content_type', 'item_id']],
    share: ['com.google.tag-manager.server-side/share/jsonschema/1-0-0', ['method', 'content_type', 'item_id']],
    sign_up: ['com.google.tag-manager.server-side/sign_up/jsonschema/1-0-0', ['method']],
  };
  var ECOM = ['view_item', 'view_item_list', 'select_item', 'add_to_cart', 'remove_from_cart', 'begin_checkout', 'add_payment_info', 'purchase', 'refund'];
  var SEARCH = ['view_search_results', 'search'];
  var IDENTIFY = ['login'];

  function clean(o) { for (var k in o) if (o[k] === undefined || o[k] === '') delete o[k]; return o; }
  function str(v) { return v === undefined || v === null || typeof v === 'object' ? undefined : String(v).slice(0, 255); }
  function num(v) { var n = typeof v === 'string' && v !== '' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : undefined; }
  function money(v) { var n = num(v); return n === undefined ? undefined : Math.round(n * 100) / 100; }
  function int(v) { var n = num(v); return n === undefined ? undefined : Math.round(n); }
  function currency(c, fallback) { c = String(c || fallback || '').toUpperCase(); return /^[A-Z]{3}$/.test(c) ? c : undefined; }

  // Same field mapping as the ecommerce plugin's GA4 helpers, but every item is kept.
  function products(items, cur) {
    return (items || []).filter(Boolean).map(function (it) {
      var cat = [it.item_category, it.item_category2, it.item_category3, it.item_category4, it.item_category5].filter(Boolean).join('/');
      return clean({
        id: String(it.item_id), name: str(it.item_name), category: cat || 'unknown',
        price: money((num(it.price) || 0) - (num(it.discount) || 0)), list_price: money(it.price),
        quantity: int(it.quantity), position: int(it.index), brand: str(it.item_brand), variant: str(it.item_variant),
        currency: cur,
      });
    });
  }

  function rung(name) {
    if (name === 'page_view') return 'page_view';
    if (ECOM.indexOf(name) >= 0) return 'ecommerce';
    if (SEARCH.indexOf(name) >= 0) return 'site_search';
    if (IDENTIFY.indexOf(name) >= 0) return 'identify';
    if (GOOGLE[name]) return 'google';
    return 'external_event';
  }

  // Ecommerce plugin calls for a GA4 ecommerce event: [[method, args], ...]. Args carry no context.
  function ecommerceCalls(name, p, opts) {
    opts = opts || {};
    var cur = currency(p.currency, opts.currency);
    var prods = products(p.items, cur);
    switch (name) {
      case 'view_item': return prods.map(function (pr) { return ['trackProductView', pr]; });
      case 'view_item_list': return [['trackProductListView', clean({ name: str(p.item_list_name || p.item_list_id), products: prods })]];
      case 'select_item': return [['trackProductListClick', clean({ name: str(p.item_list_name || p.item_list_id), product: prods[0] })]];
      // GA4 value is what was added or removed, not the cart total the cart entity asks for.
      case 'add_to_cart': return [['trackAddToCart', { products: prods, total_value: money(p.value) || 0, currency: cur }]];
      case 'remove_from_cart': return [['trackRemoveFromCart', { products: prods, total_value: money(p.value) || 0, currency: cur }]];
      case 'begin_checkout': return [['trackCheckoutStep', { step: 1 }]];
      case 'add_payment_info': return [['trackCheckoutStep', clean({ step: int(opts.step) || 2, payment_method: str(p.payment_type) })]];
      case 'purchase': return [['trackTransaction', clean({
        transaction_id: String(p.transaction_id), revenue: money(p.value), currency: cur,
        payment_method: str(p.payment_type) || opts.paymentMethod || 'unknown',
        tax: money(p.tax), shipping: money(p.shipping), discount_code: str(p.coupon), products: prods,
      })]];
      case 'refund': return [['trackRefund', clean({ transaction_id: String(p.transaction_id), currency: cur, refund_amount: money(p.value), products: prods })]];
    }
    return [];
  }

  function externalEvent(name, p, kind) {
    var first = (p.items && p.items[0]) || {};
    return clean({
      name: String(name).slice(0, 255), tool: 'ga4', kind: kind || 'track',
      value: num(p.value), currency: currency(p.currency),
      item_id: str(first.item_id || p.item_id), item_category: str(first.item_category),
      search_term: str(p.search_term), plan: str(p.plan), group_id: str(p.group_id),
    });
  }

  function googleEvent(name, p) {
    var g = GOOGLE[name], data = {};
    g[1].forEach(function (k) { if (p[k] !== undefined) data[k] = p[k]; });
    return { schema: 'iglu:' + g[0], data: data };
  }

  // GA client ID and session from the _ga and _ga_<container> cookies (GS1 and GS2 formats).
  function readGaCookies(cookieString, measurementId) {
    var jar = {};
    String(cookieString || '').split(/;\s*/).forEach(function (c) { var i = c.indexOf('='); if (i > 0) jar[c.slice(0, i)] = c.slice(i + 1); });
    var out = {};
    if (jar._ga) { var parts = jar._ga.split('.'); if (parts.length >= 4) out.clientId = parts.slice(-2).join('.'); }
    var s = jar['_ga_' + String(measurementId || '').replace(/^G-/, '')];
    if (s) {
      var m = /^GS2\.\d+\.s(\d+)\$o(\d+)/.exec(s) || /^GS1\.\d+\.(\d+)\.(\d+)/.exec(s);
      if (m) { out.sessionId = m[1]; out.sessionNumber = Number(m[2]); }
    }
    return out;
  }

  // Sent even without a GA client ID, with anonymous_id null, so user_id and event_name still arrive.
  function identityEntity(ids, eventName) {
    ids = ids || {};
    return {
      schema: S.externalIdentity,
      data: clean({
        tool: 'ga4', anonymous_id: ids.clientId ? String(ids.clientId) : null, user_id: ids.userId ? String(ids.userId) : undefined,
        session_id: ids.sessionId ? String(ids.sessionId) : undefined, session_number: ids.sessionNumber,
        event_name: eventName || undefined,
      }),
    };
  }

  root.GA4Snowplow = { S: S, GOOGLE: GOOGLE, rung: rung, products: products, ecommerceCalls: ecommerceCalls, externalEvent: externalEvent, googleEvent: googleEvent, readGaCookies: readGaCookies, identityEntity: identityEntity, currency: currency };
})(window);
```

</details>
