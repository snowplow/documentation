---
title: "Migrating from v0 to v1"
description: "Migration guide for upgrading React Native tracker from version 0.x to 1 with foundational improvements."
schema: "TechArticle"
keywords: ["React Native Migration", "V0 to V1", "Version Migration", "Upgrade Guide", "Migration Guide", "Breaking Changes"]
date: "2021-08-09"
sidebar_position: 200
---

This sections describes the differences between v0.2.0 and [v1.0.0](/docs/sources/trackers/react-native-tracker/index.md) of the Snowplow React Native Tracker and the steps needed to upgrade, which is also recommended.

The v1 introduces a new API for initializing and configuring a tracker, which is a breaking change from v0. There are also few more changes to consider, for which you will find a dedicated section below.

In the following sections we assume a starting version of 0.2.0. If you have instrumented a tracker version prior to v0.2.0, you can begin from the [React Native Tracker v0 reference](/docs/sources/trackers/react-native-tracker/previous-version/react-native-tracker-v0-reference/index.md) page first.

## Tracker initialization

In the v1 of the React Native Tracker, a tracker is configured with a set of configuration objects, about which you can find detailed information [here](/docs/sources/trackers/react-native-tracker/index.md).

The `createTracker` function now accepts 3 arguments:

1. **Required** - The tracker namespace
2. **Required** - The NetworkConfiguration
3. _Optional_ - The TrackerControllerConfiguration

In the following examples, the changes needed are described:

### Required arguments

**v0.2.0**

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker(
    'my-tracker-namespace',
    {
        endpoint: 'my-endpoint.com',
        appId: 'my-app-id'
    }
);
```

**v1.0.0**

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker(
    'my-tracker-namespace',
    {
      endpoint: 'my-endpoint.com',
    },
    {
        trackerConfig: {
            appId: 'my-app-id'
        }
    }
);
```

**Note**: The `appId` is **not** a required argument for v1. It is only included in the examples, since it was a required argument for v0.2.0.

### Endpoint

In v0.2.0, the collector URL cannot include the schema/protocol, which can be configured using the `protocol` property (which defaults to HTTPS).

In v1, the `protocol` property has been removed. The collector URL can include the schema/protocol (e.g.: `http://collector-url.com`). In case the URL doesn't include the schema/protocol, the HTTPS protocol is automatically selected.

**v0.2.0 - example http**

```typescript
const tracker = createTracker(
    'my-tracker-namespace',
    {
        endpoint: 'my-endpoint.com',
        protocol: 'http',
        appId: 'my-app-id'
    }
);
```

**v1.0.0 - example http**

```typescript
const tracker = createTracker(
    'my-tracker-namespace',
    {
      endpoint: 'http://my-endpoint.com',
    },
    {
        trackerConfig: {
            appId: 'my-app-id'
        }
    }
);
```

### Initialization options

