---
title: "Initialization"
description: "Initialize Unity tracker for behavioral event tracking in Unity games and applications."
schema: "TechArticle"
keywords: ["Unity Initialization", "Game Init", "Unity Setup", "Unity Configuration", "Game Analytics", "Unity Init"]
date: "2020-02-26"
sidebar_position: 20
---

Assuming you have completed the Unity Tracker Setup for your project, you are now ready to initialize the Unity Tracker.

### Importing the library

Add the following `using` lines to the top of your `.cs` scripts to access the Tracker:

```csharp
using SnowplowTracker;
using SnowplowTracker.Emitters;
using SnowplowTracker.Enums;
using SnowplowTracker.Events;
```

You should now be able to setup the Tracker!

### Creating a tracker

To instantiate a Tracker in your code (can be global or local to the process being tracked) simply instantiate the Tracker interface with the following:

```csharp
// Create Emitter – to support WebGL, make sure to use the WebGlEmitter
IEmitter emitter = Application.platform == RuntimePlatform.WebGLPlayer
        ? new WebGlEmitter("com.collector.acme", HttpProtocol.HTTPS, HttpMethod.POST)
        : new AsyncEmitter("com.collector.acme", HttpProtocol.HTTPS, HttpMethod.POST);

// Create a Tracker instance with the Emitter
Tracker tracker = new Tracker(emitter, "Namespace", "AppId");

// Start the Tracker
tracker.StartEventTracking();
```
