---
title: "Configuration"
date: "2020-02-26"
sidebar_position: 300
---

You may have additional information about your application"s environment, current user and so on, which you want to send to Snowplow with each event.

The tracker instance has a set of `set...()` methods to attach extra data to all tracked events:

- [`setPlatform()`](#set-platform)
- [`setUserId()`](#set-user-id)
- [`setScreenResolution()`](#set-screen-resolution)
- [`setViewport`](#set-viewport)
- [`setColorDepth()`](#set-color-depth)
- [`setTimezone()`](#set-timezone)
- [`setLang()`](#set-lang)

We will discuss each of these in turn below:

### [](#31-set-the-platform-id-with-setplatform)3.1 Set the platform ID with `setPlatform()`

You can set the platform:

```
t.setPlatform( "{{PLATFORM}}" );
```

Example:

```
t.setPlatform("mob");
```

If the platform is not set manually, it defaults to `'srv'` (for server).

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](https://github.com/snowplow/snowplow/wiki/Snowplow-Tracker-Protocol).

### Set user ID with `setUserId()`

You can set the user ID to any string:

```
t.setUserId( "{{USER ID}}" );
```

Example:

```
t.setUserId("alexd");
```

### Set screen resolution with `setScreenResolution()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```
t.setScreenResolution( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
t.setScreenResolution(1366, 768);
```

### Set viewport dimensions with `setViewport()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```
t.setViewport( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```
t.setViewport(300, 200);
```

### Set color depth with `setColorDepth()`

If your code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```
t.setColorDepth( {{BITS PER PIXEL}} );
```

The number should be a positive integer, in bits per pixel. Example:

```
t.setColorDepth(32);
```

### Set the timezone with `setTimezone()`

This method lets you pass a user's language in to Snowplow:

```
t.setTimezone( {{TIMEZONE}} );
```

Example:

```
t.setTimezone('Europe/London');
```

### Set the language with `setLang()`

This method lets you pass a user's language in to Snowplow:

```
t.setLang( {{LANGUAGE}} );
```

The number should be a positive integer, in bits per pixel. Example:

```
t.setLang('en');
```
