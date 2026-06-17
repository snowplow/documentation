---
title: "Track session data with the .NET tracker"
sidebar_label: "Session"
date: "2020-02-26"
sidebar_position: 60
description: "Track user sessions with persistent session data including session ID, index, and timeout configuration for .NET applications."
keywords: [".net session tracking", "client session", "session management"]
---

The Session object is responsible for maintaining persistent data around user sessions over the life-time of an application.

### Constructor

| **Argument Name**   | **Description**                           | **Required?** | **Default** |
| ------------------- | ----------------------------------------- | ------------- | ----------- |
| `savePath`          | The path to save persistent data into     | Yes           | Null        |
| `foregroundTimeout` | The time until a session expires in focus | No            | 600 (s)     |
| `backgroundTimeout` | The time until a session expires in back  | No            | 300 (s)     |
| `checkInterval`     | How often to validate the session timeout | No            | 15 (s)      |
| `logger`            | The logger to use within the application  | No            | Null        |

A full ClientSession construction should look like the following:

```csharp
ClientSession session = new ClientSession ("save_file_path.xml");
```

The timeout's refer to the length of time the session remains active after the last event is sent. As long as events are sent within this limit the session will not timeout.

**NOTE**: When using the Tracker within Xamarin you will need to fetch a correct path for internal storage. Some example code for fetching this path:

```csharp
// Android
public string GetLocalFilePath(string filename)
{
  string path = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
  return Path.Combine(path, filename);
}

// iOS
public string GetLocalFilePath(string filename)
{
  string docFolder = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
  string libFolder = Path.Combine(docFolder, "..", "Library", "Databases");

  if (!Directory.Exists(libFolder))
  {
    Directory.CreateDirectory(libFolder);
  }

  return Path.Combine(libFolder, filename);
}
```

### 6.2 Functions

#### `SetBackground(bool)`

Will set whether or not the application is in the background. It is up to the developer to set this metric if they wish to have a different timeout for foreground and background.

**NOTE**: If a timeout occurs while the application has been backgrounded the SessionChecker will be stopped automatically. Session checking will resume on Foregrounding or on an event being tracked.
