---
title: "Screen View Tracking"
date: "2023-01-03"
sidebar_position: 40
---

# Screen View Tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Screen view tracking captures screen changes within the app.

<Tabs groupId="platform">
  <TabItem value="ios" label="iOS" default>

## Screen View Tracking in UIKit

The screen view tracking for UIKit views is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

```swift
let trackerConfig = TrackerConfiguration()
    .screenViewAutotracking(true)
    .screenContext(true)
```

Using method swizzling in the `ViewController` class, the tracker automatically detects when screens are loaded and tracks events that include information about the current and previous view controllers.

## Screen View Tracking in SwiftUI

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
  <TabItem value="android" label="Android">

```java
TrackerConfiguration trackerConfig = new TrackerConfiguration()
    .screenViewAutotracking(true)
    .screenContext(true);
```

  </TabItem>
</Tabs>

The configuration is composed by two settings:

- `screenViewAutotracking`: the tracker automatically tracks each screen change (triggered by `viewDidAppear` in a `ViewController`) using a [`ScreenView` event](https://docs.snowplow.io/snowplow-android-tracker/classcom_1_1snowplowanalytics_1_1snowplow_1_1event_1_1_screen_view.html).
- `screenContext`: the tracker attaches a [`Screen` entity](http://iglucentral.com/schemas/com.snowplowanalytics.mobile/screen/jsonschema/1-0-0) to all the events tracked by the tracker reporting the last (and probably current) screen visible on device when the event was tracked.

The `Screen` entity is conditioned by the internal state of the tracker only. To make an example, if the developer manually tracks a `ScreenView` event, all the following events will have a `Screen` entity attached reporting the same information as the last tracked ScreenView event, even if it was manually tracked and the app is in a different screen.

Indeed, disabling the `screenViewAutotracking` only, the tracker can still attach `Screen` entities automatically based only to the manual tracking of `ScreenView` events, and vice versa.
