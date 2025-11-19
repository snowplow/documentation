---
title: "Emitters configuration for the Python tracker"
sidebar_label: "Emitters"
sidebar_position: 30
---

Tracker instances must be initialized with an emitter. This section will go into more depth about the Emitter class and its subclasses.

## The basic Emitter class

At its most basic, the Emitter class only needs a collector URI:

```python
from snowplow_tracker import Emitter

e = Emitter(endpoint="collector.example.com")
```

This is the signature of the constructor for the base Emitter class:

```python
def __init__(
        self,
        endpoint: str,
        protocol: Literal["http", "https"] = "https",
        port: Optional[int] = None,
        method: Literal["get", "post"] = "post",
        batch_size: Optional[int] = None,
        on_success: Optional[Callable[[PayloadDictList], None]] = None,
        on_failure: Optional[Callable[[int, PayloadDictList], None]] = None,
        byte_limit: Optional[int] = None,
        request_timeout: Optional[Union[float, Tuple[float, float]]] = None,
        max_retry_delay_seconds: int = 60,
        buffer_capacity: Optional[int] = None,
        custom_retry_codes: Dict[int, bool] = {},
        event_store: Optional[EventStore] = None,
        session: Optional[requests.Session] = None,
    )-> None:
```

| **Argument** | **Description** | **Required?** | **Type** | **Default** |
| --- | --- | --- | --- | --- | 
| `endpoint` | The collector URI | Yes | String | 
| `protocol` | Request protocol: http or https | No | String | `https` | 
| `port` | The port to connect to | No | Positive integer | `None` | 
| `method` | The method to use: “get” or “post” | No | String | `post` | 
| `batch_size` | Number of events to store before flushing | No | Positive integer | `10` | 
| `on_success` | Callback executed when a flush is successful | No | Function taking 1 argument | `None` | 
| `on_failure` | Callback executed when a flush is unsuccessful | No | Function taking 2 arguments | `None` |
| `byte_limit` | Number of bytes to store before flushing | No | Positive integer | `None` |
| `request_timeout` | Timeout for HTTP requests | No | Positive integer or tuple of 2 integers | `None` | 
| `max_retry_delay_seconds` | The maximum time between attempts to send failed events to the collector | No | int | 60 | 
| `buffer_capacity` | The maximum capacity of the event buffer | No | int | `None` |
| `custom_retry_codes` | Custom retry rules for HTTP status codes received in emit responses from the Collector | No | dict | `None` | 
| `event_store` | Stores the event buffer and buffer capacity | No | EventStore | `None`| 
| `session` | Persist parameters across requests by using a session object | No | requests.Session | `None` | 

:::note
If no `event_store` is provided, an `InMemoryEventStore` will be initialized with a `buffer_capacity` of 10,000
:::

