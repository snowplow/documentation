---
title: "Screen view tracking"
sidebar_position: 40
---

# Screen view tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Screen view tracking captures screen changes within the app.

## Tracking screen views in React Navigation

If you are using the [React Navigation](https://reactnavigation.org/) library for navigation in your app, you can implement automatic screen view tracking by adding a callback to your `NavigationContainer`.
The steps are explained [in the documentation for React Navigation](https://reactnavigation.org/docs/screen-tracking/).

## Tracking screen views in React Native Navigation

When using the [React Native Navigation](https://wix.github.io/react-native-navigation/docs/before-you-start/) library for navigation in your app, you can automatically track screen views by registering a listener when your component appears on screen.
Use the `Navigation.events().registerComponentDidAppearListener` callback to subscribe the listener and track screen views as [documented here](https://wix.github.io/react-native-navigation/api/events/#componentdidappear).


## Tracking screen views in iOS UIKit and Android Activity views

The screen view tracking for UIKit views is disabled by default. It can be set in `TrackerConfiguration` like in the example below:

```typescript
const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
    {
        trackerConfig: {
            screenViewAutotracking: true,
        },
    }
);
```

Using method swizzling in the `ViewController` class, the tracker automatically detects when screens are loaded (triggered by viewDidAppear in a ViewController) and tracks events that include information about the current and previous view controllers.

Using the Android `Application.ActivityLifecycleCallbacks` interface, the tracker automatically detects when Activities are loaded and tracks events that include information about the current and previous Activity.

## Screen view event and screen context entity

Automatic screen view tracking tracks two pieces of information:

- The tracker automatically tracks each screen change using a `ScreenView` event.
- If the `TrackerConfiguration.screenContext` property is enabled, the tracker attaches a [`Screen` entity](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event, even if it was manually tracked and the app is in a different screen.

Indeed, disabling the `screenViewAutotracking` only, the tracker can still attach `Screen` entities automatically based only to the manual tracking of `ScreenView` events, and vice versa.
