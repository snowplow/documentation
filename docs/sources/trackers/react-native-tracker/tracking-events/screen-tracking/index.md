---
title: "Tracking screen views with the React Native tracker"
sidebar_label: "Screen views"
sidebar_position: 40
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Screen view tracking captures screen changes within the app.

To track a ScreenViewEvent, use the `trackScreenViewEvent` tracker method [as explained here](/docs/sources/trackers/react-native-tracker/tracking-events/index.md#tracking-screen-view-events). For example:

```typescript
tracker.trackScreenViewEvent({
    name: 'my-screen-name',
    id: '5d79770b-015b-4af8-8c91-b2ed6faf4b1e',
    type: 'carousel',
    transitionType: 'basic'
});
```

## Tracking screen views in React Navigation

If you are using the [React Navigation](https://reactnavigation.org/) library for navigation in your app, you can implement automatic screen view tracking by adding a callback to your `NavigationContainer`.
The steps are explained [in the documentation for React Navigation](https://reactnavigation.org/docs/screen-tracking/).

## Tracking screen views in React Native Navigation

When using the [React Native Navigation](https://wix.github.io/react-native-navigation/docs/before-you-start/) library for navigation in your app, you can automatically track screen views by registering a listener when your component appears on screen.
Use the `Navigation.events().registerComponentDidAppearListener` callback to subscribe the listener and track screen views as [documented here](https://wix.github.io/react-native-navigation/api/events/#componentdidappear).

## Screen context entity

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    screenContext: true, // enabled by default
});
```

If the `screenContext` property is enabled, the tracker attaches a [`Screen` entity](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event.

## Screen engagement tracking

```typescript
const tracker = await newTracker({
    namespace: 'appTracker',
    endpoint: COLLECTOR_URL,
    screenEngagementAutotracking: true, // enabled by default
});
```

Screen engagement tracking is a feature that enables tracking the user activity on the screen.
This consists of the time spent and the amount of content viewed on the screen.

Concretely, it consists of the following metrics:

1. Time spent on screen while the app was in foreground (tracked automatically).
2. Time spent on screen while the app was in background (tracked automatically).
3. Number of list items scrolled out of all list items (requires some manual tracking).
4. Scroll depth in pixels (requires some manual tracking).

This information is attached using a [`screen_summary` context entity](/docs/events/ootb-data/page-activity-tracking/index.md#screen-summary-entity) to the following events:

1. [`screen_end` event](/docs/events/ootb-data/page-activity-tracking/index.md#screen-end-event) that is automatically tracked before a new screen view event.
2. [`application_background` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event).
3. [`application_foreground` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event).

Screen engagement tracking is enabled by default, but can be configured using the `TrackerConfiguration.screenEngagementAutotracking` option.

For a demo of how mobile screen engagement tracking works in action, **[please visit this demo](https://snowplow-incubator.github.io/mobile-screen-engagement-demo/)**.

#### Updating list item view and scroll depth information

To update the list item viewed and scroll depth information tracked in the screen summary entity, you can track the `ListItemView` and `ScrollChanged` events with this information.
When tracked, the tracker won't send these events individually to the collector, but will process the information into the next `screen_summary` entity and discard the events.
You may want to track the events every time a new list item is viewed on the screen, or whenever the scroll position changes.

To update the list items viewed information:

```js
tracker.trackListItemViewEvent({
    index: 1,
    itemsCount: 10,
});
```

To update the scroll depth information:

```js
tracker.trackScrollChangedEvent({
    yOffset: 10,
    xOffset: 20,
    viewHeight: 100,
    viewWidth: 200,
    contentHeight: 300,
    contentWidth: 400,
});
```
