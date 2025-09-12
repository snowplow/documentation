---
title: "Configuring how events are sent"
description: "Configure event transmission in Java tracker version 0.12 for behavioral data delivery."
schema: "TechArticle"
keywords: ["Java V0.12", "Legacy Configuration", "Previous Version", "Event Sending", "Deprecated Version", "Legacy Setup"]
date: "2022-03-24"
sidebar_position: 50
---

A user interacts with your app: an event is generated and tracked using `Tracker.track()`. But the event must be sent to your event collector, to enter your pipeline, before it has any value.

The Java tracker allows configuration of the network connection, event sending, and buffering of events. All of these configurations are contained within the `Emitter` class. The default configurations will be sufficient for many Snowplow users.

The default `Emitter` is the `BatchEmitter`, which sends events asynchronously in batches using POST requests. The other built-in Emitter, `SimpleEmitter`, was deprecated in version 0.12. If you need to send events synchronously, or with GET requests, we have provided an `Emitter` interface so you can create your own.

The simplest `BatchEmitter` initialisation looks like this:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .build();
```

Only the `url` property is required. The URL path for your collector endpoint should include the protocol, "http" or "https". The Java tracker is able to send events to either. See the API docs for the full [BatchEmitter.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/emitter/BatchEmitter.Builder.html) and [AbstractEmitter.Builder](https://snowplow.github.io/snowplow-java-tracker/index.html?com/snowplowanalytics/snowplow/tracker/emitter/AbstractEmitter.Builder.html) options.

When an `Event` is tracked using `Tracker.track()`, a payload (`TrackerPayload`) is generated from the `Event`. The payload is added to the `BatchEmitter`'s `InMemoryEventStore` buffer. This triggers a check on the size of the buffer. The number of stored events is compared with the configured `batchSize`; the default is 50 events per batch. If there are enough events, a batch's worth is asynchronously removed from the buffer for sending. The `BatchEmitter` prepares a request payload containing all the event payloads, and attempts to send it. On receiving a successful HTTP response code (2xx), the events are considered sent, and permanently deleted from the buffer.

If the event buffer is full, the payload will be dropped. Priority is given to older events. In this case, `Tracker.track()` returns `null` rather than the payload `eventId`.

### What happens if an event fails to send?

Event sending retry was added in version 0.12. If the `HttpClientAdapter` returns a failure code (anything other than 2xx), the events (as `TrackerPayload` objects) are returned to the buffer. They will be retried in future sending attempts. The returned events are added to the start of the buffer queue, as older events are prioritised over newer ones.

To prevent unnecessary requests being made while the collector is unavailable, an exponential backoff is added to all subsequent event sending attempts. This resets after a request is successful.

The `BatchEmitter.Builder` currently has an option for setting response codes not to retry after. The intended use is for codes such as `401 Unauthorised` or `403 Forbidden`. We're planning to add more sophisticated response code handling to the Java tracker in a future release. If the `HttpClientAdapter` returns one of the configured fatal response codes, the events in the request payload are not returned to the buffer for another sending attempt. They are just deleted.

Configure no-retry response codes like this:

```java
List<Integer> noRetry = new ArrayList<>();
noRetry.add(403);

BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .fatalResponseCodes(noRetry)
                .build();
```

See below for information about retries within HTTP clients.

### Configuring how many events to send in one request

The BatchEmitter sends events in batches. This is more efficient than sending event requests singly, as only one set of POST headers is required for a number of events. The event collector receives the request and separates out the individual event payloads.

The default batch size is 50 events. If you have a high event volume, larger batches may be more suitable. However, there is a risk of creating oversized requests, which could result in `413 Payload Too Large` responses from your collector. The Java tracker does not currently have the ability to split oversized requests into smaller ones.

Configure the batch size like this:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .batchSize(10)
                .build();

// Batch size can be updated after initialization
emitter.setBatchSize(100)
```

The `batchSize` property was called `bufferSize` in versions before 0.12.

### Configuring how events are buffered

The Java tracker sends events asynchronously: the application is not blocked waiting for the tracked event to be sent. The tracked events are stored in memory until there are enough to send, or while the network is down. The default event store is `InMemoryEventStore`, added in version 0.12. This class stores the payloads in a queue, specifically a `LinkedBlockingDeque`.

We recommend setting the maximum capacity of the default event buffer queue at `BatchEmitter` initialization. This is the number of events that can be stored. When the buffer is full, new tracked payloads are dropped, so choosing the right capacity is important. The default buffer capacity is that of a `LinkedBlockingDeque`: `Integer.MAX_VALUE`. It's likely your application would run out of memory before buffering that many events.

