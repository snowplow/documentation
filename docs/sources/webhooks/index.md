---
title: "Collect data from third parties with webhooks"
date: "2020-02-15"
sidebar_position: 1000
sidebar_label: "Webhooks"
---

Snowplow enables you to collect events via the webhooks of supported third-party software.

Webhooks allow the third-party software to send their own internal event streams to your Snowplow Collector for further processing. Webhooks are sometimes referred to as "streaming APIs" or "HTTP response APIs".

| Webhook                                                  | Track                                                                        |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Adjust](/docs/sources/webhooks/adjust-webhook/index.md) | Which marketing channels are driving mobile app installations                |
| [Iglu](/docs/sources/webhooks/iglu-webhook/index.md)     | Any [Iglu](/docs/api-reference/iglu/index.md)-compatible GET or POST request |
| [Iterable](/docs/sources/webhooks/iterable/index.md)     | Events provided by Iterable                                                  |
| [MailGun](/docs/sources/webhooks/mailgun/index.md)       | Email activity logged by MailGun                                             |
| [Mandrill](/docs/sources/webhooks/mandrill/index.md)     | Email activity logged by Mandrill                                            |
| [SendGrid](/docs/sources/webhooks/sendgrid/index.md)     | Email activity logged by SendGrid                                            |
| [Zendesk](/docs/sources/webhooks/zendesk/index.md)       | Events logged by Zendesk                                                     |
