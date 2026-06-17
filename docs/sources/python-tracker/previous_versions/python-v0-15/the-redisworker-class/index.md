---
title: "The RedisWorker class"
sidebar_label: "RedisWorker class"
date: "2020-02-26"
sidebar_position: 90
description: "Send events from Redis to emitters using the RedisWorker class in Python tracker v0.15 for asynchronous event processing."
keywords: ["python tracker v0.15 redisworker", "redis event processing", "async worker"]
---

**Important note**: Since version 0.9.0, the RedisWorker is only available as an extra module. To use it, you need to install the snowplow-tracker as:

```python
$ pip install snowplow-tracker[redis]
```

  

The tracker comes with a RedisWorker class which sends Snowplow events from Redis to an emitter. The RedisWorker constructor is similar to the RedisEmitter constructor:

```python
def __init__(self, _consumer, key=None, dbr=None):
```

This is how it is used:

```python
from snowplow_tracker import AsyncEmitter
from snowplow_tracker.redis_worker import RedisWorker

e = Emitter("d3rkrsqld9gmqf.cloudfront.net")

r = RedisWorker(e, key="snowplow_redis_key")

r.run()
```

This will set up a worker which will run indefinitely, taking events from the Redis list with key "snowplow_redis_key" and inputting them to an AsyncEmitter, which will send them to a Cloudfront collector. If the process receives a SIGINT signal (for example, due to a Ctrl-C keyboard interrupt), cleanup will occur before exiting to ensure no events are lost.
