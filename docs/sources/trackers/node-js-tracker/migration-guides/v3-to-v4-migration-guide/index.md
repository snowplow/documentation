---
title: "Migration Guide: Node.js Tracker v3 → v4"
sidebar_position: 1100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Version 4 is a major release with several breaking changes to defaults and behavior.

## Behavior changes

### Removed the use of the got library in favor of fetch

The tracker no longer needs the got library for making HTTP requests to the collector.
This has been replaced with the [fetch API](https://nodejs.org/dist/latest-v18.x/docs/api/globals.html).
The change has an effect on the public API of the tracker which had to previously accommodate the got library – the following change results from this.

### Removed `tracker` and `emitter` functions in favor or `newTracker`

The initialization of a tracker instance has changed – instead of initializing an emitter (using `gotEmitter`) and tracker (using `tracker`) separately, the SDK handles initialization of both using the `newTracker` call.
The `newTracker` call now accepts configuration objects for the tracker and emitter as arguments.

[See the new initialization options here.](/docs/sources/trackers/node-js-tracker/initialization/index.md)

### Dropped support for older Node.JS

The support for the following Node.JS versions has been dropped:

* Drop Node.js \<18 support
