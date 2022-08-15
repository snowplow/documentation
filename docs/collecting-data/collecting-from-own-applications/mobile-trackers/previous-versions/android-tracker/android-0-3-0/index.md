---
title: "Android (0.3.0)"
date: "2020-03-02"
sidebar_position: 980
---

This page refers to version 0.3.0 of the Snowplow Android Tracker.

**Please note** that this version of the Android Tracker is dependent upon the [Snowplow 0.9.14 release](https://github.com/snowplow/snowplow/releases/tag/0.9.14), you will need to be running this version or higher of Snowplow for events sent by the tracker to be successfully processed. Snowplow 0.9.14+ contains updates to the Hadoop Enrich and Scala Hadoop Shred jobs to allow newer self-describing JSON versions, as sent by Android Tracker 0.3.0. For more information, please refer to tickets [#1220](https://github.com/snowplow/snowplow/issues/1220) and [#1231](https://github.com/snowplow/snowplow/issues/1231).

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#1-overview)1\. Overview

The [Snowplow Android Tracker](https://github.com/snowplow/snowplow-android-tracker) allows you to track Snowplow events from your Android applications and games. It supports applications using the Android SDK 11 and above.

The tracker should be straightforward to use if you are comfortable with Java development; its API is modelled after Snowplow's [Python Tracker](https://github.com/snowplow/snowplow/wiki/Python-Tracker) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [Android Tracker Setup](https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup) guide before continuing.

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#2-initialization)2 Initialization

Assuming you have completed the [Android Tracker Setup](https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup) for your project, you are now ready to initialize the Android Tracker.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#21-importing-the-module)2.1 Importing the module

Import the Android Tracker's classes into your Android code like so:

```
import com.snowplowanalytics.snowplow.tracker.*;
```

That's it - you are now ready to initialize a Tracker instance.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#22-creating-a-tracker)2.2 Creating a Tracker

To instantiate a tracker in your code (can be global or local to the process being tracked) simply instantiate the `Tracker` interface with one of the following:

```
// Create an Emitter
Emitter e1 = new Emitter
        .EmitterBuilder("com.collector.acme", getContext())
        .build();

// Make and return the Tracker object
Tracker t1 = new Tracker
        .TrackerBuilder(e1, "myNamespace", "myAppId")
        .build();
```

This is the most basic Tracker creation possible. Note that `getContext()` is an Android global function. You can expand on this creation with the following builder options:

```
// Create an Emitter
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", getContext())
        .build();

// Create a Tracker with all options
Tracker t2 = new Tracker
        .TrackerBuilder(e2, "myNamespace", "myAppId")
        .base64(false) // Optional - defines if we use base64 encoding
        .platform(DevicePlatforms.Mobile) // Optional - defines what platform the event will report to be on
        .subject(new Subject()) // Optional - a subject which contains values appended to every event
        .build();
```

As you can see there is a fair amount of modularity to the Trackers creation.

The below are required arguments for the 'TrackerBuilder({{ ... }})' segment of the constructor:

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `emitter` | The emitter which sends the events | Yes |
| `namespace` | The name of the tracker instance | Yes |
| `appId` | The application ID | Yes |

We also have several extra builder options:

| **Function** | **Description** | **Options** | **Default** |
| --- | --- | --- | --- |
| `subject` | The subject that defines a user | `Subject, null` | `null` |
| `platform` | The platform that the Tracker is running on | `DevicePlatforms.{{ Enum Option }}` | `DevicePlatforms.Mobile` |
| `base64` | Whether to enable [Base64 encoding](https://en.wikipedia.org/wiki/Base64) | `True, False` | `True` |

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#231-emitter)2.3.1 `emitter`

The emitter to which the tracker will send events. See [Emitters](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#emitter) for more on emitter configuration.

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#232-subject)2.3.2 `subject`

The user which the Tracker will track. This should be an instance of the [Subject](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#subject) class. You don't need to set this during Tracker construction; you can use the `Tracker.setSubject` method afterwards. In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#233-namespace)2.3.3 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#234-appid)2.3.4 `appId`

The `appId` argument lets you set the application ID to any string.

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#235-base64)2.3.5 `base64`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

##### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#236-platform)2.3.6 `platform`

The 'platform' allows you to pick from a list of allowed platforms which define what type of device/service the event is being sent from.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#237-change-the-trackers-platform-with-setplatform)2.3.7 Change the tracker's platform with `setPlatform`

You can change the platform by calling:

```
tracker.setPlatform(DevicePlatforms.Mobile);
// OR
tracker.setPlatform(DevicePlatforms.Desktop);
// OR
tracker.setPlatform(DevicePlatforms.{{ Valid Enum Option }})
```

There are several different DevicePlatforms options to choose from.

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](https://github.com/snowplow/snowplow/wiki/Snowplow-Tracker-Protocol).

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#238-change-the-trackers-subject-with-setsubject)2.3.8 Change the tracker's subject with `setSubject`

You can change the subject by creating a new `Subject` object and then calling:

```
tracker.setSubject(newSubject);
```

See [Adding extra data: the Subject class](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#add-data-subject) for more information on the `Subject`.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#239-change-the-trackers-emitter-with-setemitter)2.3.9 Change the tracker's emitter with `setEmitter`

You can change the emitter by creating a new `Emitter` object and then calling:

```
tracker.setEmitter(newEmitter);
```

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#3-adding-extra-data-the-subject-class)3\. Adding extra data: the Subject class

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event. The Subject appended to the Tracker allows you to easily add information to each event that is sent from the Tracker.

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#31-subject-setter-functions)3.1 Subject setter functions

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- [`setUserId`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-user-id)
- [`setScreenResolution`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-screen-resolution)
- [`setViewport`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-viewport-dimensions)
- [`setColorDepth`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-color-depth)
- [`setTimezone`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-timezone)
- [`setLanguage`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-lang)
- [`setIpAddress`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-ip-address)
- [`setUseragent`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-user-agent)
- [`setNetworkUserId`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-network-user-id)
- [`setDomainUserId`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#set-domain-user-id)

Here are some examples:

```
Subject s1 = new Subject();

s1.setUserID("Kevin Gleason");
s1.setLanguage("en-gb");
s1.setScreenResolution(1920, 1080);
```

After that, you can add your Subject to your Tracker like so:

```
Tracker t1 = new Tracker
        .TrackerBuilder(emitter, "myNamespace", "myAppId")
        .subject(s1) // Include your subject here!
        .build();

// Or you can set the subject after creation
// This will also override any currently set Subject object

t1.setSubject(s1);
```

To update the Trackers subject without changing the subject attached already you can use the following:

```
t1.getSubject().setUserId("Gleason Kevin"); // Because object references are passed by value in Java
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#311-set-user-id-with-setuserid)3.1.1 Set user ID with `setUserId`

You can set the user ID to any string:

```
setUserId(String userId)
```

Example:

```
subj.setUserId("alexd");
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#312-set-screen-resolution-with-setscreenresolution)3.1.2 Set screen resolution with `setScreenResolution`

If your Java code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```
setScreenResolution(int width, int height)
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
subj.setScreenResolution(1366, 768);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#313-set-viewport-dimensions-with-setviewport)3.1.3 Set viewport dimensions with `setViewport`

If your Java code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```
setViewport(int width, int height)
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
subj.setViewport(300, 200);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#314-set-color-depth-with-setcolordepth)3.1.4 Set color depth with `setColorDepth`

If your Java code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```
setColorDepth(int depth)
```

The number should be a positive integer, measured in bits per pixel. Example:

```
subj.setColorDepth(32);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#315-set-timezone-with-settimezone)3.1.5 Set timezone with `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```
setTimezone(String timezone)
```

The timezone should be a string:

```
subj.setTimezone("Europe/London");
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#316-set-the-language-with-setlanguage)3.1.6 Set the language with `setLanguage`

This method lets you pass a user's language in to Snowplow:

```
setLanguage(String language)
```

The language should be a string:

```
subj.setLanguage("en");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#317-setipaddress)3.1.7 `setIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```
setIpAddress(String ipAddress)
```

The IP address should be a string:

```
subj.setIpAddress("127.0.0.1");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#318-setuseragent)3.1.8 `setUseragent`

This method lets you pass a useragent in to Snowplow:

```
setUseragent(String useragent)
```

The useragent should be a string:

```
subj.setUseragent("Agent Smith");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#319-setnetworkuserid)3.1.9 `setNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```
setNetworkUserId(String networkUserId)
```

The network user id should be a string:

```
subj.setNetworkUserId("network-id");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#3110-setdomainuserid)3.1.10 `setDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```
setDomainUserId(String domainUserId)
```

The domain user id should be a string:

```
subj.setDomainUserId("domain-id");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#32-additional-contexts-sent-by-this-tracker)3.2 Additional contexts sent by this tracker

This Tracker not only appends the [generic](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#subject-setters) subject information to each event; it will also attempt to gather more specific information about the mobile it is hosted on.

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#321-mobile_context)3.2.1 `mobile_context`

The `mobile_context` is comprised of the following fields:

- `androidIdfa` -> The host phones unique AdvertisingId
- `carrier` -> The host phones phones network carrier
- `deviceModel` -> The host phones phones model
- `deviceManufacturer` -> The host phones phones manufacturer
- `osVersion` -> The host phones phones operating system version
- `osType` -> The host phones phones operating system type

To ensure you gather all of this information you will need to create your Subject with the following argument:

```
Subject subject = new Subject(getContext());
```

Note that `getContext()` is an Android global function. It is needed to grab information that is related to the client specifically.

### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#322-geolocation_context)3.2.2 `geolocation_context`

The `geolocation_context` is comprised of the following fields:

- `latitude` -> The host phones latitude measure
- `longitude` -> The host phones longitude measure
- `altitude` -> The host phones altitude measure
- `latitudeLongitudeAccuracy` -> The host phones position accuracy
- `speed` -> The host phones speed
- `bearing` -> The host phones current bearing

To ensure you gather all of this information you will need to create your Subject with the following argument:

```
Subject subject = new Subject(getContext());
```

Note that `getContext()` is an Android global function.

You will also need to include the following in your `AndroidManifest.xml` file:

```
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

This will make the functions for checking these metrics available for the tracker to use.

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#4-tracking-specific-events)4\. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the Android Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView()`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#screen-view) | Track the user viewing a screen within the application |
| [`trackPageView()`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#page-view) | Track and record views of web pages. |
| [`trackEcommerceTransaction()`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent()`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#struct-event) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent()`](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#unstruct-event) | Track a Snowplow custom unstructured event |

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#41-common)4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#411-selfdescribingjson)4.1.1 SelfDescribingJson

A `SelfDescribingJson` is used as a wrapper around either a `TrackerPayload`, another `SelfDescribingJson` or a `Map` object. After creating the object you want to wrap, you can create a `SelfDescribingJson` using the following:

```
// This is the Map we have created
Map<String, String> eventData = new HashMap<>();
eventData.put("Event", "Data")

// We wrap that map in a SelfDescribingJson before sending it
SelfDescribingJson json = new SelfDescribingJson("iglu:com.acme/example/jsonschema/1-0-0", eventData);
```

You can create a SelfDescribingJson with the following arguments:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `schema` | JsonSchema that describes the data | Yes | `String` |
| `data` | Data that will be validated by the schema | No | `Map<String, String>, Map<String, Object>, TrackerPayload, SelfDescribingJson` |

`SelfDescribingJson` is used for recording [custom contexts](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#custom-contexts) and [unstructured events](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#unstruct-event).

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#412-custom-contexts)4.1.2 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of a Map object. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```
t1.trackPageView(String pageUrl, String pageTitle, String referrer);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, List<SelfDescribingJson> context);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, double timestamp);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, List<SelfDescribingJson> context, double timestamp);
```

The `context` argument should consist of a `List` of `SelfDescribingJson` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2.1.1",
  "data": {
    "movie_name": "Solaris",
    "poster_country": "JP",
    "poster_year": "1978"
  }
}
```

To construct this as a `SelfDescribingJson`:

```
// Create a Map of the data you want to include...
Map<String, String> dataMap = new HashMap<>();
dataMap.put("movie_name", "solaris");
dataMap.put("poster_country", "JP");
dataMap.put("poster_year", "1978");

// Now create your SelfDescribingJson object...
SelfDescribingJson context1 = new SelfDescribingJson("iglu:com.acme/movie_poster/jsonschema/2.1.1", dataMap);

// Now add this JSON into a list of SelfDescribingJsons...
List<SelfDescribingJson> contexts = new ArrayList<>();
contexts.add(context1);
```

Note that even if there is only one custom context attached to the event, it still needs to be placed in an array.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#413-timestamp-override)4.1.3 Timestamp override

In all the trackers, we offer a way to override the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here are some example:

```
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com");
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", contexts);
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", contexts, 1423583655000);
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", 1423583655000);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#42-track-screen-views-with-trackscreenview)4.2 Track screen views with `trackScreenView()`

Use `trackScreenView()` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | `String` |
| `id` | Unique identifier for this screen | No | `String` |
| `context` | Custom context for the event | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

Examples:

```
t1.trackScreenView("HUD > Save Game", "screen23");
t1.trackScreenView("HUD > Save Game", contextList, 1423583655000);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#43-track-pageviews-with-trackpageview)4.3 Track pageviews with `trackPageView()`

You can use `trackPageView()` to track a user viewing a web page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `page_url` | The URL of the page | Yes | `String` |
| `page_title` | The title of the page | Yes | `String` |
| `referrer` | The address which linked to the page | Yes | `String` |
| `context` | Custom context for the event | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

Examples:

```
t1.trackPageView("www.example.com", "example", "www.referrer.com", contextList);
t1.trackPageView("www.example.com", "example", "www.referrer.com");
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#44-track-ecommerce-transactions-with-trackecommercetransaction)4.4 Track ecommerce transactions with `trackEcommerceTransaction()`

Use `trackEcommerceTransaction()` to track an ecommerce transaction.

Arguments:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `order_id` | ID of the eCommerce transaction | Yes | `String` |
| `total_value` | Total transaction value | Yes | `Double` |
| `affiliation` | Transaction affiliation | Yes | `String` |
| `tax_value` | Transaction tax value | Yes | `Double` |
| `shipping` | Delivery cost charged | Yes | `Double` |
| `city` | Delivery address city | Yes | `String` |
| `state` | Delivery address state | Yes | `String` |
| `country` | Delivery address country | Yes | `String` |
| `currency` | Transaction currency | Yes | `String` |
| `items` | Items in the transaction | Yes | `List<TransactionItem>` |
| `context` | Custom context for the event | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

The `items` argument is a `List` of individual `TransactionItem` elements representing the items in the e-commerce transaction. Note that `trackEcommerceTransaction` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`. Each transaction item event will have the same timestamp, order\_id, and currency as the main transaction event.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#441-transactionitem)4.4.1 `TransactionItem`

To instantiate a `TransactionItem` in your code, simply use the following constructor signature:

```
TransactionItem item = new TransactionItem("item_id", "item_sku", 1.00, 1, "item_name", "item_category", "currency", custom_contexts, 1424080355000);
```

These are the fields that can appear as elements in each `TransactionItem` element of the transaction item's `List`:

| **Field** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `item_id` | Item ID | Yes | `String` |
| `sku` | Item SKU | No | `String` |
| `price` | Item price | No | `double` |
| `quantity` | Item quantity | No | `int` |
| `name` | Item name | No | `String` |
| `category` | Item category | No | `String` |
| `currency` | Item currency | No | `String` |
| `context` | Item context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

Example of tracking a transaction containing two items:

```
// Create some Transaction Items
TransactionItem item1 = new TransactionItem("item_id_1", "item_sku_1", 1.00, 1, "item_name", "item_category", "currency");
TransactionItem item2 = new TransactionItem("item_id_2", "item_sku_2", 1.00, 1, "item_name", "item_category", "currency");

// Add these items to a List
List<TransactionItem> items = new ArrayList<>();
items.add(item1);
items.add(item2);

// Now Track the Transaction by using this list of items as an argument
t1.trackEcommerceTransaction("6a8078be", 300, "my_affiliate", 30, 10, "Boston", "Massachusetts", "USA", "USD", items);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#45-track-structured-events-with-trackstructuredevent)4.5 Track structured events with `trackStructuredEvent()`

Use `trackStructuredEvent()` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | `String` |
| `action` | Defines the type of user interaction which this event involves | Yes | `String` |
| `label` | A string to provide additional dimensions to the event data | Yes | `String` |
| `property` | A string describing the object or the action performed on it | Yes | `String` |
| `value` | A value to provide numerical data about the event | Yes | `int` |
| `context` | Custom context for the event | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

Examples:

```
t1.trackStructuredEvent("shop", "add-to-basket", "Add To Basket", "pcs", 2);
t1.trackStructuredEvent("shop", "add-to-basket", "Add To Basket", "pcs", 2, 1423653510000);
```

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#46-track-unstructured-events-with-trackunstructuredevent)4.6 Track unstructured events with `trackUnstructuredEvent()`

Custom unstructured events are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `trackUnstructuredEvent()` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `eventData` | The properties of the event | Yes | `SelfDescribingJson` |
| `context` | Custom context for the event | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp for the event | No | `Long` |

Example event json to track:

```
{
  "schema": "iglu:com.acme/save_game/jsonschema/1-0-0",
  "data": {
    "levelName": "Barrels o' Fun",
    "levelIndex": 23
  }
}
```

How to set it up?

```
// Create a Map of your event data
Map<String, Object> eventMap = new HashMap<>();
eventMap.put("levelName", "Barrels o' Fun")
eventMap.put("levelIndex", 23);

// Create your event data
SelfDescribingJson eventData = new SelfDescribingJson("iglu:com.acme/save_game/jsonschema/1-0-0", eventMap);

// Track your event with your custom event data
t1.trackUnstructuredEvent(eventData, contextList);
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#5-sending-event-emitter)5\. Sending event: `Emitter`

Events are sent using an `Emitter` class. You can initialize a class with a collector endpoint URL with various options to choose how these events should be sent. Here are the `Emitter` interfaces that can be used:

```
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .method(HttpMethod.GET) // Optional - Defines how we send the request
        .option(BufferOption.Single) // Optional - Defines how many events we bundle in a POST
        .security(EmitterSecurity.HTTPS) // Optional - Defines what protocol used to send events
        .callback(new EmitterCallback() {...})
        .build();
```

The `Context` is used for caching events in a [SQLite database](http://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html) in order to avoid losing events to network related issues.

Don't confuse the Android context with Snowplow's own custom contexts - they are completely separate things.

The below are required arguments for the 'EmitterBuilder({{ ... }})' segment of the constructor:

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `URI` | The collector endpoint URI events will be sent to | Yes |
| `context` | Used to use to open or create an SQLite database | Yes |

We also have several extra builder options such as:

| **Function** | **Description** | **Options** | **Default** |
| --- | --- | --- | --- |
| `method` | The request method to use | `HttpMethod.GET, .POST` | `HttpMethod.POST` |
| `option` | The amount of events sent in a POST request | `BufferOption.{{ Enum Option}}` | `BufferOption.DefaultGroup` |
| `security` | Whether to send over HTTP or HTTPS | `RequestSecurity.HTTP, .HTTPS` | `RequestSecurity.HTTP` |
| `callback` | A callback to output successes and failures | `new RequestCallback{ ... }` | `null` |

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#51-how-the-emitter-works)5.1 How the Emitter works

The Emitter is configured and setup to run as a background process so it never blocks on the Main Thread or on the UI Thread of the device it is on.

The current Emitter flow goes as follows:

1. Emitter is created
2. Emitter will check if it has access to the internet
3. If it is it will begin a recurring check for events to send to the configured collector
    - This is currently set to be every 5 seconds. (# Constant-1)
4. If there are events in the SQlite database the emitter will grab up to 250 events from the database and begin sending. (# Constant-2)
5. Once it has finished sending it will again check for events
6. If there are no events to be sent 5 times in a row, it will shut itself down (# Constant-3)
7. On receiving a new event the Emitter checks again if it is online and will then begin sending again
8. If there are any errors in sending, the events will not be deleted from the database and the emitter will then be shutdown

All constants can be found in the 'constants/TrackerConstants.java' class with the following names:

- EMITTER\_TICK
- EMITTER\_SEND\_LIMIT
- EMITTER\_EMPTY\_EVENTS\_LIMIT

To alter these values you will need to edit and recompile the Trackers source, pending an upcoming release where this will be configurable when initializing an Emitter object.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#52-using-a-buffer)5.2 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the Emitter buffers up to 10 events together before sending them; only available if you are using POST as your request type.

```
e1.setBufferOption(BufferOption.Single); // 1
// OR
e1.setBufferOption(BufferOption.DefaultGroup); // 10
// OR For heavier event sending...
e1.setBufferOption(BufferOption.HeavyGroup); // 25
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `Single` | Events are sent individually |
| `DefaultGroup` | Sends events in groups of 10 events or less |
| `HeavyGroup` | Sends events in groups of 25 events or less |

Buffer options will only ever influence how POST request are sent however. All GET requests will be sent individually.

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#53-choosing-the-http-method)5.3 Choosing the HTTP method

Snowplow supports receiving events via both GET and POST requests. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

You can set the HTTP method in the Emitter constructor:

```
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context)
        .method(HttpMethod.GET)
        .build();
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `GET` | Sends events as GET requests |
| `POST` | Sends events as POST requests |

#### [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#54-emitter-callback)5.4 Emitter callback

If an event fails to send because of a network issue, you can choose to handle the failure case with a callback class to react accordingly. The callback class needs to implement the `EmitterCallback` interface in order to do so. Here is a sample bit of code to show how it could work:

```
RequestCallback callback = new RequestCallback() {
  @Override
  public void onSuccess(int successCount) {
    Log.d("Tracker", "Buffer length for POST/GET:" + successCount);
  }
  @Override
  public void onFailure(int successCount, int failureCount) {
    Log.d("Tracker", "Failures: " + failureCount + "; Successes: " + successCount);
  }
});

Emitter emitter = new Emitter
        .EmitterBuilder("com.collector.acme", Context context)
        .callback(callback)
        .build();
```

## [](https://github.com/snowplow/snowplow/wiki/Android-Tracker-0.3.0#6-logging)6\. Logging

Logging in the Tracker is done using our own Logger class: '/utils/Logger.java'. All logging is actioned based on whether or not the 'DEBUG\_MODE' constant is set to true in the 'constants/TrackerConstants.java' class.

This class also utilizes the standard Android logging API, removing the prior versions dependency on an extra logging library.

To alter this constant you will need to edit and recompile the Trackers source, pending an upcoming release where this will be configurable when initializing a Tracker object.
