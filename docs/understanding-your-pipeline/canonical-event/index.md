---
title: "Understanding the structure of Snowplow data"
description: A summary of the Snowplow events table and its fields, including custom events and entities
sidebar_label: "What the data looks like"
sidebar_position: 5
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

```

## Overview

In order to analyze Snowplow data, it is important to understand how it is structured. We have tried to make the structure of Snowplow data as simple, logical, and easy-to-query as possible.

### Each line represents one event

Each line in the Snowplow events table represents a single _event_, be that a _page view_, _add to basket_, _play video_, _like_ etc.

### Structured data

Snowplow data is structured: individual fields are stored in their own columns, making writing sophisticated queries on the data easy, and making it straightforward for analysts to plugin any kind of analysis tool into their Snowplow data to compose and execute queries.

### Extensible schema

Snowplow started life as a web analytics data warehousing platform, and has a basic schema suitable for performing web analytics, with a wide range of web-specific dimensions (related to page URLs, browsers, operating systems, devices, IP addresses, cookie IDs) and web-specific events (page views, page pings, transactions). All of these fields can be found in the `atomic.events` table, which is a "fat" (many columns) table.

As Snowplow has evolved into a general purpose event analytics platform, we've enabled Snowplow users to define additional event types (we call these [_self describing events_](/docs/understanding-your-pipeline/events/index.md#self-describing-events)) and define their own entities (we call these [_custom entities_](/docs/understanding-your-pipeline/entities/index.md#custom-entities)) so that they can extend the schema to suit their own businesses.

For Snowplow users running Amazon Redshift, each type of self-describing event and each type of entity will be stored in their own dedicated tables. These additional tables can be joined back to the core `atomic.events` table, by joining on the `root_id` field in the self-describing event / entity table with the `event_id` in the `atomic.events` table, and the `root_tstamp` and `collector_tstamp` field in the respective tables. For users on other warehouses these will be additional columns in the `atomic.events` table.

### Single table

All the events are effectively stored in a single table, making running queries across the data very easy. Even if you're running Snowplow with Redshift and have extended the schema as described above, you can still query the data as if it were in a single fat table. This is because:
- The joins from the additional tables to the core `atomic.events` table are one-to-one.
- The field joined on is the distribution key for both tables, so queries are as fast as if the data were in a single table.

### Immutable log

The Snowplow data table is designed to be immutable: the data in each line should not change over time. Data points that we would expect to change over time (e.g. what cohort a particular user belongs to, how we classify a particular visitor) can be derived from Snowplow data. However, our recommendation is that these derived fields should be defined and calculated at analysis time, stored in a separate table and joined to the _Snowplow events table_ when performing any analysis.

## Canonical event model

The sections below go over the standard fields found in all Snowplow events. We provide a `Source` for each field, however sometimes a field may have multiple sources e.g. a value originally set by a tracker but is overwritten by a later enrichment; in this case we have tended to classify this as the earliest source.

### Common fields (platform and event independent)

#### Application fields

| Field      | Type | Description                                                                                                                                      | Reqd? | Example       | Source   |
| ---------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------- | -------- |
| `app_id`   | text | Application ID                                                                                                                                   | Yes   | 'angry-birds' | Tracking |
| `platform` | text | Platform, limited to [specific values](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/#application-parameters) | Yes   | 'web'         | Tracking |

The application ID is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. `production` versus `dev`.

The platform ID is used to distinguish the same app running on different platforms, e.g. `iOS` vs `web`.

#### Date / time fields

| Field                                        | Type      | Description                                                                                                                                                                    | Reqd? | Example                   | Source                                                                                                                                                                    |
| -------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collector_tstamp`                           | timestamp | Timestamp for the event recorded by the collector                                                                                                                              | Yes   | '2013-11-26 00:02:05'     | Pipeline                                                                                                                                                                  |
| `dvce_created_tstamp`                        | timestamp | Timestamp for the event recorded on the client device                                                                                                                          | No    | '2013-11-26 00:03:57.885' | Tracking                                                                                                                                                                  |
| `dvce_sent_tstamp`                           | timestamp | When the event was actually sent by the client device                                                                                                                          | No    | '2013-11-26 00:03:58.032' | Tracking                                                                                                                                                                  |
| `etl_tstamp`                                 | timestamp | Timestamp for when the event was validated and enriched. Note: the name is historical and _does not mean_ that the event is loaded at this point (this is further downstream). | No    | '2017-01-26 00:01:25.292' | Pipeline                                                                                                                                                                  |
| `os_timezone` _(not available in BDP Cloud)_ | text      | Client operating system timezone                                                                                                                                               | No    | 'Europe/London'           | Tracking [Timezone Plugin](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/timezone/index.md) |
| `derived_tstamp`                             | timestamp | Timestamp making allowance for inaccurate device clock                                                                                                                         | No    | '2013-11-26 00:02:04'     | Default Enrichment                                                                                                                                                        |
| `true_tstamp`                                | timestamp | User-set "true timestamp" for the event                                                                                                                                        | No    | '2013-11-26 00:02:04'     | Tracking                                                                                                                                                                  |
| `load_tstamp`                                | timestamp | Timestamp for when the data was loaded into the warehouse, best choice for incremental processing                                                                              | No    | '2013-11-26 00:02:04'     | Pipeline                                                                                                                                                                  |

