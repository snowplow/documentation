---
title: "Objective-C (iOS) (0.4.0)"
date: "2020-03-02"
sidebar_position: 970
---

## 1\. Overview

The [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-ios-tracker) allows you to track Snowplow events from your iOS apps and games. It supports iOS 7.0+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](https://github.com/snowplow/snowplow/wiki/Python-Tracker) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#2-initialization)2\. Initialization

Assuming you have completed the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) for your project, you are now ready to initialze the Snowplow Tracker.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#21-importing-the-library)2.1 Importing the library

Adding the library into your project is as simple as adding the headers into your class file:

```
#import <SnowplowTracker.h>
#import <SnowplowEmitter.h>
```

If you have manually copied the library into your project, don't forget to change your import syntax:

```
#import "SnowplowTracker.h"
#import "SnowplowEmitter.h"
```

That's it - you are now ready to initialize a tracker instance.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#22-creating-a-tracker)2.2 Creating a tracker

To instantiate a tracker in your code simply instantiate the `SnowplowTracker` class with the constructor:

```
- (id) initWithCollector:(SnowplowEmitter *)collector_
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
| `collector` | The SnowplowEmitter object you create |
| `namespace` | The name of the tracker instance |
| `appId` | The application ID |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) |

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#221-collector)2.2.1 `collector`

This is a single `SnowplowEmitter` object that will be used to send all the tracking events created by the `SnowplowTracker` to a collector. See [Sending events](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#emitters) for more on its configuration.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#222-namespace)2.2.2 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#223-appid)2.2.3 `appId`

The `appId` argument lets you set the application ID to any string.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#224-base64encoded)2.2.4 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#3-adding-extra-data)3\. Adding extra data

Unlike the other Trackers, the iOS tracker automatically collects your platform, screen resolution, viewport, color depth, timezone and language from the device. You can still however, set your user ID to properly track different users if you require it.

- [`setUserId`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#set-user-id)
- [Sending IFA](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#sending-ifa)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#31-set-user-id-with-setuserid)3.1 Set user ID with `setUserId`

You can set the user ID to any string:

```
s1.setUserId( "{{USER ID}}" )
```

Example:

```
[tracker setUserId:@"alexd"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#32-sending-ifa)3.2 Sending IFA

Apps that do not display advertisements are not allowed to access Apple's Identifier For Advertisers (IFA). For this reason, the Snowplow iOS Tracker will only send IFA as part of the `mobile_context` which is attached to each event **if** you have the `AdSupport.framework` included in your app (and are therefore intending to serve ads).

For the avoidance of doubt, you can also avoid sending IFA regardless of your advertising situation, thus:

- Click on **Build Settings** to your app's project in Xcode
- Search for **Preprocessor Macros**
- Add a macro defined as`SNOWPLOW_NO_IFA = 1`

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#4-tracking-specific-events)4\. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the iOS Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#screen-view) | Track the user viewing a screen within the application |
| [`trackPageView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#page-view) | Track and record views of web pages. |
| [`trackEcommerceTransaction:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#struct-event) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#unstruct-event) | Track a Snowplow custom unstructured event |
| [`trackTiming:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#timing) | Track a Snowplow user timing event |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#41-common)4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#411-custom-contexts)4.1.1 Custom contexts

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

The `context` argument should consist of a `NSArray` of `NSDictionary` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2.1.1",
  "data": {
    "movieName": "The Guns of Navarone",
    "posterCountry": "US",
    "posterYear": "1961"
  }
}
```

The corresponding `NSDictionary` would look like this:

```
NSDictionary *poster = @{
                         @"schema":@"iglu:com.acme_company/movie_poster/jsonschema/1-0-0",
                         @"data": @{
                                 @"movieName": @"The Guns of Navarone",
                                 @"posterCountry": @"US",
                                 @"posterYear": @"1961"
                                 }
                         };
```

Sending the movie poster context with an event looks like this:

```
[tracker trackStructuredEvent:@"Product"
                       action:@"View"
                        label:nil
                     property:nil
                        value:0
                      context:[NSMutableArray arrayWithArray:@[poster]]];
```

_Note that even if there is only one custom context attached to the event, it still needs to be placed in an array._

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#412-optional-timestamp--context-argument)4.1.2 Optional timestamp & context argument

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#413-tracker-method-return-values)4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#42-track-screen-views-with-trackscreenview)4.2 Track screen views with `trackScreenView:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#43-track-pageviews-with-trackpageview)4.3 Track pageviews with `trackPageView:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#44-track-ecommerce-transactions-with-trackecommercetransaction)4.4 Track ecommerce transactions with `trackEcommerceTransaction:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#45-track-structured-events-with-trackstructuredevent)4.5 Track structured events with `trackStructuredEvent:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#46-track-unstructured-events-with-trackunstructuredevent)4.6 Track unstructured events with `trackUnstructuredEvent:`

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
NSDictionary *event = @{
                          @"schema":@"iglu:com.acme/save_game/jsonschema/1-0-0",
                          @"data": @{
                                  @"level": @23,
                                  @"score": @56473
                                  }
                          };
tracker trackUnstructuredEvent:event
                        context:nil
                      timestamp:12345678;
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#47-track-user-timings-with-tracktimingwithcategory)4.7 Track user timings with `trackTimingWithCategory:`

Use `trackTiming:` to track a user timing in your app - for example, how long a game took to load, or how long an in-app purchase took to download. The fields are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | Categorizing timing variables into logical groups (e.g API calls, asset loading) | Yes | NSString\* |
| `variable` | Identify the timing being recorded | Yes | NSString\* |
| `timing` | The number of milliseconds in elapsed time to report | Yes | NSUInteger |
| `label` | Optional description of this timing | Yes | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```
[t1 trackTimingWithCategory:@"Application"
                   variable:@"Background"
                     timing:324
                      label:@"5231804123"];

```

\[t1 trackTimingWithCategory:@"Application" variable:@"Background" timing:324 label:@"5231804123" timestamp:1234569\]

;

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#5-sending-events-snowplowemitter)5\. Sending events: `SnowplowEmitter`

Events created by the Tracker are sent to a collector using a `SnowplowEmitter` instance. You can create one using one of the init methods:

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
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                            httpMethod:@"GET"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#51-using-a-buffer)5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the SnowplowEmitter buffers up to 10 events before sending them.

You can set this during the creation of a `SnowplowEmitter` object or using the setter `-(void)setBufferOption:`

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#52-choosing-the-http-method)5.2 Choosing the HTTP method

Snowplow supports receiving events via GET requests, but will soon have POST support. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `@"GET"` | Events are sent individually as GET requests |
| `@"POST"` | Events are sent in a group when 10 events are received in one POST request |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.3#53-sending-http-requests)5.3 Sending HTTP requests

You can set this during the creation of a `SnowplowEmitter` object:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"GET"
                                                         bufferOption:SnowplowBufferDefault];
```

## 1\. Overview

The [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-ios-tracker) allows you to track Snowplow events from your iOS apps and games. It supports iOS 6.0+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](https://github.com/snowplow/snowplow/wiki/Python-Tracker) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#11-demonstration-app)1.1 Demonstration App

If you would like to see the Tracker in action you can launch the demo app like so:

- Download the github repo: `git clone https://github.com/snowplow/snowplow-objc-tracker.git`
- In XCode open the `SnowplowDemo.xcworkspace` file.
- Select the device you want to launch the SnowplowDemo into!

You will then need to simply enter a valid endpoint URL and hit the `Start Demo!` button.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#2-initialization)2\. Initialization

Assuming you have completed the [iOS Tracker Setup](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup) for your project, you are now ready to initialze the Snowplow Tracker.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#21-importing-the-library)2.1 Importing the library

Adding the library into your project is as simple as adding the headers into your class file:

```
#import <SnowplowTracker.h>
#import <SnowplowEmitter.h>
```

If you have manually copied the library into your project, don't forget to change your import syntax:

```
#import "SnowplowTracker.h"
#import "SnowplowEmitter.h"
```

If you have statically added the library you will need to further amend your syntax:

```
#import "SnowplowTracker/SnowplowTracker.h"
#import "SnowplowTracker/SnowplowEmitter.h"
```

That's it - you are now ready to initialize a tracker instance.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#22-creating-a-tracker)2.2 Creating a tracker

To instantiate a tracker in your code simply instantiate the `SnowplowTracker` class with the constructor:

```
- (id) initWithCollector:(SnowplowEmitter *)collector_
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
| `collector` | The SnowplowEmitter object you create |
| `namespace` | The name of the tracker instance |
| `appId` | The application ID |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) |

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#221-collector)2.2.1 `collector`

This is a single `SnowplowEmitter` object that will be used to send all the tracking events created by the `SnowplowTracker` to a collector. See [Sending events](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#emitters) for more on its configuration.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#222-namespace)2.2.2 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#223-appid)2.2.3 `appId`

The `appId` argument lets you set the application ID to any string.

#### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#224-base64encoded)2.2.4 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#3-adding-extra-data)3\. Adding extra data

Unlike the other Trackers, the iOS tracker automatically collects your platform, screen resolution, viewport, color depth, timezone and language from the device. You can still however, set your user ID to properly track different users if you require it.

- [`setUserId`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#set-user-id)
- [Sending IFA](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#sending-ifa)

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#31-set-user-id-with-setuserid)3.1 Set user ID with `setUserId`

You can set the user ID to any string:

```
s1.setUserId( "{{USER ID}}" )
```

Example:

```
[tracker setUserId:@"alexd"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#32-sending-ifa)3.2 Sending IFA

Apps that do not display advertisements are not allowed to access Apple's Identifier For Advertisers (IFA). For this reason, the Snowplow iOS Tracker will only send IFA as part of the `mobile_context` which is attached to each event **if** you have the `AdSupport.framework` included in your app (and are therefore intending to serve ads).

For the avoidance of doubt, you can also avoid sending IFA regardless of your advertising situation, thus:

- Click on **Build Settings** to your app's project in Xcode
- Search for **Preprocessor Macros**
- Add a macro defined as`SNOWPLOW_NO_IFA = 1`

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#4-tracking-specific-events)4\. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the iOS Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#screen-view) | Track the user viewing a screen within the application |
| [`trackPageView:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#page-view) | Track and record views of web pages. |
| [`trackEcommerceTransaction:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#struct-event) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#unstruct-event) | Track a Snowplow custom unstructured event |
| [`trackTiming:`](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#timing) | Track a Snowplow user timing event |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#41-common)4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#411-custom-contexts)4.1.1 Custom contexts

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

The `context` argument should consist of a `NSArray` of `NSDictionary` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2.1.1",
  "data": {
    "movieName": "The Guns of Navarone",
    "posterCountry": "US",
    "posterYear": "1961"
  }
}
```

The corresponding `NSDictionary` would look like this:

```
NSDictionary *poster = @{
                         @"schema":@"iglu:com.acme_company/movie_poster/jsonschema/1-0-0",
                         @"data": @{
                                 @"movieName": @"The Guns of Navarone",
                                 @"posterCountry": @"US",
                                 @"posterYear": @"1961"
                                 }
                         };
```

Sending the movie poster context with an event looks like this:

```
[tracker trackStructuredEvent:@"Product"
                       action:@"View"
                        label:nil
                     property:nil
                        value:0
                      context:[NSMutableArray arrayWithArray:@[poster]]];
```

_Note that even if there is only one custom context attached to the event, it still needs to be placed in an array._

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#412-optional-timestamp--context-argument)4.1.2 Optional timestamp & context argument

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#413-tracker-method-return-values)4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#42-track-screen-views-with-trackscreenview)4.2 Track screen views with `trackScreenView:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#43-track-pageviews-with-trackpageview)4.3 Track pageviews with `trackPageView:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#44-track-ecommerce-transactions-with-trackecommercetransaction)4.4 Track ecommerce transactions with `trackEcommerceTransaction:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#45-track-structured-events-with-trackstructuredevent)4.5 Track structured events with `trackStructuredEvent:`

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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#46-track-unstructured-events-with-trackunstructuredevent)4.6 Track unstructured events with `trackUnstructuredEvent:`

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
NSDictionary *event = @{
                          @"schema":@"iglu:com.acme/save_game/jsonschema/1-0-0",
                          @"data": @{
                                  @"level": @23,
                                  @"score": @56473
                                  }
                          };
tracker trackUnstructuredEvent:event
                        context:nil
                      timestamp:12345678;
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#47-track-user-timings-with-tracktimingwithcategory)4.7 Track user timings with `trackTimingWithCategory:`

Use `trackTiming:` to track a user timing in your app - for example, how long a game took to load, or how long an in-app purchase took to download. The fields are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | Categorizing timing variables into logical groups (e.g API calls, asset loading) | Yes | NSString\* |
| `variable` | Identify the timing being recorded | Yes | NSString\* |
| `timing` | The number of milliseconds in elapsed time to report | Yes | NSUInteger |
| `label` | Optional description of this timing | Yes | NSString\* |
| `context` | Custom context for the event | No | NSMutableArray\* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```
[t1 trackTimingWithCategory:@"Application"
                   variable:@"Background"
                     timing:324
                      label:@"5231804123"];

```

\[t1 trackTimingWithCategory:@"Application" variable:@"Background" timing:324 label:@"5231804123" timestamp:1234569\]

;

## [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#5-sending-events-snowplowemitter)5\. Sending events: `SnowplowEmitter`

Events created by the Tracker are sent to a collector using a `SnowplowEmitter` instance. You can create one using one of the init methods:

```
- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString *)method
             bufferOption:(enum SnowplowBufferOptions)option
          emitterCallback:(id<RequestCallback>)callback;

- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString *)method
             bufferOption:(enum SnowplowBufferOptions)option;

- (id) initWithURLRequest:(NSURL *)url
               httpMethod:(NSString* )method;
```

For example:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                            httpMethod:@"GET"];
```

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#51-using-a-buffer)5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the SnowplowEmitter buffers up to 10 events before sending them.

You can set this during the creation of a `SnowplowEmitter` object or using the setter `-(void)setBufferOption:`

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
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

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#52-choosing-the-http-method)5.2 Choosing the HTTP method

Snowplow supports receiving events via GET requests, but will soon have POST support. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `@"GET"` | Events are sent individually as GET requests |
| `@"POST"` | Events are sent in a group when 10 events are received in one POST request |

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#53-adding-an-emitter-callback)5.3 Adding an Emitter Callback

You are now also able to include an emitter callback which will return the count of successful and failed events.

To implement you will need to:

- Add the `RequestCallback` protocol to your header file:

```
// Example from the SnowplowDemo -> ViewController.h file:
@interface ViewController : UIViewController <UITextFieldDelegate, RequestCallback>

// Extra Example
@interface MyObjcClass : NSObject <RequestCallback>
```

- In your paired `.m` file add the following functions:

```
// Define Callback Functions
- (void) onSuccess:(NSInteger)successCount {
    // Do something with result
}

- (void) onFailure:(NSInteger)successCount failure:(NSInteger)failureCount {
    // Do something with results
}
```

- Construct the SnowplowEmitter like so:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant
                                                      emitterCallback:self];
```

The `self` will work only if you have declared the callback functions in the same class as you are creating the Emitter from.

### [](https://github.com/snowplow/snowplow/wiki/iOS-Tracker-v0.4#54-sending-http-requests)5.4 Sending HTTP requests

You can set this during the creation of a `SnowplowEmitter` object:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];
SnowplowEmitter emitter = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"POST"
                                                         bufferOption:SnowplowBufferInstant];
SnowplowEmitter emitter2 = [[SnowplowEmitter alloc] initWithURLRequest:url
                                                           httpMethod:@"GET"
                                                         bufferOption:SnowplowBufferDefault];
```
