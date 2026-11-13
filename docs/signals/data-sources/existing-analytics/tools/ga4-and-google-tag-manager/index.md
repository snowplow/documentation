---
title: "Use Signals with Google Analytics 4 and Google Tag Manager"
sidebar_label: "Google Analytics 4 and Google Tag Manager"
sidebar_position: 30
description: "Send the events your site already sends to Google Analytics 4 into Snowplow, through Google Tag Manager, a page script or server-side Google Tag Manager, and build Signals attributes on them."
keywords: ["ga4", "google analytics 4", "google tag manager", "server-side gtm", "external_event", "signals"]
date: "2026-11-13"
content_type: how-to
---

Use the events your site already sends to Google Analytics 4 (GA4) in Signals, by adding Snowplow tags to your Google Tag Manager (GTM) container or to your server-side GTM container.

:::note[Schemas]
This integration uses two schemas published on Iglu Central, `com.snowplowanalytics.snowplow/external_event` and `com.snowplowanalytics.snowplow/external_identity`. If you register your own copies, deploy them to production before you send any events.
:::

## Choose an approach

There are two client-side approaches, one server-side approach and one warehouse approach. The client-side approaches run the Snowplow JavaScript tracker next to GA4 in the browser. The server-side approach forwards the GA4 hits your server-side GTM container already receives.

| | Client-side: GTM tag templates | Client-side: page script | Server-side: server-side GTM | Warehouse: GA4 BigQuery export |
|---|---|---|---|---|
| What you change | Tags, triggers and two variables in your web GTM container | One script added to your pages | One tag in your server-side GTM container | A scheduled query in BigQuery and a Signals batch source |
| Events covered | Browser events in your data layer, plus Snowplow's own page pings and link clicks if you turn them on | Browser `gtag()` calls, plus Snowplow's own page views, page pings, link clicks, form and site search tracking | Every GA4 event that reaches server-side GTM, including Enhanced Measurement and any server or app events you route there | Everything in your GA4 export, as history |
| Visitor key | Snowplow's random `domain_userid` | Snowplow's random `domain_userid` | The GA client ID | The GA client ID (`user_pseudo_id`) |
| Sessions and engagement | Yes, Snowplow sessions and page pings | Yes, Snowplow sessions and page pings | No Snowplow sessions | Aggregates only, no live sessions |
| Delivery | As each event happens | As each event happens | After gtag batches its hits, then through server-side GTM | Periodic batches |
| Personal data path | Browser to your Collector. Only the fields you map are sent | Browser to your Collector. Only the fields the script maps are sent, plus form field values if you turn on form tracking | Browser to server-side GTM, which sees every GA4 parameter, then to your Collector | Stays in your warehouse |
| Plan or license needed | GTM (free). A Signals-enabled Snowplow pipeline | A Signals-enabled Snowplow pipeline | A server-side GTM container you host. A Signals-enabled Snowplow pipeline | GA4 BigQuery export turned on. A Signals warehouse connection, which isn't available on the free tier |

Choose client-side with GTM tag templates if:

- you already manage GA4 through a web GTM container
- you want session and engagement attributes, or interventions sent to the visitor's browser

Choose client-side with the page script if:

- you use `gtag()` directly and don't have GTM, or can't change the GTM container

Choose server-side GTM if:

- you already run server-side GTM and can't change the web container or the page
- visitor-level and account-level attributes, read from your own servers, are enough

Add warehouse history if:

- you want attributes for visitors from before you connected Snowplow, such as 90-day purchase counts

You can combine approaches. For example, run the GTM tag templates for live attributes and add the warehouse export for history.

## Before you begin

You need:

- GA4 on your site, through GTM or through `gtag.js`
- a Snowplow Collector URL for a pipeline with Signals enabled
- the `external_event` and `external_identity` schemas, from Iglu Central or as your own copies deployed to production. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md)
- for the server-side approach, a running server-side GTM container that receives your GA4 hits through the GA4 client
- for the warehouse approach, the GA4 BigQuery export turned on, and a Signals warehouse connection to BigQuery

Every other schema used on this page, including the Snowplow ecommerce schemas and the Google schemas, is on Iglu Central.

## Set up with GTM tag templates (client-side)

This approach adds Snowplow's tag templates to the GTM container that already sends your GA4 events. The Snowplow tags fire on the same data layer pushes as your GA4 tags, so you don't change any page code. For the templates themselves, see [Snowplow Google Tag Manager templates](/docs/sources/google-tag-manager/index.md).

