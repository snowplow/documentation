---
title: "React Native tracker"
date: "2020-07-09"
sidebar_position: 120
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import BadgeGroup from '@site/src/components/BadgeGroup';
import {versions} from '@site/src/componentVersions';

<BadgeGroup>
<Badges badgeType="Actively Maintained"></Badges>
<Badges badgeType="React Native Tracker Release"></Badges>
<Badges badgeType="Snowplow Tracker React Native Release"></Badges>
</BadgeGroup>
```

The Snowplow React Native Tracker is purely implemented in JavaScript/TypeScript without the use of native iOS/Android modules. This enables it to support all these platforms and frameworks:

- React Native for mobile and Web
- Expo bare and managed workflow

<p>The current version is {versions.javaScriptTracker}.</p>

## Initializing a tracker

The React Native Tracker can be configured with a set of configuration objects. Once you import the module into your app, the `newTracker` function can be used to setup a tracker, which is identified internally by its namespace.

The `newTracker` function can be used to create multiple instances of the tracker in the same app. If you call it using a namespace already used, it will reconfigure the tracker with the same namespace. If you call it with a different namespace, the tracker will create a new independent tracker.

```typescript
import { newTracker } from '@snowplow/react-native-tracker';

const tracker = newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
});
```

## Configuring the tracker

The `newTracker` provides a wide range of optional configuration options that let you configure the autotracking functionality of the tracker, specify how requests to the collector should be constructed and much more.
The following snippet shows an overview of all the options and their meaning:

```typescript
const tracker = newTracker({
    // Network configuration:
    // Represents the network communication configuration allowing the tracker to be able to send events to the Snowplow collector.

    // URL of the collector that is going to receive the events tracked by the tracker. The URL can include the schema/protocol (e.g.: `http://collector-url.com`). In case the URL doesn’t include the schema/protocol, the HTTPS protocol is automatically selected.
    endpoint: COLLECTOR_URL,
    // HTTP method to use for the requests ('get' or 'post')
    eventMethod: 'post',
    // A custom path which will be added to the endpoint URL to specify the complete URL of the collector when paired with the POST method.
    postPath: 'com.snowplowanalytics.snowplow/tp2',
    // Custom headers for HTTP requests to the Collector
    customHeaders: {},

    // Tracker configuration:
    // Represents the configuration of the tracker and the core tracker properties indicating what should be tracked in terms of automatic tracking and contexts/entities to attach to the events.

    // Identifies the tracker instance
    namespace: "sp1",
    // Identifies the application
    appId: 'my-app-id',
    // Version of the application (e.g., semver or git commit hash)
    appVersion: '1.0.0',
    // Build number of the application
    appBuild: '1',
    // Platform of the device, allowed options are:
    // - `'mob'`: Mobile/Tablet
    // - `'web'`: Web(including mobile web)
    // - `'pc'`: Desktop/Laptop/Netbook
    // - `'srv'`: Server-side app
    // - `'app'`: General app
    // - `'tv'`: Connected TV
    // - `'cnsl'`: Games Console
    // - `'iot'`: Internet of things
    devicePlatform: 'mob',
    // Whether to base64 encode self-describing event and entity data
    encodeBase64: false,
    // Tracks a deep link entity with the first screen view following a deep link received event
    deepLinkContext: true,
    // Tracks a screen entity referring to the last screen view event
    screenContext: true,
    // Tracks foreground, background events and a lifecycle entity with the app state
    lifecycleAutotracking: true,
    // Tracks an install event on the first start
    installAutotracking: false,
    // Tracks screen_end event and screen_summary entity with information about the screen activity
    screenEngagementAutotracking: true,

    // Platform context configuration:
    // Tracks an entity with information about the device
    platformContext: true,
    // Chooses which optional properties of the platform context to track
    platformContextProperties: [
        PlatformContextProperty.Carrier,
        PlatformContextProperty.Language
    ],
    // Provides custom functions to retrieve the platform context information
    platformContextRetriever: {
        getAppAvailableMemory: () => Promise.resolve(1024),
    },

    // Tracker plugins – An array of plugins to be used by the tracker
    plugins: [SnowplowEcommercePlugin()],

    // Session configuration:
    // Represents the configuration of the Session context which gets attached to each event tracked and changes based on the timeout set for the inactivity of app when in foreground or background.

    // Whether to track session information
    sessionContext: true,
    // Timeout for the session when app is in foreground
    foregroundSessionTimeout: 1800,
    // Timeout for the session when app is in background
    backgroundSessionTimeout: 1800,

    // Emitter configuration:
    // Represents the tracker configuration from the emission perspective. It can be used to setup details about how the tracker should treat the events once they have been processed but not yet sent.

    // Number of events to buffer before making a request to collector
    bufferSize: 1,
    // Max size of POST requests
    maxPostBytes: 40000,
    // Max size of GET requests
    maxGetBytes: 40000,
    // Whether to anonymise server-side user identifiers including the `network_userid` and `user_ipaddress`
    serverAnonymization: false,
    // The maximum amount of events that will be buffered in the event store
    maxEventStoreSize: 1000,
    // Whether to use AsyncStorage for event store persistence or an in-memory event store
    useAsyncStorageForEventStore: true,

    // Subject configuration:
    // Represents the configuration of the subject. The SubjectConfiguration can be used to provide the basic information about the user.

    // The custom user identifier. Commonly used for user self-identification – for example after sign in
    userId: 'my-user-id',
    // Override the `network_userid` field assigned by collector. Should contain a valid UUID4 string.
    networkUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    // Populates the `domain_userid` field, which is a user identifier generated and tracked by the JavaScript tracker on Web. Should contain a valid UUID4 string.
    domainUserId: '7cdd5ea8-b0f5-47ea-a8bb-5ec8e98cdbd6',
    // The custom useragent. It populates the `useragent` field.
    useragent: 'some-useragent-string',
    // The IP address of the user. It populates the `user_ipaddress` field.
    ipAddress: '123.45.67.89',
    // The current timezone label. Populates the `os_timezone` field.
    timezone: 'Europe/London',
    // The language set in the device.
    language: 'en',
    // The screen resolution. The screen resolution size can be set as an array of [width, height]. Populates the event fields `dvce_screenwidth` and `dvce_screenheight`.
    screenResolution: [123, 456],
    // The screen viewport. The screen viewport size can be set as an array of [width, height]. Populates the event fields `br_viewwidth` and `br_viewheight`.
    screenViewport: [123, 456],
    // The color depth. Populates the `br_colordepth` field.
    colorDepth: 20,
});
```

To learn more about the specific parts of the configuration and autotracked information, see:

- [Platform and application context entities.](/docs/sources/trackers/react-native-tracker/tracking-events/platform-and-application-context/index.md)
- [Session tracking.](/docs/sources/trackers/react-native-tracker/tracking-events/session-tracking/index.md)
- [App lifecycle tracking.](/docs/sources/trackers/react-native-tracker/tracking-events/lifecycle-tracking/index.md)
- [Screen tracking.](/docs/sources/trackers/react-native-tracker/tracking-events/screen-tracking/index.md)
- [Installation tracking.](/docs/sources/trackers/react-native-tracker/tracking-events/installation-tracking/index.md)

## Tracker methods

### Tracking events

The React Native Tracker can track a range of out-of-the-box events. As an example, the following snippet tracks a screen view event:

```ts
tracker.trackScreenViewEvent({
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',
    transitionType: 'basic'
});
```

The available events are:

- [Self-describing events.](/docs/sources/trackers/react-native-tracker/custom-tracking-using-schemas/index.md)
- [Structured events.](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#tracking-structured-events)
- [Screen view events.](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#tracking-screen-view-events)
- [Page view events.](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#tracking-page-view-events)
- [Timing events.](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#tracking-timing-events)

You can find out about all available track methods with details and examples in the [Tracking events](/docs/sources/trackers/react-native-tracker/tracking-events/index.md) section that follows.

### Adding or removing global contexts

Global context lets you define your own context entities once and then have them sent with every single event subsequently recorded in the app.
This saves having to manually build and send the context array with every single event fired and enables you to add entities to autotracked events.

The tracker methods to do so are:

- **addGlobalContexts**
- **removeGlobalContexts**
- **clearGlobalContexts**

You can find out more information and examples about [how to add or remove global contexts here](/docs/sources/trackers/react-native-tracker/custom-tracking-using-schemas/global-context/index.md).

### Setting the Subject

It is possible to change subject data at runtime, as the user journey evolves. Once initialized, the React Native tracker provides the methods to do so for each subject property:

- **setUserId**
- **setNetworkUserId**
- **setDomainUserId**
- **setIpAddress**
- **setUseragent**
- **setTimezone**
- **setLanguage**
- **setScreenResolution**
- **setScreenViewport**
- **setColorDepth**

Alternatively, you can use the **setSubjectData** method to provide a new SubjectConfiguration.

You can find out more on how to use the tracker's methods to [set the subject information at runtime here](/docs/sources/trackers/react-native-tracker/client-side-properties/index.md).

### Getting session context data from the tracker

You can also get back session data from the tracker at runtime, that may be useful for your tracking and data modeling design. The available methods are:

- **getSessionUserId**: To get the session user identifier.
- **getSessionId**: To get the session identifier.
- **getSessionIndex**: To get the session index.
- **getIsInBackground**: To get whether the app is currently in background state or not.
- **getBackgroundIndex**: To get the number of background transitions in the current session.
- **getForegroundIndex**: To get the number of foreground transitions in the current session.

You can find out more on how to use the tracker's methods to get session data at runtime in the corresponding [Advanced Usage section](/docs/sources/trackers/react-native-tracker/advanced-usage/index.md#getting-session-data-from-the-tracker).

## Removing a tracker

The React Native Tracker API also provides functions to remove a tracker or remove all trackers at runtime. You can find out how in the [Advanced Usage section](/docs/sources/trackers/react-native-tracker/advanced-usage/index.md#removing-a-tracker-at-runtime) of the React Native Tracker.
