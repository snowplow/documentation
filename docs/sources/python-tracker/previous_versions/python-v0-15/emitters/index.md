---
title: "Emitters"
sidebar_label: "Emitters"
date: "2020-02-26"
sidebar_position: 60
description: "Configure Emitter, AsyncEmitter, CeleryEmitter, and RedisEmitter classes in Python tracker v0.15 for sending events to collectors."
keywords: ["python tracker v0.15 emitters", "asyncemitter", "redis emitter"]
---

Tracker instances must be initialized with an emitter. This section will go into more depth about the Emitter class and its subclasses.

## The basic Emitter class

At its most basic, the Emitter class only needs a collector URI:

```python
from snowplow_tracker import Emitter

e = Emitter("collector.example.com")
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

:::note Prior to v0.12.0

Before version 0.12.0 the default values for the emitter `protocol` and `method` were `http` and `get` respectively. 

:::
:::note Prior to v0.13.0

Before version 0.13.0 `batch_size` was named `buffer_size`

:::
| **Argument** | **Description** | **Required?** | **Type** | **Default** | **Version** | 
| --- | --- | --- | --- | --- | --- |
| `endpoint` | The collector URI | Yes | String | |
| `protocol` | Request protocol: http or https | No | String | `https` | |
| `port` | The port to connect to | No | Positive integer | `None` | |
| `method` | The method to use: “get” or “post” | No | String | `post` | |
| `batch_size` | Number of events to store before flushing | No | Positive integer | `10` | |
| `on_success` | Callback executed when a flush is successful | No | Function taking 1 argument | `None` | |
| `on_failure` | Callback executed when a flush is unsuccessful | No | Function taking 2 arguments | `None` |
| `byte_limit` | Number of bytes to store before flushing | No | Positive integer | `None` |
| `request_timeout` | Timeout for HTTP requests | No | Positive integer or tuple of 2 integers | `None` | v0.10.0 |
| `max_retry_delay_seconds` | The maximum time between attempts to send failed events to the collector | No | int | 60s | v0.13.0 |
| `buffer_capacity` | The maximum capacity of the event buffer | No | int | `None` | v0.13.0 |
| `custom_retry_codes` | Custom retry rules for HTTP status codes received in emit responses from the Collector | No | dict | `None` | v0.13.0 |
| `event_store` | Stores the event buffer and buffer capacity | No | EventStore | `None` | v0.13.0 |
| `session` | Persist parameters across requests by using a session object | No | requests.Session | `None` | v0.15.0 |

See the [`API docs`](https://snowplow.github.io/snowplow-python-tracker/) for more information. 

- `protocol`

`protocol` defaults to "https" but also supports "http".

:::note Prior to v0.12.0

In older versions, `protocol` defaulted to `http`.

:::

- `batch_size`

:::note Prior to v0.13.0

In older versions, `batch_size` was named `buffer_size`.

:::

When the emitter receives an event, it adds it to a buffer. When the queue is full, all events in the queue get sent to the collector. The `batch_size` argument allows you to customize the queue size. By default, it is 1 for GET requests and 10 for POST requests. (So in the case of GET requests, each event is fired as soon as the emitter receives it.) If the emitter is configured to send POST requests, then instead of sending one for every event in the buffer, it will send a single request containing all those events in JSON format.

- `byte_limit`

`byte_limit` is similar to `batch_size`, but instead of counting events - it takes into account only the amount of bytes to be sent over the network. _Warning_: this limit is approximate with error < 1%.

- `on_success`

`on_success` is an optional callback that will execute whenever the queue is flushed successfully, that is, whenever every request sent has status code 200. It will be passed one argument: the number of events that were successfully sent.

:::note New in v0.9.0

Since version 0.9.0, the on_success callback function will be passed the array of successfully sent events, instead of just the number of them, in order to augment this functionality.

:::

- `on_failure` 

`on_failure` is similar, but executes when the flush is not wholly successful. It will be passed two arguments: the number of events that were successfully sent, and an array of unsent events.

An example:

```python
# Prior to v0.9.0, the on_success callback receives only the number of successfully sent events
def success(num):
    print(str(num) + " events sent successfully!")

# Since v0.9.0, the on_success callback receives the array of successfully sent events
def new_success(arr):
    for event_dict in arr:
        print(event_dict)

def failure(num, arr):
    print(str(num) + " events sent successfully!")
    print("These events were not sent successfully:")
    for event_dict in arr:
        print(event_dict)
     
# prior to v0.9.0
# e = Emitter("collector.example.com", buffer_size=3, on_success=success, on_failure=failure)

# since v0.9.0
e = Emitter("collector.example.com", buffer_size=3, on_success=new_success, on_failure=failure)

t = Tracker(e)

# This doesn't cause the emitter to send a request because the buffer_size was set to 3, not 1
t.track_page_view("http://www.example.com")
t.track_page_view("http://www.example.com/page1")

