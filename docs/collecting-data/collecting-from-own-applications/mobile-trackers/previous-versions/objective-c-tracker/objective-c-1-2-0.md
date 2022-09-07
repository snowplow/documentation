---
title: "Objective-C (iOS) (1.2.0)"
date: "2020-03-19"
sidebar_position: 840
---

## Installation

Dependencies are needed in order to use the Obj-C tracker library in your application. These can be installed manually, or through package managers.

### Package Managers

#### Cocoapods

First make sure that Cocoapods is installed on your system.

For instructions, refer to the official Cocoapods guide [here](https://guides.cocoapods.org/using/getting-started.html).

The tracker can be used in your project by adding `SnowplowTracker` to your project's `Podfile`:

```
pod 'SnowplowTracker', '~> 1.2'
```

Now you can install the dependency in your project with the command: `pod install`.

Make sure to always open the Xcode workspace instead of the project file when building your project:

```
$ open App.xcworkspace
```

Now you can import classes in order to use the tracker e.g.:

```
#import "SPPayload.h"
#import "SPTracker.h"
#import "SPSelfDescribingJson.h"
#import "SPEvent.h"
```

#### Carthage

In order to add the tracker to a project that uses Carthage, add the line to your `Cartfile`:

```
github "snowplow/snowplow-objc-tracker" ~> 1.2
```

Run `carthage update` and drag the appropriate frameworks to your project from the `Carthage/build` folder found in the project's folder.

The tracker can be imported like this:

```
import <SnowplowTracker/SPTracker.h>
```

### Demo apps

With the tracker we've included few demo apps that can be used to demonstrate working iOS apps that integrate the tracker and allow you to send events to a collector.

They can be found in the `Examples` folder: - `SnowplowDemo`: an Objective-C app; - `SnowplowSwiftCarthageDemo`: a Swift app which imports dependencies using Carthage. - `SnowplowSwiftCocoapodsDemo`: a Swift app which imports dependencies using Cocoapods.

The two Swift apps share the same codebase. The unique difference is in the configuration for the dependency managers.

For general testing, [Snowplow Mini](https://github.com/snowplow/snowplow-mini) can be used as an easily deployable collector with a live web interface for viewing received events.

The apps can be run in an emulator or on an actual Apple device through Xcode.

Simply enter the endpoint of the collector in the app's interface once it's launched and press `"send events"`!

## Implementation

The Tracker is designed to be used as a Singleton object, meaning that you should have only one instance of Tracker within your application. Without setting this up:

- Multiple Emitters could become active resulting in the same events being sent multiple times.
- Thrashing of the database.
- Hogging of resources for sending HTTP requests which can slow your application.

For a basic example of the Singleton pattern:

```
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
        [builder setUrlEndpoint:@"com.acme"];
    }];
    tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
        [builder setEmitter:emitter];
    }];
  }
  return self;
}

@end
```

You can then access your Tracker via `SnowplowManager *snowplowManager = [SnowplowManager snowplowManager]`.

## Quick Start

Here's the minimum code needed to create a tracker and send an event to a collector.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:@"example.com"]; // Required
}];

SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter]; // Required
}];

