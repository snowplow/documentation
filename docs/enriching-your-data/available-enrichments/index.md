---
title: "Available enrichments"
sidebar_position: 20
---

Snowplow offers a large number of enrichments that can be used to enhance your event data. An enrichment either updates or populates fields of the [atomic](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0) event or adds a [self-describing](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/) context to [derived_contexts](https://github.com/snowplow/snowplow-scala-analytics-sdk/blob/2.1.0/src/main/scala/com.snowplowanalytics.snowplow.analytics.scalasdk/Event.scala#L165).

The order of enrichments is hard-coded and cannot be changed, below table lists available enrichments in order they are executed.

:::note

Currently, it’s not possible to configure more than one instance of the same enrichment. This is particularly relevant for the JavaScript, SQL Query and API Request enrichments — you can only configure one of each.

:::


| Enrichment                                                                                                         | Description                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [IAB](/docs/enriching-your-data/available-enrichments/iab-enrichment/index.md)                                     | Use the IAB/ABC International Spiders and Bots List to determine whether an event was produced by a user or a robot/spider based on its' IP address and user agent.                                                            |
| User Agent utils                                                                                                   | Deprecated — please consider switching to the [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) enrichment below.                                                                             |
| [UA Parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)                         | Parse the useragent and attach detailed useragent information to each event.                                                                                                                                                   |
| [Currency Conversion](/docs/enriching-your-data/available-enrichments/currency-conversion-enrichment/index.md)     | Convert the values of all transactions to a specified base currency using Open Exchange Rates API. *(Please note the [limitations](/docs/enriching-your-data/available-enrichments/currency-conversion-enrichment/index.md).)* |
| [Referer Parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)              | Extracts attribution data from referer URLs.                                                                                                                                                                                   |
| [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)   | Choose which querystring parameters will be used to generate the marketing campaign fields. *If you do not enable the campaign_attribution enrichment, those fields will not be populated.*                                    |
| [Event Fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md)         | Generate a fingerprint for the event using a hash of client-set fields. Helpful for deduplicating events.                                                                                                                      |
| [Cookie Extractor](/docs/enriching-your-data/available-enrichments/cookie-extractor-enrichment/index.md)           | Specify cookies that you want to extract if found.                                                                                                                                                                             |
| [HTTP Header Extractor](/docs/enriching-your-data/available-enrichments/http-header-extractor-enrichment/index.md) | Specify headers that you want to extract via a regex pattern, if found each extracted header will be attached to your event.                                                                                                   |
| [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)                                 | Parse and analyze the user agent string of an event and extract as many relevant attributes as possible using YAUAA API.                                                                                                       |
| [IP Lookup](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md)                         | Lookup useful data based on a user's IP address using the MaxMind database.                                                                                                                                                    |
| [JavaScript](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/index.md)                | Write a JavaScript function which is executed for each event.                                                                                                                                                                  |
| [SQL Query](/docs/enriching-your-data/available-enrichments/custom-sql-enrichment/index.md)                        | Perform dimension widening on a Snowplow event via your own internal relational database.                                                                                                                                      |
| [API Request](/docs/enriching-your-data/available-enrichments/custom-api-request-enrichment/index.md)              | Perform dimension widening on a Snowplow event via your own or third-party proprietary http(s) API.                                                                                                                            |
| [IP Anonymization](/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/index.md)           | Anonymize the IP addresses found in the `user_ipaddress` field by replacing a certain number of octets with `x`s.                                                                                                              |
| [PII Pseudonymization](/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/index.md)   | Better protect the privacy rights of data subjects by psuedoanonymizing collected data.                                                                                                                                        |



```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
