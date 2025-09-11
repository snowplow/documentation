---
title: "Emitters"
description: "Configure event emitters in PHP tracker for reliable behavioral data transmission."
schema: "TechArticle"
keywords: ["PHP Emitters", "Event Sending", "PHP Configuration", "Transport Layer", "PHP Analytics", "Event Delivery"]
date: "2020-02-26"
sidebar_position: 40
---

We currently support four different emitters: sync, socket, curl, and an out-of-band file emitter. The most basic emitter only requires you to select the type of emitter to be used and specify the Collector's hostname as parameters.

All emitters support both `GET` and `POST` as methods for sending events to Snowplow Collectors.

For the sake of performance, we recommend using `POST` as the tracker can then batch many events together into a single request.
Note that depending on your pipeline architecture, your Collector may have limits on the maximum request size it accepts that could be exceeded by large batch sizes.

It is recommended that after you have finished logging all of your events to call the following method:

```php
$tracker->flushEmitters();
```

This empties the event buffers of all emitters associated with your tracker object and sends any left over events. In future releases, this may be an automatic process but for now, it remains manual.

### Sync

The Sync emitter is a basic synchronous emitter which supports both `GET` and `POST` request types.

By default, this emitter uses the Request type POST, HTTP, and a buffer size of 50.

As of version 0.7.0, the emitter has the capability to retry failed requests.
In case connection to the Collector can't be established or the request fails with a 4xx (except for 400, 401, 403, 410, 422) or 5xx status code, the same request is retried.
The number of times a request should be retried is configurable but defaults to 1.
The default back-off period between subsequent retries, starts with 100 ms (configurable) and increases exponentially.

Example emitter creation:

```php
$emitter = new SyncEmitter($collector_uri, "http", "POST", 50);
```

Whilst you can force the buffer size to be greater than 1 for a GET Request; it doesn't yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $protocol = NULL, $type = NULL, $buffer_size = NULL, $debug = false, $max_retry_attempts = NULL, $retry_backoff_ms = NULL, $server_anonymization = false)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector hostname | Yes | Non-empty string |
| `$protocol` | Collector Protocol (HTTP or HTTPS) | No | String |
| `$type` | Request Type (POST or GET) | No | String |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |
| `$max_retry_attempts` | The maximum number of times to retry a request. Defaults to 1. | No | Int |
| `$retry_backoff_ms` | The number of milliseconds to backoff before retrying a request. Defaults to 100 ms, increases exponentially in subsequent retries. | No | Int |
| `$server_anonymization` | Enable Server Anonymization for sent events; IP and Network User ID information isn't associated with tracked events | No | Int |

### Socket

The Socket emitter allows for the much faster transmission of Requests to the Collector by allowing us to write data directly to the HTTP socket. However, this solution is still, in essence, a synchronous process and blocks the execution of the main script.

As of version 0.7.0, the emitter has the capability to retry failed requests.
In case connection to the Collector can't be established or the request fails with a 4xx (except for 400, 401, 403, 410, 422) or 5xx status code, the same request is retried.
The number of times a request should be retried is configurable but defaults to 1.
The default back-off period between subsequent retries, starts with 100 ms (configurable) and increases exponentially.

Example Emitter creation:

```php
$emitter = new SocketEmitter($collector_uri, NULL, "GET", NULL, NULL);
```

Whilst you can force the buffer size to be greater than 1 for a GET Request; it does not yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $ssl = NULL, $type = NULL, $timeout = NULL, $buffer_size = NULL, $debug = NULL, $max_retry_attempts = NULL, $retry_backoff_ms = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector hostname | Yes | Non-empty string |
| `$ssl` | Whether to use SSL encryption | No | Boolean |
| `$type` | Request Type (POST or GET) | No | String |
| `$timeout` | Socket Timeout Limit | No | Int or Float |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |
| `$max_retry_attempts` | The maximum number of times to retry a request. Defaults to 1. | No | Int |
| `$retry_backoff_ms` | The number of milliseconds to backoff before retrying a request. Defaults to 100 ms, increases exponentially in subsequent retries. | No | Int |
| `$server_anonymization` | Enable Server Anonymization for sent events; IP and Network User ID information isn't associated with tracked events | No | Int |

### Curl

The Curl Emitter allows us to have the closest thing to native asynchronous requests in PHP. The curl emitter uses the `curl_multi_init` resource which allows us to send any number of requests asynchronously. This garners a performance gain over the sync and socket emitters as we can now send more than one request at a time.

