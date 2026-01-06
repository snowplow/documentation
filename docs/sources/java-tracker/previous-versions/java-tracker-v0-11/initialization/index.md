---
title: "Initialization"
date: "2022-05-12"
sidebar_position: 20
---

Assuming you have completed the Java Tracker Setup for your project, you are now ready to initialize the Java Tracker.

### Importing the module

Import the Java Tracker's classes into your Java code like so:

```java
import com.snowplowanalytics.snowplow.tracker.*;
import com.snowplowanalytics.snowplow.tracker.emitter.*;
import com.snowplowanalytics.snowplow.tracker.http.*;
```

That's it - you are now ready to initialize a Tracker instance.

### Creating a Tracker

To instantiate a tracker in your code (can be global or local to the process being tracked) simply instantiate the `Tracker` interface with the following builder patterm:

```java
Tracker.TrackerBuilder(Emitter : emitter, String : namespace, String : appId)
  .subject(Subject)
  .base64(boolean)
  .platform(enum DevicePlatforms)
  .build();
```

For example:

```java
Tracker tracker = new Tracker.TrackerBuilder(emitter, "AF003", "cf")
                    .subject(user1Subject)
                    .base64(true)
                    .platform(DevicePlatform.Desktop)
                    .build();
```

| **Argument Name** | **Description**                                                            | **Required?** | **Default**   |
|-------------------|----------------------------------------------------------------------------|---------------|---------------|
| `emitter`         | The Emitter object you create                                              | Yes           | Null          |
| `namespace`       | The name of the tracker instance                                           | Yes           | Null          |
| `appId`           | The application ID                                                         | Yes           | Null          |
| `subject`         | The subject that defines a user                                            | No            | Null          |
| `base64`          | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No            | True          |
| `platform`        | The device the Tracker is running on                                       | No            | ServerSideApp |

#### `emitter`

The emitter to which the tracker will send events. See [Emitters](/docs/sources/java-tracker/configuring-how-events-are-sent/index.md) for more on emitter configuration.

To attach a new Emitter to the Tracker:

```java
Emitter emitter = BatchEmitter.builder()
        .url(collectorEndpoint)
        .bufferSize(5) 
        .build();

Tracker tracker = new Tracker.TrackerBuilder(emitter, "AF003", "sp")
                    .base64(true)
                    .build();
```

#### `subject`

The user which the Tracker will track. This should be an instance of the Subject class. You don't need to set this during Tracker construction; you can also include a Subject object with the actual event; this will override the Tracker attached subject.

In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

To attach a new Subject to the Tracker:

```java
Subject subject = SubjectBuilder.builder()
    .userId("e2479592-4e9a-4d75-948c-7c02d2f718df")
    .build();

Tracker tracker = new Tracker.TrackerBuilder(emitter, "AF003", "sp")
                    .subject(subject)
                    .base64(true)
                    .platform(DevicePlatform.Desktop)
                    .build();
```

For a full list of supported platforms, please see the [Snowplow Tracker Protocol](/docs/events/index.md#common-parameters).
