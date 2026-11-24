---
title: "Privacy and consent for events from your existing tool"
sidebar_label: "Privacy and consent"
sidebar_position: 30
description: "Where personal data travels on each approach, which of your tool's cookies reach a same-site Collector, how adapters follow your tool's consent state, and what to strip."
keywords: ["privacy", "consent", "personal data", "cookies", "same-site collector", "external_identity"]
date: "2026-11-17"
content_type: concept
---

An adapter sends Snowplow only the fields it maps: the standard fields of each Snowplow event, the typed fields of `external_event`, and your tool's IDs in `external_identity`. Traits, user properties and other properties stay in your tool. Some personal data still reaches Snowplow on every approach, such as the IP address, page URLs and the user ID. Review this page with whoever owns privacy for your site before you send production traffic.

## What reaches Snowplow

| Data | Client-side approaches | Server-side approaches |
| --- | --- | --- |
| IP address and user agent | The browser's own | Whatever your tool forwards |
| Page URL, referrer and title | Sent, including query strings | Sent when your tool includes them |
| User ID | Sent unchanged. If it's an email address, the email reaches Snowplow | Same |
| Search terms | Sent in `site_search` and `external_event.search_term` | Same |
| Your tool's cookies | Sent to a Collector on the same site as your pages; see [Your tool's cookies and a same-site Collector](#your-tools-cookies-and-a-same-site-collector) | Not sent |
| Snowplow cookies | Set by the Snowplow tracker and the Collector | Not set |

Identify traits, user properties and any property that doesn't fit a mapped field are never sent. Your tool itself still receives everything it did before.

## Your tool's cookies and a same-site Collector

When your Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends every first-party cookie for that site with each request to the Collector. That includes your tool's cookies, some of which hold user IDs or traits. You can:

- **Accept it,** and agree with your privacy owner how your Collector handles request headers.
- **Put the Collector on a different site** from your pages.
- **Send without credentials.** Add `credentials: 'omit'` to the Snowplow tracker's `newTracker` options. On adapters that post to the Collector directly, such as Amplitude's [variant without the tracker](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/amplitude.md#send-without-the-snowplow-tracker), set it on the `fetch` call:

```js
await fetch(COLLECTOR + '/com.snowplowanalytics.snowplow/tp2', {
  method: 'POST',
  body,
  keepalive: true,
  // 'omit' keeps ajs_* cookies off a same-site collector.
  credentials: 'omit',
  headers: { 'content-type': 'application/json; charset=utf-8' },
});
```

## How adapters follow your tool's consent state

Client-side adapters hook into your tool's library where it sends an event, so they see only what your tool sends. If your tool holds or drops events because of consent, so does the adapter. Server-side adapters run after your tool has accepted an event, so they forward whatever your tool forwards unless you add a check.

| Tool and approach | Follows your tool's consent? |
| --- | --- |
| Adobe Web SDK and AppMeasurement callbacks | Yes. Events held while consent is pending are sent when it's granted |
| GA4, GTM tag templates | Only with the consent settings you give the Snowplow tags in GTM |
| GA4, page script | No: load it only after consent is granted |
| GA4, server-side GTM | Only with the [consent condition](#gate-server-side-gtm-on-consent-mode) |
| Segment, RudderStack, Amplitude client-side | The adapter runs on every event your tool processes |
| PostHog, `before_send` hook | Yes |
| Segment, RudderStack, Amplitude, PostHog and Adobe server-side | The destination runs on every event your tool ingests |

On the Adobe Web SDK, wrap the adapter so a Snowplow problem can't stop the event reaching Adobe:

```js
alloy('configure', {
  // ...your existing configuration
  onBeforeEventSend: function (content) {
    try { mirrorXdm(content); } catch (e) {}
  },
});
```

### Gate server-side GTM on Consent Mode

Snowplow's server-side GTM tag has no consent check of its own, so it forwards every event whatever the consent state. If your site uses Google Consent Mode, add a trigger condition so the tag doesn't fire when analytics storage is denied. Without Consent Mode, `gtag.js` sends no `gcs` at all, so a condition that requires `G111` or `G101` blocks every event; gate GA4 itself through your consent management platform instead. GA4 hits carry the Consent Mode state in the `gcs` query parameter, and only `G111` and `G101` mean analytics storage is granted.

Create a variable of type **Query Parameter** (under **Request**) with **Parameter Name** `gcs`, and add a condition to the Snowplow tag's trigger where that variable **matches RegEx** `^G1[01]1$`. Check in Preview that a consent-denied visit sends nothing to your Collector.

### Gate the Snowplow tracker too

On client-side approaches, the Snowplow tracker sets its own cookies whatever your tool's consent state. Gate loading the tracker on the same consent signal your tool uses.

## What to check before going live

Check that none of these reach Snowplow, or agree that they may:

- User IDs that are emails.
- Emails or tokens in page URLs, referrers and search terms.
- Free text in any property you map to an `external_event` field. On Adobe, check which eVars, props and XDM fields you map.
- Your tool's cookies at a same-site Collector.
- IP addresses, if your privacy policy requires them to be truncated. Use your pipeline's IP anonymization if so.