The tracker initialization options in v0.2.0 are fairly limited compared to the ones [available for v1](/docs/sources/trackers/react-native-tracker/quick-start-guide/index.md#instrumentation).

The following example depicts how to map the configuration options of v0.2.0 to v1 configuration.

**v0.2.0**

```typescript
const tracker = createTracker('my-namespace', {
    endpoint: 'my-endpoint.com',
    appId: 'my-app-id',
    method: 'post',
    base64Encoded: true,     // (a)
    platformContext: true,
    applicationContext: true,
    sessionContext: true,
    screenContext: true,
    foregroundTimeout: 600,  // (b)
    backgroundTimeout: 300,  // (c)
    checkInterval: 15,       // (d)
    lifecycleEvents: true,   // (e)
    installTracking: true    // (f)
  }
);
```

**v1.0.0**

```typescript
const tracker = createTracker(
    'my-namespace',
    {
        endpoint: 'my-endpoint.com'
        method: 'post'
    },
    {
        trackerConfig: {
            appId: 'my-app-id',
            base64Encoding: true,    // (a)
            platformContext: true,
            applicationContext: true,
            sessionContext: true,
            screenContext: true,
            lifecycleAutotracking: false,  // (e)
            installAutotracking: true,     // (f)
        },
        sessionConfig: {
            foregroundTimeout: 1800,  // (b)
            backgroundTimeout: 1800   // (c)
        }
    }
);
```

- **(a)** - Renamed `base64Encoded` to `base64Encoding`, which becomes a `TrackerConfig` property
- **(b)** - Default value change for `foregroundTimeout`, which becomes a `SessionConfig` property
- **(c)** - Default value change for `backgroundTimeout`, which becomes a `SessionConfig` property
- **(d)** - `checkInterval` is removed
- **(e)** - Renamed `lifecycleEvents` to `lifecycleAutotracking`
- **(f)** - Renamed `installTracking` to `installAutotracking`

## Tracking events

Generally, the tracking methods of v1 continue to have the same argument logic:

```typescript
// pseudocode
tracker.track..(eventData, eventContexts);
```

The differences are about the eventData properties, where they now match the corresponding schema properties. This affects:

### `trackScreenViewEvent`

**v0.2.0**

```typescript
tracker.trackScreenViewEvent({
  screenName: 'my-screen-name',   // (a)
  screenType: 'carousel',         // (b)
  transitionType: 'basic'
});
```

**v1.0.0**

```typescript
tracker.trackScreenViewEvent({
    name: 'my-screen-name',                      // (a)
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',                            // (b)
    previousName: 'previous-screen',
    previousId: '00d71340-342e-4f3d-b9fd-4de728ffba7a',
    previousType: 'feed',
    transitionType: 'basic'
});
```

Apart from the fact that more ScreenViewEvent properties are available, the changes to v0.2.0 ScreenViewEvent properties are:

- **(a)** - `screenName` becomes `name`
- **(b)** - `screenType` becomes `type`

### `trackPageViewEvent`

**v0.2.0**

```typescript
tracker.trackPageViewEvent({
  pageUrl: 'https://my-url.com',
  pageTitle: 'My page title',
  pageReferrer: 'http://some-other-url.com'  // (a)
});
```

**v1.0.0**

```typescript
tracker.trackPageViewEvent({
  pageUrl: 'https://my-url.com',
  pageTitle: 'My page title',
  referrer: 'http://some-other-url.com'      // (a)
});
```

The changes to v0.2.0 PageViewEvent properties are:

- **(a)** - `pageReferrer` becomes `referrer`

## Setting the subject

In v1.0.0, setting the subject can be done both when configuring the tracker (through the [SubjectConfiguration](/docs/sources/trackers/react-native-tracker/index.md#subjectconfiguration) object) and at runtime ([using the `set..` tracker methods](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#setting-the-subject-data)), so the exact migration steps depend on the specifics of your app.

A notable difference between the SubjectConfiguration properties of v1.0.0 from the `SubjectData` properties of v0.2.0 is the way to set screen dimensions either for the screen resolution or for the screen viewport.

**v0.2.0**

```typescript
tracker.setSubjectData({
    screenWidth: 111,
    screenHeight: 222,
    viewportWidth: 333,
    viewportHeight: 444
});
```

**v1.0.0**

```typescript
tracker.setSubjectData({
    screenResolution: [111, 222],
    screenViewport: [333, 444]
});

// or, through more specific methods
tracker.setScreenResolution([111, 222]);
tracker.setScreenViewport([333, 444]);
```

In v1.0.0, the screen dimensions are not specified separately. Instead, the ScreenSize is represented through an array: `[width, height]`.

## Installation considerations for iOS

Because of a version mismatch [issue](https://github.com/snowplow-incubator/snowplow-react-native-tracker/issues/110) that existed in v0.2.0 between the package version and the podspec version of the React Native Tracker, the following steps are needed in order to make sure the RNSnowplowTracker Pod references the new v1.0.0.

```bash
# remove olds Pods and Podfile.lock
rm -rf Pods
rm Podfile.lock

# clean the caches
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# deintegrate
pod deintegrate

# setup
pod setup

# install pods
pod install
```
