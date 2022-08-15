---
title: "Emitters"
date: "2020-02-26"
sidebar_position: 60
---

Tracker instances must be initialized with an emitter. This section will go into more depth about the Emitter class and its subclasses.

## The basic Emitter class

At its most basic, the Emitter class only needs a collector URI:

```
from snowplow_tracker import Emitter

e = Emitter("d3rkrsqld9gmqf.cloudfront.net")
```

This is the signature of the constructor for the base Emitter class:

```
def __init__(
        self,
        endpoint: str,
        protocol: Literal["http", "https"] = "http",
        port: Optional[int] = None,
        method: Literal["get", "post"] = "get",
        buffer_size: Optional[int] = None,
        on_success: Optional[Callable[[PayloadDictList], None]] = None,
        on_failure: Optional[Callable[[int, PayloadDictList], None]] = None,
        byte_limit: Optional[int] = None,
        request_timeout: Optional[Union[float, Tuple[float, float]]] = None) -> None:
```

| **Argument** | **Description** | **Required?** | **Type** |
| --- | --- | --- | --- |
| `endpoint` | The collector URI | Yes | Dict |
| `protocol` | Request protocol: HTTP or HTTPS | No | List |
| `port` | The port to connect to | No | Positive integer |
| `method` | The method to use: “get” or “post” | No | String |
| `buffer_size` | Number of events to store before flushing | No | Positive integer |
| `on_success` | Callback executed when a flush is successful | No | Function taking 1 argument |
| `on_failure` | Callback executed when a flush is unsuccessful | No | Function taking 2 arguments |
| `byte_limit` | Number of bytes to store before flushing | No | Positive integer |
| `request_timeout` | Timeout for HTTP requests | No | Positive integer or tuple of 2 integers |

- `protocol`

`protocol` defaults to "http" but also supports "https".

- `buffer_size`

When the emitter receives an event, it adds it to a buffer. When the queue is full, all events in the queue get sent to the collector. The `buffer_size` argument allows you to customize the queue size. By default, it is 1 for GET requests and 10 for POST requests. (So in the case of GET requests, each event is fired as soon as the emitter receives it.) If the emitter is configured to send POST requests, then instead of sending one for every event in the buffer, it will send a single request containing all those events in JSON format.

- `byte_limit`

`byte_limit` is similar to `buffer_size`, but instead of counting events - it takes into account only the amount of bytes to be sent over the network. _Warning_: this limit is approximate with infelicity < 1%.

- `on_success`

`on_success` is an optional callback that will execute whenever the queue is flushed successfully, that is, whenever every request sent has status code 200. It will be passed one argument: the number of events that were successfully sent.

**_\*\*New in v0.9.0_**

Since version 0.9.0, the on\_success callback function will be passed the array of successfully sent events, instead of just the number of them, in order to augment this functionality.

- `on_failure` 

`on_failure` is similar, but executes when the flush is not wholly successful. It will be passed two arguments: the number of events that were successfully sent, and an array of unsent events.

An example:

```
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
# e = Emitter("d3rkrsqld9gmqf.cloudfront.net", buffer_size=3, on_success=success, on_failure=failure)

# since v0.9.0
e = Emitter("d3rkrsqld9gmqf.cloudfront.net", buffer_size=3, on_success=new_success, on_failure=failure)

t = Tracker(e)

# This doesn't cause the emitter to send a request because the buffer_size was set to 3, not 1
t.track_page_view("http://www.example.com")
t.track_page_view("http://www.example.com/page1")

# This does cause the emitter to try to send all 3 events
t.track_page_view("http://www.example.com/page2")
```

**_\*\*New in v0.10.0_**

Since version 0.10.0, the constructors takes another `request_timeout` argument.

- `request_timeout`

Timeout for HTTP requests. Can be set either as single float value which applies to both "connect" AND "read" timeout, or as tuple with two float values which specify the "connect" and "read" timeouts separately.

## The AsyncEmitter class

```
from snowplow_tracker import AsyncEmitter

e = AsyncEmitter("d3rkrsqld9gmqf.cloudfront.net", thread_count=10)
```

The `AsyncEmitter` class works just like the Emitter class, which is its parent class. It has one advantage, though: HTTP(S) requests are sent asynchronously, so the Tracker won't be blocked while the Emitter waits for a response. For this reason, the AsyncEmitter is recommended over the base `Emitter` class.

The AsyncEmitter uses a fixed-size thread pool to perform network I/O. By default, this pool contains only one thread, but you can configure the number of threads in the constructor using the `thread_count` argument, which is the only specific to AsyncEmitter argument.

Here is a complete example with all constructor parameters set:

```
from snowplow_tracker import AsyncEmitter

e = AsyncEmitter("d3rkrsqld9gmqf.cloudfront.net", 
            protocol="https",
            port=None,
            method="post",
            buffer_size=10,
            byte_limit=None,
            on_success=None,
            on_failure=None,
            thread_count=1)
```

## The CeleryEmitter class

**Important note**: Since version 0.9.0, the CeleryEmitter is only available as an extra module. To use it, you need to install the snowplow-tracker as:

```
$ pip install snowplow-tracker[celery]
```

  

The `CeleryEmitter` class works just like the base `Emitter` class, but it registers sending requests as a task for a [Celery](http://www.celeryproject.org/) worker. If there is a module named snowplow\_celery\_config.py on your PYTHONPATH, it will be used as the Celery configuration file; otherwise, a default configuration will be used. You can run the worker using this command:

```
celery -A snowplow_tracker.emitters worker --loglevel=debug
```

Note that `on_success` and `on_failure` callbacks cannot be supplied to this emitter.

## The RedisEmitter class

**Important note**: Since version 0.9.0, the RedisEmitter is only available as an extra module. To use it, you need to install the snowplow-tracker as:

```
$ pip install snowplow-tracker[redis]
```

  

Use a RedisEmitter instance to store events in a [Redis](http://redis.io/) database for later use. This is the RedisEmitter constructor function:

```
def __init__(self, rdb=None, key="snowplow"):
```

`rdb` should be an instance of either the `Redis` or `StrictRedis` class, found in the `redis` module. If it is not supplied, a default will be used. `key` is the key used to store events in the database. It defaults to "snowplow". The format for event storage is a Redis list of JSON strings.

An example:

```
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

```
t.flush()
```

You can alternatively perform an asynchronous flush, which tells the tracker to send all buffered events but doesn't wait for the sending to complete:

```
t.flush(False)
```

If you are using the AsyncEmitter, you shouldn't perform a synchronous flush inside an on\_success or on\_failure callback function as this can cause a deadlock.

### Multiple emitters

You can configure a tracker instance to send events to multiple emitters by passing the `Tracker` constructor function an array of emitters instead of a single emitter, or by using the `addEmitter` method:

```
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

### Automatically retry sending failed events

You can use the following function as the `on_failure` callback to immediately retry failed events:

```
def on_failure_retry(failed_event_count, failed_events):
  # possible backoff-and-retry timeout here
  for e in failed_events:
    my_emitter.input(e)
```

You may wish to add backoff logic to delay the resending.

### Setting flush timer

You can flush your emitter based on some time interval:

```
e1 = AsyncEmitter("collector1.cloudfront.net", method="post")
e1.set_flush_timer(5)  # flush each 5 seconds
```

Automatic flush can also be cancelled:

```
e1.cancel_flush()
```
