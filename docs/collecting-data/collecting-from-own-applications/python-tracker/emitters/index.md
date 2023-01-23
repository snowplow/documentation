---
title: "Emitters"
date: "2020-02-26"
sidebar_position: 60
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
        protocol: HttpProtocol = "https",
        port: Optional[int] = None,
        method: Method = "post",
        batch_size: Optional[int] = None,
        on_success: Optional[SuccessCallback] = None,
        on_failure: Optional[FailureCallback] = None,
        byte_limit: Optional[int] = None,
        request_timeout: Optional[Union[float, Tuple[float, float]]] = None,
        max_retry_delay_seconds: int = 60,
        buffer_capacity: Optional[int] = None,
        custom_retry_codes: Dict[int, bool] = {},
        event_store: Optional[EventStore] = None
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

See the [`API docs`](https://snowplow.github.io/snowplow-python-tracker/) for more information on the individual parameters. 
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
            event_store = None)
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
