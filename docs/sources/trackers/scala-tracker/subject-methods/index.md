---
title: "Subject methods"
description: "Configure user subjects in Scala tracker for behavioral event context and identification methods."
schema: "TechArticle"
keywords: ["Scala Subject", "Subject Methods", "User Context", "Scala Analytics", "Functional Analytics", "Subject Class"]
date: "2022-9-15"
sidebar_position: 30
---

A list of the methods used to add data to the Subject class.

### Set the platform with `setPlatform`

The default platform is `Server`. These are the available alternatives, all available in the package `com.snowplowanalytics.snowplow.scalatracker`:

- Server
- Web
- Mobile
- Desktop
- Tv
- Console
- InternetOfThings
- General

Example usage

```scala
subject.setPlatform(Tv)
```

### Set the user ID with `setUserId`

You can make the user ID a string of your choice:

```scala
subject.setUserId("user-000563456")
```

### Set the screen resolution with `setScreenResolution`

If your Scala code has access to the device's screen resolution, you can pass it in to Snowplow. Both numbers should be positive integers; note the order is width followed by height. Example:

```scala
subject.setScreenResolution(1366, 768)
```

### Set the viewport dimensions with `setViewport`

Similarly, you can pass the viewport dimensions in to Snowplow. Again, both numbers should be positive integers and the order is width followed by height. Example:

```scala
subject.setViewport(300, 200)
```

### Set the color depth with `setColorDepth`

If your Scala code has access to the bit depth of the device's color palette for displaying images, you can pass it in to Snowplow. The number should be a positive integer, in bits per pixel.

```scala
subject.setColorDepth(24)
```

### Setting the timezone with `setTimezone`

If your Scala code has access to the timezone of the device, you can pass it in to Snowplow:

```scala
subject.setTimezone("Europe London")
```

### Setting the language with `setLang`

You can set the language field like this:

```scala
subject.setLang("en")
```

### Setting the IP address with `setIpAddress`

If you have access to the user's IP address, you can set it like this:

```scala
subject.setIpAddresss("34.634.11.139")
```

### Setting the useragent with `setUseragent`

If you have access to the user's useragent (sometimes called "browser string"), you can set it like this:

```scala
subject.setUseragent("Mozilla/5.0 (Windows NT 5.1; rv:24.0) Gecko/20100101 Firefox/24.0")
```

### Setting the domain user ID with `setDomainUserId`

The `domain_userid` field of the Snowplow event model corresponds to the ID stored in the first party cookie set by the Snowplow JavaScript Tracker. If you want to match up server-side events with client-side events, you can set the domain user ID for server-side events like this:

```scala
subject.setDomainUserId("c7aadf5c60a5dff9")
```

### Setting the network user ID with `setNetworkUserId`

The `network_user_id` field of the Snowplow event model corresponds to the ID stored in the third party cookie set by the Snowplow Clojure Collector and Scala Stream Collector. You can set the network user ID for server-side events like this:

```scala
subject.setNetworkUserId("ecdff4d0-9175-40ac-a8bb-325c49733607")
```
