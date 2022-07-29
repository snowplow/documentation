---
title: "What is the enrichment process?"
date: "2020-02-15"
sidebar_position: 0
---

### Overview

During Enrichment your events have extra properties and values attached to them, also know as dimension widening.

Snowplow enrichments can be categorized into three brackets:

- Hardcoded enrichments loading `atomic.events` (legacy)
- Configurable enrichments loading `atomic.events` (legacy)
- Configurable enrichments adding new contexts to the `derived_contexts` JSON array

_Legacy enrichments_ are those which populate `atomic.events` table as opposed to dedicated enrichment tables. The hardcoded legacy enrichments normally take place as part of common enrichment process and they precede configurable enrichments. During the common enrichment process the data received from collector(s) is mapped according to our [Canonical Event Model](https://github.com/snowplow/snowplow/wiki/canonical-event-model).

_Configurable enrichments_ often depend on the data produced by the common enrichment process.

### [](https://github.com/snowplow/snowplow/wiki/The-enrichment-process#hardcoded-enrichment)Hardcoded enrichments

The following fields are populated depending on whether the tracker provided the corresponding value or not.

| Raw Parameter | Enriched Parameter | Purpose |
| --- | --- | --- |
| `eid` | `event_id` | The unique event identifier (UUID). Assigned during enrichment if not provided with `eid` |
| `cv` | `v_collector` | Collector type/version |
| `tnuid` | `network_userid` | User ID set by Snowplow using 3rd party cookie. Overwriten with tracker-set `tnuid`. |
| `ip` | `user_ipaddress` | Snowplow collectors log IP address as standard. However, you can override the value derived from the collector by populating this value in the tracker. |
| `ua` | `useragent` | Raw useragent (browser string). Could be overwritten with `ua`. |

The following fields are populated depending on the collector and ETL (Extract, Transform, Load) utilized in the pipeline.

| Added Parameter | Purpose |
| --- | --- |
| `v_etl` | Host ETL version |
| `etl_tstamp` | Timestamp event began ETL |
| `collector_tstamp` | Time stamp for the event recorded by the collector |

The raw parameter `res` (if present) representing the screen/monitor resolution and coming in as a combination of width and height (ex. `1280x1024`) is broken up into separate entities.

| Added Parameter | Purpose |
| --- | --- |
| `dvce_screenwidth` | Screen / monitor width |
| `dvce_screenheight` | Screen / monitor height |

The `url` parameter provides the value for `page_url` in `atomic.events`, which represents the current page's URL. The following parts are extracted and populate separate fields as outlined below.

| Added Parameter | Purpose |
| --- | --- |
| `page_urlscheme` | Scheme (protocol), ex. "http" |
| `page_urlhost` | Host (domain), ex. "www.snowplowanalytics.com" |
| `page_urlport` | Port if specified, 80 if not |
| `page_urlpath` | Path to page, ex. "/product/index.html" |
| `page_urlquery` | Querystring, ex. "id=GTM-DLRG" |
| `page_urlfragment` | Fragment (anchor), ex. "4-conclusion" |

Similarly, `page_referrer` gets the value from `refr`, which represents the referer’s URL, and the following parts are extracted and populate separate fields as shown below.

| Added Parameter | Purpose |
| --- | --- |
| `refr_urlscheme` | Scheme (protocol) |
| `refr_urlhost` | Host (domain) |
| `refr_urlport` | Port if specified, 80 if not |
| `refr_urlpath` | Path to page |
| `refr_urlquery` | Querystring |
| `refr_urlfragment` | Fragment (anchor) |

Additionally the derived timestamp is calculated, `derived_tstamp`. See [this blog post](https://snowplowanalytics.com/blog/2015/09/15/improving-snowplows-understanding-of-time/) for more details.

Finally, contexts, unstructured events and the relevant configurable enrichments (if enabled) are validated against their corresponding JSON schemas and the array of the derived contexts is assembled.

### [](https://github.com/snowplow/snowplow/wiki/The-enrichment-process#configurable-enrichment)Configurable enrichment

All configurable enrichments are listed on the [Available Enrichments](/docs/migrated/enriching-your-data/available-enrichments/) page.

The following configurable enrichments write data into `atomic.events` table (legacy enrichments):

- [IP anonymization enrichment](/docs/migrated/enriching-your-data/available-enrichments/ip-anonymization-enrichment/)
- [IP lookups enrichment](/docs/migrated/enriching-your-data/available-enrichments/ip-lookup-enrichment/)
- [Campaign attribution enrichment](/docs/migrated/enriching-your-data/available-enrichments/campaign-attribution-enrichment/)
- [Currency conversion enrichment](/docs/migrated/enriching-your-data/available-enrichments/currency-conversion-enrichment/)
- [referer-parser enrichment](/docs/migrated/enriching-your-data/available-enrichments/referrer-parser-enrichment/)
- [Event fingerprint enrichment](/docs/migrated/enriching-your-data/available-enrichments/event-fingerprint-enrichment/)

All other configurable enrichments create a separate context and thus are loaded into their own dedicated tables.

[](https://github.com/snowplow/snowplow/wiki/_Footer/_edit)
