---
title: "App lifecycle tracking"
sidebar_label: "App lifecycle tracking"
date: "2021-08-06"
sidebar_position: 30
description: "Automatically track foreground and background transitions with React Native tracker v2 lifecycle events and lifecycle context entities."
keywords: ["react native tracker v2 lifecycle tracking", "foreground background events", "app state tracking"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The tracker can capture application lifecycle state changes. In particular, when the app changes state from foreground to background and vice versa.

The lifecycle tracking is disabled by default. It can be enabled in `TrackerConfiguration` like in the example below:

```typescript
const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
    {
        trackerConfig: {
            lifecycleAutotracking: true,
        },
    }
);
```

Once enabled, the tracker will automatically track a [`Background` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#background-event) when the app is moved to background and a [`Foreground` event](/docs/events/ootb-data/mobile-lifecycle-events/index.md#foreground-event) when the app moves back to foreground (becomes visible in the screen).

The tracker attaches a [`LifecycleEntity`](/docs/events/ootb-data/mobile-lifecycle-events/index.md#lifecycle-context-entity) to all the events tracked by the tracker reporting if the app was visible (foreground state) when the event was tracked.

The `LifecycleEntity` value is conditioned by the internal state of the tracker only. To make an example, if the app is in foreground state but the developer tracks a `Background` event intentionally, it would force the generation of a `LifecycleEntity` that mark the app as non visible, even if it's actually visible in the device.