1. **Add the templates.** From the GTM Community Template Gallery, add the **Snowplow v4** tag, the **Snowplow v4 Settings** variable and the **Snowplow Ecommerce** tag to your container.

2. **Create the settings variable.** Create a **Snowplow v4 Settings** variable. Set **Collector Endpoint Hostname** to your Collector, set an app ID, and under **Predefined Contexts** select **webPage** and **session**.

3. **Create the identity variable.** This Custom JavaScript variable reads the GA client ID and session from the `_ga` cookies and builds the `external_identity` entity, so you can join Snowplow data back to GA4 later. Name it `CJS - external_identity`. Replace the measurement ID with yours, and create a Data Layer Variable `DLV - user_id` for the `user_id` key your site pushes.

   ```js
   function () {
     var MEASUREMENT_ID = 'G-XXXXXXXXXX';
     var jar = {};
     document.cookie.split(/;\s*/).forEach(function (c) {
       var i = c.indexOf('=');
       if (i > 0) jar[c.slice(0, i)] = c.slice(i + 1);
     });
     if (!jar._ga) return [];
     var parts = jar._ga.split('.');
     if (parts.length < 4) return [];
     var data = { tool: 'ga4', anonymous_id: parts.slice(-2).join('.') };
     var s = jar['_ga_' + MEASUREMENT_ID.replace(/^G-/, '')];
     var m = s && (/^GS2\.\d+\.s(\d+)\$o(\d+)/.exec(s) || /^GS1\.\d+\.(\d+)\.(\d+)/.exec(s));
     if (m) { data.session_id = m[1]; data.session_number = Number(m[2]); }
     if ({{DLV - user_id}}) data.user_id = String({{DLV - user_id}});
     if ({{Event}} && {{Event}}.indexOf('gtm.') !== 0) data.event_name = {{Event}};
     return [{ schema: 'iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0', data: data }];
   }
   ```

   On every Snowplow tag you create below, open **Additional Tracking Parameters**, then **Add Custom Context Entities**, and add `{{CJS - external_identity}}` in the **Context Entities** column.

4. **Add page views.** Create a **Snowplow v4** tag with **Tag Type** set to **Page View**. Fire it on a **Window Loaded** trigger, and on a **History Change** trigger if your site changes pages with `history.pushState`.

   :::note
   Use **Window Loaded**, not **All Pages**. On a first visit, `gtag.js` hasn't set the `_ga` cookie yet when **All Pages** fires, so the first page view would have no `external_identity`.
   :::

   To collect engagement, open **Page View Configuration** on the same tag and turn on **Enable Page Activity Tracking**. This sends page pings, which Signals uses for time-engaged attributes.

5. **Add site search.** Create a **Snowplow v4** tag with **Tag Type** set to **Site Search**, with a `terms` parameter set to a variable holding the search term. Fire it on your GA4 `search` or `view_search_results` event, or on page views whose URL has your search parameter.

6. **Add ecommerce.** Create a Custom JavaScript variable named `CJS - snowplow_ecommerce_arg` that turns the GA4 `ecommerce` object into the argument the Snowplow Ecommerce tag expects. It keeps every item in the order as a product. Create a Data Layer Variable `DLV - ecommerce` (Data Layer Version 2) for the `ecommerce` key first.

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

   Then create one **Snowplow Ecommerce** tag per GA4 ecommerce event you send. In each, set **Ecommerce API** to **Snowplow Ecommerce**, set **Ecommerce Function** to the matching function, and set **Ecommerce Argument** to `{{CJS - snowplow_ecommerce_arg}}`.

   | GA4 event (trigger) | Ecommerce Function |
   |---|---|
   | `view_item` | Track Product View |
   | `add_to_cart` | Track Add To Cart |
   | `remove_from_cart` | Track Remove From Cart |
   | `begin_checkout` | Track Checkout Step |
   | `purchase` | Track Transaction |
   | `refund` | Track Refund |

   :::caution[Add the ecommerce plugin once]
   Don't use the tag's **Google Analytics 4 Ecommerce** mode. It attaches no custom entities, so it can't carry `external_identity`, and it drops options such as the payment method.

   Make sure the ecommerce plugin is added only once per page. If every ecommerce tag adds it, tracker version 4.10.3 replays earlier ecommerce commands each time the plugin loads again, and a purchase also resends the earlier product view. Add the plugin on the first ecommerce tag only, and set **Snowplow Ecommerce Plugin Library** to **Do not add** on the rest.
   :::

