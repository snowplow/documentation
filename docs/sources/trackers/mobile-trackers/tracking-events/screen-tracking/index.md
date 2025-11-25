---
title: "Tracking screen views and engagement with the native mobile trackers"
sidebar_label: "Screen view and engagement"
sidebar_position: 40
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Screen view tracking captures screen changes within the app.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

## Screen View Tracking in UIKit

The screen view tracking for UIKit views is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

```swift
let trackerConfig = TrackerConfiguration()
    .screenViewAutotracking(true)
    .screenContext(true)
```

Using method swizzling in the `ViewController` class, the tracker automatically detects when screens are loaded (triggered by viewDidAppear in a ViewController) and tracks events that include information about the current and previous view controllers.

## Screen View tracking in SwiftUI

The tracker is able to track screen view events when selected view components appear in the SwiftUI lifecycle.
To provide this functionality, it implements an extension over the `View` component which lets you annotate the components the events should be tracked for using the `snowplowScreen()` function:

```swift
import SwiftUI

struct ProductList: View {
    var body: some View {
        List {
            ...
        }
        .snowplowScreen(name: "ProductList") // this will ensure that screen view events are tracked for this view
    }
}
```

You can provide additional context entities to be tracked with the screen view events and also choose the tracker namespace to use:

```swift
import SwiftUI

struct ProductDetail: View {
    var product: Product

    var body: some View {
        List {
            ...
        }
        .snowplowScreen(
            name: "ProductDetail",
            entities: [ // list of context entities attached to the events
                (
                    schema: "iglu:com.acme_company/example/jsonschema/2-1-1",
                    data: [ "name": product.name ]
                )
            ],
            trackerNamespace: "ns" // namespace of tracker to track the event with
        )
    }
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

## Screen View tracking in traditional Activity-based apps

The screen view tracking for Activities (screens) is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .screenViewAutotracking(true)
    .screenContext(true)
```

Using the Android `Application.ActivityLifecycleCallbacks` interface, the tracker automatically detects when Activities are loaded and tracks events that include information about the current and previous Activity.

## Screen View tracking in Jetpack Compose apps

Apps built with Jetpack Compose are constructed from Composable functions rather than Activities, and so the built-in ScreenViewAutotracking will not work.

One possibility for an equivalent functionality is to add a navigation listener, which can track a screen view for each new destination.


```kotlin
fun autoTrackScreenView(navController: NavController) {
    navController.addOnDestinationChangedListener { _, destination, _ ->
        Snowplow.defaultTracker?.track(ScreenView(destination.route ?: "null"))
    }
}
```
Try out this example in the Compose demo inside the [Android codebase](https://github.com/snowplow/snowplow-android-tracker).

Depending how your app is configured, this listener may result in a `ScreenView` being tracked when the app returns from background. This is not how the tracker is intended to work; our screen engagement feature tracks the time spent on a screen whether in foreground or background. If you are experiencing this extra `ScreenView` (and `ScreenEnd`) being tracked, consider adding a check to the listener callback.

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

## Screen View tracking in traditional Activity-based apps

The screen view tracking for Activities (screens) is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .screenViewAutotracking(true)
    .screenContext(true);
```


Using the Android `Application.ActivityLifecycleCallbacks` interface, the tracker automatically detects when Activities are loaded and tracks events that include information about the current and previous Activity.

  </TabItem>
</Tabs>

## Screen view event and screen context entity

Automatic screen view tracking tracks two pieces of information:

- The tracker automatically tracks each screen change using a [`ScreenView` event](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-view-events).
- If the `TrackerConfiguration.screenContext` property is enabled, the tracker attaches a [`Screen` entity](/docs/events/ootb-data/page-and-screen-view-events/index.md#screen-view-events) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event, even if it was manually tracked and the app is in a different screen.

Indeed, disabling the `screenViewAutotracking` only, the tracker can still attach `Screen` entities automatically based only to the manual tracking of `ScreenView` events, and vice versa.

## Screen engagement tracking

:::note Available since version 6
This feature has been added in the version 6.0.0 of the iOS and Android trackers.
:::

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

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let trackerConfig = TrackerConfiguration()
    .screenEngagementAutotracking(true)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kotlin
val trackerConfig = TrackerConfiguration("appId")
    .screenEngagementAutotracking(true)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration("appId")
    .screenEngagementAutotracking(true);
```

  </TabItem>
</Tabs>

### Screen time

Screen time is tracked automatically by the tracker based on the screen view events.

Additionally, the tracker makes use of `application_background` and `application_foreground` events to distinguish between screen time in foreground (`foreground_sec` property in `screen_summary` entity) and screen time in background (`background_sec` property).
Make sure that lifecycle autotracking is enabled (it is by default) in order for the tracker to be able to distinguish between these two states.

The foreground time is translated into the engaged time during modeling with the unified dbt package (see below).
Foreground and background time together result in the absolute time on screen.

### List item view tracking

Part of screen engagement is tracking how much users saw on the screen.
There are two ways that this information can be tracked:

1. By the number of items in a list viewed on the screen.
2. By the scroll depth on the screen in pixels.

The first approach assumes that there is a single list displayed on the screen, ideally with items of the same size.
In this scenario, the track can track the index of the last viewed item and the total count of all items.

To provide the tracker with the information that a new list item was viewed by a user, the app will track a `ListItemView` event.
Although it is tracked as an event, the tracker won't send it individually to the collector (as long as `screenEngagementAutotracking` is enabled) but will process the information into the next `screen_summary` entity and discard the list item view event.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ListItemView(
    index: 1, // Index of the item in the list.
    totalItems: 10 // Total number of items in the list.
)
Snowplow.defaultTracker()?.track(event)
```

#### Using the `snowplowListItem` modifier in SwiftUI

If you are using SwiftUI in your app, you can use the `snowplowListItem` view modifier to automatically track list item views.
Annotating the items in your list will ensure that they are tracked as they become visible.

```swift
import SwiftUI

