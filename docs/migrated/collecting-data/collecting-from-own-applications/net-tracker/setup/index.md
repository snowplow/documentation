---
title: "Setup"
date: "2020-02-26"
sidebar_position: 10
---

## Tracker compatibility

Version 1.0.0+ marks the conversion of the core library to .NET Standard 1.4. This core (`Snowplow.Tracker`) is directly compatible with [these platforms](https://github.com/dotnet/standard/blob/master/docs/versions.md). We have also published a Portable Class Library (PCL) wrapper providing extra features for Xamarin users. This is called `Snowplow.Tracker.PlatformExtensions`.

## Setup

### [](https://github.com/snowplow/snowplow/wiki/.NET-tracker-setup#net-standard-users).NET Standard users

To add the .NET Tracker as a dependency to your project, install it in the Visual Studio Package Manager Console using [NuGet](https://www.nuget.org/):

```
Install-Package Snowplow.Tracker
```

### [](https://github.com/snowplow/snowplow/wiki/.NET-tracker-setup#xamarin-users)Xamarin users

To add the .NET Tracker as a dependency to your project, install it in the Visual Studio Package Manager Console using [NuGet](https://www.nuget.org/):

```
Install-Package Snowplow.Tracker.PlatformExtensions
```

Remember to add an assembly reference to the .NET Tracker to your project.