7. **Add login.** Create a **Snowplow v4** tag with **Tag Type** set to **[Custom Command]**, with the command `setUserId` and the argument `{{DLV - user_id}}`. Then create a **Self-describing Event** tag with **Schema URL** `iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0` and one parameter, `id`, set to `{{DLV - user_id}}`. Fire both on your `login` event. Never map an email address here.

8. **Add your other events.** For GA4 events that have no Snowplow equivalent, create a **Snowplow v4** tag with **Tag Type** set to **Self-describing Event** and **Schema URL** `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0`. Add these parameters:

   | Parameter name | Parameter value |
   |---|---|
   | `name` | `{{Event}}` |
   | `tool` | `ga4` |
   | `kind` | `track`, or `group` for `join_group` |
   | `plan` | a Data Layer Variable for `plan`, if you send it |
   | `group_id` | a Data Layer Variable for `group_id`, if you send it |
   | `item_id`, `item_category`, `search_term`, `currency` | Data Layer Variables, if your events carry them |

   Fire it on a Custom Event trigger that matches the event names you want, for example the regular expression `^(join_group|signup_form_submitted)$`. Only list events with no better rung on the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md). For GA4 recommended events that have a Google schema, such as `sign_up` and `generate_lead`, create a Self-describing Event tag with that Google schema instead. See [How GA4 events map to Snowplow](#how-ga4-events-map-to-snowplow).

9. **Set consent.** On each Snowplow tag, set the consent checks to match your consent management platform and Google Consent Mode setup. With analytics storage denied there is no `_ga` cookie, so `external_identity` is left off.

10. **Preview and publish.** Use GTM Preview to check that each tag fires once per event, then publish the container.

## Set up with the page script (client-side)

This approach suits sites that call `gtag()` directly without GTM. A script on the page wraps `dataLayer.push`, which `gtag()` writes to, and sends each GA4 call through the Snowplow JavaScript tracker. Because `gtag()` doesn't call `dataLayer.push` for its own single-page-app page views or Enhanced Measurement, the script also turns on Snowplow's own page view, page ping, link click, form and site search tracking.

1. **Load the tracker and the ecommerce plugin.** Add the standard Snowplow JavaScript tracker tag snippet (these steps use version 4.10.3), then this, before the GA4 snippet, with your Collector URL.

   ```js
   snowplow('newTracker', 'sp1', 'https://collector.example.com', {
     appId: 'my-site', platform: 'web',
     contexts: { webPage: true, session: true }
   });
   snowplow('addPlugin:sp1', 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@4.10.3/dist/index.umd.min.js',
     ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']);
   ```

2. **Turn on Snowplow's own tracking.** This replaces what GA4 collects outside `gtag()` calls: engagement, outbound and file clicks, and form interactions.

   ```js
   snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
   snowplow('enableLinkClickTracking', { pseudoClicks: true, trackContent: false });
   snowplow('enableFormTracking', { options: { fields: { denylist: ['email', 'phone'] } } });
   ```

   :::caution[Form tracking sends field values]
   Form tracking sends the values people type, except for fields you denylist, so a field such as a company name reaches your Collector unless you list it. List every field that can hold personal data, or leave form tracking off.
   :::

3. **Send single-page-app page views.** Wrap `history.pushState` so each route change sends a page view, and a site search when the URL has a search term.

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

4. **Mirror each `gtag()` call.** The script maps each GA4 event with the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) and attaches `external_identity`. `send` waits until `gtag.js` has set the `_ga` cookie, for up to 3 seconds, so the GA client ID is available.

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

   This is an excerpt: `send`, `ctx`, `L` (the `ladder.js` mapping file) and `userId` come from the rest of the script. The script handles `gtag('config', ...)` as a page view, `gtag('set', {user_id})` as `setUserId`, and `gtag('event', ...)` through `handleEvent`. It skips `gtag('set', 'user_properties', ...)`. Because `gtag.js` replaces `dataLayer.push` when it loads, the script keeps its hook in place with a property setter.

5. **Gate it on consent.** The script doesn't read Google Consent Mode, so with consent denied it still sets Snowplow cookies and sends every event. Load it, or call `newTracker`, only after your consent management platform grants analytics consent.

## Set up with server-side GTM (server-side)

This approach adds Snowplow's tag to a server-side GTM container that already receives your GA4 hits through the GA4 client. The tag forwards each GA4 event to your Collector. For the tag, see [Google Tag Manager server-side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md).

1. **Add the Snowplow tag.** From the Community Template Gallery, add the Snowplow tag to your server container. Set **Collector URL** to your Collector and set an app ID. Fire it on events claimed by the GA4 client.

