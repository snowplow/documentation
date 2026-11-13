---
title: "Privacy and consent for events from your existing tool"
sidebar_label: "Privacy and consent"
sidebar_position: 30
description: "Where personal data travels on each approach, which of your tool's cookies reach a same-site Collector, how adapters follow your tool's consent state, and what to strip."
keywords: ["privacy", "consent", "personal data", "cookies", "same-site collector", "external_identity"]
date: "2026-11-13"
content_type: concept
---

An adapter sends Snowplow only the fields it maps: the standard fields of each Snowplow event, the typed fields of `external_event`, and your tool's IDs in `external_identity`. Traits, user properties and any other property stay in your tool. Some personal data still reaches Snowplow on every approach, such as the IP address, page URLs and the user ID, and client-side approaches add cookies. Review this page with whoever owns privacy for your site before you send production traffic.

## What the adapters never send

- **Identify traits and user properties**, such as email, name and plan. Identify calls arrive with the user ID only.
- **Properties that don't fit a field**, including emails in event properties, Adobe context data and eVars that aren't mapped, and the Email namespace of the Adobe `identityMap`.
- **Email addresses used as user IDs, on some adapters.** When a user ID contains `@`, the Segment adapter and the Adobe event forwarding converter send an unsalted SHA-256 hash of the lowercased value instead, and the Adobe client-side adapters drop it. The RudderStack and Amplitude adapters send the user ID unchanged, so hash or remove email-shaped user IDs in your tool first. This is the Segment adapter's function:

```js
// Some workspaces use the email as userId; hash it so it never reaches the pipeline in clear.
function userIdOut(id) {
  if (id === undefined || id === null || id === '') return undefined;
  var s = String(id);
  return s.indexOf('@') > -1 ? hex(sha256(utf8Bytes(s.trim().toLowerCase()))) : s.slice(0, 255);
}
```

A hashed email is still personal data. If your user IDs are emails, decide whether a hash may reach Snowplow at all.

## Where personal data travels

| Data | Client-side approaches | Server-side approaches | Warehouse history |
| --- | --- | --- | --- |
| IP address | The browser's own, from the request | Whatever your tool forwards, such as Segment's `context.ip`, RudderStack's `request_ip` or Amplitude's `ip_address`. Without it, the Collector records your tool's server address | In your tool's export |
| User agent | The browser's own | Whatever your tool forwards. Amplitude's webhook payload has none | In your tool's export |
| Page URL, referrer and title | Sent, including query strings | Sent when your tool includes them | In your tool's export |
| User ID | Sent in clear; hashed when it contains `@` on Segment, dropped on Adobe | Sent in clear; hashed when it contains `@` on Segment and Adobe event forwarding | In your tool's export |
| Search terms and other free text | Sent in `site_search` and `external_event.search_term` | Same | In your tool's export |
| Your tool's cookies | Reach a Collector on the same site; see below | Not sent | Not applicable |
| Snowplow cookies | Set by the Snowplow tracker (`_sp_id`, `_sp_ses`) and the Collector | Not set in the browser | Not applicable |

Search terms and page URLs can carry anything your visitors type, including emails or tokens in query strings. Check a sample of your real URLs and search events before you start.

Your tool itself still receives everything it did before, including emails in identify traits, group traits, GA4 parameters and Adobe eVars. The adapters don't change that.

On server-side approaches, your tool's runtime sees the full event before the adapter maps it. That's the case already for your tool, but it also applies to any code you add there: a server-side GTM container, a Segment function or Adobe event forwarding all receive emails the page puts in event parameters. Don't log raw events in that code.

On warehouse approaches, the full export sits in your warehouse. Signals reads only the aggregated columns your attribute definitions select.

## Your tool's cookies and a same-site Collector

When your Snowplow Collector is on the same site as your pages, for example `collector.example.com` serving `www.example.com`, the browser sends every first-party cookie for that site with each request to the Collector. That includes your tool's cookies, some of which hold IDs or more:

| Tool | Cookies a same-site Collector receives |
| --- | --- |
| Segment | `ajs_anonymous_id` on every request, `ajs_user_id` and `ajs_group_id` once set. `ajs_user_id` holds an email if your user IDs are emails |
| RudderStack | `rl_anonymous_id`, `rl_user_id`, `rl_trait`, `rl_group_id`, `rl_group_trait`, `rl_session` and `rl_page_init_referrer`. `rl_trait` and `rl_group_trait` hold identify and group traits, including any email, base64-encoded |
| Amplitude | `AMP_` cookies, which hold `device_id`, `user_id` and UTM values |
| Adobe | Web SDK `kndctr` identity, cluster and consent cookies; `AMCV`, which holds the ECID and, after `setCustomerIDs`, a customer ID hash; `AMCVS`; and `s_cc` |

