---
title: "Installation and initialization"
description: "Initialize Node.js tracker for server-side behavioral event collection in JavaScript applications."
schema: "TechArticle"
keywords: ["Node.js Init", "Server Init", "NodeJS Setup", "Backend Setup", "Server Analytics", "Tracker Init"]
date: "2021-04-07"
sidebar_position: 1
---

The Snowplow Node.js Tracker is tested and compatible with Node.js versions from 18 to 20. Installation requires [npm](https://www.npmjs.org/), [pnpm](https://pnpm.js.org/) or [yarn](https://yarnpkg.com/).

## Installation

Setting up the tracker should be straightforward if you are familiar with npm:

```bash
npm install @snowplow/node-tracker
```

alternative you can use pnpm or yarn:

```bash
pnpm add @snowplow/node-tracker
```

```bash
yarn add @snowplow/node-tracker
```

The Snowplow Node.js Tracker is also **bundled with TypeScript types and interfaces** so will integrate easily with TypeScript applications.

## Initialization

Require the Node.js Tracker module into your code like so:

```javascript
const snowplow = require('@snowplow/node-tracker');
const tracker = snowplow.newTracker( /* ... */ );
```

or, if using ES Modules, you can import the module like so:

```javascript
import { newTracker } from '@snowplow/node-tracker';
```

The `newTracker` call takes 2 arguments – the tracker and emitter configuration. The tracker configuration specifies the tracker namespace and app name. The emitter configuration specifies how events are queued locally and sent to the Snowplow collector.

```javascript
const tracker = newTracker({
  namespace: "my-tracker", // Namespace to identify the tracker instance. It will be attached to all events which the tracker fires.
  appId: "my-app", // Application identifier
  encodeBase64: false, // Whether to use base64 encoding for the self-describing JSON. Defaults to true.
}, {
  endpoint: "https://collector.mydomain.net", // Collector endpoint
  eventMethod: "post", // Method - defaults to POST
  bufferSize: 1, // Only send events once n are buffered. Defaults to 1 for GET requests and 10 for POST requests.
});
```

There are a number of additional parameters that may optionally be configured.
Please refer to the following API docs for the full list:

1. [Tracker configuration options](https://snowplow.github.io/snowplow-javascript-tracker/docs/node-tracker/markdown/node-tracker.trackerconfiguration).
2. [Emitter configuration options](https://snowplow.github.io/snowplow-javascript-tracker/docs/node-tracker/markdown/node-tracker.emitterconfigurationbase).

### Using multiple Emitters

In case you want to send the events to multiple Snowplow collectors, you can provide a list of emitter configurations in the `newTracker` call – one for each collector.
This may look as follows.

```javascript
const tracker = newTracker({
  namespace: "my-tracker", // Namespace to identify the tracker instance. It will be attached to all events which the tracker fires.
  appId: "my-app", // Application identifier
  encodeBase64: false, // Whether to use base64 encoding for the self-describing JSON. Defaults to true.
}, [
  {
    endpoint: "https://collector1.mydomain.net", // First collector endpoint
  },
  {
    endpoint: "https://collector2.mydomain.net", // Second collector endpoint
  },
]);
```

### Create your own Emitter

Emitter is an object responsible for queuing tracked events and making requests to the Snowplow collector.

By default, the Node tracker makes use of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make the HTTP requests.
If you want to use a different library or logic for queuing and sending events, you can provide a custom `Emitter` implementation.

Emitters must conform to an [`Emitter` interface](https://github.com/snowplow/snowplow-javascript-tracker/blob/master/trackers/node-tracker/docs/markdown/node-tracker.emitter.md), which looks like:

```typescript
/**
 * Emitter is responsible for sending events to the collector.
 * It manages the event queue and sends events in batches depending on configuration.
 */
interface Emitter {
    /**
     * Forces the emitter to send all events in the event store to the collector.
     * @returns A Promise that resolves when all events have been sent to the collector.
     */
    flush: () => Promise<void>;
    /**
     * Adds a payload to the event store or sends it to the collector.
     * @param payload - A payload to be sent to the collector
     * @returns Promise that resolves when the payload has been added to the event store or sent to the collector
     */
    input: (payload: Payload) => Promise<void>;
    /**
     * Updates the collector URL to which events will be sent.
     * @param url - New collector URL
     */
    setCollectorUrl: (url: string) => void;
    /**
     * Sets the server anonymization flag.
     */
    setAnonymousTracking: (anonymous: boolean) => void;
    /**
     * Updates the buffer size of the emitter.
     */
    setBufferSize: (bufferSize: number) => void;
}
```

Once you implement your own `Emitter`, you can pass it to the `newTracker` call as follows.

```ts
export const expressTracker = newTracker(
  {
    namespace: "my-tracker",
    appId: "my-app",
  },
  {
    customEmitter: () => ({
      input: (payload) => {
        return Promise.resolve();
      },
      flush: () => {
        return Promise.resolve();
      },
      setCollectorUrl: (url) => {},
      setAnonymousTracking: (anonymous) => {},
      setBufferSize: (bufferSize) => {},
    }),
  }
);

```
