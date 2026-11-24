---
title: "Use Signals with Google Analytics 4 and Google Tag Manager"
sidebar_label: "Google Analytics 4 and Google Tag Manager"
sidebar_position: 30
description: "Send the events your site already sends to Google Analytics 4 into Snowplow, through Google Tag Manager, a page script, or server-side Google Tag Manager, and build Signals attributes on them."
keywords: ["ga4", "google analytics 4", "google tag manager", "server-side gtm", "external_event", "signals"]
date: "2026-11-17"
content_type: how-to
---

Use the events your site already sends to Google Analytics 4 (GA4) to calculate Snowplow Signals attributes, without retagging your site. You add Snowplow tags next to your GA4 tags in Google Tag Manager (GTM), and each GA4 event maps to a Snowplow event, as described in [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md?analytics-tool=ga4-and-google-tag-manager#map-events-from-each-tool).

Most sites should use GTM tag templates: Snowplow tags in the web GTM container that already sends your GA4 events, with no page code to change. The Snowplow tracker runs in the browser, so you get Snowplow sessions, page pings, and interventions in the page. If you call `gtag()` directly and don't use GTM, use the page script instead. Use server-side GTM only if you already run it and can't change the web container or the page: it has no sessions or in-page interventions, and values arrive a couple of minutes later. If the GA4 BigQuery export is on, you can also give Signals history from before you connected Snowplow, through a Signals warehouse connection.

## Before you begin

You need:

- GA4 on your site, through GTM.
- A Snowplow Collector URL for a pipeline with Signals enabled.
- If you set up without an agent, the `external_event` and `external_identity` schemas in your Snowplow registry, under your vendor. See [Set up without an agent](/docs/signals/data-sources/existing-analytics/index.md#set-up-without-an-agent). With an agent, the `existing-analytics` skill creates them for you. Every other schema the setup uses is on Iglu Central.

## Set up with an agent

The `existing-analytics` skill in the [Snowplow plugin](/docs/ai/skills/index.mdx) holds the tested setup and mapping script for each approach. Install the plugin:

```bash
npx plugins add snowplow/skills
```

Then ask your agent, in the repository for your site:

```text
Use the Snowplow existing-analytics skill to send our GA4 events to
Snowplow with Snowplow tags in our web Google Tag Manager container.
Test against my Console development environment first.
```

The agent first creates the `external_event` and `external_identity` schemas in your registry, under your vendor, if they don't exist yet. It then finds how your site loads GA4 and gives you the exact tags, variables, and triggers to create in your GTM container, including the code for the Custom JavaScript variables. For the page script approach, it adds the tracker and mapping file to your site itself. You still create the tags in GTM, set their consent requirements, and publish the container, unless your agent has browser access to GTM.

## Set up GTM tag templates

The Snowplow tags fire on the same data layer pushes as your GA4 tags. For the templates themselves, see [Snowplow Google Tag Manager templates](/docs/sources/google-tag-manager/index.md). The [GA4 and GTM setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#set-up-gtm-tag-templates) has the code for the Custom JavaScript variables.

<Steps>

### Add the templates

In GTM, go to **Templates**. Under **Tag Templates**, select **Search Gallery** and add **Snowplow v4** and **Snowplow Ecommerce**, both by snowplow. Under **Variable Templates**, select its own **Search Gallery** and add **Snowplow v4 Settings** by snowplow.

### Create the settings variable

Go to **Variables**, then under **User-Defined Variables** select **New** and choose **Snowplow v4 Settings**. Then:

- Set **Collector Endpoint Hostname** to your Collector as a full URL starting with `https://`.
- Under **JavaScript Tracker**, set **Snowplow JavaScript Tracker Library** to **jsDelivr** and **Library version** to `4.10.3`.
- Set **Application ID** to your app ID.
- Under **Predefined Contexts**, keep **webPage** and select **session**.

Select this variable on every Snowplow tag you create in the later steps: **Snowplow Settings** on a **Snowplow v4** tag, **Tracker Settings** on a **Snowplow Ecommerce** tag.

### Create the identity variable

Create a Custom JavaScript variable named `CJS - external_identity` with the code from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#set-up-gtm-tag-templates). It reads the GA client ID and session from the `_ga` cookies and builds the `external_identity` entity, so you can join Snowplow data back to GA4. Replace the measurement ID in the code with yours, and `com.example` in its schema URI with your vendor, and create a Data Layer Variable `DLV - user_id` for the `user_id` key your site pushes.

On every Snowplow tag you create in the later steps, open **Additional Tracking Parameters**, then **Add Custom Context Entities**, and add `{{CJS - external_identity}}` in the **Context Entities** column.

### Add page views

Create a **Snowplow v4** tag with **Tag Type** set to **Page View**, fired on a **Window Loaded** trigger. Use **Window Loaded**, not **All Pages**, so the `_ga` cookie is set before the first page view. Under **Page View Configuration**, set **Enable Page Activity Tracking** to **Yes**, with **Minimum Visit Length** and **Heartbeat Interval** set to `5` seconds, to send page pings.

If your site changes pages with `history.pushState`, create a second page view tag with the same settings, fired on a **History Change** trigger. Load the Signals plugin from the Window Loaded tag only, as described in [Receive interventions](#receive-interventions).

### Add site search

Create a **Snowplow v4** tag with **Tag Type** set to **Site Search**. Add a **terms (required)** parameter set to a variable holding the search term, and fire it on your GA4 `search` or `view_search_results` event.

### Add ecommerce

Create a Data Layer Variable `DLV - ecommerce` (Data Layer Version 2) for the `ecommerce` key. Then create a Custom JavaScript variable named `CJS - snowplow_ecommerce_arg` with the code from the [setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#set-up-gtm-tag-templates). It turns the GA4 `ecommerce` object into the argument the Snowplow Ecommerce tag expects, with every item in the order as a product.

The variable doesn't check for the fields Snowplow requires, so these payloads produce failed events: no event-level `currency`, a `purchase` without `transaction_id` or `value`, `purchase` items without `quantity`, a `refund` without `value`, and items without `item_id`. Check that your data layer sends these fields, and look for failed events when you test in your development environment.

Then create one **Snowplow Ecommerce** tag per GA4 ecommerce event you send. In each, set **Ecommerce API** to **Snowplow Ecommerce**, **Ecommerce Function** to the matching function, and **Ecommerce Argument** to `{{CJS - snowplow_ecommerce_arg}}`. Under **Plugin Settings**, set **Snowplow Ecommerce Plugin Library** to **Do not add**, because the tracker build already includes it.

| GA4 event (trigger) | Ecommerce Function |
|---|---|
| `view_item` | Track Product View |
| `add_to_cart` | Track Add To Cart |
| `remove_from_cart` | Track Remove From Cart |
| `begin_checkout` | Track Checkout Step |
| `purchase` | Track Transaction |
| `refund` | Track Refund |

### Add login

Create a **Snowplow v4** tag with **Tag Type** set to **[Custom Command]**, with the command `setUserId` and the argument `{{DLV - user_id}}`. Then create a **Self-describing Event** tag with **Schema URL** `iglu:com.snowplowanalytics.snowplow/identify/jsonschema/1-0-0` and one parameter, `id`, set to `{{DLV - user_id}}`. Fire both on your `login` event. Never map an email address here.

### Add your other events

For GA4 events with no Snowplow equivalent, create two **Snowplow v4** tags with **Tag Type** set to **Self-describing Event** and **Schema URL** `iglu:com.example/external_event/jsonschema/1-0-0`, with `com.example` replaced by your vendor: one for `join_group` and one for your other events. Add these parameters:

| Parameter name | Parameter value |
|---|---|
| `name` | `{{Event}}` |
| `tool` | `ga4` |
| `kind` | `group` on the `join_group` tag, `track` on the other |
| `plan` | a Data Layer Variable for `plan`, if you send it |
| `group_id` | on the `join_group` tag only: a Data Layer Variable for `group_id` |
| `item_id`, `item_category`, `search_term`, `currency` | Data Layer Variables, if your events carry them |

A Data Layer Variable keeps the last value pushed for its key, so `group_id` goes on the `join_group` tag only. Fire the `join_group` tag on a Custom Event trigger for `join_group`, and the other tag on a Custom Event trigger matching your event names, for example `^(signup_form_submitted|request_demo)$` as a regular expression.

For `sign_up` and `generate_lead`, which have Google schemas on Iglu Central under `com.google.tag-manager.server-side`, use a Self-describing Event tag with **Schema URL** `iglu:com.google.tag-manager.server-side/sign_up/jsonschema/1-0-0` (parameter `method`) or `iglu:com.google.tag-manager.server-side/generate_lead/jsonschema/1-0-0` (parameters `currency` and `value`).

### Set consent

The Snowplow tags fire whatever the consent state until you add a requirement. On each Snowplow tag, open **Advanced Settings**, then **Consent Settings**, select **Require additional consent for tag to fire**, and add `analytics_storage`, or the consent types your consent management platform sets.

### Receive interventions

On the Window Loaded page view tag, open **Load Plugins** and add a row with **Plugin URL** set to `https://cdn.jsdelivr.net/npm/@snowplow/signals-browser-plugin@0.2.2/dist/index.umd.min.js` and **Plugin Configuration** set to `snowplowSignals,SignalsPlugin`. If the tag also fires on **History Change**, split it and load the plugin only on the Window Loaded one. Then add a **Custom HTML** tag that subscribes to interventions, with the Window Loaded page view tag as its **Set-up Tag** under **Advanced Settings**, then **Tag Sequencing**. See [Subscribe with the browser tracker plugin](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin).

### Preview and publish

Use GTM Preview to check that each tag fires once per event, then publish the container. After you save a change, close the Tag Assistant tab and your site's tab, then select **Preview** again.

### Check it works

Test with your Console development environment, which runs Snowplow Micro hosted by Snowplow. Every Snowplow trial includes one. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md).

1. In Console, go to **Pipelines**, select your development environment, and copy its Collector endpoint.
2. Point the Snowplow v4 Settings variable at it, as a full URL starting with `https://`.
3. Send test traffic from GTM Preview.
4. Select **Open dashboard** to see the good and failed events.

Check that:

- Page views arrive for full loads and route changes, with a `domain_userid` and a `domain_sessionid`.
- A purchase arrives as one `snowplow_ecommerce_action` with `type` `transaction`, a transaction entity, and one product entity per item.
- Custom events arrive as `external_event` with `tool` `ga4` and `name` set to the GA4 event name.
- Every event carries an `external_identity` entity with the GA client ID in `anonymous_id`.
- No event failed, and no email address appears in any event.

When the events look right, point the settings variable at your pipeline's Collector.

</Steps>

## Set up the other approaches

The [GA4 and GTM setup reference](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md) has every step and the code for each of these approaches. You can combine approaches, for example GTM tag templates for live attributes plus the BigQuery export for history.

### Page script

Use the [page script](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#page-script) if you call `gtag()` directly without GTM. Save the mapping file, [`ladder.js`](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/scripts/ga4-and-google-tag-manager/ladder.js), on your site, set `VENDOR` near its top to your vendor, and load it before the script. The script loads the Snowplow tracker, wraps `dataLayer.push`, which `gtag()` writes to, and sends each GA4 call through the tracker with an `external_identity` entity. It also turns on Snowplow's own page view, page ping, link click, and form tracking, because `gtag.js` sends some events without a `dataLayer.push`. Form tracking sends the values people type, so denylist every field that can hold personal data, or leave it off. The script doesn't read Google Consent Mode, so load it only after your consent management platform grants analytics consent.

### Server-side GTM

[Server-side GTM](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#server-side-gtm) adds the **Snowplow** tag to a server-side GTM container that already receives your GA4 hits through the GA4 client. Your tagging server needs an `https://` URL, set in **Admin**, then **Container Settings**, under **Server container URLs**. You fire the tag on a Custom trigger where **Client Name** equals your GA4 client's name, map events to schemas under **Advanced Event Settings**, and add `external_identity` under **Context entities**, using your vendor in both schema URIs. Events you don't map keep the tag's defaults: recommended events such as `sign_up` arrive with `com.google.tag-manager.server-side` schemas, `user_engagement` with `com.google.ga4`, and Enhanced Measurement events such as `scroll` with `com.google.ga4.enhanced-measurement`. It has no Snowplow sessions and no key that's safe on the public intervention endpoint. For the tag, see [Google Tag Manager server-side](/docs/destinations/forwarding-events/google-tag-manager-server-side/index.md). For consent, see [Gate server-side GTM on Consent Mode](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md#gate-server-side-gtm-on-consent-mode).

:::note[Not yet validated in a full workspace]
The tag was tested in a server container on a local tagging server, not yet on a hosted tagging server with an `https://` URL. Check it against your development environment before you go live.
:::

### Warehouse history: BigQuery export

If the GA4 BigQuery export is on, schedule the [BigQuery query](https://github.com/snowplow/skills/blob/main/plugins/snowplow/skills/existing-analytics/references/ga4-and-google-tag-manager.md#warehouse-history-bigquery-export) that builds one row per GA client ID with 90-day totals. In Signals, create a batch source on the table, with `ga_client_id` as the key column and `updated_at` as the timestamp field, and create an attribute key for the GA client ID. Warehouse attributes update periodically, so they can't trigger interventions.

## Troubleshooting

- **No events arrive:** set **Collector Endpoint Hostname** to a full `https://` URL, and set the tracker library to **jsDelivr** with a version. The default loads no tracker.
- **A purchase also resends the product view:** set **Snowplow Ecommerce Plugin Library** to **Do not add** on every ecommerce tag.
- **Route changes send extra page views:** load the Signals plugin only from the Window Loaded page view tag, not the History Change one.
- **An event you expected is missing:** every GA4 event needs its own Snowplow tag and trigger. Enhanced Measurement events, such as scroll and file downloads, aren't in the data layer, so only server-side GTM sends them. On the other approaches, use Snowplow's page pings and link clicks.
- **A custom event carries an old `group_id` or `plan`:** Data Layer Variables keep the last value pushed. Put `group_id` on the `join_group` tag only.
- **Funnel attributes stay empty:** GA4 event names are lowercase with underscores, such as `signup_form_submitted`. Use them exactly in your attribute filters.

Before you go live, read [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md) for how each approach handles consent and personal data. Then [create attribute groups](/docs/signals/attributes/index.md) for your use case, keyed as described in [Identifiers](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md?analytics-tool=ga4-and-google-tag-manager#tool-ids-by-tool), and [receive interventions in the page](/docs/signals/applications/subscribe/index.md#subscribe-with-the-browser-tracker-plugin). When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
