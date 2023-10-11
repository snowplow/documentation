---
title: "Snowplow Tracker Protocol"
description: ""
date: "2020-02-26"
sidebar_position: 80
---

# Tracker Protocol Overview

Snowplow trackers fire _events_, which are either `GET` or `POST` requests to a Snowplow collector. By adding parameters to these requests, trackers can pass data into the collector for processing by Snowplow.

The Snowplow Tracker Protocol is the list of all the parameters that Snowplow trackers use when firing events to push data into the Snowplow collectors. Each parameter maps onto one or more fields in the Snowplow events table employed in storage. 

This page is for you if you want to understand the tracker payload in more detail, and especially if you are building your own tracker. In the latter case, utilizing the parameters documented here will ensure that your tracker works with the rest of the Snowplow stack.

:::caution

When the event is sent from a Snowplow tracker, all parameters should be stringified. Those strings are parsed back to their actual type during [Enrichment](/docs/pipeline-components-and-applications/enrichment-components/index.md).

:::

## Snowplow events

At its heart, Snowplow is a platform for granular tracking of events. In the tracker protocol, each event is denoted by an `e=...` parameter.

There are 3 categories of events:

- Standard events, such as page views, page pings and transactions
- Custom self-describing events based on a [schema](/docs/understanding-your-pipeline/schemas/index.md)
- Legacy custom structured events, which we don’t recommend using

:::info

Historically, custom self-describing events were called “unstructured” and the legacy custom events were called “structured”. This terminology can be confusing, so we don’t use it anymore. However, you might find its remnants in some of the APIs.

:::

