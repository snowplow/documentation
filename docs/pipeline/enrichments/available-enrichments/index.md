---
title: "Available enrichments"
sidebar_position: 20
sidebar_label: "Available enrichments"
description: "Browse the complete catalog of Snowplow enrichments that add entities and enhance event data during processing."
keywords: ["enrichments catalog", "enrichment list", "enrichment order"]
---


Snowplow offers a large number of enrichments that can be used to enhance your event data. Most enrichments attach data to the event as [entities](/docs/fundamentals/entities/index.md), although some enrichments fill or modify event fields directly.

The order of enrichments is hard-coded and cannot be changed, the below table lists available enrichments in order they are executed.

:::note

It’s not possible to configure more than one instance of the same enrichment except JavaScript enrichment starting with Enrich 4.1.0. It is possible to have multiple JavaScript enrichments starting with Enrich 4.1.0. For all other enrichments, you can still only configure one of each including SQL Query and API Request enrichments.

:::


| Enrichment                                                                                                           | Description                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [IAB](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md)                                      | Detect robots/spiders via the IAB/ABC International Spiders and Bots List.                                                             |
| User Agent utils                                                                                                     | This enrichment is deprecated. Please consider switching to [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md).                                                                             |
| [UA Parser](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md)                          | Parse the user agent string and attach an entity with detailed user agent information. _(YAUAA enrichment is preferred.)_                                                                                                                                                    |
| [Currency Conversion](/docs/pipeline/enrichments/available-enrichments/currency-conversion-enrichment/index.md)      | Convert the values of all transactions to a specified base currency using Open Exchange Rates API. *(Please note the [limitations](/docs/pipeline/enrichments/available-enrichments/currency-conversion-enrichment/index.md).)* |
| [Referrer Parser](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md)               | Extract attribution data from referrer URLs.                                                                                                                                                                                    |
| [Campaign Attribution](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md)    | Choose how query string parameters map to marketing campaign fields, e.g. `mkt_medium`. *If you do not enable the campaign attribution enrichment, those fields will not be populated.*                                     |
| [Cross Navigation Enrichment](/docs/pipeline/enrichments/available-enrichments/cross-navigation-enrichment/index.md) | Parse the extended cross navigation format in `_sp` query string parameter and attach the cross_navigation context to an event. _(Available since Enrich version 4.1.0.)_                                                                                  |
| [Event Fingerprint](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md)          | Generate a fingerprint for the event by hashing a set of fields. Helpful for deduplicating events.                                                                                                                       |
| [Cookie Extractor](/docs/pipeline/enrichments/available-enrichments/cookie-extractor-enrichment/index.md)            | Extract values of specific cookies into extra entities.                                                                                                                                                                              |
| [HTTP Header Extractor](/docs/pipeline/enrichments/available-enrichments/http-header-extractor-enrichment/index.md)  | Extract values of specific HTTP headers into extra entities.                                                                                                    |
| [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md)                                  | Parse the user agent string and attach an entity with detailed user agent information.                                                                                                        |
| [IP Lookup](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md)                          | Look up useful data on the IP address in the MaxMind database.                                                                                                                                                     |
| [JavaScript](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md)                 | Write a JavaScript function which is executed for each event.                                                                                                                                                                   |
| [SQL Query](/docs/pipeline/enrichments/available-enrichments/custom-sql-enrichment/index.md)                         | Query an external relational database and attach the response as an extra entity.                                                                                                                                       |
| [API Request](/docs/pipeline/enrichments/available-enrichments/custom-api-request-enrichment/index.md)               | Query an external HTTP(s) API and attach the response as an extra entity.                                                                                                                             |
| [IP Anonymization](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md)            | Anonymize the IP addresses found in the `user_ipaddress` field by replacing some octets with `x`.                                                                                                               |
| [PII Pseudonymization](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md)    | Pseudoanonymize specific fields to comply with data privacy regulation.                                                                                                                                         |
