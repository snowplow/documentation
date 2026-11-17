---
title: "Use Signals with your existing analytics"
sidebar_label: "Use Signals with existing analytics"
sidebar_position: 20
description: "Send the events your site already sends to Segment, RudderStack, GA4, Amplitude, Adobe or PostHog to Snowplow, and calculate Signals attributes on them without retagging."
keywords: ["existing analytics", "segment", "rudderstack", "ga4", "amplitude", "adobe", "posthog", "external_event", "signals"]
date: "2026-11-17"
content_type: landing
---

If your site already sends events to Segment, RudderStack, Google Analytics 4 (GA4), Amplitude, Adobe or PostHog, you can send a copy of each event to Snowplow and calculate Signals attributes on it, without retagging your site. You keep your existing tool and its reports.

An adapter maps each event to the standard Snowplow event that fits it, such as a page view or an ecommerce transaction, and to a generic [`external_event`](/docs/signals/data-sources/existing-analytics/reference/external-event/index.md) when nothing fits. Every event also carries an [`external_identity`](/docs/signals/data-sources/existing-analytics/reference/external-identity/index.md) entity with your tool's IDs. Both schemas are published on Iglu Central.

## Choose your tool

Each tool page starts with the recommended approach for that tool.

| Tool | Recommended approach | Other approaches |
| --- | --- | --- |
| [Segment](/docs/signals/data-sources/existing-analytics/tools/segment/index.md) | A destination plugin in analytics.js | Destination Function |
| [RudderStack](/docs/signals/data-sources/existing-analytics/tools/rudderstack/index.md) | A custom device mode integration in the RudderStack SDK | Transformation on a Webhook destination, or no-code Webhook mappings |
| [GA4 and Google Tag Manager](/docs/signals/data-sources/existing-analytics/tools/ga4-and-google-tag-manager/index.md) | Snowplow's tag templates in your web GTM container | A page script that copies `gtag()` calls, or server-side GTM |
| [Amplitude](/docs/signals/data-sources/existing-analytics/tools/amplitude/index.md) | A destination plugin in the Browser SDK | Webhook destination |
| [Adobe](/docs/signals/data-sources/existing-analytics/tools/adobe/index.md) | A Web SDK `onBeforeEventSend` callback | AppMeasurement callback, Tags rules, or event forwarding |
| [PostHog](/docs/signals/data-sources/existing-analytics/tools/posthog/index.md) | A `before_send` hook in posthog-js | HTTP Webhook destination |

## Client-side and server-side approaches

The recommended approaches are client-side: the adapter runs in the page and hands each event to the Snowplow JavaScript tracker, which sends it to your Collector. The tracker sets its own random visitor and session IDs and adds page pings, so every [starter attribute group](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) works and interventions can be delivered to the visitor.

Server-side approaches forward events from your tool's workspace to your Collector. They need no change to the page and include events from your servers and apps, but they key visitors on your tool's own ID and have no Snowplow sessions on most tools.

| | Client-side | Server-side |
| --- | --- | --- |
| Events covered | Events from the browser | Everything your tool receives, including servers and apps |
| Visitor key | Snowplow's random `domain_userid` | Your tool's ID |
| Sessions and page pings | Yes | Session IDs on Amplitude and PostHog only, no page pings |
| Interventions in the page | Yes | No: read attributes from your backend instead |
| Delivery | As the event happens | After your tool's own queue |

Use client-side for web visitors, and add server-side only for events that don't come from the browser. Don't send the same browser events through both, or they arrive twice under two visitor keys.

### Delivery and delay

On a client-side approach, attributes update within about a second of each event, and interventions typically reach the page in 1 to 2 seconds. A server-side approach first waits for your tool's queue and batching, which adds from several seconds to a minute or more depending on the tool.

The first events after you publish an attribute group or intervention can take a minute or more. Later events update at the usual speed.

### Warehouse history

If your tool exports to a warehouse, such as Segment's warehouse, the GA4 BigQuery export, Adobe Data Feeds or PostHog's batch exports, you can also calculate batch attributes on that export, to give Signals history for visitors it hasn't seen in the stream. This needs a Signals warehouse connection, and the values refresh periodically rather than in real time.

## What you don't get

- **Your tool's own processing**, such as Adobe visits, eVar persistence or bot filtering. The adapter sees each event as the page sent it.
- **Properties outside the mapped fields.** Attributes read only fields a schema declares, so properties that don't map to a standard Snowplow event or an `external_event` field, such as identify traits and GA4 user properties, aren't available. See [Event mapping](/docs/signals/data-sources/existing-analytics/how-it-works/event-mapping/index.md).
- **Stitching across keys** without [Snowplow Identities](/docs/signals/data-sources/existing-analytics/how-it-works/identifiers/index.md#resolve-identities-with-snowplow_id).

## Where to start

1. Open your [tool's page](#choose-your-tool) and set up its recommended approach.
2. Test in your Console development environment, a hosted Snowplow Micro included in every trial. Point the adapter at its Collector endpoint, under **Pipelines** in Console, then select **Open dashboard** and check that events arrive with none failed. See [Run Snowplow Micro through Console](/docs/testing/snowplow-micro/console/index.md). When the events look right, switch the adapter to your pipeline's Collector.
3. Agree what personal data may reach Snowplow, and wire consent. See [Privacy and consent](/docs/signals/data-sources/existing-analytics/how-it-works/privacy-and-consent/index.md).
4. Create the [starter attribute groups](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md) you need.
5. [Create an intervention](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#create-an-intervention) and [receive it in the page](/docs/signals/data-sources/existing-analytics/starter-attribute-groups/index.md#receive-interventions-in-the-page).
6. When you're ready, [move to native Snowplow tracking](/docs/signals/data-sources/existing-analytics/move-to-native-tracking/index.md) one event at a time.
