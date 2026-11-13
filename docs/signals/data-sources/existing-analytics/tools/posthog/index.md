---
title: "Use Signals with PostHog"
sidebar_label: "PostHog"
sidebar_position: 60
description: "Send the events you already capture with PostHog to Snowplow, from the browser or from a PostHog destination, and build Signals attributes on them without retagging."
keywords: ["posthog", "posthog-js", "before_send", "hog", "http webhook destination", "external_event", "signals"]
date: "2026-11-13"
content_type: how-to
---

Use the pageviews, autocaptured events, custom events, `identify` and `group` calls you already capture with PostHog to build Snowplow Signals attributes, without retagging your site.

## Choose an approach

You can send PostHog events to Snowplow in two ways, and add a third for history later.

- **Client-side:** a `before_send` hook in posthog-js hands each event to the Snowplow JavaScript tracker, which runs on the same page, and returns the event to PostHog unchanged.
- **Server-side:** an HTTP Webhook destination in your PostHog project, with its source replaced by Hog code that converts each event and posts it to your Snowplow Collector.
- **Warehouse:** PostHog's batch exports give you history for batch attributes.

| | Client-side: `before_send` hook | Server-side: HTTP Webhook destination with edited source | Warehouse: PostHog batch export |
|---|---|---|---|
| What you change | A few lines next to `posthog.init`, plus the Snowplow tracker script | A destination in your PostHog project. No page change | A batch export to your warehouse, and a warehouse connection in Signals |
| Events covered | Browser events captured by posthog-js | Every event PostHog ingests: posthog-js, server SDKs, mobile SDKs and the capture API | Whatever the export holds |
| Visitor key | Snowplow's own random cookie ID (`domain_userid`) | PostHog's `$device_id`, copied into `domain_userid` | Depends on the tables you read |
| Sessions and engagement | Yes: Snowplow sessions, page pings, and time on page from `$pageleave` | Sessions from PostHog's `$session_id`, and time on page from `$pageleave`. No page pings | No |
| Delivery | Straight from the browser to your Collector | Through PostHog's destination queue, then to your Collector. PostHog doesn't document a delivery time | Batch, from every 5 minutes to weekly, on your export schedule |
| Personal data path | Browser to Collector: IP address, user agent, page URLs, the user ID, search terms, and PostHog's `ph_` cookie if the Collector is on the same site | PostHog to Collector: IP address, user agent, page URL, referrer, title, the user ID and search terms. Person properties stay in PostHog | Stays in your warehouse. PostHog's events model includes person properties and the IP address |
| Plan or license needed | No PostHog plan requirement known. `before_send` is in posthog-js 1.187.0 and later. Snowplow pipeline with Signals | PostHog's pricing page lists destinations with the first 10,000 trigger events a month free, then billed per event. Check that your plan includes the HTTP Webhook destination. Snowplow pipeline with Signals | A PostHog batch export, with the first 1,000,000 rows a month free according to PostHog's pricing page. A Signals warehouse connection |

Choose client-side if:

- You want session and engagement attributes with page pings, such as pages per session or seconds engaged.
- You want the quickest reaction to what a visitor does, for interventions in the page.
- You want a visitor key that is safe on the public intervention endpoint.
- You plan to move to native Snowplow tracking later, because the visitor ID stays the same when you do.

Choose server-side if:

- You need events from PostHog's server or mobile SDKs, or from the capture API, not only the browser.
- You can't change the page, or you want the setup to live in your PostHog project.
- Visitor, account and session counts are enough, and a delay set by PostHog's queue is acceptable.

You can run both. If you do, add a filter to the destination so it skips events whose `$lib` is `web`, which posthog-js sets on every browser event. Browser events then don't arrive twice under two visitor keys. Giving each approach its own app ID makes the split easy to check.

## Before you begin

You need:

- posthog-js 1.187.0 or later on your site for the client-side approach, which is when `before_send` was added. These steps use posthog-js 1.448.0 loaded from PostHog's snippet.
- Permission to create destinations in your PostHog project for the server-side approach.
- A Snowplow Collector URL. For the server-side approach, the Collector must accept requests from PostHog's servers. Allow-list PostHog's published IP addresses if your Collector is behind a firewall.
- Snowplow Signals enabled on your pipeline.
- The `external_event` and `external_identity` schemas, published on Iglu Central, alongside the ecommerce, `site_search` and `identify` schemas the adapter also uses. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md). If you register your own copies, for example under your own vendor, deploy them to production before you send any events, and set that vendor in the adapter as described in the setup steps. An event that uses a schema your pipeline can't resolve still gets a 200 response from the Collector, then fails validation, so nothing reaches Signals and no error shows in the page or in PostHog. Check failed events after your first test.

Check your PostHog ecommerce events use PostHog's ecommerce spec names (`Product Viewed`, `Order Completed`, `Products Searched` and so on) with a price and a currency. They are the same names Segment uses. Events with other names, or without a currency, become generic `external_event` events instead of Snowplow ecommerce events. See [How PostHog events map to Snowplow](#how-posthog-events-map-to-snowplow).

## Set up the client-side approach

The client-side approach loads the Snowplow JavaScript tracker and its ecommerce plugin next to posthog-js, then adds a hook to PostHog's `before_send` option. posthog-js calls the hook for every event it is about to send. The hook replays the event into the Snowplow tracker and returns it unchanged, so PostHog receives exactly what it did before.

