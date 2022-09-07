---
title: "Emitters"
date: "2020-02-26"
sidebar_position: 40
---

We now support four different emitters: sync, socket, curl and an out-of-band file emitter. The most basic emitter only requires you to specify the type of emitter to be used and the collectors URI as parameters.

All emitters support both `GET` and `POST` as methods for sending events to Snowplow collectors. For the sake of speed, we recommend using `POST` as the tracker can then bundle many events together into a single request.

It is recommended that after you have finished logging all of your events to run the following command:

```php
$tracker->flushEmitters();
```

This will empty the event buffers of all emitters associated with your tracker object and send any left over events. In future releases, this will be an automatic process but for now, it remains manual.

### Sync

The Sync emitter is a very basic synchronous emitter which supports both `GET` and `POST` request types.

By default, this emitter uses the Request type POST, HTTP and a buffer size of 50.

Example emitter creation:

```php
$emitter = new SyncEmitter($collector_uri, "http", "POST", 50);
```

Whilst you can force the buffer size to be greater than 1 for a GET Request; it will not yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $protocol = NULL, $type = NULL, $buffer_size = NULL, $debug = false)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector URI | Yes | Non-empty string |
| `$protocol` | Collector Protocol (HTTP or HTTPS) | No | String |
| `$type` | Request Type (POST or GET) | No | String |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |

### Socket

The Socket emitter allows for the much faster transmission of Requests to the collector by allowing us to write data directly to the HTTP socket. However, this solution is still, in essence, a synchronous process and will block the execution of the main script.

Example Emitter creation:

```php
$emitter = new SocketEmitter($collector_uri, NULL, "GET", NULL, NULL);
```

Whilst you can force the buffer size to be greater than 1 for a GET Request; it will not yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $ssl = NULL, $type = NULL, $timeout = NULL, $buffer_size = NULL, $debug = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector URI | Yes | Non-empty string |
| `$ssl` | Whether to use SSL encryption | No | Boolean |
| `$type` | Request Type (POST or GET) | No | String |
| `$timeout` | Socket Timeout Limit | No | Int or Float |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |

### Curl

The Curl Emitter allows us to have the closest thing to native asynchronous requests in PHP. The curl emitter uses the `curl_multi_init` resource which allows us to send any number of requests asynchronously. This garners quite a performance gain over the sync and socket emitters as we can now send more than one request at a time.

On top of this, we are also using a modified version of this **[Rolling Curl library](https://github.com/joshfraser/rolling-curl)** for the actual sending of the curl requests. This allows for a more efficient implementation of asynchronous curl requests as we can now have multiple requests sending at the same time, and in addition as soon as one is done a new request is started.

Example Emitter creation:

```php
$emitter = new CurlEmitter($collector_uri, false, "GET", 2);
```

Whilst you can force the buffer size to be greater than 1 for a GET request, it will not yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $protocol = NULL, $type = NULL, $buffer_size = NULL, $debug = false)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector URI | Yes | Non-empty string |
| `$protocol` | Collector Protocol (HTTP or HTTPS) | No | String |
| `$type` | Request Type (POST or GET) | No | String |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |

#### Curl Default Settings

The internal emitter default settings are as follows:

- Rolling Window (Number of concurrent requests)
    - POST: 10
    - GET: 30
- Curl Buffer (Number of times we need to hit the emitters buffer size before sending)
    - POST: 50
    - GET: 250

These settings are currently not editable from the constructor; however, the values are stored within a `Constants.class` if you must make changes.

### File

Important

When running under Windows, PHP cannot spawn truly separate processes, and slowly eats more and more resources when more processes are spawned. Thus, Windows might crash under high load when using the File Emitter.

The File Emitter is the only true non-blocking solution. The File Emitter works via spawning workers which grab created files of logged events from a local temporary folder. The workers then load the events using the same asynchronous curl properties from the above emitter.

All of the worker processes are created as background processes so none of them will delay the execution of the main script. Currently, they are configured to look for files inside created worker folders until there are none left and they hit their `timeout` limit, at which point the process will kill itself.

If the worker for any reason fails to successfully send a request it will rename the entire file to `failed` and leave it in the `/temp/failed-logs/` folder.

Example Emitter creation:

```
$emitter = new FileEmitter($collector_uri, false, "POST", 2, 15, 100, "/tmp/snowplow");
```

The buffer for the file emitter works a bit differently to the other emitters in that here it refers to the number of events needed before an `events-random.log` is produced for a worker. If you are anticipating it taking a long time to reach the buffer be aware that the worker will kill itself after 75 seconds by default (15 x 5). Adjust the timeout amount in the construction of the FileEmitter if the default is not suitable.

Constructor:

```
public function __construct($uri, $protocol = NULL, $type = NULL, $workers = NULL, $timeout = NULL, $buffer_size = NULL, $debug = false, $log_dir = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector URI | Yes | Non-empty string |
| `$protocol` | Collector Protocol (HTTP or HTTPS) | No | String |
| `$type` | Request Type (POST or GET) | No | String |
| `$workers` | Amount of background workers | No | Int |
| `$timeout` | Worker Timeout | No | Int or Float |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |
| `$log_dir` | The directory for event log and worker log subdirectories to be created in | No | String |

### Emitter Debug Mode

Debug mode is enabled on emitters by setting the `$debug` argument in the emitter constructor to `true`:

```
$emitter = new SyncEmitter($collector_uri, "http", "POST", 50, true);
```

By default, debug mode will create a new directory called `/debug/` in the root of the tracker's directory. It will then create a log file with the following structure; `sync-events-log-[[random number]].log`: i.e. the type of emitter and a randomized number to prevent it from being accidentally overwritten.

If physically storing the information is not possible due to not having the correct write permissions or simply not wanted it can be turned off by updating the following value in the Constants class:

```
const DEBUG_LOG_FILES = false;
```

Now all debugging information will be printed to the console.

Every time the events buffer is flushed we will be able to see if the flush was successful. In the case of an error, it records the entire event payload the tracker was trying to send, along with the error code.

#### Event Specific Information

Debug Mode if enabled will also have the emitter begin storing information internally. It will store the HTTP response code and the payload for every request made by the emitter.

```php
array(
    "code" => 200,
    "data" => "{"e":"pv","url":"www.example.com","page":"example","refr":"www.referrer.com"}"
)
```

The `data` is stored as a JSON-encoded string. To locally test whether or not your emitters are successfully sending, we can retrieve this information with the following commands:

```php
$emitters = $tracker->returnEmitters(); # Will store all of the emitters as an array.
$emitter = $emitters[0]; # Get the first emitter stored by the tracker
$results = $emitter->returnRequestResults();  # Return the stored results.

# Now that we have results we can work with...
print("Code: ".$results[0]["code"]);
print("Data: ".$results[0]["data"]);
```

This allows you to debug on a request by request basis to ensure that everything is being sent properly.

#### Turn Debug Off

As debugging stores a lot of information, we can end debug mode by calling the following command:

```php
$tracker->turnOffDebug();
```

This will stop all logging activity, both to the external files and to the local arrays. We can go one step further though and pass a `true` boolean to the function. This will delete all of the tracker's associated physical debug log files as well as emptying the local arrays within each linked emitter.

```php
$tracker->turnOffDebug(true);
```
