---
title: "Arduino Tracker"
date: "2020-02-25"
sidebar_position: 290
---

```mdx-code-block
import Block2899 from "@site/docs/reusable/untitled-reusable-block-36/_index.md"

<Block2899/>
```

The [Snowplow Arduino tracker](https://github.com/snowplow/snowplow-arduino-tracker) allows you to track Snowplow events from an IP-connected [Arduino](http://arduino.cc/) board.

The tracker should be straightforward to use if you are familiar with Arduino development; any prior experience with Snowplow's [JavaScript tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md) or Google Analytics (which has a similar API to Snowplow) is helpful but not necessary.

Note that this tracker has access to a much more restricted set of Snowplow events than other trackers.

## Before you start

### Tracker compatibility

Please note that the Snowplow Arduino Tracker requires the new Ethernet library API (with DHCP and DNS), which is in Arduino 1.0.

Almost all recent Arduinos (Arduino Uno, Arduino Due et al) should work fine with the Snowplow Tracker.

### Dependencies

If you haven't done so already, download and install the Arduino toolchain and development environment from the [Arduino Software](http://www.arduino.cc/en/Main/software) page.

## Setup

### Installation

Follow these steps to install the Snowplow Arduino Tracker on your computer:

**1)** Browse to the [Arduino Tracker's GitHub site](https://github.com/snowplow/snowplow-arduino-tracker) and download the zip file

**2)** Open your Arduino software and click **File > Preferences** to check your Sketchbook location

**3)** Create a sub-folder within your Sketchbook location called "libraries" if it doesn't already exist

**4)** Now unzip the zip file you downloaded into the "libraries" sub-folder, renaming its top-level folder from "snowplow-arduino-tracker-master" to "SnowplowTracker":

![](images/libraries-folder.png)

That's it for installation! Now let's test the setup.

### Testing

Follow these steps to test the Snowplow Arduino Tracker with your Arduino board:

**1)** If you have not already done so, connect your Arduino board to your computer, and to the Internet via the RJ-45 ethernet jack on your Ethernet shield, or via your Wi-Fi shield:

![](images/plug-in-arduino.jpg)

**2)** Within your Arduino software, click **File > Examples > SnowplowTracker > basicPing** to load a sample sketch which comes with the Snowplow Arduino Tracker.

Note that it is not necessary to make any edits to this sketch before running it (it is fine for example to leave the MAC address as specified).

**3)** Next click **File > Upload**. This should compile the sketch without any errors and upload it to your Arduino board:

**4)** Now click **Tools > Serial Monitor** and you should see events being successfully pinged to Snowplow:

![](images/snowplow-working.png)

That's it for testing - although if you are interested, you can try out the three other sample sketches in under **File > Examples > SnowplowTracker**.

## Integrating into your sketch

You are now ready to integrate the Snowplow Arduino Tracker into your own sketch. This should be relatively straightforward - we recommend the following steps:

**1)** Look at the source code of the example sketches that come with the Snowplow Arduino Tracker. You can find them on GitHub in [snowplow-arduino-tracker/examples](https://github.com/snowplow/snowplow-arduino-tracker/tree/master/examples)

**2)** Read through the [rest of the documentation](/docs/collecting-data/collecting-from-own-applications/arduino-tracker/index.md) for the Arduino Tracker to learn exactly what tracking capabilities Snowplow can provide for your Arduino sketch.

