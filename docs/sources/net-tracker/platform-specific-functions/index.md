---
title: "Platform specific functions for the .NET tracker"
sidebar_label: "Platform specific functions for the .NET tracker"
date: "2020-02-26"
sidebar_position: 70
description: "Access platform-specific information for mobile, desktop, and geo-location contexts in Xamarin and .NET applications."
keywords: ["platform-specific functions", "mobile context", "geo-location"]
---

To support multiple platforms we provide several utility functions for fetching platform specific information.

### `GetMobileContext`

#### PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`

**NOTE**: These mobile contexts do not currently fetch any advertising identifiers.

### `GetGeoLocationContext`

#### PlatformExtensions only

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

#### PlatformExtensions only

Platforms:

- `.NET Framework 4.6.1+`

### 8.4 `GetLocalFilePath`

#### PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`

### 8.5 `IsDeviceOnline`

#### PlatformExtensions only

Platforms:

- `Xamarin.Android API 15+`
- `Xamarin.iOS 8+`
- `.NET Framework 4.6.1+`
