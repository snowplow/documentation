---
title: "Adding extra data: the Subject class"
date: "2020-02-25"
sidebar_position: 30
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a set of `set...()` methods to attach extra data relating to the user to all tracked events:

- `setUserId`
- `setScreenResolution`
- `setViewport`
- `setColorDepth`
- `setTimezone`
- `setLanguag`[`e`](https://github.com/snowplow/snowplow/wiki/ActionScript3-Tracker#set-lang)

Here are some examples:

```java
s1.setUserID("Kevin Gleason");
s1.setLanguage("en-gb");
s1.setScreenResolution(1920, 1080);
```

After that, you can add your Subject to your Tracker like so:

```java
Tracker(emitter, namespace, appId, s1);
// OR
t1.setSubject(s1);
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

If you wish to track the device's screen resolution, then you can pass this in to Snowplow too:

```java
t1.setScreenResolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
t1.setScreenResolution(1366, 768)
```

You can get these values by referencing [flash.system.Capabilities.screenResolutionX](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/system/Capabilities.html#screenResolutionX) and [flash.system.Capabilities.screenResolutionY](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/system/Capabilities.html#screenResolutionY), although they will only reflect the dimensions of the main screen.

Alternatively, if your AS3 code has script access via [ExternalInterface](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html), you can use Javascript to query these values from the browser or another player context.

### Set viewport dimensions with `setViewport`

If your AS3 code has access to the viewport dimensions (by calling Javascript code through [ExternalInterface](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html)), then you can pass this in to Snowplow too:

```java
s.setViewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```java
s.setViewport(300, 200)
```

### Set color depth with `setColorDepth`

If your AS3 code has access to the bit depth of the device's color palette for displaying images (by calling Javascript's screen.colorDepth via [ExternalInterface](http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/external/ExternalInterface.html)), then you can pass this in to Snowplow too:

```java
s.setColorDepth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```java
s.setColorDepth(32)
```

### Set timezone with `setTimezone`

This method lets you pass a user's timezone in to Snowplow:

```java
s.setTimezone( {{TIMEZONE}} )
```

The timezone should be a string:

```java
s.setTimezone("Europe/London")
```

### Set the language with `setLanguage`

This method lets you pass a user's language in to Snowplow:

```java
s.setLanguage( {{LANGUAGE}} )
```

The language should be a string:

```java
s.setLanguage('en')
```
