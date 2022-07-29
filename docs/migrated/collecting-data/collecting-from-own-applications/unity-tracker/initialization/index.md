---
title: "Initialization"
date: "2020-02-26"
sidebar_position: 20
---

Assuming you have completed the Unity Tracker Setup for your project, you are now ready to initialize the Unity Tracker.

### Importing the library

Add the following `using` lines to the top of your `.cs` scripts to access the Tracker:

```csharp
using SnowplowTracker;
using SnowplowTracker.Emitters;
using SnowplowTracker.Events;
```

You should now be able to setup the Tracker!

### Creating a tracker

To instantiate a Tracker in your code (can be global or local to the process being tracked) simply instantiate the Tracker interface with the following:

```csharp
// Create Emitter and Tracker
IEmitter e1 = new AsyncEmitter ("com.collector.acme")
Tracker t1 = new Tracker(e1, "Namespace", "AppId");

// Start the Tracker
t1.StartEventTracking();
```