#### Event / transaction fields

| Field               | Type | Description                                             | Reqd? | Example                                | Source                                                                                                                |
| ------------------- | ---- | ------------------------------------------------------- | ----- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `event`             | text | The type of event recorded                              | Yes   | 'page_view'                            | Tracking                                                                                                              |
| `event_id`          | text | A UUID for each event                                   | Yes   | 'c6ef3124-b53a-4b13-a233-0088f79dcbcb' | Tracking (or enrichment if empty)                                                                                     |
| `txn_id`            | int  | Transaction ID set client-side, used to de-dupe records | No    | 421828                                 | Tracking (Deprecated)                                                                                                 |
| `event_fingerprint` | text | Hash client-set event fields, used to de-dupe records                            | No    | AADCE520E20C2899F4CED228A79A3083       | [Event Fingerprint Enrichment](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) |

A complete list of event types is given [here](#event-specific-fields).

#### Snowplow version fields

| Field                                     | Type | Description                   | Reqd? | Example                             | Source             |
| ----------------------------------------- | ---- | ----------------------------- | ----- | ----------------------------------- | ------------------ |
| `v_tracker`                               | text | Tracker version               | Yes   | 'js-3.0.0'                          | Tracking           |
| `v_collector`                             | text | Collector version             | Yes   | 'ssc-2.1.0-kinesis'                 | Pipeline           |
| `v_etl`                                   | text | ETL version                   | Yes   | 'snowplow-micro-1.1.0-common-1.4.2' | Default Enrichment |
| `name_tracker`                            | text | Tracker namespace             | No    | 'sp1'                               | Tracking           |
| `etl_tags` _(not available in BDP Cloud)_ | text | JSON of tags for this ETL run | No    | "['prod']"                          | Deprecated         |

Some Snowplow Trackers allow the user to name each specific Tracker instance. `name_tracker` corresponds to this name, and can be used to distinguish which tracker generated which events.

#### User-related fields

| Field               | Type | Description                                                                                                                                                      | Reqd? | Example                                | Source               |
| ------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------- | -------------------- |
| `user_id`           | text | Unique ID set by business                                                                                                                                        | No    | 'c94f860b-1266-4dad-ae57-3a36a414a521' | Tracking             |
| `domain_userid`     | text | User ID set by Snowplow using 1st party client-set cookie                                                                                                                   | No    | '4b0dfa75-9a8c-46a1-9691-01add9db4200' | Tracking             |
| `network_userid`    | text | User ID set by Snowplow using server-set cookie, which may be 1st or 3rd party, depending on collector configuration.                                                                                                          | No    | 'ecdff4d0-9175-40ac-a8bb-325c49733607' | Tracking or Pipeline |
| `user_ipaddress`    | text | User IP address, can be overwritten with the [IP Anonymization Enrichment](/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/index.md) | No    | '92.231.54.234'                        | Tracking or Pipeline |
| `domain_sessionidx` | int  | A visit / session index                                                                                                                                          | No    | 3                                      | Tracking             |
| `domain_sessionid`  | text | A visit / session identifier                                                                                                                                     | No    | 'c6ef3124-b53a-4b13-a233-0088f79dcbcb' | Tracking             |

`domain_sessionidx` is the number of the current user session. For example, an event occurring during a user's first session would have `domain_sessionidx` set to 1. The JavaScript Tracker calculates this field by storing a visit count in a first-party cookie. Whenever the Tracker fires an event, if more than 30 minutes have elapsed since the last event, the visitor count is increased by 1. (Whenever an event is fired, a "session cookie" is created and set to expire in 30 minutes. This is how the Tracker can tell whether the visit count should be incremented.) Thirty minutes is the default value and can be changed using the `sessionCookieTimeout` configuration option in the tracker.

#### Device and operating system fields

| Field                                            | Type    | Description                | Reqd? | Example    | Source               |
| ------------------------------------------------ | ------- | -------------------------- | ----- | ---------- | -------------------- |
| `useragent`                                      | text    | Raw useragent              | No    |            | Tracking or Pipeline |
| `dvce_type` _(not available in BDP Cloud)_       | text    | Type of device             | No    | 'Computer' | Deprecated           |
| `dvce_ismobile` _(not available in BDP Cloud)_   | boolean | Is the device mobile?      | No    | 1          | Deprecated           |
| `dvce_screenheight`                              | int     | Screen height in pixels    | No    | 1024       | Tracking             |
| `dvce_screenwidth`                               | int     | Screen width in pixels     | No    | 1900       | Tracking             |
| `os_name` _(not available in BDP Cloud)_         | text    | Name of operating system   | No    | 'Android'  | Deprecated           |
| `os_family` _(not available in BDP Cloud)_       | text    | Operating system family    | No    | 'Linux'    | Deprecated           |
| `os_manufacturer` _(not available in BDP Cloud)_ | text    | Company responsible for OS | No    | 'Apple'    | Deprecated           |

#### Location fields

| Field             | Type | Description                                               | Reqd? | Example              | Source                                                                                         |
| ----------------- | ---- | --------------------------------------------------------- | ----- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `geo_country`     | text | ISO 3166-1 code for the country the visitor is located in | No    | 'GB', 'US'           | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_region`      | text | ISO-3166-2 code for country region the visitor is in      | No    | 'I9', 'TX'           | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_city`        | text | City the visitor is in                                    | No    | 'New York', 'London' | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_zipcode`     | text | Postcode the visitor is in                                | No    | '94109'              | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_latitude`    | text | Visitor location latitude                                 | No    | 37.443604            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_longitude`   | text | Visitor location longitude                                | No    | -122.4124            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_region_name` | text | Visitor region name                                       | No    | 'Florida'            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_timezone`    | text | Visitor timezone name                                     | No    | 'Europe/London'      | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |

#### IP address-based fields

| Field             | Type | Description                                                                                   | Reqd? | Example              | Source                                                                                         |
| ----------------- | ---- | --------------------------------------------------------------------------------------------- | ----- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `ip_isp`          | text | Visitor's ISP                                                                                 | No    | 'FDN Communications' | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_organization` | text | Organization associated with the visitor's IP address - defaults to ISP name if none is found | No    | 'Bouygues Telecom'   | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_domain`       | text | Second level domain name associated with the visitor's IP address                             | No    | 'nuvox.net'          | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_netspeed`     | text | Visitor's connection type                                                                     | No    | 'Cable/DSL'          | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |

#### Metadata fields

Fields containing information about the event type.

| Field           | Type | Description             | Reqd? | Example      | Source                          |
| --------------- | ---- | ----------------------- | ----- | ------------ | ------------------------------- |
| `event_vendor`  | text | Who defined the event   | Yes   | 'com.acme'   | Default Enrich (`event schema`) |
| `event_name`    | text | Event name              | Yes   | 'link_click' | Default Enrich (`event schema`) |
| `event_format`  | text | Format for event        | Yes   | 'jsonschema' | Default Enrich (`event schema`) |
| `event_version` | text | Version of event schema | Yes   | '1-0-2'      | Default Enrich (`event schema`) |

### Platform-specific fields

#### Web-specific fields

| Field                                                     | Type      | Description                                                                | Reqd? | Example                                                        | Source                                                                                                                                                                                            |
| --------------------------------------------------------- | --------- | -------------------------------------------------------------------------- | ----- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page fields**                                           |           |                                                                            |       |                                                                |                                                                                                                                                                                                   |
| `page_url`                                                | text      | The page URL                                                               | No   | 'http://www.example.com'                                       | Tracking                                                                                                                                                                                          |
| `page_urlscheme`                                          | text      | Scheme aka protocol                                                        | No   | 'https'                                                        | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_urlhost`                                            | text      | Host aka domain                                                            | No   | '“www.snowplowanalytics.com'                                   | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_urlport`                                            | int       | Port if specified, scheme dependent if not (443 for https, 80 for http)    | No   | 80                                                             | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_urlpath`                                            | text      | Path to page                                                               | No    | '/product/index.html'                                          | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_urlquery`                                           | text      | Querystring                                                                | No    | 'id=GTM-DLRG'                                                  | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_urlfragment`                                        | text      | Fragment aka anchor                                                        | No    | '4-conclusion'                                                 | Default Enrichment (`url`)                                                                                                                                                                        |
| `page_referrer`                                           | text      | URL of the referrer                                                        | No    | 'http://www.referrer.com'                                      | Tracking                                                                                                                                                                                          |
| `page_title`                                              | text      | Web page title                                                             | No    | 'Snowplow Docs - Understanding the structure of Snowplow data' | Tracking                                                                                                                                                                                          |
| `refr_urlscheme`                                          | text      | Referrer scheme                                                            | No    | 'http'                                                         | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_urlhost`                                            | text      | Referrer host                                                              | No    | 'www.bing.com'                                                 | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_urlport`                                            | int       | Referrer port                                                              | No    | 80                                                             | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_urlpath`                                            | text      | Referrer page path                                                         | No    | '/images/search'                                               | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_urlquery`                                           | text      | Referrer URL querystring                                                   | No    | 'q=psychic+oracle+cards'                                       | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_urlfragment`                                        | text      | Referrer URL fragment                                                      | No    |                                                                | Default Enrichment (`referer`)                                                                                                                                                                    |
| `refr_medium`                                             | text      | Type of referrer                                                           | No    | 'search', 'internal'                                           | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)                                                                                 |
| `refr_source`                                             | text      | Name of referrer if recognized                                             | No    | 'Bing images'                                                  | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)                                                                                 |
| `refr_term`                                               | text      | Keywords if source is a search engine                                      | No    | 'psychic oracle cards'                                         | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)                                                                                 |
| `refr_domain_userid`                                      | text      | The Snowplow domain_userid of the referring website                        | No    | 'bc2e92ec6c204a14'                                             | Default Enrichment (`cross_domain`)                                                                                                                                                               |
| `refr_dvce_tstamp`                                        | timestamp | The time of attaching the domain_userid to the inbound link                | No    | '2013-11-26 00:02:05'                                          | Default Enrichment (`cross_domain`)                                                                                                                                                               |
| **Document fields**                                       |           |                                                                            |       |                                                                |                                                                                                                                                                                                   |
| `doc_charset`                                             | text      | The page’s character encoding                                              | No    | , 'UTF-8'                                                      | Tracking                                                                                                                                                                                          |
| `doc_width`                                               | int       | The page's width in pixels                                                 | No    | 1024                                                           | Tracking                                                                                                                                                                                          |
| `doc_height`                                              | int       | The page's height in pixels                                                | No    | 3000                                                           | Tracking                                                                                                                                                                                          |
| **Marketing / traffic source fields**                     |           |                                                                            |       |                                                                |                                                                                                                                                                                                   |
| `mkt_medium`                                              | text      | Type of traffic source                                                     | No    | 'cpc', 'affiliate', 'organic', 'social'                        | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_source`                                              | text      | The company / website where the traffic came from                          | No    | 'Google', 'Facebook'                                           | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_term`                                                | text      | Any keywords associated with the referrer                                  | No    | 'new age tarot decks'                                          | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_content`                                             | text      | The content of the ad. (Or an ID so that it can be looked up.)             | No    | 13894723                                                       | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_campaign`                                            | text      | The campaign ID                                                            | No    | 'diageo-123'                                                   | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_clickid`                                             | text      | The click ID                                                               | No    | 'ac3d8e459'                                                    | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| `mkt_network`                                             | text      | The ad network to which the click ID belongs                               | No    | 'DoubleClick'                                                  | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)                                                                       |
| **Browser fields**                                        |           |                                                                            |       |                                                                |                                                                                                                                                                                                   |
| `user_fingerprint` _(not available in BDP Cloud)_         | int       | A user fingerprint generated by looking at the individual browser features | No    | 2161814971                                                     | Tracking (Deprecated)                                                                                                                                                                             |
| `br_name` _(not available in BDP Cloud)_                  | text      | Browser name                                                               | No    | 'Firefox 12'                                                   | Deprecated                                                                                                                                                                                        |
| `br_version` _(not available in BDP Cloud)_               | text      | Browser version                                                            | No    | '12.0'                                                         | Deprecated                                                                                                                                                                                        |
| `br_family` _(not available in BDP Cloud)_                | text      | Browser family                                                             | No    | 'Firefox'                                                      | Deprecated                                                                                                                                                                                        |
| `br_type` _(not available in BDP Cloud)_                  | text      | Browser type                                                               | No    | 'Browser'                                                      | Deprecated                                                                                                                                                                                        |
| `br_renderengine` _(not available in BDP Cloud)_          | text      | Browser rendering engine                                                   | No    | 'GECKO'                                                        | Deprecated                                                                                                                                                                                        |
| `br_lang`                                                 | text      | Language the browser is set to                                             | No    | 'en-GB'                                                        | Tracking                                                                                                                                                                                          |
| `br_features_pdf` _(not available in BDP Cloud)_          | boolean   | Whether the browser recognizes PDFs                                        | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_flash` _(not available in BDP Cloud)_        | boolean   | Whether Flash is installed                                                 | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_java` _(not available in BDP Cloud)_         | boolean   | Whether Java is installed                                                  | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_director` _(not available in BDP Cloud)_     | boolean   | Whether Adobe Shockwave is installed                                       | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_quicktime` _(not available in BDP Cloud)_    | boolean   | Whether QuickTime is installed                                             | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_realplayer` _(not available in BDP Cloud)_   | boolean   | Whether RealPlayer is installed                                            | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_windowsmedia` _(not available in BDP Cloud)_ | boolean   | Whether mplayer2 is installed                                              | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_gears` _(not available in BDP Cloud)_        | boolean   | Whether Google Gears is installed                                          | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_features_silverlight` _(not available in BDP Cloud)_  | boolean   | Whether Microsoft Silverlight is installed                                 | No    | 1                                                              | Tracking ([`browser_features`](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/browser-features/index.md) plugin) |
| `br_cookies`                                              | boolean   | Whether cookies are enabled                                                | No    | 1                                                              | Tracking                                                                                                                                                                                          |
| `br_colordepth`                                           | int       | Bit depth of the browser color palette                                     | No    | 24                                                             | Tracking                                                                                                                                                                                          |
| `br_viewheight`                                           | int       | Viewport height                                                            | No    | 1000                                                           | Tracking                                                                                                                                                                                          |
| `br_viewwidth`                                            | int       | Viewport width                                                             | No    | 1000                                                           | Tracking                                                                                                                                                                                          |

