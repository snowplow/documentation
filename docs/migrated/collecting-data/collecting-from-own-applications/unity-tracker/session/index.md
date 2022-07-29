---
title: "Session"
date: "2020-02-26"
sidebar_position: 70
---

The Session object is responsible for maintaining persistent data around user sessions over the life-time of an application.

### Constructor

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `foregroundTimeout` | The time until a session expires in focus | No | 600 (s) |
| `backgroundTimeout` | The time until a session expires in back | No | 300 (s) |
| `checkInterval` | How often to validate the session timeout | No | 15 (s) |

A full Session construction should look like the following:

```csharp
Session session = new Session (1200, 600, 30);
```

The timeout's refer to the length of time the session remains active after the last event is sent. As long as events are sent within this limit the session will not timeout.

### Functions

#### `SetBackground(bool)`

Will set whether or not the application is in the background. It is up to the developer to set this metric if they wish to have a different timeout for foreground and background.
