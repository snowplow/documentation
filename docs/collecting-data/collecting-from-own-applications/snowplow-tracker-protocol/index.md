---
title: "Snowplow Tracker Protocol"
description: ""
date: "2020-02-26"
sidebar_position: 80
---

## [](#overview)Overview

Snowplow trackers fire _events_, which are either `GET` or `POST` requests of a Snowplow collector, whenever an event on a website or application takes place. By appending events' parameters and values to the end of those `GET` requests or adding them into the body of `POST` messages, trackers can pass data into the collectors, for processing by Snowplow.

The Snowplow Tracker Protocol is the list of all the parameters that Snowplow trackers use when firing events to push data into the Snowplow collectors. Each parameter maps onto one or more fields in the Snowplow events table employed in storage. Here we document which field in the Snowplow events table each raw event parameter maps onto.

Snowplow has been architected to be as easy as possible for developers to create their own alternative subsystems. This documentation should be used by anyone who would like to build their own tracker: by utilising the parameters documented here, the author of a new tracker can be confident that his / her tracker will work with the rest of the Snowplow stack, and be confident where the values associated with each parameter on every call will be available to query in Snowplow, whether that's in Hive or Infobright or another database.

In the first part of this guide, we cover the parameters in the Snowplow tracker protocol that are common across different event types. In the second part, we document the parameters that are relevant for specific events that are recognised in the Snowplow event model. Please note: this model is evolving over time as we incorporate more events and grow the set of fields associated with each of the standard events. In all cases, we do our best to ensure that any changes are backwards compatible. (So we are happy adding new parameters, but do not remove parameters once they have been incorporated.)

Each parameter of the Snowplow Tracker Protocol is described in the tables below, whose columns are:

- **Parameter**: The actual raw event parameter name.
- **Maps to**: The column name in Snowplow events table which the parameter maps to.
- **Type**: The actual type that the parameter represents.
    
    Note
    
    When the event is sent from a Snowplow tracker, all parameters should be stringified. Those strings are parsed back to their actual type during [Enrichment](/docs/pipeline-components-and-applications/enrichment-components/index.md).
    
- **Description**: A short description for the parameter.
- **Implemented**: Whether the parameter is implemented, deprecated or not-implemented.
- **Example values**: Examples of valid values for the parameter.

## [](#the-snowplow-tracker-protocol-individual-parameters)The Snowplow Tracker protocol: individual parameters

## Common parameters (platform and event independent)

#### Application parameters

| **Parameter** | **Maps to**                 | **Type** | **Description**                             | **Implemented?** | **Example values**      |
|---------------|-----------------------------|----------|---------------------------------------------|------------------|-------------------------|
| `tna`         | `name_tracker`              | text     | The tracker namespace                       | Yes              | `tracker_1`             |
| `evn`         | `event_vendor` (deprecated) | text     | The company who developed the event model   | deprecated       | `com.snowplowanalytics` |
| `aid`         | `app_id`                    | text     | Unique identifier for website / application | Yes              | `angry-birds-android`   |
| `p`           | `platform`                  | text     | The platform the app runs on                | Yes              | `web`, `mob`, `app`     |

The tracker namespace parameter is used to distinguish between different trackers. The name can be any string that _does not_ contain a colon or semi-colon character. Tracker namespacing allows you to run multiple trackers, pinging to different collectors.

The event vendor parameter makes it possible to distinguish between events defined by different companies. _Note: the event vendor parameter is deprecated._

The application ID parameter is used to distinguish data from different websites and applications.

As a Snowplow user, you can define application IDs for each of your different digital products and track behaviour of your users across all of them using the same Snowplow instance by setting the `app_id` in your tracker of choice.

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

#### Date / time parameter

| **Parameter** | **Maps to**           | **Type** | **Description**                                             | **Implemented?** | **Example values** |
|---------------|-----------------------|----------|-------------------------------------------------------------|------------------|--------------------|
| `dtm`         | `dvce_created_tstamp` | int      | Timestamp when event occurred, as recorded by client device | Yes              | `1361553733313`    |
| `stm`         | `dvce_sent_tstamp`    | int      | Timestamp when event was sent by client device to collector | Yes              | `1361553733371`    |
| `ttm`         | `true_tstamp`         | int      | User-set exact timestamp                                    | Yes              | `1361553733371`    |
| `tz`          | `os_timezone`         | text     | Time zone of client device's OS                             | Yes              | `Europe%2FLondon`  |

