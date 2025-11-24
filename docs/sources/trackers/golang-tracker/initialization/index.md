---
title: "Initializing the Golang tracker"
sidebar_label: "Initialization"
date: "2020-02-26"
sidebar_position: 20
---

### Import the library

Import the Golang Tracker library like so:

```go
import "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```

You will need to refer to the package as `tracker`. If you wish to use something shorter (or if `tracker` is already taken):

```go
import sp "github.com/snowplow/snowplow-golang-tracker/v3/tracker"
```

The package can now be referred to as `sp` rather than `tracker`.

You will also need to import a `storage` implementation for the `emitter` - you can select from two that we have created or implement your own following the supplied interface.

The `in-memory` or `SQLite3` implementations can be pulled from the following packages:

```go
import storagememory "github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/memory" // Maps to tracker.InitStorageMemory() in v2

OR

import storagesqlite3 "github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/sqlite3" // Maps to tracker.InitStorageSQLite3(<dbname>) in v2
```

The `Storage` interface can be found in `github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/storageiface`.

That's it - you are now ready to initialize a tracker instance.

### Creating a tracker

The simplest tracker initialization only requires you to provide the URI of the collector to which the tracker will log events and a storage implementation:

```go
import storagememory "github.com/snowplow/snowplow-golang-tracker/v3/pkg/storage/memory"
import sp "github.com/snowplow/snowplow-golang-tracker/v3/tracker"

emitter := sp.InitEmitter(sp.RequireCollectorUri("com.acme"), sp.RequireStorage(*storagememory.Init()))
tracker := sp.InitTracker(sp.RequireEmitter(emitter))
```

There are other optional builder functions:

| **Function Name** | **Description** | **Required?** | **Default** |
| --- | --- | --- | --- |
| `RequireEmitter` | The emitter to which events are sent | Yes | `nil` |
| `OptionSubject` | The user being tracked | No | `nil` |
| `OptionNamespace` | The name of the tracker instance | No | \`\` |
| `OptionAppId` | The application ID | No | \`\` |
| `OptionPlatform` | The platform the Tracker is running on | No | `srv` |
| `OptionBase64Encode` | Whether to enable [base 64 encoding](https://en.wikipedia.org/wiki/Base64) | No | `true` |

A more complete example:

```go
subject := sp.InitSubject()
emitter := sp.InitEmitter(
  sp.RequireCollectorUri("com.acme"),
  sp.RequireStorage(*storagememory.Init()),
)
tracker := sp.InitTracker(
  sp.RequireEmitter(emitter),
  sp.OptionSubject(subject),
  sp.OptionNamespace("namespace"),
  sp.OptionAppId("app-id"),
  sp.OptionPlatform("mob"),
  sp.OptionBase64Encode(false),
)
```

#### `RequireEmitter`

Accepts an argument of an Emitter instance pointer; if the object is `nil` will `panic`. See Emitters for more on emitter configuration.

#### `OptionSubject`

The user which the Tracker will track. Accepts an argument of a Subject instance pointer.

You don't need to set this during Tracker construction; you can use the `tracker.SetSubject()` method afterwards. In fact, you don't need to create a subject at all. If you don't, though, your events won't contain user-specific data such as timezone and language.

#### `OptionNamespace`

If provided, the `namespace` argument will be attached to every event fired by the new tracker. This allows you to later identify which tracker fired which event if you have multiple trackers running.

#### `OptionAppId`

The `appId` argument lets you set the application ID to any string.

#### `OptionPlatform`

By default we assume the Tracker will be running in a server environment. To override this provide your own platform string.

#### `OptionBase64Encode`

By default, unstructured events and custom contexts are encoded into Base64 to ensure that no data is lost or corrupted. You can turn encoding on or off using the Boolean `OptionBase64Encode` function with either `true` or `false` passed in.
