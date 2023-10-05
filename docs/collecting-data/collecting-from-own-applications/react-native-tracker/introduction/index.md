---
title: "Introduction and configuration"
date: "2021-08-06"
sidebar_position: 10
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

The Snowplow React Native Tracker is a module which imports the [Mobile Native Snowplow Trackers](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md) as native modules, available for use in React Native projects. More specifically it is built upon the [Mobile Native Trackers v5](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md), so as to leverage their tracking capabilities, API and configuration parameters.

<p>The current version is {versions.reactNativeTracker}.</p>

## Initializing a tracker

The React Native Tracker can be configured with a set of configuration objects. Once you import the module into your app, the `createTracker` function can be used to setup a tracker, which is identified internally by its namespace.

The `createTracker` function can be used to create multiple instances of the tracker in the same app. If you call it using a namespace already used, it will reconfigure the tracker with the same namespace. If you call it with a different namespace, the tracker will create a new independent tracker.

## Configuring the tracker

The configuration objects that are used to initialize a tracker are:

- `NetworkConfiguration`: **Required**. Configures the network connection with the Snowplow collector.
- `TrackerConfiguration`: **Optional**. Configures the general behavior of the tracker.
- `SessionConfiguration`: **Optional**. Configures the session behavior.
- `EmitterConfiguration`: **Optional**. Configures the way the tracker sends events to the collector.
- `SubjectConfiguration`: **Optional**. Specifies details to send with events about the user and the platform.
- `GdprConfiguration`: **Optional**. Configures the GDPR context.
- `GlobalContextsConfiguration`: **Optional**. Configures the GlobalContexts feature.

### NetworkConfiguration

Represents the network communication configuration allowing the tracker to be able to send events to the Snowplow collector.

Its type definition is:

```typescript
interface NetworkConfiguration {
  /**
   * The collector endpoint
   *  - if the protocol is not included it defaults to https
   */
  endpoint: string;

  /**
   * The Http Method to use when sending events to the collector
   * @defaultValue 'post'
   */
  method?: HttpMethod;
}
```

- **endpoint**: (**Required**). URL of the collector that is going to receive the events tracked by the tracker. The URL can include the schema/protocol (e.g.: `http://collector-url.com`). In case the URL doesn’t include the schema/protocol, the HTTPS protocol is automatically selected.
- **method**: The method used to send the requests (`'get'` or `'post'`). Default is `'post'`.

### TrackerConfiguration

Represents the configuration of the tracker and the core tracker properties. The TrackerConfiguration can be used to setup the tracker behavior indicating what should be tracked in terms of automatic tracking and contexts/entities to attach to the events.

Its type definition is:

```typescript
interface TrackerConfiguration {
  /**
   * Identifier of the app.
   */
  appId?: string;
  /**
   * The device platform the tracker runs on.
   * @defaultValue 'mob'
   */
  devicePlatform?: DevicePlatform;
  /**
   * Whether payload JSON data should be base64 encoded.
   * @defaultValue true
   */
  base64Encoding?: boolean;
  /**
   * The log level of tracker logs.
   * @defaultValue 'off'
   */
  logLevel?: LogLevel;
  /**
   * Whether application context is attached to tracked events.
   * @defaultValue true
   */
  applicationContext?: boolean;
  /**
   * Whether platform context is attached to tracked events.
   * @defaultValue true
   */
  platformContext?: boolean;
  /**
   * Whether geo-location context is attached to tracked events.
   * @defaultValue false
   */
  geoLocationContext?: boolean;
  /**
   * Whether session context is attached to tracked events.
   * @defaultValue true
   */
  sessionContext?: boolean;
  /**
   * Whether screen context is attached to tracked events.
   * @defaultValue true
   */
  screenContext?: boolean;
  /**
   * Whether enable automatic tracking of ScreenView events from the native side.
   * Only tracking UIKit views on iOS and Activity on Android are supported.
   * For tracking React Native views, see the tracker docs for manual and auto-tracking options.
   * @defaultValue false
   */
  screenViewAutotracking?: boolean;
  /**
   * Whether enable automatic tracking of background and foreground transitions.
   * @defaultValue false
   */
  lifecycleAutotracking?: boolean;
  /**
   * Whether enable automatic tracking of install event.
   * @defaultValue true
   */
  installAutotracking?: boolean;
  /**
   * Whether enable crash reporting.
   * @defaultValue true
   */
  exceptionAutotracking?: boolean;
  /**
   * Whether enable diagnostic reporting.
   * @defaultValue false
   */
  diagnosticAutotracking?: boolean;
}
```

- **appId**: Identifier of the app.
- **devicePlatform**: The device platform the app runs on. Default value: `'mob'`. Allowed platform values are:
    
    - `'mob'`: Mobile/Tablet
    - `'web'`: Web(including mobile web)
    - `'pc'`: Desktop/Laptop/Netbook
    
    - `'srv'`: Server-side app
    - `'app'`: General app
    - `'tv'`: Connected TV
    - `'cnsl'`: Games Console
    - `'iot'`: Internet of things