1. Load the Snowplow tracker and the ecommerce plugin, and create a tracker that points at your Collector. Put this before the PostHog snippet.

   ```html
   <script>
   ;(function (p, l, o, w, i, n, g) { if (!p[i]) { p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || []; p.GlobalSnowplowNamespace.push(i); p[i] = function () { (p[i].q = p[i].q || []).push(arguments); }; p[i].q = p[i].q || []; n = l.createElement(o); g = l.getElementsByTagName(o)[0]; n.async = 1; n.src = w; g.parentNode.insertBefore(n, g); } })(window, document, 'script', 'https://cdn.jsdelivr.net/npm/@snowplow/javascript-tracker@4.10.3/dist/sp.js', 'snowplow');
   window.snowplow('newTracker', 'sp', 'https://collector.example.com', {
     appId: 'my-site', eventMethod: 'post', bufferSize: 1,
     contexts: { webPage: true }, credentials: 'omit',
   });
   window.snowplow('addPlugin', 'https://cdn.jsdelivr.net/npm/@snowplow/browser-plugin-snowplow-ecommerce@4.10.3/dist/index.umd.min.js', ['snowplowEcommerceAccelerator', 'SnowplowEcommercePlugin']);
   window.snowplow('enableActivityTracking', { minimumVisitLength: 5, heartbeatDelay: 5 });
   </script>
   ```

   Replace `https://collector.example.com` with your Collector URL and `my-site` with your app ID. Activity tracking sends the page pings that engagement attributes need. `credentials: 'omit'` keeps PostHog's cookie off Collector requests; see the caution below.

