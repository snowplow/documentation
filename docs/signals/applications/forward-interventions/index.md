---
title: "Forward interventions to a webhook or stream"
sidebar_position: 35
sidebar_label: "Forward interventions"
description: "Send triggered interventions to your own webhook, Kafka topic, Amazon Kinesis stream, or Google Cloud Pub/Sub topic, so back-end systems can react without keeping a subscription open."
keywords: ["intervention forwarding", "signals webhook", "forward interventions", "kafka", "kinesis", "pub/sub"]
date: "2026-11-23"
content_type: how-to
---

Intervention forwarding sends every triggered intervention to a destination you own, as soon as Signals triggers it. Use it when the system that reacts to an intervention is a back-end service, such as a CRM, a messaging platform, or your own profile service, rather than a page or app that can [subscribe](/docs/signals/applications/subscribe/index.md) to interventions.

Forwarding doesn't replace subscriptions. Both receive the same triggered interventions, and you can use them together. Forwarding isn't configured in Console: Snowplow sets it up for you after you [request it](#request-intervention-forwarding).

## Choose a destination

Forwarding can deliver interventions to these destinations:

| Destination | What Signals sends |
| --- | --- |
| Webhook | One HTTPS `POST` request per intervention to an endpoint you host |
| Kafka | One message per intervention to a Kafka topic |
| Amazon Kinesis | One record per intervention to a Kinesis stream |
| Google Cloud Pub/Sub | One message per intervention to a Pub/Sub topic |

Forwarding sends the full intervention payload to the destination. You can't filter interventions or transform the payload on the way. If you only need some interventions, filter them in the system that receives them, for example by the intervention `name`.

Forwarding follows the same rules as other intervention delivery. An intervention is sent once, the first time its criteria are met, as described in the [subscription delivery example](/docs/signals/applications/subscribe/index.md#delivery-example).

## Understand the forwarded payload

Each forwarded intervention is a JSON object. It contains the same information as the [payload that subscriptions receive](/docs/signals/applications/subscribe/index.md#payload), but in a different shape: the target is in `attributeKey`, and `attributes` is a list.

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

Here's an example payload for an intervention that sends two attributes:

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

Parse each `value` as JSON to get the typed value: `"250"` is the number `250`, and the list example is an array of strings. The order of the `attributes` list isn't fixed, so look attributes up by their `attribute` name. If an intervention doesn't send any attribute groups, the payload has no `attributes` field.

## Configure a webhook endpoint

For a webhook, Snowplow needs the host name of your HTTPS endpoint and, optionally, a path. For example, the host `profiles.example.com` with the path `interventions/forward` sends requests to `https://profiles.example.com/interventions/forward`. Requests always use HTTPS.

Signals authenticates each request with a bearer token that you choose and share with Snowplow. Each request has these headers, and the [forwarded payload](#understand-the-forwarded-payload) as its body:

```text
POST /interventions/forward HTTP/1.1
Host: profiles.example.com
Authorization: Bearer <your token>
Content-Type: application/json
```

Your endpoint should check the token and return a `2xx` status code once it has accepted the intervention. Other status codes are handled as follows:

| Response | How Snowplow handles it |
| --- | --- |
| `400`, `413`, or `422` | The intervention is treated as invalid. It's saved as a [failed event](/docs/fundamentals/failed-events/index.md) and not retried. |
| `401`, `403`, `404`, `405`, `410`, or `415` | The request is treated as a setup error, such as a wrong token or path. Delivery stops until the problem is fixed, with occasional retries to check. |
| `429` | The request is throttled and retried later. |
| `5xx`, timeouts, or connection errors | The request is retried with exponential backoff. If it still fails, the intervention is saved as a failed event. |

These categories work the same way as for [event forwarders](/docs/destinations/forwarding-events/event-forwarding-monitoring-and-troubleshooting/index.md#failure-types-and-handling).

If your endpoint only accepts traffic from known IP addresses, ask Snowplow for the IP addresses that the requests come from, and add them to your allowlist before forwarding starts.

## Request intervention forwarding

To set up forwarding, fill in the [Signals destination setup form](https://docs.google.com/forms/d/e/1FAIpQLSfbTBYWWI6_COxLH0jgQsUP10hjw4GfNIj7CMhOmOJ8fPgWGA/viewform). It asks for your organization, the destination you want, and what you plan to use it for. Someone from Snowplow will follow up to collect the details for your destination.

For a webhook, Snowplow needs the endpoint host and path, and the bearer token. Share the token through the secure channel Snowplow gives you, not in the form. For Kafka, Amazon Kinesis, or Google Cloud Pub/Sub, Snowplow needs the topic or stream to write to and how to authenticate to it.

Interventions start arriving at your destination once forwarding is deployed and you've [published interventions](/docs/signals/interventions/index.md#publish-and-manage-the-intervention) that target attribute keys in your events.