2. **Map events to schemas.** Under **Advanced Event Settings**, select **Define events to be sent as Snowplow Self-Describing Events**, then add rows to **Event Name to Schema**:

   | Event Name | Event Schema |
   |---|---|
   | `view_item`, `add_to_cart`, `remove_from_cart`, `begin_checkout`, `add_payment_info`, `purchase`, `refund`, `view_item_list`, `select_item` | `iglu:com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2` |
   | `view_search_results`, `search` | `iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0` |
   | `login` | `iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0` |
   | each custom event, for example `join_group` | `iglu:com.snowplowanalytics.snowplow/external_event/jsonschema/1-0-0` |

   Leave `page_view`, Enhanced Measurement events (`scroll`, `click`, `file_download`), `user_engagement` and GA4 recommended events such as `sign_up` and `generate_lead` on the tag's defaults. The tag sends them with Google's schemas from Iglu Central.

3. **Fill each event's fields.** Add rows to **Event Definitions**. Rows with **Reference** set to **Client Event Property** read from the GA4 event data; rows set to **Constant or Variable** take the value you type.

   | Event Name | Snowplow property name | Type | Reference | Value |
   |---|---|---|---|---|
   | `view_item` | `type` | String | Constant or Variable | `product_view` |
   | `purchase` | `type` | String | Constant or Variable | `transaction` |
   | `view_search_results` | `terms.0` | String | Client Event Property | `search_term` |
   | `login` | `id` | Default | Client Event Property | `user_id` |
   | `join_group` | `name` | String | Constant or Variable | `join_group` |
   | `join_group` | `tool` | String | Constant or Variable | `ga4` |
   | `join_group` | `kind` | String | Constant or Variable | `group` |
   | `join_group` | `plan` | Default | Client Event Property | `plan` |
   | `join_group` | `group_id` | Default | Client Event Property | `group_id` |
   | `join_group` | `item_id` | Default | Client Event Property | `items.0.item_id` |

   Repeat the `type` row for each ecommerce event (`add_to_cart`, `remove_from_cart`, `checkout_step` for `begin_checkout` and `add_payment_info`, `list_view`, `list_click`, `refund`), and the `external_event` rows for each custom event.

   :::caution[Name every custom event]
   A custom event that isn't listed fails in the tag. Other events aren't affected, but that event never reaches Snowplow.
   :::

4. **Add `external_identity` to every event.** Under **Context entities**, add rows to **Define global context entities**, each with **Entity schema** `iglu:com.snowplowanalytics.snowplow/external_identity/jsonschema/1-0-0`:

   | Entity Property Name | Type | Reference | Value |
   |---|---|---|---|
   | `tool` | String | Constant or Variable | `ga4` |
   | `anonymous_id` | String | Client Event Property | `client_id` |
   | `user_id` | Default | Client Event Property | `user_id` |
   | `session_id` | Default | Client Event Property | `ga_session_id` |
   | `session_number` | Default | Client Event Property | `ga_session_number` |
   | `event_name` | String | Client Event Property | `event_name` |

5. **Add ecommerce entities.** The entity tables build one entity per schema, so they can't hold one product entity per item. Create a variable that returns the product, transaction and cart entities for the current event, and add it to **Set custom context entities through variables** for each ecommerce event. The entities follow the same mapping as the page script, with every item kept:

   ```js
   // Returns { action, entities } for a GA4 ecommerce event; entities holds one product per item.
   // ecommerceCalls and the schema URIs in S come from ladder.js.
   function ecommerceEntities(name, p, opts) {
     var call = ecommerceCalls(name, p, opts)[0];
     if (!call) return null;
     var a = call[1], ents = [];
     var type = { trackProductView: 'product_view', trackAddToCart: 'add_to_cart', trackRemoveFromCart: 'remove_from_cart',
       trackCheckoutStep: 'checkout_step', trackTransaction: 'transaction', trackRefund: 'refund' }[call[0]];
     var prods = a.products || (a.product ? [a.product] : call[0] === 'trackProductView' ? [a] : []);
     prods.forEach(function (pr) { ents.push({ schema: S.product, data: pr }); });
     if (type === 'transaction') {
       var t = Object.assign({}, a); delete t.products;
       t.total_quantity = prods.reduce(function (s, pr) { return s + (pr.quantity || 0); }, 0);
       ents.push({ schema: S.transaction, data: t });
     }
     if (type === 'add_to_cart' || type === 'remove_from_cart') ents.push({ schema: S.cart, data: { total_value: a.total_value, currency: a.currency } });
     return { action: { type: type }, entities: ents };
   }
   ```

   :::caution[Needs a custom variable template]
   Server-side GTM variables run in GTM's sandboxed JavaScript, so package this logic as a custom variable template.
   :::