It is possible to record the time that an event occurs on the clients-side (i.e. in the tracker), or server side (i.e. by the collector). When using the JavaScript tracker to track web events, it makes sense to rely on the collector logs to identify the time that events occured, as Snowplow tracking tags are fired as events happen, and so the time they are received server-side should be an accurate representation of the time the event being tracked occured. In other situations (e.g. when using mobile trackers), the time the collector receives the data may be sometime after an event occurred, and so it makes sense to record the timestamp on the client-side, in which case this is handled by the tracker.

The `ttm` field is used for a timestamp set on the client which should be taken as accurate. For example, it should be used when using a tracker to process a batch of existing events with known timestamps independent of the device clock for the tracker.

The tracker can pass a client-side timestamp to the collector using the above parameters.

#### Event / transaction parameters

| **Parameter** | **Maps to**           | **Type** | **Description** | **Implemented?** | **Example values**                     |
|---------------|-----------------------|----------|-----------------|------------------|----------------------------------------|
| `e`           | `event`               | text     | Event type      | Yes              | (See table [below](#events))           |
| `tid`         | `txn_id` (deprecated) | text     | Transaction ID  | deprecated       | `352583`                               |
| `eid`         | `event_id`            | text     | Event UUID      | Yes              | `606adff6-9ccc-41f4-8807-db8fdb600df8` |

Every line of data passed from the tracker should contain an event field (`e`) to denote the type of event being tracked. For details about the potential values that `e` can take, and the corresponding event types that they refer to, see the section detailing [Snowplow events](#events).

The transaction ID (`tid`) can be used in situations where there is a risk of duplicate records for the same event. In this case, the transaction ID can be used to aid deduping of records. This field has been deprecated in favour of the event ID.

The event ID (`eid`) is the unique identifier (UUID) for this row. Historically we generated this in the Enrichment process but where possible we are migrating this to being generated in the trackers.

#### Snowplow Tracker Version

| **Parameter** | **Maps to** | **Type** | **Description**                 | **Implemented?** | **Example values** |
|---------------|-------------|----------|---------------------------------|------------------|--------------------|
| `tv`          | `v_tracker` | text     | Identifier for Snowplow tracker | Yes              | `js-2.16.2`        |

For deployments where multiple trackers are used (e.g. for businesses that use the [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/index.md) to track events on their domains alongside the [Pixel tracker](/docs/collecting-data/collecting-from-own-applications/pixel-tracker/index.md) to track events on 3rd party domains), it is useful to be able to distinguish data generated from each tracker. It can also be useful when tracker versions are updated, so that it is easier to see if an update in tracker accounts for a feature of the data at analysis time.

#### User related parameters

| **Parameter** | **Maps to**         | **Type** | **Description**                                                                                                                  | **Implemented?** | **Example values**                     |
|---------------|---------------------|----------|----------------------------------------------------------------------------------------------------------------------------------|------------------|----------------------------------------|
| `duid`        | `domain_userid`     | text     | Unique identifier for a user, based on a first party cookie (so domain specific)                                                 | Yes              | `aeb1691c5a0ee5a6`                     |
| `nuid`        | `network_userid`    | text     | Unique identifier for a user, based on a cookie from the collector (so set at a network level and shouldn't be set by a tracker) | Yes              | `ecdff4d0-9175-40ac-a8bb-325c49733607` |
| `tnuid`       | `network_userid`    | text     | Can be used be a tracker to overwrite the nuid                                                                                   | Yes              | `ecdff4d0-9175-40ac-a8bb-325c49733607` |
| `uid`         | `user_id`           | text     | Unique identifier for user, set by the business using `setUserId`                                                                | Yes              | `jon.doe@email.com`                    |
| `vid`         | `domain_sessionidx` | int      | Index of number of visits that this user_id has made to this domain e.g. `1` is first visit                                     | Yes              | `1`, `2`...                            |
| `sid`         | `domain_sessionid`  | text     | Unique identifier (UUID) for this visit of this user_id to this domain                                                          | Yes              | `9c65e7f3-8e8e-470d-b243-910b5b300da0` |
| `ip`          | `user_ipaddress`    | text     | IP address                                                                                                                       | Yes              | `37.157.33.178`                        |

We recommend setting the `uid` / `user_id` parameter: as this is the cornerstone of all user-centric analytics and is a valuable data point alonside `duid` / `domain_userid` and `nuid` / `network_userid` from web tracking.

By setting the `vid` / `visit_id` it is possible to define when sessions begin and end client-side, in the tracker. But it is equally possible to define session start and stop times at the ETL or analytics phase, in which case it need not be set in the tracker at all. Note: Google Analytics defines sessions server side.

Setting `ip` is optional: Snowplow collectors log IP address as standard. However, you can override the value derived from the collector by populating this value in the tracker. This is useful, if traffic is being proxied to a Snowplow collector, for example.

If you are tracking events both server-side and client-side and you want the `network_userid` to be set in your server-side events, use the `tnuid` parameter.

#### Device related properties

| **Parameter** | **Maps to**                                | **Type** | **Description**             | **Implemented?** | **Example values** |
|---------------|--------------------------------------------|----------|-----------------------------|------------------|--------------------|
| `res`         | `dvce_screenheight` and `dvce_screenwidth` | text     | Screen / monitor resolution | Yes              | `1280x1024`        |

We intend to build out the list of device related properties over time.

### Platform specific parameters

#### Web-specific parameters

In addition, there is a set of browser-specific parameters that only makes sense to record for events that happen on web platforms (`p=web`). These parameters are relevant across **all** web events, regardless of the event type. (E.g. if it is a pageview, pageping, transaction, media play etc...)

| **Parameter** | **Maps to**                                 | **Type** | **Description**                                              | **Implemented?** | **Example values**                                                                                                      |
|---------------|---------------------------------------------|----------|--------------------------------------------------------------|------------------|-------------------------------------------------------------------------------------------------------------------------|
| `url`         | `page_url`                                  | text     | Page URL                                                     | Yes              | `http%3A%2F%2Ftest.psybazaar.com%2F2-tarot-cards`                                                                       |
| `ua`          | `useragent`                                 | text     | Useragent (a.k.a. browser string)                            | Yes              | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.78.2 (KHTML, like Gecko) Version/7.0.6 Safari/537.78.2 |
| `page`        | `page_title`                                | text     | Page title                                                   | Yes              | `Tarot%20cards`                                                                                                         |
| `refr`        | `page_referrer`                             | text     | Referrer URL                                                 | Yes              | `http%3A%2F%2Ftest.psybazaar.com%2F`                                                                                    |
| `fp`          | `user_fingerprint`                          | integer  | User identifier based on (hopefully unique) browser features | Yes              | `4048966212`                                                                                                            |
| `ctype`       | `connection_type`                           | text     | Type of connection                                           | No               |                                                                                                                         |
| `cookie`      | `br_cookies`                                | boolean  | Does the browser permit cookies?                             | Yes              | `1`                                                                                                                     |
| `lang`        | `br_lang`                                   | text     | Language the browser is set to                               | Yes              | `en-US`                                                                                                                 |
| `f_pdf`       | `br_features` or `br_features_pdf`          | boolean  | Adobe PDF plugin installed?                                  | Yes              | `1`                                                                                                                     |
| `f_qt`        | `br_features` or `br_features_quicktime`    | boolean  | Quicktime plugin installed?                                  | Yes              | `0`                                                                                                                     |
| `f_realp`     | `br_features` or `br_features_realplayer`   | boolean  | Realplayer plugin installed?                                 | Yes              | `0`                                                                                                                     |
| `f_wma`       | `br_features` or `br_features_windowsmedia` | boolean  | Windows media plugin instlaled?                              | Yes              | `0`                                                                                                                     |
| `f_dir`       | `br_featurse` or `br_features_director`     | boolean  | Director plugin installed?                                   | Yes              | `0`                                                                                                                     |
| `f_fla`       | `br_featurse` or `br_features_flash`        | boolean  | Flash plugin installed?                                      | Yes              | `1`                                                                                                                     |
| `f_java`      | `br_featurse` or `br_features_java`         | boolean  | Java plugin installed?                                       | Yes              | `1`                                                                                                                     |
| `f_gears`     | `br_featurse` or `br_features_gears`        | boolean  | Google gears installed?                                      | Yes              | `1`                                                                                                                     |
| `f_ag`        | `br_featurse` or `br_features_silverlight`  | boolean  | Silverlight plugin installed?                                | Yes              | `1`                                                                                                                     |
| `cd`          | `br_colordepth`                             | integer  | Browser color depth                                          | Yes              | `24`                                                                                                                    |
| `ds`          | `doc_width` and `doc_height`                | text     | Web page width and height                                    | Yes              | `1090x1152`                                                                                                             |
| `cs`          | `doc_charset`                               | text     | Web page's character encoding                                | Yes              | `UTF-8`                                                                                                                 |
| `vp`          | `br_viewwidth` and `br_viewheight`          | text     | Browser viewport width and height                            | Yes              | `1105x390`                                                                                                              |

#### Internet of Things-specific parameters

In addition, there is a set of device-specific parameters that only makes sense to record for events that happen on the Internet of Things (`p=iot`). These parameters are relevant across **all** Internet of Things events, regardless of the event type:

| **Parameter** | **Maps to**   | **Type** | **Description**                                | **Implemented?** | **Example values**  |
|---------------|---------------|----------|------------------------------------------------|------------------|---------------------|
| `mac`         | `mac_address` | text     | MAC address for the device running the tracker | Yes              | `12:34:56:78:9A:BC` |

### Snowplow events

At its heart, Snowplow is a platform for granular tracking of events. Currently, Snowplow understands the following events. In the tracker protocol, each event is denoted by an `e=...` parameter.

|      | **Type of tracking**                        | **Event type (value of `e`)** |
|------|---------------------------------------------|-------------------------------|
| 3.1  | [Pageview tracking](#pageview)              | `pv`                          |
| 3.2  | [Page pings](#pagepings)                    | `pp`                          |
| 3.3  | [Link click](#linkclick)                    | `ue`                          |
| 3.4  | [Ad impression tracking](#adimp)            | `ue`                          |
| 3.5  | [Ecommerce transaction tracking](#ecomm)    | `tr` and `ti`                 |
| 3.6  | [Social tracking](#social)                  | TBD                           |
| 3.7  | [Item view](#item)                          | TBD                           |
| 3.8  | [Error tracking](#error)                    | TBD                           |
| 3.9  | [Custom structured event](#event)           | `se`                          |
| 3.10 | [Custom unstructured event](#unstructevent) | `ue`                          |

We are working to make the data model for each of the above events richer, and expand the 'Snowplow event library' to support a wider selection of events that businesses running Snowplow wish to track.

In each case, we use the `&e` parameter to indicate the type of event that is being tracked by Snowplow to the value indicated in the above table

#### Pageview tracking

Pageview tracking is used to record views of web pages.

Currently, recording a pageview involves recording an event where `e=pv`. All the fields associated with web events can be tracked. There are no other pageview specific fields:

```text
// Key common parameters
duid=aeb1691c5a0ee5a6    // Domain user ID
&vid=2                  // Domain session index
&tid=508780             // Transaction ID
&aid=pbzsite            // App ID
&p=web 				// Platform ID

// Key data points related to page view
&e=pv                   // event = page view
&url=http%3A%2F%2Ftest.psybazaar.com%2F2-tarot-cards    // Page URL
&page=Tarot%20cards                                     // Page title
&refr=http%3A%2F%2Ftest.psybazaar.com%2F                // Referrer URL

// Other browser-specific parameters
&lang=en-US
&fp=3511643688
&f_pdf=1
&f_qt=0
&cd=32
&cookie=1
&tz=Europe%2FLondon

e=pv           // page view
&aid=pbzsite   // app_id
&p=web         // platform
&tid=580794    // transaction ID
&dtm=1361555202287  // client timestamp

&page=Psychic Bazaar                  // Page Title
&url=http=//www.psychicbazaar.com/    // Page URL
&ds=1120x1848                         // Document dimensions
&cs=UTF-8                             // Document character set

&res=1920x976                         // Device monitor dimensions
&vp=873x390                           // Viewport dimensions
&duid=91a88a7ec90ebbb1                // Domain user ID
&fp=3324966434                        // User fingerprint
&vid=3                                // Domain session ID

&tv=js-0.13.1                         // Tracker version
&lang=en-GB                           // Browser language
&tz=Europe/London                     // Client time zone
```

#### Page pings

Page pings are used to record users engaging with content on a web page after it has originally loaded. It can be used to track e.g. how far down an article a user scrolls.

If enabled, the page ping function checks for engagement with a page after load. (E.g. mousemovement, scrolling etc...) If there is some sort of engagement in a specified time interval, a page ping is sent.

Page pings are identified by `e=pp`. As well as all the standard web fields, there are four additional fields that `pp` includes, which are used to identify how users are scrolling over web pages:

| **Parameter** | **Maps to**      | **Type** | **Description**                                    | **Implemented?** | **Example values** |
|---------------|------------------|----------|----------------------------------------------------|------------------|--------------------|
| `pp_mix`      | `pp_xoffset_min` | integer  | Minimum page x offset seen in the last ping period | Yes              | `0`                |
| `pp_max`      | `pp_xoffset_max` | integer  | Maximum page x offset seen in the last ping period | Yes              | `100`              |
| `pp_miy`      | `pp_yoffset_min` | integer  | Minimum page y offset seen in the last ping period | Yes              | `0`                |
| `pp_may`      | `pp_yoffset_max` | integer  | Maximum page y offset seen in the last ping period | Yes              | `100`              |

Example:

```text
e=pp        // Page ping
// Max and min x and y offsets
pp_mix=0    
pp_max=7
pp_miy=0
pp_may=746

// Other relevant fields
duid=91a88a7ec90ebbb1 // Domain user id
vid=1                 // Domain session index
page=Tarot cards - Psychic Bazaar    // Page title
refr=http=//www.psychicbazaar.com/   // Page referrer
url=http://www.psychicbazaar.com/2-tarot-cards // Page URL

tid=344664            // Transaction ID
dtm=1361534887845     // Client timestamp
vp=1105x390           // Viewport dimensions
ds=1097x1413          // Document dimensions
aid=pbzsite           // App ID
lang=en-GB            // Browser language
cs=UTF-8              // Docuemnt characterset
res=1920x976          // Monitor resolution / size
```

#### Link click tracking

Link clicks are treated as unstructured events. The schema for a link click event can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-0).

#### Ad impression tracking

_Deprecation warning: the special ad impression querystring parameters described in this section are deprecated. Instead, ad impressions, ad clicks, and ad conversions are all treated as unstructured events. There schemas are available at the following locations:_

_[Ad impression schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0)_

_[Ad click schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_click/jsonschema/1-0-0)_

_[Ad conversion schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ad_conversion/jsonschema/1-0-0)_

As well as setting `e=ad`, there are four specific parameters that can be set when an ad impression is tracked:

| **Parameter** | **Maps to**        | **Type** | **Description**  | **Implemented?** | **Example values**                     |
|---------------|--------------------|----------|------------------|------------------|----------------------------------------|
| `ad_ba`       | `adi_bannerid`     | text     | Banner ID        | No               | `126422315640`                         |
| `ad_ca`       | `adi_campaignid`   | text     | Campaign ID      | No               | `d-546135`                             |
| `ad_ad`       | `adi_advertiserid` | text     | Advertiser ID    | No               | `diageo`                               |
| `ad_uid`      | `adi_userid`       | text     | User (viewer) ID | No               | `0cbffbf8-a9c5-426f-9369-6e53f1677efc` |

Note: if possible, it often makes sense to pass in the `user_id` generated by your ad server into the `ad_uid` field, so that this can be matched with the `user_id` generated by Snowplow at analysis time.

Example:

```text
duid=aeb1691c5a0ee5a6   // Domain user ID  
&vid=2                  // Domain session ID
&tid=508780             // Transaction ID  
&aid=1                  // App ID

&e=ad                    // event = ad impression
&ad_ba=126422315640      // banner ID
&ad_ca=d-546135          // campaign ID
&ad_ad=diageo            // advertiser ID
&ad_uid=0cbffbf8-a9c5-426f-9369-6e53f1677efc      // user ID
```

#### Ecommerce tracking

To track an ecommerce transaction, fire a `transaction` event (`e=tr`) to register the transaction, and then fire `item` events (`e=ti`) to log specific data about the items that were part of that transaction. The `order_id`, (captured using the `ti` parameter) is used to link the transaction-level and item-level data at analysis time.

##### Transaction parameters

| **Parameter** | **Maps to**      | **Type** | **Description**                                     | **Implemented?** | **Example values** |
|---------------|------------------|----------|-----------------------------------------------------|------------------|--------------------|
| `tr_id`       | `tr_orderid`     | text     | Order ID                                            | Yes              | `12345`            |
| `tr_af`       | `tr_affiliation` | text     | Transaction affiliation (e.g. channel)              | Yes              | `Web`              |
| `tr_tt`       | `tr_total`       | decimal  | Transaction total value                             | Yes              | `9.99`             |
| `tr_tx`       | `tr_tax`         | decimal  | Transaction tax value (i.e. amount of VAT included) | Yes              | `1.98`             |
| `tr_sh`       | `tr_shipping`    | decimal  | Delivery cost charged                               | Yes              | `3.00`             |
| `tr_ci`       | `tr_city`        | text     | Delivery address: city                              | Yes              | `London`           |
| `tr_st`       | `tr_state`       | text     | Delivery address: state                             | Yes              | `Denver`           |
| `tr_co`       | `tr_country`     | text     | Delivery address: country                           | Yes              | `United Kingdom`   |
| `tr_cu`       | `tr_currency`    | text     | Transaction Currency                                | Yes              | `GBP`              |

Transaction event example:

```text
duid=aeb1691c5a0ee5a6   // Domain user ID  
&vid=2                  // Domain session index
&aid=1                  // App ID

&e=tr            	// Transacton event type.
&tr_id=12345        // Order ID
&tr_af=westernWear 	// Affiliation
&tr_tt=19.99 		// Transaction total value
&tr_tx=4.99 		// Transaction tax value
&tr_sh=2.99 		// Transaction shipping price
&tr_ci=london		// City on customer address
&tr_st=london 		// State on customer address
&tr_co=united kingdom	// Country on customer address
&tr_cu= GBP    // Transaction currency
```

##### Transaction item parameters

| **Parameter** | **Maps to**  | **Type** | **Description** | **Implemented?** | **Example values** |
|---------------|--------------|----------|-----------------|------------------|--------------------|
| `ti_id`       | `ti_orderid` | text     | Order ID        | Yes              | `12345`            |
| `ti_sk` | `ti_sku` | text | Item SKU | Yes | \`pbz0025' |
| `ti_nm` | `ti_name` | text | Item name | Yes | `black-tarot` |
| `ti_ca` | `ti_category` | text | Item category | Yes | `tarot` |
| `ti_pr` | `ti_price` | decimal | Item price | Yes | `7.99` |
| `ti_qu` | `ti_quantity` | integer | Item quantity | Yes | `2` |
| `ti_cu` | `ti_currency` | text | Currency | Yes | `USD` |

Item hit example:

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=ti 				// Transaction item event type
&ti_id=12345 		// Order ID
&ti_sk=pbz0025 		// Item SKU
&ti_nm=black-tarot 	// Item name
&ti_ca=tarot 		// Item category
&ti_pr=7.99 		// Item price
&ti_qu=1 			// Item quantity
&ti_cu=USD      // Currency
```

#### Social tracking

| **Parameter** | **Maps to**       | **Description**                                             | **Implemented?** | **Example values**    |
|---------------|-------------------|-------------------------------------------------------------|------------------|-----------------------|
| `sa`          | `social_action`   | Social action performed                                     | No               | `like`, `tweet`       |
| `sn`          | `social_network`  | Social network involved                                     | No               | `facebook`, `twitter` |
| `st`          | `social_target`   | Social action target e.g. object _liked_, article _tweeted_ | No               | `like`, `tweet`       |
| `sp`          | `social_pagepath` | Page path action was performed on                           | No               |                       |

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=s            // Social event type
&sa=like        // Social Action
&sn=facebook    // Social Network
&st=/home       // Social Target
```

#### Custom structured event tracking

Custom event tracking is used to track events that are not natively supported by Snowplow. (Like ad impressions, page views, ecomm transactions.)

As well as setting `e=se`, there are five custom event specific parameters that can be set:

| **Parameter** | **Maps to**   | **Type** | **Description**                                                        | **Implemented?** | **Example values**            |
|---------------|---------------|----------|------------------------------------------------------------------------|------------------|-------------------------------|
| `se_ca`       | `se_category` | text     | The category of event                                                  | Yes              | `Ecomm`, `Media`              |
| `se_ac`       | `se_action`   | text     | The action / event itself                                              | Yes              | `add-to-basket`, `play-video` |
| `se_la`       | `se_label`    | text     | A label often used to refer to the 'object' the action is performed on | Yes              | `dog-skateboarding-video`     |
| `se_pr`       | `se_property` | text     | A property associated with either the action or the object             | Yes              | `hd`                          |
| `se_va`       | `se_value`    | decimal  | A value associated with the user action                                | Yes              | `13.99`                       |

_Add-to-basket_ example:

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=se                    // event = custom  
&se_ca=ecomm            // event_category = ecomm  
&se_ac=add-to-basket    // event_action = add-to-basket  
&se_la=178              // event_label = 178 (product_id of item added to basket)  
&se_pr=1                // event_property = 1 (quantity of item added to basket)  
&se_va=14.99            // event_value = 14.99 (price of item added to basket)  
```

_Watch-video-clip_ example:

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=se                    // event = custom  
&se_ca=video            // event_category = video  
&se_ac=play             // event_action = play  
&se_la=291              // event_label = 291 (video_id of video played)  
&se_pr=13.2             // event_property = 13.2 (number of seconds into video that clip starts playing)  
&se_va=0.0025           // event_value = 0.0025 (ad revenue associated with view)  
```

#### Custom unstructured event tracking

Custom unstructured event tracking is used to track events that are not natively supported by Snowplow and allow arbitrary name: value pairs associated with the event.

An example of an unstructured event for a product view event:

```json
{
  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
  "data": {
    "product_id": "ASO01043",
    "price": 49.95
  }
}
```

The tracker will wrap this [self-describing JSON](https://github.com/snowplow/iglu/wiki/Self-describing-JSONs) in an outer self-describing JSON, which is what gets sent:

```json
{

  // Tells Snowplow this is an unstructured event
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

| **Parameter** | **Maps to**      | **Type**                       | **Description**             | **Implemented?** | **Example values**                                             |
|---------------|------------------|--------------------------------|-----------------------------|------------------|----------------------------------------------------------------|
| `ue_pr`       | `unstruct_event` | JSON                           | The properties of the event | Yes              | `{ "product_id": "ASO01043", "price": 49.95 }`                 |
| `ue_px`       | `unstruct_event` | JSON (URL-safe Base64 encoded) | The properties of the event | Yes              | `eyAicHJvZHVjdF9pZCI6ICJBU08wMTA0MyIsICJwcmljZSI6IDQ5Ljk1IH0=` |

The tracker can decide to pass the `ue_pr` or the `ue_px` parameter depending on configuration. Encoding properties into URL-safe Base64 allows for more data while sacrificing readability.

_viewed_product_ example (using percent encoding and the key `ue_pr`):

```text
uid=aeb1691c5a0ee5a6   // User ID  
&vid=2                 // Visit ID (i.e. session number for this user_id)  
&tid=508780            // Transaction ID  
&aid=1                 // App ID
&tv=js-0.13.1          // Tracker version

&e=ue                  // event = unstructured  
&ue_pr="%7B%22schema%22%3A%22iglu%3Acom.snowplowanalytics.snowplow%2Funstruct_event%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22schema%22%3A%22iglu%3Acom.my_company%2Fviewed_product%2Fjsonschema%2F1-0-0%22%2C%22data%22%3A%7B%22product_id%22%3A%22ASO01043%22%2C%22price%22%3A49.95%7D%7D%7D"
                       // event_properties =  {
                                                "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
                                                "data": {
                                                  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
                                                  "data": {
                                                    "product_id": "ASO01043",
                                                    "price": 49.95
                                                  }
                                                }
                                              }
```

_viewed_product_ example (using base 64 encoding and the key `ue_px`):

```text
uid=aeb1691c5a0ee5a6   // User ID  
&vid=2                 // Visit ID (i.e. session number for this user_id)  
&tid=508780            // Transaction ID  
&aid=1                 // App ID
&tv=js-0.13.1          // Tracker version

&e=ue                  // event = unstructured  
&ue_px=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy91bnN0cnVjdF9ldmVudC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJzY2hlbWEiOiJpZ2x1OmNvbS5teV9jb21wYW55L3ZpZXdlZF9wcm9kdWN0L2pzb25zY2hlbWEvMS0wLTAiLCJkYXRhIjp7InByb2R1Y3RfaWQiOiJBU08wMTA0MyIsInByaWNlIjo0OS45NX19fQ==
                       // event_properties = {
                                                "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
                                                "data": {
                                                  "schema": "iglu:com.my_company/viewed_product/jsonschema/1-0-0",
                                                  "data": {
                                                    "product_id": "ASO01043",
                                                    "price": 49.95
                                                  }
                                                }
                                              }
```

#### Custom contexts

Custom contexts can be used to attach additional data in the form of a JSON to any Snowplow event.

Each individual custom context is a [self-describing JSON](/docs/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/index.md) such as:

```json
{
  "schema": "iglu:com.my_company/user/jsonschema/1-0-0",
  "data": {
    "fb_uid": "9999xyz"
  }
}
```

All custom contexts to be attached to an event will be wrapped in an array by the user and passed to the tracker, which will wrap them in a self-describing JSON:

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

The tracker can be configured to encode the context into URL-safe Base64 to ensure that no data is lost or corrupted. The downside is that the data will be bigger and less readable. Otherwise the data will be percent-encoded.

| **Parameter** | **Maps to**                   | **Type**                       | **Description**                | **Implemented?** | **Example values**                                                                                                                                                                                                                                                                                             |
|---------------|-------------------------------|--------------------------------|--------------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cv`          | `context_vendor` (deprecated) | String                         | Vendor for the custom contexts | deprecated       | `com.acme`                                                                                                                                                                                                                                                                                                     |
| `co`          | `context`                     | JSON                           | An array of custom contexts    | Yes              | `%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D`                                                                                       |
| `cx`          | `context`                     | JSON (URL-safe Base64 encoded) | An array of custom contexts    | Yes              | `ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==` |

Example of a custom context attached to the _watch-video-clip_ structured event from above using percent encoding and the key `co`:

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=se                   // event = custom  
&se_ca=ecomm            // event_category = ecomm  
&se_ac=add-to-basket    // event_action = add-to-basket  
&se_la=178              // event_label = 178 (product_id of item added to basket)  
&se_pr=1                // event_property = 1 (quantity of item added to basket)  
&se_va=14.99            // event_value = 14.99 (price of item added to basket)  

&co=%7B%22schema%22:%22iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0%22,%22data%22:%5B%7B%22schema%22:%22iglu:com.my_company/user/jsonschema/1-0-0%22,%22data%22:%7B%22fb_uid%22:%229999xyz%22%7D%7D%5D%7D
                        // context =  {
                                        schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0'
                                        data: [
                                          {
                                            schema: 'iglu:com.my_company/user/jsonschema/1-0-0',
                                            data: {
                                              fb_uid: '9999xyz'
                                            }
                                          }
                                        ]}
                                      }
```

Example of a custom context attached to the _watch-video-clip_ structured event from above using URL-safe Base64 encoding and the key `cx`:

```text
uid=aeb1691c5a0ee5a6    // User ID  
&vid=2                  // Visit ID (i.e. session number for this user_id)  
&tid=508780             // Transaction ID  
&aid=1                  // App ID
&tv=js-0.5.2            // Tracker version

&e=se                   // event = custom  
&se_ca=ecomm            // event_category = ecomm  
&se_ac=add-to-basket    // event_action = add-to-basket  
&se_la=178              // event_label = 178 (product_id of item added to basket)  
&se_pr=1                // event_property = 1 (quantity of item added to basket)  
&se_va=14.99            // event_value = 14.99 (price of item added to basket)  

&cx=ew0KICBzY2hlbWE6ICdpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wJyANCiAgZGF0YToge1sNCiAgICB7DQogICAgICBzY2hlbWE6ICdpZ2x1OmNvbS5teV9jb21wYW55L3VzZXIvanNvbnNjaGVtYS8xLTAtMCcgDQogICAgICBkYXRhOiB7DQogICAgICAgIGZiX3VpZDogJzk5OTl4eXonDQogICAgICB9DQogICAgfQ0KICBdfQ0KfQ==
                        // context =  {
                                        schema: 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0'
                                        data: [
                                          {
                                            schema: 'iglu:com.my_company/user/jsonschema/1-0-0',
                                            data: {
                                              fb_uid: '9999xyz'
                                            }
                                          }
                                        ]}
                                      }
```

#### Reserved parameters

`u` is a reserved parameter because it is used for click tracking / URI redirects in the Pixel Tracker.
