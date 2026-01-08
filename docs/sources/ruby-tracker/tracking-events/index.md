---
title: "Track events with the Ruby tracker"
sidebar_label: "Tracking events"
date: "2021-10-15"
sidebar_position: 10
description: "Track self-describing events, structured events, page views, screen views, and ecommerce transactions with the Ruby tracker SDK."
keywords: ["ruby event tracking", "self-describing events", "ecommerce tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your websites and apps.

We provide several built-in methods to help you track different kinds of events. The `track_x_event` methods range from single purpose methods, such as `track_page_view`, to the more complex but flexible `track_self_describing_event`, which can be used to track any kind of user behavior. We strongly recommend using `track_self_describing_event` for your tracking, as it allows you to design custom event types to match your business requirements. This [post on our blog](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/), "Re-thinking the structure of event data" might be informative here.

Tracking methods supported by the Ruby Tracker:

| **Method**                                              | **Event type tracked**                               |
| ------------------------------------------------------- | ---------------------------------------------------- |
| [`track_self_describing_event`](#self-describing-event) | Custom event based on "self-describing" JSON schema  |
| [`track_struct_event`](#struct-event)                   | Semi-custom structured event                         |
| [`track_page_view`](#page-view)                         | View of web page                                     |
| [`track_screen_view`](#screen-view)                     | View of screen                                       |
| [`track_ecommerce_transaction`](#ecommerce-transaction) | eCommerce transaction (and items in the transaction) |

All the `track_x_event` methods share common features and parameters. Every type of event can have an optional context, Subject, and Page added. A Timestamp can also be provided for all event types to override the default event timestamp. See [the next page](/docs/sources/ruby-tracker/adding-data-events/index.md) to learn about adding extra data to events. It's important to understand how event context works, as it is one of the most powerful Snowplow features. Adding event context is a way to add depth, richness and value to all of your events.

Snowplow events are all processed into the same format, regardless of the event type (and regardless of the tracker language used). Read about the different properties and fields of events in the [Snowplow Tracker Protocol](/docs/events/index.md).

We will first discuss the custom event tracking methods, followed by the out-of-the-box event types. Note that you can also design and create your own page view, screen view, or eCommerce events, using `track_self_describing_event`, to fit your business needs better. The out-of-the-box event types are provided so you can get started with generating event data quickly.

### Track self-describing events with `track_self_describing_event`

Use `track_self_describing_event` to track a custom event. This is the most advanced and powerful tracking method, which requires a certain amount of planning and infrastructure.

Self-describing events are based around "self-describing" (self-referential) JSONs, which are a specific kind of [JSON schema](http://json-schema.org/). A unique schema can be designed for each type of event that you want to track. This allows you to track the specific things that are important to you, in a way that is defined by you.

This is particularly useful when:

- You want to track event types which are proprietary/specific to your business
- You want to track events which have unpredictable or frequently changing properties

A self-describing JSON has two keys, `schema` and `data`. The `schema` value should point to a valid self-describing JSON schema. They are called self-describing because the schema will specify the fields allowed in the `data` value. Read more about how schemas are used with Snowplow [here](/docs/fundamentals/schemas/index.md).

After events have been collected by the event collector, they are validated to ensure that the properties match the self-describing JSONs. Mistakes (e.g. extra fields, or incorrect types) will result in events being processed as Bad Events. This means that only high-quality, valid events arrive in your data storage or real-time stream.

```mdx-code-block
import SchemaAccess from "@site/docs/reusable/schema-access/_index.md"

<SchemaAccess/>
```

This method was previously called `track_unstruct_event`, as a counterpoint to `track_struct_event`. This name is misleading and we are in the process of depreciating it. An `unstruct` event requires a schema ruleset and therefore can be considered more structured than a `struct` event. However, this method still produces events labelled `unstruct`, as changing the event name in the Tracker Protocol would be a breaking change.

The `track_self_describing_event` method has one required argument, which must be a SelfDescribingJson object (see [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/SelfDescribingJson.html)). This class takes a schema name and a flat hash of event data. The keys of the hash can be either strings or Ruby symbols.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
self_desc_json = SnowplowTracker::SelfDescribingJson.new(
  "iglu:com.example_company/save_game/jsonschema/1-0-2",
  {
    "saveId" => "4321",
    "level" => 23,
    "difficultyLevel" => "HARD",
    "dlContent" => true
  }
)

tracker.track_self_describing_event(event_json: self_desc_json)
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
self_desc_json = SnowplowTracker::SelfDescribingJson.new(
  "iglu:com.example_company/save_game/jsonschema/1-0-2",
  {
    "saveId" => "4321",
    "level" => 23,
    "difficultyLevel" => "HARD",
    "dlContent" => true
  }
)

tracker.track_self_describing_event(self_desc_json)
```

  </TabItem>
</Tabs>

You can track anything you want using this method, as long as you can describe it in a self-describing JSON schema.

### Track structured events with `track_struct_event`

This method provides a halfway-house between tracking fully user-defined self-describing events and out-of-the box predefined events. This event type can be used to track many types of user activity, as it is somewhat customizable. "Struct" events closely mirror the structure of Google Analytics events, with "category", "action", "label", and "value" properties.

As these fields are fairly arbitrary, we recommend following the advice in this table how to define structured events. It's important to be consistent throughout the business about how each field is used.

| **Argument** | **Description**                                                  | **Required in event?** |
| ------------ | ---------------------------------------------------------------- | ---------------------- |
| `category`   | The grouping of structured events which this `action` belongs to | Yes                    |
| `action`     | Defines the type of user interaction which this event involves   | Yes                    |
| `label`      | Often used to refer to the 'object' the action is performed on   | No                     |
| `property`   | Describing the 'object', or the action performed on it           | No                     |
| `value`      | Provides numerical data about the event                          | No                     |

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
tracker.track_struct_event(category: 'shop',
                           action: 'add-to-basket',
                           property: 'pcs',
                           value: 2)
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
tracker.track_struct_event('shop', 'add-to-basket', nil, 'pcs', 2)
```

  </TabItem>
</Tabs>

### Track page views with `track_page_view`

This is a simple, single-use method for tracking a user viewing a page within your app. You can record the page URL, the page title, and the referrer URL. Only the page URL is strictly required.

As a server-side language, your Ruby code won't automatically have access to the page title. This is one small reason why page views are easier to track client-side. Conversely, server-side page view tracking is more accurate, as it is not blocked by adblockers. It can be useful to compare counts from client- and server-side page views to see how much effect adblockers are having.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
tracker.track_page_view(page_url: 'www.example.com',
                        page_title: 'example',
                        referrer: 'www.referrer.com')
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
tracker.track_page_view('www.example.com', 'example', 'www.referrer.com')
```

  </TabItem>
</Tabs>

### Track screen views with `track_screen_view`

Use `track_screen_view` to track a user viewing a screen (or similar) within your app. This is the page view equivalent for apps that are not webpages. The arguments are `name` and `id`; while both are optional, you must provided at least one of them to create a valid event. "Name" is the human-readable screen name, and "ID" should be the unique screen ID.

This method creates an `unstruct` event, by creating a SelfDescribingJson and calling `track_self_describing_event`. The schema ID for this is "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", and the data field will contain the name and/or ID which you provide. That schema is hosted on the schema repository [Iglu Central](http://iglucentral.com/), and so will always be available to your pipeline.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
tracker.track_screen_view(name: 'HUD > Save Game',
                          id: 'screen23')
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

```ruby
tracker.track_screen_view('HUD > Save Game', 'screen23')
```

  </TabItem>
</Tabs>

### Track eCommerce transactions with `track-ecommerce-transaction`

Use this out-of-the-box method to track an ecommerce transaction. This method is unique compared to the other `track_x_event` methods, as it sends multiple multiple events: one `transaction` event, and one `transaction_item` event for each item in the transaction. This is a legacy design; if we were creating a new eCommerce tracking method now, we would attach information about each item as event context entities to a single transaction event.

The arguments for this method are a "transaction" hash, and an array of "item" hashes. These hashes are strict about which keys are allowed and required. Check out the [API docs](https://snowplow.github.io/snowplow-ruby-tracker/SnowplowTracker/Tracker.html#track_ecommerce_transaction-instance_method) for the full details of the allowed properties. You can also read there about how additional event properties (context, Subject, Page and Timestamp) are handled for eCommerce events.

Broadly, the "transaction" hash contains the information about the order as a whole: the order ID, the value of the transaction including tax and/or shipping, as well as geographic information about its origin, or the currency in which the order was placed.

The "item" hash records each item's unique SKU identifier, value, and how many were purchased, as well as any further information which might be useful, such as its human-readable item name.

Example:

<Tabs groupId="version" queryString>
  <TabItem value="current" label="v0.7.0+" default>

```ruby
transaction = {
  order_id: '12345',
  total_value: 35,
  city: 'London',
  country: 'UK',
  currency: 'GBP'
}
item1 = {
  sku: 'pbz0026',
  price: 20,
  quantity: 1,
  category: 'film'
}
item2 = {
  sku: 'pbz0038',
  price: 15,
  quantity: 1,
  name: 'red shoes'
}
tracker.track_ecommerce_transaction(transaction: transaction,
                                    items: [item1, item2])
```

  </TabItem>

  <TabItem value="old" label="Before v0.7.0">

:::note
Older versions of the Ruby tracker have a bug in `track_ecommerce_transaction`: hashes with symbols for keys are not accepted. The event will fail silently. You must use only string keys. This was fixed in version 0.7.0.
:::

```ruby
transaction = {
  'order_id' => '12345',
  'total_value' => 35,
  'city' => 'London',
  'country' => 'UK',
  'currency' => 'GBP'
}
item1 = {
  'sku' => 'pbz0026',
  'price' => 20,
  'quantity' => 1,
  'category' => 'film'
}
item2 = {
  'sku' => 'pbz0038',
  'price' => 15,
  'quantity' => 1,
  'name' => 'red shoes'
}
tracker.track_ecommerce_transaction(transaction, [item1, item2])
```

  </TabItem>
</Tabs>

This will fire three events: one for the transaction as a whole, and one for each item. The `order_id` and `currency` fields in the `transaction` argument will also be attached to each of the item events.