See the [`API docs`](https://snowplow.github.io/snowplow-python-tracker/) for more information. 

### `protocol`

`protocol` defaults to "https" but also supports "http".

### `batch_size`

When the emitter receives an event, it adds it to a buffer. When the queue is full, all events in the queue get sent to the collector. The `batch_size` argument allows you to customize the queue size. By default, it is 1 for GET requests and 10 for POST requests. (So in the case of GET requests, each event is fired as soon as the emitter receives it.) If the emitter is configured to send POST requests, then instead of sending one for every event in the buffer, it will send a single request containing all those events in JSON format.

### `byte_limit`

`byte_limit` is similar to `batch_size`, but instead of counting events - it takes into account only the amount of bytes to be sent over the network. _Warning_: this limit is approximate with error < 1%.

### `on_success`

`on_success` is an optional callback that will execute whenever the queue is flushed successfully, that is, whenever every request sent has status code 200. It will be passed one argument: an array of events that were successfully sent.

### `on_failure` 

`on_failure` is similar, but executes when the flush is not wholly successful. It will be passed two arguments: the number of events that were successfully sent, and an array of unsent events.

An example:

```python
def success(arr):
    print(str(len(arr)) + " events sent successfully!")

def new_success(arr):
    for event_dict in arr:
        print(event_dict)

def failure(num, arr):
    print(str(num) + " events sent successfully!")
    print("These events were not sent successfully:")
    for event_dict in arr:
        print(event_dict)
     
e = Emitter(endpoint="collector.example.com", buffer_size=3, on_success=new_success, on_failure=failure)

t = Tracker(namespace="snowplow_tracker", emitter=e)
```

### `request_timeout`

Timeout for HTTP requests. Can be set either as single float value which applies to both "connect" AND "read" timeout, or as tuple with two float values which specify the "connect" and "read" timeouts separately.

### `max_retry_delay_seconds`

The maximum time between attempts to send failed events to the collector. 

### `buffer_capacity`

The maximum capacity of the event buffer. When the buffer is full new events are lost.

### `custom_retry_codes`

Custom retry rules for HTTP status codes received in emit responses from the Collector. By default, retry will not occur for status codes 400, 401, 403, 410 or 422. This can be overridden here by parsing a dictionary of status codes and booleans.

### `event_store`

The event store is used to store an event queue with events scheduled to be sent. Events are added to the event store when they are tracked and removed when they are successfully emitted or when emitting fails without any scheduled retries. The default is an InMemoryEventStore object with a buffer_capacity of 10,000 events.

### `session`
The session object can be parsed into the emitter to use the requests.Session API. This allows users to persist parameters across requests, as well as pool connections to increase efficiency under heavy usage. If no `session` is parsed, the requests API is used.

## What happens if an event fails to send?
After trying to send a batch of events the collector will return an http status code. A 2xx code is always considered successful. If a failure code is returned (anything other than 2xx, with certain exceptions, see below), the events (as PayloadDictList objects) are returned to the buffer. They will be retried in future sending attempts. 

To prevent unnecessary requests being made while the collector is unavailable, an exponential backoff is added to all subsequent event sending attempts. This resets after a request is successful. The default maximum backoff time between attempts is 1 minute but this can be configured by setting `max_retry_delay_seconds`.

The status codes 400 Bad Request, 401 Unauthorised, 403 Forbidden, 410 Gone, or 422 Unprocessable Entity are the exceptions: they are not retried by default. Payloads in requests receiving these responses are not returned to the buffer for retry. They are just deleted.

Configure which codes to retry on or not using the `EmitterConfiguration` when creating your tracker. This method takes a dictionary of status codes and booleans (True for retry and False for not retry). 

```python
# by default 401 isn't retried, but 500 is
custom_retry_codes = {500: False, 401: True}
emitter_config = EmitterConfiguration(custom_retry_codes=custom_retry_codes)

Snowplow.create_tracker(
    namespace="ns",
    endpoint="collector.example.com",
    emitter_config=emitter_config,
)

```

## Configuring how events are buffered
As events are collected, the are stored in a buffer until there are enough to send. By default, tracked events are stored in the `InMemoryEventStore`. This is an implemenation of the `EventStore` protocol and stores payloads in a `List` object and is cleared once the buffer capacity is reached. 

The default buffer capacity is 10,000 events. This is the number of events that can be stored. When the buffer is full, new tracked payloads are dropped, so choosing the right capacity is important. You can set the buffer capacity through the `EmitterConfiguration` object, for example:

```python    
emitter_config = EmitterConfiguration(buffer_capacity=25,000)

Snowplow.create_tracker(
    namespace="ns",
    endpoint="collector.example.com",
    emitter_config=emitter_config,
)
```
The emitter will store 25,000 events before starting to lose data.
## The AsyncEmitter class

```python
from snowplow_tracker import AsyncEmitter

e = AsyncEmitter(endpoint="collector.example.com", thread_count=10)
```

The `AsyncEmitter` class works just like the Emitter class, which is its parent class. It has one advantage, though: HTTP(S) requests are sent asynchronously, so the Tracker won't be blocked while the Emitter waits for a response. For this reason, the AsyncEmitter is recommended over the base `Emitter` class.

The AsyncEmitter uses a fixed-size thread pool to perform network I/O. By default, this pool contains only one thread, but you can configure the number of threads in the constructor using the `thread_count` argument, which is the only specific to AsyncEmitter argument.

Here is a complete example with all constructor parameters set:

```python
from snowplow_tracker import AsyncEmitter

e = AsyncEmitter(
    endpoint="collector.example.com", 
    protocol = "https",
    port=9090,
    method='post',
    batch_size=10,
    on_success=None,
    on_failure=None,
    thread_count=1,
    byte_limit=None,
    max_retry_delay_seconds = 60,
    buffer_capacity = 5000,
    event_store = None,
    session=None
)
```
### Manual flushing

You can flush the emitter manually using the `flush` method of the `Tracker` instance which is sending events to the emitter. This is a blocking call which synchronously sends all events in the emitter's buffer.

```python
tracker.flush()
```

You can alternatively perform an asynchronous flush, which tells the tracker to send all buffered events but doesn't wait for the sending to complete:

```python
tracker.flush(False)
```

If you are using the AsyncEmitter, you shouldn't perform a synchronous flush inside an on_success or on_failure callback function as this can cause a deadlock.

### Multiple emitters

You can configure a tracker instance to send events to multiple emitters by passing the `Tracker` constructor function an array of emitters instead of a single emitter, or by using the `addEmitter` method:

```python
from snowplow_tracker import Subject, Tracker, AsyncEmitter

e1 = AsyncEmitter(endpoint="collector1.cloudfront.net", method="get")
e2 = AsyncEmitter(endpoint="collector2.cloudfront.net", method="post")

tracker = Tracker(namespace="snowplow_tracker", emitters=[e1, e2])

e3 = AsyncEmitter(endpoint="collector3.cloudfront.net", method="post")

tracker.addEmitter(e3)
```

### Custom emitters

You can create your own custom emitter class, either from scratch or by subclassing one of the existing classes. The only requirement for compatibility is that is must have an `input` method which accepts a Python dictionary of name-value pairs.

### Setting flush timer

You can flush your emitter based on some time interval:

```python
e1 = AsyncEmitter(endpoint="collector1.cloudfront.net", method="post")
e1.set_flush_timer(5)  # flush each 5 seconds
```

Automatic flush can also be cancelled:

```python
e1.cancel_flush()
```
