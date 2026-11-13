---
title: "Use Signals with your existing analytics"
sidebar_label: "Use Signals with existing analytics"
sidebar_position: 20
description: "Send the events your site already sends to Segment, RudderStack, GA4, Amplitude or Adobe to Snowplow, and calculate Signals attributes on them without retagging."
keywords: ["existing analytics", "segment", "rudderstack", "ga4", "amplitude", "adobe", "external_event", "signals"]
date: "2026-11-13"
content_type: landing
---

If your site already sends events to Segment, RudderStack, Google Analytics 4 (GA4), Amplitude or Adobe, you can send a copy of each event to Snowplow and calculate Signals attributes on it, without retagging your site. An adapter maps each event to the standard Snowplow event that fits it, such as a page view or an ecommerce transaction, and to a generic `external_event` when nothing fits.

You keep your existing tool and its reports. Snowplow receives the same events in parallel, and Signals builds attributes such as pages viewed, products viewed, order value or current plan from them.

:::note[Schemas]
The adapters use the `external_event` and `external_identity` schemas, published on Iglu Central, alongside Snowplow's ecommerce, site search and identify schemas. If you register your own copies of `external_event` and `external_identity`, deploy them to production before you send any event that uses them. Events sent before deployment are rejected, and keep being rejected for several minutes after it.
:::

## Choose your tool

Each tool page covers the setup for that tool, how its events map to Snowplow, its identifiers and its limits.

- **[Segment](/docs/signals/data-sources/existing-analytics/tools/segment/index.md)**: a destination plugin for analytics.js that feeds the Snowplow tracker in the page, or a Destination Function in your Segment workspace.
- **[RudderStack](/docs/signals/data-sources/existing-analytics/tools/rudderstack/index.md)**: a user transformation on a Webhook destination in your RudderStack workspace, or a no-code HTTP Webhook mapping.
- **[Google Analytics 4 and Google Tag Manager](/docs/signals/data-sources/existing-analytics/tools/ga4-and-google-tag-manager/index.md)**: Snowplow's tag templates in your web GTM container, reading the same data layer as GA4, or Snowplow's tag in server-side GTM.
- **[Amplitude](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md)**: a destination plugin for the Amplitude Browser SDK, or a Webhook destination with a template that builds Snowplow events.
- **[Adobe Analytics and Adobe Experience Platform](/docs/signals/data-sources/existing-analytics/tools/adobe/index.md)**: a few lines in the Web SDK `onBeforeEventSend` callback or the AppMeasurement `registerPreTrackCallback`, or Adobe event forwarding.

## Client-side and server-side approaches

Most tools offer two places to run the adapter.

- **Client-side (in the browser).** The adapter runs in the page next to your tool's library. It hooks into the library's plugin or callback API and hands each event to the Snowplow JavaScript tracker, which sends it to your Collector. The Snowplow tracker sets its own random visitor ID and session, and can add page pings and link clicks that your tool doesn't put on the page.
- **Server-side.** Your tool receives the event as usual, and code or configuration in your tool's workspace forwards it to your Collector. Examples are a Segment Destination Function, a RudderStack transformation, an Amplitude Webhook destination, server-side GTM and Adobe event forwarding. There's no Snowplow code in the page, and events from your servers and apps are included, but the visitor key is your tool's own ID and there are no Snowplow sessions.

| | Client-side | Server-side |
| --- | --- | --- |
| What you change | A plugin, callback or tag manager setting next to your tool's library | Code or configuration in your tool's workspace |
| Events covered | Events from the browser | Every source your tool receives: browser, servers, apps and imports |
| Visitor key in Snowplow | Snowplow's random `domain_userid` | Your tool's ID, such as Segment's `anonymousId`, Amplitude's `device_id`, the GA client ID or the Adobe ECID |
| Sessions | Snowplow `domain_sessionid` | None, except on Amplitude, whose events carry a session ID the adapter turns into a session key |
| Engagement | Page pings, link clicks and other tracking from the Snowplow tracker | Only what your tool sends, such as GA4's Enhanced Measurement events through server-side GTM |
| Delivery | Sent from the browser when the event happens. Attributes update within about a second | Waits for your tool's queue or batching first, then attributes update within about a second of the event reaching your Collector |
| Key for interventions | `domain_userid` is safe on the public intervention endpoint | Often not safe; see [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md) |
| Personal data | The browser sends its IP address, user agent, page URLs and user ID to your Collector, plus your tool's cookies if the Collector is on the same site | Only the fields the adapter maps leave your tool; the IP address and user agent are whatever your tool forwards |
| Consent | Usually follows your tool's consent, because the hook only fires for events your tool sends; the Snowplow tracker's own cookies need gating separately | Depends on the tool; some forward events whatever the consent state unless you add a check |

