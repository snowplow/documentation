---
title: "Objective-C (iOS) (0.6.0)"
description: "Objective-C tracker version 0.6.0 documentation for iOS behavioral event collection."
schema: "TechArticle"
keywords: ["Objective-C V0.6.0", "iOS Legacy", "Legacy iOS", "Previous Version", "Deprecated iOS", "Old iOS"]
date: "2020-03-02"
sidebar_position: 950
---

## 1. Overview

The [Snowplow Objective-C Tracker](https://github.com/snowplow/snowplow-objc-tracker) allows you to track Snowplow events from your iOS, OSX and tvOS apps and games. It supports iOS 7.0+, OSX 10.9+ and tvOS 9.0+.

The tracker should be straightforward to use if you are comfortable with iOS development; its API is modelled after Snowplow's [Python Tracker](/docs/sources/trackers/python-tracker/index.md) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [iOS Tracker Setup](/docs/sources/trackers/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) guide before continuing.

You can also find detailed documentation for the method calls in the tracker classes available as part of the [CocoaPods documentation](http://cocoadocs.org/docsets/SnowplowTracker/).

## Implementation

The Tracker is designed to be used as a Singleton object. Meaning that within your application you should only have to create one Tracker for the lifecycle of your application. Without setting this up:

- Multiple Emitters could become active resulting in the same events being sent multiple times.
- Thrashing of the database.
- Hogging of resources for sending HTTP requests which can slow your application.

For a basic example of the Singleton pattern:

```objc
// --- Header File 'SnowplowManager.h'

@class SPTracker;

@interface SnowplowManager : NSObject {
    SPTracker *tracker;
}

@property (nonatomic, retain) SPTracker *tracker;

+ (id) snowplowManager;

@end

// --- Method File 'SnowplowManager.m'

#import "SnowplowManager.h"
#import "SPTracker.h"
#import "SPEmitter.h"

@implementation SnowplowManager

@synthesize tracker;

#pragma mark Singleton Methods

+ (id) snowplowManager {
    static SnowplowManager *sharedSnowplowManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSnowplowManager = [[self alloc] init];
    });
    return sharedSnowplowManager;
}

- (id) init {
  self = [super init];
  if (self) {
    SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
        
[builder setUrlEndpoint:@"com.acme"]

; }]; tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {

[builder setEmitter:emitter]

; }]; } return self; }

@end
```

You can then access your Tracker via `SnowplowManager *snowplowManager = [SnowplowManager snowplowManager]`.

### 1.1 Demonstration App

If you would like to see the Tracker in action you can launch the demo app like so:

- Download the GitHub repo: `git clone https://github.com/snowplow/snowplow-objc-tracker.git`
- In XCode open the `SnowplowDemo.xcworkspace` file.
- Select the device you want to launch the SnowplowDemo into!

You will then need to simply enter a valid endpoint URL and hit the `Start Demo!` button.

### 1.2 HTTPs and Certificates

Please note that with the release of iOS 9, tvOS 9 and OS-x 10.11 Apple's Application Transport Security now requires:

1. That all network communication be done using HTTPs by default. There are [ways around this](https://forums.developer.apple.com/thread/3544) if need be.
2. We have noticed that for the Application Transport Security to work with your certificates you will need to supply the whole certificate chain.

## 2. Initialization

Assuming you have completed the [iOS Tracker Setup](/docs/sources/trackers/mobile-trackers/installation-and-set-up/index.md?platform=ios#installing) for your project, you are now ready to initialze the Snowplow Tracker.

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

By default, no client sessionization is activated. Once enabled the Tracker will start appending a `client_session` context to each event it sends and it will maintain this session information for the life of the application; i.e. as long as the application is installed on the device.

**NOTE**: A known [bug existed](https://github.com/snowplow/snowplow-objc-tracker/issues/265) in version 0.6.0 for the default settings where the foreground and background timeouts are passed as `ms` rather than `s`. To ensure a sane timeout please add the following to your Tracker creation:

```objc
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
[builder setForegroundTimeout:600]; // 10 minutes
[builder setBackgroundTimeout:300]; // 5 minutes 
}];
```

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

**Be aware** that the use of the geo-location requires you to set all values yourself; we do not currently support automatic geo detection.

```objc
SPSubject *subject = [[SPSubject alloc] init];

// OR with the optional platform/geo-location context...

SPSubject *subject = [[SPSubject alloc] initWithPlatformContext:YES andGeoContext:NO];

// Add it to the Tracker during construction...
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
[builder setSubject:subject]; // Optional 
}];

// Add it later...

[tracker setSubject:subject];
```

**NOTE**: `initWithPlatformContext` refers to getting the context for the particular platform that the Tracker is running on. In the case of an iOS application, this will then automatically fetch the `mobile_context` for all of your events.

- [Sending IFA](#31-sending-ifa)

#### Standard Pairs

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

#### Geo-Location

- [Setting the Geo-Location](#312-set-geo-location-variables)

### 3.1 Sending IFA

Apps that do not display advertisements are not allowed to access Apple's Identifier For Advertisers (IFA). For this reason, the Snowplow Objective-C Tracker will only send IFA as part of the `mobile_context` which is attached to each event **if** you have the `AdSupport.framework` included in your app (and are therefore intending to serve ads).

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

You can set the screen resolution to any width and height.

Example:

```objc
[subject setResolutionWithWidth:1920 andHeight:1080];
```

### 3.4 Set View Port with `setViewPortWithWidth`

You can set the viewport to any width and height.

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

### 3.12 Set Geo-Location variables

Due to difficulty in getting these variables automatically, we are depending on the developer to pass in these values for us if they wish to populate the geo-location. This will hopefully change in the future.

**NOTE**: `latitude` and `longitude` are required fields and must be present if you decide to include the geo-location context with your events.

These are the available functions for geo-location which are all called directly on a subject object:

```objc
[subject setGeoXXX:];
```

- `setGeoLatitude` : Sets the latitude value
- `setGeoLongitude` : Sets the longitude value
- `setGeoLatitudeLongitudeAccuracy` : Sets the lat-long accuracy
- `setGeoAltitude` : Sets the altitude
- `setGeoAltitudeAccuracy` : Sets the altitude accuracy
- `setGeoBearing` : Sets the bearing
- `setGeoSpeed` : Sets the speed
- `setGeoTimestamp` : Sets a timestamp (must be in ms since unix epoch)

Once this is set it will be automatically attached to all events being sent.

## 4. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the Objective-C Tracker at a glance:

| **Function** | *_Description_ |
| --- | --- |
| [`trackScreenViewEvent:`](#42-track-screen-views-withtrackscreenviewevent) | Track the user viewing a screen within the application |
| [`trackPageViewEvent:`](#43-track-pageviews-withtrackpageviewevent) | Track and record views of web pages. |
| [`trackEcommerceEvent:`](#44-track-ecommerce-transactions-withtrackecommerceevent) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent:`](#45-track-structured-events-withtrackstructuredevent) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent:`](#46-track-unstructured-events-withtrackunstructuredevent) | Track a Snowplow custom unstructured event |
| [`trackTimingEvent:`](#47-track-user-timings-withtracktimingevent) | Track a Snowplow user timing event |

### 4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

### 4.1.1 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of an NSDictionary object. Each tracking method accepts an additional optional contexts builder method.

The `context` argument should consist of a `NSMutableArray` of `NSDictionary` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](#46-track-unstructured-events-withtrackunstructuredevent).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```json
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
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
event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
[builder setCategory:@"DemoCategory"];
[builder setAction:@"DemoAction"];
[builder setContexts:[NSMutableArray arrayWithArray:@[poster]]]; 
}];

[tracker trackStructuredEvent:event];
```

_Note that even if there is only one custom context attached to the event, it still needs to be placed in an array._

### 4.1.2 Optional timestamp argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Please note this argument must always be in milliseconds since the unix epoch like so `1446542245000`.

Here is an example:

```objc
event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
[builder setCategory:@"DemoCategory"];
[builder setAction:@"DemoAction"];
[builder setTimestamp:1446542245000]; 
}];

[tracker trackStructuredEvent:event];
```

### 4.1.3 Optional Event ID argument

This Tracker also offers a way to set a custom Event ID with each event you send to snowplow. If you do not populate this field we will do it automatically.

Please note that to be valid the event id must be a UUID.

Here is an example:

```objc
event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
[builder setCategory:@"DemoCategory"];
[builder setAction:@"DemoAction"];
[builder setEventId:"your-custom-uuid-string"]; 
}];

[tracker trackStructuredEvent:event];
```

### 4.1.4 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### 4.2 Track screen views with `trackScreenViewEvent:`

Use `trackScreenViewEvent:` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setName` | Human-readable name for this screen | No | NSString* |
| `setId` | Unique identifier for this screen | No | NSString* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

Example:

```objc
SPScreenView *event = [SPScreenView build:^(id<SPScreenViewBuilder> builder) {
[builder setName:@"HUD > Save Game"];
[builder setId:@"screen23"]; 
}];

[tracker_ trackScreenViewEvent:event];
```

**NOTE**: You must populate at least one of name or id for the event to build.

### 4.3 Track pageviews with `trackPageViewEvent:`

Use `trackPageViewEvent:` to track a user viewing a page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setPageUrl` | The URL of the page | Yes | NSString* |
| `setPageTitle` | The title of the page | No | NSString* |
| `setReferrer` | The address which linked to the page | No | NSString* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

Example:

```objc
SPPageView *event = [SPPageView build:^(id<SPPageViewBuilder> builder) {
[builder setPageUrl:@"DemoPageUrl"];
[builder setPageTitle:@"DemoPageTitle"];
[builder setReferrer:@"DemoPageReferrer"]; 
}];

[tracker trackPageViewEvent:event];
```

### 4.4 Track ecommerce transactions with `trackEcommerceEvent:`

Use `trackEcommerceEvent:` to track an ecommerce transaction. Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setOrderId` | ID of the eCommerce transaction | Yes | NSString* |
| `setTotalValue` | Total transaction value | Yes | double |
| `setAffiliation` | Transaction affiliation | No | NSString* |
| `setTaxValue` | Transaction tax value | No | double |
| `setShipping` | Delivery cost charged | No | double |
| `setCity` | Delivery address city | No | NSString* |
| `setState` | Delivery address state | No | NSString* |
| `setCountry` | Delivery address country | No | NSString* |
| `setCurrency` | Transaction currency | No | NSString* |
| `setItems` | Items in the transaction | Yes | NSArray* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

`trackEcommerceEvent:` fires multiple events: one "transaction" event for the transaction as a whole, and one "transaction item" event for each element of the `items` array. Each transaction item event will have the same timestamp, orderId, and currency as the main transaction event.

The `items` argument is an `NSArray` containing an `SPEcommerceItem` for each item in the transaction. There is a convenience object for each item called `SPEcommerceItem:`. Arguments:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setItemId` | ID of the eCommerce transaction | Yes | NSString* |
| `setSku` | Item SKU | Yes | NSString* |
| `setPrice` | Item price | Yes | double |
| `setQuantity` | Item quantity | Yes | NSInteger |
| `setName` | Item name | No | NSString* |
| `setCategory` | Item category | No | NSString* |
| `setCurrency` | Transaction currency | No | NSString* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

Example of tracking a transaction containing one item:

```objc
NSString *transactionID = @"6a8078be";
NSString *currency = @"USD";
NSMutableArray *itemArray = [NSMutableArray array];

[itemArray addObject:[SPEcommerceItem build:^(id<SPEcommTransactionItemBuilder> builder) {
[builder setItemId:transactionID];
[builder setSku:@"pbz0026"];
[builder setName:@"Hot Chocolate"];
[builder setCategory:@"Drink"];
[builder setPrice:0.75F];
[builder setQuantity:1];
[builder setCurrency:currency]; 
}]];

SPEcommerce *event = [SPEcommerce build:^(id<SPEcommTransactionBuilder> builder) {
[builder setOrderId:transactionID];
[builder setTotalValue:350];
[builder setAffiliation:@"DemoTranAffiliation"];
[builder setTaxValue:10];
[builder setShipping:15];
[builder setCity:@"Boston"];
[builder setState:@"Massachusetts"];
[builder setCountry:@"USA"];
[builder setCurrency:currency];
[builder setItems:itemArray]; 
}];

[tracker trackEcommerceEvent:event];
```

### 4.5 Track structured events with `trackStructuredEvent:`

Use `trackStructuredEvent:` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setCategory` | The grouping of structured events which this `action` belongs to | Yes | NSString* |
| `setAction` | Defines the type of user interaction which this event involves | Yes | NSString* |
| `setLabel` | A string to provide additional dimensions to the event data | No | NSString* |
| `setProperty` | A string describing the object or the action performed on it | No | NSString* |
| `setValue` | A value to provide numerical data about the event | No | NSInteger |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

Example:

```objc
SPStructured *event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
[builder setCategory:@"shop"];
[builder setAction:@"add-to-basket"];
[builder setLabel:@"Add To Basket"];
[builder setProperty:@"pcs"];
[builder setValue:27]; 
}];

[tracker trackStructuredEvent:event];
```

### 4.6 Track unstructured events with `trackUnstructuredEvent:`

Custom unstructured events are a flexible tool that enables Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `trackUnstructuredEvent:` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setEventData` | The properties of the event | Yes | SPSelfDescribingJson* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString |

Example:

```objc
NSDictionary * data = @{@"level": @23, @"score": @56473};
SPSelfDescribingJson * sdj = [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.acme/save_game/jsonschema/1-0-0"
                                                                  andData:data];

SPUnstructured *event = [SPUnstructured build:^(id<SPUnstructuredBuilder> builder) {
[builder setEventData:sdj]; 
}];

[tracker trackUnstructuredEvent:event];
```

For more on JSON schema, see the [blog post](https://snowplow.io/blog/2014/05/15/introducing-self-describing-jsons/).

### 4.7 Track user timings with `trackTimingEvent:`

Use `trackTimingEvent:` to track a user timing in your app - for example, how long a game took to load, or how long an in-app purchase took to download. The fields are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `setCategory` | Categorizing timing variables into logical groups (e.g API calls, asset loading) | Yes | NSString* |
| `setVariable` | Identify the timing being recorded | Yes | NSString* |
| `setTiming` | The number of milliseconds in elapsed time to report | Yes | NSInteger |
| `setLabel` | Optional description of this timing | Yes | NSString* |
| `setContexts` | Custom context for the event | No | NSMutableArray* |
| `setTimestamp` | Optional timestamp for the event | No | NSInteger |
| `setEventId` | Optional event id for the event | No | NSString* |

Example:

```objc
SPTiming *event = [SPTiming build:^(id<SPTimingBuilder> builder) {
[builder setCategory:@"Application"];
[builder setVariable:@"Background"];
[builder setTiming:324];
[builder setLabel:@"5231804123"]; 
}];

[tracker trackTimingEvent:event];
```

## 5. Sending events: `SPEmitter`

Events created by the Tracker are sent to a collector using a `SnowplowEmitter` instance. You can create one using the following builder example:

```objc
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:_url]; // Required
[builder setHttpMethod:_method]; // Optional
[builder setProtocol:_protocol]; // Optional
[builder setCallback:self]; // Optional
[builder setEmitRange:200]; // Optional
[builder setEmitThreadPoolSize:20]; // Optional
[builder setByteLimitGet:50000]; // Optional
[builder setByteLimitPost:50000]; // Optional 
}];
```

A key change to the emitter construction is the removal of the `setBufferOption` and the addition of `byteLimit`. In the case of POST requests, we will now add events up until a byte limit rather than an arbitrary event count. However, there are a few more implications:

- If an event, by itself, exceeds this limit it will be sent but it is then removed from the queue irrespective of the result.
- If you set the limit higher than 52000 it is likely that none of your events will make it to the collector.

**NOTE**: The current safe maximum byte threshold is 52000, however, this may change in the future.

| **Builder Function** | **Description** |
| --- | --- |
| `setUrlEndpoint` | The collector resource name to use for sending events |
| `setHttpMethod` | The method sending; either GET or POST |
| `setProtocol` | The protocol option; HTTP or HTTPS |
| `setCallback` | The optional emitter callback |
| `setEmitRange` | The count of events that are retrieved from the database |
| `setEmitThreadPoolSize` | The size of the emitting Thread Pool |
| `setByteLimitGet` | The max bytes in a GET request |
| `setByteLimitPost` | The max bytes in a POST request |

### 5.1 Using a protocol

The protocol argument determines if the event is sent over HTTP or HTTPS. In the case of iOS 9.0 all events are automatically sent with HTTPS.

You can set this during the creation of a `SPEmitter` object or use the setter `-(void)setProtocol:`

```objc
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
[builder setUrlEndpoint:_url];
[builder setProtocol:SPHttp]; 
}];

