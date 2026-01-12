---
title: "React Native Tracker v0 reference"
sidebar_label: "React Native Tracker v0 reference"
date: "2021-08-09"
sidebar_position: 300
sidebar_custom_props:
  outdated: true
description: "Reference documentation for React Native tracker v0 with installation, configuration, and tracking methods for iOS and Android."
keywords: ["react native tracker v0", "legacy tracker", "v0 reference"]
---

This documentation page is about a previous version of the React Native tracker. [Go to the latest docs](/docs/sources/react-native-tracker/index.md).

The Snowplow React Native Tracker is a module which imports the Native Snowplow [iOS](/docs/sources/mobile-trackers/previous-versions/objective-c-tracker/index.md) and [Android](/docs/sources/mobile-trackers/previous-versions/android-tracker/index.md) trackers as native modules, available for use in React Native projects.

## Getting Started

### Installation

Install the tracker with:

```bash
npm install @snowplow/react-native-tracker --save
```

### Quickstart Guide

Minimal setup – initialise the tracker and track a screen view:

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker('namespace', {
  endpoint: 'my-endpoint.com',
  appId: 'my-app-id'
});

tracker.trackScreenViewEvent({screenName: 'myScreenName'});
```

#### Quick migration from 0.1.x

In the previous 0.1.x releases, initializing the tracker was done differently. As an example describing the API change for a quick migration to v0.2.0:

```typescript
/* Previous API (v0.1.x)
import Tracker from '@snowplow/react-native-tracker';                       // (a)

const initPromise = Tracker.initialize({                                    // (b)
  endpoint: 'my-endpoint.com',
  namespace: 'my-namespace',
  appId: 'my-app-id'
});
initPromise                                                                 // (c)
  .then(() => Tracker.trackScreenViewEvent({screenName: 'myScreenName'}));  // (d)
*/ /* --- Vs --- */
/* Current API (v0.2.0) */
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker('namespace', {
  endpoint: 'my-endpoint.com',
  appId: 'my-app-id'
});
tracker.trackScreenViewEvent({screenName: 'myScreenName'});
```

In short:

- (a) The previous `Tracker` class has been removed. Instead of `Tracker.initialize`, use the `createTracker` function instead.
- (b) The tracker `namespace` is now a required initialization parameter outside the tracker configuration object.
- (c) In v0.2.0 there is no need to await tracker initialization, since async issues are now handled internally.
- (d) The `track..` methods are now properties of the tracker object instead of static class methods.

### What’s next?

#### Automatic Tracking Features

Many of the automatic tracking options available on iOS and Android are also available in React Native – these can be enabled in the configuration passed to `createTracker`. For example, to set up tracking of lifecycle events, with the mobile context and session context enabled:

```typescript
import { createTracker } from '@snowplow/react-native-tracker';

const tracker = createTracker('my-namespace', {
  endpoint: 'my-endpoint.com',
  appId: 'my-app-id',
  lifecycleEvents: true,
  platformContext: true,
  sessionContext: true
});
```

See the configuration section below for a full list of options.

### Examples

#### Tracking custom events

Custom events may be tracked using the `trackSelfDescribingEvent()` method:

```typescript
tracker.trackSelfDescribingEvent({
  schema: 'iglu:com.acme/example/jsonschema/1-0-0',
  data: {someExampleField: 'Hello World'}
});
```

See Custom Event Tracking Section below for more detail.

#### Attaching Entities to events

All tracker methods take two arguments: A JSON of key-value pairs for the event’s properties, and an optional array of contexts, i.e. of self-describing JSONs to be attached as entities. For example:

```typescript
tracker.trackScreenViewEvent(
   { screenName: 'myScreenName' },
   [
     {
       schema: 'iglu:com.acme/example_entity/jsonschema/1-0-0',
       data: {someOtherExampleField: 'Foo Bar Baz'}
     },
   ]
 );

 tracker.trackSelfDescribingEvent(
   {
     schema: 'iglu:com.acme/example_event/jsonschema/1-0-0',
     data: {someExampleField: 'Hello World'}
   },
   [
     {
       schema: 'iglu:com.acme/example_entity/jsonschema/1-0-0',
       data: {someOtherExampleField: 'Foo Bar Baz'}
     },
   ]
 );