| **Type of tracking**                                         | **Event type (value of `e`)** |
|--------------------------------------------------------------|-------------------------------|
| [Self-describing event](#self-describing-events)     | `ue`                          |
| [Pageview tracking](#page-views)                      | `pv`                          |
| [Page pings](#page-pings)                                    | `pp`                          |
| [Ecommerce transaction tracking](#transaction-tracking)    | `tr` and `ti`                 |
| [Custom structured event](#structured-event-tracking)        | `se`                          |

Additionally, [entities can be attached to events](#event-entity-tracking) which gives additional context to the event.

### Self-describing events

[Structuring your data with schemas](/docs/understanding-your-pipeline/schemas/index.md) to perform self-describing event tracking is the defacto way to track events with Snowplow and allows any arbitrary name: value pairs to be captured with the event.

An example of a self-describing event for a product view event:

```json
{
  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
  "data": {
    "product_id": "ASO01043",
    "price": 49.95
  }
}
```

:::info

`"iglu:com.my_company/viewed_product/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::

The tracker will wrap this self-describing JSON in an outer self-describing JSON, which is what gets sent in the payload:

```json
{

  // Tells Snowplow this is an self-describing event
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {

    // Tells Snowplow this is a viewed_product event
    "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
    "data": {

      // The event data itself
      "product_id": "ASO01043",
      "price": 49.95
    }
  }
}
```

As well as setting `e=ue`, there are two custom event specific parameters that can be populated with the outer self-describing JSON:

| **Parameter** | **Table Column**      | **Type**                       | **Description**              | **Example values**                                             |
|----------------|--------------------------------|------------------------------|----------------------------------------------------------------------------------|
| `ue_px`       | `unstruct_event` | JSON (URL-safe Base64 encoded) | The properties of the event  | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |
| `ue_pr`       | `unstruct_event` | JSON                           | The properties of the event  | `{ "product_id": "ASO01043", "price": 49.95 }`                 |

The tracker can decide to pass the `ue_px` or the `ue_pr` parameter. Encoding properties into URL-safe Base64 allows is the recommended approach although does sacrifice readability.

### Other Events

There are a number of core Snowplow events which do not follow the self-describing event format.

#### Page Views

Pageview tracking is used to record views of web pages.

Currently, recording a pageview involves recording an event where `e=pv`. All the fields associated with web events can be tracked. There are no other pageview specific fields.

#### Page Pings

Page pings are used to record users engaging with content on a web page after it has originally loaded. For example, it can be used to track how far down an article a user scrolls.

If enabled, the [activity tracking function](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/index.md#activity-tracking-page-pings) checks for engagement with a page after load. (E.g. mousemovement, scrolling etc...).

Page pings are identified by `e=pp`. As well as all the standard web fields, there are four additional fields that `pp` includes, which are used to identify how users are scrolling over web pages:

| **Parameter** | **Table Column**      | **Type** | **Description**                                     | **Example values** |
|----------------|----------|-----------------------------------------------------|--------------------|
| `pp_mix`      | `pp_xoffset_min` | integer  | Minimum page x offset seen in the last ping period  | `0`                |
| `pp_max`      | `pp_xoffset_max` | integer  | Maximum page x offset seen in the last ping period  | `100`              |
| `pp_miy`      | `pp_yoffset_min` | integer  | Minimum page y offset seen in the last ping period  | `0`                |
| `pp_may`      | `pp_yoffset_max` | integer  | Maximum page y offset seen in the last ping period  | `100`              |

#### Transaction tracking

Transaction events allow you to track a transaction. The items of the transaction can be tracked using [Transaction Item events](#transaction-item-events).

| **Parameter** | **Table Column**      | **Type** | **Description**                                      | **Example values** |
|----------------|----------|------------------------------------------------------|--------------------|
| `tr_id`       | `tr_orderid`     | text     | Order ID                                             | `12345`            |
| `tr_af`       | `tr_affiliation` | text     | Transaction affiliation (e.g. channel)               | `Web`              |
| `tr_tt`       | `tr_total`       | decimal  | Transaction total value                              | `9.99`             |
| `tr_tx`       | `tr_tax`         | decimal  | Transaction tax value (i.e. amount of VAT included)  | `1.98`             |
| `tr_sh`       | `tr_shipping`    | decimal  | Delivery cost charged                                | `3.00`             |
| `tr_ci`       | `tr_city`        | text     | Delivery address: city                               | `London`           |
| `tr_st`       | `tr_state`       | text     | Delivery address: state                              | `Denver`           |
| `tr_co`       | `tr_country`     | text     | Delivery address: country                            | `United Kingdom`   |
| `tr_cu`       | `tr_currency`    | text     | Transaction Currency                                 | `GBP`              |

#### Transaction item events

Transaction item events are separate events, representing the items of a transaction, which are linked to a Transaction event via `ti_id` which should map to `tr_id` of a transaction event.

| **Parameter** | **Table Column**  | **Type** | **Description**  | **Example values** |
|---------------|---------------|----------|------------------|--------------------|
| `ti_id`       | `ti_orderid`  | text     | Order ID         | `12345`            |
| `ti_sk`       | `ti_sku`      | text | Item SKU | Yes | \`pbz0025' |
| `ti_nm`       | `ti_name`     | text | Item name | Yes | `black-tarot` |
| `ti_ca`       | `ti_category` | text | Item category | Yes | `tarot` |
| `ti_pr`       | `ti_price`    | decimal | Item price | Yes | `7.99` |
| `ti_qu`       | `ti_quantity` | integer | Item quantity | Yes | `2` |
| `ti_cu`       | `ti_currency` | text | Currency | Yes | `USD` |

#### Structured event tracking

:::info

Structured event tracking is a legacy format used to track events that were not natively supported by Snowplow.

We recommend using [self-describing events](#self-describing-events) for custom event tracking.

:::

As well as setting `e=se`, there are five custom event specific parameters that can be set:

| **Parameter** | **Table Column**   | **Type** | **Description**                                                         | **Example values**            |
|---------------|---------------|----------|-------------------------------------------------------------------------|-------------------------------|
| `se_ca`       | `se_category` | text     | The category of event                                                   | `Ecomm`, `Media`              |
| `se_ac`       | `se_action`   | text     | The action / event itself                                               | `add-to-basket`, `play-video` |
| `se_la`       | `se_label`    | text     | A label often used to refer to the 'object' the action is performed on  | `dog-skateboarding-video`     |
| `se_pr`       | `se_property` | text     | A property associated with either the action or the object              | `hd`                          |
| `se_va`       | `se_value`    | decimal  | A value associated with the user action                                 | `13.99`                       |

### Event Entity Tracking

Custom entities can be used to add additional context to an event.

Each individual entity is a self-describing JSON such as:

```json
{
  "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
  "data": {
    "fb_uid": "9999xyz"
  }
}
```

:::info

`"iglu:com.my_company/user/jsonschema/1-0-0"` respresents a [self-describing JSON](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-jsons/index.md). It is used to validate the event data against a predefined JSON Schema as part of a Snowplow pipeline.

:::

All entities attached to an event will be wrapped in an array by the user and passed to the tracker, which will wrap them in a self-describing JSON:

```json
{

  // Tells Snowplow this is an array of custom contexts
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {

      // Tells Snowplow that this is a "user" context
      "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
      "data": {

        // The context data itself
        "fb_uid": "9999xyz"
      }
    }
  ]
}
```

Trackers can be configured to encode the context into URL-safe Base64 to ensure that no data is lost or corrupted. The downside is that the data will be bigger and less readable.

| **Parameter** | **Table Column**                   | **Type**                       | **Description**                 | **Example values**                                                                                                                                                                                                        |
|---------------|-------------------------------|--------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `co`          | `context`                     | JSON                           | An array of custom contexts     | `%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D`  |
| `cx`          | `context`                     | JSON (URL-safe Base64 encoded) | An array of custom contexts     | `ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==`  |

## Common Parameters

### Event parameters

| **Parameter** | **Table Column**           | **Type** | **Description**  | **Example values**                     |
|---------------|-----------------------|----------|------------------|----------------------------------------|
| `e`           | `event`               | text     | Event type       | (See table [above](#snowplow-events))           |
| `eid`         | `event_id`            | text     | Event UUID       | `606adff6-9ccc-41f4-8807-db8fdb600df8` |

:::caution

Every line of data passed from the tracker should contain an event field (`e`) to denote the type of event being tracked (See the [events section](#snowplow-events) for possible values).

:::

:::info

The event ID (`eid`) is the unique identifier (UUID) for this row. This should be generated by trackers, but if missing will be generated by the enrichment process.

:::

### Application parameters

| **Parameter** | **Table Column**                 | **Type** | **Description**                              | **Example values**      |
|---------------|-----------------------------|----------|----------------------------------------------|-------------------------|
| `tna`         | `name_tracker`              | text     | The tracker namespace                        | `tracker_1`             |
| `aid`         | `app_id`                    | text     | Unique identifier for website / application  | `snow-game-android`     |
| `p`           | `platform`                  | text     | The platform the app runs on                 | `web`, `mob`, `app`     |
| `tv`          | `v_tracker`                 | text     | Identifier for Snowplow tracker              | `js-2.16.2`             |

:::info

The tracker namespace parameter is used to distinguish between different trackers. The name can be any string that _does not_ contain a colon or semi-colon character. Tracker namespacing allows you to run multiple trackers, pinging to different collectors.

:::

**Allowed platform values**:

| **Platform**               | **`p` value** |
|----------------------------|---------------|
| Web (including Mobile Web) | `web`         |
| Mobile/Tablet              | `mob`         |
| Desktop/Laptop/Netbook     | `pc`          |
| Server-Side App            | `srv`         |
| General App                | `app`         |
| Connected TV               | `tv`          |
| Games Console              | `cnsl`        |
| Internet of Things         | `iot`         |

### Timestamp parameters

| **Parameter** | **Table Column**           | **Type** | **Description**                                              | **Example values** |
|---------------|-----------------------|----------|--------------------------------------------------------------|--------------------|
| `dtm`         | `dvce_created_tstamp` | int      | Timestamp when event occurred, as recorded by client device  | `1361553733313`    |
| `stm`         | `dvce_sent_tstamp`    | int      | Timestamp when event was sent by client device to collector  | `1361553733371`    |
| `ttm`         | `true_tstamp`         | int      | User-set exact timestamp                                     | `1361553733371`    |
| `tz`          | `os_timezone`         | text     | Time zone of client devices OS                               | `Europe%2FLondon`  |

:::info

The Snowplow Collector will also capture `collector_tstamp` which the time the event arrived at the collector.

Snowplow will also calculate a `derived_tstamp` which attempts to make allowances for innaccurate device clocks.
The `ttm` field is used for a timestamp set on the client which should be taken as accurate. This will overwrite the `derived_tstamp` if set.

:::

### User related parameters

| **Parameter** | **Table Column**         | **Type** | **Description**                                                                                                                                                    | **Example values**                     |
|---------------|---------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `duid`        | `domain_userid`     | text     | Unique identifier for a user, based on a first party cookie (so domain specific)                                                                                   | `aeb1691c5a0ee5a6`                     |
| `tnuid`       | `network_userid`    | text     | Can be used be a tracker to overwrite the nuid                                                                                                                     | `ecdff4d0-9175-40ac-a8bb-325c49733607` |
| `uid`         | `user_id`           | text     | Unique identifier for user, set by the business using `setUserId`                                                                                                  | `jon.doe@email.com`                    |
| `vid`         | `domain_sessionidx` | int      | Index of number of visits that this user_id has made to this domain. `1` is first visit.                                                                           | `1`                                    |
| `sid`         | `domain_sessionid`  | text     | Unique identifier (UUID) for this visit of this user_id to this domain                                                                                             | `9c65e7f3-8e8e-470d-b243-910b5b300da0` |
| `ip`          | `user_ipaddress`    | text     | IP address override. This is useful, if traffic is being proxied to a Snowplow collector (optional, as IP Address will be automatically captured by collector)     | `37.157.33.178`                        |

:::info

`network_userid` is captured via a cookie set by the Snowplow Collector. It can be overriden by setting `tnuid` on a Tracker request payload but is typically expected to be populated by the collector cookies.

:::

### Platform parameters

| **Parameter** | **Table Column**                                 | **Type** | **Description**                                               | **Example values**                                                                                                      |
|---------------|---------------------------------------------|----------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `url`         | `page_url`                                  | text     | Page URL                                                      | `http%3A%2F%2Ftest.psybazaar.com%2F2-tarot-cards`                                                                       |
| `ua`          | `useragent`                                 | text     | Useragent                                                     | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0                                    |
| `page`        | `page_title`                                | text     | Page title                                                    | `Snowplow%20Behavoral%20Data`                                                                                           |
| `refr`        | `page_referrer`                             | text     | Referrer URL                                                  | `http%3A%2F%2Fwww.snowplow.io%2F`                                                                                       |
| `cookie`      | `br_cookies`                                | boolean  | Does the browser permit cookies?                              | `1`                                                                                                                     |
| `lang`        | `br_lang`                                   | text     | Language the browser is set to                                | `en-US`                                                                                                                 |
| `f_pdf`       | `br_features` or `br_features_pdf`          | boolean  | Adobe PDF plugin installed?                                   | `1`                                                                                                                     |
| `cd`          | `br_colordepth`                             | integer  | Browser color depth                                           | `24`                                                                                                                    |
| `cs`          | `doc_charset`                               | text     | Web page's character encoding                                 | `UTF-8`                                                                                                                 |
| `ds`          | `doc_width` and `doc_height`                | text     | Web page width and height                                     | `1090x1152`                                                                                                             |
| `vp`          | `br_viewwidth` and `br_viewheight`          | text     | Browser viewport width and height                             | `1105x390`                                                                                                              |
| `res`         | `dvce_screenwidth` and `dvce_screenheight`  | text     | Screen / monitor resolution                                   | `1280x1024`                                                                                                             |
| `mac`         | `mac_address`                               | text     | MAC address for the device running the tracker                | `12:34:56:78:9A:BC`                                                                                                     |

### Reserved parameters

`u` is a reserved parameter because it is used for [click tracking in the Pixel Tracker](/docs/collecting-data/collecting-from-own-applications/pixel-tracker/index.md#click-tracking).

## Other event properties

Alongside the Tracker Protocol JSON Payload, it's possible to capture additional information on HTTP Requests.

### HTTP Headers

Snowplow Collectors will collect any standard HTTP headers and the values of these headers can be extracted during Enrichment. The [HTTP header extractor enrichment](/docs/enriching-your-data/available-enrichments/http-header-extractor-enrichment/index.md) can be configured for the headers you wish to extract.

Additionally, the following two headers can be sent on requests:

| Header            | Allowed Values     | Description |
|-------------------|--------------------|------------|
| Content-Type      | `application/json` | See [MDN Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)        |
| SP-Anonymous      | `*`                | Enables Server Side Anonymization, preventing the User IP Address and Network User ID from being collectoed       |

#### Cookie Header

Snowplow Collectors will collect any cookie information sent in the `Cookie` HTTP header. Cookies can be attached to events using the [Cookie extractor enrichment](/docs/enriching-your-data/available-enrichments/cookie-extractor-enrichment/index.md)