For a standalone Arduino project which incorporates Snowplow tracking, please see [arduino-temp-tracker](https://github.com/alexanderdean/arduino-temp-tracker) on GitHub.

## General configuration and parameters

### Initialization

Assuming you have completed the Lua Tracker Setup for your Lua project, you are now ready to initialize the Lua Tracker.

You must add some initialization code to the top of your Arduino sketch, before your `setup()` function:

#### Required headers

Make sure you have the following includes:

```arduino
#include <SPI.h>
#include <Ethernet.h>
#include <SnowplowTracker.h>
```

#### Initialize SnowplowTracker

After your includes but before your `setup()` function, initialize your `SnowplowTracker` something like this:

```arduino
// MAC address of this Arduino. Update with your shield's MAC address.
const byte mac[] = { 0x90, 0xA2, 0xDA, 0x00, 0xF8, 0xA0 };

// Snowplow app name
const char *snowplowAppName = "my-arduino-project";

// Snowplow Tracker
SnowplowTracker snowplow(&Ethernet, mac, snowplowAppName);
```

Note that this initialization includes setting the application ID for your Arduino project, as well as your device's MAC address.

#### Setting the endpoint

Endpoint refers to the location of your collector: you need to point your Arduino tracker to your collector endpoint, to ensure that data generated by your Arduino is logged by the collector.

If you are using a Cloudfront collector you can use [initCf](#setting-a-cloudfront-endpoint-using-initcf) to set the endpoint. If you are using any other collector (e.g. the Clojure Collector or the Scala Stream Collector), then you should use [initUrl](#setting-a-non-cloudfront-endpoint-using-initurl).

#### Setting a Cloudfront endpoint using `initCf()`

You can set the collector endpoint for the Cloudfront collector by adding to your `setup()` function:

```arduino
snowplow.initCf("{{CLOUDFRONT-SUBDOMAIN}}");
```

So if your Cloudfront subdomain is `d3rkrsqld9gmqf`, you would include:

```arduino
snowplow.initCf("d3rkrsqld9gmqf");
```

This completes the initialization of your `SnowplowTracker`.

#### Setting a non-Cloudfront endpoint using `initUrl()`

If you are running a different collector (not the Cloudfront collector) then add to your `setup()` function:

```arduino
snowplow.initUrl("{{COLLECTOR-URL}}");
```

So if your collector endpoint is at 'my-company.c.snplow.com' then you would include:

```arduino
snowplow.initUrl("my-company.c.snplow.com");
```

This completes the initialization of your `SnowplowTracker`.

#### Setting the user ID

The Arduino Tracker automatically passes to the collector the `mac_address` supplied on initialization.

However you may want to additionally identify a specific Arduino board by a more business-friendly name. To do this, you use the `setUserId` method.

##### Setting the user ID using `setUserId`

To set a business-friendly user ID for this Arduino, use the `setUserId()` method i.e.:

```arduino
snowplow.setUserId("boardroom-arduino");
```

## Tracking specific events

Tracking functions supported by the Arduino Tracker at a glance:

| **Function**                                                                                     | **Description**                          |
|--------------------------------------------------------------------------------------------------|------------------------------------------|
| [`trackStructEvent`](#tracking-custom-structured-events) | Track a Snowplow custom structured event |

### Common

All events are tracked with specific Arduino C++ functions of the form `trackXXX`, where `XXX` is the name of the event to track.

A given event type may have multiple different signatures (to support slightly different argument options or types).

### Return codes

All `trackXXX` functions return an integer to report the status of the attempt to track the given event object.

The full list of return codes are given below:

| **Constant**              | **Integer value** | **Description**                                                            |
|---------------------------|-------------------|----------------------------------------------------------------------------|
| `ERROR_CONNECTION_FAILED` | \-1               | Could not connect to Snowplow collector                                    |
| `ERROR_TIMED_OUT`         | \-2               | Snowplow collector did not respond                                         |
| `ERROR_INVALID_RESPONSE`  | \-3               | Snowplow collector's response couldn't be parsed                           |
| `ERROR_MISSING_ARGUMENT`  | \-4               | Required argument(s) to `trackXXX` missing                                 |
| `ERROR_HTTP_STATUS`       | \-5               | HTTP status code returned by Snowplow collector was server or client error |
| N/A                       | 1-399             | Non-error HTTP status code returned by Snowplow collector                  |

You can access these constants in your code by prepending with `SnowplowTracker::`, for example:

```arduino
int ret_val = snowplow.trackXXX;
if (ret_val == SnowplowTracker::ERROR_HTTP_STATUS) {
  ...
}
```

### Tracking custom structured events

Custom structured events are the only form of tracking currently supported by the Snowplow Arduino tracker. Whenever you want to record an event or sensor reading from your IP-connected Arduino, use `trackStructEvent` to send this data to Snowplow.

Some examples of tracking custom structured events from your Arduino board(s) might include:

- Monitoring the environment (temperature, humidity, light levels etc) in your warehouse/factory/workplace/shop/museum
- Tracking the movement of products around your shop/warehouse/factory using Arduino, [RFID readers](http://arduino.cc/blog/category/wireless/rfid/) and Snowplow
- Sending vehicle fleet information (locations, speeds, fuel levels etc) back to Snowplow using Arduino's [3G and GPS](http://www.cooking-hacks.com/index.php/documentation/tutorials/arduino-3g-gprs-gsm-gps) shields

#### `trackStructEvent` overview

There are five arguments associated with each structured event. Of them, only the first two are required:

| **Name**    | **Required?** | **Description**                                                                                                                                                                                |
|-------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `aCategory` | Yes           | The name you supply for the group of objects you want to track e.g. 'sensor', 'ecomm'                                                                                                          |
| `aAction`   | Yes           | A string which defines the type of user interaction for the web object e.g. 'read-temp', 'wifi-strength'                                                                                       |
| `aLabel`    | No            | An optional string which identifies the specific object being actioned e.g. ID of the sensor being read                                                                                        |
| `aProperty` | No            | An optional string describing the object or the action performed on it. This might be whether the temperature reading is in Fahrenheit or Celsius                                              |
| `aValue`    | No            | An optional float or double to quantify or further describe the user action. This might be the price of an item added-to-basket, or the starting time of the video where play was just pressed |

There are four slightly different signatures for the `tractStructEvent`, depending on what type of `aValue` you want to supply:

#### `trackStructEvent`: no `aValue`

The relevant signature for `trackStructEvent` if you have no `aValue` to log is:

```arduino
int trackStructEvent(const char *aCategory,
                     const char *aAction,
                     const char *aLabel = NULL,
                     const char *aProperty = NULL) const;
```

Note that this version defaults `aLabel` and `aProperty` to `NULL` if you don't set them. Here's an example invocation:

```arduino
snowplow.trackStructEvent("example", "basic ping");
```

#### `trackStructEvent`: integer `aValue`

The relevant signature for `trackStructEvent` if `aValue` is an integer is:

```arduino
int trackStructEvent(const char *aCategory,
                     const char *aAction,
                     const char *aLabel,
                     const char *aProperty,
                     const int aValue) const;
```

Notes:

- Because `aValue` must be a float or double, this version of `trackStructEvent` appends ".0" to the end of the int before sending to Snowplow
- If you don't want to set `aLabel` or `aProperty`, pass in `NULL` in their place

Here's an example invocation:

```arduino
snowplow.trackStructEvent("example", "profile-update", "age", NULL, 22);
```

#### `trackStructEvent`: double `aValue`

The relevant signature for `trackStructEvent` to track a double in `aValue` is:

```arduino
int trackStructEvent(const char *aCategory,
                     const char *aAction,
                     const char *aLabel,
                     const char *aProperty,
                     const double aValue,
                     const int aValuePrecision = 2) const;
```

`aValuePrecision` lets you specify the number of decimal places to use when logging the double `aValue` (it defaults to two decimal places). Note that the default type for floating point literals in Arduino is double, not float.

Here's an example invocation:

```arduino
snowplow.trackStructEvent("example", "constant", NULL, "pi", 3.14159, 5);
```

#### `trackStructEvent`: float `aValue`

The relevant signature for `trackStructEvent` to track a float in `aValue` is:

```arduino
int trackStructEvent(const char *aCategory,
                     const char *aAction,
                     const char *aLabel,
                     const char *aProperty,
                     const float aValue,
                     const int aValuePrecision = 2) const;
```

`aValuePrecision` lets you specify the number of decimal places to use when logging the float `aValue` (it defaults to two decimal places). Note that the default type for floating point literals in Arduino is double, not float.

Here's an example invocation:

```arduino
snowplow.trackStructEvent("example", "temp reading", NULL, "celsius", 15.3f, 1);
```

## Testing and debugging

Arduino is a difficult platform to test and debug software on, so it's important to understand what options the Snowplow Arduino Tracker has for debugging.

### Setup debugging

By default, debug logging to your Arduino Serial Monitor console is switched **on** for the Snowplow Arduino Tracker, which should help you to identify any problems debugging your Snowplow event tracking.

To switch off this logging when you are finished testing, edit this line found near the top of your copy of `SnowplowTracker.cpp`:

```arduino
#define LOG_LEVEL   0x03 // Change to 0x00 when you've finished testing
```

As the comment says, change "0x03" to "0x00" to switch off all logging to your Arduino Serial Monitor console.

The full set of logging levels are as follows:

| **Constant**  | **Integer value** | **Description**                                        |
|---------------|-------------------|--------------------------------------------------------|
| `NO_LOG`      | 0x00              | Don't print any messages to the Serial Monitor console |
| `ERROR_LEVEL` | 0x01              | Only print errors to the console                       |
| `INFO_LEVEL`  | 0x02              | Print errors and important messages to the console     |
| `DEBUG_LEVEL` | 0x03              | Print all errors and messages to the console           |
