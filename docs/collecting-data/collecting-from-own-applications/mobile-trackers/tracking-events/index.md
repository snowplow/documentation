---
title: "Tracking events"
date: "2022-08-30"
sidebar_position: 10
---

# Tracking events

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

To track an event, pass an event to the tracker instance. 

For example, tracking a ScreenView:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScreenView(name: "screen name", screenId: nil)
let eventId = tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
ScreenView event = new ScreenView("screen", UUID.randomUUID().toString());         
tracker.track(event);
```

  </TabItem>
</Tabs>

The tracker makes it easy to track different kinds of data. We provide a range of `Event` classes for tracking out-of-the-box event types as well as fully custom events. 

Each event can bring context which is composed by entities. The tracker attaches entities to the events based on the configuration, but you can attach your own custom entities as well.

Every tracked event payload has a unique `event_id` UUID string set by the tracker and a set of timestamps along with other ubiquitous properties such as the `namespace`. The `event_id` is returned from the `tracker.track(event)` method. You can know more about how events and entities are structured [here](https://docs.snowplow.io/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol).

## Auto-tracked events and entities

Automatically captured data are:

* **Platform and Application Context Tracking**: Captures contextual information about the device and the app.
* **Session Tracking**: Captures the session which helps to keep track of the user activity in the app.
* **App Lifecycle Tracking**: Captures application lifecycle state changes (foreground/background transitions).
* **Screen View Tracking**: Captures each time a new “screen” is loaded.
* **Exception Tracking**: Captures any unhandled exceptions within the application.
* **Installation Tracking**: Captures an install event which occurs the first time an application is opened.

Autotracking can be enabled in the tracker configuration. In this example, some helpful automatic entities and all autotracking is enabled:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .platformContext(true)
    .applicationContext(true)
    .lifecycleAutotracking(true)
    .sessionContext(true)
    .screenViewAutotracking(true)
    .screenContext(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)

Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: [trackerConfig]
)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .platformContext(true)
    .applicationContext(true)
    .lifecycleAutotracking(true)
    .sessionContext(true)
    .screenViewAutotracking(true)
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

You can know more about the `TrackerConfiguration` properties [here](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1configuration_1_1_tracker_configuration.html).

### Platform and Application Data Tracking {#platform}

They capture information about the device and the app.

They are enabled by default. But the setting can be changed through `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .platformContext(true)
    .applicationContext(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .platformContext(true)
    .applicationContext(true);
```

  </TabItem>
</Tabs>


More details on [Subject](../client-side-properties/index.md)

### App Lifecycle Tracking {#lifecycle-tracking}

It captures application lifecycle state changes. In particular, when the app changes the state from foreground to background and viceversa.

The lifecycle tracking is disabled by default. It can be enabled in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .lifecycleAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .lifecycleAutotracking(true);
```

  </TabItem>
</Tabs>

Once enabled, the tracker will automatically track a [`Background` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_background.html) when the app is moved to background and a [`Foreground` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_foreground.html) when the app moves back to foreground (becomes visible in the screen).

The tracker attaches a [`LifecycleEntity`](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1entity_1_1_lifecycle_entity.html) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.

### Session Tracking {#session}

Captures the session which helps to keep track of the user activity in the app.

Client session tracking is enabled by default. It can be set through the `TrackerConfiguration` as explained below.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .sessionContext(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .sessionContext(true);
```

  </TabItem>
</Tabs>

When enabled, the tracker appends a [`client_session` entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) to each event it sends and it maintains this session information as long as the application is installed on the device.

Sessions correspond to tracked user activity. A session expires when no tracking events have occurred for the amount of time defined in a timeout (by default 30 minutes). The session timeout check is executed for each event tracked. If the gap between two consecutive events is longer than the timeout the session is renewed. There are two timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed).

The timeouts for the session can be configured in the `SessionConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let sessionConfig = SessionConfiguration(
    foregroundTimeout: Measurement(value: 360, unit: .seconds),
    backgroundTimeout: Measurement(value: 360, unit: .seconds)
)
Snowplow.createTracker(
    namespace: "appTracker",
    network: networkConfig,
    configurations: [trackerConfig, sessionConfig]
)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(6, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
);
Snowplow.createTracker(getApplicationContext(), namespace, networkConfig, sessionConfig);
```

  </TabItem>
</Tabs>

The lifecycle events (`Foreground` and `Background` events) have a role in the session expiration. The lifecycle events can be enabled as explained in [App Lifecycle Tracking](#lifecycle-tracking). Once enabled they will be fired automatically when the app moves from foreground state to background state and vice versa.

When the app moves from foreground to background, the `Background` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the foreground timeout.
When the app moves from background to foreground, the `Foreground` event is fired. If session tracking is enabled, the session entity will be attached to the event checking the session expiration using the background timeout.

For instance, with this configuration:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
SessionConfiguration(
    foregroundTimeout: Measurement(value: 360, unit: .seconds),
    backgroundTimeout: Measurement(value: 15, unit: .seconds)
)       
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(360, TimeUnit.SECONDS),
    new TimeMeasure(15, TimeUnit.SECONDS)
);
```

  </TabItem>
</Tabs>

the session would expire if the app is in background for more than 15 seconds, like in this example:

```
time: 0s - ScreenView event - foreground timeout session check - session 1
time: 3s - Background event - foreground timeout session check (3 < 360) - session 1
time: 30s - Foreground event - background timeout session check (30 > 15) - session 2
```

In the above example, the `Foreground` event triggers a new session because the time spent in background (without tracked events) is bigger than the background timeout for the session.

#### Session callback

:::info

This feature is available since v3.1.

:::

The tracker allows the configuration of a callback to inform the app every time a new session is created (in correspondence of a session timeout check).
This can be configured in the `SessionConfiguration` and it provides the `SessionState` where all the info already tracked in the session can be accessed.

Below is an example of where the session callback is used to print out the values of session every time a new session is generated by the tracker:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
...
let sessionConfig = SessionConfiguration()
    .onSessionStateUpdate { session in
        print("SessionState: id: \(session.sessionId) - index: \(session.sessionIndex) - userID: \(session.userId) - firstEventID: \(session.firstEventId)")
    }
...
let tracker = Snowplow.createTracker(namespace: kNamespace, network: networkConfig, configurations: [sessionConfig])
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
...
SessionConfiguration sessionConfig = new SessionConfiguration(
    new TimeMeasure(6, TimeUnit.SECONDS),
    new TimeMeasure(30, TimeUnit.SECONDS)
)
    .onSessionUpdate(state -> log(
        "Session: " + state.getSessionId()
                + "\r\nprevious: " + state.getPreviousSessionId()
                + "\r\neventId: " + state.getFirstEventId()
                + "\r\nindex: " + state.getSessionIndex()
                + "\r\nuserId: " + state.getUserId()
    ));

...
Snowplow.createTracker(getApplicationContext(), namespace, networkConfig, sessionConfig);
```

  </TabItem>
</Tabs>

### Screen View Tracking

It captures screen changes within the app.

The screen view tracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .screenViewAutotracking(true)
    .screenContext(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .screenViewAutotracking(true)
    .screenContext(true);
```

  </TabItem>
</Tabs>

The configuration is composed by two settings:

- `screenViewAutotracking`: the tracker automatically tracks each screen change (triggered by `viewDidAppear` in a `ViewController`) using a [`ScreenView` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_screen_view.html).
- `screenContext`: the tracker attaches a [`Screen` entity](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event, even if it was manually tracked and the app is in a different screen.

Indeed, disabling the `screenViewAutotracking` only, the tracker can still attach `Screen` entities automatically based only to the manual tracking of `ScreenView` events, and vice versa.

### Exception Tracking

It captures any unhandled exceptions within the application.

The exception tracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .exceptionAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .exceptionAutotracking(true);
```

  </TabItem>
</Tabs>

It allows the tracker to intercept critical exceptions in the app. Exceptions can crash the app so it's likely that the event will be sent after the restart of the app. Being a critical situation we can't be 100% sure that all the exception stacktraces are reliably stored for sending before the crash of the app.

### Installation Tracking

It tracks an install event which occurs the first time an application is opened. The tracker will record when it's first been installed, so deleting and reinstalling an app will trigger another install event.

If installation autotracking is not enabled, the tracker will still keep track of when the app was first installed, so that when enabled, the tracker will send the recorded install event with a timestamp reflecting when it was first installed.

The installation autotracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .installAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .installAutotracking(true);
```

  </TabItem>
</Tabs>

## Manually-tracked events

The tracker provides classes for tracking different types of events.
The events are divided in two groups: canonical events and self-describing events.
<!-- You can read more about the difference between the two [here](TODO) -->

### Creating a Structured event

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](https://docs.snowplow.io/docs/understanding-tracking-design/). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as described above.

However, as part of a Snowplow implementation there may be interactions where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `Structured`, if none of the other event-specific methods outlined below are appropriate.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let event = Structured(category: "Example", action: "my-action")
    .label("my-label")
    .property("my-property")
    .value(5)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
Structured event = new Structured("category", "action")
    .label("label")
    .property("property")
    .value(5);
tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_structured.html).

### Creating a Timing event

Use the `Timing` events to track user timing events such as how long resources take to load.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let event = Timing(category: "timing-category", variable: "timing-variable", timing: 5)
    .label("optional-label")       

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
Timing event = new Timing("timing-category", "timing-variable", 5)
    .label("optional-label");

tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_timing.html).

### Creating a ScreenView event

Track the user viewing a screen within the application. This type of tracking is typically used when automatic screen view tracking is not suitable within your application.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScreenView(name: "DemoScreenName", screenId: UUID())

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
ScreenView event = new ScreenView("DemoScreenName", UUID.randomUUID());

tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_screen_view.html).

