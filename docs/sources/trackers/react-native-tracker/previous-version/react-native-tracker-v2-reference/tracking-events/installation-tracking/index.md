---
title: "Installation tracking"
description: "Track app installation events in React Native v2 tracker for user acquisition analytics."
schema: "TechArticle"
keywords: ["React Native Installation", "App Installation", "Install Tracking", "First Launch", "Mobile Install", "Installation Events"]
sidebar_position: 60
---

# Installation tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Installation tracking tracks an install event which occurs the first time an application is opened. The tracker will record when it's first been installed, so deleting and reinstalling an app will trigger another install event.

If installation autotracking is not enabled, the tracker will still keep track of when the app was first installed, so that when enabled, the tracker will send the recorded install event with a timestamp reflecting when it was first installed.

The installation autotracking is enabled by default. It can be set in `TrackerConfiguration` like in the example below:

```typescript
const tracker = createTracker(
    'appTracker',
    {
      endpoint: COLLECTOR_URL,
    },
    {
        trackerConfig: {
            installAutotracking: true,
        },
    }
);
```