6. **Add a consent condition.** The tag has no consent check of its own. Add a trigger condition so it fires only when analytics consent is granted, which means the GA4 consent state (`gcs`) is `G111` or `G101`. Use Preview to find the event data key that holds `gcs` in your container. See [Gate server-side GTM on Consent Mode](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md#gate-server-side-gtm-on-consent-mode).

7. **Preview and publish.** Use server-side GTM Preview to check each event's outgoing request to your Collector, then publish.

## Set up warehouse history (warehouse)

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

:::caution
Check whether your Signals batch source needs a load timestamp column, which the GA4 export tables don't have.
:::

## Check it works

Send test traffic, then look at the events in [Snowplow Micro](/docs/testing/snowplow-micro/index.md) or your pipeline's good events.

On the client-side approaches, check that:

- page views arrive for full loads and for single-page-app route changes, with a `domain_userid` and a `domain_sessionid`
- a purchase arrives as one `snowplow_ecommerce_action` with `type` `transaction`, a transaction entity and one product entity for each item in the order
- a product view arrives once, not again when the purchase fires
- custom events arrive as `external_event` with `tool` `ga4` and `name` set to the GA4 event name
- every event carries an `external_identity` entity with the GA client ID in `anonymous_id`
- no email address appears in any event
- with the page script, page pings and link clicks arrive

On the server-side approach, check that:

- `domain_userid` holds the GA client ID and `domain_sessionid` is empty, as expected
- Enhanced Measurement events arrive with Google's schemas
- no event is missing for a custom event name, which would mean it isn't listed in the tag

Bad events usually mean a schema is missing from your registry, or was used before it was deployed to production, most often `external_event` or `external_identity`.

## How GA4 events map to Snowplow

Each GA4 event takes the first rung of the [event mapping ladder](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) that fits.

| GA4 event | Snowplow event | Notes |
|---|---|---|
| `page_view`, including single-page-app page views | `page_view` | On client-side approaches, sent by the Snowplow tracker on load and route changes |
| `view_item` | `snowplow_ecommerce_action` with `type` `product_view` and a product entity | |
| `view_item_list`, `select_item` | `snowplow_ecommerce_action` with `type` `list_view` or `list_click` | |
| `add_to_cart`, `remove_from_cart` | `snowplow_ecommerce_action` with product and cart entities | GA4 `value` is the amount added or removed, and it goes in the cart's `total_value` |
| `begin_checkout`, `add_payment_info` | `snowplow_ecommerce_action` with `type` `checkout_step` | `payment_type` becomes the payment method |
| `purchase` | `snowplow_ecommerce_action` with `type` `transaction`, a transaction entity and one product entity per item | Payment method is `unknown` when GA4's purchase carries none |
| `refund` | `snowplow_ecommerce_action` with `type` `refund` | |
| `search`, `view_search_results` | `site_search` | |
| `login` | `identify` with `id` only | Never the email |
| `sign_up`, `generate_lead`, `share`, `select_content`, `add_to_wishlist`, `exception` | Google's schemas under `com.google.tag-manager.server-side` | |
| `scroll`, `click`, `file_download` | Google's schemas under `com.google.ga4.enhanced-measurement` | Server-side approach only. Client-side approaches use Snowplow's page pings and link clicks instead |
| `user_engagement` | `com.google.ga4/user_engagement` | Server-side approach only |
| Any other event, such as `join_group` or your custom events | `external_event` with `tool` `ga4` and `name` set to the event name | Typed fields only. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) |
| `gtag('set', 'user_properties', ...)` | Not sent | User properties aren't forwarded on any approach |

Every event also carries an `external_identity` entity. See [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).

## Identifiers