### Creating a Consent event

#### Consent Granted

Use the `ConsentGranted` event to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let event = ConsentGranted(expiry: "2022-01-01T00:00:00Z", documentId: "1234abcd", version: "1.2")       
    .name("document-name")
    .documentDescription("document-description")
                
tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
ConsentGranted event = new ConsentGranted("2022-01-01T00:00:00Z", "1234abcd", "1.2")
        .documentDescription("document-description")
        .documentName("document-name");

tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_consent_granted.html).

#### Consent Withdrawn

Use the `ConsentWithdrawn` event to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

<Tabs groupId="platform">
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
  <TabItem value="android" label="Android">

```java
ConsentWithdrawn event = new ConsentWithdrawn(false, "1234abcd", "1.2")
        .documentDescription("document-description")
        .documentName("document-name");

tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_consent_withdrawn.html).

### Tracking Ecommerce Transactions
<!-- (TODO: Section to remove) -->

Modelled on Google Analytics ecommerce tracking capability, Snowplow uses three steps that can be used together to track online transactions:

1. **Create a Ecommerce event.** Use `Ecommerce` to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.

2. **Add items to the transaction.** Create an array of `EcommerceItem` to pass to the `Ecommerce` object.

3. **Submit the transaction to Snowplow** using the `track()` method, once all the relevant data has been loaded into the object.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let transactionID = "6a8078be"       
                
let itemArray = [       
  EcommerceItem(sku: "DemoItemSku", price: 0.75, quantity: 1)
    .name("DemoItemName")       
    .category("DemoItemCategory")       
    .currency("USD")       
]       

let event = Ecommerce(orderId: transactionID, totalValue: 350, items: itemArray)
    .affiliation("DemoTransactionAffiliation")
    .taxValue(10)
    .shipping(15)
    .city("Boston")
    .state("Massachusetts")
    .country("USA")
    .currency("USD")

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
EcommerceTransactionItem item = new EcommerceTransactionItem("sku-1", 0.75, 1)
    .name("DemoItemName")
    .category("DemoItemCategory")
    .currency("USD")
    .orderId("item-1");

List<EcommerceTransactionItem> items = new LinkedList<>();
items.add(item);

EcommerceTransaction event = new EcommerceTransaction("order-1", 350, items)
    .affiliation("DemoTransactionAffiliation")
    .taxValue(10)
    .shipping(15)
    .city("Boston")
    .state("Massachusetts")
    .country("USA")
    .currency("USD");

tracker.track(event);
```

  </TabItem>
