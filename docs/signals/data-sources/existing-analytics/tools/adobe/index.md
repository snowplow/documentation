---
title: "Use Signals with Adobe Analytics and Adobe Experience Platform"
sidebar_label: "Adobe"
sidebar_position: 50
description: "Copy the events your Adobe Web SDK, AppMeasurement or Adobe Client Data Layer already sends into Snowplow, so Signals can compute attributes without retagging."
keywords: ["adobe analytics", "adobe experience platform", "web sdk", "appmeasurement", "event forwarding", "data feeds", "signals"]
date: "2026-11-16"
content_type: how-to
---

Copy the events your Adobe setup already sends into Snowplow, so Signals can compute visitor, session and account attributes from them without retagging your site.

## Choose an approach

Most sites should use the **Web SDK callback**. One callback in your Web SDK configuration copies each event into the Snowplow tracker as Adobe sends it. The tracker runs in the browser, so you get Snowplow sessions, page pings and interventions in the page.

Find your setup to pick an approach:

| Your setup | How you'll know | Use |
|---|---|---|
| Web SDK (alloy.js), with Tags or in page code | `alloy` exists on the page | [Web SDK callback](#set-up-the-web-sdk-callback) (recommended) |
| AppMeasurement (Adobe Analytics `s` object) | `s_gi` exists on the page; requests go to `/b/ss/` | [AppMeasurement callback](#appmeasurement-callback) |
| Adobe Client Data Layer and Tags rules | `adobeDataLayer` exists on the page | [Tags rules on the data layer](#tags-rules-on-the-adobe-client-data-layer) |
| Web SDK or Mobile SDK, with event forwarding licensed, and you can't add a browser script | Your contract includes Real-Time CDP Connections, Prime or Ultimate | [Event forwarding](#event-forwarding). No sessions or in-page interventions, and values arrive later |
| Analytics history you want in Signals | You receive Analytics Data Feeds in a warehouse | [Data Feeds](#warehouse-history-data-feeds), beside a live approach |

If your site runs both the Web SDK and AppMeasurement, pick one hook. Using both copies each event twice.

## Before you begin

You need:

- A Snowplow pipeline with Signals enabled, and its Collector URL.
- Access to change your Adobe setup: the Tags property, or the page code that configures the Web SDK.
- A list of the XDM fields that hold the user ID, plan, account ID and search term. The adapter reads only the fields you name.

The `external_event` and `external_identity` schemas, and the other schemas the adapter uses, are published on Iglu Central. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Set up the Web SDK callback

The Web SDK calls `onBeforeEventSend` with each event just before it sends it. The callback copies the event into Snowplow and lets Adobe's request continue unchanged.

1. **Add the shared script.** Host the Snowplow JavaScript tracker and ecommerce plugin, version 4.10.3, where your pages can load them. Then add this script to your pages, or to your Tags library, so that it runs before the Web SDK sends its first event. Set `collector` to your Collector URL and `appId` to your app ID. All Adobe approaches use this script.

   <details>
   <summary>snowplow-adobe.js: tracker loader and helpers</summary>

   ```js
   (function () {
     var cfg = (window.snowplowAdobe = window.snowplowAdobe || {});
     cfg.collector = cfg.collector || 'https://collector.example.com';
     var VENDOR = 'com.snowplowanalytics.snowplow';
     var IDENTITY = 'iglu:' + VENDOR + '/external_identity/jsonschema/1-0-0';
     var EXTERNAL = 'iglu:' + VENDOR + '/external_event/jsonschema/1-0-0';
     var PRODUCT = 'iglu:com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0';

     (function (p, l, o, w, i, n, g) {
       if (!p[i]) {
         p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
         p.GlobalSnowplowNamespace.push(i);
         p[i] = function () { (p[i].q = p[i].q || []).push(arguments); };
         p[i].q = p[i].q || [];
         n = l.createElement(o); g = l.getElementsByTagName(o)[0];
         n.async = 1; n.src = w; g.parentNode.insertBefore(n, g);
       }
     })(window, document, 'script', '/js/sp.js', 'snowplow');
     snowplow('newTracker', 'sp1', cfg.collector, {
       appId: 'my-site', platform: 'web', eventMethod: 'post',
       contexts: { webPage: true, session: true },
     });
     snowplow('addPlugin:sp1', '/js/snowplow-ecommerce.js', ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']);

     // The ECID, as an external_identity entity. Adobe sends no session ID, so those fields stay null.
     function identity(eventName, uid) {
       var id = cfg.vendorId && cfg.vendorId();
       return [{ schema: IDENTITY, data: { tool: 'adobe', anonymous_id: id ? String(id) : null, user_id: uid || null,
         session_id: null, session_number: null, event_name: eventName ? String(eventName).slice(0, 255) : null } }];
     }
     // On a first visit the ECID exists only after Adobe's first response, so events wait for it
     // (up to 5 seconds) rather than go out without it in the external_identity entity.
     // A held event keeps the user ID it was sent with, not the one current at the flush.
     var held = [], timer = null;
     function emit(eventName, send) {
       var uid = cfg.userId;
       if (held.length || (cfg.vendorId && !cfg.vendorId())) {
         held.push(function () { snowplow('setUserId', uid || null); send(identity(eventName, uid)); });
         if (!timer) timer = setTimeout(flush, 5000);
         return;
       }
       send(identity(eventName, uid));
     }
     function flush() {
       clearTimeout(timer); timer = null;
       var h = held; held = [];
       h.forEach(function (f) { f(); });
       if (h.length) snowplow('setUserId', cfg.userId || null);
     }
     cfg.idReady = flush;
     function productEntities(list) { return list.map(function (p) { return { schema: PRODUCT, data: p }; }); }

     var lastUrl = location.href;
     cfg.sp = {
       pageView: function (title, name) {
         var url = location.href;
         title = title || document.title;
         emit(name || 'page_view', function (ctx) {
           if (url !== lastUrl) { snowplow('setReferrerUrl', lastUrl); lastUrl = url; }
           snowplow('trackPageView', { title: title, context: ctx });
         });
       },
       // c: { type, products, transaction | cart | refund | checkout }.
       // A product view sends only the first item: the tracker puts extra entities before the
       // viewed product's, so Signals would read another item as the product viewed.
       ecommerce: function (name, c) {
         emit(name, function (ctx) {
           var ps = c.products;
           if (c.type === 'product_view') snowplow('trackProductView', Object.assign({}, ps[0], { context: ctx }));
           else if (c.type === 'add_to_cart') snowplow('trackAddToCart', Object.assign({}, c.cart, { products: ps, context: ctx }));
           else if (c.type === 'remove_from_cart') snowplow('trackRemoveFromCart', Object.assign({}, c.cart, { products: ps, context: ctx }));
           else if (c.type === 'transaction') snowplow('trackTransaction', Object.assign({}, c.transaction, { products: ps, context: ctx }));
           else if (c.type === 'refund') snowplow('trackRefund', Object.assign({}, c.refund, { products: ps, context: ctx }));
           else if (c.type === 'checkout_step') snowplow('trackCheckoutStep', Object.assign({}, c.checkout, { context: productEntities(ps).concat(ctx) }));
         });
       },
       search: function (name, terms) {
         emit(name, function (ctx) {
           snowplow('trackSelfDescribingEvent', { event: { schema: 'iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0', data: { terms: terms } }, context: ctx });
         });
       },
       setUser: function (id) {
         if (!id) return;
         cfg.userId = String(id);
         snowplow('setUserId', cfg.userId);
       },
       // identify also has an email field; it is never filled.
       identify: function (name, id) {
         this.setUser(id);
         if (!cfg.userId) return this.external(name, 'identify', {});
         var uid = cfg.userId;
         emit(name, function (ctx) {
           snowplow('trackSelfDescribingEvent', { event: { schema: 'iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0', data: { id: uid } }, context: ctx });
         });
       },
       external: function (name, kind, slots) {
         var data = { name: String(name).slice(0, 255), tool: 'adobe', kind: kind || 'track' };
         for (var k in slots) if (slots[k] !== undefined && slots[k] !== null && slots[k] !== '') data[k] = slots[k];
         emit(name, function (ctx) { snowplow('trackSelfDescribingEvent', { event: { schema: EXTERNAL, data: data }, context: ctx }); });
       },
     };
   })();
   ```

   </details>

   To send page pings for engagement attributes, add this after `newTracker`:

   ```js
   snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
   ```

2. **Add the field map.** Add the mapping below to `snowplow-adobe.js`, after the helpers. Replace the paths in `FIELDS` with the paths in your own XDM schema. Tenant fields start with your tenant ID, such as `xdm._yourtenant`.

   <details>
   <summary>Web SDK mapping: XDM event to Snowplow event</summary>

   ```js
   (function () {
     var cfg = window.snowplowAdobe, sp = cfg.sp;
     // Your schema's paths. These three are the only part you configure.
     var FIELDS = {
       plan: ['xdm._yourtenant.account.plan', 'xdm._yourtenant.user.plan'],
       group_id: ['xdm._yourtenant.account.id'],
       search_term: ['xdm._yourtenant.search.term', 'data.__adobe.analytics.prop3'],
     };
     var SEARCH_QUERY = ['xdm.siteSearch.query'];
     var LOGIN_TYPES = ['userAccount.login'];
     var USER_NAMESPACES = ['CRMID'];
     var COMMERCE = {
       'commerce.productViews': 'product_view', 'commerce.productListAdds': 'add_to_cart',
       'commerce.productListRemovals': 'remove_from_cart', 'commerce.checkouts': 'checkout_step',
       'commerce.purchases': 'transaction', 'commerce.refunds': 'refund',
     };

     function get(o, path) {
       var parts = path.split('.');
       for (var i = 0; i < parts.length; i++) { if (o === undefined || o === null) return undefined; o = o[parts[i]]; }
       return o;
     }
     function str255(v) { return v === undefined || v === null || typeof v === 'object' ? undefined : String(v).slice(0, 255); }
     function num(v) { var n = typeof v === 'string' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : undefined; }
     function cents(v) { return Math.round((num(v) || 0) * 100) / 100; }
     function firstOf(content, paths) { for (var i = 0; i < paths.length; i++) { var v = str255(get(content, paths[i])); if (v !== undefined && v !== '') return v; } }

     // The authenticated ID from identityMap. The Email namespace is never read.
     function crmId(xdm) {
       var map = (xdm && xdm.identityMap) || {};
       for (var i = 0; i < USER_NAMESPACES.length; i++) {
         var ids = map[USER_NAMESPACES[i]];
         if (ids && ids.length && ids[0].id) return ids[0].id;
       }
     }
     function currencyOf(xdm) {
       var items = xdm.productListItems || [];
       var c = (xdm.commerce && xdm.commerce.order && xdm.commerce.order.currencyCode) || (items[0] && items[0].currencyCode);
       return typeof c === 'string' && /^[A-Za-z]{3}$/.test(c) ? c.toUpperCase() : 'USD';
     }
     // One product entity per productListItems entry.
     function toProducts(xdm) {
       var cur = currencyOf(xdm);
       return (xdm.productListItems || []).filter(function (it) { return it && it.SKU !== undefined; }).map(function (it) {
         var qty = Math.max(1, Math.round(num(it.quantity) || 1));
         var p = { id: String(it.SKU), category: (it.productCategories && it.productCategories[0] && it.productCategories[0].categoryID) || 'unknown',
           price: cents((num(it.priceTotal) || 0) / qty), currency: cur, quantity: qty };
         if (it.name) p.name = String(it.name);
         return p;
       });
     }
     function externalData(content) {
       var xdm = content.xdm || {};
       var first = (xdm.productListItems || [])[0] || {};
       var order = (xdm.commerce && xdm.commerce.order) || {};
       var cur = order.currencyCode || first.currencyCode;
       var out = {
         value: num(order.priceTotal !== undefined ? order.priceTotal : first.priceTotal),
         currency: typeof cur === 'string' && /^[A-Za-z]{3}$/.test(cur) ? cur.toUpperCase() : undefined,
         item_id: str255(first.SKU),
         item_category: str255(first.productCategories && first.productCategories[0] && first.productCategories[0].categoryID),
       };
       for (var k in FIELDS) if (out[k] === undefined) out[k] = firstOf(content, FIELDS[k]);
       return out;
     }

     cfg.mirrorXdm = function (content) {
       var xdm = content.xdm || {};
       var type = xdm.eventType;
       var crm = crmId(xdm);
       if (crm) sp.setUser(crm);
       if (type === 'web.webpagedetails.pageViews') return sp.pageView(get(xdm, 'web.webPageDetails.name'), type);
       var action = COMMERCE[type];
       var products = toProducts(xdm);
       if (action && (products.length || action === 'refund')) {
         var order = (xdm.commerce && xdm.commerce.order) || {};
         var cur = currencyOf(xdm);
         var total = cents(order.priceTotal !== undefined ? order.priceTotal : products.reduce(function (a, p) { return a + p.price * p.quantity; }, 0));
         var c = { type: action, products: products };
         if (action === 'transaction') c.transaction = { transaction_id: String(order.purchaseID || 'unknown'), revenue: total, currency: cur,
           payment_method: (order.payments && order.payments[0] && order.payments[0].paymentType) || 'unknown',
           total_quantity: products.reduce(function (a, p) { return a + p.quantity; }, 0) };
         // XDM carries the items added or removed, not the cart total.
         if (action === 'add_to_cart' || action === 'remove_from_cart') c.cart = { total_value: total, currency: cur };
         if (action === 'refund') c.refund = { transaction_id: String(order.purchaseID || 'unknown'), refund_amount: total, currency: cur };
         if (action === 'checkout_step') c.checkout = { step: 1 };
         return sp.ecommerce(type, c);
       }
       var q = firstOf(content, SEARCH_QUERY);
       if (q) return sp.search(type, [q]);
       if (LOGIN_TYPES.indexOf(type) > -1 && crm) return sp.identify(type, crm);
       return sp.external(type, 'track', externalData(content));
     };
   })();
   ```

   </details>

3. **Read the ECID.** Call `getIdentity` once after your first `sendEvent` resolves. Use your Web SDK instance name; it's `alloy` by default.

   ```js
   var ecid = null;
   window.snowplowAdobe.vendorId = function () { return ecid; };
   // getIdentity returns no identity, or rejects, while consent is pending or refused.
   function fetchEcid() {
     alloy('getIdentity', { namespaces: ['ECID'] }).then(function (r) {
       ecid = (r && r.identity && r.identity.ECID) || null;
       if (ecid) window.snowplowAdobe.idReady();
     }).catch(function () {});
   }
   // For example, after the first page view:
   // alloy('sendEvent', { xdm: { ... } }).then(function () { if (!ecid) fetchEcid(); }).catch(function () {});
   ```

4. **Add the callback.** If you configure the Web SDK in page code, add `onBeforeEventSend` to your `configure` call:

   ```js
   alloy('configure', {
     datastreamId: 'YOUR_DATASTREAM_ID',
     orgId: 'YOUR_ORG_ID@AdobeOrg',
     // An exception here would stop the Web SDK sending to Adobe too, so the copy never throws.
     onBeforeEventSend: function (content) {
       try { window.snowplowAdobe.mirrorXdm(content); } catch (e) {}
     },
   });
   ```

   If you deploy the Web SDK with Tags, add this to the on before event send callback code in the Adobe Experience Platform Web SDK extension settings. The extension provides the event as `content`:

   ```js
   try { if (window.snowplowAdobe && window.snowplowAdobe.mirrorXdm) window.snowplowAdobe.mirrorXdm(content); } catch (e) {}
   ```

   Keep the `try` and `catch`, and never return `false`: either would stop the event for Adobe too.

5. **Gate the tracker on consent.** The tracker sets its own cookies when it loads. Load `snowplow-adobe.js` only once your consent management platform allows analytics.

6. **Publish** your Tags library or deploy your page code, then [check it works](#check-it-works).

To react to interventions in the page, add the Signals browser plugin to the Snowplow tracker. See [Receive interventions in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).

## Check it works

Test with your Console development environment, which runs Snowplow Micro hosted by Snowplow. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment and copy its Collector endpoint.
2. Point `collector` in the shared script at it. For event forwarding, point the Make Fetch Call action at it, keeping the `/com.snowplowanalytics.snowplow/tp2` path.
3. Send a page view, a product view, a purchase and a login.
4. Select **Open dashboard** to see the good and failed events.

Check that:

- no event failed
- page views arrive as `page_view` events, one per Adobe page view
- product views and orders arrive as `snowplow_ecommerce_action` events, with a `product` entity per line and a `transaction` entity
- logins arrive as `identify` events with `id` only
- other events arrive as `external_event`, with `name` set to the XDM `eventType`, the link name or the data layer event
- every event carries `external_identity`, with the ECID in `anonymous_id`
- Adobe still receives every event, in the Adobe Experience Platform Debugger

Once the events look right, point the shared script at your pipeline's Collector, then create your attribute groups from the [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).

## Other approaches

### AppMeasurement callback

AppMeasurement calls the function you pass to `s.registerPreTrackCallback` with the request URL of every `s.t()` and `s.tl()` call. The callback reads that URL and sends the matching Snowplow event.

1. Add the [shared script](#set-up-the-web-sdk-callback) from step 1 of the Web SDK callback.

2. Write down which eVars, props and events hold the user ID, plan, account ID and search term. In the request URL, `eVar1` appears as `v1` and `prop3` as `c3`. Add the mapping to `snowplow-adobe.js`, after the helpers, and set `MAP` to your variables. Context data is never read.

   <details>
   <summary>AppMeasurement mapping: Analytics hit to Snowplow event</summary>

   ```js
   (function () {
     var cfg = window.snowplowAdobe, sp = cfg.sp;
     // Your report suite's variables, as they appear in the request URL. This is the part you configure.
     var MAP = { userId: 'v1', plan: ['v2', 'v6'], groupId: 'v5', search: 'c3', searchEvent: 'event4' };
     var COMMERCE = { purchase: 'transaction', prodView: 'product_view', scAdd: 'add_to_cart', scRemove: 'remove_from_cart', scCheckout: 'checkout_step' };
     function first(q, keys) { keys = [].concat(keys); for (var i = 0; i < keys.length; i++) if (q.get(keys[i])) return q.get(keys[i]); }
     function cents(n) { return Math.round(n * 100) / 100; }
     function products(s, cur) {
       return (s || '').split(',').filter(Boolean).map(function (p) {
         var f = p.split(';');
         var qty = Math.max(1, Math.round(Number(f[2]) || 1)), total = Number(f[3]) || 0;
         return { id: f[1], category: f[0] || 'unknown', quantity: qty, price: cents(total / qty), currency: cur };
       }).filter(function (p) { return p.id; });
     }
     cfg.mirrorAm = function (url) {
       var q = new URL(url).searchParams;
       var events = (q.get('events') || '').split(',').map(function (e) { return e.split('=')[0].split(':')[0]; });
       var pe = q.get('pe');
       var name = pe === 'lnk_e' ? 'exit_link' : pe === 'lnk_d' ? 'download_link' : pe ? (q.get('pev2') || 'custom_link') : 'page_view';
       var uid = q.get(MAP.userId);
       var cur = (q.get('cc') || 'USD').toUpperCase();
       var prods = products(q.get('products'), cur);
       var action = null;
       for (var k in COMMERCE) if (events.indexOf(k) > -1) { action = COMMERCE[k]; break; }
       if (action && prods.length) {
         var total = cents(prods.reduce(function (a, p) { return a + p.price * p.quantity; }, 0));
         var c = { type: action, products: prods };
         // Analytics hits carry no payment method or cart total.
         if (action === 'transaction') c.transaction = { transaction_id: String(q.get('purchaseID') || q.get('xact') || 'unknown'), revenue: total, currency: cur, payment_method: 'unknown' };
         if (action === 'add_to_cart' || action === 'remove_from_cart') c.cart = { total_value: total, currency: cur };
         if (action === 'checkout_step') c.checkout = { step: 1 };
         if (uid) sp.setUser(uid);
         return sp.ecommerce(name, c);
       }
       if (!pe) { if (uid) sp.setUser(uid); return sp.pageView(q.get('pageName'), name); }
       if (events.indexOf(MAP.searchEvent) > -1 && q.get(MAP.search)) return sp.search(name, [q.get(MAP.search)]);
       if (uid) return sp.identify(name, uid);
       return sp.external(name, 'track', { plan: first(q, MAP.plan), group_id: q.get(MAP.groupId) || undefined, search_term: q.get(MAP.search) || undefined });
     };
   })();
   ```

   </details>

3. Register the callback on your `s` object and tell the helpers how to read the ECID. If your `s` object already has a Visitor instance, use that one. If Tags deploys AppMeasurement, put this in the Adobe Analytics extension's custom code.

   ```js
   var visitor = Visitor.getInstance('YOUR_ORG_ID@AdobeOrg', { trackingServer: 'metrics.example.com' });
   var s = s_gi('yourreportsuite');
   s.visitor = visitor;
   s.registerPreTrackCallback(function (url) {
     try { window.snowplowAdobe.mirrorAm(url); } catch (e) {}
   });
   window.snowplowAdobe.vendorId = function () { return visitor.getMarketingCloudVisitorID(); };
   ```

4. Gate the tracker on consent, deploy the change, then [check it works](#check-it-works).

### Tags rules on the Adobe Client Data Layer

If your site pushes events to the Adobe Client Data Layer (`adobeDataLayer`), you can fire Snowplow events from Tags rules on those pushes. You write one rule per event.

1. Add the [shared script](#set-up-the-web-sdk-callback) to your Tags library.

2. In the Adobe Client Data Layer extension, create data elements that read named paths from the data layer, such as `page.name`, `user.id`, `account.id` and `account.plan`. Read named fields only: the data layer keeps every field ever pushed, including emails.

3. Create one rule per data layer event, with the extension's Data Pushed event for that event name and a Core Custom Code action that calls a helper. The pushed object is `event.message`. For example:

   ```js
   // Rule: SP page view. Event: Data Pushed, specific event "page loaded".
   window.snowplowAdobe.sp.pageView(_satellite.getVar('page name'), 'page loaded');
   ```

   ```js
   // Rule: SP purchase. Event: Data Pushed, specific event "purchase".
   var t = event.message.transaction;
   window.snowplowAdobe.sp.ecommerce('purchase', {
     type: 'transaction',
     transaction: { transaction_id: t.id, revenue: t.total, currency: t.currency, payment_method: t.paymentMethod || 'unknown' },
     products: t.items.map(function (i) { return { id: i.sku, name: i.name, category: i.category, price: i.price, quantity: i.qty, currency: t.currency }; }),
   });
   ```

   ```js
   // Rule: SP login. Event: Data Pushed, specific event "login".
   window.snowplowAdobe.sp.identify('login', _satellite.getVar('user id'));
   ```

   ```js
   // Rule: SP join group. Event: Data Pushed, specific event "join group".
   window.snowplowAdobe.sp.external('join_group', 'group', { group_id: _satellite.getVar('account id'), plan: _satellite.getVar('account plan') });
   ```

   Add rules that call `sp.ecommerce` with type `product_view` and `sp.search` if you want product views and searches. These rules don't read the ECID unless you set `window.snowplowAdobe.vendorId`, as in the other approaches.

4. Publish your Tags library, then [check it works](#check-it-works).

### Event forwarding

Event forwarding runs a rule on Adobe's servers for each Web SDK or Mobile SDK event that reaches the Edge Network, and posts a Snowplow event to your Collector. Nothing changes in the browser or the app. It has no Snowplow sessions, the visitor key is the ECID, and values arrive later than client-side. See [Delivery and delay](/docs/signals/data-sources/existing-analytics/index.md#delivery-and-delay).

1. Confirm that your contract includes event forwarding. Adobe includes it with Real-Time CDP Connections, Prime and Ultimate.

2. In your event forwarding property, create a Core Custom Code data element, for example `snowplow body`, and paste in the converter below. Set `slots` to the same paths as `FIELDS` in the Web SDK mapping, and `aid` to your app ID.

   <details>
   <summary>Adobe-to-Snowplow converter</summary>

   ```js
   // Adobe XDM event to Snowplow tracker protocol event.
   // No dependencies, because event forwarding custom code has no require, Buffer or crypto.
   var IGLU = 'iglu:com.snowplowanalytics.snowplow';
   var ECOM = 'iglu:com.snowplowanalytics.snowplow.ecommerce';
   var XDM2SP = {
     tv: 'adobe-ef-1',
     aid: 'my-site',
     schemas: {
       external: IGLU + '/external_event/jsonschema/1-0-0',
       identity: IGLU + '/external_identity/jsonschema/1-0-0',
       identify: IGLU + '/identify/jsonschema/1-0-0',
       search: IGLU + '/site_search/jsonschema/1-0-0',
       action: ECOM + '/snowplow_ecommerce_action/jsonschema/1-0-2',
       product: ECOM + '/product/jsonschema/1-0-0',
       transaction: ECOM + '/transaction/jsonschema/1-0-0',
       cart: ECOM + '/cart/jsonschema/1-0-0',
       refund: ECOM + '/refund/jsonschema/1-0-0',
       checkout: ECOM + '/checkout_step/jsonschema/1-0-0',
     },
     // XDM commerce eventTypes with a Snowplow ecommerce action. Adobe has no standard refund eventType.
     commerce: {
       'commerce.productViews': 'product_view', 'commerce.productListAdds': 'add_to_cart',
       'commerce.productListRemovals': 'remove_from_cart', 'commerce.checkouts': 'checkout_step',
       'commerce.purchases': 'transaction', 'commerce.refunds': 'refund',
     },
     // Your schema's paths, the same as FIELDS in the Web SDK mapping.
     slots: {
       plan: ['xdm._yourtenant.account.plan', 'xdm._yourtenant.user.plan'],
       group_id: ['xdm._yourtenant.account.id'],
       search_term: ['xdm._yourtenant.search.term', 'data.__adobe.analytics.prop3'],
     },
     searchQuery: ['xdm.siteSearch.query'],
     loginTypes: ['userAccount.login'],
     userNamespaces: ['CRMID'],
   };

   function get(o, path) {
     var parts = path.split('.');
     for (var i = 0; i < parts.length; i++) { if (o === undefined || o === null) return undefined; o = o[parts[i]]; }
     return o;
   }
   function str255(v) { return v === undefined || v === null || typeof v === 'object' ? undefined : String(v).slice(0, 255); }
   function num(v) { var n = typeof v === 'string' ? Number(v) : v; return typeof n === 'number' && isFinite(n) ? n : undefined; }
   function cents(v) { return Math.round((num(v) || 0) * 100) / 100; }
   function firstOf(content, paths) { for (var i = 0; i < paths.length; i++) { var v = str255(get(content, paths[i])); if (v !== undefined && v !== '') return v; } }
   function userIdOut(id) {
     if (id === undefined || id === null || id === '') return undefined;
     return String(id).slice(0, 255);
   }

   // The authenticated ID from identityMap. The Email namespace is never read.
   function crmId(xdm) {
     var map = (xdm && xdm.identityMap) || {};
     for (var i = 0; i < XDM2SP.userNamespaces.length; i++) {
       var ids = map[XDM2SP.userNamespaces[i]];
       if (ids && ids.length && ids[0].id) return ids[0].id;
     }
     return undefined;
   }

   function currencyOf(xdm) {
     var items = xdm.productListItems || [];
     var c = (xdm.commerce && xdm.commerce.order && xdm.commerce.order.currencyCode) || (items[0] && items[0].currencyCode);
     return typeof c === 'string' && /^[A-Za-z]{3}$/.test(c) ? c.toUpperCase() : 'USD';
   }

   // One product entity per productListItems entry.
   function toProducts(xdm) {
     var cur = currencyOf(xdm);
     return (xdm.productListItems || []).filter(function (it) { return it && it.SKU !== undefined; }).map(function (it) {
       var qty = Math.max(1, Math.round(num(it.quantity) || 1));
       var p = { id: String(it.SKU).slice(0, 4096), category: (it.productCategories && it.productCategories[0] && it.productCategories[0].categoryID) || 'unknown', price: cents((num(it.priceTotal) || 0) / qty), currency: cur, quantity: qty };
       if (it.name) p.name = String(it.name);
       return p;
     });
   }

   function externalData(content, kind) {
     var xdm = content.xdm || {};
     var items = xdm.productListItems || [];
     var first = items[0] || {};
     var order = (xdm.commerce && xdm.commerce.order) || {};
     var cur = order.currencyCode || first.currencyCode;
     var out = {
       name: String(xdm.eventType || 'unknown').slice(0, 255), tool: 'adobe', kind: kind || 'track',
       value: num(order.priceTotal !== undefined ? order.priceTotal : first.priceTotal),
       currency: typeof cur === 'string' && /^[A-Za-z]{3}$/.test(cur) ? cur.toUpperCase() : undefined,
       item_id: str255(first.SKU),
       item_category: str255(first.productCategories && first.productCategories[0] && first.productCategories[0].categoryID),
     };
     for (var k in XDM2SP.slots) if (out[k] === undefined) out[k] = firstOf(content, XDM2SP.slots[k]);
     for (var key in out) if (out[key] === undefined) delete out[key];
     return out;
   }

   // One XDM event -> what Snowplow should record, by the ladder: page_view, ecommerce action,
   // site_search, identify, then external_event for everything else.
   function classify(content) {
     var xdm = content.xdm || {};
     var type = xdm.eventType;
     if (type === 'web.webpagedetails.pageViews') return { as: 'page_view', title: get(xdm, 'web.webPageDetails.name') };
     var action = XDM2SP.commerce[type];
     var products = toProducts(xdm);
     if (action && (products.length || action === 'refund')) {
       var order = (xdm.commerce && xdm.commerce.order) || {};
       var cur = currencyOf(xdm);
       var total = cents(order.priceTotal !== undefined ? order.priceTotal : products.reduce(function (a, p) { return a + p.price * p.quantity; }, 0));
       var r = { as: 'ecommerce', type: action, products: products };
       if (action === 'transaction') r.transaction = { transaction_id: String(order.purchaseID || 'unknown'), revenue: total, currency: cur, payment_method: (order.payments && order.payments[0] && order.payments[0].paymentType) || 'unknown', total_quantity: products.reduce(function (a, p) { return a + p.quantity; }, 0) };
       // XDM carries the items added or removed, not the cart total, so total_value is the sum of those items.
       if (action === 'add_to_cart' || action === 'remove_from_cart') r.cart = { total_value: total, currency: cur };
       if (action === 'refund') r.refund = { transaction_id: String(order.purchaseID || 'unknown'), refund_amount: total, currency: cur };
       if (action === 'checkout_step') r.checkout = { step: 1 };
       return r;
     }
     var q = firstOf(content, XDM2SP.searchQuery);
     if (q) return { as: 'site_search', terms: [q] };
     var uid = userIdOut(crmId(xdm));
     if (XDM2SP.loginTypes.indexOf(type) > -1 && uid) return { as: 'identify', id: uid };
     return { as: 'external', data: externalData(content, 'track') };
   }

   function identityEntity(ecid, uid, eventName, eventId) {
     return { schema: XDM2SP.schemas.identity, data: { tool: 'adobe', anonymous_id: ecid ? String(ecid) : null, user_id: uid || null, session_id: null, session_number: null, event_id: eventId ? String(eventId).slice(0, 255) : null, event_name: eventName ? String(eventName).slice(0, 255) : null } };
   }

   // The same entities the Snowplow ecommerce plugin attaches: one product per item, then the
   // transaction, cart, refund or checkout_step entity.
   function ecommerceEntities(c) {
     var out = c.products.map(function (p) { return { schema: XDM2SP.schemas.product, data: p }; });
     if (c.transaction) out.push({ schema: XDM2SP.schemas.transaction, data: c.transaction });
     if (c.cart) out.push({ schema: XDM2SP.schemas.cart, data: c.cart });
     if (c.refund) out.push({ schema: XDM2SP.schemas.refund, data: c.refund });
     if (c.checkout) out.push({ schema: XDM2SP.schemas.checkout, data: c.checkout });
     return out;
   }

   // content: { xdm, data }. ctx: { ecid, ip, ua, url, refr, lastUserId }.
   function xdmToSp(content, ctx) {
     ctx = ctx || {};
     var xdm = content.xdm || {};
     var web = xdm.web || {};
     var page = web.webPageDetails || {};
     var uid = userIdOut(crmId(xdm) || ctx.lastUserId);
     var ts = Date.parse(xdm.timestamp);
     var out = {
       p: 'web', tv: XDM2SP.tv, aid: XDM2SP.aid,
       eid: xdm._id,
       dtm: isNaN(ts) ? undefined : String(ts),
       stm: String(Date.now()),
       duid: ctx.ecid, tnuid: ctx.ecid,
       uid: uid,
       ip: ctx.ip, ua: ctx.ua,
       url: page.URL || ctx.url,
       refr: (web.webReferrer && web.webReferrer.URL) || ctx.refr,
     };
     var vp = xdm.environment && xdm.environment.browserDetails;
     if (vp && vp.viewportWidth) out.vp = vp.viewportWidth + 'x' + vp.viewportHeight;
     var c = classify(content);
     var entities = [];
     var ue = null;
     if (c.as === 'page_view') { out.e = 'pv'; out.page = c.title; }
     else if (c.as === 'ecommerce') { ue = { schema: XDM2SP.schemas.action, data: { type: c.type } }; entities = ecommerceEntities(c); }
     else if (c.as === 'site_search') ue = { schema: XDM2SP.schemas.search, data: { terms: c.terms } };
     else if (c.as === 'identify') ue = { schema: XDM2SP.schemas.identify, data: { id: c.id } };
     else ue = { schema: XDM2SP.schemas.external, data: c.data };
     if (ue) { out.e = 'ue'; out.ue_pr = JSON.stringify({ schema: IGLU + '/unstruct_event/jsonschema/1-0-0', data: ue }); }
     entities.push(identityEntity(ctx.ecid, uid, xdm.eventType, xdm._id));
     if (entities.length) out.co = JSON.stringify({ schema: IGLU + '/contexts/jsonschema/1-0-1', data: entities });
     var clean = {};
     for (var key in out) if (out[key] !== undefined && out[key] !== null && out[key] !== '') clean[key] = String(out[key]);
     return clean;
   }

   function toPayload(events) { return { schema: IGLU + '/payload_data/jsonschema/1-0-4', data: events }; }
   ```

   </details>

   Then add these lines at the end of the data element:

   ```js
   var x = arc.event.xdm || {};
   var ecid = x.identityMap && x.identityMap.ECID && x.identityMap.ECID[0] && x.identityMap.ECID[0].id;
   var head = (arc.request && arc.request.head) || {};
   return JSON.stringify(toPayload([xdmToSp(arc.event, { ecid: ecid, ip: head.ip, ua: head.userAgent })]));
   ```

3. Install the Adobe Cloud Connector extension. Create a rule with a Make Fetch Call action that sends a `POST` to `https://<your collector>/com.snowplowanalytics.snowplow/tp2`, with the header `Content-Type: application/json` and the `snowplow body` data element as the body.

4. Publish the event forwarding library, then [check it works](#check-it-works).

### Warehouse history: Data Feeds

If you receive Adobe Analytics Data Feeds in your warehouse, you can turn them into batch attributes per visitor beside your live attributes. This needs a Signals warehouse connection.

1. Load the Data Feed `hit_data` files into a table in the warehouse Signals reads.

2. Build a model that aggregates the feed per ECID. This example counts visits, page views, product views and orders over 90 days, and keeps the latest account ID from `eVar5`. Change the eVar and event numbers to match your report suite, and the date functions to match your warehouse.

   ```sql
   WITH hits AS (
     SELECT *
     FROM hit_data
     WHERE exclude_hit = 0                      -- Adobe's own exclusion flag
       AND hit_source NOT IN (5, 7, 8, 9)       -- data sources and other non-hit rows
       AND mcvisid IS NOT NULL AND mcvisid <> ''
       AND date_time >= DATE('now', '-90 day')
   ),
   accounts AS (
     SELECT mcvisid, post_evar5,
            ROW_NUMBER() OVER (PARTITION BY mcvisid ORDER BY date_time DESC) AS rn
     FROM hits
     WHERE post_evar5 <> ''
   )
   SELECT
     h.mcvisid                                                                          AS adobe_ecid,
     COUNT(DISTINCT h.post_visid_high || '-' || h.post_visid_low || '-' || h.visit_num) AS visits_90d,
     SUM(CASE WHEN h.page_event = 0 THEN 1 ELSE 0 END)                                  AS page_views_90d,
     SUM(CASE WHEN (',' || h.post_event_list || ',') LIKE '%,2,%' THEN 1 ELSE 0 END)    AS product_views_90d,
     SUM(CASE WHEN (',' || h.post_event_list || ',') LIKE '%,1,%' THEN 1 ELSE 0 END)    AS orders_90d,
     MAX(a.post_evar5)                                                                  AS last_account_id,
     MAX(h.date_time)                                                                   AS last_seen
   FROM hits h
   LEFT JOIN accounts a ON a.mcvisid = h.mcvisid AND a.rn = 1
   GROUP BY h.mcvisid;
   ```

   In `post_event_list`, `1` is purchase, `2` is product view, and `200` to `299` are `event1` to `event100`.

3. In Signals, create a custom attribute key for the ECID, and add the model's output as a [batch source](/docs/signals/attributes/warehouse-config/index.md) on that key.

Warehouse attributes update periodically, so they can't trigger interventions.

## How Adobe events map to Snowplow

Every approach uses the same [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md): a standard Snowplow event wherever one fits, and `external_event` for the rest.

| Adobe event | Snowplow event |
|---|---|
| Web SDK `web.webpagedetails.pageViews`; AppMeasurement `s.t()`; data layer page event | `page_view` |
| Web SDK `commerce.productViews`; Analytics `prodView` | `snowplow_ecommerce_action`, type `product_view` |
| Web SDK `commerce.productListAdds`, `commerce.productListRemovals`; Analytics `scAdd`, `scRemove` | `snowplow_ecommerce_action`, type `add_to_cart` or `remove_from_cart`, with a `cart` entity |
| Web SDK `commerce.checkouts`; Analytics `scCheckout` | `snowplow_ecommerce_action`, type `checkout_step` |
| Web SDK `commerce.purchases`; Analytics `purchase` | `snowplow_ecommerce_action`, type `transaction`, with a `transaction` entity and one `product` entity per line |
| Any Web SDK event with `siteSearch.query`; your Analytics search event | `site_search` |
| Web SDK `userAccount.login` with a CRMID; an AppMeasurement hit with the user ID variable | `identify`, with `id` only |
| Everything else: link clicks, form events, your own event types and link names | `external_event`, `tool` set to `adobe` |

## Identifiers

| Adobe field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow visitor ID, client-side approaches | `domain_userid` | Yes. A random ID, safe on the public intervention endpoint |
| Snowplow session ID, client-side approaches | `domain_sessionid` | Yes, for session attributes |
| ECID | `external_identity.anonymous_id`; on event forwarding, also `domain_userid` | Only for reads from your own servers. Never on the public intervention endpoint |
| Authenticated ID: Web SDK `identityMap` CRMID, Visitor `setCustomerIDs`, or your user ID eVar | `user_id`, `external_identity.user_id` and `identify.id`, unchanged | Only for reads from your own servers |
| Adobe visit | Nothing | Adobe computes visits on its servers |

See [Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Troubleshooting

- **Adobe stops receiving an event:** the callback is throwing or returning `false`. Keep the `try` and `catch`, and return nothing.
- **The first events on a page aren't copied:** `snowplow-adobe.js` loaded after the Web SDK sent them. Load it first, or from a Library Loaded rule ordered before your first event.
- **Events arrive without `external_identity`:** the ECID wasn't available within 5 seconds. Check the `getIdentity` call in step 3.
- **Each event arrives twice:** your site runs both the Web SDK and AppMeasurement hooks. Keep one.
- **A value is missing from `external_event`:** add its XDM path, eVar or prop to your field map. Attributes read only the typed fields of `external_event`, and Adobe's own processing, such as eVar persistence and processing rules, isn't applied.

For how each approach handles consent and personal data, see [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

Where to go next:

- Build your first attributes from [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approaches, `domain_userid` stays the same, so attributes carry over.
- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