```

An empty array is acceptable, which will attach no entities to the event.

## Features

### Configuration

#### Initialisation Options

`createTracker()` will instantiate an Emitter and Tracker instance of the native tracker in the app. It takes as arguments:

- the tracker namespace
- the tracker configuration object

```typescript
const tracker = createTracker('my-namespace', {
  // required
  endpoint: 'my-endpoint.com',
  appId: 'my-app-id',

  // optional
  method: 'post',
  protocol: 'https',
  platformContext: true,
  base64Encoded: true,
  applicationContext: true,
  lifecycleEvents: true,
  screenContext: true,
  sessionContext: true,
  foregroundTimeout: 600,
  backgroundTimeout: 300,
  checkInterval: 15,
  installTracking: true
  }
);
```

#### Tracker configuration

**Required properties**

- `endpoint`: (string) – The Snowplow collector endpoint – omit the protocol.
- `appId`: (string) – The app ID. Used to identify the environment being tracked.

**Optional properties**

- `method`: (`'get'` or `'post'`) – The HTTP method for requests. Default is `'post'`.
- `protocol`: (`'http'` or `'https'`) – The HTTP protocol for requests. Default is `'https'`.
- `base64Encoded`: (boolean) – Base64 encode custom events and contexts before sending. Default is `true`.
- `platformContext`: (boolean) – Attach the [platform context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema/1-0-1) to all events – aka mobile context. The platform context contains operating system and device information, as well as the IDFV/IDFA values, if the app is configured to collect these. Default is `true`.
- `applicationContext`: (boolean) – Attach the [application context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/application/jsonschema/1-0-0) to all events. The application context contains app version and build number. Default is `true`.
- `screenContext`: (boolean) – Attach the [screen context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all events. The screen context contains information about the current and previous screen, along with a screen view id, which is incremented on every screen view event, and can be used to aggregate events to a screen view level in modeling. It is a similar concept to the page view id on web. Default is `true`.
- `sessionContext`: (boolean) – Attach the [client session context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-1) to all events. The client session context contains session ID and session index, which can be used to aggregate events to session level in modeling. This context also contains tracker-generated UUID for user identification. This UUID is generated on install of the app. Default is `true`.
- `foregroundTimeout`: (integer) – Where sessionContext is enabled, configures the period (in seconds) of inactivity while the app is in the foreground before a new session (ie a new session ID) is created. Defaults to `600` (ten minutes).
- `backgroundTimeout`: (integer) – Where sessionContext is enabled, configure the period (in seconds) of inactivity while the app is in the background before a new session (ie a new session ID) is created. Defaults to `300` (five minutes).
- `checkInterval`: (integer) – Where sessionContext is enabled, configure the frequency (in seconds) with which the tracker performs a check for whether or not the foreground or background timeout has elapsed. Defaults to `15`.
- `lifecycleEvents`: (boolean) – Track app lifecycle events, such as foreground and background events. Default is `false`.
- `installTracking`: (boolean) – Track app install events. Defaults is `false`.

#### Setting the Subject

The subject is a persistent object containing global data that applies to all events, such as a manually set userId. Set the subject data using the `setSubjectData()` method. All parameters are optional.

```typescript
tracker.setSubjectData({
  userId: 'my-user-id',
  screenWidth: 123,
  screenHeight: 456,
  colorDepth: 20,
  timezone: 'Europe/London',
  language: 'en',
  ipAddress: '123.45.67.89',
  useragent: '[some-user-agent-string]',
  networkUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
  domainUserId: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
  viewportWidth: 123,
  viewportHeight: 456
});
```

#### Subject properties

- `userId`: (string) – Manually defined userId. Commonly used for user self-identification – for example after sign in. To unset the userid, pass a null value to this argument.
- `screenWidth`: (integer) – Overwrites the `dvce_screenwidth` field. Must be accompanied by `screenHeight`.
- `screenHeight`: (integer) – Overwrites the `dvce_screenheight` field. Must be accompanied by `screenWidth`.
- `viewportWidth`: (integer) – Overwrites the `br_viewwidth` field. Must be accompanied by `viewportHeight`.
- `viewportHeight`: (integer) – Overwrites the `br_viewheight` field. Must be accompanied by `viewportWidth`.
- `colorDepth`: (integer) – Populates the `br_colordepth` field.
- `timezone`: (string) – Overwrites the `os_timezone` field. Should contain a valid database timezone code.
- `language`: (string) – Overwrites the `br_lang` field. Should contain a valid ISO standard language code.
- `ipAddress`: (string) – Overwrites the `user_ipaddress` field. Should contain a valid IP address.
- `useragent`: (string) – Overwrites the `useragent` field. Should be a valid useragent string.
- `networkUserId`: (string) – Populates the `network_userid` field. Typically used to link native tracking to in-app browser events tracked using the javascript Normally one would retrieve the network userid from the browser and pass it to the app. Should contain a valid UUID4 string.
- `domainUserId`: (string) – Populates the `domain_userid` field. Typically used to link native tracking to in-app browser events tracked using the javascript Normally one would retrieve the domain userid from the browser and pass it to the app. Should contain a valid UUID4 string.

### Tracking Methods

#### Screen View Tracking

Track a screen view with the `trackScreenViewEvent()` method. Screen view events will auotomatically be populated with a screen view ID (UUID4), which increments each time a new screen view event fires. This id is also attached to the screen view context if enabled, which enables users to tie screen view events to all other events which happen on the screen, and to aggregate data per screen view.

```typescript
tracker.trackScreenViewEvent({
  screenName: 'my-screen',
  screenType: 'my-type',
  transitionType: 'my-transition'
});
```

**Required properties**

- `screenName`: (string) – Developer-defined screen name.

**Optional properties**

- `screenType`: (string) – Developer-defined screen type.
- `transitionType`: (string) – Developer-defined transition type.

To attach custom contexts, pass a second argument to the function, containing an array of self-describing JSON.

```typescript
tracker.trackScreenViewEvent(
  {screenName: 'myScreenName'},
  [{
    schema: 'iglu:com.acme/example_entity/jsonschema/1-0-0',
    data: {someExampleField: 'Foo Bar Baz'}
  }]
);
```

#### Custom event tracking

Track Custom events using the `trackSelfDescribingEvent()` method.

```typescript
tracker.trackSelfDescribingEvent({
  schema: 'iglu:com.acme/example/jsonschema/1-0-0',
  data: {someExampleField: 'Hello World'}
});
```

**Required properties**:

- `schema`: (string) – A valid Iglu schema path. This must point to the location of the custom event’s schema, of the format: `iglu:{vendor}/{name}/{format}/{version}`.
- `data`: (object) – The custom data for your event. This data must conform to the schema specified in the `schema` argument, or the event will fail validation and become a [failed event](/docs/fundamentals/failed-events/index.md).

To attach custom contexts, pass a second argument to the function, containing an array of self-describing JSON.

```typescript
tracker.trackSelfDescribingEvent(
  {
    schema: 'iglu:com.acme/example_event/jsonschema/1-0-0',
    data: {someExampleField: 'Hello World'}
  },
  [{
    schema: 'iglu:com.acme/example_entity/jsonschema/1-0-0',
    data: {someOtherExampleField: 'Foo Bar Baz'}
  }]
);
```

#### Structured event tracking

Track a structured event with the `trackStructuredEvent()` method.

```typescript
tracker.trackStructuredEvent({
  category: 'my-category',
  action: 'my-action',
  label: 'my-label',
  property: 'my-property',
  value: 50.00
});
```

**Required properties**

- `category`: (string) – Structured event category.
- `action`: (string) – Structured event action.

**Optional properties**

- `label`: (string) – Structured event label.
- `property`: (string) – Structured event property.
- `value`: (number) – Structured event value.

To attach custom contexts, pass a second argument to the function, containing an array of self-describing JSON.

```typescript
tracker.trackStructuredEvent(
  {
    category: 'my-category',
    action: 'my-action',
    label: 'my-label',
    property: 'my-property',
    value: 50.00
  },
  [{
    schema: 'iglu:com.acme/example_entity/jsonschema/1-0-0',
    data: {someOtherExampleField: 'Foo Bar Baz'}
  }]
);
```

#### Page View Tracking

Track a page view event with the `trackPageViewEvent()` method. Typically this is uncommon in apps, but is sometimes used where fitting data into an existing page views model is required. To track page views from an in-app browser, it is advisable to use the javascript tracker in-browser.

```typescript
tracker.trackPageViewEvent({
  pageUrl: 'https://my-url.com',
  pageTitle: 'My page title',
  pageReferrer: 'http://some-other-url.com'
});
```

**Required properties**

- `pageUrl`: (string) – Page Url for the page view event. Must be a vaild url.

**Optional properties**

- `pageTitle`: (string) – Page Title for the page view event.
- `pageReferrer`: (string) – Url for the referring page to the page view event. Must be a vaild url.

## Data Modeling

### Important features for Data Modeling

For most use cases, the recommended setup is to enable at least the session context, screen context, and platform context. These will enable most of the common information in modeling mobile events in a standard way.

```typescript
createTracker('my-namespace', {
  endpoint: 'my-endpoint.com',
  appId: 'my-app-id',
  platformContext: true,
  screenContext: true,
  sessionContext: true
});
```

#### User identification

The session context contains a UUID format userid, which is generated on app install. This can be used to easily identify individual installations of the app. If it is necessary to handle cases where users share an app, or uninstall/reinstall an app, this ID should be supplemented with additional logic.

The `setSubjectData()` method offers the ability to set or unset a custom userid. This is typically used to track logged in users, and can be used to handle cases of multiple users. Normally this self-identified user id is treated as the primary identifier, and modeling logic stitches across the other ids to give this one priority.

The platform context will contain the device and advertising identifiers, if the app has permission to track this.

Where an app contains an embedded browser, typically in-app events are tracked using the Javascript tracker, and cookie values are passed to the application. The `setSubjectData()` method offers the ability to set these fields.

#### Aggregation

To follow a similar model of aggregation to that of a web model, one can:

- aggregate to screen view level using the screen view ID from the screen view context
- aggregate to the session level the session id from the client session context
- aggregate to a user level the user_id from the client session context.

The screen view and session context is attached to all events and so these can be used to attribute events to their screen views and sessions.

These contexts also contain identifiers for the previous screens and sessions, to facilitate easier user journey mapping.

The session context contains the first event id for the session in order to make it easier to identify the start time for a given session.

See also the official [Snowplow mobile data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/legacy/dbt-mobile-data-model/index.md)!
