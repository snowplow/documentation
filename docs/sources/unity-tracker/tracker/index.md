---
title: "Configure a tracker with the Unity tracker"
sidebar_label: "Tracker"
date: "2020-02-26"
sidebar_position: 40
description: "Configure the Unity tracker instance to coordinate event tracking, manage sessions, and control background processing with customizable platform settings."
keywords: ["unity tracker configuration", "unity tracker instance", "starteventtracking unity"]
---

The Tracker object is responsible for co-ordinating the saving and sending of events as well as managing the optional Session object.

### Constructor

| **Argument Name**                                         | **Description**                                                          | **Required?** | **Default** |
| --------------------------------------------------------- | ------------------------------------------------------------------------ | ------------- | ----------- |
| [`emitter`](/docs/sources/unity-tracker/emitter/index.md) | The Emitter object you create                                            | Yes           | Null        |
| `trackerNamespace`                                        | The name of the tracker instance                                         | Yes           | Null        |
| `appId`                                                   | The application ID                                                       | Yes           | Null        |
| [`subject`](/docs/sources/unity-tracker/subject/index.md) | The Subject that defines a user                                          | No            | Null        |
| [`session`](/docs/sources/unity-tracker/session/index.md) | The Session object you create                                            | No            | Null        |
| `platform`                                                | The device the Tracker is running on                                     | No            | Mobile      |
| `base64Encoded`                                           | If we [base 64 encode](https://en.wikipedia.org/wiki/Base64) json values | No            | True        |
| `userAnonymisation` | Enables [client-side user anonymization](/docs/events/anonymous-tracking/index.md#full-client-side-anonymization). Omits user identifiers (userId, domainUserId, networkUserId) and any explicitly-set ipAddress from all events. Note: this does not affect the IP address captured by the collector from the network connection, use server anonymisation for that. | No | False |

A full Tracker construction should look like the following:

```csharp
IEmitter e1 = new AsyncEmitter ("com.collector.acme")
Subject subject = new Subject();
Session session = new Session(null);
Tracker t1 = new Tracker(e1, "Namespace", "AppId", subject, session, DevicePlatforms.Desktop, true);
```

All of these variables can be altered after creation with the accompanying `tracker.SetXXX()` function.

### Functions

The Tracker also contains several critical functions that must be used to start Tracking.

#### `StartEventTracking()`

This function must be called before any events will start being stored or sent. This is due to the fact that we do not want to start any background processing from the constructors so it is left up to the developer to choose when to start everything up.

This function:

- Starts the background emitter thread
- Starts the background event processor thread
- Starts the background session check timer (Optional)

Once this is run everything should be in place for asynchronous event tracking.

#### `StopEventTracking()`

If you need to temporarily halt the Tracker from tracking events you can run this function. This will bring all event processing, sending and collection to a halt and nothing will be started again until `StartEventTracking()` is fired again.

#### `Track(IEvent)`

This is the function used for Tracking all events.

```csharp
tracker.Track(IEvent newEvent);
```

#### `SetUserAnonymisation(bool)`

Enables or disables user anonymization. When enabled, the `userId`, `domainUserId`, `networkUserId`, and `ipAddress` fields are omitted from all events. This can also be set at construction time via the `userAnonymisation` parameter.

```csharp
tracker.SetUserAnonymisation(true);
```
