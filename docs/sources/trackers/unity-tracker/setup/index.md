---
title: "Setup Guide for the Unity Tracker"
date: "2020-02-26"
sidebar_position: 10
---

## Integration options

### Tracker compatibility

The Snowplow Unity Tracker has been built and tested using Unity 2022.3 on Windows, Linux, OSX, iOS, Android, tvOS, and WebGL. It is built using .NET Standard 2.0 and requires at least Unity 2018.1.

It is not currently compatible with the WebPlayer.

### Dependencies

There are several dependencies that are required to use the Unity Tracker currently. These are available in [this folder](https://github.com/snowplow/snowplow-unity-tracker/tree/master/Resources).

- `UnityEngine.dll` : This is included as a way of setting up development externally to the Unity playground; you do not need to include this.
- `Newtonsoft.Json.dll` : This is included as a way of setting up development externally to the Unity playground; you do not need to include this as it is bundled with Unity 2020+ or should be installed via [Newtonsoft.Json-for-Unity package](https://github.com/jilleJr/Newtonsoft.Json-for-Unity).

All the other dependencies are required for proper Tracker function but they are included inside the `unitypackage`.

## Setup

### Download

The Unity Tracker package is published to the Unity Trackers [Github releases](https://github.com/snowplow/snowplow-unity-tracker/releases). Once downloaded simply add the `SnowplowTracker.unitypackage` to your project. This should insert all of the required dll files into your `Assets/Plugins/` folder.
