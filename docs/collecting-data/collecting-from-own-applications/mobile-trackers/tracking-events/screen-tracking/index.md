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

- The tracker automatically tracks each screen change using a [`ScreenView` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_screen_view.html).
- If the `TrackerConfiguration.screenContext` property is enabled, the tracker attaches a [`Screen` entity](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event, even if it was manually tracked and the app is in a different screen.

Indeed, disabling the `screenViewAutotracking` only, the tracker can still attach `Screen` entities automatically based only to the manual tracking of `ScreenView` events, and vice versa.
