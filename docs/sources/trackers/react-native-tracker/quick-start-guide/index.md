---
title: "React Native tracker quick start guide"
sidebar_label: "Quick start guide"
date: "2021-08-06"
sidebar_position: 0
---

[![Tracker Maintenance Classification](https://img.shields.io/static/v1?style=flat&label=Snowplow&message=Actively%20Maintained&color=6638b8&labelColor=9ba0aa&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAeFBMVEVMaXGXANeYANeXANZbAJmXANeUANSQAM+XANeMAMpaAJhZAJeZANiXANaXANaOAM2WANVnAKWXANZ9ALtmAKVaAJmXANZaAJlXAJZdAJxaAJlZAJdbAJlbAJmQAM+UANKZANhhAJ+EAL+BAL9oAKZnAKVjAKF1ALNBd8J1AAAAKHRSTlMAa1hWXyteBTQJIEwRgUh2JjJon21wcBgNfmc+JlOBQjwezWF2l5dXzkW3/wAAAHpJREFUeNokhQOCA1EAxTL85hi7dXv/E5YPCYBq5DeN4pcqV1XbtW/xTVMIMAZE0cBHEaZhBmIQwCFofeprPUHqjmD/+7peztd62dWQRkvrQayXkn01f/gWp2CrxfjY7rcZ5V7DEMDQgmEozFpZqLUYDsNwOqbnMLwPAJEwCopZxKttAAAAAElFTkSuQmCC)](/docs/sources/trackers/tracker-maintenance-classification/index.md)
[![Latest tracker version](https://img.shields.io/npm/v/@snowplow/react-native-tracker)](https://www.npmjs.com/package/@snowplow/react-native-tracker)
[![Supported React Native versions](https://img.shields.io/npm/dependency-version/@snowplow/react-native-tracker/peer/react-native)](https://www.npmjs.com/package/@snowplow/react-native-tracker)

In order to start sending events using the Snowplow React Native Tracker, the following steps are involved:

## Installation

To install the tracker, add it as a dependency to your React Native app:

```bash
npm install --save @snowplow/react-native-tracker
```

Note that in addition to `react` and `react-native`, the tracker has two peer dependencies that need to be added as dependencies to your app:

1. `@react-native-async-storage/async-storage` for event and session local storage implementation.
2. `react-native-get-random-values` as a polyfill for the Crypto Web APIs.

## Instrumentation

Next, in your app create a new tracker using the `newTracker` method. As a minimal example:

```typescript
import { newTracker } from '@snowplow/react-native-tracker';

const tracker = newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
});
```

The `newTracker` function takes the tracker configuration as the only argument. There are two required properties within the configuration:

1. The tracker namespace, which identifies each tracker instance.
2. The collector URL endpoint.

## Track events

Once the tracker is initialized, you can use the tracker methods to track events, about which you can find out more in the following Tracking events section.
As an example, you can track a screen view event like this:

```ts
tracker.trackScreenViewEvent({
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',
    transitionType: 'basic'
});
```
