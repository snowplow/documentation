---
title: "Initialization and configuration for the Rust tracker"
sidebar_label: "Initialization and configuration"
date: "2022-10-24"
sidebar_position: 2000
---

The `Snowplow` module provides a single method to initialize and configure a new tracker, the `Snowplow::create_tracker` method. It accepts configuration parameters for the tracker and returns a `Tracker` instance.

```rust
use snowplow_tracker::Subject;
let subject = Subject::builder().language("en-gb").build()?;
let tracker = Snowplow::create_tracker("ns", "app_id", "https://...", Some(subject));
```

The method returns a `Tracker` instance. This can be later used for tracking events, or accessing tracker properties.

The required attributes of the `Snowplow::create_tracker` method are `namespace` used to identify the tracker, `app_id` to identify your app, and the Snowplow collector `endpoint`. Additionally, one can pass in a `Subject` to provide additional context about the application environment.

| Attribute   | Type      | Description                                                                |
| ----------- | --------- | -------------------------------------------------------------------------- |
| `namespace` | `&str`    | Tracker namespace to identify the tracker.                                 |
| `app_id`    | `&str`    | Application identifier.                                                    |
| `endpoint`  | `&str`    | URI for the Snowplow collector endpoint.                                   |
| `subject`   | `Subject` | Subject information about tracked user and device that is added to events. |

## Configuration of subject information: `Subject`

Subject information are persistent and global information about the tracked device or user. They apply to all events and are assigned as event properties.

The configured attributes are mapped to Snowplow event properties described in the [Snowplow Tracker Protocol](/docs/events/index.md). They are mapped as follows:

| Attribute         | Event Property   |
| ----------------- | ---------------- |
| `user_id`         | `uid`            |
| `network_user_id` | `network_userid` |
| `domain_user_id`  | `domain_userid`  |
| `user_agent`      | `useragent`      |
| `ip_address`      | `user_ipaddress` |
| `timezone`        | `os_timezone`    |
| `language`        | `lang`           |

## Configuring the Tracker

If you're looking for more control of your tracker, most components can be configured using their respective builder functions, or created from scratch by implementing the relevant trait.

## Event Store

An event store is defined by the `EventStore` trait. The default event store is the `InMemoryEventStore`. A custom event store can be created by implementing the `EventStore` trait, and passing it to the `BatchEmitter` builder.

### In Memory Event Store

The default event store for the tracker. This event store that keeps events in memory and does not persist them to disk. As `tracker.track` is called, events are added to the event store. When the event store has enough events to create an `EventBatch`, the events will be removed from the store, and sent to the collector.

The default capacity for the `InMemoryEventStore` is 10,000 events, and the default batch size is 50 events. An attempt to add an event to the store when it is full will result in the event being dropped, so choosing the right capacity is important. The capacity and batch size can be configured using the builder, for example, if we wanted to increase the capacity to 100,000 events and the batch size to 75 events:

```rust
let event_store = InMemoryEventStore::builder()
    .capacity(100_000)
    .batch_size(75)
    .build()?;
```

:::warning Events in the `InMemoryEventStore` will be lost if the process is unexpectedly terminated.
:::

## HTTP Client

A HTTP client is defined by the `HttpClient` trait. The default tracker HTTP client is the `ReqwestClient`, but, as with the Event Store, any implementation of the  `HttpClient` trait can be passed to to the `BatchEmitter` builder:

```rust
let custom_http_client = MyCustomHttpClient::new();
let emitter = BatchEmitter::builder()
    .collector_url("http://localhost:9090")
    .http_client(custom_http_client)
    .build()?;
```

:::note This is an async trait. The [async-trait](https://github.com/dtolnay/async-trait) crate is used until async traits are supported in stable Rust.
:::

### Reqwest Client

The default HTTP client for the tracker. This client uses the [`reqwest`](https://github.com/seanmonstar/reqwest) crate to asynchronously send HTTP requests to the collector. The client only supports sending POST requests.

## Emitter

An emitter is defined by the `Emitter` trait, with the default emitter being the `BatchEmitter`. Any implementation of the `Emitter` trait can be passed to `Tracker::new`:

```rust
let custom_emitter = MyCustomEmitter::new();
let mut tracker = Tracker::new("ns", "app_id", custom_emitter, None);
```

### Batch Emitter

The BatchEmitter sends events in batches. This is more efficient than sending event requests singly, as only one set of POST headers is required for a number of events. The event collector receives the request and separates out the individual event payloads. Although the Snowplow Tracker interface is sync, the BatchEmitter uses [Tokio](https://github.com/tokio-rs/tokio) to asynchronously send events to the collector.

#### Retry Behavior

Failed requests are retried with exponentially increasing delays between subsequent retry requests. This ensures that the Collector is not overwhelmed with too many requests and also saves resources on the client by reducing the number of requests during failures. The number of times a request is retried is determined by the Retry Policy.

#### Retry Policy

A retry policy can be passed into the Emitter to define how many times a request should be retried.

The available policies are:

- `RetryForever` A RetryPolicy with no cap on maximum of attempts to send an event to the collector. This policy might appear attractive where it is critical to avoid data loss because it never deliberately drops events. However, it could cause a backlog of events in the buffered queue if the collector is unavailable for too long.
- `MaxAttempts(max: u32)` A RetryPolicy which drops events after failing to contact the collector within a fixed number of attempts. This policy can smooth over short outages of connection to the collector. Events will be dropped only if the collector is unreachable for a relatively long span of time. Dropping events can be a safety mechanism against a growing backlog of unsent events.
- `NoRetry` A RetryPolicy that drops events immediately after a failed attempt to send to the collector.

The default retry policy on the `BatchEmitter` is `RetryPolicy::MaxAttempts(10)`, but can be configured using the builder, for example if we wanted to disable retries:

```rust
let emitter = BatchEmitter::builder()
    .collector_url("http://localhost:9090")
    .retry_policy(RetryPolicy::NoRetry)
    .build()?;
```

#### Safely Stopping the Emitter

The `BatchEmitter` can be safely stopped using the `tracker.close_emitter()` method. This will stop the emitter from accepting new events, and will wait for any in-flight requests to complete before returning. This is useful as the emitter runs in a separate thread, and the main thread needs to wait for the emitter to finish sending events before exiting.