### Pros and cons

**Client-side**

- Pros: Snowplow sessions and a random visitor ID that's safe for interventions. Engagement attributes from page pings. Events reach the Collector without waiting for your tool's servers. Signals history carries over when you [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md), because the visitor ID stays the same.
- Cons: browser events only. Adds the Snowplow tracker to the page, and its cookies need a consent decision. Your tool's cookies reach a Collector on the same site. The Collector is a second host that an ad blocker could block.

**Server-side**

- Pros: no change to the page. Covers server, app and imported events. Your tool's traits and user properties stay inside your tool, because the adapter only sends the fields it maps.
- Cons: no Snowplow sessions or page pings. The visitor key is your tool's ID, which on several tools isn't safe on the public intervention endpoint. Delivery waits for your tool: Segment can batch function calls for up to 10 seconds, and Amplitude's documented target for its streaming destinations is 60 seconds at the 95th percentile. Some approaches need a paid plan or license on your tool.

### Which to choose

- **Start with client-side** if your users are on the web and you want session attributes, engagement attributes or interventions. This is the recommended approach on every tool that has one.
- **Choose server-side** if the events that matter come from your servers or apps, or if you can't change the page or tag manager setup. Read attributes server-side by the key your tool provides, and don't use it for interventions unless the tool page says it's safe.
- **Combine them carefully.** If you add a server-side approach for server and app events, don't also send your browser events through it. The same browser event would arrive twice, under two different visitor keys.

### Warehouse history

A third option, where your tool exports to a warehouse, is to calculate batch attributes from that export: Segment's warehouse or Profiles Sync, the GA4 BigQuery export, or Adobe Analytics Data Feeds. This gives Signals history for visitors it has never seen in the stream.

:::caution
Warehouse attributes need a Signals warehouse connection, are refreshed periodically rather than in real time, and are keyed on your tool's ID. They can't trigger interventions on their own.
:::

## What you get

- Page views as Snowplow page views, ecommerce as Snowplow ecommerce events with every product of an order as its own entity, site searches as `site_search` and logins as `identify` with the user ID only. See [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md).
- Every other event as `external_event`, with your tool's event name and a fixed set of typed fields, so attributes can filter on the name.
- An `external_identity` entity on every event, holding your tool's IDs, so Snowplow data can be joined back to your tool's data.
- Attribute groups for visitor activity, purchase intent, account and plan, and funnel steps on every approach, plus session engagement on client-side approaches. See [Starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md).

## What you don't get

- **Your tool's server-side processing.** Adobe visits, eVar persistence, processing rules and bot filtering, and anything else your tool computes after it receives an event, aren't reproduced. The adapter sees each event as the page sent it.
- **Properties outside the mapped fields.** Signals calculates attributes only on properties a schema declares, so anything that doesn't fit a standard Snowplow schema or a typed `external_event` field is dropped. This includes identify traits and GA4 user properties.
- **Sessions on server-side approaches**, except Amplitude's.
- **Stitching across keys.** One attribute read uses one key. Joining an anonymous visitor to a logged-in user needs [Snowplow Identities](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md#resolve-identities-with-snowplow_id).
- **Real-time warehouse attributes.** History from your tool's export is periodic.

## Where to start

1. Open your [tool's page](#choose-your-tool) and set up its client-side approach.
2. Check that your pipeline resolves the `external_event` and `external_identity` schemas, or deploy your own copies to production before you send any events. See the [external_event](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) and [external_identity](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) references.
3. Check that events arrive in Snowplow Micro or Console as page views, ecommerce events, `identify` and `external_event`, each with an `external_identity` entity.
4. Agree what personal data may reach Snowplow, and wire consent. See [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).
5. Create three or four [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) keyed on `domain_userid`.
6. When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
