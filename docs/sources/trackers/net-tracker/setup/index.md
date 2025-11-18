---
title: "Setup Guide for the .NET Tracker"
date: "2020-02-26"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

## Tracker compatibility

Version 1.0.0+ marks the conversion of the core library to .NET Standard 1.4. This core (`Snowplow.Tracker`) is directly compatible with [these platforms](https://github.com/dotnet/standard/blob/master/docs/versions.md). We have also published a Portable Class Library (PCL) wrapper providing extra features for Xamarin users. This is called `Snowplow.Tracker.PlatformExtensions`.

<p>The current version is {versions.dotNetTracker}.</p>

## Setup

### .NET Standard users

To add the .NET Tracker as a dependency to your project, install it in the Visual Studio Package Manager Console using [NuGet](https://www.nuget.org/):

```powershell
Install-Package Snowplow.Tracker
```

### Xamarin users

To add the .NET Tracker as a dependency to your project, install it in the Visual Studio Package Manager Console using [NuGet](https://www.nuget.org/):

```powershell
Install-Package Snowplow.Tracker.PlatformExtensions
```

Remember to add an assembly reference to the .NET Tracker to your project.

### MAUI users

The `Snowplow.Tracker.PlatformExtensions` package is currently not compatible with MAUI apps.

However, as a replacement for the `GetLocalFilePath` function that the package provides, you can use the following implementation:

```cs
/// <summary>
/// Returns a path for storing the Snowplow events and session databases
/// </summary>
public string GetLocalFilePath(string filename)
{
    var path = System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData);
    return Path.Combine(path, filename);
}
```

This function can be used to initialize the tracker as follows:

```cs
var dest = new SnowplowHttpCollectorEndpoint(collectorUri, method: method, port: port, protocol: protocol);
var storage = new LiteDBStorage(GetLocalFilePath("events.db"));
var queue = new PersistentBlockingQueue(storage, new PayloadToJsonString());
var emitter = new AsyncEmitter(dest, queue);
var clientSession = new ClientSession(GetLocalFilePath("client_session.dict"));
Instance.Start(emitter: emitter, clientSession: clientSession);
```
