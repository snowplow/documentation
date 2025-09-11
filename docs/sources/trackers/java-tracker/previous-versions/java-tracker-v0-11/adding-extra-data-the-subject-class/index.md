---
title: "Adding extra data: the Subject class"
description: "Add user and session context using Java tracker version 0.11 subject class."
schema: "TechArticle"
keywords: ["Java V0.11", "Legacy Subject", "Previous Version", "Subject Class", "Deprecated Version", "Legacy Context"]
date: "2022-05-12"
sidebar_position: 70
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- [`setUserId`](#set-user-id)
- [`setScreenResolution`](#set-screen-resolution)
- [`setViewport`](#set-viewport-dimensions)
- [`setColorDepth`](#set-color-depth)
- [`setTimezone`](#set-timezone)
- [`setLanguage`](#set-lang)
- [`setIpAddress`](#set-ip-address)
- [`setUseragent`](#set-useragent)
- [`setNetworkUserId`](#set-network-user-id)
- [`setDomainUserId`](#set-domain-user-id)
- [`setDomainSessionId`](#set-domain-session-id) (Java tracker v0.11 onwards)

Here are some examples:

```java
// Init an empty Subject and add some values
Subject s1 = new Subject.SubjectBuilder().build();
s1.setUserId("Kevin Gleason");
s1.setLanguage("en-gb");
s1.setScreenResolution(1920, 1080);

// Init all values at build time
Subject s1 = new Subject.SubjectBuilder()
              .userId("Kevin Gleason")
              .language("en-gb")
              .screenResolution(1920, 1080)
              .build();
```

After that, you can add your Subject to your Tracker like so:

```java
Tracker t1 = new Tracker.TrackerBuilder( ... )
              .subject(s1)
              .build();
```

Or when you track an event:

```java
PageView pageViewEvent = PageView.builder()
    .pageTitle("Snowplow Analytics")
    .pageUrl("https://www.snowplowanalytics.com")
    .subject(s1)
    .build();

tracker.track(pageViewEvent);
```

### Set user ID with `setUserId`

You can set the user ID to any string:

```java
s1.setUserId( "{{USER ID}}" )
```

Example:

```java
s1.setUserId("alexd")
```

### Set screen resolution with `setScreenResolution`

If your Java code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```java
s1.setScreenResolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
s1.setScreenResolution(1366, 768)
```

### Set viewport dimensions with `setViewport`

If your Java code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```java
s1.setViewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
s1.setViewport(300, 200)
```

### Set color depth with `setColorDepth`

If your Java code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```java
s1.setColorDepth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```java
s1.setColorDepth(32)
```

### Set timezone with `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```java
s1.setTimezone( {{TIMEZONE}} )
```

The timezone should be a string:

```java
s1.setTimezone("Europe/London")
```

### Set the language with `setLanguage`

This method lets you pass a user's language in to Snowplow:

```java
s1.setLanguage( {{LANGUAGE}} )
```

The language should be a string:

```java
s1.setLanguage('en')
```

### `setIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```java
s1.setIpAddress( {{IP ADDRESS}} )
```

The IP address should be a string:

```java
s1.setIpAddress("127.0.0.1");
```

### `setUseragent`

This method lets you pass a useragent in to Snowplow:

```java
s1.setUseragent( {{USERAGENT}} )
```

The useragent should be a string:

```java
s1.setUseragent("Agent Smith");
```

### `setNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```java
s1.setNetworkUserId( {{NUID}} )
```

The network user id should be a string:

```java
s1.setNetworkUserId("network-id");
```

### `setDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```java
s1.setDomainUserId( {{DUID}} )
```

The domain user id should be a string:

```java
s1.setDomainUserId("domain-id");
```

### `setDomainSessionId`

This method lets you pass a Domain Session ID in to Snowplow:

```java
s1.setDomainSessionId( {{SID}} )
```

The domain session id should be a string:

```java
s1.setDomainSessionId("session-id");
```
