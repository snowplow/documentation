---
title: "isionOS tracking"
sidebar_position: 110
---

# visionOS tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```
:::note
Snowplow visionOS tracking was added in version 6.0.0.
:::

The Snowplow iOS tracker supports tracking within visionOS apps. All the usual events, including screen views, can be tracked as for any SwiftUI app. We've also provided additional events and entities to help you understand your visionOS users.

The immersive space context entity can be semi-automatically added to all events.

## visionOS events

The events are: `OpenWindowEvent`, `DismissWindowEvent`, `OpenImmersiveSpaceEvent`, and `DismissImmersiveSpaceEvent`.

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
*Schema:*
`iglu:com.apple.swiftui/open_window/jsonschema/1-0-0`.

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

*Schema:*
`iglu:com.apple.swiftui/dismiss_window/jsonschema/1-0-0`.

Determining which events occurred in which window group can be done during modelling using these two event types and timestamps. You could also manually add a window group context entity to tracked events.

In this example, a window group entity is added to an [Ecommerce](docs/collecting-data/collecting-from-own-applications/mobile-trackers/tracking-events/ecommerce-tracking/index.md) `ProductViewEvent`.

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

Read more about customized tracking [here](docs/collecting-data/collecting-from-own-applications/mobile-trackers/custom-tracking-using-schemas/index.md).

### Immersive space events

Use the `OpenImmersiveSpaceEvent` and `DismissImmersiveSpaceEvent` to automatically add an immersive space context entity to all events occurring within an immersive space. The entity will identify the immersive space in which the events occurred. This feature is off by default.

```swift
let tracker = Snowplow.createTracker(
  namespace: "appTracker", 
  endpoint: "https://snowplow-collector-url.com"
) {
  // configure the automatic immersive space context entity
  TrackerConfiguration().immersiveSpaceContext(true)
}

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

*Schemas:*
`iglu:com.apple.swiftui/open_immersive_space/jsonschema/1-0-0` and 
`iglu:com.apple.swiftui/dismiss_immersive_space/jsonschema/1-0-0`.

If the immersive space entity autotracking is off (default), the `Open` and `Dismiss` events can still be tracked. However, only the `OpenImmersiveSpaceEvent` will have the entity. The events themselves have no properties.

The visionOS methods `openImmersiveSpace` and `dismissImmersiveSpace` are asynchronous. We advise that you write your tracking code such that the Snowplow immersive space events await those methods' completion, for accurate tracking.

## visionOS entities

### Window group entity

The window group entity contains information about the window group that the tracked event occurred in.

<details>
    <summary>Window group entity properties</summary>

| Request Key | Required | Type/Format | Description                                                       |
|-------------|----------|-------------|-------------------------------------------------------------------|
| id          | Y        | string      | Uniquely identifies the window group.                             |
| windowId    | N        | string uuid | UUID for the current window within the group.                     |
| titleKey    | N        | string enum | The window's title in system menus and in the window's title bar. |
| windowStyle | N        | string enum | The appearance and interaction style of a window.                 |

</details>

*Schema:*
`iglu:com.apple.swiftui/window_group/jsonschema/1-0-0`.

### Immersive space entity

The immersive space entity contains information about the immersive space that the tracked event occurred in.

<details>
    <summary>Immersive space entity properties</summary>

| Request Key         | Required | Type/Format | Description                                                      |
|---------------------|----------|-------------|------------------------------------------------------------------|
| id                  | Y        | string      | The immersive space ID.                                          |
| viewId              | N        | string uuid | UUID for the view of the immersive space.                        |
| immersionStyle      | N        | string enum | Immersive space style.                                           |
| upperLimbVisibility | N        | string enum | Preferred visibility of the user's upper limbs within the space. |

</details>

*Schema:*
`iglu:com.apple.swiftui/immersive_space/jsonschema/1-0-0`.
