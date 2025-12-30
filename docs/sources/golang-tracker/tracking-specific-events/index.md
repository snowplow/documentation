---
title: "Track specific events with the Golang tracker"
sidebar_label: "Tracking specific events"
description: "Track behavioral events including SelfDescribing, ScreenView, PageView, EcommerceTransaction, Structured, and Timing events. Add custom contexts and optional timestamps to all tracked events."
keywords: ["golang track events", "self-describing events", "structured events", "ecommerce tracking", "page view tracking"]
date: "2020-02-26"
sidebar_position: 40
---

Tracking methods supported by the Golang Tracker at a glance:

| **Function**                                    | **Description**                                        |
| ----------------------------------------------- | ------------------------------------------------------ |
| [`TrackSelfDescribingEvent()`](#unstruct-event) | Track a Snowplow custom unstructured event             |
| [`TrackScreenView()`](#screen-view)             | Track the user viewing a screen within the application |
| [`TrackPageView()`](#page-view)                 | Track and record views of web pages.                   |
| [`TrackEcommerceTransaction()`](#ecommerce)     | Track an ecommerce transaction                         |
| [`TrackStructEvent()`](#struct-event)           | Track a Snowplow custom structured event               |
| [`TrackTiming()`](#timing-event)                | Track a timing event                                   |

:::note

All event structs require pointer values as a way of asserting properly whether or not a value has been passed that might have been required. As such there are three functions provided in `helper` package that allow you to inline pointer values:

- `NewString`
- `NewInt64`
- `NewFloat64`

These all accept their respective raw value and return a pointer to this value.

To import the helper package:

```
import sphelp "github.com/snowplow/snowplow-golang-tracker/v3/pkg/common"
```

:::

### Common

All events are tracked with specific methods on the tracker instance, of the form `TrackXXX()`, where `XXX` is the name of the event to track.

### Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of an array of SelfDescribingJson structs (`[]SelfDescribingJson`). Each tracking method accepts an additional optional contexts parameter, which should be a list of contexts:

```go
contextArray := []sp.SelfDescribingJson{}
```

If a visitor arrives on a page advertising a movie, the dictionary for a single custom context in the list might look like this:

```go
contextArray := []sp.SelfDescribingJson{
  *sp.InitSelfDescribingJson(
    "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
    map[string]interface{}{
      "movie_name": "Solaris",
      "poster_country": "JP",
    },
  ),
}
```

This is how to fire a page view event with the above custom context:

```go
tracker.TrackPageView(
  sp.PageViewEvent{
    PageUrl: sphelp.NewString("acme.com"),
    Contexts: contextArray,
  },
)
```

Note that even though there is only one custom context attached to the event, it still needs to be placed in an array.

### Optional timestamp argument

Each `Track...()` method supports an optional timestamp argument; this allows you to manually override the timestamp attached to this event. The timestamp should be in milliseconds since the Unix epoch.

If you do not pass this timestamp in as an argument, then the Golang Tracker will use the current time to be the timestamp for the event.

Here is an example tracking a structured event and supplying the optional timestamp argument:

```go
tracker.TrackStructEvent(sp.StructuredEvent{
  Category: sphelp.NewString("some category"),
  Action: sphelp.NewString("some action"),
  Timestamp: sphelp.NewInt64(1368725287000),
})
```

### Optional true-timestamp argument

Each `Track...()` method supports an optional true-timestamp argument; this allows you to provide the true-timestamp attached to this event to help with the timing of events in multiple timezones. The timestamp should be in milliseconds since the Unix epoch.

Here is an example tracking a structured event and supplying the optional true-timestamp argument:

```go
tracker.TrackStructEvent(sp.StructuredEvent{
  Category: sphelp.NewString("some category"),
  Action: sphelp.NewString("some action"),
  TrueTimestamp: sphelp.NewInt64(1368725287000),
})
```

### Optional event ID argument

Each `Track...()` method supports an optional event id argument; this allows you to manually override the event ID attached to this event. The event ID should be a valid version 4 UUID string.

Here is an example tracking a structured event and supplying the optional event ID argument:

```go
tracker.TrackStructEvent(sp.StructuredEvent{
  Category: sphelp.NewString("some category"),
  Action: sphelp.NewString("some action"),
  EventId: sphelp.NewString("486820fb-e722-4311-b33d-d2f319b511f6"),
})
```

### Optional Subject argument

Each `Track...()` method supports an optional Subject argument; this allows you to manually override the Subject information that is usually pulled from the `Tracker` object.

Here is an example of tracking a Page View event and supplying the optional Subject argument:

```go
eventSubject := sp.InitSubject()
eventSubject.SetUserId("987654321")

tracker.TrackPageView(sp.PageViewEvent{
	PageUrl:  sphelp.NewString("acme.com"),
	Subject:  eventSubject,
})
```

### Track SelfDescribing/Unstructured events with `TrackSelfDescribingEvent()`

Use `TrackSelfDescribingEvent()` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument**    | **Description**               | **Required?** | **Validation**       |
| --------------- | ----------------------------- | ------------- | -------------------- |
| `Event`         | The properties of the event   | Yes           | \*SelfDescribingJson |
| `Timestamp`     | When the event occurred       | No            | \*int64              |
| `EventId`       | The event ID                  | No            | \*string             |
| `TrueTimestamp` | The true time of event        | No            | \*int64              |
| `Contexts`      | Custom contexts for the event | No            | []SelfDescribingJson |
| `Subject`       | Event specific Subject        | No            | Subject              |

Example:

```go
// Create a data map
data := map[string]interface{}{
  "level": 5,
  "saveId": "ju302",
  "hardMode": true,
}

// Create a new SelfDescribingJson
sdj := sp.InitSelfDescribingJson("iglu:com.example_company/save-game/jsonschema/1-0-2", data)

tracker.TrackSelfDescribingEvent(sp.SelfDescribingEvent{
  Event: sdj,
})
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

### Track screen views with `TrackScreenView()`

Use `TrackScreenView()` to track a user viewing a screen (or equivalent) within your app:

| **Argument**    | **Description**                     | **Required?** | **Type**             |
| --------------- | ----------------------------------- | ------------- | -------------------- |
| `Name`          | Human-readable name for this screen | No            | \*string             |
| `Id`            | Unique identifier for this screen   | No            | \*string             |
| `Timestamp`     | When the event occurred             | No            | \*int64              |
| `EventId`       | The event ID                        | No            | \*string             |
| `TrueTimestamp` | The true time of event              | No            | \*int64              |
| `Contexts`      | Custom contexts for the event       | No            | []SelfDescribingJson |
| `Subject`       | Event specific Subject              | No            | Subject              |

Although name and id are not individually required, at least one must be provided or the event will fail validation.

Example:

```go
tracker.TrackScreenView(sp.ScreenViewEvent{
  Id: sphelp.NewString("Screen ID"),
})
```

### Track pageviews with `TrackPageView()`

Use `TrackPageView()` to track a user viewing a page within your app:

| **Argument**    | **Description**                      | **Required?** | **Validation**       |
| --------------- | ------------------------------------ | ------------- | -------------------- |
| `PageUrl`       | The URL of the page                  | Yes           | \*string             |
| `PageTitle`     | The title of the page                | No            | \*string             |
| `Referrer`      | The address which linked to the page | No            | \*string             |
| `Timestamp`     | When the event occurred              | No            | \*int64              |
| `EventId`       | The event ID                         | No            | \*string             |
| `TrueTimestamp` | The true time of event               | No            | \*int64              |
| `Contexts`      | Custom contexts for the event        | No            | []SelfDescribingJson |
| `Subject`       | Event specific Subject               | No            | Subject              |

Example:

```go
tracker.TrackPageView(sp.PageViewEvent{
  PageUrl: sphelp.NewString("acme.com"),
})
```

### Track ecommerce transactions with `TrackEcommerceTransaction()`

Use `TrackEcommerceTransaction()` to track an ecommerce transaction:

| **Argument**    | **Description**                 | **Required?** | **Validation**                  |
| --------------- | ------------------------------- | ------------- | ------------------------------- |
| `OrderId`       | ID of the eCommerce transaction | Yes           | \*string                        |
| `TotalValue`    | Total transaction value         | Yes           | \*float64                       |
| `Affiliation`   | Transaction affiliation         | No            | \*string                        |
| `TaxValue`      | Transaction tax value           | No            | \*float64                       |
| `Shipping`      | Delivery cost charged           | No            | \*float64                       |
| `City`          | Delivery address city           | No            | \*string                        |
| `State`         | Delivery address state          | No            | \*string                        |
| `Country`       | Delivery address country        | No            | \*string                        |
| `Currency`      | Transaction currency            | No            | \*string                        |
| `Items`         | Items in the transaction        | Yes           | []EcommerceTransactionItemEvent |
| `Timestamp`     | When the event occurred         | No            | \*int64                         |
| `EventId`       | The event ID                    | No            | \*string                        |
| `TrueTimestamp` | The true time of event          | No            | \*int64                         |
| `Contexts`      | Custom contexts for the event   | No            | []SelfDescribingJson            |
| `Subject`       | Event specific Subject          | No            | Subject                         |

The `items` argument is an Array of TransactionItems. `TrackEcommerceTransaction` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `Items` list. Each transaction item event will have the same timestamp, true timestamp, order ID, and currency as the main transaction event.

These are the fields with which a TransactionItem can be created.

| **Field**  | **Description**               | **Required?** | **Validation**       |
| ---------- | ----------------------------- | ------------- | -------------------- |
| `Sku`      | Item SKU                      | Yes           | \*string             |
| `Price`    | Item price                    | Yes           | \*float64            |
| `Quantity` | Item quantity                 | Yes           | \*int64              |
| `Name`     | Item name                     | No            | \*string             |
| `Category` | Item category                 | No            | \*string             |
| `EventId`  | The event ID                  | No            | \*string             |
| `Contexts` | Custom contexts for the event | No            | []SelfDescribingJson |
| `Subject`  | Event specific Subject        | No            | Subject              |

Example of tracking a transaction containing two items:

```go
items := []sp.EcommerceTransactionItemEvent{
  sp.EcommerceTransactionItemEvent{
    Sku: sphelp.NewString("pbz0026"),
    Price: sphelp.NewFloat64(20),
    Quantity: sphelp.NewInt64(1),
  },
  sp.EcommerceTransactionItemEvent{
    Sku: sphelp.NewString("pbz0038"),
    Price: sphelp.NewFloat64(15),
    Quantity: sphelp.NewInt64(1),
    Name: sphelp.NewString("red hat"),
    Category: sphelp.NewString("menswear"),
  },
}

tracker.TrackEcommerceTransaction(sp.EcommerceTransactionEvent{
  OrderId: sphelp.NewString("6a8078be"),
  TotalValue: sphelp.NewFloat64(35),
  Affiliation: sphelp.NewString("some-affiliation"),
  TaxValue: sphelp.NewFloat64(6.12),
  Shipping: sphelp.NewFloat64(30),
  City: sphelp.NewString("Dijon"),
  State: sphelp.NewString("Bourgogne"),
  Country: sphelp.NewString("France"),
  Currency: sphelp.NewString("EUR"),
  Items: items,
})
```

### Track structured events with `TrackStructEvent()`

Use `TrackStructEvent()` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument**    | **Description**                                                  | **Required?** | **Validation**       |
| --------------- | ---------------------------------------------------------------- | ------------- | -------------------- |
| `Category`      | The grouping of structured events which this `action` belongs to | Yes           | \*string             |
| `Action`        | Defines the type of user interaction which this event involves   | Yes           | \*string             |
| `Label`         | A string to provide additional dimensions to the event data      | No            | \*string             |
| `Property`      | A string describing the object or the action performed on it     | No            | \*string             |
| `Value`         | A value to provide numerical data about the event                | No            | \*float64            |
| `Timestamp`     | When the event occurred                                          | No            | \*int64              |
| `EventId`       | The event ID                                                     | No            | \*string             |
| `TrueTimestamp` | The true time of event                                           | No            | \*int64              |
| `Contexts`      | Custom contexts for the event                                    | No            | []SelfDescribingJson |
| `Subject`       | Event specific Subject                                           | No            | Subject              |

Example:

```go
tracker.TrackStructEvent(sp.StructuredEvent{
  Category: sphelp.NewString("shop"),
  Action: sphelp.NewString("add-to-basket"),
  Property: sphelp.NewString("pcs"),
  Value: sphelp.NewFloat64(2),
})
```

### Track timing events with `TrackTiming()`

Use `TrackTiming()` to track a timing event.

The arguments are as follows:

| **Argument**    | **Description**               | **Required?** | **Validation**       |
| --------------- | ----------------------------- | ------------- | -------------------- |
| `Category`      | The category of the event     | Yes           | \*string             |
| `Variable`      | The variable of the event     | Yes           | \*string             |
| `Timing`        | The timing of the event       | Yes           | \*int64              |
| `Label`         | The label of the event        | No            | \*string             |
| `Timestamp`     | When the event occurred       | No            | \*int64              |
| `EventId`       | The event ID                  | No            | \*string             |
| `TrueTimestamp` | The true time of event        | No            | \*int64              |
| `Contexts`      | Custom contexts for the event | No            | []SelfDescribingJson |
| `Subject`       | Event specific Subject        | No            | Subject              |

Example:

```go
tracker.TrackTiming(sp.TimingEvent{
  Category: sphelp.NewString("Timing Category"),
  Variable: sphelp.NewString("Some var"),
  Timing: sphelp.NewInt64(124578),
})
```
