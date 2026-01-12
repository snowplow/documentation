---
title: "Sending events"
sidebar_label: "Sending events"
date: "2020-10-28"
sidebar_position: 3000
description: "Track self-describing events, structured events, page views, errors, and ecommerce transactions in Scala tracker 0.6.0 with circe JSON and SchemaKey."
keywords: ["scala 0.6 events", "self-describing events", "circe json"]
---

### Additional type safety

Since 0.5.0 self-describing events and contexts can be sent with `SchemaKey` wrapper from [Iglu Core](https://github.com/snowplow/iglu/wiki/Scala-iglu-core) for additional type-safety.

```scala
import com.snowplowanalytics.iglu.core.{SchemaKey, SchemaVer}
import io.circe.Json

val pageTypeContext = SelfDescribingJson(
  SchemaKey("com.acme", "page_type", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "type" := "promotional",
    "backgroundColor" := "red"
  )
)
t.trackPageView(url, contexts = List(pageTypeContext))
```

### `trackSelfDescribingEvent`

Use `trackSelfDescribingEvent` to track a custom Self-describing events (previously known as Unstructured Events) which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

You can use its alias `trackUnstructEvent`.

| **Argument**        | **Description**                                    | **Required?** | **Type**                   |
|---------------------|----------------------------------------------------|---------------|----------------------------|
| `unstructuredEvent` | Self-describing JSON containing unstructured event | Yes           | `SelfDescribingJson`       |
| `contexts`          | List of custom contexts for the event              | No            | `List[SelfDescribingJson]` |
| `timestamp`         | Device created timestamp or true timestamp         | No            | `Option[Timestamp]`        |

Create a Snowplow unstructured event [self-describing JSON](https://github.com/snowplow/iglu/wiki/Self-describing-JSONs):

```scala
import com.snowplowanalytics.iglu.core.{SchemaKey, SchemaVer}
import io.circe.Json

val productViewEvent = SelfDescribingJson(
  SchemaKey("com.acme", "product_view", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "sku" := "0000013"
  )
)
```

Send it using the `trackSelfDescribingEvent` tracker method:

```scala
tracker.trackSelfDescribingEvent(productViewEvent)
```

You can attach any number of custom contexts to an event:

```scala
val pageTypeContext = SelfDescribingJson(
  SchemaKey("com.acme", "page_type", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "type" := "promotional",
    "backgroundColor" := "red"
  )
)

val userContext = SelfDescribingJson(
  SchemaKey("com.acme", "user", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "userType" := "tester"
  )
)

t.trackSelfDescribingEvent(productViewEvent, List(pageTypeContext, userContext))
```

### `trackStructEvent`

Use `trackStructEvent` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required).

| **Argument** | **Description**                                                  | **Required?** | **Type**                   |
|--------------|------------------------------------------------------------------|---------------|----------------------------|
| `category`   | The grouping of structured events which this `action` belongs to | Yes           | `String`                   |
| `action`     | Defines the type of user interaction which this event involves   | Yes           | `String`                   |
| `label`      | A string to provide additional dimensions to the event data      | No            | `Option[String]`           |
| `property`   | A string describing the object or the action performed on it     | No            | `Option[String]`           |
| `value`      | A value to provide numerical data about the event                | No            | `Option[Double]`           |
| `contexts`   | List of custom contexts for the event                            | No            | `List[SelfDescribingJson]` |
| `timestamp`  | Device created timestamp or true timestamp                       | No            | `Option[Timestamp]`        |

Example:

```scala
val pageTypeContext = SelfDescribingJson(
  SchemaKey("com.acme", "page_type", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "type" := "promotional",
    "backgroundColor" := "red"
  )
)

val userContext = SelfDescribingJson(
  SchemaKey("com.acme", "user", "jsonschema", SchemaVer(1,0,0)),
  Json.obj(
    "userType" := "tester"
  )
)

t.trackStructEvent("commerce", "order", property=Some("book"), contexts=List(pageTypeContext, userContext))
```

### `trackPageView`

Use `trackPageView` to track a user viewing a page within your app. Arguments are:

| **Argument** | **Description**                      | **Required?** | **Validation**             |
|--------------|--------------------------------------|---------------|----------------------------|
| `pageUrl`    | The URL of the page                  | Yes           | `String`                   |
| `pageTitle`  | The title of the page                | No            | `Option[String]`           |
| `referrer`   | The address which linked to the page | No            | `Option[String]`           |
| `contexts`   | Custom contexts for the event        | No            | `List[SelfDescribingJson]` |
| `timestamp`  | When the pageview occurred           | No            | `Option[Timestamp]`        |

Example:

```scala
t.trackPageView("www.example.com", Some("example"), Some("www.referrer.com"))
```

### `trackError`

Use `trackError` to track exceptions raised during your app's execution. Arguments are:

| **Argument** | **Description**                  | **Required?** | **Validation**             |
|--------------|----------------------------------|---------------|----------------------------|
| `error`      | Any throwable need to be tracked | Yes           | `Throwable`                |
| `contexts`   | Custom contexts for the event    | No            | `List[SelfDescribingJson]` |
| `timestamp`  | When the pageview occurred       | No            | `Option[Timestamp]`        |

Example:

```scala
try {
  1 / 0
} catch {
  case e: java.lang.ArithmeticException =>
    t.trackError(e)
}
```

Note: this tracker should not be used to track exceptions happening in tracker itself, use [callbacks](/docs/sources/scala-tracker/previous-versions/0-6-0/initialization/index.md#callbacks) mechanism for that.

### `trackAddToCart`

Use `trackAddToCart` to track an add-to-cart event.

### `trackRemoveFromCart`

Use `trackRemoveFromCart` to track a remove-from-cart event.

### `trackTransaction`

Use `trackTransaction` to record view of transaction. Fire a `trackTransaction` to register the transaction, and then fire `trackTransactionItem` to log specific data about the items that were part of that transaction.

### `trackTransactionItem`

To track an ecommerce transaction item. Fire a `trackTransaction` to register the transaction, and then fire `trackTransactionItem` to log specific data about the items that were part of that transaction.

### Setting timestamp

By default, Scala Tracker will generate a `dvce_created_tstamp` and add it to event payload. You also can manually set it using `timestamp` argument in all tracking methods. It should be in milliseconds since the Unix epoch:

```scala
tracker.trackSelfDescribingEvent(productViewEvent, Nil, Some(1432806619000L))
```

Beside of it, you can set `true_tstamp` if you have more reliable source about event timestamp. You can tag timstamp as "true" using class `TrueTimestamp`:

```scala
tracker.trackSelfDescribingEvent(productViewEvent, Nil, Some(Tracker.TrueTimestamp(1432806619000L)))
```

Now event will be sent with `ttm` parameter instead of `dtm`.
