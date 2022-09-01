---
title: "Subject"
date: "2020-02-26"
sidebar_position: 50
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a set of `Set...()` methods to attach extra data relating to the user to all tracked events:

- [`SetUserId`](#set-user-id)
- [`SetScreenResolution`](#set-screen-resolution)
- [`SetViewport`](#set-viewport)
- [`SetColorDepth`](#set-color-depth)
- [`SetTimezone`](#set-timezone)
- [`SetLang`](#set-lang)
- [`SetIpAddress`](#set-ip-address)
- [`SetUseragent`](#set-useragent)
- [`SetNetworkUserId`](#set-network-user-id)
- [`SetDomainUserId`](#set-domain-user-id)
- [`SetPlatform`](#set-platform)

Here are some examples:

```csharp
Subject s1 = new Subject();
s1.SetUserId("Kevin Gleason");
s1.SetLang("en-gb");
s1.SetScreenResolution(1920, 1080);
```

### `SetUserId`

You can set the user ID to any string:

```csharp
s1.SetUserId( "{{USER ID}}" )
```

Example:

```csharp
s1.SetUserId("alexd")
```

### `SetScreenResolution`

If your C# code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```csharp
s1.SetScreenResolution( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```csharp
s1.SetScreenResolution(1366, 768)
```

### `SetViewport`

If your C# code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```csharp
s1.SetViewport( {{WIDTH}}, {{HEIGHT}} )
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```csharp
s1.SetViewport(300, 200)
```

### `SetColorDepth`

If your C# code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```csharp
s.SetColorDepth( {{BITS PER PIXEL}} )
```

The number should be a positive integer, in bits per pixel. Example:

```csharp
s.SetColorDepth(32)
```

### `SetTimezone`

This method lets you pass a user's timezone in to Snowplow:

```csharp
s.SetTimezone( {{TIMEZONE}} )
```

The timezone should be a string:

```csharp
s.SetTimezone("Europe/London")
```

### `SetLang`

This method lets you pass a user's language in to Snowplow:

```csharp
s.SetLang( {{LANGUAGE}} )
```

The language should be a string:

```csharp
s.SetLang('en')
```

### `SetIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```csharp
s.SetIpAddress( {{IP ADDRESS}} )
```

The IP address should be a string:

```csharp
s.SetIpAddress("127.0.0.1");
```

### `SetUseragent`

This method lets you pass a useragent in to Snowplow:

```csharp
s.SetUseragent( {{USERAGENT}} )
```

The useragent should be a string:

```csharp
s.SetUseragent("Agent Smith");
```

### `SetNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```csharp
s.SetNetworkUserId( {{NUID}} )
```

The network user id should be a string:

```csharp
s.SetNetworkUserId("network-id");
```

### `SetDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```csharp
s.SetDomainUserId( {{DUID}} )
```

The domain user id should be a string:

```csharp
s.SetDomainUserId("domain-id");
```

### `SetPlatform`

This method lets you set the Platform that the Tracker is running on:

```csharp
s.SetPlatform( Platform.{{ option }} )
```

The Platform should be an enum:

```csharp
s.SetPlatform(Platform.Mob);
```

Available platforms:

- Web
- Mob
- Pc
- Srv
- App
- Tv
- Cnsl
- Iot
