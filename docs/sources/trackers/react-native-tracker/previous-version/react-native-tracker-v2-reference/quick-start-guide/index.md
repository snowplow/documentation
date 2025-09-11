---
title: "Quick start guide"
description: "Quick start guide for React Native v2 tracker implementation in mobile applications."
keywords: ["React Native Quick Start", "Mobile Quick Start", "Getting Started", "Setup Guide", "Installation Guide", "Mobile Setup"]
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

You will also need to add the FMDB dependency to you `ios/Podfile` (unless using Expo Go) with `modular_headers` enabled. Add this line to the end of the file:

```rb
pod 'FMDB', :modular_headers => true
```

## Instrumentation

Next, in your app create a new tracker using the `createTracker` method. As a minimal example:

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
);
```

The `createTracker` function takes as arguments:

1. **Required**: The tracker namespace, which identifies each tracker
2. **Required**: The Network configuration
3. _Optional_: The Tracker Controller configuration

The optional Tracker Controller configuration has as type definition:

```typescript
interface TrackerControllerConfiguration {
  trackerConfig?: TrackerConfiguration,
  sessionConfig?: SessionConfiguration,
  emitterConfig?: EmitterConfiguration,
  subjectConfig?: SubjectConfiguration,
  gdprConfig?: GdprConfiguration,
  gcConfig?: GCConfiguration
}
```

In other words, it provides a way for a fine grained tracker configuration.

As an example to create a tracker with all configurations provided (wherever applicable, the default values are shown):

```typescript
const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
      method: 'post',
      customPostPath: 'com.snowplowanalytics.snowplow/tp2', // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
      requestHeaders: {} // Custom headers for HTTP requests to the Collector
    },
    {
        trackerConfig: {
            appId: 'my-app-id',
            devicePlatform: 'mob',
            base64Encoding: true,
            logLevel: 'off',
            applicationContext: true,
            platformContext: true,
            geoLocationContext: false,
            sessionContext: true,
            deepLinkContext: true,
            screenContext: true,
            screenViewAutotracking: true,
            lifecycleAutotracking: false,
            installAutotracking: true,
            exceptionAutotracking: true,
            diagnosticAutotracking: false,
            userAnonymisation: false // Whether to anonymise client-side user identifiers in session and platform context entities
        },
        sessionConfig: {
            foregroundTimeout: 1800,
            backgroundTimeout: 1800
        },
        emitterConfig: {
            bufferOption: 'single',
            emitRange: 150,
            threadPoolSize: 15,
            byteLimitPost: 40000,
            byteLimitGet: 40000,
            serverAnonymisation: false // Whether to anonymise server-side user identifiers including the `network_userid` and `user_ipaddress`
        },
        subjectConfig: {
            userId: 'my-user-id',
            networkUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
            domainUserId: '7cdd5ea8-b0f5-47ea-a8bb-5ec8e98cdbd6',
            useragent: 'some-useragent-string',
            ipAddress: '123.45.67.89',
            timezone: 'Europe/London',
            language: 'en',
            screenResolution: [123, 456],
            screenViewport: [123, 456],
            colorDepth: 20
        },
        gdprConfig: {
            basisForProcessing: 'consent',
            documentId: 'my-gdpr-doc-id',
            documentVersion: '1.0.0',
            documentDescription: 'my gdpr document description'
        },
        gcConfig: [
            {
                tag: 'my-first-gc-tag',
                globalContexts: [
                    {
schema: "TechArticle"
                        data: {gcData: 'some data'}
                    },
                    {
schema: "TechArticle"
                        data: {moreGCData: 'some more data'}
                    },
                ]
            },
            {
                tag: 'another-gc-tag',
                globalContexts: [
                    {
schema: "TechArticle"
                        data: {gcProp: 'some value'}
                    },
                ]
            }
        ]
    }
);
```

## Track events

Once the tracker is initialized, you can use the tracker methods to track events, about which you can find out more in the following Tracking events section.
