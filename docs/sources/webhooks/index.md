---
title: "Webhooks - collecting data from third parties"
description: "Webhook integrations for collecting behavioral events from third-party platforms and services."
schema: "TechArticle"
keywords: ["Webhook Sources", "Event Webhooks", "API Integration", "Third Party", "External Events", "Webhook Analytics"]
date: "2020-02-15"
sidebar_position: 10
sidebar_label: "Webhooks"
---

Snowplow enables you to collect events via the webhooks of supported third-party software.

Webhooks allow the third-party software to send their own internal event streams to your Snowplow collector for further processing. Webhooks are sometimes referred to as "streaming APIs" or "HTTP response APIs".

View our [set of trackers for tracking events from your own applications](/docs/sources/trackers/index.md).

| Webhook                                                  | Track                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Adjust](/docs/sources/webhooks/adjust-webhook/index.md) | Which marketing channels are driving mobile app installations                |
| [Iglu](/docs/sources/webhooks/iglu-webhook/index.md)     | Any [Iglu](/docs/api-reference/iglu/index.md)-compatible GET or POST request |
| [Iterable](/docs/sources/webhooks/iterable/index.md)     | Events provided by Iterable                                                  |
| [MailGun](/docs/sources/webhooks/mailgun/index.md)       | Email activity logged by MailGun                                             |
| [Mandrill](/docs/sources/webhooks/mandrill/index.md)     | Email activity logged by Mandrill                                            |
| [SendGrid](/docs/sources/webhooks/sendgrid/index.md)     | Email activity logged by SendGrid                                            |
| [Zendesk](/docs/sources/webhooks/zendesk/index.md)       | Events logged by Zendesk                                                     |
