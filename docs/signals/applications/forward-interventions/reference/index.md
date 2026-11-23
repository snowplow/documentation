---
title: "Forwarded intervention reference"
sidebar_position: 10
sidebar_label: "Forwarded intervention reference"
description: "Fields of the intervention payload that Snowplow forwards to your webhook or stream, an example request, and how Snowplow handles webhook responses."
keywords: ["intervention forwarding", "intervention payload", "signals webhook", "webhook response codes"]
date: "2026-11-23"
content_type: reference
---

:::note[Public preview]
Intervention forwarding is in public preview. You can't configure it in Console: Snowplow deploys it for you after you request it. Its configuration and payload may change in ways that aren't backward compatible before it's generally available.
:::

This page describes what Snowplow sends when it [forwards interventions](/docs/signals/applications/forward-interventions/index.md) to your destination, and how it handles your webhook's responses.

Each forwarded intervention is a JSON object. It contains the same information as the [payload that subscriptions receive](/docs/signals/applications/subscribe/index.md#payload), but in a different shape: the target is in `attributeKey`, and `attributes` is a list.

The payload follows the [`iglu:com.snowplowanalytics.signals/intervention_instance/jsonschema/1-0-0`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.signals/intervention_instance/jsonschema/1-0-0) schema in Iglu Central. Use it to validate the payloads you receive, or to generate types for your code.

## Parameters

The forwarded payload has these fields:

| Field | Description | Type |
| --- | --- | --- |
| `intervention_id` | A unique identifier for this triggered intervention | `string` |
| `name` | The name of the intervention | `string` |
| `version` | The intervention version | `integer` |
| `attributeKey.name` | The name of the target attribute key | `string` |
| `attributeKey.id` | The value of the target attribute key | `string` |
| `attributes` | The attribute values you [selected to send](/docs/signals/interventions/index.md#target-and-payload) with the intervention | `array` |
| `attributes[].attribute` | The attribute, as `<attribute_group>_v<version>:<attribute_name>` | `string` |
| `attributes[].value` | The attribute value, encoded as a JSON string | `string` |

Parse each `value` as JSON to get the typed value. The order of the `attributes` list isn't fixed, so look attributes up by their `attribute` name. If an intervention doesn't send any attribute groups, the payload has no `attributes` field.

## Example

This example payload is for an intervention that sends two attributes:

```json
{
  "intervention_id": "2db4dc3a-fb77-44bf-9d27-0a92a6c1e879",
  "name": "high_value_cart_abandonment",
  "version": 2,
  "attributeKey": {
    "name": "domain_userid",
    "id": "218e8926-3858-431d-b2ed-66da03a1cbe5"
  },
  "attributes": [
    {
      "attribute": "cart_attributes_v1:cart_value",
      "value": "250"
    },
    {
      "attribute": "cart_attributes_v1:unique_products_viewed",
      "value": "[\"https://example.com/shoes\",\"https://example.com/socks\"]"
    }
  ]
}
```

Here, `"250"` parses to the number `250`, and the second value parses to an array of strings.

For a webhook, Snowplow sends the payload as the body of a request with these headers:

```text
POST /interventions/forward HTTP/1.1
Host: profiles.example.com
Authorization: Bearer <your token>
Content-Type: application/json
```

## Errors

Return a `2xx` status code from your webhook once it has accepted the intervention. Snowplow handles other responses as follows:

| Response | How Snowplow handles it |
| --- | --- |
| `400`, `413`, or `422` | Snowplow treats the intervention as invalid, saves it as a [failed event](/docs/fundamentals/failed-events/index.md), and doesn't retry it. |
| `401`, `403`, `404`, `405`, `410`, or `415` | Snowplow treats the request as a setup error, such as a wrong token or path. It stops delivering and retries occasionally until you fix the problem. |
| `429` | Snowplow treats the request as throttled and retries it later. |
| `5xx`, timeouts, or connection errors | Snowplow retries the request with exponential backoff. If it still fails, Snowplow saves the intervention as a failed event. |

These categories work the same way as for [event forwarders](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md#failure-types-and-handling).
