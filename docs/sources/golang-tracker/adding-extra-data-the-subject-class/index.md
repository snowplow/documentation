---
title: "Track the Subject with the Golang tracker"
sidebar_label: "Tracking the subject"
description: "Attach user and device information to Golang tracker events using the Subject class. Set user ID, screen resolution, viewport, timezone, language, IP address, and user-agent for enriched event data."
keywords: ["golang subject", "user data", "device information", "user id", "screen resolution"]
date: "2020-02-26"
sidebar_position: 30
---

You may have additional information about your application's environment, current user and so on, which you want to send to Snowplow with each event.

Create a subject like this:

```go
subject := sp.InitSubject()
```

The Subject class has a set of `Set...()` methods to attach extra data relating to the user to all tracked events:

- `SetUserId`
- `SetScreenResolution`
- `SetViewport`
- `SetColorDepth`
- `SetTimezone`
- `SetLanguage`
- `SetIpAddress`
- `SetUseragent`
- `SetDomainUserId`
- `SetNetworkUserId`

### Tracking the Subject

The `Subject` can be used into two ways.

When initialising the `Tracker`:

```go
tracker := sp.InitTracker(
  sp.RequireEmitter(emitter),
  sp.OptionSubject(subject)
)
```

Or when you track an event:

```go
tracker.TrackPageView(sp.PageViewEvent{
  PageUrl: sphelp.NewString("acme.com"),
  Subject: subject
})
```

When setting the `Subject` as you track as event, you will override the `Tracker` level `Subject` for that specific event.

### Set user ID with `SetUserId`

You can set the user ID to any string:

```go
s.SetUserId( "{{USER ID}}" );
```

Example:

```go
s.SetUserId("alexd");
```

### Set screen resolution with `SetScreenResolution`

If your code has access to the device's screen resolution, then you can pass this in to Snowplow too:

```go
s.SetScreenResolution( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```go
s.SetScreenResolution(1366, 768);
```

### Set viewport dimensions with `SetViewport`

If your code has access to the viewport dimensions, then you can pass this in to Snowplow too:

```go
s.SetViewport( {{WIDTH}}, {{HEIGHT}} );
```

Both numbers should be positive integers; note the order is width followed by height. Example:

```go
s.SetViewport(300, 200);
```

### Set color depth with `SetColorDepth`

If your code has access to the bit depth of the device's color palette for displaying images, then you can pass this in to Snowplow too:

```go
s.SetColorDepth( {{BITS PER PIXEL}} );
```

The number should be a positive integer, in bits per pixel. Example:

```go
s.SetColorDepth(32);
```

### Set timezone with `SetTimezone`

This method lets you pass a user's timezone in to Snowplow:

```go
s.timezone( {{TIMEZONE}} );
```

The timezone should be a string:

```go
s.SetColorDepth("Europe/London");
```

### Set the language with `SetLang`

This method lets you pass a user's language in to Snowplow:

```go
s.SetLang( {{LANGUAGE}} );
```

The language should be a string:

```go
s.SetLang('en');
```

### Set the IP Address with `SetIpAddress`

This method lets you pass a user's IP Address in to Snowplow:

```go
s.SetIpAddress( {{IP ADDRESS}} );
```

The IP Address should be a string:

```go
s.SetIpAddress('127.0.0.1');
```

### Set the useragent with `SetUseragent`

This method lets you pass a user's useragent string in to Snowplow:

```go
s.SetUseragent( {{USERAGENT}} );
```

The useragent should be a string:

```go
s.SetUseragent('some useragent');
```

### Set the Domain User ID with `SetDomainUserId`

This method lets you pass a user's Domain User ID string in to Snowplow:

```go
s.SetDomainUserId( {{DOMAIN USER ID}} );
```

The Domain User ID should be a string:

```go
s.SetDomainUserId('domain-uid-12');
```

### Set the Domain User ID with `SetNetworkUserId`

This method lets you pass a user's Network User ID string in to Snowplow:

```go
s.SetNetworkUserId( {{NETWORK USER ID}} );
```

The Network User ID should be a string:

```go
s.SetNetworkUserId('network-uid-12');
```
