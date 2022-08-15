---
title: "Objective-C (iOS) (0.2.0)"
date: "2020-03-02"
sidebar_position: 990
---

## 1\. Overview

The [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-ios-tracker) allows you to track Snowplow events from your iOS apps and games. It supports iOS 7.0+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](https://github.com/snowplow/snowplow/wiki/Python-Tracker) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#2-initialization)2\. Initialization

Assuming you have completed the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) for your project, you are now ready to initialze the Snowplow Tracker.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#21-importing-the-library)2.1 Importing the library

Adding the library into your project is as simple as adding the headers into your class file:

```
#import <SnowplowTracker.h>
#import <SnowplowRequest.h>
```

That's it - you are now ready to initialize a tracker instance.

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#22-creating-a-tracker)2.2 Creating a tracker

To instantiate a tracker in your code simply instantiate the `SnowplowTracker` class with the constructor:

```
- (id) initWithCollector:(SnowplowRequest *)collector_
                   appId:(NSString *)appId_
           base64Encoded:(Boolean)encoded
               namespace:(NSString *)namespace_
```

For example:

```
SnowplowTracker *t1 = [[SnowplowTracker alloc] initWithCollector:collector appId:@"AF003" base64Encoded:false namespace:@"cloudfront"];
```

| **Argument Name** | **Description** |
| --- | --- |
| `collector` | The SnowplowRequest object you create |
| `namespace` | The name of the tracker instance |
| `appId` | The application ID |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) |

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#221-collector)2.2.1 `collector`