- **base64encoding**: It indicates whether the JSON data in the payload should be base64 encoded. Default value: `true`.
- **logLevel**: The log level of tracker logs. Default value: `'off'`. Allowed logLevel values are:
    - `'off'`
    - `'error'`
    - `'debug'`
    - `'verbose'`
- **sessionContext**: Whether session context is sent with all the tracked events. Default value: `true`.
- **applicationContext**: Whether application context is sent with all the tracked events. Default value: `true`.
- **platformContext**: Whether mobile/platform context is sent with all the tracked events. Default value: `true`.
- **geoLocationContext**: Whether geo-location context is sent with all the tracked events. Default value: `false`.
- **screenContext**: Whether screen context is sent with all the tracked events. Default value: `true`.
- **screenViewAutotracking**: Whether automatic tracking of ScreenView events from the native side (from UIKit on iOS or Activity on Android) is enabled. Default value: `false`.
- **lifecycleAutotracking**: Whether automatic tracking of background and foreground transitions is enabled. Default value: `false`.
- **installAutotracking**: Whether automatic tracking of install event is enabled. Default value: `true`.
- **exceptionAutotracking**: Whether crash reporting is enabled. Default value: `false`.

### SessionConfiguration

Represents the configuration of the Session context which gets attached to each event tracked and changes based on the timeout set for the inactivity of app when in foreground or background.

Session data is maintained for the life of the application being installed on a device. Essentially it will update if it is not accessed within a configurable timeout.

Its type definition is:

```typescript
interface SessionConfiguration {
  /**
   * The amount of time in seconds before the session id is updated while the app is in the foreground
   * @defaultValue 1800
   */
  foregroundTimeout: number;
  /**
   * The amount of time in seconds before the session id is updated while the app is in the background
   * @defaultValue 1800
   */
  backgroundTimeout: number;
}
```

- **foregroundTimeout**: The amount of time in seconds that can elapse before the session id is updated while the app is in the foreground. Default value: `1800`
- **backgroundTimeout**: The amount of time in seconds that can elapse before the session id is updated while the app is in the background. Default value: `1800`

### EmitterConfiguration

Represents the tracker configuration from the emission perspective. It can be used to setup details about how the tracker should treat the events once they have been processed but not yet sent.

Its type definition is:

```typescript
interface EmitterConfiguration {
  /**
   * The buffer option for post requests.
   * @defaultValue 'single'
   */
  bufferOption?: BufferOption;

  /**
   * Maximum number of events collected from the EventStore to be sent in a request.
   * @defaultValue 150
   */
  emitRange?: number;

  /**
   *Maximum number of threads working in parallel in the tracker to send requests.
   * @defaultValue 15
   */
  threadPoolSize?: number;

  /**
   * Maximum amount of bytes allowed to be sent in a payload in a POST request.
   * @defaultValue 40000
   */
  byteLimitPost?: number;

  /**
   * Maximum amount of bytes allowed to be sent in a payload in a GET request.
   * @defaultValue 40000
   */
  byteLimitGet?: number;
}
```

- **bufferOption**: Sets the emitter's buffer behavior concerning whether the events should be sent instantly or after the buffer has reached it’s limit. Default value: `'single'`. Allowed bufferOption values are:
    - `'single'`: Sends events instantly.
    - `'default'`: (Affects only POST method). Sets buffer limit to 10 events.
    - `'large'`: (Affects only POST method). Sets buffer limit to 25 events.
- **emitRange**: Maximum number of events collected to be sent in a request. Default value: `150`
- **threadPoolSize**: Maximum number of threads working in parallel in the tracker to send requests. Default value: `15`
- **byteLimitGet**: Maximum amount of bytes allowed to be sent in a payload in a GET request. Default value: `40000`
- **byteLimitPost**: Maximum amount of bytes allowed to be sent in a payload in a POST request. Default value: `40000`

### SubjectConfiguration

Represents the configuration of the subject. The SubjectConfiguration can be used to provide the basic information about the user.

Its type definition is:

```typescript
interface SubjectConfiguration {
  /**
   * user id
   */
  userId?: string | null;
  /**
   * network user id (UUIDv4)
   */
  networkUserId?: string | null;
  /**
   * domain user id
   */
  domainUserId?: string | null;
  /**
   * The custom user-agent. It overrides the user-agent used by default.
   */
  useragent?: string | null;
  /**
   * IP address
   */
  ipAddress?: string | null;
  /**
   * The timezone label
   */
  timezone?: string | null;
  /**
   * The language set in the device
   */
  language?: string | null;
  /**
   * The screen resolution
   */
  screenResolution?: ScreenSize | null;
  /**
   * The screen viewport size
   */
  screenViewport?: ScreenSize | null;
  /**
   * color depth (integer)
   */
  colorDepth?: number | null;
}
```

