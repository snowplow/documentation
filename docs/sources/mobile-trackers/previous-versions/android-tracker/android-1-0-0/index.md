---
title: "Android (1.0.0)"
date: "2020-03-05"
sidebar_position: 920
sidebar_label: "Android (1.0.0)"
description: "Documentation for Android Tracker version 1.0.0."
keywords: ["android 1.0.0", "tracker"]
---

## Installation

In order to add the tracker to your project, you must add it as a dependency.

### Gradle

If you use Gradle, here's how to add the tracker to your project.

Add into your `build.gradle` file:

```gradle
dependencies {
    ...
    // Snowplow Android Tracker
    compile 'com.snowplowanalytics:snowplow-android-tracker:1.0.0@aar'
}
```

This will install version 1.0.0 of the Android tracker. If you would like to ensure that all bug fixes and patches for version 1.0.0 are installed, simply change 1.0.0 into 1.0.+.

```gradle
dependencies {
    ...
    // Snowplow Android Tracker
    compile 'com.snowplowanalytics:snowplow-android-tracker:1.0.+@aar'
}
```

**Note**: no breaking changes will occur in the '1.0.x' space.

A complete Gradle file may look like this:

```gradle
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'android.arch.lifecycle:extensions:$project.archLifecycleVersion'
    implementation 'com.android.support:support-v4:28.0.0'
    implementation 'com.android.support:appcompat-v7:28.0.0'

    // Optional Google Analytics Library
    // - Required to get the IDFA Code
    implementation 'com.google.android.gms:play-services-analytics:16.0.1'

    // Required Dependency for the Tracker
    implementation 'com.squareup.okhttp3:okhttp:3.4.1'

    // Tracker Import
    implementation 'com.snowplowanalytics:snowplow-android-tracker:1.0.0@aar'
}
```

### Demo apps

With the tracker we've included a demo app that shows an example of how to integrate the tracker.

