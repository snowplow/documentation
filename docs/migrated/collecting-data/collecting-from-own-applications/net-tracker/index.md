---
title: ".NET Tracker"
date: "2020-02-26"
sidebar_position: 180
---

The Snowplow .NET Tracker allows you to track Snowplow events from your .NET websites and desktop applications. It's split into two libraries:

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#snowplowtracker)`Snowplow.Tracker`

This is a fully functional .NET Standard 1.4 tracking library - it will work on any platform that supports .NET Standard 1.4+ (including .NET 461+).

#### [](https://github.com/snowplow/snowplow/wiki/.NET-Tracker#snowplowtrackerplatformextensions)`Snowplow.Tracker.PlatformExtensions`

This is a Portable Class Library (PCL) wrapper around the core `Snowplow.Tracker` library that extends functionality in platform specific ways, for example to provide geo-location information when tracking users in a Xamarin mobile application. If you're using Xamarin we encourage you to use this library.

## Snowplow Demo Application

The Xamarin demo application can be deployed on Android and iOS. Simply launch the `Snowplow.Demo.App.sln` solution file with Visual Studio and deploy to either emulators or actual test devices. The .NET Core Console demo application can also be loaded with Visual Studio using `Snowplow.Demo.Console.sln`.
