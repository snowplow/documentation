---
title: "Tracking visionOS events with the iOS tracker"
sidebar_label: "visionOS"
sidebar_position: 110
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::note
Snowplow visionOS tracking was added in version 6.0.0.
:::

The Snowplow iOS tracker supports tracking within visionOS apps. All the usual events, including screen views, can be tracked as for any SwiftUI app. We've also provided additional events and entities to help you understand your visionOS users.

The immersive space context entity is semi-automatically added to all events.

The events are: `OpenWindowEvent`, `DismissWindowEvent`, `OpenImmersiveSpaceEvent`, and `DismissImmersiveSpaceEvent`. Find the schema details for the events and entities [here](/docs/events/ootb-data/visionos-swiftui/index.md).

### Window events

Track the opening and dismissing of SwiftUI window groups using `OpenWindowEvent` and `DismissWindowEvent`. These events can be used in any SwiftUI app, not just visionOS. The event data is sent as a window group context entity (see below) attached to these events; the events themselves have no properties.

#### OpenWindowEvent

```swift
let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com")

let event = OpenWindowEvent(
    id: "group 1", // window group ID
    uuid: UUID(), // optional UUID
    titleKey: "window 1", // optional window title
    windowStyle: WindowStyle.automatic // optional style of the window group
)
tracker.track(event)
```

#### DismissWindowEvent

```swift
let tracker = Snowplow.createTracker(namespace: "appTracker", endpoint: "https://snowplow-collector-url.com")

let event = DismissWindowEvent(
    id: "group 1", // window group ID
    windowId: UUID(), // optional UUID
    titleKey: "window 1", // optional window title
    windowStyle: WindowStyle.automatic // optional style of the window group
)
tracker.track(event)
```

Determining which events occurred in which window group can be done during modelling using these two event types and timestamps. You could also manually add a window group context entity to tracked events.

In this example, a window group entity is added to an [Ecommerce](/docs/sources/mobile-trackers/tracking-events/ecommerce-tracking/index.md) `ProductViewEvent`.

```swift
let product = ProductEntity(
  id: "productId",
  category: "category",
  currency: "GBP",
  price: 100
)
let event = ProductViewEvent(product: product)
let entity = WindowGroupEntity(id: "group_1")
event.entities.append(entity)
```

Read more about customized tracking [here](/docs/sources/mobile-trackers/custom-tracking-using-schemas/index.md).

### Immersive space events

Use the `OpenImmersiveSpaceEvent` and `DismissImmersiveSpaceEvent` to automatically add an immersive space context entity to all events occurring within an immersive space. The entity will identify the immersive space in which the events occurred. This feature is enabled by default.

```swift
let tracker = Snowplow.createTracker(
  namespace: "appTracker",
  endpoint: "https://snowplow-collector-url.com"
)

let event = OpenImmersiveSpaceEvent(
    id: "group 1", // space ID
    viewId: UUID(), // optional UUID
    immersionStyle: ImmersionStyle.automatic, // optional
    upperLimbVisibility: UpperLimbVisibility.hidden // optional
)
// all subsequent events, including this one, will have the immersive space entity
// until DismissImmersiveSpaceEvent is tracked
tracker.track(event)

// the dismiss event will have the entity
// but subsequent events will not
tracker.track(DismissImmersiveSpaceEvent())
```

If the immersive space entity autotracking is turned off, the `Open` and `Dismiss` events can still be tracked. However, only the `OpenImmersiveSpaceEvent` will have the entity. The events themselves have no properties.

The tracker automatically generates a `viewId` each time a new immersive space entity is created. You could also pass in your own UUID.

The visionOS methods `openImmersiveSpace` and `dismissImmersiveSpace` are asynchronous. We advise that you write your tracking code such that the Snowplow immersive space events await those methods' completion, for accurate tracking.
