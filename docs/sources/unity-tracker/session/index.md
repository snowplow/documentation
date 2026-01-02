---
title: "Track session data with the Unity tracker"
sidebar_label: "Session"
date: "2020-02-26"
sidebar_position: 70
description: "Manage user session data with configurable foreground and background timeouts across Unity platforms with persistent storage."
keywords: ["unity session tracking", "unity session timeout", "unity session persistence"]
---

The Session object is responsible for maintaining persistent data around user sessions over the life-time of an application.

Session information is persisted using file storage on most platforms except for tvOS and WebGL.
On those two platforms, session information is stored in [`PlayerPrefs`](https://docs.unity3d.com/ScriptReference/PlayerPrefs.html).

### Constructor

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `sessionPath` | The file path to store the persistent session state in | Yes (accepts null) | "snowplow_session.dict" |
| `foregroundTimeout` | The time until a session expires in focus | No | 600 (s) |
| `backgroundTimeout` | The time until a session expires in back | No | 300 (s) |
| `checkInterval` | How often to validate the session timeout | No | 15 (s) |

A full Session construction should look like the following:

```csharp
Session session = new Session ("snowplow_session_state.json", 1200, 600, 30);
```

A minimal construction would be:

```csharp
Session session = new Session (null);
```

The timeouts refer to the length of time the session remains active after the last event is sent. As long as events are sent within this limit the session will not timeout.

### Functions

Except `sessionPath`, all of the constructor variables can be altered/retrieved after creation with the accompanying `session.SetXXX()`/`session.GetXXX()` functions.

#### `SetBackground(bool)`

Will set whether or not the application is in the background. It is up to the developer to set this metric if they wish to have a different timeout for foreground and background.
