---
title: "Tracking events"
sidebar_label: "Tracking events"
date: "2022-03-24"
sidebar_position: 20
description: "Track page views, screen views, and custom events with Java tracker version 0.12."
keywords: ["event tracking v0.12", "page view tracking", "custom events"]
---

To track an event, pass an `Event` instance to the `Tracker`.

For example, tracking a `ScreenView`:

```java
Event event = new ScreenView.builder()
                .name("screen name")
                .build();
tracker.track(event);
```

The Java tracker makes it easy to track different kinds of data. We provide a range of `Event` classes for tracking out-of-the-box event types as well as fully custom events.

Every tracked event payload has a unique `event_id` UUID string. Other ubiquitous properties include the `name_tracker` (`trackerNamespace`) and `app_id` (`appId`) set when the `Tracker` was initialized. From version 0.12 onwards, `Tracker.track()` returns the payload's `eventId`.

Snowplow events have a defined structure and [protocol](/docs/events/index.md) that is identical regardless of the tracker used. A minimal payload - the raw event - is sent from the tracker to your collector. The raw event is [enriched](/docs/pipeline/enrichments/index.md) as it passes through your pipeline. By the time the event arrives in your data storage, depending which [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md) you have enabled, it will have gained different kinds of metadata, and have many more fields than it started with. The default Java tracker event fields are shown [here](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/what-do-java-tracker-events-look-like/index.md).

