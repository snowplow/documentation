---
title: "Tracking out-of-the-box events with the native mobile trackers"
sidebar_label: "Tracking out-of-the-box events"
date: "2022-08-30"
sidebar_position: 10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To track an event, pass an event to the tracker instance.

For example, tracking a ScreenView:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com")

let event = ScreenView(name: "screen name")
let eventId = tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val tracker = Snowplow.createTracker(
        applicationContext, // Android context
        "appTracker", // namespace
        "https://snowplow-collector-url.com" // Event collector URL
    )

val event = ScreenView("screen")
tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerController tracker = Snowplow.createTracker(
      getApplicationContext(), // Android context
      "appTracker", // namespace
      "https://snowplow-collector-url.com" // Event collector URL
);

ScreenView event = new ScreenView("screen");
tracker.track(event);
```

  </TabItem>
</Tabs>

The tracker makes it easy to track different kinds of data. We provide a range of `Event` classes for tracking out-of-the-box event types, as well as fully custom events.

Each event has an associated context, which is composed of entities. The tracker attaches entities to the events based on the configuration, but you can attach your own [custom entities](/docs/sources/trackers/mobile-trackers/custom-tracking-using-schemas/index.md) as well.

Every tracked event payload has a unique `event_id` UUID string set by the tracker, a set of timestamps, and other ubiquitous properties such as the `namespace`. The `event_id` is returned from the `tracker.track(event)` method. You can know more about how events and entities are structured [here](/docs/events/index.md).

See the full configuration and parameter options for all these classes and methods in the API docs - [Android](https://snowplow.github.io/snowplow-android-tracker/index.html) and [iOS](https://snowplow.github.io/snowplow-ios-tracker/documentation/snowplowtracker/).

## Auto-tracked events and entities

Automatically captured data are:

* [**Platform and Application Context Tracking**](./platform-and-application-context/index.md): Captures contextual information about the device and the app.
* [**Session Tracking**](./session-tracking/index.md): Captures the session which helps to keep track of the user activity in the app.
* [**App Lifecycle Tracking**](./lifecycle-tracking/index.md): Captures application lifecycle state changes (foreground/background transitions).
* [**Screen View and Engagement Tracking**](./screen-tracking/index.md): Captures each time a new “screen” is loaded.
* [**Exception Tracking**](./exception-tracking/index.md): Captures any unhandled exceptions within the application.
* [**Installation Tracking**](./installation-tracking/index.md): Captures an install event which occurs the first time an application is opened.
* [**Immersive Space Tracking**](./visionos/index.md): iOS only. Captures the visionOS immersive space in which events occur.

Autotracking can be enabled in the tracker configuration. In this example, some helpful automatic entities and all autotracking is enabled:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
Snowplow.createTracker(namespace: "appTracker", network: networkConfig) {
    TrackerConfiguration()
        .platformContext(true)
        .applicationContext(true)
        .lifecycleAutotracking(true)
        .sessionContext(true)
        .screenViewAutotracking(true)
        .screenEngagementAutotracking(true) // available from v6 of the tracker
        .screenContext(true)
        .exceptionAutotracking(true)
        .installAutotracking(true)
        .immersiveSpaceContext(true)
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .platformContext(true)
    .applicationContext(true)
    .lifecycleAutotracking(true)
    .sessionContext(true)
    .screenViewAutotracking(true)
    .screenEngagementAutotracking(true) // available from v6 of the tracker
    .screenContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)

Snowplow.createTracker(
    applicationContext,
    namespace,
    networkConfiguration,
    trackerConfig
)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .platformContext(true)
    .applicationContext(true)
    .lifecycleAutotracking(true)
    .sessionContext(true)
    .screenViewAutotracking(true)
    .screenEngagementAutotracking(true) // available from v6 of the tracker
    .screenContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true);

Snowplow.createTracker(getApplicationContext(),
                namespace,
                networkConfiguration,
                trackerConfig);
```

  </TabItem>
</Tabs>

You can also configure your tracker to automatically add [GDPR information](./gdpr-tracking/index.md) to every event.

## Manually-tracked events

The tracker provides classes for tracking different types of events.
The events are divided into two groups: canonical events and self-describing events.
<!-- You can read more about the difference between the two [here](TODO) -->

### Creating a Timing event

Use the `Timing` events to track user timing events such as how long resources take to load.

The event schema is `iglu:com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = Timing(category: "timing-category", variable: "timing-variable", timing: 5)
    .label("optional-label")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = Timing("timing-category", "timing-variable", 5)
    .label("optional-label")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android">

```java
Timing event = new Timing("timing-category", "timing-variable", 5)
    .label("optional-label");