- **userId**: The custom user identifier. Commonly used for user self-identification – for example after sign in.
- **networkUserId**: Populates the `network_userid` field. Typically used to link native tracking to in-app browser events tracked using the [JavaScript Tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/index.md). Normally one would retrieve the network userid from the browser and pass it to the app. Should contain a valid UUID4 string.
- **domainUserId**: Populates the `domain_userid` field. Typically used to link native tracking to in-app browser events tracked using the [JavaScript Tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/index.md). Normally one would retrieve the domain userid from the browser and pass it to the app. Should contain a valid UUID4 string.
- **useragent**: The custom useragent. It populates the `useragent` field.
- **ipAddress**: The IP address of the user. It populates the `user_ipaddress` field.
- **timezone** (set by the tracker): The current timezone label. Populates the `os_timezone` field.
- **language** (set by the tracker): The language set in the device.
- **screenResolution** (set by the tracker): The screen resolution. The screen resolution size can be set as an array of [width, height]. Populates the event fields `dvce_screenwidth` and `dvce_screenheight`.
- **screenViewport**: The screen viewport. The screen viewport size can be set as an array of [width, height]. Populates the event fields `br_viewwidth` and `br_viewheight`.
- **colorDepth**: The color depth. Populates the `br_colordepth` field.

Information about the subject can also be set at runtime. In the "Setting the subject" section below, you can find out more about the available tracker methods to do so.

### GdprConfiguration

It represents the GDPR configuration of the tracker, and if set, the tracker will have the respective GDPR context attached to all events.

Its type definition is:

```typescript
export interface GdprConfiguration {
  /**
   * Basis for processing
   */
  basisForProcessing: Basis;
  /**
   * ID of a GDPR basis document.
   */
  documentId: string;
  /**
   * Version of the document.
   */
  documentVersion: string;
  /**
   * Description of the document.
   */
  documentDescription: string;
}
```

- **basisForProcessing**: Required. Represents the basis for processing according to GDPR. Allowed values for `basisForProcessing` are:
    - `'consent'`
    - `'contract'`
    - `'legal_obligation'`
    - `'legitimate_interests'`
    - `'public_task'`
    - `'vital_interests'`
- **documentId**: Required. The GDPR document id.
- **documentVersion**: Required. The GDPR document version.
- **documentDescription**: Required. The GDPR document description.

### GlobalContextsConfiguration

It represents the static Global Contexts which will be attached to all events. Each GlobalContext is identified by a tag and an array of custom contexts.

The relevant type definitions are:

```typescript
export interface GlobalContext {
  /**
   * tag
   */
  tag: string,
  /**
   * contexts
   */
  globalContexts: SelfDescribing[]
}

/**
 * Global Contexts configuration
 */
export type GCConfiguration = GlobalContext[];
```

Global Contexts can also be set (added or removed) at runtime. In the [Adding or removing global contexts](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/introduction/index.md#adding-or-removing-global-contexts) section below, you can find out more about the available tracker methods to do so.

## Tracker methods

### Tracking Events

The React Native Tracker can track the out-of-the-box events as the Mobile Native iOS and Android trackers. The available track methods are:

- **trackSelfDescribingEvent**
- **trackStructuredEvent**
- **trackEcommerceTransactionEvent**
- **trackScreenViewEvent**
- **trackTimingEvent**
- **trackConsentGrantedEvent**
- **trackConsentWithdrawnEvent**
- **trackPageViewEvent**

You can find out about all available track methods with details and examples in the [Tracking events](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/tracking-events/index.md) section that follows.

### Adding or removing global contexts

Each set of global contexts is identified by a tag. Through the tag it is possible to add or remove GlobalContexts at runtime. The tracker methods to do so are:

- **addGlobalContexts**
- **removeGlobalContexts**

You can find out more information and examples about how to add or remove global contexts [here](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/tracking-events/index.md#global-contexts).

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

You can find out more on how to use the tracker's methods to set the subject information at runtime in the corresponding [Tracking events section](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/tracking-events/index.md#setting-the-subject-data).

### Getting session context data from the tracker

You can also get back session data from the tracker at runtime, that may be useful for your tracking and data modeling design. The available methods are:

- **getSessionUserId**: To get the session user identifier.
- **getSessionId**: To get the session identifier.
- **getSessionIndex**: To get the session index.
- **getIsInBackground**: To get whether the app is currently in background state or not.
- **getBackgroundIndex**: To get the number of background transitions in the current session.
- **getForegroundIndex**: To get the number of foreground transitions in the current session.

You can find out more on how to use the tracker's methods to get session data at runtime in the corresponding [Advanced Usage section](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/advanced-usage/index.md#getting-session-data-from-the-tracker).

## Removing a tracker

The React Native Tracker API also provides functions to remove a tracker or remove all trackers at runtime. You can find out how in the [Advanced Usage section](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/advanced-usage/index.md#removing-a-tracker-at-runtime) of the React Native Tracker.
