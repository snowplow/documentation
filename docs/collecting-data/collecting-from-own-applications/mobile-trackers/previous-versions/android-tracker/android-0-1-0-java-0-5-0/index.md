---
title: "Android (0.1.0) / Java (0.5.0)"
date: "2020-03-02"
sidebar_position: 1000
---

## 1\. Overview

The [Snowplow Java Tracker](https://github.com/snowplow/snowplow-java-tracker) allows you to track Snowplow events from your Java-based desktop and server apps, servlets and games. It supports JDK6+.

The [Snowplow Android Tracker](https://github.com/snowplow/snowplow-android-tracker) allows you to track Snowplow events from your Android applications and games. It supports applications using the Android SDK 11 and above.

The tracker should be straightforward to use if you are comfortable with Java development; its API is modelled after Snowplow's [Python Tracker](https://github.com/snowplow/snowplow/wiki/Python-Tracker) so any prior experience with that tracker is helpful but not necessary. If you haven't already, have a look at the [Java Tracker Setup](https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup) or [Android Tracker Setup](https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup) guide before continuing.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#11-android-specific)1.1 Android specific

The Android Tracker is based off of the Java Tracker core library which is the same library used by the Java Tracker. Hence, they both very similar in features and with a few differences in them. For sections of this documentation which only apply to Android, we will flag with a sub-section, **Android Only**.

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#2-initialization)2 Initialization

Assuming you have completed the [Android Tracker Setup](https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup) or [Java Tracker Setup](https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup) for your project, you are now ready to initialize the Android/Java Tracker.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#21-importing-the-module)2.1 Importing the module

Import the Java Tracker's classes into your Java code like so:

```
import com.snowplowanalytics.snowplow.tracker.*;
```

That's it - you are now ready to initialize a Tracker instance.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#22-understanding-the-module-structure)2.2 Understanding the module structure

As we've mentioned in the setup guides, the Android and Java Tracker are based off a Java core library. This means that you'll find a set the core libraries in `com.snowplowanalytics.snowplow.tracker.core.*`. For example, if you're using the Android Tracker you would use the classes in `com.snowplowanalytics.snowplow.tracker.android.*`, since it would contain class overrides specific to Android. If the class doesn't exist in that module (mostly enums), you can use the ones in the `core` package instead.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#23-creating-a-tracker)2.3 Creating a Tracker

To instantiate a tracker in your code (can be global or local to the process being tracked) simply instantiate the `Tracker` interface with one of the following:

```
Tracker(Emitter emitter, String namespace, String appId)
Tracker(Emitter emitter, Subject subject, String namespace, String appId)
Tracker(Emitter emitter, String namespace, String appId, boolean base64Encoded)
Tracker(Emitter emitter, Subject subject, String namespace, String appId, boolean base64Encoded)
```

For example:

```
Tracker t1 = new Tracker(emitter, user1Subject, "AF003", "cf", true);
Tracker t2 = new Tracker(emitter, "AF003", "cf");
```

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `emitter` | The Emitter object you create | Yes |
| `subject` | The subject that defines a user | No |
| `namespace` | The name of the tracker instance | Yes |
| `appId` | The application ID | Yes |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No (Default true) |

#### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#231-emitter)2.3.1 `emitter`

The emitter to which the tracker will send events. See [Emitters](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#emitter) for more on emitter configuration.

#### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#232-subject)2.3.2 `subject`

The user which the Tracker will track. This should be an instance of the [Subject](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#subject) class. You don't need to set this during Tracker construction; you can use the `Tracker.setSubject` method afterwards. In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

#### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#233-namespace)2.3.3 `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#234-appid)2.3.4 `appId`

The `appId` argument lets you set the application ID to any string.

#### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#235-base64encoded)2.3.5 `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#3-adding-extra-data-the-subject-class)3\. Adding extra data: the Subject class

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- [`setPlatform`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-platform)
- [`setUserId`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-user-id)
- [`setScreenResolution`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-screen-resolution)
- [`setViewport`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-viewport-dimensions)
- [`setColorDepth`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-color-depth)
- [`setTimezone`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-timezone)
- [`setLanguage`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#set-lang)

Here are some examples:

```
s1.setUserID("Kevin Gleason");
s1.setLanguage("en-gb");
s1.setPlatform("cnsl");
s1.setScreenResolution(1920, 1080);
```

After that, you can add your Subject to your Tracker like so:

```
Tracker(emitter, s1, namespace, appId);
// OR
t1.setSubject(s1);
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#31-change-the-trackers-platform-with-setplatform)3.1 Change the tracker's platform with `setPlatform`

You can change the platform the subject is using by calling:

```
s1.setPlatform("cnsl");
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](https://github.com/snowplow/snowplow/wiki/Snowplow-Tracker-Protocol).

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#32-set-user-id-with-setuserid)3.2 Set user ID with `setUserId`

You can set the user ID to any string:

```
s1.setUserId( "{{USER ID}}" )
```

Example:

```
s1.setUserId("alexd")
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#33-set-screen-resolution-with-setscreenresolution)3.3 Set screen resolution with `setScreenResolution`

If your Java code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```
t1.setScreenResolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
t1.setScreenResolution(1366, 768)
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#34-set-viewport-dimensions-with-setviewport)3.4 Set viewport dimensions with `setViewport`

If your Java code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```
s.setViewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
s.setViewport(300, 200)
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#35-set-color-depth-with-setcolordepth)3.5 Set color depth with `setColorDepth`

If your Java code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```
s.setColorDepth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```
s.setColorDepth(32)
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#36-set-timezone-with-settimezone)3.6 Set timezone with `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```
s.setTimezone( {{TIMEZONE}} )
```

The timezone should be a string:

```
s.setTimezone("Europe/London")
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#37-set-the-language-with-setlanguage)3.7 Set the language with `setLanguage`

This method lets you pass a user's language in to Snowplow:

```
s.setLanguage( {{LANGUAGE}} )
```

The language should be a string:

```
s.setLanguage('en')
```

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#4-tracking-specific-events)4\. Tracking specific events

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps. We are constantly growing the range of functions available in order to capture that data more richly.

Tracking methods supported by the Java Tracker at a glance:

| **Function** | \*_Description_ |
| --- | --- |
| [`trackScreenView()`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#screen-view) | Track the user viewing a screen within the application |
| [`trackPageView()`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#page-view) | Track and record views of web pages. |
| [`trackEcommerceTransaction()`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#ecommerce-transaction) | Track an ecommerce transaction and its items |
| [`trackStructuredEvent()`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#struct-event) | Track a Snowplow custom structured event |
| [`trackUnstructuredEvent()`](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#unstruct-event) | Track a Snowplow custom unstructured event |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#41-common)4.1 Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#411-custom-contexts)4.1.1 Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of a Map object. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```
t1.trackPageView(String pageUrl, String pageTitle, String referrer);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, List<SchemaPayload> context);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, double timestamp);
t1.trackPageView(String pageUrl, String pageTitle, String referrer, List<SchemaPayload> context, double timestamp);
```

The `context` argument should consist of a `List` of `SchemaPayload` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2.1.1",
  "data": {
    "movie_name": "Solaris",
    "poster_country": "JP",
    "poster_year": "1978"
  }
}
```

Note that even if there is only one custom context attached to the event, it still needs to be placed in an array.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#412-optional-timestamp--context-argument)4.1.2 Optional timestamp & context argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com");
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", contextArray);
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", contextArray, 12348567890);
t1.trackPageView("www.page.com", "Example Page", "www.referrer.com", 12348567890);
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#413-tracker-method-return-values)4.1.3 Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#42-track-screen-views-with-trackscreenview)4.2 Track screen views with `trackScreenView()`

Use `trackScreenView()` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | String |
| `id` | Unique identifier for this screen | No | String |
| `context` | Custom context for the event | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

Example:

```
t1.trackScreenView("HUD > Save Game", "screen23");
t1.trackScreenView("HUD > Save Game", contextList, 123456);
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#43-track-pageviews-with-trackpageview)4.3 Track pageviews with `trackPageView()`

If you are using Java servlet technology or similar to serve webpages to a browser, you can use `trackPageView()` to track a user viewing a page within your app.

Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `page_url` | The URL of the page | Yes | String |
| `page_title` | The title of the page | Yes | String |
| `referrer` | The address which linked to the page | Yes | String |
| `context` | Custom context for the event | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

Example:

```
t1.trackPageView("www.example.com", "example", "www.referrer.com", contextList);
t1.trackPageView("www.example.com", "example", "www.referrer.com");
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#44-track-ecommerce-transactions-with-trackecommercetransaction)4.4 Track ecommerce transactions with `trackEcommerceTransaction()`

Use `trackEcommerceTransaction()` to track an ecommerce transaction.

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `order_id` | ID of the eCommerce transaction | Yes | String |
| `total_value` | Total transaction value | Yes | Double |
| `affiliation` | Transaction affiliation | Yes | String |
| `tax_value` | Transaction tax value | Yes | Double |
| `shipping` | Delivery cost charged | Yes | Double |
| `city` | Delivery address city | Yes | String |
| `state` | Delivery address state | Yes | String |
| `country` | Delivery address country | Yes | String |
| `currency` | Transaction currency | Yes | String |
| `items` | Items in the transaction | Yes | List |
| `context` | Custom context for the event | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

The `items` argument is a `List` of individual `TransactionItem` elements representing the items in the e-commerce transaction. Note that `trackEcommerceTransaction` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`. Each transaction item event will have the same timestamp, order\_id, and currency as the main transaction event.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#441-ecommerce-transactionitem-with-trackecommercetransaction)4.4.1 Ecommerce TransactionItem with `trackEcommerceTransaction()`

To instantiate a TransactionItem in your code, simply use the following constructor signature:

```
trackEcommerceTransactionItem(String order_id, String sku, Double price, Integer quantity, String name, String category, String currency, Map context, long transaction_id)
```

These are the fields that can appear as elements in each `TransactionItem` element of the transaction item `List`:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `order_id` | Order ID | Yes | String |
| `sku` | Item SKU | No | String |
| `price` | Item price | No | double |
| `quantity` | Item quantity | No | int |
| `name` | Item name | No | String |
| `category` | Item category | No | String |
| `currency` | Item currency | No | String |
| `context` | Item context | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

Example of tracking a transaction containing two items:

```
// Example to come, in the meantime here is the type signature:
t1.trackEcommerceTransaction(String order_id, Double total_value, String affiliation, Double tax_value,Double shipping, String city, String state, String country, String currency, List<TransactionItem> items, Map<SchemaPayload> context);
t1.trackEcommerceTransaction("6a8078be", 300, "my_affiliate", 30, 10, "Boston", "Massachusetts", "USA", "USD", items, context);
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#45-track-structured-events-with-trackstructuredevent)4.5 Track structured events with `trackStructuredEvent()`

Use `trackStructuredEvent()` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | String |
| `action` | Defines the type of user interaction which this event involves | Yes | String |
| `label` | A string to provide additional dimensions to the event data | Yes | String |
| `property` | A string describing the object or the action performed on it | Yes | String |
| `value` | A value to provide numerical data about the event | Yes | Int |
| `context` | Custom context for the event | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

Example:

```
t1.trackStructuredEvent("shop", "add-to-basket", "Add To Basket", "pcs", 2);
t1.trackStructuredEvent("shop", "add-to-basket", "Add To Basket", "pcs", 2, 123456.7);
```

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#46-track-unstructured-events-with-trackunstructuredevent)4.6 Track unstructured events with `trackUnstructuredEvent()`

Custom unstructured events are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `trackUnstructuredEvent()` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `eventData` | The properties of the event | Yes | Map<String, Object> |
| `context` | Custom context for the event | No | Map |
| `timestamp` | Optional timestamp for the event | No | Long |

Example:

```
t1.trackUnstructuredEvent(String eventVendor, String eventName, String eventData, String context);
```

If you supply a `Map<String, Object>`, make sure that this top-level contains your `schema` and `data` keys, and then store your `data` properties as a child `Map<String, Object>`.

Example:

```
t1.trackUnstructuredEvent(String eventVendor, String eventName, Map<String, Object> eventData, String context);
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#5-sending-event-emitter)5\. Sending event: `Emitter`

Events are sent using an `Emitter` class. You can initialize an class with a collector endpoint URL with various options to choose how these events should be sent. Here are the Emitter interfaces that can be used:

```
Emitter(String URI)
Emitter(String URI, HttpMethod httpMethod)
Emitter(String URI, RequestCallback callback)
Emitter(String URI, HttpMethod httpMethod, RequestCallback callback)
```

For example:

```
Emitter e1 = new Emitter("d3rkrsqld9gmqf.cloudfront.net");
Emitter e2 = new Emitter("d3rkrsqld9gmqf.cloudfront.net", HttpMethod.POST);
Emitter e3 = new Emitter("d3rkrsqld9gmqf.cloudfront.net", new RequestCallback() {...});
Emitter e4 = new Emitter("d3rkrsqld9gmqf.cloudfront.net", HttpMethod.POST, new RequestCallback() {...});
```

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `URI` | The collector endpoint URI events will be sent to | Yes |
| `httpMethod` | The HTTP method events should be sent | No |
| `callback` | Lets you pass a callback class to handle succes/failure in sending events. | No |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#android-only)Android Only

For Android, the Emitter class is virtually the same in the way it is instantiated with the addition of an extra parameter to accept a [`Context`](https://developer.android.com/reference/android/content/Context.html). The `Context` is used for caching events in an [SQLite database](http://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html) in order to avoid losing events to network related issues.

Here are what the Emitter interfaces for Android looks like:

```
Emitter(String URI, Context context)
Emitter(String URI, Context context, HttpMethod httpMethod)
Emitter(String URI, Context context, RequestCallback callback)
Emitter(String URI, HttpMethod httpMethod, RequestCallback callback, Context context)
```

For example, if you're creating an Emitter in an [`Activity`](https://developer.android.com/reference/android/app/Activity.html) class:

```
Emitter e1 = new Emitter("snowplow-collector.acme.com", this);
Emitter e2 = new Emitter("snowplow-collector.acme.com", this, HttpMethod.POST);
Emitter e3 = new Emitter("snowplow-collector.acme.com", this, new RequestCallback() {...});
Emitter e4 = new Emitter("snowplow-collector.acme.com", this, HttpMethod.POST, new RequestCallback() {...});
```

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `URI` | The collector endpoint URI events will be sent to | Yes |
| `context` | Used to use to open or create an SQLite database | Yes |
| `httpMethod` | The HTTP method events should be sent | No |
| `callback` | Lets you pass a callback class to handle succes/failure in sending events. | No |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#51-using-a-buffer)5.1 Using a buffer

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the Emitter buffers up to 10 events before sending them. You can change this to send evenets instantly as soon as they are created like so:

```
Emitter e1 = new Emitter("d3rkrsqld9gmqf.cloudfront.net");
e1.setBufferOption(BufferOption.Instant);
// OR
e1.setBufferOption(BufferOption.Default);
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `Instant` | Events are sent as soon as they are created |
| `Default` | Sends events in a group when 10 events are created |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#52-choosing-the-http-method)5.2 Choosing the HTTP method

Snowplow supports receiving events via GET requests, but will soon have POST support. In a GET request, each event is sent in individual request. With POST requests, events are bundled together in one request.

You can set the HTTP method in the Emitter constructor:

```
Emitter e1 = new Emitter("d3rkrsqld9gmqf.cloudfront.net", HttpMethod.POST);
```

Here are all the posibile options that you can use:

| **Option** | **Description** |
| --- | --- |
| `GET` | Sends events as GET requests |
| `POST` | Sends events as POST requests |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#53-method-of-sending-http-requests)5.3 Method of sending HTTP requests

An Emitter sends requests synchronously by default. If you want events to be sent asynchronously you can set this using `setRequestMethod(RequestMethod)`:

```
Emitter e1 = new Emitter("d3rkrsqld9gmqf.cloudfront.net");
e1.setRequestMethod(RequestMethod.Asynchronous);
```

Here are all the possible options that you can use:

| **Option** | **Description** |
| --- | --- |
| `Synchronous` | Sends events synchronously |
| `Asynchronous` | Sends events asynchronously |

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#android-only-1)Android Only

For Android, we only send events asynchronously so we've deprecated the `setRequestMethod` method.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#54-emitter-callback)5.4 Emitter callback

If an event fails to send because of a network issue, you can choose to handle the failure case with a callback class to react accordingly. The callback class needs to implement the `EmitterCallback` interface in order to do so. Here is a sample bit of code to show how it could work:

```
Emitter emitter = new Emitter(testURL, HttpMethod.GET, new RequestCallback() {
  @Override
  public void onSuccess(int bufferLength) {
    System.out.println("Buffer length for POST/GET:" + bufferLength);
  }

  @Override
  public void onFailure(int successCount, List<Payload> failedEvent) {
    System.out.println("Failure, successCount: " + successCount + "\nfailedEvent:\n" + failedEvent.toString());
  }
});
```

In the example, we we can see an in-line example of handling the case. If events are all successfully sent, the `onSuccess` method returns the number of successful events sent. If there were any failures, the `onFailure` method returns the successful events sent (if any) and a _list of events_ that failed to be sent (i.e. the HTTP state code did not return 200).

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#6-payload)6\. Payload

A Payload interface is used for implementing a [TrackerPayload](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#tracker-payload) and [SchemaPayload](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#schema-payload), but accordingly, can be used to implement your own Payload class if you choose.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#61-tracker-payload)6.1 Tracker Payload

A TrackerPayload is used internally within the Java Tracker to create the tracking event payloads that are passed to an Emitter to be sent accordingly.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#62-schema-payload)6.2 Schema Payload

A SchemaPayload is used primarily as a wrapper around a TrackerPayload. After creating a TrackerPayload, you create a SchemaPayload and use `setData` with the Payload, followed by, `setSchema` to set the schema that the payload will be used against.

This is mainly used under the hood, in the Tracker class but is useful to know if you want to create your own Tracker class.

Here's a short example:

```
// This is our TrackerPayload that we created
TrackerPayload trackerPayload = new TrackerPayload();
trackerPayload.add("key", "value");

// We wrap that payload in a SchemaPayload before sending it.
SchemaPayload schemaPayload = new SchemaPayload();
schemaPayload.setData(trackerPayload);
schemaPayload.setSchema("iglu:com.snowplowanalytics.snowplow/example/jsonschema/1-0-0");
```

## [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#7-logging)7\. Logging

Logging in the Tracker is done using SLF4J. Majority of the logging set as `DEBUG` so will not overly populate your own logging.

### [](https://github.com/snowplow/snowplow/wiki/Android-v0.1-and-Java-Tracker-v0.5#android-only-2)Android Only

Logging in the Android Tracker uses Android's [native logger](https://developer.android.com/reference/android/util/Log.html) set as `DEBUG` or `ERROR` with the \[`tag`\]([https://developer.android.com/reference/android/util/Log.html#d(java.lang.String](https://developer.android.com/reference/android/util/Log.html#d(java.lang.String), java.lang.String)) as the class name.

For example:

```
private final String TAG = Emitter.class.getName();
Log.e(TAG, "Cannot change RequestMethod: Asynchronous requests only available.");
```
