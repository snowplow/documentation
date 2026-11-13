---
title: "Use Signals with Adobe Analytics and Adobe Experience Platform"
sidebar_label: "Adobe"
sidebar_position: 50
description: "Copy the events your Adobe Web SDK, AppMeasurement or Adobe Client Data Layer already sends into Snowplow, so Signals can compute attributes without retagging."
keywords: ["adobe analytics", "adobe experience platform", "web sdk", "appmeasurement", "event forwarding", "data feeds", "signals"]
date: "2026-11-13"
content_type: how-to
---

Copy the events your Adobe setup already sends into Snowplow, so Signals can compute visitor, session and account attributes from them without retagging your site.

## Find your Adobe setup

Most Adobe estates match one of these rows. Each links to the approach that fits it.

| Your setup | How you'll know | Use |
|---|---|---|
| Web SDK (alloy.js), deployed with Tags | `_satellite` and `alloy` exist on the page; the Tags property has the Adobe Experience Platform Web SDK extension | [Web SDK callback](#set-up-the-web-sdk-callback), in the extension settings |
| Web SDK (alloy.js), in page code | `alloy` exists on the page; you call `alloy('configure', ...)` yourself | [Web SDK callback](#set-up-the-web-sdk-callback), in your configure call |
| AppMeasurement (Adobe Analytics `s` object), with or without Tags | `s_gi` exists on the page; requests go to `/b/ss/` | [AppMeasurement callback](#set-up-the-appmeasurement-callback) |
| Adobe Client Data Layer and Tags rules | `adobeDataLayer` exists on the page; the Tags property has the Adobe Client Data Layer extension | [Tags rules on the data layer](#set-up-tags-rules-on-the-adobe-client-data-layer) |
| Web SDK or Mobile SDK, with event forwarding licensed | Your contract includes Real-Time CDP Connections, Prime or Ultimate | [Event forwarding](#set-up-event-forwarding) |
| Analytics history you want in Signals | You receive Analytics Data Feeds in a warehouse | [Data Feeds](#set-up-data-feeds-history) |

If your site runs both the Web SDK and AppMeasurement, pick one hook. Using both copies each event twice.

## Choose an approach

The three client-side approaches run the Snowplow JavaScript tracker beside your Adobe library and copy each event as Adobe sends it. Event forwarding runs on Adobe's servers. Data Feeds give you history in batches.

| | Web SDK callback | AppMeasurement callback | Tags rules on the data layer | Event forwarding | Data Feeds |
|---|---|---|---|---|---|
| Runs | Client-side | Client-side | Client-side | Server-side, in Adobe | Warehouse |
| What you change | One callback in the Web SDK configuration, plus a script that loads the Snowplow tracker | One callback on the `s` object, plus the same script and a map of your eVars and props | One Tags rule per event, with custom code | A data element and a rule in an event forwarding property | A SQL model in your warehouse and a batch source in Signals |
| Events covered | Every event the Web SDK sends from the browser, including its automatic link clicks | Every page view and link hit AppMeasurement sends from the browser, including exit and download links | Only the data layer events you write a rule for | Web SDK and Mobile SDK events that reach the Edge Network; not AppMeasurement | All Analytics hits in the feed, from every source Adobe processed |
| Visitor key | Snowplow `domain_userid`, a random UUID | Snowplow `domain_userid` | Snowplow `domain_userid` | The Adobe ECID | The Adobe ECID (`mcvisid`) |
| Sessions and engagement | Snowplow sessions; engagement if you turn on page pings | Snowplow sessions; engagement with page pings | Snowplow sessions; engagement with page pings | No sessions, no engagement | Adobe visit counts as batch values; no live sessions |
| Delivery | From the browser as each event fires | From the browser as each hit fires | From the browser as each rule fires | After the Edge Network processes the event | On the schedule of your feed and model |
| Personal data path | Browser to your Collector: IP, user agent, URLs, user ID; a same-site Collector also receives Adobe cookies | Same as the Web SDK callback | Same, and the full data layer state stays readable by every rule | Everything in the event stays inside Adobe's event forwarding runtime; your Collector receives what your data element builds | The full feed lands in your warehouse; Signals reads only the columns your model outputs |
| Plan or license needed | Web SDK | AppMeasurement | Tags and the Adobe Client Data Layer extension | Real-Time CDP Connections, Prime or Ultimate | Data Feeds and a Signals warehouse connection |

Choose a client-side approach if:

- You want attributes that update while the visitor is still on the page, or session and engagement attributes.
- You want to target interventions at visitors. The Snowplow visitor ID is random and safe to use on the public intervention endpoint.
- You plan to move to native Snowplow tracking later. The visitor ID stays the same when you do.

Among the client-side approaches, use the Web SDK callback on a Web SDK site and the AppMeasurement callback on an AppMeasurement site. Use Tags rules on the data layer only when your site has an Adobe Client Data Layer and you'd rather maintain Tags rules than a callback.

Choose event forwarding if:

- You already hold the license and can't add a script to the browser.
- You need events from the Adobe Mobile SDK, which no client-side approach here covers.
- You accept visitor and account attributes only, keyed on the ECID, with no sessions.

Add Data Feeds if you want attributes that cover visitors' history from before you set up Signals. Use them beside a live approach, not instead of one, because warehouse values can't trigger interventions on their own.

## Before you begin

You need:

- A Snowplow pipeline with Signals enabled, and its Collector URL.
- Access to change your Adobe setup: the Tags property, the page code that configures the Web SDK or AppMeasurement, or the event forwarding property.
- A list of where your Adobe data holds the user ID, plan, account ID and search term: the eVars and props in your report suite, or the fields in your XDM schema. The adapter reads only the fields you name.
- Your consent setup: the Web SDK `defaultConsent` and `setConsent` calls, the ECID opt-in service, or your consent management platform.

Every approach uses these two schemas, published on Iglu Central. If you register your own copies, deploy them to production before you send any events.

- `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0`, described in [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).
- `iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0`, described in [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

The other schemas the adapter uses (`snowplow_ecommerce_action` 1-0-2 with its `product`, `transaction`, `cart`, `refund` and `checkout_step` entities, `identify` 1-0-0 and `site_search` 1-0-0) resolve from Iglu Central.

## Set up the client-side approaches: shared steps

The Web SDK callback, the AppMeasurement callback and the Tags rules all load the same script. It starts the Snowplow tracker with the ecommerce plugin and gives you helper functions that send one Snowplow event per Adobe event, with the `external_identity` entity attached.

1. Host the Snowplow JavaScript tracker and the Snowplow ecommerce plugin where your pages can load them. These steps use version 4.10.3 of both.

2. Add this script to your pages, or to your Tags library, so that it runs before your Adobe library sends its first event. Set `collector` to your Collector URL and `appId` to your app ID.

   <details>
   <summary>snowplow-adobe.js: tracker loader and helpers</summary>

   ```js
   (function () {
     var cfg = (window.snowplowAdobe = window.snowplowAdobe || {});
     cfg.collector = cfg.collector || 'https://collector.example.com';
     var IDENTITY = 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0';
     var EXTERNAL = 'iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0';
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
       if (!id) return [];
       return [{ schema: IDENTITY, data: { tool: 'adobe', anonymous_id: String(id), user_id: uid || null,
         session_id: null, session_number: null, event_name: eventName ? String(eventName).slice(0, 255) : null } }];
     }
     // On a first visit the ECID exists only after Adobe's first response, so events wait for it
     // (up to 5 seconds) rather than go out without the external_identity entity.
     var held = [], timer = null;
     function emit(eventName, send) {
       var uid = cfg.userId;
       if (held.length || (cfg.vendorId && !cfg.vendorId())) {
         held.push(function () { send(identity(eventName, uid)); });
         if (!timer) timer = setTimeout(flush, 5000);
         return;
       }
       send(identity(eventName, uid));
     }
     function flush() { clearTimeout(timer); timer = null; var h = held; held = []; h.forEach(function (f) { f(); }); }
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
       // A product view keeps every item: the first as the viewed product, the rest as product entities.
       ecommerce: function (name, c) {
         emit(name, function (ctx) {
           var ps = c.products;
           if (c.type === 'product_view') snowplow('trackProductView', Object.assign({}, ps[0], { context: productEntities(ps.slice(1)).concat(ctx) }));
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
         var s = String(id);
         // Email-shaped IDs never reach Snowplow.
         cfg.userId = s.indexOf('@') > -1 ? null : s;
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

3. If you want engagement attributes, turn on page pings after `newTracker`:

   ```js
   snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
   ```

4. Gate the Snowplow tracker on the same consent signal as Adobe. The helpers only send when your Adobe hook fires, and the hooks follow Adobe's consent, but the tracker sets its own cookies when it loads. Load this script only once your consent management platform allows analytics, or configure the tracker's cookies to match your consent policy.

5. Choose a Collector domain. A Collector on the same site as your pages receives every first-party cookie, including Adobe's `kndctr_*`, `AMCV_*`, `AMCVS_*` and `s_cc` cookies. If that's not acceptable, use a Collector on another site.

Then follow the section for your Adobe library.

## Set up the Web SDK callback

The Web SDK calls `onBeforeEventSend` with each event just before it sends it. The callback below copies the event into Snowplow and lets Adobe's request continue unchanged.

1. Add the field map and the mapping function to `snowplow-adobe.js`, after the helpers. Replace the paths in `FIELDS` with the paths in your own XDM schema. Tenant fields start with your tenant ID, such as `xdm._yourtenant`.

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

2. Tell the helpers how to read the ECID. Call `getIdentity` once after your first `sendEvent` resolves, then release any events that were waiting for it. Use your Web SDK instance name; it's `alloy` by default.

   ```js
   var ecid = null;
   window.snowplowAdobe.vendorId = function () { return ecid; };
   function fetchEcid() {
     alloy('getIdentity', { namespaces: ['ECID'] }).then(function (r) {
       ecid = r.identity.ECID;
       window.snowplowAdobe.idReady();
     });
   }
   // For example, after the first page view:
   // alloy('sendEvent', { xdm: { ... } }).then(function () { if (!ecid) fetchEcid(); });
   ```

3. Add the callback. Where you add it depends on how you deploy the Web SDK.

   If you configure the Web SDK in page code, add `onBeforeEventSend` to your `configure` call:

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

   If you deploy the Web SDK with Tags, open the Adobe Experience Platform Web SDK extension settings and add the same body as the on before event send callback code. The extension provides the event as `content`:

   ```js
   try { if (window.snowplowAdobe && window.snowplowAdobe.mirrorXdm) window.snowplowAdobe.mirrorXdm(content); } catch (e) {}
   ```

   If you already have callback code there, add these lines to it. Don't return `false`: that cancels the event for Adobe as well.

4. Make sure `snowplow-adobe.js` loads before the Web SDK sends its first event. On Tags, either add it as a script tag above your Tags embed code, or load it from a rule that fires on Library Loaded and is ordered before the rule that sends your first event. Events sent before it loads are not copied.

5. Publish your Tags library or deploy your page code, then [check it works](#check-it-works).

:::tip
Check the callback in a development library with the Adobe Experience Platform Debugger before you publish: Adobe should still receive every event, and each one should reach your Collector.
:::

## Set up the AppMeasurement callback

AppMeasurement calls the function you pass to `s.registerPreTrackCallback` with the final request URL of every `s.t()` and `s.tl()` call. The callback below reads that URL and sends the matching Snowplow event. AppMeasurement's own request is unchanged.

1. Write down which eVars, props and events hold the user ID, plan, account ID and search term. Your report suite's variable list has them. In the request URL, `eVar1` appears as `v1` and `prop3` as `c3`.

2. Add the mapping to `snowplow-adobe.js`, after the helpers. Set `MAP` to your variables.

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

3. Register the callback on your `s` object and tell the helpers how to read the ECID from your Visitor instance:

   ```js
   var visitor = Visitor.getInstance('YOUR_ORG_ID@AdobeOrg', { trackingServer: 'metrics.example.com' });
   var s = s_gi('yourreportsuite');
   s.visitor = visitor;
   s.registerPreTrackCallback(function (url) {
     try { window.snowplowAdobe.mirrorAm(url); } catch (e) {}
   });
   window.snowplowAdobe.vendorId = function () { return visitor.getMarketingCloudVisitorID(); };
   ```

   If your `s` object already has a Visitor instance, use that one rather than creating another.

4. Deploy the change, then [check it works](#check-it-works).

:::note
If Tags deploys AppMeasurement through the Adobe Analytics extension, register the callback in the extension's custom code for configuring the tracker.
:::

## Set up Tags rules on the Adobe Client Data Layer

If your site pushes events to the Adobe Client Data Layer (`adobeDataLayer`), you can fire Snowplow events from Tags rules on those pushes. This works whichever Adobe library you run, but you write one rule per event.

1. Add `snowplow-adobe.js` to your Tags library, as in the [shared steps](#set-up-the-client-side-approaches-shared-steps). There is no Snowplow extension for Tags, so rules call the helpers from custom code.

2. In the Adobe Client Data Layer extension, create data elements that read named paths from the data layer's computed state, such as `page.name`, `user.id`, `account.id` and `account.plan`. Read named fields only. The computed state keeps every field ever pushed, including emails.

3. Create one rule per data layer event. Use the extension's Data Pushed event for that specific event name, and a Core Custom Code action that calls a helper. The pushed object is `event.message`. For example:

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

   Adjust the field names to match your data layer.

4. If you want link clicks, turn on the Snowplow tracker's own link tracking. The data layer has none unless your site pushes them.

5. Publish your Tags library, then [check it works](#check-it-works).

These rules don't read the ECID, so their events carry no `external_identity` entity unless you also set `window.snowplowAdobe.vendorId` from your Adobe library, as in the Web SDK or AppMeasurement sections.

## Set up event forwarding

Event forwarding runs a rule on Adobe's servers for each Web SDK or Mobile SDK event that reaches the Edge Network. The setup below builds a Snowplow tracker protocol request from each event and posts it to your Collector. Nothing changes in the browser or the app.

1. Confirm that your contract includes event forwarding. Adobe includes it with Real-Time CDP Connections, Prime and Ultimate.

2. In your event forwarding property, create a Core Custom Code data element, for example `snowplow body`. Paste in the Adobe-to-Snowplow converter, followed by these lines:

   ```js
   var x = arc.event.xdm || {};
   var ecid = x.identityMap && x.identityMap.ECID && x.identityMap.ECID[0] && x.identityMap.ECID[0].id;
   var head = (arc.request && arc.request.head) || {};
   return JSON.stringify(toPayload([xdmToSp(arc.event, { ecid: ecid, ip: head.ip, ua: head.userAgent })]));
   ```

   The converter applies the same mapping as the Web SDK callback. It has no dependencies, because event forwarding custom code has no `require`, and it hashes an email-shaped user ID with SHA-256 rather than sending it.

3. Install the Adobe Cloud Connector extension. Create a rule with a Make Fetch Call action that sends a `POST` to `https://<your collector>/com.snowplowanalytics.snowplow/tp2`, with the header `Content-Type: application/json` and the `snowplow body` data element as the body.

4. Publish the event forwarding library, then [check it works](#check-it-works).

:::caution
Adobe documents the `arc` object that event forwarding passes to custom code, with the event in `arc.event` and request details in `arc.request`. Log `arc` in a development property to check where your events hold the ECID, IP address and user agent before you publish. Adobe documents a 30-second processing timeout per event.
:::

## Set up Data Feeds history

If you receive Adobe Analytics Data Feeds in your warehouse, you can turn them into batch attributes per visitor and serve them from Signals beside your live attributes.

1. Load the Data Feed `hit_data` files into a table in the warehouse Signals reads.

2. Build a model that aggregates the feed per ECID. This example counts visits, page views, product views and orders over 90 days, and keeps the last account ID from `eVar5`. Change the eVar and event numbers to match your report suite.

   ```sql
   WITH hits AS (
     SELECT *
     FROM hit_data
     WHERE exclude_hit = 0                      -- Adobe's own exclusion flag
       AND hit_source NOT IN (5, 7, 8, 9)       -- data sources and other non-hit rows
       AND mcvisid IS NOT NULL AND mcvisid <> ''
   )
   SELECT
     mcvisid                                                                      AS adobe_ecid,
     COUNT(DISTINCT post_visid_high || '-' || post_visid_low || '-' || visit_num) AS visits_90d,
     SUM(CASE WHEN page_event = 0 THEN 1 ELSE 0 END)                              AS page_views_90d,
     SUM(CASE WHEN (',' || post_event_list || ',') LIKE '%,2,%' THEN 1 ELSE 0 END) AS product_views_90d,
     SUM(CASE WHEN (',' || post_event_list || ',') LIKE '%,1,%' THEN 1 ELSE 0 END) AS orders_90d,
     MAX(CASE WHEN post_evar5 <> '' THEN post_evar5 END)                          AS last_account_id,
     MAX(date_time)                                                               AS last_seen
   FROM hits
   WHERE date_time >= DATE('now', '-90 day')
   GROUP BY mcvisid;
   ```

   In `post_event_list`, Adobe uses numeric IDs: `1` is purchase, `2` is product view, and `200` to `299` are `event1` to `event100`. Date functions differ by warehouse; rewrite `DATE('now', '-90 day')` for yours.

3. In Signals, create a custom attribute key for the ECID, and add the model's output as a [batch source](/docs/signals/attributes/warehouse-config/index.md) on that key.

:::caution
Batch sources need a warehouse connection, which is not on the free tier.
:::

## Check it works

Point the Collector URL at [Snowplow Micro](/docs/testing/snowplow-micro/index.md) while you test, or watch your development pipeline. Then click through a page view, a product view, a purchase and a login, and check:

- `/micro/bad` is empty. If an `external_event` or `external_identity` row is there, the schemas aren't registered, or the events were sent before the schemas were deployed.
- Page views arrive as `page_view` events, one per Adobe page view, including single-page app views.
- Product views and orders arrive as `snowplow_ecommerce_action` events, with one `product` entity for every line of the order and a `transaction` entity.
- Logins arrive as `identify` events with `id` only. `user_id` is set from the login onward.
- Other events arrive as `external_event`, with `name` set to the XDM `eventType`, the link name or the data layer event.
- Every event from the Web SDK, AppMeasurement and event forwarding carries `external_identity`, with the ECID in `anonymous_id`.
- On the client-side approaches, `domain_userid` and `domain_sessionid` are UUIDs. On event forwarding, `domain_userid` is the ECID and `domain_sessionid` is empty.
- No email address appears anywhere in the rows. Search the output for `@`.

In the Adobe Experience Platform Debugger, check that Adobe still receives every event. If an event goes missing for Adobe, your callback is throwing.

For Data Feeds, run the model and check the row counts against Adobe Analytics for the same 90 days. Adobe's reports apply processing the raw feed doesn't, so expect small differences.

## How Adobe events map to Snowplow

Every approach uses the same order: a standard Snowplow event wherever one fits, and `external_event` for the rest. [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) explains why.

| Adobe event | Snowplow event | Notes |
|---|---|---|
| Web SDK `web.webpagedetails.pageViews`; AppMeasurement `s.t()`; data layer page event | `page_view` | Title from `web.webPageDetails.name` or `pageName` |
| Web SDK `commerce.productViews`; Analytics `prodView` | `snowplow_ecommerce_action`, type `product_view` | Every item kept: the first as the viewed product, the rest as `product` entities |
| Web SDK `commerce.productListAdds`, `commerce.productListRemovals`; Analytics `scAdd`, `scRemove` | `snowplow_ecommerce_action`, type `add_to_cart` or `remove_from_cart`, with a `cart` entity | `cart.total_value` is the sum of the items in the event, because Adobe sends no cart total |
| Web SDK `commerce.checkouts`; Analytics `scCheckout` | `snowplow_ecommerce_action`, type `checkout_step` | Step is always 1 |
| Web SDK `commerce.purchases`; Analytics `purchase` | `snowplow_ecommerce_action`, type `transaction`, with a `transaction` entity and one `product` entity per line | Payment method from `commerce.order.payments`; `unknown` on AppMeasurement, whose hits don't carry it |
| Web SDK `commerce.refunds`, if your schema uses it | `snowplow_ecommerce_action`, type `refund`, with a `refund` entity | Adobe has no standard refund event type |
| Any Web SDK event with `siteSearch.query`; your Analytics search event with its search variable | `site_search` | |
| Web SDK `userAccount.login` with a CRMID; any AppMeasurement link hit with the user ID variable | `identify`, with `id` only | Never the email. An email-shaped ID becomes `external_event` with kind `identify` and no ID |
| Everything else: link clicks, form events, account events, your own event types and link names | `external_event`, `tool` set to `adobe` | `name` is the XDM `eventType`, the `s.tl` link name, `exit_link` or `download_link`. Plan, account and search term come from your field map |

## Identifiers

| Adobe field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow visitor ID (`_sp_id` cookie), client-side approaches only | `domain_userid` | Yes. A random UUID, safe on the public intervention endpoint |
| Snowplow session ID, client-side approaches only | `domain_sessionid` | Yes, for session attributes |
| ECID (`kndctr_<org>_identity` cookie for the Web SDK, `AMCV_<org>` for the Visitor service, `mcvisid` in Data Feeds) | `external_identity.anonymous_id`; on event forwarding, also `domain_userid` and `network_userid` | Server-side reads only. Adobe derives it from your org ID and the Audience Manager user ID and doesn't document how random it is, so don't use it on the public intervention endpoint |
| Authenticated ID: Web SDK `identityMap` CRMID, Visitor `setCustomerIDs`, or your user ID eVar | `user_id`, `external_identity.user_id` and `identify.id` | Server-side reads only. It is chosen by you and can be guessed |
| Adobe visit (`visit_num`, Customer Journey Analytics sessions) | Nothing | Adobe computes visits on its servers. Neither library sends a session ID |
| Email in `identityMap`, context data or eVars | Nothing | Never read by the adapter |
| Customer ID hash in the `AMCV` cookie | Nothing | Reaches a same-site Collector in the cookie header |
| XDM `eventType`, link name or data layer event | `external_identity.event_name`, and `external_event.name` | Lets you trace each row back to the Adobe event |
| Snowplow identity resolution (`snowplow_id`) | `snowplow_id` | With Snowplow Identities, stream attribute groups keyed on `snowplow_id` can be read by `domain_userid` or `user_id` |

[Identifiers and attribute keys](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) explains which keys are safe where. [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) covers where each identifier travels.

## Starter attribute groups

The [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) work on Adobe data, with these differences:

- **Visitor activity** works on every approach. UTM attributes need the campaign attribution enrichment on your pipeline.
- **Purchase intent** works on every approach except Data Feeds. Payment method is `unknown` on the AppMeasurement callback.
- **Account and plan** read `external_event.plan` and `group_id` from your field map. A plan sent only on the login hit is lost, because `identify` holds the ID only. Send the plan on another event too.
- **Session engagement** needs a client-side approach and page pings turned on. Key it on `domain_sessionid`.
- **Adobe history** is an Adobe-only group from Data Feeds: visits, page views, product views and orders in 90 days, and last account, on a custom ECID key.

## Limits

All approaches:

1. **Adobe's server-side processing is not reproduced.** The hooks see each event as the browser sends it. eVar persistence and allocation, processing rules, VISTA rules, marketing channels, bot filtering and classifications are applied later by Adobe, so attributes read raw values.
2. **Attributes read only declared fields.** Signals rejects attributes on properties a schema doesn't declare, so events without a standard Snowplow schema keep only the typed fields of `external_event`. The field map is yours to set.
3. **Duplicates count once.** If an event reaches the pipeline twice with the same `event_id`, Signals counts it once.

Web SDK callback:

1. **An exception in the callback stops the event for Adobe too.** Keep the `try` and `catch`, and never return `false`.
2. **Events held for consent replay late.** With consent pending, the Web SDK holds events and sends them at the grant, all with the page URL and device time of the grant. With consent refused, events are dropped and never sent.
3. **The first event of each page waits for the ECID**, for up to 5 seconds, then goes without the `external_identity` entity.
4. **The user ID lasts for the page, not across a reload.** It is set again on the next event that carries it.

AppMeasurement callback:

1. **The variable map is per report suite.** eVar and prop meanings differ, so you configure them.
2. **Context data is ignored**, by design, because that's where emails often sit. If a value you need is only in context data, copy it to an eVar or prop.
3. **No payment method**, because Analytics hits don't carry one.
4. **Events held for the ECID opt-in replay late**, as on the Web SDK.

Tags rules on the data layer:

1. **Only events you write a rule for are sent.** There's no Snowplow extension for Tags, so every rule is custom code.
2. **No ECID** unless you add it from your Adobe library.
3. **The computed state holds everything ever pushed**, emails included. Rules must read named fields only.

Event forwarding:

1. **No sessions or engagement.** Session attributes and page pings need the Snowplow tracker in the browser.
2. **The visitor key is the ECID.** Adobe doesn't document how random it is, so don't use it on the public intervention endpoint.
3. **The user ID appears only on events that carry it** in `identityMap`, not on the rest of the page.
4. **Event IDs are assigned by the pipeline** when the event has no `xdm._id`, so a resend arrives with a new ID.
5. **Web SDK and Mobile SDK only.** AppMeasurement traffic doesn't reach the Edge Network.

Data Feeds:

1. **Periodic, and can't trigger interventions on their own.**
2. **Keyed on the ECID**, and attributes keyed on `snowplow_id` are stream-only, so Identities can't merge this history into them.
3. **Needs a warehouse connection**, which is not on the free tier.

Where to go next:

- [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approaches, `domain_userid` stays the same, so attributes carry over.
- Read the [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) references.
- Define [interventions](/docs/signals/interventions/index.md) keyed on `domain_userid`.