For general testing, [Snowplow Mini](https://github.com/snowplow/snowplow-mini) can be used as an easily deployable collector with a live web interface for viewing received events.

The app can be run in the Android Studio emulator or on an actual device.

Simply enter the endpoint of the collector in the app's interface once it's launched and press `"send events"`!

## Quick Start

Add the following snippet to a file (e.g. `SnowplowTracker.java`):

```java
import com.snowplowanalytics.snowplow.tracker.*;
import android.content.Context;

public class SnowplowTrackerBuilder {

    public static Tracker getTracker(Activity activity, Context context) {
        Emitter emitter = getEmitter(context);
        Subject subject = getSubject(context); // Optional

        return Tracker.init(new Tracker.TrackerBuilder(emitter, "your-namespace", "your-appid", context)
            .subject(subject) // Optional
            .build()
        ).setLifecycleHandler(activity);
    }

    private static Emitter getEmitter(Context context) {
        return new Emitter.EmitterBuilder("notarealuri.fake.io", context)
            .build();
    }

    private static Subject getSubject(Context context) {
        return new Subject.SubjectBuilder()
            .context(context)
            .build();
    }
}
```

### Permissions

To send the events, you need to update your AndroidManifest.xml with the following permission:

```xml
<uses-permission android:name="android.permission.INTERNET" /> 
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

If you want to send location information with each event you will need to add the following permissions to your AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### Send events

Now you can try to track events:

```java
Tracker tracker = SnowplowTrackerBuilder.getTracker(activity, context);
tracker.track(ScreenView.builder().name("screenName").id("screenId").build());
```

## Tracker structure

Here we'll explain the purpose of the classes provided in the tracker.

### Emitter

Responsible for all the storage, networking and scheduling required to ensure events are sent to a collector.

Details like the collector endpoint and sending timeout lengths are set here.

### Tracker

`Tracker` is the class where you can find the methods available for tracking events. This is also where all parts of the tracker are brought together, i.e. within `Tracker` you must set the associated emitter, subject, etc.

### Payload

`Payload` is simply a key-value store used for constructing events.

### SelfDescribingJson

`SelfDescribingJson` is the class used for making self-describing JSONs (SDJs).

An SDJ has a `schema` field that holds a URI (string) that identifies the structure of the data nested in the `data` field.

All events sent to the collector are self-describing JSONs.

When sending your own custom events, you will want to create a `SelfDescribingJson` object given two arguments: the schema, and a `Map<String, String>` or `Map<String, Object>` that holds the data you'd like to track.

### Subject

A "subject" represents an individual user that is being tracked. It is used to track data that persists with a user like timezone, user ID, platform, etc.

### Event

This is where all events are found, the available classes are:

- PageView
- Structured
- Unstructured
- ScreenView
- ConsentWithdrawn
- ConsentGranted
- ConsentDocument
- Timing
- EcommTransaction
- EcommTransactionItem
- NotificationContent
- PushNotification

Events are sent by providing them as arguments to the tracking methods found in `Tracker`.

### RequestCallback

This is a class that defines callbacks that are called when an emitter either fails or succeeds to send requests.

## Tracking basic methods

### Creating an emitter

Every tracker must have an emitter in order to send events.

Note: the URL endpoint is the only required parameter.

Here's an example that creates an emitter:

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .method(HttpMethod.GET) // Optional - Defines how we send the request
        .option(BufferOption.Single) // Optional - Defines how many events we bundle in a POST
        .security(RequestSecurity.HTTPS) // Optional - Defines what protocol used to send events
        .tls(TLSVersion.TLSv1_2) // Optional - Defines what TLS versions are used for the request
        .callback(new EmitterCallback() {...})
        .build();
```

### Creating a tracker

To instantiate a tracker in your code simply instantiate the `Tracker` class with the following builder pattern:

```java
// Create a Tracker with all options
Tracker.init(new Tracker
  .TrackerBuilder(e2, "myNamespace", "myAppId", getContext())
  .base64(false) // Optional - defines if we use base64 encoding
  .platform(DevicePlatforms.Mobile) // Optional - defines what platform the event will report to be on
  .subject(new Subject.SubjectBuilder().build()) // Optional - a subject which contains values appended to every event
  .build()
);
```

### Sending events

The following methods are available for sending events from the tracker:

### Attaching contexts to events

Contexts augment events with additional information. The tracker has standard contexts for automatically attaching useful information like geolocation, session, or app version/build to every event.

Each event has an argument for custom contexts in order to attach information that isn't covered by standard contexts.

The custom context argument should consist of a List of SelfDescribingJson representing an array of one or more contexts. The format of each individual context element is the same as for an unstructured event (referring to the fact that it consists of a schema and data field - they're all self-describing JSONs).

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

The corresponding `Map` can be used to create a `SelfDescribingJson`:

```java
// Create a Map of the data you want to include...
Map<String, String> dataMap = new HashMap<>();
dataMap.put("movie_name", "solaris");
dataMap.put("poster_country", "JP");
dataMap.put("poster_year", "1978");

// Now create your SelfDescribingJson object...
SelfDescribingJson context1 = new SelfDescribingJson("iglu:com.acme/movie_poster/jsonschema/2-1-1", dataMap);
```

Sending the movie poster context with an event looks like this:

```java
// Now add this JSON into a list of SelfDescribingJsons...
List<SelfDescribingJson> contexts = new ArrayList<>();
contexts.add(context1);
```

Note: even if there is only one custom context attached to the event, it still needs to be placed in an array.

## More advanced methods

### Tracking features

#### Event types

##### ScreenView event

Use ScreenView events to track a user viewing a screen (or equivalent) within your app. You must use either name or id:

```java
tracker.track(ScreenView.builder()
    .name("HUD > Save Game")
    .id("screen23")
    .build());
```

##### PageView event

Use PageView events to track a user viewing a web page within your app:

```java
tracker.track(PageView.builder()
    .pageUrl("www.example.com")
    .pageTitle("example")
    .referrer("www.referrer.com")
    .build());
```

##### EcommerceTransaction event

Use an e-commerce transaction event to track things like online purchases. Transaction items are attached to an e-commerce event in order to record individual items in a transaction.

**Note**: that tracking an e-commerce transaction sends multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the items list. Each transaction item event will have the same timestamp, order_id, and currency as the main transaction event.

Here is an example:

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

// Now track the transaction by using this list of items as an argument
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

##### Structured event

Use structured events to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

```java
tracker.track(Structured.builder()
    .category("shop")
    .action("add-to-basket")
    .label("Add To Basket")
    .property("pcs")
    .value(2.00)
    .build());
```

##### Self-describing event

A `SelfDescribingJson` is used as a wrapper around either a `TrackerPayload`, another `SelfDescribingJson` or a `Map` object. After creating the object you want to wrap, you can create a `SelfDescribingJson` and track it like this:

```java
// This is the Map we have created
Map<String, String> eventData = new HashMap<>();
eventData.put("Event", "Data")

// We wrap that map in a SelfDescribingJson before sending it
SelfDescribingJson json = new SelfDescribingJson("iglu:com.acme/example/jsonschema/1-0-0", eventData);

// Now track the event
tracker.track(json);
```

##### Timing event

Use a timing event to track a custom timing:

```java
tracker.track(Timing.builder()
    .category("category")
    .variable("variable")
    .timing(1)
    .label("label")
    .build());
```

##### ConsentGranted event

Consent-granted events are used to track when a user consents to data collection:

```java
t1.track(ConsentGranted.builder()
    .expiry("Monday, 19-Aug-05 15:52:01 UTC")
    .documentVersion("5")
    .documentId("1234")
    .build());
```

##### ConsentWithdrawn event

Consent-withdrawn events are used to track when a user withdraws consent to data collection:

```java
t1.track(ConsentWithdrawn.builder()
    .all(true)
    .build());

t1.track(ConsentWithdrawn.builder()
    .all(false)
    .documentVersion("5")
    .documentId("1234")
    .documentDescription("An example description")
    .documentName("Consent document")
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

##### Consent documents

Consent documents (documents that detail an agreement around data privacy) can be attached to consent events where they're applicable.

When a consent event is sent for collection, the consent documents will be added as contexts.

For example:

```java
// Create some consent documents
ConsentDocument document1 = ConsentDocument.builder()
    .documentId("doc-id1")
    .documentVersion("1")
    .build();

ConsentDocument document2 = ConsentDocument.builder()
    .documentId("doc-id2")
    .documentVersion("1")
    .documentName("document name")
    .documentDescription("document description")
    .build();

// Add these items to a List
List<ConsentDocument> documents = new ArrayList<>();
documents.add(document1);
documents.add(document2);

// Now Track the Transaction by using this list of items as an argument
t1.track(ConsentGranted.builder()
    .expiry("Monday, 19-Aug-05 15:52:01 UTC")
    .documentVersion("5")
    .documentId("1234")
    .documentDescription("An example description")
    .documentName("Consent document")
    .consentDocuments(documents)
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```

#### Session tracking

By default, no client session tracking is activated. Once enabled the tracker will start appending a [client_session](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) context to each event it sends and it will maintain this session information for the life of the application, i.e. as long as the application is installed on the device.

Sessions correspond to tracked user activity. A session expires when no tracking events have occurred for the amount of time defined in a timeout. When a session expires, the session ID is incremented and session checking will stop. There are two timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed).

```java
Tracker.init(new Tracker.TrackerBuilder( ... )
  .sessionContext(true)     // To use the session context
  .sessionCheckInterval(10) // Checks every 10 seconds (default is 15)
  .foregroundTimeout(300)   // Timeout after 5 minutes (default is 10)
  .backgroundTimeout(120)   // Timeout after 2 minutes (default is 5)
  .build()
);
```

##### Foreground and background events

Events can be sent whenever the app is foregrounded and backgrounded.

In order to enable these events, use the builder method `lifecycleEvents` during initialization of the tracker:

```java
Tracker.init(new Tracker.TrackerBuilder(emitter, namespace, appId, this.getApplicationContext())
                .lifecycleEvents(true)
                .build()
);
```

[Foreground events](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/application_foreground/jsonschema/1-0-0) are sent whenever an app is opened or resumed.

[Background events](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/application_background/jsonschema/1-0-0) are sent whenever an app is moved to the background.

Events are not sent on app close since the OS cannot guarantee advance notice of app closing.

#### Standard contexts

These are out-of-the-box tracker options that when enabled will attach useful contexts to every event.

##### Session context

The [session context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) includes sessionization information like user ID and session ID that can be used to relate user activity patterns to events.

```java
Tracker.init(new Tracker.TrackerBuilder( ... )
  .sessionContext(true)     // To use the session context
  .sessionCheckInterval(10) // Checks every 10 seconds (default is 15)
  .foregroundTimeout(300)   // Timeout after 5 minutes (default is 10)
  .backgroundTimeout(120)   // Timeout after 2 minutes (default is 5)
  .build()
);
```

##### Mobile context

The [mobile](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-1-0) context contains information like OS version, device model, carrier and more.

It is enabled when creating the tracker:

```java
Tracker.init(new Tracker.TrackerBuilder(...)
  .mobileContext(true)
  .build()
);
```

##### Geolocation context

The [geolocation context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0) contains information like the coordinates, speed and bearing of the device.

It is enabled when creating the tracker:

```java
Tracker.init(new Tracker.TrackerBuilder(...)
  .geoLocationContext(true)
  .build()
);
```

Note: permissions are required in your application for accessing geolocation information. Make sure to include GPS permissions in `AndroidManifest.xml` and request location access from the user.

### Emitter options

These options are used to fine-tune the emitter.

#### Setting the request method

The request method used to connect to the collector, either: `HttpMethod.GET`, or `HttpMethod.POST`.

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .method(HttpMethod.GET) // Optional - Defines how we send the request
        .build();
```

In a GET request, each event is sent in an individual request. In a POST request, events can be bundled together in one request.

#### Configure the buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the Emitter buffers up to 10 events together before sending them; only available if you are using POST as your request type.

The buffer can be configured when creating the emitter:

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .option(BufferOption.Single) // Optional - Defines how many events we bundle in a POST
        .build();
```

| Option | Description |
| --- | --- |
| Single | Events are sent individually |
| DefaultGroup | Sends events in groups of 10 events or less |
| HeavyGroup | Sends events in groups of 25 events or less |

Note: Buffer options will only ever influence how POST request are sent however. All GET requests will be sent individually.

#### Setting the protocol

The protocol used to connect to the collector, either: `RequestSecurity.HTTP`, or `RequestSecurity.HTTPS`.

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .security(RequestSecurity.HTTPS) // Optional - Defines what protocol used to send events
        .build();
```

#### Setting the TLS version

[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) is a cryptography protocol needed if you've chosen to send events over HTTPS.

To specify a specific version, supply `TLSVersion` (or for multiple versions, `EnumSet<TLSVersion>`) to the `tls` builder method:

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .tls(TLSVersion.TLSv1_2) // Optional - Defines what TLS versions are used for the request
        .build();
```

#### Setting a callback

An emitter callback can be set which will be called with the count of successful and failed events.

First create the callback you'd like to define, and then supply it to an emitter:

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

#### Send limit

The number of events retrieved from storage in the database whenever the emitter needs more to send.

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .sendLimit(250)
        .build();
```

#### GET byte limit

The maximum data size of GET requests made by the emitter to send events.

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .byteLimitGet(40000)
        .build();
```

#### POST byte limit

The maximum data size of POST requests made by the emitter to send events.

```java
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .byteLimitGet(40000)
        .build();
```