tracker.track(event);
```

  </TabItem>
</Tabs>

### Creating a ScreenView event

Track the user viewing a screen within the application. This type of tracking is typically used when automatic [screen view tracking](/docs/sources/trackers/mobile-trackers/tracking-events/screen-tracking/index.md) is not suitable within your application.

The event schema is `iglu:com.snowplowanalytics.mobile/screen_view/jsonschema/1-0-0`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScreenView(name: "DemoScreenName", screenId: UUID())

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = ScreenView("DemoScreenName")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ScreenView event = new ScreenView("DemoScreenName");

tracker.track(event);
```

  </TabItem>
</Tabs>

### Creating a Consent event

#### Consent Granted

Use the `ConsentGranted` event to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

The event schema is `iglu:com.snowplowanalytics.snowplow/consent_granted/jsonschema/1-0-0`. The consent document schema is `iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ConsentGranted(expiry: "2022-01-01T00:00:00Z", documentId: "1234abcd", version: "1.2")
    .name("document-name")
    .documentDescription("document-description")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = ConsentGranted("2022-01-01T00:00:00Z", "1234abcd", "1.2")
    .documentDescription("document-description")
    .documentName("document-name")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ConsentGranted event = new ConsentGranted("2022-01-01T00:00:00Z", "1234abcd", "1.2")
        .documentDescription("document-description")
        .documentName("document-name");

tracker.track(event);
```

  </TabItem>
</Tabs>

#### Consent Withdrawn

Use the `ConsentWithdrawn` event to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

The event schema is `iglu:com.snowplowanalytics.snowplow/consent_withdrawn/jsonschema/1-0-0`. The consent document schema is `iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ConsentWithdrawn()
    .all(true)
    .documentId("1234abcd")
    .version("1.2")
    .name("document-name")
    .documentDescription("document-description")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = ConsentWithdrawn(false, "1234abcd", "1.2")
    .documentDescription("document-description")
    .documentName("document-name")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ConsentWithdrawn event = new ConsentWithdrawn(false, "1234abcd", "1.2")
        .documentDescription("document-description")
        .documentName("document-name");

tracker.track(event);
```

  </TabItem>
</Tabs>

### Tracking Push and Local Notifications

To track an event when a push (or local) notification is used, it is possible to use the `MessageNotification` event.

The event schema is `iglu:com.snowplowanalytics.mobile/message_notification/jsonschema/1-0-0`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = MessageNotification(title: "title", body: "body", trigger: .push)
    .notificationTimestamp("2020-12-31T15:59:60-08:00")
    .action("action")
    .bodyLocKey("loc key")
    .bodyLocArgs(["loc arg1", "loc arg2"])
    .sound("chime.mp3")
    .notificationCount(9)
    .category("category1")
    .attachments([
        MessageNotificationAttachment(identifier: "id", type: "type", url: "https://snowplow.io")
    ]);
tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = MessageNotification("title", "body", MessageNotificationTrigger.push)
    .notificationTimestamp("2021-10-18T10:16:08.008Z")
    .category("category")
    .action("action")
    .bodyLocKey("loc key")
    .bodyLocArgs(listOf("loc arg1", "loc arg2"))
    .sound("chime.mp3")
    .notificationCount(9)
    .category("category1")
tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
MessageNotification event = new MessageNotification("title", "body", MessageNotificationTrigger.push)
        .notificationTimestamp("2021-10-18T10:16:08.008Z")
        .category("category")
        .action("action")
        .bodyLocKey("loc key")
        .bodyLocArgs(Arrays.asList("loc arg1", "loc arg2"))
        .sound("chime.mp3")
        .notificationCount(9)
        .category("category1");
tracker.track(event);
```

  </TabItem>
</Tabs>

### Tracking Deep Links

The Deep Link is received by the mobile operating system and passed to the related app. Our mobile tracker can't automatically track the Deep Link, but we provide an out-of-the-box event that can be used by the developer to manually track it as soon as the Deep Link is received in the app.

The event schema is `iglu:com.snowplowanalytics.mobile/deep_link_received/jsonschema/1-0-0`.

It will be the duty of the tracker to automatically attach the information of the Deep Link to the first ScreenView tracked.

In practice, when the app receives a Deep Link, the developer can track it through the DeepLinkReceived event:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
public func application(_ application: UIApplication,
                        continue userActivity: NSUserActivity,
                        restorationHandler: @escaping ([Any]?) -> Void) -> Bool
{
    ...
    if let url = userActivity.webpageURL {
        let deepLinkEvent = DeepLinkReceived(url: userActivity.webpageURL.absoluteString)
            .referrer(userActivity.referrerURL.absoluteString)
        tracker.track(deepLinkEvent)
    }
    ...
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    ...

    // Extract info from Intent
    val deepLinkUrl = intent.data.toString()
    var referrer: String? = null
    val extras = intent.extras
    if (extras != null) {
        val referrerUri = extras[Intent.EXTRA_REFERRER] as? Uri
        if (referrerUri != null) {
            referrer = referrerUri.toString()
        }
    }
    // Create and track the event
    val event = DeepLinkReceived(deepLinkUrl).referrer(referrer)
    tracker.track(event)

    ...
}
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
@Override
public void onCreate(Bundle savedInstanceState) {
    ...

    // Extract info from Intent
    Intent intent = getIntent();
    String deepLinkUrl = intent.getData().toString();
    String referrer = null;
    Bundle extras = intent.getExtras();
    if (extras != null) {
        Uri referrerUri = extras.get(Intent.EXTRA_REFERRER);
        if (referrerUri != null) {
            referrer = referrerUri.toString();
        }
    }
    // Create and track the event
    DeepLinkReceived event = new DeepLinkReceived(deepLinkUrl).referrer(referrer);
    tracker.track(event);

    ...
}
```

  </TabItem>
