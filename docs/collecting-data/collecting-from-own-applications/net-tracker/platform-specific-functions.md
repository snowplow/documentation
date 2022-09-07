---
title: "Platform specific functions"
date: "2020-02-26"
sidebar_position: 70
---

To support multiple platforms we provide several utility functions for fetching platform specific information.

### `GetMobileContext`

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#platformextensions-only)PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`

**NOTE**: These mobile contexts do not currently fetch any advertising identifiers.

### `GetGeoLocationContext`

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#platformextensions-only-1)PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`

**NOTE**: To make the `GeoLocation` context work on `iOS` you will need to add the following to your `Info.plist`:

```csharp
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
<key>NSLocationAlwaysUsageDescription</key>
<string></string>
```

When you send your first event a prompt will be fired asking the user for permission to use their location.

### `GetDesktopContext`

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#platformextensions-only-2)PlatformExtensions only

Platforms:

- `.NET Framework 4.6.1+`

### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#84-getlocalfilepath)8.4 `GetLocalFilePath`

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#platformextensions-only-3)PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`

### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#85-isdeviceonline)8.5 `IsDeviceOnline`

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#platformextensions-only-4)PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`
- `.NET Framework 4.6.1+`
