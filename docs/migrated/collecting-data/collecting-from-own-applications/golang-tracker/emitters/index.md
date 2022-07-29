---
title: "Emitters"
date: "2020-02-26"
sidebar_position: 50
---

Tracker instances must be initialized with an emitter. This section will go into more depth about the Emitter and how it works under the hood.

The simplest Emitter setup requires only the collector URI to be passed to it:

```go
emitter := sp.InitEmitter(RequireCollectorUri("com.acme"))
```

There are other optional builder functions:

| **Function Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `RequireCollectorUri` | The URI to send events to | Yes | `nil` |
| `OptionRequestType` | The request type to use (GET or POST) | No | `POST` |
| `OptionProtocol` | The protocol to use (http or https) | No | `http` |
| `OptionSendLimit` | The maximum amount of events to send at a time | No | `500` |
| `OptionByteLimitGet` | The byte limit when sending a GET request | No | `40000` |
| `OptionByteLimitPost` | The byte limit when sending a POST request | No | `40000` |
| `OptionDbName` | Defines the path and file name of the database | No | `events.db` |
| `OptionStorage` | Use a custom Storage target | No | `nil` |
| `OptionCallback` | Defines a custom callback function | No | `nil` |
| `OptionHttpClient` | A custom HTTP client | No | `&Client{}` |

A more complete example:

```go
emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.OptionRequestType("GET"),
  sp.OptionProtocol("https"),
  sp.OptionSendLimit(50),
  sp.OptionByteLimitGet(52000),
  sp.OptionByteLimitPost(52000),
  sp.OptionDbName("/home/vagrant/test.db"),
  sp.OptionCallback(func(g []CallbackResult, b []CallbackResult)) {
    log.Println("Successes: " + IntToString(len(g)))
    log.Println("Failures: " + IntToString(len(b)))
  }),
)
```

**Note**: The OptionDbName must be a valid path on your host file system (that can be created with the current user). By default it will create the required files wherever the application is being run from.

As of Version 2 of the Tracker you can now also use OptionStorage to pass in different Storage options for the Emitter. Out of the box we now support the following:

- **StorageMemory**: A fully in-memory implementation utilising `go-memdb`
- **StorageSQLite3**: The default option that is used and which is configured by default with the `OptionDbName` argument

You can also define your own Storage system by implementing the `Storage` interface:

```go
type Storage interface {
  AddEventRow(payload Payload) bool
  DeleteAllEventRows() int64
  DeleteEventRows(ids []int) int64
  GetAllEventRows() []EventRow
  GetEventRowsWithinRange(eventRange int) []EventRow
}
```

To use `StorageMemory` instead the constructor likes like so:

```go
storage := sp.InitStorageMemory()
emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.OptionRequestType("GET"),
  sp.OptionProtocol("https"),
  sp.OptionSendLimit(50),
  sp.OptionByteLimitGet(52000),
  sp.OptionByteLimitPost(52000),
  sp.OptionStorage(storage),
  sp.OptionCallback(func(g []CallbackResult, b []CallbackResult)) {
    log.Println("Successes: " + IntToString(len(g)))
    log.Println("Failures: " + IntToString(len(b)))
  }),
)
```

### Under the hood

Once the emitter receives an event from the Tracker a few things start to happen:

- The event is added to a local Sqlite3 database (blocking execution)
- A long running go routine is started which will continue to send events as long as they can be found in the database (asynchronous)
- The emitter loop will grab a range of events from the database up until the `SendLimit` as noted \__above_
- The emitter will send all of these events as determined by the Request, Protocol and ByteLimits
    - Each request is sent in its own go routine.
- Once sent it will process the results of all the requests sent and will remove all successfully sent events from the database

**IF** all of the requests failed this loop is terminated eagerly; this is seen as a network failure so attempting to send is a waste of resources. **IF** there are no more events in the database the loop is terminated.

### [](https://github.com/snowplow/snowplow/wiki/Golang-tracker#52-builder-methods)5.2 Builder methods

#### [](https://github.com/snowplow/snowplow/wiki/Golang-tracker#521-optionhttpclient)5.2.1 `OptionHttpClient`

An HTTP client can be set with custom settings appropriate for the use-case, such as timeouts and other connection settings.

This method accepts a reference to [http.Client](https://golang.org/pkg/net/http/#Client).