</Tabs>

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_ecommerce_transaction.html).

### Tracking Push and Local Notifications

To track an event when a push (or local) notification is used, it is possible to use the `MessageNotification` event:

<Tabs groupId="platform">
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
  <TabItem value="android" label="Android">

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

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_message_notification.html).

### Tracking Deep Links

The Deep Link is received by the mobile operating system and passed to the related app. Our mobile tracker can't automatically track the Deep Link, but we provide an out-of-the-box event that can be used by the developer to manually track it as soon as the Deep Link is received in the app.

It will be the duty of the tracker to automatically attach the information of the Deep Link to the first ScreenView tracked.

In practice, when the app receives a Deep Link, the developer can track it through the DeepLinkReceived event:

<Tabs groupId="platform">
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
  <TabItem value="android" label="Android">

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

See the API docs for the full [list of options](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_deep_link_received.html).

The tracker keeps memory of the tracked Deep Link event and will attach a Deep Link entity to the first ScreenView tracked in the tracker.
This is helpful during the analysis of the data because it will be clear the relation between the content visualized by the user (ScreenView event) and source (DeepLink entity) that originated that visualisation.

This behaviour is enabled by default but it can be disabled from the `TrackerConfiguration`.

For example:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    ...
    .deepLinkContext(false)
    ...
