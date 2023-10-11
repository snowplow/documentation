---
title: "Initialization"
date: "2020-09-03"
sidebar_position: 200
---

Assuming you have completed the [Node.js Tracker Setup](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/node-js-tracker/node-js-tracker/node-js-tracker-0-4-0/setup/index.md) for your project, you are now ready to initialize the Tracker.

Require the Node.js Tracker module into your code like so:

```javascript
var snowplow = require('snowplow-tracker');
var gotEmitter = snowplow.gotEmitter;
var tracker = snowplow.tracker;
```

or, if using ES Modules, you can import the module like so:

```javascript
import { tracker, gotEmitter } from 'snowplow-tracker';
```

### Configure Emitter

First, initialize an emitter instance. The Snowplow Node.js Tracker is bundled with an emitter based on the `got` library. This emitter will be responsible for how and when events are sent to Snowplow.

`got` only works on Node.js applications and does not have browser support, if the `got` library isn't suitable for your project you can [create your own emitter as described below](#create-your-own-emitter).

A simple set up of this emitter might look like:

```javascript
var e = gotEmitter(
  'collector.mydomain.net', // Collector endpoint
  snowplow.HttpProtocol.HTTPS, // Optionally specify a method - http is the default
  8080, // Optionally specify a port
  snowplow.HttpMethod.POST, // Method - defaults to GET
  5 // Only send events once n are buffered. Defaults to 1 for GET requests and 10 for POST requests.
);
```

There are a number of additional parameters that the `gotEmitter` allows to be configured which are passed to the underlying `got` library which this emitter is built on.

The full set of `gotEmitter` parameters can be found in our [API Documentation](https://snowplow.github.io/snowplow-nodejs-tracker/modules/_got_emitter_.html#gotemitter). A complete example might look like:

```javascript
const e = snowplow.gotEmitter(
  'collector.mydomain.net', // Endpoint
  snowplow.HttpProtocol.HTTP, // Protocol
  8080, // Port
  snowplow.HttpMethod.POST, // Method
  1, // Buffer Size
  5, // Retries
  cookieJar, // cookieJar from tough-cookie library
  function (error, response) { // Callback called for each request
    if (error) {
      console.log(error, 'Request error');
    } else {
      console.log('Event Sent');
    }
  },
  { 
    http: new http.Agent({ maxSockets: 6 }),
    https: new https.Agent({ maxSockets: 6 })
  } // Node.js agentOptions object to tune performance
```

### Configuring Tracker

Initialise a tracker instance like this:

```javascript
var t = tracker([e], 'myTracker', 'myApp', false);
```

The `tracker` function takes four parameters:

- An array of emitters to which the tracker will hand Snowplow events
- An optional tracker `namespace` which will be attached to all events which the tracker fires, allowing you to identify their origin
- The `appId`, or application ID
- `encodeBase64`, which determines whether unstructured events and custom contexts will be base 64 encoded (by default they are).

### Create your own Emitter

The `gotEmitter` is built against a standard `Emitter` interface which means if `got` isn't suitable for your project then you can create your own `Emitter`.

As an example where this might be useful, as `got` only works in Node.js applications if you wanted to track on a browser based application and you have already considered the [Snowplow JavaScript Tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/index.md), then you can build your own Emitter - two libraries which might be appropriate are `[ky](https://github.com/sindresorhus/ky)` (built by the same team as `got`) or `[axios](https://github.com/axios/axios)`.

Emitters must conform to an [`Emitter` interface](https://snowplow.github.io/snowplow-nodejs-tracker/interfaces/_emitter_.emitter.html), which looks like:

```typescript
interface Emitter {
  flush: () => void;
  input: (payload: PayloadDictionary) => void;
}
```

You can see the implementation of the `gotEmitter` [here](https://github.com/snowplow/snowplow-nodejs-tracker/blob/0.4.0/src/got_emitter.ts).

Once your emitter has been initialised you can inject it into the `tracker` just as you would do with the `gotEmitter`. We are also open to PR's which contain additional emitters.
