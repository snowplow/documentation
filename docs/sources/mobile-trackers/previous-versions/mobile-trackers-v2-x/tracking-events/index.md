---
title: "Tracking Events"
date: "2021-06-11"
sidebar_position: 3000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DefineCustomEvent from "@site/docs/reusable/define-custom-event/_index.md";
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md";
```

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS Tracker" default>

The mobile trackers capture two types of events, automatically captured and manual events.

## Auto Tracking

Automatically captured events in the iOS Tracker are:

- App Lifecycle Tracking
    - Captures application foreground and application background events
- Screen View Tracking
    - Captures each time a new "screen" is loaded
- Exception Tracking
    - Captures any unhandled exceptions within the application
- Installation Tracking
    - Captures an install event which occurs the first time an application is opened

These are enabled in the tracker configuration. In this example, some helpful automatic contexts and all Autotracking is enabled:

```swift
let trackerConfig = TrackerConfiguration()
    .sessionContext(true)
    .platformContext(true)
    .screenContext(true)
    .applicationContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .exceptionAutotracking(true)
    .installAutotracking(true)
```

## Custom Event Context

<DefineCustomEntity/>

Custom context can be added as an extra argument to any of Snowplow's `track..()` methods and to `addItem` and `addTrans`.

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Here are two example custom context JSONs. One describes a screen:

```javascript
{
    schema: 'iglu:com.example/screen/jsonschema/1-2-1',
    data: {
        screenType: 'test',
        lastUpdated: '2021-06-11'
    }
}
```

and the other describes a user on that screen:

```javascript
{
    schema: 'iglu:com.example/user/jsonschema/2-0-0',
    data: {
      userType: 'tester'
    }
}
```

#### Tracking events with Custom Context

How to track a **screen view** with both of these contexts attached:

```swift
let event = ScreenView(name: "DemoScreenName", screenId: UUID())
event.contexts.add(
    SelfDescribingJson(schema: "iglu:com.example/screen/jsonschema/1-2-1",
        andDictionary: [
             "screenType": "test",
             "lastUpdated": "2021-06-11"
        ])!)     
event.contexts.add(
    SelfDescribingJson(schema: "iglu:com.example/user/jsonschema/2-0-0", 
        andDictionary: [
             "userType": "tester"
        ])!)

tracker.track(event)
```

It is also possible to [add contexts globally](https://snowplow.github.io/snowplow-objc-tracker/interface_s_p_global_contexts_configuration.html), so that they are applied to all (or a subset of) events within an application.

## Manual Tracking

### Self Describing

<DefineCustomEvent/>

```swift
let data = ["targetUrl": "http://a-target-url.com" as NSObject];       
let event = SelfDescribing(schema: "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", payload: data)       

tracker.track(event)
```

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the [JSON schema](http://json-schema.org/) against which the `data` field should be validated.

### Structured

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/event-studio/index.md). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as desribed above.

However, as part of a Snowplow implementation there may be interactons where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `Structured`, if none of the other event-specific methods outlined below are appropriate.

```swift
let event = Structured(category: "Example", action: "my-action")
    .label("my-label")
    .property("my-property")
    .value(5)

tracker.track(event)
```

### Timing

Use the `Timing` events to track user timing events such as how long resources take to load.

```swift
let event = Timing(category: "timing-category", variable: "timing-variable", timing: 5)
    .label("optional-label")       

tracker.track(event)
```

### Screen View

Track the user viewing a screen within the application. This type of tracking is typically used when automatic screen view tracking is not suitable within your application.

```swift
let event = ScreenView(name: "DemoScreenName", screenId: UUID())

tracker.track(event)
```

### Consent

#### Consent Granted

Use the `ConsentGranted` event to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

```swift
let event = ConsentGranted(expiry: "2022-01-01T00:00:00Z", documentId: "1234abcd", version: "1.2")       
    .name("document-name")
    .documentDescription("document-description")
                
tracker.track(event)
```

#### Consent Withdrawn

Use the `ConsentWithdrawn` event to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

```swift
let event = ConsentWithdrawn()
    .all(true)
    .documentId("1234abcd")
    .version("1.2")       
    .name("document-name")
    .documentDescription("document-description")
                
tracker.track(event)
```

### Ecommerce Transaction

Modelled on Google Analytics ecommerce tracking capability, Snowplow uses three steps that can be used together to track online transactions:

1. **Create a Ecommerce event**. Use `Ecommerce` to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Add items to the transaction.** Create an array of `EcommerceItem` to pass to the `Ecommerce` object.
3. **Submit the transaction to Snowplow** using the track() method, once all the relevant data has been loaded into the object.

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
    .state("Massachisetts")
    .country("USA")
    .currency("USD")

tracker.track(event)
```

### Push Notification

To track an event when a push notification is used, it is possible to use the `PushNotification` event which contains a `NotificationContent` object:

