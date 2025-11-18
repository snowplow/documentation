---
title: "Introduction to .NET Tracker Initialization"
date: "2020-02-26"
sidebar_position: 20
---

Assuming you have completed the .NET Tracker Setup for your project, you are now ready to initialize the .NET Tracker.

### Importing the library

Add the following `using` lines to the top of your `.cs` scripts to access the Tracker:

```csharp
using Snowplow.Tracker.Emitters;
using Snowplow.Tracker.Endpoints;
using Snowplow.Tracker.Logging;
using Snowplow.Tracker.Models;
using Snowplow.Tracker.Models.Events;
using Snowplow.Tracker.Models.Adapters;
using Snowplow.Tracker.Queues;
using Snowplow.Tracker.Storage;
```

You should now be able to setup the Tracker!

### Creating a tracker

#### Using Snowplow.Tracker (.NET Standard) or Snowplow.Tracker.PlatformExtensions (PCL)

To use the Tracker in your code simply instantiate the Tracker interface with the following:

```csharp
// Create logger
var logger = new ConsoleLogger();

// Controls the sending of events
var endpoint = new SnowplowHttpCollectorEndpoint(emitterUri, method: method, port: port, protocol: protocol, l: logger);

// Controls the storage of events
// NOTE: You must dispose of storage yourself when closing your application!
var storage = new LiteDBStorage("events.db");

// Controls queueing events
var queue = new PersistentBlockingQueue(storage, new PayloadToJsonString());

// Controls pulling events of the queue and pushing them to the sender
var emitter = new AsyncEmitter(endpoint, queue, l: logger);

// Contains information about who you are tracking
var subject = new Subject().SetPlatform(Platform.Mob).SetLang("EN");

Tracker.Tracker.Instance.Start(emitter: emitter, subject: subject, trackerNamespace: "some namespace", appId: "some appid", l: logger);
```

This starts a global singleton Tracker which can be accessed anywhere via the `Tracker.Tracker.Instance.{{ method }}` chain.