NSDictionary * data = @{@"level": @23, @"score": @56473};
SPSelfDescribingJson * sdj = [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.acme/save_game/jsonschema/1-0-0" andData:data];

SPUnstructured *event = [SPUnstructured build:^(id<SPUnstructuredBuilder> builder) {
  [builder setEventData:sdj];
}];

[tracker trackUnstructuredEvent:event];
```

## Tracker structure

Here we'll explain the purpose of the classes provided in the tracker.

### SPEmitter

Responsible for all the storage, networking and scheduling required to ensure events are sent to a collector.

Details like the collector endpoint and sending timeout lengths are set here.

### SPTracker

`SPTracker` is the class where you can find the methods available for tracking events. This is also where all parts of the tracker are brought together, i.e. within `SPTracker` you must set the associated emitter, subject, etc.

### SPPayload

`SPPayload` is simply a key-value store used for constructing events.

### SPSelfDescribingJson

`SPSelfDescribingJson` is a class used for constructing self-describing JSONs (SDJs).

An SDJ has two fields: `schema` and `data`. The `schema` field is a URI that specifies where to find the schema that defines the structure of the data nested in the `data` field.

A self-describing JSON is sent directly to the collector. All events are self-describing JSONs.

Generally speaking, when sending your own custom events, you will want to create a `SPSelfDescribingJson` object instantiated with two arguments: the schema, and a `SPPayload` or `NSDictionary` that holds the structured data you'd like to track.

### SPSubject

A "subject" represents an individual user that is being tracked. It is used to track data that persists with a user like timezone, user ID, platform, etc.

### SPEvent

This is where all events are found, the available classes are:

- SPPageView
- SPStructured
- SPUnstructured
- SPScreenView
- SPConsentWithdrawn
- SPConsentGranted
- SPConsentDocument
- SPTiming
- SPEcommTransaction
- SPEcommTransactionItem
- SPNotificationContent
- SPPushNotification

Events are sent by providing them as arguments to the tracking methods found in `SPTracker`.

### SPRequestCallback

This is a class that defines callbacks that are called when an emitter either fails or succeeds to send requests.

## Tracking basic methods

### Creating an emitter

Every tracker must have an emitter, so an emitter must be created first.

The URL endpoint must be defined.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:_url];
    [builder setProtocol:SPHttp];
}];
```

### Setting a User Identifier

You can set the user ID to any string:

\[subject setUserId:\_userId\];

Example:

\[subject setUserId:@"alexd"\];

### Creating a tracker

To instantiate a tracker in your code simply instantiate the `SPTracker` class with the following builder pattern:

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
}];
```

By default iOS app sets automatically the parameter `p` (platform) as `mob` and desktop app sets it to `pc`. However, there are cases where you want to specify that differently by the default option.

On the tracker setup you can override the device platform entry calling:

```
[tracker setDevicePlatform: SPDevicePlatformGameConsole];
```

It resets the parameter `p` (platform) to the new value.

[Here](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#1-common-parameters-platform-and-event-independent) a full list of the supported platform values.

### Sending events

The following methods are available for sending events from the tracker:

- trackPageViewEvent
- trackStructuredEvent
- trackUnstructuredEvent
- trackSelfDescribingEvent (self-describing event is an alias for unstructured event)
- trackScreenViewEvent
- trackTimingEvent
- trackEcommerceEvent
- trackConsentWithdrawnEvent
- trackConsentGrantedEvent
- trackPushNotificationEvent

In order to send an event, an event must first be made, and then supplied to a tracking method.

Here's an example of constructing and sending a custom event:

```
NSDictionary * data = @{@"level": @23, @"score": @56473};
SPSelfDescribingJson * sdj = [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.acme/save_game/jsonschema/1-0-0"
                                                                  andData:data];

SPUnstructured *event = [SPUnstructured build:^(id<SPUnstructuredBuilder> builder) {
  [builder setEventData:sdj];
}];

[tracker trackUnstructuredEvent:event];
```

#### Screenview event

A screenview event can be manually tracked like this:

```
SPScreenView *event = [SPScreenView build:^(id<SPScreenViewBuilder> builder) {
  [builder setName:@"Home screen"];
  [builder setType:@"Navigation bar"];
  [builder setScreenId:@"some Id"]
  [builder setPreviousScreenName:@"Info screen"];
  [builder setPreviousScreenType:@"Navigation bar"];
  [builder setPreviousScreenId:@"another Id"]
  [builder setTransitionType:@"swipe"]
}];

[tracker trackScreenViewEvent:event];
```

### Attaching contexts to events

Contexts augment events with additional information. The tracker has standard contexts for automatically attaching useful information like geolocation, session, or app version/build to every event.

Each event has an argument for custom contexts in order to attach information that isn't covered by standard contexts.

The custom context argument should consist of a NSMutableArray of NSDictionary representing an array of one or more contexts. The format of each individual context element is the same as for an unstructured event (referring to the fact that it consists of a schema and data field - they're all self-describing JSONs).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
  "data": {
    "movieName": "The Guns of Navarone",
    "posterCountry": "US",
    "posterYear": "1961"
  }
}
```

