---
title: "Emitter"
sidebar_label: "Emitter"
date: "2022-05-12"
sidebar_position: 80
description: "Configure event sending with SimpleEmitter and BatchEmitter classes in Java tracker v0.11."
keywords: ["emitter configuration", "http client adapter"]
---

Events are sent using an `Emitter` class. You can initialize a class using a variety of builder functions.

Here are the Emitter builder functions that can be used to make either a `SimpleEmitter` or `BatchEmitter`:

```java
// Simple (GET) Emitter
Emitter simple = SimpleEmitter.builder()
        .httpClientAdapter( {{ An Adapter }} ) // Required
        .threadCount(20) // Default is 50
        .requestCallback( {{ A callback }} ) // Default is Null
        .requestExecutorService( {{ An ExecutorService }} ) // Default is Executors.newScheduledThreadPool
        .build();

// Batch (POST) Emitter
Emitter batch = BatchEmitter.builder()
        .httpClientAdapter( {{ An Adapter }} ) // Required
        .bufferSize(20)  // Default is 50
        .threadCount(20) // Default is 50
        .requestCallback( {{ A callback }} ) // Default is Null
        .requestExecutorService( {{ An ExecutorService }} ) // Default is Executors.newScheduledThreadPool
        .build();
```

| **Function Name**        | **Description**                                                           | **Required?** |
|--------------------------|---------------------------------------------------------------------------|---------------|
| `httpClientAdapter`      | The `HttpClientAdapter` to use for all event sending                      | Yes           |
| `bufferSize`             | BatchEmitter Only: Specifies how many events go into a POST               | No            |
| `threadCount`            | The count of Threads that can be used to send events                      | No            |
| `requestCallback`        | Lets you pass a callback class to handle succes/failure in sending events | No            |
| `requestExecutorService` | Lets you choose an ExecutorService for thread pool creation               | No            |

### `HttpClientAdapters`

We currently offer two different Http Clients that can be used to send events to our collectors. Once created they need to be attached to the emitter in the `httpClientAdapter` builder argument.

| **Function Name** | **Description**                                  | **Required?** |
|-------------------|--------------------------------------------------|---------------|
| `url`             | The URL of the collector to send events to       | Yes           |
| `httpClient`      | The http client to use (either OkHttp or Apache) | Yes           |

### `OkHttpClientAdapter`

You build an `OkHttpClientAdapter` like so:

```java
// Make a new client
OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(5, TimeUnit.SECONDS)
      .writeTimeout(5, TimeUnit.SECONDS)
      .build();

// Build the adapter
HttpClientAdapter adapter = OkHttpClientAdapter.builder()
      .url("http://www.acme.com")
      .httpClient(client)
      .build();
```

### `ApacheHttpClientAdapter`

You build an `ApacheHttpClientAdapter` like so:

```java
// Make a new client with custom concurrency rules
PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager();
manager.setDefaultMaxPerRoute(50);

// Make the client
CloseableHttpClient client = HttpClients.custom()
      .setConnectionManager(manager)
      .build();

// Build the adapter
HttpClientAdapter adapter = ApacheHttpClientAdapter.builder()
      .url("http://www.acme.com")
      .httpClient(client)
      .build();
```

**NOTE**: it is encouraged to research how best you want to setup your `ApacheClient` for maximum performance. By default the Apache Client will never timeout and will also allow only two outbound connections at a time. We have used a `PoolingHttpClientConnectionManager` here to override that setting to allow up to 50 concurrent outbound connections.

### 5.2 Using a buffer

**NOTE**: Only applies to the `BatchEmitter`

A buffer is used to group events together in bulk before sending them. This is especially handy to reduce network usage. By default, the Emitter buffers up to 50 events before sending them. You can change this to send events instantly as soon as they are created like so:

```java
Emitter batch = BatchEmitter.builder()
        .httpClientAdapter( ... )
        .build();

batch.setBufferSize(1)
```

The buffer size must be an integer greater than or equal to 1.

### Choosing the HTTP method

Choosing to send via GET or POST is as easy as building a particular type of Emitter. If you want to send via GET then you will need to build a `SimpleEmitter`. For sending via POST you will need to build a `BatchEmitter`.

### Threads

The Thread Count is the size of the available Thread Pool that events can be sent on. The bigger the Pool of Threads the faster events can be sent. By default we use up to 50 Threads for sending but this can be altered up or down depending on many events you are sending. As well as how strong a computer the Tracker is running on.

Since Java tracker v0.11, the threads have informative naming to help with debugging. Threads in the Emitter thread pool are named `snowplow-emitter-BufferConsumer-thread-{{thread number}}`. The Emitter request thread is named `snowplow-emitter-pool-1-request-thread-1`.

### Emitter callback

If an event fails to send because of a network issue, you can choose to handle the failure case with a callback class to react accordingly. The callback class needs to implement the `RequestCallback` interface in order to do so. Here is a sample bit of code to show how it could work:

```java
// Make a RequestCallback
RequestCallback callback = new RequestCallback() {
  @Override
  public void onSuccess(int successCount) {
    System.out.println("Success, successCount: " + successCount);
  }

  @Override
  public void onFailure(int successCount, List<Event> failedEvents) {
    System.out.println("Failure, successCount: " + successCount + "\nfailedEvent:\n" + failedEvents.toString());
  }
};

// Attach it to an Emitter
Emitter e1 = BatchEmitter.builder()
        .httpClientAdapter( ... )
        .requestCallback(callback)
        .build();
```

In the example, we can see an in-line example of handling the case. If events are all successfully sent, the `onSuccess` method returns the number of successful events sent. If there were any failures, the `onFailure` method returns the successful events sent (if any) and a _list of events_ that failed to be sent (i.e. the HTTP state code did not return 200).

A common pattern here could be to re-send all failed events if they occur. It is up to the developer to determine whether they want to wait a certain amount of time before re-sending or if they want to re-send at all.

```java
// Example on-failure function with re-tracking
RequestCallback callback = new RequestCallback() {
  @Override
  public void onSuccess(int successCount) {
    System.out.println("Success, successCount: " + successCount);
  }

  @Override
  public void onFailure(int successCount, List<Event> failedEvents) {
    System.out.println("Failure, successCount: " + successCount + "\nfailedEvent:\n" + failedEvents.toString());

    // Re-send each event
    for (TrackerPayload payload : failedEvents) {
      tracker.tracker(payload);
    }
  }
};
```
