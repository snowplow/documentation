---
title: "Tracking specific events"
description: "Track specific behavioral events using Java tracker version 0.11 in enterprise applications."
schema: "TechArticle"
keywords: ["Java V0.11", "Legacy Events", "Previous Version", "Event Tracking", "Deprecated Version", "Legacy Tracking"]
date: "2020-02-26"
sidebar_position: 40
---

Events supported by the Java Tracker at a glance:

| **Events** | \*_Description_ |
| --- | --- |
| [`track(ScreenView event)`](#screen-view) | Track the user viewing a screen within the application |
| [`track(PageView event)`](#page-view) | Track and record views of web pages |
| [`track(EcommerceTransaction event)`](#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`track(Structured event)`](#struct-event) | Track a Snowplow custom structured event |
| [`track(Unstructured event)`](#unstruct-event) | Track a Snowplow custom unstructured event |
| [`track(Timing event)`](#timing) | Track a Timing with Category event |

You can also directly Track a `TrackerPayload` object. **Please** only use this function to re-track failed event payloads.

```java
tracker.track(aTrackerPayload);
```

### Common

All events are tracked with specific methods on the tracker instance, of the form `track(XXX)`, where `XXX` is the type of event to track.

#### SelfDescribingJson

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
| `data` | Data that will be validated by the schema | No | `Map, TrackerPayload, SelfDescribingJson` |

`SelfDescribingJson` is used for recording [custom contexts](#custom-contexts) and [unstructured events](#unstruct-event).

#### Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of a Map object. Each tracking method accepts an additional optional contexts parameter:

```java
t1.track(PageView.builder().( ... ).customContext(List<SelfDescribingJson> context).build());
```

The `customContext` argument should consist of a `List` of `SelfDescribingJson` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```java
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
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

### Optional Device Sent Timestamp override

In all the trackers, we offer a way to override the device sent timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```java
t1.track(PageView.builder().( ... ).deviceCreatedTimestamp(1423583655000).build());
```

### Optional Subject override

In this tracker, we offer a way to attach an event specific `Subject` if you want the event to be specific to a certain user. If you don't, we attempt to attach the Tracker subject or no Subject if neither are available.

This is useful for quickly overriding the Tracker subject for specific users.

Here is an example:

```java
t1.track(PageView.builder().( ... ).subject(aUserSubject).build());
```

### Optional Event ID override

In this tracker, we offer a way to override the event id of a specific event instead of using the automatically generated one. If you don't use this option we will simply use the auto-generated alternative.

Here is an example:

```java
t1.track(PageView.builder().( ... ).eventId("custom-event-id").build());
```

### True Timestamp

You can set the True Timestamp of the event when sending an event.

Here is an example:

```java
t1.track(PageView.builder().( ... ).trueTimestamp(1423583655000).build());
```

### Track screen views with `track(ScreenView event)`

Use `track(ScreenView event)` to track a user viewing a screen (or equivalent) within your app. You must use either `name` or `id`. Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | `String` |
| `id` | Unique identifier for this screen | No | `String` |
| `customContext` | Optional custom context | No | `List<SelfDescribingJson>` |
| `timestamp` | Optional timestamp | No | `Long` |
| `eventId` | Optional custom event id | No | `String` |
| `subject` | Optional custom Subject object | No | `Subject` |

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

### Track pageviews with `track(PageView event)`

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
| `subject` | Optional custom Subject object | No | `Subject` |

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

### Track ecommerce transactions with `track(EcommerceTransaction event)`

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
| `subject` | Optional custom Subject object | No | `Subject` |

The `items` argument is a `List` of individual `EcommerceTransactionItem` elements representing the items in the e-commerce transaction or it can be a `varargs` argument of many individual items. Note that `track(EcommerceTransaction event)` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`. Each transaction item event will have the same timestamp, order_id, and currency as the main transaction event.

#### `EcommerceTransactionItem`

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
| `subject` | Optional custom Subject object | No | `Subject` |

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

### Track structured events with `track(Structured event)`

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
| `subject` | Optional custom Subject object | No | `Subject` |

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

### Track unstructured events with `track(Unstructured event)`

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

```java
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

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

### Track timing events with `track(Timing event)`

Use `track(Timing event)` to track an event related to a custom timing.

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
t1.track(Timing.builder()
    .category("category")
    .variable("variable")
    .timing(1)
    .label("label")
    .build());

t1.track(Timing.builder()
    .category("category")
    .variable("variable")
    .timing(1)
    .label("label")
    .customContext(contextList)
    .timestamp(1423583655000)
    .eventId("uid-1")
    .build());
```