On top of this, we are also using a modified version of this **[Rolling Curl library](https://github.com/joshfraser/rolling-curl)** for the actual sending of the curl requests. This allows for a more efficient implementation of asynchronous curl requests as we can now have multiple requests sending at the same time, and in addition as soon as one is done a new request is started.

:::note
The emitter doesn't retry failed requests to the Collector. Failed requests to the Collector (for example due to it being not reachable) result in lost events.
:::

Example Emitter creation:

```php
$emitter = new CurlEmitter($collector_uri, false, "GET", 2);
```

Whilst you can force the buffer size to be greater than 1 for a GET request, it doesn't yield any performance changes as we can still only send 1 event at a time.

Constructor:

```php
public function __construct($uri, $protocol = NULL, $type = NULL, $buffer_size = NULL, $debug = false, $curl_timeout = NULL)
```

Arguments:

| **Argument**            | **Description**                                         | **Required?** | **Validation**   |
|-------------------------|---------------------------------------------------------|---------------|------------------|
| `$uri`                  | Collector hostname                                      | Yes           | Non-empty string |
| `$protocol`             | Collector Protocol (HTTP or HTTPS)                      | No            | String           |
| `$type`                 | Request Type (POST or GET)                              | No            | String           |
| `$buffer_size`          | Amount of events to store before flush                  | No            | Int              |
| `$debug`                | Whether or not to log errors                            | No            | Boolean          |
| `$curl_timeout`         | Maximum time the request is allowed to take, in seconds | No            | Int              |
| `$server_anonymization` | Enable Server Anonymization for sent events             | No            | Int              |

#### Curl default settings

The internal emitter default settings are as follows:

- Rolling Window (max number of concurrent requests)
    - POST: 10
    - GET: 30
- Curl Buffer (number of times we need to hit the emitters buffer size before sending)
    - POST: 50
    - GET: 250

Since version 0.8 of the PHP tracker, you can change these settings using the following setter functions:

- `$curl_emitter.setCurlAmount($curl_amount)`: update the curl buffer size (number of times we need to reach the buffer size before we initiate sending)
- `$curl_emitter.setRollingWindow($rolling_window)`: update the rolling window configuration (max number of concurrent requests)

### File

:::caution

When running under Windows, PHP can't spawn truly separate processes, and slowly eats more and more resources when more processes are spawned. Thus, Windows might crash under high load when using the File Emitter.

:::

The File Emitter is the only true non-blocking solution. The File Emitter works via spawning workers which grab created files of logged events from a local temporary folder. The workers then load the events using the same asynchronous curl properties from the above emitter.

All of the worker processes are created as background processes so none of them delay the execution of the main script. Currently, they're configured to look for files inside created worker folders until there are none left and they hit their `timeout` limit, at which point the process terminates itself.

If the worker for any reason fails to successfully send a request it renames the entire file to `failed` and leaves it in the `/temp/failed-logs/` folder.

:::note
The emitter doesn't retry failed requests to the Collector. Failed requests to the Collector (for example due to it being not reachable) result in lost events.
:::

Example Emitter creation:

```php
$emitter = new FileEmitter($collector_uri, false, "POST", 2, 15, 100, "/tmp/snowplow");
```

The buffer for the file emitter works a bit differently to the other emitters in that here it refers to the number of events needed before an `events-random.log` is produced for a worker. If you are anticipating it taking a long time to reach the buffer be aware that the worker terminates itself after 75 seconds by default (15 x 5). Adjust the timeout amount in the construction of the FileEmitter if the default isn't suitable.

Constructor:

```php
public function __construct($uri, $protocol = NULL, $type = NULL, $workers = NULL, $timeout = NULL, $buffer_size = NULL, $debug = false, $log_dir = NULL)
```

Arguments:

| **Argument** | **Description** | **Required?** | **Validation** |
| --- | --- | --- | --- |
| `$uri` | Collector hostname | Yes | Non-empty string |
| `$protocol` | Collector Protocol (HTTP or HTTPS) | No | String |
| `$type` | Request Type (POST or GET) | No | String |
| `$workers` | Amount of background workers | No | Int |
| `$timeout` | Worker Timeout | No | Int or Float |
| `$buffer_size` | Amount of events to store before flush | No | Int |
| `$debug` | Whether or not to log errors | No | Boolean |
| `$log_dir` | The directory for event log and worker log subdirectories to be created in | No | String |

### Emitter debug mode

Debug mode is enabled on emitters by setting the `$debug` argument in the emitter constructor to `true`:

```php
$emitter = new SyncEmitter($collector_uri, "http", "POST", 50, true);
```

By default, debug mode creates a new directory called `/debug/` in the root of the tracker's directory. It then creates a log file with the following structure; `sync-events-log-[[random number]].log`: which is the type of emitter and a randomized number to prevent it from being accidentally overwritten.

If physically storing the information isn't possible due to not having the correct write permissions or simply not wanted it can be turned off by updating the following value in the Constants class:

```php
const DEBUG_LOG_FILES = false;
```

Now all debugging information is printed to the console.

Every time the events buffer is flushed we can see if the flush was successful. In the case of an error, it records the entire event payload the tracker was trying to send, along with the error code.

#### Event specific information

If debug mode is enabled the emitter begins storing information internally. It stores the HTTP response code and the payload for every request made by the emitter.

```php
array(
    "code" => 200,
    "data" => "{"e":"pv","url":"www.example.com","page":"example","refr":"www.referrer.com"}"
)
```

The `data` is stored as a JSON-encoded string. To locally test whether or not your emitters are successfully sending, we can retrieve this information with the following commands:

```php
$emitters = $tracker->returnEmitters(); # Store all of the emitters as an array.
$emitter = $emitters[0]; # Get the first emitter stored by the tracker
$results = $emitter->returnRequestResults();  # Return the stored results.

# Now that we have results we can work with...
print("Code: ".$results[0]["code"]);
print("Data: ".$results[0]["data"]);
```

This allows you to debug on a request by request basis to ensure that everything is being sent properly.

#### Turn debug off

As debugging stores a lot of information, we can end debug mode by calling the following command:

```php
$tracker->turnOffDebug();
```

This stops all logging activity, both to the external files and to the local arrays. We can go one step further though and pass a `true` boolean to the function. This deletes all of the tracker's associated physical debug log files as well as emptying the local arrays within each linked emitter.

```php
$tracker->turnOffDebug(true);
```
