---
title: "Configuring a tracker with the .NET tracker"
sidebar_label: "Tracker"
date: "2020-02-26"
sidebar_position: 30
---

The Tracker object is responsible for co-ordinating the saving and sending of events as well as managing the optional Session object.

## Constructor

| **Argument Name**            | **Description**                                                          | **Required?** | **Default** |
| ---------------------------- | ------------------------------------------------------------------------ | ------------- | ----------- |
| `emitter`                    | The Emitter object you create                                            | Yes           | Null        |
| `subject`                    | The Subject that defines a user                                          | No            | Null        |
| `clientSession`              | The Session object you create                                            | No            | Null        |
| `trackerNamespace`           | The name of the tracker instance                                         | No            | Null        |
| `appId`                      | The application ID                                                       | No            | Null        |
| `base64Encoded`              | If we [base 64 encode](https://en.wikipedia.org/wiki/Base64) json values | No            | True        |
| `synchronous`                | If loading into storage is done in sync                                  | No            | True        |
| `desktopContextDelegate`     | Function to get the desktop context                                      | No            | Null        |
| `mobileContextDelegate`      | Function to get the mobile context                                       | No            | Null        |
| `geoLocationContextDelegate` | Function to get the geo-location context                                 | No            | Null        |
| `logger`                     | The logger to use within the application                                 | No            | Null        |

A full Tracker construction should look like the following:

```csharp
var logger = new ConsoleLogger();
var endpoint = new SnowplowHttpCollectorEndpoint(emitterUri, method: method, port: port, protocol: protocol, l: logger);
var storage = new LiteDBStorage("events.db");
var queue = new PersistentBlockingQueue(storage, new PayloadToJsonString());
var emitter = new AsyncEmitter(endpoint, queue, l: logger);
var subject = new Subject().SetPlatform(Platform.Mob).SetLang("EN");
var session = new ClientSession("client_session.dict", l: logger);

Tracker.Instance.Start(emitter: emitter, subject: subject, clientSession: session, trackerNamespace: "some namespace", appId: "some appid", encodeBase64: true, l: logger);
```

The `Tracker.Start(...)` and `Tracker.Stop()` methods take full responsibility for starting and stopping the threads required for processing everything asynchronously. **Do not** use any other `Start` and `Stop` functions other than the ones directly for the Tracker to prevent unknown behaviors.

**WARNING**: The `LiteDBStorage` object must be disposed of manually after stopping the Tracker so you will need to maintain a reference to this object.

**NOTE**: The `Subject` variables can all be altered directly from the Tracker via replicated setter methods.

## Functions

The Tracker contains several critical functions that must be used to start Tracking.

### `Start(...)`

This function must be called before any events will start being stored or sent. This is due to the fact that we do not want to start any background processing from the constructors so it is left up to the developer to choose when to start everything up.

If you attempt to access the Tracker singleton before Starting it an exception will be thrown.

This function:

- Starts the background emitter thread
- Starts the background session check timer (Optional)

Once this is run everything should be in place for asynchronous event tracking.

### `Stop()`

If you need to halt the Tracker from tracking events you can run this function. This will bring all event processing, sending and collection to a halt and nothing will be started again until `Start(...)` is fired again.

**WARNING**: If you are using Client Sessionization stopping and then restarting the Tracker will result in the session index incrementing.

### `Track(IEvent, Subject)`

This is the function used for Tracking all events.

```csharp
Tracker.Instance.Track(IEvent newEvent, Subject eventSubject = null);
```
