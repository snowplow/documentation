---
title: "Tracking specific events"
date: "2020-02-25"
sidebar_position: 50
---

| **Function** | \*_Description_ |
| --- | --- |
| `trackScreenView()` | Track the user viewing a screen within the application |
| `trackEcommerceTransaction()` | Track an ecommerce transaction and its items |
| `trackStructuredEvent()` | Track a Snowplow custom structured event |
| `trackUnstructuredEvent()` | Track a Snowplow custom unstructured event |

### Common

All events are tracked with specific methods on the tracker instance, of the form `trackXXX()`, where `XXX` is the name of the event to track.

#### Custom contexts

In short, custom contexts let you add additional information about the circumstances surrounding an event in the form of an Object. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```java
t1.trackScreenView(name:String, id:String, context:Array, timestamp:Number);
```

The `context` argument should consist of a `Array` of `SchemaPayload` representing an array of one or more contexts. The format of each individual context element is the same as for an [unstructured event](https://github.com/snowplow/snowplow/wiki/ActionScript3-Tracker#unstruct-event).

If a visitor arrives on a page advertising a movie, the context dictionary might look like this:

```json
{
  "schema": "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
  "data": {
    "movie_name": "Solaris",
    "poster_country": "JP",
    "poster_year": "1978"
  }
}
```

Note that even if there is only one custom context attached to the event, it still needs to be placed in an Array.

#### Optional timestamp & context argument

In all the trackers, we offer a way to set the timestamp if you want the event to show as tracked at a specific time. If you don't, we create a timestamp while the event is being tracked.

Here is an example:

```java
t1.trackScreenView("HUD > Save Game", "screen23", contextList, 123456789);
```

#### Tracker method return values

To be confirmed. As of now, trackers do not return anything.

### Track page views with `trackPageView()`

Use `trackPageView()` to track a user viewing a screen within your Flash app, in the case where the screen behaves like a web page and has its own unique URL that appears in the browser's address bar. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | String |
| `id` | Unique identifier for this screen | No | String |
| `context` | Custom context for the event | No | Array |
| `timestamp` | Optional timestamp for the event | No | Number |

Example:

```java
tracker.trackPageView("www.mysite.com#page3", "Page Three", "www.me.com", contextList);
```

In Flash, the more common case is to use `trackScreenView`.

### Track screen views with `trackScreenView()`

Use `trackScreenView()` to track a user viewing a screen (or equivalent) within your app. Arguments are:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `name` | Human-readable name for this screen | No | String |
| `id` | Unique identifier for this screen | No | String |
| `context` | Custom context for the event | No | Array |
| `timestamp` | Optional timestamp for the event | No | Number |

Example:

```java
t1.trackScreenView("HUD > Save Game", "screen23", contextList, 123456);
```

### Track ecommerce transactions with `trackEcommerceTransaction()`

Use `trackEcommerceTransaction()` to track an ecommerce transaction.

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `order_id` | ID of the eCommerce transaction | Yes | String |
| `total_value` | Total transaction value | Yes | Number |
| `affiliation` | Transaction affiliation | Yes | String |
| `tax_value` | Transaction tax value | Yes | Number |
| `shipping` | Delivery cost charged | Yes | Number |
| `city` | Delivery address city | Yes | String |
| `state` | Delivery address state | Yes | String |
| `country` | Delivery address country | Yes | String |
| `currency` | Transaction currency | Yes | String |
| `items` | Items in the transaction | Yes | Array |
| `context` | Custom context for the event | No | Object |
| `timestamp` | Optional timestamp for the event | No | Number |

The `items` argument is a `List` of individual `TransactionItem` elements representing the items in the e-commerce transaction. Note that `trackEcommerceTransaction` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`. Each transaction item event will have the same timestamp, order\_id, and currency as the main transaction event.

#### Ecommerce TransactionItem with `trackEcommerceTransaction()`

To instantiate a TransactionItem in your code, simply use the following constructor signature:

```java
trackEcommerceTransactionItem(order_id:String, sku:String, price:Number, quantity:int, name:String, category:String, currency:String, context:Array, timestamp:Number)
```

These are the fields that can appear as elements in each `TransactionItem` element of the transaction item `Array`:

| **Field** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `order_id` | Order ID | Yes | String |
| `sku` | Item SKU | No | String |
| `price` | Item price | No | Number |
| `quantity` | Item quantity | No | int |
| `name` | Item name | No | String |
| `category` | Item category | No | String |
| `currency` | Item currency | No | String |
| `context` | Item context | No | Array |
| `timestamp` | Optional timestamp for the event | No | Number |

Example of tracking a transaction containing two items:

```java
// Example to come, in the meantime here is the type signature:
t1.trackEcommerceTransaction(order_id:String, total_value:Number, affiliation:String, tax_value:Number, shipping:Number, city:String, state:String, country:String, currency:String, items:Array, context:Array = null, timestamp:Number = 0);
t1.trackEcommerceTransaction("6a8078be", 300, "my_affiliate", 30, 10, "Boston", "Massachusetts", "USA", "USD", items, context);
```

### Track structured events with `trackStructuredEvent()`

Use `trackStructuredEvent()` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | String |
| `action` | Defines the type of user interaction which this event involves | Yes | String |
| `label` | A string to provide additional dimensions to the event data | Yes | String |
| `property` | A string describing the object or the action performed on it | Yes | String |
| `value` | A value to provide numerical data about the event | Yes | int |
| `context` | Custom context for the event | No | Array |
| `timestamp` | Optional timestamp for the event | No | Number |

Example:

```java
t1.trackStructuredEvent(category:String, action:String, label:String, property:String, value:int, context:Array = null, timestamp:Number = 0);
```

### Track unstructured events with `trackUnstructuredEvent()`

Custom unstructured events are a flexible tool that enables Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom unstructured event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `trackUnstructuredEvent()` to track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `eventData` | The properties of the event | Yes | SchemaPayload |
| `context` | Custom context for the event | No | Array |
| `timestamp` | Optional timestamp for the event | No | Number |

Example:

```java
t1.trackUnstructuredEvent(eventData, contextList);
```