</Tabs>

The tracker keeps memory of the tracked Deep Link event and will attach a Deep Link entity to the first ScreenView tracked in the tracker.
This is helpful during the analysis of the data because it will be clear the relation between the content visualized by the user (ScreenView event) and source (DeepLink entity) that originated that visualisation.

This behavior is enabled by default but it can be disabled from the `TrackerConfiguration`.

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    ...
    .deepLinkContext(false)
    ...
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    ...
    .deepLinkContext(false)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    ...
    .deepLinkContext(false);
```

  </TabItem>
</Tabs>

The `DeepLinkReceived` event can be used in pair with a `campaign-attribution-enrichment` appropriately enabled in the Snowplow pipeline.
It works exactly like for `PageView` events in the web/JS tracker.
When the user taps on an advertising banner or a marketing email or message, it can trigger the launch of the app through the Deep Linking feature. The referral from the advertising campaigns, websites, or other source can be composed by UTM parameters used to attribute the user activity back to the campaign.
The Campaign Attribution Enrichment can parse the DeepLinkReceived event extracting the UTM parameters in the deep link url.

The tracked `DeepLinkReceived` event and each subsequent `ScreenView` event also have the URL and referrer information added in the `page_url` and `page_referrer` atomic properties. This makes them compatible with data models and enrichments built for events tracked on the Web.


### Creating a Structured event

Our philosophy in creating Snowplow is that users should design suitable data structures customised for their own consumer interactions data capture. You can read more about that philosophy [here](/docs/data-product-studio/index.md).

However, as part of a Snowplow implementation there may be interactions where [custom `SelfDescribing` events](/docs/sources/trackers/mobile-trackers/custom-tracking-using-schemas/index.md) are unwarranted. Those are candidates to track as `Structured` events. We do strongly recommend using fully custom `SelfDescribing` events.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = Structured(category: "Example", action: "my-action")
    .label("my-label")
    .property("my-property")
    .value(5)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val event = Structured("shop", "add-to-basket") // category and action
    .label("Add To Basket")
    .property("pcs")
    .value(2.0)
tracker.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
Structured event = new Structured("shop", "add-to-basket") // category and action
    .label("Add To Basket")
    .property("pcs")
    .value(2);
tracker.track(event);
```

  </TabItem>
</Tabs>

## Tracking data that is not event-type specific

Some data, such as that relating to the user whose activity is being tracked, is relevant across all event types. The tracker provides two mechanisms for tracking this kind of data.

Certain properties, including `userId` or `ipAddress`, can be set as "atomic" properties in the raw event, using the [`Subject` class](../client-side-properties/index.md).

A more general and powerful method is to attach self-describing JSON "context entities" to your events - the same JSON schemas as used for self-describing events. This means that any data that can be described by a JSON schema can be added to any or all of your events. Read more about custom tracking [here](../custom-tracking-using-schemas/index.md).

All events also provide the option for setting a custom timestamp, called `trueTimestamp`. See below for details.

### Adding custom timestamps to events

Snowplow events have several timestamps. The raw event payload always contains a `deviceCreatedTimestamp` (`dtm`) and a `deviceSentTimestamp` (`stm`). Other timestamps are added as the event moves through the pipeline.

Every `Event` in the tracker allows for a custom timestamp, called `trueTimestamp` to be set. A `trueTimestamp` can be added to any event using the `trueTimestamp()` method:

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
// This example shows a self-describing event, but all events can have a trueTimestamp
let event = SelfDescribing(schema: "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", payload: data)
    .trueTimestamp(Date(timeIntervalSince1970: 166184300))
```

`trueTimestamp` should be a `Date` object.

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
// This example shows a self-describing event, but all events can have a trueTimestamp
val event = SelfDescribing(SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", data))
    .trueTimestamp(166184300L)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
// This example shows a self-describing event, but all events can have a trueTimestamp
SelfDescribing event = new SelfDescribing(new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", data))
    .trueTimestamp(166184300L);
```

  </TabItem>
</Tabs>
