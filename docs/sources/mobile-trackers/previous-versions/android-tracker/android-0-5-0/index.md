---
title: "Android (0.5.0)"
date: "2020-03-02"
sidebar_position: 960
---

## Tracker

## 1. Overview

The [Snowplow Android Tracker](https://github.com/snowplow/snowplow-android-tracker) allows you to track Snowplow events from your Android applications and games. It supports applications using the Android SDK 11 and above.

The tracker should be straightforward to use if you are comfortable with Java development; its API is modelled after Snowplow's [Python Tracker](/docs/sources/python-tracker/index.md) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [Android Tracker Setup](/docs/sources/mobile-trackers/installation-and-set-up/index.md?platform=android#installing-1) guide before continuing.

**NOTE**: The Tracker should only ever be setup as a singleton object. Due to the way it stores and reads information and the creation of persistent background services, creating more than one Tracker can cause a plethora of race conditions.

1. Double (or more) sending of events.
2. Constant session expiration (as old Tracker services continually fail to see any new events being created).

### 1.1. Demo App

If you would like to see the Tracker in action you can download our demonstration android app [here](http://dl.bintray.com/snowplow/snowplow-generic/snowplow-demo-app-release-0.2.1.apk). You will need to enable installation of applications from [unknown sources](http://developer.android.com/distribute/tools/open-distribution.html).

Within the app you will simply need to supply an endpoint and hit start! The application will then send all types of events available to the tracker to this endpoint.

For a walkthrough go [here](https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough/6d8f6c2bfe27c60e9589976d9a6dd57f56f9f2ba).

### 1.2. Client Sessions

To activate client sessionization please enter the following builder arguments to your tracker:

```java
Tracker tracker = new Tracker.TrackerBuilder( ... )
    .sessionContext(true)     // To use the session context
    .sessionCheckInterval(10) // Checks every 10 seconds (default is 15)
    .foregroundTimeout(300)   // Timeout after 5 minutes (default is 10)
    .backgroundTimeout(120)   // Timeout after 2 minutes (default is 5)
    .build();
```

Once sessionization has been turned on several things will begin to happen:

- A client_session context will be appended to each event that is sent
- A polling check will be started to check whether or not the session has timed out
    - You can configure how often to check with the sessionCheckInterval method
    - If your app is in the foreground and no events have been sent for the foregroundTimeout period, the session will be updated and a new session started
    - There is a separate timeout if your application is detected to be in the background
- Each time the session information is updated it is stored locally in a private file which should persist for the life of the application
- Each time an event is sent from the Tracker, both timeouts for the session are reset
- Session information will survive for the life of the application, i.e. until it is uninstalled from the Android device.

An important note here is that the tracker does not automatically detect if the application is in the background or not from a library standpoint. You will have to update your applications onPause() and onResume() functions to manually flag this change. The following samples can be copied into an application activity to set the background state of the application for the session checker:

```java
@Override
protected void onPause() {
    super.onPause();
    tracker.getSession().setIsBackground(true);
}

@Override
protected void onResume() {
    super.onResume();
    tracker.getSession().setIsBackground(false);
}
```

## 2 Initialization

Assuming you have completed the [Android Tracker Setup](/docs/sources/mobile-trackers/installation-and-set-up/index.md?platform=android#installing-1) for your project, you are now ready to initialize the Android Tracker.

#### 2.1 Importing the module

Import the Android Tracker's classes into your Android code like so:

```java
import com.snowplowanalytics.snowplow.tracker.*;
```

That's it - you are now ready to initialize a Tracker instance.

#### 2.2 Creating a Tracker

To instantiate a tracker in your code (can be global or local to the process being tracked) simply instantiate the `Tracker` interface with one of the following:

```java
// Create an Emitter
Emitter e1 = new Emitter
        .EmitterBuilder("com.collector.acme", getContext())
        .build();

// Make and return the Tracker object
Tracker t1 = new Tracker
        .TrackerBuilder(e1, "myNamespace", "myAppId", getContext())
        .build();
```

This is the most basic Tracker creation possible. Note that `getContext()` is an Android global function. You can expand on this creation with the following builder options:

```java
// Create an Emitter
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", getContext())
        .build();

// Create a Tracker with all options
Tracker t2 = new Tracker
        .TrackerBuilder(e2, "myNamespace", "myAppId", getContext())
        .base64(false) // Optional - defines if we use base64 encoding
        .platform(DevicePlatforms.Mobile) // Optional - defines what platform the event will report to be on
        .subject(new Subject.SubjectBuilder().build()) // Optional - a subject which contains values appended to every event
        .build();
```

As you can see there is a fair amount of modularity to the Trackers creation.

The below are required arguments for the `TrackerBuilder({{ ... }})` segment of the constructor:

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `emitter` | The emitter which sends the events | Yes |
| `namespace` | The name of the tracker instance | Yes |
| `appId` | The application ID | Yes |
| `context` | The application context | Yes |

We also have several extra builder options:

| **Function** | **Description** | **Options** | **Default** |
| --- | --- | --- | --- |
| `subject` | The subject that defines a user | `Subject, null` | `null` |
| `platform` | The platform that the Tracker is running on | `DevicePlatforms.{{ Enum Option }}` | `DevicePlatforms.Mobile` |
| `base64` | Whether to enable [Base64 encoding](https://en.wikipedia.org/wiki/Base64) | `True, False` | `True` |
| `level` | The level of logging to do | `LogLevel.{{ Enum Option }}` | `LogLevel.OFF` |
| `sessionContext` | Whether to enable sessionization | `True, False` | `False` |
| `foregroundTimeout` | The session foreground timeout | Any valid `Long` | `600` |
| `backgroundTimeout` | The session background timeout | Any valid `Long` | `300` |
| `sessionCheckInterval` | The session check interval | Any valid `Long` | `15` |
| `threadCount` | The amount of threads to use | Any valid `Integer` | `10` threads |
| `timeUnit` | The TimeUnit that time measurements are in | `TimeUnit.{{ Enum Option }}` | `TimeUnit.SECONDS` |

#### 2.2.1 Constructor Options Explained

#### Required

- `emitter` : The pre created Emitter object which is required for all sending and storing of events by the Tracker. See [Emitters](#5-sending-eventemitter) for information.
- `namespace` : The name of this Tracker instance to include with events sent to the collector.
- `appId` : The ID of this application to include with events sent to the collector.
- `context` : The Android Application context object.

#### Event Decoration

- `subject` : An optional Subject object which will add extra decoration to events sent from the Tracker.
- `platform` : The platform that the Tracker is running on (defaults to `MOBILE`)
- `base64` : Whether to encode `unstructured` events and `custom contexts` in base64 formatting.

#### Session Parameters

- `sessionContext` : Needs to be set to `True` if you wish to activate any of the Trackers Sessionization functionality.
- `foregroundTimeout` : The amount of time that needs to elapse without any events being tracked before the session is incremented (while application is in the foreground).
- `backgroundTimeout` : The amount of time that needs to elapse without any events being tracked before the session is incremented (while application is in the background).
- `sessionCheckInterval` : How often the Tracker queries the session object to see if it needs to be incremented. It is currently set to 15 seconds.
- `timeUnit` : The unit of time that the previous three options are computed on. By default it is in `SECONDS`, as such to set a `sessionCheckInterval` of 2 minutes you would need to put in `120` for that option. Or you could change the `timeUnit` to be `MINUTES` and put a `2` instead.

#### Functional Settings

- `threadCount` : The amount of threads that the Tracker will have available to it to process information in. By default we use 10 Threads, however it is recommended to figure out the optimal amount of Threads on a device by device basis as more Threads will have a direct correlation with performance.
- `level` : The amount of logging done by the Tracker.

### 2.3 Tracker Functions

#### 2.3.1 `getEmitter`

Returns the emitter to which the tracker will send events. See [Emitters](#5-sending-eventemitter) for more on emitter configuration.

#### 2.3.2 `getSubject`

Returns the user which the Tracker will track. This must be an instance of the [Subject](#31-subject-setter-functions) class. You don't need to set this during Tracker construction; you can use the `Tracker.setSubject` method afterwards. In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

#### 2.3.3 `getNamespace`

Returns the `namespace` argument attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### 2.3.4 `getAppId`

Returns the `appId` argument that you passed in Tracker construction.

#### 2.3.5 `getBase64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` builder option.

#### 2.3.6 `getPlatform`

Returns the 'platform' that was set in Tracker construction, the builder allows you to pick from a list of allowed platforms which define what type of device/service the event is being sent from.

#### 2.3.7 `getSession`

Returns the `session` object created for the Tracker (if `sessionContext` was enabled).

#### 2.3.8 `getDataCollection`

Returns the state of data collection in the Tracker; either `True` or `False`.

#### 2.3.9 `getLogLevel`

Returns the `LogLevel` being used by the Tracker.

#### 2.3.10 `getThreadCount`

Returns the amount of threads that the tracker is consuming.

#### 2.3.11 `getTrackerVersion`

Returns this Trackers version as a String.

#### 2.3.12 Change the tracker's platform with `setPlatform`

You can change the platform by calling:

```java
tracker.setPlatform(DevicePlatforms.Mobile);
// OR
tracker.setPlatform(DevicePlatforms.Desktop);
// OR
tracker.setPlatform(DevicePlatforms.{{ Valid Enum Option }})
```

There are several different DevicePlatforms options to choose from.

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/events/index.md).

#### 2.3.13 Change the tracker's subject with `setSubject`

You can change the subject by creating a new `Subject` object and then calling:

```java
tracker.setSubject(newSubject);
```

See [Adding extra data: the Subject class](#3-adding-extra-data-the-subject-class) for more information on the `Subject`.

#### 2.3.14 Change the tracker's emitter with `setEmitter`

You can change the emitter by creating a new `Emitter` object and then calling:

```java
tracker.setEmitter(newEmitter);
```

### 2.4 Extra Tracker Functions

These are extra functions for controlling the Tracker. The Tracker is designed to be run without ever using any of these functions however they are there for any special use cases where you need to shutdown or otherwise control the Tracker.

For example if you wish to artificially extend the time a session is active you can simply `pauseSessionChecking` for an undetermined amount of time. To resume automatic session checking and updating simply run `resumeSessionChecking`.

#### 2.4.1 `resumeSessionChecking`

This function resumes a polling session checker service. This will query the Trackers session object at pre-configured intervals to see whether or not the session needs to be updated if it has not been accessed within a certain amount of time.

This function is started if the argument to `.sessionContext` is `True`, and will only ever be able to run if this argument is `True`.

```java
tracker.resumeSessionChecking();
```

#### 2.4.2 `pauseSessionChecking`

This functions stops the session checker from running. Essentially preventing the current session from ever timing out. Please note that if the application is restarted this paused state will not persist and checking will begin again.

```java
tracker.pauseSessionChecking();
```

#### 2.4.3 `resumeEventTracking`

If event tracking has been switched off this will reinstate the Tracker back to full operation. This means that:

- Events will start being stored in the database again.
- Events will be sent to the collector.
- Session checking will begin to occur again (if enabled)

```java
tracker.resumeEventTracking();
```

#### 2.4.4 `pauseEventTracking`

If event tracking is switched on (it is by default), then the Tracker will have all event tracking paused. What this means is that:

- No events will be stored in the database or tracked at all.
- No events will be sent to the collector.
- No session checks will occur.

Essentially the entire Tracker will halt operation until event tracking is turned back on.

```java
tracker.pauseEventTracking();
```

## 3. Adding extra data: the Subject class

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event. The Subject appended to the Tracker allows you to easily add information to each event that is sent from the Tracker.

### 3.1 Subject setter functions

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- [`setUserId`](#311-set-user-id-withsetuserid)
- [`setScreenResolution`](#312-set-screen-resolution-withsetscreenresolution)
- [`setViewport`](#313-set-viewport-dimensions-withsetviewport)
- [`setColorDepth`](#314-set-color-depth-withsetcolordepth)
- [`setTimezone`](#315-set-timezone-withsettimezone)
- [`setLanguage`](#316-set-the-language-withsetlanguage)
- [`setIpAddress`](#317setipaddress)
- [`setUseragent`](#318setuseragent)
- [`setNetworkUserId`](#319setnetworkuserid)
- [`setDomainUserId`](#3110setdomainuserid)
- [`setAdvertisingID`](#3111setadvertisingid)
- [`setCarrier`](#3112setcarrier)
- [`setLocation`](#3113setlocation)
- [`setDefaultScreenResolution`](#3114setdefaultscreenresolution)

Here are some examples:

```java
Subject s1 = new Subject.SubjectBuilder().build();

s1.setUserID("Kevin Gleason");
s1.setLanguage("en-gb");
s1.setScreenResolution(1920, 1080);
```

After that, you can add your Subject to your Tracker like so:

```java
Tracker t1 = new Tracker
        .TrackerBuilder(emitter, "myNamespace", "myAppId")
        .subject(s1) // Include your subject here!
        .build();

// Or you can set the subject after creation
// This will also override any currently set Subject object

t1.setSubject(s1);
```

To update the Trackers subject without changing the subject attached already you can use the following:

```java
t1.getSubject().setUserId("Gleason Kevin"); // Because object references are passed by value in Java
```

#### 3.1.1 Set user ID with `setUserId`

You can set the user ID to any string:

```java
setUserId(String userId)
```

Example:

```java
subj.setUserId("alexd");
```

#### 3.1.2 Set screen resolution with `setScreenResolution`

If your Java code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```java
setScreenResolution(int width, int height)
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
subj.setScreenResolution(1366, 768);
```

#### 3.1.3 Set viewport dimensions with `setViewport`

If your Java code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```java
setViewport(int width, int height)
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
subj.setViewport(300, 200);
```

#### 3.1.4 Set color depth with `setColorDepth`

If your Java code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```java
setColorDepth(int depth)
```

The number should be a positive integer, measured in bits per pixel. Example:

```java
subj.setColorDepth(32);
```

#### 3.1.5 Set timezone with `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```java
setTimezone(String timezone)
```

The timezone should be a string:

```java
subj.setTimezone("Europe/London");
```

#### 3.1.6 Set the language with `setLanguage`

This method lets you pass a user's language in to Snowplow:

```java
setLanguage(String language)
```

The language should be a string:

```java
subj.setLanguage("en");
```

### 3.1.7 `setIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```java
setIpAddress(String ipAddress)
```

The IP address should be a string:

```java
subj.setIpAddress("127.0.0.1");
```

### 3.1.8 `setUseragent`

This method lets you pass a useragent in to Snowplow:

```java
setUseragent(String useragent)
```

The useragent should be a string:

```java
subj.setUseragent("Agent Smith");
```

### 3.1.9 `setNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```java
setNetworkUserId(String networkUserId)
```

The network user id should be a string:

```java
subj.setNetworkUserId("network-id");
```

### 3.1.10 `setDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```java
setDomainUserId(String domainUserId)
```

The domain user id should be a string:

```java
subj.setDomainUserId("domain-id");
```

### 3.1.11 `setAdvertisingID`

This method lets you set the Advertising ID

```java
setAdvertisingID(Context context)
```

You will need to pass in the application's context as a parameter.

```java
subj.setAdvertisingID(context);
```

### 3.1.12 `setCarrier`

This method lets you set the mobile carrier.

```java
setCarrier(Context context)
```

You will need to pass in the application's context as a parameter.

```java
subj.setCarrier(context);
```

### 3.1.13 `setLocation`

This method lets you set the mobile location.

```java
setLocation(Context context)
```

You will need to pass in the application's context as a parameter.

```java
subj.setLocation(context);
```

### 3.1.14 `setDefaultScreenResolution`

This method lets you set the default screen resolution using the application context.

```java
setDefaultScreenResolution(Context context)
```

You will need to pass in the application's context as a parameter.

```java
subj.setDefaultScreenResolution(context);
```

### 3.2 Additional contexts sent by this tracker

This Tracker not only appends the [generic](#31-subject-setter-functions) subject information to each event; it will also attempt to gather more specific information about the mobile it is hosted on.

### 3.2.1 `mobile_context`

The `mobile_context` is comprised of the following fields:

- `androidIdfa` -> The host phones unique AdvertisingId
- `carrier` -> The host phones phones network carrier
- `deviceModel` -> The host phones phones model
- `deviceManufacturer` -> The host phones phones manufacturer
- `osVersion` -> The host phones phones operating system version
- `osType` -> The host phones phones operating system type

To ensure you gather all of this information you will need to create your Subject with the following argument:

```java
Subject subject = new Subject.SubjectBuilder().context(getContext()).build();
```

Note that `getContext()` is an Android global function. It is needed to grab information that is related to the client specifically.

### 3.2.2 `geolocation_context`

The `geolocation_context` is comprised of the following fields:

- `latitude` -> The host phones latitude measure
- `longitude` -> The host phones longitude measure
- `altitude` -> The host phones altitude measure
- `latitudeLongitudeAccuracy` -> The host phones position accuracy
- `speed` -> The host phones speed
- `bearing` -> The host phones current bearing

To ensure you gather all of this information you will need to create your Subject with the following argument:

```java
Subject subject = new Subject.SubjectBuilder().context(getContext()).build();
```

Note that `getContext()` is an Android global function.

You will also need to include the following in your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

This will make the functions for checking these metrics available for the tracker to use.

## 3.3 Getting the Android Idfa Code

**NOTE**: For this code to be available you must include the following library dependency:

- \`compile 'com.google.android.gms:play-services-analytics:7.5.0'

The Android Idfa code is a unique identifier for google advertising. You can get this code using this library in two ways:

1. Use the utility function available:

```java
import com.snowplowanalytics.snowplow.tracker.utils.Util;

// Context is your application context object
String androidIdfa = Util.getAdvertisingId(context);
```

Please note that this function will only work when run from a different thread than the UI/Main thread of your application.

1. Get it from the Subject class:

If you created a Tracker Subject with your application's context then the ID will have already been populated.

```java
String androidIdfa = tracker.getSubject().getSubjectMobile().get("androidIdfa");
```

## 4. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the Android Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`track(ScreenView event)`](#42-track-screen-views-withtrackscreenview-event) | Track the user viewing a screen within the application |
| [`track(PageView event)`](#43-track-pageviews-withtrackpageview) | Track and record views of web pages |
| [`track(EcommerceTransaction event)`](#44-track-ecommerce-transactions-withtrackecommercetransaction) | Track an ecommerce transaction and its items |
| [`track(Structured event)`](#45-track-structured-events-withtrackstructuredevent) | Track a Snowplow custom structured event |
| [`track(Unstructured event)`](#46-track-unstructured-events-withtrackunstructuredevent) | Track a Snowplow custom unstructured event |
| [`track(TimingWithCategory event)`](#47-track-timing-events-withtracktimingwithcategory-event) | Track a Timing with Category event |

#### 4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `track(XXX)`, where `XXX` is the type of event to track.

#### 4.1.1 SelfDescribingJson

A `SelfDescribingJson` is used as a wrapper around either a `TrackerPayload`, another `SelfDescribingJson` or a `Map` object. After creating the object you want to wrap, you can create a `SelfDescribingJson` using the following:

```java
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

`SelfDescribingJson` is used for recording [custom contexts](#412-custom-contexts) and [unstructured events](#46-track-unstructured-events-withtrackunstructuredevent).

#### 4.1.2 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of a Map object. Each tracking method accepts an additional optional contexts parameter:

```java
t1.track(PageView.builder().( ... ).customContext(List<SelfDescribingJson> context).build());
```

The `customContext` argument should consist of a `List` of `SelfDescribingJson` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](#46-track-unstructured-events-withtrackunstructuredevent).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```json
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

```java
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

#### 4.1.3 Timestamp override

In all the trackers, we offer a way to override the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```java
t1.track(PageView.builder().( ... ).timestamp(1423583655000).build());
```

#### 4.2 Track screen views with `track(ScreenView event)`

Use `track(ScreenView event)` to track a user viewing a screen (or equivalent) within your app. You must use either `name` or `id`. Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | `String` |
| `id` | Unique identifier for this screen | No | `String` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Examples:

```java
t1.track(ScreenView.builder()
    .name("HUD > Save Game")
    .id("screen23")
    .build());

t1.track(ScreenView.builder()
    .name("HUD > Save Game")
    .id("screen23")
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

#### 4.3 Track pageviews with `track(PageView event)`

You can use `track(PageView event)` to track a user viewing a web page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `pageUrl` | The URL of the page | Yes | `String` |
| `pageTitle` | The title of the page | No | `String` |
| `referrer` | The address which linked to the page | No | `String` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Examples:

```java
t1.track(PageView.builder()
    .pageUrl("www.example.com")
    .pageTitle("example")
    .referrer("www.referrer.com")
    .build());

t1.track(PageView.builder()
    .pageUrl("www.example.com")
    .pageTitle("example")
    .referrer("www.referrer.com")
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

#### 4.4 Track ecommerce transactions with `track(EcommerceTransaction event)`

Use `track(EcommerceTransaction event)` to track an ecommerce transaction.

Arguments:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `orderId` | ID of the eCommerce transaction | Yes | `String` |
| `totalValue` | Total transaction value | Yes | `Double` |
| `affiliation` | Transaction affiliation | No | `String` |
| `taxValue` | Transaction tax value | No | `Double` |
| `shipping` | Delivery cost charged | No | `Double` |
| `city` | Delivery address city | No | `String` |
| `state` | Delivery address state | No | `String` |
| `country` | Delivery address country | No | `String` |
| `currency` | Transaction currency | No | `String` |
| `items` | Items in the transaction | Yes | `List<EcommerceTransactionItem>` |
| `items` | Items in the transaction | Yes | `EcommerceTransactionItem...` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

The `items` argument is a `List` of individual `EcommerceTransactionItem` elements representing the items in the e-commerce transaction or it can be a `varargs` argument of many individual items. Note that `track(EcommerceTransaction event)` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`. Each transaction item event will have the same timestamp, order_id, and currency as the main transaction event.

#### 4.4.1 `EcommerceTransactionItem`

To instantiate a `EcommerceTransactionItem` in your code, simply use the following constructor signature:

```java
EcommerceTransactionItem item = EcommerceTransactionItem.builder()
    .itemId("item_id")
    .sku("item_sku")
    .price(1.00)
    .quantity(1)
    .name("item_name")
    .category("item_category")
    .currency("currency")
    .build();
```

These are the fields that can appear as elements in each `EcommerceTransactionItem` element of the transaction item's `List`:

| **Field** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `itemId` | Item ID | Yes | `String` |
| `sku` | Item SKU | Yes | `String` |
| `price` | Item price | Yes | `Double` |
| `quantity` | Item quantity | Yes | `Integer` |
| `name` | Item name | No | `String` |
| `category` | Item category | No | `String` |
| `currency` | Item currency | No | `String` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Example of tracking a transaction containing two items:

```java
// Create some Transaction Items
EcommerceTransactionItem item1 = EcommerceTransactionItem.builder()
    .itemId("item_id_1")
    .sku("item_sku_1")
    .price(1.00)
    .quantity(1)
    .name("item_name")
    .category("item_category")
    .currency("currency")
    .build();

EcommerceTransactionItem item2 = EcommerceTransactionItem.builder()
    .itemId("item_id_2")
    .sku("item_sku_2")
    .price(1.00)
    .quantity(1)
    .name("item_name")
    .category("item_category")
    .currency("currency")
    .build();

// Add these items to a List
List<EcommerceTransactionItem> items = new ArrayList<>();
items.add(item1);
items.add(item2);

// Now Track the Transaction by using this list of items as an argument
tracker.track(EcommerceTransaction.builder()
    .orderId("6a8078be")
    .totalValue(300.00)
    .affiliation("my_affiliate")
    .taxValue(30.00)
    .shipping(10.00)
    .city("Boston")
    .state("Massachusetts")
    .country("USA")
    .currency("USD")
    .items(items)
    .build());

// Or include the items as varargs in the items section
tracker.track(EcommerceTransaction.builder()
    .orderId("6a8078be")
    .totalValue(300.00)
    .affiliation("my_affiliate")
    .taxValue(30.00)
    .shipping(10.00)
    .city("Boston")
    .state("Massachusetts")
    .country("USA")
    .currency("USD")
    .items(item1, item2)
    .build());
```

#### 4.5 Track structured events with `track(Structured event)`

Use `track(Structured event)` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | `String` |
| `action` | Defines the type of user interaction which this event involves | Yes | `String` |
| `label` | A string to provide additional dimensions to the event data | No | `String` |
| `property` | A string describing the object or the action performed on it | No | `String` |
| `value` | A value to provide numerical data about the event | No | `Double` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Examples:

```java
t1.track(Structured.builder()
    .category("shop")
    .action("add-to-basket")
    .label("Add To Basket")
    .property("pcs")
    .value(2.00)
    .build());

t1.track(Structured.builder()
    .category("shop")
    .action("add-to-basket")
    .label("Add To Basket")
    .property("pcs")
    .value(2.00)
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

#### 4.6 Track unstructured events with `track(Unstructured event)`

Custom unstructured events are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `track(Unstructured event)` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `eventData` | The properties of the event | Yes | `SelfDescribingJson` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Example event json to track:

```json
{
  "schema": "iglu:com.acme/save_game/jsonschema/1-0-0",
  "data": {
    "levelName": "Barrels o' Fun",
    "levelIndex": 23
  }
}
```

How to set it up?

```java
// Create a Map of your event data
Map<String, Object> eventMap = new HashMap<>();
eventMap.put("levelName", "Barrels o' Fun")
eventMap.put("levelIndex", 23);

// Create your event data
SelfDescribingJson eventData = new SelfDescribingJson("iglu:com.acme/save_game/jsonschema/1-0-0", eventMap);

// Track your event with your custom event data
t1.track(Unstructured.builder()
    .eventData(eventData)
    .build();

// OR

t1.track(Unstructured.builder()
    .eventData(eventData)
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build();
```

For more on JSON schema, see the [blog post](https://snowplow.io/blog/2014/05/15/introducing-self-describing-jsons/).

#### 4.7 Track timing events with `track(TimingWithCategory event)`

Use `track(TimingWithCategory event)` to track an event related to a custom timing.

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `category` | The category of the timed event | Yes | `String` |
| `label` | The label of the timed event | No | `String` |
| `timing` | The timing measurement in milliseconds | Yes | `Integer` |
| `variable` | The name of the timed event | Yes | `String` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |

Examples:

```java
t1.track(TimingWithCategory.builder()
    .category("category")
    .variable("variable")
    .timing(1)
    .label("label")
    .build());

t1.track(TimingWithCategory.builder()
    .category("category")
    .variable("variable")
    .timing(1)
    .label("label")
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

## 5. Sending event: `Emitter`

Events are sent using an `Emitter` class. You can initialize a class with a collector endpoint URL with various options to choose how these events should be sent. Here are the `Emitter` interfaces that can be used:

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .method(HttpMethod.GET) // Optional - Defines how we send the request
        .option(BufferOption.Single) // Optional - Defines how many events we bundle in a POST
        .security(RequestSecurity.HTTPS) // Optional - Defines what protocol used to send events
        .callback(new EmitterCallback() {...})
        .build();
```

The `Context` is used for caching events in a [SQLite database](http://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html) in order to avoid losing events to network related issues.

Don't confuse the Android context with Snowplow's own custom contexts - they are completely separate things.

The below are required arguments for the `'EmitterBuilder({{ ... }})'` segment of the constructor:

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `uri` | The collector endpoint URI events will be sent to | Yes |
| `context` | Used to use to open or create an SQLite database | Yes |

We also have several extra builder options such as:

| **Function** | **Description** | **Options** | **Default** |
| --- | --- | --- | --- |
| `method` | The request method to use | `HttpMethod.GET, .POST` | `HttpMethod.POST` |
| `option` | The amount of events sent in a POST request | `BufferOption.{{ Enum Option}}` | `BufferOption.DefaultGroup` |
| `security` | Whether to send over HTTP or HTTPS | `RequestSecurity.HTTP, .HTTPS` | `RequestSecurity.HTTP` |
| `callback` | A callback to output successes and failures | `new RequestCallback{ ... }` | `null` |
| `tick` | The time between emitter ticks | Any positive int | `5` |
| `sendLimit` | The maximum amount of events to get from the DB | Any positive int | `250` |
| `emptyLimit` | The amount of times the emitter can be empty | Any positive int | `5` |
| `byteLimitGet` | The maximum amount of bytes to send in a GET | Any positive int | `40000` |
| `byteLimitPost` | The maximum amount of bytes to send in a POST | Any positive int | `40000` |
| `timeUnit` | The TimeUnit that time measurements are in | `TimeUnit.{{ Enum Option }}` | `TimeUnit.SECONDS` |

### 5.1 Emitter Constructor Explained

#### Required

- `uri` : The collector endpoint that all events will be sent to. Needs to be the raw path in the sense that you will not include any `http://` or `https://` with the address. Rather something like: `www.fake.io` in place of `http://www.fake.io`. The http security setting is configured in a seperate option.
- `context` : The Android Application context object.

#### Sending

- `method` : Whether to send requests via `GET` or `POST`; essentially whether to send each event individually or to send many events together in a `POST`. The default `POST` setting is recommended as it has huge performance gains over sending individually as a `GET`.
- `option` : How many events can be parcelled together in a `POST`, this can be increased to a maximum of `25` per event. If you require larger volumes please raise a ticket to have this limit increased!
- `security` : Whether to send events via `HTTP` or `HTTPS`.
- `callback` : A custom callback method that will be called after each emitter send loop, currently the only variables included are the count of successfully and unsuccessfully sent events.
- `byteLimitGet` : Allows you to set an upper limit for the maximal size of a single `GET` request. Meaning that if an event exceeds this size we will attempt to send it but will then delete it from the database regardless of success to send.
- `byteLimitPost` : Allows you to set an upper limit for the maximal size of a single `POST` request. Meaning that if an event exceeds this size we will attempt to send it but will then delete it from the database regardless of success to send.

#### Functional Settings

- `tick` : The interval at which the emitter will check for more events.
- `timeUnit` : The timeunit that the aforementioned `tick` is measured in. By default we measure this in seconds.
- `sendLimit` : The upper limit of events that can be grabbed from the database per sending session, this in place to avoid consuming overt amounts of memory in case of huge event ingress. On weaker devices this can be tuned down to and on beefier devices can be greatly increased.
- `emptyLimit` : The amount of times that the emitter is allowed to fail a check before it will release its Thread back to the pool.

### 5.2 How the Emitter works

The Emitter is configured and setup to run as a background process so it never blocks on the Main Thread or on the UI Thread of the device it is on.

The current Emitter flow goes as follows:

1. Emitter is created
2. Emitter will check if it has access to the internet
3. If it is it will begin a recurring check for events to send to the configured collector
    - This defaults to every 5 seconds
4. If there are events in the SQlite database the emitter will grab up to 250 (default) events from the database and begin sending.
5. Once it has finished sending it will again check for events
6. If there are no events to be sent 5 (default) times in a row, it will shut itself down
7. On receiving a new event the Emitter checks again if it is online and will then begin sending again
8. If there are only errors in sending, the events will not be deleted from the database and the emitter will then be shutdown
    - If there are some successes it will not shutdown.

### 5.3 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the Emitter buffers up to 10 events together before sending them; only available if you are using POST as your request type.

```java
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

### 5.4 Choosing the HTTP method

Snowplow supports receiving events via both GET and POST requests. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

You can set the HTTP method in the Emitter constructor:

```java
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

### 5.5 Emitter callback

If an event fails to send because of a network issue, you can choose to handle the failure case with a callback class to react accordingly. The callback class needs to implement the `EmitterCallback` interface in order to do so. Here is a sample bit of code to show how it could work:

```java
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

### 5.6 Emitter Flush

If you want to ensure that there are no events left in the local database for sending simply run the emitter `flush()` function like so:

```java
tracker.getEmitter().flush();
```

This will attempt to start the emitter process; however it will fail if the emitter is already running or if the application is offline.

## 6. Logging

Logging in the Tracker is done using our own Logger class: '/utils/Logger.java'. All logging is actioned based on what `LogLevel` was set in the Tracker creation. This level can be configured to `VERBOSE`, `DEBUG`, `ERROR` or `OFF`. By default logging is not enabled.

* * *

## Integration

## 1. Classic Tracker

You will need to have imported the following library into your project:

```gradle
dependencies {
    ...
    // Snowplow Android Tracker Classic
    compile 'com.snowplowanalytics:snowplow-android-tracker-classic:0.5.4'
}
```

Example class to return an Android Classic Tracker:

```java
import com.snowplowanalytics.snowplow.tracker.*;
import android.content.Context;

public class TrackerBuilderClassic {

    public static Tracker getClassicTracker(Context context) {
        Emitter emitter = getClassicEmitter(context);
        Subject subject = getSubject(context);  // Optional

        return new Tracker
            .TrackerBuilder(emitter, "your-namespace", "your-appid", context,
                com.snowplowanalytics.snowplow.tracker.classic.Tracker.class)
            .subject(subject) // Optional
            .build();
    }

    private static Emitter getClassicEmitter(Context context) {
        return new Emitter
            .EmitterBuilder("notarealuri.fake.io", context,
                com.snowplowanalytics.snowplow.tracker.classic.Emitter.class)
            .build();
    }

    private static Subject getSubject(Context context) {
        return new Subject
            .SubjectBuilder()
            .context(context)
            .build();
    }
}
```

## 2. RxJava tracker

You will need to have imported the following library into your project:

```gradle
dependencies {
    ...
    // Snowplow Android Tracker Rx
    compile 'com.snowplowanalytics:snowplow-android-tracker-rx:0.5.4'
}
```

Example class to return an Android RxJava Tracker:

```java
import com.snowplowanalytics.snowplow.tracker.*;
import android.content.Context;

public class TrackerBuilderRx {

    public static Tracker getRxTracker(Context context) {
        Emitter emitter = getRxEmitter(context);
        Subject subject = getSubject(context); // Optional

        return new Tracker
            .TrackerBuilder(emitter, "your-namespace", "your-appid", context,
                com.snowplowanalytics.snowplow.tracker.rx.Tracker.class)
            .subject(subject) // Optional
            .build();
    }

    private static Emitter getRxEmitter(Context context) {
        return new Emitter
            .EmitterBuilder("notarealuri.fake.io", context,
                com.snowplowanalytics.snowplow.tracker.rx.Emitter.class)
            .build();
    }

    private static Subject getSubject(Context context) {
        return new Subject
            .SubjectBuilder()
            .context(context)
            .build();
    }
}
```

## 3. Tracking Events

Once you have successfully built your Tracker object you can track events with calls like the following:

```java
Tracker tracker = getClassicTracker(context);
tracker.track(ScreenView.builder().name("screenName").id("screenId").build());
```

For an outline of all available tracking combinations have a look [here](https://raw.githubusercontent.com/snowplow/snowplow-android-tracker/master/snowplow-demo-app/src/main/java/com/snowplowanalytics/snowplowtrackerdemo/utils/TrackerEvents.java).

## 4. Application Focus

The Tracker Session object can be tuned to timeout in `foreground` and `background` scenarios, but you are required to tell us when your application is in these states. Unfortunately it is not possible to do so from a library standpoint.

The current implementation we are using is to override the `onPause()` and `onResume()` functions of an application activity to notify the session when we change states.

```java
@Override
protected void onPause() {
    super.onPause();
    tracker.getSession().setIsBackground(true);
}

@Override
protected void onResume() {
    super.onResume();
    tracker.getSession().setIsBackground(false);
}
```

* * *

## Testing locally

## 1. Testing Locally

To test the Android Tracker locally we use a combination of two softwares: [Mountebank](http://www.mbtest.org/) and [Ngrok](https://ngrok.com/).

Mountebank provides a local webserver which we can apply `imposters` to run on different ports. An `imposter` in this context is just a mock which, for our purposes, does some light validation to ensure that the event it receives is indeed a valid Snowplow Event. This is the [imposter](https://raw.githubusercontent.com/snowplow/snowplow-android-tracker/0.5.0/testing/imposter.json) that we use for validating our events.

We then get Ngrok to listen on the same port as the `imposter` port. This provides two things:

- A clean easy to use Web Interface with details about each event.
    - Found at `http://localhost:4040/`
- An endpoint that you can send to from anywhere.

When you visit the Ngrok Web Interface you will see the tunnel URL that you can use to send events to.

To actually set this up you will need to follow these steps:

```bash
 host$ git clone https://github.com/snowplow/snowplow-android-tracker.git
 host$ cd snowplow-android-tracker
 host$ vagrant up && vagrant ssh
guest$ cd /vagrant
guest$ chmod +x ./testing/setup.bash
guest$ ./testing/setup.bash
```

The `setup.bash` script starts Mountebank and starts the imposter we want and then starts Ngrok listening on the imposter port.

Once you have it running you can supply the tunnel URL for all logging of events until you are ready to switch to a collector!

## 2. Common Issues

This section will detail how to handle common problems with running the local testing setup.

### 2.1 Port Conflicts

If you are already using ports `2525` or `4040` your vagrant up will fail. Easiest way to resolve this is to stop any services running on these ports and then attempt to vagrant up again.

However if this is not an option you will need to edit the `Vagrantfile` in the root of the project:

```bash
config.vm.network "forwarded_port", guest: 4040, host: 4040 ## Change the host to something free
config.vm.network "forwarded_port", guest: 2525, host: 2525 ## Change the host to something free
```

### 2.2 Sending failures

If you have successfully started Ngrok and you have an endpoint but your events are not getting there chances are that Mountebank as failed to start properly.

To resolve:

```bash
guest$ curl -X DELETE http://localhost:2525/imposters/4545
guest$ curl -i -X POST -H 'Content-Type: application/json' -d@/vagrant/testing/imposter.json http://localhost:2525/imposters
```

This will delete the imposter and create a new one in its place.

If you you cannot get to the Ngrok Web Interface at all the best way to resolve is the following:

```bash
host$ cd snowplow-android-tracker
host$ vagrant halt
host$ vagrant up && vagrant ssh
guest$ cd /vagrant
guest$ ./testing/setup.bash
```

This simply stops the VM and restarts it.
