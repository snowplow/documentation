---
title: "Understanding the structure of Snowplow data"
date: "2020-10-29"
sidebar_position: 10
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

As Snowplow has evolved into a general purpose event analytics platform, we've enabled Snowplow users to define additional event types (we call these[ _custom unstructured events_](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md#self-describing-events)) and define their own entities (we call these [_custom contexts_](/docs/understanding-tracking-design/predefined-vs-custom-entities/index.md#custom-contexts)) so that they can extend the schema to suit their own businesses.

For Snowplow users running Amazon Redshift, each custom unstructured event and custom context will be stored in its own dedicated table, again with one line per event. These additional tables can be joined back to the core `atomic.events` table, by joining on the `root_id` field in the custom unstructured event / custom context table with the `event_id` in the `atomic.events` table. For users on other warehouses these will be additional columns in the `atomic.events` table.

### Single table

All the events are effectively stored in a single table, making running queries across the data very easy. Even if you're running Snowplow with Redshift and have extended the schema as described above, you can still query the data as if it were in a single fat table. This is because:
- The joins from the additional tables to the core `atomic.events` table are one-to-one.
- The field joined on is the distribution key for both tables, so queries are as fast as if the data were in a single table.

### Immutable log

The Snowplow data table is designed to be immutable: the data in each line should not change over time. Data points that we would expect to change over time (e.g. what cohort a particular user belongs to, how we classify a particular visitor) can be derived from Snowplow data. However, our recommendation is that these derived fields should be defined and calculated at analysis time, stored in a separate table and joined to the _Snowplow events table_ when performing any analysis.

## Canonical event model

The sections below go over the standard fields found in all Snowplow events.

### Common fields (platform and event independent)

#### Application fields

| **Field**  | **Type** | **Description** | **Reqd?** | **Example**   | **Source** |
| ---------- | -------- | --------------- | --------- | ------------- | ---------- |
| `app_id`   | text     | Application ID  | Yes       | 'angry-birds' | Tracking   |
| `platform` | text     | Platform        | Yes       | 'web'         | Tracking   |

The application ID is used to distinguish different applications that are being tracked by the same Snowplow stack, e.g. `production` versus `dev`.

The platform ID is used to distinguish the same app running on different platforms, e.g. `iOS` vs `web`.

#### Date / time fields

| **Field**                                    | **Type**  | **Description**                                                                                                                                                                | **Reqd?** | **Example**               | **Source**                 |
| -------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------------------- | -------------------------- |
| `collector_tstamp`                           | timestamp | Timestamp for the event recorded by the collector                                                                                                                              | Yes       | '2013-11-26 00:02:05'     | Pipeline                   |
| `dvce_created_tstamp`                        | timestamp | Timestamp for the event recorded on the client device                                                                                                                          | No        | '2013-11-26 00:03:57.885' | Tracking                   |
| `dvce_sent_tstamp`                           | timestamp | When the event was actually sent by the client device                                                                                                                          | No        | '2013-11-26 00:03:58.032' | Tracking                   |
| `etl_tstamp`                                 | timestamp | Timestamp for when the event was validated and enriched. Note: the name is historical and _does not mean_ that the event is loaded at this point (this is further downstream). | No        | '2017-01-26 00:01:25.292' | Pipeline                   |
| `os_timezone` _(not available in BDP Cloud)_ | text      | Client operating system timezone                                                                                                                                               | No        | 'Europe/London'           | Tracking (`browser_features` context) |
| `derived_tstamp`                             | timestamp | Timestamp making allowance for inaccurate device clock                                                                                                                        | No        | '2013-11-26 00:02:04'     | Default Enrichment         |
| `true_tstamp`                                | timestamp | User-set "true timestamp" for the event                                                                                                                                        | No        | '2013-11-26 00:02:04'     | Tracking                   |

#### Event / transaction fields

| **Field**           | **Type** | **Description**                                         | **Reqd?** | **Example**                            | **Source**                        |
| ------------------- | -------- | ------------------------------------------------------- | --------- | -------------------------------------- | --------------------------------- |
| `event`             | text     | The type of event recorded                              | Yes       | 'page_view'                            | Tracking (Deprecated)             |
| `event_id`          | text     | A UUID for each event                                   | Yes       | 'c6ef3124-b53a-4b13-a233-0088f79dcbcb' | Tracking (or enrichment if empty) |
| `txn_id`            | int      | Transaction ID set client-side, used to de-dupe records | No        | 421828                                 | Tracking (Deprecated)             |
| `event_fingerprint` | text     | Hash client-set event fields                            | No        | AADCE520E20C2899F4CED228A79A3083       | Default Enrichment                |

