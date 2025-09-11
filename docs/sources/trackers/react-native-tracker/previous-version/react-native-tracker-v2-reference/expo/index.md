---
title: "Support for Expo"
description: "Integrate Snowplow React Native v2 tracker with Expo for managed mobile app behavioral analytics."
schema: "TechArticle"
keywords: ["React Native Expo", "Expo Integration", "Expo Setup", "Cross Platform", "Mobile Development", "Expo Analytics"]
date: "2022-02-03"
sidebar_position: 35
---

# Support for the Expo framework

The React Native tracker supports the [Expo framework](https://expo.dev/). However, the support is different for the bare and the managed workflow.

You may install the tracker using:

```sh
npx expo install @snowplow/react-native-tracker
```

## Expo bare workflow

The tracker works without limitations on the bare workflow. Since the tracker is able to run iOS and Android native code using the mobile trackers, it provides the full functionality of the React Native tracker.

Make sure to rebuild your app after installing the tracker.

## Expo managed workflow and Expo Go

:::note
Support for Expo Go is available only since version 1.4 of the React Native tracker.
:::

The functionality of the tracker is limited on the managed workflow. This is because the tracker is unable to run native iOS and Android code of the mobile trackers that it builds on. However, basic functionality is provided through a JavaScript-only implementation.

The following functionality is available:

- Manual tracking of all events using the tracker APIs (e.g., using the `trackScreenView()` function).
- Adding context entities to manually tracked events.
- Setting Subject properties to add information to events.
- Having multiple tracker instances with different configuration in the app.

The tracker is missing more advanced features such as:

- Session tracking
    - The tracker does not automatically add the client session context entity to events currently. However, you may track the session yourself and add it as a custom context entity with the [`client_session` schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/client_session/jsonschema/1-0-2) to tracked events.
- Auto tracking features
    - Features like install auto-tracking that track events automatically are not available.
    - Also the tracker doesn't persist the screen state, which means that the [`screen` context entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) is not automatically added to tracked events.
- No support for batching multiple events in POST requests from the emitter – events are sent one per request as soon as they are tracked.
- The Global Contexts feature is not implemented.
