---
title: "Objective-C (iOS) (0.5.0)"
date: "2020-03-02"
sidebar_position: 960
sidebar_label: "Objective-C (iOS) (0.5.0)"
description: "Legacy documentation for Objective-C iOS Tracker version 0.5.0 supporting iOS 7.0+ and OSX 10.9+."
keywords: ["objective-c 0.5.0", "ios", "tracker"]
---

## 1. Overview

The [Snowplow Objective-C Tracker](https://github.com/snowplow/snowplow-objc-tracker) allows you to track Snowplow events from your iOS and OSX apps and games. It supports iOS 7.0+, OSX 10.9+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](/docs/sources/python-tracker/index.md) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](/docs/sources/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

### 1.1 Demonstration App

If you would like to see the Tracker in action you can launch the demo app like so:

- Download the github repo: `git clone https://github.com/snowplow/snowplow-objc-tracker.git`
- In XCode open the `SnowplowDemo.xcworkspace` file.
- Select the device you want to launch the SnowplowDemo into!

You will then need to simply enter a valid endpoint URL and hit the `Start Demo!` button.

## 2. Initialization

Assuming you have completed the [iOS Tracker Setup](/docs/sources/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) for your project, you are now ready to initialze the Snowplow Tracker.

## 2.1 Importing the library

Adding the library into your project is as simple as adding the headers into your class file:

```objc
#import <SPTracker.h>
#import <SPEmitter.h>
```

If you have manually copied the library into your project, don't forget to change your import syntax:

```objc
#import "SPTracker.h"
#import "SPEmitter.h"
```

If you have statically added the library you will need to further amend your syntax:

```objc
#import "SnowplowTracker/SPTracker.h"
#import "SnowplowTracker/SPEmitter.h"
```

That's it - you are now ready to initialize a tracker instance.

### 2.2 Creating a tracker

To instantiate a tracker in your code simply instantiate the `SPTracker` class with the following builder pattern:

```objc
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
[builder setEmitter:emitter]; // Required
[builder setSubject:subject]; // Optional
[builder setAppId:_appId]; // Optional
[builder setTrackerNamespace:_namespace]; // Optional
[builder setBase64Encoded:YES]; // Optional
[builder setSessionContext:YES]; // Optional
[builder setForegroundTimeout:300]; // Optional
[builder setBackgroundTimeout:150]; // Optional
[builder setCheckInterval:10]; // Optional
}];
```

| **Builder Function** | **Description** |
| --- | --- |
| `setEmitter` | The SPEmitter object you create |
| `setSubject` | The SPSubject object you create |
| `setAppId` | The application ID |
| `setTrackerNamespace` | The name of the tracker instance |
| `setBase64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) |
| `setSessionContext` | Whether to enable client sessions |
| `setForegroundTimeout` | The session foreground timeout |
| `setBackgroundTimeout` | The session background timeout |
| `setCheckInterval` | The session checking interval |

#### 2.2.1 `emitter`

This is a single `SPEmitter` object that will be used to send all the tracking events created by the `SPTracker` to a collector. See [Sending events](#5-sending-eventsspemitter) for more on its configuration.

#### 2.2.2 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### 2.2.3 `appId`

The `appId` argument lets you set the application ID to any string.

#### 2.2.4 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

#### 2.2.5 `client_session`

By default no client sessionization is activated. Once enabled the Tracker will start appending a `client_session` context to each event it sends and it will maintain this session information for the life of the application; i.e. as long as the application is installed on the device.

#### 2.2.6 `pauseEventTracking`

This function when called will pause all event tracking and sessionization actions until resume is called.

```objc
[tracker pauseEventTracking];
```

#### 2.2.7 `resumeEventTracking`

This function will resume all event tracking when called (if it was paused) and will also re-enable sessionization if it was already on.

```objc
[tracker resumeEventTracking];
```

## 3. Adding extra data

To add extra data to the Tracker you will need to append an `SPSubject` object to the Tracker. This can be done either during Tracker creation or added later.

```objc
SPSubject *subject = [[SPSubject alloc] init];

// OR with the optional platform context...

SPSubject *subject = [[SPSubject alloc] initWithPlatformContext:YES];

// Add it to the Tracker during construction...
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [...]
    
```

[builder setSubject:subject]; // Optional }];

// Add it later...

[tracker setSubject:subject];

- [Sending IFA](#31-sending-ifa)
- [`setUserId`](#32-set-user-id-withsetuserid)
- [`setResolutionWithWidth`](#33-set-screen-resolution-withsetresolutionwithwidth)
- [`setViewPortWithWidth`](#34-set-view-port-withsetviewportwithwidth)
- [`setColorDepth`](#35-set-color-dpeth-withsetcolordepth)
- [`setTimezone`](#36-set-timezone-withsettimezone)
- [`setLanguage`](#37-set-language-withsetlanguage)
- [`setIpAddress`](#38-set-ip-address-withsetipaddress)
- [`setUseragent`](#39-set-the-useragent-withsetuseragent)
- [`setNetworkUserId`](#310-set-the-network-user-id-withsetnetworkuserid)
- [`setDomainUserId`](#311-set-the-domain-user-id-withsetdomainuserid)

### 3.1 Sending IFA

Apps that do not display advertisements are not allowed to access Apple's Identifier For Advertisers (IFA). For this reason, the Snowplow iOS Tracker will only send IFA as part of the `mobile_context` which is attached to each event **if** you have the `AdSupport.framework` included in your app (and are therefore intending to serve ads).

For the avoidance of doubt, you can also avoid sending IFA regardless of your advertising situation, thus:

- Click on **Build Settings** to your app's project in Xcode
- Search for **Preprocessor Macros**
- Add a macro defined as`SNOWPLOW_NO_IFA = 1`

### 3.2 Set user ID with `setUserId`

You can set the user ID to any string:

```objc
[subject setUserId:_userId];
```

Example:

```objc
[subject setUserId:@"alexd"];
```

### 3.3 Set Screen Resolution with `setResolutionWithWidth`

You can set the screen resoloution to any width and height.

Example:

```objc
[subject setResolutionWithWidth:1920 andHeight:1080];
```

### 3.4 Set View Port with `setViewPortWithWidth`

You can set the view port to any width and height.

Example:

```objc
[subject setViewPortWithWidth:1920 andHeight:1080];
```

### 3.5 Set Color Dpeth with `setColorDepth`

You can set the color depth to any integer.

Example:

```objc
[subject setColorDepth:20];
```

### 3.6 Set Timezone with `setTimezone`

You can set the timezone to any string.

Example:

```objc
[subject setTimezone:@"UTC"];
```

### 3.7 Set Language with `setLanguage`

You can set the language to any string.

Example:

```objc
[subject setLanguage:@"en"];
```

### 3.8 Set IP Address with `setIpAddress`

You can set the user IP Address to any string.

Example:

```objc
[subject setIpAddress:@"127.0.0.1"];
```

### 3.9 Set the Useragent with `setUseragent`

You can set the Useragent to any string.

Example:

```objc
[subject setUseragent:@"aUseragent"];
```

### 3.10 Set the Network User ID with `setNetworkUserId`

You can set the Network User ID to any string.

Example:

```objc
[subject setNetworkUserId:@"nuid"];
```

### 3.11 Set the Domain User ID with `setDomainUserId`

You can set the Domain User ID to any string.

Example:

```objc
[subject setDomainUserId:@"duid"];
```

## 4. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the iOS Tracker at a glance:

| **Function** | _Description_ |
| --- | --- |
| [`trackScreenView:`](#42-track-screen-views-withtrackscreenview) | Track the user viewing a screen within the application |
| [`trackPageView:`](#43-track-pageviews-withtrackpageview) | Track and record views of web pages. |
| [`trackEcommerceTransaction:`](#44-track-ecommerce-transactions-withtrackecommercetransaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](#45-track-structured-events-withtrackstructuredevent) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](#46-track-unstructured-events-withtrackunstructuredevent) | Track a Snowplow custom unstructured event |
| [`trackTiming:`](#47-track-user-timings-withtracktimingwithcategory) | Track a Snowplow user timing event |

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
    "movieName": "The Guns of Navarone",
    "posterCountry": "US",
    "posterYear": "1961"
  }
}
```

The corresponding `NSDictionary` would look like this:

```objc
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

```objc
[tracker trackStructuredEvent:@"Product"
                       action:@"View"
                        label:nil
                     property:nil
                        value:0
                      context:[NSMutableArray arrayWithArray:@[poster]]];
```

_Note that even if there is only one custom context attached to the event, it still needs to be placed in an array._

### 4.1.2 Optional timestamp & context argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Please note this argument must always be in milliseconds since the unix epoch like so `1446542245000`.

Here is an example:

```objc
[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com"];

[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray];

[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" timestamp:1446542245000];

[tracker trackPageView:@"www.page.com" title:@"Example Page" referrer:@"www.referrer.com" context:contextArray timestamp:1446542245000];
```
### 4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### 4.2 Track screen views with `trackScreenView:`

Use `trackScreenView:` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | NSString* |
| `id_` | Unique identifier for this screen | No | NSString* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23"];

[t1 trackScreenView:@"HUD > Save Game" screen:nil timestamp:1446542245000];

[t1 trackScreenView:@"HUD > Save Game" screen:@"screen23" timestamp:1446542245000];
```

### 4.3 Track pageviews with `trackPageView:`

Use `trackPageView:` to track a user viewing a page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `pageUrl` | The URL of the page | Yes | NSString* |
| `pageTitle` | The title of the page | Yes | NSString* |
| `referrer` | The address which linked to the page | Yes | NSString* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com" context:contextList];
```

[t1 trackPageView:@"www.example.com" title:@"example" referrer:@"www.referrer.com"];

### 4.4 Track ecommerce transactions with `trackEcommerceTransaction:`

Use `trackEcommerceTransaction:` to track an ecommerce transaction. Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `orderId` | ID of the eCommerce transaction | Yes | NSString* |
| `totalValue` | Total transaction value | Yes | float |
| `affiliation` | Transaction affiliation | No | NSString* |
| `taxValue` | Transaction tax value | No | float |
| `shipping` | Delivery cost charged | No | float |
| `city` | Delivery address city | No | NSString* |
| `state` | Delivery address state | No | NSString* |
| `country` | Delivery address country | No | NSString* |
| `currency` | Transaction currency | No | NSString* |
| `items` | Items in the transaction | Yes | NSMutableArray* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `tstamp` | When the transaction event occurred | No | double |

`trackEcommerceTransaction:` fires multiple events: one "transaction" event for the transaction as a whole, and one "transaction item" event for each element of the `items` array. Each transaction item event will have the same timestamp, orderId, and currency as the main transaction event.

The `items` argument is an `NSMutableArray` containing an `NSDictionary` for each item in the transaction. There is a convenience constructor for each item called `trackEcommerceTransactionItem:`. Arguments:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `sku` | Item SKU | Yes | NSString* |
| `price` | Item price | Yes | float |
| `quantity` | Item quantity | Yes | float |
| `name` | Item name | No | NSString* |
| `category` | Item category | No | NSString* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `currency` | Transaction currency | No | NSString* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `tstamp` | When the transaction event occurred | No | double |

Example of tracking a transaction containing one item:

```objc
NSString *transactionID = @"6a8078be";
NSMutableArray *itemArray = [NSMutableArray array];

[itemArray addObject:[t trackEcommerceTransactionItem:transactionID
                                                  sku:@"pbz0026"
                                                 name:@"Hot Chocolate"
                                             category:@"Drink"
                                                price:0.75F
                                             quantity:1
                                             currency:@"USD"]];

[t trackEcommerceTransaction:transactionID totalValue:350 affiliation:@"no_affiliate" taxValue:10 shipping:15 city:@"Boston" state:@"Massachusetts" country:@"USA" currency:@"USD" items:itemArray];
```

### 4.5 Track structured events with `trackStructuredEvent:`

Use `trackStructuredEvent:` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | NSString* |
| `action` | Defines the type of user interaction which this event involves | Yes | NSString* |
| `label` | A string to provide additional dimensions to the event data | Yes | NSString* |
| `property` | A string describing the object or the action performed on it | Yes | NSString* |
| `value` | A value to provide numerical data about the event | Yes | int |
| `context` | Custom context for the event | No | NSMutableArray* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27];

[t1 trackStructuredEvent:@"shop" action:@"add-to-basket" label:@"Add To Basket" property:@"pcs" value:27 timestamp:1446542245000];
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
| `eventJson` | The properties of the event | Yes | NSDictionary* |
| `context` | Custom context for the event | No | NSMutableArray* |
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
NSDictionary *event = @{
                          @"schema":@"iglu:com.acme/save_game/jsonschema/1-0-0",
                          @"data": @{
                                  @"level": @23,
                                  @"score": @56473
                                  }
                          };
tracker trackUnstructuredEvent:event
                        context:nil
                      timestamp:1446542245000;
```

For more on JSON schema, see the [blog post](https://snowplow.io/blog/2014/05/15/introducing-self-describing-jsons/).

### 4.7 Track user timings with `trackTimingWithCategory:`

Use `trackTiming:` to track a user timing in your app - for example, how long a game took to load, or how long an in-app purchase took to download. The fields are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | Categorizing timing variables into logical groups (e.g API calls, asset loading) | Yes | NSString* |
| `variable` | Identify the timing being recorded | Yes | NSString* |
| `timing` | The number of milliseconds in elapsed time to report | Yes | NSUInteger |
| `label` | Optional description of this timing | Yes | NSString* |
| `context` | Custom context for the event | No | NSMutableArray* |
| `timestamp` | Optional timestamp for the event | No | double |

Example:

```objc
[t1 trackTimingWithCategory:@"Application"
                   variable:@"Background"
                     timing:324
                      label:@"5231804123"];

```

[t1 trackTimingWithCategory:@"Application" variable:@"Background" timing:324 label:@"5231804123" timestamp:1446542245000];

## 5. Sending events: `SPEmitter`

Events created by the Tracker are sent to a collector using a `SnowplowEmitter` instance. You can create one using the following builder example:

```objc
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:_url]; // Required
[builder setHttpMethod:_method]; // Optional
[builder setBufferOption:_option]; // Optional
[builder setCallback:self]; // Optional
[builder setEmitRange:200]; // Optional
[builder setEmitThreadPoolSize:20]; // Optional 
}];
```

| **Builder Function** | **Description** |
| --- | --- |
| `setUrlEndpoint` | The NSURL to use for sending events |
| `setHttpMethod` | The method sending; either GET or POST |
| `setBufferOption` | The buffer option; 1 or 10 events |
| `setCallback` | The optional emitter callback |
| `setEmitRange` | The count of events that are retrieved from the database |
| `setEmitThreadPoolSize` | The size of the emitting Thread Pool |

### 5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the SPEmitter buffers up to 10 events into a single POST; GET is always one event per request.

You can set this during the creation of a `SPEmitter` object or using the setter `-(void)setBufferOption:`

```objc
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:_url];
[builder setBufferOption:SPBufferDefault]; 
}];

[emitter setBufferOption:SPBufferInstant];
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `SPBufferInstant` | All events are sent as individual requests |
| `SPBufferDefault` | POST events are sent with up to 10 events |

### 5.2 Choosing the HTTP method

Snowplow supports receiving events via GET and POST requests. In a GET request, each event is sent in individual request. With POST requests, events can be bundled together in one request.

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `SPRequestGet` | Events are sent individually as GET requests |
| `SPRequestPost` | Events are sent in a group when 10 events are received in one POST request |

### 5.3 Adding an Emitter Callback

You are now also able to include an emitter callback which will return the count of successful and failed events.

To implement you will need to:

- Add the `RequestCallback` protocol to your header file:

```objc
// Example from the SnowplowDemo -> ViewController.h file:
@interface ViewController : UIViewController <UITextFieldDelegate, RequestCallback>

// Extra Example
@interface MyObjcClass : NSObject <RequestCallback>
```

- In your paired `.m` file add the following functions:

```objc
// Define Callback Functions
- (void) onSuccessWithCount:(NSInteger)successCount {
    // Do something with result
}

- (void) onFailureWithCount:(NSInteger)failureCount successCount:(NSInteger)successCount {
    // Do something with results
}
```

- Construct the `SPEmitter` like so:

```objc
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:url];
[builder setCallback:self]; 
}];
```

The `self` will work only if you have declared the callback functions in the same class as you are creating the Emitter from. Otherwise you will need to pass in the target for the class in which you have defined these functions.

### 5.4 Sending HTTP requests

You can set this during the creation of a `SPEmitter` object:

```objc
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:url];
[builder setHttpMethod:SPRequestPost];

// OR

[builder setHttpMethod:SPRequestGet]; 
}];
```

## 6. Utility Functions

The `SPUtilities` class contains a host of static functions which are used throughout the Tracker. To see all of the available functions please consult the [`SPUtils.h`](https://github.com/snowplow/snowplow-objc-tracker/blob/master/Snowplow/SPUtils.h) file.

### 6.1 `getAppleIdfa`

This function will only return the IDFA under the following conditions:

- The device is running iOS.
- The AdSupport library is in your project.

To use:

```objc
NSString* appleIdfa = [SPUtils getAppleIdfa];
```

### 6.2 `getAppleIdfv`

This function will only return the IDFV under the following conditions:

- The device is running iOS.

To use:

```objc
NSString* appleIdfv = [SPUtils getAppleIdfv];
```

### 6.3 `getOpenIdfa`

This function will only return the OpenIDFA under the following conditions:

- The device is running iOS.
- The iOS version is less than 9.0.

To use:

```objc
NSString* openIdfa = [SPUtils getOpenIdfa];
```