2. Load the [mapping code](#mapping-code): `sha256.js`, then `converter.js`. The converter defines `PostHogSnowplow`, which maps each PostHog event to a Snowplow event. If you registered your own copies of the two schemas, set your vendor straight after it:

   ```html
   <script src="/js/sha256.js"></script>
   <script src="/js/converter.js"></script>
   <script>PostHogSnowplow.PH.vendor = 'com.example';</script>
   ```

3. Add the hook. It must be defined before `posthog.init` runs.

   ```html
   <script>
   // The client-side adapter: a before_send hook that copies each PostHog event into the Snowplow
   // browser tracker and returns the event unchanged, so PostHog receives exactly what it did before.
   // Load sha256.js, converter.js and the Snowplow tag first. Put this hook LAST in before_send, so it
   // sees events after the site's own redaction and sampling hooks.
   function snowplowBeforeSend(event) {
     if (!event) return event;
     try {
       var S = window.PostHogSnowplow;
       var c = S.fromBrowser(event);
       var l = S.ladder(c, window.sha256Hex);
       if (!l) return event;
       var ident = S.identity(c, window.sha256Hex);
       var context = ident ? [ident] : [];
       var timestamp = c.timeMs ? { type: 'ttm', value: c.timeMs } : undefined;
       window.snowplow('setUserId', S.userIdOf(c, window.sha256Hex) || null);
       // Queued calls can be handed over after the URL changed, so use the URL PostHog recorded.
       if (c.props.$current_url) window.snowplow('setCustomUrl', c.props.$current_url);
       if (l.rung === 'page_view') {
         window.snowplow('trackPageView', { title: c.props.title, context: context, timestamp: timestamp });
       } else if (l.plugin) {
         var arg = l.plugin[1];
         window.snowplow(l.plugin[0], Object.assign({}, arg, { context: (arg.context || []).concat(context), timestamp: timestamp }));
       } else {
         window.snowplow('trackSelfDescribingEvent', { event: l.event, context: l.entities.concat(context), timestamp: timestamp });
       }
     } catch (e) {
       // A Snowplow problem must never stop the event reaching PostHog.
       if (window.console) console.warn('snowplow forwarder', e);
     }
     return event;
   }
   </script>
   ```

   Ecommerce events go through the Snowplow ecommerce plugin's own methods, such as `trackProductView` and `trackTransaction`. Everything else is sent with `trackPageView` or `trackSelfDescribingEvent`. The hook passes PostHog's event time as the true timestamp, so it lands in `true_tstamp`.

4. Add the hook to `before_send` in your `posthog.init` call, after the PostHog snippet:

   ```html
   <script>
   // PostHog's snippet from posthog.com/docs/libraries/js goes here.
   posthog.init('<project_api_key>', {
     api_host: 'https://us.i.posthog.com',
     defaults: '2026-08-30',
     before_send: [snowplowBeforeSend],
   });
   </script>
   ```

   If you already have `before_send` hooks, keep them and put `snowplowBeforeSend` last, for example `before_send: [redactHook, sampleHook, snowplowBeforeSend]`. It then sees events after your own redaction and sampling. PostHog's docs warn that amending events is an advanced feature and that core PostHog features may need unmodified events. The hook never changes the event, and it must stay that way.

5. Publish the page change.

The hook only sees events posthog-js is about to send. When the visitor has opted out of capturing, or consent is still pending, posthog-js doesn't call `before_send`, so nothing reaches Snowplow either. posthog-js also drops events from browsers it classes as bots before `before_send` runs, unless you set `opt_out_useragent_filter`.

Session replay (`$snapshot`) and heatmap (`$$heatmap`) events also pass through `before_send`. The converter drops them, so replay DOM snapshots and mouse coordinates never reach Snowplow.

:::caution[PostHog cookies and a same-site Collector]
If your Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends PostHog's `ph_<project_api_key>_posthog` cookie with every request to it. posthog-js sets it on your parent domain by default (`cross_subdomain_cookie`). It holds the `$device_id`, the `distinct_id`, the session ID and the first URL the visitor landed on, with its UTM parameters. After `identify`, the `distinct_id` is your user ID, so if you identify users by email, the email address travels in clear in the cookie header of every Collector request, even though the events carry only its hash.

`credentials: 'omit'` in step 1 keeps the cookie off Collector requests. The browser then sends no cookies to the Collector, including the Collector's own cookie, so if you rely on `network_userid`, check how your Collector sets it before you use this option. `domain_userid` and `domain_sessionid` are unaffected. Otherwise, use a Collector on a different site, or confirm this is acceptable in your privacy review.
:::

## Set up the server-side approach: HTTP Webhook destination

The server-side approach runs in your PostHog project. A destination built from the HTTP Webhook template receives each event after PostHog has ingested it. Its source is replaced by Hog code that maps the event the same way as the client-side converter and posts it to your Collector in Snowplow's tracker protocol.

Don't use the stock HTTP Webhook template with only its JSON body edited. Body templating substitutes values but can't branch, so it can't choose between page views, ecommerce events and `external_event`. Its default body also sends the whole person, including every person property and any email.

1. In PostHog, go to **Data pipelines**, click **+ New** > **Destination**, search for "Webhook" and click **+ Create**.

2. Open **Edit source** and add four inputs:

   | Input | Type | Value |
   |---|---|---|
   | `collector_url` | String | Your Collector URL, for example `https://collector.example.com`, with no trailing slash |
   | `app_id` | String | The app ID these events should carry |
   | `vendor` | String | `com.snowplowanalytics.snowplow`, or your own vendor if you registered copies of `external_event` and `external_identity` |
   | `debug` | Boolean | On while you set up, to print each event's result in the function logs |

3. Replace the source with the Hog code below.

   <details>
   <summary>Hog source for the Snowplow Collector</summary>

   ```text
   // Snowplow collector destination for PostHog (paste into a new HTTP Webhook destination, Edit source).
   // Inputs: collector_url (https://collector.example.com), app_id, vendor (com.snowplowanalytics.snowplow, or
   // your own vendor if you registered copies of external_event and external_identity), debug (boolean).
   // Sends each event down the ladder: page_view, Snowplow ecommerce with every product, site_search,
   // identify with the id only, external_event for the rest; external_identity on every event.
   // Person properties, $set and $set_once are never read, so traits such as email stay in PostHog.

   let TOOL := 'other' // external_event 1-0-0 has no 'posthog' in its tool enum
   let E := 'iglu:com.snowplowanalytics.snowplow.ecommerce/'
   let V := f'iglu:{inputs.vendor ?? 'com.snowplowanalytics.snowplow'}/'
   let DROP := ['$snapshot', '$$heatmap', '$feature_flag_called', '$web_vitals', '$exception', '$$client_ingestion_warning', '$opt_in', '$set']
   let ECOM := {
     'product viewed': 'product_view', 'product added': 'add_to_cart', 'product removed': 'remove_from_cart',
     'checkout started': 'checkout_step', 'checkout step viewed': 'checkout_step', 'checkout step completed': 'checkout_step',
     'order completed': 'transaction', 'order refunded': 'refund'
   }

   fun isNum(v) { return typeof(v) = 'integer' or typeof(v) = 'float' }
   fun num(v) {
     if (isNum(v)) { return v }
     if (typeof(v) = 'string' and v =~ '^-?[0-9]+(\\.[0-9]+)?$') { return toFloat(v) }
     return null
   }
   fun money(v) {
     let n := num(v)
     if (n = null or n < 0) { return null }
     return round(n * 100) / 100
   }
   fun int(v) {
     let n := num(v)
     if (n = null or n < 0) { return null }
     return toInt(round(n))
   }
   fun cur3(v) {
     if (typeof(v) = 'string' and v =~ '^[A-Za-z]{3}$') { return upper(v) }
     return null
   }
   fun str255(v) {
     if (v = null or (typeof(v) != 'string' and not isNum(v) and typeof(v) != 'boolean')) { return null }
     let s := toString(v)
     if (empty(s)) { return null }
     return substring(s, 1, 255)
   }
   fun compact(o) {
     let r := {}
     for (let k, v in o) {
       if (v != null and v != '') { r[k] := v }
     }
     return r
   }
   fun sdj(schema, data) { return {'schema': schema, 'data': data} }

   fun product(it, currency) {
     let id := str255(it.product_id ?? it.sku ?? it.id)
     let price := money(it.price)
     let cur := cur3(it.currency) ?? currency
     if (id = null or price = null or cur = null) { return null }
     let out := compact({'id': id, 'name': str255(it.name), 'price': price, 'currency': cur, 'quantity': int(it.quantity),
       'variant': str255(it.variant), 'brand': str255(it.brand), 'position': int(it.position)})
     out['category'] := str255(it.category) ?? ''
     return out
   }
   fun products(p, currency) {
     let out := []
     if (typeof(p.products) = 'array') {
       for (let it in p.products) {
         let x := product(it ?? {}, currency)
         if (x != null) { out := arrayPushBack(out, x) }
       }
     }
     return out
   }
   fun prodEntities(list) {
     let out := []
     for (let x in list) { out := arrayPushBack(out, sdj(f'{E}product/jsonschema/1-0-0', x)) }
     return out
   }

   let ev := event
   let p := ev.properties ?? {}
   let name := ev.event
   let lname := lower(trim(toString(name)))

   if (has(DROP, name)) {
     if (inputs.debug) { print('skipped', name) }
   } else {
     let deviceId := p.$device_id
     let identified := name = '$identify' or (deviceId != null and ev.distinct_id != deviceId)
     let uid := null
     if (identified and notEmpty(ev.distinct_id)) {
       uid := ev.distinct_id
       if (position(uid, '@') > 0) { uid := sha256Hex(lower(trim(uid))) } else { uid := substring(uid, 1, 255) }
     }
     let anon := deviceId
     if (anon = null and ev.distinct_id != '$posthog_cookieless' and uid = null) { anon := ev.distinct_id }

     let isPv := name = '$pageview'
     let ue := null
     let ents := []
     let cur := cur3(p.currency)
     let type := ECOM[lname]

     if (not isPv) {
       if (name = '$identify' and uid != null) {
         ue := sdj('iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0', {'id': uid})
       } else if (lname = 'products searched' and str255(p.query) != null) {
         ue := sdj('iglu:com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0', {'terms': [str255(p.query)]})
       } else if (type = 'product_view' or type = 'add_to_cart' or type = 'remove_from_cart') {
         let one := product(p, cur)
         if (one != null) {
           ents := prodEntities([one])
           let total := money(p.cart_total ?? p.value)
           if (type != 'product_view' and total != null) {
             ents := arrayPushBack(ents, sdj(f'{E}cart/jsonschema/1-0-0', compact({'cart_id': str255(p.cart_id), 'total_value': total, 'currency': one.currency})))
           }
           ue := sdj(f'{E}snowplow_ecommerce_action/jsonschema/1-0-2', {'type': type})
         }
       } else if (type = 'checkout_step') {
         let step := int(p.step)
         if (step = null or step < 1 or step > 90) { step := 1 }
         ents := arrayPushBack(prodEntities(products(p, cur)), sdj(f'{E}checkout_step/jsonschema/1-0-0', compact({'step': step,
           'delivery_method': str255(p.shipping_method), 'payment_method': str255(p.payment_method), 'coupon_code': str255(p.coupon)})))
         ue := sdj(f'{E}snowplow_ecommerce_action/jsonschema/1-0-2', {'type': type})
       } else if (type = 'transaction') {
         let rev := money(p.revenue ?? p.total ?? p.value)
         let oid := str255(p.order_id ?? p.checkout_id)
         if (cur != null and rev != null and oid != null) {
           let ps := products(p, cur)
           let qty := 0
           for (let x in ps) { qty := qty + (x.quantity ?? 1) }
           ents := arrayPushBack(prodEntities(ps), sdj(f'{E}transaction/jsonschema/1-0-0', compact({'transaction_id': oid, 'revenue': rev,
             'currency': cur, 'payment_method': str255(p.payment_method) ?? 'unknown', 'total_quantity': qty,
             'tax': money(p.tax), 'shipping': money(p.shipping), 'discount_code': str255(p.coupon), 'discount_amount': money(p.discount)})))
           ue := sdj(f'{E}snowplow_ecommerce_action/jsonschema/1-0-2', {'type': type})
         }
       } else if (type = 'refund') {
         let amt := money(p.total ?? p.revenue ?? p.value)
         if (cur != null and amt != null and p.order_id != null) {
           ents := arrayPushBack(prodEntities(products(p, cur)), sdj(f'{E}refund/jsonschema/1-0-0', {'transaction_id': str255(p.order_id), 'currency': cur, 'refund_amount': amt}))
           ue := sdj(f'{E}snowplow_ecommerce_action/jsonschema/1-0-2', {'type': type})
         }
       }
       if (ue = null) {
         ents := []
         let kind := 'track'
         if (name = '$groupidentify') { kind := 'group' } else if (name = '$create_alias') { kind := 'alias' } else if (name = '$identify') { kind := 'identify' }
         let first := {}
         if (typeof(p.products) = 'array' and length(p.products) > 0) { first := p.products[1] ?? {} }
         let value := num(p.revenue ?? p.value ?? p.total ?? p.price)
         if (name = '$pageleave') { value := num(p.$prev_pageview_duration) }
         ue := sdj(f'{V}external_event/jsonschema/1-0-0', compact({
           'name': substring(toString(name ?? 'unknown'), 1, 255), 'tool': TOOL, 'kind': kind, 'value': value, 'currency': cur,
           'item_id': str255(p.product_id ?? p.sku ?? first.product_id), 'item_category': str255(p.category ?? first.category),
           'search_term': typeof(p.query) = 'string' ? str255(p.query) : null,
           'plan': str255(p.plan ?? (kind = 'group' ? p.$group_set?.plan : null)),
           'group_id': kind = 'group' ? str255(p.$group_key) : null,
           'previous_id': kind = 'alias' ? str255(p.alias) : null
         }))
       }
     }

     let ctx := ents
     if (anon != null) {
       ctx := arrayPushBack(ents, sdj(f'{V}external_identity/jsonschema/1-0-0', {'tool': TOOL, 'anonymous_id': substring(toString(anon), 1, 255),
         'user_id': uid, 'session_id': p.$session_id ?? null, 'session_number': null, 'event_name': substring(toString(name), 1, 255)}))
     }
     let t := toString(toUnixTimestampMilli(toDateTime(ev.timestamp)))
     let tp := compact({
       'e': isPv ? 'pv' : 'ue', 'p': 'web', 'tv': 'posthog-hog-0.1', 'aid': inputs.app_id, 'eid': ev.uuid,
       'dtm': t, 'ttm': t, 'stm': toString(toUnixTimestampMilli(now())),
       'duid': anon, 'tnuid': anon, 'uid': uid,
       // $session_id is a UUIDv7, so it fits domain_sessionid as is.
       'sid': (typeof(p.$session_id) = 'string' and p.$session_id =~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') ? p.$session_id : null,
       'ip': p.$ip, 'ua': p.$raw_user_agent, 'lang': p.$browser_language,
       'url': p.$current_url, 'refr': (p.$referrer = '$direct') ? null : p.$referrer,
       'res': (p.$screen_width != null) ? f'{p.$screen_width}x{p.$screen_height}' : null,
       'page': isPv ? (p.title ?? null) : null,
       'ue_pr': ue != null ? jsonStringify(sdj('iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0', ue)) : null,
       'co': length(ctx) > 0 ? jsonStringify(sdj('iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1', ctx)) : null
     })
     let res := fetch(f'{inputs.collector_url}/com.snowplowanalytics.snowplow/tp2', {
       'method': 'POST',
       'headers': {'Content-Type': 'application/json; charset=utf-8'},
       'body': sdj('iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4', [tp])
     })
     if (res.status >= 400) {
       throw Error(f'Snowplow collector returned {res.status}')
     }
     if (inputs.debug) { print('sent', name, res.status) }
   }
   ```

   </details>

   The ecommerce names near the top match the client-side converter. Edit both together if you add your own event names.

4. In **Filters**, choose the events to forward. If you also run the client-side approach, add a property filter so `$lib` is not `web`.

5. Use the destination's test option to send a sample event, check the logs show `sent` with status 200, then enable the destination and turn `debug` off.

Each event is posted in its own request. PostHog's event `uuid` becomes the Snowplow `event_id`, so a retried event keeps the same ID. PostHog's docs say it retries a failed destination call up to 3 times, depending on the error code. The destination throws on any Collector status of 400 or above, so PostHog treats it as failed.

## Set up warehouse history: batch exports

If you already use PostHog's batch exports to a warehouse such as BigQuery, Snowflake, Redshift, Databricks or Postgres, or to S3 or Azure, Signals can read pre-calculated attributes from a table there. Build a table of attributes per `$device_id` or `distinct_id` from the export, then configure it as described in [Warehouse configuration](/docs/signals/attributes/warehouse-config/index.md), with a custom attribute key for the PostHog ID.

:::caution
This approach needs a warehouse connection in Signals. PostHog's events export includes `person_properties` and the IP address, so emails held in person properties land in your warehouse. Select only the columns your attributes need.
:::

## Check it works

Test with your Console development environment before you send events to your pipeline. Every Snowplow trial includes one: it runs Snowplow Micro, hosted by Snowplow. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines** and select your development environment.
2. Copy its Collector endpoint.
3. Point the Snowplow tracker (client-side) or the destination's `collector_url` input (server-side) at it.
4. Send a few events from a test page.
5. Select **Open dashboard** to see the good and failed events.

Development environments use your development data structures, so you can also test your own copies of `external_event` and `external_identity` there before you deploy them to production.

For a page view, a product view, an order with two products, a search and an `identify` call, you should see:

- A native `page_view` for each `$pageview`, including the ones posthog-js captures on its own when a single-page app changes route.
- A `snowplow_ecommerce_action` event of type `product_view` with one `product` entity.
- A `snowplow_ecommerce_action` event of type `transaction` with one `product` entity per product and a `transaction` entity whose `total_quantity` counts every item.
- A `site_search` event with the search term in `terms`.
- An `identify` event whose only field is `id`. The email and other person properties are not there. If you identify by email, `id` is a 64-character SHA-256 hash.
- `external_event` for everything else, such as `$groupidentify` (kind `group`, with `group_id` and `plan`), `$create_alias` (kind `alias`), `$autocapture`, `$rageclick`, `$pageleave` (with the seconds on the page in `value`) and your own events, with `name` set to the PostHog event name.
- An `external_identity` entity on every event, with `tool` set to `other`, `anonymous_id` set to PostHog's `$device_id`, `session_id` set to PostHog's `$session_id`, and the original event name in `event_name`. `user_id` is empty until `identify`, then holds the user ID.
- No `$snapshot` or `$$heatmap` events.
- With the client-side approach, `page_ping` events, one `domain_sessionid` on every event in the visit, and PostHog's event time in `true_tstamp`.
- With the server-side approach, `domain_userid` equal to `$device_id`, `domain_sessionid` equal to `$session_id`, and `user_ipaddress` set from PostHog's `$ip`.
- No failed events.

To check that nothing reaches Snowplow without consent, call `posthog.opt_out_capturing()` and reload: the dashboard should show no new events. If your Collector is on the same site, check in your browser's developer tools that no `ph_` cookie appears in the `Cookie` header of requests to it.

Check failed events in your pipeline as well as the destination's logs in PostHog. The Collector accepts events before they are validated, so PostHog shows an event as delivered even when it later fails validation.

Once the events look right, point the tracker or the destination at your pipeline's Collector, and read the attributes in Signals.

## How PostHog events map to Snowplow

Each PostHog event takes the first rung of the [event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md) ladder that fits. Both approaches use the same mapping.

| PostHog event | Snowplow event | Notes |
|---|---|---|
| `$pageview` | `page_view` | URL from `$current_url`. Title from the `title` property. Server-side, the referrer comes from `$referrer`, and a `$direct` referrer is dropped |
| `Product Viewed` | `snowplow_ecommerce_action` (`product_view`) with `product` | Needs a product ID, price and currency |
| `Product Added`, `Product Removed` | `snowplow_ecommerce_action` (`add_to_cart`, `remove_from_cart`) with `product`, and `cart` when there is a cart total | Cart total is `cart_total`, then `value`. PostHog's spec sends neither by default, so the `cart` entity is usually left off |
| `Checkout Started`, `Checkout Step Viewed`, `Checkout Step Completed` | `snowplow_ecommerce_action` (`checkout_step`) with `product` and `checkout_step` | Step defaults to 1 |
| `Order Completed` | `snowplow_ecommerce_action` (`transaction`) with one `product` per product and `transaction` | Needs an order ID, revenue or total, and currency. `payment_method` is set to `unknown` when absent |
| `Order Refunded` | `snowplow_ecommerce_action` (`refund`) with `product` and `refund` | Needs an order ID, total and currency |
| `Products Searched` | `site_search` | `query` becomes the search term |
| `$identify` | `identify` | The user ID only. `$set`, `$set_once` and every other person property are dropped |
| `$groupidentify` | `external_event`, kind `group` | `group_id` from `$group_key`, `plan` from `$group_set` |
| `$create_alias` | `external_event`, kind `alias` | `previous_id` from the `alias` property |
| `$pageleave` | `external_event`, kind `track` | `value` is `$prev_pageview_duration`, the seconds the page was open |
| `$autocapture`, `$rageclick` and other autocaptured events | `external_event`, kind `track` | `name` only. Element text, selectors and `$elements_chain` are not sent |
| Any other event | `external_event`, kind `track` | `name` is the PostHog event name. Typed fields such as `value`, `currency`, `item_id`, `item_category`, `search_term` and `plan` are filled from matching properties |
| An ecommerce event missing a required field | `external_event` | For example an `Order Completed` with no currency |
| `$snapshot`, `$$heatmap`, `$feature_flag_called`, `$web_vitals`, `$exception`, `$$client_ingestion_warning`, `$opt_in`, `$set` | Not sent | Replay, heatmap and SDK bookkeeping events, and person updates |

Ecommerce and search events are matched by name, ignoring case. A product with no category gets an empty category. A product with no ID, price or currency is left off the event. PostHog properties that don't match a typed field stay in PostHog.

## Identifiers

| PostHog field | Snowplow field | Use as a Signals key? |
|---|---|---|
| `$device_id` (a UUID version 7 in posthog-js, stored in the `ph_` cookie and local storage) | `external_identity.anonymous_id` on both approaches. Server-side, also `domain_userid` and `network_userid` | Server-side key, for reads from your backend. Not recommended on the public intervention endpoint; see the caution below |
| Snowplow cookie ID (client-side only) | `domain_userid` | Yes. A random ID set by the Snowplow tracker, safe on the public intervention endpoint |
| Snowplow session ID (client-side only) | `domain_sessionid` | Yes, for session attributes |
| `$session_id` (a UUID version 7; new after 30 minutes idle by default) | `external_identity.session_id` on both approaches. Server-side, also `domain_sessionid` | Server-side session key. Same caution as `$device_id` |
| `distinct_id` | Before `identify`, it equals `$device_id` and isn't sent separately. After `identify`, it is your user ID: `user_id`, `external_identity.user_id` and `identify.id`. Hashed with SHA-256 when it contains `@` | Server-side reads only. Never on the public intervention endpoint, because it can be guessed |
| `$group_key` on `$groupidentify` | `external_event.group_id` | Server-side reads only, for account attributes |
| `alias` on `$create_alias` | `external_event.previous_id` | No. Recorded only |
| Event `uuid` | `event_id` (server-side). The client-side approach uses the tracker's own event ID | No. Used to spot duplicates |
| `$window_id` | Not sent | No |
| Event name | `external_identity.event_name` on every event | No. Lets an attribute filter on the original PostHog name |
| `$ip`, `$raw_user_agent` | `user_ipaddress`, `useragent` (server-side). Client-side, the browser's own | No |

:::caution[$device_id on the public intervention endpoint]
posthog-js builds `$device_id` as a UUID version 7 from `crypto.getRandomValues`: a 48-bit timestamp, then random bits. So it can't be guessed, but it reveals the moment of the visitor's first visit to the millisecond. Any script on the page can read it, and `bootstrap.distinctID`, PostHog's server SDKs and the capture API accept any value. For interventions, use the client-side approach, which keys on Snowplow's own random cookie ID. If you use `$device_id` as a key on the public endpoint, have it reviewed for your privacy and security requirements first.
:::

The key each approach uses:

- Server-side approach: PostHog's `$device_id` for visitors and `$session_id` for sessions. Your page can read the session ID with `posthog.get_session_id()` and pass it to your backend.
- Client-side approach: the Snowplow tracker's `domain_userid` and `domain_sessionid`.

In cookieless mode (`cookieless_mode`), posthog-js sets no `$device_id`, every visitor shares the `distinct_id` `$posthog_cookieless`, and the browser has no `$session_id`. The adapter then sends no `external_identity` entity. The client-side approach still keys on Snowplow's own IDs, so use it if you run PostHog cookieless.

## Starter attribute groups

The [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) work on PostHog data with these notes:

- **Visitor activity, purchase intent, funnel:** both approaches. To count your own events, filter `external_event` on `name`, for example `Signup Form Submitted`. To count autocaptured clicks and rage clicks, filter on `$autocapture` and `$rageclick`. To count any event by its PostHog name, including ones mapped to ecommerce, filter on `external_identity.event_name`.
- **Account and plan:** both approaches. `plan` comes from event properties or from `$group_set` on group calls, and `group_id` from group calls. A plan set only with `$set` on the person is dropped.
- **Session engagement:** page pings and scroll depth need the client-side approach. Session counts, such as page views and product views per session, and minutes since the session started work on both, because the server-side approach puts `$session_id` in `domain_sessionid`. On both approaches you can add seconds on the page from `$pageleave`: take `external_event` `value` where `name` is `$pageleave`. This needs posthog-js to capture `$pageleave` (its `capture_pageleave` option).
- **Separate services per key.** A Signals service can only bundle attribute groups with the same attribute key, so serve visitor groups (`domain_userid`) and session groups (`domain_sessionid`) from two services.

## Limits

### Client-side approach

1. **Browser events only.** Events from PostHog's server and mobile SDKs and the capture API don't pass through posthog-js in the page.
2. **Follows posthog-js.** If posthog-js doesn't load, the visitor has opted out, or posthog-js classes the browser as a bot, the hook doesn't run and nothing reaches Snowplow.
3. **PostHog's cookie can reach a same-site Collector.** See the caution under the setup steps.
4. **The user ID is sent in clear unless it contains `@`.** A user ID with `@` is hashed with SHA-256, unsalted, which is still personal data.
5. **Two visitor IDs.** Snowplow's `domain_userid` differs from PostHog's `$device_id`. They are linked through the `external_identity` entity, but attributes keyed on one don't read by the other.
6. **Device time is in `true_tstamp`.** The hook passes PostHog's event time as the true timestamp, so `dvce_created_tstamp` is empty. Compare device times on `true_tstamp`.
7. **Two extra scripts.** The page loads the Snowplow tracker and its ecommerce plugin, and the tracker sets its own `_sp_id` and `_sp_ses` cookies. Load it under the same consent as PostHog.

### Server-side approach

1. **No page pings.** Sessions work from `$session_id`, but engagement is limited to `$pageleave` durations.
2. **Delivery depends on PostHog.** Events arrive after PostHog ingests them, and PostHog doesn't document a delivery time for destinations. Don't rely on the server-side approach for reactions within a page view.
3. **Billed per trigger event.** Beyond PostHog's free allotment, each event that triggers the destination is billed by PostHog.
4. **Personal data reaches Snowplow.** IP address, user agent, page URL, referrer, title, the user ID (hashed when it contains `@`) and free-text search terms.
5. **The visitor key is PostHog's `$device_id`.** See the caution under [Identifiers](#identifiers).

### Both approaches

1. **Attributes only on declared fields.** Signals builds attributes only on properties a schema declares. Outside the ecommerce events, only `external_event`'s typed fields are kept. See [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md).
2. **`tool` is `other`.** The `tool` field of `external_event` and `external_identity` has no `posthog` value. Use the app ID to tell PostHog events apart from other sources.
3. **No user traits.** `identify` carries the user ID only, and person properties are never sent.
4. **One product per attribute.** Every product in an order arrives as its own entity, but an attribute reads one product entity per event: the first, or the one at the index you set.

### Warehouse approach

Batch attributes need a Signals warehouse connection, and a Signals deployment reads one warehouse.

## Mapping code

The client-side approach loads two files before the hook: `sha256.js`, which hashes email-shaped user IDs synchronously because `before_send` can't wait for `crypto.subtle`, and `converter.js`, which holds the mapping. The server-side Hog source carries the same mapping and uses PostHog's built-in `sha256Hex`.

<details>
<summary>sha256.js</summary>

```js
// Synchronous SHA-256, because before_send can't await crypto.subtle.
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
function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
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
function sha256Hex(s) { return hex(sha256(utf8Bytes(String(s)))); }
if (typeof module !== 'undefined' && module.exports) module.exports = { sha256Hex: sha256Hex }; else window.sha256Hex = sha256Hex;
```

</details>

<details>
<summary>converter.js</summary>

```js
// PostHog event -> Snowplow, down the shared ladder. Dependency-free so the same file runs in the page
// (posthog-js before_send) and in Node.
// Input shapes: the browser CaptureResult ({uuid, event, properties, $set, timestamp}) or the CDP globals
// a Hog destination sees ({event: {uuid, event, distinct_id, properties, timestamp}, person}).

var PH = {
  tool: 'other', // external_event/external_identity 1-0-0 have no "posthog" in the tool enum
  tv: 'posthog-adapter-1.0', aid: 'posthog-adapter',
  vendor: 'com.snowplowanalytics.snowplow',
};

function iglu(name) {
  var map = {
    action: 'com.snowplowanalytics.snowplow.ecommerce/snowplow_ecommerce_action/jsonschema/1-0-2',
    product: 'com.snowplowanalytics.snowplow.ecommerce/product/jsonschema/1-0-0',
    transaction: 'com.snowplowanalytics.snowplow.ecommerce/transaction/jsonschema/1-0-0',
    cart: 'com.snowplowanalytics.snowplow.ecommerce/cart/jsonschema/1-0-0',
    refund: 'com.snowplowanalytics.snowplow.ecommerce/refund/jsonschema/1-0-0',
    checkout: 'com.snowplowanalytics.snowplow.ecommerce/checkout_step/jsonschema/1-0-0',
    siteSearch: 'com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0',
    identify: 'com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0',
    external: PH.vendor + '/external_event/jsonschema/1-0-0',
    identity: PH.vendor + '/external_identity/jsonschema/1-0-0',
  };
  return 'iglu:' + map[name];
}

// Never forwarded: replay, heatmaps and SDK bookkeeping. Person updates ($set) carry traits only.
var DROP = ['$snapshot', '$$heatmap', '$feature_flag_called', '$web_vitals', '$exception', '$$client_ingestion_warning', '$opt_in', '$set'];

var ECOM = {
  product_view: ['product viewed'],
  add_to_cart: ['product added'],
  remove_from_cart: ['product removed'],
  checkout_step: ['checkout started', 'checkout step viewed', 'checkout step completed'],
  transaction: ['order completed'],
  refund: ['order refunded'],
};
var SEARCH = ['products searched'];

function pick() { for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; if (v !== undefined && v !== null && v !== '') return v; } return undefined; }
function str255(v) { return v === undefined || v === null || typeof v === 'object' ? undefined : String(v).slice(0, 255); }
function num(v) { if (typeof v === 'number' && isFinite(v)) return v; if (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v))) return Number(v); return undefined; }
function money(v) { v = num(v); return v === undefined || v < 0 ? undefined : Math.round(v * 100) / 100; }
function int(v) { v = num(v); return v === undefined || v < 0 ? undefined : Math.round(v); }
function cur3(v) { return typeof v === 'string' && /^[A-Za-z]{3}$/.test(v) ? v.toUpperCase() : undefined; }
function compact(o) { var r = {}; for (var k in o) if (o[k] !== undefined && o[k] !== null && o[k] !== '') r[k] = o[k]; return r; }
function sdj(name, data) { return { schema: iglu(name), data: data }; }

// One canonical event from either input shape.
function fromBrowser(ev) {
  var p = ev.properties || {};
  return { name: ev.event, uuid: ev.uuid, props: p, distinctId: p.distinct_id, deviceId: p.$device_id,
    sessionId: p.$session_id, userState: p.$user_state, timeMs: ev.timestamp ? new Date(ev.timestamp).getTime() : undefined,
    ip: undefined, ua: p.$raw_user_agent, groupSet: p.$group_set };
}
function fromCdp(g) {
  var e = g.event, p = e.properties || {};
  return { name: e.event, uuid: e.uuid, props: p, distinctId: e.distinct_id, deviceId: p.$device_id,
    sessionId: p.$session_id, userState: p.$user_state, timeMs: Date.parse(e.timestamp),
    ip: p.$ip, ua: p.$raw_user_agent, groupSet: p.$group_set };
}

// distinct_id becomes the app's user id after identify(); before that it equals $device_id.
// identify() itself is sent while $user_state is still "anonymous", with the new id as distinct_id.
function userIdOf(c, sha256Hex) {
  var identified = c.userState === 'identified' || c.name === '$identify' || (c.distinctId && c.deviceId && c.distinctId !== c.deviceId);
  if (!identified || !c.distinctId) return undefined;
  var id = String(c.distinctId);
  return id.indexOf('@') >= 0 ? sha256Hex(id.trim().toLowerCase()) : id.slice(0, 255);
}

function spProduct(it, currency) {
  var id = str255(pick(it.product_id, it.sku, it.id)), price = money(it.price), cur = cur3(it.currency) || currency;
  if (id === undefined || price === undefined || !cur) return undefined;
  var out = compact({ id: id, name: str255(it.name), price: price, currency: cur, quantity: int(it.quantity),
    variant: str255(it.variant), brand: str255(it.brand), position: int(it.position) });
  out.category = str255(it.category) || '';
  return out;
}
function spProducts(p, currency) {
  var list = Array.isArray(p.products) ? p.products : [], out = [];
  for (var i = 0; i < list.length; i++) { var x = spProduct(list[i] || {}, currency); if (x) out.push(x); }
  return out;
}

// Rungs 2 and 3: Snowplow ecommerce and site_search. Returns the event and entities as the ecommerce plugin
// would send them, plus the plugin call that produces them in the browser; undefined falls to external_event.
function standardEvent(c) {
  var p = c.props, n = String(c.name || '').trim().toLowerCase(), cur = cur3(p.currency), type, t;
  for (t in ECOM) if (ECOM[t].indexOf(n) >= 0) type = t;
  function prod(list) { return list.map(function (d) { return sdj('product', d); }); }
  function action(x) { return sdj('action', { type: x }); }
  if (SEARCH.indexOf(n) >= 0) {
    var q = str255(p.query);
    return q ? { event: sdj('siteSearch', { terms: [q] }), entities: [], plugin: ['trackSiteSearch', { terms: [q] }] } : undefined;
  }
  if (type === 'product_view') {
    var one = spProduct(p, cur);
    return one ? { event: action(type), entities: prod([one]), plugin: ['trackProductView', one] } : undefined;
  }
  if (type === 'add_to_cart' || type === 'remove_from_cart') {
    var line = spProduct(p, cur), total = money(pick(p.cart_total, p.value));
    if (!line) return undefined;
    var cart = total === undefined ? undefined : compact({ cart_id: str255(p.cart_id), total_value: total, currency: line.currency });
    return { event: action(type), entities: prod([line]).concat(cart ? [sdj('cart', cart)] : []),
      plugin: cart ? [type === 'add_to_cart' ? 'trackAddToCart' : 'trackRemoveFromCart', Object.assign({ products: [line] }, cart)] : undefined };
  }
  if (type === 'checkout_step') {
    var step = int(p.step), cs = compact({ step: step >= 1 && step <= 90 ? step : 1, delivery_method: str255(p.shipping_method), payment_method: str255(p.payment_method), coupon_code: str255(p.coupon) });
    var cp = spProducts(p, cur);
    return { event: action(type), entities: prod(cp).concat([sdj('checkout', cs)]), plugin: ['trackCheckoutStep', Object.assign({ context: prod(cp) }, cs)] };
  }
  if (type === 'transaction') {
    var rev = money(pick(p.revenue, p.total, p.value)), oid = str255(pick(p.order_id, p.checkout_id));
    if (!cur || rev === undefined || !oid) return undefined;
    var ps = spProducts(p, cur), qty = 0;
    ps.forEach(function (x) { qty += x.quantity === undefined ? 1 : x.quantity; });
    // payment_method is required by the schema and absent from PostHog's Order Completed.
    var trx = compact({ transaction_id: oid, revenue: rev, currency: cur, payment_method: str255(p.payment_method) || 'unknown',
      total_quantity: qty, tax: money(p.tax), shipping: money(p.shipping), discount_code: str255(p.coupon), discount_amount: money(p.discount) });
    return { event: action(type), entities: prod(ps).concat([sdj('transaction', trx)]), plugin: ['trackTransaction', Object.assign({ products: ps }, trx)] };
  }
  if (type === 'refund') {
    var amt = money(pick(p.total, p.revenue, p.value));
    if (!cur || amt === undefined || !p.order_id) return undefined;
    var rp = spProducts(p, cur), rf = { transaction_id: str255(p.order_id), currency: cur, refund_amount: amt };
    return { event: action(type), entities: prod(rp).concat([sdj('refund', rf)]), plugin: ['trackRefund', Object.assign({ products: rp }, rf)] };
  }
  return undefined;
}

function kindOf(c) {
  if (c.name === '$groupidentify') return 'group';
  if (c.name === '$create_alias') return 'alias';
  if (c.name === '$identify') return 'identify';
  return 'track';
}

// Rung 5: group, alias, autocapture and the prospect's own events.
function externalEvent(c) {
  var p = c.props, kind = kindOf(c), first = Array.isArray(p.products) && p.products.length ? p.products[0] || {} : {};
  var gs = c.groupSet || {};
  return sdj('external', compact({
    name: String(pick(c.name, 'unknown')).slice(0, 255), tool: PH.tool, kind: kind,
    // $pageleave carries how long the page was open; it is the only engagement signal without the tracker.
    value: c.name === '$pageleave' ? num(p.$prev_pageview_duration) : num(pick(p.revenue, p.value, p.total, p.price)),
    currency: cur3(p.currency),
    item_id: str255(pick(p.product_id, p.sku, first.product_id)),
    item_category: str255(pick(p.category, first.category)),
    search_term: str255(typeof p.query === 'string' ? p.query : undefined),
    plan: str255(pick(p.plan, kind === 'group' ? gs.plan : undefined)),
    group_id: str255(kind === 'group' ? p.$group_key : undefined),
    previous_id: str255(kind === 'alias' ? p.alias : undefined),
  }));
}

// The ladder. Returns null for events that are never forwarded.
function ladder(c, sha256Hex) {
  if (DROP.indexOf(c.name) >= 0) return null;
  if (c.name === '$pageview') return { rung: 'page_view', entities: [] };
  var uid = userIdOf(c, sha256Hex);
  if (c.name === '$identify' && uid) return { rung: 'identify', event: sdj('identify', { id: uid }), entities: [] };
  var std = standardEvent(c);
  if (std) return { rung: std.event.schema === iglu('siteSearch') ? 'site_search' : 'ecommerce', event: std.event, entities: std.entities, plugin: std.plugin };
  return { rung: 'external_event', event: externalEvent(c), entities: [] };
}

// Cookieless mode has no $device_id and one shared distinct_id for every visitor, so no entity is sent;
// an identified distinct_id is a user id, never an anonymous one.
function identity(c, sha256Hex) {
  var anon = c.deviceId;
  if (anon === undefined && c.distinctId !== '$posthog_cookieless' && !userIdOf(c, sha256Hex)) anon = c.distinctId;
  if (anon === undefined || anon === null || anon === '') return undefined;
  return sdj('identity', {
    tool: PH.tool, anonymous_id: String(anon).slice(0, 255), user_id: userIdOf(c, sha256Hex) || null,
    session_id: c.sessionId ? String(c.sessionId) : null, session_number: null,
    event_name: String(c.name).slice(0, 255),
  });
}

var PostHogSnowplow = { PH: PH, iglu: iglu, DROP: DROP, fromBrowser: fromBrowser, fromCdp: fromCdp, ladder: ladder, identity: identity, userIdOf: userIdOf };
if (typeof module !== 'undefined' && module.exports) module.exports = PostHogSnowplow;
else if (typeof window !== 'undefined') window.PostHogSnowplow = PostHogSnowplow;
```

</details>

Where to go next:

- Read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) before you go live.
- Copy the definitions in [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).
- When you are ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time. On the client-side approach the visitor ID stays the same, so attributes carry over. On the server-side approach, `domain_userid` changes from PostHog's `$device_id` to Snowplow's cookie ID when you switch, so history keyed on it needs a custom attribute key on `external_identity.anonymous_id`.
- Field reference: [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md).