A complete list of event types is given [here](#Event-specific-fields).

#### Snowplow version fields

| **Field**                                 | **Type** | **Description**               | **Reqd?** | **Example**                         | **Source** |
| ----------------------------------------- | -------- | ----------------------------- | --------- | ----------------------------------- | ---------- |
| `v_tracker`                               | text     | Tracker version               | Yes       | 'js-3.0.0'                          | Tracking   |
| `v_collector`                             | text     | Collector version             | Yes       | 'ssc-2.1.0-kinesis'                 | Pipeline   |
| `v_etl`                                   | text     | ETL version                   | Yes       | 'snowplow-micro-1.1.0-common-1.4.2' | Pipeline   |
| `name_tracker`                            | text     | Tracker namespace             | No        | 'sp1'                               | Tracking   |
| `etl_tags` _(not available in BDP Cloud)_ | text     | JSON of tags for this ETL run | No        | "['prod']"                          | Deprecated |

Some Snowplow Trackers allow the user to name each specific Tracker instance. `name_tracker` corresponds to this name, and can be used to distinguish which tracker generated which events.

#### User-related fields

| **Field**           | **Type** | **Description**                                | **Reqd?** | **Example**                            | **Source**           |
| ------------------- | -------- | ---------------------------------------------- | --------- | -------------------------------------- | -------------------- |
| `user_id`           | text     | Unique ID set by business                      | No        | 'jon.doe@email.com'                    | Tracking             |
| `domain_userid`     | text     | User ID set by Snowplow using 1st party cookie | No        | 'bc2e92ec6c204a14'                     | Tracking             |
| `network_userid`    | text     | User ID set by Snowplow using 3rd party cookie | No        | 'ecdff4d0-9175-40ac-a8bb-325c49733607' | Tracking or Pipeline |
| `user_ipaddress`    | text     | User IP address                                | No        | '92.231.54.234'                        | Tracking or Pipeline |
| `domain_sessionidx` | int      | A visit / session index                        | No        | 3                                      | Tracking             |
| `domain_sessionid`  | text     | A visit / session identifier                   | No        | 'c6ef3124-b53a-4b13-a233-0088f79dcbcb' | Tracking             |

`domain_sessionidx` is the number of the current user session. For example, an event occurring during a user's first session would have `domain_sessionidx` set to 1. The JavaScript Tracker calculates this field by storing a visit count in a first-party cookie. Whenever the Tracker fires an event, if more than 30 minutes have elapsed since the last event, the visitor count is increased by 1. (Whenever an event is fired, a "session cookie" is created and set to expire in 30 minutes. This is how the Tracker can tell whether the visit count should be incremented.) Thirty minutes is the default value and can be changed using the `setSessionCookieTimeout` method.

#### Device and operating system fields

| **Field**                                        | **Type** | **Description**            | **Reqd?** | **Example** | **Source**           |
| ------------------------------------------------ | -------- | -------------------------- | --------- | ----------- | -------------------- |
| `useragent`                                      | text     | Raw useragent              | Yes       |             | Tracking or Pipeline |
| `dvce_type` _(not available in BDP Cloud)_       | text     | Type of device             | No        | 'Computer'  | Deprecated           |
| `dvce_ismobile` _(not available in BDP Cloud)_   | boolean  | Is the device mobile?      | No        | 1           | Deprecated           |
| `dvce_screenheight`                              | int      | Screen height in pixels    | No        | 1024        | Tracking             |
| `dvce_screenwidth`                               | int      | Screen width in pixels     | No        | 1900        | Tracking             |
| `os_name` _(not available in BDP Cloud)_         | text     | Name of operating system   | No        | 'Android'   | Deprecated           |
| `os_family` _(not available in BDP Cloud)_       | text     | Operating system family    | No        | 'Linux'     | Deprecated           |
| `os_manufacturer` _(not available in BDP Cloud)_ | text     | Company responsible for OS | No        | 'Apple'     | Deprecated           |

#### Location fields

| **Field**         | **Type** | **Description**                                           | **Reqd?** | **Example**          | **Source**                                                                                     |
| ----------------- | -------- | --------------------------------------------------------- | --------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `geo_country`     | text     | ISO 3166-1 code for the country the visitor is located in | No        | 'GB', 'US'           | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_region`      | text     | ISO-3166-2 code for country region the visitor is in      | No        | 'I9', 'TX'           | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_city`        | text     | City the visitor is in                                    | No        | 'New York', 'London' | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_zipcode`     | text     | Postcode the visitor is in                                | No        | '94109'              | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_latitude`    | text     | Visitor location latitude                                 | No        | 37.443604            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_longitude`   | text     | Visitor location longitude                                | No        | -122.4124            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_region_name` | text     | Visitor region name                                       | No        | 'Florida'            | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `geo_timezone`    | text     | Visitor timezone name                                     | No        | 'Europe/London'      | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |

#### IP address-based fields

| **Field**         | **Type** | **Description**                                                                               | **Reqd?** | **Example**          | **Source**                                                                                     |
| ----------------- | -------- | --------------------------------------------------------------------------------------------- | --------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `ip_isp`          | text     | Visitor's ISP                                                                                 | No        | 'FDN Communications' | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_organization` | text     | Organization associated with the visitor's IP address - defaults to ISP name if none is found | No        | 'Bouygues Telecom'   | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_domain`       | text     | Second level domain name associated with the visitor's IP address                             | No        | 'nuvox.net'          | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |
| `ip_netspeed`     | text     | Visitor's connection type                                                                     | No        | 'Cable/DSL'          | [IP Enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) |

#### Metadata fields

Fields containing information about the event type.

| **Field**       | **Type** | **Description**         | **Reqd?** | **Example**  | **Source** |
| --------------- | -------- | ----------------------- | --------- | ------------ | ---------- |
| `event_vendor`  | text     | Who defined the event   | No        | 'com.acme'   | Tracking   |
| `event_name`    | text     | Event name              | No        | 'link_click' | Tracking   |
| `event_format`  | text     | Format for event        | No        | 'jsonschema' | Tracking   |
| `event_version` | text     | Version of event schema | No        | '1-0-2'      | Tracking   |

### Platform-specific fields

#### Web-specific fields

| **Field**                                                 | **Type**  | **Description**                                                            | **Reqd?** | **Example**                                                    | **Source**                                                                                                                  |
| --------------------------------------------------------- | --------- | -------------------------------------------------------------------------- | --------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Page fields**                                           |           |                                                                            |           |                                                                |                                                                                                                             |
| `page_url`                                                | text      | The page URL                                                               | Yes       | 'http://www.example.com'                                       | Tracking(`web_page` context)                                                                                                |
| `page_urlscheme`                                          | text      | Scheme aka protocol                                                        | Yes       | 'https'                                                        | Default Enrichment (`url`)                                                                                                  |
| `page_urlhost`                                            | text      | Host aka domain                                                            | Yes       | '“www.snowplowanalytics.com'                                   | Default Enrichment (`url`)                                                                                                  |
| `page_urlport`                                            | int       | Port if specified, 80 if not                                               | 80        |                                                                | Default Enrichment (`url`)                                                                                                  |
| `page_urlpath`                                            | text      | Path to page                                                               | No        | '/product/index.html'                                          | Default Enrichment (`url`)                                                                                                  |
| `page_urlquery`                                           | text      | Querystring                                                                | No        | 'id=GTM-DLRG'                                                  | Default Enrichment (`url`)                                                                                                  |
| `page_urlfragment`                                        | text      | Fragment aka anchor                                                        | No        | '4-conclusion'                                                 | Default Enrichment (`url`)                                                                                                  |
| `page_referrer`                                           | text      | URL of the referrer                                                        | No        | 'http://www.referrer.com'                                      | Tracking(`web_page` context)                                                                                                |
| `page_title`                                              | text      | Web page title                                                             | No        | 'Snowplow Docs - Understanding the structure of Snowplow data' | Tracking(`web_page` context)                                                                                                |
| `refr_urlscheme`                                          | text      | Referrer scheme                                                             | No        | 'http'                                                         | ??? Default Enrichment (`url`)                                                                                              |
| `refr_urlhost`                                            | text      | Referrer host                                                               | No        | 'www.bing.com'                                                 | ??? Default Enrichment (`url`)                                                                                              |
| `refr_urlport`                                            | int       | Referrer port                                                               | No        | 80                                                             | ??? Default Enrichment (`url`)                                                                                              |
| `refr_urlpath`                                            | text      | Referrer page path                                                          | No        | '/images/search'                                               | ??? Default Enrichment (`url`)                                                                                              |
| `refr_urlquery`                                           | text      | Referrer URL querystring                                                    | No        | 'q=psychic+oracle+cards'                                       | ??? Default Enrichment (`url`)                                                                                              |
| `refr_urlfragment`                                        | text      | Referrer URL fragment                                                       | No        |                                                                | ??? Default Enrichment (`url`)                                                                                              |
| `refr_medium`                                             | text      | Type of referrer                                                            | No        | 'search', 'internal'                                           | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)           |
| `refr_source`                                             | text      | Name of referrer if recognized                                              | No        | 'Bing images'                                                  | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)           |
| `refr_term`                                               | text      | Keywords if source is a search engine                                      | No        | 'psychic oracle cards'                                         | [Referrer Parser Enrichment](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)           |
| `refr_domain_userid`                                      | text      | The Snowplow domain_userid of the referring website                        | No        | 'bc2e92ec6c204a14'                                             | ??? Default Enrichment (`cross_domain`)                                                                                     |
| `refr_dvce_tstamp`                                        | timestamp | The time of attaching the domain_userid to the inbound link                | No        | '2013-11-26 00:02:05'                                          | ??? Default Enrichment (`cross_domain`)                                                                                     |
| **Document fields**                                       |           |                                                                            |           |                                                                |                                                                                                                             |
| `doc_charset`                                             | text      | The page’s character encoding                                              | No        | , 'UTF-8'                                                      | Tracking                                                                                                                    |
| `doc_width`                                               | int       | The page's width in pixels                                                 | No        | 1024                                                           | Tracking                                                                                                                    |
| `doc_height`                                              | int       | The page's height in pixels                                                | No        | 3000                                                           | Tracking                                                                                                                    |
| **Marketing / traffic source fields**                     |           |                                                                            |           |                                                                |                                                                                                                             |
| `mkt_medium`                                              | text      | Type of traffic source                                                     | No        | 'cpc', 'affiliate', 'organic', 'social'                        | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_source`                                              | text      | The company / website where the traffic came from                          | No        | 'Google', 'Facebook'                                           | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_term`                                                | text      | Any keywords associated with the referrer                                  | No        | 'new age tarot decks'                                          | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_content`                                             | text      | The content of the ad. (Or an ID so that it can be looked up.)             | No        | 13894723                                                       | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_campaign`                                            | text      | The campaign ID                                                            | No        | 'diageo-123'                                                   | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_clickid`                                             | text      | The click ID                                                               | No        | 'ac3d8e459'                                                    | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| `mkt_network`                                             | text      | The ad network to which the click ID belongs                               | No        | 'DoubleClick'                                                  | [Campaign Attribution Enrichment](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md) |
| **Browser fields**                                        |           |                                                                            |           |                                                                |                                                                                                                             |
| `user_fingerprint` _(not available in BDP Cloud)_         | int       | A user fingerprint generated by looking at the individual browser features | No        | 2161814971                                                     |  Tracking                                                                                                                           |
| `connection_type` _(not available in BDP Cloud)_          | text      | Type of internet connection                                                | No        | No                                                             |  ???                                                                                                                           |
| `cookie` _(not available in BDP Cloud)_                   | boolean   | Does the browser support persistent cookies?                               | No        | 1                                                              |  ???                                                                                                                           |
| `br_name` _(not available in BDP Cloud)_                  | text      | Browser name                                                               | No        | 'Firefox 12'                                                   |  Deprecated                                                                                                                           |
| `br_version` _(not available in BDP Cloud)_               | text      | Browser version                                                            | No        | '12.0'                                                         |  Deprecated                                                                                                                           |
| `br_family` _(not available in BDP Cloud)_                | text      | Browser family                                                             | No        | 'Firefox'                                                      |  Deprecated                                                                                                                           |
| `br_type` _(not available in BDP Cloud)_                  | text      | Browser type                                                               | No        | 'Browser'                                                      |  Deprecated                                                                                                                           |
| `br_renderengine` _(not available in BDP Cloud)_          | text      | Browser rendering engine                                                   | No        | 'GECKO'                                                        |  Deprecated                                                                                                                           |
| `br_lang`                                                 | text      | Language the browser is set to                                             | No        | 'en-GB'                                                        |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_pdf` _(not available in BDP Cloud)_          | boolean   | Whether the browser recognizes PDFs                                        | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_flash` _(not available in BDP Cloud)_        | boolean   | Whether Flash is installed                                                 | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_java` _(not available in BDP Cloud)_         | boolean   | Whether Java is installed                                                  | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_director` _(not available in BDP Cloud)_     | boolean   | Whether Adobe Shockwave is installed                                       | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_quicktime` _(not available in BDP Cloud)_    | boolean   | Whether QuickTime is installed                                             | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_realplayer` _(not available in BDP Cloud)_   | boolean   | Whether RealPlayer is installed                                            | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_windowsmedia` _(not available in BDP Cloud)_ | boolean   | Whether mplayer2 is installed                                              | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_gears` _(not available in BDP Cloud)_        | boolean   | Whether Google Gears is installed                                          | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_features_silverlight` _(not available in BDP Cloud)_  | boolean   | Whether Microsoft Silverlight is installed                                 | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_cookies`                                              | boolean   | Whether cookies are enabled                                                | No        | 1                                                              |  Tracking (`browser_features` context)                                                                                                                           |
| `br_colordepth`                                           | int       | Bit depth of the browser color palette                                     | No        | 24                                                             |  Tracking (`browser_features` context)                                                                                                                           |
| `br_viewheight`                                           | int       | Viewport height                                                            | No        | 1000                                                           |  Tracking (`browser_features` context)                                                                                                                           |
| `br_viewwidth`                                            | int       | Viewport width                                                             | No        | 1000                                                           |  Tracking (`browser_features` context)                                                                                                                           |

### Event-specific fields

Snowplow includes specific fields to capture data associated with specific events.

Note that to date, all event types have been defined by Snowplow. Also note that `event_vendor` values follow the [Java package naming convention](http://docs.oracle.com/javase/tutorial/java/package/namingpkgs.html).

Snowplow currently supports the following event types:

| **Event type**                                            | **Value of `event` field in model**  |
| --------------------------------------------------------- | ------------------------------------ |
| [Page views](#page-views)                                 | 'page_view'                          |
| [Page pings](#page-pings)                                 | 'page_ping'                          |
| [E-commerce transactions](#ecommerce-transactions)        | 'transaction' and 'transaction_item' |
| [Custom structured events](#custom-structured-events)     | 'struct'                             |
| [Custom unstructured events](#custom-unstructured-events) | 'unstruct'                           |

Details of which fields are available for which events are given below. In some cases these events will store values in the `atomic.events` columns, which are listed below.

#### Page views

There are currently no fields that are specific to `page_view` events: all the fields that are required are part of the standard fields available for any [web-based event](#web-specific-fields) e.g. `page_urlscheme`, `page_title`.
There are currently no fields that are specific to `page_view` events: all the fields that are required are part of the standard fields available for any [web-based event](#web-specific-fields) e.g. `page_urlscheme`, `page_title`.

#### Page pings

There are four additional fields included with page pings that indicate how a user has scrolled over a web page since the last page ping:

| **Field**        | **Type** | **Description**                                    | **Reqd?** | **Example** | 
| ---------------- | -------- | -------------------------------------------------- | --------- | ----------- | 
| `pp_xoffset_min` | integer  | Minimum page x offset seen in the last ping period | No        | 0           | 
| `pp_xoffset_max` | integer  | Maximum page x offset seen in the last ping period | No        | 100         | 
| `pp_yoffset_min` | integer  | Minimum page y offset seen in the last ping period | No        | 0           | 
| `pp_yoffset_max` | integer  | Maximum page y offset seen in the last ping period | No        | 200         | 

#### E-commerce transactions

There are a large number of fields specifically for transaction events.

Fields that start `tr_` relate to the transaction as a whole. Fields that start `ti_` refer to the specific item included in the transaction. (E.g. a product in the basket.) Single transactions typically span multiple lines of data: there will be a single line where `event` = `transaction`, where the `tr_` fields are set, and multiple lines (one for each product included) where `event` = `transaction_item` and the `ti_` fields are set.

| **Field**           | **Type** | **Description**                                            | **Reqd?** | **Example**     |
| ------------------- | -------- | ---------------------------------------------------------- | --------- | --------------- |
| `tr_orderid`        | text     | Order ID                                                   | Yes       | '#134'          |
| `tr_affiliation`    | text     | Transaction affiliation (e.g. store where sale took place) | No        | 'web'           |
| `tr_total`          | decimal  | Total transaction value                                    | Yes       | 12.99           |
| `tr_tax`            | decimal  | Total tax included in transaction value                    | No        | 3.00            |
| `tr_shipping`       | decimal  | Delivery cost charged                                      | No        | 0.00            |
| `tr_total_base`*    | decimal  | Total in base currency                                     | No        | 12.99           |
| `tr_tax_base`*      | decimal  | Total tax in base currency                                 | No        | 3.00            |
| `tr_shipping_base`* | decimal  | Delivery cost in base currency                             | No        | 0.00            |
| `tr_city`           | text     | Delivery address, city                                     | No        | 'London'        |
| `tr_state`          | text     | Delivery address, state                                    | No        | 'Washington'    |
| `tr_country`        | text     | Delivery address, country                                  | No        | 'France'        |
| `tr_currency`       | text     | Currency                                                   | No        | 'USD'           |
| `ti_orderid`        | text     | Order ID                                                   | Yes       | '#134'          |
| `ti_sku`            | text     | Product SKU                                                | Yes       | 'pbz00123'      |
| `ti_name`           | text     | Product name                                               | No        | 'Cone pendulum' |
| `ti_category`       | text     | Product category                                           | No        | 'New Age'       |
| `ti_price`          | decimal  | Product unit price                                         | Yes       | 9.99            |
| `ti_price_base`*    | decimal  | Price in base currency                                     | No        | 9.99            |
| `ti_quantity`       | integer  | Number of product in transaction                           | Yes       | 2               |
| `ti_currency`       | text     | Currency                                                   | No        | 'EUR'           |
| `base_currency`*    | text     | Reporting currency                                         | No        | 'GBP'           |

\* Set exclusively by the [Currency conversion enrichment](/docs/enriching-your-data/available-enrichments/currency-conversion-enrichment/index.md).

#### Custom structured events

If you wish to track an event that Snowplow does not recognize as a first class citizen (i.e. one of the events listed above), then you can track them using the generic 'custom structured events'. There are five fields that are available to store data related to custom events:

| **Field**     | **Type** | **Description**                                                                                | **Reqd?** | **Example**                   |
| ------------- | -------- | ---------------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| `se_category` | text     | Category of event                                                                              | Yes       | 'ecomm', 'video'              |
| `se_action`   | text     | Action performed / event name                                                                  | Yes       | 'add-to-basket', 'play-video' |
| `se_label`    | text     | The object of the action e.g. the ID of the video played or SKU of the product added-to-basket | No        | 'pbz00123'                    |
| `se_property` | text     | A property associated with the object of the action                                            | No        | 'HD', 'large'                 |
| `se_value`    | decimal  | A value associated with the event / action e.g. the value of goods added-to-basket             | No        | 9.99                          |

#### Custom unstructured (self-describing) events

Custom [unstructured (self-describing) events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md#self-describing-events) are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties that conforms to a JSON schema defined for the event earlier.

<Tabs groupId="warehouse" queryString>
<TabItem value="rs/pg" label="Redshift/Postgres" default>

The unstructured event is not part of the standard `atomic.events` table, instead, for users running on Redshift, it is shredded into its own table. The fields in this table will be determined by the JSON schema defined for the event in advance. Users can query just the table for that particular unstructured event, if that's all that's required for their analysis, or join that table back to the `atomic.events` table by

```sql
select 
    ...
from 
    atomic.events ev
left join 
    atomic.my_example_unstructured_event_table sde
    on sde.root_id = ev.event_id and sde.root_tstamp = ev.collector_tstamp
```

:::note

You may need to take care of duplicate events as Snowplow uses an _at least once_ method of delivery.

:::

</TabItem>
<TabItem value="bq" label="BigQuery">

The unstructured event is not part of the standard `atomic.events` columns, it is instead a `RECORD` type column with the name of the schema and the full version number. The fields in this table will be determined by the JSON schema defined for the event in advance, converted to snake case. Users can query fields in the self-describing event by extracting them using 

```sql
select
...
my_example_unstructured_event_1_0_0.my_custom_field,
...
from 
    atomic.events
```

</TabItem>
<TabItem value="sf" label="Snowflake">

The unstructured event is not part of the standard `atomic.events` columns, it is instead a `OBJECT` type column with the name of the schema and the major version number. The fields in this table will be determined by the JSON schema defined for the event in advance. Users can query fields in the self-describing event by extracting them using 

```sql
select
...
my_example_unstructured_event_1:myCustomField::varchar,
...
from 
    atomic.events
```

</TabItem>
<TabItem value="db" label="Databricks">

The unstructured event is not part of the standard `atomic.events` columns, it is instead a `struct` type column with the name of the schema and the major version number. The fields in this table will be determined by the JSON schema defined for the event in advance, converted to snake case. Users can query fields in the self-describing event by extracting them using 

```sql
select
...
my_example_unstructured_event_1.myCustomField::varchar,
...
from 
    atomic.events
```

</TabItem>
</Tabs>


#### Contexts

Contexts enable Snowplow users to define their own entities that are related to events, and fields that are related to each of those entities. For example, an online retailer may choose to define a `user` context, to store information about a particular user, which might include data points like the users Facebook ID, age, membership details etc. In addition, they may also define a `product` context, with product data e.g. SKU, name, created date, description, tags etc.

An event can have any number of custom contexts attached. Each context is passed into Snowplow as a JSON. Additionally, the [Snowplow Enrichment](/docs/enriching-your-data/index.md) process can derive additional contexts.

<Tabs groupId="warehouse" queryString>
<TabItem value="rs/pg" label="Redshift/Postgres" default>

Contexts are not part of the `atomic.events` table; instead, for users running on Redshift, Snowplow will shred each context JSON into a dedicated table in the `atomic` schema, making it much more efficient for analysts to query data passed in in any one of the contexts. Those contexts can be joined back to the core `atomic.events` table by the following, which is a one-to-one join or a one-to-many join.

```sql
select 
    ...
from 
    atomic.events ev
left join 
    atomic.my_custom_context_table ctx
    on ctx.root_id = ev.event_id and ctx.root_tstamp = ev.collector_tstamp
```

:::note

You may need to take care of duplicate events as Snowplow uses an _at least once_ method of delivery.

:::

</TabItem>
<TabItem value="bq" label="BigQuery">

Contexts are not part of the standard `atomic.events` columns, it is instead a `REPATED` `RECORD` type column with the name of the schema and the full version number. The fields in this table will be determined by the JSON schema defined for the event in advance, converted to snake case. Users can query a single context's fields in the context by extracting them using 

```sql
select
...
my_custom_context_1_0_0[SAFE_OFFSET(0)].my_custom_field,
...
from 
    atomic.events
```

or they can use an [`unnest`](https://cloud.google.com/bigquery/docs/reference/standard-sql/arrays#flattening_arrays) statement to explode out the array.

</TabItem>
<TabItem value="sf" label="Snowflake">

Contexts are not part of the standard `atomic.events` columns, it is instead an `ARRAY` of `OBJECT`s type column with the name of the schema and the major version number. The fields in this table will be determined by the JSON schema defined for the event in advance. Users can query a single context's fields in the context by extracting them using 

```sql
select
...
my_custom_context_1[0]:myCustomField::varchar,
...
from 
    atomic.events
```

or they can use a [`lateral flatten`](https://docs.snowflake.com/en/sql-reference/functions/flatten) statement to explode out the array.

</TabItem>
<TabItem value="db" label="Databricks">

Contexts are not part of the standard `atomic.events` columns, it is instead an `array` of `struct`s type column with the name of the schema and the major version number. The fields in this table will be determined by the JSON schema defined for the event in advance, converted to snake case. Users can query a single context's fields in the context by extracting them using 

```sql
select
...
my_custom_context_1[0].my_custom_field::varchar,
...
from 
    atomic.events
```

</TabItem>
</Tabs>

or they can use a [`LATERAL VIEW`](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-qry-select-lateral-view.html) statement to explode out the array.

### Specific unstructured events and custom contexts

These are also a variety of unstructured events and custom contexts defined by Snowplow. You can find their schemas [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow).

## A note about storage data formats

Currently, Snowplow data can be stored in S3, Google Cloud Storage (GCS), Redshift, BigQuery, Snowflake, Databricks and PostgreSQL. There are some differences between the structure of data in both formats. These relate to data structures that BigQuery, Snowflake and PostgreSQL support while Redshift does not (e.g. JSON/Record columns). Nevertheless, the structure of both is similar: representing a “fat” table.
