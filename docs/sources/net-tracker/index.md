---
title: ".NET tracker SDK"
sidebar_label: ".NET tracker"
sidebar_position: 180
description: "Track events in .NET websites and desktop applications with the Snowplow .NET tracker SDK for .NET Standard and Xamarin."
keywords: [".net tracker", "xamarin tracking", "dotnet analytics"]
---

```mdx-code-block
import Badges from '@site/src/components/Badges';

<Badges badgeType="Maintained"></Badges>
```

The Snowplow .NET Tracker allows you to track Snowplow events from your .NET websites and desktop applications. It's split into two libraries:

#### `Snowplow.Tracker`

This is a fully functional .NET Standard 1.4 tracking library - it will work on any platform that supports .NET Standard 1.4+ (including .NET 461+).

#### `Snowplow.Tracker.PlatformExtensions`

This is a Portable Class Library (PCL) wrapper around the core `Snowplow.Tracker` library that extends functionality in platform specific ways, for example to provide geo-location information when tracking users in a Xamarin mobile application. If you're using Xamarin we encourage you to use this library.

## Snowplow Demo Application

The Xamarin demo application can be deployed on Android and iOS. Simply launch the `Snowplow.Demo.App.sln` solution file with Visual Studio and deploy to either emulators or actual test devices. The .NET Core Console demo application can also be loaded with Visual Studio using `Snowplow.Demo.Console.sln`.