struct ProductList: View {
    var products: [Product]

    var body: some View {
        List {
            ForEach(Array(products.enumerated()), id: \.1.url) { offset, product in
                NavigationLink {
                    ProductDetail(url: product)
                } label: {
                    ...
                }
                .snowplowListItem(index: offset, itemsCount: products.count) // will track the ListItemView event automatically
            }
        }
        .snowplowScreen(...)
    }
}
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kt
val event = ListItemView(
    index = 10, // Index of the item in the list.
    itemsCount = 100 // Total number of items in the list.
)
Snowplow.defaultTracker?.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ListItemView event = new ListItemView(
    10, // Index of the item in the list.
    100 // Total number of items in the list.
);
Snowplow.defaultTracker.track(event);
```

  </TabItem>
</Tabs>

### Scroll depth tracking

The second approach for tracking how much users saw on the screen is to track the scroll depth in pixels.
This may be useful in case you have a single scroll view on the screen which can be scrolled horizontally, vertically or in both directions.

To give the tracker the information of the scroll depth, one can use the `ScrollChanged` event.
Similarly like in the `ListItemView` event, this event won't be send to the collector as an individual event (as long as `screenEngagementAutotracking` is enabled) but will be processed into the `screen_summary` entity tracked with the next lifecycle or screen end event.

The `ScrollChanged` event contains information about the scroll offset as well as the content size (size of the content shown in the scroll view) and the dimensions of the scroll view on the screen.
To track the event in UIKit on iOS, for instance, you can make use of the `scrollViewDidEndDecelerating` and `scrollViewDidEndDragging` callbacks in `UIScrollViewDelegate`.

<Tabs groupId="platform" queryString>
  <TabItem value="ios" label="iOS" default>

```swift
let event = ScrollChanged(xOffset: 15, yOffset: 30, viewWidth: 15, viewHeight: 20, contentWidth: 200, contentHeight: 100)
Snowplow.defaultTracker()?.track(event)
```

  </TabItem>
  <TabItem value="android" label="Android (Kotlin)">

```kt
val event = ScrollChanged(
    xOffset = 15, // Horizontal scroll offset in pixels.
    yOffset = 30, // Vertical scroll offset in pixels.
    viewWidth = 15, // Width of the scroll view in pixels.
    viewHeight = 20, // Height of the scroll view in pixels.
    contentWidth = 150, // Height of the content of the scroll view in pixels
    contentHeight = 100 // Width of the content of the scroll view in pixels
)
Snowplow.defaultTracker?.track(event)
```

  </TabItem>
  <TabItem value="android-java" label="Android (Java)">

```java
ScrollChanged event = new ScrollChanged();
event.setXOffset(15); // Horizontal scroll offset in pixels.
event.setYOffset(10); // Vertical scroll offset in pixels.
event.setViewHeight(20); // Height of the scroll view in pixels.
event.setViewWidth(30); // Width of the scroll view in pixels.
event.setContentHeight(100); // Height of the content of the scroll view in pixels
event.setContentWidth(150); // Width of the content of the scroll view in pixels
Snowplow.defaultTracker.track(event);
```

  </TabItem>
</Tabs>

### Modeled data using the Snowplow Unified dbt package

Starting with version 0.2.0, the [Snowplow Unified Package](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) will process the screen engagement information in the `screen_summary` entity to provide the following metrics:

1. In the `snowplow_unified_views` derived table:
    * `engaged_time_in_s` will contain the screen foreground time.
    * `absolute_time_in_s` will contain the screen foreground + background time.
    * `last_list_item_index`, `list_items_count`, and `list_items_percentage_scrolled` will contain information about the number of viewed items in a list.
    * `horizontal_pixels_scrolled`, `vertical_pixels_scrolled`, `horizontal_percentage_scrolled`, `horizontal_percentage_scrolled` will contain information about the scroll depth in pixels.
2. In the `snowplow_unified_sessions` derived table:
    * `engaged_time_in_s` will contain the screen foreground time.
    * `absolute_time_in_s` will contain the screen foreground + background time.
3. In the `snowplow_unified_users` derived table:
    * `engaged_time_in_s` will contain the screen foreground time.
    * `absolute_time_in_s` will contain the screen foreground + background time.