You have three choices:

- **Accept it.** The cookies arrive in the request's cookie header. Agree with your privacy owner how your Collector handles headers.
- **Put the Collector on a different site** from your pages. The browser then doesn't send your site's first-party cookies to it.
- **Send without credentials.** Add `credentials: 'omit'` to the Snowplow tracker's `newTracker` options, as on the [RudderStack page](/docs/signals/data-sources/existing-analytics/tools/rudderstack/index.md#set-up-the-client-side-approach). On adapters that post to the Collector directly rather than through the tracker, such as Amplitude's [variant without the tracker](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md#send-without-the-snowplow-tracker), set it on the `fetch` call:

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

Sending without credentials also means the Collector can't read or set its own cookie on that request.

## How adapters follow your tool's consent state

Client-side adapters hook into your tool's library at the point where it sends an event. If your tool holds or drops events because of consent, the adapter sees only what your tool sends. Server-side adapters run after your tool has accepted the event, so they forward whatever your tool forwards unless you add a check.

| Tool and approach | Consent pending | Consent refused |
| --- | --- | --- |
| Adobe Web SDK, `onBeforeEventSend` | Held, then sent together when consent is granted | Dropped and never replayed after a later grant |
| Adobe AppMeasurement, `registerPreTrackCallback`, with ECID opt-in | Held until approval, then sent | Not sent, because AppMeasurement sends no hit without approval |
| GA4, GTM tag templates | Depends on the consent settings you give the Snowplow tags in GTM | Same |
| GA4, page script that copies gtag calls | Ignored: sends everything and sets Snowplow cookies | Same |
| GA4, server-side GTM tag | Ignored unless you add a consent trigger | Same |
| Segment, Amplitude, RudderStack | The adapter runs on every event your tool processes | Same |

### Replayed events carry the time and URL of the grant

When the Adobe Web SDK holds events while consent is pending and releases them on the grant, the adapter receives them all at that moment. Every replayed event carries the page URL and device time of the grant, not of the original action. Attributes that depend on page URL or time, such as pages viewed or time since the last event, will be off for those events.

### Never let the hook throw

Adobe documents that an uncaught exception in `onBeforeEventSend` stops the event, and nothing is sent to Adobe either. Wrap the adapter so that a Snowplow problem can't affect your Adobe data:

```js
alloy('configure', {
  // ...your existing configuration
  onBeforeEventSend: function (content) {
    try { mirrorXdm(content); } catch (e) {}
  },
});
```

If you already have an `onBeforeEventSend` callback, merge the adapter call into it.

### Gate server-side GTM on Consent Mode

Snowplow's server-side GTM tag has no consent check of its own, so it forwards every event whatever the consent state. Add a trigger condition so it only fires when analytics storage is granted. GA4 hits carry the Consent Mode state in the `gcs` parameter, and only `G111` and `G101` mean analytics storage is granted:

```js
if (gcs && gcs !== 'G111' && gcs !== 'G101') {
  // Consent denied for analytics storage: don't forward.
}
```

:::tip
Build the equivalent as a trigger condition in your container. Use Preview mode to find the event data key that holds `gcs`, and check that a consent-denied visit sends nothing to your Collector.
:::

### Gate the Snowplow tracker too

On client-side approaches, the adapter only stops events, not the Snowplow tracker's cookies. The tracker sets `_sp_id` and `_sp_ses` whatever your tool's consent state, including with Consent Mode denied. Gate loading the tracker, or its cookies, on the same consent signal your tool uses. If you turn on the tracker's form tracking, add a denylist for email and other personal fields: form tracking sends the value of every field that isn't on the denylist, such as a company name.

## What to strip

Before production traffic, check that none of these reach Snowplow, or agree that they may:

- User IDs that are emails, in clear or hashed.
- Emails, tokens or names in page URLs, referrers and query strings.
- Free text in search terms and in any property you map to an `external_event` field.
- Form field values, if you turn on the Snowplow tracker's form tracking.
- Your tool's cookies at a same-site Collector, `ajs_user_id` and `AMCV` most of all.
- IP addresses, if your privacy policy requires them to be truncated or dropped. Use the pipeline's IP anonymization if so.

On Adobe, also check which eVars, props and XDM fields you map into `plan`, `group_id` and `search_term`, since one of them may hold an email on your report suite.
