---
title: "Forward events to Meta Conversions API"
sidebar_label: "Meta Conversions API"
sidebar_position: 4
description: "Send Snowplow events to Meta for ad measurement, attribution, and optimization using the Conversions API with server-side user matching and event data."
keywords: ["Meta", "Facebook", "Conversions API", "ad measurement", "attribution", "event forwarding"]
date: "2026-07-03"
---

```mdx-code-block
import EventForwardingSchemaTable from '@site/src/components/EventForwardingSchemaTable';
import metaConversionsSchema from '@site/src/components/EventForwardingSchemaTable/Schemas/meta-conversions.json';
```

Send Snowplow events to Meta for ad measurement, attribution, and campaign optimization using the [Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api). The Conversions API delivers events server-side, which complements the browser Pixel and improves measurement when browser signals are unavailable.

## Prerequisites

Before setting up the forwarder in Console, you'll need the following from your Meta account:

- **Pixel ID**: the ID of the Meta Pixel (or Dataset) that receives the events. Meta uses the Pixel ID and Dataset ID interchangeably for the Conversions API.
- **Access token**: a system user access token with the `ads_management` permission. Generate it in [Meta Events Manager](https://business.facebook.com/events_manager2/) or the Meta Business Suite.
- **Test event code** (optional): a code from the **Test events** tab in Events Manager, used to validate your setup. Events sent with it appear only in **Test events**, not in your live data. Leave it blank in production.

## Getting started

### Configure the destination

To create the connection and forwarder, follow the steps in [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md).

When configuring the connection, select **Meta Conversions API** for the connection type and enter your Pixel ID and access token. Add a test event code if you want to route events to **Test events** while you validate the setup.

### Validate the integration

You can confirm events are reaching Meta using Events Manager:

1. In Events Manager, open your dataset and select the **Test events** tab.
2. Send events with a test event code configured on the connection.
3. Confirm the events appear, and review the event details and match quality that Meta reports.

Once you've validated the setup, remove the test event code so events flow to your live data.

## User matching

Meta matches each event to a person using the identifiers in the `user_data` object. Every event must include at least one identifier, and Meta uses more identifiers to improve match quality. Personally identifiable fields such as email (`em`), phone (`ph`), and name (`fn`, `ln`) must be SHA256-hashed after normalization, so you supply the hash in your mapping expression. The `client_ip_address`, `client_user_agent`, `fbc`, and `fbp` fields must not be hashed.

The default mapping sets `external_id` to the Snowplow `user_id`. It derives the Meta click ID (`fbc`) and browser ID (`fbp`) from the `_fbc` and `_fbp` cookies. For these defaults to work, configure the [cookie extractor enrichment](/docs/pipeline/enrichments/available-enrichments/cookie-extractor-enrichment/index.md) to capture `_fbc` and `_fbp`, and the [campaign attribution enrichment](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md) to capture `fbclid` as a fallback source for `fbc`.

:::warning[IP anonymization breaks forwarding to Meta]
If the [IP anonymization enrichment](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md) is enabled, `client_ip_address` contains a truncated IP address. Meta treats a truncated IP as invalid and rejects the request, so the event is not forwarded. Do not enable IP anonymization on events you forward to Meta.
:::

## Event names

Meta expects a [standard event name](https://developers.facebook.com/docs/meta-pixel/reference) (such as `Purchase`, `AddToCart`, or `ViewContent`) or a custom event name in the `event_name` field. The default mapping maps a Snowplow ecommerce transaction to `Purchase` and `page_view` to `ViewContent`, and passes any other event name through unchanged. To map your own events to Meta standard events, edit the `toMetaEventName` function in the forwarder's custom functions.

## Sending custom properties

You can send business data beyond the standard fields defined in the schema reference below. Event value, currency, order details, and product information are nested under the `custom_data` object (e.g., `custom_data.value`, `custom_data.content_ids`). Never place raw personal data in `custom_data` — customer identifiers belong in the hashed `user_data` fields.

See Meta's [Conversions API parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters) for details on supported fields and hashing requirements. See [Creating forwarders](/docs/destinations/forwarding-events/creating-forwarders/index.md) for details on configuring field mappings.

## Limitations

**Event freshness:** Meta rejects the entire request if any event's `event_time` is more than seven days in the past. Avoid forwarding events from a source that can replay or delay events beyond this window.

**Batching:** Snowplow sends one event per request to the Conversions API, so the API rate limit also functions as the event rate limit.

## Schema reference

This section contains information on the fields you can send to Meta, including field names, data types, required fields, and default Snowplow mapping expressions.

<EventForwardingSchemaTable schema={metaConversionsSchema}/>
