---
title: "Utilities"
description: "Utility functions and helper methods for Unity tracker behavioral event collection implementation."
schema: "TechArticle"
keywords: ["Unity Utilities", "Game Utilities", "Helper Functions", "Unity Tools", "Game Tools", "Unity Helpers"]
date: "2020-02-26"
sidebar_position: 90
---

## Utilities

The Tracker also provides several extra utilities that can be used.

### Log

There is a custom logging wrapper which allows you to control the level of Tracker logging that occurs. You can set the level via:

```csharp
Log.SetLogLevel({0,1,2 or 3});
```

- `0` : Turns of all logging
- `1` : Error only
- `2` : Error and Debug
- `3` : Error, Debug and Verbose

### 8.2 ConcurrentQueue

Due to the .NET 2.0 limitations in earlier versions of the Snowplow Unity Tracker we have had to implement our own ThreadSafe queue which can be found in the following package:

- `SnowplowTracker.Collections`
