---
title: "Objective-C (iOS) (0.1.0)"
description: "Objective-C tracker version 0.1.0 documentation for iOS behavioral event collection."
schema: "TechArticle"
keywords: ["Objective-C V0.1.0", "iOS Legacy", "Legacy iOS", "Previous Version", "Deprecated iOS", "Old iOS"]
date: "2020-03-02"
sidebar_position: 1000
---

## 1. Overview

The [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-ios-tracker) allows you to track Snowplow events from your iOS apps and games. It supports iOS 7.0+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](/docs/sources/trackers/python-tracker/index.md) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](/docs/sources/trackers/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

## 2. Initialization

Assuming you have completed the [iOS Tracker Setup](/docs/sources/trackers/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) for your project, you are now ready to initialze the Snowplow Tracker.

## 2.1 Importing the library

Adding the library into your project is as simple as adding the headers into your class file:

```objc
#import <SnowplowTracker.h>
#import <SnowplowRequest.h>
```

That's it - you are now ready to initialize a tracker instance.

### 2.2 Creating a tracker

To instantiate a tracker in your code simply instantiate the `SnowplowTracker` class with the constructor:

```objc
- (id) initWithCollector:(SnowplowRequest *)collector_
                   appId:(NSString *)appId_
           base64Encoded:(Boolean)encoded
               namespace:(NSString *)namespace_
```

For example:

```objc
SnowplowTracker *t1 = [[SnowplowTracker alloc] initWithCollector:collector appId:@"AF003" base64Encoded:false namespace:@"cloudfront"];
```

| **Argument Name** | **Description** |
| --- | --- |
| `collector` | The SnowplowRequest object you create |
| `namespace` | The name of the tracker instance |
| `appId` | The application ID |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) |

#### 2.2.1 `collector`