[emitter setProtocol:SPHttps];
```

Here are all the possible options that you can use:

| **Option** | **Description** |
| --- | --- |
| `SPHttp` | Sends events as HTTP |
| `SPHttps` | Sends events as HTTPs |

### 5.2 Choosing the HTTP method

Snowplow supports receiving events via GET and POST requests. In a GET request, each event is sent in an individual request. With POST requests, events can be bundled together in one request.

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

The `SPUtilities` class contains a host of static functions which are used throughout the Tracker. To see all of the available functions please consult the [`SPUtilities.h`](https://github.com/snowplow/snowplow-objc-tracker/blob/master/Snowplow/SPUtilities.h) file.

### 6.1 `getAppleIdfa`

This function will only return the IDFA under the following conditions:

- The device is running iOS.
- The AdSupport library is in your project.

To use:

```objc
NSString* appleIdfa = [SPUtilities getAppleIdfa];
```

### 6.2 `getAppleIdfv`

This function will only return the IDFV under the following conditions:

- The device is running iOS.

To use:

```objc
NSString* appleIdfv = [SPUtilities getAppleIdfv];
```

### 6.3 `getOpenIdfa`

This function will only return the OpenIDFA under the following conditions:

- The device is running iOS.
- The iOS version is less than 9.0.

To use:

```objc
NSString* openIdfa = [SPUtilities getOpenIdfa];
```