| GA4 or GTM field | Snowplow field | Use as a Signals key? |
|---|---|---|
| Snowplow `_sp_id` cookie (client-side approaches) | `domain_userid` | Yes. A random UUID, safe on the public intervention endpoint, and readable on the page through the tracker |
| Snowplow session (client-side approaches) | `domain_sessionid` | Yes, for session attributes. A random UUID. The server-side approach has none |
| GA client ID (`_ga` cookie, `cid` in the hit, `user_pseudo_id` in BigQuery) | `external_identity.anonymous_id`. On the server-side approach also `domain_userid` | Only for reads from your own servers and joins to BigQuery. Never on the public intervention endpoint: part of it is a timestamp. With analytics storage denied, GA4 sets no `_ga` cookie, so it changes on each full page load |
| GA session ID (`sid`, `_ga_<id>` cookie) and session number (`sct`) | `external_identity.session_id` and `session_number` | No. The session ID is the session start time in seconds |
| GA `user_id` | `user_id`, `external_identity.user_id`, and `identify.id` on login | Only for reads from your own servers. You choose it, and it's often guessable |
| GA4 event name | `external_identity.event_name` and `external_event.name` | No. Use it to filter attributes and to match rows to GA4 events |
| Collector cookie | `network_userid` | A random UUID on client-side approaches. On the server-side approach it depends on server-side GTM setting the `sp` cookie on a first-party domain |
| IP address, user agent | `user_ipaddress`, `useragent` | No. On the server-side approach, these are the values the GA4 client passes to the tag |

If you use Snowplow Identities, you can key stream attribute groups on `snowplow_id` and read them by `domain_userid` or `user_id`. See [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md).

## Starter attribute groups

Start with the shared definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md). On GA4 data:

- **Visitor activity, purchase intent and funnel** work on every approach. Every item in an order arrives as its own product entity, but a product attribute reads one entity per event: the first, or the one at the index you set.
- **Session engagement** needs a client-side approach with page pings turned on, keyed on `domain_sessionid`.
- **Account and plan** works only when `plan` and `group_id` are sent as event parameters. GA4 user properties aren't forwarded.
- **UTM source and medium** need the campaign attribution enrichment on your pipeline.
- **Engagement from GA4's own events** on the server-side approach reads Google's schemas, such as `user_engagement`'s `engagement_time_msec`. Signals builds attributes on these schemas like any other.

## Limits

GTM tag templates (client-side):

1. **No GA4 Enhanced Measurement events.** `gtag.js` sends scroll, outbound click, file download and engagement time itself, not as data layer events your tags can fire on. Use the Snowplow tracker's own page pings and link clicks instead.
2. **Every event needs a tag and trigger.** Events you don't set up aren't sent.
3. **Numeric `external_event` fields.** GTM parameter tables hold strings, so the numeric `value` field can be left out. Check in Preview that a variable returning a number keeps its type.
4. **`view_item` with several items.** The ecommerce argument variable above sends the first item, because one tag fire sends one product view.
5. **The ecommerce plugin must load once.** See step 6.

Page script (client-side):

1. **Single-page-app page views need the `pushState` wrapper.** Without it, the script sees only page views from `gtag('config', ...)`, not the ones `gtag.js` sends on route changes.
2. **No Consent Mode support.** You gate the script yourself.
3. **Form tracking sends field values** unless you denylist the fields.
4. **Events wait for the `_ga` cookie,** for up to 3 seconds on a first visit.

Server-side GTM (server-side):

1. **No Snowplow sessions.** `domain_sessionid` is empty, and the GA session ID isn't safe as a key.
2. **No key for the public intervention endpoint.** The only visitor key is the GA client ID.
3. **Delay.** `gtag.js` batches hits, so events can wait several seconds in the browser before they reach server-side GTM.
4. **Custom events must be listed** in the tag, and `external_event`'s item fields hold the first item only. Ecommerce events keep every product.
5. **Server-side GTM sees all GA4 parameters,** including any email addresses your page puts in them. The tag forwards only the fields you map.
6. **Some tag defaults drop fields.** The tag's `file_download` mapping reads `file_extention`, so GA4's `file_extension` is dropped, and `scroll` arrives with no fields.

Warehouse (warehouse):

1. **Can't trigger interventions.** Warehouse attributes update periodically, and intervention criteria use stream attributes.
2. **Keyed on the GA client ID.** Not usable on the public intervention endpoint.
3. **Needs a warehouse connection,** which isn't available on the free tier.

All approaches:

- GA4's own processing, such as modeled conversions and GA4 sessions, isn't reproduced.
- GA4 user properties aren't forwarded.

For how each approach handles consent and personal data, see [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).

Where to go next:

- Build your first attributes from [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- Replace `external_event` with native Snowplow events one at a time: see [Move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md). On the client-side approaches the Snowplow tracker is already running, so `domain_userid` stays the same and attributes carry over.
- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Read the [overview](/docs/signals/data-sources/existing-analytics/index.md) to compare GA4 with the other tools.
