---
title: "Configuring emitters in the Unity tracker"
sidebar_label: "Emitter"
date: "2020-02-26"
sidebar_position: 50
---

The Emitter object is responsible for sending and storing all events.

We provide the following emitters available currently:

- `SyncEmitter` : Slow blocking synchronous operation, useful for testing but should not be used in production.
- `AsyncEmitter` : Fully asynchronous operation which uses the ThreadPool to perform all of its operations.
- `WebGlEmitter` : Emitter implementing the async API that is compatible with WebGL.

### Constructor

| **Argument Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `endpoint` | The collector uri the emitter should use | Yes | Null |
| `protocol` | The request Protocol (HTTP or HTTPS) | No | HTTP |
| `method` | The HTTP Method (GET or POST) | No | POST |
| `sendLimit` | The amount of events to send at a time | No | 500 (AsyncEmitter) / 10 (SyncEmitter) / 1 (WebGlEmitter) |
| `byteLimitGet` | The byte limit for a GET request | No | 52000 |
| `byteLimitPost` | The byte limit for a POST request | No | 52000 |
| `eventStore` | Implementation for storing queued events waiting to be sent | No | `InMemoryEventStore` on tvOS, otherwise `EventStore` (on-disk [LiteDB](https://www.litedb.org/)) |

A full Emitter construction should look like the following:

```csharp
IEmitter e1 = new AsyncEmitter ("com.collector.acme", HttpProtocol.HTTPS, HttpMethod.GET, 50, 30000, 30000, null);
```

All except `eventStore` of these variables can be altered after creation with the accompanying `emitter.SetXXX()` function. However do be aware that multiple threads will be accessing these variables so to be safe always shut the Tracker down using `StopEventTracking()` before amending anything.

**NOTE:** Be aware that when sending events via `GET` all events will be sent individually. This means that if your `sendLimit` is 500 there is the potential for 500 Threads to be spawned at the same time which can cause serious performance issues. To alleviate this concern simply drop your `sendLimit` to a more manageable range.

Some load balancers limit the maximum URL length accepted for `GET` requests, often around 16KB.
The default of 52000 bytes is considerably larger than these limits, but most single event payloads will not reach this size.
