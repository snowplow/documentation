---
title: "Configuring a subject with the .NET tracker"
sidebar_label: "Subject"
date: "2020-02-26"
sidebar_position: 50
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

The Subject class has a number of `Set...()` methods to attach extra data relating to the user of the tracked events.

Here are some examples:

```csharp
Subject s1 = new Subject();
s1.SetUserId("Kevin Gleason");
s1.SetLang("en-gb");
s1.SetScreenResolution(1920, 1080);
```

There are two ways to provide the subject information:

1. Globally for all tracked events. This is useful in client-side applications where all tracked events relate to the same user and share the same properties.
2. For each event individually. This is useful in server-side applications where each event might relate to a different user.

To configure a global subject, pass it to the tracker during initialization:

```csharp
var globalSubject = new Subject().SetPlatform(Platform.Mob).SetLang("EN");

Tracker.Tracker.Instance.Start(emitter: emitter, subject: globalSubject, trackerNamespace: "some namespace", appId: "some appid", l: logger);
```

To pass the subject along with tracked events:

```csharp
Subject eventSubject = new Subject().SetUserId("Kevin Gleason");

Tracker.Instance.Track(
    new Structured()
        .SetCategory("shop")
        .SetAction("add-to-basket")
        .Build(),
    eventSubject
);
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
s.SetUseragent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0");
```

### `SetNetworkUserId`

This method lets you pass a Network User ID in to Snowplow:

```csharp
s.SetNetworkUserId( {{NUID}} )
```

The network user id should be a string, typically a UUID:

```csharp
s.SetNetworkUserId("a57c0cac-4aab-49c5-8e70-790f415080b0");
```

### `SetDomainUserId`

This method lets you pass a Domain User ID in to Snowplow:

```csharp
s.SetDomainUserId( {{DUID}} )
```

The domain user id should be a string, typically a UUID:

```csharp
s.SetDomainUserId("be0999db-8e4e-4f0c-9f3e-fe5e5de1669a");
```

### `SetDomainSessionId`

This method lets you pass a Domain Session ID in to Snowplow:

```csharp
s.SetDomainSessionId( {{SID}} )
```

The domain session id should be a string, typically a UUID:

```csharp
s.SetDomainSessionId("8b107139-5b38-45cc-a0eb-be2550e32904");
```

### `SetDomainSessionIndex`

This method lets you pass a Domain Session Index in to Snowplow:

```csharp
s.SetDomainSessionIndex( {{VID}} )
```

The domain user id should be an int:

```csharp
s.SetDomainSessionIndex(1);
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
