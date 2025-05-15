---
title: "Initialization"
date: "2020-02-26"
sidebar_position: 200
---

Assuming you have completed the [Node.js Tracker Setup](/docs/sources/trackers/node-js-tracker/previous-versions/node-js-tracker-0-3-0/setup/index.md) for your project, you are now ready to initialize the Tracker.

Require the Node.js Tracker module into your code like so:

```javascript
var snowplow = require('snowplow-tracker');
var emitter = snowplow.emitter;
var tracker = snowplow.tracker;
```

First, initialize an emitter instance. This object will be responsible for how and when events are sent to Snowplow.

```javascript
var e = emitter(
  'myscalastreamcollector.net', // Collector endpoint
  'http', // Optionally specify a method - http is the default
  8080, // Optionally specify a port
  'POST', // Method - defaults to GET
  5, // Only send events once n are buffered. Defaults to 1 for GET requests and 10 for POST requests.
  function (error, body, response) { // Callback called for each request
    if (error) {
      console.log("Request to Scala Stream Collector failed!");
    }
  },
  { maxSockets: 6 } // Node.js agentOptions object to tune performance
);
```

Note that last emitter's argument [`agentOptions`](https://nodejs.org/api/http.html#http_new_agent_options) is default configuration object for Node.js HTTP module. It required to constrain `maxSockets` for bulk loads, which otherwise can lead to event loss.

Initialise a tracker instance like this:

```javascript
var t = tracker([e], 'myTracker', 'myApp', false);
```

The `tracker` function takes four parameters:

- An array of emitters to which the tracker will hand Snowplow events
- An optional tracker `namespace` which will be attached to all events which the tracker fires, allowing you to identify their origin
- The `appId`, or application ID
- `encodeBase64`, which determines whether unstructured events and custom contexts will be base 64 encoded (by default they are).