The corresponding NSDictionary would look like this:

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
event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
  [builder setCategory:@"DemoCategory"];
  [builder setAction:@"DemoAction"];
  [builder setContexts:[NSMutableArray arrayWithArray:@[poster]]];
}];
[tracker trackStructuredEvent:event];
```

Note: even if there is only one custom context attached to the event, it still needs to be placed in an array.

## More advanced methods

### Tracking features

#### Session tracking

By default, no client session tracking is activated. Once enabled the tracker will start appending a [client\_session](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) context to each event it sends and it will maintain this session information for the life of the application, i.e. as long as the application is installed on the device.

Sessions correspond to tracked user activity. A session expires when no tracking events have occurred for the amount of time defined in a timeout. When a session expires, the session ID is incremented and session checking will stop. There are two timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed).

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setForegroundTimeout:600]; // 10 minutes
    [builder setBackgroundTimeout:300]; // 5 minutes
}];
```

##### Foreground and background events

In order to enable these events, use the method `setLifecycleEvents` during initialization of the tracker:

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setLifecycleEvents:YES];
}];
```

[Foreground events](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/application_foreground/jsonschema/1-0-0) are sent whenever an app is opened or resumed.

[Background events](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/application_background/jsonschema/1-0-0) are sent whenever an app is moved to the background.

Events are not sent on app close since the OS cannot guarantee advance notice of app closing.

##### Screen view tracking

Auto-tracking can be enabled to send screen view events whenever a screen is changed in the app (a screen change corresponds to when `viewDidAppear()` is called on a view controller).

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setScreenViewEvents:YES];
}];
```

##### Exception tracking

Auto-tracking can be enabled to send an event for exceptions that are raised. The only caveat is that the exception event will be sent when the tracker is restarted.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setExceptionEvents:YES];
}];
```

##### Install tracking

Auto-tracking can be enabled to send an install event whenever the tracker is used for the first time in an app. The tracker will record when it's first been installed, so deleting and reinstalling an app will trigger another install event.

If install auto-tracking is not enabled, the tracker will still keep track of when the app was first installed, so that when enabled, the tracker will send the recorded install event with a timestamp reflecting when it was first installed.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setInstallEvents:YES];
}];
```

#### Standard contexts

These are out-of-the-box tracker options that when enabled will attach useful contexts to every event.

##### Session context

The [session context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) includes sessionization information like user ID and session ID that can be used to relate user activity patterns to events.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setSessionContext:YES];
}];
```

##### Application context

The [application context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/application/jsonschema/1-0-0) includes app build and version number.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setApplicationContext:YES];
}];
```

##### Screen Context

The [screen context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) contains information related to the current screen being viewed on the device when the event is created.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setScreenContext:YES];
}];
```

##### Platform context

The platform context will either be a [mobile](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-1) or [desktop](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/desktop_context/jsonschema/1-0-0) context depending on which platform sends the event. It is enabled by adding an `SPSubject` to the tracker.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setPlatformContext:YES];
}];

SPSubject *subject = [[SPSubject alloc] initWithPlatformContext:YES andGeoContext:NO];

[tracker setSubject:subject];
```

##### Geolocation context

The [geolocation context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0) is enabled by adding an `SPSubject` to the tracker.

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setPlatformContext:YES];
}];

SPSubject *subject = [[SPSubject alloc] initWithPlatformContext:NO andGeoContext:YES];

[tracker setSubject:subject];
```

### Emitter options

These options are used to fine-tune the emitter.

#### Setting the request method

The request method used to connect to the collector, either: `SPRequestGet`, or `SPRequestPost`.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:_url];
    [builder setHttpMethod:SPRequestPost];
}];
```

In a GET request, each event is sent in an individual request. In a POST request, events can be bundled together in one request.

#### Setting the protocol

The protocol used to connect to the collector, either: `SPHttp`, or `SPHttps`.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:_url];
    [builder setProtocol:SPHttps];
}];
```

#### Setting a callback

An emitter callback can be set which will be called with the count of successful and failed events.

To implement you will need to:

Add the RequestCallback protocol to your header file:

```
// Example from the SnowplowDemo -> ViewController.h file:
@interface ViewController : UIViewController <UITextFieldDelegate, RequestCallback>

// Extra Example
@interface MyObjcClass : NSObject <RequestCallback>
```

In your paired .m file add the following functions:

```
// Define Callback Functions
- (void) onSuccessWithCount:(NSInteger)successCount {
    // Do something with result
}

