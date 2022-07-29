---
title: "Initialisation"
date: "2020-02-25"
sidebar_position: 20
---

Assuming you have completed the [Actionscript 3 Tracker Setup](/docs/migrated/collecting-data/collecting-from-own-applications/actionscript3-tracker/setup/) for your project, you are now ready to initialize the AS3 Tracker.

### Importing the module

Import the AS3 Tracker's classes into your AS3 code like so:

```java
import com.snowplowanalytics.snowplow.tracker.*;
import com.snowplowanalytics.snowplow.tracker.emitter.*;
import com.snowplowanalytics.snowplow.tracker.payload.*;
```

That's it - you are now ready to initialize a Tracker instance.

### Creating a Tracker

To instantiate a tracker in your code simply instantiate the `Tracker` interface:

```java
Tracker(emitter:Emitter, namespace:String, appId:String, subject:Subject, stage:Stage = null, base64Encoded:Boolean = true)
```

For example:

```java
var t1:Tracker = new Tracker(emitter, "AF003", "cf", user1Subject, this.stage, true);
```

| **Argument Name** | **Description** | **Required?** |
| --- | --- | --- |
| `emitter` | The Emitter object you create | Yes |
| `namespace` | The name of the Tracker instance | Yes |
| `appId` | The application ID | Yes |
| `subject` | The Subject that defines a user | No (default null) |
| `stage` | The stage property of a DisplayObject | No (Default null) |
| `base64Encoded` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No (Default true) |

#### `emitter`

The emitter to which the tracker will send events. See [Emitters](https://github.com/snowplow/snowplow/wiki/ActionScript3-Tracker#5-sending-event-emitter) for more on emitter configuration.

#### `subject`

The user which the Tracker will track. This should be an instance of the [Subject](https://github.com/snowplow/snowplow/wiki/ActionScript3-Tracker#3-adding-extra-data-the-subject-class) class. You don't need to set this during Tracker construction; you can use the `Tracker.setSubject` method afterwards. In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

#### `namespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### `appId`

The `appId` argument lets you set the application ID to any string.

#### `base64Encoded`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `base64Encoded` argument.

### Change the tracker's platform with `setPlatform`

You can change the platform by calling:

```java
tracker.setPlatform("cnsl");
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](https://github.com/snowplow/snowplow/wiki/Snowplow-Tracker-Protocol).
