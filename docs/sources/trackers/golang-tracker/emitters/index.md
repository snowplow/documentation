---
title: "Emitters configuration for the Golang tracker"
sidebar_label: "Emitters"
date: "2020-02-26"
sidebar_position: 50
---

Tracker instances must be initialized with an emitter. This section will go into more depth about the Emitter and how it works under the hood.

The simplest Emitter setup requires only the collector URI to be passed to it:

```go
emitter := sp.InitEmitter(RequireCollectorUri("com.acme"), sp.RequireStorage(*storagememory.Init()))
```

There are other optional builder functions:

| **Function Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `RequireCollectorUri` | The URI to send events to | Yes | `nil` |
| `RequireStorage` | The storage integration to use | Yes | `nil` |
| `OptionRequestType` | The request type to use (GET or POST) | No | `POST` |
| `OptionProtocol` | The protocol to use (http or https) | No | `http` |
| `OptionSendLimit` | The maximum amount of events to send at a time | No | `500` |
| `OptionByteLimitGet` | The byte limit when sending a GET request | No | `40000` |
| `OptionByteLimitPost` | The byte limit when sending a POST request | No | `40000` |
| `OptionCallback` | Defines a custom callback function | No | `nil` |
| `OptionHttpClient` | A custom HTTP client | No | `&Client{}` |

A more complete example:

```go
emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.RequireStorage(*storagememory.Init()),
  sp.OptionRequestType("GET"),
  sp.OptionProtocol("https"),
  sp.OptionSendLimit(50),
  sp.OptionByteLimitGet(52000),
  sp.OptionByteLimitPost(52000),
  sp.OptionCallback(func(g []CallbackResult, b []CallbackResult) {
    log.Println("Successes: " + IntToString(len(g)))
    log.Println("Failures: " + IntToString(len(b)))
  }),
)
```

As of Version 3 of the Tracker you must pass RequireStorage to set the Storage option for the Emitter. Out of the box we support the following:

- **StorageMemory**: A fully in-memory implementation utilising `go-memdb`
- **StorageSQLite3**: A local disk implementation leveraging `go-sqlite3`

You can also define your own Storage system by implementing the `Storage` interface found in `pkg/storage/storageiface`:

```go
type Storage interface {
  AddEventRow(payload Payload) bool
  DeleteAllEventRows() int64
  DeleteEventRows(ids []int) int64
  GetAllEventRows() []EventRow
  GetEventRowsWithinRange(eventRange int) []EventRow
}
```

To use `StorageMemory` the constructor looks like so:

```go
import storagememory "github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/memory"

emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.RequireStorage(*storagememory.Init()),
  sp.OptionRequestType("GET"),
  sp.OptionProtocol("https"),
  sp.OptionSendLimit(50),
  sp.OptionByteLimitGet(52000),
  sp.OptionByteLimitPost(52000),
  sp.OptionCallback(func(g []CallbackResult, b []CallbackResult) {
    log.Println("Successes: " + IntToString(len(g)))
    log.Println("Failures: " + IntToString(len(b)))
  }),
)
```

To leverage `StorageSQLite3`:

```go
import storagesqlite3 "github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/sqlite3"

emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.RequireStorage(*storagesqlite3.Init("dbname_path.db")),
  sp.OptionRequestType("GET"),
  sp.OptionProtocol("https"),
  sp.OptionSendLimit(50),
  sp.OptionByteLimitGet(52000),
  sp.OptionByteLimitPost(52000),
  sp.OptionCallback(func(g []CallbackResult, b []CallbackResult) {
    log.Println("Successes: " + IntToString(len(g)))
    log.Println("Failures: " + IntToString(len(b)))
  }),
)
```

### Under the hood

Once the emitter receives an event from the Tracker a few things start to happen:

- The event is added to the storage implementation (either `memory` or `sqlite3`)
- A long running go routine is started which will continue to send events as long as they can be found in the database (asynchronous)
- The emitter loop will grab a range of events from the database up until the `SendLimit` as noted __above_
- The emitter will send all of these events as determined by the Request, Protocol and ByteLimits
    - Each request is sent in its own go routine.
- Once sent it will process the results of all the requests sent and will remove all successfully sent events from the database

**IF** all of the requests failed this loop is terminated eagerly; this is seen as a network failure so attempting to send is a waste of resources. **IF** there are no more events in the database the loop is terminated.

### Builder methods

#### `OptionHttpClient`

An HTTP client can be set with custom settings appropriate for the use-case, such as timeouts and other connection settings.

This method accepts a reference to [http.Client](https://golang.org/pkg/net/http/#Client).