### Event-specific fields

Snowplow includes specific fields to capture data associated with specific events.

Note that to date, all event types have been defined by Snowplow. Also note that `event_vendor` values follow the [Java package naming convention](http://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html).

Snowplow currently supports the following event types:

| Event type                                                | Value of `event` field in model      |
| --------------------------------------------------------- | ------------------------------------ |
| [Page views](#page-views)                                 | 'page_view'                          |
| [Page pings](#page-pings)                                 | 'page_ping'                          |
| [E-commerce transactions](#e-commerce-transactions)       | 'transaction' and 'transaction_item' |
| [Structured events](#structured-events)     | 'struct'                             |
| [Self-describing events](#self-describing-events) | 'unstruct' (for legacy reasons)                           |

Details of which fields are available for which events are given below. In some cases these events will store values in the `atomic.events` columns, which are listed below.

#### Page views

There are currently no fields that are specific to `page_view` events: all the fields that are required are part of the standard fields available for any [web-based event](#web-specific-fields) e.g. `page_urlscheme`, `page_title`.

#### Page pings

There are four additional fields included with page pings that indicate how a user has scrolled over a web page since the last page ping:

| Field            | Type    | Description                                        | Reqd? | Example |
| ---------------- | ------- | -------------------------------------------------- | ----- | ------- |
| `pp_xoffset_min` | integer | Minimum page x offset seen in the last ping period | No    | 10       |
| `pp_xoffset_max` | integer | Maximum page x offset seen in the last ping period | No    | 100     |
| `pp_yoffset_min` | integer | Minimum page y offset seen in the last ping period | No    | 5       |
| `pp_yoffset_max` | integer | Maximum page y offset seen in the last ping period | No    | 200     |

#### E-commerce transactions

There are a large number of fields specifically for transaction events.

Fields that start `tr_` relate to the transaction as a whole. Fields that start `ti_` refer to the specific item included in the transaction. (E.g. a product in the basket.) Single transactions typically span multiple lines of data: there will be a single line where `event` = `transaction`, where the `tr_` fields are set, and multiple lines (one for each product included) where `event` = `transaction_item` and the `ti_` fields are set.

| Field               | Type    | Description                                                | Reqd? | Example         |
| ------------------- | ------- | ---------------------------------------------------------- | ----- | --------------- |
| `tr_orderid`        | text    | Order ID                                                   | Yes   | '#134'          |
| `tr_affiliation`    | text    | Transaction affiliation (e.g. store where sale took place) | No    | 'web'           |
| `tr_total`          | decimal | Total transaction value                                    | Yes   | 12.99           |
| `tr_tax`            | decimal | Total tax included in transaction value                    | No    | 3.00            |
| `tr_shipping`       | decimal | Delivery cost charged                                      | No    | 0.00            |
| `tr_total_base`*    | decimal | Total in base currency                                     | No    | 12.99           |
| `tr_tax_base`*      | decimal | Total tax in base currency                                 | No    | 3.00            |
| `tr_shipping_base`* | decimal | Delivery cost in base currency                             | No    | 0.00            |
| `tr_city`           | text    | Delivery address, city                                     | No    | 'London'        |
| `tr_state`          | text    | Delivery address, state                                    | No    | 'Washington'    |
| `tr_country`        | text    | Delivery address, country                                  | No    | 'France'        |
| `tr_currency`       | text    | Currency                                                   | No    | 'USD'           |
| `ti_orderid`        | text    | Order ID                                                   | Yes   | '#134'          |
| `ti_sku`            | text    | Product SKU                                                | Yes   | 'pbz00123'      |
| `ti_name`           | text    | Product name                                               | No    | 'Cone pendulum' |
| `ti_category`       | text    | Product category                                           | No    | 'New Age'       |
| `ti_price`          | decimal | Product unit price                                         | Yes   | 9.99            |
| `ti_price_base`*    | decimal | Price in base currency                                     | No    | 9.99            |
| `ti_quantity`       | integer | Number of product in transaction                           | Yes   | 2               |
| `ti_currency`       | text    | Currency                                                   | No    | 'EUR'           |
| `base_currency`*    | text    | Reporting currency                                         | No    | 'GBP'           |

\* Set exclusively by the [Currency conversion enrichment](/docs/enriching-your-data/available-enrichments/currency-conversion-enrichment/index.md).

#### Structured events

[Structured events](/docs/understanding-your-pipeline/events/index.md#structured-events) allow you to send your own custom data, as long as it fits in the following 5 fields:

| Field         | Type    | Description                                                                                    | Reqd? | Example                       |
| ------------- | ------- | ---------------------------------------------------------------------------------------------- | ----- | ----------------------------- |
| `se_category` | text    | Category of event                                                                              | Yes*  | 'ecomm', 'video'              |
| `se_action`   | text    | Action performed / event name                                                                  | Yes*  | 'add-to-basket', 'play-video' |
| `se_label`    | text    | The object of the action e.g. the ID of the video played or SKU of the product added-to-basket | No    | 'pbz00123'                    |
| `se_property` | text    | A property associated with the object of the action                                            | No    | 'HD', 'large'                 |
| `se_value`    | decimal | A value associated with the event / action e.g. the value of goods added-to-basket             | No    | 9.99                          |


\* These fields are only required for `struct` events.

#### Self-describing events

[Self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) can contain their own set of fields, defined by their [schema](/docs/understanding-your-pipeline/schemas/index.md).

For each type of self-describing event, there will be a dedicated column (or table, in case of Redshift and Postgres) that holds the event-specific fields.

See [querying data](/docs/storing-querying/querying-data/index.md#self-describing-events) for more details on the structure and how to query it in different warehouses. You might also want to check [how schema definitions translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md).

#### Entities

[Entities](/docs/understanding-your-pipeline/entities/index.md) (also known as contexts) provide extra information about the event, such as data describing a product or a user.

For each type of entity, there will be a dedicated column (or table, in case of Redshift and Postgres) that holds entity-specific fields. Note that an event can have any number of entities attached, including multiple entities of the same type. For this reason, the data inside the entity columns is an array.

See [querying data](/docs/storing-querying/querying-data/index.md#entities) for more details on the structure and how to query it in different warehouses. You might also want to check [how schema definitions translate to the warehouse](/docs/storing-querying/schemas-in-warehouse/index.md).

### Out-of-the-box self-describing events and entities

These are also a variety of self-describing events and entities defined by Snowplow. You can find their schemas [here](http://iglucentral.com/?q=com.snowplowanalytics).