Creating a `BatchEmitter` with a specified maximum buffer capacity:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .bufferCapacity(100000)
                .build();
```

This BatchEmitter will store 100 000 events before starting to lose data.

We also provide an `EventStore` interface. To use a custom EventStore:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .eventStore(EventStore)
                .build();
```

If `bufferCapacity` is provided at the same time as `eventStore`, the `bufferCapacity` value will be discarded.

### Configuring the network connection

We currently offer two different HTTP clients that can be used to send events to your collector: OkHttp or Apache HTTP. Both libraries have broadly the same features, with some differences in their default configurations. If neither of these HTTP clients is suitable, we also provide an `HttpClientAdapter` interface. The `HttpClientAdapter` is a wrapper for HTTP client objects.

Note for Gradle users: [different dependencies](/docs/sources/trackers/java-tracker/previous-versions/java-tracker-v0-12/installation-and-set-up/index.md) are required if you are using OkHttp or Apache HTTP.

By default, the Java tracker uses OkHttp; an `OkHttpClientAdapter` object is generated when a `BatchEmitter` is created. To specify a different client adapter, initialize the `BatchEmitter` like this:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .httpClientAdapter(HttpClientAdapter)
                .build();
```

Note that `url` is not a required method when an `HttpClientAdapter` is specified. The `url` collector endpoint is normally used to create the default `OkHttpClientAdapter`, therefore if `url` was provided here, it would be ignored.

HTTP request retry can be configured within the HTTP clients, on top of the Java tracker's handling of unsuccessful requests. The default HTTP client, OkHttp, [retries after certain types of connection failure](https://square.github.io/okhttp/4.x/okhttp/okhttp3/-ok-http-client/-builder/retry-on-connection-failure/) by default. The Apache HTTP Client [retries a request up to 3 times](https://www.javadoc.io/doc/org.apache.httpcomponents/httpclient/4.3.5/org/apache/http/impl/client/DefaultHttpRequestRetryHandler.html) by default.

#### OkHttpClient

The simplest OkHttpClient initialization looks like this:

```java
OkHttpClient client = new OkHttpClient();
```

This is the default as used in the `BatchEmitter`. To add configuration, instead use the `OkHttpClient.Builder`. For example, setting timeouts:

```java
OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(5, TimeUnit.SECONDS)
      .writeTimeout(5, TimeUnit.SECONDS)
      .build();

HttpClientAdapter adapter = OkHttpClientAdapter.builder()
      .url("http://collector-endpoint.com")
      .httpClient(client)
      .build();
```

The `url` is the URL for your collector. See [Square's API docs](https://square.github.io/okhttp/3.x/okhttp/okhttp3/OkHttpClient.Builder.html) for the full list of options.

#### Apache HTTP Client

The simplest Apache HTTP Client initialization looks like this:

```java
CloseableHttpClient client = HttpClients.createDefault();
```

You are encouraged to research how best to set up your Apache Client for maximum performance. For example, by default the Apache Client will never time out, and will also allow only two outbound connections at a time. In this code block, a `PoolingHttpClientConnectionManager` is used to allow up to 50 concurrent outbound connections:

```java
PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager();
manager.setDefaultMaxPerRoute(50);

CloseableHttpClient client = HttpClients.custom()
      .setConnectionManager(manager)
      .build();

HttpClientAdapter adapter = ApacheHttpClientAdapter.builder()
      .url("http://collector-endpoint.com")
      .httpClient(client)
      .build();
```

The `url` is the URL for your collector. See [Apache's HttpClient docs](https://hc.apache.org/httpcomponents-client-4.5.x/index.html) for more information about configuring the client.

### Configuring the Java tracker threads

The `BatchEmitter` contains threads for concurrent event sending. This is managed by an `ScheduledThreadPoolExecutor`. By default, the thread pool has up to 50 threads, helpfully named e.g. "snowplow-emitter-pool-1-request-thread-1". The bigger the pool of threads, the faster events can be sent. Set the number of threads depending on many events you are sending, and how strong a computer the tracker is running on.

The process of getting events from the buffer, creating a request payload, and sending the POST request occurs within a single thread.

Specifying the maximum number of event sending threads, in this case to 1:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .threadCount(1)
                .build();
```

It's also possible to provide your own `ScheduledExecutorService`:

```java
BatchEmitter emitter = BatchEmitter.builder()
                .url("http://collector-endpoint")
                .requestExecutorService(ScheduledExecutorService)
                .build();
```

The default thread pool uses non-daemon threads. To stop the threads and shut down the `ExecutorService`, call `Emitter.close()`. There is no way to restart the `Emitter` after this.
