---
title: "Tracking events with the Unity tracker"
sidebar_label: "Event tracking"
date: "2020-02-26"
sidebar_position: 80
---

You track events by building an event payload using event-specific Builder objects, and passing the result to a tracker instance's `Track()` method.
Your events can have common fields configured with the respective `SetCustomContexts()`, `SetTimestamp()`, and `SetEventId()` methods, in addition to event-specific fields covered below.

## Track page views with `Track(PageView)`

You can use `Track(PageView)` to track a user viewing a web page within your app.

Arguments are:

| **Argument**     | **Description**                      | **Required?** | **Type**         |
| ---------------- | ------------------------------------ | ------------- | ---------------- |
| `pageUrl`        | The URL of the page                  | Yes           | `string`         |
| `pageTitle`      | The title of the page                | No            | `string`         |
| `referrer`       | The address which linked to the page | No            | `string`         |
| `customContexts` | Optional custom context              | No            | `List<IContext>` |
| `timestamp`      | Optional timestamp                   | No            | `long`           |
| `eventId`        | Optional custom event id             | No            | `string`         |

Examples:

```csharp
t1.Track(new PageView()
    .SetPageUrl("www.example.com")
    .SetPageTitle("example")
    .SetReferrer("www.referrer.com")
    .Build());

t1.Track(new PageView()
    .SetPageUrl("www.example.com")
    .SetPageTitle("example")
    .SetReferrer("www.referrer.com")
    .SetCustomContext(contextList)
    .SetTimestamp(1423583655000)
    .SetEventId("uid-1")
    .Build());
```

## Track screen views with `Track(MobileScreenView)`

Use `Track(MobileScreenView)` to track a user viewing a screen (or equivalent) within your app. You **must** provide a `name` property. The `id` of the screen view will be automatically assigned (as an UUID) but you may also provide it manually. Arguments are:

| **Argument**     | **Description**                                                | **Required?** | **Type**         |
| ---------------- | -------------------------------------------------------------- | ------------- | ---------------- |
| `name`           | Human-readable name for this screen                            | Yes           | `string`         |
| `id`             | Unique identifier for this screen view (can be auto-generated) | Yes           | `string`         |
| `type`           | The type of screen that was viewed e.g feed / carousel         | No            | `string`         |
| `previousName`   | The name of the previous screen                                | No            | `string`         |
| `previousId`     | The screen view ID of the previous screen view                 | No            | `string`         |
| `previousType`   | The screen type of the previous screen view                    | No            | `string`         |
| `previousType`   | The screen type of the previous screen view                    | No            | `string`         |
| `customContexts` | Optional custom context                                        | No            | `List<IContext>` |
| `timestamp`      | Optional timestamp                                             | No            | `long`           |
| `eventId`        | Optional custom event id                                       | No            | `string`         |

Examples:

```csharp
t1.Track(new MobileScreenView("HUD > Save Game")
    .SetType("dialog")
    .SetPreviousName("HUD > Menu")
    .SetPreviousId(previousScreenId)
    .SetTransitionType("pop-up")
    .Build());

t1.Track(new MobileScreenView("HUD > Save Game")
    .SetCustomContext(contextList)
    .SetTimestamp(1423583655000)
    .SetEventId("uid-1")
    .Build());
```

:::note
In tracker versions 0.7.0 and earlier, screen views were tracked using the `ScreenView` class.
However, this class used the older schema for screen views and has been deprecated in favour of the `MobileScreenView` in the 0.8.0 release of the tracker.
:::

## Track structured events with `Track(Structured)`

Use `Track(Structured)` to track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required):

| **Argument**     | **Description**                                                  | **Required?** | **Type**         |
| ---------------- | ---------------------------------------------------------------- | ------------- | ---------------- |
| `category`       | The grouping of structured events which this `action` belongs to | Yes           | `string`         |
| `action`         | Defines the type of user interaction which this event involves   | Yes           | `string`         |
| `label`          | A string to provide additional dimensions to the event data      | No            | `string`         |
| `property`       | A string describing the object or the action performed on it     | No            | `string`         |
| `value`          | A value to provide numerical data about the event                | No            | `double`         |
| `customContexts` | Optional custom context                                          | No            | `List<IContext>` |
| `timestamp`      | Optional timestamp                                               | No            | `long`           |
| `eventId`        | Optional custom event id                                         | No            | `string`         |

Examples:

```csharp
t1.Track(new Structured()
    .SetCategory("shop")
    .SetAction("add-to-basket")
    .Build());

t1.Track(new Structured()
    .SetCategory("shop")
    .SetAction("add-to-basket")
    .SetLabel("Add To Basket")
    .SetProperty("pcs")
    .SetValue(2.00)
    .SetCustomContext(contextList)
    .SetTimestamp(1423583655000)
    .SetEventId("uid-1")
    .Build());
```

## Track timing events with `Track(Timing)`

Use `Track(Timing)` to track an event related to a custom timing.

| **Argument**     | **Description**                        | **Required?** | **Type**         |
| ---------------- | -------------------------------------- | ------------- | ---------------- |
| `category`       | The category of the timed event        | Yes           | `string`         |
| `label`          | The label of the timed event           | No            | `string`         |
| `timing`         | The timing measurement in milliseconds | Yes           | `int`            |
| `variable`       | The name of the timed event            | Yes           | `string`         |
| `customContexts` | Optional custom context                | No            | `List<IContext>` |
| `timestamp`      | Optional timestamp                     | No            | `long`           |
| `eventId`        | Optional custom event id               | No            | `string`         |

Examples:

```csharp
t1.Track(new Timing()
    .SetCategory("category")
    .SetVariable("variable")
    .SetTiming(1)
    .Build());

t1.Track(new Timing()
    .SetCategory("category")
    .SetVariable("variable")
    .SetTiming(1)
    .SetLabel("label")
    .SetCustomContext(contextList)
    .SetTimestamp(1423583655000)
    .SetEventId("uid-1")
    .Build());
```

## Track self-describing events with `Track(SelfDescribing)`

Custom self-describing events are a flexible tool that enable Snowplow users to define their own event types and send them into Snowplow.

When a user sends in a custom self-describing event, they do so as a JSON of name-value properties, that conforms to a JSON schema defined for the event earlier.

Use `Track(SelfDescribing)` to track a custom event which consists of a name and a self-describing set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

The arguments are as follows:

| **Argument**     | **Description**             | **Required?** | **Type**                                    |
| ---------------- | --------------------------- | ------------- | ------------------------------------------- |
| `eventData`      | The properties of the event | Yes           | [`SelfDescribingJson`](#selfdescribingjson) |
| `customContexts` | Optional custom context     | No            | `List<IContext>`                            |
| `timestamp`      | Optional timestamp          | No            | `long`                                      |
| `eventId`        | Optional custom event id    | No            | `string`                                    |

Example event json to track:

```json
{
  "schema": "iglu:com.acme/save_game/jsonschema/1-0-0",
  "data": {
    "levelName": "Barrels o' Fun",
    "levelIndex": 23
  }
}
```

How to set it up?

```json
// Create a Dictionary of your event data
Dictionary<string, object> eventDict = new Dictionary<string, object>();
eventDict.Add("levelName", "Barrels o' Fun");
eventDict.Add("levelIndex", 23);

// Track your event with your custom event data
t1.Track(new SelfDescribing("iglu:com.acme/save_game/jsonschema/1-0-0", eventDict)
    .Build();

// OR

t1.Track(new SelfDescribing("iglu:com.acme/save_game/jsonschema/1-0-0", eventDict)
    .SetCustomContext(contextList)
    .SetTimestamp(1423583655000)
    .SetEventId("uid-1")
    .Build();
```

For more on JSON schema, see the [blog post](https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

:::note
In versions 0.7.0 and earlier, the `Unstructured` class was used to track self-describing events. This was deprecated in version 0.8.0 in favour of the `SelfDescribing` class.
:::

## Track ecommerce transactions with `Track(EcommerceTransaction)`

Use `Track(EcommerceTransaction)` to track an ecommerce transaction.

Arguments:

| **Argument**     | **Description**                 | **Required?** | **Type**                         |
| ---------------- | ------------------------------- | ------------- | -------------------------------- |
| `orderId`        | ID of the eCommerce transaction | Yes           | `string`                         |
| `totalValue`     | Total transaction value         | Yes           | `double`                         |
| `affiliation`    | Transaction affiliation         | No            | `string`                         |
| `taxValue`       | Transaction tax value           | No            | `double`                         |
| `shipping`       | Delivery cost charged           | No            | `double`                         |
| `city`           | Delivery address city           | No            | `string`                         |
| `state`          | Delivery address state          | No            | `string`                         |
| `country`        | Delivery address country        | No            | `string`                         |
| `currency`       | Transaction currency            | No            | `string`                         |
| `items`          | Items in the transaction        | Yes           | `List<EcommerceTransactionItem>` |
| `customContexts` | Optional custom context         | No            | `List<IContext>`                 |
| `timestamp`      | Optional timestamp              | No            | `long`                           |
| `eventId`        | Optional custom event id        | No            | `string`                         |

The `items` argument is a `List` of individual `EcommerceTransactionItem` elements representing the items in the e-commerce transaction. Note that `Track(EcommerceTransaction)` fires multiple events: one transaction event for the transaction as a whole, and one transaction item event for each element of the `items` `List`.

Each transaction item event will have the same timestamp, orderId, and currency as the main transaction event.

#### `EcommerceTransactionItem`

To instantiate a `EcommerceTransactionItem` in your code, simply use the following constructor signature:

```json
EcommerceTransactionItem item = new EcommerceTransactionItem ()
      .SetSku ("sku")
      .SetPrice (10.2)
      .SetQuantity (1)
      .SetName ("name")
      .SetCategory ("category")
      .Build ()
```

These are the fields that can appear as elements in each `EcommerceTransactionItem` element of the transaction item's `List`:

| **Field**        | **Description**          | **Required?** | **Type**         |
| ---------------- | ------------------------ | ------------- | ---------------- |
| `sku`            | Item SKU                 | Yes           | `string`         |
| `price`          | Item price               | Yes           | `double`         |
| `quantity`       | Item quantity            | Yes           | `int`            |
| `name`           | Item name                | No            | `string`         |
| `category`       | Item category            | No            | `string`         |
| `customContexts` | Optional custom context  | No            | `List<IContext>` |
| `eventId`        | Optional custom event id | No            | `string`         |

Example of tracking a transaction containing two items:

```json
// Create some Transaction Items
EcommerceTransactionItem item1 = new EcommerceTransactionItem ()
    .SetSku ("item_sku_1")
    .SetPrice (10.2)
    .SetQuantity (1)
    .SetName ("item_name_1")
    .SetCategory ("item_category")
    .Build ();

EcommerceTransactionItem item2 = new EcommerceTransactionItem()
    .SetSku("item_sku_2")
    .SetPrice(1.00)
    .SetQuantity(1)
    .SetName("item_name_2")
    .SetCategory("item_category")
    .Build();

// Add these items to a List
List<EcommerceTransactionItem> items = new List<EcommerceTransactionItem>();
items.Add(item1);
items.Add(item2);

// Now Track the Transaction by using this list of items as an argument
tracker.Track(new EcommerceTransaction()
    .SetOrderId("order_id_1")
    .SetTotalValue(300.00)
    .SetAffiliation("my_affiliate")
    .SetTaxValue(30.00)
    .SetShipping(10.00)
    .SetCity("Boston")
    .SetState("Massachusetts")
    .SetCountry("USA")
    .SetCurrency("USD")
    .SetItems(items)
    .Build());
```

## Custom Contexts

Custom contexts are Self Describing Jsons with extra descriptive information that can be optionally attached to any Snowplow event with `SetCustomContexts(...)`. We provide several builders for Snowplow custom contexts as well as a generic builder if you wish to define and send your own custom context!

For ease of development you are also able to extend the `IContext` interface or the `AbstractContext` class for your own contexts if you so wish.

All of these contexts will need to be combined into a `List<IContext>` before being attachable to Snowplow Events.

### `DesktopContext`

The following arguments can be used in a DesktopContext:

| **Field**            | **Description**                     | **Required?** | **Type** |
| -------------------- | ----------------------------------- | ------------- | -------- |
| `osType`             | The Operating System Type           | Yes           | `string` |
| `osVersion`          | The Version of the Operating System | Yes           | `string` |
| `osServicePack`      | Service Pack information            | No            | `string` |
| `osIs64Bit`          | If the OS is 32 or 64 bit           | No            | `bool`   |
| `deviceManufacturer` | Who made the device                 | No            | `string` |
| `deviceModel`        | What is the device model            | No            | `string` |
| `processorCount`     | How many cores does the device have | No            | `int`    |

An example of a DesktopContext construction:

```json
DesktopContext context = new DesktopContext ()
    .SetOsType("OS-X")
    .SetOsVersion("10.10.5")
    .SetOsServicePack("Yosemite")
    .SetOsIs64Bit(true)
    .SetDeviceManufacturer("Apple")
    .SetDeviceModel("Macbook Pro")
    .SetDeviceProcessorCount(4)
    .Build ();
```

### `MobileContext`

The following arguments can be used in a MobileContext:

| **Field**            | **Description**                     | **Required?** | **Type**      |
| -------------------- | ----------------------------------- | ------------- | ------------- |
| `osType`             | The Operating System Type           | Yes           | `string`      |
| `osVersion`          | The Version of the Operating System | Yes           | `string`      |
| `deviceManufacturer` | Who made the device                 | Yes           | `string`      |
| `deviceModel`        | What is the device model            | Yes           | `string`      |
| `carrier`            | The name of the carrier             | No            | `string`      |
| `networkType`        | The type of network                 | No            | `NetworkType` |
| `networkTechnology`  | The networks technlogy              | No            | `string`      |
| `openIdfa`           | An OpenIDFA UUID                    | No            | `string`      |
| `appleIdfa`          | An Apple IDFA UUID                  | No            | `string`      |
| `appleIdfv`          | An Apple IDFV UUID                  | No            | `string`      |
| `androidIdfa`        | An Android IDFA UUID                | No            | `string`      |

An example of a MobileContext construction:

```json
MobileContext context = new MobileContext ()
    .SetOsType("iOS")
    .SetOsVersion("9.0")
    .SetDeviceManufacturer("Apple")
    .SetDeviceModel("iPhone 6S+")
    .SetCarrier("FREE")
    .SetNetworkType(NetworkType.Mobile)
    .SetNetworkTechnology("LTE")
    .Build ();
```

### `GeoLocationContext`

The following arguments can be used in a GeoLocationContext:

| **Field**                   | **Description**            | **Required?** | **Type** |
| --------------------------- | -------------------------- | ------------- | -------- |
| `latitude`                  | The user latitude          | Yes           | `double` |
| `longitude`                 | The user longitude         | Yes           | `double` |
| `latitudeLongitudeAccuracy` | The user lat-long accuracy | No            | `double` |
| `altitude`                  | The user altitude          | No            | `double` |
| `altitudeAccuracy`          | The user alt accuracy      | No            | `double` |
| `bearing`                   | The user bearing           | No            | `double` |
| `speed`                     | The user speed             | No            | `double` |
| `timestamp`                 | A timestamp in ms          | No            | `long`   |

An example of a GeoLocationContext construction:

```json
GeoLocationContext context = new GeoLocationContext ()
    .SetLatitude(123.564)
    .SetLongitude(-12.6)
    .SetLatitudeLongitudeAccuracy(5.6)
    .SetAltitude(5.5)
    .SetAltitudeAccuracy(2.1)
    .SetBearing(3.2)
    .SetSpeed(100.2)
    .SetTimestamp(1234567890000)
    .Build ();
```

### `GenericContext`

The GenericContext is a simple builder with three functions:

- `SetSchema(string)` : Sets the Context Schema Path
- `Add(string, object)` : Adds a single key-pair value to the data packet of this context
- `AddDict(string, object)` : Adds a dictionary of key-pair values to the data packet

You must set a schema string or a RuntimeException will be thrown.

An example of a GenericContext construction:

```json
GenericContext context = new GenericContext()
    .SetSchema("iglu:com.acme/acme_context/jsonschema/1-0-0")
    .Add("context", "custom")
    .Build();
```

## SelfDescribingJson

A `SelfDescribingJson` is used as a wrapper around a `Dictionary<string, object>`. After creating the Dictionary you want to wrap you can create a `SelfDescribingJson` using the following:

```json
// Data as a Dictionary
Dictionary<string, object> data = new Dictionary<string, object>();
data.Add("Event", "Data")

// We then create a new SelfDescribingJson
SelfDescribingJson json = new SelfDescribingJson("iglu:com.acme/example/jsonschema/1-0-0", data);
```

This object is now ready to be Tracked within a SelfDescribing Event.

You can create a SelfDescribingJson with the following arguments:

| **Argument** | **Description**                           | **Required?** | **Type**                     |
| ------------ | ----------------------------------------- | ------------- | ---------------------------- |
| `schema`     | JsonSchema that describes the data        | Yes           | `string`                     |
| `data`       | Data that will be validated by the schema | No            | `Dictionary<string,object`\> |