# This does cause the emitter to try to send all 3 events
t.track_page_view("http://www.example.com/page2")
```

:::note New in v0.10.0

Since version 0.10.0, the constructor takes another `request_timeout` argument.

:::
- `request_timeout`

Timeout for HTTP requests. Can be set either as single float value which applies to both "connect" AND "read" timeout, or as tuple with two float values which specify the "connect" and "read" timeouts separately.

:::note New in v0.13.0

Since version 0.13.0, the constructor takes another `max_retry_delay_seconds` argument.

:::
- `max_retry_delay_seconds`

The maximum time between attempts to send failed events to the collector. 

:::note New in v0.13.0

Since version 0.13.0, the constructor takes another `buffer_capacity` argument.

:::
- `buffer_capacity`

The maximum capacity of the event buffer. When the buffer is full new events are lost.

:::note New in v0.13.0

Since version 0.13.0, the constructor takes another `custom_retry_codes` argument.

:::
- `custom_retry_codes`

Custom retry rules for HTTP status codes received in emit responses from the Collector. By default, retry will not occur for status codes 400, 401, 403, 410 or 422. This can be overridden here by parsing a dictionary of status codes and booleans.

:::note New in v0.13.0

Since version 0.13.0, the constructor takes another `event_store` argument.

:::
- `event_store`

The event store is used to store an event queue with events scheduled to be sent. Events are added to the event store when they are tracked and removed when they are successfully emitted or when emitting fails without any scheduled retries. The default is an InMemoryEventStore object with a buffer_capacity of 10,000 events.

:::note New in v0.15.0

Since version 0.15.0, the constructor takes another `session` argument.

:::
- `session`
The session object can be parsed into the emitter to use the requests.Session API. This allows users to persist parameters across requests, as well as pool connections to increase efficiency under heavy usage. If no `session` is parsed, the requests API is used.

## What happens if an event fails to send?
:::note New in v0.13.0
Retry capabilities are new in v0.13.0
:::
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
As events are collected, the are stored in a buffer until there are enough to send. By default, tracked events are stored in the `InMemoryEventStore` introduced in v0.13.0. This is an implemenation of the `EventStore` protocol and stores payloads in a `List` object and is cleared once the buffer capacity is reached. 

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

e = AsyncEmitter("collector.example.com", thread_count=10)
```

The `AsyncEmitter` class works just like the Emitter class, which is its parent class. It has one advantage, though: HTTP(S) requests are sent asynchronously, so the Tracker won't be blocked while the Emitter waits for a response. For this reason, the AsyncEmitter is recommended over the base `Emitter` class.

The AsyncEmitter uses a fixed-size thread pool to perform network I/O. By default, this pool contains only one thread, but you can configure the number of threads in the constructor using the `thread_count` argument, which is the only specific to AsyncEmitter argument.

Here is a complete example with all constructor parameters set:

```python
from snowplow_tracker import AsyncEmitter

e = AsyncEmitter("collector.example.com", 
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
            session=None)
```

## The CeleryEmitter class

**Important note**: Since version 0.9.0, the CeleryEmitter is only available as an extra module. To use it, you need to install the snowplow-tracker as:

```bash
$ pip install snowplow-tracker[celery]
```

The `CeleryEmitter` class works just like the base `Emitter` class, but it registers sending requests as a task for a [Celery](http://www.celeryproject.org/) worker. If there is a module named snowplow_celery_config.py on your PYTHONPATH, it will be used as the Celery configuration file; otherwise, a default configuration will be used. You can run the worker using this command:

```bash
celery -A snowplow_tracker.emitters worker --loglevel=debug
```

Note that `on_success` and `on_failure` callbacks cannot be supplied to this emitter.

## The RedisEmitter class

**Important note**: Since version 0.9.0, the RedisEmitter is only available as an extra module. To use it, you need to install the snowplow-tracker as:

```bash
$ pip install snowplow-tracker[redis]
```

  

Use a RedisEmitter instance to store events in a [Redis](http://redis.io/) database for later use. This is the RedisEmitter constructor function:

```python
def __init__(self, rdb=None, key="snowplow"):
```

`rdb` should be an instance of either the `Redis` or `StrictRedis` class, found in the `redis` module. If it is not supplied, a default will be used. `key` is the key used to store events in the database. It defaults to "snowplow". The format for event storage is a Redis list of JSON strings.

An example:

```python
from snowplow_tracker import RedisEmitter, Tracker
import redis

rdb = redis.StrictRedis(db=2)

e = RedisEmitter(rdb, "my_snowplow_key")

t = Tracker(e)

t.track_page_view("http://www.example.com")

# Check that the event was stored in Redis:
print(rdb.lrange("my_snowplowkey", 0, -1))
# prints something like:
# ['{"tv":"py-0.4.0", "ev": "pv", "url": "http://www.example.com", "dtm": 1400252420261, "tid": 7515828, "p": "pc"}']
```

### Manual flushing

You can flush the emitter manually using the `flush` method of the `Tracker` instance which is sending events to the emitter. This is a blocking call which synchronously sends all events in the emitter's buffer.

```python
t.flush()
```

You can alternatively perform an asynchronous flush, which tells the tracker to send all buffered events but doesn't wait for the sending to complete:

```python
t.flush(False)
```

If you are using the AsyncEmitter, you shouldn't perform a synchronous flush inside an on_success or on_failure callback function as this can cause a deadlock.

### Multiple emitters

You can configure a tracker instance to send events to multiple emitters by passing the `Tracker` constructor function an array of emitters instead of a single emitter, or by using the `addEmitter` method:

```python
from snowplow_tracker import Subject, Tracker, AsyncEmitter, RedisEmitter
import redis

e1 = AsyncEmitter("collector1.cloudfront.net", method="get")
e1 = AsyncEmitter("collector2.cloudfront.net", method="post")

t = Tracker([e1, e2])

rdb = redis.StrictRedis(db=2)

e3 = RedisEmitter(rdb, "my_snowplow_key")

t.addEmitter(e3)
```

### Custom emitters

You can create your own custom emitter class, either from scratch or by subclassing one of the existing classes (with the exception of `CeleryEmitter`, since it uses the `pickle` module which doesn't work correctly with a class subclassed from a class located in a different module). The only requirement for compatibility is that is must have an `input` method which accepts a Python dictionary of name-value pairs.

### Setting flush timer

You can flush your emitter based on some time interval:

```python
e1 = AsyncEmitter("collector1.cloudfront.net", method="post")
e1.set_flush_timer(5)  # flush each 5 seconds
```

Automatic flush can also be cancelled:

```python
e1.cancel_flush()
```