This is a single `SnowplowRequest` object that will be used to send all the tracking events created by the `SnowplowTracker` to a collector. See [Sending events](#5-sending-eventssnowplowrequest) for more on its configuration.

#### 2.2.2 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### 2.2.3 `appId`

The `appId` argument lets you set the application ID to any string.

#### 2.2.4 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

## 3. Adding extra data

The iOS Tracker automatically collects your platform, screen resolution, viewport, color depth, timezone and language from the device.

You can set additional information using the following methods:

- [`setUserId`](#31-set-user-id-withsetuserid)

### 3.1 Set user ID with `setUserId`

You can track a given user of your app by setting their user IDt to any string:

You can set the user ID :

```objc
s1.setUserId( "{{USER ID}}" )
```

Example:

```objc
[tracker setUserId:@"alexd"];
```

## 4. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the iOS Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView:`](#42-track-screen-views-withtrackscreenview) | Track the user viewing a screen within the application |
| [`trackPageView:`](#43-track-pageviews-withtrackpageview) | Track and record views of web pages. |
| [`trackEcommerceTransaction:`](#44-track-ecommerce-transactions-withtrackecommercetransaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](#45-track-structured-events-withtrackstructuredevent) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](#46-track-unstructured-events-withtrackunstructuredevent) | Track a Snowplow custom unstructured event |

### 4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

### 4.1.1 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of an NSDictionary object. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```objc
- (void) trackPageView:(NSString *)pageUrl
                 title:(NSString *)pageTitle
              referrer:(NSString *)referrer;
- (void) trackPageView:(NSString *)pageUrl
                 title:(NSString *)pageTitle
              referrer:(NSString *)referrer
               context:(NSMutableArray *)context;
- (void) trackPageView:(NSString *)pageUrl
                 title:(NSString *)pageTitle
              referrer:(NSString *)referrer
             timestamp:(double)timestamp;
- (void) trackPageView:(NSString *)pageUrl
                 title:(NSString *)pageTitle
              referrer:(NSString *)referrer
               context:(NSMutableArray *)context
             timestamp:(double)timestamp;
```

The `context` argument should consist of a `NSArray` of `NSDictionary` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](#46-track-unstructured-events-withtrackunstructuredevent).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```json
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2.1.1",
  "data": {
    "movie_name": "The Guns of Navarone",
    "poster_country": "US",
    "poster_year": "1961"
  }
}
```

_Note that even if there is only one custom context attached to the event, it still needs to be placed in an array._

### 4.1.2 Optional timestamp & context argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```objc
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com"];
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray];
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" timestamp:1234567890];
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray timestamp:1234567890];
```

### 4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### 4.2 Track screen views with `trackScreenView:`

Use `trackScreenView:` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | NSString\* |
| `id_` | Unique identifier for this screen | No | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23"];
[t1 trackScreenView:@"HUD > Save Game" screen:nil timestamp:12435678];
[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23" timestamp:12435678];
```

### 4.3 Track pageviews with `trackPageView:`

Use `trackPageView:` to track a user viewing a page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `pageUrl` | The URL of the page | Yes | NSString\* |
| `pageTitle` | The title of the page | Yes | NSString\* |
| `referrer` | The address which linked to the page | Yes | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com" context:contextList];
[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com"];
```

### 4.4 Track ecommerce transactions with `trackEcommerceTransaction:`

Use `trackEcommerceTransaction:` to track an ecommerce transaction. Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `orderId` | ID of the eCommerce transaction | Yes | NSString\* |
| `totalValue` | Total transaction value | Yes | float |
| `affiliation` | Transaction affiliation | No | NSString\* |
| `taxValue` | Transaction tax value | No | float |
| `shipping` | Delivery cost charged | No | float |
| `city` | Delivery address city | No | NSString\* |
| `state` | Delivery address state | No | NSString\* |
| `country` | Delivery address country | No | NSString\* |
| \`currency | Transaction currency | No | NSString\* |
| `items` | Items in the transaction | Yes | NSMutableArray\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `tstamp` | When the transaction event occurred | No | double |

The `items` argument is an `NSArray` of `SnowplowPayload*` representing dictionaries of the items in the transaction created using `trackEcommerceTransactionItem:`. `trackEcommerceTransaction:` fires multiple events: one "transaction" event for the transaction as a whole, and one "transaction item" event for each element of the `items` array. Each transaction item event will have the same timestamp, orderId, and currency as the main transaction event.

These are the fields that can appear in a transaction item dictionary:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `"sku"` | Item SKU | Yes | NSString\* |
| `"price"` | Item price | Yes | float |
| `"quantity"` | Item quantity | Yes | float |
| `"name"` | Item name | No | NSString\* |
| `"category"` | Item category | No | NSString\* |
| `"context"` | Custom context for the event | No | NSMutableArray\* |

Example of tracking a transaction containing two items:

```objc
NSMutableArray *itemArray = [NSMutableArray array];
[itemArray addObject:[t trackEcommerceTransaction:@"6a8078be" sku:@"pbz0026" name:"Hot Chocolate" category:@"Drink" price:50 quantity:1 currency:@"USD"]];
[t trackEcommerceTransaction:@"6a8078be" totalValue:350 affiliation:@"no_affiliate" taxValue:10 shipping:15 city:@"Boston" state:@"Massachusetts" country:@"USA" items=itemArray];
```

### 4.5 Track structured events with `trackStructuredEvent:`

Use `trackStructuredEvent:` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | NSString\* |
| `action` | Defines the type of user interaction which this event involves | Yes | NSString\* |
| `label` | A string to provide additional dimensions to the event data | Yes | NSString\* |
| `property` | A string describing the object or the action performed on it | Yes | NSString\* |
| `value` | A value to provide numerical data about the event | Yes | int |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27];
[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27 timestamp:1234569];
```

### 4.6 Track unstructured events with `trackUnstructuredEvent:`

Custom unstructured events are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `trackUnstructuredEvent:` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `eventJson` | The properties of the event | Yes | NSDictionary\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
- (void) trackUnstructuredEvent:(NSDictionary *)eventJson
                        context:(NSMutableArray *)context
                      timestamp:(double)timestamp;
```

If you supply a `NSDictionary*`, make sure that this top-level contains your `schema` and `data` keys, and then store your `data` properties as a child `NSDictionary*`.

Example:

```objc
NSDictionary* eventJson = [NSDictionary dictionaryWithObjectsAndKeys:
                            "iglu:com.snowplowanalytics.snowplow/example/jsonschema/1-0-0", "schema",
                            "data", "{\"src\": \"Images\/Sun.png\", \"name\": \"sun1\", \"hOffset\": 250, \"vOffset\": 250, \"alignment\": \"center\"}"];
tracker trackUnstructuredEvent:eventJson
                        context:nil
                      timestamp:12345678;
```

For more on JSON schema, see the [blog post](https://snowplow.io/blog/2014/05/15/introducing-self-describing-jsons/).

## 5. Sending events: `SnowplowRequest`

Events created by the Tracker are sent to a collector using a `SnowplowRequest` instance. You can create one using one of the init methods:

```objc
- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString *)method
             bufferOption:(enum SnowplowBufferOptions)option;
- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString* )method;
```

For example:

```objc
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                            httpMethod:@"GET"];
```

### 5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the SnowplowRequest buffers up to 10 events before sending them.

You can set this during the creation of a `SnowplowRequest` object or using the setter `-(void)setBufferOption:`

```objc
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferDefault];
[emitter setBufferOption:SnowplowBufferInstant];
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `SnowplowBufferInstant` | Events are sent as soon as they are created |
| `SnowplowBufferDefault` | Sends events in a group when 10 events are created |

### 5.2 Choosing the HTTP method

Snowplow supports receiving events via GET requests, but will soon have POST support. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `@"GET"` | Events are sent individually as GET requests |
| `@"POST"` | Events are sent in a group when 10 events are received in one POST request |

### 5.3 Sending HTTP requests

You can set this during the creation of a `SnowplowRequest` object:

```objc
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"GET"
                                                         bufferOption:SnowplowBufferDefault];
```
