---
title: "Configuring emitters in the .NET tracker"
sidebar_label: "Emitter"
date: "2020-02-26"
sidebar_position: 40
---

These instructions are for Snowplow.Tracker (.NET Standard) or Snowplow.Tracker.PlatformExtensions (PCL).

The Emitter object is responsible for sending and storing all events.

We have one emitter available currently:

- `AsyncEmitter` : Fully asynchronous operation which uses threads to perform all of its operations.

The Emitter depends on four other objects being built:

- `IEndpoint`
- `IStorage`
- `IPersistentBlockingQueue`
- `IPayloadToString`

## Emitter Constructor

| **Argument Name**    | **Description**                                                                   | **Required?** | **Default** |
| -------------------- | --------------------------------------------------------------------------------- | ------------- | ----------- |
| `endpoint`           | The endpoint object configured for sending events                                 | Yes           | Null        |
| `queue`              | The queue to be used to push and pop events from                                  | Yes           | Null        |
| `sendLimit`          | The amount of events to get from the queue at a time                              | No            | 100         |
| `stopPollIntervalMs` | The amount of time to wait before checking for more events                        | No            | 300         |
| `sendSuccessMethod`  | An optional callback function which will report event success and failure counts  | No            | Null        |
| `deviceOnlineMethod` | An optional delegate function which will be used to check if the device is online | No            | Null        |
| `logger`             | The logger to use within the application                                          | No            | Null        |

A full Emitter construction should look like the following:

```csharp
var endpoint = new SnowplowHttpCollectorEndpoint(emitterUri, method: method, port: port, protocol: protocol, l: logger);
var storage = new LiteDBStorage("events.db");
var queue = new PersistentBlockingQueue(storage, new PayloadToJsonString());

AsyncEmitter emitter = new AsyncEmitter(endpoint, queue, l: logger);
```

**NOTE**: The send limit can impact performance greatly as it determines how often we need to perform I/O to the disk and how big the POSTed event batches can be.

**WARNING**: If you are sending events via GET note that each event is sent as its own task, so this has the potential to launch 100 outbound tasks in parallel. It is recommended to lower this range if using GET to 10-15 as a maximum.

## Endpoint Constructor

This is a container for information about how to reach your collector.

| **Argument Name** | **Description**                                        | **Required?** | **Default**       |
| ----------------- | ------------------------------------------------------ | ------------- | ----------------- |
| `host`            | The collector uri to send events to                    | Yes           | Null              |
| `protocol`        | The protocol to use when sending events (HTTP / HTTPs) | No            | HttpProtocol.HTTP |
| `port`            | If the collector is not on port 80                     | No            | Null              |
| `method`          | The method to use when sending (GET / POST)            | No            | HttpMethod.GET    |
| `postMethod`      | Custom method for sending events via POST              | No            | Null              |
| `getMethod`       | Custom method for sending events via GET               | No            | Null              |
| `byteLimitPost`   | Maximum byte limit when sending a POST request         | No            | 40000             |
| `byteLimitGet`    | Maximum byte limit when sending a GET request          | No            | 40000             |
| `logger`          | The logger to use within the application               | No            | Null              |

We have one endpoint available currently:

- `SnowplowHttpCollectorEndpoint`

A full Endpoint construction should look like the following:

```csharp
SnowplowHttpCollectorEndpoint endpoint = new SnowplowHttpCollectorEndpoint("com.acme-collector", protocol: HttpProtocol.HTTPS, method: HttpMethod.GET, l: logger);
```

**NOTE**: If any individual event exceeds the byte limits set then this event will be sent - but it will be assumed to have succeeded. This is to prevent constanstly attempting to send overly large events.

## Storage Constructor

| **Argument Name** | **Description**                             | **Required?** | **Default** |
| ----------------- | ------------------------------------------- | ------------- | ----------- |
| `path`            | The file path to store the database file at | Yes           | Null        |

We have one storage target available currently:

- `LiteDBStorage`

A full Storage construction should look like the following:

```csharp
LiteDBStorage storage = new LiteDBStorage("events.db");
```

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

## Queue Constructor

| **Argument Name** | **Description**                          | **Required?** | **Default** |
| ----------------- | ---------------------------------------- | ------------- | ----------- |
| `storage`         | The storage object to use with the queue | Yes           | Null        |
| `payloadToString` | Serializer for Payload objects           | Yes           | Null        |

We have one queue available currently:

- `PersistentBlockingQueue`

A full queue construction should look like the following:

```csharp
PersistentBlockingQueue queue = new PersistentBlockingQueue(storage, new PayloadToJsonString());
```

## Payload Serializer Constructor

We have one payload serializer available currently:

- `PayloadToJsonString`

A full queue construction should look like the following:

```csharp
PayloadToJsonString serializer = new PayloadToJsonString();
```

This controls how we queue information for internal use.