```swift
let attachments = [["identifier": "testidentifier",       
                    "url": "testurl",       
                    "type": "testtype"]]

var userInfo = Dictionary<String, Any>()
userInfo["test"] = "test"

let content = NotificationContent(title: "title", body: "body", badge: 5)
    .subtitle("subtitle")
    .sound("sound")
    .launchImageName("launchImageName")
    .userInfo(userInfo)
    .attachments(attachments)

let event = PushNotification(       
    date: "date",       
    action: "action",       
    trigger: "PUSH",       
    category: "category",       
    thread: "thread",       
    notification: content)

tracker.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android Tracker">

The mobile trackers capture two types of events, automatically captured and manual events.

## Auto Tracking

Automatically captured events in the iOS Tracker are:

- App Lifecycle Tracking
    - Captures application foreground and application background events
- Screen View Tracking
    - Captures each time a new "screen" is loaded
- Exception Tracking
    - Captures any unhandled exceptions within the application
- Installation Tracking
    - Captures an install event which occurs the first time an application is opened

These are enabled in the tracker configuration. In this example, some helpful automatic contexts and all Autotracking is enabled:

```java
TrackerConfiguration trackerConfiguration = new TrackerConfiguration(appId)       
    .sessionContext(true)
    .platformContext(true)
    .applicationContext(true)
    .screenContext(true)
    .lifecycleAutotracking(true)
    .screenViewAutotracking(true)
    .exceptionAutotracking(true)
    .installAutotracking(true);
```

## Custom Event Context

<DefineCustomEntity/>

Custom context can be added as an extra argument to any of Snowplow's `track..()` methods and to `addItem` and `addTrans`.

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Here are two example custom context JSONs. One describes a screen:

```javascript
{
    schema: 'iglu:com.example/screen/jsonschema/1-2-1',
    data: {
        screenType: 'test',
        lastUpdated: '2021-06-11'
    }
}
```

and the other describes a user on that screen:

```javascript
{
    schema: 'iglu:com.example/user/jsonschema/2-0-0',
    data: {
      userType: 'tester'
    }
}
```

#### Tracking events with Custom Context

How to track a **screen view** with both of these contexts attached:

```java
ScreenView event = new ScreenView("screen", UUID.randomUUID().toString());

event.customContexts.add(
    new SelfDescribingJson("iglu:com.example/screen/jsonschema/1-2-1",
        new HashMap<String, String>() {{
            put("screenType", "test");
            put("lastUpdated", "2021-06-11");
        }})
);

event.customContexts.add(
    new SelfDescribingJson("iglu:com.example/user/jsonschema/2-0-0",
        new HashMap<String, String>() {{
            put("userType", "tester");
        }})
);

tracker.track(event);
```

It is also possible to [add contexts globally](https://snowplow.github.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1configuration_1_1_global_contexts_configuration.html), so that they are applied to all (or a subset of) events within an application.

## Manual Tracking

### Self Describing

<DefineCustomEvent/>

```java
Map<String, String> properties = new HashMap<>();
properties.put("targetUrl", "http://a-target-url.com");
SelfDescribingJson sdj = new SelfDescribingJson("iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1", attributes);

SelfDescribing event = new SelfDescribing(sdj);

tracker.track(event);
```

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/). It has two fields:

- A `data` field, containing the properties of the event
- A `schema` field, containing the location of the [JSON schema](http://json-schema.org/) against which the `data` field should be validated.

### Structured

Our philosophy in creating Snowplow is that users should capture important consumer interactions and design suitable data structures for this data capture. You can read more about that philosophy [here](/docs/event-studio/index.md). Using `trackSelfDescribingEvent` captures these interactions with custom schemas, as desribed above.

However, as part of a Snowplow implementation there may be interactons where custom Self Describing events are perhaps too complex or unwarranted. They are then candidates to track using `Structured`, if none of the other event-specific methods outlined below are appropriate.

```java
Structured event = Structured("my-category", "my-action")
    .label("my-label")
    .property("my-property")
    .value(5);

tracker.track(event);
```

### Timing

Use the `Timing` events to track user timing events such as how long resources take to load.

```java
Timing event = new Timing("timing-category", "timing-variable", 5)
    .label("optional-label");
                
tracker.track(event);
```

### Screen View

Track the user viewing a screen within the application. This type of tracking is typically used when automatic screen view tracking is not suitable within your application.

```java
ScreenView event = new ScreenView("screen", UUID.randomUUID().toString());

tracker.track(event);
```

### Consent

#### Consent Granted

Use the `ConsentGranted` event to track a user opting into data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied.

```java
ConsentGranted event = new ConsentGranted("2018-05-08T18:12:02+00:00", "doc id", "1.2")
        .documentDescription("doc description")
        .documentName("doc name");

tracker.track(event);
```

#### Consent Withdrawn

Use the `ConsentWithdrawn` event to track a user withdrawing consent for data collection. A consent document context will be attached to the event using the `id` and `version` arguments supplied. To specify that a user opts out of all data collection, `all` should be set to `true`.

```java
ConsentWithdrawn event = new ConsentWithdrawn(true, "doc id", "1.2")
        .documentDescription("doc description")
        .documentName("doc name");

tracker.track(event);
```

### Ecommerce Transaction

Modelled on Google Analytics ecommerce tracking capability, Snowplow uses three steps that can be used together to track online transactions:

1. **Create a Ecommerce event**. Use `Ecommerce` to initialize a transaction object. This will be the object that is loaded with all the data relevant to the specific transaction that is being tracked including all the items in the order, the prices of the items, the price of shipping and the `order_id`.
2. **Add items to the transaction.** Create an array of `EcommerceItem` to pass to the `Ecommerce` object.
3. **Submit the transaction to Snowplow** using the track() method, once all the relevant data has been loaded into the object.

```java
EcommerceTransactionItem item = new EcommerceTransactionItem("sku-1", 35.00, 1)
    .name("Acme 1")
    .category("Stuff")
    .currency("USD");
List<EcommerceTransactionItem> items = new LinkedList<>();
items.add(item);

EcommerceTransaction event = new EcommerceTransaction("order-1", 40.00, items)
    .shipping(5.00);

tracker.track(event);
```

  </TabItem>
</Tabs>