This is a single `SnowplowRequest` object that will be used to send all the tracking events created by the `SnowplowTracker` to a collector. See [Sending events](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#emitters) for more on its configuration.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#222-namespace)2.2.2 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#223-appid)2.2.3 `appId`

The `appId` argument lets you set the application ID to any string.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#224-base64encoded)2.2.4 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#3-adding-extra-data)3\. Adding extra data

Unlike the other Trackers, the iOS tracker automatically collects your platform, screen resolution, viewport, color depth, timezone and language from the device. You can still however, set your user ID to properly track different users if you require it.

- [`setUserId`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#set-user-id)
- [Sending IFA](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#sending-ifa)

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#31-set-user-id-with-setuserid)3.1 Set user ID with `setUserId`

You can set the user ID to any string:

```
s1.setUserId( "{{USER ID}}" )
```

Example:

```
[tracker setUserId:@"alexd"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#32-sending-ifa)3.2 Sending IFA

Apps that do not display advertisements are not allowed to access Apple's Identifier For Advertisers (IFA). For this reason, the Snowplow iOS Tracker will only send IFA as part of the `mobile_context` which is attached to each event **if** you have the `AdSupport.framework` included in your app (and are therefore intending to serve ads).

For the avoidance of doubt, you can also avoid sending IFA regardless of your advertising situation, thus:

- Click on **Build Settings** to your app's project in Xcode
- Search for **Preprocessor Macros**
- Add a macro defined as`SNOWPLOW_NO_IFA = 1`

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#4-tracking-specific-events)4\. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the iOS Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#screen-view) | Track the user viewing a screen within the application |
| [`trackPageView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#page-view) | Track and record views of web pages. |
| [`trackEcommerceTransaction:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#struct-event) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#unstruct-event) | Track a Snowplow custom unstructured event |

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#41-common)4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#411-custom-contexts)4.1.1 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of an NSDictionary object. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```
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

The `context` argument should consist of a `NSArray` of `NSDictionary` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
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

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#412-optional-timestamp--context-argument)4.1.2 Optional timestamp & context argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com"];
```

\[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray\]

;

\[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" timestamp:1234567890\]

;

\[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray timestamp:1234567890\]

;

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#413-tracker-method-return-values)4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#42-track-screen-views-with-trackscreenview)4.2 Track screen views with `trackScreenView:`

Use `trackScreenView:` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | NSString\* |
| `id_` | Unique identifier for this screen | No | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```
[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23"];
```

\[t1 trackScreenView:@"HUD > Save Game" screen:nil timestamp:12435678\]

;

\[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23" timestamp:12435678\]

;

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#43-track-pageviews-with-trackpageview)4.3 Track pageviews with `trackPageView:`

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

```
[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com" context:contextList];
```

\[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com"\]

;

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#44-track-ecommerce-transactions-with-trackecommercetransaction)4.4 Track ecommerce transactions with `trackEcommerceTransaction:`

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
| `currency` | Transaction currency | No | NSString\* |
| `items` | Items in the transaction | Yes | NSMutableArray\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `tstamp` | When the transaction event occurred | No | double |

`trackEcommerceTransaction:` fires multiple events: one "transaction" event for the transaction as a whole, and one "transaction item" event for each element of the `items` array. Each transaction item event will have the same timestamp, orderId, and currency as the main transaction event.

The `items` argument is an `NSMutableArray` containing an `NSDictionary` for each item in the transaction. There is a convenience constructor for each item called `trackEcommerceTransactionItem:`. Arguments:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `sku` | Item SKU | Yes | NSString\* |
| `price` | Item price | Yes | float |
| `quantity` | Item quantity | Yes | float |
| `name` | Item name | No | NSString\* |
| `category` | Item category | No | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `currency` | Transaction currency | No | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `tstamp` | When the transaction event occurred | No | double |

Example of tracking a transaction containing one item:

```
NSString *transactionID = @"6a8078be";
NSMutableArray *itemArray = [NSMutableArray array];

[itemArray addObject:[t trackEcommerceTransactionItem:transactionID
                                                  sku:@"pbz0026"
                                                 name:@"Hot Chocolate"
                                             category:@"Drink"
                                                price:0.75F
                                             quantity:1
                                             currency:@"USD"]];
```

\[t trackEcommerceTransaction:transactionID totalValue:350 affiliation:@"no\_affiliate" taxValue:10 shipping:15 city:@"Boston" state:@"Massachusetts" country:@"USA" currency:@"USD" items:itemArray\]

;

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#45-track-structured-events-with-trackstructuredevent)4.5 Track structured events with `trackStructuredEvent:`

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

```
[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27];
```

\[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27 timestamp:1234569\]

;

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#46-track-unstructured-events-with-trackunstructuredevent)4.6 Track unstructured events with `trackUnstructuredEvent:`

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

```
- (void) trackUnstructuredEvent:(NSDictionary *)eventJson
                        context:(NSMutableArray *)context
                      timestamp:(double)timestamp;
```

If you supply a `NSDictionary*`, make sure that this top-level contains your `schema` and `data` keys, and then store your `data` properties as a child `NSDictionary*`.

Example:

```
NSDictionary* eventJson = [NSDictionary dictionaryWithObjectsAndKeys:
                            "iglu:com.snowplowanalytics.snowplow/example/jsonschema/1-0-0", "schema",
                            "data", "{\"src\": \"Images\/Sun.png\", \"name\": \"sun1\", \"hOffset\": 250, \"vOffset\": 250, \"alignment\": \"center\"}"];
tracker trackUnstructuredEvent:eventJson
                        context:nil
                      timestamp:12345678;
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

[Back to top](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#top)

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#5-sending-events-snowplowrequest)5\. Sending events: `SnowplowRequest`

Events created by the Tracker are sent to a collector using a `SnowplowRequest` instance. You can create one using one of the init methods:

```
- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString *)method
             bufferOption:(enum SnowplowBufferOptions)option;
- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString* )method;
```

For example:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                            httpMethod:@"GET"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#51-using-a-buffer)5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the SnowplowRequest buffers up to 10 events before sending them.

You can set this during the creation of a `SnowplowRequest` object or using the setter `-(void)setBufferOption:`

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferDefault];
```

\[emitter setBufferOption:SnowplowBufferInstant\]

;

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `SnowplowBufferInstant` | Events are sent as soon as they are created |
| `SnowplowBufferDefault` | Sends events in a group when 10 events are created |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#52-choosing-the-http-method)5.2 Choosing the HTTP method

Snowplow supports receiving events via GET requests, but will soon have POST support. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `@"GET"` | Events are sent individually as GET requests |
| `@"POST"` | Events are sent in a group when 10 events are received in one POST request |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.2#53-sending-http-requests)5.3 Sending HTTP requests

You can set this during the creation of a `SnowplowRequest` object:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowRequest emitter = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowRequest emitter2 = [[SnowplowRequest alloc] initWithURLRequest:url
                                                           httpMethod:@"GET"
                                                         bufferOption:SnowplowBufferDe
```
