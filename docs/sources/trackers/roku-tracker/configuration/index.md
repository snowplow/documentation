---
title: "Configuring how events are sent"
description: "Configure Roku tracker settings for optimal behavioral event collection in streaming applications."
schema: "TechArticle"
keywords: ["Roku Configuration", "Roku Setup", "TV Configuration", "Roku Analytics", "OTT Setup", "Connected TV"]
date: "2021-11-16"
sidebar_position: 4000
---

When you initialize your tracker (using the `init` method), you will need to provide its network configuration as an associative array under the `network` property. The configuration consists of the collector endpoint and HTTP method type (see below table).

Example:

```brightscript
m.global.snowplow.init = {
    network: {
        collector: "http://...",
        method: "POST"
    }
}
```

Properties of the network configuration:

| Network configuration parameter | Description |
| --- | --- |
| `collector` | URI for the Snowplow collector endpoint. |
| `method` | HTTP method to use. `GET` and `POST` methods are supported. |
| `serverAnonymous` | Enable the `SP-Anonymous` header for server anonymization. |

## Tracker namespaces

You may initialize multiple trackers, each with a different namespace. In this way, you can send events to multiple Snowplow collectors from your application. An example scenario for this would be sending events to both a staging and production pipeline. Each tracker processes events in its own background thread.

To initialize a tracker with a custom namespace, set the `namespace` property in the associative array passed to the `init` method. When no namespace is given, a default namespace is assigned to the tracker. Reinitializing trackers with the same namespace results in updating the configuration for the already initialized trackers. The following example initializes a tracker with the namespace "ns1":

```brightscript
m.global.snowplow.init = {
    namespace: "ns1",
    network: { ... }
}
```

Trackers can be individually addressed using their namespaces when tracking events. To send events to a specific tracker, call its namespace as follows: `m.global.snowplow.trackerNamespace.structured = {...}`. Here is an example of tracking a screen view event using a tracker with the namespace "ns1":

```brightscript
m.global.snowplow.ns1.screenView = {
    id: "screen23",
    name: "HUD > Save Game"
}
```

To track events with all initialized trackers, simply call methods to track events on the Snowplow instance without specifying a tracker namespace. The following example tracks a screen view event using all initialized trackers:

```brightscript
m.global.snowplow.screenView = {
    id: "screen23",
    name: "HUD > Save Game"
}
```

## Logging

The package makes use of [roku-log](https://github.com/georgejecook/roku-log), a logging framework for Roku Scenegraph apps. roku-log enables configuring the logging output and setting log levels for the severity of the output. Under the `debug` log level, the tracker outputs information about each request. On the other hand, setting the log level to `error` will only output crashes and tracking errors. Please refer to the roku-log [instructions](https://github.com/georgejecook/roku-log) to learn about setting it up.