```

  </TabItem>
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    ...
    .deepLinkContext(false);
```

  </TabItem>
</Tabs>

The `DeepLinkReceived` event can be used in pair with a `campaign-attribution-enrichment` appropriately enabled in the Snowplow pipeline.
It works exactly like for `PageView` events in the web/JS tracker.
When the user taps on an advertising banner or a marketing email or message, it can trigger the launch of the app through the Deep Linking feature. The referral from the advertising campaigns, websites, or other source can be composed by UTM parameters used to attribute the user activity back to the campaign.
The Campaign Attribution Enrichment can parse the DeepLinkReceived event extracting the UTM parameters in the deep link url.

## Tracking data that is not event-type specific

Some data, such as that relating to the user whose activity is being tracked, is relevant across all event types. The tracker provides two mechanisms for tracking this kind of data.

Certain properties, including `userId` or `ipAddress`, can be set as "atomic" properties in the raw event, using the `Subject` class.

A more general and powerful method is to attach self-describing JSON "context entities" to your events - the same JSON schemas as used for self-describing events. This means that any data that can be described by a JSON schema can be added to any or all of your events. Read more on the [next page](../custom-tracking-using-schemas/index.md).

All events also provide the option for setting a custom timestamp, called `trueTimestamp`. See below for details.

### Adding custom timestamps to events

Snowplow events have several timestamps. The raw event payload always contains a `deviceCreatedTimestamp` (`dtm`) and a `deviceSentTimestamp` (`stm`). Other timestamps are added as the event moves through the pipeline.

Every `Event` in the tracker allows for a custom timestamp, called `trueTimestamp` to be set. Read more about timestamps in [this still relevant forums post](https://discourse.snowplowanalytics.com/t/which-timestamp-is-the-best-to-see-when-an-event-occurred/538). 

A `trueTimestamp` can be added to any event using the `trueTimestamp()` method:

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

```swift
// This example shows a self-describing event, but all events can have a trueTimestamp
let event = SelfDescribing(schema: "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", payload: data)
    .trueTimestamp(Date(timeIntervalSince1970: 166184300))
```

`trueTimestamp` should be a `Date` object.

  </TabItem>
  <TabItem value="android" label="Android">

```java
// This example shows a self-describing event, but all events can have a trueTimestamp
SelfDescribing event = new SelfDescribing(new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", data))
    .trueTimestamp(166184300L);
```

  </TabItem>
</Tabs>