- (void) onFailureWithCount:(NSInteger)failureCount successCount:(NSInteger)successCount {
    // Do something with results
}
```

Construct the SPEmitter like so:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:url];
    [builder setCallback:self];
}];
```

The self will work only if you have declared the callback functions in the same class as you are creating the emitter. Otherwise you will need to pass in the target for the class in which you have defined these functions.

#### Range

The number of events retrieved from storage in the database whenever the emitter needs more to send.

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:url];
    [builder setEmitRange:200];
}];
```

#### Thread pool size

This is the number of threads created to make requests for sending events:

```
NSURL *url = [[NSURL alloc] initWithString:@"https://collector.acme.net"];

SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:url];
    [builder setEmitThreadPoolSize:15];
}];
```

#### GET byte limit

The maximum data size of GET requests made by the emitter to send events.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:_url]; // Required
    [builder setByteLimitGet:50000]; // Optional
}];
```

#### POST byte limit

The maximum data size of POST requests made by the emitter to send events.

```
SPEmitter *emitter = [SPEmitter build:^(id<SPEmitterBuilder> builder) {
    [builder setUrlEndpoint:_url]; // Required
    [builder setByteLimitPost:50000]; // Optional
}];
```

### Global contexts

Contexts add extra data to events, such as event circumstances like geo-location, device, or application information. Contexts can be attached in each tracking method:

```
event = [SPStructured build:^(id<SPStructuredBuilder> builder) {
  [builder setCategory:@"DemoCategory"];
  [builder setAction:@"DemoAction"];
  [builder setContexts:[NSMutableArray arrayWithArray:@[poster]]];
}];
[tracker trackStructuredEvent:event];
```

There's also the option to specify standard contexts that are attached to all events:

```
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    [builder setScreenContext:YES];
}];
```

While these are useful for some implementations - there may be times when we'd like a custom context to be added to all events automatically. Or perhaps we'd like to send a context with every event that's generated dynamically based on external information or through inspecting the event that it's attached to.

Global contexts are meant to be used for these situations. They expand contexts to include conditional or dynamic behavior.

#### Context primitives

Context primitive is a term for anything that can be used as a context. A context primitive is either a self-describing JSON, or a callback that creates a self-describing JSON (in Obj-C callbacks are implemented as [blocks](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/WorkingwithBlocks/WorkingwithBlocks.html)).

##### Self-describing JSON

A self-describing JSON is used as a global context when you'd like define a context that is attached to every event and never changes.

`SPSelfDescribingJson` takes two arguments, some data and its associated schema URI:

```
SPSelfDescribingJson * context = [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.acme/event/jsonschema/1-0-0"
                                                                      andData:@{
                                                                                 @"someData": @42
                                                                                }];
```

### IDFA tracking

IDFA allows advertisers to track a user's device among reinstalls and apps. Obviously Apple has introduced way to limit the trackability in order to keep high level of privacy for the user. Users can choose to limit ad-tracking by preventing the IDFA being passed to advertisers.

The tracker allow to get the IDFA sending it as part of the `mobile_context` JSON which is attached to each mobile event.

If you want to track the IDFA you need:

- Add `AdSupport` framework to your app. If it's not added the tracker will not send the IDFA with the events.
- If you add the `AdSupport` framework, please, be aware of the correct way to submit the app to the App Store. If you make use of IDFA you have to declare it during the App submission (More details [here](https://help.apple.com/app-store-connect/#/dev301cb2b3e)).
- The simulators can’t generate a proper IDFA, instead they generate a sequence of zeros. If you want to test IDFA with a real code, please, use the physical device.If you add the `AdSupport` framework but you don't want get the IDFA with the events:
- Disable the IDFA tracking with a preprocessor flag:
    1. Go to _Build Settings_ of the imported Snowplow Obj-C Tracker
    2. Search for Preprocessor Macros
    3. Add a macro defined as `SNOWPLOW_NO_IFA=1`
    4. Remember: it must be added in the Build Settings of the SnowplowTracker framework. If you set it in the app's Build Settings it won't work.

The user has the ability to limit ad-tracking from the device's Settings. If the user enable the limitations the tracker will not be able to track the IDFA.

## API Reference

For documentation detailing the entire Objective-C tracking SDK, please refer to the API reference found [here](https://snowplow.github.io/snowplow-objc-tracker/).
