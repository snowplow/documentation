---
title: "Emitters"
date: "2020-02-25"
sidebar_position: 60
---

Emitters are responsible for sending events to the collector. Each tracker is given a single emitter. Once the emitter receives an event from the Tracker a few things start to happen:

- The event is added to a local SQLite3 database or custom event store (blocking execution).
- A long running daemon thread is started which will continue to send events as long as they can be found in the database (asynchronous).
- The emitter loop will grab a range of events from the database up until the `batch_size` passed to it as configuration.
- The emitter will send all of these events as determined by the Request, Protocol and ByteLimits.
    - Each request is sent in its thread.
- Once sent, it will process the results of all the requests sent and will remove all successfully sent events from the database. If the request failed, the events will be retried after a retry delay (see below).

In [Initialisation](/docs/collecting-data/collecting-from-own-applications/c-tracker/initialisation/index.md), we discussed how to create a tracker with an emitter configured using `EmitterConfiguration` or by instantiating an `Emitter` instance directly. Both of these options provide the same configuration functionality (e.g., storage options, byte limits, setting custom HTTP clients) that were discussed previously. This page will go into more detail on some of the configurable emitter properties.

## Event store

The event store is used to store an event queue with events scheduled to be sent. Events are added to the event store when they are tracked and removed when they are successfuly emitted or when emitting fails without any scheduled retries.

The tracker provides the `SqliteStorage` class that can be used as the event store. It uses SQLite to store the event queue. By default it will create the required files wherever the application is being run from.

You may also provide a custom event store implementation. To do so, define a class that inherits from the `EventStore` struct:

```
struct EventStore {
  virtual void add_event(const Payload &payload) = 0;
  virtual void get_event_rows_batch(list<EventRow> *event_list, int number_to_get) = 0;
  virtual void delete_event_rows_with_ids(const list<int> &id_list) = 0;
};
```

The `EventStore` struct defines functions to insert, retrieve, and remove events from the queue. Events are represented using their `Payload` instance which is persisted in a `EventRow` wrapper that also assigns IDs to each stored event (these event row IDs are different from event IDs used in the event payloads). There are three supported operations:

| Function | Description |
| --- | --- |
| `add_event` | Insert event payload into event queue. |
| `get_event_rows_batch` | Retrieve event rows from event queue up to the given limit. |
| `delete_event_rows_with_ids` | Remove event rows with the given event row IDs. |

## Emitter request callback

The emitter enables you to set a callback function to be called after events are attempted to be sent to the Collector. This callback is fired after HTTP requests are made and you can subscribe for specific emit statuses. The following statuses can be subscribed to:

- `EmitStatus::SUCCESS` – events were successfuly sent to the Collector.
- `EmitStatus::FAILED_WILL_RETRY` – events failed to be sent to the Collector but will be retried later.
- `EmitStatus::FAILED_WONT_RETRY` – events failed to be sent to the Collector and won't be retried later (they will be dropped).

The callback is given two arguments – list of event IDs, and their emit status. You can only set one callback at once but you can subscribe to multiple emit statuses using binary operations. The following example shows how to set a callback that is called for all three emit statuses and prints to standard output.

```
emitter_configuration.set_request_callback(
    [](list<string> event_ids, EmitStatus emit_status) {
      switch (emit_status) {
      case EmitStatus::SUCCESS:
        printf("Successfuly sent %lu events.\n", event_ids.size());
        break;
      case EmitStatus::FAILED_WILL_RETRY:
        printf("Failed to send %lu events, but will retry.\n", event_ids.size());
        break;
      case EmitStatus::FAILED_WONT_RETRY:
        printf("Failed to send %lu events and won't retry.\n", event_ids.size());
        break;
      }
    },
    EmitStatus::SUCCESS | EmitStatus::FAILED_WILL_RETRY | EmitStatus::FAILED_WONT_RETRY);
```

The callback is executed in a new thread. The `set_request_callback` function can't be called when the Emitter is running.

## HTTP request retry behavior

The Emitter has a retry functionality that repeatedly sends the same events to the Collector in case HTTP requests fail to get through. Requests are retried in case the connection to the Collector fails to be estabilished. They are also retried for all 3xx and 5xx HTTP status codes in server response and most 4xx status codes with the following exceptions – 400, 401, 403, 410, and 422. These status codes signal a rejection of the events being sent to the Collector and, therefore, the events in the requests are dropped and not sent again.

The `Emitter` and `EmitterConfiguration` provide an option to set custom retry behavior for 3xx, 4xx and 5xx HTTP status codes. You can call the `set_retry_for_status_code` function on the `Emitter` or `EmitterConfiguration` instance to define whether to retry or not for a given HTTP status code. Here is an example that overrides the default behavior and enables retries on 422 status code:

```
emitter_configuration.set_retry_for_status_code(422, true);
```

## Request retry delay (back-off)

Failed requests are retried with exponentially increasing delays between subsequent retry requests. This ensures that the Collector is not overwhelmed with too many requests and also saves resources on the client by reducing the number of requests during failures.

The retry delay calculation is an exponential function with multiplicative factor 2. To prevent spikes of traffic, small amount of randomness is added to the delay (at most 10% of the total value). Finally, it is limited to be no larger than around 2 minutes. The following is a sample sequence of the retry delays given 5 failed requests: 0.101s, 0.198s, 0.404s, 0.791s, 1.603s.

## Manual flushing

You may want to force an emitter to send all events in its buffer, even if the buffer is not full. The Tracker class has a `flush()` method which flushes its emitter.

Example:

```
tracker->flush();
```

## Using a custom HTTP Client

You may optionally configure the HTTP client to be used to make HTTP requests to the collector. This is done by passing a unique pointer to a class inheriting from `HttpClient` that the Emitter will take ownership of. If not configured, the Emitter will use the built-in `HttpClientWindows` on Windows, `HttpClientApple` on Apple operating systems, and `HttpClientCurl` on other Unix systems.
