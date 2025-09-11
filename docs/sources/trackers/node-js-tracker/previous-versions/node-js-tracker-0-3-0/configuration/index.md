---
title: "Configuration"
description: "Configuration guide for Node.js tracker version 0.3.0 behavioral event collection settings."
schema: "TechArticle"
keywords: ["Node.js V0.3.0", "Legacy Version", "Previous Configuration", "Old Version", "Deprecated Version", "Legacy Config"]
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

### 3.1 Set the platform ID with `setPlatform()`

You can set the platform:

```javascript
t.setPlatform( "{{PLATFORM}}" );
```

Example:

```javascript
t.setPlatform("mob");
```

If the platform is not set manually, it defaults to `'srv'` (for server).

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/events/index.md#application-parameters).

### Set user ID with `setUserId()`

You can set the user ID to any string:

```javascript
t.setUserId( "{{USER ID}}" );
```

Example:

```javascript
t.setUserId("alexd");
```

### Set screen resolution with `setScreenResolution()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```javascript
t.setScreenResolution( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```javascript
t.setScreenResolution(1366, 768);
```

### Set viewport dimensions with `setViewport()`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```javascript
t.setViewport( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```javascript
t.setViewport(300, 200);
```

### Set color depth with `setColorDepth()`

If your code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```javascript
t.setColorDepth( {{BITS PER PIXEL}} );
```

The number should be a positive integer, in bits per pixel. Example:

```javascript
t.setColorDepth(32);
```

### Set the timezone with `setTimezone()`

This method lets you pass a user's language in to Snowplow:

```javascript
t.setTimezone( {{TIMEZONE}} );
```

Example:

```javascript
t.setTimezone('Europe/London');
```

### Set the language with `setLang()`

This method lets you pass a user's language in to Snowplow:

```javascript
t.setLang( {{LANGUAGE}} );
```

The number should be a positive integer, in bits per pixel. Example:

```javascript
t.setLang('en');
```
