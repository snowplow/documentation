---
title: "Tracking an event"
description: "Track behavioral events using PHP tracker for server-side analytics in PHP applications."
schema: "TechArticle"
keywords: ["PHP Events", "Event Tracking", "PHP Analytics", "Server Events", "Backend Events", "PHP Tracking"]
date: "2020-02-26"
sidebar_position: 50
---

Tracking methods supported by the PHP Tracker:

| **Function** | **Description** |
| --- | --- |
| [`trackPageView`](#trackpageview) | Track and record views of web pages. |
| [`trackEcommerceTransaction`](#trackecommercetransaction) | Track an ecommerce transaction |
| [`trackScreenView`](#trackscreenview) | Track the user viewing a screen within the application |
| [`trackStructEvent`](#trackstructevent) | Track a Snowplow custom structured event |
| [`trackUnstructEvent`](#trackunstructevent) | Track a Snowplow custom unstructured event |

### Optional Tracking Arguments

#### Custom Context

Custom contexts let you add additional information about any circumstances surrounding an event in the form of a PHP Array of name-value pairs. Each tracking method accepts an additional optional contexts parameter after all the parameters specific to that method:

```php
public function trackPageView($page_url, $page_title = NULL, $referrer = NULL, $context = NULL, $tstamp = NULL)
```

An example of a Context Array Structure:

```php
array(
    "schema" => "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
    "data" => array(
        "movie_name" => "Solaris",
        "poster_country" => "JP"
    )
)
```

This is how to fire a page view event with the above custom context:

```php
$tracker->trackPageView(
    "http://www.films.com",
    "Homepage",
    NULL,
    array(
        array(
            "schema" => "iglu:com.acme_company/movie_poster/jsonschema/2-1-1",
            "data" => array(
                "movie_name" => "Solaris",
                "poster_country" => "JP"
            )
        )
    )
);
```

#### Timestamp

Each tracking method supports an optional timestamp as its final argument; this allows you to also set the true timestamp (`true_tstamp`) of the event besides the device created timestamp (`dvce_created_tstamp`) that always gets set by the tracker. The optional timestamp argument should be provided in **milliseconds** since the Unix epoch.

Here is an example tracking a structured event and supplying the optional timestamp argument. We can explicitly supply a `NULL` for the intervening arguments which are empty:

```php
$tracker->trackStructEvent("some cat", "save action", NULL, NULL, NULL, 1368725287000);
```

### Event Tracking Methods

#### `trackPageView`

Track a user viewing a page within your app.

Function:

```php
public function trackPageView($page_url, $page_title = NULL, $referrer = NULL, $context = NULL, $tstamp = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$page_url` | The URL of the page | Yes | Non-empty string |
| `$page_title` | The title of the page | No | String |
| `$referrer` | The address which linked to the page | No | String |
| `$context` | Custom context for the event | No | Array |
| `$tstamp` | When the pageview occurred | No | Positive integer |

Example Usage:

```php
$tracker->trackPageView("www.example.com", NULL, NULL, NULL, 123123132132);
```

#### `trackEcommerceTransaction`

Track an ecommerce transaction.

Function:

```php
public function trackEcommerceTransaction($order_id, $total_value, $currency = NULL, $affiliation = NULL, $tax_value = NULL, $shipping = NULL, $city = NULL, $state = NULL, $country = NULL, $items = array(), $context = NULL, $tstamp = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$order_id` | ID of the eCommerce transaction | Yes | Non-empty string |
| `$total_value` | Total transaction value | Yes | Int or Float |
| `$currency` | Transaction currency | No | String |
| `$affiliation` | Transaction affiliation | No | String |
| `$tax_value` | Transaction tax value | No | Int or Float |
| `$shipping` | Delivery cost charged | No | Int or Float |
| `$city` | Delivery address city | No | String |
| `$state` | Delivery address state | No | String |
| `$country` | Delivery address country | No | String |
| `$items` | Items in the transaction | No | Array |
| `$context` | Custom context for the event | No | Array |
| `$tstamp` | When the transaction event occurred | No | Positive integer |

Example Usage:

```php

$tracker->trackEcommerceTransaction(
    "test_order_id_1", 
    200, 
    "GBP", 
    "affiliation_1", 
    "tax_value_1",
    "shipping_1", 
    "city_1", 
    "state_1", 
    "country_1",
    array(
        array("name" => "name_1","category" => "category_1",
            "price" => 100,"sku" => "sku_1","quantity" => 1),
        array("name" => "name_2","category" => "category_2",
            "price" => 100,"sku" => "sku_2","quantity" => 1)
    )
);
```

The above example contains an order with two order items.

##### `trackEcommerceTransactionItem`

This is a private function that is called from within `trackEcommerceTransaction`. Note that for an item to be added successfully you need to include the following fields in the array, even if the value is `NULL`.

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `"sku"` | Item SKU | Yes | Non-empty string |
| `"price"` | Item price | Yes | Int or Float |
| `"quantity"` | Item quantity | Yes | Int |
| `"name"` | Item name | No | String |
| `"category"` | Item category | No | String |

Example Item:

```php
array(
    array("name" => NULL,
          "category" => NULL,
          "price" => 100,
          "sku" => "sku_1",
          "quantity" => 1)
)
```

If any of these fields are missing the item event will not be created. However the order of these fields is not important.

#### `trackScreenView`

Track a user viewing a screen (or equivalent) within your app.

Function:

```php
public function trackScreenView($name = NULL, $id = NULL, $context = NULL, $tstamp = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$name` | Human-readable name for this screen | No | Non-empty string |
| `$id` | Unique identifier for this screen | No | String |
| `$context` | Custom context for the event | No | Array |
| `$tstamp` | When the screen was viewed | No | Positive integer |

Although `$name` and `$id` are not individually required, at least one must be provided or the event will fail validation.

Example:

```php
$tracker->trackScreenView("HUD > Save Game", NULL, NULL, 1368725287000);
```

#### `trackStructEvent`

Track a custom event happening in your app which fits the Google Analytics-style structure of having up to five fields (with only the first two required).

Function:

```php
public function trackStructEvent($category, $action, $label = NULL, $property = NULL, $value = NULL, $context = NULL, $tstamp = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$category` | The grouping of structured events which this `action` belongs to | Yes | Non-empty string |
| `$action` | Defines the type of user interaction which this event involves | Yes | Non-empty string |
| `$label` | A string to provide additional dimensions to the event data | No | String |
| `$property` | A string describing the object or the action performed on it | No | String |
| `$value` | A value to provide numerical data about the event | No | Int or Float |
| `$context` | Custom context for the event | No | Array |
| `$tstamp` | When the structured event occurred | No | Positive integer |

Example:

```php
$tracker->trackStructEvent("shop", "add-to-basket", NULL, "pcs", 2);
```

#### `trackUnstructEvent`

Track a custom event which consists of a name and an unstructured set of properties. This is useful when:

- You want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow), or
- You want to track events which have unpredictable or frequently changing properties

Function:

```php
public function trackUnstructEvent($event_json, $context = NULL, $tstamp = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$event_json` | The properties of the event | Yes | Array |
| `$context` | Custom context for the event | No | Array |
| `$tstamp` | When the unstructured event occurred | No | Positive integer |

Example:

```php
$tracker->trackUnstructEvent(
    array(
        "schema" => "com.example_company/save-game/jsonschema/1-0-2",
        "data" => array(
            "save_id" => "4321",
            "level" => 23,
            "difficultyLevel" => "HARD",
            "dl_content" => true
        )
    ),
    NULL,
    132184654684
);
```

The `$event_json` must be an array with two fields: `schema` and `data`. `data` is a flat array containing the properties of the unstructured event. `schema` identifies the JSON schema against which `data` should be validated.

### Extra Tracker Functions

#### Tracker `flushEmitters`

The `flushEmitters` function can be called after you have successfully created a Tracker with the following function call:

```php
$tracker->flushEmitters();
```

This will tell the tracker to send any remaining events that are left in the buffer to the collector(s).
