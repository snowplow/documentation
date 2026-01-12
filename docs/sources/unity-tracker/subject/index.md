---
title: "Configure a subject with the Unity tracker"
sidebar_label: "Subject"
date: "2020-02-26"
sidebar_position: 60
description: "Configure subject properties including user ID, screen resolution, viewport, timezone, and language to attach user context to all tracked events."
keywords: ["unity subject configuration", "unity user context", "unity tracker user properties"]
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a set of `Set...()` methods to attach extra data relating to the user to all tracked events:

- [`SetUserId`](#set-user-id)
- [`SetScreenResolution`](#set-screen-resolution)
- [`SetViewport`](#set-viewport)
- [`SetColorDepth`](#set-color-depth)
- [`SetTimezone`](#set-timezone)
- [`SetLanguage`](#set-language)
- [`SetIpAddress`](#set-ip-address)
- [`SetUseragent`](#set-useragent)
- [`SetNetworkUserId`](#set-network-user-id)
- [`SetDomainUserId`](#set-domain-user-id)

Here are some examples:

```csharp
Subject s1 = new Subject();
s1.SetUserId("Kevin Gleason");
s1.SetLanguage("en-gb");
s1.SetScreenResolution(1920, 1080);
```

After that, you can add your Subject to your Tracker like so:

```csharp
Tracker t1 = new Tracker(..., s1)

// OR

t1.SetSubject(s1);
```

### Set user ID with `SetUserId`

You can set the user ID to any string:

```csharp
s1.SetUserId( "{{USER ID}}" )
```

Example:

```csharp
s1.SetUserId("alexd")
```

### Set screen resolution with `SetScreenResolution`

If your C# code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```csharp
t1.SetScreenResolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```csharp
t1.SetScreenResolution(1366, 768)
```

### Set viewport dimensions with `SetViewport`

If your C# code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```csharp
s.SetViewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```csharp
s.SetViewport(300, 200)
```

### Set color depth with `SetColorDepth`

If your C# code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```csharp
s.SetColorDepth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```csharp
s.SetColorDepth(32)
```

### Set timezone with `SetTimezone`

This method lets you pass a user's timezone in to Snowplow:

```csharp
s.SetTimezone( {{TIMEZONE}} )
```

The timezone should be a string:

```csharp
s.SetTimezone("Europe/London")
```

### Set the language with `SetLanguage`

This method lets you pass a user's language in to Snowplow:

```csharp
s.SetLanguage( {{LANGUAGE}} )
```

The language should be a string:

```csharp
s.SetLanguage('en')
```

### `SetIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```csharp
SetIpAddress( {{IP ADDRESS}} )
```

The IP address should be a string:

```csharp
subj.SetIpAddress("127.0.0.1");
```

### `SetUseragent`

This method lets you pass a useragent in to Snowplow:

```csharp
SetUseragent( {{USERAGENT}} )
```

The useragent should be a string:

```csharp
subj.SetUseragent("Agent Smith");
```

### `SetNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```csharp
SetNetworkUserId( {{NUID}} )
```

The network user id should be a string:

```csharp
subj.SetNetworkUserId("network-id");
```

### `SetDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```csharp
SetDomainUserId( {{DUID}} )
```

The domain user id should be a string:

```csharp
subj.SetDomainUserId("domain-id");
```