The [Java tracker Github repository](https://github.com/snowplow/snowplow-java-tracker) includes a mini demo, "simple-console". The demo sends one event of each type to your event collector.

## Auto-tracked events

The Java tracker does not yet support automatic event tracking. All tracking must be implemented manually.

## Manually-tracked events summary

The Java tracker provides classes for tracking different types of events. They are listed below.

| `Event` class                                                                                                                                                                                      | `e` in raw event | `eventType` in enriched event |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------- |
| [`Unstructured` (custom)](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-a-custom-event-unstructured-events)                           | ue               | unstruct                      |
| [`ScreenView`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-a-screenview-event)                                                      | ue               | unstruct                      |
| [`Timing`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-a-timing-event)                                                              | ue               | unstruct                      |
| [`PageView`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-a-pageview-event)                                                          | pv               | page_view                     |
| [`Structured`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-a-structured-event)                                                      | se               | struct                        |
| [`EcommerceTransaction`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-ecommercetransaction-and-ecommercetransactionitem-event)\*     | tr               | transaction                   |
| [`EcommerceTransactionItem`](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#creating-ecommercetransaction-and-ecommercetransactionitem-event)\* | ti               | transaction_item              |

Note: `EcommerceTransaction`/`EcommerceTransactionItem` are a legacy design and may be deprecated soon.

`Unstructured` events (also called Self-Describing events elsewhere in Snowplow) allow you to track anything that can be described by a [JSON schema](/docs/fundamentals/schemas/index.md). The data you provide will be sent as a JSON inside the raw event payload. The specific type of JSON schema needed are described fully on the [next page](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/custom-tracking-using-schemas/index.md).

The `ScreenView` and `Timing` out-of-the-box event types are actually wrappers for `Unstructured` events: the method parameters for building those events represent fields in their hidden self-describing JSON schemas. This is why both `ScreenView` and `Timing` events are labelled "unstruct" in the data warehouse.

The `PageView` and `Structured` event types are processed differently from `Unstructured` events. Properties tracked using these events are not sent packaged as JSON, but as individual "atomic" fields in the raw event payload. We call these event types "primitive" or "canonical".

`Unstructured` events and primitive/canonical events are loaded into and modelled differently in your data warehouse. The "atomic" fields will always have individual columns.

`EcommerceTransaction` and `EcommerceTransactionItem` events are legacy primitive events. We recommend instead designing your own `Unstructured` events plus [context entities](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/custom-tracking-using-schemas/index.md) for eCommerce tracking.

### Tracking data that is not event-type specific

Some data, such as that relating to the user whose activity is being tracked, is relevant across all event types. The Java tracker provides two mechanisms for tracking this kind of data.

Certain properties, including `userId` or `ipAddress`, can be set as "atomic" properties in the raw event, using the `Subject` class. `Subject` properties relate mainly to client-side tracking. If you are using the Java tracker for server-side tracking, you may wish to pass client-side data for tracking server-side. These properties are discussed [here](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-specific-client-side-properties/index.md).

A more general and powerful method is to attach self-describing JSON "context entities" to your events - the same JSON schemas as used for `Unstructured` events. This means that any data that can be described by a JSON schema can be added to any or all of your events. Read more on the [next page](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/custom-tracking-using-schemas/index.md).

All events also provide the option for setting a custom timestamp, called `trueTimestamp`. See [below](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/tracking-events/index.md#adding-custom-timestamps-to-events) for details.

### Creating a custom event (Unstructured events)

To track data using an `Unstructured` event, the data must be structured as a `SelfDescribingJson` object, discussed fully in [Custom tracking with schemas](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/custom-tracking-using-schemas/index.md). These require two fields. The first is a URI for a self-describing JSON schema. The second is a data map, and the data must be valid against the schema. `Unstructured` events can be considered wrappers for sending `SelfDescribingJson`.

`Unstructured` is a legacy name. This event type will be renamed the more accurate `SelfDescribing` in the next release.

The simplest initialisation looks like this:

```java
Unstructured unstructured = Unstructured.builder()
            .eventData(dataAsSelfDescribingJson)
            .build();
```

See the API docs for the full [Unstructured.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/Unstructured.Builder.html) options.

### Creating a `ScreenView` event

Track screen views with the `ScreenView` event. It's a wrapper around an `Unstructured` event, using [this schema](https://github.com/snowplow/iglu-central/blob/324cfe9a5390174a56084722a545287d01a5a060/schemas/com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0).

A simple initialisation looks like this:

```java
ScreenView screenView = ScreenView.builder()
            .name("human readable screen name")
            .id("unique screen ID")
            .build();
```

At least one of `name` or `id` must be set. See the API docs for the full [ScreenView.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/ScreenView.Builder.html) options.

### Creating a `Timing` event

Track how long something took with the `Timing` event. It's a wrapper around an `Unstructured` event, using [this schema](https://github.com/snowplow/iglu-central/blob/324cfe9a5390174a56084722a545287d01a5a060/schemas/com.snowplowanalytics.snowplow/timing/jsonschema/1-0-0).

A simple initialisation looks like this:

```java
Timing timing = Timing.builder()
            .category("category of the timed event")
            .variable("name of the timed event")
            .timing(10) // in milliseconds
            .label("optional label")
            .build();
```

Provide your `timing` value in milliseconds. The `label` property is optional. See the API docs for the full [Timing.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/Timing.Builder.html) options.

### Creating a `PageView` event

Track page views with the `PageView` event. This is a "primitive" event type; data will end up in individual "atomic" columns in the data warehouse.

| Property     | Field in raw event | Column in enriched event |
| ------------ | ------------------ | ------------------------ |
| page URL     | url                | page_url                 |
| page title   | page               | page_title               |
| referrer URL | refr               | page_referrer            |

The provided URLs will also be decomposed into other columns, such as `page_urlscheme`, during event [enrichment](/docs/pipeline/enrichments/index.md).

A simple initialisation looks like this:

```java
PageView pageViewEvent = PageView.builder()
            .pageUrl("https://snowplow.io")
            .pagetitle("Snowplow")
            .referrer("https://github.com/snowplow/snowplow-java-tracker")
            .build();
```

Only `pageUrl` is required. See the API docs for the full [PageView.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/PageView.Builder.html) options.

### Creating a `Structured` event

To track custom data without schemas, use `Structured` events. They are the "primitive" equivalent of `Unstructured` events. The provided data will end up in individual "atomic" columns in the data warehouse. Because of this, it's not possible to fully customise a `Structured` event: the fields cannot be renamed, nor new fields added. `Structured` events are designed to be similar to Google-style events.

The `Structured` event fields have flexible definitions, and what you put into each field is up to you. This is a double-edged sword. It's highly advisable to agree business-wide on definitions for each of these fields, before implementing tracking.

| Property | Often contains data about     | Field in raw event | Column in enriched event |
| -------- | ----------------------------- | ------------------ | ------------------------ |
| category | Grouping for the action       | se_ca              | se_category              |
| action   | Type of user activity         | se_ac              | se_action                |
| label    | Additional event data         | se_la              | se_label                 |
| property | The action or object acted on | se_pr              | se_property              |
| value    | Numerical event data          | se_va              | se_value                 |

A simple initialisation looks like this:

```java
Structured structured = Structured.builder()
                .category("category e.g. auth")
                .action("action e.g. logout")
                .label("optional label")
                .property("optional property")
                .value(12.34)
                .build();
```

Both `category` and `action` are required. See the API docs for the full [Structured.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/Structured.Builder.html) options.

### Creating `EcommerceTransaction` and `EcommerceTransactionItem` events

To track eCommerce data, we recommend designing your own schemas for an `Unstructured` event. We suggest creating one schema for the overall transaction, and another schema for individual items. The transaction schema can be used for the `Unstructured` event. Items in the transaction can be added as [context entities](/docs/sources/java-tracker/previous-versions/java-tracker-v0-12/custom-tracking-using-schemas/index.md).

The `EcommerceTransaction` and `EcommerceTransactionItem` events are legacy events, and it's highly likely they will be deprecated in the future. They are designed to be sent together, with one `EcommerceTransaction` containing an `EcommerceTransactionItem` for every item in the transaction. When the `EcommerceTransaction` event is tracked, the `EcommerceTransactionItem` events are extracted and sent separately. This means that although you have only tracked one event (using `Tracker.track()`), multple events are generated.

`EcommerceTransaction` and `EcommerceTransactionItem` are "primitive" events. The data will end up in individual "atomic" columns in the data warehouse.

| `EcommerceTransaction` property | Field in raw event | Column in enriched event |
| ------------------------------- | ------------------ | ------------------------ |
| orderId                         | tr_id              | tr_orderid               |
| totalValue                      | tr_tt              | tr_total                 |
| affiliation                     | tr_af              | tr_affiliation           |
| taxValue                        | tr_tx              | tr_tax                   |
| shipping                        | tr_sh              | tr_shipping              |
| city                            | tr_ci              | tr_city                  |
| state                           | tr_st              | tr_state                 |
| country                         | tr_co              | tr_country               |
| currency                        | tr_cu              | tr_currency              |

| `EcommerceTransactionItem` property | Field in raw event | Column in enriched event |
| ----------------------------------- | ------------------ | ------------------------ |
| itemId                              | ti_id              | ti_orderid               |
| sku                                 | ti_sk              | ti_sku                   |
| price                               | ti_pr              | ti_price                 |
| quantity                            | ti_qu              | ti_quantity              |
| name                                | ti_nm              | ti_name                  |
| category                            | ti_ca              | ti_category              |
| currency                            | ti_cu              | ti_currency              |

The `orderId` and `itemId` should be the same, as it's the most direct way to associate the two events once they are in the warehouse.

A simple initialisation looks like this:

```java
// Create events for each item in the transaction
EcommerceTransactionItem item = EcommerceTransactionItem.builder()
        .itemId("should be the same as order_id")
        .sku("sku")
        .price(1.0)
        .quantity(2)
        .name("item name")
        .category("category")
        .currency("currency")
        .build();

// Then make the EcommerceTransaction event
EcommerceTransaction ecommerceTransaction = EcommerceTransaction.builder()
        .items(item) // Add the EcommerceTransactionItem events
        .orderId("should be the same as item_id")
        .totalValue(2.0)
        .affiliation("affiliation")
        .taxValue(2.0)
        .shipping(3.0)
        .city("city")
        .state("state")
        .country("country")
        .currency("currency")
        .build();
```

For `EcommerceTransactionItem` events, `itemId`, `sku`, `price` and `quantity` are required. For `EcommerceTransaction` events, only `orderId` and `totalValue` are required. See the API docs for the full [EcommerceTransaction.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/EcommerceTransaction.Builder.html) and [EcommerceTransactionItem.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/events/EcommerceTransactionItem.Builder.html) options.

## Adding custom timestamps to events

Snowplow events have several timestamps. The raw event payload always contains a `deviceCreatedTimestamp` (`dtm`) and a `deviceSentTimestamp` (`stm`). Other timestamps are added as the event moves through the pipeline.

Every `Event.Builder` in the Java tracker allows for a custom timestamp, called `trueTimestamp` to be set. A `trueTimestamp` can be added to any event using the `trueTimestamp()` Builder method:

```java
// This example shows an Unstructured event, but all events can have a trueTimestamp
Unstructured unstructured = Unstructured.builder()
            .eventData(dataAsSelfDescribingJson)
            .trueTimestamp(1647616394785L)
            .build();
```

`trueTimestamp` should be a `Long` representing milliseconds since the Unix epoch.
