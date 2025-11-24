---
title: "Tracking specific events"
sidebar_label: "Tracking specific events"
sidebar_position: 40
description: "Track page views, ecommerce transactions, structured events, and self-describing events with Python tracker v0.15 using track methods."
keywords: ["python tracker v0.15 events", "page view tracking", "ecommerce tracking"]
---

As a Snowplow user, you have the access to a wide selection of event types and associated methods for tracking as well as the ability to define your own event types:

| **Function** | **Description** |
| --- | --- |
| [`track_page_view()`](#track-page-view) | Track views of web pages |
| [`track_page_ping()`](#track-page-pings) | Track engagement on web pages over time |
| [`track_link_click()`](#track-link-clicks) | Track link clicks |
| [`track_form_change()`](#track-form-change) | Track form changes |
| [`track_form_submit()`](#track-submitted-forms) | Track that a form was submitted |
| [`track_site_search()`](#track-site-searches) | Track when a user searches your site |
| [`track_screen_view()`](#track-mobile-screen-view) | Track screen views (non-web e.g. in-app) |
| [`track_mobile_screen_view()`](#track-mobile-screen-view) | Track mobile screen views |
| [`track_ecommerce_transaction()`](#track-ecommerce-transactions) | Track ecommerce transaction |
| [`track_ecommerce_transaction_item()`](#track-ecommerce-transaction-items) | Track an item of an ecommerce transaction |
| [`track_add_to_cart()`](#track-add-to-cart-events) | Track an add to cart event |
| [`track_remove_from_cart()`](#track-remove-from-cart-events) | Track a remove from cart event |
| [`track_struct_event()`](#track-structured-events) | Track a Snowplow custom structured event |
| [`track_self_describing_event()`](#track-self-describing-event) | Track an event that you have defined yourself |

### Common tracking parameters

All events are tracked with specific methods on the tracker instance, of the form `track_XXX()`, where `XXX` is the name of the event to track. The parameters that are common for all track methods are:

- `context`
- `tstamp`
- `event_subject` (**_\*\*New to v0.9.0_**)

#### 1. Custom context

Custom context can be used to augment any standard Snowplow event type, including self describing events, with additional data.

Custom context can be added as an extra argument to any of Snowplow’s `track..()` methods.

When you track an event, some of the data that you track will be specific to that event. A lot of the data you want to record, however, will describe entities that are tracked across multiple events. For example, a media company might want to track the following events:

- User views video listing
- User plays video
- User pauses video
- User shares video
- User favorites video
- User reviews video

Whilst each of those events is a different type, all of them involve capturing data about the user and the video. Both the 'user' and 'video' are entities that are tracked across multiple event types. Both are candidates to be "custom context". You as a Snowplow user can define your own custom contexts (including associated schemas) and then send data for as many custom contexts as you wish with _any_ Snowplow event. So if you want, you can define your own "user context", and then send additional user data in that object with any event. Other examples of context include:

- articles
- videos
- products
- categories
- pages / page_types
- environments

Each tracking method accepts an additional optional context parameter after all the parameters specific to that method:

The `context` argument should consist of an array of one or more instances of `SelfDescribingJson` class. This class isomorphic to self-describing JSON, to be more precisely - it has Iglu URI attribute and data itself.

For example, if a server-side Python application can determine visitor's geoposition, this can be attached to the event, using the `geolocation_context` that is predefined on [Iglu Central](https://github.com/snowplow/iglu-central):

```python
from snowplow_tracker import SelfDescribingJson

geo_context = SelfDescribingJson(
  "iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-0-0",
  {
    "latitude": -23.2,
    "longitude": 43.0
  }
)
```

As another example, if a visitor arrives on a page advertising a movie, the context object might look like this (`movie_poster` is custom context, not predefined):

```python
poster_context = SelfDescribingJson(
  "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
  {
    "movie_name": "Solaris",
    "poster_country": "JP",
    "poster_year": "1978-01-01"
  }
)
```

This is how to fire a page view event with both above contexts:

```python
tracker.track_page_view("http://www.films.com", "Homepage", context=[poster_context, geo_context])
```

**Important:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array.

Note also that you should not pass in an empty array of contexts as this will fail validation. Instead of an empty array, you can pass in `None`.

#### 2. Timestamp argument

Each `track...()` method supports an optional timestamp as an argument. The timestamp should be in milliseconds since the Unix epoch, the same format as generated by `time.time() * 1000` .

Generally, according to the Snowplow Tracker Protocol, every event tracked will be recorded with two timestamps:

- the `dvce_created_tstamp`, which is the timestamp when the event was created

- the `dvce_sent_tstamp`, which is the timestamp when the event was sent

These are going to be used downstream, to calculate the `derived_tstamp` for the event, which takes also into account the collector timestamp, in order to best approximate the exact time the event occurred.

The optional timestamp argument is for the cases where you might want to set the event timestamp yourself. If this argument is not provided or set to None, then the Python Tracker will use the current time to be the `dvce_created_tstamp` for the event.

Here is an example tracking a structured event and supplying the optional timestamp argument. We can explicitly supply `None` for the intervening arguments which are empty:

```python
tracker.track_struct_event("some cat", "save action", None, None, None, 1368725287000)
```

Alternatively, we can use the argument name:

```python
tracker.track_struct_event("some cat", "save action", tstamp=1368725287000)
```

**_\*\*Prior to v0.9.0_**

Before version 0.9.0 of the Python Tracker, providing a `snowplow_tracker.timestamp.TrueTimestamp` object as the timestamp argument will attach a true timestamp to the event, replacing the device timestamp. For example:

```python
from snowplow_tracker.tracker import TrueTimestamp
tracker.track_struct_event("some cat", "save action", tstamp=TrueTimestamp(1368725287000))
```

Above will attach [`ttm`](/docs/fundamentals/canonical-event/index.md#time-and-date-fields)([`true_tstamp`](/docs/fundamentals/canonical-event/index.md#time-and-date-fields)) parameter instead of default `dtm`. You can also use, plain integer, `DeviceTimestamp` or `None` to send `device_sent_timestamp`.

**_\*\*New to v0.9.0_**

Since version 0.9.0, providing the optional timestamp argument will only set the true timestamp (true_tstamp) of the event. The type of this argument can only be the unix time in milliseconds. If you migrate from previous version, make sure to replace any references to Timestamp objects, since the Timestamp class (along with the TrueTimestamp and DeviceTimestamp subclasses) do not exist.

```python

tracker.track_struct_event("some cat", "save action", tstamp=1368725287000)
```

#### 3. Event subject (since v0.9.0)

Since version 0.9.0, it is possible to set the Subject per-event, in order to augment the event with extra information without having to change the Subject at the Tracker level. This provides a thread safe way to track multiple subjects.

This is supported as an optional keyword argument by all track methods. For example:

```python

evSubject = Subject().set_user_id("1234")
tracker.track_page_view("www.example.com", event_subject=evSubject)
```

### Tracker method return values

All tracker methods will return the tracker instance, allowing tracker methods to be chained:

```python
e = AsyncEmitter("d3rkrsqld9gmqf.cloudfront.net")
t = Tracker(e)

t.track_page_view("http://www.example.com").track_screen_view("title screen")
```

:::note
Since v0.13.0 we recommend using `track_mobile_screen_view()` instead of the deprecated `track_screen_view()` method.
:::

### Track self-describing event

Use `track_self_describing_event()` to track an event types that you have defined yourself.

This method's arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `event_json` | The properties of the event | Yes | SelfDescribingJson |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the unstructured event occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
from snowplow_tracker import SelfDescribingJson

tracker.track_self_describing_event(SelfDescribingJson(
  "iglu:com.example_company/save-game/jsonschema/1-0-2",
  {
    "save_id": "4321",
    "level": 23,
    "difficultyLevel": "HARD",
    "dl_content": True
  }
))
```

The `event_json` is represented using the SelfDescribingJson class. It has two fields: `schema` and `data`. `data` is a dictionary containing the properties of the unstructured event. `schema` identifies the JSON schema against which `data` should be validated. This schema should be available in your [Iglu schema registry](https://github.com/snowplow/iglu) and your Snowplow pipeline configured so that that that registry is included in your Iglu resolver.

For more on JSON schema, see the [blog post](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

Many Snowplow users use the above method to track _all_ their events i.e. only record event types that they have defined. However, there are a number of "out of the box" events that have dedicated tracking methods. These are detailed below:

### Track page view

Use `track_page_view()` to track a user viewing a page within your app or website. The arguments are:

| **Argument** | **Description** | **Required?** | ****Type**** |
| --- | --- | --- | --- |
| `page_url` | The URL of the page | Yes | Non-empty string |
| `page_title` | The title of the page | No | String |
| `referrer` | The address which linked to the page | No | String |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_page_view("www.example.com", "example", "www.referrer.com")
```

### Track page pings

Use `track_page_ping()` to track engagement with a web page over time, via a heartbeat event. (Each ping represents a single heartbeat.)

Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `page_url` | The URL of the page | Yes | Non-empty string |
| `page_title` | The title of the page | No | String |
| `referrer` | The address which linked to the page | No | String |
| `min_x` | Minimum page X offset seen in the last ping period | No | Positive integer |
| `max_x` | Maximum page X offset seen in the last ping period | No | Positive integer |
| `min_y` | Minimum page Y offset seen in the last ping period | No | Positive integer |
| `max_y` | Maximum page Y offset seen in the last ping period | No | Positive integer |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_page_ping("http://mytesturl/test2", "Page title 2", "http://myreferrer.com", 0, 100, 0, 500, None)
```

### Track mobile screen view

Use `track_mobile_screen_view()` to track a user viewing a screen (or equivalent) within your app.

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `id_` | Unique identifier for this screen (UUID) | No | string |
| `name` | Human-readable name for this screen | No | Non-empty string |
|`type`|The type of screen that was viewed e.g feed / carousel.| No | string |
| `previous_name` | The name of the previous screenview. | No | string |
| `previous_id` | The id of the previous screenview. | No | string |
| `previous_type` | The type of the previous screenview. | No | string |
| `transition_type` | The type of transition that led to the screen being viewed. | No | string |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the screen was viewed | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_mobile_screen_view(id_="1368725287001", name="Profile Page", type="feed", previous_name="Home Page", previous_id="1368725287000", previous_type="feed")
```

:::note
Since v0.13.0 we recommend using `track_mobile_screen_view()` instead of the deprecated `track_screen_view()` method.
:::

### Track ecommerce transactions

Use `track_ecommerce_transaction()` to track an ecommerce transaction. Arguments:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `order_id` | ID of the eCommerce transaction | Yes | Non-empty string |
| `total_value` | Total transaction value | Yes | Int or Float |
| `affiliation` | Transaction affiliation | No | String |
| `tax_value` | Transaction tax value | No | Int or Float |
| `shipping` | Delivery cost charged | No | Int or Float |
| `city` | Delivery address city | No | String |
| `state` | Delivery address state | No | String |
| `country` | Delivery address country | No | String |
| `currency` | Transaction currency | No | String |
| `items` | Items in the transaction | Yes | List |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the transaction event occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

The `items` argument is an array of Python dictionaries representing the items in the transaction. `track_ecommerce_transaction` fires multiple events: one "transaction" event for the transaction as a whole, and one "transaction item" event for each element of the `items` array. Each transaction item event will have the same timestamp, order_id, currency (and event_subject, since v0.9.0) as the main transaction event.

These are the fields that can appear in a transaction item dictionary:

| **Field** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `"sku"` | Item SKU | Yes | Non-empty string |
| `"price"` | Item price | Yes | Int or Float |
| `"quantity"` | Item quantity | Yes | Int |
| `"name"` | Item name | No | String |
| `"category"` | Item category | No | String |
| `"context"` | Custom context for the event | No | List |

Example of tracking a transaction containing two items:

```python
tracker.track_ecommerce_transaction("6a8078be", 35, city="London", currency="GBP", items=
    [{
        "sku": "pbz0026",
        "price": 20,
        "quantity": 1
    },
    {
        "sku": "pbz0038",
        "price": 15,
        "quantity": 1
    }])
```

### Track ecommerce transaction items

Use `track_ecommerce_transaction_item()` to track an individual line item.

Arguments:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `id` | Order ID | Yes | Non-empty string |
| `sku` | Item SKU | Yes | Non-empty string |
| `price` | Item price | Yes | Int or Float |
| `quantity` | Item quantity | Yes | Int |
| `name` | Item name | No | String |
| `category` | Item category | No | String |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the transaction event occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_ecommerce_transaction_item("order-789", "2001", 49.99, 1, "Green shoes", "clothing")
```

### Track structured events

Use `track_struct_event()` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `category` | The grouping of structured events which this `action` belongs to | Yes | Non-empty string |
| `action` | Defines the type of user interaction which this event involves | Yes | Non-empty string |
| `label` | A string to provide additional dimensions to the event data | No | String |
| `property` | A string describing the object or the action performed on it | No | String |
| `value` | A value to provide numerical data about the event | No | Int or Float |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the structured event occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_struct_event("shop", "add-to-basket", None, "pcs", 2)
```

### Track link clicks

Use `track_link_click()` to track individual link click events. Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `target_url` | The URL of the page | Yes | Non-empty string |
| `element_id` | ID attribute of the HTML element | No | String |
| `element_classes` | Classes of the HTML element | No | List(string) |
| `element_target` | Target element | No | String |
| `element_content` | The content of the HTML element | No | String |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Basic example:

```python
tracker.track_link_click("http://my-target-url2/path")
```

Advanced example:

```python
tracker.track_link_click("http://my-target-url2/path", "element id 2", None, "element target", "element content")
```

### Track add-to-cart events

Use `track_add_to_cart()` to track adding items to a cart on an ecommerce site. Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `sku` | Item SKU or ID | Yes | Non-empty string |
| `quantity` | Number of items added to cart | Yes | Integer |
| `name` | Item's name | No | String |
| `category` | Item's category | No | String |
| `unit_price` | Item's price | No | Int or Float |
| `currency` | Currency | No | String |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Example:

```python
tracker.track_add_to_cart("123", 2, "The Devil's Dance", "Books", 23.99, "USD", None )
```

### Track remove-from-cart events

Use `track_remove_from_cart()` to track removing items from a cart on an ecommerce site. Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `sku` | Item SKU or ID | Yes | Non-empty string |
| `quantity` | Number of items added to cart | Yes | Integer |
| `name` | Item's name | No | String |
| `category` | Item's category | No | String |
| `unit_price` | Item's price | No | Int or Float |
| `currency` | Currency | No | String |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Basic example:

```python
tracker.track_remove_from_cart("123", 1)
```

Advanced example:

```python
tracker.track_remove_from_cart("123", 2, "The Devil's Dance", "Books", 23.99, "USD")
```

### Track form change

Use `track_from_change()` to track changes in website form inputs over session. Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `form_id` | ID attribute of the HTML form | Yes | Non-empty string |
| `element_id` | ID attribute of the HTML element | Yes | String |
| `node_name` | Type of input element | Yes | [Valid node_name](https://github.com/snowplow/iglu-central/blob/53589a5dd41f2f88cabb359488019e0ebb72ec49/schemas/com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0#L20) |
| `value` | Value of input element | Yes | String |
| `type_` | Type of data the element represents | No | Non-empty string |
| `element_classes` | Classes of the HTML element | No | List(string) |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Basic example:

```python
tracker.track_form_change("signupForm", "ageInput", "age", "24")
```

Advanced example:

```python
tracker.track_form_change("signupForm", "ageInput", "age", "24", "number", ["signup__number", "form__red"])
```

### Track submitted forms

Use `track_form_submit()` to track sumbitted forms. Arguments are:

| **Argument** | **Description** | **Required?** | ******Type****** |
| --- | --- | --- | --- |
| `form_id` | ID attribute of the HTML form | Yes | Non-empty string |
| `form_classes` | Classes of the HTML form | No | List(str) |
| `elements` | Value of input element | No | List(dict) |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Basic example:

```python
tracker.track_form_submit("registrationForm")
```

Advanced example:

```python
tracker.track_form_submit("signupForm", ["signup__warning"], {"name": "email", "value": "tracker@example.com", "nodeName": "INPUT", "type": "email"})
```

### Track site searches

Use `track_site_search()` to track a what user searches on your website. Arguments are:

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `terms` | Search terms | Yes | List(str) |
| `filters` | Filters applied to search | No | List(Dict[str,str]) |
| `total_results` | Total number of results | No | Integer |
| `page_results` | Number of pages of results | No | Integer |
| `context` | Custom context for the event | No | List(SelfDescribingJson) |
| `tstamp` | When the pageview occurred | No | Positive integer |
| `event_subject` (since v0.9.0) | The subject for the event | No | Subject |

Basic example:

```python
tracker.track_site_search(["analytics", "snowplow", "tracker"])
```

Advanced example:

```python
tracker.track_site_search(["pulp fiction", "reviews"], {"nswf": true}, 215, 22)
```

### `truck_unstruct_event`

This functionally is equivalent to `track_self_describing_event`. We believe that the method name is misleading: this method is used to track events that are structured in nature (they have an associated schema), which is why we believe referring to them as `self-describing` events makes more sense than referring to them as `unstructured events`.

The method is provided for reasons of backwards compatibility.
